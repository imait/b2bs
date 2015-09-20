var catalysts = {1: '昔の生徒手帳',
		 2: 'b',
		 3: '古い学校の地図',
		 4: 'BDバッヂ',
		 5: 'e'};


// functions to get text

function get_text_get_catalyst(catalyst_id) {
    // return 'You got the ' + catalysts[catalyst_id] + '.';
    return catalysts[catalyst_id] + 'を手に入れた。';
}

function get_text_lost_catalyst(catalyst_id) {
    // return 'You lost the ' + catalysts[catalyst_id] + '.';
    return catalysts[catalyst_id] + 'を失った。';
}

function get_text_chose_option() {
    // return 'You chose "' + event.srcElement.value + '".';
    return '「' + event.srcElement.value + '」を選んだ。';
}

// functions

function crear_text_area() {
    var ta = document.getElementById('TEXT_AREA');
    while (ta.childNodes.length > 0) {
	ta.removeChild(ta.childNodes[0]);
    }
}

function reset_catalysts_list(condition) {
    var cat_list = document.getElementById('CATS_LIST');
    for (var i = cat_list.childNodes.length - 1; i > 0; i--) {
	cat_list.removeChild(cat_list.childNodes[i]);
    }

    for (var i = 0, n = condition.catalysts.length; i < n; i++) {
	var li = document.createElement('li');
	var text = document.createTextNode(catalysts[condition.catalysts[i]]);
	li.appendChild(text);
	li.setAttribute('id', condition.catalysts[i]);
	cat_list.appendChild(li);
    }
}

// Class EventManager

function EventManager(conditions, event_id, event_dir, extension) {
    this.conditions = conditions;
    this.event = new Event();
    this.event_id = event_id;
    if (event_dir) {
	this.event_dir = event_dir;
    }
    if (extension) {
	this.extension = '.' + extension;
    }

    this.load()
}

EventManager.prototype.conditions;
EventManager.prototype.event;
EventManager.prototype.event_id;
EventManager.prototype.event_dir = './events/';
EventManager.prototype.extension = '.json';


EventManager.prototype.load = function() {
    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        http_request = new ActiveXObject('Microsoft.XMLHTTP');
    }

    var obj = {event: this.event,
	       em: this,
	       f: function(){
		   if (http_request.readyState == 4) {
		       if (http_request.status == 200) {
			   var result = eval('(' + 
					     http_request.responseText + 
					     ')');
			   this.event.setEvent(result);
			   this.em.next();
		       } else {
			   if (http_request.responseText && 
			       http_request.status == 0) {
			       var result = eval('(' + 
						 http_request.responseText + 
						 ')');
			       this.event.setEvent(result);
			   }
		       }
		   }
	       }
	      }

    http_request.onreadystatechange = function(){obj.f.apply(obj)};
  
    http_request.open('get', this.event_dir + this.event_id + this.extension);
    http_request.setRequestHeader('Content-Type', 
				  'application/x-www-form-urlencoded');
    http_request.send(null);
}

EventManager.prototype.next = function() {
    var text = undefined;
    var next = undefined;

    switch (this.event.current_line['type']) {
    case 'text':
	this.showText(this.event.current_line['text']);
	next = this.event.next()
	break;
    case 'options':
	this.showOptions();
	break;
    case 'catalyst':
	break;
    case 'get_event':
	switch (this.event.current_line['item_type']) {
	case 'catalyst':
	    this.conditions.setCatalyst(this.event.current_line['item_id']);
	    reset_catalysts_list(this.conditions);
	    text = get_text_get_catalyst(this.event.current_line['item_id']);
	    this.showText(text);
	    next = this.event.next()
	    break;
	}
	break;
    case 'lost_event':
	switch (this.event.current_line['item_type']) {
	case 'catalyst':
	    this.conditions.deleteCatalyst(this.event.current_line['item_id']);
	    reset_catalysts_list(this.conditions);
	    text = get_text_lost_catalyst(this.event.current_line['item_id']);
	    this.showText(text);
	    next = this.event.next()
	    break;
	}
	break;
    }

    if (next == undefined) {
	this.close();
    }
}

EventManager.prototype.showText = function(text) {
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
    ta.setAttribute('onclick', 'em.next()')
}

EventManager.prototype.showOptions = function() {
    var ta = document.getElementById('TEXT_AREA');
    ta.setAttribute('onclick', '');
    var parag = document.createElement('p');

    options = this.event.current_line['options'];

    for (var i = 0, n = options.length; i < n; i++) {
	var button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.setAttribute('value', options[i]['label']);
	button.setAttribute('class', 'options');
	button.setAttribute('onclick', 
			    'em.goToLine(\'' + options[i]['next'] + '\');');
	parag.appendChild(button);
	parag.appendChild(document.createElement('br'));
	ta.appendChild(parag);
    }
}

EventManager.prototype.goToLine = function(line_number) {
    options = document.getElementsByClassName('options');
    for (var i = 0, n = options.length; i < n; i++) {
	options[i].setAttribute('disabled', 'disabled');
    }
    this.event.goToLine(line_number);
    this.showText(get_text_chose_option());
}

EventManager.prototype.close = function() {
    var ta = document.getElementById('TEXT_AREA');
    // ta.setAttribute('onclick', 'crear_text_area()')
    ta.setAttribute('onclick', '')
}

// Class Conditions

function Conditions() {
}

Conditions.prototype.catalysts = new Array();

Conditions.prototype.setCatalyst = function(id) {
    if (this.catalysts.indexOf(id) == -1) {
	this.catalysts.push(id);
    }
}

Conditions.prototype.deleteCatalyst = function(id) {
    if (this.catalysts.indexOf(id) != -1) {
	this.catalysts.splice(this.catalysts.indexOf(id), 1);
    }
}

// Class Event

function Event() {
}

Event.prototype.title;
Event.prototype.start;
Event.prototype.lines = new Array();
Event.prototype.current_line;
Event.prototype.next_line;

Event.prototype.title;
Event.prototype.start;
Event.prototype.lines;
Event.prototype.current_line;
Event.prototype.next_line;

Event.prototype.setEvent = function(event) {
    this.title = event['title'];
    this.start = event['start'];
    this.lines = event['lines'];
    this.current_line = this.lines[this.start];
    this.next_line = this.current_line['next'];
}

Event.prototype.goToLine = function(line_number) {
    this.current_line = this.lines[line_number];
    this.next_line = this.current_line['next'];
    return this.current_line;
}

Event.prototype.next = function() {
    if (this.current_line['next']) {
	this.current_line = this.lines[this.next_line];
	this.next_line = this.current_line['next'];
	return this.current_line;
    } else {
	return undefined;
    }
}
