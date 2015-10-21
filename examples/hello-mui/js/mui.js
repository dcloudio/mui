/*!
 * =====================================================
 * Mui v2.5.0 (http://dev.dcloud.net.cn/mui)
 * =====================================================
 */
/**
 * MUI核心JS
 * @type _L4.$|Function
 */
var mui = (function(document, undefined) {
	var readyRE = /complete|loaded|interactive/;
	var idSelectorRE = /^#([\w-]+)$/;
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
		if (typeof selector === 'string') {
			try {
				selector = selector.trim();
				if (idSelectorRE.test(selector)) {
					var found = document.getElementById(RegExp.$1);
					return wrap(found ? [found] : []);
				}
				return wrap($.qsa(selector, context), selector);
			} catch (e) {}
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
	$.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !$.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $.isPlainObject(src) ? src : {};
						}

						target[name] = $.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};
	/**
	 * mui noop(function)
	 */
	$.noop = function() {};
	/**
	 * mui slice(array)
	 */
	$.slice = [].slice;
	/**
	 * mui filter(array)
	 */
	$.filter = [].filter;

	$.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * mui isArray
	 */
	$.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	/**
	 * mui isWindow(需考虑obj为undefined的情况)
	 */
	$.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};
	/**
	 * mui isObject
	 */
	$.isObject = function(obj) {
		return $.type(obj) === "object";
	};
	/**
	 * mui isPlainObject
	 */
	$.isPlainObject = function(obj) {
		return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	/**
	 * mui isEmptyObject
	 * @param {Object} o
	 */
	$.isEmptyObject = function(o) {
		for (var p in o) {
			if (p !== undefined) {
				return false;
			}
		}
		return true;
	};
	/**
	 * mui isFunction
	 */
	$.isFunction = function(value) {
		return $.type(value) === "function";
	};
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
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {_L8.$}
	 */
	$.each = function(elements, callback, hasOwnProperty) {
		if (!elements) {
			return this;
		}
		if (typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for (var key in elements) {
				if (hasOwnProperty) {
					if (elements.hasOwnProperty(key)) {
						if (callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if (callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	};
	$.focus = function(element) {
		if ($.os.ios) {
			setTimeout(function() {
				element.focus();
			}, 10);
		} else {
			element.focus();
		}
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
	$.hooks = {};
	$.addAction = function(type, hook) {
		var hooks = $.hooks[type];
		if (!hooks) {
			hooks = [];
		}
		hook.index = hook.index || 1000;
		hooks.push(hook);
		hooks.sort(function(a, b) {
			return a.index - b.index;
		});
		$.hooks[type] = hooks;
		return $.hooks[type];
	};
	$.doAction = function(type, callback) {
		if ($.isFunction(callback)) { //指定了callback
			$.each($.hooks[type], callback);
		} else { //未指定callback，直接执行
			$.each($.hooks[type], function(index, hook) {
				return !hook.handle();
			});
		}
	};
	/**
	 * setTimeout封装
	 * @param {Object} fn
	 * @param {Object} when
	 * @param {Object} context
	 * @param {Object} data
	 */
	$.later = function(fn, when, context, data) {
		when = when || 0;
		var m = fn;
		var d = data;
		var f;
		var r;

		if (typeof fn === 'string') {
			m = context[fn];
		}

		f = function() {
			m.apply(context, $.isArray(d) ? d : [d]);
		};

		r = setTimeout(f, when);

		return {
			id: r,
			cancel: function() {
				clearTimeout(r);
			}
		};
	};
	$.now = Date.now || function() {
		return +new Date();
	};
	var class2type = {};
	$.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	if (window.JSON) {
		$.parseJSON = JSON.parse;
	}
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

	/**
	 * 兼容 AMD 模块
	 **/
	if (typeof define === 'function' && define.amd) {
		define('mui', [], function() {
			return $;
		});
	}

	return $;
})(document);
//window.mui = mui;
//'$' in window || (window.$ = mui);
/**
 * $.os
 * @param {type} $
 * @returns {undefined}
 */
(function($, window) {
	function detect(ua) {
		this.os = {};
		var funcs = [

			function() { //wechat
				var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
				if (wechat) { //wechat
					this.os.wechat = {
						version: wechat[2].replace(/_/g, '.')
					};
				}
				return false;
			},
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
(function($, document) {
	function detect(ua) {
		this.os = this.os || {};
		var plus = ua.match(/Html5Plus/i); //TODO 5\+Browser?
		if (plus) {
			this.os.plus = true;
			$(function() {
				document.body.classList.add('mui-plus');
			});
			if (ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
				this.os.stream = true;
				$(function() {
					document.body.classList.add('mui-plus-stream');
				});
			}
		}
	}
	detect.call($, navigator.userAgent);
})(mui, document);
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
	};

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
			for (var name in params) {
				(name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
			}
			evt.initEvent(event, bubbles, true);
			return evt;
		};
		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	}
})();
/*
	A shim for non ES5 supporting browsers.
	Adds function bind to Function prototype, so that you can do partial application.
	Works even with the nasty thing, where the first word is the opposite of extranet, the second one is the profession of Columbus, and the version number is 9, flipped 180 degrees.
*/

Function.prototype.bind = Function.prototype.bind || function(to) {
	// Make an array of our arguments, starting from second argument
	var partial = Array.prototype.splice.call(arguments, 1),
		// We'll need the original function.
		fn = this;
	var bound = function() {
			// Join the already applied arguments to the now called ones (after converting to an array again).
			var args = partial.concat(Array.prototype.splice.call(arguments, 0));
			// If not being called as a constructor
			if (!(this instanceof bound)) {
				// return the result of the function called bound to target and partially applied.
				return fn.apply(to, args);
			}
			// If being called as a constructor, apply the function bound to self.
			fn.apply(this, args);
		}
		// Attach the prototype of the function to our newly created function.
	bound.prototype = fn.prototype;
	return bound;
};
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
	if (!window.requestAnimationFrame) {
		var lastTime = 0;
		window.requestAnimationFrame = window.webkitRequestAnimationFrame || function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
		window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function(id) {
			clearTimeout(id);
		};
	};
}(window));
/**
 * fastclick(only for radio,checkbox)
 */
(function($, window, name) {
	if (window.FastClick) {
		return;
	}

	var handle = function(event, target) {
		if (target.tagName === 'LABEL') {
			if (target.parentNode) {
				target = target.parentNode.querySelector('input');
			}
		}
		if (target && (target.type === 'radio' || target.type === 'checkbox')) {
			if (!target.disabled) { //disabled
				return target;
			}
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
			event.detail && event.detail.gesture.preventDefault();
		}
	};
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
		var CLASS_BAR_TAB = 'mui-bar-tab';
		var CLASS_BAR_FOOTER = 'mui-bar-footer';
		var CLASS_BAR_FOOTER_SECONDARY = 'mui-bar-footer-secondary';
		var CLASS_BAR_FOOTER_SECONDARY_TAB = 'mui-bar-footer-secondary-tab';
		// var content = document.querySelector('.' + CLASS_CONTENT);
		// if (content) {
		// 	document.body.insertBefore(content, document.body.firstElementChild);
		// }
		document.addEventListener('focusin', function(e) {
			if ($.os.plus) { //在父webview里边不fix
				if (window.plus) {
					if (plus.webview.currentWebview().children().length > 0) {
						return;
					}
				}
			}
			var target = e.target;
			//TODO 需考虑所有键盘弹起的情况
			if (target.tagName && (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && (target.type === 'text' || target.type === 'search' || target.type === 'number')))) {
				if (target.disabled || target.readOnly) {
					return;
				}
				document.body.classList.add(CLASS_FOCUSIN);
				var isFooter = false;
				for (; target && target !== document; target = target.parentNode) {
					var classList = target.classList;
					if (classList && classList.contains(CLASS_BAR_TAB) || classList.contains(CLASS_BAR_FOOTER) || classList.contains(CLASS_BAR_FOOTER_SECONDARY) || classList.contains(CLASS_BAR_FOOTER_SECONDARY_TAB)) {
						isFooter = true;
						break;
					}
				}
				if (isFooter) {
					var scrollTop = document.body.scrollHeight;
					var scrollLeft = document.body.scrollLeft;
					setTimeout(function() {
						window.scrollTo(scrollLeft, scrollTop);
					}, 20);
				}
			}
		});
		document.addEventListener('focusout', function(e) {
			var classList = document.body.classList;
			if (classList.contains(CLASS_FOCUSIN)) {
				classList.remove(CLASS_FOCUSIN);
				setTimeout(function() {
					window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
				}, 20);
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
 * 仅提供简单的on，off(仅支持事件委托，不支持当前元素绑定，当前元素绑定请直接使用addEventListener,removeEventListener)
 * @param {Object} $
 */
(function($) {

	var _mid = 1;
	var delegates = {};
	//需要wrap的函数
	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};
	//默认true返回函数
	var returnTrue = function() {
		return true
	};
	//默认false返回函数
	var returnFalse = function() {
		return false
	};
	//wrap浏览器事件
	var compatible = function(event, target) {
		if (!event.detail) {
			event.detail = {
				currentTarget: target
			};
		} else {
			event.detail.currentTarget = target;
		}
		$.each(eventMethods, function(name, predicate) {
			var sourceMethod = event[name];
			event[name] = function() {
				this[predicate] = returnTrue;
				return sourceMethod && sourceMethod.apply(event, arguments)
			}
			event[predicate] = returnFalse;
		}, true);
		return event;
	};
	//简单的wrap对象_mid
	var mid = function(obj) {
		return obj && (obj._mid || (obj._mid = _mid++));
	};
	//事件委托对象绑定的事件回调列表
	var delegateFns = {};
	//返回事件委托的wrap事件回调
	var delegateFn = function(element, event, selector, callback) {
		return function(e) {
			//same event
			var callbackObjs = delegates[element._mid][event];
			var handlerQueue = [];
			var target = e.target;
			var selectorAlls = {};
			for (; target && target !== document; target = target.parentNode) {
				if (target === element) {
					break;
				}
				if (~['click', 'tap', 'doubletap', 'longtap', 'hold'].indexOf(event) && (target.disabled || target.classList.contains('mui-disabled'))) {
					break;
				}
				var matches = {};
				$.each(callbackObjs, function(selector, callbacks) { //same selector
					selectorAlls[selector] || (selectorAlls[selector] = $.qsa(selector, element));
					if (selectorAlls[selector] && ~(selectorAlls[selector]).indexOf(target)) {
						if (!matches[selector]) {
							matches[selector] = callbacks;
						}
					}
				}, true);
				if (!$.isEmptyObject(matches)) {
					handlerQueue.push({
						element: target,
						handlers: matches
					});
				}
			}
			selectorAlls = null;
			e = compatible(e); //compatible event
			$.each(handlerQueue, function(index, handler) {
				target = handler.element;
				var tagName = target.tagName;
				if (event === 'tap' && (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT')) {
					e.preventDefault();
					e.detail && e.detail.gesture && e.detail.gesture.preventDefault();
				}
				$.each(handler.handlers, function(index, handler) {
					$.each(handler, function(index, callback) {
						if (callback.call(target, e) === false) {
							e.preventDefault();
							e.stopPropagation();
						}
					}, true);
				}, true)
				if (e.isPropagationStopped()) {
					return false;
				}
			}, true);
		};
	};
	var findDelegateFn = function(element, event) {
		var delegateCallbacks = delegateFns[mid(element)];
		var result = [];
		if (delegateCallbacks) {
			result = [];
			if (event) {
				var filterFn = function(fn) {
					return fn.type === event;
				}
				return delegateCallbacks.filter(filterFn);
			} else {
				result = delegateCallbacks;
			}
		}
		return result;
	};
	var preventDefaultException = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;
	/**
	 * mui delegate events
	 * @param {type} event
	 * @param {type} selector
	 * @param {type} callback
	 * @returns {undefined}
	 */
	$.fn.on = function(event, selector, callback) { //仅支持简单的事件委托,主要是tap事件使用，类似mouse,focus之类暂不封装支持
		return this.each(function() {
			var element = this;
			mid(element);
			mid(callback);
			var isAddEventListener = false;
			var delegateEvents = delegates[element._mid] || (delegates[element._mid] = {});
			var delegateCallbackObjs = delegateEvents[event] || ((delegateEvents[event] = {}));
			if ($.isEmptyObject(delegateCallbackObjs)) {
				isAddEventListener = true;
			}
			var delegateCallbacks = delegateCallbackObjs[selector] || (delegateCallbackObjs[selector] = []);
			delegateCallbacks.push(callback);
			if (isAddEventListener) {
				var delegateFnArray = delegateFns[mid(element)];
				if (!delegateFnArray) {
					delegateFnArray = [];
				}
				var delegateCallback = delegateFn(element, event, selector, callback);
				delegateFnArray.push(delegateCallback);
				delegateCallback.i = delegateFnArray.length - 1;
				delegateCallback.type = event;
				delegateFns[mid(element)] = delegateFnArray;
				element.addEventListener(event, delegateCallback);
				if (event === 'tap') { //TODO 需要找个更好的解决方案
					element.addEventListener('click', function(e) {
						if (e.target) {
							var tagName = e.target.tagName;
							if (!preventDefaultException.test(tagName)) {
								if (tagName === 'A') {
									var href = e.target.href;
									if (!(href && ~href.indexOf('tel:'))) {
										e.preventDefault();
									}
								} else {
									e.preventDefault();
								}
							}
						}
					});
				}
			}
		});
	};
	$.fn.off = function(event, selector, callback) {
		return this.each(function() {
			var _mid = mid(this);
			if (!event) { //mui(selector).off();
				delegates[_mid] && delete delegates[_mid];
			} else if (!selector) { //mui(selector).off(event);
				delegates[_mid] && delete delegates[_mid][event];
			} else if (!callback) { //mui(selector).off(event,selector);
				delegates[_mid] && delegates[_mid][event] && delete delegates[_mid][event][selector];
			} else { //mui(selector).off(event,selector,callback);
				var delegateCallbacks = delegates[_mid] && delegates[_mid][event] && delegates[_mid][event][selector];
				$.each(delegateCallbacks, function(index, delegateCallback) {
					if (mid(delegateCallback) === mid(callback)) {
						delegateCallbacks.splice(index, 1);
						return false;
					}
				}, true);
			}
			if (delegates[_mid]) {
				//如果off掉了所有当前element的指定的event事件，则remove掉当前element的delegate回调
				if ((!delegates[_mid][event] || $.isEmptyObject(delegates[_mid][event]))) {
					findDelegateFn(this, event).forEach(function(fn) {
						this.removeEventListener(fn.type, fn);
						delete delegateFns[_mid][fn.i];
					}.bind(this));
				}
			} else {
				//如果delegates[_mid]已不存在，删除所有
				findDelegateFn(this).forEach(function(fn) {
					this.removeEventListener(fn.type, fn);
					delete delegateFns[_mid][fn.i];
				}.bind(this));
			}
		});

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
	$.gestures = {
		session: {}
	};
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
	 * register gesture
	 * @param {type} gesture
	 * @returns {$.gestures}
	 */
	$.addGesture = function(gesture) {
		return $.addAction('gestures', gesture);

	};

	var round = Math.round;
	var abs = Math.abs;
	var sqrt = Math.sqrt;
	var atan = Math.atan;
	var atan2 = Math.atan2;
	/**
	 * distance
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getDistance = function(p1, p2, props) {
		if (!props) {
			props = ['x', 'y'];
		}
		var x = p2[props[0]] - p1[props[0]];
		var y = p2[props[1]] - p1[props[1]];
		return sqrt((x * x) + (y * y));
	};
	/**
	 * scale
	 * @param {Object} starts
	 * @param {Object} moves
	 */
	var getScale = function(starts, moves) {
		if (starts.length >= 2 && moves.length >= 2) {
			var props = ['pageX', 'pageY'];
			return getDistance(moves[1], moves[0], props) / getDistance(starts[1], starts[0], props);
		}
		return 1;
	};
	/**
	 * angle
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getAngle = function(p1, p2, props) {
		if (!props) {
			props = ['x', 'y'];
		}
		var x = p2[props[0]] - p1[props[0]];
		var y = p2[props[1]] - p1[props[1]];
		return atan2(y, x) * 180 / Math.PI;
	};
	/**
	 * direction
	 * @param {Object} x
	 * @param {Object} y
	 */
	var getDirection = function(x, y) {
		if (x === y) {
			return '';
		}
		if (abs(x) >= abs(y)) {
			return x > 0 ? 'left' : 'right';
		}
		return y > 0 ? 'up' : 'down';
	};
	/**
	 * rotation
	 * @param {Object} start
	 * @param {Object} end
	 */
	var getRotation = function(start, end) {
		var props = ['pageX', 'pageY'];
		return getAngle(end[1], end[0], props) - getAngle(start[1], start[0], props);
	};
	/**
	 * px per ms
	 * @param {Object} deltaTime
	 * @param {Object} x
	 * @param {Object} y
	 */
	var getVelocity = function(deltaTime, x, y) {
		return {
			x: x / deltaTime || 0,
			y: y / deltaTime || 0
		};
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
		$.doAction('gestures', function(index, gesture) {
			if (!$.gestures.stoped) {
				if ($.options.gestureConfig[gesture.name] !== false) {
					gesture.handle(event, touch);
				}
			}
		});
	};
	/**
	 * 暂时无用
	 * @param {Object} node
	 * @param {Object} parent
	 */
	var hasParent = function(node, parent) {
		while (node) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};

	var uniqueArray = function(src, key, sort) {
		var results = [];
		var values = [];
		var i = 0;

		while (i < src.length) {
			var val = key ? src[i][key] : src[i];
			if (values.indexOf(val) < 0) {
				results.push(src[i]);
			}
			values[i] = val;
			i++;
		}

		if (sort) {
			if (!key) {
				results = results.sort();
			} else {
				results = results.sort(function sortUniqueArray(a, b) {
					return a[key] > b[key];
				});
			}
		}

		return results;
	};
	var getMultiCenter = function(touches) {
		var touchesLength = touches.length;
		if (touchesLength === 1) {
			return {
				x: round(touches[0].pageX),
				y: round(touches[0].pageY)
			};
		}

		var x = 0;
		var y = 0;
		var i = 0;
		while (i < touchesLength) {
			x += touches[i].pageX;
			y += touches[i].pageY;
			i++;
		}

		return {
			x: round(x / touchesLength),
			y: round(y / touchesLength)
		};
	};
	var multiTouch = function() {
		return $.options.gestureConfig.pinch;
	};
	var copySimpleTouchData = function(touch) {
		var touches = [];
		var i = 0;
		while (i < touch.touches.length) {
			touches[i] = {
				pageX: round(touch.touches[i].pageX),
				pageY: round(touch.touches[i].pageY)
			};
			i++;
		}
		return {
			timestamp: $.now(),
			gesture: touch.gesture,
			touches: touches,
			center: getMultiCenter(touch.touches),
			deltaX: touch.deltaX,
			deltaY: touch.deltaY
		};
	};

	var calDelta = function(touch) {
		var session = $.gestures.session;
		var center = touch.center;
		var offset = session.offsetDelta || {};
		var prevDelta = session.prevDelta || {};
		var prevTouch = session.prevTouch || {};

		if (touch.gesture.type === $.EVENT_START || touch.gesture.type === $.EVENT_END) {
			prevDelta = session.prevDelta = {
				x: prevTouch.deltaX || 0,
				y: prevTouch.deltaY || 0
			};

			offset = session.offsetDelta = {
				x: center.x,
				y: center.y
			};
		}
		touch.deltaX = prevDelta.x + (center.x - offset.x);
		touch.deltaY = prevDelta.y + (center.y - offset.y);
	};
	var calTouchData = function(touch) {
		var session = $.gestures.session;
		var touches = touch.touches;
		var touchesLength = touches.length;

		if (!session.firstTouch) {
			session.firstTouch = copySimpleTouchData(touch);
		}

		if (multiTouch() && touchesLength > 1 && !session.firstMultiTouch) {
			session.firstMultiTouch = copySimpleTouchData(touch);
		} else if (touchesLength === 1) {
			session.firstMultiTouch = false;
		}

		var firstTouch = session.firstTouch;
		var firstMultiTouch = session.firstMultiTouch;
		var offsetCenter = firstMultiTouch ? firstMultiTouch.center : firstTouch.center;

		var center = touch.center = getMultiCenter(touches);
		touch.timestamp = $.now();
		touch.deltaTime = touch.timestamp - firstTouch.timestamp;

		touch.angle = getAngle(offsetCenter, center);
		touch.distance = getDistance(offsetCenter, center);

		calDelta(touch);

		touch.offsetDirection = getDirection(touch.deltaX, touch.deltaY);

		touch.scale = firstMultiTouch ? getScale(firstMultiTouch.touches, touches) : 1;
		touch.rotation = firstMultiTouch ? getRotation(firstMultiTouch.touches, touches) : 0;

		calIntervalTouchData(touch);

	};
	var CAL_INTERVAL = 25;
	var calIntervalTouchData = function(touch) {
		var session = $.gestures.session;
		var last = session.lastInterval || touch;
		var deltaTime = touch.timestamp - last.timestamp;
		var velocity;
		var velocityX;
		var velocityY;
		var direction;

		if (touch.gesture.type != $.EVENT_CANCEL && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
			var deltaX = last.deltaX - touch.deltaX;
			var deltaY = last.deltaY - touch.deltaY;

			var v = getVelocity(deltaTime, deltaX, deltaY);
			velocityX = v.x;
			velocityY = v.y;
			velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
			direction = getDirection(deltaX, deltaY) || last.direction;

			session.lastInterval = touch;
		} else {
			velocity = last.velocity;
			velocityX = last.velocityX;
			velocityY = last.velocityY;
			direction = last.direction;
		}

		touch.velocity = velocity;
		touch.velocityX = velocityX;
		touch.velocityY = velocityY;
		touch.direction = direction;
	};
	var targetIds = {};
	var getTouches = function(event, touch) {
		var allTouches = $.slice.call(event.touches || event);

		var type = event.type;

		var targetTouches = [];
		var changedTargetTouches = [];

		//当touchstart或touchmove且touches长度为1，直接获得all和changed
		if ((type === $.EVENT_START || type === $.EVENT_MOVE) && allTouches.length === 1) {
			targetIds[allTouches[0].identifier] = true;
			targetTouches = allTouches;
			changedTargetTouches = allTouches;
			touch.target = event.target;
		} else {
			var i = 0;
			var targetTouches = [];
			var changedTargetTouches = [];
			var changedTouches = $.slice.call(event.changedTouches || event);

			touch.target = event.target;
			var sessionTarget = $.gestures.session.target || event.target;
			targetTouches = allTouches.filter(function(touch) {
				return hasParent(touch.target, sessionTarget);
			});

			if (type === $.EVENT_START) {
				i = 0;
				while (i < targetTouches.length) {
					targetIds[targetTouches[i].identifier] = true;
					i++;
				}
			}

			i = 0;
			while (i < changedTouches.length) {
				if (targetIds[changedTouches[i].identifier]) {
					changedTargetTouches.push(changedTouches[i]);
				}
				if (type === $.EVENT_END || type === $.EVENT_CANCEL) {
					delete targetIds[changedTouches[i].identifier];
				}
				i++;
			}

			if (!changedTargetTouches.length) {
				return false;
			}
		}
		targetTouches = uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true);
		var touchesLength = targetTouches.length;
		var changedTouchesLength = changedTargetTouches.length;

		if (type === $.EVENT_START && touchesLength - changedTouchesLength === 0) { //first
			touch.isFirst = true;
			$.gestures.touch = $.gestures.session = {
				target: event.target
			};
		}
		touch.isFinal = ((type === $.EVENT_END || type === $.EVENT_CANCEL) && (touchesLength - changedTouchesLength === 0));

		touch.touches = targetTouches;
		touch.changedTouches = changedTargetTouches;
		return true;

	};
	var handleTouchEvent = function(event) {
		var touch = {
			gesture: event
		};
		var touches = getTouches(event, touch);
		if (!touches) {
			return;
		}
		calTouchData(touch);
		detect(event, touch);
		$.gestures.session.prevTouch = touch;
	};
	window.addEventListener($.EVENT_START, handleTouchEvent);
	window.addEventListener($.EVENT_MOVE, handleTouchEvent);
	window.addEventListener($.EVENT_END, handleTouchEvent);
	window.addEventListener($.EVENT_CANCEL, handleTouchEvent);
	//fixed hashchange(android)
	window.addEventListener($.EVENT_CLICK, function(e) {
		//TODO 应该判断当前target是不是在targets.popover内部，而不是非要相等
		if (($.targets.popover && e.target === $.targets.popover) || ($.targets.tab) || $.targets.offcanvas || $.targets.modal) {
			e.preventDefault();
		}
	}, true);


	//增加原生滚动识别
	$.isScrolling = false;
	var scrollingTimeout = null;
	window.addEventListener('scroll', function() {
		$.isScrolling = true;
		scrollingTimeout && clearTimeout(scrollingTimeout);
		scrollingTimeout = setTimeout(function() {
			$.isScrolling = false;
		}, 250);
	});
})(mui, window);
/**
 * mui gesture flick[left|right|up|down]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var flickStartTime = 0;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		var now = $.now();
		switch (event.type) {
			case $.EVENT_MOVE:
				if (now - flickStartTime > 300) {
					flickStartTime = now;
					session.flickStart = touch.center;
				}
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				if (session.flickStart && options.flickMaxTime > (now - flickStartTime) && touch.distance > options.flickMinDistince) {
					touch.flick = true;
					touch.flickTime = now - flickStartTime;
					touch.flickDistanceX = touch.center.x - session.flickStart.x;
					touch.flickDistanceY = touch.center.y - session.flickStart.y;
					$.trigger(session.target, name, touch);
					$.trigger(session.target, name + touch.direction, touch);
				}
				break;
		}

	};
	/**
	 * mui gesture flick
	 */
	$.addGesture({
		name: name,
		index: 5,
		handle: handle,
		options: {
			flickMaxTime: 200,
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
		var session = $.gestures.session;
		if (event.type === $.EVENT_END || event.type === $.EVENT_CANCEL) {
			var options = this.options;
			//TODO 后续根据velocity计算
			if (touch.direction && options.swipeMaxTime > touch.deltaTime && touch.distance > options.swipeMinDistince) {
				touch.swipe = true;
				$.trigger(session.target, name, touch);
				$.trigger(session.target, name + touch.direction, touch);
			}
		}
	};
	/**
	 * mui gesture swipe
	 */
	$.addGesture({
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
		var session = $.gestures.session;
		switch (event.type) {
			case $.EVENT_START:
				break;
			case $.EVENT_MOVE:
				if (!touch.direction) {
					return;
				}
				//修正direction,可在session期间自行锁定拖拽方向，方便开发scroll类不同方向拖拽插件嵌套
				if (session.lockDirection && session.startDirection) {
					if (session.startDirection && session.startDirection !== touch.direction) {
						if (session.startDirection === 'up' || session.startDirection === 'down') {
							touch.direction = touch.deltaY < 0 ? 'up' : 'down';
						} else {
							touch.direction = touch.deltaX < 0 ? 'left' : 'right';
						}
					}
				}

				if (!session.drag) {
					session.drag = true;
					$.trigger(session.target, name + 'start', touch);
				}
				$.trigger(session.target, name, touch);
				$.trigger(session.target, name + touch.direction, touch);
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				if (session.drag && touch.isFinal) {
					$.trigger(session.target, name + 'end', touch);
				}
				break;
		}
	};
	/**
	 * mui gesture drag
	 */
	$.addGesture({
		name: name,
		index: 20,
		handle: handle,
		options: {
			fingers: 1
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
	var lastTarget;
	var lastTapTime;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_END:
				if (!touch.isFinal) {
					return;
				}
				var target = session.target;
				if (!target || (target.disabled || (target.classList && target.classList.contains('mui-disabled')))) {
					return;
				}
				if (touch.distance < options.tapMaxDistance && touch.deltaTime < options.tapMaxTime) {
					if ($.options.gestureConfig.doubletap && lastTarget && (lastTarget === target)) { //same target
						if (lastTapTime && (touch.timestamp - lastTapTime) < options.tapMaxInterval) {
							$.trigger(target, 'doubletap', touch);
							lastTapTime = $.now();
							lastTarget = target;
							return;
						}
					}
					$.trigger(target, name, touch);
					lastTapTime = $.now();
					lastTarget = target;
				}
				break;
		}
	};
	/**
	 * mui gesture tap
	 */
	$.addGesture({
		name: name,
		index: 30,
		handle: handle,
		options: {
			fingers: 1,
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
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_START:
				clearTimeout(timer);
				timer = setTimeout(function() {
					$.trigger(session.target, name, touch);
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
	 * mui gesture longtap
	 */
	$.addGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			fingers: 1,
			holdTimeout: 500,
			holdThreshold: 2
		}
	});
})(mui, 'longtap');
/**
 * mui gesture hold
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var timer;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_START:
				if ($.options.gestureConfig.hold) {
					timer && clearTimeout(timer);
					timer = setTimeout(function() {
						touch.hold = true;
						$.trigger(session.target, name, touch);
					}, options.holdTimeout);
				}
				break;
			case $.EVENT_MOVE:
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				if (timer) {
					clearTimeout(timer) && (timer = null);
					$.trigger(session.target, 'release', touch);
				}
				break;
		}
	};
	/**
	 * mui gesture hold
	 */
	$.addGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			fingers: 1,
			holdTimeout: 0
		}
	});
})(mui, 'hold');
/**
 * mui gesture pinch
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var handle = function(event, touch) {
		var options = this.options;
		var session = $.gestures.session;
		switch (event.type) {
			case $.EVENT_START:
				break;
			case $.EVENT_MOVE:
				if ($.options.gestureConfig.pinch) {
					if (touch.touches.length < 2) {
						return;
					}
					if (!session.pinch) { //start
						session.pinch = true;
						$.trigger(session.target, name + 'start', touch);
					}
					$.trigger(session.target, name, touch);
					var scale = touch.scale;
					var rotation = touch.rotation;
					var lastScale = typeof touch.lastScale === 'undefined' ? 1 : touch.lastScale;
					var scaleDiff = 0.000000000001; //防止scale与lastScale相等，不触发事件的情况。
					if (scale > lastScale) { //out
						lastScale = scale - scaleDiff;
						$.trigger(session.target, name + 'out', touch);
					} //in
					else if (scale < lastScale) {
						lastScale = scale + scaleDiff;
						$.trigger(session.target, name + 'in', touch);
					}
					if (Math.abs(rotation) > options.minRotationAngle) {
						$.trigger(session.target, 'rotate', touch);
					}
				}
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				if ($.options.gestureConfig.pinch && session.pinch && touch.touches.length === 2) {
					session.pinch = false;
					$.trigger(session.target, name + 'end', touch);
				}
				break;
		}
	};
	/**
	 * mui gesture pinch
	 */
	$.addGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			minRotationAngle: 0
		}
	});
})(mui, 'pinch');
/**
 * mui.init
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.global = $.options = {
		gestureConfig: {
			tap: true,
			doubletap: false,
			longtap: false,
			hold: false,
			flick: true,
			swipe: true,
			drag: true,
			pinch: false
		}
	};
	/**
	 *
	 * @param {type} options
	 * @returns {undefined}
	 */
	$.initGlobal = function(options) {
		$.options = $.extend(true, $.global, options);
		return this;
	};
	var inits = {};

	var isInitialized = false;
	//TODO 自动调用init?因为用户自己调用init的时机可能不确定，如果晚于自动init，则会有潜在问题
	//	$.ready(function() {
	//		setTimeout(function() {
	//			if (!isInitialized) {
	//				$.init();
	//			}
	//		}, 300);
	//	});
	/**
	 * 单页配置 初始化
	 * @param {object} options
	 */
	$.init = function(options) {
		isInitialized = true;
		$.options = $.extend(true, $.global, options || {});
		$.ready(function() {
			$.doAction('inits', function(index, init) {
				var isInit = !!(!inits[init.name] || init.repeat);
				if (isInit) {
					init.handle.call($);
					inits[init.name] = true;
				}
			});
		});
		return this;
	};

	/**
	 * 增加初始化执行流程
	 * @param {function} init
	 */
	$.addInit = function(init) {
		return $.addAction('inits', init);
	};
	$(function() {
		var classList = document.body.classList;
		var os = [];
		if ($.os.ios) {
			os.push({
				os: 'ios',
				version: $.os.version
			});
			classList.add('mui-ios');
		} else if ($.os.android) {
			os.push({
				os: 'android',
				version: $.os.version
			});
			classList.add('mui-android');
		}
		if ($.os.wechat) {
			os.push({
				os: 'wechat',
				version: $.os.wechat.version
			});
			classList.add('mui-wechat');
		}
		if (os.length) {
			$.each(os, function(index, osObj) {
				var version = '';
				var classArray = [];
				if (osObj.version) {
					$.each(osObj.version.split('.'), function(i, v) {
						version = version + (version ? '-' : '') + v;
						classList.add($.className(osObj.os + '-' + version));
					});
				}
			});
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
		swipeBack: false,
		preloadPages: [], //5+ lazyLoad webview
		preloadLimit: 10, //预加载窗口的数量限制(一旦超出，先进先出)
		keyEventBind: {
			backbutton: true,
			menubutton: true
		}
	};

	//默认页面动画
	var defaultShow = {
		autoShow: true,
		duration: $.os.ios ? 200 : 100,
		aniShow: 'slide-in-right'
	};
	//若执行了显示动画初始化操作，则要覆盖默认配置
	if ($.options.show) {
		defaultShow = $.extend(true, defaultShow, $.options.show);
	}

	$.currentWebview = null;
	$.isHomePage = false;

	$.extend(true, $.global, defaultOptions);
	$.extend(true, $.options, defaultOptions);
	/**
	 * 等待动画配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.waitingOptions = function(options) {
		return $.extend(true,{},{autoShow: true,title: ''}, options);
	};
	/**
	 * 窗口显示配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.showOptions = function(options) {
		return $.extend(true,{},defaultShow, options);
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
			setTimeout(function() { //解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
				callback();
			}, 0);
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
			if (data !== '') {
				data = data || {};
				if ($.isPlainObject(data)) {
					data = JSON.stringify(data || {}).replace(/\'/g, "\\u0027").replace(/\\/g, "\\u005c");
				}
			}
			webview.evalJS("typeof mui!=='undefined'&&mui.receive('" + eventType + "','" + data + "')");
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
			try {
				if (data) {
					data = JSON.parse(data);
				}
			} catch (e) {}
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
	var trigger = function(webview, eventType, timeChecked) {
		if (timeChecked) {
			if (!webview[eventType + 'ed']) {
				$.fire(webview, eventType);
				var list = webview.children();
				for (var i = 0; i < list.length; i++) {
					$.fire(list[i], eventType);
				}
				webview[eventType + 'ed'] = true;
			}
		} else {
			$.fire(webview, eventType);
			var list = webview.children();
			for (var i = 0; i < list.length; i++) {
				$.fire(list[i], eventType);
			}
		}

	};
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
		var webview = null,webviewCache = null, nShow, nWaiting;

		if($.webviews[id]){
			webviewCache = $.webviews[id];
			//webview真实存在，才能获取
			if(plus.webview.getWebviewById(id)){
				webview = webviewCache.webview;
			}
		}

		if (webviewCache&&webview) { //已缓存
			//每次show都需要传递动画参数；
			//预加载的动画参数优先级：openWindow配置>preloadPages配置>mui默认配置；
			nShow = webviewCache.show;
			nShow = options.show ? $.extend(nShow, options.show) : nShow;
			webview.show(nShow.aniShow, nShow.duration, function() {
				triggerPreload(webview);
				trigger(webview, 'pagebeforeshow', false);
			});

			webviewCache.afterShowMethodName && webview.evalJS(webviewCache.afterShowMethodName + '(\'' + JSON.stringify(params) + '\')');
			return webview;
		} else { //新窗口
			if (options.createNew !== true) {
				webview = plus.webview.getWebviewById(id);
				if (webview) { //如果已存在
					nShow = $.showOptions(options.show);
					webview.show(nShow.aniShow, nShow.duration, function() {
						triggerPreload(webview);
						trigger(webview, 'pagebeforeshow', false);
					});
					return webview;
				}
			}
			//显示waiting
			var waitingConfig = $.waitingOptions(options.waiting);
			if (waitingConfig.autoShow) {
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
			if (nShow.autoShow) {
				webview.addEventListener("loaded", function() {
					//关闭等待框
					if (nWaiting) {
						nWaiting.close();
					}
					//显示页面
					webview.show(nShow.aniShow, nShow.duration, function() {
						triggerPreload(webview);
						trigger(webview, 'pagebeforeshow', false);
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
			if ($.webviews[id] && $.webviews[id].webview.getURL()) { //已经cache
				webview = $.webviews[id].webview;
			} else { //新增预加载窗口
				//preload
				//判断是否携带createNew参数，默认为false
				if (options.createNew !== true) {
					webview = plus.webview.getWebviewById(id);
				}

				//之前没有，那就新创建	
				if (!webview) {
					webview = plus.webview.create(options.url, id, $.windowOptions(options.styles), $.extend({
						preload: true
					}, options.extras));
					if (options.subpages) {
						$.each(options.subpages, function(index, subpage) {
							//TODO 子窗口也可能已经创建，比如公用模板的情况；
							var subWebview = plus.webview.create(subpage.url, subpage.id || subpage.url, $.windowOptions(subpage.styles), $.extend({
								preload: true
							}, subpage.extras));
							webview.append(subWebview);
						});
					}
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
				webview = plus.webview.create(options.url, id, $.windowOptions(options.styles), options.extras);
				if (options.subpages) {
					$.each(options.subpages, function(index, subpage) {
						var subWebview = plus.webview.create(subpage.url, subpage.id || subpage.url, $.windowOptions(subpage.styles), subpage.extras);
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
	$.preload = function(options) {
		//调用预加载函数，不管是否传递preload参数，强制变为true
		if (!options.preload) {
			options.preload = true;
		}
		return $.createWindow(options);
	};

	/**
	 *关闭当前webview打开的所有webview；
	 */
	$.closeOpened = function(webview) {
		var opened = webview.opened();
		if (opened) {
			for (var i = 0, len = opened.length; i < len; i++) {
				var openedWebview = opened[i];
				var open_open = openedWebview.opened();
				if (open_open && open_open.length > 0) {
					$.closeOpened(openedWebview);
				} else {
					//如果直接孩子节点，就不用关闭了，因为父关闭的时候，会自动关闭子；
					if (openedWebview.parent() !== webview) {
						openedWebview.close('none');
					}
				}
			}
		}
	};
	$.closeAll = function(webview, aniShow) {
		$.closeOpened(webview);
		if (aniShow) {
			webview.close(aniShow);
		} else {
			webview.close();
		}
	};

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
			webview = plus.webview.create(options.url, id, options.styles, options.extras);
			//之前的实现方案：子窗口loaded之后再append到父窗口中；
			//问题：部分子窗口loaded事件发生较晚，此时执行父窗口的children方法会返回空，导致父子通讯失败；
			//     比如父页面执行完preload事件后，需触发子页面的preload事件，此时未append的话，就无法触发；
			//修改方式：不再监控loaded事件，直接append
			//by chb@20150521
			// webview.addEventListener('loaded', function() {
			plus.webview.currentWebview().append(webview);
			// });
			$.webviews[id] = options;
		}
		return webview;
	};

	//全局webviews
	$.webviews = {};
	//预加载窗口索引
	$.data.preloads = [];
	//$.currentWebview
	$.plusReady(function() {
		$.currentWebview = plus.webview.currentWebview();
	});
	$.addInit({
		name: '5+',
		index: 100,
		handle: function() {
			var options = $.options;
			var subpages = options.subpages || [];
			if ($.os.plus) {
				$.plusReady(function() {
					//TODO  这里需要判断一下，最好等子窗口加载完毕后，再调用主窗口的show方法；
					//或者：在openwindow方法中，监听实现；
					$.each(subpages, function(index, subpage) {
						$.appendWebview(subpage);
					});
					//判断是否首页
					if (plus.webview.currentWebview() === plus.webview.getWebviewById(plus.runtime.appid)) {
						$.isHomePage = true;
						//首页需要自己激活预加载；
						//timeout因为子页面loaded之后才append的，防止子页面尚未append、从而导致其preload未触发的问题；
						setTimeout(function() {
							triggerPreload(plus.webview.currentWebview());
						}, 300);
					}
					//设置ios顶部状态栏颜色；
					if ($.os.ios && $.options.statusBarBackground) {
						plus.navigator.setStatusBarBackground($.options.statusBarBackground);
					}
					if ($.os.android && parseFloat($.os.version) < 4.4) {
						//解决Android平台4.4版本以下，resume后，父窗体标题延迟渲染的问题；
						if (plus.webview.currentWebview().parent() == null) {
							document.addEventListener("resume", function() {
								var body = document.body;
								body.style.display = 'none';
								setTimeout(function() {
									body.style.display = '';
								}, 10);
							});
						}
					}
				});
			} else {
				if (subpages.length > 0) {
					var err = document.createElement('div');
					err.className = 'mui-error';
					//文字描述
					var span = document.createElement('span');
					span.innerHTML = '在该浏览器下，不支持创建子页面，具体参考';
					err.appendChild(span);
					var a = document.createElement('a');
					a.innerHTML = '"mui框架适用场景"';
					a.href = 'http://ask.dcloud.net.cn/article/113';
					err.appendChild(a);
					document.body.appendChild(err);
					console.log('在该浏览器下，不支持创建子页面');
				}

			}

		}
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
	 * register back
	 * @param {type} back
	 * @returns {$.gestures}
	 */
	$.addBack = function(back) {
		return $.addAction('backs', back);
	};
	/**
	 * default
	 */
	$.addBack({
		name: 'browser',
		index: 100,
		handle: function() {
			if (window.history.length > 1) {
				window.history.back();
				return true;
			}
			return false;
		}
	});
	/**
	 * 后退
	 */
	$.back = function() {
		if (typeof $.options.beforeback === 'function') {
			if ($.options.beforeback() === false) {
				return;
			}
		}
		$.doAction('backs');
	};
	window.addEventListener('tap', function(e) {
		var action = $.targets.action;
		if (action && action.classList.contains('mui-action-back')) {
			$.back();
		}
	});
	window.addEventListener('swiperight', function(e) {
		var detail = e.detail;
		if ($.options.swipeBack === true && Math.abs(detail.angle) < 3) {
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
	if ($.os.plus && $.os.android) {
		$.addBack({
			name: 'mui',
			index: 5,
			handle: function() {
				//popover
				if ($.targets._popover && $.targets._popover.classList.contains('mui-active')) {
					$($.targets._popover).popover('hide');
					return true;
				}
				//offcanvas
				var offCanvas = document.querySelector('.mui-off-canvas-wrap.mui-active');
				if (offCanvas) {
					$(offCanvas).offCanvas('close');
					return true;
				}
				var previewImage = $.isFunction($.getPreviewImage) && $.getPreviewImage();
				if (previewImage && previewImage.isShown()) {
					previewImage.close();
					return true;
				}
			}
		});
	}
	/**
	 * 5+ back
	 */
	$.addBack({
		name: '5+',
		index: 10,
		handle: function() {
			if (!window.plus) {
				return false;
			}
			var wobj = plus.webview.currentWebview();
			var parent = wobj.parent();
			if (parent) {
				parent.evalJS('mui&&mui.back();');
			} else {
				wobj.canBack(function(e) {
					//by chb 暂时注释，在碰到类似popover之类的锚点的时候，需多次点击才能返回；
					if (e.canBack) { //webview history back
						window.history.back();
					} else { //webview close or hide
						//fixed by fxy 此处不应该用opener判断，因为用户有可能自己close掉当前窗口的opener。这样的话。opener就为空了，导致不能执行close
						if (wobj.id === plus.runtime.appid) { //首页
							//首页不存在opener的情况下，后退实际上应该是退出应用；
							//这个交给项目具体实现，框架暂不处理；
							//plus.runtime.quit();	
						} else { //其他页面，
							if (wobj.preload) {
								wobj.hide("auto");
							} else {
								//关闭页面时，需要将其打开的所有子页面全部关闭；
								$.closeAll(wobj);
							}
						}
					}
				});
			}
			return true;
		}
	});


	$.menu = function() {
		var menu = document.querySelector('.mui-action-menu');
		if (menu) {
			$.trigger(menu, 'touchstart'); //临时处理menu无touchstart的话，找不到当前targets的问题
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
	};
	var __back = function() {
		$.back();
	};
	var __menu = function() {
		$.menu();
	};
	//默认监听
	$.plusReady(function() {
		if ($.options.keyEventBind.backbutton) {
			plus.key.addEventListener('backbutton', __back, false);
		}
		if ($.options.keyEventBind.menubutton) {
			plus.key.addEventListener('menubutton', __menu, false);
		}
	});
	//处理按键监听事件
	$.addInit({
		name: 'keyEventBind',
		index: 1000,
		handle: function() {
			$.plusReady(function() {
				//如果不为true，则移除默认监听
				if (!$.options.keyEventBind.backbutton) {
					plus.key.removeEventListener('backbutton', __back);
				}
				if (!$.options.keyEventBind.menubutton) {
					plus.key.removeEventListener('menubutton', __menu);
				}
			});
		}
	});
})(mui, window);
/**
 * mui.init pulldownRefresh
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.addInit({
		name: 'pullrefresh',
		index: 1000,
		handle: function() {
			var options = $.options;
			var pullRefreshOptions = options.pullRefresh || {};
			var hasPulldown = pullRefreshOptions.down && pullRefreshOptions.down.hasOwnProperty('callback');
			var hasPullup = pullRefreshOptions.up && pullRefreshOptions.up.hasOwnProperty('callback');
			if (hasPulldown || hasPullup) {
				var container = pullRefreshOptions.container;
				if (container) {
					var $container = $(container);
					if ($container.length === 1) {
						if ($.os.plus && $.os.android) { //android 5+
							$.plusReady(function() {
								var webview = plus.webview.currentWebview();
								if (hasPullup) {
									//当前页面初始化pullup
									var upOptions = {};
									upOptions.up = pullRefreshOptions.up;
									upOptions.webviewId = webview.id || webview.getURL();
									$container.pullRefresh(upOptions);
								}
								if (hasPulldown) {
									var parent = webview.parent();
									var id = webview.id || webview.getURL();
									if (parent) {
										if (!hasPullup) { //如果没有上拉加载，需要手动初始化一个默认的pullRefresh，以便当前页面容器可以调用endPulldownToRefresh等方法
											$container.pullRefresh({
												webviewId: id
											});
										}
										var downOptions = {
											webviewId: id
										};
										downOptions.down = $.extend({}, pullRefreshOptions.down);
										downOptions.down.callback = '_CALLBACK';
										//父页面初始化pulldown
										parent.evalJS("mui&&mui(document.querySelector('.mui-content')).pullRefresh('" + JSON.stringify(downOptions) + "')");
									}
								}
							});
						} else {
							$container.pullRefresh(pullRefreshOptions);
						}
					}
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
(function($, window, undefined) {

	var jsonType = 'application/json';
	var htmlType = 'text/html';
	var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var scriptTypeRE = /^(?:text|application)\/javascript/i;
	var xmlTypeRE = /^(?:text|application)\/xml/i;
	var blankRE = /^\s*$/;

	$.ajaxSettings = {
		type: 'GET',
		beforeSend: $.noop,
		success: $.noop,
		error: $.noop,
		complete: $.noop,
		context: null,
		xhr: function(protocol) {
			return new window.XMLHttpRequest();
		},
		accepts: {
			script: 'text/javascript, application/javascript, application/x-javascript',
			json: jsonType,
			xml: 'application/xml, text/xml',
			html: htmlType,
			text: 'text/plain'
		},
		timeout: 0,
		processData: true,
		cache: true
	};
	var ajaxBeforeSend = function(xhr, settings) {
		var context = settings.context
		if (settings.beforeSend.call(context, xhr, settings) === false) {
			return false;
		}
	};
	var ajaxSuccess = function(data, xhr, settings) {
		settings.success.call(settings.context, data, 'success', xhr);
		ajaxComplete('success', xhr, settings);
	};
	// type: "timeout", "error", "abort", "parsererror"
	var ajaxError = function(error, type, xhr, settings) {
		settings.error.call(settings.context, xhr, type, error);
		ajaxComplete(type, xhr, settings);
	};
	// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	var ajaxComplete = function(status, xhr, settings) {
		settings.complete.call(settings.context, xhr, status);
	};

	var serialize = function(params, obj, traditional, scope) {
		var type, array = $.isArray(obj),
			hash = $.isPlainObject(obj);
		$.each(obj, function(key, value) {
			type = $.type(value);
			if (scope) {
				key = traditional ? scope :
					scope + '[' + (hash || type === 'object' || type === 'array' ? key : '') + ']';
			}
			// handle data in serializeArray() format
			if (!scope && array) {
				params.add(value.name, value.value);
			}
			// recurse into nested objects
			else if (type === "array" || (!traditional && type === "object")) {
				serialize(params, value, traditional, key);
			} else {
				params.add(key, value);
			}
		});
	};
	var serializeData = function(options) {
		if (options.processData && options.data && typeof options.data !== "string") {
			options.data = $.param(options.data, options.traditional);
		}
		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	};
	var appendQuery = function(url, query) {
		if (query === '') {
			return url;
		}
		return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	};
	var mimeToDataType = function(mime) {
		if (mime) {
			mime = mime.split(';', 2)[0];
		}
		return mime && (mime === htmlType ? 'html' :
			mime === jsonType ? 'json' :
			scriptTypeRE.test(mime) ? 'script' :
			xmlTypeRE.test(mime) && 'xml') || 'text';
	};
	var parseArguments = function(url, data, success, dataType) {
		if ($.isFunction(data)) {
			dataType = success, success = data, data = undefined;
		}
		if (!$.isFunction(success)) {
			dataType = success, success = undefined;
		}
		return {
			url: url,
			data: data,
			success: success,
			dataType: dataType
		};
	};
	$.ajax = function(url, options) {
		if (typeof url === "object") {
			options = url;
			url = undefined;
		}
		var settings = options || {};
		settings.url = url || settings.url;
		for (var key in $.ajaxSettings) {
			if (settings[key] === undefined) {
				settings[key] = $.ajaxSettings[key];
			}
		}
		serializeData(settings);
		var dataType = settings.dataType;

		if (settings.cache === false || ((!options || options.cache !== true) && ('script' === dataType))) {
			settings.url = appendQuery(settings.url, '_=' + $.now());
		}
		var mime = settings.accepts[dataType];
		var headers = {};
		var setHeader = function(name, value) {
			headers[name.toLowerCase()] = [name, value];
		};
		var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
		var xhr = settings.xhr(settings);
		var nativeSetHeader = xhr.setRequestHeader;
		var abortTimeout;

		setHeader('X-Requested-With', 'XMLHttpRequest');
		setHeader('Accept', mime || '*/*');
		if (!!(mime = settings.mimeType || mime)) {
			if (mime.indexOf(',') > -1) {
				mime = mime.split(',', 2)[0];
			}
			xhr.overrideMimeType && xhr.overrideMimeType(mime);
		}
		if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() !== 'GET')) {
			setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
		}
		if (settings.headers) {
			for (var name in settings.headers)
				setHeader(name, settings.headers[name]);
		}
		xhr.setRequestHeader = setHeader;

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				xhr.onreadystatechange = $.noop;
				clearTimeout(abortTimeout);
				var result, error = false;
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol === 'file:')) {
					dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
					result = xhr.responseText;
					try {
						// http://perfectionkills.com/global-eval-what-are-the-options/
						if (dataType === 'script') {
							(1, eval)(result);
						} else if (dataType === 'xml') {
							result = xhr.responseXML;
						} else if (dataType === 'json') {
							result = blankRE.test(result) ? null : $.parseJSON(result);
						}
					} catch (e) {
						error = e;
					}

					if (error) {
						ajaxError(error, 'parsererror', xhr, settings);
					} else {
						ajaxSuccess(result, xhr, settings);
					}
				} else {
					ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings);
				}
			}
		};
		if (ajaxBeforeSend(xhr, settings) === false) {
			xhr.abort();
			ajaxError(null, 'abort', xhr, settings);
			return xhr;
		}

		if (settings.xhrFields) {
			for (var name in settings.xhrFields) {
				xhr[name] = settings.xhrFields[name];
			}
		}

		var async = 'async' in settings ? settings.async : true;

		xhr.open(settings.type.toUpperCase(), settings.url, async, settings.username, settings.password);

		for (var name in headers) {
			nativeSetHeader.apply(xhr, headers[name]);
		}
		if (settings.timeout > 0) {
			abortTimeout = setTimeout(function() {
				xhr.onreadystatechange = $.noop;
				xhr.abort();
				ajaxError(null, 'timeout', xhr, settings);
			}, settings.timeout);
		}
		xhr.send(settings.data ? settings.data : null);
		return xhr;
	};


	$.param = function(obj, traditional) {
		var params = [];
		params.add = function(k, v) {
			this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
		};
		serialize(params, obj, traditional);
		return params.join('&').replace(/%20/g, '+');
	};
	$.get = function( /* url, data, success, dataType */ ) {
		return $.ajax(parseArguments.apply(null, arguments));
	};

	$.post = function( /* url, data, success, dataType */ ) {
		var options = parseArguments.apply(null, arguments);
		options.type = 'POST';
		return $.ajax(options);
	};

	$.getJSON = function( /* url, data, success */ ) {
		var options = parseArguments.apply(null, arguments);
		options.dataType = 'json';
		return $.ajax(options);
	};

	$.fn.load = function(url, data, success) {
		if (!this.length)
			return this;
		var self = this,
			parts = url.split(/\s/),
			selector,
			options = parseArguments(url, data, success),
			callback = options.success;
		if (parts.length > 1)
			options.url = parts[0], selector = parts[1];
		options.success = function(response) {
			if (selector) {
				var div = document.createElement('div');
				div.innerHTML = response.replace(rscript, "");
				var selectorDiv = document.createElement('div');
				var childs = div.querySelectorAll(selector);
				if (childs && childs.length > 0) {
					for (var i = 0, len = childs.length; i < len; i++) {
						selectorDiv.appendChild(childs[i]);
					}
				}
				self[0].innerHTML = selectorDiv.innerHTML;
			} else {
				self[0].innerHTML = response;
			}
			callback && callback.apply(self, arguments);
		};
		$.ajax(options);
		return this;
	};

})(mui, window);
/**
 * 5+ ajax
 */
