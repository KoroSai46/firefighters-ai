const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const factory = require('./factorys/factorys');
const models = require('./models/models');

app.get('/', async (req, res) => {
    const fireStations = await models.FireStation.findAll();
    res.send(fireStations);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});