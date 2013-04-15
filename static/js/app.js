var stage = null
var world = $('#world')
var globalvar = null

var startingGlobalMenu = false

var debug = function(str) {
    $('.console').append($('<div>' + str + '</div>')).bind('click', function(ev) { $(this).find('div').remove() })
    console.log(str)
}

$(function() {
    /* Constants */

    var fadeMouseInteractiveElementsTime = 2100
    var fadeMouseInteractiveElementsTimer = null

    /* The app*/
    stage = $('#stage')

    stageAt = Number(localStorage.getItem('stageAt'))
    if (stageAt == undefined) stageAt = 1

    $(stage).bind('touchstart', function(ev) {
        var y = ev.originalEvent.touches[0].pageY
        if (y < 15) {
            startingGlobalMenu = true
        }
        debug('touchstart - stage der')
        debug('Start Y : ' + y)
        //y = event.touches[0].pageY;
        //return false
    })

    $(stage).bind('touchmove', function(ev) {
        ev.preventDefault()
        if (startingGlobalMenu) {
            var y = ev.originalEvent.touches[0].pageY

            if (y > 30) {
                startingGlobalMenu = false
                debug('GLOBALMENU - stage')
                $('#globalmenu').toggleClass('active')
            }
            return false
        } else {
            return false
        }
    })

    $(stage).bind('touchend', function(ev) {
        debug('touchend - stage')
        //return false
    })

    $(stage).bind('click', function(ev) {
        if (world.hasClass('zoom')) {
            world.removeClass('zoom')
            return
        }

        if ($(ev.target).hasClass('stage')) {
            $(ev.target).append(box())
        } else if ($(ev.target).hasClass('box')) {
            // Do nothing for now
        }
    })

    $('#globalmenu').bind('click', function(ev) {
        $('#globalmenu').removeClass('active')
    })

    $('#globalmenu').bind('touchmove', function(ev) {
        return false
    })

    $(window).bind('keydown', function(ev) {
        debug(ev.keyCode)
        if (ev.keyCode == 90) {
            world.toggleClass('zoom')
        }
        if (ev.keyCode == 39) {
            ev.preventDefault()
            nextStage()
        } else if (ev.keyCode == 37) {
            ev.preventDefault()
            previousStage()
        }
    })

    $(window).bind('gesturechange', function(ev) {
        world.toggleClass('zoom')
    })

    $(window).bind('mousemove', function(ev) {
        // Fade out the resizers etc after some time
        if (!$('body').hasClass('mousemoving')) {
            $('body').addClass('mousemoving')
            fadeMouseInteractiveElementsTimer = window.setTimeout(function() {
                $('body').removeClass('mousemoving')
            }, fadeMouseInteractiveElementsTime, false)
        }
    })

    $(window).bind('contextmenu', function(ev) {
        // Create our own :)
        //cmenu(ev)
        //return false
    })

    $('#menu_prev').bind('click', function(ev) { previousStage() })
    $('#menu_next').bind('click', function(ev) { nextStage() })

    $('#modechanger').bind('click', function(ev) {
        $('#world').addClass('locked')
        $('.ui-draggable').draggable('disable')
        $('.ui-resizable').resizable('disable')
    })

    load()
})

function setEditMode(state) {
    if (state) {
        $('#world').removeClass('locked')
        $('.ui-draggable').draggable('enable')
        $('.ui-resizable').resizable('enable')
    } else {
        $('#world').addClass('locked')
        $('.ui-draggable').draggable('disable')
        $('.ui-resizable').resizable('disable')
    }
}

function save() {
    debug("save - " + stageAt)
    localStorage.setItem('boxes_' + stageAt, JSON.stringify(getBoxes()))
}

function load() {
    debug("load - " + stageAt)
    stage.html("")
    setBoxes(JSON.parse(localStorage.getItem('boxes_' + stageAt)))
}

function setEditMode(state) {
    if (state) {
        $('#world').addClass('locked')
        $('.ui-draggable').draggable('disable')
        $('.ui-resizable').resizable('disable')
    } else {
        $('#world').removeClass('locked')
        $('.ui-draggable').draggable('enable')
        $('.ui-resizable').resizable('enable')
    }
}

