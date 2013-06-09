exports.createSocket = function (server) {
    var io = require('socket.io').listen(server),
        HalfVizToJSON = require('./HalfVizToJSON'),
        fs = require('fs'),
        config = require('./config.json');
    var gameplayState = 0;
    var fragments = [
        {fragment: 1, group: 0},
        {fragment: 2, group: 0}
    ];
    exports.fragments = fragments;
    var graphPath = __dirname + "/pieces/" + config.piece + "/" + "groupsGraph.viz";

    fs.readFile(graphPath, 'utf8', function (err, data) {
        if (err) throw err;
        createSocket(
            HalfVizToJSON.halfVizToJSON(data)
        );
    });


    function createSocket(groups) {
        console.log(groups);
        io.sockets.on('connection', function (socket) {
            socket.emit('connected', { hello: 'world' });
            socket.emit('play-next-fragment',
                {
                    piece: config.piece,
                    fragments: fragmentsToArray(),
                    scoreType: config.scoreType
                }
            );

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
                console.log("fragments", fragments);

                fragments[1] = getNextFragment(fragments[0]);

                console.log("about to emit play-next-fragment", {piece: config.piece, fragments: fragmentsToArray(), scoreType: config.scoreType});
                socket.broadcast.emit('play-next-fragment', {piece: config.piece, fragments: fragmentsToArray(), scoreType: config.scoreType});
                socket.emit('play-next-fragment', {piece: config.piece, fragments: fragmentsToArray(), scoreType: config.scoreType});
            });

        });


        function getNextFragment(currentFragment) {
            var group = currentFragment.group;
            var fragment = currentFragment.fragment;
            var fragmentsInWishedGroup = [];
            var destinations = groups[group][fragment];

            for (i in destinations) {
                if (groups[gameplayState][destinations[i]]) {
                    fragmentsInWishedGroup.push(destinations[i]);
                }
            }

            var randomIndex = Math.floor(
                Math.random() * fragmentsInWishedGroup.length
            );

            return {fragment:fragmentsInWishedGroup[randomIndex],group:gameplayState};
        }

        function fragmentsToArray() {
            return [fragments[0].fragment, fragments[1].fragment];
        }
    }
}
