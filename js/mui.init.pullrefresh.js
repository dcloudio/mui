/**
 * mui.init pulldownRefresh
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.addInit({
		name: 'pullrefresh',
		index: 1000,
		handle: function() {
			var options = $.options;
			var pullRefreshOptions = options.pullRefresh || {};
			var hasPulldown = pullRefreshOptions.down && pullRefreshOptions.down.hasOwnProperty('callback');
			var hasPullup = pullRefreshOptions.up && pullRefreshOptions.up.hasOwnProperty('callback');
			if(hasPulldown || hasPullup) {
				var container = pullRefreshOptions.container;
				if(container) {
					var $container = $(container);
					if($container.length === 1) {
						if($.os.plus) { //5+环境
							if(hasPulldown && pullRefreshOptions.down.style == "circle") { //原生转圈
								$.plusReady(function() {
									//这里改写$.fn.pullRefresh
									$.fn.pullRefresh = $.fn.pullRefresh_native;
									$container.pullRefresh(pullRefreshOptions);
								});

							} else if($.os.android) { //非原生转圈，但是Android环境
								$.plusReady(function() {
									//这里改写$.fn.pullRefresh
									$.fn.pullRefresh = $.fn.pullRefresh_native
									var webview = plus.webview.currentWebview();
									if(window.__NWin_Enable__ === false) { //不支持多webview
										$container.pullRefresh(pullRefreshOptions);
									} else {
										if(hasPullup) {
											//当前页面初始化pullup
											var upOptions = {};
											upOptions.up = pullRefreshOptions.up;
											upOptions.webviewId = webview.id || webview.getURL();
											$container.pullRefresh(upOptions);
										}
										if(hasPulldown) {
											var parent = webview.parent();
											var id = webview.id || webview.getURL();
											if(parent) {
												if(!hasPullup) { //如果没有上拉加载，需要手动初始化一个默认的pullRefresh，以便当前页面容器可以调用endPulldownToRefresh等方法
													$container.pullRefresh({
														webviewId: id
													});
												}
												var downOptions = {
													webviewId: id//子页面id
												};
												downOptions.down = $.extend({}, pullRefreshOptions.down);
												downOptions.down.callback = '_CALLBACK';
												//改写父页面的$.fn.pullRefresh
												parent.evalJS("mui.fn.pullRefresh=mui.fn.pullRefresh_native");
												//父页面初始化pulldown
												parent.evalJS("mui&&mui(document.querySelector('.mui-content')).pullRefresh('" + JSON.stringify(downOptions) + "')");
											}
										}
									}
								});
							} else { //非原生转圈，iOS环境
								$container.pullRefresh(pullRefreshOptions);
							}
						} else {
							$container.pullRefresh(pullRefreshOptions);
						}
					}
				}
			}
		}
	});
})(mui);