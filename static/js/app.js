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
			// Do nothing for now
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

	load()
})

function save() {
	localStorage.setItem('boxes', JSON.stringify(getBoxes()))
}

function load() {
	setBoxes(JSON.parse(localStorage.getItem('boxes')))
}

function getBoxes() {
	var boxes = []
	$('.box').each(function(i, box) {
		console.log(i)
		console.log(box)
		var boxrep = {
			bid : $(box).data('bid'),
			positionData : $(box).data('positionData'),
		}
		boxes.push(boxrep)
	})

	return boxes
}

function setBoxes(boxes) {
	$(boxes).each(function(i, boxRep) {
		console.log(boxRep)
		var tmpbox = box(boxRep.positionData)
		$('#stage').append(tmpbox)
	})
}

function box(positionData) {
	var box = $('<div class="box"></div>')
	var menu = $('<div class="menu"></div>')

	box.data('bid', Math.floor(Math.random() * 10000))

	if (positionData != undefined) {
		box.data('positionData', positionData)
	} else {
			box.data('positionData', {
				x : 0,
				y : 0,
				width : 160,
				height : 160,
			});
	}

	box.updatePositionData = function() {
		box.data('positionData').x = box.css('left')
		box.data('positionData').y = box.css('top')
		box.data('positionData').width = box.css('width')
		box.data('positionData').height = box.css('height')

		save()
	}

	menu.bind('click', function(ev) {
		console.log("mussisisk")
		cmenu(ev)
		ev.preventDefault()
		return false
	})
	box.append(menu)

    box.css('position','absolute')
	
	box.css('top', box.data('positionData').y)
	box.css('left', box.data('positionData').x)
	box.css('width', box.data('positionData').width)
	box.css('height', box.data('positionData').height)

    box.draggable(
        {
            grid : [40, 40],
			stop : function() { box.updatePositionData() },
        }
    )

    box.resizable(
        {
            grid : [40, 40],
			stop : function() { box.updatePositionData() },
        }
    )

    return box
}

function cmenu(ev) {
	var target = $(ev.target).parent()
    $('#cmenu').remove()
    var cmenu = $('<div id="cmenu"><ol></ol></div>')

    cmenu.css('top',ev.clientY).css('left', ev.clientX)

    var menu = cmenu.find('ol')

    var p1 = $('<li>Text content</li>')
    menu.append(p1)
	p1.bind('click', function(ev) {
		addTextNode(target)	
	})

    var pa2 = $('<li>Flickr content</li>')
    menu.append(pa2)
	pa2.bind('click', function(ev) {
		addFlickrImageNode(target)	
	})

    var p2 = $('<li>Youtube content</li>')
    menu.append(p2)
	p2.bind('click', function(ev) {
		addYoutubeNode(target)	
	})

    var p3 = $('<li>Text input</li>')
    menu.append(p3)
	p3.bind('click', function(ev) {
		addTextInputNode(target)	
	})

    $('body').append(cmenu).bind('click', function(ev) {
        cmenu.remove()
    })
}

/* Node types */

function addTextNode(target) {
	var write = document.createElement('div')
	$(target).append(write)
	write.contentEditable = true
	write.focus()
	write.className = 'textfield'
}

function addYoutubeNode(target) {
	var node = $('<iframe width="580" height="340" src="http://www.youtube.com/embed/pJTnr0L4ejc" frameborder="0" allowfullscreen></iframe>')
	$(target).append(node)
}

function addTextInputNode(target) {
	var node = $('<input type="text" id="textInputNode"></input>')
	$(target).append(node)
}

function addFlickrImageNode(target) {
	var imageSrc = ''
	$.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?', function(data) {
		console.log(data.items[0].media.m)
		imageSrc = data.items[0].media.m
			var node = $('<img src="' + imageSrc + '" />')
			$(target).append(node)
	})

}
