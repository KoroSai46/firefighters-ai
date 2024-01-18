'use strict';
const {BotFactory} = require('../factorys/factorys');
const {faker} = require('@faker-js/faker');
const {v4: uuidv4} = require('uuid');
const {FireStationRepository} = require('../repositories/repositories');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const fireStations = (await FireStationRepository.findAll()).results;
        const fireStationLength = fireStations.length;
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        for (let i = 0; i < 10; i++) {
            const maxAutonomy = faker.number.int({min: 20, max: 300});
            const fireStation = fireStations[faker.number.int({min: 0, max: fireStationLength - 1})];
            console.log(fireStation, fireStation.id);
            await BotFactory.create({
                uuid: uuidv4(),
                speed: faker.number.int({min: 0, max: 100}),
                maxAutonomy: maxAutonomy,
                currentAutonomy: faker.number.int({min: 0, max: maxAutonomy}),
                fireStationId: fireStation.id
            });
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Bots', null, {});
    }
};
