
const express = require("express");
const db = require("./mysql.js");
const createError = require('http-errors');

var router = express.Router();


/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/login", function (req, res, next) {
  db.get_user(req.body.email, req.body.password)
    .then((o) => {
      // TODO: set cookie or something
      res.redirect('/');
    })
    .catch((e) => {
      console.log(e);
      res.status(e.code || 500);
      res.render('login', { title: 'Express', error: e.code + ' ' + e.error });
    });
});

router.post("/create", function (req, res, next) {
  db.add_user(req.body.email, req.body.password, req.body.legal_name)
    .then((o) => res.json(o))
    .catch((e) => {
      console.log(e);
      next(createError(e.code || 500));
    });
});

module.exports = router;
