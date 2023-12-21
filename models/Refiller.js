const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class Refiller extends Model {
    //set table name
    static getTableName() {
        return 'refiller';
    }

}

Refiller.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    refillMaxCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    refillCurrentCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Refiller.getTableName(),
    timestamps: true,
});

module.exports = Refiller;