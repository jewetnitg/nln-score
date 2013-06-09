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

    $(document).ready(function () {
        $('.fragment').click(function () {
            if ($("#instrument-select").val().indexOf("conductor") >= 0) {
                console.log("about to emitnext-fragment-conducted");
                socket.emit('next-fragment-conducted', {});
            }
        });
    });
});

