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

	var ListPicker = $.ListPicker = $.Class.extend({
		init: function(box, options) {
			var self = this;
			if (!box) {
				throw "构造 ListPicker 时找不到元素";
			}
			self.box = box;
			//避免重复初始化开始
			if (self.box.__listpicker_inited) return;
			self.box.__listpicker_inited = true;
			//避免重复初始化结束
			options = options || {};
			options.fiexdDur = options.fiexdDur || 150;
			//ios 默认用 h5 模式
			if (options.enabledH5 === null || typeof options.enabledH5 === 'undefined') {
				options.enabledH5 = $.os.ios;
			}
			//options.enabledH5 = true;
			self.options = options;
			self._create();
			self._handleShim();
			self._bindEvent();
			self._applyToBox();
			self._handleHighlight();
		},
		_create: function() {
			var self = this;
			self.boxInner = $('.mui-listpicker-inner', self.box)[0];
			self.boxHeight = self.box.offsetHeight;
			self.list = $('ul', self.boxInner)[0];
			var firstItem = $('li', self.list)[0];
			self.itemHeight = 0;
			if (firstItem) {
				self.itemHeight = firstItem.offsetHeight;
			} else {
				self.list.innerHTML = "<li>...</li>";
				firstItem = $('li', self.list)[0];
				self.itemHeight = firstItem.offsetHeight;
				self.list.innerHTML = '';
			}
			self.list.style.paddingTop = self.list.style.paddingBottom = (self.boxHeight / 2 - self.itemHeight / 2) + 'px';
			self.rule = $.dom('<div class="mui-listpicker-rule"> </div>')[0];
			self.rule.style.height = self.itemHeight + 'px';
			self.rule.style.marginTop = -(self.itemHeight / 2) + 'px';
			self.box.appendChild(self.rule);
			if ($.os.ios) {
				self.boxInner.classList.add('mui-listpicker-inner-ios');
			}
		},
		_handleShim: function() {
			var self = this;
			if (self.options.enabledH5) {
				self.options.fiexdDur *= 2;
				self._scrollerApi = $(self.boxInner).scroll();
				self.setScrollTop = function(y, dur, callback) {
					self._scrollerApi.scrollTo(0, -y, dur);
				};
				self.getScrollTop = function() {
					var self = this;
					if (self._scrollerApi.lastY > 0) {
						return 0
					} else {
						return Math.abs(self._scrollerApi.lastY);
					}
				};
			} else {
				//alert(0);
				//为 boxInner 增加 scrollend 事件 (没有原生 scrollend 事件)
				self.boxInner.addEventListener('scroll', function(event) {
					if (self.disabledScroll) return;
					self.isScrolling = true;
					if (self.scrollTimer) {
						clearTimeout(self.scrollTimer);
					}
					self.scrollTimer = setTimeout(function() {
						self.isScrolling = false;
						if (!self.isTouchDown || !$.os.ios) {
							$.trigger(self.boxInner, 'scrollend');
						}
					}, 100);
				}, false);
				self.aniScrollTop = function(y, dur, callback) {
					self.disabledScroll = true;
					var stepNum = dur > 0 ? dur / 10 : 1;
					var stepSize = (y - self.boxInner.scrollTop) / stepNum;
					self._lastScrollTop = self.boxInner.scrollTop; //记录最后的位置
					self._aniScrollTop(y, 0, stepNum, stepSize, callback);
				};
				self._aniScrollTop = function(y, stepIndex, stepNum, stepSize, callback) {
					self.boxInner.scrollTop = self._lastScrollTop + stepSize * stepIndex;
					if (stepIndex < stepNum) {
						setTimeout(function() {
							self._aniScrollTop(y, ++stepIndex, stepNum, stepSize);
						}, 10);
					} else {
						//self.boxInner.scrollTop = y;
						self.disabledScroll = false;
						if (callback) callback();
					}
				};
				self.setScrollTop = function(y, dur, callback) {
					self.aniScrollTop(y, dur);
				};
				self.getScrollTop = function() {
					var self = this;
					return self.boxInner.scrollTop;
				};
				//在 ios 上手指不弹起时，防止定位抖动开始
				if ($.os.ios) {
					self.boxInner.addEventListener('touchstart', function(event) {
						var self = this;
						self.isTouchDown = true;
					}, false);
					self.boxInner.addEventListener('touchend', function(event) {
						self.isTouchDown = false;
						if (!self.isScrolling) {
							setTimeout(function() {
								$.trigger(self.boxInner, 'scrollend');
							}, 0);
						}
					}, false);
				}
				//在 ios 上手指不弹起时，防止定位抖动结束
			}
		},
		_handleHighlight: function() {
			var self = this;
			var scrollTop = self.getScrollTop();
			var fiexd = (scrollTop / self.itemHeight).toFixed(0);
			var itemElements = $('li', self.list);
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
		},
		_triggerChange: function() {
			var self = this;
			$.trigger(self.box, 'change', {
				index: self.getSelectedIndex(),
				value: self.getSelectedValue(),
				text: self.getSelectedText(),
				item: self.getSelectedItem(),
				element: self.getSelectedElement()
			});
		},
		_scrollEndHandle: function() {
			var self = this;
			var scrollTop = self.getScrollTop();
			var fiexd = (scrollTop / self.itemHeight).toFixed(0);
			self.disabledScrollEnd = true;
			self.setSelectedIndex(fiexd);
			self._triggerChange();
			self._handleHighlight();
			setTimeout(function() {
				self.disabledScrollEnd = false;
				self._handleHighlight();
			}, self.options.fiexdDur);
		},
		_bindEvent: function() {
			var self = this;
			//滚动处理高亮
			self.boxInner.addEventListener('scroll', function(event) {
				self._handleHighlight(event);
			}, false);
			//处理滚动结束
			self.disabledScrollEnd = false;
			self.boxInner.addEventListener('scrollend', function(event) {
				if (self.disabledScrollEnd) return;
				self.disabledScrollEnd = true;
				self._scrollEndHandle();
			}, false);
			//绑定项 tap 事件
			$(self.boxInner).on('tap', 'li', function(event) {
				var tapItem = this;
				var items = [].slice.call($('li', self.list));
				for (var i in items) {
					var item = items[i];
					if (item == tapItem) {
						self.setSelectedIndex(i);
						return;
					}
				};
			});
		},
		getSelectedIndex: function() {
			var self = this;
			return (self.getScrollTop() / self.itemHeight).toFixed(0);
		},
		setSelectedIndex: function(index, noAni) {
			var self = this;
			index = (index || 0);
			self.setScrollTop(self.itemHeight * index, noAni ? 0 : self.options.fiexdDur);
		},
		getSelectedElement: function() {
			var self = this;
			var index = self.getSelectedIndex();
			return $('li', self.list)[index];
		},
		getSelectedItem: function() {
			var self = this;
			var itemElement = self.getSelectedElement();
			if (!itemElement) return null;
			var itemJson = itemElement.getAttribute('data-item');
			return itemJson ? JSON.parse(itemJson) : {
				text: itemElement.innerText,
				value: itemElement.getAttribute('data-value')
			};
		},
		setItems: function(items) {
			var self = this;
			var buffer = [];
			for (index in items) {
				var item = items[index] || {
					text: 'null',
					value: 'null' + index
				};
				var itemJson = JSON.stringify(item);
				buffer.push("<li data-value='" + item.value + "' data-item='" + itemJson + "'>" + item.text + "</li>");
			};
			self.list.innerHTML = buffer.join('');
			//self._scrollEndHandle();
			if (self._scrollerApi && self._scrollerApi.refresh) {
				self._scrollerApi.refresh();
			}
			self._handleHighlight();
			self._triggerChange();
		},
		getItems: function() {
			var self = this;
			var items = [];
			var itemElements = $('li', self.list);
			for (index in itemElements) {
				var itemElement = itemElements[index];
				var itemJson = itemElement.getAttribute('data-item');
				items.push(itemJson ? JSON.parse(itemJson) : {
					text: itemElement.innerText,
					value: itemElement.getAttribute('data-value')
				});
			}
			return items;
		},
		getSelectedValue: function() {
			var self = this;
			var item = self.getSelectedItem();
			if (!item) return null;
			return item.value;
		},
		getSelectedText: function() {
			var self = this;
			var item = self.getSelectedItem();
			if (!item) return null;
			return item.text;
		},
		setSelectedValue: function(value, noAni) {
			var self = this;
			var itemElements = $('li', self.list);
			for (index in itemElements) {
				var itemElement = itemElements[index];
				if (!itemElement || !itemElement.getAttribute) {
					continue;
				}
				if (itemElement.getAttribute('data-value') == value) {
					self.setSelectedIndex(index, noAni);
					return;
				}
			}
		},
		_applyToBox: function() {
			var self = this;
			var memberArray = [
				"getSelectedIndex",
				"setSelectedIndex",
				"getSelectedElement",
				"getSelectedItem",
				"setItems",
				"getItems",
				"getSelectedValue",
				"getSelectedText",
				"setSelectedValue"
			];
			var _clone = function(name) {
				if (typeof self[name] === 'function') {
					self.box[name] = function() {
						return self[name].apply(self, arguments);
					};
				} else {
					self.box[name] = self[name];
				}
			};
			for (var i in memberArray) {
				var name = memberArray[i];
				_clone(name);
			}
		}
	});

	//添加 locker 插件
	$.fn.listpicker = function(options) {
		//遍历选择的元素
		this.each(function(i, element) {
			if (options) {
				new ListPicker(element, options);
			} else {
				var optionsText = element.getAttribute('data-listpicker-options');
				var options = optionsText ? JSON.parse(optionsText) : {};
				options.enabledH5 = element.getAttribute('data-listpicker-enabledh5') || options.enabledH5;
				options.fixedDur = element.getAttribute('data-listpicker-fixddur') || options.fixedDur;
				new ListPicker(element, options);
			}
		});
		return this;
	};

	//auto apply
	$.ready(function() {
		$('.mui-listpicker').listpicker();
	});

})(mui);