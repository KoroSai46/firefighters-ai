require('dotenv').config();

const express = require('express');
const http = require('http');
const socket = require('./sockets/index');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const {BotRepository, FireStationRepository} = require('./repositories/repositories');
const wrapper = require('./http/wrapper');

const {emitNewWildFire} = require('./sockets/wildFireSocket');

const FireGenerationService = require('./services/FireGenerationService');

//set ejs as view engine and set views folder
app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', async (req, res) => {
    const bots = await BotRepository.findAll(req);
    res.json(wrapper.success(bots));
});

app.get('/wildfires', async (req, res) => {
    res.json(wrapper.success(await BotRepository.findAll(req)));
});

function test() {
    console.log('test')
    emitNewWildFire({'startedAt': new Date()});
}

socket.initSocket(server);

//(new FireGenerationService(process));

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});