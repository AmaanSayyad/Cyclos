/**
 * CssUserAgent (cssua.js) v2.1.28
 * http://cssuseragent.org
 * 
 * Copyright (c)2006-2014 Stephen M. McKamey.
 * Licensed under The MIT License.
 */
/*jshint smarttabs:true, regexp:false, browser:true */

/**
 * @type {Object}
 */
var cssua = (

/**
 * @param html {Object} root DOM element
 * @param userAgent {string} browser userAgent string
 * @return {Object}
 */
function(html, userAgent, sa) {
	'use strict';

	/**
	 * @const
	 * @type {string}
	 */
	var PREFIX = ' ua-';

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_Platform = /\s*([\-\w ]+)[\s\/\:]([\d_]+\b(?:[\-\._\/]\w+)*)/;

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_Version = /([\w\-\.]+[\s\/][v]?[\d_]+\b(?:[\-\._\/]\w+)*)/g;

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_BlackBerry = /\b(?:(blackberry\w*|bb10)|(rim tablet os))(?:\/(\d+\.\d+(?:\.\w+)*))?/;

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_Silk = /\bsilk-accelerated=true\b/;

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_FluidApp = /\bfluidapp\b/;

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_desktop = /(\bwindows\b|\bmacintosh\b|\blinux\b|\bunix\b)/;

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_mobile = /(\bandroid\b|\bipad\b|\bipod\b|\bwindows phone\b|\bwpdesktop\b|\bxblwp7\b|\bzunewp7\b|\bwindows ce\b|\bblackberry\w*|\bbb10\b|\brim tablet os\b|\bmeego|\bwebos\b|\bpalm|\bsymbian|\bj2me\b|\bdocomo\b|\bpda\b|\bchtml\b|\bmidp\b|\bcldc\b|\w*?mobile\w*?|\w*?phone\w*?)/;

	/**
	 * @const
	 * @type {RegExp}
	 */
	var R_game = /(\bxbox\b|\bplaystation\b|\bnintendo\s+\w+)/;

	/**
	 * The root CssUserAgent
	 * @type {Object}
	 */
	var cssua = {

		parse:
			/**
			 * @param uaStr {string}
			 * @return {Object}
			 */
			function(uaStr, sa) {

				/**
				 * @type {Object}
				 */
				var ua = {};
				if (sa) {
					ua.standalone = sa;
				}

				uaStr = (''+uaStr).toLowerCase();
				if (!uaStr) {
					return ua;
				}

				var i, count, raw = uaStr.split(/[()]/);
				for (var j=0, rawCount=raw.length; j<rawCount; j++) {
					if (j%2) {
						// inside parens covers platform identifiers
						var platforms = raw[j].split(';');
						for (i=0, count=platforms.length; i<count; i++) {
							if (R_Platform.exec(platforms[i])) {
								var key = RegExp.$1.split(' ').join('_'),
									val = RegExp.$2;

								// if duplicate entries favor highest version
								if ((!ua[key] || parseFloat(ua[key]) < parseFloat(val))) {
									ua[key] = val;
								}
							}
						}

					} else {
						// outside parens covers most version identifiers
						var uas = raw[j].match(R_Version);
						if (uas) {
							for (i=0, count=uas.length; i<count; i++) {
								var parts = uas[i].split(/[\/\s]+/);
								if (parts.length && parts[0] !== 'mozilla') {
									ua[parts[0].split(' ').join('_')] = parts.slice(1).join('-');
								}
							}
						}
					}
				}

				if (R_mobile.exec(uaStr)) {
					// mobile device indicators
					ua.mobile = RegExp.$1;
					if (R_BlackBerry.exec(uaStr)) {
						delete ua[ua.mobile];
						ua.blackberry = ua.version || RegExp.$3 || RegExp.$2 || RegExp.$1;
						if (RegExp.$1) {
							// standardize non-tablet blackberry
							ua.mobile = 'blackberry';
						} else if (ua.version === '0.0.1') {
							// fix playbook 1.0 quirk
							ua.blackberry = '7.1.0.0';
						}
					}

				} else if (R_desktop.exec(uaStr)) {
					// desktop OS indicators
					ua.desktop = RegExp.$1;

				} else if (R_game.exec(uaStr)) {
					// game console indicators
					ua.game = RegExp.$1;
					var game = ua.game.split(' ').join('_');

					if (ua.version && !ua[game]) {
						ua[game] = ua.version;
					}
				}

				// platform naming standardizations
				if (ua.intel_mac_os_x) {
					ua.mac_os_x = ua.intel_mac_os_x.split('_').join('.');
					delete ua.intel_mac_os_x;

				} else if (ua.cpu_iphone_os) {
					ua.ios = ua.cpu_iphone_os.split('_').join('.');
					delete ua.cpu_iphone_os;

				} else if (ua.cpu_os) {
					ua.ios = ua.cpu_os.split('_').join('.');
					delete ua.cpu_os;

				} else if (ua.mobile === 'iphone' && !ua.ios) {
					ua.ios = '1';
				}

				// UA naming standardizations
				if (ua.opera && ua.version) {
					ua.opera = ua.version;
					// version/XXX refers to opera
					delete ua.blackberry;

				} else if (R_Silk.exec(uaStr)) {
					ua.silk_accelerated = true;

				} else if (R_FluidApp.exec(uaStr)) {
					ua.fluidapp = ua.version;
				}

				if (ua.applewebkit) {
					ua.webkit = ua.applewebkit;
					delete ua.applewebkit;

					if (ua.opr) {
						ua.opera = ua.opr;
						delete ua.opr;
						delete ua.chrome;
					}

					if (ua.safari) {
						if (ua.chrome || ua.crios || ua.opera || ua.silk || ua.fluidapp || ua.phantomjs || (ua.mobile && !ua.ios)) {
							delete ua.safari;

						} else if (ua.version && !ua.rim_tablet_os) {
							ua.safari = ua.version;

						} else {
							ua.safari = ({
								'419': '2.0.4',
								'417': '2.0.3',
								'416': '2.0.2',
								'412': '2.0',
								'312': '1.3',
								'125': '1.2',
								'85': '1.0'
							})[parseInt(ua.safari, 10)] || ua.safari;
						}
					}

				} else if (ua.msie || ua.trident) {
					if (!ua.opera) {
						// standardize Internet Explorer
						ua.ie = ua.msie || ua.rv;
					}
					delete ua.msie;

					if (ua.windows_phone_os) {
						// standardize window phone
						ua.windows_phone = ua.windows_phone_os;
						delete ua.windows_phone_os;

					} else if (ua.mobile === 'wpdesktop' || ua.mobile === 'xblwp7' || ua.mobile === 'zunewp7') {
						ua.mobile = 'windows desktop';
						ua.windows_phone = (+ua.ie < 9) ? '7.0' : (+ua.ie < 10) ? '7.5' : '8.0';
						delete ua.windows_nt;
					}

				} else if (ua.gecko || ua.firefox) {
					ua.gecko = ua.rv;
				}

				if (ua.rv) {
					delete ua.rv;
				}
				if (ua.version) {
					delete ua.version;
				}

				return ua;
			},

		format:
			/**
			 * @param ua {Object}
			 * @return {string}
			 */
			function (ua) {
				/**
				 * @param b {string} browser key
				 * @param v {string} browser value
				 * @return {string} formatted CSS classes
				 */
				function format(b, v) {
					b = b.split('.').join('-');

					/**
					 * @type {string}
					 */
					var css = PREFIX+b;
					if (typeof v === 'string') {
						v = v.split(' ').join('_').split('.').join('-');
						var i = v.indexOf('-');
						while (i > 0) {
							// loop through chopping last '-' to end off
							// concat result onto return string
							css += PREFIX+b+'-'+v.substring(0, i);
							i = v.indexOf('-', i+1);
						}
						css += PREFIX+b+'-'+v;
					}
					return css;
				}
	
				/**
				 * @type {string}
				 */
				var	uaCss = '';
				for (var b in ua) {
					if (b && ua.hasOwnProperty(b)) {
						uaCss += format(b, ua[b]);
					}
				}
	
				// user-agent classNames
				return uaCss;
			},

		encode:
			/**
			 * Encodes parsed userAgent object as a compact URI-Encoded key-value collection
			 * @param ua {Object}
			 * @return {string}
			 */
			function(ua) {
				var query = '';
				for (var b in ua) {
					if (b && ua.hasOwnProperty(b)) {
						if (query) {
							query += '&';
						}
						query += encodeURIComponent(b)+'='+encodeURIComponent(ua[b]);
					}
				}
				return query;
			}
	};

	/**
	 * @const
	 * @type {Object}
	 */
	cssua.userAgent = cssua.ua = cssua.parse(userAgent, sa);

	/**
	 * @const
	 * @type {string}
	 */
	var ua = cssua.format(cssua.ua)+' js';

	// append CSS classes to HTML node
	if (html.className) {
		html.className = html.className.replace(/\bno-js\b/g, '') + ua;
		
	} else {
		html.className = ua.substr(1);
	}

	return cssua;

})(document.documentElement, navigator.userAgent, navigator.standalone);
/*
 * JavaScriptUtil version 2.2.4
 *
 * The JavaScriptUtil is a set of misc functions used by the other scripts
 *
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Home Page: http://javascriptools.sourceforge.net
 *
 * JavaScripTools is distributed under the GNU Lesser General Public License (LGPL).
 * For more information, see http://www.gnu.org/licenses/lgpl-2.1.txt
 */

///////////////////////////////////////////////////////////////////////////////
// Constants
var JST_CHARS_NUMBERS = "0123456789";
var JST_CHARS_LOWER = "";
var JST_CHARS_UPPER = "";
//Scan the upper and lower characters
for (var i = 50; i < 500; i++) {
    var c = String.fromCharCode(i);
    var lower = c.toLowerCase();
    var upper = c.toUpperCase();
    if (lower != upper) {
        JST_CHARS_LOWER += lower;
        JST_CHARS_UPPER += upper;
    }
}
var JST_CHARS_LETTERS = JST_CHARS_LOWER + JST_CHARS_UPPER;
var JST_CHARS_ALPHA = JST_CHARS_LETTERS + JST_CHARS_NUMBERS;
var JST_CHARS_BASIC_LOWER = "abcdefghijklmnopqrstuvwxyz";
var JST_CHARS_BASIC_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var JST_CHARS_BASIC_LETTERS = JST_CHARS_BASIC_LOWER + JST_CHARS_BASIC_UPPER;
var JST_CHARS_BASIC_ALPHA = JST_CHARS_BASIC_LETTERS + JST_CHARS_NUMBERS;
var JST_CHARS_WHITESPACE = " \t\n\r";

//Number of milliseconds in a second
var MILLIS_IN_SECOND = 1000;

//Number of milliseconds in a minute
var MILLIS_IN_MINUTE = 60 * MILLIS_IN_SECOND;

//Number of milliseconds in a hour
var MILLIS_IN_HOUR = 60 * MILLIS_IN_MINUTE;

//Number of milliseconds in a day
var MILLIS_IN_DAY = 24 * MILLIS_IN_HOUR;

//Date field: milliseconds
var JST_FIELD_MILLISECOND = 0;

//Date field: seconds
var JST_FIELD_SECOND = 1;

//Date field: minutes
var JST_FIELD_MINUTE = 2;

//Date field: hours
var JST_FIELD_HOUR = 3;

//Date field: days
var JST_FIELD_DAY = 4;

//Date field: months
var JST_FIELD_MONTH = 5;

//Date field: years
var JST_FIELD_YEAR = 6;

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the reference to the named object
 * Parameters:
 *     name: The object's name. When a reference, return it.
 *     source: The object where to search the name
 * Returns: The reference, or null if not found
 */
