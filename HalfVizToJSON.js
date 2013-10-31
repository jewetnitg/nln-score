exports.halfVizToJSON = function (graph) {
    var JSONGraph = [
        {}
    ];
    graph = graph.split("\n");
    var lines = [];
    for (l in graph) {
        if (graph[l][0] != ";") {
            lines.push(graph[l]);
        }
    }
//    console.log("graph",graph);

//    console.log("lines",lines);

    for (l in lines) {
        var line = lines[l].replace(/ /g, '');

//        console.log(line.length);
        if (line.length == 0) {
            JSONGraph[JSONGraph.length] = {};
        }else{
            line = line.split("->");
            if (!JSONGraph[JSONGraph.length - 1][line[0]]) {
                JSONGraph[JSONGraph.length - 1][line[0]] = [];
            }
            JSONGraph[JSONGraph.length - 1][line[0]].push(line[1]);
        }
    }

    console.log("jsonGraph is",JSONGraph,"line is",line);

    return JSONGraph;
}

exports.halfVizToGraff = function (graph) {
	var GROUP_DISTANCE_CONST = 20;//calibrate this
    var JSONGraph = [
        {}
    ];
    graph = graph.split("\n");
    var lines = [];
    for (l in graph) {
        if (graph[l][0] != ";") {
            lines.push(graph[l].replace(/ /g, ''));
        }
    }

	var currentGroup = 0;
	var edgeIndex = 0;
    for (l in lines) {
        var line = lines[l].replace(/ /g, '');;
        if (line.length == 0) {
            currentGroup++;

// dit doet nu niks meer? de 'currentgroup' gebaseerd op line break is verwarrend
			console.log("currentGroup is: " + currentGroup);
        }else{
            line = line.split("->");
			var groupDistance =  Math.abs(line[0][0] - line[1][0]) * GROUP_DISTANCE_CONST;//maybe exponential is better?
			line[line.length] = groupDistance + 100;
			console.log("line "+l+" is:", line);
            JSONGraph[edgeIndex] = line;
			edgeIndex++;
        }
    }

    console.log("graff is",JSONGraph);

    return JSONGraph;
}