exports.getNextFragment = function (currentFragment,wishedGroup,currentPath,jsonGraph,graffObject) {
	var _ = require('underscore');
	
	var newPath = currentPath;
	if(!newPath || newPath.length == 0){
		newPath = createNewPath(currentFragment,wishedGroup,jsonGraph,graffObject);
	}
	var nextFragment = null;
	if(newPath && newPath.length){
		nextFragment = newPath[0];
		newPath.splice(0,1);
	}
	return {path:newPath,fragment:nextFragment};
	
	function createNewPath(currentFragment,wishedGroup,jsonGraph,graffObject){
	    var fragmentsInWishedGroup = getFragmentsInWishedGroup(jsonGraph,wishedGroup);

	    var randomIndex = Math.floor(
	        Math.random() * fragmentsInWishedGroup.length
	    );
		var wishedFragment = fragmentsInWishedGroup[randomIndex];
	
		var path = graffObject.get_path(currentFragment,wishedFragment,true);
		if(path){
			var path = path[0];
			path.splice(0,1);
		}
		console.log("found path from " + currentFragment + " to " + wishedFragment,path);
	
		return path;
	}

	function getFragmentsInWishedGroup(jsonGraph,wishedGroup){
	    var fragmentsInWishedGroup = [];
	    for (var i in jsonGraph) {
			console.log("checking if "+jsonGraph[i][0]+" is in wished group "+ wishedGroup);
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
}