function getObject(objectName, source) {
    if (isEmpty(objectName)) {
        return null;
    }
    if (!isInstance(objectName, String)) {
        return objectName;
    }
    if(isEmpty(source)) {
        source = self;
    }
    //Check if the source is a reference or a name
    if(isInstance(source, String)) {
        //It's a name. Try to find it on a frame
        sourceName = source;
        source = self.frames[sourceName];
        if (source == null) source = parent.frames[sourceName];
        if (source == null) source = top.frames[sourceName];
        if (source == null) source = getObject(sourceName);
        if (source == null) return null;
    }
    //Get the document
    var document = (source.document) ? source.document : source;
    //Check the browser's type
    if (document.getElementById) {
        //W3C
        var collection = document.getElementsByName(objectName);
        if (collection.length == 1) return collection[0];
        if (collection.length > 1) {
            //When the collection itself is an array, return it
            if (typeof(collection) == "array") {
                return collection;
            }
            //Copy the collection nodes to an array
            var ret = new Array(collection.length);
            for (var i = 0; i < collection.length; i++) {
                ret[i] = collection[i];
            }
            return ret;
        }
        return document.getElementById(objectName);
    } else {
        //Old Internet Explorer
        if (document[objectName]) return document[objectName];
        if (document.all[objectName]) return document.all[objectName];
        if (source[objectName]) return source[objectName];
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if the object is an instance of the specified class
 * Parameters:
 *     object: The object
 *     clazz: The class
 * Returns: Is the object an instance of the class?
 */
function isInstance(object, clazz) {
    if ((object == null) || (clazz == null)) {
        return false;
    }
    if (object instanceof clazz) {
        return true;
    }
    if ((clazz == String) && (typeof(object) == "string")) {
        return true;
    }
    if ((clazz == Number) && (typeof(object) == "number")) {
        return true;
    }
    if ((clazz == Array) && (typeof(object) == "array")) {
        return true;
    }
    if ((clazz == Function) && (typeof(object) == "function")) {
        return true;
    }
    var base = object.base;
    while (base != null) {
        if (base == clazz) {
            return true;
        }
        base = base.base;
    }
    return false;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns true if the object value represents a true value
 * Parameters:
 *     object: The input object. It will be treated as a string.
 *        if the string starts with any of the characters on trueChars, it 
 *        will be considered true. False otherwise.
 *     trueChars: The initial characters for the object be a true value, 
 *        ingoring case. Default: 1, Y, N or S.
 * Returns: The boolean value
 */
function booleanValue(object, trueChars) {
    if (object == true || object == false) {
        return object;
    } else {
        object = String(object);
        if (object.length == 0) {
            return false;
        } else {
            var first = object.charAt(0).toUpperCase();
            trueChars = isEmpty(trueChars) ? "T1YS" : trueChars.toUpperCase();
            return trueChars.indexOf(first) != -1
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if the object is undefined
 * Parameters:
 *     object: The object to test
 * Returns: Is the object undefined?
 */
function isUndefined(object) {
    return typeof(object) == "undefined";
}


///////////////////////////////////////////////////////////////////////////////
/*
 * Makes an object invoke a function as if it were a method of his
 * Parameters:
 *     object: The target object
 *     method: The function reference
 *     args: The arguments. If is not an array, uses a single 
 *                argument. If null, uses no arguments.
 * Returns: The invocation return value
 */
function invokeAsMethod(object, method, args) {
    return method.apply(object, args);
}

///////////////////////////////////////////////////////////////////////////////
/**
 * Ensures the given argument is an array.
 * When null or undefined, returns an empty array.
 * When an array return it.
 * Otherwise, return an array with the argument in
 * Parameters:
 *     object: The object
 * Returns: The array
 */
function ensureArray(object) {
    if (typeof(object) == 'undefined' || object == null) {
        return [];
    }
    if (object instanceof Array) {
        return object;
    }
    return [object];
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the index of the object in array, -1 if it's not there...
 * Parameters:
 *     object: The object to search
 *     array: The array where to search
 *     startingAt: The index where to start the search (optional)
 * Returns: The index
 */
function indexOf(object, array, startingAt) {
    if ((object == null) || !(array instanceof Array)) {
        return -1;
    }
    if (startingAt == null) {
        startingAt = 0;
    }
    for (var i = startingAt; i < array.length; i++) {
        if (array[i] == object) {
            return i;
        }
    }
    return -1;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if the object is in the array
 * Parameters:
 *     object: The object to search
 *     array: The array where to search
 * Returns: Is the object in the array?
 */
function inArray(object, array) {
    return indexOf(object, array) >= 0;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all occurrences of the given object or objects from an array.
 * Parameters:
 *     array: The array
 *     object1 .. objectN: The objects to remove
 * Returns: The new array
 */
function removeFromArray(array) {
    if (!isInstance(array, Array)) {
        return null;
    }
    var ret = new Array();
    var toRemove = removeFromArray.arguments.slice(1);
    for (var i = 0; i < array.length; i++) {
        var current = array[i];
        if (!inArray(current, toRemove)) {
            ret[ret.length] = current;
        }
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the concatenation of two arrays
 * Parameters:
 *     array1 ... arrayN: The arrays to concatenate
 * Returns: The concatenation of the two arrays
 */
function arrayConcat() {
    var ret = [];
    for (var i = 0; i < arrayConcat.arguments.length; i++) {
        var current = arrayConcat.arguments[i];
        if (!isEmpty(current)) {
            if (!isInstance(current, Array)) {
                current = [current]
            }
            for (j = 0; j < current.length; j++) {
                ret[ret.length] = current[j];
            }
        }
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the concatenation of two arrays
 * Parameters:
 *     array1: The array first array
 *     array1: The array second array
 * Returns: The concatenation of the two arrays
 */
function arrayEquals(array1, array2) {
    if (!isInstance(array1, Array) || !isInstance(array2, Array)) {
        return false;
    }
    if (array1.length != array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks or unchecks all the checkboxes
 * Parameters:
 *     object: The reference for the checkbox or checkbox array.
 *     flag: If true, checks, otherwise, unchecks the checkboxes
 */
function checkAll(object, flag) {
    //Check if is the object name    
    if (typeof(object) == "string") {
        object = getObject(object);
    }
    if (object != null) {
        if (!isInstance(object, Array)) {
            object = [object];
        }
        for (i = 0; i < object.length; i++) {
            object[i].checked = flag;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds an event listener to the object.
 * Parameters:
 *     object: The object that generates events
 *     eventName: A name like keypress, blur, etc
 *     handler: A function that will handle the event
 */
function observeEvent(object, eventName, handler) {
    object = getObject(object);
    if (object != null) {
        if (object.addEventListener) {
            object.addEventListener(eventName, function(e) {return invokeAsMethod(object, handler, [e]);}, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + eventName, function() {return invokeAsMethod(object, handler, [window.event]);});
        } else {
            object["on" + eventName] = handler;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Return the keycode of the given event
 * Parameters:
 *     event: The interface event
 */
function typedCode(event) {
    var code = 0;
    if (event == null && window.event) {
        event = window.event;
    }
    if (event != null) {
        if (event.keyCode) {
            code = event.keyCode;
        } else if (event.which) {
            code = event.which;
        }
    }
    return code;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Stops the given event of propagating
 * Parameters:
 *     event: The interface event
 */
function stopPropagation(event) {
    if (event == null && window.event) {
        event = window.event;
    }
    if (event != null) {
        if (event.stopPropagation != null) {
            event.stopPropagation();
        } else if (event.cancelBubble !== null) {
            event.cancelBubble = true;
        }
    }
    return false;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Prevents the default action for the given event
 * Parameters:
 *     event: The interface event
 */
function preventDefault(event) {
    if (event == null && window.event) {
        event = window.event;
    }
    if (event != null) {
        if (event.preventDefault != null) {
            event.preventDefault();
        } else if (event.returnValue !== null) {
            event.returnValue = false;
        }
    }
    return false;
}

/*
 * Prepares the input object to use caret or selection manipulation
 * functions on Internet Explorer. Should be called only once on each input
 * Parameters:
 *     object: The reference for the input
 */
function prepareForCaret(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    if (object.createTextRange) {
        var handler = function() {
            object.caret = document.selection.createRange().duplicate();
        }
        observeEvent(object, "onclick", handler);
        observeEvent(object, "ondblclick", handler);
        observeEvent(object, "onselect", handler);
        observeEvent(object, "onkeyup", handler);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Return if an object supports caret operations
 * Parameters:
 *     object: The reference for the input
 * Returns: Are caret operations supported?
 */
function isCaretSupported(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return false;
    }
    //Opera 8- claims to support setSelectionRange, but it does not works for caret operations, only selection
    if (navigator.userAgent.toLowerCase().indexOf("opera") >= 0) {
        return false;
    }
    return object.setSelectionRange != null || object.createTextRange != null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Return if an object supports input selection operations
 * Parameters:
 *     object: The reference for the input
 * Returns: Are input selection operations supported?
 */
function isInputSelectionSupported(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return false;
    }
    return object.setSelectionRange != null || object.createTextRange != null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns an input's selected text. 
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 * Returns: The selected text
 */
function getInputSelection(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    try {
        if (object.createTextRange && object.caret) {
            return object.caret.text;
        } else if (object.setSelectionRange) {
            var selStart = object.selectionStart;
            var selEnd = object.selectionEnd;
            return object.value.substring(selStart, selEnd);
        }
    } catch (e) {
        // Ignore
    }
    return "";
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the selection range on an input field.
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 *     start: The selection start
 *     end: The selection end
 * Returns: An array with 2 integers: start and end
 */
function getInputSelectionRange(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    try {
        if (object.selectionEnd) {
            return [object.selectionStart, object.selectionEnd];
        } else if (object.createTextRange && object.caret) {
            var end = getCaret(object);
            return [end - object.caret.text.length, end];
        }
    } catch (e) {
        // Ignore
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the selection range on an input field
 * Parameters:
 *     object: The reference for the input
 *     start: The selection start
 *     end: The selection end
 */
function setInputSelectionRange(object, start, end) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    try {
        if (start < 0) {
            start = 0;
        }
        if (end > object.value.length) {
            end = object.value.length;
        }
        if (object.setSelectionRange) {
            object.focus();
            object.setSelectionRange(start, end);
        } else if (object.createTextRange) {
            object.focus();
            var range;
            if (object.caret) {
                range = object.caret;
                range.moveStart("textedit", -1);
                range.moveEnd("textedit", -1);
            } else {
                range = object.createTextRange();
            }
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    } catch (e) {
        // Ignore
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the caret position. When a range is selected, returns the range end.
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 * Returns: The position
 */
function getCaret(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    try {
        if (object.createTextRange && object.caret) {
            var range = object.caret.duplicate();
            range.moveStart('textedit', -1);
            return range.text.length;
        } else if (object.selectionStart || object.selectionStart == 0) {
            return object.selectionStart;
        }
    } catch (e) {
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the caret to the specified position
 * Parameters:
 *     object: The reference for the input
 *     pos: The position
 */
function setCaret(object, pos) {
    setInputSelectionRange(object, pos, pos);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the caret to the text end
 * Parameters:
 *     object: The reference for the input
 */
function setCaretToEnd(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    try {
        if (object.createTextRange) {
          var range = object.createTextRange();
          range.collapse(false);
          range.select();
        } else if (object.setSelectionRange) {
          var length = object.value.length;
          object.setSelectionRange(length, length);
          object.focus();
        }
    } catch (e) {
        // Ignore
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the caret to the text start
 * Parameters:
 *     object: The reference for the input
 */
function setCaretToStart(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    try {
        if (object.createTextRange) {
          var range = object.createTextRange();
          range.collapse(true);
          range.select();
        } else if (object.setSelectionRange) {
          object.focus();
          object.setSelectionRange(0, 0);
        }
    } catch (e) {
        // Ignore
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Selects a given string on the input text
 * Parameters:
 *     object: The reference for the input
 *     string: The string to select
 */
function selectString(object, string) {
    if (isInstance(object, String)) {
        object = getObject(object);
    }
    if (object == null || !object.type) {
        return;
    }
    var match = new RegExp(string, "i").exec(object.value);
    if (match) {
        setInputSelectionRange(object, match.index, match.index + match[0].length);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Replaces the selected text for a new one. On IE, only works if the object has focus.
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 *     string: The new text
 */
function replaceSelection(object, string) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    if (object.setSelectionRange) {
        var selectionStart = object.selectionStart;
        var selectionEnd = object.selectionEnd;
        object.value = object.value.substring(0, selectionStart) + string + object.value.substring(selectionEnd);
        if (selectionStart != selectionEnd) {
            setInputSelectionRange(object, selectionStart, selectionStart + string.length);
        } else {
            setCaret(object, selectionStart + string.length);
        }
    } else if (object.createTextRange && object.caret) {
        object.caret.text = string;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Clears the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 * Returns: The array of removed options
 */
function clearOptions(select) {
    select = getObject(select);
    var ret = new Array();
    if (select != null) {
        for (var i = 0; i < select.options.length; i++) {
            var option = select.options[i];
            ret[ret.length] = new Option(option.text, option.value);
        }
        select.options.length = 0;
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds an options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     option: The Option instance
 *     sort: Will sort the options? Default: false
 *     textProperty: The object property, when not an Option, to read the text. Defaults to "text"
 *     valueProperty: The object property, when not an Option, to read the value. Defaults to "value"
 *     selectedProperty: The object property, when not an Option, to read if the option is selected. Defaults to "selected"
 */
function addOption(select, option, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    if (select == null || option == null) {
        return;
    }
    
    textProperty = textProperty || "text";
    valueProperty = valueProperty || "value";
    selectedProperty = selectedProperty || "selected"
    if (isUndefined(option[valueProperty])) {
        valueProperty = textProperty;
    }
    var selected = false;
    if (!isUndefined(option[selectedProperty])) {
        selected = option[selectedProperty];
    }
    option = new Option(option[textProperty], option[valueProperty], selected, selected);

    select.options[select.options.length] = option;

    if (booleanValue(sort)) {
        sortOptions(select);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     options: The array of Option instances
 *     sort: Will sort the options? Default: false
 *     textProperty: The object property, when not an Option, to read the text. Defaults to "text"
 *     valueProperty: The object property, when not an Option, to read the value. Defaults to "value"
 *     selectedProperty: The object property, when not an Option, to read if the option is selected. Defaults to "selected"
 */
function addOptions(select, options, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    if (select == null) {
        return;
    }
    for (var i = 0; i < options.length; i++) {
        addOption(select, options[i], false, textProperty, valueProperty, selectedProperty);
    }
    if (!select.multiple && select.selectedIndex < 0 && select.options.length > 0) {
        select.selectedIndex = 0;
    }
    if (booleanValue(sort)) {
        sortOptions(select);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Compares two options
 * Parameters:
 *     opt1: The first option
 *     opt2: The second option
 */
function compareOptions(opt1, opt2) {
    if (opt1 == null && opt2 == null) {
        return 0;
    }
    if (opt1 == null) {
        return -1;
    }
    if (opt2 == null) {
        return 1;
    }
    if (opt1.text == opt2.text) {
        return 0;
    } else if (opt1.text > opt2.text) {
        return 1;
    } else {
        return -1;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     options: The array of Option instances
 *     addEmpty: A flag indicating an empty option should be added. Defaults to false
 *     textProperty: The object property, when not an Option, to read the text. Defaults to "text"
 *     valueProperty: The object property, when not an Option, to read the value. Defaults to "value"
 *     selectedProperty: The object property, when not an Option, to read if the option is selected. Defaults to "selected"
 * Returns: The original Options array
 */
function setOptions(select, options, addEmpty, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    var ret = clearOptions(select);
    var addEmptyIsString = isInstance(addEmpty, String);
    if (addEmptyIsString || booleanValue(addEmpty)) {
        select.options[0] = new Option(addEmptyIsString ? addEmpty : "");
    }
    addOptions(select, options, sort, textProperty, valueProperty, selectedProperty);
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
/*
 * Sorts the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     sortFunction The sortFunction to use. Defaults to the default sort function
 */
function sortOptions(select, sortFunction) {
    select = getObject(select);
    if (select == null) {
        return;
    }
    var options = clearOptions(select);
    if (isInstance(sortFunction, Function)) {
        options.sort(sortFunction);
    } else {
        options.sort(compareOptions);
    }
    setOptions(select, options);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Transfers the options from a select to another
 * Parameters:
 *     source: The reference for the source select, or the select name
 *     dest: The reference for the destination select, or the select name
 *     all: Will transfer all options (true) or the selected ones (false)? Default: false
 *     sort: Will sort the options? Default: false
 */
function transferOptions(source, dest, all, sort) {
    source = getObject(source);
    dest = getObject(dest);
    if (source == null || dest == null) {
        return;
    }
    if (booleanValue(all)) {
        addOptions(dest, clearOptions(source), sort);
    } else {
        var sourceOptions = new Array();
        var destOptions = new Array();
        for (var i = 0; i < source.options.length; i++) {
            var option = source.options[i];
            var options = (option.selected) ? destOptions : sourceOptions;
            options[options.length] = new Option(option.text, option.value);
        }
        setOptions(source, sourceOptions, false, sort);
        addOptions(dest, destOptions, sort);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Gets the value of an element
 * Parameters:
 *     object: The reference for the element
 * Returns: The value or an Array containing the values, if there's more than one
 */
function getValue(object) {
    object = getObject(object);
    if (object == null) {
        return null;
    }

    //Check if object is an array
    if (object.length && !object.type) {
        var ret = new Array();
        for (var i = 0; i < object.length; i++) {
            var temp = getValue(object[i]);
            if (temp != null) {
                ret[ret.length] = temp;
            }
        }
        return ret.length == 0 ? null : ret.length == 1 ? ret[0] : ret;
    }

    //Check the object type
    if (object.type) {
        //Select element
        if (object.type.indexOf("select") >= 0) {
            var ret = new Array();
            if (!object.multiple && object.selectedIndex < 0 && object.options.length > 0) {
                //On konqueror, if no options is marked as selected, not even the first one will return as selected
                ret[ret.length] = object.options[0].value;
            } else {
                for (i = 0; i < object.options.length; i++) {
                    var option = object.options[i];
                    if (option.selected) {
                        ret[ret.length] = option.value;
                        if (!object.multiple) {
                            break;
                        }
                    }
                }
            }
            return ret.length == 0 ? null : ret.length == 1 ? ret[0] : ret;
        }
    
        //Radios and checkboxes
        if (object.type == "radio" || object.type == "checkbox") {
            return booleanValue(object.checked) ? object.value : null;
        } else {
            //Other input elements
            return object.value;
        }
    } else if (typeof(object.innerHTML) != "undefined"){
        //Not an input
        return object.innerHTML;
    } else {
        return null;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the value of an element
 * Parameters:
 *     object: The reference for the element
 *     value: The value to be set
 */
function setValue(object, value) {

    //Validates the object
    if (object == null) {
        return;
    }
    
    //Check if is the object name    
    if (typeof(object) == "string") {
        object = getObject(object);
    }

    //Ensures the array is made of strings
    var values = ensureArray(value);
    for (var i = 0; i < values.length; i++) {
        values[i] = values[i] == null ? "" : "" + values[i];
    }
    
    //Check if object is an array
    if (object.length && !object.type) {
        while (values.length < object.length) {
            values[values.length] = "";
        }
        for (var i = 0; i < object.length; i++) {
            var obj = object[i];
            setValue(obj, inArray(obj.type, ["checkbox", "radio"]) ? values : values[i]);
        }
        return;
    }
    //Check the object type
    if (object.type) {
        //Check the input type
        if (object.type.indexOf("select") >= 0) {
            //Select element
            for (var i = 0; i < object.options.length; i++) {
                var option = object.options[i];
                option.selected = inArray(option.value, values);
            }
            return;
        } else if (object.type == "radio" || object.type == "checkbox") {
            //Radios and checkboxes 
            object.checked = inArray(object.value, values);
            return;
        } else {
            //Other input elements: get the first value
            object.value = values.length == 0 ? "" : values[0];
            return;
        }
    } else if (typeof(object.innerHTML) != "undefined"){
        //The object is not an input
        object.innerHTML = values.length == 0 ? "" : values[0];
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns an argument depending on the value of the first argument.
 * Example: decode(param, 1, 'A', 2, 'B', 'C'). When param == 1, returns 'A'.
 * When param == 2, return 'B'. Otherwise, return 'C'
 * Parameters:
 *     object: The object
 *     (additional parametes): The tested values and the return value
 * Returns: The correct argument
 */
function decode(object) {
    var args = decode.arguments;
    for (var i = 1; i < args.length; i += 2) {
        if (i < args.length - 1) {
            if (args[i] == object) {
                return args[i + 1];
            }
        } else {
            return args[i];
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns an argument depending on the boolean value of the prior argument.
 * Example: select(a > b, 'A', b > a, 'B', 'Equals'). When a > b, returns 'A'.
 * When b > a, return 'B'. Otherwise, return 'Equals'
 * Parameters:
 *     (additional parametes): The tested values and the return value
 * Returns: The correct argument
 */
function select() {
    var args = select.arguments;
    for (var i = 0; i < args.length; i += 2) {
        if (i < args.length - 1) {
            if (booleanValue(args[i])) {
                return args[i + 1];
            }
        } else {
            return args[i];
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if an object is an empty instance ("", null, undefined or NaN)
 * Parameters:
 *     object: The object
 * Returns: Is the object an empty instance?
 */
function isEmpty(object) {
    return object == null || String(object) == "" || typeof(object) == "undefined" || (typeof(object) == "number" && isNaN(object));
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the object if not empty (according to the isEmpty function), or the
 *     second parameter otherwise
 * Parameters:
 *     object: The object
 *     emptyValue: The object returned if the first is empty
 * Returns: The first object if is not empty, otherwise the second one
 */
function ifEmpty(object, emptyValue) {
    return isEmpty(object) ? emptyValue : object;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the object if not null, or the second parameter otherwise
 * Parameters:
 *     object: The object
 *     nullValue: The object returned if the first is null
 * Returns: The first object if is not empty, otherwise the second one
 */
function ifNull(object, nullValue) {
    return object == null ? nullValue : object;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Replaces all the occurences in the string
 * Parameters:
 *     string: The string
 *     find: Text to be replaced
 *     replace: Text to replace the previous
 * Returns: The new string
 */
function replaceAll(string, find, replace) {
    return String(string).split(find).join(replace);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Repeats the String a number of times
 * Parameters:
 *     string: The string
 *     times: How many times?
 * Returns: The new string
 */
function repeat(string, times) {
    var ret = "";
    for (var i = 0; i < Number(times); i++) {
        ret += string;
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all specified characters on the left side
 * Parameters:
 *     string: The string
 *     chars: The string containing all characters to be removed. Default: JST_CHARS_WHITESPACE
 * Returns: The new string
 */
function ltrim(string, chars) {
    string = string ? String(string) : "";
    chars = chars || JST_CHARS_WHITESPACE;
    var pos = 0;
    while (chars.indexOf(string.charAt(pos)) >= 0 && (pos <= string.length)) {
        pos++;
    }
    return string.substr(pos);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all specified characters on the right side
 * Parameters:
 *     string: The string
 *     chars: The string containing all characters to be removed. Default: JST_CHARS_WHITESPACE
 * Returns: The new string
 */
function rtrim(string, chars) {
    string = string ? String(string) : "";
    chars = chars || JST_CHARS_WHITESPACE;
    var pos = string.length - 1;
    while (chars.indexOf(string.charAt(pos)) >= 0 && (pos >= 0)) {
        pos--;
    }
    return string.substring(0, pos + 1);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all whitespaces on both left and right sides
 * Parameters:
 *     string: The string
 *     chars: The string containing all characters to be removed. Default: JST_CHARS_WHITESPACE
 * Returns: The new string
 */
function trim(string, chars) {
    chars = chars || JST_CHARS_WHITESPACE;
    return ltrim(rtrim(string, chars), chars);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Make the string have the specified length, completing with the specified 
 * character on the left. If the String is greater than the specified size, 
 * it is truncated to it, using the leftmost characters
 * Parameters:
 *     string: The string
 *     size: The string size
 *     chr: The character that will fill the string
 * Returns: The new string
 */
function lpad(string, size, chr) {
    string = String(string);
    if (size < 0) {
        return "";
    }
    if (isEmpty(chr)) {
        chr = " ";
    } else {
        chr = String(chr).charAt(0);
    }
    while (string.length < size) {
        string = chr + string;
    }
    return left(string, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Make the string have the specified length, completing with the specified 
 * character on the right. If the String is greater than the specified size, 
 * it is truncated to it, using the leftmost characters
 * Parameters:
 *     string: The string
 *     size: The string size
 *     chr: The character that will fill the string
 * Returns: The new string
 */
function rpad(string, size, chr) {
    string = String(string);
    if (size <= 0) {
        return "";
    }
    chr = String(chr);
    if (isEmpty(chr)) {
        chr = " ";
    } else {
        chr = chr.charAt(0);
    }
    while (string.length < size) {
        string += chr;
    }
    return left(string, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified number of characters 
 * from a string after an initial position
 * Parameters:
 *     string: The string
 *     pos: The initial position
 *     size: The crop size (optional, default=1)
 * Returns: The new string
 */
function crop(string, pos, size) {
    string = String(string);
    if (size == null) {
        size = 1;
    }
    if (size <= 0) {
        return "";
    }
    return left(string, pos) + mid(string, pos + size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified number of characters from the left of a string 
 * Parameters:
 *     string: The string
 *     size: The crop size (optional, default=1)
 * Returns: The new string
 */
function lcrop(string, size) {
    if (size == null) {
        size = 1;
    }
    return crop(string, 0, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified number of characters from the right of a string 
 * Parameters:
 *     string: The string
 *     size: The crop size (optional, default=1)
 * Returns: The new string
 */
function rcrop(string, size) {
    string = String(string);
    if (size == null) {
        size = 1;
    }
    return crop(string, string.length - size, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Capitalizes the text, uppercasing the first letter of every word
 * Parameters:
 *     text: The text
 *     separators: An String containing all separator characters. Default: JST_CHARS_WHITESPACE + '.?!'
 * Returns: The new text
 */
function capitalize(text, separators) {
    text = String(text);
    separators = separators || JST_CHARS_WHITESPACE + '.?!';
    var out = "";
    var last = '';    
    for (var i = 0; i < text.length; i++) {
        var current = text.charAt(i);
        if (separators.indexOf(last) >= 0) {
            out += current.toUpperCase();
        } else {
            out += current.toLowerCase();
        }
        last = current;
    }
    return out;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only the specified characters
 * Parameters:
 *     string: The string
 *     possible: The string containing the possible characters
 * Returns: Do the String contains only the specified characters?
 */
function onlySpecified(string, possible) {
    string = String(string);
    possible = String(possible);
    for (var i = 0; i < string.length; i++) {
        if (possible.indexOf(string.charAt(i)) == -1) {
            return false;
        }
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only numbers
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only numbers?
 */
function onlyNumbers(string) {
    return onlySpecified(string, JST_CHARS_NUMBERS);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only letters
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only lettersts?
 */
function onlyLetters(string) {
    return onlySpecified(string, JST_CHARS_LETTERS);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only alphanumeric characters (letters or digits)
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only alphanumeric characters?
 */
function onlyAlpha(string) {
    return onlySpecified(string, JST_CHARS_ALPHA);
}
///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only letters without accentiation
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only lettersts?
 */
function onlyBasicLetters(string) {
    return onlySpecified(string, JST_CHARS_BASIC_LETTERS);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only alphanumeric characters  without accentiation (letters or digits)
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only alphanumeric characters?
 */
function onlyBasicAlpha(string) {
    return onlySpecified(string, JST_CHARS_BASIC_ALPHA);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the left most n characters
 * Parameters:
 *     string: The string
 *     n: The number of characters
 * Returns: The substring
 */
function left(string, n) {
    string = String(string);
    return string.substring(0, n);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the right most n characters
 * Parameters:
 *     string: The string
 *     n: The number of characters
 * Returns: The substring
 */
function right(string, n) {
    string = String(string);
    return string.substr(string.length - n);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns n characters after the initial position
 * Parameters:
 *     string: The string
 *     pos: The initial position
 *     n: The number of characters (optional)
 * Returns: The substring
 */
function mid(string, pos, n) {
    string = String(string);
    if (n == null) {
        n = string.length;
    }
    return string.substring(pos, pos + n);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Inserts a value inside a string
 * Parameters:
 *     string: The string
 *     pos: The insert position
 *     value: The value to be inserted
 * Returns: The updated
 */
function insertString(string, pos, value) {
    string = String(string);
    var prefix = left(string, pos);
    var suffix = mid(string, pos)
    return prefix + value + suffix;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the function name for a given function reference
 * Parameters:
 *     funct: The function
 *     unnamed: The String to return on unnamed functions. Default: [unnamed]
 * Returns: The function name. If the reference is not a function, returns null
 */
function functionName(funct, unnamed) {
    if (typeof(funct) == "function") {
        var src = funct.toString();
        var start = src.indexOf("function");
        var end = src.indexOf("(");
        if ((start >= 0) && (end >= 0)) {
            start += 8; //The "function" length
            var name = trim(src.substring(start, end));
            return isEmpty(name) ? (unnamed || "[unnamed]") : name;
        }
    } if (typeof(funct) == "object") {
        return functionName(funct.constructor);
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns all properties in the object, sorted or not, with the separator between them.
 * Parameters:
 *     object: The object
 *     separator: The separator between properties
 *     sort: Will the properties be sorted?
 *     includeObject: Will the object.toString() be included?
 *     objectSeparator: The text separating the object.toString() from the properties. Default to a line
 * Returns: The string
 */
function debug(object, separator, sort, includeObject, objectSeparator) {
    if (object == null) {
        return "null";
    }
    sort = booleanValue(sort == null ? true : sort);
    includeObject = booleanValue(includeObject == null ? true : sort);
    separator = separator || "\n";
    objectSeparator = objectSeparator || "--------------------";

    //Get the properties
    var properties = new Array();
    for (var property in object) {
        var part = property + " = ";
        try {
            part += object[property];
        } catch (e) {
            part += "<Error retrieving value>";
        }
        properties[properties.length] = part;
    }
    //Sort if necessary
    if (sort) {
        properties.sort();
    }
    //Build the output
    var out = "";
    if (includeObject) {
        try {
            out = object.toString() + separator;
        } catch (e) {
            out = "<Error calling the toString() method>"
        }
        if (!isEmpty(objectSeparator)) {
            out += objectSeparator + separator;
        }
    }
    out += properties.join(separator);
    return out;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Escapes the string's special characters to their escaped form
 * ('\\' to '\\\\', '\n' to '\\n', ...) and the extraChars are escaped via unicode
 * (\\uXXXX, where XXXX is the hexadecimal charcode)
 * Parameters:
 *     string: The string to be escaped
 *     extraChars: The String containing extra characters to be escaped
 *     onlyExtra: If true, do not process the standard characters ('\\', '\n', ...)
 * Returns: The encoded String
 */
function escapeCharacters(string, extraChars, onlyExtra) {
    var ret = String(string);
    extraChars = String(extraChars || "");
    onlyExtra = booleanValue(onlyExtra);
    //Checks if must process only the extra characters
    if (!onlyExtra) {
        ret = replaceAll(ret, "\n", "\\n");
        ret = replaceAll(ret, "\r", "\\r");
        ret = replaceAll(ret, "\t", "\\t");
        ret = replaceAll(ret, "\"", "\\\"");
        ret = replaceAll(ret, "\'", "\\\'");
        ret = replaceAll(ret, "\\", "\\\\");
    }
    //Process the extra characters
    for (var i = 0; i < extraChars.length; i++) {
        var chr = extraChars.charAt(i);
        ret = replaceAll(ret, chr, "\\\\u" + lpad(new Number(chr.charCodeAt(0)).toString(16), 4, '0'));
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Unescapes the string, changing the special characters to their unescaped form
 * ('\\\\' to '\\', '\\n' to '\n', '\\uXXXX' to the hexadecimal ASC(XXXX), ...)
 * Parameters:
 *     string: The string to be unescaped
 *     onlyExtra: If true, do not process the standard characters ('\\', '\n', ...)
 * Returns: The unescaped String
 */
function unescapeCharacters(string, onlyExtra) {
    var ret = String(string);
    var pos = -1;
    var u = "\\\\u";
    onlyExtra = booleanValue(onlyExtra);
    //Process the extra characters
    do {
        pos = ret.indexOf(u);
        if (pos >= 0) {
            var charCode = parseInt(ret.substring(pos + u.length, pos + u.length + 4), 16);
            ret = replaceAll(ret, u + charCode, String.fromCharCode(charCode));
        }
    } while (pos >= 0);
    
    //Checks if must process only the extra characters
    if (!onlyExtra) {
        ret = replaceAll(ret, "\\n", "\n");
        ret = replaceAll(ret, "\\r", "\r");
        ret = replaceAll(ret, "\\t", "\t");
        ret = replaceAll(ret, "\\\"", "\"");
        ret = replaceAll(ret, "\\\'", "\'");
        ret = replaceAll(ret, "\\\\", "\\");
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Writes the specified cookie
 * Parameters:
 *     name: The cookie name
 *     value: The value
 *     document: The document containing the cookie. Default to self.document
 *     expires: The expiration date or the false flag, indicating it never expires. Defaults: until browser is closed.
 *     path: The cookie's path. Default: not specified
 *     domain: The cookie's domain. Default: not specified
 */
function writeCookie(name, value, document, expires, path, domain, secure) {
    document = document || self.document;
    var str = name + "=" + (isEmpty(value) ? "" : encodeURIComponent(value));
    if (path != null) str += "; path=" + path;
    if (domain != null) str += "; domain=" + domain;
    if (secure != null && booleanValue(secure)) str += "; secure";
    if (expires === false) expires = new Date(2500, 12, 31);
    if (expires instanceof Date) str += "; expires=" + expires.toGMTString();
    document.cookie = str;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Reads the specified cookie
 * Parameters:
 *     name: The cookie name
 *     document: The document containing the cookie. Default to self.document
 * Returns: The value
 */
function readCookie(name, document) {
    document = document || self.document;
    var prefix = name + "=";
    var cookie = document.cookie;
    var begin = cookie.indexOf("; " + prefix);
    if (begin == -1) {
    begin = cookie.indexOf(prefix);
    if (begin != 0) return null;
    } else
    begin += 2;
    var end = cookie.indexOf(";", begin);
    if (end == -1)
    end = cookie.length;
    return decodeURIComponent(cookie.substring(begin + prefix.length, end));
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified cookie
 * Parameters:
 *     name: The cookie name
 *     document: The document containing the cookie. Default to self.document
 *     path: The cookie's path. Default: not specified
 *     domain: The cookie's domain. Default: not specified
 */
function deleteCookie(name, document, path, domain) {
    writeCookie(name, null, document, path, domain);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the value of a given date field 
 * Parameters:
 *     date: The date
 *     field: the field. May be one of the constants JST_FIELD_*. Defaults to JST_FIELD_DAY
 */
function getDateField(date, field) {
    if (!isInstance(date, Date)) {
        return null;
    }
    switch (field) {
        case JST_FIELD_MILLISECOND:
            return date.getMilliseconds();
        case JST_FIELD_SECOND:
            return date.getSeconds();
        case JST_FIELD_MINUTE:
            return date.getMinutes();
        case JST_FIELD_HOUR:
            return date.getHours();
        case JST_FIELD_DAY:
            return date.getDate();
        case JST_FIELD_MONTH:
            return date.getMonth();
        case JST_FIELD_YEAR:
            return date.getFullYear();
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the value of a given date field 
 * Parameters:
 *     date: The date
 *     field: the field. May be one of the constants JST_FIELD_*. Defaults to JST_FIELD_DAY
 *     value: The field value
 */
function setDateField(date, field, value) {
    if (!isInstance(date, Date)) {
        return;
    }
    switch (field) {
        case JST_FIELD_MILLISECOND:
            date.setMilliseconds(value);
            break;
        case JST_FIELD_SECOND:
            date.setSeconds(value);
            break;
        case JST_FIELD_MINUTE:
            date.setMinutes(value);
            break;
        case JST_FIELD_HOUR:
            date.setHours(value);
            break;
        case JST_FIELD_DAY:
            date.setDate(value);
            break;
        case JST_FIELD_MONTH:
            date.setMonth(value);
            break;
        case JST_FIELD_YEAR:
            date.setFullYear(value);
            break;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds a field to a date
 * Parameters:
 *     date: the date
 *     amount: the amount to add. Defaults to 1
 *     field: The field. May be one of the constants JST_FIELD_*. Defaults to JST_FIELD_DAY
 * Returns: The new date
 */
function dateAdd(date, amount, field) {
    if (!isInstance(date, Date)) {
        return null;
    }
    if (amount == 0) {
        return new Date(date.getTime());
    }
    if (!isInstance(amount, Number)) {
        amount = 1;
    }
    if (field == null) field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null;
    }
    var time = date.getTime();
    if (field <= JST_FIELD_DAY) {
        var mult = 1;
        switch (field) {
            case JST_FIELD_SECOND:
                mult = MILLIS_IN_SECOND;
                break;
            case JST_FIELD_MINUTE:
                mult = MILLIS_IN_MINUTE;
                break;
            case JST_FIELD_HOUR:
                mult = MILLIS_IN_HOUR;
                break;
            case JST_FIELD_DAY:
                mult = MILLIS_IN_DAY;
                break;
        }
        var time = date.getTime();
        time += mult * amount;
        return new Date(time);
    }
    var ret = new Date(time);
    var day = ret.getDate();
    var month = ret.getMonth();
    var year = ret.getFullYear();
    if (field == JST_FIELD_YEAR) {
        year += amount;
    } else if (field == JST_FIELD_MONTH) {
        month += amount;
    }
    while (month > 11) {
        month -= 12;
        year++;
    }
    day = Math.min(day, getMaxDay(month, year));
    ret.setDate(day);
    ret.setMonth(month);
    ret.setFullYear(year);
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the difference, as in date2 - date1
 * Parameters:
 *     date1: the first date
 *     date2: the second date
 *     field: The field. May be one of the constants JST_FIELD_*. Default to JST_FIELD_DAY
 * Returns: An integer number
 */
function dateDiff(date1, date2, field) {
    if (!isInstance(date1, Date) || !isInstance(date2, Date)) {
        return null;
    }
    if (field == null) field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null;
    }
    if (field <= JST_FIELD_DAY) {
        var div = 1;
        switch (field) {
            case JST_FIELD_SECOND:
                div = MILLIS_IN_SECOND;
                break;
            case JST_FIELD_MINUTE:
                div = MILLIS_IN_MINUTE;
                break;
            case JST_FIELD_HOUR:
                div = MILLIS_IN_HOUR;
                break;
            case JST_FIELD_DAY:
                div = MILLIS_IN_DAY;
                break;
        }
        return Math.round((date2.getTime() - date1.getTime()) / div);
    }
    var years = date2.getFullYear() - date1.getFullYear();
    if (field == JST_FIELD_YEAR) {
        return years;
    } else if (field == JST_FIELD_MONTH) {
        var months1 = date1.getMonth();
        var months2 = date2.getMonth();
        
        if (years < 0) {
            months1 += Math.abs(years) * 12;
        } else if (years > 0) {
            months2 += years * 12;
        }
        
        return (months2 - months1);
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Truncates the date, setting all fields lower than the specified one to its minimum value
 * Parameters:
 *     date: The date
 *     field: The field. May be one of the constants JST_FIELD_*. Default to JST_FIELD_DAY
 * Returns: The new Date
 */
function truncDate(date, field) {
    if (!isInstance(date, Date)) {
        return null;
    }
    if (field == null) field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null;
    }
    var ret = new Date(date.getTime());
    if (field > JST_FIELD_MILLISECOND) {
        ret.setMilliseconds(0);
    }
    if (field > JST_FIELD_SECOND) {
        ret.setSeconds(0);
    }
    if (field > JST_FIELD_MINUTE) {
        ret.setMinutes(0);
    }
    if (field > JST_FIELD_HOUR) {
        ret.setHours(0);
    }
    if (field > JST_FIELD_DAY) {
        ret.setDate(1);
    }
    if (field > JST_FIELD_MONTH) {
        ret.setMonth(0);
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the maximum day of a given month and year
 * Parameters:
 *     month: the month
 *     year: the year
 * Returns: The maximum day
 */
function getMaxDay(month, year) {
    month = new Number(month) + 1;
    year = new Number(year);
    switch (month) {
        case 1: case 3: case 5: case 7:
        case 8: case 10: case 12:
            return 31;
        case 4: case 6: case 9: case 11:
            return 30;
        case 2:
            if ((year % 4) == 0) {
                return 29;
            } else {
                return 28;
            }
        default:
            return 0;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the full year, given a 2 digit year. 50 or less returns 2050
 * Parameters:
 *     year: the year
 * Returns: The 4 digit year
 */
function getFullYear(year) {
    year = Number(year);
    if (year < 1000) {
        if (year < 50 || year > 100) {
            year += 2000;
        } else {
            year += 1900;
        }
    }
    return year;
}

/**
 * Sets the opacity of a given object. The value ranges from 0 to 100.
 * This function is currently supported by Internet Explorer (only works 
 * when the object's position is absolute - why?!? >:-( ) and Gecko based 
 * browsers only.
 * Parameters:
 *     object: The object name or reference
 *     value: The opacity value from 0 to 100. Default: 100
 */
function setOpacity(object, value) {
    object = getObject(object);
    if (object == null) {
        return;
    }
    value = Math.round(Number(value));
    if (isNaN(value) || value > 100) {
        value = 100;
    }
    if (value < 0) {
        value = 0;
    }
    var style = object.style;
    if (style == null) {
        return;
    }
    //Opacity on Mozilla / Gecko based browsers
    style.MozOpacity = value / 100;
    //Opacity on Internet Explorer
    style.filter = "alpha(opacity=" + value + ")";
}

/**
 * Returns the opacity of a given object. The value ranges from 0 to 100.
 * This function is currently supported by Internet Explorer and Gecko based browsers only.
 * Parameters:
 *     object: The object name or reference
 */
function getOpacity(object) {
    object = getObject(object);
    if (object == null) {
        return;
    }
    var style = object.style;
    if (style == null) {
        return;
    }
    //Check the known options
    if (style.MozOpacity) {
        //Opacity on Mozilla / Gecko based browsers
        return Math.round(style.MozOpacity * 100);
    } else if (style.filter) {
        //Opacity on Internet Explorer
        var regExp = new RegExp("alpha\\(opacity=(\d*)\\)");
        var array = regExp.exec(style.filter);
        if (array != null && array.length > 1) {
            return parseInt(array[1], 10);
        }
    }
    //Not found. Return 100%
    return 100;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * A class that represents a key/value pair
 * Parameters:
 *     key: The key
 *     value: The value
 */
function Pair(key, value) {
    this.key = key == null ? "" : key;
    this.value = value;
    
    /* Returns a String representation of this pair */
    this.toString = function() {
        return this.key + "=" + this.value;
    };
}

///////////////////////////////////////////////////////////////////////////////
/*
 * DEPRECATED - Pair is a much meaningful name, use it instead.
 *              Value will be removed in future versions.
 */
function Value(key, value) {
    this.base = Pair;
    this.base(key, value);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * A class used to build a string with more performance than string concatenation
 */
function StringBuffer(initialCapacity) {
    this.initialCapacity = initialCapacity || 10;
    this.buffer = new Array(this.initialCapacity);
 
    //Appends the value to the buffer. The buffer itself is returned, so nested calls may be done
    this.append = function(value) {
        this.buffer[this.buffer.length] = value;
        return this;
    }
    
    //Clears the buffer
    this.clear = function() {
        delete this.buffer;
        this.buffer = new Array(this.initialCapacity);
    }
    
    //Returns the buffered string
    this.toString = function() {
        return this.buffer.join("");
    }
    
    //Returns the buffered string length
    this.length = function() {
        return this.toString().length;
    }
}
/*
 * Parsers version 2.2.4
 *
 * This is a set of parsers used both to parse and format different types of data
 *
 * Dependencies: 
 *  - JavaScriptUtil.js
 *
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Home Page: http://javascriptools.sourceforge.net
 *
 * JavaScripTools is distributed under the GNU Lesser General Public License (LGPL).
 * For more information, see http://www.gnu.org/licenses/lgpl-2.1.txt
 */

/*****************************************************************************/

///////////////////////////////////////////////////////////////////////////////
// DEFAULT PROPERTY VALUES CONSTANTS
///////////////////////////////////////////////////////////////////////////////

//////////////   NumberParser Constants
//Number of decimal digits (-1 = unlimited)
var JST_DEFAULT_DECIMAL_DIGITS = -1;
//Decimal separator
var JST_DEFAULT_DECIMAL_SEPARATOR = ",";
//Group separator
var JST_DEFAULT_GROUP_SEPARATOR = ".";
//Use grouping?
var JST_DEFAULT_USE_GROUPING = false;
//Currency symbol
var JST_DEFAULT_CURRENCY_SYMBOL = "R$";
//Use the currency symbol?
var JST_DEFAULT_USE_CURRENCY = false;
//Use parenthesis for negative values?
var JST_DEFAULT_NEGATIVE_PARENTHESIS = false;
//Group size
var JST_DEFAULT_GROUP_SIZE = 3;
//Use space after currency symbol
var JST_DEFAULT_SPACE_AFTER_CURRENCY = true;
//When negative place currency inside minus or parenthesis?
var JST_DEFAULT_CURRENCY_INSIDE = false;

//////////////   DateParser Constants
//Default date mask
var JST_DEFAULT_DATE_MASK = "dd/MM/yyyy";
//Default enforce length
var JST_DEFAULT_ENFORCE_LENGTH = true;

//////////////   BooleanParser Constants
//Default true value
var JST_DEFAULT_TRUE_VALUE = "true";
//Default false value
var JST_DEFAULT_FALSE_VALUE = "false";
//Default useBooleanValue value
var JST_DEFAULT_USE_BOOLEAN_VALUE = true;

///////////////////////////////////////////////////////////////////////////////
/*
 * Parser
 *
 * A superclass for all parser types
 */
function Parser() {
    /*
     * Parses the String
     * Parameters:
     *     text: The text to be parsed
     * Returns: The parsed value
     */
    this.parse = function(text) {
        return text;
    }

    /*
     * Formats the value
     * Parameters:
     *     value: The value to be formatted
     * Returns: The formatted value
     */
    this.format = function(value) {
        return value;
    }
    
    /*
     * Checks if the given text is a valid value for this parser.
     * Returns true if the text is empty
     * Parameters:
     *     value: The text to be tested
     * Returns: Is the text valid?
     */
    this.isValid = function(text) {
        return isEmpty(text) || (this.parse(text) != null);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * NumberParser - used for numbers
 * Parameters: 
 *    decimalDigits: The number of decimal digits. -1 Means no limit. Defaults to the JST_DEFAULT_DECIMAL_DIGITS constant value
 *    decimalSeparator: The decimal separator. Defaults to the JST_DEFAULT_DECIMAL_SEPARATOR constant value
 *    groupSeparator: The separator between thousands group. Defaults to the JST_DEFAULT_GROUP_SEPARATOR constant value
 *    useGrouping: Will grouping separator be used?. Defaults to the JST_DEFAULT_USE_GROUPING constant value
 *    currencySymbol: The currency symbol. Defaults to the JST_DEFAULT_CURRENCY_SYMBOL constant value
 *    useCurrency: Will the currencySymbol be used? Defaults to the JST_DEFAULT_USE_CURRENCY constant value
 *    negativeParenthesis: Use parenthesis (true) or "-" (false) for negative values? Defaults to the JST_DEFAULT_NEGATIVE_PARENTHESIS constant value
 *    groupSize: How many digits will be grouped together? Defaults to the JST_DEFAULT_GROUP_SIZE constant value
 *    spaceAfterCurrency: Will a space be placed after the currency symbol? Defaults to the JST_DEFAULT_SPACE_AFTER_CURRENCY constant value
 *    currencyInside: When negative place currency inside minus or parenthesis?
 * Additional methods (others than those defined on the Parser class):
 *    round(): rounds a number to the parser specific precision
 */
function NumberParser(decimalDigits, decimalSeparator, groupSeparator, useGrouping, currencySymbol, useCurrency, negativeParenthesis, groupSize, spaceAfterCurrency, currencyInside) {
    this.base = Parser;
    this.base();
    
    this.decimalDigits = (decimalDigits == null) ? JST_DEFAULT_DECIMAL_DIGITS : decimalDigits;
    this.decimalSeparator = (decimalSeparator == null) ? JST_DEFAULT_DECIMAL_SEPARATOR : decimalSeparator;
    this.groupSeparator = (groupSeparator == null) ? JST_DEFAULT_GROUP_SEPARATOR : groupSeparator;
    this.useGrouping = (useGrouping == null) ? JST_DEFAULT_USE_GROUPING : booleanValue(useGrouping);
    this.currencySymbol = (currencySymbol == null) ? JST_DEFAULT_CURRENCY_SYMBOL : currencySymbol;
    this.useCurrency = (useCurrency == null) ? JST_DEFAULT_USE_CURRENCY : booleanValue(useCurrency);
    this.negativeParenthesis = (negativeParenthesis == null) ? JST_DEFAULT_NEGATIVE_PARENTHESIS : booleanValue(negativeParenthesis);
    this.groupSize = (groupSize == null) ? JST_DEFAULT_GROUP_SIZE : groupSize;
    this.spaceAfterCurrency = (spaceAfterCurrency == null) ? JST_DEFAULT_SPACE_AFTER_CURRENCY : booleanValue(spaceAfterCurrency);
    this.currencyInside = (currencyInside == null) ? JST_DEFAULT_CURRENCY_INSIDE : booleanValue(currencyInside);
    
    this.parse = function(string) {
        string = trim(string);
        if (isEmpty(string)) {
            return null;
        }
        string = replaceAll(string, this.groupSeparator, "");
        string = replaceAll(string, this.decimalSeparator, ".");
        string = replaceAll(string, this.currencySymbol, "");
        var isNegative = (string.indexOf("(") >= 0) || (string.indexOf("-") >= 0);
        string = replaceAll(string, "(", "");
        string = replaceAll(string, ")", "");
        string = replaceAll(string, "-", "");
        string = trim(string);
        //Check the valid characters
        if (!onlySpecified(string, JST_CHARS_NUMBERS + ".")) {
            return null;
        }
        var ret = parseFloat(string);
        ret = isNegative ? (ret * -1) : ret;
        return this.round(ret);
    }
    
    this.format = function(number) {
        //Check if the number is a String
        if (isNaN(number)) {
            number = this.parse(number);
        }
        if (isNaN(number)) return null;
        
        var isNegative = number < 0;
        number = Math.abs(number);
        var ret = "";
        var parts = String(this.round(number)).split(".");
        var intPart = parts[0];
        var decPart = parts.length > 1 ? parts[1] : "";
        
        //Checks if there's thousand separator
        if ((this.useGrouping) && (!isEmpty(this.groupSeparator))) {
            var group, temp = "";
            for (var i = intPart.length; i > 0; i -= this.groupSize) {
                group = intPart.substring(intPart.length - this.groupSize);
                intPart = intPart.substring(0, intPart.length - this.groupSize);
                temp = group + this.groupSeparator + temp;
            }
            intPart = temp.substring(0, temp.length-1);
        }
        
        //Starts building the return value
        ret = intPart;
        
        //Checks if there's decimal digits
        if (this.decimalDigits != 0) {
            if (this.decimalDigits > 0) {
                while (decPart.length < this.decimalDigits) {
                    decPart += "0";
                }
            }
            if (!isEmpty(decPart)) {
                ret += this.decimalSeparator + decPart;
            }
        }
        
        //Checks the negative number
        if (isNegative && !this.currencyInside) {
            if (this.negativeParenthesis) {
                ret = "(" + ret + ")";
            }  else {
                ret = "-" + ret;
            }
        }
        
        //Checks the currency symbol
        if (this.useCurrency) {
            ret = this.currencySymbol + (this.spaceAfterCurrency ? " " : "") + ret;
        }

        if (isNegative && this.currencyInside) {
            if (this.negativeParenthesis) {
                ret = "(" + ret + ")";
            }  else {
                ret = "-" + ret;
            }
        }

        return ret;
    }
    
    /*
     * Rounds the number to the precision
     */
    this.round = function(number) {
    
        //Checks the trivial cases
        if (this.decimalDigits < 0) {
            return number;
        } else if (this.decimalDigits == 0) {
            return Math.round(number);
        }
        
        var mult = Math.pow(10, this.decimalDigits);
    
        return Math.round(number * mult) / mult;
    }
}

/*****************************************************************************/

///////////////////////////////////////////////////////////////////////////////
/*
 * DateParser - Used for dates
 * Parameters:
 *     mask: The date mask. Accepts the following characters:
 *        d: Day         M: month        y: year
 *        h: 12 hour     H: 24 hour      m: minute
 *        s: second      S: millisecond
 *        a: am / pm     A: AM / PM
 *        /. -: Separators
 *        The default is the value of the JST_DEFAULT_DATE_MASK constant
 *     enforceLength: If set to true, each field on the parsed String must have 
 *        the same length as that field on the mask, ie: yyyy-MM-dd with 99-10-8
 *        would result on a parse error. Default: The value of the JST_DEFAULT_ENFORCE_LENGTH constant
 *     completeFieldsWith: A date used to complete missing fields
 * Additional methods (others than those defined on the Parser class):
 *     (none. all other methods are considered "private" and not supposed 
 *      for external use)
 */
function DateParser(mask, enforceLength, completeFieldsWith) {
    
    this.base = Parser;
    this.base();

    this.mask = (mask == null) ? JST_DEFAULT_DATE_MASK : String(mask);
    this.enforceLength = (enforceLength == null) ? JST_DEFAULT_ENFORCE_LENGTH : booleanValue(enforceLength);
    this.completeFieldsWith = completeFieldsWith || null;
    this.numberParser = new NumberParser(0);
    this.compiledMask = new Array();
    
    //Types of fields
    var LITERAL     =  0;
    var MILLISECOND =  1;
    var SECOND      =  2;
    var MINUTE      =  3;
    var HOUR_12     =  4;
    var HOUR_24     =  5;
    var DAY         =  6;
    var MONTH       =  7;
    var YEAR        =  8;
    var AM_PM_UPPER =  9;
    var AM_PM_LOWER = 10;
    
    this.parse = function(string) {
        if (isEmpty(string)) {
            return null;
        }
        string = trim(String(string)).toUpperCase();
        
        //Checks PM entries
        var pm = string.indexOf("PM") != -1;
        string = replaceAll(replaceAll(string, "AM", ""), "PM", "");
        
        //Get each field value
        var parts = [0, 0, 0, 0, 0, 0, 0];
        var partValues = ["", "", "", "", "", "", ""];
        var entries = [null, null, null, null, null, null, null];
        for (var i = 0; i < this.compiledMask.length; i++) {
            var entry = this.compiledMask[i];
            
            var pos = this.getTypeIndex(entry.type);
            
            //Check if is a literal or not
            if (pos == -1) {
                //Check if it's AM/PM or a literal
                if (entry.type == LITERAL) {
                    //Is a literal: skip it
                    string = string.substr(entry.length);
                } else {
                    //It's a AM/PM. All have been already cleared...
                }
            } else {
                var partValue = 0;
                if (i == (this.compiledMask.length - 1)) {
                    partValue = string;
                    string = "";
                } else {
                    var nextEntry = this.compiledMask[i + 1];
                    
                    //Check if the next part is a literal
                    if (nextEntry.type == LITERAL) {
                        var nextPos = string.indexOf(nextEntry.literal);

                        //Check if next literal is missing
                        if (nextPos == -1) {
                            //Probably the last part on the String
                            partValue = string
                            string = "";
                        } else {
                            //Get the value of the part from the string and cuts it
                            partValue = left(string, nextPos);
                            string = string.substr(nextPos);
                        }
                    } else {
                        //Get the value of the part from the string and cuts it
                        partValue = string.substring(0, entry.length);
                        string = string.substr(entry.length);
                    }
                }
                //Validate the part value and store it
                if (!onlyNumbers(partValue)) {
                    return null;
                }
                partValues[pos] = partValue;
                entries[pos] = entry;
                parts[pos] = isEmpty(partValue) ? this.minValue(parts, entry.type) : this.numberParser.parse(partValue);
            }
        }

        //If there's something else on the String, it's an error!
        if (!isEmpty(string)) {
            return null;
        }

        //If was PM, add 12 hours
        if (pm && (parts[JST_FIELD_HOUR] < 12)) {
            parts[JST_FIELD_HOUR] += 12;
        }
        //The month is from 0 to 11
        if (parts[JST_FIELD_MONTH] > 0) {
            parts[JST_FIELD_MONTH]--;
        }
        //Check for 2-digit year
        if (parts[JST_FIELD_YEAR] < 100) {
            if (parts[JST_FIELD_YEAR] < 50) {
                parts[JST_FIELD_YEAR] += 2000;
            } else {
                parts[JST_FIELD_YEAR] += 1900;
            }
        }
                
        //Validate the parts
        for (var i = 0; i < parts.length; i++) {
            var entry = entries[i]
            var part = parts[i];
            var partValue = partValues[i];
            if (part < 0) {
                return null;
            } else if (entry != null) {
                if (this.enforceLength && ((entry.length >= 0) && (partValue.length < entry.length))) {
                    return null;
                }
                part = parseInt(partValue, 10);
                if (isNaN(part) && this.completeFieldsWith != null) {
                    part = parts[i] = getDateField(this.completeFieldsWith, i); 
                }
                if ((part < this.minValue(parts, entry.type)) || (part > this.maxValue(parts, entry.type))) {
                    return null;
                }
            } else if (i == JST_FIELD_DAY && part == 0) {
                part = parts[i] = 1;
            }
        }        

        //Build the return
        return new Date(parts[JST_FIELD_YEAR], parts[JST_FIELD_MONTH], parts[JST_FIELD_DAY], parts[JST_FIELD_HOUR], 
            parts[JST_FIELD_MINUTE], parts[JST_FIELD_SECOND], parts[JST_FIELD_MILLISECOND]);
    }
    
    this.format = function(date) {
        if (!(date instanceof Date)) {
            date = this.parse(date);
        }
        if (date == null) {
            return "";
        }
        var ret = "";
        var parts = [date.getMilliseconds(), date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth(), date.getFullYear()];

        //Iterate through the compiled mask
        for (var i = 0; i < this.compiledMask.length; i++) {
            var entry = this.compiledMask[i];
            switch (entry.type) {
                case LITERAL: 
                    ret += entry.literal;
                    break;
                case AM_PM_LOWER:
                    ret += (parts[JST_FIELD_HOUR] < 12) ? "am" : "pm";
                    break;
                case AM_PM_UPPER:
                    ret += (parts[JST_FIELD_HOUR] < 12) ? "AM" : "PM";
                    break;
                case MILLISECOND:
                case SECOND:
                case MINUTE:
                case HOUR_24:
                case DAY:
                    ret += lpad(parts[this.getTypeIndex(entry.type)], entry.length, "0");
                    break;
                case HOUR_12:
                    ret += lpad(parts[JST_FIELD_HOUR] % 12, entry.length, "0");
                    break;
                case MONTH:
                    ret += lpad(parts[JST_FIELD_MONTH] + 1, entry.length, "0");
                    break;
                case YEAR:
                    ret += lpad(right(parts[JST_FIELD_YEAR], entry.length), entry.length, "0");
                    break;
            }
        }
        
        //Return the value
        return ret;
    }
    
    /*
     * Returns the maximum value of the field
     */
    this.maxValue = function(parts, type) {
        switch (type) {
            case MILLISECOND: return 999;
            case SECOND: return 59;
            case MINUTE: return 59;
            case HOUR_12: case HOUR_24: return 23; //Internal value: both 23
            case DAY: return getMaxDay(parts[JST_FIELD_MONTH], parts[JST_FIELD_YEAR]);
            case MONTH: return 12;
            case YEAR: return 9999;
            default: return 0;
        }
    }

    /*
     * Returns the minimum value of the field
     */
    this.minValue = function(parts, type) {
        switch (type) {
            case DAY: case MONTH: case YEAR: return 1;
            default: return 0;
        }
    }
        
    /*
     * Returns the field's type
     */
    this.getFieldType = function(field) {
        switch (field.charAt(0)) {
            case "S": return MILLISECOND;
            case "s": return SECOND;
            case "m": return MINUTE;
            case "h": return HOUR_12;
            case "H": return HOUR_24;
            case "d": return DAY;
            case "M": return MONTH;
            case "y": return YEAR;
            case "a": return AM_PM_LOWER;
            case "A": return AM_PM_UPPER;
            default: return LITERAL;
        }
    }
    
    /*
     * Returns the type's index in the field array
     */
    this.getTypeIndex = function(type) {
        switch (type) {
            case MILLISECOND: return JST_FIELD_MILLISECOND;
            case SECOND: return JST_FIELD_SECOND;
            case MINUTE: return JST_FIELD_MINUTE;
            case HOUR_12: case HOUR_24: return JST_FIELD_HOUR;
            case DAY: return JST_FIELD_DAY;
            case MONTH: return JST_FIELD_MONTH;
            case YEAR: return JST_FIELD_YEAR;
            default: return -1;
        }
    }
    
    /*
     * Class containing information about a field
     */
    var Entry = function(type, length, literal) {
        this.type = type;
        this.length = length || -1;
        this.literal = literal;
    }
    
    /*
     * Compiles the mask
     */
    this.compile = function() {
        var current = "";
        var old = "";
        var part = "";
        this.compiledMask = new Array();
        for (var i = 0; i < this.mask.length; i++) {
            current = this.mask.charAt(i);
            
            //Checks if still in the same field
            if ((part == "") || (current == part.charAt(0))) {
                part += current;
            } else {
                //Field changed: use the field
                var type = this.getFieldType(part);
                
                //Store the mask entry
                this.compiledMask[this.compiledMask.length] = new Entry(type, part.length, part);

                //Handles the field changing
                part = "";
                i--;
            }
        }
        //Checks if there's another unparsed part
        if (part != "") {
            var type = this.getFieldType(part);
            
            //Store the mask entry
            this.compiledMask[this.compiledMask.length] = new Entry(type, part.length, part);
        }
    }
    
    /*
     * Changes the format mask
     */
    this.setMask = function(mask) {
        this.mask = mask;
        this.compile();
    }
    
    //Initially set the mask
    this.setMask(this.mask);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * BooleanParser - used for boolean values
 * Parameters:
 *     trueValue: The value returned when parsing true. Default: the JST_DEFAULT_TRUE_VALUE value
 *     falseValue: The value returned when parsing true. Default: the JST_DEFAULT_FALSE_VALUE value
 */
function BooleanParser(trueValue, falseValue, useBooleanValue) {
    this.base = Parser;
    this.base();

    this.trueValue = trueValue || JST_DEFAULT_TRUE_VALUE;
    this.falseValue = falseValue || JST_DEFAULT_FALSE_VALUE;
    this.useBooleanValue = useBooleanValue || JST_DEFAULT_USE_BOOLEAN_VALUE;

    this.parse = function(string) {
        if (this.useBooleanValue && booleanValue(string)) {
            return true;
        }
        return string == JST_DEFAULT_TRUE_VALUE;
    }
    
    this.format = function(bool) {
        return booleanValue(bool) ? this.trueValue : this.falseValue;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * StringParser - Parser for String values
 */
function StringParser() {
    this.base = Parser;
    this.base();

    this.parse = function(string) {
        return String(string);
    }
    
    this.format = function(string) {
        return String(string);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * EscapeParser - used to escape / unescape characters
 * Parameters:
 *     extraChars: A string containing the characters forced to \uXXXX. 
 *                 Default: ""
 *     onlyExtra: A boolean indicating if only then extraCharacters will 
 *                be processed. Default: false
 */
function EscapeParser(extraChars, onlyExtra) {
    this.base = Parser;
    this.base();
    
    this.extraChars = extraChars || "";
    this.onlyExtra = booleanValue(onlyExtra);
    
    this.parse = function(value) {
        if (value == null) {
            return null;
        }
        return unescapeCharacters(String(value), extraChars, onlyExtra);
    }
    
    this.format = function(value) {
        if (value == null) {
            return null;
        }
        return escapeCharacters(String(value), onlyExtra);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * CustomParser - parses / formats using custom functions
 * Parameters:
 *     formatFunction: The function that will format the data
 *     parseFunction: The function that will parse the data
 */
function CustomParser(formatFunction, parseFunction) {
    this.base = Parser;
    this.base();
    
    this.formatFunction = formatFunction || function(value) { return value; };
    this.parseFunction = parseFunction || function(value) { return value; };
    
    this.parse = function(value) {
        return parseFunction.apply(this, arguments);
    }
    
    this.format = function(value) {
        return formatFunction.apply(this, arguments);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * WrapperParser - wraps another parser, adding custom functions to it's results
 * Parameters:
 *     wrappedParser: The wrapped parser
 *     formatFunction: The function that will format the data that has been already parsed by the wrapped parser
 *     parseFunction: The function that will parse the data before the wrapped parser
 */
function WrapperParser(wrappedParser, formatFunction, parseFunction) {
    this.base = Parser;
    this.base();
    
    this.wrappedParser = wrappedParser || new CustomParser();
    this.formatFunction = formatFunction || function(value) { return value; };
    this.parseFunction = parseFunction || function(value) { return value; };
    
    this.format = function(value) {
        var formatted = this.wrappedParser.format.apply(this.wrappedParser, arguments);
        var args = [];
        args[0] = formatted;
        args[1] = arguments[0];
        for (var i = 1, len = arguments.length; i < len; i++) {
            args[i + 1] = arguments[i];
        }
        return formatFunction.apply(this, args);
    }
    
    this.parse = function(value) {
        var parsed = parseFunction.apply(this, arguments);
        arguments[0] = parsed;
        return this.wrappedParser.parse.apply(this.wrappedParser, arguments);
    }
}
/*
 * InputMask version 2.2.4
 *
 * This script contains several classes to restrict the user input on HTML inputs.
 *
 * Dependencies: 
 *  - JavaScriptUtil.js
 *  - Parsers.js (for NumberMask and DateMask)
 *
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Home Page: http://javascriptools.sourceforge.net
 *
 * You may freely distribute this file, just don't remove this header
 */

/*
 * Default value constants
 */
//Will InputMask be applied when the user strokes a backspace?
var JST_NUMBER_MASK_APPLY_ON_BACKSPACE = true;
//Will InputMask validate the text on the onblur event?
var JST_MASK_VALIDATE_ON_BLUR = true;
//Allow negative values by default on the NumberMask
var JST_DEFAULT_ALLOW_NEGATIVE = true;
//Will the NumberMask digits be from left to right by default?
var JST_DEFAULT_LEFT_TO_RIGHT = false;
//Validates the typed text on DateMask?
var JST_DEFAULT_DATE_MASK_VALIDATE = true;
//The default message for DateMask validation errors
var JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE = "";
//The default padFunction for years
var JST_DEFAULT_DATE_MASK_YEAR_PAD_FUNCTION = getFullYear;
//The default padFunction for am/pm field
var JST_DEFAULT_DATE_MASK_AM_PM_PAD_FUNCTION = function(value) {
    if (isEmpty(value)) return "";
    switch (left(value, 1)) {
        case 'a': return 'am';
        case 'A': return 'AM';
        case 'p': return 'pm';
        case 'P': return 'PM';
    }
    return value;
} 
//The default decimal separator for decimal separator for the JST_MASK_DECIMAL 
//Note that this does not affect the NumberMask instances
var JST_FIELD_DECIMAL_SEPARATOR = new Literal(typeof(JST_DEFAULT_DECIMAL_SEPARATOR) == "undefined" ? "," : JST_DEFAULT_DECIMAL_SEPARATOR);
//The SizeLimit default output text
var JST_DEFAULT_LIMIT_OUTPUT_TEXT = "${left}";

///////////////////////////////////////////////////////////////////////////////
//Temporary variables for the masks
numbers = new Input(JST_CHARS_NUMBERS);
optionalNumbers = new Input(JST_CHARS_NUMBERS);
optionalNumbers.optional = true;
oneToTwoNumbers = new Input(JST_CHARS_NUMBERS, 1, 2);
year = new Input(JST_CHARS_NUMBERS, 1, 4, getFullYear);
dateSep = new Literal("/");
dateTimeSep = new Literal(" ");
timeSep = new Literal(":");

/*
 * Some prebuilt masks
 */
var JST_MASK_NUMBERS       = [numbers];
var JST_MASK_DECIMAL       = [numbers, JST_FIELD_DECIMAL_SEPARATOR, optionalNumbers];
var JST_MASK_UPPER         = [new Upper(JST_CHARS_LETTERS)];
var JST_MASK_LOWER         = [new Lower(JST_CHARS_LETTERS)];
var JST_MASK_CAPITALIZE    = [new Capitalize(JST_CHARS_LETTERS)];
var JST_MASK_LETTERS       = [new Input(JST_CHARS_LETTERS)];
var JST_MASK_ALPHA         = [new Input(JST_CHARS_ALPHA)];
var JST_MASK_ALPHA_UPPER   = [new Upper(JST_CHARS_ALPHA)];
var JST_MASK_ALPHA_LOWER   = [new Lower(JST_CHARS_ALPHA)];
var JST_MASK_DATE          = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year];
var JST_MASK_DATE_TIME     = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year, dateTimeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers];
var JST_MASK_DATE_TIME_SEC = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year, dateTimeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers];

/* We ignore the following characters on mask:
45 - insert, 46 - del (not on konqueror), 35 - end, 36 - home, 33 - pgup, 
34 - pgdown, 37 - left, 39 - right, 38 - up, 40 - down,
127 - del on konqueror, 4098 shift + tab on konqueror */
var JST_IGNORED_KEY_CODES = [45, 35, 36, 33, 34, 37, 39, 38, 40, 127, 4098];
if (navigator.userAgent.toLowerCase().indexOf("khtml") < 0) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = 46;
}
//All other with keyCode < 32 are also ignored
for (var i = 0; i < 32; i++) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = i;
}
//F1 - F12 are also ignored
for (var i = 112; i <= 123; i++) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = i;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main InputMask class.
 * Parameters: 
 *    fields: The mask fields
 *    control: The reference to the control that is being masked
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    changeFunction: The additional function instance used on the change event
 */
function InputMask(fields, control, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, changeFunction) {
    
    //Check if the fields are a String
    if (isInstance(fields, String)) {
        fields = maskBuilder.parse(fields);
    } else if (isInstance(fields, MaskField)) {
        fields = [fields];
    }
    
    //Check if the fields are a correct array of fields
    if (isInstance(fields, Array)) {
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (!isInstance(field, MaskField)) {
                alert("Invalid field: " + field);
                return;
            }
        }
    } else {
        alert("Invalid field array: " + fields);
        return;
    }
    
    this.fields = fields;

    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to mask");
        return;
    } else {
        this.control = control;
        prepareForCaret(this.control);
        this.control.supportsCaret = isCaretSupported(this.control);
    }
    
    //Set the control's reference to the mask descriptor
    this.control.mask = this;
    this.control.pad = false;
    this.control.ignore = false;

    //Set the function calls
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.updateFunction = updateFunction || null;
    this.changeFunction = changeFunction || null;

    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }

        this.keyCode = typedCode(event);
        
        //Check for extra function on keydown
        if (this.mask.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyDownFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keydown", onKeyDown);
    
    //The KeyPress event will filter the typed character
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }

        //Get what's been typed        
        var keyCode = this.keyCode || typedCode(event);
        var ignore = event.altKey || event.ctrlKey || inArray(keyCode, JST_IGNORED_KEY_CODES);

        //When a range is selected, clear it
        if (!ignore) {
            var range = getInputSelectionRange(this);
            if (range != null && range[0] != range[1]) {
                replaceSelection(this, "");
            }
        }
        
        //Prepre the variables
        this.caretPosition = getCaret(this);
        this.setFixedLiteral = null;
        var typedChar = this.typedChar = ignore ? "" : String.fromCharCode(typedCode(event));
        var fieldDescriptors = this.fieldDescriptors = this.mask.getCurrentFields();
        var currentFieldIndex = this.currentFieldIndex = this.mask.getFieldIndexUnderCaret();

        //Check if any field accept the typed key
        var accepted = false;
        if (!ignore) {
            var currentField = this.mask.fields[currentFieldIndex];
            accepted = currentField.isAccepted(typedChar);
            if (accepted) {
                //Apply basic transformations
                if (currentField.upper) {
                    typedChar = this.typedChar = typedChar.toUpperCase();
                } else if (currentField.lower) {
                    typedChar = this.typedChar = typedChar.toLowerCase();
                }
                if (currentFieldIndex == this.mask.fields.length - 2) {
                    var nextFieldIndex = currentFieldIndex + 1;
                    var nextField = this.mask.fields[nextFieldIndex];
                    if (nextField.literal) {
                        //When this field is the last input and the next field is literal, if this field is complete, append the literal also
                        var currentFieldIsComplete = !currentField.acceptsMoreText(fieldDescriptors[currentFieldIndex].value + typedChar);
                        if (currentFieldIsComplete) {
                            this.setFixedLiteral = nextFieldIndex;
                        }
                    }
                }
            } else {
                var previousFieldIndex = currentFieldIndex - 1;
                if (currentFieldIndex > 0 && this.mask.fields[previousFieldIndex].literal && isEmpty(fieldDescriptors[previousFieldIndex].value)) {
                    //When passed by the previous field without it having a value, force it to have a value
                    this.setFixedLiteral = previousFieldIndex;
                    accepted = true;
                } else if (currentFieldIndex < this.mask.fields.length - 1) {
                    //When typed the next literal, pad this field and go to the next one
                    var descriptor = fieldDescriptors[currentFieldIndex];
                    var nextFieldIndex = currentFieldIndex + 1;
                    var nextField = this.mask.fields[nextFieldIndex];
                    if (nextField.literal && nextField.text.indexOf(typedChar) >= 0) {
                        //Mark the field as setting the current literal
                        this.setFixedLiteral = nextFieldIndex;
                        accepted = true;
                    }
                } else if (currentFieldIndex == this.mask.fields.length - 1 && currentField.literal) {
                    // When the mask ends with a literal and it's the current field, force it to have a value
                    this.setFixedLiteral = currentFieldIndex;
                    accepted = true;
                }
            }
        }

        //Check for extra function on keypress
        if (this.mask.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyPressFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        
        //Return on ignored keycodes
        if (ignore) {
            return;
        }
        
        //Apply the mask
        var shouldApplyMask = !ignore && accepted;
        if (shouldApplyMask) {
            applyMask(this.mask, false);
        }
        
        this.keyCode = null;
        return preventDefault(event);
    }
    observeEvent(this.control, "keypress", onKeyPress);

    //The KeyUp event is no longer used, and will be kept for backward compatibility
    function onKeyUp (event) {
        if (window.event) {
            event = window.event;
        }

        //Check for extra function on keyup
        if (this.mask.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyUpFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keyup", onKeyUp);
    
    //Add support for onchange event
    function onFocus (event) {
        this._lastValue = this.value;
    }
    observeEvent(this.control, "focus", onFocus);
    
    //The Blur event will apply the mask again, to ensure the user will not paste an invalid value
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }
        
        document.fieldOnBlur = this;
        try {        
            var valueChanged = this._lastValue != this.value;
            
            if (valueChanged && JST_MASK_VALIDATE_ON_BLUR) {
                applyMask(this.mask, true);
            }
            
            if (this.mask.changeFunction != null) {
                if (valueChanged && this.mask.changeFunction != null) {
                    var e = {};
                    for (property in event) {
                        e[property] = event[property];
                    }
                    e.type = "change";
                    invokeAsMethod(this, this.mask.changeFunction, [e, this.mask]);
                }
            }
                
            //Check for extra function on blur
            if (this.mask.blurFunction != null) {
                var ret = invokeAsMethod(this, this.mask.blurFunction, [event, this.mask]);
                if (ret == false) {
                    return preventDefault(event);
                }
            }
            return true;
        } finally {
            document.fieldOnBlur = null;
        }
    }
    observeEvent(this.control, "blur", onBlur);
    
    //Method to determine whether the mask fields are complete
    this.isComplete = function () {

        //Ensures the field values will be parsed
        applyMask(this, true);
        
        //Get the fields
        var descriptors = this.getCurrentFields();

        //Check if there is some value
        if (descriptors == null || descriptors.length == 0) {
            return false;
        }

        //Check for completed values
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.input && !field.isComplete(descriptors[i].value) && !field.optional) {
                return false;
            }
        }
        return true;
    }
    
    //Method to force a mask update
    this.update = function () {
        applyMask(this, true);
    }
    
    //Returns an array with objects containing values, start position and end positions
    this.getCurrentFields = function(value) {
        value = value || this.control.value;
        var descriptors = [];
        var currentIndex = 0;
        //Get the value for input fields
        var lastInputIndex = -1;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            var fieldValue = "";
            var descriptor = {};
            if (field.literal) {
                if (lastInputIndex >= 0) {
                    var lastInputField = this.fields[lastInputIndex];
                    var lastInputDescriptor = descriptors[lastInputIndex];
                    //When no text is accepted by the last input field, 
                    //assume the next input will be used, so, assume the value for this literal as it's text
                    if (field.text.indexOf(mid(value, currentIndex, 1)) < 0 && lastInputField.acceptsMoreText(lastInputDescriptor.value)) {
                        descriptor.begin = -1;
                    } else {
                        descriptor.begin = currentIndex;
                    }
                }
                if (currentIndex >= value.length) {
                    break;
                }
                if (value.substring(currentIndex, currentIndex + field.text.length) == field.text) {
                    currentIndex += field.text.length;
                }
            } else {
                //Check if there's a value
                var upTo = field.upTo(value, currentIndex);
                if (upTo < 0 && currentIndex >= value.length) {
                    break;
                }
                fieldValue = upTo < 0 ? "" : field.transformValue(value.substring(currentIndex, upTo + 1));
                descriptor.begin = currentIndex;
                descriptor.value = fieldValue;
                currentIndex += fieldValue.length;
                lastInputIndex = i;
            }
            descriptors[i] = descriptor;
        }
        
        //Complete the descriptors
        var lastWithValue = descriptors.length - 1;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (i > lastWithValue) {
                descriptors[i] = {value: "", begin: -1};
            } else {
                // Literals with inputs on both sides that have values also have values
                if (field.literal) {
                    var descriptor = descriptors[i]; 

                    //Literals that have been set begin < 0 will have no value 
                    if (descriptor.begin < 0) {
                        descriptor.value = "";
                        continue;
                    }
                    
                    //Find the previous input value
                    var previousField = null;
                    var previousValueComplete = false;
                    for (var j = i - 1; j >= 0; j--) {
                        var current = this.fields[j]; 
                        if (current.input) {
                            previousField = current;
                            previousValueComplete = current.isComplete(descriptors[j].value);
                            if (previousValueComplete) {
                                break;
                            } else {
                                previousField = null;
                            }
                        }
                    }

                    //Find the next input value
                    var nextField = null;
                    var nextValueExists = null;
                    for (var j = i + 1; j < this.fields.length && j < descriptors.length; j++) {
                        var current = this.fields[j]; 
                        if (current.input) {
                            nextField = current;
                            nextValueExists = !isEmpty(descriptors[j].value);
                            if (nextValueExists) {
                                break;
                            } else {
                                nextField = null;
                            }
                        }
                    }
                    //3 cases for using the value: 
                    // * both previous and next inputs have complete values
                    // * no previous input and the next has complete value
                    // * no next input and the previous has complete value
                    if ((previousValueComplete && nextValueExists) || (previousField == null && nextValueExists) || (nextField == null && previousValueComplete)) {
                        descriptor.value = field.text;
                    } else {
                        descriptor.value = "";
                        descriptor.begin = -1;
                    }
                }
            }
        }
        return descriptors;
    }
    
    //Returns the field index under the caret
    this.getFieldIndexUnderCaret = function() {
        var value = this.control.value;
        var caret = getCaret(this.control);
        //When caret operations are not supported, assume it's at text end
        if (caret == null) caret = value.length;
        var lastPosition = 0;
        var lastInputIndex = null;
        var lastInputAcceptsMoreText = false;
        var lastWasLiteral = false;
        var returnNextInput = isEmpty(value) || caret == 0;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.input) {
                //Check whether should return the next input field
                if (returnNextInput || lastPosition > value.length) {
                    return i;
                }
                //Find the field value
                var upTo = field.upTo(value, lastPosition)
                if (upTo < 0) {
                    return i; //lastInputIndex == null || lastWasLiteral ? i : lastInputIndex;
                }
                //Handle unlimited fields
                if (field.max < 0) {
                    var nextField = null;
                    if (i < this.fields.length - 1) {
                        nextField = this.fields[i + 1];
                    }
                    if (caret - 1 <= upTo && (nextField == null || nextField.literal)) {
                        return i;
                    } 
                }
                var fieldValue = value.substring(lastPosition, upTo + 1);
                var acceptsMoreText = field.acceptsMoreText(fieldValue);
                var positionToCheck = acceptsMoreText ? caret - 1 : caret
                if (caret >= lastPosition && positionToCheck <= upTo) {
                    return i;
                }
                lastInputAcceptsMoreText = acceptsMoreText;
                lastPosition = upTo + 1;
                lastInputIndex = i;
            } else {
                if (caret == lastPosition) {
                    returnNextInput = !lastInputAcceptsMoreText;
                }
                lastPosition += field.text.length;
            }
            lastWasLiteral = field.literal;
        }
        return this.fields.length - 1;
    }
    
    //Method to determine if the mask is only for filtering which chars can be typed
    this.isOnlyFilter = function () {
        if (this.fields == null || this.fields.length == 0) {
            return true;
        }
        if (this.fields.length > 1) {
            return false;
        }
        var field = this.fields[0];
        return field.input && field.min <= 1 && field.max <= 0;
    }
    
    //Returns if this mask changes the text case
    this.transformsCase = function() {
        if (this.fields == null || this.fields.length == 0) {
            return false;
        }
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.upper || field.lower || field.capitalize) {
                return true;
            }
        }
        return false;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main NumberMask class.
 * Parameters: 
 *    parser: The NumberParser instance used by the mask
 *    control: The reference to the control that is being masked
 *    maxIntegerDigits: The limit for integer digits (excluding separators). 
 *                      Default: -1 (no limit)
 *    allowNegative: Should negative values be allowed? Default: see the 
 *                   value of the JST_DEFAULT_ALLOW_NEGATIVE constant.
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    leftToRight: Indicates if the input will be processed from left to right. 
 *                 Default: the JST_DEFAULT_LEFT_TO_RIGHT constant
 *    changeFunction: The additional function instance used on the change event
 */
function NumberMask(parser, control, maxIntegerDigits, allowNegative, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, leftToRight, changeFunction) {
    //Validate the parser
    if (!isInstance(parser, NumberParser)) {
        alert("Illegal NumberParser instance");
        return;
    }
    this.parser = parser;
    
    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to mask");
        return;
    } else {
        this.control = control;
        prepareForCaret(this.control);
        this.control.supportsCaret = isCaretSupported(this.control);
    }

    //Get the additional properties
    this.maxIntegerDigits = maxIntegerDigits || -1;
    this.allowNegative = allowNegative || JST_DEFAULT_ALLOW_NEGATIVE;
    this.leftToRight = leftToRight || JST_DEFAULT_LEFT_TO_RIGHT;

    //Set the control's reference to the mask and other aditional flags
    this.control.mask = this;
    this.control.ignore = false;
    this.control.swapSign = false;
    this.control.toDecimal = false;
    this.control.oldValue = this.control.value;
    
    //Set the function calls
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.updateFunction = updateFunction || null;
    this.changeFunction = changeFunction || null;
    
    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }
        
        var keyCode = typedCode(event);
        this.ignore = event.altKey || event.ctrlKey || inArray(keyCode, JST_IGNORED_KEY_CODES);

        //Check for extra function on keydown
        if (this.mask.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyDownFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        
        return true;
    }
    observeEvent(this.control, "keydown", onKeyDown);

    //The KeyPress event will filter the keys
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        var typedChar = String.fromCharCode(keyCode);

        //Check for extra function on keypress
        if (this.mask.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyPressFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        if (this.ignore) {
            return true;
        }

        //Store the old value
        this.oldValue = this.value;

        //Check for the minus sign
        if (typedChar == '-') {
            if (this.mask.allowNegative) {
                if (this.value == '') {
                    //Typing the negative sign on the empty field. ok.
                    this.ignore = true;
                    return true;
                }
                //The field is not empty. Set the swapSign flag, so applyNumberMask will do the job
                this.swapSign = true;
                applyNumberMask(this.mask, false, false);
            }
            return preventDefault(event);
        }
        //Check for the decimal separator
        if (this.mask.leftToRight && typedChar == this.mask.parser.decimalSeparator && this.mask.parser.decimalDigits != 0) {
            this.toDecimal = true;
            if (this.supportsCaret) {
                return preventDefault(event);
            }
        }
        this.swapSign = false;
        this.toDecimal = false;
        this.accepted = false;
        if (this.mask.leftToRight && typedChar == this.mask.parser.decimalSeparator) {
            if (this.mask.parser.decimalDigits == 0 || this.value.indexOf(this.mask.parser.decimalSeparator) >= 0) {
                this.accepted = true;
                return preventDefault(event);
            } else {
                return true;
            }
        }
        this.accepted = onlyNumbers(typedChar);
        if (!this.accepted) {
            return preventDefault(event);
        }
    }
    observeEvent(this.control, "keypress", onKeyPress);
    
    //The KeyUp event will apply the mask
    function onKeyUp (event) {
        //Check an invalid parser
        if (this.mask.parser.decimalDigits < 0 && !this.mask.leftToRight) {
            alert("A NumberParser with unlimited decimal digits is not supported on NumberMask when the leftToRight property is false");
            this.value = "";
            return false;
        }

        if (window.event) {
            event = window.event;
        }
        //Check if it's not an ignored key
        var keyCode = typedCode(event);
        var isBackSpace = (keyCode == 8) && JST_NUMBER_MASK_APPLY_ON_BACKSPACE;
        if (this.supportsCaret && (this.toDecimal || (!this.ignore && this.accepted) || isBackSpace)) {
            //If the number was already 0 and we stroke a backspace, clear the text value
            if (isBackSpace && this.mask.getAsNumber() == 0) {
                this.value = "";
            }
            applyNumberMask(this.mask, false, isBackSpace);
        }
        //Check for extra function on keyup
        if (this.mask.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyUpFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        return true;
    }
    observeEvent(this.control, "keyup", onKeyUp);
    
    //Add support for onchange event
    function onFocus (event) {
        if (this.mask.changeFunction != null) {
            this._lastValue = this.value;
        }
    }
    observeEvent(this.control, "focus", onFocus);

    //The Blur event will apply the mask again, to ensure the user will not paste an invalid value
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }
        
        if (JST_MASK_VALIDATE_ON_BLUR) {
            if (this.value == '-') {
                this.value = '';
            } else {
                applyNumberMask(this.mask, true, false);
            }
        }
        
        if (this.mask.changeFunction != null) {
            if (this._lastValue != this.value && this.mask.changeFunction != null) {
                var e = {};
                for (property in event) {
                    e[property] = event[property];
                }
                e.type = "change";
                invokeAsMethod(this, this.mask.changeFunction, [e, this.mask]);
            }
        }
        
        //Check for extra function on keydown
        if (this.mask.blurFunction != null) {
            var ret = invokeAsMethod(this, this.mask.blurFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        return true;
    }
    observeEvent(this.control, "blur", onBlur);
    
    //Method to determine if the mask is all complete
    this.isComplete = function() {
        return this.control.value != "";
    }
    
    //Returns the control value as a number
    this.getAsNumber = function() {
        var number = this.parser.parse(this.control.value);
        if (isNaN(number)) {
            number = null;
        }
        return number;
    }

    //Sets the control value as a number
    this.setAsNumber = function(number) {
        var value = "";
        if (isInstance(number, Number)) {
            value = this.parser.format(number);
        }
        this.control.value = value;
        this.update();
    }
    
    //Method to force a mask update
    this.update = function() {
        applyNumberMask(this, true, false);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main DateMask class.
 * Parameters: 
 *    parser: The DateParser instance used by the mask
 *    control: The reference to the control that is being masked
 *    validate: Validate the control on the onblur event? Default: The JST_DEFAULT_DATE_MASK_VALIDATE value
 *    validationMessage: Message alerted on validation on fail. The ${value} 
 *       placeholder may be used as a substituition for the field value, and ${mask} 
 *       for the parser mask. Default: the JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE value
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    changeFunction: The additional function instance used on the change event
 */
function DateMask(parser, control, validate, validationMessage, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, changeFunction) {
    
    //Validate the parser
    if (isInstance(parser, String)) {
        parser = new DateParser(parser);
    }
    if (!isInstance(parser, DateParser)) {
        alert("Illegal DateParser instance");
        return;
    }
    this.parser = parser;
    
    //Set a control to keyPressFunction, to ensure the validation won't be shown twice
    this.extraKeyPressFunction = keyPressFunction || null;
    function maskKeyPressFunction (event, dateMask) {
        dateMask.showValidation = true;
        if (dateMask.extraKeyPressFunction != null) {
            var ret = invokeAsMethod(this, dateMask.extraKeyPressFunction, [event, dateMask]);
            if (ret == false) {
                return false;
            }
        }
        return true;
    }
    
    //Set the validation to blurFunction, plus the informed blur function
    this.extraBlurFunction = blurFunction || null;
    function maskBlurFunction (event, dateMask) {
        var control = dateMask.control;
        if (dateMask.validate && control.value.length > 0) {
            var controlValue = control.value.toUpperCase();
            controlValue = controlValue.replace(/A[^M]/, "AM");
            controlValue = controlValue.replace(/A$/, "AM");
            controlValue = controlValue.replace(/P[^M]/, "PM");
            controlValue = controlValue.replace(/P$/, "PM");
            var date = dateMask.parser.parse(controlValue);
            if (date == null) {
                var msg = dateMask.validationMessage;
                if (dateMask.showValidation && !isEmpty(msg)) {
                    dateMask.showValidation = false;
                    msg = replaceAll(msg, "${value}", control.value);
                    msg = replaceAll(msg, "${mask}", dateMask.parser.mask);
                    alert(msg);
                }
                control.value = "";
                control.focus();
            } else {
                control.value = dateMask.parser.format(date);
            }
        }
        if (dateMask.extraBlurFunction != null) {
            var ret = invokeAsMethod(this, dateMask.extraBlurFunction, [event, dateMask]);
            if (ret == false) {
                return false;
            }
        }
        return true;
    }
    
    //Build the fields array
    var fields = new Array();
    var old = '';
    var mask = this.parser.mask;
    while (mask.length > 0) {
        var field = mask.charAt(0);
        var size = 1;
        var maxSize = -1;
        var padFunction = null;
        while (mask.charAt(size) == field) {
            size++;
        }
        mask = mid(mask, size);
        var accepted = JST_CHARS_NUMBERS;
        switch (field) {
            case 'd': case 'M': case 'h': case 'H': case 'm': case 's': 
                maxSize = 2;
                break;
            case 'y':
                padFunction = JST_DEFAULT_DATE_MASK_YEAR_PAD_FUNCTION;
                if (size == 2) {
                    maxSize = 2;
                } else {
                    maxSize = 4;
                }
                break;
            case 'a': case 'A': case 'p': case 'P':
                maxSize = 2;
                padFunction = JST_DEFAULT_DATE_MASK_AM_PM_PAD_FUNCTION;
                accepted = 'aApP';
                break;
            case 'S':
                maxSize = 3;
                break;
        }
        var input;
        if (maxSize == -1) {
            input = new Literal(field);
        } else {
            input = new Input(accepted, size, maxSize);
            if (padFunction == null) {
                input.padFunction = new Function("text", "return lpad(text, " + maxSize + ", '0')");
            } else {
                input.padFunction = padFunction;
            }
        }
        fields[fields.length] = input;
    }
    
    //Initialize the superclass
    this.base = InputMask;
    this.base(fields, control, maskKeyPressFunction, keyDownFunction, keyUpFunction, maskBlurFunction, updateFunction, changeFunction);
    
    //Store the additional variables
    this.validate = validate == null ? JST_DEFAULT_DATE_MASK_VALIDATE : booleanValue(validate);
    this.showValidation = true;
    this.validationMessage = validationMessage || JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE;
    this.control.dateMask = this;
    
    //Returns the control value as a date
    this.getAsDate = function() {
        return this.parser.parse(this.control.value);
    }

    //Sets the control value as a date
    this.setAsDate = function(date) {
        var value = "";
        if (isInstance(date, Date)) {
            value = this.parser.format(date);
        }
        this.control.value = value;
        this.update();
    }
}


///////////////////////////////////////////////////////////////////////////////
/*
 * This class limits the size of an input (mainly textAreas, that does not have a 
 * maxLength attribute). Optionally, can use another element to output the number 
 * of characters on the element and/or the number of characters left.
 * Like the masks, this class uses the keyUp and blur events, may use additional
 * callbacks for those events.
 * Parameters:
 *     control: The textArea reference or name
 *     maxLength: The maximum text length
 *     output: The element to output the number of characters left. Default: none
 *     outputText: The text. May use two placeholders: 
 *         ${size} - Outputs the current text size
 *         ${left} - Outputs the number of characters left
 *         ${max} - Outputs the maximum number characters that the element accepts
 *         Examples: "${size} / ${max}", "You typed ${size}, and have ${left} more characters to type"
 *         Default: "${left}"
 *     updateFunction: If set, this function will be called when the text is updated. So, custom actions
 *         may be performed. The arguments passed to the function are: The control, the text size, the maximum size
 *         and the number of characters left.
 *     keyUpFunction: The additional handler to the keyUp event. Default: none
 *     blurFunction: The additional handler to the blur event. Default: none
 *     keyPressFunction: The additional handler to the keyPress event. Default: none
 *     keyDownFunction: The additional handler to the keyDown event. Default: none
 *     changeFunction: The additional function instance used on the change event. Default: none
 */
function SizeLimit(control, maxLength, output, outputText, updateFunction, keyUpFunction, blurFunction, keyDownFunction, keyPressFunction, changeFunction) {
    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to limit size");
        return;
    } else {
        this.control = control;
        prepareForCaret(control);
    }
    
    if (!isInstance(maxLength, Number)) {
        alert("Invalid maxLength");
        return;
    }

    //Get the additional properties
    this.control = control;
    this.maxLength = maxLength;
    this.output = output || null;
    this.outputText = outputText || JST_DEFAULT_LIMIT_OUTPUT_TEXT;
    this.updateFunction = updateFunction || null;
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.changeFunction = changeFunction || null;

    //Set the control's reference to the mask descriptor
    this.control.sizeLimit = this;

    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        this.ignore = inArray(keyCode, JST_IGNORED_KEY_CODES);

        //Check for extra function on keydown
        if (this.sizeLimit.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyDownFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keydown", onKeyDown);
    
    //The KeyPress event will filter the typed character
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }
        
        var keyCode = typedCode(event);
        var typedChar = String.fromCharCode(keyCode);
        var allowed = this.ignore || this.value.length < this.sizeLimit.maxLength;
        
        //Check for extra function on keypress
        if (this.sizeLimit.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyPressFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        if (!allowed) {
            preventDefault(event);
        }
    }
    observeEvent(this.control, "keypress", onKeyPress);
    
    //The KeyUp event handler
    function onKeyUp (event) {
        if (window.event) {
            event = window.event;
        }

        //Check for extra function on keypress
        if (this.sizeLimit.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyUpFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return false;
            }
        }
        return checkSizeLimit(this, false);
    }
    observeEvent(this.control, "keyup", onKeyUp);

    //Add support for onchange event
    function onFocus (event) {
        if (this.mask && this.mask.changeFunction != null) {
            this._lastValue = this.value;
        }
    }
    observeEvent(this.control, "focus", onFocus);
    
    //The Blur event handler
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }
        
        var ret = checkSizeLimit(this, true);
        
        if (this.mask && this.mask.changeFunction != null) {
            if (this._lastValue != this.value && this.sizeLimit.changeFunction != null) {
                var e = {};
                for (property in event) {
                    e[property] = event[property];
                }
                e.type = "change";
                invokeAsMethod(this, this.sizeLimit.changeFunction, [e, this.sizeLimit]);
            }
        }

        //Check for extra function on blur
        if (this.sizeLimit.blurFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.blurFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return false;
            }
        }
        return ret;
    }
    observeEvent(this.control, "blur", onBlur);
    
    // Method used to update the limit    
    this.update = function() {
        checkSizeLimit(this.control, true);
    }

    //Initially check the size limit
    this.update();
}

//Function to determine if a given object is a valid control to mask
function validateControlToMask(control) {
    control = getObject(control)
    if (control == null) {
        return false;
    } else if (!(control.type) || (!inArray(control.type, ["text", "textarea", "password"]))) {
        return false;
    } else {
        //Avoid memory leak on MSIE
        if (/MSIE/.test(navigator.userAgent) && !window.opera) {
            observeEvent(self, "unload", function() {
                control.mask = control.dateMask = control.sizeLimit = null;
            });
        }
        return control;
    }
}

//Function to handle the mask format
function applyMask(mask, isBlur) {
    var fields = mask.fields;

    //Return if there are fields to process
    if ((fields == null) || (fields.length == 0)) {
        return;
    }

    var control = mask.control;
    if (isEmpty(control.value) && isBlur) {
        return true;
    }
    
    var value = control.value;
    var typedChar = control.typedChar;
    var typedIndex = control.caretPosition;
    var setFixedLiteral = control.setFixedLiteral;
    var currentFieldIndex = mask.getFieldIndexUnderCaret();
    var fieldDescriptors = mask.getCurrentFields();
    var currentDescriptor = fieldDescriptors[currentFieldIndex];
    
    //Apply the typed char
    if (isBlur || !isEmpty(typedChar)) {
        var out = new StringBuffer(fields.length);
        var caretIncrement = 1;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var descriptor = fieldDescriptors[i];
            var padValue = (setFixedLiteral == i + 1);
            if (currentFieldIndex == i + 1 && field.literal && typedIndex == descriptor.begin) {
                //Increment the caret when "passing by" a literal 
                caretIncrement += field.text.length;
            } else if (field.literal && currentFieldIndex > i) {
            	//Passed through a literal field
            	descriptor.value = field.text;
            	caretIncrement += field.text.length + 1;
            } else if (currentFieldIndex == i) {
                //Append the typed char
                if (!isEmpty(typedIndex) && !isEmpty(typedChar) && field.isAccepted(typedChar)) {
                    var fieldStartsAt = descriptor.begin < 0 ? value.length : descriptor.begin;
                    var insertAt = Math.max(0, typedIndex - fieldStartsAt);
                    if (field.input && field.acceptsMoreText(descriptor.value)) {
                        //When more text is accepted, insert the typed char
                        descriptor.value = insertString(descriptor.value, insertAt, typedChar);
                    } else {
                        //No more text is accepted, overwrite
                        var prefix = left(descriptor.value, insertAt);
                        var suffix = mid(descriptor.value, insertAt + 1);
                        descriptor.value = prefix + typedChar + suffix;
                    }
                }
            }
            //Pad the last field on blur 
            if (isBlur && !isEmpty(descriptor.value) && i == fields.length - 1 && field.input) {
                padValue = true
            }
            //Check if the value should be padded
            if (padValue) {
                var oldValue = descriptor.value;
                descriptor.value = field.pad(descriptor.value);
                var inc = descriptor.value.length - oldValue.length;
                if (inc > 0) {
                    caretIncrement += inc; 
                } 
            }
            out.append(descriptor.value);
        }
        value = out.toString();
    }
    
    //Build the output
    fieldDescriptors = mask.getCurrentFields(value);
    var out = new StringBuffer(fields.length);
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var descriptor = fieldDescriptors[i];
        //When a literal is fixed or the next field has value, append it forcefully
        if (field.literal && (setFixedLiteral == i || (i < fields.length - 1 && !isEmpty(fieldDescriptors[i + 1].value)))) {
            descriptor.value = field.text;
        }
        out.append(descriptor.value);
    }
    
    //Update the control value
    control.value = out.toString();
    if (control.caretPosition != null && !isBlur) {
        if (control.pad) {
            setCaretToEnd(control);
        } else {
            setCaret(control, typedIndex + control.value.length - value.length + caretIncrement);
        }
    }
    
    //Call the update function if present
    if (mask.updateFunction != null) {
        mask.updateFunction(mask);
    }

    //Clear the control variables
    control.typedChar = null;
    control.fieldDescriptors = null;
    control.currentFieldIndex = null;
    
    return false;
}

//Retrieve the number of characters that are not digits up to the caret
function nonDigitsToCaret(value, caret) {
    if (caret == null) {
        return null;
    }
    var nonDigits = 0;
    for (var i = 0; i < caret && i < value.length; i++) {
        if (!onlyNumbers(value.charAt(i))) {
            nonDigits++;
        }
    }
    return nonDigits;
}

//Function to handle the number mask format
function applyNumberMask(numberMask, isBlur, isBackSpace) {
    var control = numberMask.control;
    var value = control.value;
    if (value == "") {
        return true;
    }
    var parser = numberMask.parser;
    var maxIntegerDigits = numberMask.maxIntegerDigits;
    var swapSign = false;
    var toDecimal = false;
    var leftToRight = numberMask.leftToRight;
    if (control.swapSign == true) {
        swapSign = true;
        control.swapSign = false;
    }
    if (control.toDecimal == true) {
        toDecimal = value.indexOf(parser.decimalSeparator) < 0;
        control.toDecimal = false;
    }
    var intPart = "";
    var decPart = "";
    var isNegative = value.indexOf('-') >= 0 || value.indexOf('(') >= 0;
    if (value == "") {
        value = parser.format(0);
    }
    value = replaceAll(value, parser.groupSeparator, '')
    value = replaceAll(value, parser.currencySymbol, '')
    value = replaceAll(value, '-', '')
    value = replaceAll(value, '(', '')
    value = replaceAll(value, ')', '')
    value = replaceAll(value, ' ', '')
    var pos = value.indexOf(parser.decimalSeparator);
    var hasDecimal = (pos >= 0);
    var caretAdjust = 0;
    
    //Check if the handling will be from left to right or right to left
    if (leftToRight) {
        //The left to right is based on the decimal separator position
        if (hasDecimal) {
            intPart = value.substr(0, pos);
            decPart = value.substr(pos + 1);
        } else {
            intPart = value;
        }
        if (isBlur && parser.decimalDigits > 0) {
            decPart = rpad(decPart, parser.decimalDigits, '0');
        }
    } else {
        //The right to left is based on a fixed decimal size
        var decimalDigits = parser.decimalDigits;
        value = replaceAll(value, parser.decimalSeparator, '');
        intPart = left(value, value.length - decimalDigits);
        decPart = lpad(right(value, decimalDigits), decimalDigits, '0');
    }
    var zero = onlySpecified(intPart + decPart, '0');

    //Validate the input
    if ((!isEmpty(intPart) && !onlyNumbers(intPart)) || (!isEmpty(decPart) && !onlyNumbers(decPart))) {
        control.value = control.oldValue;
        return true;
    }
    if (leftToRight && parser.decimalDigits >= 0 && decPart.length > parser.decimalDigits) {
        decPart = decPart.substring(0, parser.decimalDigits);
    }
    if (maxIntegerDigits >= 0 && intPart.length > maxIntegerDigits) {
        caretAdjust = maxIntegerDigits - intPart.length - 1;
        intPart = left(intPart, maxIntegerDigits);
    }
    //Check the sign
    if (zero) {
        isNegative = false;
    } else if (swapSign) {
        isNegative = !isNegative;
    }
    //Format the integer part with decimal separators
    if (!isEmpty(intPart)) {
        while (intPart.charAt(0) == '0') {
            intPart = intPart.substr(1);
        }
    }
    if (isEmpty(intPart)) {
        intPart = "0";
    }
    if ((parser.useGrouping) && (!isEmpty(parser.groupSeparator))) {
        var group, temp = "";
        for (var i = intPart.length; i > 0; i -= parser.groupSize) {
            group = intPart.substring(intPart.length - parser.groupSize);
            intPart = intPart.substring(0, intPart.length - parser.groupSize);
            temp = group + parser.groupSeparator + temp;
        }
        intPart = temp.substring(0, temp.length-1);
    }
    //Format the output
    var out = new StringBuffer();
    var oneFormatted = parser.format(isNegative ? -1 : 1);
    var appendEnd = true;
    pos = oneFormatted.indexOf('1');
    out.append(oneFormatted.substring(0, pos));
    out.append(intPart);
    
    //Build the output
    if (leftToRight) {
        if (toDecimal || !isEmpty(decPart)) {
            out.append(parser.decimalSeparator).append(decPart);
            appendEnd = !toDecimal;
        }
    } else {
        if (parser.decimalDigits > 0) {
            out.append(parser.decimalSeparator);
        }
        out.append(decPart);
    }
    
    if (appendEnd && oneFormatted.indexOf(")") >= 0) {
        out.append(")");
    }

    //Retrieve the caret    
    var caret = getCaret(control);
    var oldNonDigitsToCaret = nonDigitsToCaret(control.value, caret), hadSymbol;
    var caretToEnd = toDecimal || caret == null || caret == control.value.length;
    if (caret != null && !isBlur) { 
        hadSymbol = control.value.indexOf(parser.currencySymbol) >= 0 || control.value.indexOf(parser.decimalSeparator) >= 0;
    }
    
    //Update the value
    control.value = out.toString();
    
    if (caret != null && !isBlur) {    
        //If a currency symbol was inserted, set caret to end    
        if (!hadSymbol && ((value.indexOf(parser.currencySymbol) >= 0) || (value.indexOf(parser.decimalSeparator) >= 0))) {
            caretToEnd = true;
        }
        //Restore the caret
        if (!caretToEnd) {
            //Retrieve the new caret position
            var newNonDigitsToCaret = nonDigitsToCaret(control.value, caret);
            //There's no caret adjust when backspace was pressed
            if (isBackSpace) {
                caretAdjust = 0;
            }
            setCaret(control, caret + caretAdjust + newNonDigitsToCaret - oldNonDigitsToCaret);
        } else {
            setCaretToEnd(control);
        }
    }
    
    //Call the update function if present
    if (numberMask.updateFunction != null) {
        numberMask.updateFunction(numberMask);
    }

    return false;
}

//Function to check the text limit
function checkSizeLimit(control, isBlur) {
    var sizeLimit = control.sizeLimit;
    var max = sizeLimit.maxLength;
    var diff = max - control.value.length;
    if (control.value.length > max) {
        control.value = left(control.value, max);
        setCaretToEnd(control);
    }
    var size = control.value.length;
    var charsLeft = max - size;
    if (sizeLimit.output != null) {
        var text = sizeLimit.outputText;
        text = replaceAll(text, "${size}", size);
        text = replaceAll(text, "${left}", charsLeft);
        text = replaceAll(text, "${max}", max);
        setValue(sizeLimit.output, text);
    }
    if (isInstance(sizeLimit.updateFunction, Function)) {
        sizeLimit.updateFunction(control, size, max, charsLeft);
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////
// MaskField Type Classes

/*
 * General input field type
 */
function MaskField() {
    this.literal = false;
    this.input = false;
    
    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        return -1;
    }
}

/*
 * Literal field type
 */
function Literal(text) {
    this.base = MaskField;
    this.base();
    this.text = text;
    this.literal = true;
    
    //Return if the character is in the text
    this.isAccepted = function(chr) {
        return onlySpecified(chr, this.text);
    }
    
    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        return text.indexOf(this.text, fromIndex);
    }
}

/*
 * User input field type
 */
function Input(accepted, min, max, padFunction, optional) {
    this.base = MaskField;
    this.base();
    this.accepted = accepted;
    if (min != null && max == null) {
        max = min;
    }
    this.min = min || 1;
    this.max = max || -1;
    this.padFunction = padFunction || null;
    this.input = true;
    this.upper = false;
    this.lower = false;
    this.capitalize = false;
    this.optional = booleanValue(optional);

    //Ensures the min/max consistencies
    if (this.min < 1) {
        this.min = 1;
    }
    if (this.max == 0) {
        this.max = -1;
    }
    if ((this.max < this.min) && (this.max >= 0)) {
        this.max = this.min;
    }
    
    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        text = text || "";
        fromIndex = fromIndex || 0;
        if (text.length < fromIndex) {
            return -1;
        }
        var toIndex = -1;
        for (var i = fromIndex; i < text.length; i++) {
            if (this.isAccepted(text.substring(fromIndex, i + 1))) {
                toIndex = i;
            } else {
                break;
            }
        }
        return toIndex;
    }

    //Tests whether this field accepts more than the given text     
    this.acceptsMoreText = function(text) {
        if (this.max < 0) return true; 
        return (text || "").length < this.max;
    }
    
    //Tests whether the text is accepted
    this.isAccepted = function(text) {
        return ((this.accepted == null) || onlySpecified(text, this.accepted)) && ((text.length <= this.max) || (this.max < 0));
    }

    //Tests whether the text length is ok
    this.checkLength = function(text) {
        return (text.length >= this.min) && ((this.max < 0) || (text.length <= this.max));
    }
    
    //Tests whether the text is complete
    this.isComplete = function(text) {
        text = String(text);
        if (isEmpty(text)) {
            return this.optional;
        }
        return text.length >= this.min;
    }

    //Apply the case transformations when necessary
    this.transformValue = function(text) {
        text = String(text);
        if (this.upper) {
            return text.toUpperCase();
        } else if (this.lower) {
            return text.toLowerCase();
        } else if (this.capitalize) {
            return capitalize(text);
        } else {
            return text;
        }
    }
    
    //Pads the text
    this.pad = function(text) {
        text = String(text);
        if ((text.length < this.min) && ((this.max >= 0) || (text.length <= this.max)) || this.max < 0) {
            var value;
            if (this.padFunction != null && this.padFunction instanceof Function) {
                value = this.padFunction(text, this.min, this.max);
            } else {
                value = text;
            }
            //Enforces padding
            if (value.length < this.min) {
                var padChar = ' ';
                if (this.accepted == null || this.accepted.indexOf(' ') > 0) {
                    padChar = ' ';
                } else if (this.accepted.indexOf('0') > 0) {
                    padChar = '0';
                } else {
                    padChar = this.accepted.charAt(0);
                }
                return left(lpad(value, this.min, padChar), this.min);
            } else {
                //If has no max limit
                return value;
            }
        } else {
            return text;
        }
    }
}

/*
 * Lowercased input field type
 */
function Lower(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.lower = true;
}

/*
 * Uppercased input field type
 */
function Upper(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.upper = true;
}

/*
 * Capitalized input field type
 */
function Capitalize(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.capitalize = true;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * The FieldBuilder class is used to build input fields
 */
function FieldBuilder() {
    
    /**
     * Builds a literal input with the given text
     */
    this.literal = function(text) {
        return new Literal(text);
    }

    /* 
     * Build an input field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.input = function(accepted, min, max, padFunction, optional) {
        return new Input(accepted, min, max, padFunction, optional);
    }

    /* 
     * Build an uppercase input field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.upper = function(accepted, min, max, padFunction, optional) {
        return new Upper(accepted, min, max, padFunction, optional);
    }

    /* 
     * Build an lowercase field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.lower = function(accepted, min, max, padFunction, optional) {
        return new Lower(accepted, min, max, padFunction, optional);
    }

    /* 
     * Build an capitalized input field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.capitalize = function(accepted, min, max, padFunction, optional) {
        return new Capitalize(accepted, min, max, padFunction, optional);
    }
    
    /* 
     * Build an input field accepting any chars.
     * All parameters are optional 
     */
    this.inputAll = function(min, max, padFunction, optional) {
        return this.input(null, min, max, padFunction, optional);
    }

    /* 
     * Build an uppercase input field accepting any chars.
     * All parameters are optional 
     */
    this.upperAll = function(min, max, padFunction, optional) {
        return this.upper(null, min, max, padFunction, optional);
    }

    /* 
     * Build an lowercase field accepting any chars.
     * All parameters are optional 
     */
    this.lowerAll = function(min, max, padFunction, optional) {
        return this.lower(null, min, max, padFunction, optional);
    }

    /* 
     * Build an capitalized input field accepting any chars.
     * All parameters are optional 
     */
    this.capitalizeAll = function(min, max, padFunction, optional) {
        return this.capitalize(null, min, max, padFunction, optional);
    }
    
    /* 
     * Build an input field accepting only numbers.
     * All parameters are optional 
     */
    this.inputNumbers = function(min, max, padFunction, optional) {
        return this.input(JST_CHARS_NUMBERS, min, max, padFunction, optional);
    }
    
    /* 
     * Build an input field accepting only letters.
     * All parameters are optional 
     */
    this.inputLetters = function(min, max, padFunction, optional) {
        return this.input(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /* 
     * Build an uppercase input field accepting only letters.
     * All parameters are optional 
     */
    this.upperLetters = function(min, max, padFunction, optional) {
        return this.upper(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /* 
     * Build an lowercase input field accepting only letters.
     * All parameters are optional 
     */
    this.lowerLetters = function(min, max, padFunction, optional) {
        return this.lower(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /* 
     * Build an capitalized input field accepting only letters.
     * All parameters are optional 
     */
    this.capitalizeLetters = function(min, max, padFunction, optional) {
        return this.capitalize(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }
}
//Create a FieldBuilder instance
var fieldBuilder = new FieldBuilder();

///////////////////////////////////////////////////////////////////////////////
/*
 * The MaskBuilder class is used to build masks in a easier to use way
 */
function MaskBuilder() {

    /* 
     * Parses a String, building a mask from it.
     * The following characters are recognized
     * #, 0 or 9 - A number               
     * a or A - A letter
     * ? or _ - Any character
     * l or L - A lowercase letter
     * u or U - An uppercase letter
     * c or C - A capitalized letter
     * \\ - A backslash
     * \#, \0, ... - Those literal characters
     * any other character - A literal text
     */
    this.parse = function(string) {
        if (string == null || !isInstance(string, String)) {
            return this.any();
        }
        var fields = new Array();
        var start = null;
        var lastType = null;
        //helper function
        var switchField = function(type, text) {
            switch (type) {
                case '_':
                    return fieldBuilder.inputAll(text.length);
                case '#':
                    return fieldBuilder.inputNumbers(text.length);
                case 'a':
                    return fieldBuilder.inputLetters(text.length);
                case 'l': 
                    return fieldBuilder.lowerLetters(text.length);
                case 'u': 
                    return fieldBuilder.upperLetters(text.length);
                case 'c': 
                    return fieldBuilder.capitalizeLetters(text.length);
                default:
                    return fieldBuilder.literal(text);
            }
        }
        //Let's parse the string
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (start == null) {
                start = i;
            }
            var type;
            var literal = false;
            //Checks for the escaping backslash
            if (c == '\\') {
                if (i == string.length - 1) {
                    break;
                }
                string = left(string, i) + mid(string, i + 1);
                c = string.charAt(i);
                literal = true;
            }
            //determine the field type
            if (literal) {
                type = '?';
            } else {
                switch (c) {
                    case '?': case '_':
                        type = '_';
                        break;
                    case '#': case '0': case '9':
                        type = '#';
                        break;
                    case 'a': case 'A':
                        type = 'a';
                        break;
                    case 'l': case 'L':
                        type = 'l';
                        break;
                    case 'u': case 'U':
                        type = 'u';
                        break;
                    case 'c': case 'C':
                        type = 'c';
                        break;
                    default:
                        type = '?';
                }
            }
            if (lastType != type && lastType != null) {
                var text = string.substring(start, i);
                fields[fields.length] = switchField(lastType, text);
                start = i;
                lastType = type;
            } else {
                lastType = type
            }
        }
        //Use the last field
        if (start < string.length) {
            var text = string.substring(start);
            fields[fields.length] = switchField(lastType, text);
        }
        return fields;
    }
    
    /* 
     * Build a mask that accepts the given characters
     * May also specify the max length
     */
    this.accept = function(accepted, max) {
        return [fieldBuilder.input(accepted, max)];
    }

    /* 
     * Build a mask that accepts any characters
     * May also specify the max length
     */
    this.any = function(max) {
        return [fieldBuilder.any(max)];
    }

    /* 
     * Build a numeric mask
     * May also specify the max length
     */
    this.numbers = function(max) {
        return [fieldBuilder.inputNumbers(max)];
    }
    
    /* 
     * Build a decimal input mask
     */
    this.decimal = function() {
        var decimalField = fieldBuilder.inputNumbers();
        decimalField.optional = true;
        return [fieldBuilder.inputNumbers(), JST_FIELD_DECIMAL_SEPARATOR, decimalField];
    }
    
    /* 
     * Build a mask that only accepts letters
     * May also specify the max length
     */
    this.letters = function(max) {
        return [fieldBuilder.inputLetters(max)];
    }
    
    /* 
     * Build a mask that only accepts uppercase letters
     * May also specify the max length
     */
    this.upperLetters = function(max) {
        return [fieldBuilder.upperLetters(max)];
    }
    
    /* 
     * Build a mask that only accepts lowercase letters
     * May also specify the max length
     */
    this.lowerLetters = function(max) {
        return [fieldBuilder.lowerLetters(max)];
    }
    
    /* 
     * Build a mask that only accepts capitalized letters
     * May also specify the max length
     */
    this.capitalizeLetters = function(max) {
        return [fieldBuilder.capitalizeLetters(max)];
    }
}
//Create a MaskBuilder instance
var maskBuilder = new MaskBuilder();
/*! https://mths.be/he v1.1.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	// All astral symbols.
	var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	// All ASCII symbols (not just printable ASCII) except those listed in the
	// first column of the overrides table.
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides
	var regexAsciiWhitelist = /[\x01-\x7F]/g;
	// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
	// code points listed in the first column of the overrides table on
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.
	var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

	var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
	var encodeMap = {'\xAD':'shy','\u200C':'zwnj','\u200D':'zwj','\u200E':'lrm','\u2063':'ic','\u2062':'it','\u2061':'af','\u200F':'rlm','\u200B':'ZeroWidthSpace','\u2060':'NoBreak','\u0311':'DownBreve','\u20DB':'tdot','\u20DC':'DotDot','\t':'Tab','\n':'NewLine','\u2008':'puncsp','\u205F':'MediumSpace','\u2009':'thinsp','\u200A':'hairsp','\u2004':'emsp13','\u2002':'ensp','\u2005':'emsp14','\u2003':'emsp','\u2007':'numsp','\xA0':'nbsp','\u205F\u200A':'ThickSpace','\u203E':'oline','_':'lowbar','\u2010':'dash','\u2013':'ndash','\u2014':'mdash','\u2015':'horbar',',':'comma',';':'semi','\u204F':'bsemi',':':'colon','\u2A74':'Colone','!':'excl','\xA1':'iexcl','?':'quest','\xBF':'iquest','.':'period','\u2025':'nldr','\u2026':'mldr','\xB7':'middot','\'':'apos','\u2018':'lsquo','\u2019':'rsquo','\u201A':'sbquo','\u2039':'lsaquo','\u203A':'rsaquo','"':'quot','\u201C':'ldquo','\u201D':'rdquo','\u201E':'bdquo','\xAB':'laquo','\xBB':'raquo','(':'lpar',')':'rpar','[':'lsqb',']':'rsqb','{':'lcub','}':'rcub','\u2308':'lceil','\u2309':'rceil','\u230A':'lfloor','\u230B':'rfloor','\u2985':'lopar','\u2986':'ropar','\u298B':'lbrke','\u298C':'rbrke','\u298D':'lbrkslu','\u298E':'rbrksld','\u298F':'lbrksld','\u2990':'rbrkslu','\u2991':'langd','\u2992':'rangd','\u2993':'lparlt','\u2994':'rpargt','\u2995':'gtlPar','\u2996':'ltrPar','\u27E6':'lobrk','\u27E7':'robrk','\u27E8':'lang','\u27E9':'rang','\u27EA':'Lang','\u27EB':'Rang','\u27EC':'loang','\u27ED':'roang','\u2772':'lbbrk','\u2773':'rbbrk','\u2016':'Vert','\xA7':'sect','\xB6':'para','@':'commat','*':'ast','/':'sol','undefined':null,'&':'amp','#':'num','%':'percnt','\u2030':'permil','\u2031':'pertenk','\u2020':'dagger','\u2021':'Dagger','\u2022':'bull','\u2043':'hybull','\u2032':'prime','\u2033':'Prime','\u2034':'tprime','\u2057':'qprime','\u2035':'bprime','\u2041':'caret','`':'grave','\xB4':'acute','\u02DC':'tilde','^':'Hat','\xAF':'macr','\u02D8':'breve','\u02D9':'dot','\xA8':'die','\u02DA':'ring','\u02DD':'dblac','\xB8':'cedil','\u02DB':'ogon','\u02C6':'circ','\u02C7':'caron','\xB0':'deg','\xA9':'copy','\xAE':'reg','\u2117':'copysr','\u2118':'wp','\u211E':'rx','\u2127':'mho','\u2129':'iiota','\u2190':'larr','\u219A':'nlarr','\u2192':'rarr','\u219B':'nrarr','\u2191':'uarr','\u2193':'darr','\u2194':'harr','\u21AE':'nharr','\u2195':'varr','\u2196':'nwarr','\u2197':'nearr','\u2198':'searr','\u2199':'swarr','\u219D':'rarrw','\u219D\u0338':'nrarrw','\u219E':'Larr','\u219F':'Uarr','\u21A0':'Rarr','\u21A1':'Darr','\u21A2':'larrtl','\u21A3':'rarrtl','\u21A4':'mapstoleft','\u21A5':'mapstoup','\u21A6':'map','\u21A7':'mapstodown','\u21A9':'larrhk','\u21AA':'rarrhk','\u21AB':'larrlp','\u21AC':'rarrlp','\u21AD':'harrw','\u21B0':'lsh','\u21B1':'rsh','\u21B2':'ldsh','\u21B3':'rdsh','\u21B5':'crarr','\u21B6':'cularr','\u21B7':'curarr','\u21BA':'olarr','\u21BB':'orarr','\u21BC':'lharu','\u21BD':'lhard','\u21BE':'uharr','\u21BF':'uharl','\u21C0':'rharu','\u21C1':'rhard','\u21C2':'dharr','\u21C3':'dharl','\u21C4':'rlarr','\u21C5':'udarr','\u21C6':'lrarr','\u21C7':'llarr','\u21C8':'uuarr','\u21C9':'rrarr','\u21CA':'ddarr','\u21CB':'lrhar','\u21CC':'rlhar','\u21D0':'lArr','\u21CD':'nlArr','\u21D1':'uArr','\u21D2':'rArr','\u21CF':'nrArr','\u21D3':'dArr','\u21D4':'iff','\u21CE':'nhArr','\u21D5':'vArr','\u21D6':'nwArr','\u21D7':'neArr','\u21D8':'seArr','\u21D9':'swArr','\u21DA':'lAarr','\u21DB':'rAarr','\u21DD':'zigrarr','\u21E4':'larrb','\u21E5':'rarrb','\u21F5':'duarr','\u21FD':'loarr','\u21FE':'roarr','\u21FF':'hoarr','\u2200':'forall','\u2201':'comp','\u2202':'part','\u2202\u0338':'npart','\u2203':'exist','\u2204':'nexist','\u2205':'empty','\u2207':'Del','\u2208':'in','\u2209':'notin','\u220B':'ni','\u220C':'notni','\u03F6':'bepsi','\u220F':'prod','\u2210':'coprod','\u2211':'sum','+':'plus','\xB1':'pm','\xF7':'div','\xD7':'times','<':'lt','\u226E':'nlt','<\u20D2':'nvlt','=':'equals','\u2260':'ne','=\u20E5':'bne','\u2A75':'Equal','>':'gt','\u226F':'ngt','>\u20D2':'nvgt','\xAC':'not','|':'vert','\xA6':'brvbar','\u2212':'minus','\u2213':'mp','\u2214':'plusdo','\u2044':'frasl','\u2216':'setmn','\u2217':'lowast','\u2218':'compfn','\u221A':'Sqrt','\u221D':'prop','\u221E':'infin','\u221F':'angrt','\u2220':'ang','\u2220\u20D2':'nang','\u2221':'angmsd','\u2222':'angsph','\u2223':'mid','\u2224':'nmid','\u2225':'par','\u2226':'npar','\u2227':'and','\u2228':'or','\u2229':'cap','\u2229\uFE00':'caps','\u222A':'cup','\u222A\uFE00':'cups','\u222B':'int','\u222C':'Int','\u222D':'tint','\u2A0C':'qint','\u222E':'oint','\u222F':'Conint','\u2230':'Cconint','\u2231':'cwint','\u2232':'cwconint','\u2233':'awconint','\u2234':'there4','\u2235':'becaus','\u2236':'ratio','\u2237':'Colon','\u2238':'minusd','\u223A':'mDDot','\u223B':'homtht','\u223C':'sim','\u2241':'nsim','\u223C\u20D2':'nvsim','\u223D':'bsim','\u223D\u0331':'race','\u223E':'ac','\u223E\u0333':'acE','\u223F':'acd','\u2240':'wr','\u2242':'esim','\u2242\u0338':'nesim','\u2243':'sime','\u2244':'nsime','\u2245':'cong','\u2247':'ncong','\u2246':'simne','\u2248':'ap','\u2249':'nap','\u224A':'ape','\u224B':'apid','\u224B\u0338':'napid','\u224C':'bcong','\u224D':'CupCap','\u226D':'NotCupCap','\u224D\u20D2':'nvap','\u224E':'bump','\u224E\u0338':'nbump','\u224F':'bumpe','\u224F\u0338':'nbumpe','\u2250':'doteq','\u2250\u0338':'nedot','\u2251':'eDot','\u2252':'efDot','\u2253':'erDot','\u2254':'colone','\u2255':'ecolon','\u2256':'ecir','\u2257':'cire','\u2259':'wedgeq','\u225A':'veeeq','\u225C':'trie','\u225F':'equest','\u2261':'equiv','\u2262':'nequiv','\u2261\u20E5':'bnequiv','\u2264':'le','\u2270':'nle','\u2264\u20D2':'nvle','\u2265':'ge','\u2271':'nge','\u2265\u20D2':'nvge','\u2266':'lE','\u2266\u0338':'nlE','\u2267':'gE','\u2267\u0338':'ngE','\u2268\uFE00':'lvnE','\u2268':'lnE','\u2269':'gnE','\u2269\uFE00':'gvnE','\u226A':'ll','\u226A\u0338':'nLtv','\u226A\u20D2':'nLt','\u226B':'gg','\u226B\u0338':'nGtv','\u226B\u20D2':'nGt','\u226C':'twixt','\u2272':'lsim','\u2274':'nlsim','\u2273':'gsim','\u2275':'ngsim','\u2276':'lg','\u2278':'ntlg','\u2277':'gl','\u2279':'ntgl','\u227A':'pr','\u2280':'npr','\u227B':'sc','\u2281':'nsc','\u227C':'prcue','\u22E0':'nprcue','\u227D':'sccue','\u22E1':'nsccue','\u227E':'prsim','\u227F':'scsim','\u227F\u0338':'NotSucceedsTilde','\u2282':'sub','\u2284':'nsub','\u2282\u20D2':'vnsub','\u2283':'sup','\u2285':'nsup','\u2283\u20D2':'vnsup','\u2286':'sube','\u2288':'nsube','\u2287':'supe','\u2289':'nsupe','\u228A\uFE00':'vsubne','\u228A':'subne','\u228B\uFE00':'vsupne','\u228B':'supne','\u228D':'cupdot','\u228E':'uplus','\u228F':'sqsub','\u228F\u0338':'NotSquareSubset','\u2290':'sqsup','\u2290\u0338':'NotSquareSuperset','\u2291':'sqsube','\u22E2':'nsqsube','\u2292':'sqsupe','\u22E3':'nsqsupe','\u2293':'sqcap','\u2293\uFE00':'sqcaps','\u2294':'sqcup','\u2294\uFE00':'sqcups','\u2295':'oplus','\u2296':'ominus','\u2297':'otimes','\u2298':'osol','\u2299':'odot','\u229A':'ocir','\u229B':'oast','\u229D':'odash','\u229E':'plusb','\u229F':'minusb','\u22A0':'timesb','\u22A1':'sdotb','\u22A2':'vdash','\u22AC':'nvdash','\u22A3':'dashv','\u22A4':'top','\u22A5':'bot','\u22A7':'models','\u22A8':'vDash','\u22AD':'nvDash','\u22A9':'Vdash','\u22AE':'nVdash','\u22AA':'Vvdash','\u22AB':'VDash','\u22AF':'nVDash','\u22B0':'prurel','\u22B2':'vltri','\u22EA':'nltri','\u22B3':'vrtri','\u22EB':'nrtri','\u22B4':'ltrie','\u22EC':'nltrie','\u22B4\u20D2':'nvltrie','\u22B5':'rtrie','\u22ED':'nrtrie','\u22B5\u20D2':'nvrtrie','\u22B6':'origof','\u22B7':'imof','\u22B8':'mumap','\u22B9':'hercon','\u22BA':'intcal','\u22BB':'veebar','\u22BD':'barvee','\u22BE':'angrtvb','\u22BF':'lrtri','\u22C0':'Wedge','\u22C1':'Vee','\u22C2':'xcap','\u22C3':'xcup','\u22C4':'diam','\u22C5':'sdot','\u22C6':'Star','\u22C7':'divonx','\u22C8':'bowtie','\u22C9':'ltimes','\u22CA':'rtimes','\u22CB':'lthree','\u22CC':'rthree','\u22CD':'bsime','\u22CE':'cuvee','\u22CF':'cuwed','\u22D0':'Sub','\u22D1':'Sup','\u22D2':'Cap','\u22D3':'Cup','\u22D4':'fork','\u22D5':'epar','\u22D6':'ltdot','\u22D7':'gtdot','\u22D8':'Ll','\u22D8\u0338':'nLl','\u22D9':'Gg','\u22D9\u0338':'nGg','\u22DA\uFE00':'lesg','\u22DA':'leg','\u22DB':'gel','\u22DB\uFE00':'gesl','\u22DE':'cuepr','\u22DF':'cuesc','\u22E6':'lnsim','\u22E7':'gnsim','\u22E8':'prnsim','\u22E9':'scnsim','\u22EE':'vellip','\u22EF':'ctdot','\u22F0':'utdot','\u22F1':'dtdot','\u22F2':'disin','\u22F3':'isinsv','\u22F4':'isins','\u22F5':'isindot','\u22F5\u0338':'notindot','\u22F6':'notinvc','\u22F7':'notinvb','\u22F9':'isinE','\u22F9\u0338':'notinE','\u22FA':'nisd','\u22FB':'xnis','\u22FC':'nis','\u22FD':'notnivc','\u22FE':'notnivb','\u2305':'barwed','\u2306':'Barwed','\u230C':'drcrop','\u230D':'dlcrop','\u230E':'urcrop','\u230F':'ulcrop','\u2310':'bnot','\u2312':'profline','\u2313':'profsurf','\u2315':'telrec','\u2316':'target','\u231C':'ulcorn','\u231D':'urcorn','\u231E':'dlcorn','\u231F':'drcorn','\u2322':'frown','\u2323':'smile','\u232D':'cylcty','\u232E':'profalar','\u2336':'topbot','\u233D':'ovbar','\u233F':'solbar','\u237C':'angzarr','\u23B0':'lmoust','\u23B1':'rmoust','\u23B4':'tbrk','\u23B5':'bbrk','\u23B6':'bbrktbrk','\u23DC':'OverParenthesis','\u23DD':'UnderParenthesis','\u23DE':'OverBrace','\u23DF':'UnderBrace','\u23E2':'trpezium','\u23E7':'elinters','\u2423':'blank','\u2500':'boxh','\u2502':'boxv','\u250C':'boxdr','\u2510':'boxdl','\u2514':'boxur','\u2518':'boxul','\u251C':'boxvr','\u2524':'boxvl','\u252C':'boxhd','\u2534':'boxhu','\u253C':'boxvh','\u2550':'boxH','\u2551':'boxV','\u2552':'boxdR','\u2553':'boxDr','\u2554':'boxDR','\u2555':'boxdL','\u2556':'boxDl','\u2557':'boxDL','\u2558':'boxuR','\u2559':'boxUr','\u255A':'boxUR','\u255B':'boxuL','\u255C':'boxUl','\u255D':'boxUL','\u255E':'boxvR','\u255F':'boxVr','\u2560':'boxVR','\u2561':'boxvL','\u2562':'boxVl','\u2563':'boxVL','\u2564':'boxHd','\u2565':'boxhD','\u2566':'boxHD','\u2567':'boxHu','\u2568':'boxhU','\u2569':'boxHU','\u256A':'boxvH','\u256B':'boxVh','\u256C':'boxVH','\u2580':'uhblk','\u2584':'lhblk','\u2588':'block','\u2591':'blk14','\u2592':'blk12','\u2593':'blk34','\u25A1':'squ','\u25AA':'squf','\u25AB':'EmptyVerySmallSquare','\u25AD':'rect','\u25AE':'marker','\u25B1':'fltns','\u25B3':'xutri','\u25B4':'utrif','\u25B5':'utri','\u25B8':'rtrif','\u25B9':'rtri','\u25BD':'xdtri','\u25BE':'dtrif','\u25BF':'dtri','\u25C2':'ltrif','\u25C3':'ltri','\u25CA':'loz','\u25CB':'cir','\u25EC':'tridot','\u25EF':'xcirc','\u25F8':'ultri','\u25F9':'urtri','\u25FA':'lltri','\u25FB':'EmptySmallSquare','\u25FC':'FilledSmallSquare','\u2605':'starf','\u2606':'star','\u260E':'phone','\u2640':'female','\u2642':'male','\u2660':'spades','\u2663':'clubs','\u2665':'hearts','\u2666':'diams','\u266A':'sung','\u2713':'check','\u2717':'cross','\u2720':'malt','\u2736':'sext','\u2758':'VerticalSeparator','\u27C8':'bsolhsub','\u27C9':'suphsol','\u27F5':'xlarr','\u27F6':'xrarr','\u27F7':'xharr','\u27F8':'xlArr','\u27F9':'xrArr','\u27FA':'xhArr','\u27FC':'xmap','\u27FF':'dzigrarr','\u2902':'nvlArr','\u2903':'nvrArr','\u2904':'nvHarr','\u2905':'Map','\u290C':'lbarr','\u290D':'rbarr','\u290E':'lBarr','\u290F':'rBarr','\u2910':'RBarr','\u2911':'DDotrahd','\u2912':'UpArrowBar','\u2913':'DownArrowBar','\u2916':'Rarrtl','\u2919':'latail','\u291A':'ratail','\u291B':'lAtail','\u291C':'rAtail','\u291D':'larrfs','\u291E':'rarrfs','\u291F':'larrbfs','\u2920':'rarrbfs','\u2923':'nwarhk','\u2924':'nearhk','\u2925':'searhk','\u2926':'swarhk','\u2927':'nwnear','\u2928':'toea','\u2929':'tosa','\u292A':'swnwar','\u2933':'rarrc','\u2933\u0338':'nrarrc','\u2935':'cudarrr','\u2936':'ldca','\u2937':'rdca','\u2938':'cudarrl','\u2939':'larrpl','\u293C':'curarrm','\u293D':'cularrp','\u2945':'rarrpl','\u2948':'harrcir','\u2949':'Uarrocir','\u294A':'lurdshar','\u294B':'ldrushar','\u294E':'LeftRightVector','\u294F':'RightUpDownVector','\u2950':'DownLeftRightVector','\u2951':'LeftUpDownVector','\u2952':'LeftVectorBar','\u2953':'RightVectorBar','\u2954':'RightUpVectorBar','\u2955':'RightDownVectorBar','\u2956':'DownLeftVectorBar','\u2957':'DownRightVectorBar','\u2958':'LeftUpVectorBar','\u2959':'LeftDownVectorBar','\u295A':'LeftTeeVector','\u295B':'RightTeeVector','\u295C':'RightUpTeeVector','\u295D':'RightDownTeeVector','\u295E':'DownLeftTeeVector','\u295F':'DownRightTeeVector','\u2960':'LeftUpTeeVector','\u2961':'LeftDownTeeVector','\u2962':'lHar','\u2963':'uHar','\u2964':'rHar','\u2965':'dHar','\u2966':'luruhar','\u2967':'ldrdhar','\u2968':'ruluhar','\u2969':'rdldhar','\u296A':'lharul','\u296B':'llhard','\u296C':'rharul','\u296D':'lrhard','\u296E':'udhar','\u296F':'duhar','\u2970':'RoundImplies','\u2971':'erarr','\u2972':'simrarr','\u2973':'larrsim','\u2974':'rarrsim','\u2975':'rarrap','\u2976':'ltlarr','\u2978':'gtrarr','\u2979':'subrarr','\u297B':'suplarr','\u297C':'lfisht','\u297D':'rfisht','\u297E':'ufisht','\u297F':'dfisht','\u299A':'vzigzag','\u299C':'vangrt','\u299D':'angrtvbd','\u29A4':'ange','\u29A5':'range','\u29A6':'dwangle','\u29A7':'uwangle','\u29A8':'angmsdaa','\u29A9':'angmsdab','\u29AA':'angmsdac','\u29AB':'angmsdad','\u29AC':'angmsdae','\u29AD':'angmsdaf','\u29AE':'angmsdag','\u29AF':'angmsdah','\u29B0':'bemptyv','\u29B1':'demptyv','\u29B2':'cemptyv','\u29B3':'raemptyv','\u29B4':'laemptyv','\u29B5':'ohbar','\u29B6':'omid','\u29B7':'opar','\u29B9':'operp','\u29BB':'olcross','\u29BC':'odsold','\u29BE':'olcir','\u29BF':'ofcir','\u29C0':'olt','\u29C1':'ogt','\u29C2':'cirscir','\u29C3':'cirE','\u29C4':'solb','\u29C5':'bsolb','\u29C9':'boxbox','\u29CD':'trisb','\u29CE':'rtriltri','\u29CF':'LeftTriangleBar','\u29CF\u0338':'NotLeftTriangleBar','\u29D0':'RightTriangleBar','\u29D0\u0338':'NotRightTriangleBar','\u29DC':'iinfin','\u29DD':'infintie','\u29DE':'nvinfin','\u29E3':'eparsl','\u29E4':'smeparsl','\u29E5':'eqvparsl','\u29EB':'lozf','\u29F4':'RuleDelayed','\u29F6':'dsol','\u2A00':'xodot','\u2A01':'xoplus','\u2A02':'xotime','\u2A04':'xuplus','\u2A06':'xsqcup','\u2A0D':'fpartint','\u2A10':'cirfnint','\u2A11':'awint','\u2A12':'rppolint','\u2A13':'scpolint','\u2A14':'npolint','\u2A15':'pointint','\u2A16':'quatint','\u2A17':'intlarhk','\u2A22':'pluscir','\u2A23':'plusacir','\u2A24':'simplus','\u2A25':'plusdu','\u2A26':'plussim','\u2A27':'plustwo','\u2A29':'mcomma','\u2A2A':'minusdu','\u2A2D':'loplus','\u2A2E':'roplus','\u2A2F':'Cross','\u2A30':'timesd','\u2A31':'timesbar','\u2A33':'smashp','\u2A34':'lotimes','\u2A35':'rotimes','\u2A36':'otimesas','\u2A37':'Otimes','\u2A38':'odiv','\u2A39':'triplus','\u2A3A':'triminus','\u2A3B':'tritime','\u2A3C':'iprod','\u2A3F':'amalg','\u2A40':'capdot','\u2A42':'ncup','\u2A43':'ncap','\u2A44':'capand','\u2A45':'cupor','\u2A46':'cupcap','\u2A47':'capcup','\u2A48':'cupbrcap','\u2A49':'capbrcup','\u2A4A':'cupcup','\u2A4B':'capcap','\u2A4C':'ccups','\u2A4D':'ccaps','\u2A50':'ccupssm','\u2A53':'And','\u2A54':'Or','\u2A55':'andand','\u2A56':'oror','\u2A57':'orslope','\u2A58':'andslope','\u2A5A':'andv','\u2A5B':'orv','\u2A5C':'andd','\u2A5D':'ord','\u2A5F':'wedbar','\u2A66':'sdote','\u2A6A':'simdot','\u2A6D':'congdot','\u2A6D\u0338':'ncongdot','\u2A6E':'easter','\u2A6F':'apacir','\u2A70':'apE','\u2A70\u0338':'napE','\u2A71':'eplus','\u2A72':'pluse','\u2A73':'Esim','\u2A77':'eDDot','\u2A78':'equivDD','\u2A79':'ltcir','\u2A7A':'gtcir','\u2A7B':'ltquest','\u2A7C':'gtquest','\u2A7D':'les','\u2A7D\u0338':'nles','\u2A7E':'ges','\u2A7E\u0338':'nges','\u2A7F':'lesdot','\u2A80':'gesdot','\u2A81':'lesdoto','\u2A82':'gesdoto','\u2A83':'lesdotor','\u2A84':'gesdotol','\u2A85':'lap','\u2A86':'gap','\u2A87':'lne','\u2A88':'gne','\u2A89':'lnap','\u2A8A':'gnap','\u2A8B':'lEg','\u2A8C':'gEl','\u2A8D':'lsime','\u2A8E':'gsime','\u2A8F':'lsimg','\u2A90':'gsiml','\u2A91':'lgE','\u2A92':'glE','\u2A93':'lesges','\u2A94':'gesles','\u2A95':'els','\u2A96':'egs','\u2A97':'elsdot','\u2A98':'egsdot','\u2A99':'el','\u2A9A':'eg','\u2A9D':'siml','\u2A9E':'simg','\u2A9F':'simlE','\u2AA0':'simgE','\u2AA1':'LessLess','\u2AA1\u0338':'NotNestedLessLess','\u2AA2':'GreaterGreater','\u2AA2\u0338':'NotNestedGreaterGreater','\u2AA4':'glj','\u2AA5':'gla','\u2AA6':'ltcc','\u2AA7':'gtcc','\u2AA8':'lescc','\u2AA9':'gescc','\u2AAA':'smt','\u2AAB':'lat','\u2AAC':'smte','\u2AAC\uFE00':'smtes','\u2AAD':'late','\u2AAD\uFE00':'lates','\u2AAE':'bumpE','\u2AAF':'pre','\u2AAF\u0338':'npre','\u2AB0':'sce','\u2AB0\u0338':'nsce','\u2AB3':'prE','\u2AB4':'scE','\u2AB5':'prnE','\u2AB6':'scnE','\u2AB7':'prap','\u2AB8':'scap','\u2AB9':'prnap','\u2ABA':'scnap','\u2ABB':'Pr','\u2ABC':'Sc','\u2ABD':'subdot','\u2ABE':'supdot','\u2ABF':'subplus','\u2AC0':'supplus','\u2AC1':'submult','\u2AC2':'supmult','\u2AC3':'subedot','\u2AC4':'supedot','\u2AC5':'subE','\u2AC5\u0338':'nsubE','\u2AC6':'supE','\u2AC6\u0338':'nsupE','\u2AC7':'subsim','\u2AC8':'supsim','\u2ACB\uFE00':'vsubnE','\u2ACB':'subnE','\u2ACC\uFE00':'vsupnE','\u2ACC':'supnE','\u2ACF':'csub','\u2AD0':'csup','\u2AD1':'csube','\u2AD2':'csupe','\u2AD3':'subsup','\u2AD4':'supsub','\u2AD5':'subsub','\u2AD6':'supsup','\u2AD7':'suphsub','\u2AD8':'supdsub','\u2AD9':'forkv','\u2ADA':'topfork','\u2ADB':'mlcp','\u2AE4':'Dashv','\u2AE6':'Vdashl','\u2AE7':'Barv','\u2AE8':'vBar','\u2AE9':'vBarv','\u2AEB':'Vbar','\u2AEC':'Not','\u2AED':'bNot','\u2AEE':'rnmid','\u2AEF':'cirmid','\u2AF0':'midcir','\u2AF1':'topcir','\u2AF2':'nhpar','\u2AF3':'parsim','\u2AFD':'parsl','\u2AFD\u20E5':'nparsl','\u266D':'flat','\u266E':'natur','\u266F':'sharp','\xA4':'curren','\xA2':'cent','$':'dollar','\xA3':'pound','\xA5':'yen','\u20AC':'euro','\xB9':'sup1','\xBD':'half','\u2153':'frac13','\xBC':'frac14','\u2155':'frac15','\u2159':'frac16','\u215B':'frac18','\xB2':'sup2','\u2154':'frac23','\u2156':'frac25','\xB3':'sup3','\xBE':'frac34','\u2157':'frac35','\u215C':'frac38','\u2158':'frac45','\u215A':'frac56','\u215D':'frac58','\u215E':'frac78','\uD835\uDCB6':'ascr','\uD835\uDD52':'aopf','\uD835\uDD1E':'afr','\uD835\uDD38':'Aopf','\uD835\uDD04':'Afr','\uD835\uDC9C':'Ascr','\xAA':'ordf','\xE1':'aacute','\xC1':'Aacute','\xE0':'agrave','\xC0':'Agrave','\u0103':'abreve','\u0102':'Abreve','\xE2':'acirc','\xC2':'Acirc','\xE5':'aring','\xC5':'angst','\xE4':'auml','\xC4':'Auml','\xE3':'atilde','\xC3':'Atilde','\u0105':'aogon','\u0104':'Aogon','\u0101':'amacr','\u0100':'Amacr','\xE6':'aelig','\xC6':'AElig','\uD835\uDCB7':'bscr','\uD835\uDD53':'bopf','\uD835\uDD1F':'bfr','\uD835\uDD39':'Bopf','\u212C':'Bscr','\uD835\uDD05':'Bfr','\uD835\uDD20':'cfr','\uD835\uDCB8':'cscr','\uD835\uDD54':'copf','\u212D':'Cfr','\uD835\uDC9E':'Cscr','\u2102':'Copf','\u0107':'cacute','\u0106':'Cacute','\u0109':'ccirc','\u0108':'Ccirc','\u010D':'ccaron','\u010C':'Ccaron','\u010B':'cdot','\u010A':'Cdot','\xE7':'ccedil','\xC7':'Ccedil','\u2105':'incare','\uD835\uDD21':'dfr','\u2146':'dd','\uD835\uDD55':'dopf','\uD835\uDCB9':'dscr','\uD835\uDC9F':'Dscr','\uD835\uDD07':'Dfr','\u2145':'DD','\uD835\uDD3B':'Dopf','\u010F':'dcaron','\u010E':'Dcaron','\u0111':'dstrok','\u0110':'Dstrok','\xF0':'eth','\xD0':'ETH','\u2147':'ee','\u212F':'escr','\uD835\uDD22':'efr','\uD835\uDD56':'eopf','\u2130':'Escr','\uD835\uDD08':'Efr','\uD835\uDD3C':'Eopf','\xE9':'eacute','\xC9':'Eacute','\xE8':'egrave','\xC8':'Egrave','\xEA':'ecirc','\xCA':'Ecirc','\u011B':'ecaron','\u011A':'Ecaron','\xEB':'euml','\xCB':'Euml','\u0117':'edot','\u0116':'Edot','\u0119':'eogon','\u0118':'Eogon','\u0113':'emacr','\u0112':'Emacr','\uD835\uDD23':'ffr','\uD835\uDD57':'fopf','\uD835\uDCBB':'fscr','\uD835\uDD09':'Ffr','\uD835\uDD3D':'Fopf','\u2131':'Fscr','\uFB00':'fflig','\uFB03':'ffilig','\uFB04':'ffllig','\uFB01':'filig','fj':'fjlig','\uFB02':'fllig','\u0192':'fnof','\u210A':'gscr','\uD835\uDD58':'gopf','\uD835\uDD24':'gfr','\uD835\uDCA2':'Gscr','\uD835\uDD3E':'Gopf','\uD835\uDD0A':'Gfr','\u01F5':'gacute','\u011F':'gbreve','\u011E':'Gbreve','\u011D':'gcirc','\u011C':'Gcirc','\u0121':'gdot','\u0120':'Gdot','\u0122':'Gcedil','\uD835\uDD25':'hfr','\u210E':'planckh','\uD835\uDCBD':'hscr','\uD835\uDD59':'hopf','\u210B':'Hscr','\u210C':'Hfr','\u210D':'Hopf','\u0125':'hcirc','\u0124':'Hcirc','\u210F':'hbar','\u0127':'hstrok','\u0126':'Hstrok','\uD835\uDD5A':'iopf','\uD835\uDD26':'ifr','\uD835\uDCBE':'iscr','\u2148':'ii','\uD835\uDD40':'Iopf','\u2110':'Iscr','\u2111':'Im','\xED':'iacute','\xCD':'Iacute','\xEC':'igrave','\xCC':'Igrave','\xEE':'icirc','\xCE':'Icirc','\xEF':'iuml','\xCF':'Iuml','\u0129':'itilde','\u0128':'Itilde','\u0130':'Idot','\u012F':'iogon','\u012E':'Iogon','\u012B':'imacr','\u012A':'Imacr','\u0133':'ijlig','\u0132':'IJlig','\u0131':'imath','\uD835\uDCBF':'jscr','\uD835\uDD5B':'jopf','\uD835\uDD27':'jfr','\uD835\uDCA5':'Jscr','\uD835\uDD0D':'Jfr','\uD835\uDD41':'Jopf','\u0135':'jcirc','\u0134':'Jcirc','\u0237':'jmath','\uD835\uDD5C':'kopf','\uD835\uDCC0':'kscr','\uD835\uDD28':'kfr','\uD835\uDCA6':'Kscr','\uD835\uDD42':'Kopf','\uD835\uDD0E':'Kfr','\u0137':'kcedil','\u0136':'Kcedil','\uD835\uDD29':'lfr','\uD835\uDCC1':'lscr','\u2113':'ell','\uD835\uDD5D':'lopf','\u2112':'Lscr','\uD835\uDD0F':'Lfr','\uD835\uDD43':'Lopf','\u013A':'lacute','\u0139':'Lacute','\u013E':'lcaron','\u013D':'Lcaron','\u013C':'lcedil','\u013B':'Lcedil','\u0142':'lstrok','\u0141':'Lstrok','\u0140':'lmidot','\u013F':'Lmidot','\uD835\uDD2A':'mfr','\uD835\uDD5E':'mopf','\uD835\uDCC2':'mscr','\uD835\uDD10':'Mfr','\uD835\uDD44':'Mopf','\u2133':'Mscr','\uD835\uDD2B':'nfr','\uD835\uDD5F':'nopf','\uD835\uDCC3':'nscr','\u2115':'Nopf','\uD835\uDCA9':'Nscr','\uD835\uDD11':'Nfr','\u0144':'nacute','\u0143':'Nacute','\u0148':'ncaron','\u0147':'Ncaron','\xF1':'ntilde','\xD1':'Ntilde','\u0146':'ncedil','\u0145':'Ncedil','\u2116':'numero','\u014B':'eng','\u014A':'ENG','\uD835\uDD60':'oopf','\uD835\uDD2C':'ofr','\u2134':'oscr','\uD835\uDCAA':'Oscr','\uD835\uDD12':'Ofr','\uD835\uDD46':'Oopf','\xBA':'ordm','\xF3':'oacute','\xD3':'Oacute','\xF2':'ograve','\xD2':'Ograve','\xF4':'ocirc','\xD4':'Ocirc','\xF6':'ouml','\xD6':'Ouml','\u0151':'odblac','\u0150':'Odblac','\xF5':'otilde','\xD5':'Otilde','\xF8':'oslash','\xD8':'Oslash','\u014D':'omacr','\u014C':'Omacr','\u0153':'oelig','\u0152':'OElig','\uD835\uDD2D':'pfr','\uD835\uDCC5':'pscr','\uD835\uDD61':'popf','\u2119':'Popf','\uD835\uDD13':'Pfr','\uD835\uDCAB':'Pscr','\uD835\uDD62':'qopf','\uD835\uDD2E':'qfr','\uD835\uDCC6':'qscr','\uD835\uDCAC':'Qscr','\uD835\uDD14':'Qfr','\u211A':'Qopf','\u0138':'kgreen','\uD835\uDD2F':'rfr','\uD835\uDD63':'ropf','\uD835\uDCC7':'rscr','\u211B':'Rscr','\u211C':'Re','\u211D':'Ropf','\u0155':'racute','\u0154':'Racute','\u0159':'rcaron','\u0158':'Rcaron','\u0157':'rcedil','\u0156':'Rcedil','\uD835\uDD64':'sopf','\uD835\uDCC8':'sscr','\uD835\uDD30':'sfr','\uD835\uDD4A':'Sopf','\uD835\uDD16':'Sfr','\uD835\uDCAE':'Sscr','\u24C8':'oS','\u015B':'sacute','\u015A':'Sacute','\u015D':'scirc','\u015C':'Scirc','\u0161':'scaron','\u0160':'Scaron','\u015F':'scedil','\u015E':'Scedil','\xDF':'szlig','\uD835\uDD31':'tfr','\uD835\uDCC9':'tscr','\uD835\uDD65':'topf','\uD835\uDCAF':'Tscr','\uD835\uDD17':'Tfr','\uD835\uDD4B':'Topf','\u0165':'tcaron','\u0164':'Tcaron','\u0163':'tcedil','\u0162':'Tcedil','\u2122':'trade','\u0167':'tstrok','\u0166':'Tstrok','\uD835\uDCCA':'uscr','\uD835\uDD66':'uopf','\uD835\uDD32':'ufr','\uD835\uDD4C':'Uopf','\uD835\uDD18':'Ufr','\uD835\uDCB0':'Uscr','\xFA':'uacute','\xDA':'Uacute','\xF9':'ugrave','\xD9':'Ugrave','\u016D':'ubreve','\u016C':'Ubreve','\xFB':'ucirc','\xDB':'Ucirc','\u016F':'uring','\u016E':'Uring','\xFC':'uuml','\xDC':'Uuml','\u0171':'udblac','\u0170':'Udblac','\u0169':'utilde','\u0168':'Utilde','\u0173':'uogon','\u0172':'Uogon','\u016B':'umacr','\u016A':'Umacr','\uD835\uDD33':'vfr','\uD835\uDD67':'vopf','\uD835\uDCCB':'vscr','\uD835\uDD19':'Vfr','\uD835\uDD4D':'Vopf','\uD835\uDCB1':'Vscr','\uD835\uDD68':'wopf','\uD835\uDCCC':'wscr','\uD835\uDD34':'wfr','\uD835\uDCB2':'Wscr','\uD835\uDD4E':'Wopf','\uD835\uDD1A':'Wfr','\u0175':'wcirc','\u0174':'Wcirc','\uD835\uDD35':'xfr','\uD835\uDCCD':'xscr','\uD835\uDD69':'xopf','\uD835\uDD4F':'Xopf','\uD835\uDD1B':'Xfr','\uD835\uDCB3':'Xscr','\uD835\uDD36':'yfr','\uD835\uDCCE':'yscr','\uD835\uDD6A':'yopf','\uD835\uDCB4':'Yscr','\uD835\uDD1C':'Yfr','\uD835\uDD50':'Yopf','\xFD':'yacute','\xDD':'Yacute','\u0177':'ycirc','\u0176':'Ycirc','\xFF':'yuml','\u0178':'Yuml','\uD835\uDCCF':'zscr','\uD835\uDD37':'zfr','\uD835\uDD6B':'zopf','\u2128':'Zfr','\u2124':'Zopf','\uD835\uDCB5':'Zscr','\u017A':'zacute','\u0179':'Zacute','\u017E':'zcaron','\u017D':'Zcaron','\u017C':'zdot','\u017B':'Zdot','\u01B5':'imped','\xFE':'thorn','\xDE':'THORN','\u0149':'napos','\u03B1':'alpha','\u0391':'Alpha','\u03B2':'beta','\u0392':'Beta','\u03B3':'gamma','\u0393':'Gamma','\u03B4':'delta','\u0394':'Delta','\u03B5':'epsi','\u03F5':'epsiv','\u0395':'Epsilon','\u03DD':'gammad','\u03DC':'Gammad','\u03B6':'zeta','\u0396':'Zeta','\u03B7':'eta','\u0397':'Eta','\u03B8':'theta','\u03D1':'thetav','\u0398':'Theta','\u03B9':'iota','\u0399':'Iota','\u03BA':'kappa','\u03F0':'kappav','\u039A':'Kappa','\u03BB':'lambda','\u039B':'Lambda','\u03BC':'mu','\xB5':'micro','\u039C':'Mu','\u03BD':'nu','\u039D':'Nu','\u03BE':'xi','\u039E':'Xi','\u03BF':'omicron','\u039F':'Omicron','\u03C0':'pi','\u03D6':'piv','\u03A0':'Pi','\u03C1':'rho','\u03F1':'rhov','\u03A1':'Rho','\u03C3':'sigma','\u03A3':'Sigma','\u03C2':'sigmaf','\u03C4':'tau','\u03A4':'Tau','\u03C5':'upsi','\u03A5':'Upsilon','\u03D2':'Upsi','\u03C6':'phi','\u03D5':'phiv','\u03A6':'Phi','\u03C7':'chi','\u03A7':'Chi','\u03C8':'psi','\u03A8':'Psi','\u03C9':'omega','\u03A9':'ohm','\u0430':'acy','\u0410':'Acy','\u0431':'bcy','\u0411':'Bcy','\u0432':'vcy','\u0412':'Vcy','\u0433':'gcy','\u0413':'Gcy','\u0453':'gjcy','\u0403':'GJcy','\u0434':'dcy','\u0414':'Dcy','\u0452':'djcy','\u0402':'DJcy','\u0435':'iecy','\u0415':'IEcy','\u0451':'iocy','\u0401':'IOcy','\u0454':'jukcy','\u0404':'Jukcy','\u0436':'zhcy','\u0416':'ZHcy','\u0437':'zcy','\u0417':'Zcy','\u0455':'dscy','\u0405':'DScy','\u0438':'icy','\u0418':'Icy','\u0456':'iukcy','\u0406':'Iukcy','\u0457':'yicy','\u0407':'YIcy','\u0439':'jcy','\u0419':'Jcy','\u0458':'jsercy','\u0408':'Jsercy','\u043A':'kcy','\u041A':'Kcy','\u045C':'kjcy','\u040C':'KJcy','\u043B':'lcy','\u041B':'Lcy','\u0459':'ljcy','\u0409':'LJcy','\u043C':'mcy','\u041C':'Mcy','\u043D':'ncy','\u041D':'Ncy','\u045A':'njcy','\u040A':'NJcy','\u043E':'ocy','\u041E':'Ocy','\u043F':'pcy','\u041F':'Pcy','\u0440':'rcy','\u0420':'Rcy','\u0441':'scy','\u0421':'Scy','\u0442':'tcy','\u0422':'Tcy','\u045B':'tshcy','\u040B':'TSHcy','\u0443':'ucy','\u0423':'Ucy','\u045E':'ubrcy','\u040E':'Ubrcy','\u0444':'fcy','\u0424':'Fcy','\u0445':'khcy','\u0425':'KHcy','\u0446':'tscy','\u0426':'TScy','\u0447':'chcy','\u0427':'CHcy','\u045F':'dzcy','\u040F':'DZcy','\u0448':'shcy','\u0428':'SHcy','\u0449':'shchcy','\u0429':'SHCHcy','\u044A':'hardcy','\u042A':'HARDcy','\u044B':'ycy','\u042B':'Ycy','\u044C':'softcy','\u042C':'SOFTcy','\u044D':'ecy','\u042D':'Ecy','\u044E':'yucy','\u042E':'YUcy','\u044F':'yacy','\u042F':'YAcy','\u2135':'aleph','\u2136':'beth','\u2137':'gimel','\u2138':'daleth'};

	var regexEscape = /["&'<>`]/g;
	var escapeMap = {
		'"': '&quot;',
		'&': '&amp;',
		'\'': '&#x27;',
		'<': '&lt;',
		// See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
		// following is not strictly necessary unless it’s part of a tag or an
		// unquoted attribute value. We’re only escaping it to support those
		// situations, and for XML support.
		'>': '&gt;',
		// In Internet Explorer ≤ 8, the backtick character can be used
		// to break out of (un)quoted attribute values or HTML comments.
		// See http://html5sec.org/#102, http://html5sec.org/#108, and
		// http://html5sec.org/#133.
		'`': '&#x60;'
	};

	var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
	var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;
	var decodeMap = {'aacute':'\xE1','Aacute':'\xC1','abreve':'\u0103','Abreve':'\u0102','ac':'\u223E','acd':'\u223F','acE':'\u223E\u0333','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','acy':'\u0430','Acy':'\u0410','aelig':'\xE6','AElig':'\xC6','af':'\u2061','afr':'\uD835\uDD1E','Afr':'\uD835\uDD04','agrave':'\xE0','Agrave':'\xC0','alefsym':'\u2135','aleph':'\u2135','alpha':'\u03B1','Alpha':'\u0391','amacr':'\u0101','Amacr':'\u0100','amalg':'\u2A3F','amp':'&','AMP':'&','and':'\u2227','And':'\u2A53','andand':'\u2A55','andd':'\u2A5C','andslope':'\u2A58','andv':'\u2A5A','ang':'\u2220','ange':'\u29A4','angle':'\u2220','angmsd':'\u2221','angmsdaa':'\u29A8','angmsdab':'\u29A9','angmsdac':'\u29AA','angmsdad':'\u29AB','angmsdae':'\u29AC','angmsdaf':'\u29AD','angmsdag':'\u29AE','angmsdah':'\u29AF','angrt':'\u221F','angrtvb':'\u22BE','angrtvbd':'\u299D','angsph':'\u2222','angst':'\xC5','angzarr':'\u237C','aogon':'\u0105','Aogon':'\u0104','aopf':'\uD835\uDD52','Aopf':'\uD835\uDD38','ap':'\u2248','apacir':'\u2A6F','ape':'\u224A','apE':'\u2A70','apid':'\u224B','apos':'\'','ApplyFunction':'\u2061','approx':'\u2248','approxeq':'\u224A','aring':'\xE5','Aring':'\xC5','ascr':'\uD835\uDCB6','Ascr':'\uD835\uDC9C','Assign':'\u2254','ast':'*','asymp':'\u2248','asympeq':'\u224D','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','awconint':'\u2233','awint':'\u2A11','backcong':'\u224C','backepsilon':'\u03F6','backprime':'\u2035','backsim':'\u223D','backsimeq':'\u22CD','Backslash':'\u2216','Barv':'\u2AE7','barvee':'\u22BD','barwed':'\u2305','Barwed':'\u2306','barwedge':'\u2305','bbrk':'\u23B5','bbrktbrk':'\u23B6','bcong':'\u224C','bcy':'\u0431','Bcy':'\u0411','bdquo':'\u201E','becaus':'\u2235','because':'\u2235','Because':'\u2235','bemptyv':'\u29B0','bepsi':'\u03F6','bernou':'\u212C','Bernoullis':'\u212C','beta':'\u03B2','Beta':'\u0392','beth':'\u2136','between':'\u226C','bfr':'\uD835\uDD1F','Bfr':'\uD835\uDD05','bigcap':'\u22C2','bigcirc':'\u25EF','bigcup':'\u22C3','bigodot':'\u2A00','bigoplus':'\u2A01','bigotimes':'\u2A02','bigsqcup':'\u2A06','bigstar':'\u2605','bigtriangledown':'\u25BD','bigtriangleup':'\u25B3','biguplus':'\u2A04','bigvee':'\u22C1','bigwedge':'\u22C0','bkarow':'\u290D','blacklozenge':'\u29EB','blacksquare':'\u25AA','blacktriangle':'\u25B4','blacktriangledown':'\u25BE','blacktriangleleft':'\u25C2','blacktriangleright':'\u25B8','blank':'\u2423','blk12':'\u2592','blk14':'\u2591','blk34':'\u2593','block':'\u2588','bne':'=\u20E5','bnequiv':'\u2261\u20E5','bnot':'\u2310','bNot':'\u2AED','bopf':'\uD835\uDD53','Bopf':'\uD835\uDD39','bot':'\u22A5','bottom':'\u22A5','bowtie':'\u22C8','boxbox':'\u29C9','boxdl':'\u2510','boxdL':'\u2555','boxDl':'\u2556','boxDL':'\u2557','boxdr':'\u250C','boxdR':'\u2552','boxDr':'\u2553','boxDR':'\u2554','boxh':'\u2500','boxH':'\u2550','boxhd':'\u252C','boxhD':'\u2565','boxHd':'\u2564','boxHD':'\u2566','boxhu':'\u2534','boxhU':'\u2568','boxHu':'\u2567','boxHU':'\u2569','boxminus':'\u229F','boxplus':'\u229E','boxtimes':'\u22A0','boxul':'\u2518','boxuL':'\u255B','boxUl':'\u255C','boxUL':'\u255D','boxur':'\u2514','boxuR':'\u2558','boxUr':'\u2559','boxUR':'\u255A','boxv':'\u2502','boxV':'\u2551','boxvh':'\u253C','boxvH':'\u256A','boxVh':'\u256B','boxVH':'\u256C','boxvl':'\u2524','boxvL':'\u2561','boxVl':'\u2562','boxVL':'\u2563','boxvr':'\u251C','boxvR':'\u255E','boxVr':'\u255F','boxVR':'\u2560','bprime':'\u2035','breve':'\u02D8','Breve':'\u02D8','brvbar':'\xA6','bscr':'\uD835\uDCB7','Bscr':'\u212C','bsemi':'\u204F','bsim':'\u223D','bsime':'\u22CD','bsol':'\\','bsolb':'\u29C5','bsolhsub':'\u27C8','bull':'\u2022','bullet':'\u2022','bump':'\u224E','bumpe':'\u224F','bumpE':'\u2AAE','bumpeq':'\u224F','Bumpeq':'\u224E','cacute':'\u0107','Cacute':'\u0106','cap':'\u2229','Cap':'\u22D2','capand':'\u2A44','capbrcup':'\u2A49','capcap':'\u2A4B','capcup':'\u2A47','capdot':'\u2A40','CapitalDifferentialD':'\u2145','caps':'\u2229\uFE00','caret':'\u2041','caron':'\u02C7','Cayleys':'\u212D','ccaps':'\u2A4D','ccaron':'\u010D','Ccaron':'\u010C','ccedil':'\xE7','Ccedil':'\xC7','ccirc':'\u0109','Ccirc':'\u0108','Cconint':'\u2230','ccups':'\u2A4C','ccupssm':'\u2A50','cdot':'\u010B','Cdot':'\u010A','cedil':'\xB8','Cedilla':'\xB8','cemptyv':'\u29B2','cent':'\xA2','centerdot':'\xB7','CenterDot':'\xB7','cfr':'\uD835\uDD20','Cfr':'\u212D','chcy':'\u0447','CHcy':'\u0427','check':'\u2713','checkmark':'\u2713','chi':'\u03C7','Chi':'\u03A7','cir':'\u25CB','circ':'\u02C6','circeq':'\u2257','circlearrowleft':'\u21BA','circlearrowright':'\u21BB','circledast':'\u229B','circledcirc':'\u229A','circleddash':'\u229D','CircleDot':'\u2299','circledR':'\xAE','circledS':'\u24C8','CircleMinus':'\u2296','CirclePlus':'\u2295','CircleTimes':'\u2297','cire':'\u2257','cirE':'\u29C3','cirfnint':'\u2A10','cirmid':'\u2AEF','cirscir':'\u29C2','ClockwiseContourIntegral':'\u2232','CloseCurlyDoubleQuote':'\u201D','CloseCurlyQuote':'\u2019','clubs':'\u2663','clubsuit':'\u2663','colon':':','Colon':'\u2237','colone':'\u2254','Colone':'\u2A74','coloneq':'\u2254','comma':',','commat':'@','comp':'\u2201','compfn':'\u2218','complement':'\u2201','complexes':'\u2102','cong':'\u2245','congdot':'\u2A6D','Congruent':'\u2261','conint':'\u222E','Conint':'\u222F','ContourIntegral':'\u222E','copf':'\uD835\uDD54','Copf':'\u2102','coprod':'\u2210','Coproduct':'\u2210','copy':'\xA9','COPY':'\xA9','copysr':'\u2117','CounterClockwiseContourIntegral':'\u2233','crarr':'\u21B5','cross':'\u2717','Cross':'\u2A2F','cscr':'\uD835\uDCB8','Cscr':'\uD835\uDC9E','csub':'\u2ACF','csube':'\u2AD1','csup':'\u2AD0','csupe':'\u2AD2','ctdot':'\u22EF','cudarrl':'\u2938','cudarrr':'\u2935','cuepr':'\u22DE','cuesc':'\u22DF','cularr':'\u21B6','cularrp':'\u293D','cup':'\u222A','Cup':'\u22D3','cupbrcap':'\u2A48','cupcap':'\u2A46','CupCap':'\u224D','cupcup':'\u2A4A','cupdot':'\u228D','cupor':'\u2A45','cups':'\u222A\uFE00','curarr':'\u21B7','curarrm':'\u293C','curlyeqprec':'\u22DE','curlyeqsucc':'\u22DF','curlyvee':'\u22CE','curlywedge':'\u22CF','curren':'\xA4','curvearrowleft':'\u21B6','curvearrowright':'\u21B7','cuvee':'\u22CE','cuwed':'\u22CF','cwconint':'\u2232','cwint':'\u2231','cylcty':'\u232D','dagger':'\u2020','Dagger':'\u2021','daleth':'\u2138','darr':'\u2193','dArr':'\u21D3','Darr':'\u21A1','dash':'\u2010','dashv':'\u22A3','Dashv':'\u2AE4','dbkarow':'\u290F','dblac':'\u02DD','dcaron':'\u010F','Dcaron':'\u010E','dcy':'\u0434','Dcy':'\u0414','dd':'\u2146','DD':'\u2145','ddagger':'\u2021','ddarr':'\u21CA','DDotrahd':'\u2911','ddotseq':'\u2A77','deg':'\xB0','Del':'\u2207','delta':'\u03B4','Delta':'\u0394','demptyv':'\u29B1','dfisht':'\u297F','dfr':'\uD835\uDD21','Dfr':'\uD835\uDD07','dHar':'\u2965','dharl':'\u21C3','dharr':'\u21C2','DiacriticalAcute':'\xB4','DiacriticalDot':'\u02D9','DiacriticalDoubleAcute':'\u02DD','DiacriticalGrave':'`','DiacriticalTilde':'\u02DC','diam':'\u22C4','diamond':'\u22C4','Diamond':'\u22C4','diamondsuit':'\u2666','diams':'\u2666','die':'\xA8','DifferentialD':'\u2146','digamma':'\u03DD','disin':'\u22F2','div':'\xF7','divide':'\xF7','divideontimes':'\u22C7','divonx':'\u22C7','djcy':'\u0452','DJcy':'\u0402','dlcorn':'\u231E','dlcrop':'\u230D','dollar':'$','dopf':'\uD835\uDD55','Dopf':'\uD835\uDD3B','dot':'\u02D9','Dot':'\xA8','DotDot':'\u20DC','doteq':'\u2250','doteqdot':'\u2251','DotEqual':'\u2250','dotminus':'\u2238','dotplus':'\u2214','dotsquare':'\u22A1','doublebarwedge':'\u2306','DoubleContourIntegral':'\u222F','DoubleDot':'\xA8','DoubleDownArrow':'\u21D3','DoubleLeftArrow':'\u21D0','DoubleLeftRightArrow':'\u21D4','DoubleLeftTee':'\u2AE4','DoubleLongLeftArrow':'\u27F8','DoubleLongLeftRightArrow':'\u27FA','DoubleLongRightArrow':'\u27F9','DoubleRightArrow':'\u21D2','DoubleRightTee':'\u22A8','DoubleUpArrow':'\u21D1','DoubleUpDownArrow':'\u21D5','DoubleVerticalBar':'\u2225','downarrow':'\u2193','Downarrow':'\u21D3','DownArrow':'\u2193','DownArrowBar':'\u2913','DownArrowUpArrow':'\u21F5','DownBreve':'\u0311','downdownarrows':'\u21CA','downharpoonleft':'\u21C3','downharpoonright':'\u21C2','DownLeftRightVector':'\u2950','DownLeftTeeVector':'\u295E','DownLeftVector':'\u21BD','DownLeftVectorBar':'\u2956','DownRightTeeVector':'\u295F','DownRightVector':'\u21C1','DownRightVectorBar':'\u2957','DownTee':'\u22A4','DownTeeArrow':'\u21A7','drbkarow':'\u2910','drcorn':'\u231F','drcrop':'\u230C','dscr':'\uD835\uDCB9','Dscr':'\uD835\uDC9F','dscy':'\u0455','DScy':'\u0405','dsol':'\u29F6','dstrok':'\u0111','Dstrok':'\u0110','dtdot':'\u22F1','dtri':'\u25BF','dtrif':'\u25BE','duarr':'\u21F5','duhar':'\u296F','dwangle':'\u29A6','dzcy':'\u045F','DZcy':'\u040F','dzigrarr':'\u27FF','eacute':'\xE9','Eacute':'\xC9','easter':'\u2A6E','ecaron':'\u011B','Ecaron':'\u011A','ecir':'\u2256','ecirc':'\xEA','Ecirc':'\xCA','ecolon':'\u2255','ecy':'\u044D','Ecy':'\u042D','eDDot':'\u2A77','edot':'\u0117','eDot':'\u2251','Edot':'\u0116','ee':'\u2147','efDot':'\u2252','efr':'\uD835\uDD22','Efr':'\uD835\uDD08','eg':'\u2A9A','egrave':'\xE8','Egrave':'\xC8','egs':'\u2A96','egsdot':'\u2A98','el':'\u2A99','Element':'\u2208','elinters':'\u23E7','ell':'\u2113','els':'\u2A95','elsdot':'\u2A97','emacr':'\u0113','Emacr':'\u0112','empty':'\u2205','emptyset':'\u2205','EmptySmallSquare':'\u25FB','emptyv':'\u2205','EmptyVerySmallSquare':'\u25AB','emsp':'\u2003','emsp13':'\u2004','emsp14':'\u2005','eng':'\u014B','ENG':'\u014A','ensp':'\u2002','eogon':'\u0119','Eogon':'\u0118','eopf':'\uD835\uDD56','Eopf':'\uD835\uDD3C','epar':'\u22D5','eparsl':'\u29E3','eplus':'\u2A71','epsi':'\u03B5','epsilon':'\u03B5','Epsilon':'\u0395','epsiv':'\u03F5','eqcirc':'\u2256','eqcolon':'\u2255','eqsim':'\u2242','eqslantgtr':'\u2A96','eqslantless':'\u2A95','Equal':'\u2A75','equals':'=','EqualTilde':'\u2242','equest':'\u225F','Equilibrium':'\u21CC','equiv':'\u2261','equivDD':'\u2A78','eqvparsl':'\u29E5','erarr':'\u2971','erDot':'\u2253','escr':'\u212F','Escr':'\u2130','esdot':'\u2250','esim':'\u2242','Esim':'\u2A73','eta':'\u03B7','Eta':'\u0397','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','euro':'\u20AC','excl':'!','exist':'\u2203','Exists':'\u2203','expectation':'\u2130','exponentiale':'\u2147','ExponentialE':'\u2147','fallingdotseq':'\u2252','fcy':'\u0444','Fcy':'\u0424','female':'\u2640','ffilig':'\uFB03','fflig':'\uFB00','ffllig':'\uFB04','ffr':'\uD835\uDD23','Ffr':'\uD835\uDD09','filig':'\uFB01','FilledSmallSquare':'\u25FC','FilledVerySmallSquare':'\u25AA','fjlig':'fj','flat':'\u266D','fllig':'\uFB02','fltns':'\u25B1','fnof':'\u0192','fopf':'\uD835\uDD57','Fopf':'\uD835\uDD3D','forall':'\u2200','ForAll':'\u2200','fork':'\u22D4','forkv':'\u2AD9','Fouriertrf':'\u2131','fpartint':'\u2A0D','frac12':'\xBD','frac13':'\u2153','frac14':'\xBC','frac15':'\u2155','frac16':'\u2159','frac18':'\u215B','frac23':'\u2154','frac25':'\u2156','frac34':'\xBE','frac35':'\u2157','frac38':'\u215C','frac45':'\u2158','frac56':'\u215A','frac58':'\u215D','frac78':'\u215E','frasl':'\u2044','frown':'\u2322','fscr':'\uD835\uDCBB','Fscr':'\u2131','gacute':'\u01F5','gamma':'\u03B3','Gamma':'\u0393','gammad':'\u03DD','Gammad':'\u03DC','gap':'\u2A86','gbreve':'\u011F','Gbreve':'\u011E','Gcedil':'\u0122','gcirc':'\u011D','Gcirc':'\u011C','gcy':'\u0433','Gcy':'\u0413','gdot':'\u0121','Gdot':'\u0120','ge':'\u2265','gE':'\u2267','gel':'\u22DB','gEl':'\u2A8C','geq':'\u2265','geqq':'\u2267','geqslant':'\u2A7E','ges':'\u2A7E','gescc':'\u2AA9','gesdot':'\u2A80','gesdoto':'\u2A82','gesdotol':'\u2A84','gesl':'\u22DB\uFE00','gesles':'\u2A94','gfr':'\uD835\uDD24','Gfr':'\uD835\uDD0A','gg':'\u226B','Gg':'\u22D9','ggg':'\u22D9','gimel':'\u2137','gjcy':'\u0453','GJcy':'\u0403','gl':'\u2277','gla':'\u2AA5','glE':'\u2A92','glj':'\u2AA4','gnap':'\u2A8A','gnapprox':'\u2A8A','gne':'\u2A88','gnE':'\u2269','gneq':'\u2A88','gneqq':'\u2269','gnsim':'\u22E7','gopf':'\uD835\uDD58','Gopf':'\uD835\uDD3E','grave':'`','GreaterEqual':'\u2265','GreaterEqualLess':'\u22DB','GreaterFullEqual':'\u2267','GreaterGreater':'\u2AA2','GreaterLess':'\u2277','GreaterSlantEqual':'\u2A7E','GreaterTilde':'\u2273','gscr':'\u210A','Gscr':'\uD835\uDCA2','gsim':'\u2273','gsime':'\u2A8E','gsiml':'\u2A90','gt':'>','Gt':'\u226B','GT':'>','gtcc':'\u2AA7','gtcir':'\u2A7A','gtdot':'\u22D7','gtlPar':'\u2995','gtquest':'\u2A7C','gtrapprox':'\u2A86','gtrarr':'\u2978','gtrdot':'\u22D7','gtreqless':'\u22DB','gtreqqless':'\u2A8C','gtrless':'\u2277','gtrsim':'\u2273','gvertneqq':'\u2269\uFE00','gvnE':'\u2269\uFE00','Hacek':'\u02C7','hairsp':'\u200A','half':'\xBD','hamilt':'\u210B','hardcy':'\u044A','HARDcy':'\u042A','harr':'\u2194','hArr':'\u21D4','harrcir':'\u2948','harrw':'\u21AD','Hat':'^','hbar':'\u210F','hcirc':'\u0125','Hcirc':'\u0124','hearts':'\u2665','heartsuit':'\u2665','hellip':'\u2026','hercon':'\u22B9','hfr':'\uD835\uDD25','Hfr':'\u210C','HilbertSpace':'\u210B','hksearow':'\u2925','hkswarow':'\u2926','hoarr':'\u21FF','homtht':'\u223B','hookleftarrow':'\u21A9','hookrightarrow':'\u21AA','hopf':'\uD835\uDD59','Hopf':'\u210D','horbar':'\u2015','HorizontalLine':'\u2500','hscr':'\uD835\uDCBD','Hscr':'\u210B','hslash':'\u210F','hstrok':'\u0127','Hstrok':'\u0126','HumpDownHump':'\u224E','HumpEqual':'\u224F','hybull':'\u2043','hyphen':'\u2010','iacute':'\xED','Iacute':'\xCD','ic':'\u2063','icirc':'\xEE','Icirc':'\xCE','icy':'\u0438','Icy':'\u0418','Idot':'\u0130','iecy':'\u0435','IEcy':'\u0415','iexcl':'\xA1','iff':'\u21D4','ifr':'\uD835\uDD26','Ifr':'\u2111','igrave':'\xEC','Igrave':'\xCC','ii':'\u2148','iiiint':'\u2A0C','iiint':'\u222D','iinfin':'\u29DC','iiota':'\u2129','ijlig':'\u0133','IJlig':'\u0132','Im':'\u2111','imacr':'\u012B','Imacr':'\u012A','image':'\u2111','ImaginaryI':'\u2148','imagline':'\u2110','imagpart':'\u2111','imath':'\u0131','imof':'\u22B7','imped':'\u01B5','Implies':'\u21D2','in':'\u2208','incare':'\u2105','infin':'\u221E','infintie':'\u29DD','inodot':'\u0131','int':'\u222B','Int':'\u222C','intcal':'\u22BA','integers':'\u2124','Integral':'\u222B','intercal':'\u22BA','Intersection':'\u22C2','intlarhk':'\u2A17','intprod':'\u2A3C','InvisibleComma':'\u2063','InvisibleTimes':'\u2062','iocy':'\u0451','IOcy':'\u0401','iogon':'\u012F','Iogon':'\u012E','iopf':'\uD835\uDD5A','Iopf':'\uD835\uDD40','iota':'\u03B9','Iota':'\u0399','iprod':'\u2A3C','iquest':'\xBF','iscr':'\uD835\uDCBE','Iscr':'\u2110','isin':'\u2208','isindot':'\u22F5','isinE':'\u22F9','isins':'\u22F4','isinsv':'\u22F3','isinv':'\u2208','it':'\u2062','itilde':'\u0129','Itilde':'\u0128','iukcy':'\u0456','Iukcy':'\u0406','iuml':'\xEF','Iuml':'\xCF','jcirc':'\u0135','Jcirc':'\u0134','jcy':'\u0439','Jcy':'\u0419','jfr':'\uD835\uDD27','Jfr':'\uD835\uDD0D','jmath':'\u0237','jopf':'\uD835\uDD5B','Jopf':'\uD835\uDD41','jscr':'\uD835\uDCBF','Jscr':'\uD835\uDCA5','jsercy':'\u0458','Jsercy':'\u0408','jukcy':'\u0454','Jukcy':'\u0404','kappa':'\u03BA','Kappa':'\u039A','kappav':'\u03F0','kcedil':'\u0137','Kcedil':'\u0136','kcy':'\u043A','Kcy':'\u041A','kfr':'\uD835\uDD28','Kfr':'\uD835\uDD0E','kgreen':'\u0138','khcy':'\u0445','KHcy':'\u0425','kjcy':'\u045C','KJcy':'\u040C','kopf':'\uD835\uDD5C','Kopf':'\uD835\uDD42','kscr':'\uD835\uDCC0','Kscr':'\uD835\uDCA6','lAarr':'\u21DA','lacute':'\u013A','Lacute':'\u0139','laemptyv':'\u29B4','lagran':'\u2112','lambda':'\u03BB','Lambda':'\u039B','lang':'\u27E8','Lang':'\u27EA','langd':'\u2991','langle':'\u27E8','lap':'\u2A85','Laplacetrf':'\u2112','laquo':'\xAB','larr':'\u2190','lArr':'\u21D0','Larr':'\u219E','larrb':'\u21E4','larrbfs':'\u291F','larrfs':'\u291D','larrhk':'\u21A9','larrlp':'\u21AB','larrpl':'\u2939','larrsim':'\u2973','larrtl':'\u21A2','lat':'\u2AAB','latail':'\u2919','lAtail':'\u291B','late':'\u2AAD','lates':'\u2AAD\uFE00','lbarr':'\u290C','lBarr':'\u290E','lbbrk':'\u2772','lbrace':'{','lbrack':'[','lbrke':'\u298B','lbrksld':'\u298F','lbrkslu':'\u298D','lcaron':'\u013E','Lcaron':'\u013D','lcedil':'\u013C','Lcedil':'\u013B','lceil':'\u2308','lcub':'{','lcy':'\u043B','Lcy':'\u041B','ldca':'\u2936','ldquo':'\u201C','ldquor':'\u201E','ldrdhar':'\u2967','ldrushar':'\u294B','ldsh':'\u21B2','le':'\u2264','lE':'\u2266','LeftAngleBracket':'\u27E8','leftarrow':'\u2190','Leftarrow':'\u21D0','LeftArrow':'\u2190','LeftArrowBar':'\u21E4','LeftArrowRightArrow':'\u21C6','leftarrowtail':'\u21A2','LeftCeiling':'\u2308','LeftDoubleBracket':'\u27E6','LeftDownTeeVector':'\u2961','LeftDownVector':'\u21C3','LeftDownVectorBar':'\u2959','LeftFloor':'\u230A','leftharpoondown':'\u21BD','leftharpoonup':'\u21BC','leftleftarrows':'\u21C7','leftrightarrow':'\u2194','Leftrightarrow':'\u21D4','LeftRightArrow':'\u2194','leftrightarrows':'\u21C6','leftrightharpoons':'\u21CB','leftrightsquigarrow':'\u21AD','LeftRightVector':'\u294E','LeftTee':'\u22A3','LeftTeeArrow':'\u21A4','LeftTeeVector':'\u295A','leftthreetimes':'\u22CB','LeftTriangle':'\u22B2','LeftTriangleBar':'\u29CF','LeftTriangleEqual':'\u22B4','LeftUpDownVector':'\u2951','LeftUpTeeVector':'\u2960','LeftUpVector':'\u21BF','LeftUpVectorBar':'\u2958','LeftVector':'\u21BC','LeftVectorBar':'\u2952','leg':'\u22DA','lEg':'\u2A8B','leq':'\u2264','leqq':'\u2266','leqslant':'\u2A7D','les':'\u2A7D','lescc':'\u2AA8','lesdot':'\u2A7F','lesdoto':'\u2A81','lesdotor':'\u2A83','lesg':'\u22DA\uFE00','lesges':'\u2A93','lessapprox':'\u2A85','lessdot':'\u22D6','lesseqgtr':'\u22DA','lesseqqgtr':'\u2A8B','LessEqualGreater':'\u22DA','LessFullEqual':'\u2266','LessGreater':'\u2276','lessgtr':'\u2276','LessLess':'\u2AA1','lesssim':'\u2272','LessSlantEqual':'\u2A7D','LessTilde':'\u2272','lfisht':'\u297C','lfloor':'\u230A','lfr':'\uD835\uDD29','Lfr':'\uD835\uDD0F','lg':'\u2276','lgE':'\u2A91','lHar':'\u2962','lhard':'\u21BD','lharu':'\u21BC','lharul':'\u296A','lhblk':'\u2584','ljcy':'\u0459','LJcy':'\u0409','ll':'\u226A','Ll':'\u22D8','llarr':'\u21C7','llcorner':'\u231E','Lleftarrow':'\u21DA','llhard':'\u296B','lltri':'\u25FA','lmidot':'\u0140','Lmidot':'\u013F','lmoust':'\u23B0','lmoustache':'\u23B0','lnap':'\u2A89','lnapprox':'\u2A89','lne':'\u2A87','lnE':'\u2268','lneq':'\u2A87','lneqq':'\u2268','lnsim':'\u22E6','loang':'\u27EC','loarr':'\u21FD','lobrk':'\u27E6','longleftarrow':'\u27F5','Longleftarrow':'\u27F8','LongLeftArrow':'\u27F5','longleftrightarrow':'\u27F7','Longleftrightarrow':'\u27FA','LongLeftRightArrow':'\u27F7','longmapsto':'\u27FC','longrightarrow':'\u27F6','Longrightarrow':'\u27F9','LongRightArrow':'\u27F6','looparrowleft':'\u21AB','looparrowright':'\u21AC','lopar':'\u2985','lopf':'\uD835\uDD5D','Lopf':'\uD835\uDD43','loplus':'\u2A2D','lotimes':'\u2A34','lowast':'\u2217','lowbar':'_','LowerLeftArrow':'\u2199','LowerRightArrow':'\u2198','loz':'\u25CA','lozenge':'\u25CA','lozf':'\u29EB','lpar':'(','lparlt':'\u2993','lrarr':'\u21C6','lrcorner':'\u231F','lrhar':'\u21CB','lrhard':'\u296D','lrm':'\u200E','lrtri':'\u22BF','lsaquo':'\u2039','lscr':'\uD835\uDCC1','Lscr':'\u2112','lsh':'\u21B0','Lsh':'\u21B0','lsim':'\u2272','lsime':'\u2A8D','lsimg':'\u2A8F','lsqb':'[','lsquo':'\u2018','lsquor':'\u201A','lstrok':'\u0142','Lstrok':'\u0141','lt':'<','Lt':'\u226A','LT':'<','ltcc':'\u2AA6','ltcir':'\u2A79','ltdot':'\u22D6','lthree':'\u22CB','ltimes':'\u22C9','ltlarr':'\u2976','ltquest':'\u2A7B','ltri':'\u25C3','ltrie':'\u22B4','ltrif':'\u25C2','ltrPar':'\u2996','lurdshar':'\u294A','luruhar':'\u2966','lvertneqq':'\u2268\uFE00','lvnE':'\u2268\uFE00','macr':'\xAF','male':'\u2642','malt':'\u2720','maltese':'\u2720','map':'\u21A6','Map':'\u2905','mapsto':'\u21A6','mapstodown':'\u21A7','mapstoleft':'\u21A4','mapstoup':'\u21A5','marker':'\u25AE','mcomma':'\u2A29','mcy':'\u043C','Mcy':'\u041C','mdash':'\u2014','mDDot':'\u223A','measuredangle':'\u2221','MediumSpace':'\u205F','Mellintrf':'\u2133','mfr':'\uD835\uDD2A','Mfr':'\uD835\uDD10','mho':'\u2127','micro':'\xB5','mid':'\u2223','midast':'*','midcir':'\u2AF0','middot':'\xB7','minus':'\u2212','minusb':'\u229F','minusd':'\u2238','minusdu':'\u2A2A','MinusPlus':'\u2213','mlcp':'\u2ADB','mldr':'\u2026','mnplus':'\u2213','models':'\u22A7','mopf':'\uD835\uDD5E','Mopf':'\uD835\uDD44','mp':'\u2213','mscr':'\uD835\uDCC2','Mscr':'\u2133','mstpos':'\u223E','mu':'\u03BC','Mu':'\u039C','multimap':'\u22B8','mumap':'\u22B8','nabla':'\u2207','nacute':'\u0144','Nacute':'\u0143','nang':'\u2220\u20D2','nap':'\u2249','napE':'\u2A70\u0338','napid':'\u224B\u0338','napos':'\u0149','napprox':'\u2249','natur':'\u266E','natural':'\u266E','naturals':'\u2115','nbsp':'\xA0','nbump':'\u224E\u0338','nbumpe':'\u224F\u0338','ncap':'\u2A43','ncaron':'\u0148','Ncaron':'\u0147','ncedil':'\u0146','Ncedil':'\u0145','ncong':'\u2247','ncongdot':'\u2A6D\u0338','ncup':'\u2A42','ncy':'\u043D','Ncy':'\u041D','ndash':'\u2013','ne':'\u2260','nearhk':'\u2924','nearr':'\u2197','neArr':'\u21D7','nearrow':'\u2197','nedot':'\u2250\u0338','NegativeMediumSpace':'\u200B','NegativeThickSpace':'\u200B','NegativeThinSpace':'\u200B','NegativeVeryThinSpace':'\u200B','nequiv':'\u2262','nesear':'\u2928','nesim':'\u2242\u0338','NestedGreaterGreater':'\u226B','NestedLessLess':'\u226A','NewLine':'\n','nexist':'\u2204','nexists':'\u2204','nfr':'\uD835\uDD2B','Nfr':'\uD835\uDD11','nge':'\u2271','ngE':'\u2267\u0338','ngeq':'\u2271','ngeqq':'\u2267\u0338','ngeqslant':'\u2A7E\u0338','nges':'\u2A7E\u0338','nGg':'\u22D9\u0338','ngsim':'\u2275','ngt':'\u226F','nGt':'\u226B\u20D2','ngtr':'\u226F','nGtv':'\u226B\u0338','nharr':'\u21AE','nhArr':'\u21CE','nhpar':'\u2AF2','ni':'\u220B','nis':'\u22FC','nisd':'\u22FA','niv':'\u220B','njcy':'\u045A','NJcy':'\u040A','nlarr':'\u219A','nlArr':'\u21CD','nldr':'\u2025','nle':'\u2270','nlE':'\u2266\u0338','nleftarrow':'\u219A','nLeftarrow':'\u21CD','nleftrightarrow':'\u21AE','nLeftrightarrow':'\u21CE','nleq':'\u2270','nleqq':'\u2266\u0338','nleqslant':'\u2A7D\u0338','nles':'\u2A7D\u0338','nless':'\u226E','nLl':'\u22D8\u0338','nlsim':'\u2274','nlt':'\u226E','nLt':'\u226A\u20D2','nltri':'\u22EA','nltrie':'\u22EC','nLtv':'\u226A\u0338','nmid':'\u2224','NoBreak':'\u2060','NonBreakingSpace':'\xA0','nopf':'\uD835\uDD5F','Nopf':'\u2115','not':'\xAC','Not':'\u2AEC','NotCongruent':'\u2262','NotCupCap':'\u226D','NotDoubleVerticalBar':'\u2226','NotElement':'\u2209','NotEqual':'\u2260','NotEqualTilde':'\u2242\u0338','NotExists':'\u2204','NotGreater':'\u226F','NotGreaterEqual':'\u2271','NotGreaterFullEqual':'\u2267\u0338','NotGreaterGreater':'\u226B\u0338','NotGreaterLess':'\u2279','NotGreaterSlantEqual':'\u2A7E\u0338','NotGreaterTilde':'\u2275','NotHumpDownHump':'\u224E\u0338','NotHumpEqual':'\u224F\u0338','notin':'\u2209','notindot':'\u22F5\u0338','notinE':'\u22F9\u0338','notinva':'\u2209','notinvb':'\u22F7','notinvc':'\u22F6','NotLeftTriangle':'\u22EA','NotLeftTriangleBar':'\u29CF\u0338','NotLeftTriangleEqual':'\u22EC','NotLess':'\u226E','NotLessEqual':'\u2270','NotLessGreater':'\u2278','NotLessLess':'\u226A\u0338','NotLessSlantEqual':'\u2A7D\u0338','NotLessTilde':'\u2274','NotNestedGreaterGreater':'\u2AA2\u0338','NotNestedLessLess':'\u2AA1\u0338','notni':'\u220C','notniva':'\u220C','notnivb':'\u22FE','notnivc':'\u22FD','NotPrecedes':'\u2280','NotPrecedesEqual':'\u2AAF\u0338','NotPrecedesSlantEqual':'\u22E0','NotReverseElement':'\u220C','NotRightTriangle':'\u22EB','NotRightTriangleBar':'\u29D0\u0338','NotRightTriangleEqual':'\u22ED','NotSquareSubset':'\u228F\u0338','NotSquareSubsetEqual':'\u22E2','NotSquareSuperset':'\u2290\u0338','NotSquareSupersetEqual':'\u22E3','NotSubset':'\u2282\u20D2','NotSubsetEqual':'\u2288','NotSucceeds':'\u2281','NotSucceedsEqual':'\u2AB0\u0338','NotSucceedsSlantEqual':'\u22E1','NotSucceedsTilde':'\u227F\u0338','NotSuperset':'\u2283\u20D2','NotSupersetEqual':'\u2289','NotTilde':'\u2241','NotTildeEqual':'\u2244','NotTildeFullEqual':'\u2247','NotTildeTilde':'\u2249','NotVerticalBar':'\u2224','npar':'\u2226','nparallel':'\u2226','nparsl':'\u2AFD\u20E5','npart':'\u2202\u0338','npolint':'\u2A14','npr':'\u2280','nprcue':'\u22E0','npre':'\u2AAF\u0338','nprec':'\u2280','npreceq':'\u2AAF\u0338','nrarr':'\u219B','nrArr':'\u21CF','nrarrc':'\u2933\u0338','nrarrw':'\u219D\u0338','nrightarrow':'\u219B','nRightarrow':'\u21CF','nrtri':'\u22EB','nrtrie':'\u22ED','nsc':'\u2281','nsccue':'\u22E1','nsce':'\u2AB0\u0338','nscr':'\uD835\uDCC3','Nscr':'\uD835\uDCA9','nshortmid':'\u2224','nshortparallel':'\u2226','nsim':'\u2241','nsime':'\u2244','nsimeq':'\u2244','nsmid':'\u2224','nspar':'\u2226','nsqsube':'\u22E2','nsqsupe':'\u22E3','nsub':'\u2284','nsube':'\u2288','nsubE':'\u2AC5\u0338','nsubset':'\u2282\u20D2','nsubseteq':'\u2288','nsubseteqq':'\u2AC5\u0338','nsucc':'\u2281','nsucceq':'\u2AB0\u0338','nsup':'\u2285','nsupe':'\u2289','nsupE':'\u2AC6\u0338','nsupset':'\u2283\u20D2','nsupseteq':'\u2289','nsupseteqq':'\u2AC6\u0338','ntgl':'\u2279','ntilde':'\xF1','Ntilde':'\xD1','ntlg':'\u2278','ntriangleleft':'\u22EA','ntrianglelefteq':'\u22EC','ntriangleright':'\u22EB','ntrianglerighteq':'\u22ED','nu':'\u03BD','Nu':'\u039D','num':'#','numero':'\u2116','numsp':'\u2007','nvap':'\u224D\u20D2','nvdash':'\u22AC','nvDash':'\u22AD','nVdash':'\u22AE','nVDash':'\u22AF','nvge':'\u2265\u20D2','nvgt':'>\u20D2','nvHarr':'\u2904','nvinfin':'\u29DE','nvlArr':'\u2902','nvle':'\u2264\u20D2','nvlt':'<\u20D2','nvltrie':'\u22B4\u20D2','nvrArr':'\u2903','nvrtrie':'\u22B5\u20D2','nvsim':'\u223C\u20D2','nwarhk':'\u2923','nwarr':'\u2196','nwArr':'\u21D6','nwarrow':'\u2196','nwnear':'\u2927','oacute':'\xF3','Oacute':'\xD3','oast':'\u229B','ocir':'\u229A','ocirc':'\xF4','Ocirc':'\xD4','ocy':'\u043E','Ocy':'\u041E','odash':'\u229D','odblac':'\u0151','Odblac':'\u0150','odiv':'\u2A38','odot':'\u2299','odsold':'\u29BC','oelig':'\u0153','OElig':'\u0152','ofcir':'\u29BF','ofr':'\uD835\uDD2C','Ofr':'\uD835\uDD12','ogon':'\u02DB','ograve':'\xF2','Ograve':'\xD2','ogt':'\u29C1','ohbar':'\u29B5','ohm':'\u03A9','oint':'\u222E','olarr':'\u21BA','olcir':'\u29BE','olcross':'\u29BB','oline':'\u203E','olt':'\u29C0','omacr':'\u014D','Omacr':'\u014C','omega':'\u03C9','Omega':'\u03A9','omicron':'\u03BF','Omicron':'\u039F','omid':'\u29B6','ominus':'\u2296','oopf':'\uD835\uDD60','Oopf':'\uD835\uDD46','opar':'\u29B7','OpenCurlyDoubleQuote':'\u201C','OpenCurlyQuote':'\u2018','operp':'\u29B9','oplus':'\u2295','or':'\u2228','Or':'\u2A54','orarr':'\u21BB','ord':'\u2A5D','order':'\u2134','orderof':'\u2134','ordf':'\xAA','ordm':'\xBA','origof':'\u22B6','oror':'\u2A56','orslope':'\u2A57','orv':'\u2A5B','oS':'\u24C8','oscr':'\u2134','Oscr':'\uD835\uDCAA','oslash':'\xF8','Oslash':'\xD8','osol':'\u2298','otilde':'\xF5','Otilde':'\xD5','otimes':'\u2297','Otimes':'\u2A37','otimesas':'\u2A36','ouml':'\xF6','Ouml':'\xD6','ovbar':'\u233D','OverBar':'\u203E','OverBrace':'\u23DE','OverBracket':'\u23B4','OverParenthesis':'\u23DC','par':'\u2225','para':'\xB6','parallel':'\u2225','parsim':'\u2AF3','parsl':'\u2AFD','part':'\u2202','PartialD':'\u2202','pcy':'\u043F','Pcy':'\u041F','percnt':'%','period':'.','permil':'\u2030','perp':'\u22A5','pertenk':'\u2031','pfr':'\uD835\uDD2D','Pfr':'\uD835\uDD13','phi':'\u03C6','Phi':'\u03A6','phiv':'\u03D5','phmmat':'\u2133','phone':'\u260E','pi':'\u03C0','Pi':'\u03A0','pitchfork':'\u22D4','piv':'\u03D6','planck':'\u210F','planckh':'\u210E','plankv':'\u210F','plus':'+','plusacir':'\u2A23','plusb':'\u229E','pluscir':'\u2A22','plusdo':'\u2214','plusdu':'\u2A25','pluse':'\u2A72','PlusMinus':'\xB1','plusmn':'\xB1','plussim':'\u2A26','plustwo':'\u2A27','pm':'\xB1','Poincareplane':'\u210C','pointint':'\u2A15','popf':'\uD835\uDD61','Popf':'\u2119','pound':'\xA3','pr':'\u227A','Pr':'\u2ABB','prap':'\u2AB7','prcue':'\u227C','pre':'\u2AAF','prE':'\u2AB3','prec':'\u227A','precapprox':'\u2AB7','preccurlyeq':'\u227C','Precedes':'\u227A','PrecedesEqual':'\u2AAF','PrecedesSlantEqual':'\u227C','PrecedesTilde':'\u227E','preceq':'\u2AAF','precnapprox':'\u2AB9','precneqq':'\u2AB5','precnsim':'\u22E8','precsim':'\u227E','prime':'\u2032','Prime':'\u2033','primes':'\u2119','prnap':'\u2AB9','prnE':'\u2AB5','prnsim':'\u22E8','prod':'\u220F','Product':'\u220F','profalar':'\u232E','profline':'\u2312','profsurf':'\u2313','prop':'\u221D','Proportion':'\u2237','Proportional':'\u221D','propto':'\u221D','prsim':'\u227E','prurel':'\u22B0','pscr':'\uD835\uDCC5','Pscr':'\uD835\uDCAB','psi':'\u03C8','Psi':'\u03A8','puncsp':'\u2008','qfr':'\uD835\uDD2E','Qfr':'\uD835\uDD14','qint':'\u2A0C','qopf':'\uD835\uDD62','Qopf':'\u211A','qprime':'\u2057','qscr':'\uD835\uDCC6','Qscr':'\uD835\uDCAC','quaternions':'\u210D','quatint':'\u2A16','quest':'?','questeq':'\u225F','quot':'"','QUOT':'"','rAarr':'\u21DB','race':'\u223D\u0331','racute':'\u0155','Racute':'\u0154','radic':'\u221A','raemptyv':'\u29B3','rang':'\u27E9','Rang':'\u27EB','rangd':'\u2992','range':'\u29A5','rangle':'\u27E9','raquo':'\xBB','rarr':'\u2192','rArr':'\u21D2','Rarr':'\u21A0','rarrap':'\u2975','rarrb':'\u21E5','rarrbfs':'\u2920','rarrc':'\u2933','rarrfs':'\u291E','rarrhk':'\u21AA','rarrlp':'\u21AC','rarrpl':'\u2945','rarrsim':'\u2974','rarrtl':'\u21A3','Rarrtl':'\u2916','rarrw':'\u219D','ratail':'\u291A','rAtail':'\u291C','ratio':'\u2236','rationals':'\u211A','rbarr':'\u290D','rBarr':'\u290F','RBarr':'\u2910','rbbrk':'\u2773','rbrace':'}','rbrack':']','rbrke':'\u298C','rbrksld':'\u298E','rbrkslu':'\u2990','rcaron':'\u0159','Rcaron':'\u0158','rcedil':'\u0157','Rcedil':'\u0156','rceil':'\u2309','rcub':'}','rcy':'\u0440','Rcy':'\u0420','rdca':'\u2937','rdldhar':'\u2969','rdquo':'\u201D','rdquor':'\u201D','rdsh':'\u21B3','Re':'\u211C','real':'\u211C','realine':'\u211B','realpart':'\u211C','reals':'\u211D','rect':'\u25AD','reg':'\xAE','REG':'\xAE','ReverseElement':'\u220B','ReverseEquilibrium':'\u21CB','ReverseUpEquilibrium':'\u296F','rfisht':'\u297D','rfloor':'\u230B','rfr':'\uD835\uDD2F','Rfr':'\u211C','rHar':'\u2964','rhard':'\u21C1','rharu':'\u21C0','rharul':'\u296C','rho':'\u03C1','Rho':'\u03A1','rhov':'\u03F1','RightAngleBracket':'\u27E9','rightarrow':'\u2192','Rightarrow':'\u21D2','RightArrow':'\u2192','RightArrowBar':'\u21E5','RightArrowLeftArrow':'\u21C4','rightarrowtail':'\u21A3','RightCeiling':'\u2309','RightDoubleBracket':'\u27E7','RightDownTeeVector':'\u295D','RightDownVector':'\u21C2','RightDownVectorBar':'\u2955','RightFloor':'\u230B','rightharpoondown':'\u21C1','rightharpoonup':'\u21C0','rightleftarrows':'\u21C4','rightleftharpoons':'\u21CC','rightrightarrows':'\u21C9','rightsquigarrow':'\u219D','RightTee':'\u22A2','RightTeeArrow':'\u21A6','RightTeeVector':'\u295B','rightthreetimes':'\u22CC','RightTriangle':'\u22B3','RightTriangleBar':'\u29D0','RightTriangleEqual':'\u22B5','RightUpDownVector':'\u294F','RightUpTeeVector':'\u295C','RightUpVector':'\u21BE','RightUpVectorBar':'\u2954','RightVector':'\u21C0','RightVectorBar':'\u2953','ring':'\u02DA','risingdotseq':'\u2253','rlarr':'\u21C4','rlhar':'\u21CC','rlm':'\u200F','rmoust':'\u23B1','rmoustache':'\u23B1','rnmid':'\u2AEE','roang':'\u27ED','roarr':'\u21FE','robrk':'\u27E7','ropar':'\u2986','ropf':'\uD835\uDD63','Ropf':'\u211D','roplus':'\u2A2E','rotimes':'\u2A35','RoundImplies':'\u2970','rpar':')','rpargt':'\u2994','rppolint':'\u2A12','rrarr':'\u21C9','Rrightarrow':'\u21DB','rsaquo':'\u203A','rscr':'\uD835\uDCC7','Rscr':'\u211B','rsh':'\u21B1','Rsh':'\u21B1','rsqb':']','rsquo':'\u2019','rsquor':'\u2019','rthree':'\u22CC','rtimes':'\u22CA','rtri':'\u25B9','rtrie':'\u22B5','rtrif':'\u25B8','rtriltri':'\u29CE','RuleDelayed':'\u29F4','ruluhar':'\u2968','rx':'\u211E','sacute':'\u015B','Sacute':'\u015A','sbquo':'\u201A','sc':'\u227B','Sc':'\u2ABC','scap':'\u2AB8','scaron':'\u0161','Scaron':'\u0160','sccue':'\u227D','sce':'\u2AB0','scE':'\u2AB4','scedil':'\u015F','Scedil':'\u015E','scirc':'\u015D','Scirc':'\u015C','scnap':'\u2ABA','scnE':'\u2AB6','scnsim':'\u22E9','scpolint':'\u2A13','scsim':'\u227F','scy':'\u0441','Scy':'\u0421','sdot':'\u22C5','sdotb':'\u22A1','sdote':'\u2A66','searhk':'\u2925','searr':'\u2198','seArr':'\u21D8','searrow':'\u2198','sect':'\xA7','semi':';','seswar':'\u2929','setminus':'\u2216','setmn':'\u2216','sext':'\u2736','sfr':'\uD835\uDD30','Sfr':'\uD835\uDD16','sfrown':'\u2322','sharp':'\u266F','shchcy':'\u0449','SHCHcy':'\u0429','shcy':'\u0448','SHcy':'\u0428','ShortDownArrow':'\u2193','ShortLeftArrow':'\u2190','shortmid':'\u2223','shortparallel':'\u2225','ShortRightArrow':'\u2192','ShortUpArrow':'\u2191','shy':'\xAD','sigma':'\u03C3','Sigma':'\u03A3','sigmaf':'\u03C2','sigmav':'\u03C2','sim':'\u223C','simdot':'\u2A6A','sime':'\u2243','simeq':'\u2243','simg':'\u2A9E','simgE':'\u2AA0','siml':'\u2A9D','simlE':'\u2A9F','simne':'\u2246','simplus':'\u2A24','simrarr':'\u2972','slarr':'\u2190','SmallCircle':'\u2218','smallsetminus':'\u2216','smashp':'\u2A33','smeparsl':'\u29E4','smid':'\u2223','smile':'\u2323','smt':'\u2AAA','smte':'\u2AAC','smtes':'\u2AAC\uFE00','softcy':'\u044C','SOFTcy':'\u042C','sol':'/','solb':'\u29C4','solbar':'\u233F','sopf':'\uD835\uDD64','Sopf':'\uD835\uDD4A','spades':'\u2660','spadesuit':'\u2660','spar':'\u2225','sqcap':'\u2293','sqcaps':'\u2293\uFE00','sqcup':'\u2294','sqcups':'\u2294\uFE00','Sqrt':'\u221A','sqsub':'\u228F','sqsube':'\u2291','sqsubset':'\u228F','sqsubseteq':'\u2291','sqsup':'\u2290','sqsupe':'\u2292','sqsupset':'\u2290','sqsupseteq':'\u2292','squ':'\u25A1','square':'\u25A1','Square':'\u25A1','SquareIntersection':'\u2293','SquareSubset':'\u228F','SquareSubsetEqual':'\u2291','SquareSuperset':'\u2290','SquareSupersetEqual':'\u2292','SquareUnion':'\u2294','squarf':'\u25AA','squf':'\u25AA','srarr':'\u2192','sscr':'\uD835\uDCC8','Sscr':'\uD835\uDCAE','ssetmn':'\u2216','ssmile':'\u2323','sstarf':'\u22C6','star':'\u2606','Star':'\u22C6','starf':'\u2605','straightepsilon':'\u03F5','straightphi':'\u03D5','strns':'\xAF','sub':'\u2282','Sub':'\u22D0','subdot':'\u2ABD','sube':'\u2286','subE':'\u2AC5','subedot':'\u2AC3','submult':'\u2AC1','subne':'\u228A','subnE':'\u2ACB','subplus':'\u2ABF','subrarr':'\u2979','subset':'\u2282','Subset':'\u22D0','subseteq':'\u2286','subseteqq':'\u2AC5','SubsetEqual':'\u2286','subsetneq':'\u228A','subsetneqq':'\u2ACB','subsim':'\u2AC7','subsub':'\u2AD5','subsup':'\u2AD3','succ':'\u227B','succapprox':'\u2AB8','succcurlyeq':'\u227D','Succeeds':'\u227B','SucceedsEqual':'\u2AB0','SucceedsSlantEqual':'\u227D','SucceedsTilde':'\u227F','succeq':'\u2AB0','succnapprox':'\u2ABA','succneqq':'\u2AB6','succnsim':'\u22E9','succsim':'\u227F','SuchThat':'\u220B','sum':'\u2211','Sum':'\u2211','sung':'\u266A','sup':'\u2283','Sup':'\u22D1','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','supdot':'\u2ABE','supdsub':'\u2AD8','supe':'\u2287','supE':'\u2AC6','supedot':'\u2AC4','Superset':'\u2283','SupersetEqual':'\u2287','suphsol':'\u27C9','suphsub':'\u2AD7','suplarr':'\u297B','supmult':'\u2AC2','supne':'\u228B','supnE':'\u2ACC','supplus':'\u2AC0','supset':'\u2283','Supset':'\u22D1','supseteq':'\u2287','supseteqq':'\u2AC6','supsetneq':'\u228B','supsetneqq':'\u2ACC','supsim':'\u2AC8','supsub':'\u2AD4','supsup':'\u2AD6','swarhk':'\u2926','swarr':'\u2199','swArr':'\u21D9','swarrow':'\u2199','swnwar':'\u292A','szlig':'\xDF','Tab':'\t','target':'\u2316','tau':'\u03C4','Tau':'\u03A4','tbrk':'\u23B4','tcaron':'\u0165','Tcaron':'\u0164','tcedil':'\u0163','Tcedil':'\u0162','tcy':'\u0442','Tcy':'\u0422','tdot':'\u20DB','telrec':'\u2315','tfr':'\uD835\uDD31','Tfr':'\uD835\uDD17','there4':'\u2234','therefore':'\u2234','Therefore':'\u2234','theta':'\u03B8','Theta':'\u0398','thetasym':'\u03D1','thetav':'\u03D1','thickapprox':'\u2248','thicksim':'\u223C','ThickSpace':'\u205F\u200A','thinsp':'\u2009','ThinSpace':'\u2009','thkap':'\u2248','thksim':'\u223C','thorn':'\xFE','THORN':'\xDE','tilde':'\u02DC','Tilde':'\u223C','TildeEqual':'\u2243','TildeFullEqual':'\u2245','TildeTilde':'\u2248','times':'\xD7','timesb':'\u22A0','timesbar':'\u2A31','timesd':'\u2A30','tint':'\u222D','toea':'\u2928','top':'\u22A4','topbot':'\u2336','topcir':'\u2AF1','topf':'\uD835\uDD65','Topf':'\uD835\uDD4B','topfork':'\u2ADA','tosa':'\u2929','tprime':'\u2034','trade':'\u2122','TRADE':'\u2122','triangle':'\u25B5','triangledown':'\u25BF','triangleleft':'\u25C3','trianglelefteq':'\u22B4','triangleq':'\u225C','triangleright':'\u25B9','trianglerighteq':'\u22B5','tridot':'\u25EC','trie':'\u225C','triminus':'\u2A3A','TripleDot':'\u20DB','triplus':'\u2A39','trisb':'\u29CD','tritime':'\u2A3B','trpezium':'\u23E2','tscr':'\uD835\uDCC9','Tscr':'\uD835\uDCAF','tscy':'\u0446','TScy':'\u0426','tshcy':'\u045B','TSHcy':'\u040B','tstrok':'\u0167','Tstrok':'\u0166','twixt':'\u226C','twoheadleftarrow':'\u219E','twoheadrightarrow':'\u21A0','uacute':'\xFA','Uacute':'\xDA','uarr':'\u2191','uArr':'\u21D1','Uarr':'\u219F','Uarrocir':'\u2949','ubrcy':'\u045E','Ubrcy':'\u040E','ubreve':'\u016D','Ubreve':'\u016C','ucirc':'\xFB','Ucirc':'\xDB','ucy':'\u0443','Ucy':'\u0423','udarr':'\u21C5','udblac':'\u0171','Udblac':'\u0170','udhar':'\u296E','ufisht':'\u297E','ufr':'\uD835\uDD32','Ufr':'\uD835\uDD18','ugrave':'\xF9','Ugrave':'\xD9','uHar':'\u2963','uharl':'\u21BF','uharr':'\u21BE','uhblk':'\u2580','ulcorn':'\u231C','ulcorner':'\u231C','ulcrop':'\u230F','ultri':'\u25F8','umacr':'\u016B','Umacr':'\u016A','uml':'\xA8','UnderBar':'_','UnderBrace':'\u23DF','UnderBracket':'\u23B5','UnderParenthesis':'\u23DD','Union':'\u22C3','UnionPlus':'\u228E','uogon':'\u0173','Uogon':'\u0172','uopf':'\uD835\uDD66','Uopf':'\uD835\uDD4C','uparrow':'\u2191','Uparrow':'\u21D1','UpArrow':'\u2191','UpArrowBar':'\u2912','UpArrowDownArrow':'\u21C5','updownarrow':'\u2195','Updownarrow':'\u21D5','UpDownArrow':'\u2195','UpEquilibrium':'\u296E','upharpoonleft':'\u21BF','upharpoonright':'\u21BE','uplus':'\u228E','UpperLeftArrow':'\u2196','UpperRightArrow':'\u2197','upsi':'\u03C5','Upsi':'\u03D2','upsih':'\u03D2','upsilon':'\u03C5','Upsilon':'\u03A5','UpTee':'\u22A5','UpTeeArrow':'\u21A5','upuparrows':'\u21C8','urcorn':'\u231D','urcorner':'\u231D','urcrop':'\u230E','uring':'\u016F','Uring':'\u016E','urtri':'\u25F9','uscr':'\uD835\uDCCA','Uscr':'\uD835\uDCB0','utdot':'\u22F0','utilde':'\u0169','Utilde':'\u0168','utri':'\u25B5','utrif':'\u25B4','uuarr':'\u21C8','uuml':'\xFC','Uuml':'\xDC','uwangle':'\u29A7','vangrt':'\u299C','varepsilon':'\u03F5','varkappa':'\u03F0','varnothing':'\u2205','varphi':'\u03D5','varpi':'\u03D6','varpropto':'\u221D','varr':'\u2195','vArr':'\u21D5','varrho':'\u03F1','varsigma':'\u03C2','varsubsetneq':'\u228A\uFE00','varsubsetneqq':'\u2ACB\uFE00','varsupsetneq':'\u228B\uFE00','varsupsetneqq':'\u2ACC\uFE00','vartheta':'\u03D1','vartriangleleft':'\u22B2','vartriangleright':'\u22B3','vBar':'\u2AE8','Vbar':'\u2AEB','vBarv':'\u2AE9','vcy':'\u0432','Vcy':'\u0412','vdash':'\u22A2','vDash':'\u22A8','Vdash':'\u22A9','VDash':'\u22AB','Vdashl':'\u2AE6','vee':'\u2228','Vee':'\u22C1','veebar':'\u22BB','veeeq':'\u225A','vellip':'\u22EE','verbar':'|','Verbar':'\u2016','vert':'|','Vert':'\u2016','VerticalBar':'\u2223','VerticalLine':'|','VerticalSeparator':'\u2758','VerticalTilde':'\u2240','VeryThinSpace':'\u200A','vfr':'\uD835\uDD33','Vfr':'\uD835\uDD19','vltri':'\u22B2','vnsub':'\u2282\u20D2','vnsup':'\u2283\u20D2','vopf':'\uD835\uDD67','Vopf':'\uD835\uDD4D','vprop':'\u221D','vrtri':'\u22B3','vscr':'\uD835\uDCCB','Vscr':'\uD835\uDCB1','vsubne':'\u228A\uFE00','vsubnE':'\u2ACB\uFE00','vsupne':'\u228B\uFE00','vsupnE':'\u2ACC\uFE00','Vvdash':'\u22AA','vzigzag':'\u299A','wcirc':'\u0175','Wcirc':'\u0174','wedbar':'\u2A5F','wedge':'\u2227','Wedge':'\u22C0','wedgeq':'\u2259','weierp':'\u2118','wfr':'\uD835\uDD34','Wfr':'\uD835\uDD1A','wopf':'\uD835\uDD68','Wopf':'\uD835\uDD4E','wp':'\u2118','wr':'\u2240','wreath':'\u2240','wscr':'\uD835\uDCCC','Wscr':'\uD835\uDCB2','xcap':'\u22C2','xcirc':'\u25EF','xcup':'\u22C3','xdtri':'\u25BD','xfr':'\uD835\uDD35','Xfr':'\uD835\uDD1B','xharr':'\u27F7','xhArr':'\u27FA','xi':'\u03BE','Xi':'\u039E','xlarr':'\u27F5','xlArr':'\u27F8','xmap':'\u27FC','xnis':'\u22FB','xodot':'\u2A00','xopf':'\uD835\uDD69','Xopf':'\uD835\uDD4F','xoplus':'\u2A01','xotime':'\u2A02','xrarr':'\u27F6','xrArr':'\u27F9','xscr':'\uD835\uDCCD','Xscr':'\uD835\uDCB3','xsqcup':'\u2A06','xuplus':'\u2A04','xutri':'\u25B3','xvee':'\u22C1','xwedge':'\u22C0','yacute':'\xFD','Yacute':'\xDD','yacy':'\u044F','YAcy':'\u042F','ycirc':'\u0177','Ycirc':'\u0176','ycy':'\u044B','Ycy':'\u042B','yen':'\xA5','yfr':'\uD835\uDD36','Yfr':'\uD835\uDD1C','yicy':'\u0457','YIcy':'\u0407','yopf':'\uD835\uDD6A','Yopf':'\uD835\uDD50','yscr':'\uD835\uDCCE','Yscr':'\uD835\uDCB4','yucy':'\u044E','YUcy':'\u042E','yuml':'\xFF','Yuml':'\u0178','zacute':'\u017A','Zacute':'\u0179','zcaron':'\u017E','Zcaron':'\u017D','zcy':'\u0437','Zcy':'\u0417','zdot':'\u017C','Zdot':'\u017B','zeetrf':'\u2128','ZeroWidthSpace':'\u200B','zeta':'\u03B6','Zeta':'\u0396','zfr':'\uD835\uDD37','Zfr':'\u2128','zhcy':'\u0436','ZHcy':'\u0416','zigrarr':'\u21DD','zopf':'\uD835\uDD6B','Zopf':'\u2124','zscr':'\uD835\uDCCF','Zscr':'\uD835\uDCB5','zwj':'\u200D','zwnj':'\u200C'};
	var decodeMapLegacy = {'aacute':'\xE1','Aacute':'\xC1','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','aelig':'\xE6','AElig':'\xC6','agrave':'\xE0','Agrave':'\xC0','amp':'&','AMP':'&','aring':'\xE5','Aring':'\xC5','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','brvbar':'\xA6','ccedil':'\xE7','Ccedil':'\xC7','cedil':'\xB8','cent':'\xA2','copy':'\xA9','COPY':'\xA9','curren':'\xA4','deg':'\xB0','divide':'\xF7','eacute':'\xE9','Eacute':'\xC9','ecirc':'\xEA','Ecirc':'\xCA','egrave':'\xE8','Egrave':'\xC8','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','frac12':'\xBD','frac14':'\xBC','frac34':'\xBE','gt':'>','GT':'>','iacute':'\xED','Iacute':'\xCD','icirc':'\xEE','Icirc':'\xCE','iexcl':'\xA1','igrave':'\xEC','Igrave':'\xCC','iquest':'\xBF','iuml':'\xEF','Iuml':'\xCF','laquo':'\xAB','lt':'<','LT':'<','macr':'\xAF','micro':'\xB5','middot':'\xB7','nbsp':'\xA0','not':'\xAC','ntilde':'\xF1','Ntilde':'\xD1','oacute':'\xF3','Oacute':'\xD3','ocirc':'\xF4','Ocirc':'\xD4','ograve':'\xF2','Ograve':'\xD2','ordf':'\xAA','ordm':'\xBA','oslash':'\xF8','Oslash':'\xD8','otilde':'\xF5','Otilde':'\xD5','ouml':'\xF6','Ouml':'\xD6','para':'\xB6','plusmn':'\xB1','pound':'\xA3','quot':'"','QUOT':'"','raquo':'\xBB','reg':'\xAE','REG':'\xAE','sect':'\xA7','shy':'\xAD','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','szlig':'\xDF','thorn':'\xFE','THORN':'\xDE','times':'\xD7','uacute':'\xFA','Uacute':'\xDA','ucirc':'\xFB','Ucirc':'\xDB','ugrave':'\xF9','Ugrave':'\xD9','uml':'\xA8','uuml':'\xFC','Uuml':'\xDC','yacute':'\xFD','Yacute':'\xDD','yen':'\xA5','yuml':'\xFF'};
	var decodeMapNumeric = {'0':'\uFFFD','128':'\u20AC','130':'\u201A','131':'\u0192','132':'\u201E','133':'\u2026','134':'\u2020','135':'\u2021','136':'\u02C6','137':'\u2030','138':'\u0160','139':'\u2039','140':'\u0152','142':'\u017D','145':'\u2018','146':'\u2019','147':'\u201C','148':'\u201D','149':'\u2022','150':'\u2013','151':'\u2014','152':'\u02DC','153':'\u2122','154':'\u0161','155':'\u203A','156':'\u0153','158':'\u017E','159':'\u0178'};
	var invalidReferenceCodePoints = [1,2,3,4,5,6,7,8,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,64976,64977,64978,64979,64980,64981,64982,64983,64984,64985,64986,64987,64988,64989,64990,64991,64992,64993,64994,64995,64996,64997,64998,64999,65000,65001,65002,65003,65004,65005,65006,65007,65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111];

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	var object = {};
	var hasOwnProperty = object.hasOwnProperty;
	var has = function(object, propertyName) {
		return hasOwnProperty.call(object, propertyName);
	};

	var contains = function(array, value) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			if (array[index] == value) {
				return true;
			}
		}
		return false;
	};

	var merge = function(options, defaults) {
		if (!options) {
			return defaults;
		}
		var result = {};
		var key;
		for (key in defaults) {
			// A `hasOwnProperty` check is not needed here, since only recognized
			// option names are used anyway. Any others are ignored.
			result[key] = has(options, key) ? options[key] : defaults[key];
		}
		return result;
	};

	// Modified version of `ucs2encode`; see https://mths.be/punycode.
	var codePointToSymbol = function(codePoint, strict) {
		var output = '';
		if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
			// See issue #4:
			// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
			// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
			// REPLACEMENT CHARACTER.”
			if (strict) {
				parseError('character reference outside the permissible Unicode range');
			}
			return '\uFFFD';
		}
		if (has(decodeMapNumeric, codePoint)) {
			if (strict) {
				parseError('disallowed character reference');
			}
			return decodeMapNumeric[codePoint];
		}
		if (strict && contains(invalidReferenceCodePoints, codePoint)) {
			parseError('disallowed character reference');
		}
		if (codePoint > 0xFFFF) {
			codePoint -= 0x10000;
			output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
			codePoint = 0xDC00 | codePoint & 0x3FF;
		}
		output += stringFromCharCode(codePoint);
		return output;
	};

	var hexEscape = function(codePoint) {
		return '&#x' + codePoint.toString(16).toUpperCase() + ';';
	};

	var decEscape = function(codePoint) {
		return '&#' + codePoint + ';';
	};

	var parseError = function(message) {
		throw Error('Parse error: ' + message);
	};

	/*--------------------------------------------------------------------------*/

	var encode = function(string, options) {
		options = merge(options, encode.options);
		var strict = options.strict;
		if (strict && regexInvalidRawCodePoint.test(string)) {
			parseError('forbidden code point');
		}
		var encodeEverything = options.encodeEverything;
		var useNamedReferences = options.useNamedReferences;
		var allowUnsafeSymbols = options.allowUnsafeSymbols;
		var escapeCodePoint = options.decimal ? decEscape : hexEscape;

		var escapeBmpSymbol = function(symbol) {
			return escapeCodePoint(symbol.charCodeAt(0));
		};

		if (encodeEverything) {
			// Encode ASCII symbols.
			string = string.replace(regexAsciiWhitelist, function(symbol) {
				// Use named references if requested & possible.
				if (useNamedReferences && has(encodeMap, symbol)) {
					return '&' + encodeMap[symbol] + ';';
				}
				return escapeBmpSymbol(symbol);
			});
			// Shorten a few escapes that represent two symbols, of which at least one
			// is within the ASCII range.
			if (useNamedReferences) {
				string = string
					.replace(/&gt;\u20D2/g, '&nvgt;')
					.replace(/&lt;\u20D2/g, '&nvlt;')
					.replace(/&#x66;&#x6A;/g, '&fjlig;');
			}
			// Encode non-ASCII symbols.
			if (useNamedReferences) {
				// Encode non-ASCII symbols that can be replaced with a named reference.
				string = string.replace(regexEncodeNonAscii, function(string) {
					// Note: there is no need to check `has(encodeMap, string)` here.
					return '&' + encodeMap[string] + ';';
				});
			}
			// Note: any remaining non-ASCII symbols are handled outside of the `if`.
		} else if (useNamedReferences) {
			// Apply named character references.
			// Encode `<>"'&` using named character references.
			if (!allowUnsafeSymbols) {
				string = string.replace(regexEscape, function(string) {
					return '&' + encodeMap[string] + ';'; // no need to check `has()` here
				});
			}
			// Shorten escapes that represent two symbols, of which at least one is
			// `<>"'&`.
			string = string
				.replace(/&gt;\u20D2/g, '&nvgt;')
				.replace(/&lt;\u20D2/g, '&nvlt;');
			// Encode non-ASCII symbols that can be replaced with a named reference.
			string = string.replace(regexEncodeNonAscii, function(string) {
				// Note: there is no need to check `has(encodeMap, string)` here.
				return '&' + encodeMap[string] + ';';
			});
		} else if (!allowUnsafeSymbols) {
			// Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
			// using named character references.
			string = string.replace(regexEscape, escapeBmpSymbol);
		}
		return string
			// Encode astral symbols.
			.replace(regexAstralSymbols, function($0) {
				// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
				var high = $0.charCodeAt(0);
				var low = $0.charCodeAt(1);
				var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
				return escapeCodePoint(codePoint);
			})
			// Encode any remaining BMP symbols that are not printable ASCII symbols
			// using a hexadecimal escape.
			.replace(regexBmpWhitelist, escapeBmpSymbol);
	};
	// Expose default options (so they can be overridden globally).
	encode.options = {
		'allowUnsafeSymbols': false,
		'encodeEverything': false,
		'strict': false,
		'useNamedReferences': false,
		'decimal' : false
	};

	var decode = function(html, options) {
		options = merge(options, decode.options);
		var strict = options.strict;
		if (strict && regexInvalidEntity.test(html)) {
			parseError('malformed character reference');
		}
		return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7) {
			var codePoint;
			var semicolon;
			var decDigits;
			var hexDigits;
			var reference;
			var next;
			if ($1) {
				// Decode decimal escapes, e.g. `&#119558;`.
				decDigits = $1;
				semicolon = $2;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(decDigits, 10);
				return codePointToSymbol(codePoint, strict);
			}
			if ($3) {
				// Decode hexadecimal escapes, e.g. `&#x1D306;`.
				hexDigits = $3;
				semicolon = $4;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(hexDigits, 16);
				return codePointToSymbol(codePoint, strict);
			}
			if ($5) {
				// Decode named character references with trailing `;`, e.g. `&copy;`.
				reference = $5;
				if (has(decodeMap, reference)) {
					return decodeMap[reference];
				} else {
					// Ambiguous ampersand. https://mths.be/notes/ambiguous-ampersands
					if (strict) {
						parseError(
							'named character reference was not terminated by a semicolon'
						);
					}
					return $0;
				}
			}
			// If we’re still here, it’s a legacy reference for sure. No need for an
			// extra `if` check.
			// Decode named character references without trailing `;`, e.g. `&amp`
			// This is only a parse error if it gets converted to `&`, or if it is
			// followed by `=` in an attribute context.
			reference = $6;
			next = $7;
			if (next && options.isAttributeValue) {
				if (strict && next == '=') {
					parseError('`&` did not start a character reference');
				}
				return $0;
			} else {
				if (strict) {
					parseError(
						'named character reference was not terminated by a semicolon'
					);
				}
				// Note: there is no need to check `has(decodeMapLegacy, reference)`.
				return decodeMapLegacy[reference] + (next || '');
			}
		});
	};
	// Expose default options (so they can be overridden globally).
	decode.options = {
		'isAttributeValue': false,
		'strict': false
	};

	var escape = function(string) {
		return string.replace(regexEscape, function($0) {
			// Note: there is no need to check `has(escapeMap, $0)` here.
			return escapeMap[$0];
		});
	};

	/*--------------------------------------------------------------------------*/

	var he = {
		'version': '1.1.0',
		'encode': encode,
		'decode': decode,
		'escape': escape,
		'unescape': decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return he;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = he;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in he) {
				has(he, key) && (freeExports[key] = he[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.he = he;
	}

}(this));
/**
 * Script adapted from https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * MIT license
 */
function fileDownload(data, filename, mime) {
    var blob = data instanceof Blob ? data : new Blob([data], {type: mime || 'application/octet-stream'});
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were 
        // revoked by closing the blob for which they were created. 
        // These URLs will no longer resolve as the data backing 
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var blobURL = window.URL.createObjectURL(blob);
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename); 
        
        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking 
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    }
}/**
 * Applies a mask for hex color codes on the given field
 */
function applyHexColorMask(field) {
	var maskFields = [
	                  fieldBuilder.literal("#"),
	                  fieldBuilder.input("0123456789aAbBcCdDeEfF", 6, 6, true)
	                  ];
	return new InputMask(maskFields, field);
}

/**
 * Gets the current position of the user
 */
function locate(onSuccess, onFailure) {
	if (navigator.geolocation) {
		navigator.geolocation
				.getCurrentPosition(
						function(position) {
							onSuccess(position);							
						},
						function(error) {
							onFailure(error);
						});
	} else {
		onFailure(null);
	}
}

var problemsLoadingInterval;
function startLoading() {
	document.getElementById('rootSpinner').style.display = '';
	if (!problemsLoadingInterval) {
    	problemsLoadingInterval = setTimeout(function() {
    		setProblemsLoadingVisible(true);
    	}, 15000);
	}
}
function stopLoading() {
    document.getElementById('rootSpinner').style.display = 'none';
	setProblemsLoadingVisible(false);
}

/**
 * Shows / hides the problems loading message
 */
function setProblemsLoadingVisible(visible) {
	document.getElementById('problemsLoading').style.display = visible ? '' : 'none';
	if (!visible) {
		clearInterval(problemsLoadingInterval);
		problemsLoadingInterval = null;
	}
}
