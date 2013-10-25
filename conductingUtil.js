exports.getNextFragment = function (currentFragment,wishedGroup,currentPath,jsonGraph,graffObject) {
	var _ = require('underscore');
	
//	var newPath = currentPath;
// THAN deleted currentPath; want anders maakt ie eerst het HELE pad af voordat ie naar een nieuwe status luistert...
	var newPath = '';
	if(!newPath){
		// deleted || newPath.length == 0
		// hoezo newPath.length == 0, herhaling moet toch gewoon kunnen als dat is ingevoerd!?!?
		// eventueel kans iets kleiner maken, maar niet 'onmogelijk' maken


		newPath = createNewPath(currentFragment,wishedGroup,jsonGraph,graffObject);
	}
	var nextFragment = null;
	if(newPath && newPath.length){
		nextFragment = newPath[0];
		newPath.splice(0,1);
	}
	return {path:newPath,fragment:nextFragment};

// function to create the new path	
	function createNewPath(currentFragment,wishedGroup,jsonGraph,graffObject){
	    var fragmentsInWishedGroup = getFragmentsInWishedGroup(jsonGraph,wishedGroup);
// breadth first
		var SuccessorsInWishedGroup	= checkIfSuccessorsInWishedGroup(jsonGraph,currentFragment,wishedGroup);
		if (SuccessorsInWishedGroup !=0)
		{
	    var randomIndex2 = Math.floor(
	        Math.random() * SuccessorsInWishedGroup.length
	    );
		var nextFragmentThan = SuccessorsInWishedGroup[randomIndex2];
		console.log("breadthFirst = " + nextFragmentThan);

// if nextFragment == currentFragment check for new path to make it less probable		
		if (nextFragmentThan ==  currentFragment)
		{
			console.log("OH WAUW, it was the same and I rechecked it!" + nextFragmentThan + currentFragment );
		    var randomIndex3 = Math.floor(
	        Math.random() * SuccessorsInWishedGroup.length
	    );
		var nextFragmentThan = SuccessorsInWishedGroup[randomIndex3];
		}

		var path = graffObject.get_path(currentFragment,nextFragmentThan,true);		
		}
// else (no breadth first) try dijkstra's 'shortest route'
		else
		{
			var shortestPath = 0;	    
// beter foreach fragmentsInWishedGroup ipv random, opdat kortste route bepaald kan worden naar group!
// pakt nu 't eerste de beste kortste pad, mooier is een array met zelfde lengtes en dan random kiezen
			for(var k in fragmentsInWishedGroup)
			{	
			var path = graffObject.get_path(currentFragment,fragmentsInWishedGroup[k],true);
				if (path)
				{
					if (path[1]<shortestPath || shortestPath == 0)
					{
					var shortestPath = path;
					}
				console.log("path = " + path[0] + " length = " + path[1]);
				}
			}
		console.log("shortestpath = " + shortestPath);
// shortest path mag niet "0" zijn, dan is er een error, fiks dat
	if (shortestPath==0)
	{
		console.log("SOMEHOW IT GOT STUCK, DONT KNOW WHY!!! You might want to check you data structure... I had it once with a 'space' after a value…! " + shortestPath);
	}
		var path = shortestPath;
		}
	
		if(path){
			var path = path[0];
			path.splice(0,1);
		}

		console.log("Path from current fragment " + currentFragment + "  To next fragment (if breadth first, otherwise path): ",path);
		return path;
	}

// Function breadth first (one level only)
	function checkIfSuccessorsInWishedGroup(jsonGraph,currentFragment,wishedGroup){

		var SuccessorsInWishedGroup	= [];
// THAN moet efficienter kunnen: overzicht successors…
	    for (var i in jsonGraph) {
// check successor for current fragment
			if (jsonGraph[i][0]==currentFragment){
// check if successor is in wishedGroup			
			var nodeGroup = jsonGraph[i][1].split(".")[0];
// and if so add it to the successors!!! 
				if(nodeGroup == wishedGroup){
					SuccessorsInWishedGroup.push(jsonGraph[i][1]);	
				}
			}
	    }
		console.log("successors in wished group = " + SuccessorsInWishedGroup);
		return SuccessorsInWishedGroup;
	}

	function getFragmentsInWishedGroup(jsonGraph,wishedGroup){
	    var fragmentsInWishedGroup = [];
	    for (var i in jsonGraph) {
//			console.log("checking if "+jsonGraph[i][0]+" is in wished group "+ wishedGroup);
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