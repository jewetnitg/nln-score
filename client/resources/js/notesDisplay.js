socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var newFragmentPath = getFragmentPath(data.piece,data.fragments[1],data.scoreType);
	$('.fragment').toggleClass("current-fragment");	
	changeScore($('.fragment:not(.current-fragment)'),newFragmentPath,data.scoreType);
});

$(document).ready(function(){
	initializeNotesDisplay($.url().param('instrument'));
});

function initializeNotesDisplay(instrument){
	preloadImages(instrument,function(){
	    $.get("/currentFragments", function(data) {
	        console.log("currentFragments on initialize",data);
	        changeScore(
	            $('.fragment:not(.current-fragment)'),
	            getFragmentPath(data.piece,data.fragments[1],data.scoreType)
	            ,data.scoreType);
	        changeScore(
	            $('.fragment.current-fragment')
	            ,getFragmentPath(data.piece,data.fragments[0],data.scoreType)
	            ,data.scoreType);
	    });	
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
	console.log("document.images[newFragmentPath]: " +  document.images[newFragmentPath]);
	console.log('$(".fragment div" ): ' + $(".fragment div" ));
	if(document.images[newFragmentPath] && 
		($(".fragment div" )[0] == document.images[newFragmentPath][0] ||
		$(".fragment div" )[1] == document.images[newFragmentPath][0])  ){
		$(element).html(document.images[newFragmentPath].clone());
	}else{
		$(element).html(document.images[newFragmentPath]);
	}
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

document.images;
function preloadImages(instrument,done){
	$.get("/allimages/"+instrument+"/",function(data){
			console.log("allimages: ",data);
			var imageLoader = $("<div id='image-Loader'/>");
			for(i in data){
				document.images[data[i]] = $("<div/>").css('background-image', 'url(' +  data[i] + ')');
				imageLoader.append(document.images[data[i]]);
			}
			$("body").append(imageLoader)
			$("#imageLoader").remove();
			done();
	});

}
