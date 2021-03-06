var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var request = require("request");

var indexRouter = require('./routes');
// var usersRouter = require('./routes/users');

var db = require("./models");

var app = express();

var PORT = process.env.PORT || 8080;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Scrape blizz news, put it in the db, then start listening.
request("https://news.blizzard.com/en-us", function (error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  $("div.ArticleListItem").each(function (i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).find($(".ArticleListItem-title")).text();

    var subtitle = $(element).find($(".ArticleListItem-label")).text();

    var description = $(element).find($(".ArticleListItem-description")).text();
    
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = "https://news.blizzard.com" + $(element).children().attr("href");


    // Save these results in an object that we'll push into the results array we defined earlier
    results.push(/* {
      insertOne:
      {
        "document": */
        {
          subtitle: subtitle,
          title: title,
          description: description,
          link: link
        }
      /*} 
    } */);

  });

  db.Article.create(results, function (error, Result) {

    app.listen(PORT, function () {
      // Log (server-side) when our server has started
      console.log("Server listening on: http://localhost:" + PORT);
    });

  });



});


module.exports = app;
