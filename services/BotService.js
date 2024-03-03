const {
    BotRepository,
    FleetRepository,
    AssignmentRepository,
    WildFireRepository
} = require('../repositories/repositories');
const MapService = require('./MapService');
const {emitUpdateBots, emitUnavailableBot, emitBotAssignment} = require("../sockets/botSocket");
const {BotFactory, CoordinatesFactory} = require("../factories/factories");
const TimeManipulationService = require("./SimulationParametersService");
const {emitFinishedWildFire} = require("../sockets/wildFireSocket");

class BotService {
    constructor() {
        this._bots = [];
        this._botNavigationSteps = [];
        this._updatedBots = [];
        this._assignments = [];
        this.firstTimeLoading = true;
        this.isReassigning = false;
        this.updateBots();
        this.reAssignBot();
    }

    async refreshBots() {
        this._updatedBots = [];
        await this.progressAllNavigation();

        let bots = await BotRepository.findAllWithCoordinatesLimit();
        this._bots = bots.results;
        this._queries = bots.queries;
    }

    async updateBots() {
        await this.refreshBots();

        if (this.firstTimeLoading) {
            this.firstTimeLoading = false;
            emitUpdateBots(this._bots)
        } else if (this._updatedBots.length > 0) {
            emitUpdateBots(this._updatedBots);
        }

        setTimeout(() => {
            this.updateBots();
        }, 1000);
    }


    haversineDistance(point1, point2) {
        // Convert latitude and longitude from degrees to radians
        const degToRad = Math.PI / 180;
        const lat1 = point1.latitude * degToRad;
        const lon1 = point1.longitude * degToRad;
        const lat2 = point2.latitude * degToRad;
        const lon2 = point2.longitude * degToRad;

        // Haversine formula
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const earthRadius = 6371; // Radius of the Earth in kilometers

        return earthRadius * c;
    }

    async createFleet(wildFire) {
        wildFire = await WildFireRepository.findActiveWildFireById(wildFire.id);

        const closestBots = await this.findClosestBotsByCoordinates(wildFire.dataValues.Coordinates[0]);

        if (closestBots.length === 0) {
            return;
        }

        const fleet = await FleetRepository.create({wildFireId: wildFire.id});


        const durations = [];

        for (let i = 0; i < closestBots.length; i++) {
            let botCoordinates = await closestBots[i].getCoordinates();
            let navigation = await MapService.navigateToLocation(botCoordinates[0], wildFire.dataValues.Coordinates[0]);
            let duration = navigation.routes[0].duration;

            durations.push({bot: closestBots[i], duration, navigation});
        }

        durations.sort((a, b) => a.duration - b.duration);

        const botsToSend = durations.slice(0, 1);

        for (let i = 0; i < botsToSend.length; i++) {
            const bot = botsToSend[i].bot;
            const navigation = botsToSend[i].navigation;
            const duration = botsToSend[i].duration;
            const returnGeojson = {...navigation};
            returnGeojson.routes[0].geometry.coordinates = returnGeojson.routes[0].geometry.coordinates.reverse();
            const assignment = await AssignmentRepository.create({
                fleetId: fleet.id,
                botId: bot.id,
                startedAt: new Date(),
                endedAt: null,
                geojson: navigation,
                returnGeojson: returnGeojson
            });

            this._assignments.push(assignment);
            emitBotAssignment({
                botId: bot.id,
                fireId: wildFire.id,
                duration: duration
            });

            this.progressNavigation(bot);
        }
    }


    async findClosestBotsByCoordinates(toCoordinates, k = 5) {
        let bots = await BotRepository.findAllAvailableWithCoordinatesLimit();
        if (bots.queries.total === 0) {
            emitUnavailableBot();
            return [];
        }
        bots = bots.results;


        const distances = [];
        for (let i = 0; i < bots.length; i++) {
            const bot = bots[i];
            const coordinates = await bot.getCoordinates();
            const distance = this.haversineDistance(toCoordinates, coordinates[0]);
            distances.push({bot, distance});
        }

        // Sort points by distance
        distances.sort((a, b) => a.distance - b.distance);

        // Return k closest points
        return distances.slice(0, k).map(entry => entry.bot);
    }

    async progressAllNavigation() {
        let availableBots = await BotRepository.findAllAvailable();

        let occupiedBots = this._bots.filter(bot => {
            return !availableBots.results.some(availableBot => availableBot.id === bot.id);
        });

        for (let i = 0; i < occupiedBots.length; i++) {
            let bot = occupiedBots[i];

            if (!this._botNavigationSteps.some(navStep => navStep.botId === bot.id)) {
                this.progressNavigation(bot);
            }
        }
    }

    async progressNavigation(bot) {
        let assignment = this._assignments.find(assignment => assignment.botId === bot.id);

        if (!assignment) {
            assignment = await AssignmentRepository.findByBotId(bot.id);
            if (!assignment) {
                return;
            }

            this._assignments.push(assignment);

        }

        let navStep = this._botNavigationSteps.find(navStep => navStep.botId === bot.id);

        if (!navStep) {
            navStep = {botId: bot.id, assignmentIndex: this._assignments.indexOf(assignment), step: 0, steps: assignment.geojson.routes[0].geometry.coordinates};
            this._botNavigationSteps.push(navStep);
        }

        if (navStep.step === navStep.steps.length - 1) {
            //remove assignment
            this._assignments = this._assignments.filter(assignment => assignment.botId !== bot.id);
            this._botNavigationSteps = this._botNavigationSteps.filter(navStep => navStep.botId !== bot.id);
            await this.finishFire(bot.id);
            return;
        }

        let coordinates = navStep.steps[navStep.step];
        let coordinatesObject = await CoordinatesFactory.create({
            latitude: coordinates[1],
            longitude: coordinates[0],
            timestamp: new Date()
        });
        await bot.addCoordinates(coordinatesObject);

        navStep.step++;

        this._updatedBots.push(this._bots.find(bot => bot.id === navStep.botId));

        let baseTime = assignment.geojson.routes[0].duration / navStep.steps.length;

        let acceleredTime = baseTime / TimeManipulationService.getTimeAcceleration();

        setTimeout(() => {
            this.progressNavigation(bot);
        }, acceleredTime * 1000);
    }

    async finishFire(botId) {
        const fireId = await AssignmentRepository.findFireByBotId(botId);

        await WildFireRepository.finishWildFire(fireId);

        emitFinishedWildFire(fireId);
    }

    async reAssignBot() {
        if (this.isReassigning) {
            return;
        } else {
            this.isReassigning = true;
        }
        let availableBots = await BotRepository.findAllAvailableWithCoordinatesLimit();

        if (availableBots.results.length > 0) {
            for (let i = 0; i < availableBots.results.length; i++) {
                let activeFire = await WildFireRepository.findSingleActiveWildFire();

                if (activeFire.length > 0) {
                    await this.createFleet(activeFire[0]);
                }
            }
        }
        this.isReassigning = false;

        setTimeout(() => {
            this.reAssignBot();
        }, 1000);
    }

}

const botServiceInstance = new BotService();

module.exports = botServiceInstance;