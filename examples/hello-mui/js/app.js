(function($) {
	//全局配置(通常所有页面引用该配置，特殊页面使用mui.init({})来覆盖全局配置)
	$.initGlobal({
		optimize: true,
		swipeBack: true
	});
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
//简单处理label点击触发radio或checkbox
window.addEventListener('tap', function(event) {
	var target = event.target;
	for (; target && target !== document; target = target.parentNode) {
		if (target.tagName && target.tagName === 'LABEL') {
			var parent = target.parentNode;
			if (parent.classList && (parent.classList.contains('mui-radio') || parent.classList.contains('mui-checkbox'))) {
				var input = parent.querySelector('input');
				if (input) {
					input.click();
				}
			}
		}
	}
});