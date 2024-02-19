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

async function findAllGeneric(model, req, where = {}, {
    noLimit = false,
    withAssoc = true
} = {}) {
    const {s, limit, page, order, sort, date, dateStart, dateEnd} = getQueryParams(req);

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

    let queryOptions = {};

    if (limit === null || noLimit) {
        queryOptions = {
            where,
        };
    } else {
        queryOptions = {
            where,
            limit: limit || 10,
            offset: (page - 1) * limit || 0,
        };
    }

    // Ajouter l'ordre si spécifié
    if (order && sort) {
        queryOptions.order = [[order, sort]];
    }

    // Récuperer les associations
    if (withAssoc && model.associations) {
        let includes = [];
        Object.keys(model.associations).forEach(association => {
            let include = {model: model.associations[association].target};
            //check if association is Coordinates
            includes.push(include);
        });

        queryOptions.include = includes;
    }

    const results = await model.findAll(queryOptions);
    const total = await model.count(queryOptions);


    return {
        results,
        queries: generateQueries(req, total, limit, page)
    };
}

const generateQueries = (req, total, limit, page) => {
    if (limit === null) {
        //no limit
        return {
            total,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPage: null,
            previousPage: null,
        };
    }
    const totalPages = Math.ceil(total / (limit || 10));
    const currentPage = page || 1;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    let nextPage = null;
    let previousPage = null;
    let currentFullUrl = 'http://localhost:3000';

    if (req !== undefined && Object.keys(req).length > 0) {
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
            } else if (queryParam.type === 'boolean') {
                //parse to boolean
                params[queryParam.key] = queryParams[queryParam.key] === 'true';
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