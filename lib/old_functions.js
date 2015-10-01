function load_event(event_id, event) {
    var eid = event_id;

    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        http_request = new ActiveXObject('Microsoft.XMLHTTP');
    }
  
    http_request.onreadystatechange = function(){
        if (http_request.readyState == 4) {
            if (http_request.status == 200) {
                var result = eval('(' + http_request.responseText + ')');
		event.setEvent(result);
		do_event(event);
            } else {
                if (http_request.responseText && http_request.status == 0) {
                    var result = eval('(' + http_request.responseText + ')');
		    event.setEvent(result);
                }
            }
        }
    }
  
    http_request.open('get', './events/' + eid + '.json');
    http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http_request.send(null);
}


function do_event(event) {
//    var ev = event;
    var text = undefined;
    var next = undefined;

    switch (ev.current_line['type']) {
    case 'text':
	set_text_to_text_area(ev.current_line['text']);
	next = ev.next()
	break;
    case 'options':
	show_options(ev.current_line['options']);
	break;
    case 'catalyst':
	break;
    case 'get_event':
	switch (ev.current_line['item_type']) {
	case 'catalyst':
	    cond.setCatalyst(ev.current_line['item_id']);
	    reset_catalysts_list(cond);
	    text = 'You got the ' + catalysts[ev.current_line['item_id']] + '.';
	    set_text_to_text_area(text);
	    next = ev.next()
	    break;
	}
	break;
    case 'lost_event':
	break;
    }

    if (next == undefined) {
	close_event();
    }
}

function show_options(options) {
    var ta = document.getElementById('TEXT_AREA');
    ta.setAttribute('onclick', '');
    var parag = document.createElement('p');

    for (i = 0; i < options.length; i++) {
	var button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.setAttribute('value', options[i]['label']);
	button.setAttribute('class', 'options');
	button.setAttribute('onclick', 
			    'go_to_line(\'' + options[i]['next'] + '\');');
	parag.appendChild(button);
	parag.appendChild(document.createElement('br'));
	ta.appendChild(parag);
    }
}

function go_to_line(line_number) {
    opts = document.getElementsByClassName('options');
    for (i = 0; i < opts.length; i++) {
	opts[i].setAttribute('disabled', 'disabled');
    }
    ev.goToLine(line_number);
    set_text_to_text_area('You chose "' + event.srcElement.value + '"');
}

function close_event() {
    var ta = document.getElementById('TEXT_AREA');
    // ta.setAttribute('onclick', 'crear_text_area()')
    ta.setAttribute('onclick', '')
}

function set_text_to_text_area(text) {
    var ta = document.getElementById('TEXT_AREA');
    var parag = document.createElement('p');
    var textnode = document.createTextNode(text);

    if (ta.childNodes.length >= 5 ) {
	while (ta.childNodes.length >= 5) {
	    ta.removeChild(ta.childNodes[0]);
	}
    }

    parag.appendChild(textnode);
    ta.appendChild(parag);
    ta.setAttribute('onclick', 'do_event()')
}
