const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../database');
const {FireStation} = require("./models");

const Bot = sequelize.define('bot',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        uuid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        speed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxAutonomy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currentAutonomy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fireStationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        dialect: 'mysql',
        tableName: 'bot',
        timestamps: true,
    });


Bot.associate = (models) => {
    Bot.belongsTo(models.FireStation, {
        foreignKey: {
            name: 'fireStationId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });
};

module.exports = Bot;

