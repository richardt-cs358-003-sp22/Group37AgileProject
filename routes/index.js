const express = require('express');
const router = express.Router();
const sql = require('./mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        name: req.session.name,
        resorts: []
    });
});

router.post('/', function(req, res, next) {
    sql.lookup_resorts(req.body).then((resorts) => {
        //console.log(resorts);
        res.render('index', {
            title: 'Express',
            name: req.session.name,
            params: req.body,
            resorts: resorts
        })
    }).catch((error) => {
        console.log(error);
        res.status(error.code);
        res.render('index', {
            title: 'Express',
            name: req.session.name,
            error: error,
        })
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Express'
    });
});

router.get('/create', function(req, res, next) {
    res.render('create', {
        title: 'Express'
    });
});

module.exports = router;
