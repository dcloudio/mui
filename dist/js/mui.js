/*!
 * =====================================================
 * Mui v0.5.8 (https://github.com/dcloudio/mui)
 * =====================================================
 */
/**
 * MUI核心JS
 * @type _L4.$|Function
 */
var mui = (function(document, undefined) {
	var readyRE = /complete|loaded|interactive/;
	var idSelectorRE = /^#([\w-]*)$/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var tagSelectorRE = /^[\w-]+$/;
	var translateRE = /translate(?:3d)?\((.+?)\)/;
	var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

	var $ = function(selector, context) {
		context = context || document;
		if (!selector)
			return wrap();
		if (typeof selector === 'object')
			return wrap([selector], null);
		if (typeof selector === 'function')
			return $.ready(selector);
		try {
			if (idSelectorRE.test(selector)) {
				var found = document.getElementById(RegExp.$1);
				return wrap(found ? [found] : []);
			}
			return wrap($.qsa(selector, context), selector);
		} catch (e) {

		}
		return wrap();
	};

	var wrap = function(dom, selector) {
		dom = dom || [];
		Object.setPrototypeOf(dom, $.fn);
		dom.selector = selector || '';
		return dom;
	};

	$.uuid = 0;

	$.data = {};
	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	$.extend = function(target, source, deep) {
		if (!target) {
			target = {};
		}
		if (!source) {
			source = {};
		}
		for (var key in source)
			if (source[key] !== undefined) {
				if (deep && typeof target[key] === 'object') {
					$.extend(target[key], source[key], deep);
				} else {
					target[key] = source[key];
				}
			}

		return target;
	};
	/**
	 * mui slice(array)
	 */
	$.slice = [].slice;
	/**
	 * mui querySelectorAll
	 * @param {type} selector
	 * @param {type} context
	 * @returns {Array}
	 */
	$.qsa = function(selector, context) {
		context = context || document;
		return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	};
	/**
	 * ready(DOMContentLoaded)
	 * @param {type} callback
	 * @returns {_L6.$}
	 */
	$.ready = function(callback) {
		if (readyRE.test(document.readyState)) {
			callback($);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				callback($);
			}, false);
		}
		return this;
	};
	/**
	 * each
	 * @param {type} array
	 * @param {type} callback
	 * @returns {_L8.$}
	 */
	$.each = function(array, callback) {
		[].every.call(array, function(el, idx) {
			return callback.call(el, idx, el) !== false;
		});
		return this;
	};
	/**
	 * trigger event
	 * @param {type} element
	 * @param {type} eventType
	 * @param {type} eventData
	 * @returns {_L8.$}
	 */
	$.trigger = function(element, eventType, eventData) {
		element.dispatchEvent(new CustomEvent(eventType, {
			detail: eventData,
			bubbles: true,
			cancelable: true
		}));
		return this;
	};
	/**
	 * getStyles
	 * @param {type} element
	 * @param {type} property
	 * @returns {styles}
	 */
	$.getStyles = function(element, property) {
		var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
		if (property) {
			return styles.getPropertyValue(property) || styles[property];
		}
		return styles;
	};
	/**
	 * parseTranslate
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslate = function(translateString, position) {
		var result = translateString.match(translateRE || '');
		if (!result || !result[1]) {
			result = ['', '0,0,0'];
		}
		result = result[1].split(",");
		result = {
			x: parseFloat(result[0]),
			y: parseFloat(result[1]),
			z: parseFloat(result[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	/**
	 * parseTranslateMatrix
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslateMatrix = function(translateString, position) {
		var matrix = translateString.match(translateMatrixRE);
		var is3D = matrix && matrix[1];
		if (matrix) {
			matrix = matrix[2].split(",");
			if (is3D === "3d")
				matrix = matrix.slice(12, 15);
			else {
				matrix.push(0);
				matrix = matrix.slice(4, 7);
			}
		} else {
			matrix = [0, 0, 0];
		}
		var result = {
			x: parseFloat(matrix[0]),
			y: parseFloat(matrix[1]),
			z: parseFloat(matrix[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	/**
	 * $.fn
	 */
	$.fn = {
		each: function(callback) {
			[].every.call(this, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};
	return $;
})(document);
//window.mui = mui;
//'$' in window || (window.$ = mui);
/**
 * mui target(action>popover>modal>tab>toggle)
 */
(function($, window, document) {
	/**
	 * targets
	 */
	$.targets = {};
	/**
	 * target handles
	 */
	$.targetHandles = [];
	/**
	 * register target
	 * @param {type} target
	 * @returns {$.targets}
	 */
	$.registerTarget = function(target) {

		target.index = target.index || 1000;

		$.targetHandles.push(target);

		$.targetHandles.sort(function(a, b) {
			return a.index - b.index;
		});

		return $.targetHandles;
	};
	window.addEventListener('touchstart', function(event) {
		var target = event.target;
		var founds = {};
		for (; target && target !== document; target = target.parentNode) {
			var isFound = false;
			$.each($.targetHandles, function(index, targetHandle) {
				var name = targetHandle.name;
				if (!isFound && !founds[name] && targetHandle.hasOwnProperty('handle')) {
					$.targets[name] = targetHandle.handle(event, target);
					if ($.targets[name]) {
						founds[name] = true;
						if (targetHandle.isContinue !== true) {
							isFound = true;
						}
					}
				} else {
					if (!founds[name]) {
						if (targetHandle.isReset !== false)
							$.targets[name] = false;
					}
				}
			});
			if (isFound) {
				break;
			}
		}

	});
})(mui, window, document);

/**
 * fixed trim
 * @param {type} undefined
 * @returns {undefined}
 */
(function(undefined) {
	if (String.prototype.trim === undefined) { // fix for iOS 3.2
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
		obj['__proto__'] = proto;
		return obj;
	}

})();
/**
 * fixed CustomEvent
 */
(function() {
	if (typeof window.CustomEvent === 'undefined') {
		function CustomEvent(event, params) {
			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};
			var evt = document.createEvent('Events');
			var bubbles = true;
			if (params) {
				for (var name in params) {
					(name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
				}
			}
			evt.initEvent(event, bubbles, true);
			return evt;
		};
		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	}
})();
/**
 * mui fixed classList
 * @param {type} document
 * @returns {undefined}
 */
(function(document) {
    if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {

        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/),
                                index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    };
                }

                var ret = {
                    add: update(function(classes, index, value) {
                        ~index || classes.push(value);
                    }),
                    remove: update(function(classes, index) {
                        ~index && classes.splice(index, 1);
                    }),
                    toggle: update(function(classes, index, value) {
                        ~index ? classes.splice(index, 1) : classes.push(value);
                    }),
                    contains: function(value) {
                        return !!~self.className.split(/\s+/).indexOf(value);
                    },
                    item: function(i) {
                        return self.className.split(/\s+/)[i] || null;
                    }
                };

                Object.defineProperty(ret, 'length', {
                    get: function() {
                        return self.className.split(/\s+/).length;
                    }
                });

                return ret;
            }
        });
    }
})(document);

/**
 * mui fixed requestAnimationFrame
 * @param {type} window
 * @returns {undefined}
 */
(function(window) {
    var lastTime = 0;
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}(window));
/**
 * fastclick(only for radio,checkbox)
 */
(function($, window, name) {
	if (window.FastClick) {
		return;
	}

	var handle = function(event, target) {
		if (target.type && (target.type === 'radio' || target.type === 'checkbox')) {
			return target;
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 40,
		handle: handle,
		target: false
	});
	var dispatchEvent = function(event) {
		var targetElement = $.targets.click;
		if (targetElement) {
			var clickEvent, touch;
			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect
			if (document.activeElement && document.activeElement !== targetElement) {
				document.activeElement.blur();
			}
			touch = event.detail.gesture.changedTouches[0];
			// Synthesise a click event, with an extra attribute so it can be tracked
			clickEvent = document.createEvent('MouseEvents');
			clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			clickEvent.forwardedTouchEvent = true;
			targetElement.dispatchEvent(clickEvent);
		}
	}
	window.addEventListener('tap', dispatchEvent);
	window.addEventListener('doubletap', dispatchEvent);
	//捕获
	window.addEventListener('click', function(event) {
		if ($.targets.click) {
			if (!event.forwardedTouchEvent) { //stop click
				if (event.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				} else {
					// Part of the hack for browsers that don't support Event#stopImmediatePropagation
					event.propagationStopped = true;
				}
				event.stopPropagation();
				event.preventDefault();
				return false;
			}
		}
	}, true);

})(mui, window, 'click');
(function($, document) {
	$(function() {
		if (!$.os.ios) {
			return;
		}
		var CLASS_FOCUSIN = 'mui-focusin';
		var CLASS_CONTENT = 'mui-content';
		var content;
		document.addEventListener('focusin', function(e) {
			content = null;
			var target = e.target;
			for (; target && target !== document; target = target.parentNode) {
				if (target.classList && target.classList.contains(CLASS_CONTENT)) {
					content = target;
					break;
				}
			}
			if (content) {
				document.body.classList.add(CLASS_FOCUSIN);
			}

		});
		document.addEventListener('focusout', function(e) {
			if (content) {
				document.body.classList.remove(CLASS_FOCUSIN);
			}
		});
	});
})(mui, document);
/**
 * mui namespace(optimization)
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.namespace = 'mui';
	$.classNamePrefix = $.namespace + '-';
	$.classSelectorPrefix = '.' + $.classNamePrefix;
	/**
	 * 返回正确的className
	 * @param {type} className
	 * @returns {String}
	 */
	$.className = function(className) {
		return $.classNamePrefix + className;
	};
	/**
	 * 返回正确的classSelector
	 * @param {type} classSelector
	 * @returns {String}
	 */
	$.classSelector = function(classSelector) {
		return classSelector.replace(/\./g, $.classSelectorPrefix);
	};
	/**
         * 返回正确的eventName
         * @param {type} event
         * @param {type} module
         * @returns {String}
         */
	$.eventName = function(event, module) {
		return event + ($.namespace ? ('.' + $.namespace) : '') + ( module ? ('.' + module) : '');
	};
})(mui);

/**
 * mui gestures
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	$.EVENT_START = 'touchstart';
	$.EVENT_MOVE = 'touchmove';
	$.EVENT_END = 'touchend';
	$.EVENT_CANCEL = 'touchcancel';
	$.EVENT_CLICK = 'click';
	/**
	 * Gesture preventDefault
	 * @param {type} e
	 * @returns {undefined}
	 */
	$.preventDefault = function(e) {
		e.preventDefault();
	};
	/**
	 * Gesture stopPropagation
	 * @param {type} e
	 * @returns {undefined}
	 */
	$.stopPropagation = function(e) {
		e.stopPropagation();
	};
	/**
	 * Gesture functions
	 */
	$.gestures = [];

	/**
	 * register gesture
	 * @param {type} gesture
	 * @returns {$.gestures}
	 */
	$.registerGesture = function(gesture) {

		gesture.index = gesture.index || 1000;

		$.gestures.push(gesture);

		$.gestures.sort(function(a, b) {
			return a.index - b.index;
		});
		return $.gestures;
	};
	/**
	 * distance
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getDistance = function(p1, p2) {
		var x = p2.x - p1.x;
		var y = p2.y - p1.y;
		return Math.sqrt((x * x) + (y * y));
	};
	/**
	 * angle
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getAngle = function(p1, p2) {
		return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
	};
	/**
	 * direction
	 * @param {type} angle
	 * @returns {unresolved}
	 */
	var getDirectionByAngle = function(angle) {
		if (angle < -45 && angle > -135) {
			return 'up';
		} else if (angle >= 45 && angle < 135) {
			return 'down';
		} else if (angle >= 135 || angle <= -135) {
			return 'left';
		} else if (angle >= -45 && angle <= 45) {
			return 'right';
		}
		return null;
	};
	/**
	 * detect gestures
	 * @param {type} event
	 * @param {type} touch
	 * @returns {undefined}
	 */
	var detect = function(event, touch) {
		if ($.gestures.stoped) {
			return;
		}
		$.each($.gestures, function(index, gesture) {
			if (!$.gestures.stoped) {
				if ($.options.gestureConfig[gesture.name] !== false) {
					if (gesture.hasOwnProperty('handle')) {
						gesture.handle(event, touch);
					}
				}
			}
		});
	};
	var touch = {};
	var detectTouchStart = function(event) {
		$.gestures.stoped = false;
		var now = Date.now();
		var point = event.touches ? event.touches[0] : event;
		touch = {
			target: event.target,
			lastTarget: (touch.lastTarget ? touch.lastTarget : null),
			startTime: now,
			touchTime: 0,
			flickStartTime: now,
			lastTapTime: (touch.lastTapTime ? touch.lastTapTime : 0),
			start: {
				x: point.pageX,
				y: point.pageY
			},
			flickStart: {
				x: point.pageX,
				y: point.pageY
			},
			flickDistanceX: 0,
			flickDistanceY: 0,
			move: {
				x: 0,
				y: 0
			},
			deltaX: 0,
			deltaY: 0,
			lastDeltaX: 0,
			lastDeltaY: 0,
			angle: '',
			direction: '',
			distance: 0,
			drag: false,
			swipe: false,
			gesture: event
		};

		detect(event, touch);
	};
	var detectTouchMove = function(event) {
		if ($.gestures.stoped) {
			return;
		}
		var now = Date.now();
		var point = event.touches ? event.touches[0] : event;
		touch.touchTime = now - touch.startTime;
		touch.move = {
			x: point.pageX,
			y: point.pageY
		};
		if (now - touch.flickStartTime > 300) {
			touch.flickStartTime = now;
			touch.flickStart = touch.move;
		}
		touch.distance = getDistance(touch.start, touch.move);
		touch.angle = getAngle(touch.start, touch.move);
		touch.direction = getDirectionByAngle(touch.angle);
		touch.lastDeltaX = touch.deltaX;
		touch.lastDeltaY = touch.deltaY;
		touch.deltaX = touch.move.x - touch.start.x;
		touch.deltaY = touch.move.y - touch.start.y;
		touch.gesture = event;

		detect(event, touch);
	};
	var detectTouchEnd = function(event) {
		if ($.gestures.stoped) {
			return;
		}
		var now = Date.now();
		touch.touchTime = now - touch.startTime;
		touch.flickTime = now - touch.flickStartTime;
		touch.flickDistanceX = touch.move.x - touch.flickStart.x;
		touch.flickDistanceY = touch.move.y - touch.flickStart.y;
		touch.gesture = event;

		detect(event, touch);
	};

	window.addEventListener($.EVENT_START, detectTouchStart);
	window.addEventListener($.EVENT_MOVE, detectTouchMove);
	window.addEventListener($.EVENT_END, detectTouchEnd);
	window.addEventListener($.EVENT_CANCEL, detectTouchEnd);
	//fixed hashchange(android)
	window.addEventListener($.EVENT_CLICK, function(e) {
		if ($.targets.popover || $.targets.tab || $.targets.offcanvas || $.targets.modal) {
			e.preventDefault();
		}
	});

	/**
	 * mui delegate events
	 * @param {type} event
	 * @param {type} selector
	 * @param {type} callback
	 * @returns {undefined}
	 */
	$.fn.on = function(event, selector, callback) {
		this.each(function() {
			var element = this;
			element.addEventListener(event, function(e) {
				var delegates = $.qsa(selector, element);
				var target = e.target;
				if (delegates && delegates.length > 0) {
					for (; target && target !== document; target = target.parentNode) {
						if (target === element) {
							break;
						}
						if (target && ~delegates.indexOf(target)) {
							if (!e.detail) {
								e.detail = {
									currentTarget: target
								};
							} else {
								e.detail.currentTarget = target;
							}
							callback.call(target, e);
						}
					}
				}
			});
			////避免多次on的时候重复绑定
			element.removeEventListener($.EVENT_CLICK, preventDefault);
			//click event preventDefault
			element.addEventListener($.EVENT_CLICK, preventDefault);
		});
	};
	var preventDefault = function(e) {
		if (e.target && e.target.tagName !== 'INPUT') {
			e.preventDefault();
		}
	};
})(mui, window);
/**
 * mui gesture flick[left|right|up|down]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var handle = function(event, touch) {
		if (event.type === $.EVENT_END || event.type === $.EVENT_CANCEL) {
			var options = this.options;
			if (touch.direction && options.flickMaxTime > touch.flickTime && touch.distance > options.flickMinDistince) {
				touch.flick = true;
				$.trigger(event.target, name, touch);
				$.trigger(event.target, name + touch.direction, touch);
			}
		}
	};
	/**
	 * mui gesture flick
	 */
	$.registerGesture({
		name: name,
		index: 5,
		handle: handle,
		options: {
			flickMaxTime: 300,
			flickMinDistince: 10
		}
	});
})(mui, 'flick');
/**
 * mui gesture swipe[left|right|up|down]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var handle = function(event, touch) {
		if (event.type === $.EVENT_END || event.type === $.EVENT_CANCEL) {
			var options = this.options;
			if (touch.direction && options.swipeMaxTime > touch.touchTime && touch.distance > options.swipeMinDistince) {
				touch.swipe = true;
				$.trigger(event.target, name + touch.direction, touch);
			}
		}
	};
	/**
	 * mui gesture swipe
	 */
	$.registerGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			swipeMaxTime: 300,
			swipeMinDistince: 18
		}
	});
})(mui, 'swipe');
/**
 * mui gesture drag[start|left|right|up|down|end]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {

    var handle = function(event, touch) {
        switch (event.type) {
            case $.EVENT_MOVE:
                if (touch.direction) {//drag
                    if (!touch.drag) {
                        touch.drag = true;
                        $.trigger(event.target, name + 'start', touch);
                    }
                    $.trigger(event.target, name, touch);
                    $.trigger(event.target, name + touch.direction, touch);
                }
                break;
            case $.EVENT_END:
            case $.EVENT_CANCEL:
                if (touch.drag) {
                    $.trigger(event.target, name + 'end', touch);
                }
                break;
        }
    };
    /**
     * mui gesture drag
     */
    $.registerGesture({
        name: name,
        index: 20,
        handle: handle,
        options: {
        }
    });
})(mui, 'drag');
/**
 * mui gesture tap and doubleTap
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var handle = function(event, touch) {
		//if (event.type === $.EVENT_END || event.type === $.EVENT_CANCEL) {
		if (event.type === $.EVENT_END) { //ignore touchcancel
			var options = this.options;
			if (touch.distance < options.tapMaxDistance && touch.touchTime < options.tapMaxTime) {
				if ($.options.gestureConfig.doubletap && touch.lastTarget && (touch.lastTarget === event.target)) { //same target
					if (touch.lastTapTime && (touch.startTime - touch.lastTapTime) < options.tapMaxInterval) {
						$.trigger(event.target, 'doubletap', touch);
						touch.lastTapTime = Date.now();
						touch.lastTarget = event.target;
						return;
					}
				}
				$.trigger(event.target, name, touch);
				touch.lastTapTime = Date.now();
				touch.lastTarget = event.target;
			}
		}
	};
	/**
	 * mui gesture tap
	 */
	$.registerGesture({
		name: name,
		index: 30,
		handle: handle,
		options: {
			tapMaxInterval: 300,
			tapMaxDistance: 5,
			tapMaxTime: 250
		}
	});
})(mui, 'tap');
/**
 * mui gesture longtap
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var timer;
	var handle = function(event, touch) {
		var options = this.options;
		switch (event.type) {
			case $.EVENT_START:
				clearTimeout(timer);
				timer = setTimeout(function() {
					if (!touch.drag) {
						$.trigger(event.target, name, touch);
					}
				}, options.holdTimeout);
				break;
			case $.EVENT_MOVE:
				if (touch.distance > options.holdThreshold) {
					clearTimeout(timer);
				}
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				clearTimeout(timer);
				break;
		}
	};
	/**
	 * mui gesture drag
	 */
	$.registerGesture({
		name : name,
		index : 10,
		handle : handle,
		options : {
			holdTimeout : 500,
			holdThreshold : 2
		}
	});
})(mui, 'longtap'); 
/**
 * $.os
 * @param {type} $
 * @returns {undefined}
 */
