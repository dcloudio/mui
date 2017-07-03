var util = {
	options: {
		active_color:'#007aff',
		normal_color:'#000',
		subpages:['html/tab-webview-subpage-about.html', 'html/tab-webview-subpage-chat.html', 'html/tab-webview-subpage-contact.html']
	},
	/**
	 *  简单封装了绘制原生view控件的方法
	 *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
	 */
	drawNative: function(id, styles, tags) {
		var view = new plus.nativeObj.View(id, styles, tags);
		return view;
	},
	/**
	 * 创建子webview窗口 并初始化
	 */
	initSubpage: function() {
		var subpage_style = {
				top: '0px',
				bottom: '51px'
			},
			subpages = util.options.subpages,
			aniShow = {},
			self = plus.webview.currentWebview();
			
		for(var i = 0; i < 3; i++) {
			var temp = {};
			if(!plus.webview.getWebviewById(subpages[i])) {
				var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
				if(i > 0) {
					sub.hide();
				} else {
					temp[subpages[i]] = "true";
					mui.extend(aniShow, temp);
					util.toggleNview(self.getStyle().subNViews[0], 0);
				}
				// append到当前父webview
				self.append(sub);
			}
		}
	},
	/**	
	 * 点击切换子窗口 
	 */
	changeSubpage: function(targetPage, activePage) {
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetPage]) {
			plus.webview.show(targetPage);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetPage] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetPage, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activePage);
	},
	/**
	 * 点击重回底部tab （view控件）
	 */
	toggleNview: function(currObj, currIndex) {
		var self = plus.webview.currentWebview();
		// 重绘当前nview
		self.updateSubNViews([{
			id: currObj.id,
			tags: [{
				tag: 'font', //currObj.tag
				id: currObj.id + 1,
				position: currObj.tags[0].position,
				text: currObj.tags[0].text,
				textStyles: util.changeColor(currObj.tags[0].textStyles, util.options.active_color)
			}, {
				tag: 'font',
				id: currObj.id + 2,
				position: currObj.tags[1].position,
				text: currObj.tags[1].text,
				textStyles: util.changeColor(currObj.tags[1].textStyles, util.options.active_color)
			}]
		}])

		// 重绘兄弟nview
		for(var i = 0; i < 4; i++) {
			var viewObj = self.getStyle().subNViews[i];

			if(i !== currIndex) {
				util.updateSubNView(viewObj);
			}
		}
	},
	/*
	 * 改变颜色
	 */
	changeColor: function(obj, color) {
		obj.color = color;
		return obj
	},
	/*
	 * 利用 webview 提供的 updateSubNViews 方法更新 view 控件
	 */
	updateSubNView: function(obj) {
		var self = plus.webview.currentWebview();
		self.updateSubNViews([{
			id: obj.id,
			tags: [{
				tag: 'font',
				id: obj.id + 1,
				position: obj.tags[0].position,
				text: obj.tags[0].text,
				textStyles: util.changeColor(obj.tags[0].textStyles, util.options.normal_color)
			}, {
				tag: 'font',
				id: obj.id + 2,
				position: obj.tags[1].position,
				text: obj.tags[1].text,
				textStyles: util.changeColor(obj.tags[1].textStyles, util.options.normal_color)
			}]
		}]);
	}
};