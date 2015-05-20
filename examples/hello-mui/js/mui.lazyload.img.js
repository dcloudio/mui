(function($, window, document) {
	var ImageLazyload = $.Lazyload.extend({
		init: function(element, options) {
			this._super(element, options);
		},
		_init: function() {
			this.options.selector = 'img[data-lazyload]';
			this._super();
		},
		addElement: function(img) {
			var self = this;
			var src = img.getAttribute('data-lazyload');
			if (src) {
				self.onPlaceHolder = self._createLoader(function(callback) {
					var img = new Image();
					var placeholder = self.options.placeholder;
					img.src = placeholder;
					img.onload = img.onerror = function() {
						callback(placeholder)
					};
				});
				if (img.offsetWidth) {
					self.addCallback(img, self.handle);
				} else {
					self._counter++;
					img.onload = function() {
						self._counter--;
						self.addCallback(img, self.handle);
						this.onload = null;
					};
					if (!img.src) {
						self.onPlaceHolder(function(placeholder) {
							if (!img.src) {
								img.src = placeholder;
							}
						});
					}
				}
				return true;
			}
			return false;
		},
		handle: function(img, key) {
			var dataSrc = img.getAttribute('data-lazyload');
			if (dataSrc && img.src != dataSrc) {
				img.src = dataSrc;
				img.removeAttribute('data-lazyload');
				img.parentNode.parentNode.setAttribute('data-lazyload', 'true');
			}
		}
	});
	$.fn.imageLazyload = function(options) {
		var lazyloadApis = [];
		this.each(function() {
			var self = this;
			var lazyloadApi = null;
			if (self === document || self === window) {
				self = document.body;
			}
			var id = self.getAttribute('data-imageLazyload');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = lazyloadApi = new ImageLazyload(self, options);
				self.setAttribute('data-imageLazyload', id);
			} else {
				lazyloadApi = $.data[id];
			}
			lazyloadApis.push(lazyloadApi);
		});
		return lazyloadApis.length === 1 ? lazyloadApis[0] : lazyloadApis;
	}
})(mui, window, document);