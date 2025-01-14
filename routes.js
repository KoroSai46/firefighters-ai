const router = require('express').Router();
const SimulationService = require('./services/SimulationParametersService');
const {BotRepository, FireStationRepository, WildFireRepository} = require('./repositories/repositories');
const wrapper = require('./http/wrapper');
const MapService = require("./services/MapService");

router.get('/', (req, res) => {
    res.render('map.ejs', {
        backendUrl: process.env.BACKEND_URL,
        mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
        parameters: {
            timeAcceleration: SimulationService.getTimeAcceleration(),
            fireChance: SimulationService.getFireChance()
        }
    });
});

router.get('/firestations', async (req, res) => {
    const firestations = await FireStationRepository.findAll(req);
    res.json(wrapper.success(firestations));
});

router.get('/bots', async (req, res) => {
    res.json(wrapper.success(await BotRepository.findAll(req)));
});

router.get('/navigation', async (req, res) => {
    MapService.navigateToLocation({
        'latitude': 49.361278,
        'longitude': -0.377784
    }, {
        'latitude': 49.18134,
        'longitude': -0.363562
    })
        .then(data => {
            res.json(wrapper.success(data));
        });
});

router.get('/wildfires', async (req, res) => {
    res.json(wrapper.success(await WildFireRepository.findAll(req)));
});

router.get('/test', async (req, res) => {
    res.json(wrapper.success(await BotRepository.findAllAvailable(req)));
});

router.get('/replays', async (req, res) => {

    let endedWildFires = await WildFireRepository.findAllEndedWildFires(req);

    res.render('replay/index.ejs', {
        fires: endedWildFires.results,
    });
});


router.get('/replays/:id', async (req, res) => {
    let fire = await WildFireRepository.getEndedFireForReplay(req.params.id);

    res.render('replay/show.ejs', {
        params: fire,
        mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
    });
});

module.exports = router;