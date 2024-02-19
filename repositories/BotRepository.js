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
}

const botRepositoryInstance = new BotRepository();

module.exports = botRepositoryInstance;