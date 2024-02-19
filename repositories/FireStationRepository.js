const {FireStation} = require('../models/models');
const BaseRepository = require("./BaseRepository");

class FireStationRepository extends BaseRepository {
    constructor() {
        super(FireStation);
    }
}

const fireStationRepositoryInstance = new FireStationRepository();

module.exports = fireStationRepositoryInstance;