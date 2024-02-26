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

function emitUpdateFires(fires) {
    const io = socket.getIO();
    io.emit(Events.FIRES_UPDATE, fires);
}

function emitFinishedWildFire(wildFire) {
    const io = socket.getIO();
    io.emit(Events.FIRE_END, wildFire);
}


module.exports = {
    emitNewWildFire,
    emitNewWildFireState,
    emitUpdateFires,
    emitFinishedWildFire
}