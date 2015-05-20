/**
 * 选择列表插件
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($) {

	//create dom
	$.dom = function(str) {
		if (typeof(str) !== 'string') {
			if ((str instanceof Array) || (str[0] && str.length)) {
				return [].slice.call(str);
			} else {
				return [str];
			}
		}
		if (!$.__create_dom_div__) {
			$.__create_dom_div__ = document.createElement('div');
		}
		$.__create_dom_div__.innerHTML = str;
		return [].slice.call($.__create_dom_div__.childNodes);
	};

	//plugin
	$.fn.listpicker = function(options) {
		return this.each(function(index, box) {
			if (box.getAttribute('data-listpicker-inited')) {
				return;
			}
			box.setAttribute('data-listpicker-inited', '1');
			//
			var boxInner = $('.mui-listpicker-inner', box)[0];
			if ($.os.ios) {
				boxInner.classList.add('mui-listpicker-inner-ios');
			}
			var boxHeight = box.offsetHeight;
			var ul = $('ul', boxInner)[0];
			var firstItem = $('li', ul)[0];
			var itemHeight = 0;
			if (firstItem) {
				itemHeight = firstItem.offsetHeight;
			} else {
				ul.innerHTML = "<li>...</li>";
				firstItem = $('li', ul)[0];
				itemHeight = firstItem.offsetHeight;
				ul.innerHTML = '';
			}
			ul.style.paddingTop = ul.style.paddingBottom = (boxHeight / 2 - itemHeight / 2) + 'px';
			var rule = $.dom('<div class="mui-listpicker-rule"> </div>')[0];
			rule.style.height = itemHeight + 'px';
			rule.style.marginTop = -(itemHeight / 2) + 'px';
			box.appendChild(rule);
			//
			var disabledScrollEnd = false;
			var scrollEnd = function(event) {
				if (disabledScrollEnd) return;
				disabledScrollEnd = true;
				/*
				var remainder = boxInner.scrollTop % itemHeight;
				if(remainder>itemHeight/2){
					boxInner.scrollTop+=(itemHeight-remainder);
				}el
					boxInner.scrollTop-=remainder;
				}*/
				var fiexd = parseInt((boxInner.scrollTop / itemHeight).toFixed(0));
				box.setSelectedIndex(fiexd);
				setTimeout(function() {
					disabledScrollEnd = false;
					$.trigger(box, 'change', {
						index: box.getSelectedIndex(),
						value: box.getSelectedValue(),
						text: box.getSelectedText(),
						item: box.getSelectedItem(),
						element: box.getSelectedElement()
					});
					handleHighlight(event);
				}, 200);
			};
			var handleHighlight = function(event) {
				var fiexd = parseInt((boxInner.scrollTop / itemHeight).toFixed(0));
				var itemElements = $('li', ul);
				for (var index in itemElements) {
					var itemElement = itemElements[index];
					if (!itemElement || !itemElement.classList) continue;
					if (index == fiexd) {
						itemElement.classList.add('mui-listpicker-highlight');
					} else {
						itemElement.classList.remove('mui-listpicker-highlight');
					}
				}
				/*
				var opacity = 1;
				for (var index = fiexd; index >= 0; index--) {
					var itemElement = itemElements[index];
					itemElement.style.opacity = opacity;
					opacity -= 0.25;
					if (opacity < 0) opacity = 0;
				}
				opacity = 1;
				var length = itemElements.length;
				for (var index = fiexd; index < itemElements.length; index++) {
					var itemElement = itemElements[index];
					itemElement.style.opacity = opacity;
					opacity -= 0.25;
					if (opacity < 0) opacity = 0;
				}
				*/
			};
			var isTouchDown = false;
			var delayExecScrollEnd = false;
			boxInner.addEventListener('scroll', function(event) {
				if (boxInner.scrollTimer) {
					clearTimeout(boxInner.scrollTimer);
				}
				handleHighlight(event);
				isTouchDown = true;
				boxInner.scrollTimer = setTimeout(function() {
					scrollEnd(event);
				}, 80);
			}, false);
			$(boxInner).on('tap', 'li', function(event) {
				var tapItem = this;
				var items = [].slice.call($('li', ul));
				for (var i in items) {
					var item = items[i];
					if (item == tapItem) {
						box.setSelectedIndex(i);
						return;
					}
				};
			});
			box.getSelectedIndex = function() {
				return parseInt(boxInner.scrollTop / itemHeight);
			};
			var aniScrollTop = function(y1, y2, dur, callback) {
				var stepNum = dur / 13;
				var stepSize = (y2 - y1) / stepNum;
				_aniScrollTop(y1, y2, 0, stepNum, stepSize, callback);
			};
			var _aniScrollTop = function(y1, y2, stepIndex, stepNum, stepSize, callback) {
				var val = stepIndex * stepSize;
				boxInner.scrollTop = y1 + val;
				if (stepIndex < stepNum) {
					stepIndex++;
					setTimeout(function() {
						_aniScrollTop(y1, y2, stepIndex, stepNum, stepSize);
					}, 13);
				} else {
					boxInner.scrollTop = y2;
					if (callback) callback();
				}
			};
			box.setSelectedIndex = function(index) {
				index = parseInt(index || 0);
				//boxInner.scrollTop = itemHeight * index;
				aniScrollTop(boxInner.scrollTop, itemHeight * index, 100);
			};
			box.getSelectedElement = function() {
				var index = box.getSelectedIndex();
				return $('li', ul)[index];
			};
			box.getSelectedItem = function() {
				var itemElement = box.getSelectedElement();
				if (!itemElement) return null;
				var itemJson = itemElement.getAttribute('data-item');
				return itemJson ? JSON.parse(itemJson) : {
					text: itemElement.innerText,
					value: itemElement.getAttribute('data-value')
				};
			};
			box.setItems = function(items) {
				var buffer = [];
				for (index in items) {
					var item = items[index] || {
						text: 'null',
						value: 'null' + index
					};
					var itemJson = JSON.stringify(item);
					buffer.push("<li data-value='" + item.value + "' data-item='" + itemJson + "'>" + item.text + "</li>");
				};
				ul.innerHTML = buffer.join('');
				scrollEnd();
			};
			box.getItems = function() {
				var items = [];
				var itemElements = $('li', ul);
				for (index in itemElements) {
					var itemElement = itemElements[index];
					var itemJson = itemElement.getAttribute('data-item');
					items.push(itemJson ? JSON.parse(itemJson) : {
						text: itemElement.innerText,
						value: itemElement.getAttribute('data-value')
					});
				}
				return items;
			};
			box.getSelectedValue = function() {
				var item = box.getSelectedItem();
				if (!item) return null;
				return item.value;
			};
			box.getSelectedText = function() {
				var item = box.getSelectedItem();
				if (!item) return null;
				return item.text;
			};
			box.setSelectedValue = function(value) {
				var itemElements = $('li', ul);
				for (index in itemElements) {
					var itemElement = itemElements[index];
					if (!itemElement || !itemElement.getAttribute) {
						continue;
					}
					if (itemElement.getAttribute('data-value') == value) {
						box.setSelectedIndex(index);
						return;
					}
				}
			};
		});
	}

	//auto apply
	$.ready(function() {
		$('.mui-listpicker').listpicker();
	});

})(mui);