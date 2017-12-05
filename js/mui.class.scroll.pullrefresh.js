(function($, window, document, undefined) {

    var CLASS_VISIBILITY = $.className('visibility');
    var CLASS_HIDDEN = $.className('hidden');

    var PullRefresh = $.Scroll.extend($.extend({
        handleEvent: function(e) {
            this._super(e);
            if (e.type === 'scrollbottom') {
                if (e.target === this.scroller) {
                    this._scrollbottom();
                }
            }
        },
        _scrollbottom: function() {
            if (!this.pulldown && !this.loading) {
                this.pulldown = false;
                this._initPullupRefresh();
                this.pullupLoading();
            }
        },
        _start: function(e) {
            //仅下拉刷新在start阻止默认事件
            if (e.touches && e.touches.length && e.touches[0].clientX > 30) {
                e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
            }
            if (!this.loading) {
                this.pulldown = this.pullPocket = this.pullCaption = this.pullLoading = false
            }
            this._super(e);
        },
        _drag: function(e) {
            if (this.y >= 0 && this.disablePulldown && e.detail.direction === 'down') { //禁用下拉刷新
                return;
            }
            this._super(e);
            if (!this.pulldown && !this.loading && this.topPocket && e.detail.direction === 'down' && this.y >= 0) {
                this._initPulldownRefresh();
            }
            if (this.pulldown) {
                this._setCaption(this.y > this.options.down.height ? this.options.down.contentover : this.options.down.contentdown);
            }
        },

        _reLayout: function() {
            this.hasVerticalScroll = true;
            this._super();
        },
        //API
        resetPosition: function(time) {
            if (this.pulldown && !this.disablePulldown) {
                if (this.y >= this.options.down.height) {
                    this.pulldownLoading(undefined, time || 0);
                    return true;
                } else {
                    !this.loading && this.topPocket.classList.remove(CLASS_VISIBILITY);
                }
            }
            return this._super(time);
        },
        pulldownLoading: function(y, time) {
            typeof y === 'undefined' && (y = this.options.down.height); //默认高度
            this.scrollTo(0, y, time, this.options.bounceEasing);
            if (this.loading) {
                return;
            }
            //			if (!this.pulldown) {
            this._initPulldownRefresh();
            //			}
            this._setCaption(this.options.down.contentrefresh);
            this.loading = true;
            this.indicators.map(function(indicator) {
                indicator.fade(0);
            });
            var callback = this.options.down.callback;
            callback && callback.call(this);
        },
        endPulldownToRefresh: function() {
            var self = this;
            if (self.topPocket && self.loading && this.pulldown) {
                self.scrollTo(0, 0, self.options.bounceTime, self.options.bounceEasing);
                self.loading = false;
                self._setCaption(self.options.down.contentdown, true);
                setTimeout(function() {
                    self.loading || self.topPocket.classList.remove(CLASS_VISIBILITY);
                }, 350);
            }
        },
        pullupLoading: function(callback, x, time) {
            x = x || 0;
            this.scrollTo(x, this.maxScrollY, time, this.options.bounceEasing);
            if (this.loading) {
                return;
            }
            this._initPullupRefresh();
            this._setCaption(this.options.up.contentrefresh);
            this.indicators.map(function(indicator) {
                indicator.fade(0);
            });
            this.loading = true;
            callback = callback || this.options.up.callback;
            callback && callback.call(this);
        },
        endPullupToRefresh: function(finished) {
            var self = this;
            if (self.bottomPocket) { // && self.loading && !this.pulldown
                self.loading = false;
                if (finished) {
                    this.finished = true;
                    self._setCaption(self.options.up.contentnomore);
                    //					self.bottomPocket.classList.remove(CLASS_VISIBILITY);
                    //					self.bottomPocket.classList.add(CLASS_HIDDEN);
                    self.wrapper.removeEventListener('scrollbottom', self);
                } else {
                    self._setCaption(self.options.up.contentdown);
                    //					setTimeout(function() {
                    self.loading || self.bottomPocket.classList.remove(CLASS_VISIBILITY);
                    //					}, 300);
                }
            }
        },
        disablePullupToRefresh: function() {
            this._initPullupRefresh();
            this.bottomPocket.className = $.className('pull-bottom-pocket') + ' ' + CLASS_HIDDEN;
            this.wrapper.removeEventListener('scrollbottom', this);
        },
        disablePulldownToRefresh: function() {
            this._initPulldownRefresh();
            this.topPocket.className = $.className('pull-top-pocket') + ' ' + CLASS_HIDDEN;
            this.disablePulldown = true;
        },
        enablePulldownToRefresh: function() {
            this._initPulldownRefresh();
            this.topPocket.classList.remove(CLASS_HIDDEN);
            this._setCaption(this.options.down.contentdown);
            this.disablePulldown = false;
        },
        enablePullupToRefresh: function() {
            this._initPullupRefresh();
            this.bottomPocket.classList.remove(CLASS_HIDDEN);
            this._setCaption(this.options.up.contentdown);
            this.wrapper.addEventListener('scrollbottom', this);
        },
        refresh: function(isReset) {
            if (isReset && this.finished) {
                this.enablePullupToRefresh();
                this.finished = false;
            }
            this._super();
        },
    }, $.PullRefresh));
    $.fn.pullRefresh = function(options) {
        if (this.length === 1) {
            var self = this[0];
            var pullRefreshApi = null;
            var id = self.getAttribute('data-pullrefresh');
            if (!id && typeof options === 'undefined') {
                return false;
            }
            options = options || {};
            if (!id) {
                id = ++$.uuid;
                $.data[id] = pullRefreshApi = new PullRefresh(self, options);
                self.setAttribute('data-pullrefresh', id);
            } else {
                pullRefreshApi = $.data[id];
            }
            if (options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
                pullRefreshApi.pulldownLoading(options.down.autoY);
            } else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
                pullRefreshApi.pullupLoading();
            }
            //暂不提供这种调用方式吧			
            //			if (typeof options === 'string') {
            //				var methodValue = pullRefreshApi[options].apply(pullRefreshApi, $.slice.call(arguments, 1));
            //				if (methodValue !== undefined) {
            //					return methodValue;
            //				}
            //			}
            return pullRefreshApi;
        }
    };
})(mui, window, document);