function getBoxes() {
    var boxes = []
    $('.box').each(function(i, box) {
        $(box).data('updatePositionData')()

        var boxrep = {
            bid : $(box).data('bid'),
            positionData : $(box).data('positionData'),
            metaData : $(box).data('metaData'),
            content : $(box).html(),
        }
        boxes.push(boxrep)
        bbb = box
    })

    return boxes
}

function setBoxes(boxes) {
    $(boxes).each(function(i, boxRep) {
        var tmpbox = box(boxRep)
        //tmpbox.html(boxRep.content)
        tmpbox.find('img').css('opacity','0').bind('load',function() {
            $(this).css('opacity','1')
        })
        $(stage).append(tmpbox)
    })
}

function nextStage() {
    var preStage = stageAt
    stageAt = stageAt + 1
    localStorage.setItem('stageAt', stageAt)
    if (preStage != stageAt) {
        load()
    }
}

function previousStage() {
    var preStage = stageAt
    stageAt = (stageAt == 1) ? 1 : stageAt - 1
    localStorage.setItem('stageAt', stageAt)
    if (preStage != stageAt) {
        load()
    }
}

function setStage(newStage) {
    stage = newStage
    debug(stage)
}

function box(boxData) {
    var box = $('<div class="box"></div>')
    var menu = $('<div class="menu"></div>')

    box.data('bid', Math.floor(Math.random() * 10000))

    if (boxData != undefined) {
        var positionData = boxData.positionData
        box.html(boxData.content)
        box.find('.ui-resizable-handle, .menu').remove()

        var metaData = boxData.metaData
    }

    if (positionData != undefined) {
        box.data('positionData', positionData)
    } else {
        box.data('positionData', {
            x : 0,
            y : 0,
            width : 160,
            height : 160,
        })
    }

    if (metaData != undefined) {
        box.data('metaData', metaData)
    } else {
        box.data('metaData', {
            backgroundColor : '#f9f9f9',
        })
    }

    box.data('updatePositionData', function() {
        box.data('positionData').x = box.css('left')
        box.data('positionData').y = box.css('top')
        box.data('positionData').width = box.css('width')
        box.data('positionData').height = box.css('height')

        box.data('updateMetaData')()
    })

    box.data('updateMetaData', function() {
        box.data('metaData').backgroundColor = box.css('background-color')
        box.data('metaData').colored = box.hasClass('colored')
    })

    menu.bind('click', function(ev) {
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

    box.css('background-color', box.data('metaData').backgroundColor)

    if (box.data('metaData').colored) {
        box.addClass('colored')
    }

    box.draggable(
        {
            grid : [20, 20],
            stop : function() { save() },
        }
    )

    box.resizable(
        {
            grid : [20, 20],
            stop : function() { save() },
        }
    )

    return box
}

function cmenu(ev) {
    var target = $(ev.target).parent()[0]
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

    var pb2 = $('<li>Color node</li>')
    menu.append(pb2)
    pb2.bind('click', function(ev) {
        colorNode(target)
        save()
    })

    var p2 = $('<li>Youtube content</li>')
    menu.append(p2)
    p2.bind('click', function(ev) {
        addYoutubeNode(target)
    })

    var p5 = $('<li>Wiki receiver</li>')
    menu.append(p5)
    p5.bind('click', function(ev) {
        $(target).append('<div class="wikirec"></div>')
    })

    var p3 = $('<li>Text input</li>')
    menu.append(p3)
    p3.bind('click', function(ev) {
        var node = addTextInputNode(target)
        node.callback = function() {
            var val = $(this).val()
            $.getJSON('https://api.duckduckgo.com/?q=' + encodeURI(val) + '&format=json&pretty=1&callback=?', function(data) {
                if (data != undefined ) {
                    var p = node.parent()

                    p.find('.results').remove()
                    var results = $('<div class="results"></div>')
                    p.append(results)

                    var text = (data.Abstract != "") ? data.Abstract : data.Definition
                    var source = (data.AbstractSource != "") ? data.AbstractSource : data.DefinitionSource
                    results.append($('<div class="result"><h3>' + data.Heading + '</h3><span>' + text + '</span><div class="source">Souce : ' + source + '</div></div>'))
                    $(data.RelatedTopics).each(function(i, element) {
                        var rnode = $('<div class="result"><img /><span></span></div>')
                        rnode.find('span').html(element.Result).find('a').bind('click', function(ev) {
                            ev.preventDefault()
                            if (/\/c\//.test(ev.target.href)) {
                                debug('int the this')
                                node.val(ev.target.innerText)
                                node.callback()
                            } else {
                                debug('goint to wikip')
                                var query = ev.target.innerText
                                getWiki(query)
                            }
                            return false
                        })
                        rnode.find('img').attr('src', element.Icon.URL)
                        results.append(rnode)
                    })
                }

            })
        }
        $(target).append(node)
    })

    var debug = $('<li>Debug log</li>')
    menu.append(debug)
    debug.bind('click', function(ev) {
        $(target).append('<div class="console"></div>')
    })

    var debug = $('<li>Debug log</li>')
    menu.append(debug)
    debug.bind('click', function(ev) {
        $(target).append('<div class="console"></div>')
    })

    var line = $('<li><hr /></li>')
    menu.append(line)

    var remove = $('<li>Remove</li>')
    menu.append(remove)
    remove.bind('click', function(ev) {
        removeNode(target)    
    })

    $('body').append(cmenu).bind('click', function(ev) {
        cmenu.remove()
    })
}

/* Node handling */

function removeNode(target) {
    $(target).remove()
    save()
}

/* Node types */

function addTextNode(target) {
    var write = document.createElement('div')
    $(target).append(write)
    write.contentEditable = true
    write.focus()
    write.setAttribute('data-type','node')
    write.className = 'textfield'
    write.onclick=function(ev) { ev.preventDefault(); return false }
}

function addYoutubeNode(target) {
    //var node = $('<iframe data-type="node" width="580" height="340" src="http://www.youtube.com/embed/pJTnr0L4ejc" frameborder="0" allowfullscreen></iframe>')
    var node = $('<iframe width="480" height="360" src="https://www.youtube-nocookie.com/embed/j7dizbMC_2Q" frameborder="0" allowfullscreen></iframe>')
    $(target).append(node)
}

function addTextInputNode(target) {
    var node = $('<input data-type="node" type="text" id="textInputNode"></input>')
    node.bind('click', function(ev) { ev.preventDefault() })
    node.callback = null
    node.bind('keyup', function(ev) { if (ev.keyCode == 13) { node.callback() } })

    return node
}

function addFlickrImageNode(target) {
    var imageSrc = ''
    $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?', function(data) {
        imageSrc = data.items[0].media.m
        var node = $('<img data-type="node" src="' + imageSrc + '" />')
        node.css('opacity','0')
        node.bind('load', function() {
            node.css('opacity','1')
        })
        $(target).append(node)
    })

}

