'use strict';
const {BotFactory} = require('../factorys/factorys');
const {faker} = require('@faker-js/faker');
const {v4: uuidv4} = require('uuid');

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
            const maxAutonomy = faker.number.int({min: 20, max: 300});
            await BotFactory.create({
                uuid: uuidv4(),
                speed: faker.number.int({min: 0, max: 100}),
                maxAutonomy: maxAutonomy,
                currentAutonomy: faker.number.int({min: 0, max: maxAutonomy}),
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
