function halfVizToJSON(graph){
    var JSONGraph = "{\"lines\":[";
    graph.split("\n");
    var lines = [];
    for(l in graph){
        if(graph[l].length > 0 && graph[l][0] != ";"){
            lines.push(graph[l]);
        };
    }

    for(l in lines){
        if(l!=0){
            JSONGraph += ",";
        }
        var line = lines[l];
        line.split("->");
        JSONGraph += "["+line[0]+","+line[2]+"]";
    }
    JSONGraph += "]}";
    return JSONGraph;
}