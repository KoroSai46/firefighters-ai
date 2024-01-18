const {faker} = require('@faker-js/faker');
const {WildFireFactory} = require('../factorys/factorys');
const {emitNewWildFire} = require('../sockets/wildFireSocket');


class FireGenerationService {
    constructor(process) {
        console.log('FireGenerationService constructor');
        this.start();
    }

    start() {
        this.tryToGenerateFire();
    }

    tryToGenerateFire() {
        console.log('Trying to generate fire ' + new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'}));
        // 5% chance to generate fire
        if (Math.random() < 0.05) {
            this.generateFire();
        }

        // try again in between 1 and 5 seconds
        setTimeout(() => {
            this.tryToGenerateFire();
        }, Math.random() * 4000 + 1000);
    }

    async generateFire() {
        console.log('Generating fire');
        const fire = await WildFireFactory.create({'startedAt': new Date()});

        emitNewWildFire(fire);
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