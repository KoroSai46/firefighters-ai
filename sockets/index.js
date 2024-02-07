const socketIO = require('socket.io');

let io;

function initSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: '*',
        }
    });
    io.on('connection', (socket) => {
        console.log('A user connected');

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