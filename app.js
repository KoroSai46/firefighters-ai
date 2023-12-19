const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const repository = require('./repository/repository');
const wrapper = require('./http/wrapper');

app.get('/', async (req, res) => {
    const fireStations = await repository.FireStationRepository.findAll(req);
    res.send(wrapper.success(fireStations));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});