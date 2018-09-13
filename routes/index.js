var express = require('express');
var router = express.Router();

var db = require("../models");



/* GET home page. find all the articles in the database, then render the home page with each article on it. */
router.get('/', function (req, res, next) {

  db.Article.find({},{},{ sort:{
    date_added: -1 
}}).populate("comments").then(function(docs) {

    res.render('index', {
      title: 'Blizzard Scraper',
      results: docs
    });

  }).catch((err, docs) => {
  
    console.log("error", err);

  });

});


// Create a comment, and add the id to the comments list on the associated article, then redirect to home.
router.post('/comment', function (req, res, next) {

  db.Comment.create(req.body).then(function (comment) {
    return db.Article.findOneAndUpdate({_id: req.body.id}, { $push: { comments: comment._id } }, { new: true });
  })
  .then(function (article) {
    res.redirect('/');
  });

});

// Delete the comment from the collection, then send true, the page will then be reloaded.
router.delete('/delete/:commentId', function(req, res, next) {
  db.Comment.findByIdAndDelete({ _id: req.params.commentId}).then(function (result) {
    res.send(true);
  }).catch(function (err) {
    console.log("error", err);
  });
});

module.exports = router;
