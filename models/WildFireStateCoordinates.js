const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const WildFireStateCoordinates = sequelize.define('wildFireStateCoordinates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: 'wildFireStateCoordinates',
    timestamps: true,
});

module.exports = WildFireStateCoordinates;