(function($) {
	var originAnchor = document.createElement('a');
	originAnchor.href = window.location.href;
	$.plusReady(function() {
		$.ajaxSettings = $.extend($.ajaxSettings, {
			xhr: function(settings) {
				if (settings.crossDomain) { //强制使用plus跨域
					return new plus.net.XMLHttpRequest();
				}
				//仅在webview的url为远程文件，且ajax请求的资源不同源下使用plus.net.XMLHttpRequest
				if (originAnchor.protocol !== 'file:') {
					var urlAnchor = document.createElement('a');
					urlAnchor.href = settings.url;
					urlAnchor.href = urlAnchor.href;
					settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host);
					if (settings.crossDomain) {
						return new plus.net.XMLHttpRequest();
					}
				}
				return new window.XMLHttpRequest();
			}
		});
	});
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
				window.scrollTo(0, scrollTop);
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
	$.animationFrame = function(cb) {
		var args, isQueued, context;
		return function() {
			args = arguments;
			context = this;
			if (!isQueued) {
				isQueued = true;
				requestAnimationFrame(function() {
					cb.apply(context, args);
					isQueued = false;
				});
			}
		};
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
(function($, document, undefined) {
	var CLASS_PULL_TOP_POCKET = 'mui-pull-top-pocket';
	var CLASS_PULL_BOTTOM_POCKET = 'mui-pull-bottom-pocket';
	var CLASS_PULL = 'mui-pull';
	var CLASS_PULL_LOADING = 'mui-pull-loading';
	var CLASS_PULL_CAPTION = 'mui-pull-caption';
	var CLASS_PULL_CAPTION_DOWN = 'mui-pull-caption-down';
	var CLASS_PULL_CAPTION_REFRESH = 'mui-pull-caption-refresh';
	var CLASS_PULL_CAPTION_NOMORE = 'mui-pull-caption-nomore';

	var CLASS_ICON = 'mui-icon';
	var CLASS_SPINNER = 'mui-spinner';
	var CLASS_ICON_PULLDOWN = 'mui-icon-pulldown';

	var CLASS_BLOCK = 'mui-block';
	var CLASS_HIDDEN = 'mui-hidden';
	var CLASS_VISIBILITY = 'mui-visibility';

	var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
	var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
	var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_SPINNER;

	var pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="{icon}"></div>', '<div class="' + CLASS_PULL_CAPTION + '">{contentrefresh}</div>', '</div>'].join('');

	var PullRefresh = {
		init: function(element, options) {
			this._super(element, $.extend(true, {
				scrollY: true,
				scrollX: false,
				indicators: true,
				deceleration:0.003,
				down: {
					height: 50,
					contentdown: '下拉可以刷新',
					contentover: '释放立即刷新',
					contentrefresh: '正在刷新...'
				},
				up: {
					height: 50,
					auto: false,
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了',
					duration: 300
				}
			}, options));
		},
		_init: function() {
			this._super();
			this._initPocket();
		},
		_initPulldownRefresh: function() {
			this.pulldown = true;
			this.pullPocket = this.topPocket;
			this.pullPocket.classList.add(CLASS_BLOCK);
			this.pullPocket.classList.add(CLASS_VISIBILITY);
			this.pullCaption = this.topCaption;
			this.pullLoading = this.topLoading;
		},
		_initPullupRefresh: function() {
			this.pulldown = false;
			this.pullPocket = this.bottomPocket;
			this.pullPocket.classList.add(CLASS_BLOCK);
			this.pullPocket.classList.add(CLASS_VISIBILITY);
			this.pullCaption = this.bottomCaption;
			this.pullLoading = this.bottomLoading;
		},
		_initPocket: function() {
			var options = this.options;
			if (options.down && options.down.hasOwnProperty('callback')) {
				this.topPocket = this.scroller.querySelector('.' + CLASS_PULL_TOP_POCKET);
				if (!this.topPocket) {
					this.topPocket = this._createPocket(CLASS_PULL_TOP_POCKET, options.down, CLASS_LOADING_DOWN);
					this.wrapper.insertBefore(this.topPocket, this.wrapper.firstChild);
				}
				this.topLoading = this.topPocket.querySelector('.' + CLASS_PULL_LOADING);
				this.topCaption = this.topPocket.querySelector('.' + CLASS_PULL_CAPTION);
			}
			if (options.up && options.up.hasOwnProperty('callback')) {
				this.bottomPocket = this.scroller.querySelector('.' + CLASS_PULL_BOTTOM_POCKET);
				if (!this.bottomPocket) {
					this.bottomPocket = this._createPocket(CLASS_PULL_BOTTOM_POCKET, options.up, CLASS_LOADING);
					this.scroller.appendChild(this.bottomPocket);
				}
				this.bottomLoading = this.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
				this.bottomCaption = this.bottomPocket.querySelector('.' + CLASS_PULL_CAPTION);
				//TODO only for h5
				this.wrapper.addEventListener('scrollbottom', this);
			}
		},
		_createPocket: function(clazz, options, iconClass) {
			var pocket = document.createElement('div');
			pocket.className = clazz;
			pocket.innerHTML = pocketHtml.replace('{contentrefresh}', options.contentrefresh).replace('{icon}', iconClass);
			return pocket;
		},
		_resetPullDownLoading: function() {
			var loading = this.pullLoading;
			if (loading) {
				this.pullCaption.innerHTML = this.options.down.contentdown;
				loading.style.webkitTransition = "";
				loading.style.webkitTransform = "";
				loading.style.webkitAnimation = "";
				loading.className = CLASS_LOADING_DOWN;
			}
		},
		_setCaptionClass: function(isPulldown, caption, title) {
			if (!isPulldown) {
				switch (title) {
					case this.options.up.contentdown:
						caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
						break;
					case this.options.up.contentrefresh:
						caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH
						break;
					case this.options.up.contentnomore:
						caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
						break;
				}
			}
		},
		_setCaption: function(title, reset) {
			if (this.loading) {
				return;
			}
			var options = this.options;
			var pocket = this.pullPocket;
			var caption = this.pullCaption;
			var loading = this.pullLoading;
			var isPulldown = this.pulldown;
			var self = this;
			if (pocket) {
				if (reset) {
					setTimeout(function() {
						caption.innerHTML = self.lastTitle = title;
						if (isPulldown) {
							loading.className = CLASS_LOADING_DOWN;
						} else {
							self._setCaptionClass(false, caption, title);
							loading.className = CLASS_LOADING;
						}
						loading.style.webkitAnimation = "";
						loading.style.webkitTransition = "";
						loading.style.webkitTransform = "";
					}, 100);
				} else {
					if (title !== this.lastTitle) {
						caption.innerHTML = title;
						if (isPulldown) {
							if (title === options.down.contentrefresh) {
								loading.className = CLASS_LOADING;
								loading.style.webkitAnimation = "spinner-spin 1s step-end infinite";
							} else if (title === options.down.contentover) {
								loading.className = CLASS_LOADING_UP;
								loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
								loading.style.webkitTransform = "rotate(180deg)";
							} else if (title === options.down.contentdown) {
								loading.className = CLASS_LOADING_DOWN;
								loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
								loading.style.webkitTransform = "rotate(0deg)";
							}
						} else {
							if (title === options.up.contentrefresh) {
								loading.className = CLASS_LOADING + ' ' + CLASS_VISIBILITY;
							} else {
								loading.className = CLASS_LOADING + ' ' + CLASS_HIDDEN;
							}
							self._setCaptionClass(false, caption, title);
						}
						this.lastTitle = title;
					}
				}

			}
		}
	};
	$.PullRefresh = PullRefresh;
})(mui, document);
(function($, window, document, undefined) {
	var CLASS_SCROLLBAR = 'mui-scrollbar';
	var CLASS_INDICATOR = 'mui-scrollbar-indicator';
	var CLASS_SCROLLBAR_VERTICAL = CLASS_SCROLLBAR + '-vertical';
	var CLASS_SCROLLBAR_HORIZONTAL = CLASS_SCROLLBAR + '-horizontal';

	var CLASS_ACTIVE = 'mui-active';

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
			this.scrollerStyle = this.scroller && this.scroller.style;
			this.stopped = false;

			this.options = $.extend(true, {
				scrollY: true, //是否竖向滚动
				scrollX: false, //是否横向滚动
				startX: 0, //初始化时滚动至x
				startY: 0, //初始化时滚动至y
				indicators: true, //是否显示滚动条
				stopPropagation: false,
				hardwareAccelerated: true,
				fixedBadAndorid: false,
				preventDefaultException: {
					tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO)$/
				},
				momentum: true,

				snap: false, //图片轮播，拖拽式选项卡

				bounce: true, //是否启用回弹
				bounceTime: 300, //回弹动画时间
				bounceEasing: ease.circular.style, //回弹动画曲线

				directionLockThreshold: 5,

				parallaxElement: false, //视差元素
				parallaxRatio: 0.5
			}, options);

			this.x = 0;
			this.y = 0;
			this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';

			this._init();
			if (this.scroller) {
				this.refresh();
				//				if (this.options.startX !== 0 || this.options.startY !== 0) { //需要判断吗？后续根据实际情况再看看
				this.scrollTo(this.options.startX, this.options.startY);
				//				}
			}
		},
		_init: function() {
			this._initParallax();
			this._initIndicators();
			this._initEvent();
		},
		_initParallax: function() {
			if (this.options.parallaxElement) {
				this.parallaxElement = document.querySelector(this.options.parallaxElement);
				this.parallaxStyle = this.parallaxElement.style;
				this.parallaxHeight = this.parallaxElement.offsetHeight;
				this.parallaxImgStyle = this.parallaxElement.querySelector('img').style;
			}
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
			}

			for (var i = indicators.length; i--;) {
				this.indicators.push(new Indicator(this, indicators[i]));
			}

		},
		_initSnap: function() {
			this.currentPage = {};
			this.pages = [];
			var snaps = this.snaps;
			var length = snaps.length;
			var m = 0;
			var n = -1;
			var x = 0;
			var cx = 0;
			for (var i = 0; i < length; i++) {
				var snap = snaps[i];
				var offsetLeft = snap.offsetLeft;
				var offsetWidth = snap.offsetWidth;
				if (i === 0 || offsetLeft <= snaps[i - 1].offsetLeft) {
					m = 0;
					n++;
				}
				if (!this.pages[m]) {
					this.pages[m] = [];
				}
				x = this._getSnapX(offsetLeft);
				cx = x - Math.round((offsetWidth) / 2);
				this.pages[m][n] = {
					x: x,
					cx: cx,
					pageX: m,
					element: snap
				}
				if (snap.classList.contains(CLASS_ACTIVE)) {
					this.currentPage = this.pages[m][0];
				}
				if (x >= this.maxScrollX) {
					m++;
				}
			}
			this.options.startX = this.currentPage.x || 0;
		},
		_getSnapX: function(offsetLeft) {
			return Math.max(Math.min(0, -offsetLeft + (this.wrapperWidth / 2)), this.maxScrollX);
		},
		_gotoPage: function(index) {
			this.currentPage = this.pages[Math.min(index, this.pages.length - 1)][0];
			for (var i = 0, len = this.snaps.length; i < len; i++) {
				if (i === index) {
					this.snaps[i].classList.add(CLASS_ACTIVE);
				} else {
					this.snaps[i].classList.remove(CLASS_ACTIVE);
				}
			}
			this.scrollTo(this.currentPage.x, 0, this.options.bounceTime);
		},
		_nearestSnap: function(x) {
			if (!this.pages.length) {
				return {
					x: 0,
					pageX: 0
				};
			}
			var i = 0;
			var length = this.pages.length;

			if (x > 0) {
				x = 0;
			} else if (x < this.maxScrollX) {
				x = this.maxScrollX;
			}

			for (; i < length; i++) {
				if (x >= this.pages[i][0].cx) {
					return this.pages[i][0];
				}
			}
			return {
				x: 0,
				pageX: 0
			};
		},
		_initEvent: function(detach) {
			var action = detach ? 'removeEventListener' : 'addEventListener';
			window[action]('orientationchange', this);
			window[action]('resize', this);

			this.scroller[action]('webkitTransitionEnd', this);

			this.wrapper[action]('touchstart', this);
			this.wrapper[action]('touchcancel', this);
			this.wrapper[action]('touchend', this);
			this.wrapper[action]('drag', this);
			this.wrapper[action]('dragend', this);
			this.wrapper[action]('flick', this);
			this.wrapper[action]('scrollend', this);
			if (this.options.scrollX) {
				this.wrapper[action]('swiperight', this);
			}
			var segmentedControl = this.wrapper.querySelector('.mui-segmented-control');
			if (segmentedControl) { //靠，这个bug排查了一下午，阻止hash跳转，一旦hash跳转会导致可拖拽选项卡的tab不见
				mui(segmentedControl)[detach ? 'off' : 'on']('click', 'a', $.preventDefault);
			}

			this.wrapper[action]('scrollend', this._handleIndicatorScrollend.bind(this));

			this.wrapper[action]('scrollstart', this._handleIndicatorScrollstart.bind(this));

			this.wrapper[action]('refresh', this._handleIndicatorRefresh.bind(this));
		},
		_handleIndicatorScrollend: function() {
			this.indicators.map(function(indicator) {
				indicator.fade();
			});
		},
		_handleIndicatorScrollstart: function() {
			this.indicators.map(function(indicator) {
				indicator.fade(1);
			});
		},
		_handleIndicatorRefresh: function() {
			this.indicators.map(function(indicator) {
				indicator.refresh();
			});
		},
		handleEvent: function(e) {
			if (this.stopped) {
				this.resetPosition();
				return;
			}

			switch (e.type) {
				case 'touchstart':
					this._start(e);
					break;
				case 'drag':
					this.options.stopPropagation && e.stopPropagation();
					this._drag(e);
					break;
				case 'dragend':
				case 'flick':
					this.options.stopPropagation && e.stopPropagation();
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
					e.stopPropagation();
					break;
				case 'orientationchange':
				case 'resize':
					this._resize();
					break;
				case 'swiperight':
					e.stopPropagation();
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
				//				this.resetPosition(); //reset
				$.trigger(this.scroller, 'scrollend', this);
				//				e.stopPropagation();
				e.preventDefault();
			}
			this.reLayout();
			$.trigger(this.scroller, 'beforescrollstart', this);
		},
		_getDirectionByAngle: function(angle) {
			if (angle < -80 && angle > -100) {
				return 'up';
			} else if (angle >= 80 && angle < 100) {
				return 'down';
			} else if (angle >= 170 || angle <= -170) {
				return 'left';
			} else if (angle >= -35 && angle <= 10) {
				return 'right';
			}
			return null;
		},
		_drag: function(e) {
			//			if (this.needReset) {
			//				e.stopPropagation(); //disable parent drag(nested scroller)
			//				return;
			//			}
			var detail = e.detail;
			if (this.options.scrollY || detail.direction === 'up' || detail.direction === 'down') { //如果是竖向滚动或手势方向是上或下
				//ios8 hack
				if ($.os.ios && parseFloat($.os.version) >= 8) { //多webview时，离开当前webview会导致后续touch事件不触发
					var clientY = detail.gesture.touches[0].clientY;
					//下拉刷新 or 上拉加载
					if ((clientY + 10) > window.innerHeight || clientY < 10) {
						this.resetPosition(this.options.bounceTime);
						return;
					}
				}
			}
			var isPreventDefault = isReturn = false;
			var direction = this._getDirectionByAngle(detail.angle);
			if (detail.direction === 'left' || detail.direction === 'right') {
				if (this.options.scrollX) {
					isPreventDefault = true;
					if (!this.moved) { //识别角度(该角度导致轮播不灵敏)
						//						if (direction !== 'left' && direction !== 'right') {
						//							isReturn = true;
						//						} else {
						$.gestures.session.lockDirection = true; //锁定方向
						$.gestures.session.startDirection = detail.direction;
						//						}
					}
				} else if (this.options.scrollY && !this.moved) {
					isReturn = true;
				}
			} else if (detail.direction === 'up' || detail.direction === 'down') {
				if (this.options.scrollY) {
					isPreventDefault = true;
					//					if (!this.moved) { //识别角度,竖向滚动似乎没必要进行小角度验证
					//						if (direction !== 'up' && direction !== 'down') {
					//							isReturn = true;
					//						}
					//					}
					if (!this.moved) {
						$.gestures.session.lockDirection = true; //锁定方向
						$.gestures.session.startDirection = detail.direction;
					}
				} else if (this.options.scrollX && !this.moved) {
					isReturn = true;
				}
			} else {
				isReturn = true;
			}
			if (this.moved || isPreventDefault) {
				e.stopPropagation(); //阻止冒泡(scroll类嵌套)
				detail.gesture && detail.gesture.preventDefault();
			}
			if (isReturn) { //禁止非法方向滚动
				return;
			}
			if (!this.moved) {
				$.trigger(this.scroller, 'scrollstart', this);
			} else {
				e.stopPropagation(); //move期间阻止冒泡(scroll嵌套)
			}
			var deltaX = 0;
			var deltaY = 0;
			if (!this.moved) { //start
				deltaX = detail.deltaX;
				deltaY = detail.deltaY;
			} else { //move
				deltaX = detail.deltaX - $.gestures.session.prevTouch.deltaX;
				deltaY = detail.deltaY - $.gestures.session.prevTouch.deltaY;
			}
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

			this.moved = true;
			this.x = newX;
			this.y = newY;
			$.trigger(this.scroller, 'scroll', this);
		},
		_flick: function(e) {
			//			if (!this.moved || this.needReset) {
			//				return;
			//			}
			if (!this.moved) {
				return;
			}
			e.stopPropagation();
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
				$.trigger(this.scroller, 'scrollend', this);
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

			$.trigger(this.scroller, 'scrollend', this);
			//			e.stopPropagation();
		},
		_end: function(e) {
			this.needReset = false;
			if ((!this.moved && this.needReset) || e.type === 'touchcancel') {
				this.resetPosition();
			}
		},
		_transitionEnd: function(e) {
			if (e.target != this.scroller || !this.isInTransition) {
				return;
			}
			this._transitionTime();
			if (!this.resetPosition(this.options.bounceTime)) {
				this.isInTransition = false;
				$.trigger(this.scroller, 'scrollend', this);
			}
		},
		_scrollend: function(e) {
			if (Math.abs(this.y) > 0 && this.y <= this.maxScrollY) {
				$.trigger(this.scroller, 'scrollbottom', this);
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
			if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
				this.parallaxStyle['webkitTransitionDuration'] = time + 'ms';
			}
			if (this.options.fixedBadAndorid && !time && $.os.isBadAndroid) {
				this.scrollerStyle['webkitTransitionDuration'] = '0.001s';
				if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
					this.parallaxStyle['webkitTransitionDuration'] = '0.001s';
				}
			}
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTime(time);
				}
			}
		},
		_transitionTimingFunction: function(easing) {
			this.scrollerStyle['webkitTransitionTimingFunction'] = easing;
			if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
				this.parallaxStyle['webkitTransitionDuration'] = easing;
			}
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

			//以防slider类嵌套使用
			if (this.options.snap && typeof this.options.snap === 'string') {
				var items = this.scroller.querySelectorAll(this.options.snap);
				this.itemLength = 0;
				this.snaps = [];
				for (var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					if (item.parentNode === this.scroller) {
						this.itemLength++;
						this.snaps.push(item);
					}
				}
				this._initSnap(); //需要每次都_initSnap么。其实init的时候执行一次，后续resize的时候执行一次就行了吧.先这么做吧，如果影响性能，再调整
			}
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
		_getTranslateStr: function(x, y) {
			if (this.options.hardwareAccelerated) {
				return 'translate3d(' + x + 'px,' + y + 'px,0px) ' + this.translateZ;
			}
			return 'translate(' + x + 'px,' + y + 'px) ';
		},
		//API
		setStopped: function(stopped) {
			this.stopped = !!stopped;
		},
		setTranslate: function(x, y) {
			this.x = x;
			this.y = y;
			this.scrollerStyle['webkitTransform'] = this._getTranslateStr(x, y);
			if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
				var parallaxY = y * this.options.parallaxRatio;
				var scale = 1 + parallaxY / ((this.parallaxHeight - parallaxY) / 2);
				if (scale > 1) {
					this.parallaxImgStyle['opacity'] = 1 - parallaxY / 100 * this.options.parallaxRatio;
					this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -parallaxY) + ' scale(' + scale + ',' + scale + ')';
				} else {
					this.parallaxImgStyle['opacity'] = 1;
					this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -1) + ' scale(1,1)';
				}
			}
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].updatePosition();
				}
			}
			this.lastX = this.x;
			this.lastY = this.y;
			$.trigger(this.scroller, 'scroll', this);
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
			$.trigger(this.scroller, 'refresh', this);
			this.resetPosition();
		},
		scrollTo: function(x, y, time, easing) {
			var easing = easing || ease.circular;
			this.isInTransition = time > 0 && (this.lastX != x || this.lastY != y);
			if (this.isInTransition) {
				this._clearRequestAnimationFrame();
				this._transitionTimingFunction(easing.style);
				this._transitionTime(time);
				this.setTranslate(x, y);
			} else {
				this.setTranslate(x, y);
			}

		},
		scrollToBottom: function(time, easing) {
			time = time || this.options.bounceTime;
			this.scrollTo(0, this.maxScrollY, time, easing);
		},
		gotoPage: function(index) {
			this._gotoPage(index);
		},
		destory: function() {
			this._initEvent(true); //detach
			delete $.data[this.wrapper.getAttribute('data-scroll')];
			this.wrapper.setAttribute('data-scroll', '');
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

			this.indicatorStyle['webkitTransform'] = this.scroller._getTranslateStr(x, y);

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
		var scrollApis = [];
		this.each(function() {
			var scrollApi = null;
			var self = this;
			var id = self.getAttribute('data-scroll');
			if (!id) {
				id = ++$.uuid;
				var _options = $.extend({}, options);
				if (self.classList.contains('mui-segmented-control')) {
					_options = $.extend(_options, {
						scrollY: false,
						scrollX: true,
						indicators: false,
						snap: '.mui-control-item'
					});
				}
				$.data[id] = scrollApi = new Scroll(self, _options);
				self.setAttribute('data-scroll', id);
			} else {
				scrollApi = $.data[id];
			}
			scrollApis.push(scrollApi);
		});
		return scrollApis.length === 1 ? scrollApis[0] : scrollApis;
	};
})(mui, window, document);
(function($, window, document, undefined) {

	var CLASS_VISIBILITY = 'mui-visibility';
	var CLASS_HIDDEN = 'mui-hidden';

	var PullRefresh = $.Scroll.extend($.extend({
		handleEvent: function(e) {
			this._super(e);
			if (e.type === 'scrollbottom') {
				if (e.target === this.scroller) {
					this._scrollbottom();
				}
			}
		},
		_scrollbottom: function() {
			if (!this.pulldown && !this.loading) {
				this.pulldown = false;
				this._initPullupRefresh();
				this.pullupLoading();
			}
		},
		_start: function(e) {
			//仅下拉刷新在start阻止默认事件
			if (e.touches && e.touches.length && e.touches[0].clientX > 30) {
				e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
			}
			if (!this.loading) {
				this.pulldown = this.pullPocket = this.pullCaption = this.pullLoading = false
			}
			this._super(e);
		},
		_drag: function(e) {
			this._super(e);
			if (!this.pulldown && !this.loading && this.topPocket && e.detail.direction === 'down' && this.y >= 0) {
				this._initPulldownRefresh();
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
			if (this.pulldown) {
				if (this.y >= this.options.down.height) {
					this.pulldownLoading(undefined, time || 0);
					return true;
				} else {
					!this.loading && this.topPocket.classList.remove(CLASS_VISIBILITY);
				}
			}
			return this._super(time);
		},
		pulldownLoading: function(y, time) {
			typeof y === 'undefined' && (y = this.options.down.height); //默认高度
			this.scrollTo(0, y, time, this.options.bounceEasing);
			if (this.loading) {
				return;
			}
			//			if (!this.pulldown) {
			this._initPulldownRefresh();
			//			}
			this._setCaption(this.options.down.contentrefresh);
			this.loading = true;
			this.indicators.map(function(indicator) {
				indicator.fade(0);
			});
			var callback = this.options.down.callback;
			callback && callback.call(this);
		},
		endPulldownToRefresh: function() {
			var self = this;
			if (self.topPocket && self.loading && this.pulldown) {
				self.scrollTo(0, 0, self.options.bounceTime, self.options.bounceEasing);
				self.loading = false;
				self._setCaption(self.options.down.contentdown, true);
				setTimeout(function() {
					self.loading || self.topPocket.classList.remove(CLASS_VISIBILITY);
				}, 350);
			}
		},
		pullupLoading: function(callback, x, time) {
			x = x || 0;
			this.scrollTo(x, this.maxScrollY, time, this.options.bounceEasing);
			if (this.loading) {
				return;
			}
			this._initPullupRefresh();
			this._setCaption(this.options.up.contentrefresh);
			this.indicators.map(function(indicator) {
				indicator.fade(0);
			});
			this.loading = true;
			callback = callback || this.options.up.callback;
			callback && callback.call(this);
		},
		endPullupToRefresh: function(finished) {
			var self = this;
			if (self.bottomPocket) { // && self.loading && !this.pulldown
				self.loading = false;
				if (finished) {
					this.finished = true;
					self._setCaption(self.options.up.contentnomore);
					//					self.bottomPocket.classList.remove(CLASS_VISIBILITY);
					//					self.bottomPocket.classList.add(CLASS_HIDDEN);
					self.wrapper.removeEventListener('scrollbottom', self);
				} else {
					self._setCaption(self.options.up.contentdown);
					//					setTimeout(function() {
					self.loading || self.bottomPocket.classList.remove(CLASS_VISIBILITY);
					//					}, 300);
				}
			}
		},
		disablePullupToRefresh: function() {
			this._initPullupRefresh();
			this.bottomPocket.className = 'mui-pull-bottom-pocket' + ' ' + CLASS_HIDDEN;
			this.wrapper.removeEventListener('scrollbottom', this);
		},
		enablePullupToRefresh: function() {
			this._initPullupRefresh();
			this.bottomPocket.classList.remove(CLASS_HIDDEN);
			this._setCaption(this.options.up.contentdown);
			this.wrapper.addEventListener('scrollbottom', this);
		},
		refresh: function(isReset) {
			if (isReset && this.finished) {
				this.enablePullupToRefresh();
				this.finished = false;
			}
			this._super();
		},
	}, $.PullRefresh));
	$.fn.pullRefresh = function(options) {
		if (this.length === 1) {
			var self = this[0];
			var pullRefreshApi = null;
			options = options || {};
			var id = self.getAttribute('data-pullrefresh');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = pullRefreshApi = new PullRefresh(self, options);
				self.setAttribute('data-pullrefresh', id);
			} else {
				pullRefreshApi = $.data[id];
			}
			if (options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
				pullRefreshApi.pulldownLoading(options.down.autoY);
			} else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
				pullRefreshApi.pullupLoading();
			}
			//暂不提供这种调用方式吧			
			//			if (typeof options === 'string') {
			//				var methodValue = pullRefreshApi[options].apply(pullRefreshApi, $.slice.call(arguments, 1));
			//				if (methodValue !== undefined) {
			//					return methodValue;
			//				}
			//			}
			return pullRefreshApi;
		}
	};
})(mui, window, document);
/**
 * snap 重构
 * @param {Object} $
 * @param {Object} window
 */
