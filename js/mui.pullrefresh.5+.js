/**
 * pullRefresh 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {
    if (!($.os.plus)) { //仅在5+android支持多webview的使用
        return;
    }
    $.plusReady(function() {
        if (window.__NWin_Enable__ === false) { //不支持多webview，则不用5+下拉刷新
            return;
        }
        var CLASS_PLUS_PULLREFRESH = $.className('plus-pullrefresh');
        var CLASS_VISIBILITY = $.className('visibility');
        var CLASS_HIDDEN = $.className('hidden');
        var CLASS_BLOCK = $.className('block');

        var CLASS_PULL_CAPTION = $.className('pull-caption');
        var CLASS_PULL_CAPTION_DOWN = $.className('pull-caption-down');
        var CLASS_PULL_CAPTION_REFRESH = $.className('pull-caption-refresh');
        var CLASS_PULL_CAPTION_NOMORE = $.className('pull-caption-nomore');

        var PlusPullRefresh = $.Class.extend({
            init: function(element, options) {
                this.element = element;
                this.options = options;
                this.wrapper = this.scroller = element;
                this._init();
                this._initPulldownRefreshEvent();
            },
            _init: function() {
                var self = this;
                //document.addEventListener('plusscrollbottom', this);
                window.addEventListener('dragup', self);
                document.addEventListener("plusscrollbottom", self);
                self.scrollInterval = window.setInterval(function() {
                    if (self.isScroll && !self.loading) {
                        if (window.pageYOffset + window.innerHeight + 10 >= document.documentElement.scrollHeight) {
                            self.isScroll = false; //放在这里是因为快速滚动的话，有可能检测时，还没到底，所以只要有滚动，没到底之前一直检测高度变化
                            if (self.bottomPocket) {
                                self.pullupLoading();
                            }
                        }
                    }
                }, 100);
            },
            _initPulldownRefreshEvent: function() {
                var self = this;
                $.plusReady(function() {
                    if (self.options.down.style == "circle") {
                        //单webview、原生转圈
                        self.options.webview = plus.webview.currentWebview();
                        self.options.webview.setPullToRefresh({
                            support: true,
                            color: self.options.down.color || '#2BD009',
                            height: self.options.down.height || '50px',
                            range: self.options.down.range || '100px',
                            style: 'circle',
                            offset: self.options.down.offset || '0px'
                        }, function() {
                            self.options.down.callback();
                        });
                    } else if (self.topPocket && self.options.webviewId) {
                        var webview = plus.webview.getWebviewById(self.options.webviewId); //子窗口
                        if (!webview) {
                            return;
                        }
                        self.options.webview = webview;
                        var downOptions = self.options.down;
                        var height = downOptions.height;
                        webview.addEventListener('close', function() {
                            var attrWebviewId = self.options.webviewId && self.options.webviewId.replace(/\//g, "_"); //替换所有"/" 
                            self.element.removeAttribute('data-pullrefresh-plus-' + attrWebviewId);
                        });
                        webview.addEventListener("dragBounce", function(e) {
                            if (!self.pulldown) {
                                self._initPulldownRefresh();
                            } else {
                                self.pullPocket.classList.add(CLASS_BLOCK);
                            }
                            switch (e.status) {
                                case "beforeChangeOffset": //下拉可刷新状态
                                    self._setCaption(downOptions.contentdown);
                                    break;
                                case "afterChangeOffset": //松开可刷新状态
                                    self._setCaption(downOptions.contentover);
                                    break;
                                case "dragEndAfterChangeOffset": //正在刷新状态
                                    //执行下拉刷新所在webview的回调函数
                                    webview.evalJS("window.mui&&mui.options.pullRefresh.down.callback()");
                                    self._setCaption(downOptions.contentrefresh);
                                    break;
                                default:
                                    break;
                            }
                        }, false);

                        webview.setBounce({
                            position: {
                                top: height * 2 + 'px'
                            },
                            changeoffset: {
                                top: height + 'px'
                            }
                        });

                    }
                });
            },
            handleEvent: function(e) {
                var self = this;
                if (self.stopped) {
                    return;
                }
                self.isScroll = false;
                if (e.type === 'dragup' || e.type === 'plusscrollbottom') {
                    self.isScroll = true;
                    setTimeout(function() {
                        self.isScroll = false;
                    }, 1000);
                }
            }
        }).extend($.extend({
            setStopped: function(stopped) { //该方法是子页面调用的
                this.stopped = !!stopped;
                // TODO 此处需要设置当前webview的bounce为none,目前5+有BUG
                if (this.stopped) {
                    this.disablePullupToRefresh();
                    this.disablePulldownToRefresh();
                } else {
                    this.enablePullupToRefresh();
                    this.enablePulldownToRefresh();
                }
            },
            beginPulldown: function() {
                var self = this;
                $.plusReady(function() {
                    //这里延时的目的是为了保证下拉刷新组件初始化完成，后续应该做成有状态的
                    setTimeout(function() {
                        if (self.options.down.style == "circle") { //单webview下拉刷新
                            plus.webview.currentWebview().beginPullToRefresh();
                        } else { //双webview模式
                            var webview = self.options.webview;
                            if (webview) {
                                webview.setBounce({
                                    offset: {
                                        top: self.options.down.height + "px"
                                    }
                                });
                            }
                        }
                    }, 15);
                }.bind(this));
            },
            pulldownLoading: function() { //该方法是子页面调用的，兼容老的历史API
                this.beginPulldown();
            },
            _pulldownLoading: function() { //该方法是父页面调用的
                var self = this;
                $.plusReady(function() {
                    var childWebview = plus.webview.getWebviewById(self.options.webviewId);
                    childWebview && childWebview.setBounce({
                        offset: {
                            top: self.options.down.height + "px"
                        }
                    });
                });
            },
            endPulldown: function() {
                var _wv = plus.webview.currentWebview();
                //双webview的下拉刷新，需要修改父窗口提示信息
                if (_wv.parent() && this.options.down.style !== "circle") {
                    _wv.parent().evalJS("mui&&mui(document.querySelector('.mui-content')).pullRefresh('" + JSON.stringify({
                        webviewId: _wv.id
                    }) + "')._endPulldownToRefresh()");
                } else {
                    _wv.endPullToRefresh();
                }
            },
            endPulldownToRefresh: function() { //该方法是子页面调用的，兼容老的历史API
                this.endPulldown();
            },
            _endPulldownToRefresh: function() { //该方法是父页面调用的
                var self = this;
                if (self.topPocket && self.options.webview) {
                    self.options.webview.endPullToRefresh(); //下拉刷新所在webview回弹
                    self.loading = false;
                    self._setCaption(self.options.down.contentdown, true);
                    setTimeout(function() {
                        self.loading || self.topPocket.classList.remove(CLASS_BLOCK);
                    }, 350);
                }
            },
            beginPullup: function(callback) { //开始上拉加载
                var self = this;
                if (self.isLoading) return;
                self.isLoading = true;
                if (self.pulldown !== false) {
                    self._initPullupRefresh();
                } else {
                    this.pullPocket.classList.add(CLASS_BLOCK);
                }
                setTimeout(function() {
                    self.pullLoading.classList.add(CLASS_VISIBILITY);
                    self.pullLoading.classList.remove(CLASS_HIDDEN);
                    self.pullCaption.innerHTML = ''; //修正5+里边第一次加载时，文字显示的bug(还会显示出来个“多”,猜测应该是渲染问题导致的)
                    self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH;
                    self.pullCaption.innerHTML = self.options.up.contentrefresh;
                    callback = callback || self.options.up.callback;
                    callback && callback.call(self);
                }, 300);
            },
            pullupLoading: function(callback) { //兼容老的API
                this.beginPullup(callback);
            },
            endPullup: function(finished) { //上拉加载结束
                var self = this;
                if (self.pullLoading) {
                    self.pullLoading.classList.remove(CLASS_VISIBILITY);
                    self.pullLoading.classList.add(CLASS_HIDDEN);
                    self.isLoading = false;
                    if (finished) {
                        self.finished = true;
                        self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
                        self.pullCaption.innerHTML = self.options.up.contentnomore;
                        //取消5+的plusscrollbottom事件
                        document.removeEventListener('plusscrollbottom', self);
                        window.removeEventListener('dragup', self);
                    } else { //初始化时隐藏，后续不再隐藏
                        self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
                        self.pullCaption.innerHTML = self.options.up.contentdown;
                    }
                }
            },
            endPullupToRefresh: function(finished) { //上拉加载结束，兼容老的API
                this.endPullup(finished);
            },
            disablePulldownToRefresh: function() {
                var webview = plus.webview.currentWebview();
                if (this.options.down.style && this.options.down.style == 'circle') { // 单webview模式禁止原生下拉刷新
                    this.options.webview.setPullToRefresh({
                        support: false,
                        style: 'circle'
                    });
                } else { // 双webview模式禁止下拉刷新
                    webview.setStyle({
                        bounce: 'none'
                    });
                    webview.setBounce({
                        position: {
                            top: 'none'
                        }
                    });
                }
            },
            enablePulldownToRefresh: function() {
                var self = this,
                    webview = plus.webview.currentWebview(),
                    height = this.options.down.height;
                // 单webview模式禁止原生下拉刷新
                if (this.options.down.style && this.options.down.style == 'circle') {
                    webview.setPullToRefresh({
                        support: true,
                        height: height || '50px',
                        range: self.options.down.range || '100px',
                        style: 'circle',
                        offset: self.options.down.offset || '0px'
                    });
                } else { // 重新初始化双webview模式下拉刷新
                    webview.setStyle({
                        bounce: 'vertical'
                    });
                    webview.setBounce({
                        position: {
                            top: height * 2 + 'px'
                        },
                        changeoffset: {
                            top: height + 'px'
                        }
                    });
                }
            },
            disablePullupToRefresh: function() {
                this._initPullupRefresh();
                this.bottomPocket.className = $.className('pull-bottom-pocket') + ' ' + CLASS_HIDDEN;
                window.removeEventListener('dragup', this);
            },
            enablePullupToRefresh: function() {
                this._initPullupRefresh();
                this.bottomPocket.classList.remove(CLASS_HIDDEN);
                this.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
                this.pullCaption.innerHTML = this.options.up.contentdown;
                document.addEventListener("plusscrollbottom", this);
                window.addEventListener('dragup', this);
            },
            scrollTo: function(x, y, time) {
                $.scrollTo(y, time);
            },
            scrollToBottom: function(time) {
                $.scrollTo(document.documentElement.scrollHeight, time);
            },
            refresh: function(isReset) {
                if (isReset && this.finished) {
                    this.enablePullupToRefresh();
                    this.finished = false;
                }
            }
        }, $.PullRefresh));

        //override h5 pullRefresh
        $.fn.pullRefresh_native = function(options) {
            var self;
            if (this.length === 0) {
                self = document.createElement('div');
                self.className = 'mui-content';
                document.body.appendChild(self);
            } else {
                self = this[0];
            }
            var args = options;
            //一个父需要支持多个子下拉刷新
            options = options || {}
            if (typeof options === 'string') {
                options = $.parseJSON(options);
            };
            !options.webviewId && (options.webviewId = (plus.webview.currentWebview().id || plus.webview.currentWebview().getURL()));
            var pullRefreshApi = null;
            var attrWebviewId = options.webviewId && options.webviewId.replace(/\//g, "_"); //替换所有"/"
            var id = self.getAttribute('data-pullrefresh-plus-' + attrWebviewId);
            if (!id && typeof args === 'undefined') {
                return false;
            }
            if (!id) { //避免重复初始化5+ pullrefresh
                id = ++$.uuid;
                self.setAttribute('data-pullrefresh-plus-' + attrWebviewId, id);
                document.body.classList.add(CLASS_PLUS_PULLREFRESH);
                $.data[id] = pullRefreshApi = new PlusPullRefresh(self, options);
            } else {
                pullRefreshApi = $.data[id];
            }
            if (options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
                //pullRefreshApi._pulldownLoading(); //parent webview
                pullRefreshApi.beginPulldown();
            } else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
                pullRefreshApi.beginPullup();
            }
            return pullRefreshApi;
        };
    });

})(mui, document);