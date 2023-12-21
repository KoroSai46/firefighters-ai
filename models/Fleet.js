const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class Fleet extends Model {
    //set table name
    static getTableName() {
        return 'fleet';
    }

}

Fleet.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Fleet.getTableName(),
    timestamps: true,
});

module.exports = Fleet;