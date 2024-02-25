//retrieve all models
const Assignment = require('./Assignment');
const Bot = require('./Bot');
const Coordinates = require('./Coordinates');
const FireStation = require('./FireStation');
const Fleet = require('./Fleet');
const WildFire = require('./WildFire');
const WildFireState = require('./WildFireState');
const FireStationCoordinates = require('./FireStationCoordinates');
const WildFireStateCoordinates = require('./WildFireStateCoordinates');
const BotCoordinates = require('./BotCoordinates');

Assignment.associate({Bot, Fleet});

Bot.associate({FireStation, Fleet, Coordinates});

Coordinates.associate({Bot, FireStation, WildFireState});

FireStation.associate({Coordinates});

Fleet.associate({Bot, WildFire});

WildFireState.associate({WildFire, Coordinates});

WildFire.associate({Coordinates, WildFireState});


module.exports = {
    Assignment,
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