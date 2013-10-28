$(document).ready(function () {
	$("#instrument-select").change(initializeNotesDisplay);

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
            console.log("adding option", new Option(text, val));
            options[options.length] = new Option(text, val);
        });
		$("#instrument-select").val($.url().param('instrument'));
    });
});

