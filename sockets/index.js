const socketIO = require('socket.io');
const events = require('./events');
const SimulationParametersService = require("../services/SimulationParametersService");
const TestService = require("../services/test");

let io;

function initSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: '*',
        }
    });
    io.on('connection', (socket) => {
        console.log('A user connected');
        TestService.test();

        socket.on(events.PARAMETER_UPDATE, (data) => {
            //check if data has property and value
            if (data.property && data.value) {
                SimulationParametersService.setParameter({parameter: data.property, value: data.value});
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

module.exports = {
    initSocket,
    getIO
}