$(document).ready(function(){
  $("[data-slider]")
    .each(function () {
      var input = $(this);
      $("<span>")
        .addClass("output")
        .insertAfter($(this));
    })
    .bind("slider:changed", onSliderChange);  
    onSliderChange({currentTarget:$(".gamevar-slider")},{value:0});
});

function onSliderChange(event, data) {
	console.log(event);
      $(event.currentTarget)
        .nextAll(".output:first")
          .html(data.value.toFixed(3));
		console.log("about to emit setgameplaystate: " + data.value);
        socket.emit('set-gameplay-state', { gameplayState: data.value });    
}