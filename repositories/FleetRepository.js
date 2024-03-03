const {Fleet} = require('../models/models');
const BaseRepository = require("./BaseRepository");

class FleetRepository extends BaseRepository {
    constructor() {
        super(Fleet);
    }

    async findByWildFireId(wildFireId) {
        return this.model.findOne({
            where: {
                wildfireId: wildFireId
            }
        });
    }
}

const fleetRepositoryInstance = new FleetRepository();

module.exports = fleetRepositoryInstance;