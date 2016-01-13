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
	window.addEventListener($.EVENT_START, function(event) {
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
	window.addEventListener('click', function(event) { //解决touch与click的target不一致的问题(比如链接边缘点击时，touch的target为html，而click的target为A)
		var target = event.target;
		var isFound = false;
		for (; target && target !== document; target = target.parentNode) {
			if (target.tagName === 'A') {
				$.each($.targetHandles, function(index, targetHandle) {
					var name = targetHandle.name;
					if (targetHandle.hasOwnProperty('handle')) {
						if (targetHandle.handle(event, target)) {
							isFound = true;
							event.preventDefault();
							return false;
						}
					}
				});
				if (isFound) {
					break;
				}
			}
		}
	});
})(mui, window, document);