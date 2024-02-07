console.log('import base factory file');

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
}

module.exports = BaseFactory;