(function($, window) {
	function detect(ua) {
		this.os = {};
		var funcs = [

			function() { //android
				var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
				if (android) {
					this.os.android = true;
					this.os.version = android[2];

					this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
				}
				return this.os.android === true;
			},
			function() { //ios
				var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
				if (iphone) { //iphone
					this.os.ios = this.os.iphone = true;
					this.os.version = iphone[2].replace(/_/g, '.');
				} else {
					var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
					if (ipad) { //ipad
						this.os.ios = this.os.ipad = true;
						this.os.version = ipad[2].replace(/_/g, '.');
					}
				}
				return this.os.ios === true;
			}
		];
		[].every.call(funcs, function(func) {
			return !func.call($);
		});
	}
	detect.call($, navigator.userAgent);
})(mui, window);
/**
 * $.os.plus
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    function detect(ua) {
        this.os = this.os || {};
        var plus = ua.match(/Html5Plus/i);//TODO 5\+Browser?
        if (plus) {
            this.os.plus = true;
        }
    }
    detect.call($, navigator.userAgent);
})(mui);

/**
 * mui.init
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	var funcs = [];
	$.global = $.options = {
		gestureConfig: {
			tap: true,
			doubletap: false,
			longtap: false,
			flick: true,
			swipe: true,
			drag: true
		}
	};
	/**
	 *
	 * @param {type} options
	 * @returns {undefined}
	 */
	$.initGlobal = function(options) {
		$.options = $.extend($.global, options, true);
		return this;
	};
	/**
	 * 单页配置 初始化
	 * @param {object} options
	 */
	$.init = function(options) {
		$.options = $.extend($.global, options || {}, true);
		//需考虑重复init的问题
		$.ready(function() {
			for (var i = 0, len = funcs.length; i < len; i++) {
				funcs[i].call($);
			}
		});
		return this;
	};
	/**
	 * 增加初始化执行流程
	 * @param {function} func
	 */
	$.init.add = function(func) {
		funcs.push(func);
	};
	$(function() {
		if ($.os.ios) {
			document.body.classList.add('mui-ios');
		} else if ($.os.android) {
			document.body.classList.add('mui-android');
		}
	});
})(mui);
/**
 * mui.init 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	var defaultOptions = {
		optimize: true,
		swipeBack: false,
		preloadPages: [], //5+ lazyLoad webview
		preloadLimit: 10 //预加载窗口的数量限制(一旦超出，先进先出)
	};

	//默认页面动画
	var defaultShow = {
		autoShow:true,
		duration:$.os.ios?200:100,
		aniShow: 'slide-in-right'
	}
	//若执行了显示动画初始化操作，则要覆盖默认配置
	if($.options.show){
		defaultShow = $.extend(defaultShow, $.options.show,true);
	}

	$.currentWebview = null;
	$.isHomePage = false;

	$.extend($.global, defaultOptions);
	$.extend($.options, defaultOptions);
	/**
	 * 等待动画配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.waitingOptions = function(options) {
		return $.extend({
			autoShow:true,
			title:''
		}, options);
	};
	/**
	 * 窗口显示配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.showOptions = function(options) {
		return $.extend(defaultShow, options);
	};
	/**
	 * 窗口默认配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.windowOptions = function(options) {
		return $.extend({
			scalable: false,
			bounce: "" //vertical
		}, options);
	};
	/**
	 * plusReady
	 * @param {type} callback
	 * @returns {_L6.$}
	 */
	$.plusReady = function(callback) {
		if (window.plus) {
			callback();
		} else {
			document.addEventListener("plusready", function() {
				callback();
			}, false);
		}
		return this;
	};
	/**
	 * 5+ event(5+没提供之前我自己实现)
	 * @param {type} webview
	 * @param {type} eventType
	 * @param {type} data
	 * @returns {undefined}
	 */
	$.fire = function(webview, eventType, data) {
		if (webview) {
			webview.evalJS("mui&&mui.receive('" + eventType + "','" + JSON.stringify(data || {}) + "')");
		}
	};
	/**
	 * 5+ event(5+没提供之前我自己实现)
	 * @param {type} eventType
	 * @param {type} data
	 * @returns {undefined}
	 */
	$.receive = function(eventType, data) {
		if (eventType) {
			data = JSON.parse(data);
			$.trigger(document, eventType, data);
		}
	};
	var triggerPreload = function(webview) {
		if (!webview.preloaded) {
			$.fire(webview, 'preload');
			var list = webview.children();
			for (var i = 0; i < list.length; i++) {
				$.fire(list[i], 'preload');
			}
			webview.preloaded = true;
		}
	};
	var trigger = function(webview,eventType,timeChecked){
		if(timeChecked){
			if(!webview[eventType+'ed']){
				$.fire(webview, eventType);
				var list = webview.children();
				for (var i = 0; i < list.length; i++) {
					$.fire(list[i], eventType);
				}
				webview[eventType+'ed'] = true;
			}
		}else{
			$.fire(webview, eventType);
			var list = webview.children();
			for (var i = 0; i < list.length; i++) {
				$.fire(list[i], eventType);
			}
		}

	}
	/**
	 * 打开新窗口
	 * @param {string} url 要打开的页面地址
	 * @param {string} id 指定页面ID
	 * @param {object} options 可选:参数,等待,窗口,显示配置{params:{},waiting:{},styles:{},show:{}}
	 */
	$.openWindow = function(url, id, options) {

		if (!window.plus) {
			return;
		}
		if (typeof url === 'object') {
			options = url;
			url = options.url;
			id = options.id || url;
		} else {
			if (typeof id === 'object') {
				options = id;
				id = url;
			} else {
				id = id || url;
			}
		}
		options = options || {};
		var params = options.params || {};
		var webview,nShow,nWaiting;
		if ($.webviews[id]) { //已缓存
			var webviewCache = $.webviews[id];
			webview = webviewCache.webview;
			//需要处理用户手动关闭窗口的情况，此时webview应该是空的；
			if(!webview||!webview.getURL()){
				//再次新建一个webview；
				options = $.extend(options, {
					id: id,
					url: url,
					preload:true

				});
				webview = $.createWindow(options);
			}
			//每次show都需要传递动画参数；
			//预加载的动画参数优先级：openWindow配置>preloadPages配置>mui默认配置；
			nShow = webviewCache.show;
			nShow = options.show?$.extend(nShow, options.show):nShow;
			webview.show(nShow.aniShow, nShow.duration, function() {
				triggerPreload(webview);
				trigger(webview,'pagebeforeshow',false);
			});

			webviewCache.afterShowMethodName && webview.evalJS(webviewCache.afterShowMethodName + '(\'' + JSON.stringify(params) + '\')');
			return webview;
		} else { //新窗口
			//显示waiting
			var waitingConfig = $.waitingOptions(options.waiting);
			if(waitingConfig.autoShow){
				nWaiting = plus.nativeUI.showWaiting(waitingConfig.title, waitingConfig.options);
			}
			//创建页面
			options = $.extend(options, {
				id: id,
				url: url
			});
			webview = $.createWindow(options);
			//显示
			nShow = $.showOptions(options.show);
			if(nShow.autoShow){
				webview.addEventListener("loaded", function() {
					//关闭等待框
					if(nWaiting){
						nWaiting.close();	
					}
					//显示页面
					webview.show(nShow.aniShow, nShow.duration, function() {
						triggerPreload(webview);
						trigger(webview,'pagebeforeshow',false);
					});
					webview.showed = true;
					options.afterShowMethodName && webview.evalJS(options.afterShowMethodName + '(\'' + JSON.stringify(params) + '\')');
				}, false);
			}
		}
		return webview;
	};
	/**
	 * 根据配置信息创建一个webview
	 * @param {type} options
	 * @param {type} isCreate
	 * @returns {webview}
	 */
	$.createWindow = function(options, isCreate) {
		if (!window.plus) {
			return;
		}
		var id = options.id || options.url;
		var webview;
		if (options.preload) {
			if ($.webviews[id]&& $.webviews[id].webview.getURL()) { //已经cache
				webview = $.webviews[id].webview;
			} else { //新增预加载窗口
				//preload
				webview = plus.webview.create(options.url, id, $.windowOptions(options.styles), $.extend({
					preload: true
				},options.extras));
				if (options.subpages) {
					$.each(options.subpages, function(index, subpage) {
						//TODO 子窗口也可能已经创建，比如公用模板的情况；
						var subWebview = plus.webview.create(subpage.url, subpage.id || subpage.url, $.windowOptions(subpage.styles), $.extend({
							preload: true
						},subpage.extras));
						webview.append(subWebview);
					});
				}
			}

			//TODO 理论上，子webview也应该计算到预加载队列中，但这样就麻烦了，要退必须退整体，否则可能出现问题；
			$.webviews[id] = {
				webview: webview, //目前仅preload的缓存webview
				preload: true,
				show: $.showOptions(options.show),
				afterShowMethodName: options.afterShowMethodName //就不应该用evalJS。应该是通过事件消息通讯
			};
			//索引该预加载窗口
			var preloads = $.data.preloads;
			var index = preloads.indexOf(id);
			if (~index) { //删除已存在的(变相调整插入位置)
				preloads.splice(index, 1);
			}
			preloads.push(id);
			if (preloads.length > $.options.preloadLimit) {
				//先进先出
				var first = $.data.preloads.shift();
				var webviewCache = $.webviews[first];
				if (webviewCache && webviewCache.webview) {
					//需要将自己打开的所有页面，全部close；
					//关闭该预加载webview	
					$.closeAll(webviewCache.webview);
				}
				//删除缓存
				delete $.webviews[first];
			}
		} else {
			if (isCreate !== false) { //直接创建非预加载窗口
				webview = plus.webview.create(options.url, id, $.windowOptions(options.styles),options.extras);
				if (options.subpages) {
					$.each(options.subpages, function(index, subpage) {
						var subWebview = plus.webview.create(subpage.url, subpage.id || subpage.url, $.windowOptions(subpage.styles),subpage.extras);
						webview.append(subWebview);
					});
				}
			}
		}
		return webview;
	};

	/**
	* 预加载
	*/
	$.preload = function(options){
		//调用预加载函数，不管是否传递preload参数，强制变为true
		if(!options.preload){
			options.preload = true;
		}
		$.createWindow(options);
	}

	/**
	*关闭当前webview打开的所有webview；
	*/
	$.closeOpened = function(webview){
		var opened = webview.opened();
		if(opened){
			for(var i=0,len = opened.length;i<len;i++){
				var openedWebview = opened[i];
				var open_open = openedWebview.opened();
				if(open_open&&open_open.length>0){
					$.closeOpened(openedWebview);
				}else{
					//如果直接孩子节点，就不用关闭了，因为父关闭的时候，会自动关闭子；
					if(openedWebview.parent()!==webview){
						openedWebview.close('none');	
					}
				}
			}
		}
	}
	$.closeAll = function(webview,aniShow){
		$.closeOpened(webview);
		if(aniShow){
			webview.close(aniShow);
		}else{
			webview.close();
		}
	}

	/**
	 * 批量创建webview
	 * @param {type} options
	 * @returns {undefined}
	 */
	$.createWindows = function(options) {
		$.each(options, function(index, option) {
			//初始化预加载窗口(创建)和非预加载窗口(仅配置，不创建)
			$.createWindow(option, false);
		});
	};
	/**
	 * 创建当前页面的子webview
	 * @param {type} options
	 * @returns {webview}
	 */
	$.appendWebview = function(options) {
		if (!window.plus) {
			return;
		}
		var id = options.id || options.url;
		var webview;
		if (!$.webviews[id]) { //保证执行一遍
			//TODO 这里也有隐患，比如某个webview不是作为subpage创建的，而是作为target webview的话；
			webview = plus.webview.create(options.url, id, options.styles,options.extras);
			//TODO 理论上，子webview也应该计算到预加载队列中，但这样就麻烦了，要退必须退整体，否则可能出现问题；
			webview.addEventListener('loaded', function() {
				$.currentWebview.append(webview);
			});
			$.webviews[id] = options;
		}
		return webview;
	};

	//全局webviews
	$.webviews = {};
	//预加载窗口索引
	$.data.preloads = [];

	$.init.add(function() {
		var options = $.options;
		var subpages = options.subpages || [];
		$.plusReady(function() {
			$.currentWebview = plus.webview.currentWebview();
			//TODO  这里需要判断一下，最好等子窗口加载完毕后，再调用主窗口的show方法；
			//或者：在openwindow方法中，监听实现；
			$.each(subpages, function(index, subpage) {
				$.appendWebview(subpage);
			});
			//判断是否首页
			if ($.currentWebview == plus.webview.getWebviewById(plus.runtime.appid)) {
				$.isHomePage = true;
				//首页需要自己激活预加载；
				//timeout因为子页面loaded之后才append的，防止子页面尚未append、从而导致其preload未触发的问题；
				setTimeout(function() {
					triggerPreload($.currentWebview);
				}, 300);
			}
			//设置ios顶部状态栏颜色；
	        if($.os.ios){
	    		var statusBarBackground = $.options.statusBarBackground?$.options.statusBarBackground:'#f7f7f7';
	    		plus.navigator.setStatusBarBackground(statusBarBackground);
	        }
		});
	});
	window.addEventListener('preload', function() {
		//处理预加载部分
		var webviews = $.options.preloadPages || [];
		$.plusReady(function() {
			$.each(webviews, function(index, webview) {
				$.createWindow($.extend(webview, {
					preload: true
				}));
			});

		});
	});
})(mui);
/**
 * mui back
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	/**
	 * 后退
	 */
	$.back = function() {
		if (window.history.length > 1) {
			if (typeof $.options.back === 'function') {
				if ($.options.back() !== false) {
					window.history.back();
				}
			} else {
				window.history.back();
			}
		}
	};
	window.addEventListener('tap', function(e) {
		var action = $.targets.action;
		if (action && action.classList.contains('mui-action-back')) {
			$.back();
		}
	});
	window.addEventListener('swiperight', function(e) {
		var detail = e.detail;
		if (detail.angle > -15 && detail.angle < 15 && $.options.swipeBack === true) {
			$.back();
		}
	});

})(mui, window);
/**
 * mui back 5+
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	/**
	 * 后退(5+关闭当前窗口)
	 */
	$.back = function() {
		var isBack = true;
		var callback = false;
		if (typeof $.options.back === 'function') {
			callback = $.options.back();
			if (callback === false) {
				isBack = false;
			}
		}
		if (!isBack) {
			return;
		}
		if (window.plus) {
			var wobj = $.currentWebview;
			var parent = wobj.parent();
			if (parent) {
				wobj = parent;
			}
			wobj.canBack(function(e) {
				//by chb 暂时注释，在碰到类似popover之类的锚点的时候，需多次点击才能返回；
				if (e.canBack) { //webview history back
					window.history.back();
				} else { //webview close or hide
					//TODO 会不会存在多层嵌套?如果存在需要递归找到最顶层

					var opener = wobj.opener();
					if (opener) {
						//by chb 暂不自动处理老页面的隐藏；
						// var openerParent = opener.parent();
						// if (openerParent) {
						// 	opener = openerParent;
						// }
						if (wobj.preload) {
							wobj.hide("auto");
						} else {
							//关闭页面时，需要将其打开的所有子页面全部关闭；
							$.closeAll(wobj);
						}
						//TODO 暂时屏蔽父窗口的隐藏与显示，与预加载一起使用时太多bug
						//opener.show();
					} else {
						//首页不存在opener的情况下，后退实际上应该是退出应用；
						//这个交给项目具体实现，框架暂不处理；
						//plus.runtime.quit();
					}
				}
			});

		} else if (window.history.length > 1) {
			window.history.back();
		} else {
			window.close();
		}
	};

	$.menu = function() {
		var menu = document.querySelector('.mui-action-menu');
		if (menu) {
			$.trigger(menu, 'tap');
		} else { //执行父窗口的menu
			if (window.plus) {
				var wobj = $.currentWebview;
				var parent = wobj.parent();
				if (parent) { //又得evalJS
					parent.evalJS('mui&&mui.menu();');
				}
			}
		}
	}

	$.plusReady(function() {
		plus.key.addEventListener('backbutton', function() {
			$.back();
		}, false);

		plus.key.addEventListener('menubutton', function() {
			$.menu();
		}, false);

	});

})(mui, window);
/**
 * mui.init pulldownRefresh
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.init.add(function() {
		var options = $.options;
		var pullRefreshOptions = options.pullRefresh || {};

		if ($.os.plus && $.os.android) {
			//只要是android手机，必须使用原生的下拉刷新和上拉加载；
			$.plus_pullRefresh(pullRefreshOptions);
		} else {
			var container = pullRefreshOptions.container;
			if (container) {
				var $container = $(container);
				if ($container.length === 1) {
					$container.pullRefresh(pullRefreshOptions);
				}
			}
		}

	});
})(mui);
/**
 * mui ajax
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    /**
     * mui.get
     * @param {type} url
     * @param {type} successCallback
     * @param {type} errorCallback
     * @returns {undefined}
     */
    $.get = function(url, successCallback, errorCallback) {
        ajax('GET', url, successCallback, errorCallback);
    };
    /**
     * mui.post
     * @param {type} url
     * @param {type} successCallback
     * @param {type} errorCallback
     * @returns {undefined}
     */
    $.post = function(url, successCallback, errorCallback) {
        ajax('POST', url, successCallback, errorCallback);
    };
    
    var ajax = function(method, url, successCallback, errorCallback) {
        var xhr = new XMLHttpRequest();
        var protocol = /^([\w-]+:)\/\//.test(url) ? RegExp.$1 : window.location.protocol;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4)
            {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol === 'file:'))
                {
                    successCallback && successCallback(xhr.responseText);
                }
                else
                {
                    errorCallback && errorCallback();
                }
            }
        };
        xhr.open(method, url, true);
        xhr.send();
    };

})(mui);
/**
 * mui layout(offset[,position,width,height...])
 * @param {type} $
 * @param {type} window
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, undefined) {
	$.offset = function(element) {
		var box = {
			top : 0,
			left : 0
		};
		if ( typeof element.getBoundingClientRect !== undefined) {
			box = element.getBoundingClientRect();
		}
		return {
			top : box.top + window.pageYOffset - element.clientTop,
			left : box.left + window.pageXOffset - element.clientLeft
		};
	};
})(mui, window); 
/**
 * mui animation
 */
