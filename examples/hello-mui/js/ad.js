document.querySelector("body").addEventListener('click',function (event) {
	event.preventDefault();
	event.stopPropagation();
	var target = event.target;
	for (; target && target !== document; target = target.parentNode) {
		if(target.tagName=='A'){
			plus.runtime.openURL(target.getAttribute("href"));
			break;
		}
		console.log("target:"+target.tagName);
	}
},true);
	


