var _ = require('underscore');

exports.getNextFragment = function (currentFragment,wishedGroup,currentPath,jsonGraph,graffObject) {	
	var newPath = '';
	if(!newPath){
		newPath = createNewPath(currentFragment,wishedGroup,jsonGraph,graffObject);
	}
	var nextFragment = null;
	
	if(newPath && newPath.length){
		nextFragment = newPath[0];
		newPath.splice(0,1);
	}
	
	return {path:newPath,fragment:nextFragment};
}

function createNewPath(currentFragment,wishedGroup,jsonGraph,graffObject){
    var fragmentsInWishedGroup = getFragmentsInWishedGroup(jsonGraph,wishedGroup,graffObject);
	var path = getBreathFirst(currentFragment,wishedGroup,jsonGraph,graffObject);
	console.log("breadth first path: " + path);
	if(!path || path == undefined){
		path = getPathToClosestFragmentFrom(currentFragment,fragmentsInWishedGroup,graffObject);

	// temporary solution as bug fix for Dijkstra not finding a route to 'itself': go to random neighbour
		if (path==0){
		// shortest path mag niet "0" zijn, dan is er een error, fiks dat
		// de bug gevonden: als er maar één waarde in een groep is dan vindt Dijkstra geen nieuwe weg naar die waarde ; )
		// aangepast in createNewPath
			var successor = getSuccessor(jsonGraph,currentFragment);
			path = graffObject.get_path(currentFragment,successor,true);
		}
	// END temporary solution as bug fix for Dijkstra not finding a route to 'itself': go to random neighbour

		console.log("dijkstra getPathToClosestFragmentFrom: " + path);
	}

	if(path){
		var path = path[0];
		path.splice(0,1);
	}

	console.log("Path from current fragment " + currentFragment + "  To next fragment (if breadth first, otherwise path): ",path);
	return path;
}

function checkIfSuccessorsInWishedGroup(jsonGraph,currentFragment,wishedGroup){
	var successorsInWishedGroup	= [];
    for (var i in jsonGraph) {
		if (jsonGraph[i][0]==currentFragment){
			var nodeGroup = jsonGraph[i][1].split(".")[0];
			if(nodeGroup == wishedGroup){
				successorsInWishedGroup.push(jsonGraph[i][1]);	
			}
		}
    }
	console.log("successors in wished group = " + successorsInWishedGroup);
	return successorsInWishedGroup;
}


function getSuccessor(jsonGraph,currentFragment){
	var successors = [];
    for (var i in jsonGraph) {
		if (jsonGraph[i][0]==currentFragment){
			var nodeGroup = jsonGraph[i][1].split(".")[0];
				successors.push(jsonGraph[i][1]);	
		}
    }

	if(successors){
		var randomIndex4 = Math.floor(
        	Math.random() * successors.length
    	);
		var successor = successors[randomIndex4];
	}
	return successor;
}

function getFragmentsInWishedGroup(jsonGraph,wishedGroup){
    var fragmentsInWishedGroup = [];
    for (var i in jsonGraph) {
		for(var j = 0; j < 1; j++){
			var nodeGroup = jsonGraph[i][j].split(".")[0];
			if(nodeGroup == wishedGroup && !_.contains(fragmentsInWishedGroup, jsonGraph[i][0])){
				fragmentsInWishedGroup.push(jsonGraph[i][j]);	
			}
		}
    }
	console.log("fragmentsInWishedGroup "+ wishedGroup +" is:" , fragmentsInWishedGroup);
	return fragmentsInWishedGroup;
}

function getBreathFirst(currentFragment,wishedGroup,jsonGraph,graffObject){
	var successorsInWishedGroup	= checkIfSuccessorsInWishedGroup(jsonGraph,currentFragment,wishedGroup);
	if(successorsInWishedGroup){
		var randomIndex2 = Math.floor(
        	Math.random() * successorsInWishedGroup.length
    	);
		var nextFragmentThan = successorsInWishedGroup[randomIndex2];
		console.log("breadthFirst = " + nextFragmentThan);

		if (nextFragmentThan ==  currentFragment){
			console.log("OH WAUW, it was the same and I rechecked it!" + nextFragmentThan + currentFragment );
	    	var randomIndex3 = Math.floor(
        		Math.random() * successorsInWishedGroup.length
    		);
			nextFragmentThan = successorsInWishedGroup[randomIndex3];
		}

		return graffObject.get_path(currentFragment,nextFragmentThan,true);
	}else{
		return null;
	}
}

/* 
 * Gebruikt dijkstra's algoritme voor het vinden van kortste paden naar fragmenten.
 * checkt voor elk fragment in de gewenste groep wat de kortse weg daarnaartoe is.
 * return een kortste pad naar een dichtstbijzijnde fragment.
 */
function getPathToClosestFragmentFrom(currentFragment,fragmentsInWishedGroup,graffObject){
	var shortestPath = 0;
	var path = null;
	// pakt nu 't eerste de beste kortste pad, mooier is een array met zelfde lengtes en dan random kiezen
	for(var k in fragmentsInWishedGroup){	
		path = graffObject.get_path(currentFragment,fragmentsInWishedGroup[k],true);
		if (path){
			if (path[1]<shortestPath || shortestPath == 0){
				var shortestPath = path;
			}
			console.log("path = " + path[0] + " length = " + path[1]);
		}
	}
//	console.log("shortestpath = " + shortestPath);
	return shortestPath;
}