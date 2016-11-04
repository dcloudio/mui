/**
 * pullRefresh 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {
    if (!($.os.plus && $.os.android)) { //仅在5+android支持多webview的使用
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
                if (self.topPocket && self.options.webviewId) {
                    $.plusReady(function() {
                        var webview = plus.webview.getWebviewById(self.options.webviewId);
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
                                    webview.evalJS("mui&&mui.options.pullRefresh.down.callback()");
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
                    });
                }
            },
            handleEvent: function(e) {
                var self = this;
                if (self.stopped) {
                    return;
                }
                //5+的plusscrollbottom当页面内容较少时，不触发
                //          if (e.type === 'plusscrollbottom') {
                //              if (this.bottomPocket) {
                //                  this.pullupLoading();
                //              }
                //          }
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
                //TODO 此处需要设置当前webview的bounce为none,目前5+有BUG
                var webview = plus.webview.currentWebview();
                if (this.stopped) {
                    webview.setStyle({
                        bounce: 'none'
                    });
                    webview.setBounce({
                        position: {
                            top: 'none'
                        }
                    });
                } else {
                    var height = this.options.down.height;
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
            pulldownLoading: function() { //该方法是子页面调用的
                $.plusReady(function() {
                    plus.webview.currentWebview().setBounce({
                        offset: {
                            top: this.options.down.height + "px"
                        }
                    });
                }.bind(this));
            },
            _pulldownLoading: function() { //该方法是父页面调用的
                var self = this;
                $.plusReady(function() {
                    var childWebview = plus.webview.getWebviewById(self.options.webviewId);
                    childWebview.setBounce({
                        offset: {
                            top: self.options.down.height + "px"
                        }
                    });
                });
            },
            endPulldownToRefresh: function() { //该方法是子页面调用的
                var webview = plus.webview.currentWebview();
                webview.parent().evalJS("mui&&mui(document.querySelector('.mui-content')).pullRefresh('" + JSON.stringify({
                    webviewId: webview.id
                }) + "')._endPulldownToRefresh()");
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
            pullupLoading: function(callback) {
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
            endPullupToRefresh: function(finished) {
                var self = this;
                if (self.pullLoading) {
                    self.pullLoading.classList.remove(CLASS_VISIBILITY);
                    self.pullLoading.classList.add(CLASS_HIDDEN);
                    self.isLoading = false;
                    if (finished) {
                        self.finished = true;
                        self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
                        self.pullCaption.innerHTML = self.options.up.contentnomore;
                        //                  self.bottomPocket.classList.remove(CLASS_BLOCK);
                        //                  self.bottomPocket.classList.add(CLASS_HIDDEN);
                        //取消5+的plusscrollbottom事件
                        document.removeEventListener('plusscrollbottom', self);
                        window.removeEventListener('dragup', self);
                    } else { //初始化时隐藏，后续不再隐藏
                        self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
                        self.pullCaption.innerHTML = self.options.up.contentdown;
                        //                  setTimeout(function() {
                        //                      self.loading || self.bottomPocket.classList.remove(CLASS_BLOCK);
                        //                  }, 350);
                    }
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
        $.fn.pullRefresh = function(options) {
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
                pullRefreshApi._pulldownLoading(); //parent webview
            } else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
                pullRefreshApi.pullupLoading();
            }
            return pullRefreshApi;
        };
    });

})(mui, document);