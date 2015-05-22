/**
 * Slider (TODO resize)
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	var CLASS_SLIDER = $.className('slider');
	var CLASS_SLIDER_GROUP = $.className('slider-group');
	var CLASS_SLIDER_LOOP = $.className('slider-loop');
	var CLASS_SLIDER_INDICATOR = $.className('slider-indicator');
	var CLASS_ACTION_PREVIOUS = $.className('action-previous');
	var CLASS_ACTION_NEXT = $.className('action-next');
	var CLASS_SLIDER_ITEM = $.className('slider-item');

	var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
	var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
	var SELECTOR_SLIDER_PROGRESS_BAR = $.classSelector('.slider-progress-bar');


	var Slider = function(element, options) {
		this.element = element;
		this.options = $.extend({
			slideshowDelay: 0, //设置为0，则不定时轮播
			factor: 1
		}, options);

		this.init();
	};
	Slider.prototype.init = function() {
		//		this.initDuplicate();
		this.initEvent();
		this.initTimer();
	};
	Slider.prototype.refresh = function(options) {
		var newOptions = $.extend({
			slideshowDelay: 0, //设置为0，则不定时轮播
			factor: 1
		}, options);
		if (this.options.slideshowDelay !== newOptions.slideshowDelay) {
			this.options.slideshowDelay = newOptions.slideshowDelay;
			if (this.options.slideshowDelay) {
				this.nextItem();
			}
		}
	};
	//TODO 暂时不做自动clone
	//	Slider.prototype.initDuplicate = function() {
	//		var self = this;
	//		var element = self.element;
	//		if (element.classList.contains(CLASS_SLIDER_LOOP)) {
	//			var duplicates = element.getElementsByClassName(CLASS_SLIDER_ITEM_DUPLICATE);
	//		}
	//	};
	Slider.prototype.initEvent = function() {
		var self = this;
		var element = self.element;
		var slider = element.parentNode;
		self.translateX = 0;
		self.sliderWidth = element.offsetWidth;
		self.isLoop = element.classList.contains(CLASS_SLIDER_LOOP);
		self.sliderLength = element.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
		self.progressBarWidth = 0;
		self.progressBar = slider.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
		if (self.progressBar) {
			self.progressBarWidth = self.progressBar.offsetWidth;
		}
		//slider
		var isDragable = false;
		self.isSwipeable = false;
		slider.addEventListener('dragstart', function(event) {
			var detail = event.detail;
			var direction = detail.direction;
			if (direction === 'left' || direction === 'right') { //reset
				isDragable = true;
				self.translateX = self.lastTranslateX = 0;
				self.scrollX = self.getScroll();
				self.sliderWidth = element.offsetWidth;
				self.isLoop = element.classList.contains(CLASS_SLIDER_LOOP);
				self.sliderLength = element.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
				if (self.progressBar) {
					self.progressBarWidth = self.progressBar.offsetWidth;
				}
				self.maxTranslateX = ((self.sliderLength - 1) * self.sliderWidth);
				event.detail.gesture.preventDefault();
				var isStopPropagation = true;
				if (!self.isLoop) {
					if (direction === 'right' && self.scrollX === 0) {
						isStopPropagation = false;
					} else if (direction === 'left' && self.scrollX === -self.maxTranslateX) {
						isStopPropagation = false;
					}
				}
				isStopPropagation && event.stopPropagation();
			}
		});
		slider.addEventListener('drag', function(event) {
			if (isDragable) {
				self.dragItem(event);
				event.stopPropagation();
			}

		});
		slider.addEventListener('dragend', function(event) {
			if (isDragable) {
				self.gotoItem(self.getSlideNumber());
				isDragable = self.isSwipeable = false;
				event.stopPropagation();
			}
		});
		//		slider.addEventListener('flick', $.stopPropagation);
		slider.addEventListener('swipeleft', function(event) {
			if (self.isSwipeable) {
				//stop dragend
				$.gestures.stoped = true;
				self.nextItem();
				isDragable = self.isSwipeable = false;
			}
			event.stopPropagation();
		});
		slider.addEventListener('swiperight', function(event) {
			if (self.isSwipeable) {
				//stop dragend
				$.gestures.stoped = true;
				self.prevItem();
				isDragable = self.isSwipeable = false;
			}
			event.stopPropagation();
		});
		slider.addEventListener('slide', function(e) {
			var detail = e.detail;
			detail.slideNumber = detail.slideNumber || 0;
			var number = slider.querySelector($.classSelector('.slider-indicator .number span'));
			if (number) {
				number.innerText = (detail.slideNumber + 1);
			}

			var indicators = slider.querySelectorAll($.classSelector('.slider-indicator .indicator'));
			for (var i = 0, len = indicators.length; i < len; i++) {
				indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove']($.className('active'));
			}

			var controlItems = slider.querySelectorAll($.classSelector('.control-item'));
			for (var i = 0, len = controlItems.length; i < len; i++) {
				controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove']($.className('active'));
			}
			e.stopPropagation();
		});
		slider.addEventListener($.eventName('shown', 'tab'), function(e) { //tab
			self.gotoItem(-(e.detail.tabNumber || 0));
		});
		//indicator
		var indicator = element.parentNode.querySelector(SELECTOR_SLIDER_INDICATOR);
		if (indicator) {
			indicator.addEventListener('tap', function(event) {
				var target = event.target;
				if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
					self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
					event.stopPropagation();
				}
			});
		}
	};
	Slider.prototype.dragItem = function(event) {
		var self = this;
		var detail = event.detail;

		if (detail.deltaX !== detail.lastDeltaX) {
			var translate = (detail.deltaX * self.options.factor + self.scrollX);
			self.element.style['-webkit-transition-duration'] = '0';
			var min = 0;
			var max = -self.maxTranslateX;
			if (self.isLoop) {
				min = self.sliderWidth;
				max = max + min;
			}
			if (translate > min || translate < max) {
				self.isSwipeable = false;
				return;
			}
			if (!self.requestAnimationFrame) {
				self.updateTranslate();
			}
			self.isSwipeable = true;
			self.translateX = translate;
		}
		if (self.timer) {
			clearTimeout(self.timer);
		}
		self.timer = setTimeout(function() {
			self.initTimer();
		}, 100);

	};
	Slider.prototype.updateTranslate = function() {
		var self = this;
		if (self.lastTranslateX !== self.translateX) {
			self.setTranslate(self.translateX);
			self.lastTranslateX = self.translateX;
		}
		self.requestAnimationFrame = requestAnimationFrame(function() {
			self.updateTranslate();
		});
	};
	Slider.prototype.setTranslate = function(x) {
		this.element.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
		this.updateProcess(x);
	};
	Slider.prototype.updateProcess = function(translate) {
		var progressBarWidth = this.progressBarWidth;
		if (progressBarWidth) {
			translate = Math.abs(translate);
			this.setProcess(translate * (progressBarWidth / this.sliderWidth));
		}
	};
	Slider.prototype.setProcess = function(translate) {
		var progressBar = this.progressBar;
		if (progressBar) {
			progressBar.style.webkitTransform = 'translate3d(' + translate + 'px,0,0)';
		}
	};
	/**
	 * 下一个轮播
	 * @returns {Number}
	 */
	Slider.prototype.nextItem = function() {
		this.gotoItem(this.getCurrentSlideNumber('next') - 1);
	};
	/**
	 * 上一个轮播
	 * @returns {Number}
	 */
	Slider.prototype.prevItem = function() {
		this.gotoItem(this.getCurrentSlideNumber('prev') + 1);
	};
	/**
	 * 滑动到指定轮播
	 * @param {type} slideNumber
	 * @returns {undefined}
	 */
	Slider.prototype.gotoItem = function(slideNumber) {
		if (!(slideNumber === 1 && this.getSlideNumber() === slideNumber)) {
			slideNumber = slideNumber > 0 ? -slideNumber : slideNumber;
		}
		var self = this;
		var slider = self.element;
		var slideLength = self.sliderLength;
		if (self.isLoop) { //循环轮播需减去2个过渡元素
			slideLength = slideLength - 2;
		} else {
			slideLength = slideLength - 1;
			slideNumber = Math.min(0, slideNumber);
			slideNumber = Math.max(slideNumber, -slideLength);
		}
		if (self.requestAnimationFrame) {
			cancelAnimationFrame(self.requestAnimationFrame);
			self.requestAnimationFrame = null;
		}
		var offsetX = Math.max(slideNumber, -slideLength) * slider.offsetWidth;
		slider.style['-webkit-transition-duration'] = '.2s';
		self.setTranslate(offsetX);
		//		slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
		//		self.updateProcess(offsetX);
		var fixedLoop = function() {
			slider.style['-webkit-transition-duration'] = '0';
			slider.style.webkitTransform = 'translate3d(' + (slideNumber * slider.offsetWidth) + 'px,0,0)';
			slider.removeEventListener('webkitTransitionEnd', fixedLoop);
		};
		slider.removeEventListener('webkitTransitionEnd', fixedLoop);
		if (self.isLoop) { //循环轮播自动重新定位
			if (slideNumber === 1 || slideNumber === -slideLength) {
				slideNumber = slideNumber === 1 ? (-slideLength + 1) : 0;
				slider.addEventListener('webkitTransitionEnd', fixedLoop);
			}
		}
		$.trigger(slider.parentNode, 'slide', {
			slideNumber: Math.abs(slideNumber)
		});
		this.initTimer();
	};

	/**
	 * 计算轮播应该处于的位置(四舍五入)
	 * @returns {Number}
	 */
	Slider.prototype.getSlideNumber = function() {
		return (Math.round(this.getScroll() / this.sliderWidth));
	};
	/**
	 * 当前所处位置
	 * @param {type} type
	 * @returns {unresolved}
	 */
	Slider.prototype.getCurrentSlideNumber = function(type) {
		return (Math[type === 'next' ? 'ceil' : 'floor'](this.getScroll() / this.sliderWidth));
	};
	/**
	 * 获取当前滚动位置
	 * @returns {Number}
	 */
	Slider.prototype.getScroll = function() {
		var slider = this.element;
		var scroll = 0;
		if ('webkitTransform' in slider.style) {
			var result = $.parseTranslate(slider.style.webkitTransform);
			scroll = result ? result.x : 0;
		}
		return scroll;
	};
	/**
	 * 自动轮播
	 * @returns {undefined}
	 */
	Slider.prototype.initTimer = function() {
		var self = this;
		var slideshowDelay = self.options.slideshowDelay;
		if (slideshowDelay) {
			var slider = self.element;
			var slidershowTimer = slider.getAttribute('data-slidershowTimer');
			slidershowTimer && window.clearTimeout(slidershowTimer);
			slidershowTimer = window.setTimeout(function() {
				if (!slider) {
					return;
				}
				//仅slider显示状态进行自动轮播
				if (!!(slider.offsetWidth || slider.offsetHeight)) {
					self.nextItem();
					//下一个
				}
				self.initTimer();
			}, slideshowDelay);
			slider.setAttribute('data-slidershowTimer', slidershowTimer);
		}

	};

	$.fn.slider = function(options) {
		//新增定时轮播 重要：remove该轮播时，请获取data-slidershowTimer然后手动clearTimeout
		var slider = null;
		this.each(function() {
			var sliderGroup = this;
			if (this.classList.contains(CLASS_SLIDER)) {
				sliderGroup = this.querySelector('.' + CLASS_SLIDER_GROUP);
			}
			var id = sliderGroup.getAttribute('data-slider');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = slider = new Slider(sliderGroup, options);
				sliderGroup.setAttribute('data-slider', id);
			} else {
				slider = $.data[id];
				if (slider && options) {
					slider.refresh(options);
				}
			}
		});
		return slider;
	};
	$.ready(function() {
		$($.classSelector('.slider-group')).slider();
	});
})(mui, window);