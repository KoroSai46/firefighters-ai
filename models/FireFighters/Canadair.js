const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../database');

class Canadair extends Model {
    //set table name
    static getTableName() {
        return 'canadair';
    }

}

Canadair.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Canadair.getTableName(),
    timestamps: true,
});

module.exports = Canadair;