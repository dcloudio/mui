(function($, window, document) {
	var STATE_BEFORECHANGEOFFSET = 'beforeChangeOffset';
	var STATE_AFTERCHANGEOFFSET = 'afterChangeOffset';

	var EVENT_PULLSTART = 'pullstart';
	var EVENT_PULLING = 'pulling';
	var EVENT_BEFORECHANGEOFFSET = STATE_BEFORECHANGEOFFSET;
	var EVENT_AFTERCHANGEOFFSET = STATE_AFTERCHANGEOFFSET;
	var EVENT_DRAGENDAFTERCHANGEOFFSET = 'dragEndAfterChangeOffset';

	var CLASS_TRANSITIONING = $.className('transitioning');
	var CLASS_PULL_TOP_TIPS = $.className('pull-top-tips');
	var CLASS_PULL_BOTTOM_TIPS = $.className('pull-bottom-tips');
	var CLASS_PULL_LOADING = $.className('pull-loading');
	var CLASS_SCROLL = $.className('scroll');

	var CLASS_PULL_TOP_ARROW = $.className('pull-loading') + ' ' + $.className('icon') + ' ' + $.className('icon-pulldown');
	var CLASS_PULL_TOP_ARROW_REVERSE = CLASS_PULL_TOP_ARROW + ' ' + $.className('reverse');
	var CLASS_PULL_TOP_SPINNER = $.className('pull-loading') + ' ' + $.className('spinner');
	var CLASS_HIDDEN = $.className('hidden');

	var SELECTOR_PULL_LOADING = '.' + CLASS_PULL_LOADING;
	$.PullToRefresh = $.Class.extend({
		init: function(element, options) {
			this.element = element;
			this.options = $.extend(true, {
				down: {
					height: 75,
					callback: false,
				},
				up: {
					auto: false,
					offset: 100, //距离底部高度(到达该高度即触发)
					show: true,
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了',
					callback: false
				}
			}, options);
			this.stopped = this.isNeedRefresh = this.isDragging = false;
			this.state = STATE_BEFORECHANGEOFFSET;
			this.isInScroll = this.element.classList.contains(CLASS_SCROLL);
			this.initPullUpTips();

			this.initEvent();
		},
		initEvent: function() {
			if ($.isFunction(this.options.down.callback)) {
				this.element.addEventListener('drag', this);
				this.element.addEventListener('dragend', this);
			}
			if (this.pullUpTips) {
				this.element.addEventListener('dragup', this);
				window.addEventListener('scroll', this);
				if (this.isInScroll) {
					this.element.addEventListener('scrollbottom', this);
				}
			}
		},
		handleEvent: function(e) {
			switch (e.type) {
				case 'drag':
					this._drag(e);
					break;
				case 'dragend':
					this._dragend(e);
					break;
				case 'webkitTransitionEnd':
					this._transitionEnd(e);
					break;
				case 'dragup':
				case 'scroll':
					this._dragup(e);
					break;
				case 'scrollbottom':
					this.pullUpLoading(e);
					break;
			}
		},
		initPullDownTips: function() {
			var self = this;
			if ($.isFunction(self.options.down.callback)) {
				self.pullDownTips = (function() {
					var element = document.querySelector('.' + CLASS_PULL_TOP_TIPS);
					if (element) {
						element.parentNode.removeChild(element);
					}
					if (!element) {
						element = document.createElement('div');
						element.classList.add(CLASS_PULL_TOP_TIPS);
						element.innerHTML = '<div class="mui-pull-top-wrapper"><span class="mui-pull-loading mui-icon mui-icon-pulldown"></span></div>';
						element.addEventListener('webkitTransitionEnd', self);
					}
					self.pullDownTipsIcon = element.querySelector(SELECTOR_PULL_LOADING);
					document.body.appendChild(element);
					return element;
				}());
			}
		},
		initPullUpTips: function() {
			var self = this;
			if ($.isFunction(self.options.up.callback)) {
				self.pullUpTips = (function() {
					var element = self.element.querySelector('.' + CLASS_PULL_BOTTOM_TIPS);
					if (!element) {
						element = document.createElement('div');
						element.classList.add(CLASS_PULL_BOTTOM_TIPS);
						if (!self.options.up.show) {
							element.classList.add(CLASS_HIDDEN);
						}
						element.innerHTML = '<div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading">' + self.options.up.contentdown + '</span></div>';
						self.element.appendChild(element);
					}
					self.pullUpTipsIcon = element.querySelector(SELECTOR_PULL_LOADING);
					return element;
				}());
			}
		},
		_transitionEnd: function(e) {
			if (e.target === this.pullDownTips && this.removing) {
				this.removePullDownTips();
			}
		},
		_dragup: function(e) {
			var self = this;
			if (self.loading) {
				return;
			}
			if (e && e.detail && e.detail.drag) {
				self.isDraggingUp = true;
			} else {
				if (!self.isDraggingUp) { //scroll event
					return;
				}
			}
			if (!self.isDragging) {
				if (self._canPullUp()) {
					self.pullUpLoading(e);
				}
			}
		},
		_canPullUp: function() {
			if (this.removing) {
				return false;
			}
			if (this.isInScroll) {
				var scrollId = this.element.parentNode.getAttribute('data-scroll');
				if (scrollId) {
					var scrollApi = $.data[scrollId];
					return scrollApi.y === scrollApi.maxScrollY;
				}
			}
			return window.pageYOffset + window.innerHeight + this.options.up.offset >= document.documentElement.scrollHeight;
		},
		_canPullDown: function() {
			if (this.removing) {
				return false;
			}
			if (this.isInScroll) {
				var scrollId = this.element.parentNode.getAttribute('data-scroll');
				if (scrollId) {
					var scrollApi = $.data[scrollId];
					return scrollApi.y === 0;
				}
			}
			return document.body.scrollTop === 0;
		},
		_drag: function(e) {
			if (this.loading || this.stopped) {
				e.stopPropagation();
				e.detail.gesture.preventDefault();
				return;
			}
			var detail = e.detail;
			if (!this.isDragging) {
				if (detail.direction === 'down' && this._canPullDown()) {
					this.isDragging = true;
					this.removing = false;
					this.startDeltaY = detail.deltaY;
					$.gestures.session.lockDirection = true; //锁定方向
					$.gestures.session.startDirection = detail.direction;
					this._pullStart(this.startDeltaY);
				}
			}
			if (this.isDragging) {
				e.stopPropagation();
				e.detail.gesture.preventDefault();
				var deltaY = detail.deltaY - this.startDeltaY;
				deltaY = Math.min(deltaY, 1.5 * this.options.down.height);
				this.deltaY = deltaY;
				this._pulling(deltaY);
				var state = deltaY > this.options.down.height ? STATE_AFTERCHANGEOFFSET : STATE_BEFORECHANGEOFFSET;
				if (this.state !== state) {
					this.state = state;
					if (this.state === STATE_AFTERCHANGEOFFSET) {
						this.removing = false;
						this.isNeedRefresh = true;
					} else {
						this.removing = true;
						this.isNeedRefresh = false;
					}
					this['_' + state](deltaY);
				}
				if ($.os.ios && parseFloat($.os.version) >= 8) {
					var clientY = detail.gesture.touches[0].clientY;
					if ((clientY + 10) > window.innerHeight || clientY < 10) {
						this._dragend(e);
						return;
					}
				}
			}
		},
		_dragend: function(e) {
			var self = this;
			if (self.isDragging) {
				self.isDragging = false;
				self._dragEndAfterChangeOffset(self.isNeedRefresh);
			}
			if (self.isPullingUp) {
				if (self.pullingUpTimeout) {
					clearTimeout(self.pullingUpTimeout);
				}
				self.pullingUpTimeout = setTimeout(function() {
					self.isPullingUp = false;
				}, 1000);
			}
		},
		_pullStart: function(startDeltaY) {
			this.pullStart(startDeltaY);
			$.trigger(this.element, EVENT_PULLSTART, {
				api: this,
				startDeltaY: startDeltaY
			});
		},
		_pulling: function(deltaY) {
			this.pulling(deltaY);
			$.trigger(this.element, EVENT_PULLING, {
				api: this,
				deltaY: deltaY
			});
		},
		_beforeChangeOffset: function(deltaY) {
			this.beforeChangeOffset(deltaY);
			$.trigger(this.element, EVENT_BEFORECHANGEOFFSET, {
				api: this,
				deltaY: deltaY
			});
		},
		_afterChangeOffset: function(deltaY) {
			this.afterChangeOffset(deltaY);
			$.trigger(this.element, EVENT_AFTERCHANGEOFFSET, {
				api: this,
				deltaY: deltaY
			});
		},
		_dragEndAfterChangeOffset: function(isNeedRefresh) {
			this.dragEndAfterChangeOffset(isNeedRefresh);
			$.trigger(this.element, EVENT_DRAGENDAFTERCHANGEOFFSET, {
				api: this,
				isNeedRefresh: isNeedRefresh
			});
		},
		removePullDownTips: function() {
			if (this.pullDownTips) {
				try {
					this.pullDownTips.parentNode && this.pullDownTips.parentNode.removeChild(this.pullDownTips);
					this.pullDownTips = null;
					this.removing = false;
				} catch (e) {}
			}
		},
		pullStart: function(startDeltaY) {
			this.initPullDownTips(startDeltaY);
		},
		pulling: function(deltaY) {
			this.pullDownTips.style.webkitTransform = 'translate3d(0,' + deltaY + 'px,0)';
		},
		beforeChangeOffset: function(deltaY) {
			this.pullDownTipsIcon.className = CLASS_PULL_TOP_ARROW;
		},
		afterChangeOffset: function(deltaY) {
			this.pullDownTipsIcon.className = CLASS_PULL_TOP_ARROW_REVERSE;
		},
		dragEndAfterChangeOffset: function(isNeedRefresh) {
			if (isNeedRefresh) {
				this.pullDownTipsIcon.className = CLASS_PULL_TOP_SPINNER;
				this.pullDownLoading();
			} else {
				this.pullDownTipsIcon.className = CLASS_PULL_TOP_ARROW;
				this.endPullDownToRefresh();
			}
		},
		pullDownLoading: function() {
			if (this.loading) {
				return;
			}
			if (!this.pullDownTips) {
				this.initPullDownTips();
				this.dragEndAfterChangeOffset(true);
				return;
			}
			this.loading = true;
			this.pullDownTips.classList.add(CLASS_TRANSITIONING);
			this.pullDownTips.style.webkitTransform = 'translate3d(0,' + this.options.down.height + 'px,0)';
			this.options.down.callback.apply(this);
		},
		pullUpLoading: function(e) {
			if (this.loading || this.finished) {
				return;
			}
			this.loading = true;
			this.isDraggingUp = false;
			this.pullUpTips.classList.remove(CLASS_HIDDEN);
			e && e.detail && e.detail.gesture && e.detail.gesture.preventDefault();
			this.pullUpTipsIcon.innerHTML = this.options.up.contentrefresh;
			this.options.up.callback.apply(this);
		},
		endPullDownToRefresh: function() {
			this.loading = false;
			this.pullUpTips && this.pullUpTips.classList.remove(CLASS_HIDDEN);
			this.pullDownTips.classList.add(CLASS_TRANSITIONING);
			this.pullDownTips.style.webkitTransform = 'translate3d(0,0,0)';
			if (this.deltaY <= 0) {
				this.removePullDownTips();
			} else {
				this.removing = true;
			}
		},
		endPullUpToRefresh: function(finished) {
			if (finished) {
				this.finished = true;
				this.pullUpTipsIcon.innerHTML = this.options.up.contentnomore;
				this.element.removeEventListener('dragup', this);
				window.removeEventListener('scroll', this);
			} else {
				this.pullUpTipsIcon.innerHTML = this.options.up.contentdown;
			}
			this.loading = false;
		},
		setStopped: function(stopped) {
			if (stopped != this.stopped) {
				this.stopped = stopped;
				this.pullUpTips && this.pullUpTips.classList[stopped ? 'add' : 'remove'](CLASS_HIDDEN);
			}
		},
		refresh: function(isReset) {
			if (isReset && this.finished && this.pullUpTipsIcon) {
				this.pullUpTipsIcon.innerHTML = this.options.up.contentdown;
				this.element.addEventListener('dragup', this);
				window.addEventListener('scroll', this);
				this.finished = false;
			}
		}
	});
	$.fn.pullToRefresh = function(options) {
		var pullRefreshApis = [];
		options = options || {};
		this.each(function() {
			var self = this;
			var pullRefreshApi = null;
			var id = self.getAttribute('data-pullToRefresh');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = pullRefreshApi = new $.PullToRefresh(self, options);
				self.setAttribute('data-pullToRefresh', id);
			} else {
				pullRefreshApi = $.data[id];
			}
			if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
				pullRefreshApi.pullUpLoading();
			}
			pullRefreshApis.push(pullRefreshApi);
		});
		return pullRefreshApis.length === 1 ? pullRefreshApis[0] : pullRefreshApis;
	}
})(mui, window, document);