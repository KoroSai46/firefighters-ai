const possibleQueryParams = [
    {
        key: 's',
        default: null,
        type: 'string'
    },
    {
        key: 'limit',
        default: 10,
        type: 'number'
    },
    {
        key: 'page',
        default: 1,
        type: 'number'
    },
    {
        key: 'sort',
        default: 'ASC',
        type: 'string'
    },
    {
        key: 'order',
        default: 'id',
        type: 'string'
    },
    {
        key: 'date',
        default: null,
        type: 'string'
    },
    {
        key: 'dateStart',
        default: null,
        type: 'string'
    },
    {
        key: 'dateEnd',
        default: null,
        type: 'string'
    },
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

    // Récuperer les associations
    if (model.associations) {
        queryOptions.include = Object.keys(model.associations).map((association) => ({model: model.associations[association].target}));
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
    let currentFullUrl = 'http://localhost:3000';

    if (req) {
        currentFullUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    }

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
    const queryParams = req?.query || {};
    const params = {};

    possibleQueryParams.forEach(queryParam => {
        if (queryParams[queryParam.key]) {
            if (queryParam.type === 'number') {
                params[queryParam.key] = parseInt(queryParams[queryParam.key]);
            } else {
                params[queryParam.key] = queryParams[queryParam.key];
            }
        } else {
            params[queryParam.key] = queryParam.default;
        }
    });

    return params;
}

module.exports = {
    findAllGeneric,
    getQueryParams
}