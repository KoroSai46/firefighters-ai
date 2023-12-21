const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class Bot extends Model {
    //set table name
    static getTableName() {
        return 'bot';
    }

}

Bot.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxAutonomy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentAutonomy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Bot.getTableName(),
    timestamps: true,
});

Bot.sync().then().catch(error => {
    console.log(error);
});

module.exports = Bot;