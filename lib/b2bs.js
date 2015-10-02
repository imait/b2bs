// -*- coding: utf-8-unix; mode: javascript -*-

// b2bs
// 
// b2bs is a programme.
// 
// Author: 2015 IMAI Toshiyuki
// 
// Copyright (c) 2015 IMAI Toshiyuki
// 
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php


var prefix_of_id_for_catalyst = 'CAT_';

// functions to get text

function get_text_get_catalyst(catalyst_id) {
    switch (language_set) {
    case 'en':
	return 'You got the ' + catalysts[catalyst_id] + '.';
    case 'jp':
	return catalysts[catalyst_id] + 'を手に入れた。';
    }
}

function get_text_lost_catalyst(catalyst_id) {
    switch (language_set) {
    case 'en':
	return 'You lost the ' + catalysts[catalyst_id] + '.';
    case 'jp':
	return catalysts[catalyst_id] + 'を失った。';
    }
}

function get_text_chose_option() {
    switch (language_set) {
    case 'en':
	return 'You chose "' + event.srcElement.value + '".';
    case 'jp':
	return '「' + event.srcElement.value + '」を選んだ。';
    }
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
	li.setAttribute('id', 
			prefix_of_id_for_catalyst + condition.catalysts[i]);
	cat_list.appendChild(li);
    }
}

function reset_characters_list(env) {
    var char_list = document.getElementById('CHAR_LIST');
    for (var i = char_list.childNodes.length - 1; i > 0; i--) {
	char_list.removeChild(char_list.childNodes[i]);
    }

    for (var key in env.characters) {
	var li = document.createElement('li');
	var text = document.createTextNode(env.characters[key].getFullName());
	li.appendChild(text);
	char_list.appendChild(li);
    }
}

// Class Environs

function Environs() {
}

Environs.prototype.characters = {};

Environs.prototype.loadCharacters = function() {
    if (window.XMLHttpRequest) {
        var http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        var http_request = new ActiveXObject('Microsoft.XMLHTTP');
    }

    var obj = {characters: this.characters,
	       environs: this,
	       create_character: function(result) {
		   for (var key in result) {
		       this.characters[key] = new Character();
		       this.characters[key].setName(result[key]['name']);
		       this.characters[key].setFamilyName(result[key]['family_name']);
		       this.characters[key].setStamina(result[key]['stamina']);
		       this.characters[key].setSkill(result[key]['skill']);
		       this.characters[key].setLuck(result[key]['luck']);
		       this.characters[key].setLove(result[key]['love']);
		   }
	       },
	       f: function(){
		   if (http_request.readyState == 4) {
		       if (http_request.status == 200) {
			   var result = eval('(' + 
					     http_request.responseText + 
					     ')');
			   this.create_character(result);
			   reset_characters_list(this.environs);
		       } else {
			   if (http_request.responseText && 
			       http_request.status == 0) {
			       var result = eval('(' + 
						 http_request.responseText + 
						 ')');
			   }
		       }
		   }
	       }
	      }

    http_request.onreadystatechange = function(){obj.f.apply(obj)};
  
    http_request.open('get', './init/characters.json');
    http_request.setRequestHeader('Content-Type', 
				  'application/x-www-form-urlencoded');
    http_request.send(null);
}


// Class Character

function Character() {
}

Character.prototype.name;
Character.prototype.family_name;
Character.prototype.max_stamina;
Character.prototype.stamina;
Character.prototype.max_skill;
Character.prototype.skill;
Character.prototype.max_luck;
Character.prototype.luck;
Character.prototype.love;

Character.prototype.setName = function(name) {
    this.name = name;
}

Character.prototype.setFamilyName = function(family_name) {
    this.family_name = family_name;
}

Character.prototype.getFullName = function(separator) {
    if (separator == undefined) {
	separator = ' ';
    }
    return this.family_name + separator + this.name;
}

Character.prototype.setStamina = function(stamina) {
    this.max_stamina = stamina;
    this.stamina = stamina;
}

Character.prototype.addToStamina = function(point) {
    if (point + this.stamina >= this.max_stamina) {
	this.stamina = this.max_stamina;
    } else {
	this.stamina += point;
    }
    return this.stamina;
}

