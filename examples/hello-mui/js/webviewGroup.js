var webviewGroup = function(id, options) {
	this.id = id;
	this.options = options;
	this.styles = options.styles;
	this.items = options.items;
	this.onChange = options.onChange

	this.options.index = options.index || 0;

	this.webviews = {};
	this.webviewContexts = {};
	this.currentWebview = false;
	this._init();
};

var proto = webviewGroup.prototype;

proto._init = function() {
	this._initParent();
	this._initNativeView();
	this._initWebviewContexts(this.options.index);
};
proto._initParent = function() {
	this.parent = plus.webview.getWebviewById(this.id);
	if(!this.parent) {
		this.parent = plus.webview.create(this.id, this.id);
		this.parent.show('none');
	}
};
proto._initNativeView = function() {
	this.nativeView = new plus.nativeObj.View('__MUI_TAB_NATIVE', {
		'top': '83px',//这个需要根据顶部导航及顶部选项卡高度自动调整
		'height': (window.screen.height - 83)+"px",
		'left': '100%',
		'width': '100%',
		"backgroundColor":"#ffffff"
	});
	this.nativeView.show();
};
proto._initWebviewContexts = function() {
	for(var len = this.items.length, i = len - 1; i >= 0; i--) {
		var webviewOptions = this.items[i];
		var id = webviewOptions.id;
		var isFirst = i === 0;
		var isLast = i === (len - 1);
		var isCurrent = this.options.index === i;
		var extras = webviewOptions.extras;
		extras.__mui_url = webviewOptions.url;
		extras.__mui_index = i;

		extras.__mui_left = isFirst ? '' : this.items[i - 1].id;
		extras.__mui_right = isLast ? '' : this.items[i + 1].id;

		var styles = webviewOptions.styles || {};

		if(i > this.options.index) {
			styles.left = '100%';
		} else if(i < this.options.index) {
			styles.left = '-100%';
		} else {
			styles.left = '0';
		}
		var webviewContext = new webviewGroupContext(id, webviewOptions, this);
		this.webviewContexts[id] = webviewContext;
		if(isCurrent) {
			webviewContext.webview = plus.webview.getWebviewById(id);
			webviewContext.createWebview();
			webviewContext.webview.show("none");
			this._initDrags(webviewContext.webview);
			this.currentWebview = webviewContext.webview;
		}
	}
};
proto._onChange = function(webview) {
	this.currentWebview = webview;
	this.onChange({
		index: webview.__mui_index
	});
};
proto._dragCallback = function(dir, fromWebview, view, viewId) {
	if(view === this.nativeView) { //需要创建webview
		//第一步:初始化目标webview
		this.webviewContexts[viewId].createWebview('drag');
		var targetWebview = this.webviewContexts[viewId].webview;
		targetWebview.show();
		this.nativeView.setStyle({
			left: '100%'
		});
		//第二步:初始化目标webview的drag
		this._initDrags(targetWebview);
		this._onChange(targetWebview);
		//第三步:校验目标webview的左右webview的drag初始化
		this._checkDrags(targetWebview);
	} else {
		this._onChange(view);
	}
};

