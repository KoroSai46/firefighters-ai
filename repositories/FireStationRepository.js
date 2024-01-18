const {FireStation} = require('../models/models');
const helpers = require('./helpers');

class FireStationRepository {

    static async findAll(req) {
        return await helpers.findAllGeneric(FireStation, req);
    }

    static async findById(id) {
        return await FireStation.findByPk(id);
    }

    static async create(fireStation) {
        return await FireStation.create(fireStation);
    }

    static async update(fireStation) {
        return await fireStation.save();
    }

    static async delete(fireStation) {
        return await fireStation.destroy();
    }

    static async deleteById(id) {
        return await FireStation.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = FireStationRepository;