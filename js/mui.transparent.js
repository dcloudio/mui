(function($, window) {
	var rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
	var getColor = function(colorStr) {
		var matches = colorStr.match(rgbaRegex);
		if (matches && matches.length === 5) {
			return [
				matches[1],
				matches[2],
				matches[3],
				matches[4]
			];
		}
		return [];
	};
	var Transparent = function(element, options) {
		this.element = element;
		this.options = $.extend({
			top: 0,
			offset: 150,
			duration: 16
		}, options || {});
		this._style = this.element.style;
		this._bgColor = this._style.backgroundColor;
		var color = getColor(mui.getStyles(this.element, 'backgroundColor'));
		if (color.length) {
			this._R = color[0];
			this._G = color[1];
			this._B = color[2];
			this._A = color[3];
			this._bufferFn = $.buffer(this.handleScroll, this.options.duration, this);
			this.initEvent();
		} else {
			throw new Error("元素背景颜色必须为RGBA");
		}
	};

	Transparent.prototype.initEvent = function() {
		window.addEventListener('scroll', this._bufferFn);
		window.addEventListener($.EVENT_MOVE, this._bufferFn);
	};
	Transparent.prototype.handleScroll = function() {
		this._style.backgroundColor = 'rgba(' + this._R + ',' + this._G + ',' + this._B + ',' + (window.scrollY - this.options.top) / this.options.offset + ')';
	};
	Transparent.prototype.destory = function() {
		window.removeEventListener('scroll', this._bufferFn);
		window.removeEventListener($.EVENT_MOVE, this._bufferFn);
		this.element.style.backgroundColor = this._bgColor;
		this.element.mui_plugin_transparent = null;
	};
	$.fn.transparent = function(options) {
		options = options || {};
		var transparentApis = [];
		this.each(function() {
			var transparentApi = this.mui_plugin_transparent;
			if (!transparentApi) {
				var top = this.getAttribute('data-top');
				var offset = this.getAttribute('data-offset');
				var duration = this.getAttribute('data-duration');
				if (top !== null && typeof options.top === 'undefined') {
					options.top = top;
				}
				if (offset !== null && typeof options.offset === 'undefined') {
					options.offset = offset;
				}
				if (duration !== null && typeof options.duration === 'undefined') {
					options.duration = duration;
				}
				transparentApi = this.mui_plugin_transparent = new Transparent(this, options);
			}
			transparentApis.push(transparentApi);
		});
		return transparentApis.length === 1 ? transparentApis[0] : transparentApis;
	};
	$.ready(function() {
		$($.classSelector('.bar-transparent')).transparent();
	});
})(mui, window);