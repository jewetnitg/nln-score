exports.createSocket = function (server) {
    var io = require('socket.io').listen(server),
        HalfVizToJSON = require('./HalfVizToJSON'),
        fs = require('fs'),
        config = require('./config.json'),
		_ = require('underscore'),
		graff = require('graff');
    var gameplayState = 0;
    var fragments = [
        "0.1",
        "0.2"
    ];
	
    exports.fragments = fragments;
    var graphPath = __dirname + "/pieces/" + config.piece + "/" + "groupsGraph.viz";

    fs.readFile(graphPath, 'utf8', function (err, data) {
        if (err) throw err;
        createSocket(
            HalfVizToJSON.halfVizToGraff(data)
        );
    });


    function createSocket(groups) {
		var jsonGraph = groups;
		var graffObject = new graff.Graph({"edges":groups});
		console.log("graffObject is ", graffObject)
		
        io.sockets.on('connection', function (socket) {
            socket.emit('connected', { hello: 'world' });
            socket.emit('play-next-fragment',
                {
                    piece: config.piece,
                    fragments: fragments,
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
				
				console.log("newFragment is " + newFragment);
				if(newFragment){
					console.log("about to add newFragment " + newFragment);
	                fragments.splice(0, 1);
	                fragments[1] = newFragment;
				}

                console.log("about to emit play-next-fragment", {piece: config.piece, fragments: fragments, scoreType: config.scoreType});
                socket.broadcast.emit('play-next-fragment', {piece: config.piece, fragments: fragments, scoreType: config.scoreType});
                socket.emit('play-next-fragment', {piece: config.piece, fragments: fragments, scoreType: config.scoreType});
            });

        });

		var currentPath = [];

        function getNextFragment(currentFragment) {
			if(!currentPath || currentPath.length == 0){
	            var fragmentsInWishedGroup = [];
				var currentGroup = currentFragment.split(".")[0];
				var wishedGroup = gameplayState;

	            for (var i in jsonGraph) {
					console.log("checking if "+jsonGraph[i][0]+" is in wished group "+ wishedGroup);
					var nodeGroup = jsonGraph[i][0].split(".")[0];
					if(nodeGroup == wishedGroup && !_.contains(fragmentsInWishedGroup, jsonGraph[i][0])){
						fragmentsInWishedGroup.push(jsonGraph[i][0]);	
					}
	            }
		
				console.log("fragmentsInWishedGroup "+ wishedGroup +" is:" , fragmentsInWishedGroup);

	            var randomIndex = Math.floor(
	                Math.random() * fragmentsInWishedGroup.length
	            );

				var wishedFragment = fragmentsInWishedGroup[randomIndex];
			
				currentPath = graffObject.get_path(currentFragment,wishedFragment,true);
				if(currentPath){
					var path = currentPath[0];
					path.splice(0,1);
					currentPath = path;
				}
			
				console.log("found path from " + currentFragment + " to " + wishedFragment,currentPath);
			}
			if(currentPath && currentPath.length){
				var nextFragment = currentPath[0];
				currentPath.splice(0,1);
				//console.log("next fragment json object is:",nextFragment);
				return nextFragment;
			}else{
				return null;
			}

        }
    }
}
