const {Fleet} = require('../models/models');
const BaseRepository = require("./BaseRepository");

class FleetRepository extends BaseRepository {
    constructor() {
        super(Fleet);
    }
}

const fleetRepositoryInstance = new FleetRepository();

module.exports = fleetRepositoryInstance;