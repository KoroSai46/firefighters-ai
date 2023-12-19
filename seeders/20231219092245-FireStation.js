'use strict';
const {FireStation} = require('../models/models');
const factory = require('../factorys/factorys');
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

        for (let i = 0; i < 100; i++) {
            await factory.createFireStation(faker.company.name(), faker.location.latitude(), faker.location.longitude());
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
