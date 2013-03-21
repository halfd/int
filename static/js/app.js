$(function() {
    /* Constants */

    var fadeMouseInteractiveElementsTime = 2100

    /* The app*/
    var stage = $('#stage')

    stage.bind('dblclick', function(ev) {
        if (stage.hasClass('zoom')) {
            stage.removeClass('zoom')
            return
        }

        if (ev.target.id == 'stage') {
            stage.append(box())
        } else if ($(ev.target).hasClass('box')) {
            console.log(ev.target)
            var write = document.createElement('span')
            $(ev.target).append(write)
            write.contentEditable = true
            write.focus()
            $(write).bind('click', function(ev) {
                ev.preventBubble()
            })
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

    $(window).bind('mousemove', function(ev) {
        // Fade out the resizers etc after some time
        if (!$('body').hasClass('mousemoving')) {
            $('body').addClass('mousemoving')
            var tmptimer = window.setTimeout(function() {
                $('body').removeClass('mousemoving')
            }, fadeMouseInteractiveElementsTime, false)
        }
    })

    $(window).bind('contextmenu', function(ev) {
        // Create our own :)
        //cmenu(ev)
        //return false
    })
})

function box() {
    var box = $('<div class="box"></div>')
    box.css('position','absolute')
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

    var menu = cmenu.find('ol')
    var p1 = $('<li>Create content</li>')

    menu.append(p1)

    $('body').append(cmenu).bind('click', function(ev) {
        cmenu.remove()
    })
}
