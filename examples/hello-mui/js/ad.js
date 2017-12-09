(function() {
	window.addEventListener('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var target = event.target;
		for(; target && target !== document; target = target.parentNode) {
			if(target.tagName == 'A' && target.getAttribute("href")) {
				plus.runtime.openURL(target.getAttribute("href"));
				break;
			}
		}
	}, true);

	//判断是否包含viewport meta信息，若无，则动态插入
	function appendMeta() {
		var content = 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no';
		if(!document.querySelector('meta[name=viewport]')) {
			var meta = document.createElement('meta');
			meta.name = 'viewport';
			meta.content = content;
			document.getElementsByTagName('head')[0].appendChild(meta);
		}
	}

	var readyRE = /complete|loaded|interactive/;
	if(readyRE.test(document.readyState)) {
		appendMeta();
	} else {
		document.addEventListener('DOMContentLoaded', function() {
			appendMeta();
		}, false);
	}
})();