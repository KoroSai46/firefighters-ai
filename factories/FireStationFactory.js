//FireStationFactory factory
const {FireStation} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');

class FireStationFactory extends BaseFactory {
    constructor() {
        super(FireStation);
    }
}

module.exports = new FireStationFactory();