const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class Coordinates extends Model {
    //set table name
    static getTableName() {
        return 'coordinates';
    }

}

Coordinates.init({
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
    sequelize,
    dialect: 'mysql',
    tableName: Coordinates.getTableName(),
    timestamps: true,
});

module.exports = Coordinates;