'use strict';
const {Bot} = require('../models/models');

const tableName = Bot.getTableName();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(tableName, {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            uuid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
            speed: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            maxAutonomy: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            currentAutonomy: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(tableName);
    }
};