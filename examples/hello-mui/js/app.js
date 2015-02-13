(function($) {
	//全局配置(通常所有页面引用该配置，特殊页面使用mui.init({})来覆盖全局配置)
	$.initGlobal({
		swipeBack: true
	});
	var back = $.back;
	$.back = function() {
		var current = plus.webview.currentWebview();
		if (current.mType === 'main') { //模板主页面
			current.hide('auto');
			setTimeout(function() {
				document.getElementById("title").className = 'mui-title mui-fadeout';
				current.children()[0].hide("none");
			}, 200);
		} else if (current.mType === 'sub') {
			if ($.targets._popover) {
				$($.targets._popover).popover('hide');
			} else {
				current.parent().evalJS('mui&&mui.back();');
			}
		} else {
			back();
		}
	}
})(mui);

/**
 * toggle
 */
window.addEventListener('toggle', function(event) {
	if (event.target.id === 'M_Toggle') {
		var isActive = event.detail.isActive;
		var table = document.querySelector('.mui-table-view');
		var card = document.querySelector('.mui-card');
		if (isActive) {
			card.appendChild(table);
			card.style.display = '';
		} else {
			var content = document.querySelector('.mui-content');
			content.insertBefore(table, card);
			card.style.display = 'none';
		}
	}
});