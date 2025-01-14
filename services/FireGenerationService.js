const {faker} = require('@faker-js/faker');
const {WildFireFactory, WildFireStateFactory, CoordinatesFactory} = require('../factories/factories');
const {emitNewWildFire, emitNewWildFireState, emitUpdateFires} = require('../sockets/wildFireSocket');
const {BotRepository, WildFireRepository} = require('../repositories/repositories');
const MapService = require('./MapService');
const BotService = require('./BotService');
const SimulationParametersService = require('./SimulationParametersService');


class FireGenerationService {
    constructor() {
        this.init().then(() => {
        });
    }

    async init() {

        this._fires = [];
        this._updatedFires = [];
        this.firstTimeLoading = true;
        this._queries = [];
        this.refreshFires().then(() => {
            this.updateFires().then(async () => {
                await this.start();
            });
        });
    }

    async start() {
        await this.tryToGenerateFire();
    }

    async tryToGenerateFire() {
        if (Math.random() < SimulationParametersService.getFireChance()) {
            await this.generateFire();
        }

        // try again in between 1 and 5 seconds
        setTimeout(() => {
            this.tryToGenerateFire();
        }, Math.random() * 4000 + 1000);
    }

    async generateFire() {
        let fire = await WildFireFactory.create({'startedAt': new Date()});


        // emitNewWildFire(fire);

        const fireState = await WildFireStateFactory.create({
            'wildFireId': fire.id,
            'startedAt': new Date(),
            'timestamp': new Date(),
        });


        const coordinatesInstance = await CoordinatesFactory.createFrenchCoordinates(true);

        // get latitude and longitude
        const latitude = coordinatesInstance.latitude;
        const longitude = coordinatesInstance.longitude;

        // create 4 instances of coordinates around the initial coordinates
        const coordinates = [
            {latitude: latitude + 0.01, longitude: longitude},
            {latitude: latitude - 0.01, longitude: longitude},
            {latitude: latitude, longitude: longitude + 0.01},
            {latitude: latitude, longitude: longitude - 0.01},
        ];

        for (let i = 0; i < 4; i++) {
            let coordinate = {
                latitude: coordinates[i].latitude,
                longitude: coordinates[i].longitude,
                timestamp: new Date()
            };

            const coordinatesInstance = await CoordinatesFactory.create(coordinate);
            await fireState.addCoordinates(coordinatesInstance);
        }

        fire = await WildFireRepository.findActiveWildFireById(fire.id);

        this._updatedFires.push(fire);
    }

    async refreshFires() {
        let fires = await WildFireRepository.findAllActiveWildFires();
        this._fires = fires.results;
        this._queries = fires.queries;
    }

    async updateFires() {
        await this.refreshFires();

        if (this.firstTimeLoading) {
            emitUpdateFires(this._fires);
            this.firstTimeLoading = false;
        } else if (this._updatedFires.length > 0) {
            emitUpdateFires(this._updatedFires);

            this._updatedFires = [];
        }

        setTimeout(() => {
            this.updateFires();
        }, 1000);
    }
}

const fireGenerationServiceInstance = new FireGenerationService();

module.exports = fireGenerationServiceInstance;