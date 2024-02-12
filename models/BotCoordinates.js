const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const BotCoordinates = sequelize.define('botCoordinates', {
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
    tableName: 'botCoordinates',
    timestamps: true,
});

BotCoordinates.associate = (models) => {
    BotCoordinates.belongsTo(models.Bot, {
        foreignKey: {
            name: 'botId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });

    BotCoordinates.belongsTo(models.Coordinates, {
        foreignKey: {
            name: 'coordinatesId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });
}

module.exports = BotCoordinates;