(function($, window) {
	/**
	 * scrollTo
	 */
	$.scrollTo = function(scrollTop, duration, callback) {
		duration = duration || 1000;
		var scroll = function(duration) {
			if (duration <= 0) {
				callback && callback();
				return;
			}
			var distaince = scrollTop - window.scrollY;
			setTimeout(function() {
				window.scrollTo(0, window.scrollY + distaince / duration * 10);
				scroll(duration - 10);
			}, 16.7);
		};
		scroll(duration);
	};

})(mui, window);

(function($) {
	var initializing = false,
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/;

	var Class = function() {};
	Class.extend = function(prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		initializing = false;
		for (var name in prop) {
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;

						this._super = _super[name];

						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}
		function Class() {
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = arguments.callee;
		return Class;
	};
	$.Class = Class;
})(mui);
(function($, window, document, undefined) {
	var CLASS_SCROLLBAR = 'mui-scrollbar';
	var CLASS_INDICATOR = 'mui-scrollbar-indicator';
	var CLASS_SCROLLBAR_VERTICAL = CLASS_SCROLLBAR + '-vertical';
	var CLASS_SCROLLBAR_HORIZONTAL = CLASS_SCROLLBAR + '-horizontal';

	var ease = {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function(k) {
				return k * (2 - k);
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
			fn: function(k) {
				return Math.sqrt(1 - (--k * k));
			}
		}
	}
	var Scroll = $.Class.extend({
		init: function(element, options) {
			this.wrapper = this.element = element;
			this.scroller = this.wrapper.children[0];
			this.scrollerStyle = this.scroller.style;

			this.options = $.extend({
				scrollY: true,
				scrollX: false,
				startX: 0,
				startY: 0,
				indicators: true,
				hardwareAccelerated: true,
				fixedBadAndorid: false,
				preventDefaultException: {
					tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
				},
				momentum: true,

				bounce: true,
				bounceTime: 600,
				bounceEasing: ease.circular.style,

				directionLockThreshold: 5,

			}, options, true);

			this.x = 0;
			this.y = 0;
			this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';

			this._init();
			this.refresh();
			this.scrollTo(this.options.startX, this.options.startY);
		},
		_init: function() {
			this._initIndicators();
			this._initEvent();
		},
		_initIndicators: function() {
			var self = this;
			self.indicators = [];
			if (!this.options.indicators) {
				return;
			}
			var indicators = [],
				indicator;

			// Vertical scrollbar
			if (self.options.scrollY) {
				indicator = {
					el: this._createScrollBar(CLASS_SCROLLBAR_VERTICAL),
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if (this.options.scrollX) {
				indicator = {
					el: this._createScrollBar(CLASS_SCROLLBAR_HORIZONTAL),
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
				this.wrapper.addEventListener('swiperight', $.stopPropagation);
			}

			for (var i = indicators.length; i--;) {
				this.indicators.push(new Indicator(this, indicators[i]));
			}

			this.wrapper.addEventListener('scrollend', function() {
				self.indicators.map(function(indicator) {
					indicator.fade();
				});
			});

			this.wrapper.addEventListener('scrollstart', function() {
				self.indicators.map(function(indicator) {
					indicator.fade(1);
				});
			});

			this.wrapper.addEventListener('beforescrollstart', function() {
				self.indicators.map(function(indicator) {
					indicator.fade(1, true);
				});
			});

			this.wrapper.addEventListener('refresh', function() {
				self.indicators.map(function(indicator) {
					indicator.refresh();
				});
			});
		},
		_initEvent: function() {
			window.addEventListener('orientationchange', this);
			window.addEventListener('resize', this);

			this.scroller.addEventListener('webkitTransitionEnd', this);

			this.wrapper.addEventListener('touchstart', this);
			this.wrapper.addEventListener('touchcancel', this);
			this.wrapper.addEventListener('touchend', this);
			this.wrapper.addEventListener('drag', this);
			this.wrapper.addEventListener('dragend', this);
			this.wrapper.addEventListener('flick', this);
			this.wrapper.addEventListener('scrollend', this);
		},
		handleEvent: function(e) {
			switch (e.type) {
				case 'touchstart':
					this._start(e);
					break;
				case 'drag':
					this._drag(e);
					break;
				case 'dragend':
				case 'flick':
					this._flick(e);
					break;
				case 'touchcancel':
				case 'touchend':
					this._end(e);
					break;
				case 'webkitTransitionEnd':
					this._transitionEnd(e);
					break;
				case 'scrollend':
					this._scrollend(e);
					break;
				case 'orientationchange':
				case 'resize':
					this._resize();
					break;

			}
		},
		_start: function(e) {
			this.moved = this.needReset = false;

			this._transitionTime();

			if (this.isInTransition) {
				this.needReset = true;
				this.isInTransition = false;
				var pos = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
				this.setTranslate(Math.round(pos.x), Math.round(pos.y));
				$.trigger(this.wrapper, 'scrollend', this);
			}
			this.reLayout();
			$.trigger(this.wrapper, 'beforescrollstart', this);
		},
		_drag: function(e) {
			var detail = e.detail;

			detail.gesture && detail.gesture.preventDefault();
			var deltaX = detail.deltaX - detail.lastDeltaX;
			var deltaY = detail.deltaY - detail.lastDeltaY;
			var absDeltaX = Math.abs(detail.deltaX);
			var absDeltaY = Math.abs(detail.deltaY);
			if (absDeltaX > absDeltaY + this.options.directionLockThreshold) {
				deltaY = 0;
			} else if (absDeltaY >= absDeltaX + this.options.directionLockThreshold) {
				deltaX = 0;
			}

			deltaX = this.hasHorizontalScroll ? deltaX : 0;
			deltaY = this.hasVerticalScroll ? deltaY : 0;
			var newX = this.x + deltaX;
			var newY = this.y + deltaY;
			// Slow down if outside of the boundaries
			if (newX > 0 || newX < this.maxScrollX) {
				newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
			}
			if (newY > 0 || newY < this.maxScrollY) {
				newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
			}
			if (!this.requestAnimationFrame) {
				this._updateTranslate();
			}
			if (!this.moved) {
				$.trigger(this.wrapper, 'scrollstart', this);
			}
			this.moved = true;
			this.x = newX;
			this.y = newY;
			e.stopPropagation();

		},
		_flick: function(e) {
			var detail = e.detail;
			this._clearRequestAnimationFrame();
			if (e.type === 'dragend' && detail.flick) { //dragend
				return;
			}

			var newX = Math.round(this.x);
			var newY = Math.round(this.y);

			this.isInTransition = false;
			// reset if we are outside of the boundaries
			if (this.resetPosition(this.options.bounceTime)) {
				return;
			}

			this.scrollTo(newX, newY); // ensures that the last position is rounded

			if (e.type === 'dragend') { //dragend
				$.trigger(this.wrapper, 'scrollend', this);
				return;
			}
			var time = 0;
			var easing = '';
			// start momentum animation if needed
			if (this.options.momentum && detail.flickTime < 300) {
				momentumX = this.hasHorizontalScroll ? this._momentum(this.x, detail.flickDistanceX, detail.flickTime, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
					destination: newX,
					duration: 0
				};
				momentumY = this.hasVerticalScroll ? this._momentum(this.y, detail.flickDistanceY, detail.flickTime, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
					destination: newY,
					duration: 0
				};
				newX = momentumX.destination;
				newY = momentumY.destination;
				time = Math.max(momentumX.duration, momentumY.duration);
				this.isInTransition = true;
			}

			if (newX != this.x || newY != this.y) {
				if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
					easing = ease.quadratic;
				}
				this.scrollTo(newX, newY, time, easing);
				return;
			}

			$.trigger(this.wrapper, 'scrollend', this);
			e.stopPropagation();
		},
		_end: function(e) {
			if (!this.moved && this.needReset) {
				this.resetPosition(this.options.bounceTime);
			}
		},
		_transitionEnd: function(e) {
			if (e.target != this.scroller || !this.isInTransition) {
				return;
			}

			this._transitionTime();
			if (!this.resetPosition(this.options.bounceTime)) {
				this.isInTransition = false;
				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		_scrollend: function(e) {
			if (this.y <= this.maxScrollY) {
				$.trigger(this.wrapper, 'scrollbottom', this);
			}
		},
		_resize: function() {
			var that = this;
			clearTimeout(that.resizeTimeout);
			that.resizeTimeout = setTimeout(function() {
				that.refresh();
			}, that.options.resizePolling);
		},
		_transitionTime: function(time) {
			time = time || 0;
			this.scrollerStyle['webkitTransitionDuration'] = time + 'ms';
			if (this.options.fixedBadAndorid && !time && $.os.isBadAndroid) {
				this.scrollerStyle['webkitTransitionDuration'] = '0.001s';
			}
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTime(time);
				}
			}
		},
		_transitionTimingFunction: function(easing) {
			this.scrollerStyle['webkitTransitionTimingFunction'] = easing;
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTimingFunction(easing);
				}
			}
		},
		_translate: function(x, y) {
			this.x = x;
			this.y = y;
		},
		_clearRequestAnimationFrame: function() {
			if (this.requestAnimationFrame) {
				cancelAnimationFrame(this.requestAnimationFrame);
				this.requestAnimationFrame = null;
			}
		},
		_updateTranslate: function() {
			var self = this;
			if (self.x !== self.lastX || self.y !== self.lastY) {
				self.setTranslate(self.x, self.y);
			}
			self.requestAnimationFrame = requestAnimationFrame(function() {
				self._updateTranslate();
			});
		},
		_createScrollBar: function(clazz) {
			var scrollbar = document.createElement('div');
			var indicator = document.createElement('div');
			scrollbar.className = CLASS_SCROLLBAR + ' ' + clazz;
			indicator.className = CLASS_INDICATOR;
			scrollbar.appendChild(indicator);
			if (clazz === CLASS_SCROLLBAR_VERTICAL) {
				this.scrollbarY = scrollbar;
				this.scrollbarIndicatorY = indicator;
			} else if (clazz === CLASS_SCROLLBAR_HORIZONTAL) {
				this.scrollbarX = scrollbar;
				this.scrollbarIndicatorX = indicator;
			}
			this.wrapper.appendChild(scrollbar);
			return scrollbar;
		},
		_preventDefaultException: function(el, exceptions) {
			for (var i in exceptions) {
				if (exceptions[i].test(el[i])) {
					return true;
				}
			}
			return false;
		},
		_reLayout: function() {
			if (!this.hasHorizontalScroll) {
				this.maxScrollX = 0;
				this.scrollerWidth = this.wrapperWidth;
			}

			if (!this.hasVerticalScroll) {
				this.maxScrollY = 0;
				this.scrollerHeight = this.wrapperHeight;
			}

			this.indicators.map(function(indicator) {
				indicator.refresh();
			});
		},
		_momentum: function(current, distance, time, lowerMargin, wrapperSize, deceleration) {
			var speed = parseFloat(Math.abs(distance) / time),
				destination,
				duration;

			deceleration = deceleration === undefined ? 0.0006 : deceleration;

			destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
			duration = speed / deceleration;
			if (destination < lowerMargin) {
				destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
				distance = Math.abs(destination - current);
				duration = distance / speed;
			} else if (destination > 0) {
				destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
				distance = Math.abs(current) + destination;
				duration = distance / speed;
			}

			return {
				destination: Math.round(destination),
				duration: duration
			};
		},
		//API
		setTranslate: function(x, y) {
			this.x = x;
			this.y = y;
			this.scrollerStyle['webkitTransform'] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].updatePosition();
				}
			}
			this.lastX = this.x;
			this.lastY = this.y;
		},
		reLayout: function() {
			this.wrapper.offsetHeight;

			var paddingLeft = parseFloat($.getStyles(this.wrapper, 'padding-left')) || 0;
			var paddingRight = parseFloat($.getStyles(this.wrapper, 'padding-right')) || 0;
			var paddingTop = parseFloat($.getStyles(this.wrapper, 'padding-top')) || 0;
			var paddingBottom = parseFloat($.getStyles(this.wrapper, 'padding-bottom')) || 0;

			var clientWidth = this.wrapper.clientWidth;
			var clientHeight = this.wrapper.clientHeight;

			this.scrollerWidth = this.scroller.offsetWidth;
			this.scrollerHeight = this.scroller.offsetHeight;

			this.wrapperWidth = clientWidth - paddingLeft - paddingRight;
			this.wrapperHeight = clientHeight - paddingTop - paddingBottom;

			this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
			this.maxScrollY = Math.min(this.wrapperHeight - this.scrollerHeight, 0);
			this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
			this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

			this._reLayout();
		},
		resetPosition: function(time) {
			var x = this.x,
				y = this.y;

			time = time || 0;
			if (!this.hasHorizontalScroll || this.x > 0) {
				x = 0;
			} else if (this.x < this.maxScrollX) {
				x = this.maxScrollX;
			}

			if (!this.hasVerticalScroll || this.y > 0) {
				y = 0;
			} else if (this.y < this.maxScrollY) {
				y = this.maxScrollY;
			}

			if (x == this.x && y == this.y) {
				return false;
			}
			this.scrollTo(x, y, time, this.options.bounceEasing);

			return true;
		},
		refresh: function() {
			this.reLayout();
			$.trigger(this.wrapper, 'refresh', this);
			this.resetPosition();
		},
		scrollTo: function(x, y, time, easing) {
			var easing = easing || ease.circular;
			this.isInTransition = time > 0;
			if (this.isInTransition) {
				this._clearRequestAnimationFrame();
				this._transitionTimingFunction(easing.style);
				this._transitionTime(time);
				this.setTranslate(x, y);
			} else {
				this.setTranslate(x, y);
			}

		}
	});
	//Indicator
	var Indicator = function(scroller, options) {
		this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
		this.wrapperStyle = this.wrapper.style;
		this.indicator = this.wrapper.children[0];
		this.indicatorStyle = this.indicator.style;
		this.scroller = scroller;

		this.options = $.extend({
			listenX: true,
			listenY: true,
			fade: false,
			speedRatioX: 0,
			speedRatioY: 0
		}, options);


		this.sizeRatioX = 1;
		this.sizeRatioY = 1;
		this.maxPosX = 0;
		this.maxPosY = 0;

		if (this.options.fade) {
			this.wrapperStyle['webkitTransform'] = this.scroller.translateZ;
			this.wrapperStyle['webkitTransitionDuration'] = this.options.fixedBadAndorid && $.os.isBadAndroid ? '0.001s' : '0ms';
			this.wrapperStyle.opacity = '0';
		}
	}
	Indicator.prototype = {
		handleEvent: function(e) {

		},
		transitionTime: function(time) {
			time = time || 0;
			this.indicatorStyle['webkitTransitionDuration'] = time + 'ms';
			if (this.scroller.options.fixedBadAndorid && !time && $.os.isBadAndroid) {
				this.indicatorStyle['webkitTransitionDuration'] = '0.001s';
			}
		},
		transitionTimingFunction: function(easing) {
			this.indicatorStyle['webkitTransitionTimingFunction'] = easing;
		},
		refresh: function() {
			this.transitionTime();

			if (this.options.listenX && !this.options.listenY) {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
			} else if (this.options.listenY && !this.options.listenX) {
				this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
			} else {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
			}

			this.wrapper.offsetHeight; // force refresh

			if (this.options.listenX) {
				this.wrapperWidth = this.wrapper.clientWidth;
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';

				this.maxPosX = this.wrapperWidth - this.indicatorWidth;

				this.minBoundaryX = 0;
				this.maxBoundaryX = this.maxPosX;

				this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
			}

			if (this.options.listenY) {
				this.wrapperHeight = this.wrapper.clientHeight;
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';

				this.maxPosY = this.wrapperHeight - this.indicatorHeight;

				this.minBoundaryY = 0;
				this.maxBoundaryY = this.maxPosY;

				this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
			}

			this.updatePosition();
		},

		updatePosition: function() {
			var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
				y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

			if (x < this.minBoundaryX) {
				this.width = Math.max(this.indicatorWidth + x, 8);
				this.indicatorStyle.width = this.width + 'px';
				x = this.minBoundaryX;
			} else if (x > this.maxBoundaryX) {
				this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
				this.indicatorStyle.width = this.width + 'px';
				x = this.maxPosX + this.indicatorWidth - this.width;
			} else if (this.width != this.indicatorWidth) {
				this.width = this.indicatorWidth;
				this.indicatorStyle.width = this.width + 'px';
			}

			if (y < this.minBoundaryY) {
				this.height = Math.max(this.indicatorHeight + y * 3, 8);
				this.indicatorStyle.height = this.height + 'px';
				y = this.minBoundaryY;
			} else if (y > this.maxBoundaryY) {
				this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
				this.indicatorStyle.height = this.height + 'px';
				y = this.maxPosY + this.indicatorHeight - this.height;
			} else if (this.height != this.indicatorHeight) {
				this.height = this.indicatorHeight;
				this.indicatorStyle.height = this.height + 'px';
			}

			this.x = x;
			this.y = y;

			this.indicatorStyle['webkitTransform'] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;

		},
		fade: function(val, hold) {
			if (hold && !this.visible) {
				return;
			}

			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;

			var time = val ? 250 : 500,
				delay = val ? 0 : 300;

			val = val ? '1' : '0';

			this.wrapperStyle['webkitTransitionDuration'] = time + 'ms';

			this.fadeTimeout = setTimeout((function(val) {
				this.wrapperStyle.opacity = val;
				this.visible = +val;
			}).bind(this, val), delay);
		}
	};

	$.Scroll = Scroll;

	$.fn.scroll = function(options) {
		this.each(function() {
			var scroll = this.getAttribute('data-scroll');
			if (!scroll) {
				var id = ++$.uuid;
				$.data[id] = new Scroll(this, options);
				this.setAttribute('data-scroll', id);
			}
		});
	};
})(mui, window, document);

