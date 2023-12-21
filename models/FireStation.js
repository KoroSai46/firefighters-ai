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

    getAddress() {
        return this.address;
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
        return this;
    }

    setAddress(address) {
        this.address = address;
        return this;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
        return this;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
        return this;
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
        return this;
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
    address: {
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
    dialect: 'mysql',
    tableName: FireStation.getTableName(),
});

module.exports = FireStation;