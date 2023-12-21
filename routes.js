const router = require('express').Router();

router.get('/map', (req, res) => {
    res.render('map.ejs');
});

module.exports = router;