(function($, window) {
	var CLASS_SLIDER = 'mui-slider';
	var CLASS_SLIDER_GROUP = 'mui-slider-group';
	var CLASS_SLIDER_LOOP = 'mui-slider-loop';
	var CLASS_SLIDER_INDICATOR = 'mui-slider-indicator';
	var CLASS_ACTION_PREVIOUS = 'mui-action-previous';
	var CLASS_ACTION_NEXT = 'mui-action-next';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';

	var CLASS_ACTIVE = 'mui-active';

	var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
	var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
	var SELECTOR_SLIDER_PROGRESS_BAR = '.mui-slider-progress-bar';

	var Slider = $.Slider = $.Scroll.extend({
		init: function(element, options) {
			this._super(element, $.extend(true, {
				fingers: 1,
				interval: 0, //设置为0，则不定时轮播
				scrollY: false,
				scrollX: true,
				indicators: false,
				bounceTime: 200,
				startX: false,
				slideTime: 0, //滑动动画时间
				snap: SELECTOR_SLIDER_ITEM
			}, options));
			if (this.options.startX) {
				//				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		_init: function() {
			var groups = this.wrapper.querySelectorAll('.' + CLASS_SLIDER_GROUP);
			for (var i = 0, len = groups.length; i < len; i++) {
				if (groups[i].parentNode === this.wrapper) {
					this.scroller = groups[i];
					break;
				}
			}
			if (this.scroller) {
				this.scrollerStyle = this.scroller.style;
				this.progressBar = this.wrapper.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
				if (this.progressBar) {
					this.progressBarWidth = this.progressBar.offsetWidth;
					this.progressBarStyle = this.progressBar.style;
				}
				//忘记这个代码是干什么的了？
				//				this.x = this._getScroll();
				//				if (this.options.startX === false) {
				//					this.options.startX = this.x;
				//				}
				//根据active修正startX

				this._super();
				this._initTimer();
			}
		},
		_triggerSlide: function() {
			var self = this;
			self.isInTransition = false;
			var page = self.currentPage;
			self.slideNumber = self._fixedSlideNumber();
			if (self.loop) {
				if (self.slideNumber === 0) {
					self.setTranslate(self.pages[1][0].x, 0);
				} else if (self.slideNumber === self.itemLength - 3) {
					self.setTranslate(self.pages[self.itemLength - 2][0].x, 0);
				}
			}
			if (self.lastSlideNumber != self.slideNumber) {
				self.lastSlideNumber = self.slideNumber;
				self.lastPage = self.currentPage;
				$.trigger(self.wrapper, 'slide', {
					slideNumber: self.slideNumber
				});
			}
			self._initTimer();
		},
		_handleSlide: function(e) {
			var self = this;
			if (e.target !== self.wrapper) {
				return;
			}
			var detail = e.detail;
			detail.slideNumber = detail.slideNumber || 0;
			var temps = self.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
			var items = [];
			for (var i = 0, len = temps.length; i < len; i++) {
				var item = temps[i];
				if (item.parentNode === self.scroller) {
					items.push(item);
				}
			}
			var _slideNumber = detail.slideNumber;
			if (self.loop) {
				_slideNumber += 1;
			}
			if (!self.wrapper.classList.contains('mui-segmented-control')) {
				for (var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					if (item.parentNode === self.scroller) {
						if (i === _slideNumber) {
							item.classList.add(CLASS_ACTIVE);
						} else {
							item.classList.remove(CLASS_ACTIVE);
						}
					}
				}
			}
			var indicatorWrap = self.wrapper.querySelector('.mui-slider-indicator');
			if (indicatorWrap) {
				if (indicatorWrap.getAttribute('data-scroll')) { //scroll
					$(indicatorWrap).scroll().gotoPage(detail.slideNumber);
				}
				var indicators = indicatorWrap.querySelectorAll('.mui-indicator');
				if (indicators.length > 0) { //图片轮播
					for (var i = 0, len = indicators.length; i < len; i++) {
						indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
					}
				} else {
					var number = indicatorWrap.querySelector('.mui-number span');
					if (number) { //图文表格
						number.innerText = (detail.slideNumber + 1);
					} else { //segmented controls
						var controlItems = self.wrapper.querySelectorAll('.mui-control-item');
						for (var i = 0, len = controlItems.length; i < len; i++) {
							controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
						}
					}
				}
			}
			e.stopPropagation();
		},
		_handleTabShow: function(e) {
			var self = this;
			self.gotoItem((e.detail.tabNumber || 0), self.options.slideTime);
		},
		_handleIndicatorTap: function(event) {
			var self = this;
			var target = event.target;
			if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
				self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
				event.stopPropagation();
			}
		},
		_initEvent: function(detach) {
			var self = this;
			self._super(detach);
			var action = detach ? 'removeEventListener' : 'addEventListener';
			self.wrapper[action]('swiperight', $.stopPropagation);
			self.wrapper[action]('scrollend', self._triggerSlide.bind(this));

			self.wrapper[action]('slide', self._handleSlide.bind(this));

			self.wrapper[action]($.eventName('shown', 'tab'), self._handleTabShow.bind(this));
			//indicator
			var indicator = self.wrapper.querySelector(SELECTOR_SLIDER_INDICATOR);
			if (indicator) {
				indicator[action]('tap', self._handleIndicatorTap.bind(this));
			}
		},
		_drag: function(e) {
			this._super(e);
			var direction = e.detail.direction;
			if (direction === 'left' || direction === 'right') {
				//拖拽期间取消定时
				var slidershowTimer = this.wrapper.getAttribute('data-slidershowTimer');
				slidershowTimer && window.clearTimeout(slidershowTimer);

				e.stopPropagation();
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
						self.nextItem(true);
						//下一个
					}
					self._initTimer();
				}, interval);
				slider.setAttribute('data-slidershowTimer', slidershowTimer);
			}
		},

		_fixedSlideNumber: function(page) {
			page = page || this.currentPage;
			var slideNumber = page.pageX;
			if (this.loop) {
				if (page.pageX === 0) {
					slideNumber = this.itemLength - 3;
				} else if (page.pageX === (this.itemLength - 1)) {
					slideNumber = 0;
				} else {
					slideNumber = page.pageX - 1;
				}
			}
			return slideNumber;
		},
		_reLayout: function() {
			this.hasHorizontalScroll = true;
			this.loop = this.scroller.classList.contains(CLASS_SLIDER_LOOP);
			this._super();
		},
		_getScroll: function() {
			var result = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
			return result ? result.x : 0;
		},
		_transitionEnd: function(e) {
			if (e.target !== this.scroller || !this.isInTransition) {
				return;
			}
			this._transitionTime();
			this.isInTransition = false;
			$.trigger(this.wrapper, 'scrollend', this);
		},
		_flick: function(e) {
			if (!this.moved) { //无moved
				return;
			}
			var detail = e.detail;
			var direction = detail.direction;
			this._clearRequestAnimationFrame();
			this.isInTransition = true;
			//			if (direction === 'up' || direction === 'down') {
			//				this.resetPosition(this.options.bounceTime);
			//				return;
			//			}
			if (e.type === 'flick') {
				if (detail.deltaTime < 200) { //flick，太容易触发，额外校验一下deltaTime
					this.x = this._getPage((this.slideNumber + (direction === 'right' ? -1 : 1)), true).x;
				}
				this.resetPosition(this.options.bounceTime);
			} else if (e.type === 'dragend' && !detail.flick) {
				this.resetPosition(this.options.bounceTime);
			}
			e.stopPropagation();
		},
		_initSnap: function() {
			this.scrollerWidth = this.itemLength * this.scrollerWidth;
			this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
			this._super();
			if (!this.currentPage.x) {
				//当slider处于隐藏状态时，导致snap计算是错误的，临时先这么判断一下，后续要考虑解决所有scroll在隐藏状态下初始化属性不正确的问题
				var currentPage = this.pages[this.loop ? 1 : 0];
				currentPage = currentPage || this.pages[0];
				if (!currentPage) {
					return;
				}
				this.currentPage = currentPage[0];
				this.slideNumber = 0;
				this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? 0 : this.lastSlideNumber;
			} else {
				this.slideNumber = this._fixedSlideNumber();
				this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? this.slideNumber : this.lastSlideNumber;
			}
			this.options.startX = this.currentPage.x || 0;
		},
		_getSnapX: function(offsetLeft) {
			return Math.max(-offsetLeft, this.maxScrollX);
		},
		_getPage: function(slideNumber, isFlick) {
			if (this.loop) {
				if (slideNumber > (this.itemLength - (isFlick ? 2 : 3))) {
					slideNumber = 1;
					time = 0;
				} else if (slideNumber < (isFlick ? -1 : 0)) {
					slideNumber = this.itemLength - 2;
					time = 0;
				} else {
					slideNumber += 1;
				}
			} else {
				if (!isFlick) {
					if (slideNumber > (this.itemLength - 1)) {
						slideNumber = 0;
						time = 0;
					} else if (slideNumber < 0) {
						slideNumber = this.itemLength - 1;
						time = 0;
					}
				}
				slideNumber = Math.min(Math.max(0, slideNumber), this.itemLength - 1);
			}
			return this.pages[slideNumber][0];
		},
		_gotoItem: function(slideNumber, time) {
			this.currentPage = this._getPage(slideNumber, true); //此处传true。可保证程序切换时，动画与人手操作一致(第一张，最后一张的切换动画)
			this.scrollTo(this.currentPage.x, 0, time, this.options.bounceEasing);
			if (time === 0) {
				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		//API
		setTranslate: function(x, y) {
			this._super(x, y);
			var progressBar = this.progressBar;
			if (progressBar) {
				this.progressBarStyle.webkitTransform = this._getTranslateStr((-x * (this.progressBarWidth / this.wrapperWidth)), 0);
			}
		},
		resetPosition: function(time) {
			time = time || 0;
			if (this.x > 0) {
				this.x = 0;
			} else if (this.x < this.maxScrollX) {
				this.x = this.maxScrollX;
			}
			this.currentPage = this._nearestSnap(this.x);
			this.scrollTo(this.currentPage.x, 0, time);
			return true;
		},
		gotoItem: function(slideNumber, time) {
			this._gotoItem(slideNumber, typeof time === 'undefined' ? this.options.bounceTime : time);
		},
		nextItem: function() {
			this._gotoItem(this.slideNumber + 1, this.options.bounceTime);
		},
		prevItem: function() {
			this._gotoItem(this.slideNumber - 1, this.options.bounceTime);
		},
		getSlideNumber: function() {
			return this.slideNumber || 0;
		},
		refresh: function(options) {
			if (options) {
				$.extend(this.options, options);
				this._super();
				this.nextItem();
			} else {
				this._super();
			}
		},
		destory: function() {
			this._initEvent(true); //detach
			delete $.data[this.wrapper.getAttribute('data-slider')];
			this.wrapper.setAttribute('data-slider', '');
		}
	});
	$.fn.slider = function(options) {
		var slider = null;
		this.each(function() {
			var sliderElement = this;
			if (!this.classList.contains(CLASS_SLIDER)) {
				sliderElement = this.querySelector('.' + CLASS_SLIDER);
			}
			if (sliderElement && sliderElement.querySelector(SELECTOR_SLIDER_ITEM)) {
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
		//		setTimeout(function() {
		$('.mui-slider').slider();
		$('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
			scrollY: false,
			scrollX: true,
			indicators: false,
			snap: '.mui-control-item'
		});
		//		}, 500); //临时处理slider宽度计算不正确的问题(初步确认是scrollbar导致的)

	});
})(mui, window);
/**
 * pullRefresh 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {
	if (!($.os.plus && $.os.android)) { //仅在android的5+版本使用
		return;
	}
	var CLASS_PLUS_PULLREFRESH = 'mui-plus-pullrefresh';
	var CLASS_VISIBILITY = 'mui-visibility';
	var CLASS_HIDDEN = 'mui-hidden';
	var CLASS_BLOCK = 'mui-block';

	var CLASS_PULL_CAPTION = 'mui-pull-caption';
	var CLASS_PULL_CAPTION_DOWN = 'mui-pull-caption-down';
	var CLASS_PULL_CAPTION_REFRESH = 'mui-pull-caption-refresh';
	var CLASS_PULL_CAPTION_NOMORE = 'mui-pull-caption-nomore';

	var PlusPullRefresh = $.Class.extend({
		init: function(element, options) {
			this.element = element;
			this.options = options;
			this.wrapper = this.scroller = element;
			this._init();
			this._initPulldownRefreshEvent();
		},
		_init: function() {
			var self = this;
			//			document.addEventListener('plusscrollbottom', this);
			window.addEventListener('dragup', self);
			document.addEventListener("plusscrollbottom", self);
			self.scrollInterval = window.setInterval(function() {
				if (self.isScroll && !self.loading) {
					if (window.pageYOffset + window.innerHeight + 10 >= document.documentElement.scrollHeight) {
						self.isScroll = false; //放在这里是因为快速滚动的话，有可能检测时，还没到底，所以只要有滚动，没到底之前一直检测高度变化
						if (self.bottomPocket) {
							self.pullupLoading();
						}
					}
				}
			}, 100);
		},
		_initPulldownRefreshEvent: function() {
			var self = this;
			if (self.topPocket && self.options.webviewId) {
				$.plusReady(function() {
					var webview = plus.webview.getWebviewById(self.options.webviewId);
					if (!webview) {
						return;
					}
					self.options.webview = webview;
					var downOptions = self.options.down;
					var height = downOptions.height;
					webview.addEventListener("dragBounce", function(e) {
						if (!self.pulldown) {
							self._initPulldownRefresh();
						} else {
							self.pullPocket.classList.add(CLASS_BLOCK);
						}
						switch (e.status) {
							case "beforeChangeOffset": //下拉可刷新状态
								self._setCaption(downOptions.contentdown);
								break;
							case "afterChangeOffset": //松开可刷新状态
								self._setCaption(downOptions.contentover);
								break;
							case "dragEndAfterChangeOffset": //正在刷新状态
								//执行下拉刷新所在webview的回调函数
								webview.evalJS("mui&&mui.options.pullRefresh.down.callback()");
								self._setCaption(downOptions.contentrefresh);
								break;
							default:
								break;
						}
					}, false);
					webview.setBounce({
						position: {
							top: height * 2 + 'px'
						},
						changeoffset: {
							top: height + 'px'
						}
					});
				});
			}
		},
		handleEvent: function(e) {
			var self = this;
			if (self.stopped) {
				return;
			}
			//5+的plusscrollbottom当页面内容较少时，不触发
			//			if (e.type === 'plusscrollbottom') {
			//				if (this.bottomPocket) {
			//					this.pullupLoading();
			//				}
			//			}
			self.isScroll = false;
			if (e.type === 'dragup' || e.type === 'plusscrollbottom') {
				self.isScroll = true;
				setTimeout(function() {
					self.isScroll = false;
				}, 1000);
			}
		}
	}).extend($.extend({
		setStopped: function(stopped) { //该方法是子页面调用的
			this.stopped = !!stopped;
			//TODO 此处需要设置当前webview的bounce为none,目前5+有BUG
			var webview = plus.webview.currentWebview();
			if (this.stopped) {
				webview.setStyle({
					bounce: 'none'
				});
				webview.setBounce({
					position: {
						top: 'none'
					}
				});
			} else {
				var height = this.options.down.height;
				webview.setStyle({
					bounce: 'vertical'
				});
				webview.setBounce({
					position: {
						top: height * 2 + 'px'
					},
					changeoffset: {
						top: height + 'px'
					}
				});
			}
		},
		pulldownLoading: function() { //该方法是子页面调用的
			var callback = $.options.pullRefresh.down.callback;
			callback && callback.call(this);
		},
		_pulldownLoading: function() { //该方法是子页面调用的
			var self = this;
			$.plusReady(function() {
				plus.webview.getWebviewById(self.options.webviewId).evalJS("mui&&mui.options.pullRefresh.down&&mui.options.pullRefresh.down.callback()");
			});
		},
		endPulldownToRefresh: function() { //该方法是子页面调用的
			var webview = plus.webview.currentWebview();
			webview.parent().evalJS("mui&&mui(document.querySelector('.mui-content')).pullRefresh('" + JSON.stringify({
				webviewId: webview.id
			}) + "')._endPulldownToRefresh()");
		},
		_endPulldownToRefresh: function() { //该方法是父页面调用的
			var self = this;
			if (self.topPocket && self.options.webview) {
				self.options.webview.endPullToRefresh(); //下拉刷新所在webview回弹
				self.loading = false;
				self._setCaption(self.options.down.contentdown, true);
				setTimeout(function() {
					self.loading || self.topPocket.classList.remove(CLASS_BLOCK);
				}, 350);
			}
		},
		pullupLoading: function(callback) {
			var self = this;
			if (self.isLoading) return;
			self.isLoading = true;
			if (self.pulldown !== false) {
				self._initPullupRefresh();
			} else {
				this.pullPocket.classList.add(CLASS_BLOCK);
			}
			setTimeout(function() {
				self.pullLoading.classList.add(CLASS_VISIBILITY);
				self.pullLoading.classList.remove(CLASS_HIDDEN);
				self.pullCaption.innerHTML = ''; //修正5+里边第一次加载时，文字显示的bug(还会显示出来个“多”,猜测应该是渲染问题导致的)
				self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH;
				self.pullCaption.innerHTML = self.options.up.contentrefresh;
				callback = callback || self.options.up.callback;
				callback && callback.call(self);
			}, 300);
		},
		endPullupToRefresh: function(finished) {
			var self = this;
			if (self.pullLoading) {
				self.pullLoading.classList.remove(CLASS_VISIBILITY);
				self.pullLoading.classList.add(CLASS_HIDDEN);
				self.isLoading = false;
				if (finished) {
					self.finished = true;
					self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
					self.pullCaption.innerHTML = self.options.up.contentnomore;
					//					self.bottomPocket.classList.remove(CLASS_BLOCK);
					//					self.bottomPocket.classList.add(CLASS_HIDDEN);
					//取消5+的plusscrollbottom事件
					document.removeEventListener('plusscrollbottom', self);
					window.removeEventListener('dragup', self);
				} else { //初始化时隐藏，后续不再隐藏
					self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
					self.pullCaption.innerHTML = self.options.up.contentdown;
					//					setTimeout(function() {
					//						self.loading || self.bottomPocket.classList.remove(CLASS_BLOCK);
					//					}, 350);
				}
			}
		},
		disablePullupToRefresh: function() {
			this._initPullupRefresh();
			this.bottomPocket.className = 'mui-pull-bottom-pocket' + ' ' + CLASS_HIDDEN;
			window.removeEventListener('dragup', this);
		},
		enablePullupToRefresh: function() {
			this._initPullupRefresh();
			this.bottomPocket.classList.remove(CLASS_HIDDEN);
			this.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
			this.pullCaption.innerHTML = this.options.up.contentdown;
			document.addEventListener("plusscrollbottom", this);
			window.addEventListener('dragup', this);
		},
		scrollTo: function(x, y, time) {
			$.scrollTo(y, time);
		},
		refresh: function(isReset) {
			if (isReset && this.finished) {
				this.enablePullupToRefresh();
				this.finished = false;
			}
		}
	}, $.PullRefresh));

	//override h5 pullRefresh
	$.fn.pullRefresh = function(options) {
		var self;
		if (this.length === 0) {
			self = document.createElement('div');
			self.className = 'mui-content';
			document.body.appendChild(self);
		} else {
			self = this[0];
		}
		//一个父需要支持多个子下拉刷新
		options = options || {}
		if (typeof options === 'string') {
			options = $.parseJSON(options);
		};
		!options.webviewId && (options.webviewId = (plus.webview.currentWebview().id || plus.webview.currentWebview().getURL()));
		var pullRefreshApi = null;
		var attrWebviewId = options.webviewId && options.webviewId.replace(/\//g, "_"); //替换所有"/"
		var id = self.getAttribute('data-pullrefresh-plus-' + attrWebviewId);
		if (!id) { //避免重复初始化5+ pullrefresh
			id = ++$.uuid;
			self.setAttribute('data-pullrefresh-plus-' + attrWebviewId, id);
			document.body.classList.add(CLASS_PLUS_PULLREFRESH);
			$.data[id] = pullRefreshApi = new PlusPullRefresh(self, options);
		} else {
			pullRefreshApi = $.data[id];
		}
		if (options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
			pullRefreshApi._pulldownLoading(); //parent webview
		} else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
			pullRefreshApi.pullupLoading();
		}
		return pullRefreshApi;
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
(function($, window, document, name) {
	var CLASS_OFF_CANVAS_LEFT = 'mui-off-canvas-left';
	var CLASS_OFF_CANVAS_RIGHT = 'mui-off-canvas-right';
	var CLASS_ACTION_BACKDROP = 'mui-off-canvas-backdrop';
	var CLASS_OFF_CANVAS_WRAP = 'mui-off-canvas-wrap';

	var CLASS_SLIDE_IN = 'mui-slide-in';
	var CLASS_ACTIVE = 'mui-active';


	var CLASS_TRANSITIONING = 'mui-transitioning';

	var SELECTOR_INNER_WRAP = '.mui-inner-wrap';


	var OffCanvas = $.Class.extend({
		init: function(element, options) {
			this.wrapper = this.element = element;
			this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
			this.classList = this.wrapper.classList;
			if (this.scroller) {
				this.options = $.extend(true, {
					dragThresholdX: 10,
					scale: 0.8,
					opacity: 0.1,
					preventDefaultException: {
						tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO)$/
					},
				}, options);
				document.body.classList.add('mui-fullscreen'); //fullscreen
				this.refresh();
				this.initEvent();
			}
		},
		_preventDefaultException: function(el, exceptions) {
			for (var i in exceptions) {
				if (exceptions[i].test(el[i])) {
					return true;
				}
			}
			return false;
		},
		refresh: function(offCanvas) {
			//			offCanvas && !offCanvas.classList.contains(CLASS_ACTIVE) && this.classList.remove(CLASS_ACTIVE);
			this.slideIn = this.classList.contains(CLASS_SLIDE_IN);
			this.scalable = this.classList.contains('mui-scalable') && !this.slideIn;
			this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
			//			!offCanvas && this.scroller.classList.remove(CLASS_TRANSITIONING);
			//			!offCanvas && this.scroller.setAttribute('style', '');
			this.offCanvasLefts = this.wrapper.querySelectorAll('.' + CLASS_OFF_CANVAS_LEFT);
			this.offCanvasRights = this.wrapper.querySelectorAll('.' + CLASS_OFF_CANVAS_RIGHT);
			if (offCanvas) {
				if (offCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT)) {
					this.offCanvasLeft = offCanvas;
				} else if (offCanvas.classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
					this.offCanvasRight = offCanvas;
				}
			} else {
				this.offCanvasRight = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT);
				this.offCanvasLeft = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT);
			}
			this.offCanvasRightWidth = this.offCanvasLeftWidth = 0;
			this.offCanvasLeftSlideIn = this.offCanvasRightSlideIn = false;
			if (this.offCanvasRight) {
				this.offCanvasRightWidth = this.offCanvasRight.offsetWidth;
				this.offCanvasRightSlideIn = this.slideIn && (this.offCanvasRight.parentNode === this.wrapper);
				//				this.offCanvasRight.classList.remove(CLASS_TRANSITIONING);
				//				this.offCanvasRight.classList.remove(CLASS_ACTIVE);
				//				this.offCanvasRight.setAttribute('style', '');
			}
			if (this.offCanvasLeft) {
				this.offCanvasLeftWidth = this.offCanvasLeft.offsetWidth;
				this.offCanvasLeftSlideIn = this.slideIn && (this.offCanvasLeft.parentNode === this.wrapper);
				//				this.offCanvasLeft.classList.remove(CLASS_TRANSITIONING);
				//				this.offCanvasLeft.classList.remove(CLASS_ACTIVE);
				//				this.offCanvasLeft.setAttribute('style', '');
			}
			this.backdrop = this.scroller.querySelector('.' + CLASS_ACTION_BACKDROP);

			this.options.dragThresholdX = this.options.dragThresholdX || 10;

			this.visible = false;
			this.startX = null;
			this.lastX = null;
			this.offsetX = null;
			this.lastTranslateX = null;
		},
		handleEvent: function(e) {
			switch (e.type) {
				case 'touchstart':
					e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
					break;
				case 'webkitTransitionEnd': //有个bug需要处理，需要考虑假设没有触发webkitTransitionEnd的情况
					if (e.target === this.scroller) {
						this._dispatchEvent();
					}
					break;
				case 'drag':
					var detail = e.detail;
					if (!this.startX) {
						this.startX = detail.center.x;
						this.lastX = this.startX;
					} else {
						this.lastX = detail.center.x;
					}
					if (!this.isDragging && Math.abs(this.lastX - this.startX) > this.options.dragThresholdX && (detail.direction === 'left' || (detail.direction === 'right'))) {
						if (this.slideIn) {
							this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
							if (this.classList.contains(CLASS_ACTIVE)) {
								if (this.offCanvasRight && this.offCanvasRight.classList.contains(CLASS_ACTIVE)) {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								} else {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								}
							} else {
								if (detail.direction === 'left' && this.offCanvasRight) {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								} else if (detail.direction === 'right' && this.offCanvasLeft) {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								} else {
									this.scroller = null;
								}
							}
						} else {
							if (this.classList.contains(CLASS_ACTIVE)) {
								if (detail.direction === 'left') {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								} else {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								}
							} else {
								if (detail.direction === 'right') {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								} else {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								}
							}
						}
						if (this.offCanvas && this.scroller) {
							this.startX = this.lastX;
							this.isDragging = true;

							$.gestures.session.lockDirection = true; //锁定方向
							$.gestures.session.startDirection = detail.direction;

							this.offCanvas.classList.remove(CLASS_TRANSITIONING);
							this.scroller.classList.remove(CLASS_TRANSITIONING);
							this.offsetX = this.getTranslateX();
							this._initOffCanvasVisible();
						}
					}
					if (this.isDragging) {
						this.updateTranslate(this.offsetX + (this.lastX - this.startX));
						detail.gesture.preventDefault();
						e.stopPropagation();
					}
					break;
				case 'dragend':
					if (this.isDragging) {
						var detail = e.detail;
						var direction = detail.direction;
						this.isDragging = false;
						this.offCanvas.classList.add(CLASS_TRANSITIONING);
						this.scroller.classList.add(CLASS_TRANSITIONING);
						var ratio = 0;
						var x = this.getTranslateX();
						if (!this.slideIn) {
							if (x >= 0) {
								ratio = (this.offCanvasLeftWidth && (x / this.offCanvasLeftWidth)) || 0;
							} else {
								ratio = (this.offCanvasRightWidth && (x / this.offCanvasRightWidth)) || 0;
							}
							if (ratio === 0) {
								this.openPercentage(0);
								this._dispatchEvent(); //此处不触发webkitTransitionEnd,所以手动dispatch
								return;
							}
							if (ratio > 0 && ratio < 0.5 && direction === 'right') {
								this.openPercentage(0);
							} else if (ratio > 0.5 && direction === 'left') {
								this.openPercentage(100);
							} else if (ratio < 0 && ratio > -0.5 && direction === 'left') {
								this.openPercentage(0);
							} else if (direction === 'right' && ratio < 0 && ratio > -0.5) {
								this.openPercentage(0);
							} else if (ratio < 0.5 && direction === 'right') {
								this.openPercentage(-100);
							} else if (direction === 'right' && ratio >= 0 && (ratio >= 0.5 || detail.flick)) {
								this.openPercentage(100);
							} else if (direction === 'left' && ratio <= 0 && (ratio <= -0.5 || detail.flick)) {
								this.openPercentage(-100);
							} else {
								this.openPercentage(0);
							}
							if (ratio === 1 || ratio === -1) { //此处不触发webkitTransitionEnd,所以手动dispatch
								this._dispatchEvent();
							}
						} else {
							if (x >= 0) {
								ratio = (this.offCanvasRightWidth && (x / this.offCanvasRightWidth)) || 0;
							} else {
								ratio = (this.offCanvasLeftWidth && (x / this.offCanvasLeftWidth)) || 0;
							}
							if (ratio >= 0.5 && direction === 'left') {
								this.openPercentage(0);
							} else if (ratio > 0 && ratio <= 0.5 && direction === 'left') {
								this.openPercentage(-100);
							} else if (ratio >= 0.5 && direction === 'right') {
								this.openPercentage(0);
							} else if (ratio >= -0.5 && ratio < 0 && direction === 'left') {
								this.openPercentage(100);
							} else if (ratio > 0 && ratio <= 0.5 && direction === 'right') {
								this.openPercentage(-100);
							} else if (ratio <= -0.5 && direction === 'right') {
								this.openPercentage(0);
							} else if (ratio >= -0.5 && direction === 'right') {
								this.openPercentage(100);
							} else if (ratio <= -0.5 && direction === 'left') {
								this.openPercentage(0);
							} else if (ratio >= -0.5 && direction === 'left') {
								this.openPercentage(-100);
							} else {
								this.openPercentage(0);
							}
							if (ratio === 1 || ratio === -1 || ratio === 0) {
								this._dispatchEvent();
								return;
							}

						}
					}
					break;
			}
		},
		_dispatchEvent: function() {
			if (this.classList.contains(CLASS_ACTIVE)) {
				$.trigger(this.wrapper, 'shown', this);
			} else {
				$.trigger(this.wrapper, 'hidden', this);
			}
		},
		_initOffCanvasVisible: function() {
			if (!this.visible) {
				this.visible = true;
				if (this.offCanvasLeft) {
					this.offCanvasLeft.style.visibility = 'visible';
				}
				if (this.offCanvasRight) {
					this.offCanvasRight.style.visibility = 'visible';
				}
			}
		},
		initEvent: function() {
			var self = this;
			if (self.backdrop) {
				self.backdrop.addEventListener('tap', function(e) {
					self.close();
					e.detail.gesture.preventDefault();
				});
			}
			if (this.classList.contains('mui-draggable')) {
				this.wrapper.addEventListener('touchstart', this); //临时处理
				this.wrapper.addEventListener('drag', this);
				this.wrapper.addEventListener('dragend', this);
			}
			this.wrapper.addEventListener('webkitTransitionEnd', this);
		},
		openPercentage: function(percentage) {
			var p = percentage / 100;
			if (!this.slideIn) {
				if (this.offCanvasLeft && percentage >= 0) {
					this.updateTranslate(this.offCanvasLeftWidth * p);
					this.offCanvasLeft.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				} else if (this.offCanvasRight && percentage <= 0) {
					this.updateTranslate(this.offCanvasRightWidth * p);
					this.offCanvasRight.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				}
				this.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
			} else {
				if (this.offCanvasLeft && percentage >= 0) {
					p = p === 0 ? -1 : 0;
					this.updateTranslate(this.offCanvasLeftWidth * p);
					this.offCanvasLeft.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				} else if (this.offCanvasRight && percentage <= 0) {
					p = p === 0 ? 1 : 0;
					this.updateTranslate(this.offCanvasRightWidth * p);
					this.offCanvasRight.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				}
				this.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
			}

		},
		updateTranslate: function(x) {
			if (x !== this.lastTranslateX) {
				if (!this.slideIn) {
					if ((!this.offCanvasLeft && x > 0) || (!this.offCanvasRight && x < 0)) {
						this.setTranslateX(0);
						return;
					}
					if (this.leftShowing && x > this.offCanvasLeftWidth) {
						this.setTranslateX(this.offCanvasLeftWidth);
						return;
					}
					if (this.rightShowing && x < -this.offCanvasRightWidth) {
						this.setTranslateX(-this.offCanvasRightWidth);
						return;
					}
					this.setTranslateX(x);
					if (x >= 0) {
						this.leftShowing = true;
						this.rightShowing = false;
						if (x > 0) {
							if (this.offCanvasLeft) {
								$.each(this.offCanvasLefts, function(index, offCanvas) {
									if (offCanvas === this.offCanvasLeft) {
										this.offCanvasLeft.style.zIndex = 0;
									} else {
										offCanvas.style.zIndex = -1;
									}
								}.bind(this));
							}
							if (this.offCanvasRight) {
								this.offCanvasRight.style.zIndex = -1;
							}
						}
					} else {
						this.rightShowing = true;
						this.leftShowing = false;
						if (this.offCanvasRight) {
							$.each(this.offCanvasRights, function(index, offCanvas) {
								if (offCanvas === this.offCanvasRight) {
									offCanvas.style.zIndex = 0;
								} else {
									offCanvas.style.zIndex = -1;
								}
							}.bind(this));
						}
						if (this.offCanvasLeft) {
							this.offCanvasLeft.style.zIndex = -1;
						}
					}
				} else {
					if (this.offCanvas.classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
						if (x < 0) {
							this.setTranslateX(0);
							return;
						}
						if (x > this.offCanvasRightWidth) {
							this.setTranslateX(this.offCanvasRightWidth);
							return;
						}
					} else {
						if (x > 0) {
							this.setTranslateX(0);
							return;
						}
						if (x < -this.offCanvasLeftWidth) {
							this.setTranslateX(-this.offCanvasLeftWidth);
							return;
						}
					}
					this.setTranslateX(x);
				}
				this.lastTranslateX = x;
			}
		},
		setTranslateX: $.animationFrame(function(x) {
			if (this.scroller) {
				if (this.scalable && this.offCanvas.parentNode === this.wrapper) {
					var percent = Math.abs(x) / this.offCanvasWidth;
					var zoomOutScale = 1 - (1 - this.options.scale) * percent;
					var zoomInScale = this.options.scale + (1 - this.options.scale) * percent;
					var zoomOutOpacity = 1 - (1 - this.options.opacity) * percent;
					var zoomInOpacity = this.options.opacity + (1 - this.options.opacity) * percent;
					if (this.offCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT)) {
						this.offCanvas.style.webkitTransformOrigin = '-100%';
						this.scroller.style.webkitTransformOrigin = 'left';
					} else {
						this.offCanvas.style.webkitTransformOrigin = '200%';
						this.scroller.style.webkitTransformOrigin = 'right';
					}
					this.offCanvas.style.opacity = zoomInOpacity;
					this.offCanvas.style.webkitTransform = 'translate3d(0,0,0) scale(' + zoomInScale + ')';
					this.scroller.style.webkitTransform = 'translate3d(' + x + 'px,0,0) scale(' + zoomOutScale + ')';
				} else {
					if (this.slideIn) {
						this.offCanvas.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
					} else {
						this.scroller.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
					}
				}
			}
		}),
		getTranslateX: function() {
			if (this.offCanvas) {
				var scroller = this.slideIn ? this.offCanvas : this.scroller;
				var result = $.parseTranslateMatrix($.getStyles(scroller, 'webkitTransform'));
				return (result && result.x) || 0;
			}
			return 0;
		},
		isShown: function(direction) {
			var shown = false;
			if (!this.slideIn) {
				var x = this.getTranslateX();
				if (direction === 'right') {
					shown = this.classList.contains(CLASS_ACTIVE) && x < 0;
				} else if (direction === 'left') {
					shown = this.classList.contains(CLASS_ACTIVE) && x > 0;
				} else {
					shown = this.classList.contains(CLASS_ACTIVE) && x !== 0;
				}
			} else {
				if (direction === 'left') {
					shown = this.classList.contains(CLASS_ACTIVE) && this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE);
				} else if (direction === 'right') {
					shown = this.classList.contains(CLASS_ACTIVE) && this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE);
				} else {
					shown = this.classList.contains(CLASS_ACTIVE) && (this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE) || this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE));
				}
			}
			return shown;
		},
		close: function() {
			this._initOffCanvasVisible();
			this.offCanvas = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE) || this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE);
			this.offCanvasWidth = this.offCanvas.offsetWidth;
			if (this.scroller) {
				this.offCanvas.offsetHeight;
				this.offCanvas.classList.add(CLASS_TRANSITIONING);
				this.scroller.classList.add(CLASS_TRANSITIONING);
				this.openPercentage(0);
			}
		},
		show: function(direction) {
			this._initOffCanvasVisible();
			if (this.isShown(direction)) {
				return false;
			}
			if (!direction) {
				direction = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT) ? 'right' : 'left';
			}
			if (direction === 'right') {
				this.offCanvas = this.offCanvasRight;
				this.offCanvasWidth = this.offCanvasRightWidth;
			} else {
				this.offCanvas = this.offCanvasLeft;
				this.offCanvasWidth = this.offCanvasLeftWidth;
			}
			if (this.scroller) {
				this.offCanvas.offsetHeight;
				this.offCanvas.classList.add(CLASS_TRANSITIONING);
				this.scroller.classList.add(CLASS_TRANSITIONING);
				this.openPercentage(direction === 'left' ? 100 : -100);
			}
			return true;
		},
		toggle: function(directionOrOffCanvas) {
			var direction = directionOrOffCanvas;
			if (directionOrOffCanvas && directionOrOffCanvas.classList) {
				direction = directionOrOffCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT) ? 'left' : 'right';
				this.refresh(directionOrOffCanvas);
			}
			if (!this.show(direction)) {
				this.close();
			}
		}
	});

	//hash to offcanvas
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
	};
	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			var offcanvas = document.getElementById(target.hash.replace('#', ''));
			if (offcanvas) {
				var container = findOffCanvasContainer(offcanvas);
				if (container) {
					$.targets._container = container;
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

	window.addEventListener('tap', function(e) {
		if (!$.targets.offcanvas) {
			return;
		}
		//TODO 此处类型的代码后续考虑统一优化(target机制)，现在的实现费力不讨好
		var target = e.target;
		for (; target && target !== document; target = target.parentNode) {
			if (target.tagName === 'A' && target.hash && target.hash === ('#' + $.targets.offcanvas.id)) {
				e.detail && e.detail.gesture && e.detail.gesture.preventDefault(); //fixed hashchange
				$($.targets._container).offCanvas().toggle($.targets.offcanvas);
				$.targets.offcanvas = $.targets._container = null;
				break;
			}
		}
	});

	$.fn.offCanvas = function(options) {
		var offCanvasApis = [];
		this.each(function() {
			var offCanvasApi = null;
			var self = this;
			//hack old version
			if (!self.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
				self = findOffCanvasContainer(self);
			}
			var id = self.getAttribute('data-offCanvas');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = offCanvasApi = new OffCanvas(self, options);
				self.setAttribute('data-offCanvas', id);
			} else {
				offCanvasApi = $.data[id];
			}
			if (options === 'show' || options === 'close' || options === 'toggle') {
				offCanvasApi.toggle();
			}
			offCanvasApis.push(offCanvasApi);
		});
		return offCanvasApis.length === 1 ? offCanvasApis[0] : offCanvasApis;
	};
	$.ready(function() {
		$('.mui-off-canvas-wrap').offCanvas();
	});
})(mui, window, document, 'offcanvas');
/**
 * actions
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var CLASS_ACTION = 'mui-action';

	var handle = function(event, target) {
		var className = target.className || '';
		if (typeof className !== 'string') { //svg className(SVGAnimatedString)
			className = '';
		}
		if (className && ~className.indexOf(CLASS_ACTION)) {
			if (target.classList.contains('mui-action-back')) {
				event.preventDefault();
			}
			return target;
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 50,
		handle: handle,
		target: false,
		isContinue: true
	});

})(mui, 'action');
/**
 * Modals
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @returns {undefined}
 */
