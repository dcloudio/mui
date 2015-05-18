(function($, window) {
	var CLASS_SLIDER = $.className('slider');
	var CLASS_SLIDER_GROUP = $.className('slider-group');
	var CLASS_SLIDER_LOOP = $.className('slider-loop');
	var CLASS_SLIDER_INDICATOR = $.className('slider-indicator');
	var CLASS_ACTION_PREVIOUS = $.className('action-previous');
	var CLASS_ACTION_NEXT = $.className('action-next');
	var CLASS_SLIDER_ITEM = $.className('slider-item');

	var CLASS_ACTIVE = $.className('active');

	var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
	var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
	var SELECTOR_SLIDER_PROGRESS_BAR = $.classSelector('.slider-progress-bar');


	var Slider = $.Scroll.extend({
		init: function(element, options) {
			this._super(element, $.extend(true, {
				interval: 0, //设置为0，则不定时轮播
				scrollY: false,
				scrollX: true,
				indicators: false,
				bounceTime: 200,
				startX: false
			}, options));
			if (this.options.startX) {
				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		_init: function() {
			var scrollers = this.wrapper.querySelectorAll('.' + CLASS_SLIDER_GROUP);
			for (var i = 0, len = scrollers.length; i < len; i++) {
				if (scrollers[i].parentNode === this.wrapper) {
					this.scroller = scrollers[i];
					break;
				}
			}
			if (this.scroller) {
				this.scrollerStyle = this.scroller.style;
				this.progressBar = this.wrapper.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
				if (this.progressBar) {
					this.progressBarWidth = this.progressBar.offsetWidth;
					this.progressBarStyle = this.progressBar.style;
				}
				//忘记这个代码是干什么的了？
				//				this.x = this._getScroll();
				//				if (this.options.startX === false) {
				//					this.options.startX = this.x;
				//				}
				//根据active修正startX

				this._super();
				this._initTimer();
			}
		},
		_initEvent: function() {
			var self = this;
			self._super();
			self.wrapper.addEventListener('swiperight', $.stopPropagation);
			self.wrapper.addEventListener('scrollend', function() {
				self.isInTransition = false;
				var oldSlideNumber = self.slideNumber;
				self.slideNumber = self._getSlideNumber();
				var slideNumber = self.slideNumber;
				if (self.loop) {
					if (self.slideNumber === 0) {
						self.slideNumber = self.itemLength - 2;
						self.setTranslate(-self.wrapperWidth * (self.itemLength - 2), 0);
					} else if (self.slideNumber === (self.itemLength - 1)) {
						self.slideNumber = 1;
						self.setTranslate(-self.wrapperWidth, 0);
					}
					slideNumber = self.slideNumber - 1;
				}
				self.slideNumber = slideNumber;
				if (oldSlideNumber !== self.slideNumber) {
					$.trigger(self.wrapper, 'slide', {
						slideNumber: slideNumber
					});
				}

			});
			self.wrapper.addEventListener('slide', function(e) {
				if (e.target !== self.wrapper) {
					return;
				}
				var detail = e.detail;
				detail.slideNumber = detail.slideNumber || 0;
				var items = self.wrapper.querySelectorAll(SELECTOR_SLIDER_ITEM);
				var _slideNumber = detail.slideNumber;
				if (self.loop) {
					_slideNumber += 1;
				}
				for (var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					if (item.parentNode === self.scroller) {
						if (i === _slideNumber) {
							item.classList.add(CLASS_ACTIVE);
						} else {
							item.classList.remove(CLASS_ACTIVE);
						}
					}
				}
				if (self.wrapper.classList.contains($.className('segmented-control'))) { //segmented and slider
					var controlItem = self.scroller.querySelector('.' + CLASS_ACTIVE + '.' + CLASS_SLIDER_ITEM + ' .' + $.className('control-item'));
					if (controlItem) {
						$.trigger(controlItem, 'touchstart'); //targets实现机制太麻烦，后续必须重构
						$.trigger(controlItem, 'tap');
					}
				}
				var indicatorWrap = self.wrapper.querySelector($.classSelector('.slider-indicator'));
				if (indicatorWrap) {
					//					if (indicatorWrap.classList.contains(CLASS_SLIDER)) { //indicator is a slider
					//						var indicatorSliderItems = indicatorWrap.querySelectorAll(CLASS_SLIDER_ITEM);
					//						Math.ceil(self.itemLength / indicatorSliderItems.length);
					//					}
					var indicators = indicatorWrap.querySelectorAll($.classSelector('.indicator'));
					if (indicators.length > 0) { //图片轮播
						for (var i = 0, len = indicators.length; i < len; i++) {
							indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
						}
					} else {
						var number = indicatorWrap.querySelector($.classSelector('.number span'));
						if (number) { //图文表格
							number.innerText = (detail.slideNumber + 1);
						} else { //segmented controls
							var controlItems = self.wrapper.querySelectorAll($.classSelector('.control-item'));
							for (var i = 0, len = controlItems.length; i < len; i++) {
								controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
							}
						}
					}
				}
				e.stopPropagation();
			});

			self.wrapper.addEventListener($.eventName('shown', 'tab'), function(e) { //tab
				console.log('e.detail.tabNumber:::' + e.detail.tabNumber);
				self.gotoItem((e.detail.tabNumber || 0), self.options.bounceTime);
			});
			//indicator
			var indicator = self.wrapper.querySelector(SELECTOR_SLIDER_INDICATOR);
			if (indicator) {
				indicator.addEventListener('tap', function(event) {
					var target = event.target;
					if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
						self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
						event.stopPropagation();
					}
				});
			}
		},
		_drag: function(e) {
			this._super(e);
			var direction = e.detail.direction;
			if (direction === 'left' || direction === 'right') {
				e.stopPropagation();
			}
		},
		_initTimer: function() {
			var self = this;
			var slider = self.wrapper;
			var interval = self.options.interval;
			var slidershowTimer = slider.getAttribute('data-slidershowTimer');
			slidershowTimer && window.clearTimeout(slidershowTimer);
			if (interval) {
				slidershowTimer = window.setTimeout(function() {
					if (!slider) {
						return;
					}
					//仅slider显示状态进行自动轮播
					if (!!(slider.offsetWidth || slider.offsetHeight)) {
						self.nextItem(true);
						//下一个
					}
					self._initTimer();
				}, interval);
				slider.setAttribute('data-slidershowTimer', slidershowTimer);
			}
		},
		_reLayout: function() {
			this.hasHorizontalScroll = true;
			this.loop = this.scroller.classList.contains(CLASS_SLIDER_LOOP);
			//以防slider类嵌套使用
			var items = this.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
			this.itemLength = 0;
			var current = 0;
			for (var i = 0, len = items.length; i < len; i++) {
				if (items[i].parentNode === this.scroller) {
					if (items[i].classList.contains(CLASS_ACTIVE)) {
						current = this.itemLength;
					}
					this.itemLength++;
				}
			}
			current = current === 0 ? (this.loop ? 1 : 0) : current;
			//根据active修正startX
			this.options.startX = current ? -this.scrollerWidth * current : 0;
			this.scrollerWidth = this.itemLength * this.scrollerWidth;
			this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
			this.slideNumber = this._getSlideNumber();
			this._super();
		},
		_getScroll: function() {
			var result = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
			return result ? result.x : 0;
		},
		_getSlideNumber: function() {
			return Math.abs(Math.round(Math.abs(this.x) / this.wrapperWidth));
		},
		_transitionEnd: function(e) {
			if (e.target !== this.scroller || !this.isInTransition) {
				return;
			}
			this._transitionTime();
			this.isInTransition = false;
			$.trigger(this.wrapper, 'scrollend', this);
		},
		_flick: function(e) {
			var detail = e.detail;
			var direction = detail.direction;
			this._clearRequestAnimationFrame();
			this.isInTransition = true;
			if (direction === 'up' || direction === 'down') {
				this.resetPosition(this.options.bounceTime);
				return;
			}
			if (e.type === 'flick') {
				if (detail.touchTime < 200) { //flick，太容易触发，额外校验一下touchtime
					this.x = -(this.slideNumber + (direction === 'left' ? 1 : -1)) * this.wrapperWidth;
				}
				this.resetPosition(this.options.bounceTime);
			} else if (e.type === 'dragend' && !detail.flick) {
				this.resetPosition(this.options.bounceTime);
			}
			e.stopPropagation();
		},
		_gotoItem: function(slideNumber, time) {
			this.scrollTo(-slideNumber * this.wrapperWidth, 0, time, this.options.bounceEasing);
			if (time === 0) {
				$.trigger(this.wrapper, 'scrollend', this);
			}
			this._initTimer();
		},
		_fixedSlideNumber: function(slideNumber) {
			if (!this.loop) {
				if (slideNumber < 0) {
					slideNumber = 0;
				} else if (slideNumber >= this.itemLength) {
					slideNumber = this.itemLength - 1;
				}
			}
			return slideNumber;
		},
		//API
		setTranslate: function(x, y) {
			this._super(x, y);
			var progressBar = this.progressBar;
			if (progressBar) {
				this.progressBarStyle.webkitTransform = 'translate3d(' + (-x * (this.progressBarWidth / this.wrapperWidth)) + 'px,0,0)';
			}
		},
		resetPosition: function(time) {
			time = time || 0;
			if (this.x > 0) {
				this.x = 0;
			} else if (this.x < this.maxScrollX) {
				this.x = this.maxScrollX;
			}
			this._gotoItem(this._getSlideNumber(), time);
			return true;
		},
		gotoItem: function(slideNumber, time) {
			this._gotoItem(this._fixedSlideNumber(this.loop ? (slideNumber + 1) : slideNumber), time || this.options.bounceEasing);
		},
		nextItem: function(auto) {
			var slideNumber = this._fixedSlideNumber(this.slideNumber + 1);
			var bounceTime = this.options.bounceTime;
			if (auto && !this.loop) {
				if (this.slideNumber + 1 >= this.itemLength) {
					bounceTime = slideNumber = 0;
				}
			}
			this._gotoItem(slideNumber, bounceTime);
			//			if (!auto) { //TODO 这个设置后续还得仔细过一遍
			//				this.isInTransition = false;
			//			}
		},
		prevItem: function() {
			this._gotoItem(this._fixedSlideNumber(this.slideNumber - 1), this.options.bounceTime);
		},
		refresh: function(options) {
			if (options) {
				$.extend(this.options, options);
				this._super();
				this._gotoItem(this._getSlideNumber() + 1, this.options.bounceTime);
			} else {
				this._super();
			}
		}
	});
	$.fn.slider = function(options) {
		var slider = null;
		this.each(function() {
			var sliderElement = this;
			if (!this.classList.contains(CLASS_SLIDER)) {
				sliderElement = this.querySelector('.' + CLASS_SLIDER);
			}
			if (sliderElement) {
				var id = sliderElement.getAttribute('data-slider');
				if (!id) {
					id = ++$.uuid;
					$.data[id] = slider = new Slider(sliderElement, options);
					sliderElement.setAttribute('data-slider', id);
				} else {
					slider = $.data[id];
					if (slider && options) {
						slider.refresh(options);
					}
				}
			}
		});
		return slider;
	};
	$.ready(function() {
		//		setTimeout(function() {
		$($.classSelector('.slider')).slider();
		//		}, 500); //临时处理slider宽度计算不正确的问题(初步确认是scrollbar导致的)

	});
})(mui, window);