const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class WildFireState extends Model {
    //set table name
    static getTableName() {
        return 'wildfire_state';
    }

}

WildFireState.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    dialect: 'mysql',
    tableName: WildFireState.getTableName(),
    timestamps: true,
});

module.exports = WildFireState;