function colorNode(target) {
    var r = Math.floor(Math.random() * 127) + 64
    var g = Math.floor(Math.random() * 127) + 64
    var b = Math.floor(Math.random() * 127) + 64

    var rgbstr = 'rgb(' + r + ', ' + g + ', ' + b + ')'

    $(target).css('background', rgbstr).addClass('colored')
}

/* Sources */

function getWiki(query) {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?", {page:query, prop:"text"}, function(data) {
        var wikititle = data.parse.title
        var wikitext = data.parse.text['*']
        $('.wikirec').html("").append('<div class="wikitext"><h1>' + wikititle + '</h1>' + wikitext + '</div>')
        $('.wikitext').find('img').each(function(i, e) { e.src = e.src.replace('file','https')  })
        $('.wikitext a').bind('click', function(ev) {
            ev.preventDefault()
            if (ev.target.attributes.getNamedItem('href').value.indexOf('#') == 0) {

            } else {
                getWiki(this.title)
                return false
            }
        })

        $('.wikitext > :not(h2,h1)').hide()
        $('.wikitext p').first().show()

        window.setTimeout(function() {
            $('.wikitext > h2').bind('click', function(ev) { $(this).next().toggle() })
        }, 200)

        $('.wikirec')[0].scrollByPages(-100)
    })
}
