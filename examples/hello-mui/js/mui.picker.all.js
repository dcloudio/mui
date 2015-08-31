/**
 * 选择列表插件
 * varstion 2.0.0
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($, window, document, undefined) {

	var MAX_EXCEED = 30;
	var VISIBLE_RANGE = 90;
	var DEFAULT_ITEM_HEIGHT = 40;
	var BLUR_WIDTH = 10;

	var rad2deg = $.rad2deg = function(rad) {
		return rad / (Math.PI / 180);
	};

	var deg2rad = $.deg2rad = function(deg) {
		return deg * (Math.PI / 180);
	};

	var platform = navigator.platform.toLowerCase();
	var userAgent = navigator.userAgent.toLowerCase();
	var isIos = userAgent.indexOf('iphone') > -1 && platform == 'iphone';

	var Picker = $.Picker = function(holder, options) {
		var self = this;
		self.holder = holder;
		self.options = options || {};
		self.init();
		self.initInertiaParams();
		self.calcElementItemPostion(true);
		self.bindEvent();
	};

	Picker.prototype.findElementItems = function() {
		var self = this;
		self.elementItems = [].slice.call(self.holder.querySelectorAll('li'));
		return self.elementItems;
	};

	Picker.prototype.init = function() {
		var self = this;
		self.list = self.holder.querySelector('ul');
		self.findElementItems();
		self.height = self.holder.offsetHeight;
		self.r = self.height / 2 - BLUR_WIDTH;
		self.d = self.r * 2;
		self.itemHeight = self.elementItems.length > 0 ? self.elementItems[0].offsetHeight : DEFAULT_ITEM_HEIGHT;
		self.itemAngle = parseInt(self.calcAngle(self.itemHeight * 0.8));
		self.hightlightRange = self.itemAngle / 2;
		self.visibleRange = VISIBLE_RANGE;
		self.beginAngle = 0;
		self.beginExceed = self.beginAngle - MAX_EXCEED;
		self.list.angle = self.beginAngle;
		if (isIos) {
			self.list.style.webkitTransformOrigin = "center center " + self.r + "px";
		}
	};

	Picker.prototype.calcElementItemPostion = function(andGenerateItms) {
		var self = this;
		if (andGenerateItms) {
			self.items = [];
		}
		self.elementItems.forEach(function(item) {
			var index = self.elementItems.indexOf(item);
			self.endAngle = self.itemAngle * index;
			item.angle = self.endAngle;
			item.style.webkitTransformOrigin = "center center -" + self.r + "px";
			item.style.webkitTransform = "translateZ(" + self.r + "px) rotateX(" + (-self.endAngle) + "deg)";
			if (andGenerateItms) {
				var dataItem = {};
				dataItem.text = item.innerHTML || '';
				dataItem.value = item.getAttribute('data-value') || dataItem.text;
				self.items.push(dataItem);
			}
		});
		self.endExceed = self.endAngle + MAX_EXCEED;
		self.calcElementItemVisibility(self.beginAngle);
	};

	Picker.prototype.calcAngle = function(c) {
		var self = this;
		var a = b = parseFloat(self.r);
		//直径的整倍数部分直接乘以 180
		c = Math.abs(c); //只算角度不关心正否值
		var intDeg = parseInt(c / self.d) * 180;
		c = c % self.d;
		//余弦
		var cosC = (a * a + b * b - c * c) / (2 * a * b);
		var angleC = intDeg + rad2deg(Math.acos(cosC));
		return angleC;
	};

	Picker.prototype.calcElementItemVisibility = function(angle) {
		var self = this;
		self.elementItems.forEach(function(item) {
			var difference = Math.abs(item.angle - angle);
			if (difference < self.hightlightRange) {
				item.classList.add('highlight');
			} else if (difference < self.visibleRange) {
				item.classList.add('visible');
				item.classList.remove('highlight');
			} else {
				item.classList.remove('highlight');
				item.classList.remove('visible');
			}
		});
	};

	Picker.prototype.setAngle = function(angle) {
		var self = this;
		self.list.angle = angle;
		self.list.style.webkitTransform = "perspective(1000px) rotateY(0deg) rotateX(" + angle + "deg)";
		self.calcElementItemVisibility(angle);
	};

	Picker.prototype.bindEvent = function() {
		var self = this;
		var lastAngle = 0;
		var startY = null;
		self.holder.addEventListener('touchstart', function(event) {
			event.preventDefault();
			self.list.style.webkitTransition = '';
			startY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
			lastAngle = self.list.angle;
			self.updateInertiaParams(event, true);
		}, false);
		self.holder.addEventListener('touchend', function(event) {
			event.preventDefault();
			self.startInertiaScroll(event);
		}, false);
		self.holder.addEventListener('touchcancel', function(event) {
			event.preventDefault();
			self.startInertiaScroll(event);
		}, false);
		self.holder.addEventListener('touchmove', function(event) {
			event.preventDefault();
			var endY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
			var dragRange = endY - startY;
			var dragAngle = self.calcAngle(dragRange);
			var newAngle = dragRange > 0 ? lastAngle - dragAngle : lastAngle + dragAngle;
			if (newAngle > self.endExceed) {
				newAngle = self.endExceed
			}
			if (newAngle < self.beginExceed) {
				newAngle = self.beginExceed
			}
			self.setAngle(newAngle);
			self.updateInertiaParams(event);
		}, false);
		//--
		self.list.addEventListener('tap', function(event) {
			elementItem = event.target;
			if (elementItem.tagName == 'LI') {
				self.setSelectedIndex(self.elementItems.indexOf(elementItem), 200);
			}
		}, false);
	};

	Picker.prototype.initInertiaParams = function() {
		var self = this;
		self.lastMoveTime = 0;
		self.lastMoveStart = 0;
		self.stopInertiaMove = false;
	};

	Picker.prototype.updateInertiaParams = function(event, isStart) {
		var self = this;
		var point = event.changedTouches ? event.changedTouches[0] : event;
		if (isStart) {
			self.lastMoveStart = point.pageY;
			self.lastMoveTime = event.timeStamp || Date.now();
			self.startAngle = self.list.angle;
		} else {
			var nowTime = event.timeStamp || Date.now();
			if (nowTime - self.lastMoveTime > 300) {
				self.lastMoveTime = nowTime;
				self.lastMoveStart = point.pageY;
			}
		}
		self.stopInertiaMove = true;
	};

	Picker.prototype.startInertiaScroll = function(event) {
		var self = this;
		var point = event.changedTouches ? event.changedTouches[0] : event;
		/** 
		 * 缓动代码
		 */
		var nowTime = event.timeStamp || Date.now();
		var v = (point.pageY - self.lastMoveStart) / (nowTime - self.lastMoveTime); //最后一段时间手指划动速度  
		var dir = v > 0 ? -1 : 1; //加速度方向  
		var deceleration = dir * 0.0006 * -1;
		var duration = Math.abs(v / deceleration); // 速度消减至0所需时间  
		var dist = v * duration / 2; //最终移动多少 
		var startAngle = self.list.angle;
		var distAngle = self.calcAngle(dist) * dir;
		//----
		var srcDistAngle = distAngle;
		if (startAngle + distAngle < self.beginExceed) {
			distAngle = self.beginExceed - startAngle;
			duration = duration * (distAngle / srcDistAngle) * 0.6;
		}
		if (startAngle + distAngle > self.endExceed) {
			distAngle = self.endExceed - startAngle;
			duration = duration * (distAngle / srcDistAngle) * 0.6;
		}
		//----
		if (distAngle == 0) {
			self.endScroll();
			return;
		}
		self.scrollDistAngle(nowTime, startAngle, distAngle, duration);
	};

	Picker.prototype.scrollDistAngle = function(nowTime, startAngle, distAngle, duration) {
		var self = this;
		self.stopInertiaMove = false;
		(function(nowTime, startAngle, distAngle, duration) {
			var frameInterval = 13;
			var stepCount = duration / frameInterval;
			var stepIndex = 0;
			(function inertiaMove() {
				if (self.stopInertiaMove) return;
				var newAngle = self.quartEaseOut(stepIndex, startAngle, distAngle, stepCount);
				self.setAngle(newAngle);
				stepIndex++;
				if (stepIndex > stepCount - 1 || newAngle < self.beginExceed || newAngle > self.endExceed) {
					self.endScroll();
					return;
				}
				setTimeout(inertiaMove, frameInterval);
			})();
		})(nowTime, startAngle, distAngle, duration);
	};

	Picker.prototype.quartEaseOut = function(t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	};

	Picker.prototype.endScroll = function() {
		var self = this;
		if (self.list.angle < self.beginAngle) {
			self.list.style.webkitTransition = "150ms ease-out";
			self.setAngle(self.beginAngle);
		} else if (self.list.angle > self.endAngle) {
			self.list.style.webkitTransition = "150ms ease-out";
			self.setAngle(self.endAngle);
		} else {
			var index = parseInt((self.list.angle / self.itemAngle).toFixed(0));
			self.list.style.webkitTransition = "100ms ease-out";
			self.setAngle(self.itemAngle * index);
		}
		self.triggerChange();
	};

	Picker.prototype.triggerChange = function(force) {
		var self = this;
		setTimeout(function() {
			var index = self.getSelectedIndex();
			var item = self.items[index];
			if ($.trigger && (index != self.lastIndex || force)) {
				$.trigger(self.holder, 'change', {
					"index": index,
					"item": item
				});
				//console.log('change:' + index);
			}
			self.lastIndex = index;
		}, 0);
	};

	Picker.prototype.correctAngle = function(angle) {
		var self = this;
		if (angle < self.beginAngle) {
			return self.beginAngle;
		} else if (angle > self.endAngle) {
			return self.endAngle;
		} else {
			return angle;
		}
	};

	Picker.prototype.setItems = function(items) {
		var self = this;
		self.items = items || [];
		var buffer = [];
		self.items.forEach(function(item) {
			if (item !== null && item !== undefined) {
				buffer.push('<li>' + (item.text || item) + '</li>');
			}
		});
		self.list.innerHTML = buffer.join('');
		self.findElementItems();
		self.calcElementItemPostion();
		self.setAngle(self.correctAngle(self.list.angle));
		self.triggerChange(true);
	};

	Picker.prototype.getItems = function() {
		var self = this;
		return self.items;
	};

	Picker.prototype.getSelectedIndex = function() {
		var self = this;
		return parseInt((self.list.angle / self.itemAngle).toFixed(0));
	};

	Picker.prototype.setSelectedIndex = function(index, duration) {
		var self = this;
		self.list.style.webkitTransition = '';
		var angle = self.correctAngle(self.itemAngle * index);
		if (duration && duration > 0) {
			var distAngle = angle - self.list.angle;
			self.scrollDistAngle(Date.now(), self.list.angle, distAngle, duration);
		} else {
			self.setAngle(angle);
		}
		self.triggerChange();
	};

	Picker.prototype.getSelectedItem = function() {
		var self = this;
		return self.items[self.getSelectedIndex()];
	};

	Picker.prototype.getSelectedValue = function() {
		var self = this;
		return (self.items[self.getSelectedIndex()] || {}).value;
	};

	Picker.prototype.getSelectedText = function() {
		var self = this;
		return (self.items[self.getSelectedIndex()] || {}).text;
	};

	Picker.prototype.setSelectedValue = function(value, duration) {
		var self = this;
		for (var index in self.items) {
			var item = self.items[index];
			if (item.value == value) {
				self.setSelectedIndex(index, duration);
				return;
			}
		}
	};

	if ($.fn) {
		$.fn.picker = function(options) {
			//遍历选择的元素
			this.each(function(i, element) {
				if (element.picker) return;
				if (options) {
					element.picker = new Picker(element, options);
				} else {
					var optionsText = element.getAttribute('data-picker-options');
					var _options = optionsText ? JSON.parse(optionsText) : {};
					element.picker = new Picker(element, _options);
				}
			});
			return this[0] ? this[0].picker : null;
		};

		//自动初始化
		$.ready(function() {
			$('.mui-picker').picker();
		});
	}

})(this.mui || this, window, document, undefined);
//end
/**
 * 弹出选择列表插件
 * 此组件依赖 listpcker ，请在页面中先引入 mui.picker.css + mui.picker.js
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($, document) {

	//创建 DOM
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

	var panelBuffer = '<div class="mui-poppicker">\
		<div class="mui-poppicker-header">\
			<button class="mui-btn mui-poppicker-btn-cancel">取消</button>\
			<button class="mui-btn mui-btn-blue mui-poppicker-btn-ok">确定</button>\
			<div class="mui-poppicker-clear"></div>\
		</div>\
		<div class="mui-poppicker-body">\
		</div>\
	</div>';

	var pickerBuffer = '<div class="mui-picker">\
		<div class="mui-picker-inner">\
			<div class="mui-pciker-rule mui-pciker-rule-ft"></div>\
			<ul class="mui-pciker-list">\
			</ul>\
			<div class="mui-pciker-rule mui-pciker-rule-bg"></div>\
		</div>\
	</div>';

	//定义弹出选择器类
	var PopPicker = $.PopPicker = $.Class.extend({
		//构造函数
		init: function(options) {
			var self = this;
			self.options = options || {};
			self.options.buttons = self.options.buttons || ['取消', '确定'];
			self.panel = $.dom(panelBuffer)[0];
			document.body.appendChild(self.panel);
			self.ok = self.panel.querySelector('.mui-poppicker-btn-ok');
			self.cancel = self.panel.querySelector('.mui-poppicker-btn-cancel');
			self.body = self.panel.querySelector('.mui-poppicker-body');
			self.mask = $.createMask();
			self.cancel.innerText = self.options.buttons[0];
			self.ok.innerText = self.options.buttons[1];
			self.cancel.addEventListener('tap', function(event) {
				self.hide();
			}, false);
			self.ok.addEventListener('tap', function(event) {
				if (self.callback) {
					var rs = self.callback(self.getSelectedItems());
					if (rs !== false) {
						self.hide();
					}
				}
			}, false);
			self.mask[0].addEventListener('tap', function() {
				self.hide();
			}, false);
			self._createPicker();
			//防止滚动穿透
			self.panel.addEventListener('touchstart', function(event) {
				event.preventDefault();
			}, false);
			self.panel.addEventListener('touchmove', function(event) {
				event.preventDefault();
			}, false);
		},
		_createPicker: function() {
			var self = this;
			var layer = self.options.layer || 1;
			var width = (100 / layer) + '%';
			self.pickers = [];
			for (var i = 1; i <= layer; i++) {
				var pickerElement = $.dom(pickerBuffer)[0];
				pickerElement.style.width = width;
				self.body.appendChild(pickerElement);
				var picker = $(pickerElement).picker();
				self.pickers.push(picker);
				pickerElement.addEventListener('change', function(event) {
					var nextPickerElement = this.nextSibling;
					if (nextPickerElement && nextPickerElement.picker) {
						var eventData = event.detail || {};
						var preItem = eventData.item || {};
						nextPickerElement.picker.setItems(preItem.children);
					}
				}, false);
			}
		},
		//填充数据
		setData: function(data) {
			var self = this;
			data = data || [];
			self.pickers[0].setItems(data);
		},
		//获取选中的项（数组）
		getSelectedItems: function() {
			var self = this;
			var items = [];
			for (var i in self.pickers) {
				var picker = self.pickers[i];
				items.push(picker.getSelectedItem() || {});
			}
			return items;
		},
		//显示
		show: function(callback) {
			var self = this;
			self.callback = callback;
			self.mask.show();
			document.body.classList.add($.className('poppicker-active-for-page'));
			self.panel.classList.add($.className('active'));
			//处理物理返回键
			self.__back = $.back;
			$.back = function() {
				self.hide();
			};
		},
		//隐藏
		hide: function() {
			var self = this;
			if (self.disposed) return;
			self.panel.classList.remove($.className('active'));
			self.mask.close();
			document.body.classList.remove($.className('poppicker-active-for-page'));
			//处理物理返回键
			$.back=self.__back;
		},
		dispose: function() {
			var self = this;
			self.hide();
			setTimeout(function() {
				self.panel.parentNode.removeChild(self.panel);
				for (var name in self) {
					self[name] = null;
					delete self[name];
				};
				self.disposed = true;
			}, 300);
		}
	});

})(mui, document);
/**
 * 日期时间插件
 * varstion 1.0.5
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($, document) {
	
	//创建 DOM
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
	
	var domBuffer = '<div class="mui-dtpicker" data-type="datetime">\
		<div class="mui-dtpicker-header">\
			<button data-id="btn-cancel" class="mui-btn">取消</button>\
			<button data-id="btn-ok" class="mui-btn mui-btn-blue">确定</button>\
		</div>\
		<div class="mui-dtpicker-title"><h5 data-id="title-y">年</h5><h5 data-id="title-m">月</h5><h5 data-id="title-d">日</h5><h5 data-id="title-h">时</h5><h5 data-id="title-i">分</h5></div>\
		<div class="mui-dtpicker-body">\
			<div data-id="picker-y" class="mui-picker">\
				<div class="mui-picker-inner">\
					<div class="mui-pciker-rule mui-pciker-rule-ft"></div>\
					<ul class="mui-pciker-list">\
					</ul>\
					<div class="mui-pciker-rule mui-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-m" class="mui-picker">\
				<div class="mui-picker-inner">\
					<div class="mui-pciker-rule mui-pciker-rule-ft"></div>\
					<ul class="mui-pciker-list">\
					</ul>\
					<div class="mui-pciker-rule mui-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-d" class="mui-picker">\
				<div class="mui-picker-inner">\
					<div class="mui-pciker-rule mui-pciker-rule-ft"></div>\
					<ul class="mui-pciker-list">\
					</ul>\
					<div class="mui-pciker-rule mui-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-h" class="mui-picker">\
				<div class="mui-picker-inner">\
					<div class="mui-pciker-rule mui-pciker-rule-ft"></div>\
					<ul class="mui-pciker-list">\
					</ul>\
					<div class="mui-pciker-rule mui-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-i" class="mui-picker">\
				<div class="mui-picker-inner">\
					<div class="mui-pciker-rule mui-pciker-rule-ft"></div>\
					<ul class="mui-pciker-list">\
					</ul>\
					<div class="mui-pciker-rule mui-pciker-rule-bg"></div>\
				</div>\
			</div>\
		</div>\
	</div>';

	//plugin
	var DtPicker = $.DtPicker = $.Class.extend({
		init: function(options) {
			var self = this;
			var _picker = $.dom(domBuffer)[0];
			document.body.appendChild(_picker);
			$('[data-id*="picker"]', _picker).picker();
			var ui = self.ui = {
				picker: _picker,
				mask: $.createMask(),
				ok: $('[data-id="btn-ok"]', _picker)[0],
				cancel: $('[data-id="btn-cancel"]', _picker)[0],
				y: $('[data-id="picker-y"]', _picker)[0],
				m: $('[data-id="picker-m"]', _picker)[0],
				d: $('[data-id="picker-d"]', _picker)[0],
				h: $('[data-id="picker-h"]', _picker)[0],
				i: $('[data-id="picker-i"]', _picker)[0],
				labels: $('[data-id*="title-"]', _picker),
			};
			ui.cancel.addEventListener('tap', function() {
				self.hide();
			}, false);
			ui.ok.addEventListener('tap', function() {
				var rs = self.callback(self.getSelected());
				if (rs !== false) {
					self.hide();
				}
			}, false);
			ui.y.addEventListener('change', function() {
				self._createDay();
			}, false);
			ui.m.addEventListener('change', function() {
				self._createDay();
			}, false);
			ui.mask[0].addEventListener('tap', function() {
				self.hide();
			}, false);
			self._create(options);
			//防止滚动穿透
			self.ui.picker.addEventListener('touchstart',function(event){
				event.preventDefault();  
			},false);
			self.ui.picker.addEventListener('touchmove',function(event){
				event.preventDefault();  
			},false);
		},
		getSelected: function() {
			var self = this;
			var ui = self.ui;
			var type = self.options.type;
			var selected = {
				type: type,
				y: ui.y.picker.getSelectedItem(),
				m: ui.m.picker.getSelectedItem(),
				d: ui.d.picker.getSelectedItem(),
				h: ui.h.picker.getSelectedItem(),
				i: ui.i.picker.getSelectedItem(),
				toString: function() {
					return this.value;
				}
			};
			switch (type) {
				case 'datetime':
					selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value + ' ' + selected.h.value + ':' + selected.i.value;
					selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text + ' ' + selected.h.text + ':' + selected.i.text;
					break;
				case 'date':
					selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value;
					selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text;
					break;
				case 'time':
					selected.value = selected.h.value + ':' + selected.i.value;
					selected.text = selected.h.text + ':' + selected.i.text;
					break;
				case 'month':
					selected.value = selected.y.value + '-' + selected.m.value;
					selected.text = selected.y.text + '-' + selected.m.text;
					break;
				case 'hour':
					selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value + ' ' + selected.h.value;
					selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text + ' ' + selected.h.text;
					break;
			}
			return selected;
		},
		setSelectedValue: function(value) {
			var self = this;
			var ui = self.ui;
			var parsedValue = self._parseValue(value);
			ui.y.picker.setSelectedValue(parsedValue.y, 0);
			ui.m.picker.setSelectedValue(parsedValue.m, 0);
			ui.d.picker.setSelectedValue(parsedValue.d, 0);
			ui.h.picker.setSelectedValue(parsedValue.h, 0);
			ui.i.picker.setSelectedValue(parsedValue.i, 0);
		},
		isLeapYear: function(year) {
			return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
		},
		_inArray: function(array, item) {
			for (var index in array) {
				var _item = array[index];
				if (_item === item) return true;
			}
			return false;
		},
		getDayNum: function(year, month) {
			var self = this;
			if (self._inArray([1, 3, 5, 7, 8, 10, 12], month)) {
				return 31;
			} else if (self._inArray([4, 6, 9, 11], month)) {
				return 30;
			} else if (self.isLeapYear(year)) {
				return 29;
			} else {
				return 28;
			}
		},
		_fill: function(num) {
			num = num.toString();
			if (num.length < 2) {
				num = 0 + num;
			}
			return num;
		},
		_createYear: function(current) {
			var self = this;
			var options = self.options;
			var ui = self.ui;
			//生成年列表
			var yArray = [];
			if (options.customData.y) {
				yArray = options.customData.y;
			} else {
				var yBegin = options.beginYear;
				var yEnd = options.endYear;
				for (var y = yBegin; y <= yEnd; y++) {
					yArray.push({
						text: y + '',
						value: y
					});
				}
			}
			ui.y.picker.setItems(yArray);
			//ui.y.picker.setSelectedValue(current);
		},
		_createMonth: function(current) {
			var self = this;
			var options = self.options;
			var ui = self.ui;
			//生成月列表
			var mArray = [];
			if (options.customData.m) {
				mArray = options.customData.m;
			} else {
				for (var m = 1; m <= 12; m++) {
					var val = self._fill(m);
					mArray.push({
						text: val,
						value: val
					});
				}
			}
			ui.m.picker.setItems(mArray);
			//ui.m.picker.setSelectedValue(current);
		},
		_createDay: function(current) {
			var self = this;
			var options = self.options;
			var ui = self.ui;
			//生成日列表
			var dArray = [];
			if (options.customData.d) {
				dArray = options.customData.d;
			} else {
				var maxDay = self.getDayNum(parseInt(ui.y.picker.getSelectedValue()), parseInt(ui.m.picker.getSelectedValue()));
				for (var d = 1; d <= maxDay; d++) {
					var val = self._fill(d);
					dArray.push({
						text: val,
						value: val
					});
				}
			}
			ui.d.picker.setItems(dArray);
			current = current || ui.d.picker.getSelectedValue();
			//ui.d.picker.setSelectedValue(current);
		},
		_createHours: function(current) {
			var self = this;
			var options = self.options;
			var ui = self.ui;
			//生成时列表
			var hArray = [];
			if (options.customData.h) {
				hArray = options.customData.h;
			} else {
				for (var h = 0; h <= 23; h++) {
					var val = self._fill(h);
					hArray.push({
						text: val,
						value: val
					});
				}
			}
			ui.h.picker.setItems(hArray);
			//ui.h.picker.setSelectedValue(current);
		},
		_createMinutes: function(current) {
			var self = this;
			var options = self.options;
			var ui = self.ui;
			//生成分列表
			var iArray = [];
			if (options.customData.i) {
				iArray = options.customData.i;
			} else {
				for (var i = 0; i <= 59; i++) {
					var val = self._fill(i);
					iArray.push({
						text: val,
						value: val
					});
				}
			}
			ui.i.picker.setItems(iArray);
			//ui.i.picker.setSelectedValue(current);
		},
		_setLabels: function() {
			var self = this;
			var options = self.options;
			var ui = self.ui;
			ui.labels.each(function(i, label) {
				label.innerText = options.labels[i];
			});
		},
		_setButtons: function() {
			var self = this;
			var options = self.options;
			var ui = self.ui;
			ui.cancel.innerText = options.buttons[0];
			ui.ok.innerText = options.buttons[1];
		},
		_parseValue: function(value) {
			var self = this;
			var rs = {};
			if (value) {
				var parts = value.replace(":", "-").replace(" ", "-").split("-");
				rs.y = parts[0];
				rs.m = parts[1];
				rs.d = parts[2];
				rs.h = parts[3];
				rs.i = parts[4];
			} else {
				var now = new Date();
				rs.y = now.getFullYear();
				rs.m = now.getMonth() + 1;
				rs.d = now.getDate();
				rs.h = now.getHours();
				rs.i = now.getMinutes();
			}
			return rs;
		},
		_create: function(options) {
			var self = this;
			options = options || {};
			options.labels = options.labels || ['年', '月', '日', '时', '分'];
			options.buttons = options.buttons || ['取消', '确定'];
			options.type = options.type || 'datetime';
			options.customData = options.customData || {};
			self.options = options;
			var now = new Date();
			options.beginYear = options.beginYear || (now.getFullYear() - 5);
			options.endYear = options.endYear || (now.getFullYear() + 5);
			var ui = self.ui;
			//设定label
			self._setLabels();
			self._setButtons();
			//设定类型
			ui.picker.setAttribute('data-type', options.type);
			//生成
			self._createYear();
			self._createMonth();
			self._createDay();
			self._createHours();
			self._createMinutes();
			//设定默认值
			self.setSelectedValue(options.value);
		},
		//显示
		show: function(callback) {
			var self = this;
			var ui = self.ui;
			self.callback = callback || $.noop;
			ui.mask.show();
			document.body.classList.add($.className('dtpicker-active-for-page'));
			ui.picker.classList.add($.className('active'));
			//处理物理返回键
			self.__back = $.back;
			$.back = function() {
				self.hide();
			};
		},
		hide: function() {
			var self = this;
			if (self.disposed) return;
			var ui = self.ui;
			ui.picker.classList.remove($.className('active'));
			ui.mask.close();
			document.body.classList.remove($.className('dtpicker-active-for-page'));
			//处理物理返回键
			$.back=self.__back;
		},
		dispose: function() {
			var self = this;
			self.hide();
			setTimeout(function() {
				self.ui.picker.parentNode.removeChild(self.ui.picker);
				for (var name in self) {
					self[name] = null;
					delete self[name];
				};
				self.disposed = true;
			}, 300);
		}
	});

})(mui, document);