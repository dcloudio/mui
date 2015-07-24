(function($) {
	$.enterfocus = function(selector, callback) {
		var boxArray = [].slice.call(document.querySelectorAll(selector));
		for (var index in boxArray) {
			var box = boxArray[index];
			box.addEventListener('keyup', function(event) {
				if (event.keyCode == 13) {
					var boxIndex = boxArray.indexOf(this);
					if (boxIndex == boxArray.length - 1) {
						if (callback) callback();
					} else {
						//console.log(boxIndex);
						var nextBox = boxArray[++boxIndex];
						nextBox.focus();
					}
				}
			}, false);
		}
	};
}(window.mui = window.mui || {}));