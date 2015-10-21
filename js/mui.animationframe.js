/**
 * mui animationFrame
 */
(function($, window) {

	var rAF = window.requestAnimationFrame;
	var cAF = window.cancelAnimationFrame;

	var queues = {};

	var animationFrame = {
		queue : queue,
		queueAfter : queueAfter,
		cancel : cancel
	};

	function animation_id() {
		var id;
		do {
			id = Math.floor(Math.random() * 1E9);
		} while (id in queues);
		return id;
	}

	function recursion(callback) {
		var qid = animation_id();
		(function wrapper() {
			callback();
			queues[qid] = rAF(function() {
				delete queues[qid];
				wrapper();
			});
		})();
		return qid;
	}

	function queue(callback) {
		var qid = animation_id();

		queues[qid] = rAF(function() {
			delete queues[qid];
			callback.apply(animationFrame, arguments);
		});

		return qid;
	}

	function queueAfter(callback) {
		var qid;

		qid = queue(function() {
			queues[qid] = rAF(function() {
				delete queues[qid];
				callback.apply(animationFrame, arguments);
			});
		});

		return qid;
	}

	function cancel(qid) {
		if ( qid in queues) {
			cAF(queues[qid]);
			delete queues[qid];
		}
		return animationFrame;
	}


	$.animationFrame = animationFrame;

})(mui, window);
