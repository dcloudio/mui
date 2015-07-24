/**
 * MUI JSONP
 * varstion 1.0.0
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($, win, doc) {

	var callbackIndex = 0;

	//生成回调函数名
	var createCallbackName = function() {
		return 'mui_jsonp_callback_' + (callbackIndex++);
	};

	var container = doc.body;

	//导入 script 元素
	var importScript = function(url) {
		var element = doc.createElement('script');
		element.src = url;
		element.async = true;
		element.defer = true;
		container.appendChild(element);
		return element;
	};

	//转换 URL，JSONP 只支持 get 方式的 queryString ,需将 data 拼入 url
	var convertUrl = function(url, data, jsonpParam, callbacnName) {
		if (jsonpParam) {
			url = url.replace(jsonpParam + '=?', jsonpParam + '=' + callbacnName);
		} else {
			data['callback'] = callbacnName;
		}
		var buffer = [];
		for (var key in data) {
			buffer.push(key + '=' + encodeURIComponent(data[key]));
		}
		return url + (url.indexOf('?') > -1 ? '&' : '?') + buffer.join('&');
	};

	//获取 QueryString
	var getQueryString = function(url) {
		url = url || location.search;
		var splitIndex = url.indexOf('?');
		var queryString = url.substr(splitIndex + 1);
		var paramArray = queryString.split('&');
		var result = {};
		for (var i in paramArray) {
			var params = paramArray[i].split('=');
			result[params[0]] = params[1];
		}
		return result;
	}

	//获取将传递给服务器的回调函数的请求参数名
	var getJSONPParam = function(url) {
		var query = getQueryString(url);
		for (var name in query) {
			if (query[name] === '?') {
				return name;
			}
		}
		return null;
	};

	/**
	 * @description JSONP 方法
	 * @param {String} url  将请求的地址
	 * @param {Object} data 请求参数数据
	 * @param {Function} callback 请求完成时回调函数
	 * @return {mui} mui 对象自身
	 **/
	$.getJSONP = function(url, data, callback) {
		if (!url) {
			throw "mui.getJSONP URL error!";
		}
		var jsonpParam = getJSONPParam(url);
		var callbackName = createCallbackName();
		data = data || {};
		callback = callback || $.noop;
		url = convertUrl(url, data, jsonpParam, callbackName);
		var scriptElement = null;
		win[callbackName] = function(result) {
			callback(result);
			if (scriptElement) {
				container.removeChild(scriptElement);
			}
			win[callbackName] = null;
			delete win[callbackName];
		};
		scriptElement = importScript(url);
		return $;
	};

	//为原 mui.getJSON 方法添加同 jQuery.getJSON 一样的 JSONP 支持
	$.__getJSON = $.getJSON;
	$.getJSON = function(url, data, callback) {
		var isJSONP = getJSONPParam(url) != null;
		if (isJSONP) {
			return $.getJSONP(url, data, callback);
		} else {
			return $.__getJSON(url, data, callback);
		}
	};

}(mui, window, document));