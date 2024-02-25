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
    console.log('fire emit', io.emit(Events.FIRES_UPDATE, fires));
}


module.exports = {
    emitNewWildFire,
    emitNewWildFireState,
    emitUpdateFires
}