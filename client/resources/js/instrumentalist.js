$(document).ready(function () {

    console.log("about to get instruments");
    $.get("/instruments", function (data) {
        console.log("received instruments", data);

        var select = $('#instrument-select');

        if (select.prop) {
            var options = select.prop('options');
        } else {
            var options = select.attr('options');
        }

        $('option', select).remove();

        $.each(data, function (val, text) {
            console.log("adding option", new Option(text, val));
            options[options.length] = new Option(text, val);
        });

    });
	
	$("#instrument-select").change(initializeNotesDisplay);
});

