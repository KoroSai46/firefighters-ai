class TestService {
    static test() {
        const BotService = require('./BotService');
        BotService.firstTimeLoading = true;
    }
}

module.exports = TestService;