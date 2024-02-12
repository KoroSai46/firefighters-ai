require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const socket = require('./sockets/index');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const {BotRepository, FireStationRepository} = require('./repositories/repositories');
const wrapper = require('./http/wrapper');

const {emitNewWildFire} = require('./sockets/wildFireSocket');

const FireGenerationService = require('./services/FireGenerationService');

const router = require('./routes');

//set ejs as view engine and set views folder
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(cors({
    origin: '*'
}));

const routes = require('./routes');
app.use('/', routes);

socket.initSocket(server);

(new FireGenerationService(process));

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});