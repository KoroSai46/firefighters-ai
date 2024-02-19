const {findAllGeneric} = require("./helpers");
const {FireStation} = require("../models/models");


class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    findAll(req) {
        return findAllGeneric(this.model, req);
    }

    findById(id) {
        return this.model.findByPk(id);
    }

    async create(entity) {
        return this.model.create(entity);
    }

    async update(entity) {
        return await entity.save();
    }

    async delete(fireStation) {
        return await fireStation.destroy();
    }

    async deleteById(id) {
        return await this.model.destroy({where: {id}});
    }
}

module.exports = BaseRepository;