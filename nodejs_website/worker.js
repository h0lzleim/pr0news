//======================================== N O T E S ==========================================

//======================================== D E P E N D E N C I E S==========================================

var Promise = require('bluebird');
var moment = require('moment');
var FeedParser = require('feedparser');
var request = require('request');
var csv = require("fast-csv");

//======================================== S E T T I N G S ==========================================
const filepath = __dirname + "/db/Feeds.CSV";

//============================================== M A I N  ================================================
module.exports = function(input) {
  return new Promise(function(resolve, reject) {

      Promise.try(function(){                 //START
        log("Startet parsing Feeds!");
      })
      .then(function(){                       //FILE TO FEEDURLS (- MAYBE Compare with db)
        return getFeedUrls(filepath);         //CSV STUFF
      })
      .then(function(feeds){                  //Map for all Feeds
        return Promise.map(feeds, function(feed) {
            return parseArticle(feed);
        });
      }).timeout(10000)
      .then(function(){                      //End stuff
        return resolve();
      })
      .catch(pr0newsError, function(e){      //on known pr0newsError
        log("Error: " + e.message);
        reject(pr0newsError);
      })
      .catch(function(e){      //on known pr0newsError
        log("Error: " + e);

        reject(e);
      });

  });
};
//========================================== F U N C T I O N S  ===============================
var getFeedUrls = function(filepath){
  return new Promise(function(resolve, reject) {
    //get article
    var feeds=[];
    csv
      .fromPath(filepath, {delimiter: "|", headers: true})
      .on("data", function(data){
        feeds.push(data)
      })
      .on("end", function(){
        log("parsing finished")
        return resolve(feeds);
      })
      .on("error", function(error){
        return reject(new pr0newsError("CSV Parsing Error"));
      });
  });
}

var parseArticle = function(feed){
  return new Promise(function(resolve, reject) {

    Promise.try(function(){
      //=== GET ALL ARTICLES ===
      return new Promise(function(resolve, reject) {
        var feedparser = new FeedParser();
        var req = request(feed.url, {timeout: 1500});
        var articles = [];
        req.on('response', function(res){
          var stream = this;
          if(res.statusCode !== 200){
            return reject(new pr0newsError("Request Statuscode Error"));
          }
          else {
            stream.pipe(feedparser);
          }
        });
        feedparser.on('readable', function(){
          var stream = this;
          var meta = this.meta;
          var item;
          while (item = stream.read()) {
            item.url = item.origlink ? item.origlink : item.link;
            item.category = feed.category;
            item.language = feed.language;
            item.publisher = feed.publisher;
            articles.push(item);
          }
        });
        feedparser.on('end', function(){
          if(articles.length == 0){
            log("Error on:" + feed.url);
            return reject(new pr0newsError("Articles Error"));
          } else {
            //log(articles[0].publisher + " | " + articles.length);
          }
          return resolve(articles);
        })
        //ERROR
        req.on('error', function(error){
          console.log(error);
          log(feed.url);
          return reject(new pr0newsError("Request Error"));
        });
        feedparser.on('error', function(error){
          console.log(error);
          return reject(new pr0newsError("Feedparser Error"));
        });
      });
      //=== GET ALL ARTICLES - END ===
    })
    .then(function(articles){

      //=== DB ===
      return new Promise(function(resolve, reject) {
        log(articles[0].publisher + " | " + articles.length);
      });
    });
  });
}


var log = function(text){
  console.log("["+ moment().format('DD.MM.YY HH:mm:ss.SS') + "][Worker] "+ text);
}

//======================================== E R R O R ==========================================
function pr0newsError(message) {
    this.message = message;
    this.name = "pr0newsError";
    Error.captureStackTrace(this, pr0newsError);
}

pr0newsError.prototype = Object.create(Error.prototype);
pr0newsError.prototype.constructor = pr0newsError;

//======================================== END ==========================================
