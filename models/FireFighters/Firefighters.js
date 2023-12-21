const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../database');

class FireFighter extends Model {
    //set table name
    static getTableName() {
        return 'firefighters';
    }

}

FireFighter.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    maxWaterCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    waterCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    extinguishingStrength: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: FireFighter.getTableName(),
    timestamps: true,
});

module.exports = FireFighter;