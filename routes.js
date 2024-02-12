const router = require('express').Router();

router.get('/map', (req, res) => {
    res.render('map.ejs', {
        backendUrl: process.env.BACKEND_URL
    });
});

module.exports = router;