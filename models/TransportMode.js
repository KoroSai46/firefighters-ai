const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class TransportMode extends Model {
    //set table name
    static getTableName() {
        return 'transport_mode';
    }

}

TransportMode.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: TransportMode.getTableName(),
    timestamps: true,
});

module.exports = TransportMode;