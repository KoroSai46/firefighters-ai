const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../database');

class FireStation extends Model {
    //set table name
    static getTableName() {
        return 'firestation';
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    setName(name) {
        this.name = name;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    }

}

FireStation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    dialect: 'mysql'
});

FireStation.sync().then(r =>
    console.log('FireStation table created')
).catch(e => {
    console.log(e);
});

module.exports = FireStation;