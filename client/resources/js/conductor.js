$(document).ready(function(){
    $(".content-container").hide();
    $(".login-form").submit(onLoginSubmit);
	$('.fragment').click(function(){
			console.log("about to emitnext-fragment-conducted");
        	socket.emit('next-fragment-conducted', {});    
    });  	
});


function onLoginSubmit(event){
    event.preventDefault();
	
	if($(".password-input").val() == "OpenSesami"){
	    $(".content-container").show();
		$(".login-container").hide();
		if("right" == $.url().param('page')){
			$("html, body").animate({ scrollTop: $(document).height() });
		}
	}else{
		alert("The password is incorrect.");	
	}
}