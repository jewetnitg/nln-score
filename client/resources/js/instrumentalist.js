$(document).ready(function () {
	
	$("#instrument-select").change(function(){
		initializeNotesDisplay($(this).val());
	});

    console.log("about to get instruments");
    $.get("/instruments", function (data) {
        console.log("received instruments", data);

        var select = $('#instrument-select');
		
		var options = "";
        if (select.prop) {
           options  = select.prop('options');
        } else {
           options = select.attr('options');
        }

        $('option', select).remove();

        $.each(data, function (val, text) {
            options[options.length] = new Option(text, val);
        });
		$("#instrument-select").val($.url().param('instrument'));

		if ($.url().param('instrument')) {
			initializeNotesDisplay($.url().param('instrument'));
			$("html, body").animate({ scrollTop: $(document).height() });
		}
    });
});