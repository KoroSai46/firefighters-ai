require('dotenv').config();

const express = require('express');
const http = require('http');
const socket = require('./sockets/index');

const app = express();
const server = http.createServer(app);
const port = 3000;

const repository = require('./repository/repository');
const wrapper = require('./http/wrapper');

const { emitNewWildFire } = require('./sockets/wildFireSocket');

//set ejs as view engine and set views folder
app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', async (req, res) => {

    res.render('index');
    setInterval(() => {
        test();
    }, 2000);
});

function test() {
    console.log('test')
    emitNewWildFire({'startedAt': new Date()});
}

socket.initSocket(server);

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});