(function($, window, document, undefined) {
	var CLASS_PULL_TOP_POCKET = 'mui-pull-top-pocket';
	var CLASS_PULL_BOTTOM_POCKET = 'mui-pull-bottom-pocket';
	var CLASS_PULL = 'mui-pull';
	var CLASS_PULL_LOADING = 'mui-pull-loading';
	var CLASS_PULL_CAPTION = 'mui-pull-caption';

	var CLASS_ICON = 'mui-icon';
	var CLASS_PRELOADER = 'mui-preloader';
	var CLASS_PULLDOWN_ARROW = 'mui-pulldown-arrow';
	var CLASS_PRELOADER_SPIN = 'mui-preloader-spin';

	var CLASS_IN = 'mui-in';
	var CLASS_REVERSE = 'mui-reverse';

	var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_PULLDOWN_ARROW + ' ' + CLASS_REVERSE;
	var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_PULLDOWN_ARROW;
	var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_PRELOADER;

	var pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="' + CLASS_LOADING_DOWN + '"></div>', '<div class="' + CLASS_PULL_CAPTION + '">{downCaption}</div>', '</div>'].join('');

	var defaultOptions = {
		scrollY: true,
		scrollX: false,
		indicators: true,
		down: {
			height: 50,
			contentdown: '下拉可以刷新',
			contentover: '释放立即刷新',
			contentrefresh: '正在刷新...'
		},
		up: {
			height: 50,
			contentdown: '上拉显示更多',
			contentrefresh: '正在加载...',
			duration: 300
		}
	};
	var PullRefresh = $.Scroll.extend({
		init: function(element, options) {
			this._super(element, $.extend(defaultOptions, options, true));
		},
		_init: function() {
			this._super();
			this._initPocket();
		},
		_initPocket: function() {
			var options = this.options;
			if (options.down && options.down.hasOwnProperty('callback')) {
				this.topPocket = this.scroller.querySelector('.' + CLASS_PULL_TOP_POCKET);
				if (!this.topPocket) {
					this.topPocket = this._createPocket(CLASS_PULL_TOP_POCKET, options.down);
					this.scroller.insertBefore(this.topPocket, this.scroller.firstChild);

					this.topLoading = this.topPocket.querySelector('.' + CLASS_PULL_LOADING);
					this.topCaption = this.topPocket.querySelector('.' + CLASS_PULL_CAPTION);

				}
			}
			if (options.up && options.up.hasOwnProperty('callback')) {
				this.bottomPocket = this.scroller.querySelector('.' + CLASS_PULL_BOTTOM_POCKET);
				if (!this.bottomPocket) {
					this.bottomPocket = this._createPocket(CLASS_PULL_BOTTOM_POCKET, options.up);
					this.scroller.appendChild(this.bottomPocket);

					this.bottomLoading = this.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
					this.bottomCaption = this.bottomPocket.querySelector('.' + CLASS_PULL_CAPTION);
				}
				this.wrapper.addEventListener('scrollbottom', this);
			}
		},
		handleEvent: function(e) {
			this._super(e);
			if (e.type === 'scrollbottom') {
				this._scrollbottom();
			}
		},
		_scrollbottom: function() {
			if (!this.pulldown && !this.loading) {
				this.pullPocket = this.bottomPocket;
				this.pullCaption = this.bottomCaption;
				this.pullLoading = this.bottomLoading;
				this.pullupLoading();
			}
		},
		_createPocket: function(clazz, options) {
			var pocket = document.createElement('div');
			pocket.className = clazz;
			pocket.innerHTML = pocketHtml.replace('{downCaption}', options.contentdown);
			return pocket;
		},
		_setCaption: function(title) {
			if (this.loading) {
				return;
			}
			var options = this.options;
			var pocket = this.pullPocket;
			if (pocket) {
				if (title !== this.lastTitle) {
					var caption = this.pullCaption;
					var loading = this.pullLoading;
					caption.innerHTML = title;
					if (this.pulldown) {
						//					if (title === options.down.contentrefresh) {
						loading.className = CLASS_LOADING;
						//					} else if (title === options.down.contentover) {
						//						loading.className = CLASS_LOADING_UP;
						//					} else if (title === options.down.contentdown) {
						//						loading.className = CLASS_LOADING_DOWN;
						//					}
					} else {
						if (title === options.up.contentrefresh) {
							loading.className = CLASS_LOADING + ' ' + CLASS_IN;
						} else {
							loading.className = CLASS_LOADING;
						}
					}
					this.lastTitle = title;
				}
			}
		},
		_start: function(e) {
			if (!this.loading) {
				this.pulldown = this.pullPocket = this.pullCaption = this.pullLoading = false
			}
			this._super(e);
		},
		_drag: function(e) {
			this._super(e);
			if (!this.pulldown && !this.loading && this.topPocket && e.detail.direction === 'down' && this.y >= 0) {
				this.pulldown = true;
				this.pullPocket = this.topPocket;
				this.pullCaption = this.topCaption;
				this.pullLoading = this.topLoading;
			}
			if (this.pulldown) {
				this._setCaption(this.y > this.options.down.height ? this.options.down.contentover : this.options.down.contentdown);
			}
		},
		_reLayout: function() {
			this.hasVerticalScroll = true;
			this._super();
		},
		//API
		resetPosition: function(time) {
			if (this.pulldown && this.y >= this.options.down.height) {
				this.pulldownLoading(0, time || 0);
				return true;
			}
			return this._super(time);
		},
		pulldownLoading: function(x, time) {
			x = x || 0;
			this.scrollTo(x, this.options.down.height, time, this.options.bounceEasing);
			if (this.loading) {
				return;
			}
			this._setCaption(this.options.down.contentrefresh);
			this.loading = true;
			this.indicators.map(function(indicator) {
				indicator.fade(0);
			});
			var callback = this.options.down.callback;
			callback && callback.call(this);
		},
		endPulldownToRefresh: function() {
			if (this.topPocket) {
				this.scrollTo(0, 0, this.options.bounceTime, this.options.bounceEasing);
				this.loading = false;
				this._setCaption(this.options.down.contentdown);
			}

		},
		pullupLoading: function(x, time) {
			x = x || 0;
			this.scrollTo(x, this.maxScrollY, time, this.options.bounceEasing);
			if (this.loading) {
				return;
			}
			this._setCaption(this.options.up.contentrefresh);
			this.indicators.map(function(indicator) {
				indicator.fade(0);
			});
			this.loading = true;
			var callback = this.options.up.callback;
			callback && callback.call(this);
		},
		endPullupToRefresh: function(finished) {
			if (this.bottomPocket) {
				this.loading = false;
				this._setCaption(this.options.up.contentdown);
				if (finished) {
					this.bottomPocket.classList.add('mui-hidden');
					this.wrapper.removeEventListener('scrollbottom', this);

				}
			}
		}
	});
	$.fn.pullRefresh = function(options) {
		this.each(function() {
			var pullrefresh = this.getAttribute('data-pullrefresh');
			if (!pullrefresh) {
				var id = ++$.uuid;
				$.data[id] = new PullRefresh(this, options);
				this.setAttribute('data-pullrefresh', id);
			}
		});
	};
})(mui, window, document);
(function($, window, document, undefined) {
	var CLASS_SLIDER = 'mui-slider';
	var CLASS_SLIDER_GROUP = 'mui-slider-group';
	var CLASS_SLIDER_LOOP = 'mui-slider-loop';
	var CLASS_SLIDER_INDICATOR = 'mui-slider-indicator';
	var CLASS_ACTION_PREVIOUS = 'mui-action-previous';
	var CLASS_ACTION_NEXT = 'mui-action-next';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';
	var CLASS_SLIDER_ITEM_DUPLICATE = CLASS_SLIDER_ITEM + '-duplicate';

	var CLASS_DISABLED = 'mui-disabled';

	var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
	var SELECTOR_SLIDER_ITEM_DUPLICATE = '.' + CLASS_SLIDER_ITEM_DUPLICATE;
	var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
	var SELECTOR_SLIDER_PROGRESS_BAR = '.mui-slider-progress-bar';

	var defaultOptions = {
		interval: 0, //设置为0，则不定时轮播
		scrollY: false,
		scrollX: true,
		indicators: false,
		bounceTime: 200,
		startX: false
	};
	var Slider = $.Scroll.extend({
		init: function(element, options) {
			this._super(element, $.extend(defaultOptions, options, true));
		},
		_init: function() {
			this.scroller = this.wrapper.querySelector('.' + CLASS_SLIDER_GROUP);
			this.scrollerStyle = this.scroller.style;
			this.progressBar = this.wrapper.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
			if (this.progressBar) {
				this.progressBarWidth = this.progressBar.offsetWidth;
				this.progressBarStyle = this.progressBar.style;
			}

			this.x = this._getScroll();
			if (this.options.startX === false) {
				this.options.startX = this.x;
			}
			this._super();
			this._initTimer();
		},
		_initEvent: function() {
			var self = this;
			self._super();
			self.wrapper.addEventListener('swiperight', $.stopPropagation);
			self.wrapper.addEventListener('scrollend', function() {
				self.slideNumber = self._getSlideNumber();
				var slideNumber = self.slideNumber;
				if (self.loop) {
					if (self.slideNumber === 0) {
						self.slideNumber = self.itemLength - 2;
						self.setTranslate(-self.wrapperWidth * (self.itemLength - 2), 0);
					} else if (self.slideNumber === (self.itemLength - 1)) {
						self.slideNumber = 1;
						self.setTranslate(-self.wrapperWidth, 0);
					}
					slideNumber = self.slideNumber - 1;
				}
				$.trigger(self.wrapper, 'slide', {
					slideNumber: slideNumber
				});
			});
			self.wrapper.addEventListener('slide', function(e) {
				var detail = e.detail;
				detail.slideNumber = detail.slideNumber || 0;
				var indicators = self.wrapper.querySelectorAll('.mui-slider-indicator .mui-indicator');
				if (indicators.length > 0) { //图片轮播
					for (var i = 0, len = indicators.length; i < len; i++) {
						indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove']('mui-active');
					}
				} else {
					var number = self.wrapper.querySelector('.mui-slider-indicator .mui-number span');
					if (number) { //图文表格
						number.innerText = (detail.slideNumber + 1);
					} else { //segmented controls
						var controlItems = self.wrapper.querySelectorAll('.mui-control-item');
						for (var i = 0, len = controlItems.length; i < len; i++) {
							controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove']('mui-active');
						}
					}
				}
				e.stopPropagation();
			});

			self.wrapper.addEventListener($.eventName('shown', 'tab'), function(e) { //tab
				self.gotoItem((e.detail.tabNumber || 0), self.options.bounceTime);
			});
			//indicator
			var indicator = self.wrapper.querySelector(SELECTOR_SLIDER_INDICATOR);
			if (indicator) {
				indicator.addEventListener('tap', function(event) {
					var target = event.target;
					if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
						self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
						event.stopPropagation();
					}
				});
			}
		},
		_initTimer: function() {
			var self = this;
			var slider = self.wrapper;
			var interval = self.options.interval;
			var slidershowTimer = slider.getAttribute('data-slidershowTimer');
			slidershowTimer && window.clearTimeout(slidershowTimer);
			if (interval) {
				slidershowTimer = window.setTimeout(function() {
					if (!slider) {
						return;
					}
					//仅slider显示状态进行自动轮播
					if (!!(slider.offsetWidth || slider.offsetHeight)) {
						self.nextItem();
						//下一个
					}
					self._initTimer();
				}, interval);
				slider.setAttribute('data-slidershowTimer', slidershowTimer);
			}
		},
		_reLayout: function() {
			this.hasHorizontalScroll = true;
			this.loop = this.scroller.classList.contains(CLASS_SLIDER_LOOP);
			this.itemLength = this.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
			this.scrollerWidth = this.itemLength * this.scrollerWidth;
			this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
			this.slideNumber = this._getSlideNumber();
			this._super();
		},
		_getScroll: function() {
			var result = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
			return result ? result.x : 0;
		},
		_getSlideNumber: function() {
			return Math.abs(Math.round(this.x / this.wrapperWidth));
		},
		_transitionEnd: function(e) {
			if (e.target != this.scroller || !this.isInTransition) {
				return;
			}
			this._transitionTime();
			this.isInTransition = false;
			$.trigger(this.wrapper, 'scrollend', this);
		},
		_flick: function(e) {
			var detail = e.detail;
			var direction = detail.direction;
			this._clearRequestAnimationFrame();
			this.isInTransition = true;
			if (direction === 'up' || direction === 'down') {
				this.resetPosition(this.options.bounceTime);
				return;
			}
			if (e.type === 'flick') {
				this.x = -(this.slideNumber + (direction === 'left' ? 1 : -1)) * this.wrapperWidth;
				this.resetPosition(this.options.bounceTime);
			} else if (e.type === 'dragend' && !detail.flick) {
				this.resetPosition(this.options.bounceTime);
			}
			e.stopPropagation();
		},
		_gotoItem: function(slideNumber, time) {
			this.scrollTo(-slideNumber * this.wrapperWidth, 0, time, this.options.bounceEasing);
			this._initTimer();
		},
		_fixedSlideNumber: function(slideNumber) {
			if (!this.loop) {
				if (slideNumber < 0) {
					slideNumber = 0;
				} else if (slideNumber >= this.itemLength) {
					slideNumber = this.itemLength - 1;
				}
			} else {
				if (slideNumber === 0) {
					slideNumber = this.itemLength - 2;
				} else if (slideNumber === this.itemLength - 1) {
					slideNumber = 1;
				}
			}
			return slideNumber;
		},
		//API
		setTranslate: function(x, y) {
			this._super(x, y);
			var progressBar = this.progressBar;
			if (progressBar) {
				this.progressBarStyle.webkitTransform = 'translate3d(' + (-x * (this.progressBarWidth / this.wrapperWidth)) + 'px,0,0)';
			}
		},
		resetPosition: function(time) {
			time = time || 0;
			if (this.x > 0) {
				this.x = 0;
			} else if (this.x < this.maxScrollX) {
				this.x = this.maxScrollX;
			}
			this._gotoItem(this._getSlideNumber(), time);
			return true;
		},
		gotoItem: function(slideNumber, time) {
			this._gotoItem(this._fixedSlideNumber(this.loop ? (slideNumber + 1) : slideNumber), time || this.options.bounceEasing);
		},
		nextItem: function() {
			this._gotoItem(this._fixedSlideNumber(this.slideNumber + 1), this.options.bounceTime);
		},
		prevItem: function() {
			this._gotoItem(this._fixedSlideNumber(this.slideNumber - 1), this.options.bounceTime);
		},
		refresh: function(options) {
			if (options) {
				$.extend(this.options, options);
				this._super();
				this._gotoItem(this._getSlideNumber() + 1, this.options.bounceTime);
			} else {
				this._super();
			}
		},
	});
	$.fn.slider = function(options) {
		var slider = null;
		this.each(function() {
			var sliderElement = this;
			if (!this.classList.contains(CLASS_SLIDER)) {
				sliderElement = this.querySelector('.' + CLASS_SLIDER);
			}
			if (sliderElement) {
				var id = sliderElement.getAttribute('data-slider');
				if (!id) {
					id = ++$.uuid;
					$.data[id] = slider = new Slider(sliderElement, options);
					sliderElement.setAttribute('data-slider', id);
				} else {
					slider = $.data[id];
					if (slider && options) {
						slider.refresh(options);
					}
				}
			}
		});
		return slider;
	};
	$.ready(function() {
		setTimeout(function() {
			$('.mui-slider').slider();
		}, 500); //临时处理slider宽度计算不正确的问题(初步确认是scrollbar导致的)

	});
})(mui, window, document);
/**
 * pullRefresh 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {

	var CLASS_PLUS_PULLREFRESH = 'mui-plus-pullrefresh';
	var CLASS_CONTENT = 'mui-content';
	var CLASS_IN = 'mui-in';

	var SELECTOR_CONTENT = '.' + CLASS_CONTENT;

	var defaultOptions = {
		down: {
			height: 50,
			contentdown: '下拉可以刷新',
			contentover: '释放立即刷新',
			contentrefresh: '正在刷新...'
		},
		up: {
			contentdown: '上拉显示更多',
			contentrefresh: '正在加载...'
		}
	};
	var PlusPullRefresh = function(options) {
		options = $.extend(defaultOptions, options, true);

		this.downOptions = options.down;
		this.upOptions = options.up;
		if (this.downOptions && this.downOptions.hasOwnProperty('callback')) {
			this.initPulldownRefresh();
		}
		if (this.upOptions && this.upOptions.hasOwnProperty('callback')) {
			this.initPullupRefresh();
		}
	};
	PlusPullRefresh.prototype.initPulldownRefresh = function() {
		var self = this;
		var sw = $.currentWebview;
		sw.setPullToRefresh({
			support: true,
			height: self.downOptions.height + 'px',
			range: "200px",
			contentdown: {
				caption: self.downOptions.contentdown
			},
			contentover: {
				caption: self.downOptions.contentover
			},
			contentrefresh: {
				caption: self.downOptions.contentrefresh
			}
		}, function() {
			self.downOptions.callback && self.downOptions.callback.call(self);
		});
	};
	PlusPullRefresh.prototype.initPullupRefresh = function() {
		var self = this;
		var content = document.querySelector(SELECTOR_CONTENT);
		if (content) {
			self.bottomPocket = document.createElement('div');
			self.bottomPocket.className = $.classNamePrefix + 'pull-bottom-pocket';
			self.bottomPocket.innerHTML = '<div class="' + $.classNamePrefix + 'pull"><div class="' + $.classNamePrefix + 'pull-loading ' + $.classNamePrefix + 'preloader"></div><div class="' + $.classNamePrefix + 'pull-caption">' + self.upOptions.contentdown + '</div></div>';
			content.appendChild(self.bottomPocket);

			self.pullLoading = self.bottomPocket.querySelector('.mui-pull-loading');
			self.pullCaption = self.bottomPocket.querySelector('.mui-pull-caption');

			self.isLoading = false;
			document.addEventListener('plusscrollbottom', self);
		}
	};
	PlusPullRefresh.prototype.handleEvent = function(event) {
		if (event.type === 'plusscrollbottom') {
			var self = this;
			if (self.isLoading) return;
			self.isLoading = true;
			setTimeout(function() {
				self.pullLoading.classList.add(CLASS_IN);
				self.pullCaption.innerHTML = ''; //修正5+里边第一次加载时，文字显示的bug(还会显示出来个“多”,猜测应该是渲染问题导致的)
				self.pullCaption.innerHTML = self.upOptions.contentrefresh;
				var callback = self.upOptions.callback;
				callback && callback.call(self);
			}, 300);
		}
	};
	PlusPullRefresh.prototype.endPulldownToRefresh = function() {
		$.currentWebview.endPullToRefresh();
	};
	PlusPullRefresh.prototype.endPullupToRefresh = function(finished) {
		if (this.pullLoading) {
			this.pullLoading.classList.remove(CLASS_IN);
			this.pullCaption.innerHTML = this.upOptions.contentdown;
			this.isLoading = false;
			if (finished) {
				this.bottomPocket.classList.add('mui-hidden');
				document.removeEventListener('plusscrollbottom', this);
			}
		}
	};
	$.plus_pullRefresh = function(options) {
		$.plusReady(function() {
			var self = document.body;
			var id = self.getAttribute('data-pullrefresh-plus');
			if (!id) { //避免重复初始化5+ pullrefresh
				self.classList.add(CLASS_PLUS_PULLREFRESH);
				id = ++$.uuid;
				$.data[id] = new PlusPullRefresh(options);
				self.setAttribute('data-pullrefresh-plus', id);
			}
		});
	};
})(mui, document);
/**
 * off-canvas
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} action
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {
	var CLASS_OFF_CANVAS_LEFT = 'mui-off-canvas-left';
	var CLASS_OFF_CANVAS_RIGHT = 'mui-off-canvas-right';
	var CLASS_ACTION_BACKDEOP = 'mui-off-canvas-backdrop';
	var CLASS_OFF_CANVAS_WRAP = 'mui-off-canvas-wrap';
	var CLASS_OFF_CANVAS_HEIGHT_FIXED = 'mui-off-canvas-height-fixed';

	var CLASS_LEFT = 'mui-left';
	var CLASS_RIGHT = 'mui-right';
	var CLASS_SLIDING = 'mui-sliding';

	var SELECTOR_INNER_WRAP = '.mui-inner-wrap';

	var findOffCanvasContainer = function(target) {
		parentNode = target.parentNode;
		if (parentNode) {
			if (parentNode.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
				return parentNode;
			} else {
				parentNode = parentNode.parentNode;
				if (parentNode.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
					return parentNode;
				}
			}
		}
	}
	var handle = function(event, target) {
		if (target.classList && target.classList.contains(CLASS_ACTION_BACKDEOP)) { //backdrop
			var container = findOffCanvasContainer(target);
			if (container) {
				$.targets._container = container;
				return target;
			}
		} else if (target.tagName === 'A' && target.hash) {
			var offcanvas = document.getElementById(target.hash.replace('#', ''));
			if (offcanvas) {
				var container = findOffCanvasContainer(offcanvas);
				if (container) {
					$.targets._container = container;
					event.preventDefault(); //fixed hashchange
					return offcanvas;
				}
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 60,
		handle: handle,
		target: false,
		isReset: false,
		isContinue: true
	});

	var fixedHeight = function(container, isShown) {
		var content = container.querySelector('.mui-content');
		var html = document.getElementsByTagName('html')[0];
		var body = document.body;
		if (isShown) {
			html.classList.add(CLASS_OFF_CANVAS_HEIGHT_FIXED);
			body.classList.add(CLASS_OFF_CANVAS_HEIGHT_FIXED);
			content && (content.classList.add(CLASS_OFF_CANVAS_HEIGHT_FIXED));
		} else {
			html.classList.remove(CLASS_OFF_CANVAS_HEIGHT_FIXED);
			body.classList.remove(CLASS_OFF_CANVAS_HEIGHT_FIXED);
			content && (content.classList.remove(CLASS_OFF_CANVAS_HEIGHT_FIXED));
		}
	}
	var offCanvasTransitionEnd = function() {
		var container = this.parentNode;
		container.classList.remove(CLASS_SLIDING);
		this.removeEventListener('webkitTransitionEnd', offCanvasTransitionEnd);
		if (!container.classList.contains(CLASS_RIGHT) && !container.classList.contains(CLASS_LEFT)) {
			fixedHeight(container, false);
		}
	};
	var toggleOffCanvas = function(container, anchor) {
		if (container && anchor) {
			var type;
			var classList = anchor.classList;
			container.querySelector(SELECTOR_INNER_WRAP).addEventListener('webkitTransitionEnd', offCanvasTransitionEnd);

			if (!container.classList.contains(CLASS_RIGHT) && !container.classList.contains(CLASS_LEFT)) {
				fixedHeight(container, true);
			}
			if (classList.contains(CLASS_OFF_CANVAS_LEFT)) {
				container.classList.toggle(CLASS_RIGHT);
			} else if (classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
				container.classList.toggle(CLASS_LEFT);
			} else if (classList.contains(CLASS_ACTION_BACKDEOP)) {
				container.classList.remove(CLASS_RIGHT);
				container.classList.remove(CLASS_LEFT);
			}
			container.classList.add(CLASS_SLIDING);
		}
	}
	window.addEventListener('tap', function(event) {
		if (!$.targets.offcanvas) {
			return;
		}
		toggleOffCanvas($.targets._container, $.targets.offcanvas);
	});

	$.fn.offCanvas = function() {
		var args = arguments;
		this.each(function() {
			if (args[0] === 'show' || args[0] === 'hide' || args[0] === 'toggle') {
				var classList = this.classList;
				if (classList.contains(CLASS_OFF_CANVAS_LEFT) || classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
					var container = findOffCanvasContainer(this);
					if (container) {
						toggleOffCanvas(container, this);
					}
				}
			}
		});
	};
})(mui, window, document, 'offcanvas');
/**
 * off-canvas drag
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} action
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {
	//仅android平台不支持拖拽,滑动
	if ($.os.android) {
		return;
	}
	var CLASS_SLIDER_HANDLE = 'mui-slider-handle';
	var CLASS_OFF_CANVAS_LEFT = 'mui-off-canvas-left';
	var CLASS_OFF_CANVAS_RIGHT = 'mui-off-canvas-right';
	var CLASS_OFF_CANVAS_WRAP = 'mui-off-canvas-wrap';
	var CLASS_OFF_CANVAS_HEIGHT_FIXED = 'mui-off-canvas-height-fixed';

	var CLASS_LEFT = 'mui-left';
	var CLASS_RIGHT = 'mui-right';
	var CLASS_SLIDING = 'mui-sliding';
	var CLASS_DRAGGABLE = 'mui-draggable';


	var SELECTOR_INNER_WRAP = '.mui-inner-wrap';
	var SELECTOR_OFF_CANVAS_LEFT = '.' + CLASS_OFF_CANVAS_LEFT;
	var SELECTOR_OFF_CANVAS_RIGHT = '.' + CLASS_OFF_CANVAS_RIGHT;
	var isDragable = false;
	var container;
	var innerContainer;
	var factor = 1;
	var translateX = 0;
	var lastTranslateX = 0;
	var offCanvasRequestAnimationFrame;
	var offCanvasTranslateX = 0,
		maxOffCanvasWidth = 0;
	var direction;

	var updateTranslate = function() {
		if (translateX !== lastTranslateX) {
			innerContainer.style['-webkit-transition-duration'] = '0s';
			if (direction === 'right' && translateX > 0) { //dragRight
				translateX = Math.min(translateX, maxOffCanvasWidth);
				if (offCanvasTranslateX < 0) {
					setTranslate(innerContainer, offCanvasTranslateX + translateX);
				} else {
					setTranslate(innerContainer, translateX);
				}
			} else if (direction === 'left' && translateX < 0) { //dragLeft
				translateX = Math.max(translateX, -maxOffCanvasWidth)
				if (offCanvasTranslateX > 0) {
					setTranslate(innerContainer, offCanvasTranslateX + translateX);
				} else {
					setTranslate(innerContainer, translateX);
				}
			}
			lastTranslateX = translateX;
		}
		offCanvasRequestAnimationFrame = requestAnimationFrame(function() {
			updateTranslate();
		});
	};
	var setTranslate = function(element, x) {
		if (element) {
			element.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
		}
	};
	/**
	 * TODO repeat with mui.offcanvas.js
	 */
	var fixedHeight = function(container, isShown) {
			var content = container.querySelector('.mui-content');
			var html = document.getElementsByTagName('html')[0];
			var body = document.body;
			if (isShown) {
				html.classList.add(CLASS_OFF_CANVAS_HEIGHT_FIXED);
				body.classList.add(CLASS_OFF_CANVAS_HEIGHT_FIXED);
				content && (content.classList.add(CLASS_OFF_CANVAS_HEIGHT_FIXED));
			} else {
				html.classList.remove(CLASS_OFF_CANVAS_HEIGHT_FIXED);
				body.classList.remove(CLASS_OFF_CANVAS_HEIGHT_FIXED);
				content && (content.classList.remove(CLASS_OFF_CANVAS_HEIGHT_FIXED));
			}
		}
		/**
		 * TODO repeat with mui.offcanvas.js
		 */
	var offCanvasTransitionEnd = function() {
		var container = this.parentNode;
		var classList = container.classList;
		classList.remove(CLASS_SLIDING);
		this.removeEventListener('webkitTransitionEnd', offCanvasTransitionEnd);
		if (!classList.contains(CLASS_RIGHT) && !classList.contains(CLASS_LEFT)) {
			fixedHeight(container, false);
		}
	};

	window.addEventListener('touchstart', function(event) {
		var target = event.target;
		isDragable = false;
		container = innerContainer = null;
		for (; target && target !== document; target = target.parentNode) {
			var classList = target.classList;
			if (classList) {
				if (classList.contains(CLASS_OFF_CANVAS_WRAP) && classList.contains(CLASS_DRAGGABLE)) {
					container = target;
					innerContainer = container.querySelector(SELECTOR_INNER_WRAP);
					if (!innerContainer) {
						return;
					}
					break;
				}
			}
		}
	});
	window.addEventListener('dragstart', function(event) {
		if (container) {
			var detail = event.detail;
			if (detail.direction === 'left') {
				//off-canvas-left is showed OR off-canvas-right is hidden
				if (container.classList.contains(CLASS_RIGHT)) {
					isDragable = true;
				} else if (container.querySelector(SELECTOR_OFF_CANVAS_RIGHT) && !container.classList.contains(CLASS_LEFT)) {
					isDragable = true;
				}
			} else if (detail.direction === 'right') {
				//off-canvas-left is hidden OR off-canvas-right is showed
				if (container.classList.contains(CLASS_LEFT)) {
					isDragable = true;
				} else if (container.querySelector(SELECTOR_OFF_CANVAS_LEFT) && !container.classList.contains(CLASS_RIGHT)) {
					isDragable = true;
				}
			}
			if (isDragable) {
				direction = detail.direction;
				maxOffCanvasWidth = container.offsetWidth * 0.8;

				var matrix = $.getStyles(innerContainer, 'webkitTransform');
				var result = $.parseTranslateMatrix(matrix);
				offCanvasTranslateX = translateX = result ? result.x : 0;

				var classList = container.classList;
				classList.add(CLASS_SLIDING);

				if (!classList.contains(CLASS_RIGHT) && !classList.contains(CLASS_LEFT)) {
					fixedHeight(container, true);
				}

				detail.gesture.preventDefault();
			}
		}
	});
	window.addEventListener('drag', function(event) {
		if (isDragable) {
			var detail = event.detail;
			if (!offCanvasRequestAnimationFrame) {
				updateTranslate();
			}
			translateX = detail.deltaX * factor;
		}
	});
	window.addEventListener('dragend', function(event) {
		if (isDragable) {
			if (offCanvasRequestAnimationFrame) {
				cancelAnimationFrame(offCanvasRequestAnimationFrame);
				offCanvasRequestAnimationFrame = null;
			}
			innerContainer.setAttribute('style', '');
			innerContainer.addEventListener('webkitTransitionEnd', offCanvasTransitionEnd);
			var classList = container.classList;
			var action = ['add', 'remove'];
			var clazz;
			if (direction === 'right' && translateX > 0) { //dragRight
				clazz = CLASS_RIGHT;
				if (offCanvasTranslateX < 0) { //showed
					action.reverse();
					clazz = CLASS_LEFT;
				}
				if (translateX > (maxOffCanvasWidth / 2)) {
					classList[action[0]](clazz);
				} else {
					classList[action[1]](clazz);
				}
			} else if (direction === 'left' && translateX < 0) { //dragLeft
				clazz = CLASS_LEFT;
				if (offCanvasTranslateX > 0) { //showed
					action.reverse();
					clazz = CLASS_RIGHT;
				}
				if ((-translateX) > (maxOffCanvasWidth / 2)) {
					classList[action[0]](clazz);
				} else {
					classList[action[1]](clazz);
				}
			}
		}
	});

})(mui, window, document, 'offcanvas');
/**
 * actions
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} action
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {
	var CLASS_ACTION = 'mui-action';

	var handle = function(event, target) {
		if (target.className && ~target.className.indexOf(CLASS_ACTION)) {
			return target;
		}
		return false;
	};

	$.registerTarget({
		name : name,
		index : 50,
		handle : handle,
		target : false
	});

})(mui, window, document, 'action');

/**
 * Modals
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {
	var CLASS_MODAL = 'mui-modal';

	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			var modal = document.getElementById(target.hash.replace('#', ''));
			if (modal && modal.classList.contains(CLASS_MODAL)) {
				event.preventDefault();//fixed hashchange
				return modal;
			}
		}
		return false;
	};

	$.registerTarget({
		name : name,
		index : 50,
		handle : handle,
		target : false,
		isReset : false,
		isContinue : true
	});

	window.addEventListener('tap', function(event) {
		if ($.targets.modal) {
			$.targets.modal.classList.toggle('mui-active');
		}
	});
})(mui, window, document, 'modal');

/**
 * Popovers
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {

	var CLASS_POPOVER = 'mui-popover';
	var CLASS_BAR_POPOVER = 'mui-bar-popover';
	var CLASS_ACTION_POPOVER = 'mui-popover-action';
	var CLASS_BACKDROP = 'mui-backdrop';
	var CLASS_BAR_BACKDROP = 'mui-bar-backdrop';
	var CLASS_ACTION_BACKDROP = 'mui-backdrop-action';
	var CLASS_ACTIVE = 'mui-active';

	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			$.targets._popover = document.getElementById(target.hash.replace('#', ''));
			if ($.targets._popover && $.targets._popover.classList.contains(CLASS_POPOVER)) {
				event.preventDefault();//fixed hashchange
				return target;
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 60,
		handle: handle,
		target: false,
		isReset: false,
		isContinue: true
	});

	var fixedPopoverScroll = function(isPopoverScroll) {
		if (isPopoverScroll) {
			document.body.setAttribute('style', 'position:fixed;width:100%;height:100%;overflow:hidden;');
		} else {
			document.body.setAttribute('style', '');
		}
	};
	var onPopoverHidden = function() {
		this.style.display = 'none';
		this.removeEventListener('webkitTransitionEnd', onPopoverHidden);
		fixedPopoverScroll(false);
	};

	var backdrop = (function() {
		var element = document.createElement('div');
		element.classList.add(CLASS_BACKDROP);
		element.addEventListener('tap', function(e) {
			var popover = $.targets._popover;
			if (popover) {
				popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
				popover.classList.remove(CLASS_ACTIVE);
				popover.parentNode.removeChild(backdrop);
			}
		});

		return element;
	}());

	window.addEventListener('tap', function(e) {
		if (!$.targets.popover) {
			return;
		}
		togglePopover($.targets._popover, $.targets.popover);
	});

	var togglePopover = function(popover, anchor) {
		backdrop.classList.remove(CLASS_BAR_BACKDROP);
		backdrop.classList.remove(CLASS_ACTION_BACKDROP);
		var _popover = document.querySelector('.mui-popover.mui-active');
		if (_popover) {
			_popover.style.display = 'none';
			_popover.classList.remove(CLASS_ACTIVE);
			_popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
			fixedPopoverScroll(false);

			_popover.parentNode.removeChild(backdrop);
			//同一个弹出则直接返回，解决同一个popover的toggle
			if (popover === _popover) {
				return;
			}
		}
		if (popover.classList.contains(CLASS_BAR_POPOVER) || popover.classList.contains(CLASS_ACTION_POPOVER)) { //navBar
			if (popover.classList.contains(CLASS_ACTION_POPOVER)) { //action sheet popover
				backdrop.classList.add(CLASS_ACTION_BACKDROP);
			} else { //bar popover
				backdrop.classList.add(CLASS_BAR_BACKDROP);
				if (anchor) {
					if (anchor.parentNode) {
						var offsetWidth = anchor.offsetWidth;
						var offsetLeft = anchor.offsetLeft;
						var innerWidth = window.innerWidth;
						popover.style.left = (Math.min(Math.max(offsetLeft, 5), innerWidth - offsetWidth - 5)) + "px";
					} else {
						//TODO anchor is position:{left,top,bottom,right}
					}
				}
			}
		}
		popover.style.display = 'block';
		popover.offsetHeight
		popover.classList.add(CLASS_ACTIVE);
		popover.parentNode.appendChild(backdrop);
		fixedPopoverScroll(true);

		backdrop.classList.add(CLASS_ACTIVE);
	};

	$.fn.popover = function() {
		var args = arguments;
		this.each(function() {
			$.targets._popover = this;
			if (args[0] === 'show' || args[0] === 'hide' || args[0] === 'toggle') {
				togglePopover(this, args[1]);
			}
		});
	};

})(mui, window, document, 'popover');
/**
 * segmented-controllers
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {

	var CLASS_CONTROL_ITEM = 'mui-control-item';
	var CLASS_CONTROL_CONTENT = 'mui-control-content';
	var CLASS_TAB_ITEM = 'mui-tab-item';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';

	var handle = function(event, target) {
		if (target.classList && (target.classList.contains(CLASS_CONTROL_ITEM) || target.classList.contains(CLASS_TAB_ITEM))) {
			event.preventDefault();//fixed hashchange
			return target;
		}
		return false;
	};

	$.registerTarget({
		name : name,
		index : 80,
		handle : handle,
		target : false
	});

	window.addEventListener('tap', function(e) {

		var targetTab = $.targets.tab;
		if (!targetTab) {
			return;
		}
		var activeTab;
		var activeBodies;
		var targetBody;
		var className = 'mui-active';
		var classSelector = '.' + className;

		activeTab = targetTab.parentNode.querySelector(classSelector);

		if (activeTab) {
			activeTab.classList.remove(className);
		}

		var isLastActive = targetTab === activeTab;
		if (targetTab) {
			targetTab.classList.add(className);
		}

		if (!targetTab.hash) {
			return;
		}

		targetBody = document.getElementById(targetTab.hash.replace('#', ''));

		if (!targetBody) {
			return;
		}
		if (!targetBody.classList.contains(CLASS_CONTROL_CONTENT)) {//tab bar popover
			targetTab.classList[isLastActive ? 'remove' : 'add'](className);
			return;
		}
		if (isLastActive) {//same
			return;
		}
		activeBodies = targetBody.parentNode.getElementsByClassName(className);

		for (var i = 0; i < activeBodies.length; i++) {
			activeBodies[i].classList.remove(className);
		}

		targetBody.classList.add(className);

		var contents = targetBody.parentNode.querySelectorAll('.' + CLASS_CONTROL_CONTENT);
		
		$.trigger(targetBody, $.eventName('shown', name), {
			tabNumber : Array.prototype.indexOf.call(contents, targetBody)
		})
	});

})(mui, window, document, 'tab');

/**
 * Toggles switch
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {

	var CLASS_SWITCH = 'mui-switch';
	var CLASS_SWITCH_HANDLE = 'mui-switch-handle';
	var CLASS_ACTIVE = 'mui-active';

	var SELECTOR_SWITCH_HANDLE = '.' + CLASS_SWITCH_HANDLE;

	var handle = function(event, target) {
		if (target.classList && target.classList.contains(CLASS_SWITCH)) {
			return target;
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 100,
		handle: handle,
		target: false
	});
	var toggle, handle, toggleWidth, handleWidth, offset;

	var switchToggle = function(event) {
		if (!toggle) {
			return;
		}
		var detail = event.detail;
		$.gestures.stoped = true;
		//stop the dragEnd

		var slideOn = (!detail.drag && !toggle.classList.contains(CLASS_ACTIVE)) || (detail.drag && (detail.deltaX > (toggleWidth / 2 - handleWidth / 2)));
		//拖拽过程中，动画时间已经设置为0s了，这里需要恢复回来；
		handle.style['-webkit-transition-duration'] = '.2s';
		if (slideOn) {
			handle.style.webkitTransform = 'translate3d(' + offset + 'px,0,0)';
			toggle.classList['add'](CLASS_ACTIVE);
		} else {
			handle.style.webkitTransform = 'translate3d(0,0,0)';
			toggle.classList['remove'](CLASS_ACTIVE);
		}

		$.trigger(toggle, 'toggle', {
			isActive: slideOn
		});
		toggle.removeEventListener('dragstart', $.stopPropagation);
		toggle.removeEventListener('swiperight', $.stopPropagation);
		event.stopPropagation();
	};
	var dragToggle = function(event) {
		if (!toggle) {
			return;
		}
		var deltaX = event.detail.deltaX;
		if (deltaX < 0) {
			return (handle.style.webkitTransform = 'translate3d(0,0,0)');
		}
		if (deltaX > offset) {
			return (handle.style.webkitTransform = 'translate3d(' + offset + 'px,0,0)');
		}
		handle.style['-webkit-transition-duration'] = '0s';
		handle.style.webkitTransform = 'translate3d(' + deltaX + 'px,0,0)';
		toggle.classList[(deltaX > (toggleWidth / 2 - handleWidth / 2)) ? 'add' : 'remove'](CLASS_ACTIVE);
		event.stopPropagation();
	};

	window.addEventListener($.EVENT_START, function(e) {
		toggle = $.targets.toggle;
		if (toggle) {
			toggle.addEventListener('dragstart', $.stopPropagation);
			toggle.addEventListener('swiperight', $.stopPropagation);
			handle = toggle.querySelector(SELECTOR_SWITCH_HANDLE);
			toggleWidth = toggle.clientWidth;
			handleWidth = handle.clientWidth;
			offset = (toggleWidth - handleWidth + 3);
			e.preventDefault();
		}
	});
	window.addEventListener('tap', switchToggle);

	window.addEventListener('drag', dragToggle);
	window.addEventListener('dragend', switchToggle);

})(mui, window, document, 'toggle');
/**
 * Tableviews
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, undefined) {

	var CLASS_ACTIVE = 'mui-active';
	var CLASS_SELECTED = 'mui-selected';
	var CLASS_GRID_VIEW = 'mui-grid-view';
	var CLASS_TABLE_VIEW_CELL = 'mui-table-view-cell';
	var CLASS_COLLAPSE_CONTENT = 'mui-collapse-content';
	var CLASS_DISABLED = 'mui-disabled';
	var CLASS_TOGGLE = 'mui-switch';
	var CLASS_BTN = 'mui-btn';

	var CLASS_SLIDER_CELL = 'mui-slider-cell';
	var CLASS_SLIDER_HANDLE = 'mui-slider-handle';
	var CLASS_SLIDER_LEFT = 'mui-slider-left';
	var CLASS_SLIDER_RIGHT = 'mui-slider-right';
	var CLASS_BOUNCE = 'mui-bounce';

	var SELECTOR_SLIDER_CELL = '.' + CLASS_SLIDER_CELL;
	var SELECTOR_SLIDER_HANDLE = '.' + CLASS_SLIDER_HANDLE;
	var SELECTOR_SLIDER_LEFT = '.' + CLASS_SLIDER_LEFT;
	var SELECTOR_SLIDER_RIGHT = '.' + CLASS_SLIDER_RIGHT;
	var bounceFactor = 0.4;
	var drawerFactor = 1;
	var factor = 1;
	var cell, a;
	var sliderCell, sliderHandle, sliderTranslateX, sliderHandleWidth, sliderHandleLeft, sliderLeft, sliderLeftBg, sliderLeftWidth, sliderRight, sliderRightBg, sliderRightWidth, isDraging, sliderRequestAnimationFrame, translateX, lastTranslateX;

	var toggleActive = function(isActive) {
		if (isActive) {
			if (a) {
				a.classList.add(CLASS_ACTIVE);
			} else if (cell) {
				cell.classList.add(CLASS_ACTIVE);
			}
		} else {
			if (a) {
				a.classList.remove(CLASS_ACTIVE);
			} else if (cell) {
				cell.classList.remove(CLASS_ACTIVE);
			}
		}
	};

	var updateTranslate = function() {
		if (translateX !== lastTranslateX) {
			if (sliderLeft || sliderRight) {
				if (sliderLeft && sliderRight) { //both
					if (sliderTranslateX === 0) {
						setTranslate(sliderHandle, translateX);
					} else {
						setTranslate(sliderHandle, sliderTranslateX + translateX);
					}
				} else if (sliderLeft) { //only left
					if (sliderTranslateX === 0) {
						setTranslate(sliderHandle, Math.max(translateX, 0));
					} else {
						setTranslate(sliderHandle, Math.max(sliderTranslateX + translateX, 0));
					}
				} else if (sliderRight) { //only right
					if (sliderTranslateX === 0) {
						setTranslate(sliderHandle, Math.min(translateX, 0));
					} else {
						setTranslate(sliderHandle, Math.min(sliderTranslateX + translateX, 0));
					}
				}
				if (sliderLeft) { //left
					if (sliderTranslateX === 0) {
						if (translateX > sliderLeftWidth) {
							sliderCell.style.backgroundColor = sliderLeftBg;
							setTranslate(sliderLeft, Math.max((translateX - sliderLeftWidth), 0));
						}
					} else {
						if (translateX > 0) {
							sliderCell.style.backgroundColor = sliderLeftBg;
						} else {
							sliderCell.style.backgroundColor = '';
						}
						setTranslate(sliderLeft, Math.max(translateX, 0));
					}
				}
				if (sliderRight) { //right
					if (sliderTranslateX === 0) {
						if (-translateX > sliderRightWidth) {
							sliderCell.style.backgroundColor = sliderRightBg;
							setTranslate(sliderRight, Math.min(-((-translateX) - sliderRightWidth), 0));
						}
					} else {
						if (translateX > 0 && !sliderLeft) {
							sliderCell.style.backgroundColor = '';
						} else {
							sliderCell.style.backgroundColor = sliderRightBg;
						}
						setTranslate(sliderRight, Math.min(translateX, 0));
					}

				}
			} else if (sliderHandle) { //抽屉式功能菜单
				//打开状态不允许translateX小于0，关闭状态不允许translateX大于0
				if ((sliderTranslateX === 0 && translateX > 0) || (sliderTranslateX === sliderHandleWidth && translateX < 0)) {
					if (Math.abs(translateX) <= sliderHandleWidth) {
						setTranslate(sliderHandle, sliderTranslateX + translateX);
					}
				}
			}
			lastTranslateX = translateX;
		}
		sliderRequestAnimationFrame = requestAnimationFrame(function() {
			updateTranslate();
		});
	};
	var setTranslate = function(element, x) {
		if (element) {
			element.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
		}
	};

	var toggleSliderLeftAction = function(show, trigger) {
		if (sliderLeft) { //显示
			sliderLeft.setAttribute('style', '');
			sliderRight && sliderRight.setAttribute('style', '');
			if (show) {
				setTranslate(sliderHandle, sliderLeftWidth);
				if (trigger) {
					$.trigger(sliderHandle, 'slideright');
				}
				cell.classList.add(CLASS_SELECTED);
			} else {
				setTranslate(sliderHandle, 0);
				cell.classList.remove(CLASS_SELECTED);
			}
		}
	}
	var toggleSliderRightAction = function(show, trigger) {
		if (sliderRight) { //显示
			sliderRight.setAttribute('style', '');
			sliderLeft && sliderLeft.setAttribute('style', '');
			if (show) {
				setTranslate(sliderHandle, -sliderRightWidth);
				if (trigger) {
					$.trigger(sliderHandle, 'slideleft');
				}
				cell.classList.add(CLASS_SELECTED);
			} else {
				setTranslate(sliderHandle, 0);
				cell.classList.remove(CLASS_SELECTED);
			}
		}
	}
	var toggleSliderHandle = function(show) {
		if (sliderHandle) {
			if (show) {
				setTranslate(sliderHandle, 0);
				cell.classList.add(CLASS_SELECTED);
			} else {
				setTranslate(sliderHandle, sliderHandleWidth);
				cell.classList.remove(CLASS_SELECTED);
			}
		}
	}
	var endDraging = function(isSwipe, detail) {
		isDraging = false;
		if (sliderRequestAnimationFrame) {
			cancelAnimationFrame(sliderRequestAnimationFrame);
			sliderRequestAnimationFrame = null;
		}
		sliderCell.setAttribute('style', '');
		var absTranslateX = Math.abs(translateX);
		if (!isSwipe && (sliderLeft || sliderRight)) { //bounce
			if (translateX > 0) { //dragright
				var distance = sliderLeftWidth / 2;
				if (sliderTranslateX !== 0) {
					if (sliderRight) { //关闭
						//trigger is false
						toggleSliderRightAction(!(absTranslateX >= sliderRightWidth / 2), false);
						distance = sliderLeftWidth / 2 + sliderRightWidth;
					}
				}
				if (sliderLeft) {
					var isShow = (absTranslateX >= distance);
					if (sliderLeft.classList.contains(CLASS_BOUNCE)) { //bounce
						sliderLeft.setAttribute('style', '');
						setTranslate(sliderHandle, 0);
						if (isShow && !detail.swipe) {
							$.trigger(sliderHandle, 'slideright');
						}
					} else {
						toggleSliderLeftAction(isShow, true);
					}
				}
			} else {
				var distance = sliderLeftWidth / 2;
				if (sliderTranslateX !== 0) {
					if (sliderLeft) { //关闭
						//trigger is false
						toggleSliderLeftAction(!(absTranslateX >= sliderLeftWidth / 2), false);
						distance = sliderRightWidth / 2 + sliderLeftWidth;
					}
				}
				if (sliderRight) { //显示
					var isShow = (absTranslateX >= distance);
					if (sliderRight.classList.contains(CLASS_BOUNCE)) { //bounce
						sliderRight.setAttribute('style', '');
						setTranslate(sliderHandle, 0);
						if (isShow && !detail.swipe) {
							$.trigger(sliderHandle, 'slideleft');
						}
					} else {
						toggleSliderRightAction(isShow, true);
					}
				}
			}
		} else if (!(sliderLeft || sliderRight)) {
			if (sliderTranslateX === 0) { //关闭
				toggleSliderHandle(!(absTranslateX > (sliderHandleWidth / 2)));
			} else { //拉开
				toggleSliderHandle((absTranslateX > (sliderHandleWidth / 2)));
			}
		}
	};
	window.addEventListener('touchstart', function(event) {
		if (cell) {
			toggleActive(false);
		}
		cell = a = sliderHandle = sliderLeft = sliderRight = isDraging = sliderRequestAnimationFrame = false;
		translateX = lastTranslateX = sliderTranslateX = sliderHandleWidth = sliderLeftWidth = sliderRightWidth = 0;
		sliderLeftBg = sliderRightBg = '';

		var target = event.target;
		var isDisabled = false;
		for (; target && target !== document; target = target.parentNode) {
			if (target.classList) {
				var classList = target.classList;
				if ((target.tagName === 'INPUT' && target.type !== 'radio' && target.type !== 'checkbox') || target.tagName === 'BUTTON' || classList.contains(CLASS_TOGGLE) || classList.contains(CLASS_BTN) || classList.contains(CLASS_DISABLED)) {
					isDisabled = true;
				}
				if (classList.contains(CLASS_COLLAPSE_CONTENT)) { //collapse content
					break;
				}
				if (classList.contains(CLASS_TABLE_VIEW_CELL)) {
					cell = target;
					var selected = cell.parentNode.querySelector('.' + CLASS_SELECTED);
					if (selected && selected != cell) {
						selected.classList.remove(CLASS_SELECTED);
						var selectedSliderHandle = selected.querySelector(SELECTOR_SLIDER_HANDLE);
						if (selectedSliderHandle) {
							var selectedLeft = selected.querySelector(SELECTOR_SLIDER_LEFT);
							if (selectedLeft) {
								selectedLeft.setAttribute('style', '');
							}
							var selectedRight = selected.querySelector(SELECTOR_SLIDER_RIGHT);
							if (selectedRight) {
								selectedRight.setAttribute('style', '');
							}
							if (selectedLeft || selectedRight) {
								setTranslate(selectedSliderHandle, 0);
							} else {
								setTranslate(selectedSliderHandle, selectedSliderHandle.offsetWidth);
							}
						}
					}
					if (!cell.parentNode.classList.contains(CLASS_GRID_VIEW)) {
						var link = cell.querySelector('a');
						if (link && link.parentNode === cell) { //li>a
							a = link;
						}
					}
					sliderCell = cell.querySelector(SELECTOR_SLIDER_CELL);
					if (sliderCell && sliderCell.parentNode === cell) {
						var handle = sliderCell.querySelector(SELECTOR_SLIDER_HANDLE);
						if (handle) { //slider
							toggleEvents(cell);
							sliderHandle = handle;
							sliderHandleWidth = sliderHandle.offsetWidth;
							sliderHandleLeft = $.getStyles(sliderHandle, 'margin-left');
							factor = drawerFactor;
							var left = sliderCell.querySelector(SELECTOR_SLIDER_LEFT);
							if (left) { //li>.left
								sliderLeft = left;
								sliderLeftBg = $.getStyles(left, 'background-color');
								sliderLeftWidth = left.offsetWidth;
							}
							var right = sliderCell.querySelector(SELECTOR_SLIDER_RIGHT);
							if (right) { //li>.right
								sliderRight = right;
								sliderRightBg = $.getStyles(right, 'background-color');
								sliderRightWidth = right.offsetWidth;
							}
							if (sliderLeft || sliderRight) {
								factor = bounceFactor;
							}
							var matrix = $.getStyles(sliderHandle, 'webkitTransform');
							var result = $.parseTranslateMatrix(matrix);
							sliderTranslateX = result ? result.x : 0;
						}
					}

					if (!isDisabled) {
						toggleActive(true);
					}
					break;
				}
			}
		}
	});
	window.addEventListener('touchmove', function(event) {
		toggleActive(false);
	});

	var handleEvent = {
		handleEvent: function(event) {
			switch (event.type) {
				case 'dragstart':
					this.dragstart(event);
					break;
				case 'drag':
					this.drag(event);
					break;
				case 'dragend':
					this.dragend(event);
					break;
				case 'swiperight':
					this.swiperight(event);
					break;
				case 'swipeleft':
					this.swipeleft(event);
					break;
			}
		},
		dragstart: function(event) {
			var detail = event.detail;
			var direction = detail.direction;
			var angle = detail.angle;
			if (direction === 'left') {
				if ((sliderRight || sliderHandle) && (angle > 150 || angle < -150)) {
					if (!sliderRight && sliderLeft && sliderTranslateX === 0) { //仅有左侧按钮时不允许左拖
						return;
					}
					if (sliderHandle && !sliderRight && !sliderLeft && sliderTranslateX === 0) { //抽屉式已展开，不允许左拖
						return;
					}
					isDraging = true;
				}
			} else if (direction === 'right') {
				if ((sliderLeft || sliderHandle) && angle > -30 && angle < 30) {
					if (!sliderLeft && sliderRight && sliderTranslateX === 0) { //仅有右侧按钮时不允许右拖
						return;
					}
					if (sliderHandle && !sliderRight && !sliderLeft && sliderTranslateX === sliderHandleWidth) { //抽屉式已关闭，不允许右拖
						return;
					}
					isDraging = true;
				}
			}
			if (isDraging) {
				event.stopPropagation();
			}
		},
		drag: function(event) {
			if (isDraging) {
				if (!sliderRequestAnimationFrame) {
					updateTranslate();
				}
				translateX = event.detail.deltaX * factor;
				event.detail.gesture.preventDefault();
			}
		},
		dragend: function(event) {
			if (isDraging) {
				endDraging(false, event.detail);
			}
		},
		swiperight: function(event) {
			var isSwipeable = false;
			if (sliderLeft && !sliderLeft.classList.contains(CLASS_BOUNCE) && sliderTranslateX === 0) {
				//left show
				toggleSliderLeftAction(true, true);
				isSwipeable = true;
			} else if (sliderRight && sliderTranslateX < 0) {
				//right hide
				toggleSliderRightAction(false, false);
				isSwipeable = true;
			} else if (!sliderLeft && !sliderRight) {
				isSwipeable = true;
			}
			if (isSwipeable) {
				$.gestures.stoped = true;
				endDraging(true, event.detail);
			}
			event.stopPropagation();
		},
		swipeleft: function(event) {
			var isSwipeable = false;
			if (sliderRight && !sliderRight.classList.contains(CLASS_BOUNCE) && sliderTranslateX === 0) {
				//right show
				toggleSliderRightAction(true, true);
				isSwipeable = true;
			} else if (sliderLeft && sliderTranslateX > 0) {
				//left hide
				toggleSliderLeftAction(false, false);
				isSwipeable = true;
			} else if (!sliderLeft && !sliderRight) {
				isSwipeable = true;
			}
			if (isSwipeable) {
				$.gestures.stoped = true;
				endDraging(true, event.detail);
			}
			event.stopPropagation();
		}
	}

	function toggleEvents(element, isRemove) {
		var method = !!isRemove ? 'removeEventListener' : 'addEventListener';
		element[method]('dragstart', handleEvent);
		element[method]('drag', handleEvent);
		element[method]('dragend', handleEvent);
		element[method]('swiperight', handleEvent);
		element[method]('swipeleft', handleEvent);
	}



	window.addEventListener('touchend', function(event) { //使用touchend来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
		if (!cell) {
			return;
		}
		toggleActive(false);
		sliderHandle && toggleEvents(cell, true);
	});
	window.addEventListener('touchcancel', function(event) { //使用touchcancel来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
		if (!cell) {
			return;
		}
		toggleActive(false);
		sliderHandle && toggleEvents(cell, true);
	});
	var radioOrCheckboxClick = function() {
			var classList = cell.classList;
			if (classList.contains('mui-radio')) {
				var input = cell.querySelector('input[type=radio]');
				if (input) {
					input.click();
				}
			} else if (classList.contains('mui-checkbox')) {
				var input = cell.querySelector('input[type=checkbox]');
				if (input) {
					input.click();
				}
			}
		}
		//fixed hashchange(android)
	window.addEventListener($.EVENT_CLICK, function(e) {
		if (cell && cell.classList.contains('mui-collapse')) {
			e.preventDefault();
		}
	});
	window.addEventListener('doubletap', function(event) {
		if (cell) {
			radioOrCheckboxClick();
		}
	});
	window.addEventListener('tap', function(event) {
		if (!cell) {
			return;
		}
		var isExpand = false;
		var classList = cell.classList;
		if (classList.contains('mui-collapse')) {
			event.detail.gesture.preventDefault();
			if (!classList.contains(CLASS_ACTIVE)) { //展开时,需要收缩其他同类
				var collapse = cell.parentNode.querySelector('.mui-collapse.mui-active');
				if (collapse) {
					collapse.classList.remove(CLASS_ACTIVE);
				}
				isExpand = true;
			}
			classList.toggle(CLASS_ACTIVE);
			if (isExpand) {
				//触发展开事件
				$.trigger(cell, 'expand');

				//scroll
				//暂不滚动
				// var offsetTop = $.offset(cell).top;
				// var scrollTop = document.body.scrollTop;
				// var height = window.innerHeight;
				// var offsetHeight = cell.offsetHeight;
				// var cellHeight = (offsetTop - scrollTop + offsetHeight);
				// if (offsetHeight > height) {
				// 	$.scrollTo(offsetTop, 300);
				// } else if (cellHeight > height) {
				// 	$.scrollTo(cellHeight - height + scrollTop, 300);
				// }
			}
		}
		radioOrCheckboxClick();
	});
})(mui, window, document);
(function($, window) {
	/**
	 * 警告消息框
	 */
	$.alert = function(message,title,btnValue,callback) {
		if ($.os.plus) {
			if(typeof message === undefined){
				return;
			}else{
				if(typeof title ==='function'){
					callback = title;
					title = null;
					btnValue = '确定';
				}else if(typeof btnValue ==='function'){
					callback = btnValue;
					btnValue = null;
				}
				plus.nativeUI.alert(message,callback,title,btnValue);
			}

		}else{
			//TODO H5版本
			window.alert(message);
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * 警告消息框
	 */
	$.confirm = function(message,title,btnArray,callback) {
		if ($.os.plus) {
			if(typeof message === undefined){
				return;
			}else{
				if(typeof title ==='function'){
					callback = title;
					title = null;
					btnArray = null;
				}else if(typeof btnArray ==='function'){
					callback = btnArray;
					btnArray = null;
				}
				plus.nativeUI.confirm(message,callback,title,btnArray);
			}

		}else{
			//TODO H5版本
			window.confirm(message);
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * 警告消息框
	 */
	$.prompt = function(text,defaultText,title,btnArray,callback) {
		if ($.os.plus) {
			if(typeof message === undefined){
				return;
			}else{

				if(typeof defaultText ==='function'){
					callback = defaultText;
					defaultText = null;
					title = null;
					btnArray = null;
				}else if(typeof title === 'function'){
					callback = title;
					title = null;
					btnArray = null;
				}else if(typeof btnArray ==='function'){
					callback = btnArray;
					btnArray = null;
				}
				plus.nativeUI.prompt(text,callback,title,defaultText,btnArray);
			}

		}else{
			//TODO H5版本
			window.prompt(text);
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * toast
	 */
	$.toast = function(message) {
		if($.os.plus&&$.os.android){
			//默认显示在底部；
			plus.nativeUI.toast(message,{verticalAlign:'bottom'});
		}else{
			var toast = document.createElement('div');
			toast.classList.add('mui-toast-container');
			toast.innerHTML = '<div class="'+'mui-toast-message'+'">'+message+'</div>';
			document.body.appendChild(toast);
			setTimeout(function(){
		  		document.body.removeChild(toast);
			},2000);
		}
	};

})(mui, window);
/**
 * Input(TODO resize)
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, undefined) {
	var CLASS_ICON = 'mui-icon';
	var CLASS_ICON_CLEAR = 'mui-icon-clear';
	var CLASS_ICON_SPEECH = 'mui-icon-speech';
	var CLASS_ICON_SEARCH = 'mui-icon-search';
	var CLASS_INPUT_ROW = 'mui-input-row';
	var CLASS_PLACEHOLDER = 'mui-placeholder';
	var CLASS_TOOLTIP = 'mui-tooltip';
	var CLASS_HIDDEN = 'mui-hidden';
	var SELECTOR_ICON_CLOSE = '.' + CLASS_ICON_CLEAR;
	var SELECTOR_ICON_SPEECH = '.' + CLASS_ICON_SPEECH;
	var SELECTOR_PLACEHOLDER = '.' + CLASS_PLACEHOLDER;
	var SELECTOR_TOOLTIP = '.' + CLASS_TOOLTIP;

	var findRow = function(target) {
		for (; target && target !== document; target = target.parentNode) {
			if (target.classList && target.classList.contains(CLASS_INPUT_ROW)) {
				return target;
			}
		}
		return null;
	}
	var Input = function(element, options) {
		this.element = element;
		this.options = options || {
			actions: 'clear'
		};
		if (~this.options.actions.indexOf('slider')) { //slider
			this.sliderActionClass = CLASS_TOOLTIP + ' ' + CLASS_HIDDEN;
			this.sliderActionSelector = SELECTOR_TOOLTIP;
		} else { //clear,speech,search
			if (~this.options.actions.indexOf('clear')) {
				this.clearActionClass = CLASS_ICON + ' ' + CLASS_ICON_CLEAR + (element.value ? '' : (' ' + CLASS_HIDDEN));
				this.clearActionSelector = SELECTOR_ICON_CLOSE;
			}
			if (~this.options.actions.indexOf('speech')) { //only for 5+
				this.speechActionClass = CLASS_ICON + ' ' + CLASS_ICON_SPEECH;
				this.speechActionSelector = SELECTOR_ICON_SPEECH;
			}
			if (~this.options.actions.indexOf('search')) {
				this.searchActionClass = CLASS_PLACEHOLDER;
				this.searchActionSelector = SELECTOR_PLACEHOLDER;
			}
		}
		this.init();
	};
	Input.prototype.init = function() {
		this.initAction();
		this.initElementEvent();
	};
	Input.prototype.initAction = function() {
		var self = this;

		var row = self.element.parentNode;
		if (row) {
			if (self.sliderActionClass) {
				self.sliderAction = self.createAction(row, self.sliderActionClass, self.sliderActionSelector);
			} else {
				if (self.searchActionClass) {
					self.searchAction = self.createAction(row, self.searchActionClass, self.searchActionSelector);
					self.searchAction.addEventListener('tap', function() {
						setTimeout(function() {
							self.element.focus();
						}, 0);
					});
				}
				if (self.speechActionClass) {
					self.speechAction = self.createAction(row, self.speechActionClass, self.speechActionSelector);
					self.speechAction.addEventListener('click', function(event) {
						event.stopPropagation();
					});
					self.speechAction.addEventListener('tap', function(event) {
						self.speechActionClick(event);
					});
				}
				if (self.clearActionClass) {
					self.clearAction = self.createAction(row, self.clearActionClass, self.clearActionSelector);
					self.clearAction.addEventListener('tap', function(event) {
						self.clearActionClick(event);
					});

				}
			}
		}
	};
	Input.prototype.createAction = function(row, actionClass, actionSelector) {
		var action = row.querySelector(actionSelector);
		if (!action) {
			var action = document.createElement('span');
			action.className = actionClass;
			if (actionClass === this.searchActionClass) {
				action.innerHTML = '<span class="' + CLASS_ICON + ' ' + CLASS_ICON_SEARCH + '"></span>' + this.element.getAttribute('placeholder');
				this.element.setAttribute('placeholder', '');
			}
			row.insertBefore(action, this.element.nextSibling);
		}
		return action;
	};
	Input.prototype.initElementEvent = function() {
		var element = this.element;

		if (this.sliderActionClass) {
			var tooltip = this.sliderAction;
			//TODO resize
			var offsetLeft = element.offsetLeft;
			var width = element.offsetWidth - 28;
			var tooltipWidth = tooltip.offsetWidth;
			var distince = Math.abs(element.max - element.min);

			var timer = null;
			var showTip = function() {
				tooltip.classList.remove(CLASS_HIDDEN);
				tooltipWidth = tooltipWidth || tooltip.offsetWidth;
				var scaleWidth = Math.abs(element.value) / distince * width;
				tooltip.style.left = (14 + offsetLeft + scaleWidth - tooltipWidth / 2) + 'px';
				tooltip.innerText = element.value;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(function() {
					tooltip.classList.add(CLASS_HIDDEN);
				}, 1000);
			};
			element.addEventListener('input', showTip);
			element.addEventListener('tap', showTip);
			element.addEventListener('touchmove', function(e) {
				e.stopPropagation();
			});
		} else {
			if (this.clearActionClass) {
				var action = this.clearAction;
				if (!action) {
					return;
				}
				$.each(['keyup', 'change', 'input', 'focus', 'blur', 'cut', 'paste'], function(index, type) {
					(function(type) {
						element.addEventListener(type, function() {
							action.classList[element.value.trim() ? 'remove' : 'add'](CLASS_HIDDEN);
						});
					})(type);
				});
			}
			if (this.searchActionClass) {
				element.addEventListener('focus', function() {
					element.parentNode.classList.add('mui-active');
				});
				element.addEventListener('blur', function() {
					if (!element.value.trim()) {
						element.parentNode.classList.remove('mui-active');
					}
				});
			}
		}
	};
	Input.prototype.clearActionClick = function(event) {
		this.element.value = '';
		this.element.focus();
		this.clearAction.classList.add(CLASS_HIDDEN);
		event.preventDefault();
	};
	Input.prototype.speechActionClick = function(event) {
		if (window.plus) {
			var self = this;
			self.element.value = '';
			plus.speech.startRecognize({
				engine: 'iFly'
			}, function(s) {
				self.element.value += s;
				setTimeout(function() {
					self.element.focus();
				}, 0);
				plus.speech.stopRecognize();
			}, function(e) {});
		} else {
			alert('only for 5+');
		}
		event.preventDefault();
	};
	$.fn.input = function(options) {
		this.each(function() {
			var actions = [];
			var row = findRow(this.parentNode);
			if (this.type === 'range' && row.classList.contains('mui-input-range')) {
				actions.push('slider');
			} else {
				var classList = this.classList;
				if (classList.contains('mui-input-clear')) {
					actions.push('clear');
				}
				if (classList.contains('mui-input-speech')) {
					actions.push('speech');
				}
				if (this.type === 'search' && row.classList.contains('mui-search')) {
					actions.push('search');
				}
			}
			var id = this.getAttribute('data-input-' + actions[0]);
			if (!id) {
				id = ++$.uuid;
				$.data[id] = new Input(this, {
					actions: actions.join(',')
				});
				for (var i = 0, len = actions.length; i < len; i++) {
					this.setAttribute('data-input-' + actions[i], id);
				}
			}

		});
	};
	$.ready(function() {
		$('.mui-input-row input').input();
	});
})(mui, window, document);