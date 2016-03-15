(function() {
	var headerElem = document.querySelector(".header");
	if (headerElem) {
		var backElem = document.getElementById("back-95516");
		if (backElem) {
			return;
		}
		var css = ".header{position:relative;}#back-95516 {z-index:2000;position: absolute;display: inline-block;color: #333;top: 0;left: 0;width: 44px;height: 44px;}#back-95516:before{border: #fff solid 3px;position: absolute;left: 15px;top: 15px;display: block;content: ' ';background-size: 12px, auto;width: 12px;height: 12px;border-top: none;border-right: none;-webkit-transform: rotate(45deg);transform: rotate(45deg);}";
		var headElem = document.head || document.getElementsByTagName('head')[0];
		var styleElem = document.createElement('style');
		styleElem.type = 'text/css';
		if (styleElem.styleSheet) {
			styleElem.styleSheet.cssText = css;
		} else {
			styleElem.appendChild(document.createTextNode(css));
		}
		headElem.appendChild(styleElem);

		backElem = document.createElement('a');
		backElem.id = 'back-95516';
		headerElem.appendChild(backElem);
		backElem.addEventListener('click', function(e) {
			plus.webview.currentWebview().close('auto');
		}, true);
		document.addEventListener('plusready', function() {
			plus.key.addEventListener('backbutton', function() {
				plus.webview.currentWebview().close('auto');
			})
		});
	}

})();