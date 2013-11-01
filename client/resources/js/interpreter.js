var groups = 8;

$(document).ready(function(){
  $(".content-container").hide();
  $(".login-form").submit(onLoginSubmit);
  $(".gamevar-slider").change(onSliderChange);
  createButtons();
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

function onSliderChange(event) {
	console.log(event);
      $(event.currentTarget)
		console.log("about to emit setgameplaystate: " + event.value);
        socket.emit('set-gameplay-state', { gameplayState: event.value });    
}

function createButtons()
{
	for (var i=0;i<groups;i++)
	{
		var button = $("<input/>").attr("type","submit").val("Level "+i).data("value",i);
		button.click(function(e){
			$(".gamevar-slider").simpleSlider("setValue", $(e.currentTarget).data("value"))
		});
		$(".content-container").append(button);
	}
};