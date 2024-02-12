const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const FireStationCoordinates = sequelize.define('fireStationCoordinates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: 'fireStationCoordinates',
    timestamps: true,
});

module.exports = FireStationCoordinates;