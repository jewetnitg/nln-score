var app = require('express')()
  ,server = require('http').createServer(app)
  ,config=require('./config.json')
  ,walk = require('walkdir');

 /******************************************************************\
  *
  *		READ JSON FILE TO FIND AVAILABLE INSTRUMENTS
  *
  ******************************************************************/
var instruments = require(__dirname+"/pieces/"+config.piece+"/"+"instruments.json")
    ,realtimeApi = require("./realtimeApi");
console.log(instruments);


/******************************************************************\
 *
 *		START SERVICES
 *
 ******************************************************************/
realtimeApi.createSocket(server);
server.listen(3000);



/******************************************************************\
 *
 *		AVAILABLE API CALLS
 *
 ******************************************************************/
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/pages/:page', function (req, res) {
  res.sendfile(__dirname + '/pages/'+req.params.page+'.html');
});

app.get('/resources/*',function(req,res){
	console.log("about to server resource: " + __dirname + '/client/resources/'+req.params);
	res.sendfile(__dirname + '/client/resources/'+req.params);
});

app.get('/currentFragments', function (req, res) {
    console.log(config);
	res.json({fragments:realtimeApi.fragments,scoreType:config.scoreType,piece:config.piece});
});

app.get('/instruments', function (req, res) {
	res.json(instruments);
});

app.get('/allimages', function (req, res) {
	var paths = walk.sync(__dirname+"/pieces/"+config.piece+"/");
	var imagePaths = [];
	var j = 0;
	for(i in paths){
		if(paths[i].endsWith(".png")){
			imagePaths[j] = "/imgfragments/"+paths[i].split(__dirname+"/pieces/")[1].split(".png")[0];
			j++;
		}
	}
	res.json(imagePaths);
});

app.get('/allimages/:instrument', function (req, res) {
	var paths = walk.sync(__dirname+"/pieces/"+config.piece+"/"+req.params.instrument+"/");
	var imagePaths = [];
	var j = 0;
	for(i in paths){
		if(paths[i].endsWith(".png")){
			imagePaths[j] = "/imgfragments/"+paths[i].split(__dirname+"/pieces/")[1].split(".png")[0];
			j++;
		}
	}
	res.json(imagePaths);
});

app.get('/imgfragments/:piece/:instrument/:fragment', function (req, res) {
	console.log('about to serve image',__dirname+"/pieces/"+req.params.piece+"/"+req.params.instrument+"/"+req.params.fragment+".png");
	res.sendfile(__dirname+"/pieces/"+req.params.piece+"/"+req.params.instrument+"/"+req.params.fragment+".png");
});

app.get('/xmlfragments/:piece/:instrument/:fragment', function (req, res) {
	res.sendfile(__dirname+"/pieces/"+req.params.piece+"/"+req.params.instrument+"/"+req.params.fragment+".xml");
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/instrumentalist.html');
});

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};