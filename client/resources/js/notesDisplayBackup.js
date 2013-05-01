socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var newFragmentPath = getFragmentPath(data.piece,data.fragments[1]);
	$('.fragment').toggleClass("current-fragment");
	changeBackground($('.fragment:not(.current-fragment)'),newFragmentPath);
});

function changeBackground(element,path){
	return $(element).css('background-image', 'url(' + path + ')');
}

function getFragmentPath(piece,fragment){
	var instrument = "conductor";
	if($("#instrument-select").size() > 0){
		instrument = $("#instrument-select").val();
	}
	return "/fragments/"+piece+"/"+instrument+"/"+fragment;
}
