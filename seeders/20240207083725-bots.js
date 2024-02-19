'use strict';

const {BotFactory, CoordinatesFactory} = require('../factories/factories');
const {faker} = require('@faker-js/faker');
const {FireStationRepository} = require('../repositories/repositories');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        let fireStations = await FireStationRepository.findAll();
        fireStations = fireStations.results;
        for (let i = 0; i < 10; i++) {
            let bot = {
                uuid: faker.string.uuid(),
                speed: faker.number.int({
                    min: 1,
                    max: 150
                }),
                flowStrength: faker.number.int({
                    min: 1,
                    max: 5
                }),
                fireStationId: fireStations[Math.floor(Math.random() * fireStations.length)].id
            };

            let createdBot = await BotFactory.create(bot);

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

            await createdBot.addCoordinates(coordinateEntity);
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
