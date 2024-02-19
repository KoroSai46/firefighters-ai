const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const WildFireState = sequelize.define('WildFireState', {
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
    tableName: 'wildfire_state', // Remplacez 'wildfire_state' par le nom de votre table
    timestamps: true,
    sequelize,
    modelName: 'WildFireState', // Ajout du nom du modèle
    dialect: 'mysql',
});

WildFireState.associate = (models) => {
    WildFireState.belongsTo(models.WildFire, {
        foreignKey: {
            name: 'wildFireId',
            allowNull: false,
        },
        onDelete: 'CASCADE'
    });

    WildFireState.belongsToMany(models.Coordinates, {
        through: 'WildFireStateCoordinates',
        foreignKey: 'wildFireStateId',
    });
}

module.exports = WildFireState;