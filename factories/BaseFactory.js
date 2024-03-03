class BaseFactory {
    constructor(model) {
        this.model = model;
    }


    async create(params) {
        try {
            return await this.model.create(params);
        } catch (error) {
            console.error('Error creating record:', error);
        }
    }

    async update(id, params) {
        try {
            return await this.model.update(params, {where: {id}});
        } catch (error) {
            console.error('Error updating record:', error);
        }
    }
}

module.exports = BaseFactory;