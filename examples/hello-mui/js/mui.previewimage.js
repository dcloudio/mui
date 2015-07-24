(function($, window) {

	var template = '<div id="{{id}}" class="mui-slider mui-preview-image mui-fullscreen"><div class="mui-preview-header">{{header}}</div><div class="mui-slider-group"></div><div class="mui-preview-footer mui-hidden">{{footer}}</div><div class="mui-preview-loading"><span class="mui-spinner mui-spinner-white"></span></div></div>';
	var itemTemplate = '<div class="mui-slider-item mui-zoom-wrapper {{className}}"><div class="mui-zoom-scroller"><img src="{{src}}" data-preview-lazyload="{{lazyload}}" style="{{style}}" class="mui-zoom"></div></div>';
	var defaultGroupName = '__DEFAULT';
	var div = document.createElement('div');
	var imgId = 0;
	var PreviewImage = function(options) {
		this.options = $.extend(true, {
			id: '__MUI_PREVIEWIMAGE',
			zoom: true,
			header: '<span class="mui-preview-indicator"></span>',
			footer: ''
		}, options || {});
		this.init();
		this.initEvent();
	};
	var proto = PreviewImage.prototype;
	proto.init = function() {
		var options = this.options;
		var el = document.getElementById(this.options.id);
		if (!el) {
			div.innerHTML = template.replace(/\{\{id\}\}/g, this.options.id).replace('{{header}}', options.header).replace('{{footer}}', options.footer);
			document.body.appendChild(div.firstElementChild);
			el = document.getElementById(this.options.id);
		}
		//自动启用
		$.options.gestureConfig.pinch = true;
		$.options.gestureConfig.doubletap = true;

		this.element = el;
		this.scroller = this.element.querySelector($.classSelector('.slider-group'));
		this.indicator = this.element.querySelector($.classSelector('.preview-indicator'));
		this.loader = this.element.querySelector($.classSelector('.preview-loading'));
		if (options.footer) {
			this.element.querySelector($.classSelector('.preview-footer')).classList.remove($.className('hidden'));
		}
		this.addImages();
	};
	proto.initEvent = function() {
		var self = this;
		$(document.body).on('tap', 'img[data-preview-src]', function() {
			self.open(this);
		});
		var laterClose = null;
		this.loader.addEventListener('tap', function(e) {
			laterClose = $.later(function() {
				self.close();
			}, 300);
		});
		this.scroller.addEventListener('tap', function() {
			laterClose = $.later(function() {
				self.close();
			}, 300);
		});
		this.scroller.addEventListener('doubletap', function() {
			laterClose && laterClose.cancel();
			laterClose = null;
		});
		this.element.addEventListener('slide', function(e) {
			if (self.options.zoom) {
				var lastZoomerEl = self.element.querySelector('.mui-zoom-wrapper:nth-child(' + (self.lastIndex + 1) + ')');
				if (lastZoomerEl) {
					$(lastZoomerEl).zoom().setZoom(1);
				}
			}
			var slideNumber = e.detail.slideNumber;
			self.lastIndex = slideNumber;
			self.indicator && (self.indicator.innerText = (slideNumber + 1) + '/' + self.currentGroup.length);
			self._loadItem(slideNumber);

		});
	};
	proto.addImages = function(group, index) {
		this.groups = {};
		var imgs = [];
		if (group) {
			if (group === defaultGroupName) {
				imgs = document.querySelectorAll("img[data-preview-src]:not([data-preview-group])");
			} else {
				imgs = document.querySelectorAll("img[data-preview-src][data-preview-group='" + group + "']");
			}
		} else {
			imgs = document.querySelectorAll("img[data-preview-src]");
		}
		if (imgs.length) {
			for (var i = 0, len = imgs.length; i < len; i++) {
				this.addImage(imgs[i]);
			}
		}
	};
	proto.addImage = function(img) {
		var group = img.getAttribute('data-preview-group');
		group = group || defaultGroupName;
		if (!this.groups[group]) {
			this.groups[group] = [];
		}
		if (img.__mui_img_data) {
			this.groups[group].push(img.__mui_img_data);
		} else {
			var src = img.getAttribute('src');
			var lazyload = img.getAttribute('data-preview-src');
			if (!lazyload) {
				lazyload = src;
			}
			var imgObj = {
				src: src,
				lazyload: src === lazyload ? '' : lazyload,
				loaded: src === lazyload ? true : false,
				sWidth: 0,
				sHeight: 0,
				sTop: 0,
				sLeft: 0,
				sScale: 1,
				el: img
			};
			this.groups[group].push(imgObj);
			img.__mui_img_data = imgObj;
		}
	};


	proto.empty = function() {
		this.scroller.innerHTML = '';
	};
	proto.openByGroup = function(index, group, anchorEl) {
		index = Math.min(Math.max(0, index), this.groups[group].length - 1);
		this.refresh(index, this.groups[group], anchorEl);
	};
	proto._initImgData = function(itemData, imgEl) {
		if (!itemData.sWidth) {
			var img = itemData.el;
			itemData.sWidth = img.offsetWidth;
			itemData.sHeight = img.offsetHeight;
			var offset = $.offset(img);
			itemData.sTop = offset.top;
			itemData.sLeft = offset.left;
			itemData.sScale = Math.max(itemData.sWidth / window.innerWidth, itemData.sHeight / window.innerHeight);
		}
		imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
	};
	proto.refresh = function(index, groupArray, anchorEl) {
		this.currentGroup = groupArray;
		//		anchorEl && this.position(anchorEl);
		//重新生成slider
		var length = groupArray.length;
		var itemHtml = [];
		var currentRange = this.getRangeByIndex(index, length);
		var from = currentRange.from;
		var to = currentRange.to + 1;
		var currentIndex = index;
		var className = '';
		var itemStr = '';
		var wWidth = window.innerWidth;
		var wHeight = window.innerHeight;
		for (var i = 0; from < to; from++, i++) {
			var itemData = groupArray[from];
			var style = '';
			if (itemData.sWidth) {
				style = '-webkit-transform:translate3d(0,0,0) scale(' + itemData.sScale + ');transform:translate3d(0,0,0) scale(' + itemData.sScale + ')';
			}
			itemStr = itemTemplate.replace('{{src}}', itemData.src).replace('{{lazyload}}', itemData.lazyload).replace('{{style}}', style);
			if (from === index) {
				currentIndex = i;
				className = $.className('active');
			} else {
				className = '';
			}
			itemHtml.push(itemStr.replace('{{className}}', className));
		}
		this.scroller.innerHTML = itemHtml.join('');
		this.element.classList.add($.className('preview-in'));
		this.lastIndex = currentIndex;
		this.element.offsetHeight;
		$(this.element).slider().gotoItem(currentIndex, 0);
		this.indicator && (this.indicator.innerText = (currentIndex + 1) + '/' + this.currentGroup.length);
		this._loadItem(currentIndex);
	};
	proto._getScale = function(from, to) {
		var scaleX = from.width / to.width;
		var scaleY = from.height / to.height;
		var scale = 1;
		if (scaleX <= scaleY) {
			scale = from.height / (to.height * scaleX);
		} else {
			scale = from.width / (to.width * scaleY);
		}
		return scale;
	};
	proto._imgTransitionEnd = function(e) {
		var img = e.target;
		img.classList.remove($.className('transitioning'));
		img.removeEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
	};
	proto._closeTransitionEnd = function(e) {
		var img = e.target;
		img.classList.remove($.className('transitioning'));
		img.removeEventListener('webkitTransitionEnd', this._closeTransitionEnd.bind(this));
		this.element.classList.remove($.className('preview-in'));
		this.element.classList.remove($.className('transitioning'));
	};
	proto._loadItem = function(index, callback) { //TODO 暂时仅支持img
		var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
		var itemData = this.currentGroup[index];
		var imgEl = itemEl.querySelector('img');
		this._initImgData(itemData, imgEl);
		if (!itemData.loaded && imgEl.getAttribute('data-preview-lazyload')) {
			var self = this;
			self.loader.classList.add($.className('active'));
			imgEl && this.loadImage(imgEl, function() {
				itemData.loaded = true;
				imgEl.src = itemData.lazyload;
				self._initZoom(itemEl, this.width, this.height);
				imgEl.classList.add($.className('transitioning'));
				imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
				imgEl.setAttribute('style', '');
				imgEl.offsetHeight;
				callback && callback.call(itemEl);
				self.loader.classList.remove($.className('active'));
			});
		} else {
			itemData.lazyload && (imgEl.src = itemData.lazyload);
			this._initZoom(itemEl, imgEl.width, imgEl.height);
			imgEl.classList.add($.className('transitioning'));
			imgEl.addEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
			imgEl.setAttribute('style', '');
			imgEl.offsetHeight;
			callback && callback.call(itemEl);
		}
		this._preloadItem(index + 1);
		this._preloadItem(index - 1);
	};
	proto._preloadItem = function(index) {
		var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
		if (itemEl) {
			var itemData = this.currentGroup[index];
			if (!itemData.sWidth) {
				var imgEl = itemEl.querySelector('img');
				this._initImgData(itemData, imgEl);
			}
		}
	};
	proto._initZoom = function(zoomWrapperEl, zoomerWidth, zoomerHeight) {
		if (!this.options.zoom) {
			return;
		}
		if (zoomWrapperEl.getAttribute('data-zoomer')) {
			return;
		}
		var zoomEl = zoomWrapperEl.querySelector($.classSelector('.zoom'));
		if (zoomEl.tagName === 'IMG') {
			var self = this;
			var maxZoom = self._getScale({
				width: zoomWrapperEl.offsetWidth,
				height: zoomWrapperEl.offsetHeight
			}, {
				width: zoomerWidth,
				height: zoomerHeight
			});
			$(zoomWrapperEl).zoom({
				maxZoom: Math.max(maxZoom, 1)
			});
		} else {
			$(zoomWrapperEl).zoom();
		}
	};
	proto.loadImage = function(imgEl, callback) {
		var onReady = function() {
			callback && callback.call(this);
		};
		var img = new Image();
		img.onload = onReady;
		img.onerror = onReady;
		img.src = imgEl.getAttribute('data-preview-lazyload');
	};
	proto.getRangeByIndex = function(index, length) {
		return {
			from: 0,
			to: length - 1
		};
		//		var from = Math.max(index - 1, 0);
		//		var to = Math.min(index + 1, length);
		//		if (index === length - 1) {
		//			from = Math.max(length - 3, 0);
		//			to = length - 1;
		//		}
		//		if (index === 0) {
		//			from = 0;
		//			to = Math.min(2, length - 1);
		//		}
		//		return {
		//			from: from,
		//			to: to
		//		};
	};
	proto.open = function(index, group) {
		if (typeof index === "number") {
			group = group || defaultGroupName;
			this.addImages(group, index); //刷新当前group
			this.openByGroup(index, group);
		} else {
			group = index.getAttribute('data-preview-group');
			group = group || defaultGroupName;
			this.addImages(group, index); //刷新当前group
			this.openByGroup(this.groups[group].indexOf(index.__mui_img_data), group, index);
		}
	};
	proto.close = function(index, group) {
		this.element.classList.add($.className('transitioning'));
		var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (this.lastIndex + 1) + ')'));
		var imgEl = itemEl.querySelector('img');
		if (imgEl) {
			imgEl.classList.add($.className('transitioning'));
			var itemData = this.currentGroup[this.lastIndex];
			var sLeft = itemData.sLeft - window.pageXOffset;
			var sTop = itemData.sTop - window.pageYOffset;
			if (sTop > window.innerHeight || sLeft > window.innerWidth || sTop < 0 || sLeft < 0) { //out viewport
				imgEl.addEventListener('webkitTransitionEnd', this._closeTransitionEnd.bind(this));
				imgEl.style.opacity = 0;
				imgEl.style.webkitTransform = 'scale(' + itemData.sScale + ')';
			} else {
				var left = (window.innerWidth - itemData.sWidth) / 2;
				var top = (window.innerHeight - itemData.sHeight) / 2;
				imgEl.addEventListener('webkitTransitionEnd', this._closeTransitionEnd.bind(this));
				imgEl.style.webkitTransform = 'translate3d(' + (sLeft - left) + 'px,' + (sTop - top) + 'px,0) scale(' + itemData.sScale + ')';
			}
		}
		var zoomers = this.element.querySelectorAll($.classSelector('.zoom-wrapper'));
		for (var i = 0, len = zoomers.length; i < len; i++) {
			$(zoomers[i]).zoom().destory();
		}
		//		$(this.element).slider().destory();
		//		this.empty();
	};
	proto.isShown = function() {
		return this.element.classList.contains($.className('preview-in'));
	};

	var previewImageApi = null;
	$.previewImage = function(options) {
		if (!previewImageApi) {
			previewImageApi = new PreviewImage(options);
		}
		return previewImageApi;
	};
	$.getPreviewImage = function() {
		return previewImageApi;
	}

})(mui, window);