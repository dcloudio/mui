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
	 * register gesture
	 * @param {type} gesture
	 * @returns {$.gestures}
	 */
	$.registerGesture = function(gesture) {
		return $.registerHandler('gestures', gesture);

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
					gesture.handle(event, touch);
				}
			}
		});
	};
	var detectTouchStart = function(event) {
		$.gestures.stoped = false;
		var now = $.now();
		var point = event.touches ? event.touches[0] : event;
		$.gestures.touch = {
			target: event.target,
			lastTarget: ($.gestures.touch && $.gestures.touch.lastTarget ? $.gestures.touch.lastTarget : null),
			startTime: now,
			touchTime: 0,
			flickStartTime: now,
			lastTapTime: ($.gestures.touch && $.gestures.touch.lastTapTime ? $.gestures.touch.lastTapTime : 0),
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
			lockDirection: false,
			startDirection: '',
			distance: 0,
			drag: false,
			swipe: false,
			hold: false,
			gesture: event
		};

		detect(event, $.gestures.touch);
	};
	var detectTouchMove = function(event) {
		if ($.gestures.stoped) {
			return;
		}
		var touch = $.gestures.touch;
		if (event.target != touch.target) {
			return;
		}
		var now = $.now();
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
		var touch = $.gestures.touch;
		if (event.target != touch.target) {
			return;
		}
		var now = $.now();
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