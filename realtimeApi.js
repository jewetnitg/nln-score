exports.createSocket = function (piece, server) {
    var io = require('socket.io').listen(server),
        HalfVizToJSON = require('./HalfVizToJSON'),
        fs = require('fs');
    var gameplayState = 1;
    var fragments = [1, 2];
    var graphPath = __dirname + "/pieces/" + piece + "/" + "groupsGraph.viz";

    fs.readFile(graphPath,'utf8', function(err, data) {
        if (err) throw err;
        createSocket(
            HalfVizToJSON.halfVizToJSON(data)
        );
    });


    function createSocket(groups){
        console.log(groups);
        io.sockets.on('connection', function (socket) {
            socket.emit('connected', { hello: 'world' });
            socket.emit('play-next-fragment', {piece: piece, fragments: fragments});

            socket.on('my other event', function (data) {
                console.log(data);
            });

            socket.on('set-gameplay-state', function (data) {
                console.log("set-gameplay-state caught", data);
                gameplayState = data.gameplayState;
            });

            socket.on('next-fragment-conducted', function (data) {
                console.log("caught next-fragment-conducted");
                fragments.splice(0, 1);
                fragments[1] = getNextFragment();

                console.log("about to emit play-next-fragment", {piece: piece, fragments: fragments});
                socket.broadcast.emit('play-next-fragment', {piece: piece, fragments: fragments});
                socket.emit('play-next-fragment', {piece: piece, fragments: fragments});
            });

        });

        function getNextFragment() {
            var randomIndex = Math.floor(Math.random() * groups[gameplayState].length);
            console.log("groups", groups);
            console.log("groups[" + gameplayState + "]", groups[gameplayState]);
            console.log("randomIndex: " + randomIndex);
            console.log("about to return  nextFragment: " + groups[gameplayState][randomIndex], groups);
            return groups[gameplayState][randomIndex];
        }
    }
}
