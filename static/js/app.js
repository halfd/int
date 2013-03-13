$(function() {
    var stage = $('#stage')

    stage.bind('dblclick', function() {
        if (stage.hasClass('zoom')) {
            stage.removeClass('zoom')
            return
        }

        stage.append(box())
    })

    $(window).bind('keydown', function(ev) {
        if (ev.keyCode == 90) {
            stage.toggleClass('zoom')
        }
    })


    $(window).bind('mousedown', function(ev) {
        if (ev.which == 2) {
            stage.toggleClass('zoom')
        }
    })
});

function box() {
    var box = $('<div class="box"></div>')
    box.draggable(
        {
            grid : [40, 40]
        }
    )

    box.resizable(
        {
            grid : [40, 40]
        }
    )

    return box
}
