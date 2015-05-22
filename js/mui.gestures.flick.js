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
			flickMaxTime: 200,
			flickMinDistince: 10
		}
	});
})(mui, 'flick');