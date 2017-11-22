var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title:  String,
  summary: String,
  url:   String,
  imageurl:   String,
  archiveis: String,
  publishdate: Date,
  publisher: String,
  language: String,
  category: String,

});