proto._initDrag = function(webview, dir) {
	var flag = ('__mui_drag_' + dir + '_flag');
	if(webview[flag]) {
		return;
	}
	var viewId = webview['__mui_' + (dir === 'left' ? 'right' : 'left')];
	if(viewId) {
		var view = plus.webview.getWebviewById(viewId);
		if(!view) { //如果目标webview不存在,使用nativeView替换
			view = this.nativeView;
		} else {
			webview[flag] = true;
		}
		webview.drag({
				'direction': dir,
				'moveMode': 'followFinger'
			}, {
				'view': view,
				'moveMode': 'follow'
			},
			function(res) {
				if(res.type === 'end' && res.result) { //拖拽完成
					this._dragCallback(dir, webview, view, viewId);
				}
			}.bind(this)
		)
	} else {
		webview[flag] = true;
	}
};
proto._initDrags = function(webview) {
	this._initDrag(webview, 'left');
	this._initDrag(webview, 'right');
};
proto._checkDrags = function(webview) {
	var left = webview.__mui_left;
	var right = webview.__mui_right;
	if(left) {
		var leftWebview = plus.webview.getWebviewById(left);
		if(leftWebview && !leftWebview.__mui_drag_left_flag) {
			this._initDrag(leftWebview, 'left');
		}
	}
	if(right) {
		var rightWebview = plus.webview.getWebviewById(right);
		if(rightWebview && !rightWebview.__mui_drag_right_flag) {
			this._initDrag(rightWebview, 'right');
		}
	}
};
proto.getCurrentWebview = function() {
	return this.currentWebview;
};
proto.getCurrentWebviewContext = function() {
	if(this.currentWebview) {
		return this.webviewContexts[this.currentWebview.id];
	}
	return false;
};
proto.switchTab = function(id) {
	id = id.replace('_0', ''); //首页需要替换为appid
	var fromWebview = this.currentWebview;
	if(id === fromWebview.id) {
		return;
	}
	var toWebviewContext = this.webviewContexts[id];
	var toWebview = toWebviewContext.webview;
	var fromToLeft = '100%';
	var toFromLeft = '-100%';
	if(toWebviewContext.options.extras.__mui_index > fromWebview.__mui_index) {
		fromToLeft = '-100%';
		toFromLeft = '100%';
	}
	var isNew = false;
	if(!toWebview) {
		isNew = true;
		toWebviewContext.createWebview('startAnimation');
		toWebview = toWebviewContext.webview;
		//					toWebview.showBehind(plus.webview.getSecondWebview());
		toWebview.show();
		this._initDrags(toWebview);
		this._checkDrags(toWebview); //新建的时候均需校验
	}
	var self = this;
//	console.log("current:" + fromWebview.id + ",to:" + fromToLeft);
//	console.log("next:" + toWebview.id + ",from:" + toFromLeft);

	plus.webview.startAnimation({
			'view': fromWebview,
			'styles': {
				'fromLeft': '0',
				'toLeft': fromToLeft
			},
			'action': 'show'
		}, {
			'view': toWebview,
			'styles': {
				'fromLeft': toFromLeft,
				'toLeft': '0'
			},
			'action': 'show'
		},
		function(e) {
			//console.log("startAnimation callback...");
			if(e.id === toWebview.id) {
				isNew && plus.nativeUI.showWaiting();
				this.currentWebview = toWebview;
				this.onChange({
					index: toWebview.__mui_index
				});
			}
		}.bind(this)
	)
};

/**
 * @param {Object} id
 * @param {Object} webviewOptions
 */
var webviewGroupContext = function(id, webviewOptions, groupContext) {
	this.id = id;
	this.url = webviewOptions.url;
	this.options = webviewOptions;
	this.groupContext = groupContext;

	this.webview = false;
	this.inited = false;
};

var _proto = webviewGroupContext.prototype;

_proto.createWebview = function(from) {
	var options = this.options;
	options.styles = options.styles || {
		top: "83px",
		bottom: "0px",
		render: "always"
	};
	options.styles.popGesture = 'none';
	if(this.webview) {
		this.webview.setStyle(options.styles);
		for(var key in options.extras) {
			this.webview[key] = options.extras[key];
		}
	} else {
		options.styles.left = '100%';
		if(from !== 'startAnimation') {
			options.styles.left = '0';
			plus.nativeUI.showWaiting();
		}
		this.webview = plus.webview.create(this.url, this.id, options.styles, options.extras);
		//append进去，避免返回时闪屏
		plus.webview.currentWebview().append(this.webview);
	}
	this._initWebview();
	this.inited = true;
};
_proto._initWebview = function() {
	var options = this.options;
	if(!this.webview) {
		return;
	}
	this.webview.addEventListener('rendering', function() {
		setTimeout(function() {
			plus.nativeUI.closeWaiting();
		}, 500);
	});
	if(options.pullToRefresh && options.pullToRefresh.support && support.pullToRefresh()) {
		var callback = options.pullToRefresh.callback;
		this.webview.setPullToRefresh(options.pullToRefresh, function() {
			if(callback) { //如果指定了下拉回调
				callback(this.webview);
			} else { //下拉刷新回调，默认reload当前页面
				var self = this;
				var titleUpdate = function() {
					setTimeout(function() {
						self.webview.endPullToRefresh();
					}.bind(this), 1000);
					self.webview.removeEventListener('titleUpdate', titleUpdate);
				};
				this.webview.addEventListener('titleUpdate', titleUpdate);
				this.webview.reload();
			}
		}.bind(this));
	}
};