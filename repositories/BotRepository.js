const {Bot} = require('../models/models');
const helpers = require('./helpers');

class BotRepository {
    static findAll(req) {
        return helpers.findAllGeneric(Bot, req);
    }
}

module.exports = BotRepository;