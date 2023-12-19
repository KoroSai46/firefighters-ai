//FireStation factory
const {FireStation} = require('../models/models');
const sequelize = require('../database');

async function createFireStation(name, latitude, longitude) {
    try {
        return await FireStation.create({
            name,
            latitude,
            longitude,
        });
    } catch (error) {
        console.error('Error creating record:', error);
    }
}

module.exports = {
    createFireStation
}