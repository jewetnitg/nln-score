exports.createSocket = function (server) {
    var io = require('socket.io').listen(server),
        HalfVizToJSON = require('./HalfVizToJSON'),
        fs = require('fs'),
        config=require('./config.json');
    var gameplayState = 1;
    var fragments = [1, 2];
    exports.fragments = fragments;
    var graphPath = __dirname + "/pieces/" + config.piece + "/" + "groupsGraph.viz";

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
            socket.emit('play-next-fragment', {piece: config.piece, fragments: fragments,scoreType:config.scoreType});

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
                fragments[1] = getNextFragment(fragments[0]);

                console.log("about to emit play-next-fragment", {piece: config.piece, fragments: fragments,scoreType:config.scoreType});
                socket.broadcast.emit('play-next-fragment', {piece: config.piece, fragments: fragments,scoreType:config.scoreType});
                socket.emit('play-next-fragment', {piece: config.piece, fragments: fragments,scoreType:config.scoreType});
            });

        });

        function getNextFragment(currentFragment) {


            var randomIndex = Math.floor(Math.random() * groups[currentFragment].length);

            console.log("groups", groups);
            console.log("groups[" + currentFragment + "]", groups[currentFragment]);
            console.log("randomIndex: " + randomIndex);
            console.log("about to return  nextFragment: " + groups[currentFragment][randomIndex], groups);


            return groups[currentFragment][randomIndex];
        }
    }
}
