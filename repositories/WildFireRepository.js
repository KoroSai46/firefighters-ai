const {WildFire} = require('../models/models');
const BaseRepository = require("./BaseRepository");
const {findAllGeneric} = require("./helpers");
const { Op} = require('sequelize');
const FleetRepository = require("./FleetRepository");
const AssignmentRepository = require("./AssignmentRepository");
const moment = require('moment');

class WildFireRepository extends BaseRepository {
    constructor() {
        super(WildFire);
    }

    async findAllActiveWildFires(coordinatesLimit = 10, req) {
        let firesQuery = await findAllGeneric(WildFire, req, {
            'endedAt': null
        }, {noLimit: true});

        let fires = firesQuery.results;

        let rawQuery = 'SELECT ws.id AS wildfire_state_id, ws.startedAt, ws.wildfireId, wsc.coordinatesId, c.latitude, c.longitude, wsc.timestamp FROM wildfirestatecoordinates AS wsc INNER JOIN (SELECT wsc.wildFireStateId, wsc.coordinatesId, ROW_NUMBER() OVER (PARTITION BY wsc.wildFireStateId ORDER BY wsc.timestamp DESC) AS row_num FROM wildfirestatecoordinates AS wsc) AS ranked_coordinates ON wsc.wildFireStateId = ranked_coordinates.wildFireStateId AND wsc.coordinatesId = ranked_coordinates.coordinatesId INNER JOIN wildfire_state AS ws ON wsc.wildFireStateId = ws.id INNER JOIN coordinates AS c ON wsc.coordinatesId = c.id WHERE ranked_coordinates.row_num <=' + coordinatesLimit + ' ORDER BY ws.id DESC, wsc.timestamp DESC;\n'

        let coordinates = await this.getConnection().query(rawQuery, {type: this.getConnection().QueryTypes.SELECT});

        fires = fires.map(fire => {
            fire.dataValues.Coordinates = coordinates.filter(coordinate => coordinate.wildfireId === fire.id);
            return fire;
        });

        return {
            results: fires,
            queries: firesQuery.queries,
        }
    }

    async findActiveWildFireById(wildFireId, coordinatesLimit = 10) {
        let fire = await WildFire.findOne({
            where: {
                id: wildFireId,
                endedAt: null
            }
        });

        if (!fire) {
            return null;
        }

        let rawQuery = 'SELECT ws.id AS wildfire_state_id, ws.startedAt, ws.wildfireId, wsc.coordinatesId, c.latitude, c.longitude, wsc.timestamp FROM wildfirestatecoordinates AS wsc INNER JOIN (SELECT wsc.wildFireStateId, wsc.coordinatesId, ROW_NUMBER() OVER (PARTITION BY wsc.wildFireStateId ORDER BY wsc.timestamp DESC) AS row_num FROM wildfirestatecoordinates AS wsc) AS ranked_coordinates ON wsc.wildFireStateId = ranked_coordinates.wildFireStateId AND wsc.coordinatesId = ranked_coordinates.coordinatesId INNER JOIN wildfire_state AS ws ON wsc.wildFireStateId = ws.id INNER JOIN coordinates AS c ON wsc.coordinatesId = c.id WHERE ranked_coordinates.row_num <=' + coordinatesLimit + ' AND ws.wildfireId = ' + wildFireId + ' ORDER BY ws.id DESC, wsc.timestamp DESC;'

        let coordinates = await this.getConnection().query(rawQuery, {type: this.getConnection().QueryTypes.SELECT});

        fire.dataValues.Coordinates = coordinates;

        return fire;
    }

    async finishWildFire(wildFireId) {
        //find fleet and assignements to end them
        let query = `UPDATE assignment
                     SET endedAt = NOW()
                     WHERE fleetId = (SELECT id FROM fleet WHERE wildFireId = ${wildFireId})`;
        await this.getConnection().query(query, {type: this.getConnection().QueryTypes.UPDATE});

        return await WildFire.update({
            endedAt: new Date()
        }, {
            where: {
                id: wildFireId
            }
        });
    }

    async findSingleActiveWildFire() {
        //we need to be sure that there is no fleet assigned to this wildfire
        let query = 'SELECT * FROM wildfire WHERE endedAt IS NULL AND id NOT IN (SELECT wildFireId FROM fleet)';

        return await this.getConnection().query(query, {type: this.getConnection().QueryTypes.SELECT});
    }

    async findAllEndedWildFires(req) {
        //req.query.order = 'endedAt';
        //req.query.sort = 'ASC';
        return await findAllGeneric(WildFire, req, {
            'endedAt': {
                [Op.ne]: null
            }
        }, {noLimit: true, withAssoc: false});
    }

    async getEndedFireForReplay(fireId) {
        let fire = await this.findById(fireId);

        let fleet = await FleetRepository.findByWildFireId(fireId);

        let assignments = await AssignmentRepository.findByFleetId(fleet.id);

        return {
            fire,
            fleet,
            assignments,
        };
    }
}

const wildFireRepositoryInstance = new WildFireRepository();

module.exports = wildFireRepositoryInstance;