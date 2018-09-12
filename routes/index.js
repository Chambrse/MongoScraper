var express = require('express');
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");
var db = require("../models");



/* GET home page. */
router.get('/', function (req, res, next) {

  console.log("in router");

  db.Article.find({},{},{ sort:{
    date_added: -1 
}}).populate("comments").then(function(docs) {

    // res.json(docs);

    res.render('index', {
      title: 'Blizzard Scraper',
      results: docs
    });

  }).catch((err, docs) => {
  
    console.log("error", err);

  });

});

router.post('/comment', function (req, res, next) {

  console.log(req.body);

  db.Comment.create(req.body).then(function (comment) {
    console.log(comment);
    return db.Article.findOneAndUpdate({_id: req.body.id}, { $push: { comments: comment._id } }, { new: true });
  })
  .then(function (article) {
    console.log(article);
    res.redirect('/');
  });

});

router.get('/bootstrap', function (req, res, next) {
  res.render('index', { title: "GameScraper" });
});

module.exports = router;
