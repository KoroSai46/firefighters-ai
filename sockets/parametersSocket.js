const socket = require('./index');
const Events = require('./events');

function emitUpdateParameter(parameter) {
    const io = socket.getIO();
    io.emit(Events.PARAMETER_UPDATE, parameter);
}


module.exports = {
    emitUpdateParameter
}