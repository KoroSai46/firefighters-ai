//FireStation factory
const {Coordinates} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');
const {faker} = require('@faker-js/faker');

class CoordinatesFactory extends BaseFactory {
    geojson = require('../data/france.geo.json');

    constructor() {
        super(Coordinates);
    }

    async createFrenchCoordinates(withoutSave = false) {
        const turf = require('@turf/turf');
        const franceGeoJSON = this.geojson;

        let point;
        do {
            const bbox = turf.bbox(franceGeoJSON);
            const randomPoint = turf.randomPoint(1, {bbox: bbox});
            point = randomPoint.features[0];
        } while (!turf.booleanPointInPolygon(point, franceGeoJSON));

        let coordinate = {
            latitude: point.geometry.coordinates[1],
            longitude: point.geometry.coordinates[0],
            timestamp: new Date()
        };

        if (withoutSave) {
            return coordinate;
        }

        return super.create(coordinate);
    }
}

module.exports = new CoordinatesFactory();