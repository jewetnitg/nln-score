var groups = 8;

$(document).ready(function(){
  $(".content-container").hide();
  $(".login-form").submit(onLoginSubmit);
  createButtons();
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

function onLoginSubmit(event){
    event.preventDefault();
	
	if($(".password-input").val() == "LetMeIn"){
	    $(".content-container").show();
		$(".login-container").hide();
	}else{
		alert("The password is incorrect.");	
	}
}

function onSliderChange(event, data) {
	console.log(event);
      $(event.currentTarget)
        .nextAll(".output:first")
          .html(data.value.toFixed(3));
		console.log("about to emit setgameplaystate: " + data.value);
        socket.emit('set-gameplay-state', { gameplayState: data.value });    
}

function createButtons()
{
	for (var i=0;i<groups;i++)
	{
	var button=document.createElement("BUTTON");
	button.setAttribute("onclick","alert('gameplayState: " + i + "')");
// dit moet nog als variabele worden doorgegeven aan het systeem, eventueel gewoon via de simple-slider (zie je ook meteen welke groep je zit)...
	var t=document.createTextNode("level " + i);
	button.appendChild(t);
	$(".content-container").append(button);
	}
};