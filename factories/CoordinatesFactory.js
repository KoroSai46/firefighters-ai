//FireStation factory
const {Coordinates} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');

class CoordinatesFactory extends BaseFactory {
    constructor() {
        super(Coordinates);
    }
}

module.exports = new CoordinatesFactory();