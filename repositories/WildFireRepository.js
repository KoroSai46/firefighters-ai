const {WildFire} = require('../models/models');
const BaseRepository = require("./BaseRepository");
const {findAllGeneric} = require("./helpers");

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
}

const wildFireRepositoryInstance = new WildFireRepository();

module.exports = wildFireRepositoryInstance;