(function($, window, document, name) {
	var CLASS_MODAL = 'mui-modal';

	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			var modal = document.getElementById(target.hash.replace('#', ''));
			if (modal && modal.classList.contains(CLASS_MODAL)) {
				return modal;
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 50,
		handle: handle,
		target: false,
		isReset: false,
		isContinue: true
	});

	window.addEventListener('tap', function(event) {
		if ($.targets.modal) {
			event.detail.gesture.preventDefault(); //fixed hashchange
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
(function($, window, document, name) {

	var CLASS_POPOVER = 'mui-popover';
	var CLASS_POPOVER_ARROW = 'mui-popover-arrow';
	var CLASS_ACTION_POPOVER = 'mui-popover-action';
	var CLASS_BACKDROP = 'mui-backdrop';
	var CLASS_BAR_POPOVER = 'mui-bar-popover';
	var CLASS_BAR_BACKDROP = 'mui-bar-backdrop';
	var CLASS_ACTION_BACKDROP = 'mui-backdrop-action';
	var CLASS_ACTIVE = 'mui-active';
	var CLASS_BOTTOM = 'mui-bottom';



	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			$.targets._popover = document.getElementById(target.hash.replace('#', ''));
			if ($.targets._popover && $.targets._popover.classList.contains(CLASS_POPOVER)) {
				return target;
			} else {
				$.targets._popover = null;
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
		//		if (isPopoverScroll) {
		//			document.body.setAttribute('style', 'overflow:hidden;');
		//		} else {
		//			document.body.setAttribute('style', '');
		//		}
	};
	var onPopoverShown = function(e) {
		this.removeEventListener('webkitTransitionEnd', onPopoverShown);
		this.addEventListener('touchmove', $.preventDefault);
		$.trigger(this, 'shown', this);
	}
	var onPopoverHidden = function(e) {
		setStyle(this, 'none');
		this.removeEventListener('webkitTransitionEnd', onPopoverHidden);
		this.removeEventListener('touchmove', $.preventDefault);
		fixedPopoverScroll(false);
		$.trigger(this, 'hidden', this);
	};

	var backdrop = (function() {
		var element = document.createElement('div');
		element.classList.add(CLASS_BACKDROP);
		element.addEventListener('touchmove', $.preventDefault);
		element.addEventListener('tap', function(e) {
			var popover = $.targets._popover;
			if (popover) {
				popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
				popover.classList.remove(CLASS_ACTIVE);
				removeBackdrop(popover);
				document.body.setAttribute('style', ''); //webkitTransitionEnd有时候不触发？
			}
		});

		return element;
	}());
	var removeBackdropTimer;
	var removeBackdrop = function(popover) {
		backdrop.setAttribute('style', 'opacity:0');
		$.targets.popover = $.targets._popover = null; //reset
		removeBackdropTimer = $.later(function() {
			if (!popover.classList.contains(CLASS_ACTIVE) && backdrop.parentNode && backdrop.parentNode === document.body) {
				document.body.removeChild(backdrop);
			}
		}, 350);
	};
	window.addEventListener('tap', function(e) {
		if (!$.targets.popover) {
			return;
		}
		var toggle = false;
		var target = e.target;
		for (; target && target !== document; target = target.parentNode) {
			if (target === $.targets.popover) {
				toggle = true;
			}
		}
		if (toggle) {
			e.detail.gesture.preventDefault(); //fixed hashchange
			togglePopover($.targets._popover, $.targets.popover);
		}

	});

	var togglePopover = function(popover, anchor) {
		removeBackdropTimer && removeBackdropTimer.cancel(); //取消remove的timer
		//remove一遍，以免来回快速切换，导致webkitTransitionEnd不触发，无法remove
		popover.removeEventListener('webkitTransitionEnd', onPopoverShown);
		popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
		backdrop.classList.remove(CLASS_BAR_BACKDROP);
		backdrop.classList.remove(CLASS_ACTION_BACKDROP);
		var _popover = document.querySelector('.mui-popover.mui-active');
		if (_popover) {
			//			_popover.setAttribute('style', '');
			_popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
			_popover.classList.remove(CLASS_ACTIVE);
			//			_popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
			//			fixedPopoverScroll(false);
			//同一个弹出则直接返回，解决同一个popover的toggle
			if (popover === _popover) {
				removeBackdrop(_popover);
				return;
			}
		}
		var isActionSheet = false;
		if (popover.classList.contains(CLASS_BAR_POPOVER) || popover.classList.contains(CLASS_ACTION_POPOVER)) { //navBar
			if (popover.classList.contains(CLASS_ACTION_POPOVER)) { //action sheet popover
				isActionSheet = true;
				backdrop.classList.add(CLASS_ACTION_BACKDROP);
			} else { //bar popover
				backdrop.classList.add(CLASS_BAR_BACKDROP);
				//				if (anchor) {
				//					if (anchor.parentNode) {
				//						var offsetWidth = anchor.offsetWidth;
				//						var offsetLeft = anchor.offsetLeft;
				//						var innerWidth = window.innerWidth;
				//						popover.style.left = (Math.min(Math.max(offsetLeft, defaultPadding), innerWidth - offsetWidth - defaultPadding)) + "px";
				//					} else {
				//						//TODO anchor is position:{left,top,bottom,right}
				//					}
				//				}
			}
		}
		setStyle(popover, 'block'); //actionsheet transform
		popover.offsetHeight;
		popover.classList.add(CLASS_ACTIVE);
		backdrop.setAttribute('style', '');
		document.body.appendChild(backdrop);
		fixedPopoverScroll(true);
		calPosition(popover, anchor, isActionSheet); //position
		backdrop.classList.add(CLASS_ACTIVE);
		popover.addEventListener('webkitTransitionEnd', onPopoverShown);
	};
	var setStyle = function(popover, display, top, left) {
		var style = popover.style;
		if (typeof display !== 'undefined')
			style.display = display;
		if (typeof top !== 'undefined')
			style.top = top + 'px';
		if (typeof left !== 'undefined')
			style.left = left + 'px';
	};
	var calPosition = function(popover, anchor, isActionSheet) {
		if (!popover || !anchor) {
			return;
		}

		if (isActionSheet) { //actionsheet
			setStyle(popover, 'block')
			return;
		}

		var wWidth = window.innerWidth;
		var wHeight = window.innerHeight;

		var pWidth = popover.offsetWidth;
		var pHeight = popover.offsetHeight;

		var aWidth = anchor.offsetWidth;
		var aHeight = anchor.offsetHeight;
		var offset = $.offset(anchor);

		var arrow = popover.querySelector('.' + CLASS_POPOVER_ARROW);
		if (!arrow) {
			arrow = document.createElement('div');
			arrow.className = CLASS_POPOVER_ARROW;
			popover.appendChild(arrow);
		}
		var arrowSize = arrow && arrow.offsetWidth / 2 || 0;



		var pTop = 0;
		var pLeft = 0;
		var diff = 0;
		var arrowLeft = 0;
		var defaultPadding = popover.classList.contains(CLASS_ACTION_POPOVER) ? 0 : 5;

		var position = 'top';
		if ((pHeight + arrowSize) < (offset.top - window.pageYOffset)) { //top
			pTop = offset.top - pHeight - arrowSize;
		} else if ((pHeight + arrowSize) < (wHeight - (offset.top - window.pageYOffset) - aHeight)) { //bottom
			position = 'bottom';
			pTop = offset.top + aHeight + arrowSize;
		} else { //middle
			position = 'middle';
			pTop = Math.max((wHeight - pHeight) / 2 + window.pageYOffset, 0);
			pLeft = Math.max((wWidth - pWidth) / 2 + window.pageXOffset, 0);
		}
		if (position === 'top' || position === 'bottom') {
			pLeft = aWidth / 2 + offset.left - pWidth / 2;
			diff = pLeft;
			if (pLeft < defaultPadding) pLeft = defaultPadding;
			if (pLeft + pWidth > wWidth) pLeft = wWidth - pWidth - defaultPadding;

			if (arrow) {
				if (position === 'top') {
					arrow.classList.add(CLASS_BOTTOM);
				} else {
					arrow.classList.remove(CLASS_BOTTOM);
				}
				diff = diff - pLeft;
				arrowLeft = (pWidth / 2 - arrowSize / 2 + diff);
				arrowLeft = Math.max(Math.min(arrowLeft, pWidth - arrowSize * 2 - 6), 6);
				arrow.setAttribute('style', 'left:' + arrowLeft + 'px');
			}
		} else if (position === 'middle') {
			arrow.setAttribute('style', 'display:none');
		}
		setStyle(popover, 'block', pTop, pLeft);
	};

	$.createMask = function(callback) {
		var element = document.createElement('div');
		element.classList.add(CLASS_BACKDROP);
		element.addEventListener('touchmove', $.preventDefault);
		element.addEventListener('tap', function() {
			mask.close();
		});
		var mask = [element];
		mask._show = false;
		mask.show = function() {
			mask._show = true;
			element.setAttribute('style', 'opacity:1');
			document.body.appendChild(element);
			return mask;
		};
		mask._remove = function() {
			if (mask._show) {
				mask._show = false;
				element.setAttribute('style', 'opacity:0');
				$.later(function() {
					var body = document.body;
					element.parentNode === body && body.removeChild(element);
				}, 350);
			}
			return mask;
		};
		mask.close = function() {
			if (callback) {
				if (callback() !== false) {
					mask._remove();
				}
			} else {
				mask._remove();
			}
		};
		return mask;
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
	var CLASS_SEGMENTED_CONTROL = 'mui-segmented-control';
	var CLASS_SEGMENTED_CONTROL_VERTICAL = 'mui-segmented-control-vertical';
	var CLASS_CONTROL_CONTENT = 'mui-control-content';
	var CLASS_TAB_BAR = 'mui-bar-tab';
	var CLASS_TAB_ITEM = 'mui-tab-item';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';

	var handle = function(event, target) {
		if (target.classList && (target.classList.contains(CLASS_CONTROL_ITEM) || target.classList.contains(CLASS_TAB_ITEM))) {
			if (target.parentNode && target.parentNode.classList && target.parentNode.classList.contains(CLASS_SEGMENTED_CONTROL_VERTICAL)) {
				//vertical 如果preventDefault会导致无法滚动
			} else {
				event.preventDefault(); //stop hash change				
			}
			//			if (target.hash) {
			return target;
			//			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 80,
		handle: handle,
		target: false
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
		var segmentedControl = targetTab.parentNode;

		for (; segmentedControl && segmentedControl !== document; segmentedControl = segmentedControl.parentNode) {
			if (segmentedControl.classList.contains(CLASS_SEGMENTED_CONTROL)) {
				activeTab = segmentedControl.querySelector(classSelector + '.' + CLASS_CONTROL_ITEM);
				break;
			} else if (segmentedControl.classList.contains(CLASS_TAB_BAR)) {
				activeTab = segmentedControl.querySelector(classSelector + '.' + CLASS_TAB_ITEM);
			}
		}


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
		if (!targetBody.classList.contains(CLASS_CONTROL_CONTENT)) { //tab bar popover
			targetTab.classList[isLastActive ? 'remove' : 'add'](className);
			return;
		}
		if (isLastActive) { //same
			return;
		}
		var parentNode = targetBody.parentNode;
		activeBodies = parentNode.querySelectorAll('.' + CLASS_CONTROL_CONTENT + classSelector);
		for (var i = 0; i < activeBodies.length; i++) {
			var activeBody = activeBodies[i];
			activeBody.parentNode === parentNode && activeBody.classList.remove(className);
		}

		targetBody.classList.add(className);

		var contents = targetBody.parentNode.querySelectorAll('.' + CLASS_CONTROL_CONTENT);
		$.trigger(targetBody, $.eventName('shown', name), {
			tabNumber: Array.prototype.indexOf.call(contents, targetBody)
		});
		e.detail && e.detail.gesture.preventDefault(); //fixed hashchange
	});

})(mui, window, document, 'tab');
/**
 * Toggles switch
 * @param {type} $
 * @param {type} window
 * @param {type} name
 * @returns {undefined}
 */
(function($, window, name) {

	var CLASS_SWITCH = 'mui-switch';
	var CLASS_SWITCH_HANDLE = 'mui-switch-handle';
	var CLASS_ACTIVE = 'mui-active';
	var CLASS_DRAGGING = 'mui-dragging';

	var CLASS_DISABLED = 'mui-disabled';

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


	var Toggle = function(element) {
		this.element = element;
		this.classList = this.element.classList;
		this.handle = this.element.querySelector(SELECTOR_SWITCH_HANDLE);
		this.init();
		this.initEvent();
	};
	Toggle.prototype.init = function() {
		this.toggleWidth = this.element.offsetWidth;
		this.handleWidth = this.handle.offsetWidth;
		this.handleX = this.toggleWidth - this.handleWidth - 3;
	};
	Toggle.prototype.initEvent = function() {
		this.element.addEventListener('touchstart', this);
		this.element.addEventListener('drag', this);
		this.element.addEventListener('swiperight', this);
		this.element.addEventListener('touchend', this);
		this.element.addEventListener('touchcancel', this);

	};
	Toggle.prototype.handleEvent = function(e) {
		if (this.classList.contains(CLASS_DISABLED)) {
			return;
		}
		switch (e.type) {
			case 'touchstart':
				this.start(e);
				break;
			case 'drag':
				this.drag(e);
				break;
			case 'swiperight':
				this.swiperight();
				break;
			case 'touchend':
			case 'touchcancel':
				this.end(e);
				break;
		}
	};
	Toggle.prototype.start = function(e) {
		this.classList.add(CLASS_DRAGGING);
		if (this.toggleWidth === 0 || this.handleWidth === 0) { //当switch处于隐藏状态时，width为0，需要重新初始化
			this.init();
		}
	};
	Toggle.prototype.drag = function(e) {
		var detail = e.detail;
		if (!this.isDragging) {
			if (detail.direction === 'left' || detail.direction === 'right') {
				this.isDragging = true;
				this.lastChanged = undefined;
				this.initialState = this.classList.contains(CLASS_ACTIVE);
			}
		}
		if (this.isDragging) {
			this.setTranslateX(detail.deltaX);
			e.stopPropagation();
			detail.gesture.preventDefault();
		}
	};
	Toggle.prototype.swiperight = function(e) {
		if (this.isDragging) {
			e.stopPropagation();
		}
	};
	Toggle.prototype.end = function(e) {
		this.classList.remove(CLASS_DRAGGING);
		if (this.isDragging) {
			this.isDragging = false;
			e.stopPropagation();
			$.trigger(this.element, 'toggle', {
				isActive: this.classList.contains(CLASS_ACTIVE)
			});
		} else {
			this.toggle();
		}
	};
	Toggle.prototype.toggle = function() {
		var classList = this.classList;
		if (classList.contains(CLASS_ACTIVE)) {
			classList.remove(CLASS_ACTIVE);
			this.handle.style.webkitTransform = 'translate(0,0)';
		} else {
			classList.add(CLASS_ACTIVE);
			this.handle.style.webkitTransform = 'translate(' + this.handleX + 'px,0)';
		}
		$.trigger(this.element, 'toggle', {
			isActive: this.classList.contains(CLASS_ACTIVE)
		});
	};
	Toggle.prototype.setTranslateX = $.animationFrame(function(x) {
		if (!this.isDragging) {
			return;
		}
		var isChanged = false;
		if ((this.initialState && -x > (this.handleX / 2)) || (!this.initialState && x > (this.handleX / 2))) {
			isChanged = true;
		}
		if (this.lastChanged !== isChanged) {
			if (isChanged) {
				this.handle.style.webkitTransform = 'translate(' + (this.initialState ? 0 : this.handleX) + 'px,0)';
				this.classList[this.initialState ? 'remove' : 'add'](CLASS_ACTIVE);
			} else {
				this.handle.style.webkitTransform = 'translate(' + (this.initialState ? this.handleX : 0) + 'px,0)';
				this.classList[this.initialState ? 'add' : 'remove'](CLASS_ACTIVE);
			}
			this.lastChanged = isChanged;
		}

	});

	$.fn['switch'] = function(options) {
		var switchApis = [];
		this.each(function() {
			var switchApi = null;
			var id = this.getAttribute('data-switch');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = new Toggle(this);
				this.setAttribute('data-switch', id);
			} else {
				switchApi = $.data[id];
			}
			switchApis.push(switchApi);
		});
		return switchApis.length > 1 ? switchApis : switchApis[0];
	};
	$.ready(function() {
		$('.' + CLASS_SWITCH)['switch']();
	});
})(mui, window, 'toggle');
/**
 * Tableviews
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {

	var CLASS_ACTIVE = 'mui-active';
	var CLASS_SELECTED = 'mui-selected';
	var CLASS_GRID_VIEW = 'mui-grid-view';
	var CLASS_RADIO_VIEW = 'mui-table-view-radio';
	var CLASS_TABLE_VIEW_CELL = 'mui-table-view-cell';
	var CLASS_COLLAPSE_CONTENT = 'mui-collapse-content';
	var CLASS_DISABLED = 'mui-disabled';
	var CLASS_TOGGLE = 'mui-switch';
	var CLASS_BTN = 'mui-btn';

	var CLASS_SLIDER_HANDLE = 'mui-slider-handle';
	var CLASS_SLIDER_LEFT = 'mui-slider-left';
	var CLASS_SLIDER_RIGHT = 'mui-slider-right';
	var CLASS_TRANSITIONING = 'mui-transitioning';


	var SELECTOR_SLIDER_HANDLE = '.' + CLASS_SLIDER_HANDLE;
	var SELECTOR_SLIDER_LEFT = '.' + CLASS_SLIDER_LEFT;
	var SELECTOR_SLIDER_RIGHT = '.' + CLASS_SLIDER_RIGHT;
	var SELECTOR_SELECTED = '.' + CLASS_SELECTED;
	var SELECTOR_BUTTON = '.' + CLASS_BTN;
	var overFactor = 0.8;
	var cell, a;

	var isMoved = isOpened = openedActions = progress = false;
	var sliderHandle = sliderActionLeft = sliderActionRight = buttonsLeft = buttonsRight = sliderDirection = sliderRequestAnimationFrame = false;
	var timer = translateX = lastTranslateX = sliderActionLeftWidth = sliderActionRightWidth = 0;



	var toggleActive = function(isActive) {
		if (isActive) {
			if (a) {
				a.classList.add(CLASS_ACTIVE);
			} else if (cell) {
				cell.classList.add(CLASS_ACTIVE);
			}
		} else {
			timer && timer.cancel();
			if (a) {
				a.classList.remove(CLASS_ACTIVE);
			} else if (cell) {
				cell.classList.remove(CLASS_ACTIVE);
			}
		}
	};

	var updateTranslate = function() {
		if (translateX !== lastTranslateX) {
			if (buttonsRight && buttonsRight.length > 0) {
				progress = translateX / sliderActionRightWidth;
				if (translateX < -sliderActionRightWidth) {
					translateX = -sliderActionRightWidth - Math.pow(-translateX - sliderActionRightWidth, overFactor);
				}
				for (var i = 0, len = buttonsRight.length; i < len; i++) {
					var buttonRight = buttonsRight[i];
					if (typeof buttonRight._buttonOffset === 'undefined') {
						buttonRight._buttonOffset = buttonRight.offsetLeft;
					}
					buttonOffset = buttonRight._buttonOffset;
					setTranslate(buttonRight, (translateX - buttonOffset * (1 + Math.max(progress, -1))));
				}
			}
			if (buttonsLeft && buttonsLeft.length > 0) {
				progress = translateX / sliderActionLeftWidth;
				if (translateX > sliderActionLeftWidth) {
					translateX = sliderActionLeftWidth + Math.pow(translateX - sliderActionLeftWidth, overFactor);
				}
				for (var i = 0, len = buttonsLeft.length; i < len; i++) {
					var buttonLeft = buttonsLeft[i];
					if (typeof buttonLeft._buttonOffset === 'undefined') {
						buttonLeft._buttonOffset = sliderActionLeftWidth - buttonLeft.offsetLeft - buttonLeft.offsetWidth;
					}
					buttonOffset = buttonLeft._buttonOffset;
					if (buttonsLeft.length > 1) {
						buttonLeft.style.zIndex = buttonsLeft.length - i;
					}
					setTranslate(buttonLeft, (translateX + buttonOffset * (1 - Math.min(progress, 1))));
				}
			}
			setTranslate(sliderHandle, translateX);
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

	window.addEventListener('touchstart', function(event) {
		if (cell) {
			toggleActive(false);
		}
		cell = a = false;
		isMoved = isOpened = openedActions = false;
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
					//TODO swipe to delete close
					var selected = cell.parentNode.querySelector(SELECTOR_SELECTED);
					if (!cell.parentNode.classList.contains(CLASS_RADIO_VIEW) && selected && selected !== cell) {
						$.swipeoutClose(selected);
						cell = isDisabled = false;
						return;
					}
					if (!cell.parentNode.classList.contains(CLASS_GRID_VIEW)) {
						var link = cell.querySelector('a');
						if (link && link.parentNode === cell) { //li>a
							a = link;
						}
					}
					var handle = cell.querySelector(SELECTOR_SLIDER_HANDLE);
					if (handle) {
						toggleEvents(cell);
						event.stopPropagation();
					}
					if (!isDisabled) {
						if (handle) {
							if (timer) {
								timer.cancel();
							}
							timer = $.later(function() {
								toggleActive(true);
							}, 100);
						} else {
							toggleActive(true);
						}
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
				case 'drag':
					this.drag(event);
					break;
				case 'dragend':
					this.dragend(event);
					break;
				case 'flick':
					this.flick(event);
					break;
				case 'swiperight':
					this.swiperight(event);
					break;
				case 'swipeleft':
					this.swipeleft(event);
					break;
			}
		},
		drag: function(event) {
			if (!cell) {
				return;
			}
			if (!isMoved) { //init
				sliderHandle = sliderActionLeft = sliderActionRight = buttonsLeft = buttonsRight = sliderDirection = sliderRequestAnimationFrame = false;
				sliderHandle = cell.querySelector(SELECTOR_SLIDER_HANDLE);
				if (sliderHandle) {
					sliderActionLeft = cell.querySelector(SELECTOR_SLIDER_LEFT);
					sliderActionRight = cell.querySelector(SELECTOR_SLIDER_RIGHT);
					if (sliderActionLeft) {
						sliderActionLeftWidth = sliderActionLeft.offsetWidth;
						buttonsLeft = sliderActionLeft.querySelectorAll(SELECTOR_BUTTON);
					}
					if (sliderActionRight) {
						sliderActionRightWidth = sliderActionRight.offsetWidth;
						buttonsRight = sliderActionRight.querySelectorAll(SELECTOR_BUTTON);
					}
					cell.classList.remove(CLASS_TRANSITIONING);
					isOpened = cell.classList.contains(CLASS_SELECTED);
					if (isOpened) {
						openedActions = cell.querySelector(SELECTOR_SLIDER_LEFT + SELECTOR_SELECTED) ? 'left' : 'right';
					}
				}
			}
			var detail = event.detail;
			var direction = detail.direction;
			var angle = detail.angle;
			if (direction === 'left' && (angle > 150 || angle < -150)) {
				if (buttonsRight || (buttonsLeft && isOpened)) { //存在右侧按钮或存在左侧按钮且是已打开状态
					isMoved = true;
				}
			} else if (direction === 'right' && (angle > -30 && angle < 30)) {
				if (buttonsLeft || (buttonsRight && isOpened)) { //存在左侧按钮或存在右侧按钮且是已打开状态
					isMoved = true;
				}
			}
			if (isMoved) {
				event.stopPropagation();
				event.detail.gesture.preventDefault();
				var translate = event.detail.deltaX;
				if (isOpened) {
					if (openedActions === 'right') {
						translate = translate - sliderActionRightWidth;
					} else {
						translate = translate + sliderActionLeftWidth;
					}
				}
				if ((translate > 0 && !buttonsLeft) || (translate < 0 && !buttonsRight)) {
					if (!isOpened) {
						return;
					}
					translate = 0;
				}
				if (translate < 0) {
					sliderDirection = 'toLeft';
				} else if (translate > 0) {
					sliderDirection = 'toRight';
				} else {
					if (!sliderDirection) {
						sliderDirection = 'toLeft';
					}
				}
				if (!sliderRequestAnimationFrame) {
					updateTranslate();
				}
				translateX = translate;
			}
		},
		flick: function(event) {
			if (isMoved) {
				event.stopPropagation();
			}
		},
		swipeleft: function(event) {
			if (isMoved) {
				event.stopPropagation();
			}
		},
		swiperight: function(event) {
			if (isMoved) {
				event.stopPropagation();
			}
		},
		dragend: function(event) {
			if (!isMoved) {
				return;
			}
			event.stopPropagation();
			if (sliderRequestAnimationFrame) {
				cancelAnimationFrame(sliderRequestAnimationFrame);
				sliderRequestAnimationFrame = null;
			}
			var detail = event.detail;
			isMoved = false;
			var action = 'close';
			var actionsWidth = sliderDirection === 'toLeft' ? sliderActionRightWidth : sliderActionLeftWidth;
			var isToggle = detail.swipe || (Math.abs(translateX) > actionsWidth / 2);
			if (isToggle) {
				if (!isOpened) {
					action = 'open';
				} else if (detail.direction === 'left' && openedActions === 'right') {
					action = 'open';
				} else if (detail.direction === 'right' && openedActions === 'left') {
					action = 'open';
				}

			}
			cell.classList.add(CLASS_TRANSITIONING);
			var buttons;
			if (action === 'open') {
				var newTranslate = sliderDirection === 'toLeft' ? -actionsWidth : actionsWidth;
				setTranslate(sliderHandle, newTranslate);
				buttons = sliderDirection === 'toLeft' ? buttonsRight : buttonsLeft;
				if (typeof buttons !== 'undefined') {
					var button = null;
					for (var i = 0; i < buttons.length; i++) {
						button = buttons[i];
						setTranslate(button, newTranslate);
					}
					button.parentNode.classList.add(CLASS_SELECTED);
					cell.classList.add(CLASS_SELECTED);
					if (!isOpened) {
						$.trigger(cell, sliderDirection === 'toLeft' ? 'slideleft' : 'slideright');
					}
				}
			} else {
				setTranslate(sliderHandle, 0);
				sliderActionLeft && sliderActionLeft.classList.remove(CLASS_SELECTED);
				sliderActionRight && sliderActionRight.classList.remove(CLASS_SELECTED);
				cell.classList.remove(CLASS_SELECTED);
			}
			var buttonOffset;
			if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft !== buttons) {
				for (var i = 0, len = buttonsLeft.length; i < len; i++) {
					var buttonLeft = buttonsLeft[i];
					buttonOffset = buttonLeft._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonLeft._buttonOffset = sliderActionLeftWidth - buttonLeft.offsetLeft - buttonLeft.offsetWidth;
					}
					setTranslate(buttonLeft, buttonOffset);
				}
			}
			if (buttonsRight && buttonsRight.length > 0 && buttonsRight !== buttons) {
				for (var i = 0, len = buttonsRight.length; i < len; i++) {
					var buttonRight = buttonsRight[i];
					buttonOffset = buttonRight._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonRight._buttonOffset = buttonRight.offsetLeft;
					}
					setTranslate(buttonRight, -buttonOffset);
				}
			}
		}
	};

	function toggleEvents(element, isRemove) {
		var method = !!isRemove ? 'removeEventListener' : 'addEventListener';
		element[method]('drag', handleEvent);
		element[method]('dragend', handleEvent);
		element[method]('swiperight', handleEvent);
		element[method]('swipeleft', handleEvent);
		element[method]('flick', handleEvent);
	};
	/**
	 * 打开滑动菜单
	 * @param {Object} el
	 * @param {Object} direction
	 */
	$.swipeoutOpen = function(el, direction) {
		if (!el) return;
		var classList = el.classList;
		if (classList.contains(CLASS_SELECTED)) return;
		if (!direction) {
			if (el.querySelector(SELECTOR_SLIDER_RIGHT)) {
				direction = 'right';
			} else {
				direction = 'left';
			}
		}
		var swipeoutAction = el.querySelector($.classSelector(".slider-" + direction));
		if (!swipeoutAction) return;
		swipeoutAction.classList.add(CLASS_SELECTED);
		classList.add(CLASS_SELECTED);
		classList.remove(CLASS_TRANSITIONING);
		var buttons = swipeoutAction.querySelectorAll(SELECTOR_BUTTON);
		var swipeoutWidth = swipeoutAction.offsetWidth;
		var translate = (direction === 'right') ? -swipeoutWidth : swipeoutWidth;
		var length = buttons.length;
		var button;
		for (var i = 0; i < length; i++) {
			button = buttons[i];
			if (direction === 'right') {
				setTranslate(button, -button.offsetLeft);
			} else {
				setTranslate(button, (swipeoutWidth - button.offsetWidth - button.offsetLeft));
			}
		}
		classList.add(CLASS_TRANSITIONING);
		for (var i = 0; i < length; i++) {
			setTranslate(buttons[i], translate);
		}
		setTranslate(el.querySelector(SELECTOR_SLIDER_HANDLE), translate);
	};
	/**
	 * 关闭滑动菜单
	 * @param {Object} el
	 */
	$.swipeoutClose = function(el) {
		if (!el) return;
		var classList = el.classList;
		if (!classList.contains(CLASS_SELECTED)) return;
		var direction = el.querySelector(SELECTOR_SLIDER_RIGHT + SELECTOR_SELECTED) ? 'right' : 'left';
		var swipeoutAction = el.querySelector($.classSelector(".slider-" + direction));
		if (!swipeoutAction) return;
		swipeoutAction.classList.remove(CLASS_SELECTED);
		classList.remove(CLASS_SELECTED);
		classList.add(CLASS_TRANSITIONING);
		var buttons = swipeoutAction.querySelectorAll(SELECTOR_BUTTON);
		var swipeoutWidth = swipeoutAction.offsetWidth;
		var length = buttons.length;
		var button;
		setTranslate(el.querySelector(SELECTOR_SLIDER_HANDLE), 0);
		for (var i = 0; i < length; i++) {
			button = buttons[i];
			if (direction === 'right') {
				setTranslate(button, (-button.offsetLeft));
			} else {
				setTranslate(button, (swipeoutWidth - button.offsetWidth - button.offsetLeft));
			}
		}
	};

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
	var radioOrCheckboxClick = function(event) {
		var type = event.target && event.target.type || '';
		if (type === 'radio' || type === 'checkbox') {
			return;
		}
		var classList = cell.classList;
		if (classList.contains('mui-radio')) {
			var input = cell.querySelector('input[type=radio]');
			if (input) {
				//				input.click();
				if (!input.disabled && !input.readOnly) {
					input.checked = !input.checked;
					$.trigger(input, 'change');
				}
			}
		} else if (classList.contains('mui-checkbox')) {
			var input = cell.querySelector('input[type=checkbox]');
			if (input) {
				//				input.click();
				if (!input.disabled && !input.readOnly) {
					input.checked = !input.checked;
					$.trigger(input, 'change');
				}
			}
		}
	};
	//fixed hashchange(android)
	window.addEventListener($.EVENT_CLICK, function(e) {
		if (cell && cell.classList.contains('mui-collapse')) {
			e.preventDefault();
		}
	});
	window.addEventListener('doubletap', function(event) {
		if (cell) {
			radioOrCheckboxClick(event);
		}
	});
	var preventDefaultException = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;
	window.addEventListener('tap', function(event) {
		if (!cell) {
			return;
		}
		var isExpand = false;
		var classList = cell.classList;
		var ul = cell.parentNode;
		if (ul && ul.classList.contains(CLASS_RADIO_VIEW)) {
			if (classList.contains(CLASS_SELECTED)) {
				return;
			}
			var selected = ul.querySelector('li' + SELECTOR_SELECTED);
			if (selected) {
				selected.classList.remove(CLASS_SELECTED);
			}
			classList.add(CLASS_SELECTED);
			$.trigger(cell, 'selected', {
				el: cell
			});
			return;
		}
		if (classList.contains('mui-collapse') && !cell.parentNode.classList.contains('mui-unfold')) {
			if (!preventDefaultException.test(event.target.tagName)) {
				event.detail.gesture.preventDefault();
			}

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
		} else {
			radioOrCheckboxClick(event);
		}
	});
})(mui, window, document);
(function($, window) {
	/**
	 * 警告消息框
	 */
	$.alert = function(message, title, btnValue, callback) {
		if ($.os.plus) {
			if (typeof message === undefined) {
				return;
			} else {
				if (typeof title === 'function') {
					callback = title;
					title = null;
					btnValue = '确定';
				} else if (typeof btnValue === 'function') {
					callback = btnValue;
					btnValue = null;
				}
				$.plusReady(function() {
					plus.nativeUI.alert(message, callback, title, btnValue);
				});
			}

		} else {
			//TODO H5版本
			window.alert(message);
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * 确认消息框
	 */
	$.confirm = function(message, title, btnArray, callback) {
		if ($.os.plus) {
			if (typeof message === undefined) {
				return;
			} else {
				if (typeof title === 'function') {
					callback = title;
					title = null;
					btnArray = null;
				} else if (typeof btnArray === 'function') {
					callback = btnArray;
					btnArray = null;
				}
				$.plusReady(function() {
					plus.nativeUI.confirm(message, callback, title, btnArray);
				});
			}

		} else {
			//H5版本，0为确认，1为取消
			if (window.confirm(message)) {
				callback({
					index: 0
				});
			} else {
				callback({
					index: 1
				});
			}
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * 输入对话框
	 */
	$.prompt = function(text, defaultText, title, btnArray, callback) {
		if ($.os.plus) {
			if (typeof message === undefined) {
				return;
			} else {

				if (typeof defaultText === 'function') {
					callback = defaultText;
					defaultText = null;
					title = null;
					btnArray = null;
				} else if (typeof title === 'function') {
					callback = title;
					title = null;
					btnArray = null;
				} else if (typeof btnArray === 'function') {
					callback = btnArray;
					btnArray = null;
				}
				$.plusReady(function() {
					plus.nativeUI.prompt(text, callback, title, defaultText, btnArray);
				});
			}

		} else {
			//H5版本(确认index为0，取消index为1)
			var result = window.prompt(text);
			if (result) {
				callback({
					index: 0,
					value: result
				});
			} else {
				callback({
					index: 1,
					value: ''
				});
			}
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * 自动消失提示框
	 */
	$.toast = function(message) {
		if ($.os.plus) {
			//默认显示在底部；
			$.plusReady(function() {
				plus.nativeUI.toast(message, {
					verticalAlign: 'bottom'
				});
			});
		} else {
			var toast = document.createElement('div');
			toast.classList.add('mui-toast-container');
			toast.innerHTML = '<div class="' + 'mui-toast-message' + '">' + message + '</div>';
			document.body.appendChild(toast);
			setTimeout(function() {
				document.body.removeChild(toast);
			}, 2000);
		}
	};

})(mui, window);
/**
 * Input(TODO resize)
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {
	var CLASS_ICON = 'mui-icon';
	var CLASS_ICON_CLEAR = 'mui-icon-clear';
	var CLASS_ICON_SPEECH = 'mui-icon-speech';
	var CLASS_ICON_SEARCH = 'mui-icon-search';
	var CLASS_INPUT_ROW = 'mui-input-row';
	var CLASS_PLACEHOLDER = 'mui-placeholder';
	var CLASS_TOOLTIP = 'mui-tooltip';
	var CLASS_HIDDEN = 'mui-hidden';
	var CLASS_FOCUSIN = 'mui-focusin';
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
	};
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
				this.clearActionClass = CLASS_ICON + ' ' + CLASS_ICON_CLEAR + ' ' + CLASS_HIDDEN;
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
					self.searchAction.addEventListener('tap', function(e) {
						$.focus(self.element);
						e.stopPropagation();
					});
				}
				if (self.speechActionClass) {
					self.speechAction = self.createAction(row, self.speechActionClass, self.speechActionSelector);
					self.speechAction.addEventListener('click', $.stopPropagation);
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
				action.innerHTML = '<span class="' + CLASS_ICON + ' ' + CLASS_ICON_SEARCH + '"></span><span>' + this.element.getAttribute('placeholder') + '</span>';
				this.element.setAttribute('placeholder', '');
				if (this.element.value.trim()) {
					row.classList.add('mui-active');
				}
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
				var scaleWidth = (width / distince) * Math.abs(element.value - element.min);
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
				$.each(['keyup', 'change', 'input', 'focus', 'cut', 'paste'], function(index, type) {
					(function(type) {
						element.addEventListener(type, function() {
							action.classList[element.value.trim() ? 'remove' : 'add'](CLASS_HIDDEN);
						});
					})(type);
				});
				element.addEventListener('blur', function() {
					action.classList.add(CLASS_HIDDEN);
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
	Input.prototype.setPlaceholder = function(text) {
		if (this.searchActionClass) {
			var placeholder = this.element.parentNode.querySelector(SELECTOR_PLACEHOLDER);
			placeholder && (placeholder.getElementsByTagName('span')[1].innerText = text);
		} else {
			this.element.setAttribute('placeholder', text);
		}
	};
	Input.prototype.clearActionClick = function(event) {
		var self = this;
		self.element.value = '';
		$.focus(self.element);
		self.clearAction.classList.add(CLASS_HIDDEN);
		event.preventDefault();
	};
	Input.prototype.speechActionClick = function(event) {
		if (window.plus) {
			var self = this;
			var oldValue = self.element.value;
			self.element.value = '';
			document.body.classList.add(CLASS_FOCUSIN);
			plus.speech.startRecognize({
				engine: 'iFly'
			}, function(s) {
				self.element.value += s;
				$.focus(self.element);
				plus.speech.stopRecognize();
				$.trigger(self.element, 'recognized', {
					value: self.element.value
				});
				if (oldValue !== self.element.value) {
					$.trigger(self.element, 'change');
					$.trigger(self.element, 'input');
				}
				// document.body.classList.remove(CLASS_FOCUSIN);
			}, function(e) {
				document.body.classList.remove(CLASS_FOCUSIN);
			});
		} else {
			alert('only for 5+');
		}
		event.preventDefault();
	};
	$.fn.input = function(options) {
		var inputApis = [];
		this.each(function() {
			var inputApi = null;
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
				inputApi = $.data[id] = new Input(this, {
					actions: actions.join(',')
				});
				for (var i = 0, len = actions.length; i < len; i++) {
					this.setAttribute('data-input-' + actions[i], id);
				}
			} else {
				inputApi = $.data[id];
			}
			inputApis.push(inputApi);
		});
		return inputApis.length === 1 ? inputApis[0] : inputApis;
	};
	$.ready(function() {
		$('.mui-input-row input').input();
	});
})(mui, window, document);
/**
 * 数字输入框
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($) {

	var touchSupport = ('ontouchstart' in document);
	var tapEventName = touchSupport ? 'tap' : 'click';
	var changeEventName = 'change';
	var holderClassName = 'mui-numbox';
	var plusClassName = 'mui-numbox-btn-plus';
	var minusClassName = 'mui-numbox-btn-minus';
	var inputClassName = 'mui-numbox-input';

	var Numbox = $.Numbox = $.Class.extend({
		/**
		 * 构造函数
		 **/
		init: function(holder, options) {
			var self = this;
			if (!holder) {
				throw "构造 numbox 时缺少容器元素";
			}
			self.holder = holder;
			options = options || {};
			options.step = parseInt(options.step || 1);
			self.options = options;
			self.input = $.qsa('.' + inputClassName, self.holder)[0];
			self.plus = $.qsa('.' + plusClassName, self.holder)[0];
			self.minus = $.qsa('.' + minusClassName, self.holder)[0];
			self.checkValue();
			self.initEvent();
		},
		/**
		 * 初始化事件绑定
		 **/
		initEvent: function() {
			var self = this;
			self.plus.addEventListener(tapEventName, function(event) {
				var val = parseInt(self.input.value) + self.options.step;
				self.input.value = val.toString();
				$.trigger(self.input, changeEventName, null);
			});
			self.minus.addEventListener(tapEventName, function(event) {
				var val = parseInt(self.input.value) - self.options.step;
				self.input.value = val.toString();
				$.trigger(self.input, changeEventName, null);
			});
			self.input.addEventListener(changeEventName, function(event) {
				self.checkValue();
				var val = parseInt(self.input.value);
				//触发顶层容器
				$.trigger(self.holder, changeEventName, {
					value: val
				});
			});
		},
		/**
		 * 获取当前值
		 **/
		getValue: function() {
			var self = this;
			return parseInt(self.input.value);
		},
		/**
		 * 验证当前值是法合法
		 **/
		checkValue: function() {
			var self = this;
			var val = self.input.value;
			if (val == null || val == '' || isNaN(val)) {
				self.input.value = self.options.min || 0;
				self.minus.disabled = self.options.min != null;
			} else {
				var val = parseInt(val);
				if (self.options.max != null && !isNaN(self.options.max) && val >= parseInt(self.options.max)) {
					val = self.options.max;
					self.plus.disabled = true;
				} else {
					self.plus.disabled = false;
				}
				if (self.options.min != null && !isNaN(self.options.min) && val <= parseInt(self.options.min)) {
					val = self.options.min;
					self.minus.disabled = true;
				} else {
					self.minus.disabled = false;
				}
				self.input.value = val;
			}
		},
		/**
		 * 更新选项
		 **/
		setOption: function(name, value) {
			var self = this;
			self.options[name] = value;
		}
	});

	$.fn.numbox = function(options) {
		var instanceArray = [];
		//遍历选择的元素
		this.each(function(i, element) {
			if (element.numbox) return;
			if (options) {
				element.numbox = new Numbox(element, options);
			} else {
				var optionsText = element.getAttribute('data-numbox-options');
				var options = optionsText ? JSON.parse(optionsText) : {};
				options.step = element.getAttribute('data-numbox-step') || options.step;
				options.min = element.getAttribute('data-numbox-min') || options.min;
				options.max = element.getAttribute('data-numbox-max') || options.max;
				element.numbox = new Numbox(element, options);
			}
		});
		return this[0] ? this[0].numbox : null;
	}

	//自动处理 class='mui-locker' 的 dom
	$.ready(function() {
		$('.' + holderClassName).numbox();
	});

}(mui))