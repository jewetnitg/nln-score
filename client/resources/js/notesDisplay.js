socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var newFragmentPath = getFragmentPath(data.piece,data.fragments[1]);
	$('.fragment').toggleClass("current-fragment");
	setTimeout(function(){		
		changeScore($('.fragment:not(.current-fragment)'),newFragmentPath);
	},1000);

});

function changeScore(element,scoreXmlPath){
        $.get(scoreXmlPath, function(data) {
        	console.log(data);
			var doc = new Vex.Flow.MusicXML.Document(data);
          	return VexFlow_Viewer = new Vex.Flow.MusicXML.Viewer($(element)[0], doc);
		});
}

function getFragmentPath(piece,fragment){
	var instrument = "conductor";
	if($("#instrument-select").size() > 0){
		instrument = $("#instrument-select").val();
	}
	return "/xmlfragments/"+piece+"/"+instrument+"/"+fragment;
}

$(document).ready(function(){
		$.get("/currentFragments", function(data) {
			changeScore($('.fragment:not(.current-fragment)'),getFragmentPath(1,data[0]));
			changeScore($('.fragment.current-fragment'),getFragmentPath(1,data[1]));
		});
});