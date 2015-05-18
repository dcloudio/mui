(function($, window) {
	/**
	 * 输入对话框
	 */
	$.prompt = function(text,defaultText,title,btnArray,callback) {
		if ($.os.plus) {
			if(typeof message === undefined){
				return;
			}else{

				if(typeof defaultText ==='function'){
					callback = defaultText;
					defaultText = null;
					title = null;
					btnArray = null;
				}else if(typeof title === 'function'){
					callback = title;
					title = null;
					btnArray = null;
				}else if(typeof btnArray ==='function'){
					callback = btnArray;
					btnArray = null;
				}
				plus.nativeUI.prompt(text,callback,title,defaultText,btnArray);
			}

		}else{
			//TODO H5版本
			window.prompt(text);
		}
	};

})(mui, window);