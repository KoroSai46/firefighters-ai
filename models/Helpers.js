const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class Helpers extends Model {
    //set table name
    static getTableName() {
        return 'helpers';
    }

}

Helpers.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Helpers.getTableName(),
    timestamps: true,
});

module.exports = Helpers;