/**
 * actions
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var CLASS_ACTION = $.className('action');

	var handle = function(event, target) {
		if (target.className && ~target.className.indexOf(CLASS_ACTION)) {
			event.preventDefault();
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