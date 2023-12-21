const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const repository = require('./repository/repository');
const wrapper = require('./http/wrapper');

app.get('/', async (req, res) => {
    const bots = await repository.BotRepository.findAll(req);
    res.send(wrapper.success(bots));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});