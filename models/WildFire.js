const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

const WildFire = sequelize.define('WildFire', {
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
    tableName: 'wildfire', // Remplacez 'wildfire' par le nom de votre table
    timestamps: true,
    sequelize,
    modelName: 'WildFire', // Ajout du nom du modèle
    dialect: 'mysql',
});

WildFire.associate = (models) => {
    WildFire.hasMany(models.WildFireState, {
        foreignKey: {
            name: 'wildFireId',
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
}

module.exports = WildFire;