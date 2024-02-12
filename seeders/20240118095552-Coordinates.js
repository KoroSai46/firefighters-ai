'use strict';

const {FireStationFactory, CoordinatesFactory} = require('../factories/factories');
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        for (let i = 0; i < 10; i++) {
            let fireStation = {
                name: faker.location.city(),
                address: faker.location.streetAddress()
            };
            let createdFireStation = await FireStationFactory.create(fireStation);

            let coordinate = {
                latitude: faker.location.latitude({
                    min: 43,
                    max: 48
                }),
                longitude: faker.location.longitude({
                    min: -0.8,
                    max: 5.7
                }),
                timestamp: new Date()
            };

            let coordinateEntity = await CoordinatesFactory.create(coordinate);

            await createdFireStation.addCoordinates(coordinateEntity);
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
