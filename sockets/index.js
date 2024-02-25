const socketIO = require('socket.io');
const events = require('./events');
const SimulationParametersService = require("../services/SimulationParametersService");
const TestService = require("../services/test");

class Socket {
    constructor() {
        this.io = null;
    }

    initSocket(server) {
        this.io = socketIO(server, {
            cors: {
                origin: '*',
            }
        });

        this.io.on('connection', (socket) => {
            console.log('A user connected');
            TestService.test();

            socket.on(events.PARAMETER_UPDATE, (data) => {
                //check if data has property and value
                if (data.property && data.value) {
                    if (SimulationParametersService.setParameter({
                        parameter: data.property,
                        value: data.value
                    }) !== null) {
                        //emit to all connected clients
                        this.io.emit(events.PARAMETER_UPDATE, data);
                    }
                }
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });
    }

    getIO() {
        if (!this.io) {
            throw new Error('Socket.io not initialized');
        }
        return this.io;
    }

}

const socketInstance = new Socket();

module.exports = socketInstance;