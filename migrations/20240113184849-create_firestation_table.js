'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('fireStation', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: Sequelize.STRING,
            address: Sequelize.STRING,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.createTable('coordinates', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            latitude: Sequelize.FLOAT,
            longitude: Sequelize.FLOAT,
            timestamp: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.createTable('fireStationCoordinates', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            fireStationId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'fireStation',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            coordinatesId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'coordinates',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            timestamp: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.addIndex('fireStationCoordinates', ['fireStationId', 'coordinatesId'], {
            unique: true,
            name: 'fireStationCoordinates_unique_index'
        });

        await queryInterface.createTable('bot', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            uuid: Sequelize.UUID,
            speed: Sequelize.INTEGER,
            flowStrength: Sequelize.INTEGER,
            fireStationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'fireStation',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.createTable('botCoordinates', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            botId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'bot',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            coordinatesId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'coordinates',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            timestamp: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.addIndex('botCoordinates', ['botId', 'coordinatesId'], {
            unique: true,
            name: 'botCoordinates_unique_index'
        });

        await queryInterface.createTable('wildfire', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            startedAt: Sequelize.DATE,
            endedAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.createTable('wildfire_state', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            startedAt: Sequelize.DATE,
            wildfireId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'wildfire',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.createTable('wildFireStateCoordinates', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            wildfireStateId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'wildfire_state',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            coordinatesId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'coordinates',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            timestamp: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.addIndex('wildFireStateCoordinates', ['wildfireStateId', 'coordinatesId'], {
            unique: true,
            name: 'wildFireStateCoordinates_unique_index'
        });

        await queryInterface.createTable('fleet', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            wildfireId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'wildfire',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
        });

        await queryInterface.createTable('assignment', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            fleetId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'fleet',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            botId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'bot',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            geojson: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            returnGeojson: {
                type: Sequelize.JSON,
                allowNull: true
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            startedAt: Sequelize.DATE,
            endedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },

    async down(queryInterface, Sequelize) {
    }
};
