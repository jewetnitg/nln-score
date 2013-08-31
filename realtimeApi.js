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
                console.log("fragments", fragments);
				
				var newFragment = getNextFragment(fragments[1]);
				
				if(newFragment != null){
	                fragments.splice(0, 1);
	                fragments[1] = getNextFragment(fragments[0]);
				}

                console.log("about to emit play-next-fragment", {piece: config.piece, fragments: fragmentsToArray(), scoreType: config.scoreType});
                socket.broadcast.emit('play-next-fragment', {piece: config.piece, fragments: fragmentsToArray(), scoreType: config.scoreType});
                socket.emit('play-next-fragment', {piece: config.piece, fragments: fragmentsToArray(), scoreType: config.scoreType});
            });

        });


        function getNextFragment(currentFragment) {
            var currentGroupId = currentFragment.group;
            var currentFragmentId = currentFragment.fragment;
            var fragmentsInWishedGroup = [];
            var destinations = groups[currentGroupId][currentFragmentId];
			var wishedGroup = gameplayState;

            for (i in destinations) {
                if (groups[wishedGroup][destinations[i]]) {
                    fragmentsInWishedGroup.push(destinations[i]);
                }
            }

            var randomIndex = Math.floor(
                Math.random() * fragmentsInWishedGroup.length
            );

			var nextFragment = {fragment:fragmentsInWishedGroup[randomIndex],group:wishedGroup};
			if(nextFragment.fragment == null){
				nextFragment = null;
			}
			console.log("next fragment json object is:",nextFragment);
            return nextFragment;
        }

        function fragmentsToArray() {
            return [fragments[0].fragment, fragments[1].fragment];
        }
    }
}
