const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class WildFire extends Model {
    //set table name
    static getTableName() {
        return 'wildfire';
    }

}

WildFire.init({
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
    endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: WildFire.getTableName(),
    timestamps: true,
});

module.exports = WildFire;