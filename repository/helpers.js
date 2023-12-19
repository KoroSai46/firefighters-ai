const possibleQueryParams = [
    's',
    'page',
    'limit',
    'sort',
    'order',
    'date',
    'dateStart',
    'dateStart'
]

const {Op} = require('sequelize');

async function findAllGeneric(model, req) {
    const {s, limit, page, order, sort, date, dateStart, dateEnd} = getQueryParams(req);

    // Construire l'objet de filtre
    const where = {};

    if (s) {
        // Ajouter une condition LIKE pour la recherche
        where[Op.or] = Object.keys(model.rawAttributes).map(attribute => ({
            [attribute]: {
                [Op.like]: `%${s}%`,
            },
        }));
    }

    if (date) {
        where.createdAt = {
            [Op.gte]: date,
            [Op.lte]: new Date(date).setDate(new Date(date).getDate() + 1)
        };
    }

    if (dateStart || dateEnd) {
        where.createdAt = {};
        if (dateStart) {
            where.createdAt[Op.gte] = dateStart;
        }
        if (dateEnd) {
            where.createdAt[Op.lte] = dateEnd;
        }
    }

    // Construire l'objet d'options pour la requête
    const queryOptions = {
        where,
        limit: limit || 10,
        offset: (page - 1) * limit || 0,
    };

    // Ajouter l'ordre si spécifié
    if (order && sort) {
        queryOptions.order = [[order, sort]];
    }

    const results = await model.findAll(queryOptions);
    const total = await model.count(queryOptions);


    return {
        results,
        queries: generateQueries(req, total, limit, page)
    };
}

const generateQueries = (req, total, limit, page) => {
    const totalPages = Math.ceil(total / (limit || 10));
    const currentPage = page || 1;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    let nextPage = null;
    let previousPage = null;
    const currentFullUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    if (hasNextPage) {
        //copy current url
        const nextPageUrl = new URL(currentFullUrl);
        //set page param
        nextPageUrl.searchParams.set('page', (currentPage + 1).toString());
        nextPage = nextPageUrl.toString();
    }

    if (hasPreviousPage) {
        //copy current url
        const previousPageUrl = new URL(currentFullUrl);
        //set page param
        previousPageUrl.searchParams.set('page', (currentPage - 1).toString());
        previousPage = previousPageUrl.toString();
    }

    return {
        total,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
    };
}

const getQueryParams = (req) => {
    const queryParams = req.params;
    const params = {};
    for (const key in queryParams) {
        if (possibleQueryParams.includes(key)) {
            params[key] = queryParams[key];
        }
    }
    return params;
}

module.exports = {
    findAllGeneric,
    getQueryParams
}