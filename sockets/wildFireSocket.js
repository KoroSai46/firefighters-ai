const socket = require('./index');

function emitNewWildFire(wildFire) {
    const io = socket.getIO();
    io.emit('fire start', wildFire);
}


module.exports = {
    emitNewWildFire
}