/**
 * mui gesture hold
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
					touch.hold = true;
					$.trigger(event.target, name, touch);
				}, options.holdTimeout);
				break;
			case $.EVENT_MOVE:
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				clearTimeout(timer);
				if ($.options.gestureConfig.hold && touch.hold) {
					$.trigger(event.target, 'release', touch);
				}
				break;
		}
	};
	/**
	 * mui gesture hold
	 */
	$.registerGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			holdTimeout: 0
		}
	});
})(mui, 'hold');