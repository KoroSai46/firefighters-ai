const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class Chunk extends Model {
    //set table name
    static getTableName() {
        return 'chunk';
    }

}

Chunk.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    fireStrength: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    dialect: 'mysql',
    tableName: Chunk.getTableName(),
    timestamps: true,
});

module.exports = Chunk;