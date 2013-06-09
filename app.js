var app = require('express')()
  , server = require('http').createServer(app)   ;



var piece = 1;
var instruments = require(__dirname+"/pieces/"+piece+"/"+"instruments.json")
    ,realtimeApi = require("./realtimeApi").createSocket(piece,server);
console.log(instruments);

server.listen(3000);


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
	res.json(fragments);
});

app.get('/instruments', function (req, res) {
	res.json(instruments);
});

app.get('/imgfragments/:piece/:instrument/:fragment', function (req, res) {
	res.sendfile(__dirname+"/pieces/"+req.params.piece+"/"+req.params.instrument+"/"+req.params.fragment+".png");
});
app.get('/xmlfragments/:piece/:instrument/:fragment', function (req, res) {
	res.sendfile(__dirname+"/pieces/"+req.params.piece+"/"+req.params.instrument+"/"+req.params.fragment+".xml");
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/instrumentalist.html');
});
