const socket = require('./index');
const Events = require('./events');

function emitNewWildFire(wildFire) {
    const io = socket.getIO();
    io.emit(Events.FIRE_START, wildFire);
}

function emitNewWildFireState(wildFireState) {
    const io = socket.getIO();
    io.emit(Events.FIRE_UPDATE, wildFireState);
}


module.exports = {
    emitNewWildFire,
    emitNewWildFireState
}