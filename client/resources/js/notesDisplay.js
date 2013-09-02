socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var newFragmentPath = getFragmentPath(data.piece,data.fragments[1],data.scoreType);
	$('.fragment').toggleClass("current-fragment");	
	changeScore($('.fragment:not(.current-fragment)'),newFragmentPath,data.scoreType);
});

$(document).ready(function(){
	initializeNotesDisplay();
});

function initializeNotesDisplay(){
    $.get("/currentFragments", function(data) {
        console.log(data);
        changeScore(
            $('.fragment:not(.current-fragment)'),
            getFragmentPath(1,data.fragments[1],data.scoreType)
            ,data.scoreType);
        changeScore(
            $('.fragment.current-fragment')
            ,getFragmentPath(1,data.fragments[0],data.scoreType)
            ,data.scoreType);
    });
}


function changeScore(element,scorePath,type){
	if(element.data("score-path") != scorePath){
		element.data("score-path",scorePath);
	
   		if(type === "xml"){
        	return changeScoreXml(element,scorePath);
    	}else if(type === "img"){
        	return changeScoreImg(element,scorePath);
    	}
	}
}

function changeScoreXml(element,scoreXmlPath){
        $.get(scoreXmlPath, function(data) {
        	console.log(data);
			var doc = new Vex.Flow.MusicXML.Document(data);
          	return VexFlow_Viewer = new Vex.Flow.MusicXML.Viewer($(element)[0], doc);
		});
}

function changeScoreImg(element,newFragmentPath){
	    $(element).css('background-image', 'url(' + newFragmentPath + ')');
}

function getFragmentPath(piece,fragment,scoreType){
    console.log(scoreType);
	var instrument = "conductor";
	if($("#instrument-select").size() > 0){
		instrument = $("#instrument-select").val();
	}
    var path = "/"+scoreType+"fragments/"+piece+"/"+instrument+"/"+fragment;
    console.log(path);
	return path;
}