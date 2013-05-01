socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var newFragmentPath = getFragmentPath(data.piece,data.fragments[1]);
	$('.fragment').toggleClass("current-fragment");
	setTimeout(function(){		
		changeScore($('.fragment:not(.current-fragment)'),newFragmentPath);
	},2000);

});

function changeScore(element,scoreXmlPath){
        var req = new XMLHttpRequest();
        uri = scoreXmlPath;
        req.open('GET', uri, true);
        req.send(null);
        return req.onreadystatechange = function() {
          if (req.readyState != 4) return;
          var doc = new Vex.Flow.MusicXML.Document(req.responseText);
          return VexFlow_Viewer = new Vex.Flow.MusicXML.Viewer($(element)[0], doc);
        };
}

function getFragmentPath(piece,fragment){
	var instrument = "conductor";
	if($("#instrument-select").size() > 0){
		instrument = $("#instrument-select").val();
	}
	return "/xmlfragments/"+piece+"/"+instrument+"/"+fragment;
}
