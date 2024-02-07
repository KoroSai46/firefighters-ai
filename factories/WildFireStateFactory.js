//FireStation factory
const {WildFireState} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');

class WildFireStateFactory extends BaseFactory {
    constructor() {
        super(WildFireState);
    }
}

module.exports = new WildFireStateFactory();