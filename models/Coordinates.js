const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');
const {Bot} = require("./models");

const Coordinates = sequelize.define('Coordinates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'coordinates', // Remplacez 'coordinates' par le nom de votre table
    sequelize,
    modelName: 'Coordinates', // Ajout du nom du modèle
    dialect: 'mysql',
    timestamps: true,
});

Coordinates.associate = (models) => {
    Coordinates.belongsToMany(models.Bot, {
        through: 'BotCoordinates',
        foreignKey: 'coordinatesId',
    });

    Coordinates.belongsToMany(models.WildFireState, {
        through: 'WildFireStateCoordinates',
        foreignKey: 'coordinatesId',
    });

    Coordinates.belongsToMany(models.FireStation, {
        through: 'FireStationCoordinates',
        foreignKey: 'coordinatesId',
    });
}

module.exports = Coordinates;