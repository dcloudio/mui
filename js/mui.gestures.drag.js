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
				if (touch.direction) { //drag
					//修正direction
					//默认锁定单向drag(后续可能需要额外配置支持)
					if (touch.lockDirection && touch.startDirection) {
						if (touch.startDirection && touch.startDirection !== touch.direction) {
							if (touch.startDirection === 'up' || touch.startDirection === 'down') {
								touch.direction = touch.deltaY < 0 ? 'up' : 'down';
							} else {
								touch.direction = touch.deltaX < 0 ? 'left' : 'right';
							}
						}
					}
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
		options: {}
	});
})(mui, 'drag');