const {BotRepository, FleetRepository} = require('../repositories/repositories');
const MapService = require('./MapService');
const {emitUpdateBots} = require("../sockets/botSocket");
const {BotFactory, CoordinatesFactory} = require("../factories/factories");

class BotService {
    constructor() {
        this._bots = [];
        this._queries = [];
        this.refreshBots().then(() => {
            this.updateBots().then(r => {
            });
        });
    }

    async refreshBots() {
        let newBots = [];
        let bots = await BotRepository.findAll();
        bots.results.forEach(bot => {
            //limit Coordinates to 10, only the last 10 coordinates
            bot.Coordinates = bot.Coordinates.slice(-10);
            bot.dataValues.Coordinates = bot.Coordinates;
            bot._previousDataValues.Coordinates = bot.Coordinates;

            newBots.push(bot);
        });
        this._bots = newBots;
        this._queries = bots.queries;
    }

    async updateBots() {
        //get bots
        for (let i = 0; i < this._bots.length; i++) {
            let bot = this._bots[i];
            let botEntity = await BotRepository.findById(bot.id);
            let coordinates = await botEntity.getCoordinates();
            let newCoordinates = await CoordinatesFactory.createFrenchCoordinates();
            await botEntity.addCoordinate(newCoordinates);
        }

        await this.refreshBots();


        // Émettre la mise à jour
        emitUpdateBots({
            results: this._bots,
            queries: this._queries
        });

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
            let duration = navigation.routes[0].duration;

            durations.push({bot: closestBots[i], duration, navigation});
        }

        durations.sort((a, b) => a.duration - b.duration);

        const botsToSend = durations.slice(0, 1);

        for (let i = 0; i < botsToSend.length; i++) {
            const bot = botsToSend[i].bot;
            const navigation = botsToSend[i].navigation;
            const duration = botsToSend[i].duration;
            fleet.addBot(bot);
            console.log('Bot ' + bot.id + ' will arrive in ' + duration + ' seconds');
        }
    }

    async assignBotToFire(bot, fire) {

    }


    async findClosestBotsByCoordinates(toCoordinates, k = 5) {
        let bots = await BotRepository.findAllAvailable();
        if (bots.queries.total === 0) {
            console.log('No available bots');
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

}

const botServiceInstance = new BotService();

module.exports = botServiceInstance;