var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: req.session.name, });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Express' });
});

module.exports = router;
