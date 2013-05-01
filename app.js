var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  
var gameplayState = 1;
var fragments = [1,2];
var piece = 1;
var groups = require(__dirname+"/pieces/"+piece+"/"+"groups.json");
var instruments = require(__dirname+"/pieces/"+piece+"/"+"instruments.json");
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

app.get('/instruments', function (req, res) {
	res.json(instruments);
});

app.get('/fragments/:piece/:instrument/:fragment', function (req, res) {
	res.sendfile(__dirname+"/pieces/"+req.params.piece+"/"+req.params.instrument+"/"+req.params.fragment+".jpg");
});
app.get('/xmlfragments/:piece/:instrument/:fragment', function (req, res) {
	res.sendfile(__dirname+"/pieces/"+req.params.piece+"/"+req.params.instrument+"/"+req.params.fragment+".xml");
});

io.sockets.on('connection', function (socket) {
	socket.emit('connected', { hello: 'world' });
	socket.emit('play-next-fragment', {piece:piece, fragments: fragments});
	
	socket.on('my other event', function (data) {
    	console.log(data);
	});
  
	socket.on('set-gameplay-state', function (data) {
		console.log("set-gameplay-state caught",data);
		gameplayState = data.gameplayState;
	});

	socket.on('next-fragment-conducted', function (data) {
		console.log("caught next-fragment-conducted");
		fragments.splice(0, 1);
		fragments[1] = getNextFragment();
		
		console.log("about to emit play-next-fragment", {piece:piece, fragments: fragments});
		socket.broadcast.emit('play-next-fragment', {piece:piece, fragments: fragments});
		socket.emit('play-next-fragment', {piece:piece, fragments: fragments});
	});
	  
});

function getNextFragment(){
	var randomIndex = Math.floor(Math.random()*groups[gameplayState].length);
	console.log("groups",groups);
	console.log("groups["+gameplayState+"]",groups[gameplayState]);
	console.log("randomIndex: " + randomIndex);
	console.log("about to return  nextFragment: " + groups[gameplayState][randomIndex], groups);
	return groups[gameplayState][randomIndex];
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/instrumentalist.html');
});
