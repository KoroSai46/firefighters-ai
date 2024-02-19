const {Bot} = require('../models/models');
const helpers = require('./helpers');
const {Sequelize} = require("sequelize");
const BaseRepository = require("./BaseRepository");

class BotRepository extends BaseRepository {
    constructor() {
        super(Bot);
    }

    async findAllAvailable(req) {
        //table assignment have botId and a endedAt field, we can select all bots from bot table
        // where botId is not in the table assignment or where endedAt is null

        //get unavailable bots
        let availableBots = await helpers.findAllGeneric(Bot, req, {
            [Sequelize.Op.or]: [
                // Use Sequelize's not in operator $notIn to find botIds not present in assignment table
                {id: {[Sequelize.Op.notIn]: Sequelize.literal('(SELECT botId FROM assignment WHERE endedAt IS NULL)')}},
            ],
        });

        return availableBots;
    }

    async findAllWithCoordinatesLimit(coordinatesLimit = 10, req = {}) {

        let botsQuery = await helpers.findAllGeneric(Bot, {}, {}, {noLimit: true, withAssoc: false});

        let bots = botsQuery.results;

        //create a query to get the coordinates of the bots
        let rawQuery = "SELECT bc.botId, c.id, c.timestamp, c.latitude, c.longitude FROM botcoordinates AS bc INNER JOIN coordinates AS c ON bc.coordinatesId = c.id INNER JOIN (SELECT botId, coordinatesId FROM (SELECT botId, coordinatesId, ROW_NUMBER() OVER (PARTITION BY botId ORDER BY createdAt DESC) AS row_num FROM botcoordinates) AS ranked_coordinates WHERE row_num <= 10) AS latest_coordinates ON bc.botId = latest_coordinates.botId AND bc.coordinatesId = latest_coordinates.coordinatesId ORDER BY bc.botId, c.createdAt DESC;";

        let coordinates = await this.getConnection().query(rawQuery, {type: Sequelize.QueryTypes.SELECT});

        //map the coordinates to the bots
        bots = bots.map(bot => {
            bot.dataValues.Coordinates = coordinates.filter(coordinate => coordinate.botId === bot.id);
            return bot;
        });

        return {
            results: bots,
            queries: botsQuery.queries,
        }
    }
}

const botRepositoryInstance = new BotRepository();

module.exports = botRepositoryInstance;