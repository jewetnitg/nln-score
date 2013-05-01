$(document).ready(function(){
	$('.fragment').click(function(){
			console.log("about to emitnext-fragment-conducted");
        	socket.emit('next-fragment-conducted', {});    
    });  	
});

