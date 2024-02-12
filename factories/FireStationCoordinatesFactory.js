//FireStation factory
const {FireStationCoordinates} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');

class FireStationCoordinatesFactory extends BaseFactory {
    constructor() {
        super(FireStationCoordinates);
    }
}

module.exports = new FireStationCoordinatesFactory();