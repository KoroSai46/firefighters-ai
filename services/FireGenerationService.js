const {faker} = require('@faker-js/faker');
const {WildFireFactory, WildFireStateFactory, WildFireStateCoordinatesFactory} = require('../factories/factories');
const {emitNewWildFire, emitNewWildFireState} = require('../sockets/wildFireSocket');
const CoordinatesFactory = require("../factories/CoordinatesFactory");


class FireGenerationService {
    constructor(process) {
        this.start();
    }

    start() {
        this.tryToGenerateFire();
    }

    tryToGenerateFire() {
        // 5% chance to generate fire
        if (Math.random() < 0.50) {
            this.generateFire();
        }

        // try again in between 1 and 5 seconds
        setTimeout(() => {
            this.tryToGenerateFire();
        }, Math.random() * 4000 + 1000);
    }

    async generateFire() {
        const fire = await WildFireFactory.create({'startedAt': new Date()});

        emitNewWildFire(fire);

        const fireState = await WildFireStateFactory.create({
            'wildFireId': fire.id,
            'startedAt': new Date(),
        });

        const coordinatesInstance = await CoordinatesFactory.create({
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            timestamp: new Date()
        });

        fireState.addCoordinates(coordinatesInstance);

        emitNewWildFireState(fireState);
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
}

module.exports = FireGenerationService;