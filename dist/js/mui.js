/*!
 * =====================================================
 * Mui v0.5.7 (https://github.com/dcloudio/mui)
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
		dom.__proto__ = $.fn;
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
window.mui = mui;
'$' in window || (window.$ = mui);
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
	if (String.prototype.trim === undefined) {// fix for iOS 3.2
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

})();
/**
 * fixed CustomEvent
 */
(function() {
	if ( typeof window.CustomEvent === 'undefined') {
		function CustomEvent(event, params) {
			params = params || {
				bubbles : false,
				cancelable : false,
				detail : undefined
			};
			var evt = document.createEvent('Events');
			var bubbles = true;
			if (params) {
				for (var name in params) {
					(name === 'bubbles') ? ( bubbles = !!params[name]) : (evt[name] = params[name]);
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
			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
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
				if ($.options.gestureConfig[gesture.name]) {
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
		touch = {
			target: event.target,
			lastTarget: (touch.lastTarget ? touch.lastTarget : null),
			startTime: Date.now(),
			touchTime: 0,
			lastTapTime: (touch.lastTapTime ? touch.lastTapTime : 0),
			start: {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			},
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
		touch.touchTime = Date.now() - touch.startTime;
		touch.move = {
			x: event.touches[0].pageX,
			y: event.touches[0].pageY
		};
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
		touch.touchTime = Date.now() - touch.startTime;
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
                if (event.target.type !== 'range') {//ignore input range
                    touch.swipe = true;
                    $.trigger(event.target, name + touch.direction, touch);
                }
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
		if (event.type === $.EVENT_END || event.type === $.EVENT_CANCEL) {
			var options = this.options;
			if (touch.distance < options.tabMaxDistance && touch.touchTime < options.tapMaxTime) {
				if ($.options.gestureConfig.doubletap && touch.lastTarget && (touch.lastTarget === event.target)) { //same target
					if (touch.lastTapTime && (touch.startTime - touch.lastTapTime) < options.tabMaxInterval) {
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
	 * mui gesture tab
	 */
	$.registerGesture({
		name: name,
		index: 30,
		handle: handle,
		options: {
			tabMaxInterval: 300,
			tabMaxDistance: 5,
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
(function($) {
    function detect(ua) {
        this.os = {};
        var funcs = [function() {//android
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                if (android) {
                    this.os.android = true;
                    this.os.version = android[2];
                }
                return this.os.android === true;
            }, function() {//ios
                var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
                if (iphone) {//iphone
                    this.os.ios = this.os.iphone = true;
                    this.os.version = iphone[2].replace(/_/g, '.');
                } else {
                    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                    if (ipad) {//ipad
                        this.os.ios = this.os.ipad = true;
                        this.os.version = ipad[2].replace(/_/g, '.');
                    }
                }
                return this.os.ios === true;
            }];
        [].every.call(funcs, function(func) {
            return !func.call($);
        });
    }
    detect.call($, navigator.userAgent);
})(mui);

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
			doubletap: true,
			longtap: true,
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
 * mui.init pulldownRefresh
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    $.init.add(function() {
        var options = $.options;
        var pullRefreshOptions = options.pullRefresh || {};

        //需要判断是否为plus，这个需要等一下；
        setTimeout(function() {
            if($.os.plus && $.os.android){
                //只要是android手机，必须使用原生的下拉刷新；
                if(pullRefreshOptions.down){
                    $.plus_pulldownRefresh(pullRefreshOptions.down);
                }
                if(pullRefreshOptions.up){
                    var container = pullRefreshOptions.container;
                    if (container) {
                        var $container = $(container);
                        if ($container.length === 1) {
                            $container.pullRefresh(pullRefreshOptions);
                        }
                    }
                }
            }else{
                var container = pullRefreshOptions.container;
                if (container) {
                    var $container = $(container);
                    if ($container.length === 1) {
                        $container.pullRefresh(pullRefreshOptions);
                    }
                }
            }
        }, 1000);    

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

/**
 * pullRefresh plugin
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, undefined) {

	var CLASS_PULL_TOP_POCKET = 'mui-pull-top-pocket';
	var CLASS_PULL_BOTTOM_POCKET = 'mui-pull-bottom-pocket';
	var CLASS_PULL = 'mui-pull';
	var CLASS_PULL_ARROW = 'mui-pull-arrow';
	var CLASS_PULL_LOADING = 'mui-pull-loading';
	var CLASS_PULL_CAPTION = 'mui-pull-caption';
	var CLASS_PULL_CAPTION_DOWN = CLASS_PULL_CAPTION + '-down';
	var CLASS_PULL_CAPTION_OVER = CLASS_PULL_CAPTION + '-over';
	var CLASS_PULL_CAPTION_REFRESH = CLASS_PULL_CAPTION + '-refresh';

	var CLASS_ICON = 'mui-icon';
	var CLASS_ICON_SPINNER = 'mui-icon-spinner-cycle';
	var CLASS_ICON_PULLDOWN = 'mui-icon-pulldown';
	var CLASS_SPIN = 'mui-spin';

	var CLASS_IN = 'mui-in';
	var CLASS_REVERSE = 'mui-reverse';

	var CLASS_HIDDEN = 'mui-hidden';

	var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN + ' ' + CLASS_REVERSE;
	var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
	var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_SPINNER + ' ' + CLASS_SPIN;
	var defaultOptions = {
		down: {
			height: 50,
			contentdown: '下拉可刷新',
			contentover: '释放立即刷新',
			contentrefresh: '正在刷新...'
		},
		up: {
			height: 50,
			contentdown: '上拉显示更多',
			contentover: '释放立即刷新',
			contentrefresh: '正在加载...',
			duration: 300
		}
	};
	var html = ['<div class="' + CLASS_PULL + '">', '<div class="' + CLASS_LOADING_DOWN + '"></div>', '<div class="' + CLASS_PULL_CAPTION + '">', '<span class="' + CLASS_PULL_CAPTION_DOWN + ' ' + CLASS_IN + '">{downCaption}</span>', '<span class="' + CLASS_PULL_CAPTION_OVER + '">{overCaption}</span>', '<span class="' + CLASS_PULL_CAPTION_REFRESH + '">{refreshCaption}</span>', '</div>', '</div>'];

	var PullRefresh = function(element, options) {
		this.element = element;
		this.options = $.extend(defaultOptions, options, true);
		this.options.up.height = -this.options.up.height;
		this.pullOptions = null;

		this.init();

	};
	PullRefresh.prototype.init = function() {
		this.element.style.webkitTransform = 'translate3d(0,0,0)';
		this.element.style.position = 'relative';
		this.element.style['-webkit-backface-visibility'] = 'hidden';
		this.translateY = 0;
		this.lastTranslateY = 0;

		this.initPocket();
		this.initEvent();
	};
	PullRefresh.prototype.initPocket = function() {
		var options = this.options;
		if (options.down && options.down.hasOwnProperty('callback')&&!($.os.plus&&$.os.android)) {
			this.topPocket = this.element.querySelector('.' + CLASS_PULL_TOP_POCKET);
			if (!this.topPocket) {
				this.topPocket = this.createPocket(CLASS_PULL_TOP_POCKET, options.down);
				this.element.insertBefore(this.topPocket, this.element.firstChild);
			}
		}
		if (options.up && options.up.hasOwnProperty('callback')) {
			this.bottomPocket = this.element.querySelector('.' + CLASS_PULL_BOTTOM_POCKET);
			if (!this.bottomPocket) {
				this.bottomPocket = this.createPocket(CLASS_PULL_BOTTOM_POCKET, options.up);
				this.element.appendChild(this.bottomPocket);
			}
		}
	};
	PullRefresh.prototype.createPocket = function(clazz, options) {
		var pocket = document.createElement('div');
		pocket.className = clazz;
		pocket.innerHTML = html.join('').replace('{downCaption}', options.contentdown).replace('{overCaption}', options.contentover).replace('{refreshCaption}', options.contentrefresh);
		return pocket;
	};
	PullRefresh.prototype.initEvent = function() {
		var self = this;
		if (self.bottomPocket) {
			if (self.options.up.draggable) {
				self.element.addEventListener('dragup', function(e) {
					self.dragUp(e);
				});
			} else {
				var callback = self.options.up.callback;
				if (callback) {
					var scrolling = false;
					var isLoading = false;
					setInterval(function() {
						if (scrolling) {
							scrolling = false;
							if (isLoading) return;
							var scrollHeight = document.body.scrollHeight;
							if (window.innerHeight + window.scrollY + 5 > scrollHeight) {
								self.isLoading = isLoading = true;
								$.gestures.stoped = true;
								//window.scrollTo(0, scrollHeight);
								self.pullOptions = self.options.up;
								self.loading = self.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
								self.setCaption(CLASS_PULL_CAPTION_REFRESH);
								callback(function() {
									self.isLoading = isLoading = false;
									self.setCaption(CLASS_PULL_CAPTION_DOWN);
									self.pullOptions = null;
								});
							}
						}
					}, 250);

					window.addEventListener('scroll', function() {
						scrolling = true;
					});
					window.addEventListener('touchmove', function() {
						scrolling = true;
					});
				}

			}
			//			if ($.os.plus) {
			//				var pocket = self.bottomPocket;
			//				pocket.style.display = "none";
			//				//图标需要显示出来
			//				pocket.querySelector('.' + CLASS_PULL_LOADING).className = CLASS_LOADING + ' mui-active';
			//				//不需要这么多节点，只显示正在加载即可；
			//				pocket.querySelector('.' + CLASS_PULL_CAPTION).removeChild(pocket.querySelector('.' + CLASS_PULL_CAPTION_DOWN));
			//				pocket.querySelector('.' + CLASS_PULL_CAPTION).removeChild(pocket.querySelector('.' + CLASS_PULL_CAPTION_OVER));
			//				pocket.querySelector('.' + CLASS_PULL_CAPTION_REFRESH).classList.add('mui-in');;
			//				document.addEventListener('plusscrollbottom', function() {
			//					if (self.isLoading) return;
			//					self.isLoading = true;
			//					pocket.style.display = "block";
			//					var callback = self.options.up.callback;
			//					callback && callback(function() {
			//						pocket.style.display = "none";
			//						self.isLoading = false;
			//					});
			//				}, false);
			//			} else {
			//				self.element.addEventListener('dragup', function(e) {
			//					self.dragUp(e);
			//				});
			//			}
		}
		if (self.topPocket) {
			self.element.addEventListener('dragdown', function(e) {
				self.dragDown(e);
			});
		}
		if ((self.bottomPocket && self.options.up.draggable === true) || self.topPocket) {
			self.element.addEventListener('dragstart', function(e) {
				self.dragStart(e);
			});
			self.element.addEventListener('drag', function(e) {
				var direction = e.detail.direction;
				//左右拖动处理逻辑？
				if (self.dragDirection && direction !== 'up' && direction !== 'down') {
					if (self.pullOptions) {
						if (self.pullOptions.height > 0) {
							self.dragDown(e);
						} else {
							self.dragUp(e);
						}
					}
				}
			});
			self.element.addEventListener('dragend', function(e) {
				self.dragEnd(e);
			});
		}
	};
	PullRefresh.prototype.dragStart = function(e) {
		var detail = e.detail;
		if (detail.direction === 'up' || detail.direction === 'down') {
			this.element.style.webkitTransitionDuration = '0s';
			this.isLoading = this.dragDirection = false;
		}
	};
	PullRefresh.prototype.dragUp = function(e) {
		var self = this;
		if (self.isLoading || self.dragDirection === 'down') {
			return;
		}
		var scrollHeight = document.body.scrollHeight;
		if (!self.dragDirection && window.innerHeight + window.scrollY + 40 < scrollHeight) {
			return;
		}
		window.scrollTo(0, scrollHeight);
		self.pullOptions = self.options.up;
		self.loading = self.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
		self.drag(e);
	};
	PullRefresh.prototype.dragDown = function(e) {
		var self = this;
		if (self.isLoading || self.dragDirection === 'up') {
			return;
		}
		var scrollY = window.scrollY;
		if (!self.dragDirection && scrollY > 5) {
			return;
		} else if (scrollY !== 0) {
			window.scrollTo(0, 0);
		}
		self.pullOptions = self.options.down;
		self.loading = self.topPocket.querySelector('.' + CLASS_PULL_LOADING);
		self.drag(e);
	};
	PullRefresh.prototype.drag = function(e) {
		if (!this.pullOptions) {
			return;
		}
		if (this.pullOptions.height > 0) {
			if (e.detail.deltaY < 0) {
				return;
			}
		}

		this.dragDirection = this.pullOptions.height > 0 ? 'down' : 'up';
		if (!this.requestAnimationFrame) {
			this.updateTranslate();
		}
		e.detail.gesture.preventDefault();
		this.translateY = e.detail.deltaY * 0.4;
	};
	PullRefresh.prototype.dragEnd = function(e) {
		var self = this;
		if (self.pullOptions) {
			cancelAnimationFrame(self.requestAnimationFrame);
			//移动距离够了，就刷新，否则就啥都不干，恢复到原始状态；
			if (Math.abs(e.detail.deltaY * 0.4) >= Math.abs(self.pullOptions.height)) {
				self.load();
			} else {
				this.hide();
			}
			$.gestures.stoped = true;
		}

	};
	PullRefresh.prototype.hide = function() {
		this.translateY = 0;
		if (this.requestAnimationFrame) {
			//在dragEnd中已经调用过了，可能重复了
			cancelAnimationFrame(this.requestAnimationFrame);
			this.requestAnimationFrame = null;
		}
		this.element.style.webkitTransitionDuration = '0.5s';
		this.setTranslate(0);
		//恢复到正常状态，下拉可刷新
		this.setCaption(CLASS_PULL_CAPTION_DOWN);
		if (this.pullOptions && this.pullOptions.height > 0) {
			this.loading.classList.remove(CLASS_REVERSE);
		}
		this.pullOptions = null;
	};
	PullRefresh.prototype.updateTranslate = function() {
		var self = this;
		if (self.translateY !== self.lastTranslateY) {
			self.translateY = Math.abs(self.translateY) < 2 ? 0 : self.translateY;
			self.setTranslate(self.translateY);
			if (Math.abs(self.translateY) >= Math.abs(self.pullOptions.height)) {
				self.setCaption(CLASS_PULL_CAPTION_OVER);
			} else {
				self.setCaption(CLASS_PULL_CAPTION_DOWN);
			}
			self.lastTranslateY = self.translateY;
		}
		self.requestAnimationFrame = requestAnimationFrame(function() {
			self.updateTranslate();
		});
	};
	PullRefresh.prototype.setTranslate = function(height) {
		this.element.style.webkitTransform = 'translate3d(0,' + height + 'px,0)';
		if (this.bottomPocket) {
			if (height < 0) { //up
				this.bottomPocket.style.bottom = (height > this.pullOptions.height ? height : this.pullOptions.height) + 'px';
			} else if (height === 0) {
				//this.bottomPocket.removeAttribute('style');//靠，为啥5+里边remove不掉呢
				this.bottomPocket.setAttribute('style', '');
			}
		}
	};

	PullRefresh.prototype.load = function() {
		var self = this;
		self.isLoading = true;
		self.setCaption(CLASS_PULL_CAPTION_REFRESH);
		self.setTranslate(self.pullOptions.height);
		var callback = self.pullOptions.callback;
		callback && callback(function() {
			if (self.pullOptions && self.pullOptions.height < 0) {
				//self.bottomPocket.classList.add(CLASS_HIDDEN);
				var duration = Math.min(1000, self.pullOptions.duration);
				setTimeout(function() {
					$.scrollTo(document.body.scrollHeight - window.innerHeight, duration, function() {
						self.isLoading = false;
						//self.bottomPocket.classList.remove(CLASS_HIDDEN);
					});
				}, 100);
			} else {
				self.isLoading = false;
			}
			self.hide();
		});
	};

	// PullRefresh.prototype.showLoading = function(className) {
	// 	this.setCaption(className);

	// };
	// PullRefresh.prototype.hideLoading = function(className) {
	// 	this.setCaption(className);
	// };

	PullRefresh.prototype.setCaption = function(className) {
		var pocket = this.pullOptions && this.pullOptions.height > 0 ? this.topPocket : this.bottomPocket;
		if (pocket) {
			var caption = pocket.querySelector('.' + CLASS_PULL_CAPTION);
			var last = caption.querySelector('.' + CLASS_IN);
			if (last) {
				last.classList.remove(CLASS_IN);
			}
			var active = caption.querySelector('.' + className);
			if (active) {
				active.classList.add(CLASS_IN);
			}
			if (this.pullOptions && this.pullOptions.height > 0) {
				if (className === CLASS_PULL_CAPTION_REFRESH) {
					this.loading.className = CLASS_LOADING;
				} else if (className === CLASS_PULL_CAPTION_OVER) {
					this.loading.className = CLASS_LOADING_UP;
				} else {
					this.loading.className = CLASS_LOADING_DOWN;
				}
			} else {
				if (className === CLASS_PULL_CAPTION_REFRESH) {
					this.loading.className = CLASS_LOADING + ' ' + CLASS_IN;
				} else {
					this.loading.className = CLASS_LOADING;
				}
			}
		}
	};

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
/**
 * pulldownRefresh 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	var pulldownOptions = {
		height : 50,
		contentdown : '下拉可以刷新',
		contentover : '释放立即刷新',
		contentrefresh : '正在刷新...'
	}

	$.plus_pulldownRefresh = function(options) {
		options = $.extend(pulldownOptions, options, true);
		$.plusReady(function() {
			var self = document.body;
			var id = self.getAttribute('data-pullrefresh-plus');
			if (!id) {//避免重复初始化5+ pullrefresh
				id = ++$.uuid;
				self.setAttribute('data-pullrefresh-plus', id);
				var sw = $.currentWebview;
				sw.setPullToRefresh({
					support : true,
					height : options.height + 'px',
					range : "200px",
					contentdown : {
						caption : options.contentdown
					},
					contentover : {
						caption : options.contentover
					},
					contentrefresh : {
						caption : options.contentrefresh
					}
				}, function() {
					options.callback && options.callback(function() {
						sw.endPullToRefresh();
					});
				});

			}
		});
	};
})(mui);


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
	var CLASS_SLIDER = 'mui-slider';
	var CLASS_SWITCH = 'mui-switch';
	var CLASS_TABLE_VIEW_CELL = 'mui-table-view-cell';
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
				if (classList.contains(CLASS_SWITCH)) { //switch
					break;
				}
				if (classList.contains(CLASS_TABLE_VIEW_CELL)) { //swipe table view cell
					if (target.querySelector('.' + CLASS_SLIDER_HANDLE)) {
						break;
					}
				}
				if (classList.contains(CLASS_SLIDER)) { //slider
					break;
				}
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
 * Slider (TODO resize)
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	var CLASS_SLIDER = 'mui-slider';
	var CLASS_SLIDER_GROUP = 'mui-slider-group';
	var CLASS_SLIDER_LOOP = 'mui-slider-loop';
	var CLASS_SLIDER_INDICATOR = 'mui-slider-indicator';
	var CLASS_ACTION_PREVIOUS = 'mui-action-previous';
	var CLASS_ACTION_NEXT = 'mui-action-next';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';
	var CLASS_SLIDER_ITEM_DUPLICATE = CLASS_SLIDER_ITEM + '-duplicate';

	var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
	var SELECTOR_SLIDER_ITEM_DUPLICATE = '.' + CLASS_SLIDER_ITEM_DUPLICATE;
	var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
	var SELECTOR_SLIDER_PROGRESS_BAR = '.mui-slider-progress-bar';


	var Slider = function(element, options) {
		this.element = element;
		this.options = $.extend({
			slideshowDelay: 0, //设置为0，则不定时轮播
			factor: 1
		}, options);

		this.init();
	};
	Slider.prototype.init = function() {
		//		this.initDuplicate();
		this.initEvent();
		this.initTimer();
	};
	Slider.prototype.refresh = function(options) {
		var newOptions = $.extend({
			slideshowDelay: 0, //设置为0，则不定时轮播
			factor: 1
		}, options);
		if (this.options.slideshowDelay != newOptions.slideshowDelay) {
			this.options.slideshowDelay = newOptions.slideshowDelay;
			if (this.options.slideshowDelay) {
				this.nextItem();
			}
		}
	};
	//TODO 暂时不做自动clone
	//	Slider.prototype.initDuplicate = function() {
	//		var self = this;
	//		var element = self.element;
	//		if (element.classList.contains(CLASS_SLIDER_LOOP)) {
	//			var duplicates = element.getElementsByClassName(CLASS_SLIDER_ITEM_DUPLICATE);
	//		}
	//	};
	Slider.prototype.initEvent = function() {
		var self = this;
		var element = self.element;
		var slider = element.parentNode;
		self.translateX = 0;
		self.sliderWidth = element.offsetWidth;
		self.isLoop = element.classList.contains(CLASS_SLIDER_LOOP);
		self.sliderLength = element.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
		self.progressBarWidth = 0;
		self.progressBar = slider.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
		if (self.progressBar) {
			self.progressBarWidth = self.progressBar.offsetWidth;
		}
		//slider
		var isDragable = false;
		self.isSwipeable = false;
		slider.addEventListener('dragstart', function(event) {
			var detail = event.detail;
			var direction = detail.direction;
			if (direction == 'left' || direction == 'right') { //reset
				isDragable = true;
				self.translateX = self.lastTranslateX = 0;
				self.scrollX = self.getScroll();
				self.sliderWidth = element.offsetWidth;
				self.isLoop = element.classList.contains(CLASS_SLIDER_LOOP);
				self.sliderLength = element.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
				if (self.progressBar) {
					self.progressBarWidth = self.progressBar.offsetWidth;
				}
				self.maxTranslateX = ((self.sliderLength - 1) * self.sliderWidth);
				event.detail.gesture.preventDefault();
			}
		});
		slider.addEventListener('drag', function(event) {
			if (isDragable) {
				self.dragItem(event);
			}

		});
		slider.addEventListener('dragend', function(event) {
			if (isDragable) {
				self.gotoItem(self.getSlideNumber());
				isDragable = self.isSwipeable = false;
			}
		});
		slider.addEventListener('swipeleft', function(event) {
			if (self.isSwipeable) {
				//stop dragend
				$.gestures.stoped = true;
				self.nextItem();
				isDragable = self.isSwipeable = false;
				event.stopImmediatePropagation();
			}
		});
		slider.addEventListener('swiperight', function(event) {
			if (self.isSwipeable) {
				//stop dragend
				$.gestures.stoped = true;
				self.prevItem();
				isDragable = self.isSwipeable = false;
				event.stopImmediatePropagation();
			}
		});
		slider.addEventListener('slide', function(e) {
			var detail = e.detail;
			detail.slideNumber = detail.slideNumber || 0;
			var number = slider.querySelector('.mui-slider-indicator .mui-number span');
			if (number) {
				number.innerText = (detail.slideNumber + 1);
			}

			var indicators = slider.querySelectorAll('.mui-slider-indicator .mui-indicator');
			for (var i = 0, len = indicators.length; i < len; i++) {
				indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove']('mui-active');
			}

			var controlItems = slider.querySelectorAll('.mui-control-item');
			for (var i = 0, len = controlItems.length; i < len; i++) {
				controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove']('mui-active');
			}
		});
		slider.addEventListener($.eventName('shown', 'tab'), function(e) { //tab
			self.gotoItem(-(e.detail.tabNumber || 0));
		});
		//indicator
		var indicator = element.parentNode.querySelector(SELECTOR_SLIDER_INDICATOR);
		if (indicator) {
			indicator.addEventListener('tap', function(event) {
				var target = event.target;
				if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
					self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
					event.stopPropagation();
				}
			});
		}
	};
	Slider.prototype.dragItem = function(event) {
		var self = this;
		var detail = event.detail;

		if (detail.deltaX !== detail.lastDeltaX) {
			var translate = (detail.deltaX * self.options.factor + self.scrollX);
			self.element.style['-webkit-transition-duration'] = '0';
			var min = 0;
			var max = -self.maxTranslateX;
			if (self.isLoop) {
				min = self.sliderWidth;
				max = max + min;
			}
			if (translate > min || translate < max) {
				self.isSwipeable = false;
				return;
			}
			if (!self.requestAnimationFrame) {
				self.updateTranslate();
			}
			self.isSwipeable = true;
			self.translateX = translate;
		}
		if (self.timer) {
			clearTimeout(self.timer);
		}
		self.timer = setTimeout(function() {
			self.initTimer();
		}, 100);

	};
	Slider.prototype.updateTranslate = function() {
		var self = this;
		if (self.lastTranslateX !== self.translateX) {
			self.setTranslate(self.translateX);
			self.lastTranslateX = self.translateX;
		}
		self.requestAnimationFrame = requestAnimationFrame(function() {
			self.updateTranslate();
		});
	};
	Slider.prototype.setTranslate = function(x) {
		this.element.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
		this.updateProcess(x);
	}
	Slider.prototype.updateProcess = function(translate) {
		var progressBarWidth = this.progressBarWidth;
		if (progressBarWidth) {
			translate = Math.abs(translate);
			this.setProcess(translate * (progressBarWidth / this.sliderWidth));
		}
	};
	Slider.prototype.setProcess = function(translate) {
		var progressBar = this.progressBar;
		if (progressBar) {
			progressBar.style.webkitTransform = 'translate3d(' + translate + 'px,0,0)';
		}
	};
	/**
	 * 下一个轮播
	 * @returns {Number}
	 */
	Slider.prototype.nextItem = function() {
		this.gotoItem(this.getCurrentSlideNumber('next') - 1);
	};
	/**
	 * 上一个轮播
	 * @returns {Number}
	 */
	Slider.prototype.prevItem = function() {
		this.gotoItem(this.getCurrentSlideNumber('prev') + 1);
	};
	/**
	 * 滑动到指定轮播
	 * @param {type} slideNumber
	 * @returns {undefined}
	 */
	Slider.prototype.gotoItem = function(slideNumber) {
		if (!(slideNumber === 1 && this.getSlideNumber() === slideNumber)) {
			slideNumber = slideNumber > 0 ? -slideNumber : slideNumber;
		}
		var self = this;
		var slider = self.element;
		var slideLength = self.sliderLength;
		if (self.isLoop) { //循环轮播需减去2个过渡元素
			slideLength = slideLength - 2;
		} else {
			slideLength = slideLength - 1;
			slideNumber = Math.min(0, slideNumber);
			slideNumber = Math.max(slideNumber, -slideLength);
		}
		if (self.requestAnimationFrame) {
			cancelAnimationFrame(self.requestAnimationFrame);
			self.requestAnimationFrame = null;
		}
		var offsetX = Math.max(slideNumber, -slideLength) * slider.offsetWidth;
		slider.style['-webkit-transition-duration'] = '.2s';
		self.setTranslate(offsetX);
		//		slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
		//		self.updateProcess(offsetX);
		var fixedLoop = function() {
			slider.style['-webkit-transition-duration'] = '0';
			slider.style.webkitTransform = 'translate3d(' + (slideNumber * slider.offsetWidth) + 'px,0,0)';
			slider.removeEventListener('webkitTransitionEnd', fixedLoop);
		};
		slider.removeEventListener('webkitTransitionEnd', fixedLoop);
		if (self.isLoop) { //循环轮播自动重新定位
			if (slideNumber === 1 || slideNumber === -slideLength) {
				slideNumber = slideNumber === 1 ? (-slideLength + 1) : 0;
				slider.addEventListener('webkitTransitionEnd', fixedLoop);
			}
		}
		$.trigger(slider.parentNode, 'slide', {
			slideNumber: Math.abs(slideNumber)
		});
		this.initTimer();
	};

	/**
	 * 计算轮播应该处于的位置(四舍五入)
	 * @returns {Number}
	 */
	Slider.prototype.getSlideNumber = function() {
		return (Math.round(this.getScroll() / this.sliderWidth));
	};
	/**
	 * 当前所处位置
	 * @param {type} type
	 * @returns {unresolved}
	 */
	Slider.prototype.getCurrentSlideNumber = function(type) {
		return (Math[type === 'next' ? 'ceil' : 'floor'](this.getScroll() / this.sliderWidth));
	};
	/**
	 * 获取当前滚动位置
	 * @returns {Number}
	 */
	Slider.prototype.getScroll = function() {
		var slider = this.element;
		var scroll = 0;
		if ('webkitTransform' in slider.style) {
			var result = $.parseTranslate(slider.style.webkitTransform);
			scroll = result ? result.x : 0;
		}
		return scroll;
	};
	/**
	 * 自动轮播
	 * @returns {undefined}
	 */
	Slider.prototype.initTimer = function() {
		var self = this;
		var slideshowDelay = self.options.slideshowDelay;
		if (slideshowDelay) {
			var slider = self.element;
			var slidershowTimer = slider.getAttribute('data-slidershowTimer');
			slidershowTimer && window.clearTimeout(slidershowTimer);
			slidershowTimer = window.setTimeout(function() {
				if (!slider) {
					return;
				}
				//仅slider显示状态进行自动轮播
				if (!!(slider.offsetWidth || slider.offsetHeight)) {
					self.nextItem();
					//下一个
				}
				self.initTimer();
			}, slideshowDelay);
			slider.setAttribute('data-slidershowTimer', slidershowTimer);
		}

	};

	$.fn.slider = function(options) {
		//新增定时轮播 重要：remove该轮播时，请获取data-slidershowTimer然后手动clearTimeout
		var slider = null;
		this.each(function() {
			var sliderGroup = this;
			if (this.classList.contains(CLASS_SLIDER)) {
				sliderGroup = this.querySelector('.' + CLASS_SLIDER_GROUP);
			}
			var id = sliderGroup.getAttribute('data-slider');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = slider = new Slider(sliderGroup, options);
				sliderGroup.setAttribute('data-slider', id);
			} else {
				slider = $.data[id];
				if (slider && options) {
					slider.refresh(options);
				}
			}
		});
		return slider;
	};
	$.ready(function() {
		$('.mui-slider-group').slider();
	});
})(mui, window);
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
	};

	window.addEventListener($.EVENT_START, function(e) {
		toggle = $.targets.toggle;
		if (toggle) {
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
	window.addEventListener('dragstart', function(event) {
		if (!sliderHandle) {
			return;
		}
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
	});
	window.addEventListener('drag', function(event) {
		if (isDraging) {
			if (!sliderRequestAnimationFrame) {
				updateTranslate();
			}
			translateX = event.detail.deltaX * factor;
			event.detail.gesture.preventDefault();
		}
	});

	window.addEventListener('dragend', function(event) {
		if (isDraging) {
			endDraging(false, event.detail);
		}
	});
	window.addEventListener('swiperight', function(event) {
		if (sliderHandle) {
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
				event.stopImmediatePropagation();
				endDraging(true, event.detail);
			}
		}
	});
	window.addEventListener('swipeleft', function(event) {
		if (sliderHandle) {
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
				event.stopImmediatePropagation();
				endDraging(true, event.detail);
			}
		}
	});
	window.addEventListener('touchend', function(event) { //使用touchend来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
		if (!cell) {
			return;
		}
		toggleActive(false);
	});
	window.addEventListener('touchcancel', function(event) { //使用touchcancel来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
		if (!cell) {
			return;
		}
		toggleActive(false);
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
			if ($.targets.toggle) {
				return;
			}
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