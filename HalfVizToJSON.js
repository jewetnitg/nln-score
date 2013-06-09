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
        var line = lines[l];

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