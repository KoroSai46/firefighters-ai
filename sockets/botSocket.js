const socket = require('./index');
const Events = require('./events');

function emitUpdateBots(bots) {
    const io = socket.getIO();
    io.emit(Events.BOTS_UPDATE, bots);
}

function emitUnavailableBot() {
    const io = socket.getIO();
    io.emit(Events.BOT_UNAVAILABLE);
}


module.exports = {
    emitUpdateBots,
    emitUnavailableBot
}