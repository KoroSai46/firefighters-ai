//retrieve all models
const Bot = require('./Bot');
const Coordinates = require('./Coordinates');
const FireStation = require('./FireStation');
const Fleet = require('./Fleet');
const WildFire = require('./WildFire');
const WildFireState = require('./WildFireState');
const FireStationCoordinates = require('./FireStationCoordinates');
const WildFireStateCoordinates = require('./WildFireStateCoordinates');
const BotCoordinates = require('./BotCoordinates');

Bot.associate({FireStation, Fleet, Coordinates});

Coordinates.associate({Bot, FireStation, WildFireState});

FireStation.associate({Coordinates});

Fleet.associate({Bot});

WildFireState.associate({WildFire, Coordinates});


module.exports = {
    Bot,
    Coordinates,
    FireStation,
    Fleet,
    WildFire,
    WildFireState,
    FireStationCoordinates,
    WildFireStateCoordinates,
    BotCoordinates
}