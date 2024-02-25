const {BotRepository, FleetRepository, AssignmentRepository} = require('../repositories/repositories');
const MapService = require('./MapService');
const {emitUpdateBots, emitUnavailableBot} = require("../sockets/botSocket");
const {BotFactory, CoordinatesFactory} = require("../factories/factories");
const TimeManipulationService = require("./SimulationParametersService");

class BotService {
    constructor() {
        this._bots = [];
        this._queries = [];
        this._botNavigationSteps = [];
        this._assignments = [];
        this._updatedBots = [];
        this.firstTimeLoading = true;
        this.refreshBots().then(() => {
            this.updateBots().then(r => {
            });
        });
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

        console.log(this.firstTimeLoading)

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
        const wildFireStates = await wildFire.getWildFireStates();
        const firestate = await wildFireStates[0];

        const coordinates = await firestate.getCoordinates();
        const closestBots = await this.findClosestBotsByCoordinates(coordinates[0]);

        if (closestBots.length === 0) {
            return;
        }

        const fleet = await FleetRepository.create({wildFireId: wildFire.id});


        const durations = [];

        for (let i = 0; i < closestBots.length; i++) {
            let botCoordinates = await closestBots[i].getCoordinates();
            let navigation = await MapService.navigateToLocation(botCoordinates[0], coordinates[0]);
            console.log(navigation);
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
            returnGeojson.routes[0].legs.steps = returnGeojson.routes[0].legs[0].steps.reverse();
            const assignment = await AssignmentRepository.create({
                fleetId: fleet.id,
                botId: bot.id,
                startedAt: new Date(),
                endedAt: null,
                geojson: navigation,
                returnGeojson: returnGeojson
            });
            console.log('Bot ' + bot.id + ' will arrive in ' + duration + ' seconds');
        }
    }


    async findClosestBotsByCoordinates(toCoordinates, k = 5) {
        let bots = await BotRepository.findAllAvailable();
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
                await this.progressNavigation(bot);
            }
        }
    }

    async progressNavigation(bot) {
        if (!this._updatedBots.some(updatedBot => updatedBot.id === bot.id)) {
            this._updatedBots.push(bot);
        }
        const botId = bot.id;
        let navStep = this._botNavigationSteps.find(navStep => navStep?.botId === botId);
        if (navStep === undefined) {
            let geojson = await BotRepository.getLastGeoJson(botId);
            let steps = geojson.geojson.routes[0].legs[0].steps;
            this._botNavigationSteps.push({
                step: 0,
                subStep: 0,
                duration: geojson.geojson.routes[0].duration,
                steps,
                botId
            });
            navStep = this._botNavigationSteps.find(navStep => navStep?.botId === botId);
        }

        //check if the bot has arrived
        if (navStep.step === navStep.steps.length - 1) {
            //remove the bot from the occupied list
            let index = this._botNavigationSteps.findIndex(navStep => navStep?.botId === botId);
            delete this._botNavigationSteps[index];
            return;
        }
        let newCoordinates = navStep.steps[navStep.step].geometry.coordinates;

        //check if substep is defined
        if (newCoordinates.length <= navStep.subStep) {
            navStep.step++;
            navStep.subStep = 0;
            this.progressNavigation(bot);
        }

        let realNewCoordinates = newCoordinates[navStep.subStep];
        let newCoordinatesObject = await CoordinatesFactory.create({
            latitude: realNewCoordinates[1],
            longitude: realNewCoordinates[0],
            timestamp: new Date()
        });
        await bot.addCoordinate(newCoordinatesObject);
        navStep.subStep++;

        let baseTime = navStep.steps[navStep.step].duration / navStep.steps[navStep.step].geometry.coordinates.length;

        let acceleredTime = baseTime / TimeManipulationService.getTimeAcceleration();

        setTimeout(() => {
            this.progressNavigation(bot);
        }, acceleredTime * 1000);
    }

}

const botServiceInstance = new BotService();

module.exports = botServiceInstance;