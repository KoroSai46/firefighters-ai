//FireStation factory
const {Bot} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');

class BotFactory extends BaseFactory {
    constructor() {
        super(Bot);
    }
}

module.exports = new BotFactory();