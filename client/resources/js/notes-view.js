socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var nextFragmentPath = getFragmentPath(data.piece,data.fragments[1]);
	var nextFragment = $(".current-fragment").attr("src",nextFragmentPath);
	
	var currentFragmentPath = getFragmentPath(data.piece,data.fragments[0]);
	$(".next-fragment")
		.removeClass("next-fragment")
		.addClass("current-fragment")
		.attr("src",currentFragmentPath);
	$(nextFragment)
		.addClass("next-fragment")
		.removeClass("current-fragment");
});
