const {Assignment} = require('../models/models');
const BaseRepository = require("./BaseRepository");

class AssignmentRepository extends BaseRepository {
    constructor() {
        super(Assignment);
    }

}

const assignmentRepositoryInstance = new AssignmentRepository();

module.exports = assignmentRepositoryInstance;