
const express = require("express");
const db = require("./mysql.js");
const createError = require('http-errors');

var router = express.Router();


/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/login", function (req, res, next) {res.redirect("/login")});
router.post("/login", function (req, res, next) {
  db.get_user(req.body.email, req.body.password)
    .then((o) => {
      req.session.user = o.email;
      req.session.name = o.legal_name;
      res.redirect("/");
    })
    .catch((e) => {
      console.log(e);
      res.status(e.code || 500);
      res.render('login', { title: 'Express', error: e.error });
    });
});

router.get("/create", function (req, res, next) {res.redirect("/create")});
router.post("/create", function (req, res, next) {
  db.add_user(req.body.email, req.body.password, req.body.legal_name)
    .then((o) => {
      req.session.user = o.email;
      req.session.name = o.legal_name;
      res.redirect('/');
    })
    .catch((e) => {
      console.log(e);
      res.status(e.code || 500);
      res.render('create', { title: 'Express', error: e.error });
    });
});

module.exports = router;
