//======================================== N O T E S ==========================================
//feedparser https://www.npmjs.com/package/feedparser
//https://stackoverflow.com/questions/17007997/how-to-access-the-get-parameters-after-in-express
//send file
//https://stackoverflow.com/questions/22080770/i-need-to-create-url-for-get-which-is-going-to-accept-array-how-in-node-js-expr
//https://stackoverflow.com/questions/23507608/form-submission-without-page-refresh
//archive.is
//jade template engine

//======================================== D E P E N D E N C I E S==========================================
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var favicon = require('serve-favicon')
var Promise = require('bluebird');
var moment = require('moment');
moment.locale('de');

// ============================= T  E  S  T    R  A  N  G  E ========================
const spawn = require('threads').spawn;
const thread = spawn('worker.js');
const Pageres = require('pageres');

thread
		.send()
		.on('done', function(message) {
    		log("Worker finished successfully!");
  	})
		.on('error', function(error) {
    	log("Worker had an error!");
			console.error(error);
    	thread.kill();
			log("Worker was killed!");
  	});



/*
var time = moment();
const pageres = new Pageres({delay: 1})
    .src("127.0.0.1:3000", ['1000x10'], {format: "png"})
    .dest(__dirname + "/img")
    .run()
    .then(function(){
			log("Finished: " + moment(moment().diff(time)).format('mm:ss.SSS') + "  -  " + "SAVED!");
		});
*/




//======================================== S E T T I N G S ==========================================
const PORT = 3000;
process.stdin.resume();

//============================================== EXPRESS ================================================
// ======== STATIC ======
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

app.use(favicon(__dirname + '/img/pr0news-favicon.png'))

app.use(bodyParser.json({limit: '3mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '3mb'}));

// ======== SERVE INDEX ======
app.get('/', function (req, res) {res.sendFile(__dirname + '/index.html');});
app.get('/index', function (req, res) {res.sendFile(__dirname + '/index.html');});
app.get('/index.html', function (req, res) {res.sendFile(__dirname + '/index.html');});

//============================================== M A I N  ================================================


//========================================== H E L P F U N C T I O N S  ===============================
// ======== LOG ======
var log = function(text){
  console.log("["+ moment().format('DD.MM.YY HH:mm:ss.SS') + "] "+ text);
}

//======================================== E R R O R ==========================================
function pr0newsError(message) {
    this.message = message;
    this.name = "pr0newsError";
    Error.captureStackTrace(this, pr0newsError);
}
pr0newsError.prototype = Object.create(Error.prototype);
pr0newsError.prototype.constructor = pr0newsError;

// ======== EXPRESS ERROR ======
//=== 500 ===
app.use(function (err, req, res, next) {
  log(err.stack)
  res.status(500).send('Something broke!')
});

//=== 404 ===
app.get('/404.html', function (req, res) {
   res.status(404).sendFile(__dirname + '/pages/404.html');
});

app.use(function (req, res, next) {
  res.redirect('/404.html');
});

// ======== START ======
app.listen(PORT, function () {
	log("===  Server started!  ===")
  log('pr0news listening on port ' + PORT);
});

//======================================== END ==========================================
process.on('exit', exitHandler.bind());
process.on('SIGINT', exitHandler.bind());
process.on('SIGUSR1', exitHandler.bind());
process.on('SIGUSR2', exitHandler.bind());
process.on('uncaughtException', exitHandler.bind());

function exitHandler() {
	//Add Clean up here
	log("===  App closed!  ===")
	process.exit();
}
