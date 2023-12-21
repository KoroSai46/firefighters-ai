const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../database');

class Tanker extends Model {
    //set table name
    static getTableName() {
        return 'tanker';
    }

}

Tanker.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Tanker.getTableName(),
    timestamps: true,
});

module.exports = Tanker;