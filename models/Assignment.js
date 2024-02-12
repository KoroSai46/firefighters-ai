const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {
    tableName: 'assignment',
    timestamps: true,
    sequelize,
    modelName: 'Assignment',
    dialect: 'mysql',
});

module.exports = Assignment;