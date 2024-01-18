//retrieve all models
const Assignment = require('./Assignment');
const Bot = require('./Bot');
const Coordinates = require('./Coordinates');
const Chunk = require('./Chunk');
const FireStation = require('./FireStation');
const Fleet = require('./Fleet');
const Helpers = require('./Helpers');
const Refiller = require('./Refiller');
const TransportMode = require('./TransportMode');
const WildFire = require('./WildFire');
const WildFireState = require('./WildFireState');
const {Canadair, FireFighters, Launcher, LightWeight, Tanker} = require('./FireFighters/models');

Bot.associate({FireStation});

module.exports = {
    Assignment,
    Bot,
    Coordinates,
    Chunk,
    FireStation,
    Fleet,
    Helpers,
    Refiller,
    TransportMode,
    WildFire,
    WildFireState,
    Canadair,
    FireFighters,
    Launcher,
    LightWeight,
    Tanker
}