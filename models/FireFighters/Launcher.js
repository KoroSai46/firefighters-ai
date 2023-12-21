const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../database');

class Launcher extends Model {
    //set table name
    static getTableName() {
        return 'launcher';
    }

}

Launcher.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Launcher.getTableName(),
    timestamps: true,
});

module.exports = Launcher;