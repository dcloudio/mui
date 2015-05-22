(function($, window) {
	/**
	 * 确认消息框
	 */
	$.confirm = function(message,title,btnArray,callback) {
		if ($.os.plus) {
			if(typeof message === undefined){
				return;
			}else{
				if(typeof title ==='function'){
					callback = title;
					title = null;
					btnArray = null;
				}else if(typeof btnArray ==='function'){
					callback = btnArray;
					btnArray = null;
				}
				plus.nativeUI.confirm(message,callback,title,btnArray);
			}

		}else{
			//TODO H5版本
			window.confirm(message);
		}
	};

})(mui, window);