/**
 * snap 重构
 * @param {Object} $
 * @param {Object} window
 */
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
				startX: false,
				snap: SELECTOR_SLIDER_ITEM
			}, options));
			if (this.options.startX) {
				//				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		_init: function() {
			var groups = this.wrapper.querySelectorAll('.' + CLASS_SLIDER_GROUP);
			for (var i = 0, len = groups.length; i < len; i++) {
				if (groups[i].parentNode === this.wrapper) {
					this.scroller = groups[i];
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
				var page = self.currentPage;
				var oldSlideNumber = self.slideNumber;
				self.slideNumber = self._fixedSlideNumber();
				if (self.loop) {
					if (self.slideNumber === 0) {
						self.setTranslate(self.pages[1][0].x, 0);
					} else if (self.slideNumber === self.itemLength - 3) {
						self.setTranslate(self.pages[self.itemLength - 2][0].x, 0);
					}
				}
				if (oldSlideNumber != self.slideNumber) {
					$.trigger(self.wrapper, 'slide', {
						slideNumber: self.slideNumber
					});
				}
			});

			self.wrapper.addEventListener('slide', function(e) {
				if (e.target !== self.wrapper) {
					return;
				}
				var detail = e.detail;
				detail.slideNumber = detail.slideNumber || 0;
				var items = self.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
				var _slideNumber = detail.slideNumber;
				if (self.loop) {
					_slideNumber += 1;
				}
				if (!self.wrapper.classList.contains($.className('segmented-control'))) {
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
				}
				var indicatorWrap = self.wrapper.querySelector($.classSelector('.slider-indicator'));
				if (indicatorWrap) {
					if (indicatorWrap.getAttribute('data-scroll')) { //scroll
						$(indicatorWrap).scroll().gotoPage(detail.slideNumber);
					}
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

		_fixedSlideNumber: function(page) {
			page = page || this.currentPage;
			var slideNumber = page.pageX;
			if (this.loop) {
				if (page.pageX === 0) {
					slideNumber = this.itemLength - 3;
				} else if (page.pageX === (this.itemLength - 1)) {
					slideNumber = 0;
				} else {
					slideNumber = page.pageX - 1;
				}
			}
			return slideNumber;
		},
		_reLayout: function() {
			this.hasHorizontalScroll = true;
			this.loop = this.scroller.classList.contains(CLASS_SLIDER_LOOP);
			this._super();
		},
		_getScroll: function() {
			var result = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
			return result ? result.x : 0;
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
			if (!this.moved) { //无moved
				return;
			}
			var detail = e.detail;
			var direction = detail.direction;
			this._clearRequestAnimationFrame();
			this.isInTransition = true;
			//			if (direction === 'up' || direction === 'down') {
			//				this.resetPosition(this.options.bounceTime);
			//				return;
			//			}
			if (e.type === 'flick') {
				if (detail.touchTime < 200) { //flick，太容易触发，额外校验一下touchtime
					this.x = this._getPage((this.slideNumber + (direction === 'right' ? -1 : 1)), true).x;
				}
				this.resetPosition(this.options.bounceTime);
			} else if (e.type === 'dragend' && !detail.flick) {
				this.resetPosition(this.options.bounceTime);
			}
			e.stopPropagation();
		},
		_initSnap: function() {
			this.scrollerWidth = this.itemLength * this.scrollerWidth;
			this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
			this._super();
			if (!this.currentPage.x) {
				//当slider处于隐藏状态时，导致snap计算是错误的，临时先这么判断一下，后续要考虑解决所有scroll在隐藏状态下初始化属性不正确的问题
				var currentPage = this.pages[this.loop ? 1 : 0];
				currentPage = currentPage || this.pages[0];
				if (!currentPage) {
					return;
				}
				this.currentPage = currentPage[0];
				this.slideNumber = 0;
			} else {
				this.slideNumber = this._fixedSlideNumber();
			}
			this.options.startX = this.currentPage.x || 0;
		},
		_getSnapX: function(offsetLeft) {
			return Math.max(-offsetLeft, this.maxScrollX);
		},
		_getPage: function(slideNumber, isFlick) {
			if (this.loop) {
				if (slideNumber > (this.itemLength - (isFlick ? 2 : 3))) {
					slideNumber = 1;
					time = 0;
				} else if (slideNumber < (isFlick ? -1 : 0)) {
					slideNumber = this.itemLength - 2;
					time = 0;
				} else {
					slideNumber += 1;
				}
			} else {
				if (!isFlick) {
					if (slideNumber > (this.itemLength - 1)) {
						slideNumber = 0;
						time = 0;
					} else if (slideNumber < 0) {
						slideNumber = this.itemLength - 1;
						time = 0;
					}
				}
				slideNumber = Math.min(Math.max(0, slideNumber), this.itemLength - 1);
			}
			return this.pages[slideNumber][0];
		},
		_gotoItem: function(slideNumber, time) {
			this.currentPage = this._getPage(slideNumber, true); //此处传true。可保证程序切换时，动画与人手操作一致(第一张，最后一张的切换动画)
			this.scrollTo(this.currentPage.x, 0, time, this.options.bounceEasing);
			if (time === 0) {
				$.trigger(this.wrapper, 'scrollend', this);
			}
			this._initTimer();
		},
		//API
		setTranslate: function(x, y) {
			this._super(x, y);
			var progressBar = this.progressBar;
			if (progressBar) {
				this.progressBarStyle.webkitTransform = this._getTranslateStr((-x * (this.progressBarWidth / this.wrapperWidth)), 0);
			}
		},
		resetPosition: function(time) {
			time = time || 0;
			if (this.x > 0) {
				this.x = 0;
			} else if (this.x < this.maxScrollX) {
				this.x = this.maxScrollX;
			}
			this.currentPage = this._nearestSnap(this.x);
			this.scrollTo(this.currentPage.x, 0, time);
			return true;
		},
		gotoItem: function(slideNumber, time) {
			this._gotoItem(slideNumber, time || this.options.bounceTime);
		},
		nextItem: function() {
			this._gotoItem(this.slideNumber + 1, this.options.bounceTime);
		},
		prevItem: function() {
			this._gotoItem(this.slideNumber - 1, this.options.bounceTime);
		},
		getSlideNumber: function() {
			return this.slideNumber || 0;
		},
		refresh: function(options) {
			if (options) {
				$.extend(this.options, options);
				this._super();
				this.nextItem();
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
			if (sliderElement && sliderElement.querySelector(SELECTOR_SLIDER_ITEM)) {
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
		$($.classSelector('.scroll-wrapper.slider-indicator.segmented-control')).scroll({
			scrollY: false,
			scrollX: true,
			indicators: false,
			snap: $.classSelector('.control-item')
		});
		//		}, 500); //临时处理slider宽度计算不正确的问题(初步确认是scrollbar导致的)

	});
})(mui, window);