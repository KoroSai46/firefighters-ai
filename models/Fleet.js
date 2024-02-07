const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const Fleet = sequelize.define('Fleet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    }
}, {
    tableName: 'fleet', // Remplacez 'fleet' par le nom de votre table
    timestamps: true,
    sequelize,
    modelName: 'Fleet', // Ajout du nom du modèle
    dialect: 'mysql',
});

Fleet.associate = (models) => {
    Fleet.belongsToMany(models.Bot, {
        through: 'Assignment',
    });
}

module.exports = Fleet;