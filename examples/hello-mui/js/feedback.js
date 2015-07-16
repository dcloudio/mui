(function($, feedback, window, document) {

	/*************** 环信配置开始 ****************/
	//以后信息更改后，需卸载 “调试 app” 重新调用运行
	var APP_KEY = 'dcloudio#mui';
	var CUSTOM_ID = 'customer';
	/*************** 环信配置结束 ****************/

	//一组 “常量”
	var PASSWORD = 'pass01!';
	var LOCAL_STORE_KEY = 'mui://user';
	var USER_PREFIX = 'mui-user-';


	/**
	 * 生成一个 IM 用户名
	 **/
	var createUsername = function() {
		return USER_PREFIX + (new Date()).getTime();
	};

	/**
	 * 获取用户，如果在本地存储中已有用户则直接返回。
	 * 否则，注册新的用户
	 **/
	feedback.getUser = function(callback) {
		var storeUserText = localStorage.getItem(LOCAL_STORE_KEY);
		if (storeUserText) {
			if (callback) callback(JSON.parse(storeUserText));
			return;
		}
		var newUsername = createUsername();
		Easemob.im.Helper.registerUser({
			username: newUsername,
			password: PASSWORD,
			appKey: APP_KEY,
			success: function(result) {
				var userInfo = {
					username: newUsername,
					password: PASSWORD
				};
				localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(userInfo));
				if (callback) callback(userInfo);
			},
			error: function(e) {
				plus.nativeUI.toast(e.message);
			}
		});
	};

	/**
	 * 登录环信息服务器
	 **/
	feedback.login = function(callback) {
		feedback.getUser(function(user) {
			var conn = new Easemob.im.Connection();
			conn.init({
				onOpened: function() {
					//alert("成功登录");
					conn.setPresence();
					if (callback) callback(user, conn);
				}
			});
			conn.open({
				user: user.username,
				pwd: user.password,
				appKey: APP_KEY
			});
		});
	};

	/**
	 * 发送反馈信息
	 **/
	feedback.send = function(content, callback) {
		feedback.login(function(user, conn) {
			//发送文本消息
			var msgText = '问题:' + content.question;
			if (content.contact) {
				msgText += '; 联系方式:' + content.contact + ';'
			}
			conn.sendTextMessage({
				to: CUSTOM_ID,
				msg: msgText,
				type: "chat"
			});
			//如果没有截图
			if (!content.images || content.images.length < 1) {
				if (callback) callback();
				return;
			}
			//如果有截图
			var sendImageCount = 0;
			var hasError = false;
			content.images.forEach(function(fileInputId) {
				//alert(fileInputId)
				conn.sendPicture({
					fileInputId: fileInputId,
					to: CUSTOM_ID,
					onFileUploadError: function(error) {
						//处理图片上传失败
						alert(JSON.stringify(error));
						hasError = true;
					},
					onFileUploadComplete: function(data) {
						//处理图片上传成功，如本地消息显示
						sendImageCount++;
						if (!hasError && sendImageCount >= content.images.length) {
							if (callback) callback();
						}
					}
				});
			});
			//--
		});
	};

})(mui, window.feedback = {}, window, document);