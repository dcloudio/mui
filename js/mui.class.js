(function($) {
	"use strict";

	var fnTest = /xyz/.test(function() {
		xyz;
	}) ? /\b_super\b/ : /.*/;

	function BaseClass() {}

	BaseClass.extend = function(className, props) {
		if (props === undefined) {
			props = className;
			className = "SubClass";
		}

		var _super = this.prototype;

		var proto = Object.create(_super);

		for (var name in props) {
			proto[name] = typeof props[name] === "function" &&
				typeof _super[name] == "function" && fnTest.test(props[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;
						this._super = _super[name];

						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, props[name]) :
				props[name];
		}

		var functionStr = "return function " + className + "(){";
		if (typeof proto.initializing === "function")
			functionStr += "this.initializing.apply(this, arguments);";

		var newClass = new Function(functionStr + "}")();

		newClass.prototype = proto;
		proto.constructor = newClass;
		newClass.extend = BaseClass.extend;
		return newClass;
	};

	$.Class = BaseClass;
})(mui);
