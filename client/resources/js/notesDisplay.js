var scoreType = "img";

socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var newFragmentPath = getFragmentPath(data.piece,data.fragments[1],scoreType);
	$('.fragment').toggleClass("current-fragment");	
	changeScore($('.fragment:not(.current-fragment)'),newFragmentPath,scoreType);
});

$(document).ready(function(){
    $.get("/currentFragments", function(data) {
        changeScore($('.fragment:not(.current-fragment)'),getFragmentPath(1,data[0]),scoreType);
        changeScore($('.fragment.current-fragment'),getFragmentPath(1,data[1]),scoreType);
    });
});


function changeScore(element,scorePath,type){
    if(type === "xml"){
        return changeScoreXml(element,scorePath);
    }else if(type === "img"){
        return changeScoreImg(element,scorePath);
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
    var nextFragment = $(element).css('background-image', 'url(' + newFragmentPath + ')');
}

function getFragmentPath(piece,fragment,type){
	var instrument = "conductor";
	if($("#instrument-select").size() > 0){
		instrument = $("#instrument-select").val();
	}
	return "/"+type+"fragments/"+piece+"/"+instrument+"/"+fragment;
}