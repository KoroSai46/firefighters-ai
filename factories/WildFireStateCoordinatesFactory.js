//FireStation factory
const {Coordinates, WildFireStateCoordinates} = require('../models/models');
const sequelize = require('../database');
const CoordinatesFactory = require('./CoordinatesFactory');
const BaseFactory = require('./BaseFactory');

class WildFireStateCoordinatesFactory extends BaseFactory {
    constructor() {
        super(WildFireStateCoordinates);
    }

    async create(coordinates, wildFireState) {
        const {latitude, longitude, timestamp} = coordinates;
        const coordinatesInstance = await CoordinatesFactory.create({latitude, longitude, timestamp});

        return await super.create({
            wildfireStateId: wildFireState.id,
            coordinatesId: coordinatesInstance.id,
            timestamp
        });
    }
}

module.exports = new WildFireStateCoordinatesFactory();