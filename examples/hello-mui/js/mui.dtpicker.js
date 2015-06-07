/**
 * 日期时间插件
 * varstion 1.0.5
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($) {
	var domBuffer = '<div class="mui-dtpicker" data-type="datetime">\
		<div class="mui-dtpicker-header">\
			<button data-id="btn-cancel" class="mui-btn">取消</button>\
			<button data-id="btn-ok" class="mui-btn mui-btn-blue">确定</button>\
		</div>\
		<div class="mui-dtpicker-title"><h5 data-id="title-y">年</h5><h5 data-id="title-m">月</h5><h5 data-id="title-d">日</h5><h5 data-id="title-h">时</h5><h5 data-id="title-i">分</h5></div>\
		<div class="mui-dtpicker-body">\
			<div data-id="picker-y" class="mui-listpicker">\
				<div class="mui-listpicker-inner">\
					<ul>\
					</ul>\
				</div>\
			</div>\
			<div data-id="picker-m" class="mui-listpicker">\
				<div class="mui-listpicker-inner">\
					<ul>\
					</ul>\
				</div>\
			</div>\
			<div data-id="picker-d" class="mui-listpicker">\
				<div class="mui-listpicker-inner">\
					<ul>\
					</ul>\
				</div>\
			</div>\
			<div data-id="picker-h" class="mui-listpicker">\
				<div class="mui-listpicker-inner">\
					<ul>\
					</ul>\
				</div>\
			</div>\
			<div data-id="picker-i" class="mui-listpicker">\
				<div class="mui-listpicker-inner">\
					<ul>\
					</ul>\
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
			$('[data-id*="picker"]', _picker).listpicker();
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
				self.hide();
				self.callback(self.getSelected());
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
		},
		getSelected: function() {
			var self = this;
			var ui = self.ui;
			var type = self.options.type;
			var selected = {
				type: type,
				y: ui.y.getSelectedItem(),
				m: ui.m.getSelectedItem(),
				d: ui.d.getSelectedItem(),
				h: ui.h.getSelectedItem(),
				i: ui.i.getSelectedItem(),
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
			ui.y.setItems(yArray);
			//ui.y.setSelectedValue(current);
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
			ui.m.setItems(mArray);
			//ui.m.setSelectedValue(current);
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
				var maxDay = self.getDayNum(parseInt(ui.y.getSelectedValue()), parseInt(ui.m.getSelectedValue()));
				for (var d = 1; d <= maxDay; d++) {
					var val = self._fill(d);
					dArray.push({
						text: val,
						value: val
					});
				}
			}
			ui.d.setItems(dArray);
			current = current || ui.d.getSelectedValue();
			//ui.d.setSelectedValue(current);
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
			ui.h.setItems(hArray);
			//ui.h.setSelectedValue(current);
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
			ui.i.setItems(iArray);
			//ui.i.setSelectedValue(current);
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
		_getInitValue: function() {
			var self = this;
			var options = self.options;
			var rs = {};
			if (options.value) {
				var parts = options.value.replace(":", "-").replace(" ", "-").split("-");
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
			var initValue = self._getInitValue();
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
			setTimeout(function() {
				//设定默认值
				ui.y.setSelectedValue(initValue.y);
				ui.m.setSelectedValue(initValue.m);
				ui.d.setSelectedValue(initValue.d);
				ui.h.setSelectedValue(initValue.h);
				ui.i.setSelectedValue(initValue.i);
			}, 160);
		},
		//显示
		show: function(callback) {
			var self = this;
			var ui = self.ui;
			self.callback = callback || $.noop;
			ui.mask.show();
			ui.picker.style.webkitTransform = 'translateY(0px)';
		},
		hide: function() {
			var self = this;
			var ui = self.ui;
			ui.picker.style.webkitTransform = 'translateY(300px)';
			ui.mask.close()
		}
	});

})(mui);