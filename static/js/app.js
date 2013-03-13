$(function() {
    var stage = $('#stage')

    stage.bind('dblclick', function(ev) {
        if (stage.hasClass('zoom')) {
            stage.removeClass('zoom')
            return
        }

        if (ev.target.id == 'stage') {
            stage.append(box())
        }
    })

    $(window).bind('keydown', function(ev) {
        if (ev.keyCode == 90) {
            stage.toggleClass('zoom')
        }
    })

    $(window).bind('mousedown', function(ev) {
        if (ev.which == 2) { // Middle click
            stage.toggleClass('zoom')
        }
    })

    $(window).bind('contextmenu', function(ev) {
        // Create our own :)
        console.log(ev.target)
        cmenu(ev)
        return false
    })
})

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

function cmenu(ev) {
    $('#cmenu').remove()
    var cmenu = $('<div id="cmenu"><ol></ol></div>')

    cmenu.css('top',ev.clientY).css('left', ev.clientX)

    console.log(ev)
    var menu = cmenu.find('ol')
    var p1 = $('<li>Create content</li>')

    menu.append(p1)

    $('body').append(cmenu).bind('click', function(ev) {
        cmenu.remove()
    })
}
