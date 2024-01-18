'use strict';
const {FireStation} = require('../models/models');
const {FireStationFactory} = require('../factorys/factorys');
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
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
            console.log('Creating fire station', i);
            await FireStationFactory.create({
                name: faker.company.name(),
                address: faker.location.streetAddress(true),
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude()
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
        await FireStation.destroy({
            where: {},
            truncate: true
        });
    }
};