Character.prototype.subtractFromStamina = function(point) {
    if (this.stamina - point <= 0) {
	this.stamina = 0;
    } else {
	this.stamina -= point;
    }
    return this.stamina;
}

Character.prototype.setSkill = function(skill) {
    this.max_skill = skill;
    this.skill = skill;
}

Character.prototype.addToSkill = function(point) {
    if (point + this.skill >= this.max_skill) {
	this.skill = this.max_skill;
    } else {
	this.skill += point;
    }
    return this.skill;
}

Character.prototype.subtractFromSkill = function(point) {
    if (this.skill - point <= 0) {
	this.skill = 0;
    } else {
	this.skill -= point;
    }
    return this.skill;
}

Character.prototype.setLuck = function(luck) {
    this.max_luck = luck;
    this.luck = luck;
}

Character.prototype.addToLuck = function(point) {
    if (point + this.luck >= this.max_luck) {
	this.luck = this.max_luck;
    } else {
	this.luck += point;
    }
    return this.luck;
}

Character.prototype.subtractFromLuck = function(point) {
    if (this.luck - point <= 0) {
	this.luck = 0;
    } else {
	this.luck -= point;
    }
    return this.luck;
}

Character.prototype.setLove = function(love) {
    this.love = love;
}


// Class EventManager

function EventManager(conditions, environs, event_id, event_dir, extension) {
    this.conditions = conditions;
    this.environs = environs;
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
EventManager.prototype.environs;
EventManager.prototype.event;
EventManager.prototype.event_id;
EventManager.prototype.event_dir = './events/';
EventManager.prototype.extension = '.json';
EventManager.prototype.functions = {};

EventManager.prototype.load = function() {
    if (window.XMLHttpRequest) {
        var http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        var http_request = new ActiveXObject('Microsoft.XMLHTTP');
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
	this.processCatalyst();
	next = this.event.next();
	this.next();
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

EventManager.prototype.processCatalyst = function() {
    var index = prefix_of_id_for_catalyst + this.event.current_line['item_id'];
    var target = document.getElementById(index);
    if (!target) {return;}

    switch (this.event.current_line['action']) {
    case 'open':
	switch (this.event.current_line['function']) {
	case 'replace':
	    var func = {catalyst_line: target,
			index: index,
			person: this.event.current_line['person'],
			target: this.event.current_line['target'],
			linenumber: this.event.current_line['goto'],
			eventmanager: this,
			f: function() {
			    var tmp = this.eventmanager.environs.characters[this.person]['love'][this.target]['love'];
			    this.eventmanager.environs.characters[this.person]['love'][this.target]['love'] = this.eventmanager.environs.characters[this.person]['love'][this.target]['hate'];
			    this.eventmanager.environs.characters[this.person]['love'][this.target]['hate'] = tmp;
			    this.catalyst_line.setAttribute('onClick', '');
			    this.catalyst_line.setAttribute('class', '');
			    delete this.eventmanager.functions[index];
			    this.eventmanager.event.goToLine(this.linenumber);
			    this.eventmanager.next();
			}
		       }
	    break;
	case 'copy':
	    var func = {catalyst_line: target,
			index: index,
			self: this.event.current_line['self'],
			person: this.event.current_line['person'],
			target: this.event.current_line['target'],
			linenumber: this.event.current_line['goto'],
			eventmanager: this,
			f: function() {
			    this.eventmanager.environs.characters[this.person]['love'][this.target]['love'] = this.eventmanager.environs.characters[this.self]['love'][this.target]['love'];
			    this.catalyst_line.setAttribute('onClick', '');
			    this.catalyst_line.setAttribute('class', '');
			    delete this.eventmanager.functions[index];
			    this.eventmanager.event.goToLine(this.linenumber);
			    this.eventmanager.next();
			}
		       }
	    break;
	}

	this.functions[index] = function() {func.f.apply(func);};
	target.setAttribute('onClick', 'em.functions["' + index + '"]()');
	target.setAttribute('class', 'usable');

	break;
    case 'close':
	target.setAttribute('onClick', '');
	target.setAttribute('class', '');
	delete this.functions[index];
	break;
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
