//FireStation factory
const {Coordinates} = require('../models/models');
const sequelize = require('../database');
const BaseFactory = require('./BaseFactory');
const {faker} = require('@faker-js/faker');

class CoordinatesFactory extends BaseFactory {
    constructor() {
        super(Coordinates);
    }

    async createFrenchCoordinates() {
        const turf = require('@turf/turf');
        const franceGeoJSON = require('../data/france.geo.json');
        const franceArea = turf.area(franceGeoJSON);
        const franceZone = turf.area(franceGeoJSON);

        let point;
        do {
            // Générer un point aléatoire dans un rectangle enveloppant la France
            const bbox = turf.bbox(franceGeoJSON);
            const randomPoint = turf.randomPoint(1, {bbox: bbox});
            point = randomPoint.features[0];
        } while (!turf.booleanPointInPolygon(point, franceGeoJSON));

        let coordinate = {
            latitude: point.geometry.coordinates[1],
            longitude: point.geometry.coordinates[0],
            timestamp: new Date()
        };
        return super.create(coordinate);
    }
}

module.exports = new CoordinatesFactory();