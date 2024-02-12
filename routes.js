const router = require('express').Router();
const {BotRepository, FireStationRepository} = require('./repositories/repositories');
const wrapper = require('./http/wrapper');
const MapService = require("./services/MapService");

router.get('/map', (req, res) => {
    res.render('map.ejs', {
        backendUrl: process.env.BACKEND_URL
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

module.exports = router;