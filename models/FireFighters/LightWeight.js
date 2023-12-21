const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../database');

class LightWeight extends Model {
    //set table name
    static getTableName() {
        return 'light_weight';
    }

}

LightWeight.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {
    sequelize,
    dialect: 'mysql',
    tableName: LightWeight.getTableName(),
    timestamps: true,
});

module.exports = LightWeight;