class TestService {
    static test() {
        const BotService = require('./BotService');
        BotService.firstTimeLoading = true;

        const FireGenerationService = require('./FireGenerationService');
        FireGenerationService.firstTimeLoading = true;
    }
}

module.exports = TestService;