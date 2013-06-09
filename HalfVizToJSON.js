exports.halfVizToJSON = function(graph){
    var JSONGraph = {};
    graph = graph.split("\n");
    var lines = [];
    for(l in graph){
        if(graph[l].length > 0 && graph[l][0] != ";"){
            lines.push(graph[l]);
        };
    }

    for(l in lines){
        var line = lines[l];
        line = line.split("->");
        if(!JSONGraph[line[0]]){
            JSONGraph[line[0]] = [];
        }
        JSONGraph[line[0]].push(line[1]);
    }
    return JSONGraph;
}