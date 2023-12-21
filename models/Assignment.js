const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class Assignment extends Model {
    //set table name
    static getTableName() {
        return 'coordinates';
    }

}

Assignment.init({
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
    tableName: Assignment.getTableName(),
    timestamps: true,
});

module.exports = Assignment;