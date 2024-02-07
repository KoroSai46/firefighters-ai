const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const FireStation = sequelize.define('fireStation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: 'fireStation',
});

FireStation.associate = (models) => {
    FireStation.belongsToMany(models.Coordinates, {
        through: 'FireStationCoordinates',
    })
};

module.exports = FireStation;