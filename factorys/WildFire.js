//FireStation factory
const {WildFire} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');

class WildFireFactory extends BaseFactory {
    constructor() {
        super(WildFire);
    }
}

module.exports = new WildFireFactory();