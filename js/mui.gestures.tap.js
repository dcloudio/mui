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
						touch.lastTapTime = $.now();
						touch.lastTarget = event.target;
						return;
					}
				}
				$.trigger(event.target, name, touch);
				touch.lastTapTime = $.now();
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