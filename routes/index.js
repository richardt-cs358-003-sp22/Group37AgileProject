var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET reservations page */
router.get('/maps', function(req, res, next) {
  res.render('map', { title: 'Map Example' });
});

module.exports = router;
