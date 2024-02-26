const {Assignment} = require('../models/models');
const BaseRepository = require("./BaseRepository");
const {Sequelize} = require("sequelize");

class AssignmentRepository extends BaseRepository {
    constructor() {
        super(Assignment);
    }

    async findByBotId(botId) {
        return await Assignment.findOne({
            where: {
                botId: botId,
                endedAt: null
            }
        });
    }

    async findFireByBotId(botId) {
        let query = `SELECT wildFireId
                     FROM fleet
                     WHERE id = (SELECT fleetId
                                 FROM assignment
                                 WHERE botId = ${botId}
                                   AND endedAt IS NULL)`;

        let result = await this.getConnection().query(query, {type: Sequelize.QueryTypes.SELECT});

        return result[0].wildFireId;
    }

}

const assignmentRepositoryInstance = new AssignmentRepository();

module.exports = assignmentRepositoryInstance;