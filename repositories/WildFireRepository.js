const {WildFire} = require('../models/models');
const BaseRepository = require("./BaseRepository");

class WildFireRepository extends BaseRepository {
    constructor() {
        super(WildFire);
    }
}

const wildFireRepositoryInstance = new WildFireRepository();

module.exports = wildFireRepositoryInstance;