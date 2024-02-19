const {faker} = require('@faker-js/faker');
const {WildFireFactory, WildFireStateFactory, CoordinatesFactory} = require('../factories/factories');
const {emitNewWildFire, emitNewWildFireState, emitUpdateFires} = require('../sockets/wildFireSocket');
const {BotRepository, WildFireRepository} = require('../repositories/repositories');
const MapService = require('./MapService');
const BotService = require('./BotService');


class FireGenerationService {
    constructor(process) {
        this.start();

        this._fires = [];
        this._queries = [];
        this.refreshFires().then(() => {
            this.updateFires().then(r => {
            });
        });
    }

    start() {
        this.tryToGenerateFire();
    }

    tryToGenerateFire() {
        // 5% chance to generate fire
        if (Math.random() < 0.10) {
            this.generateFire();
        }

        // try again in between 1 and 5 seconds
        setTimeout(() => {
            this.tryToGenerateFire();
        }, Math.random() * 4000 + 1000);
    }

    async generateFire() {
        const fire = await WildFireFactory.create({'startedAt': new Date()});

        // emitNewWildFire(fire);

        const fireState = await WildFireStateFactory.create({
            'wildFireId': fire.id,
            'startedAt': new Date(),
            'timestamp': new Date(),
        });

        const coordinatesInstance = await CoordinatesFactory.createFrenchCoordinates();


        await fireState.addCoordinates(coordinatesInstance);


        //await BotService.createFleet(fire);

        // emitNewWildFireState(fireState);
    }


    async updateFire(fire) {
        fire.getChunks().forEach(chunk => {

        })
    }

    updateChunk(chunk) {
        if (Math.random() > 0.2) return chunk;

        if (Math.random() > 0.5) {
            this.extendChunk(chunk);
        } else {

        }
    }

    extendChunk(chunk) {

    }

    /**
     * @returns {*}
     */
    upgradeChunkStrength(chunk) {
        chunk.strength += 1;
        return chunk;
    }

    async refreshFires() {
        let fires = await WildFireRepository.findAllActiveWildFires();
        this._fires = fires.results;
        this._queries = fires.queries;
    }

    async updateFires() {
        await this.refreshFires();

        emitUpdateFires({
            results: this._fires,
            queries: this._queries
        });

        setTimeout(() => {
            this.updateFires();
        }, 1000);
    }
}

module.exports = FireGenerationService;