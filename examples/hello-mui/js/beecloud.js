var beecloud = {};
var channels = null;
var w = null;

beecloud.payReq = function(data, cbsuccess, cberror) {
	doPay(data, cbsuccess, cberror);
};

beecloud.genBillNo = function() {
	var d = new Date();
	var vYear = d.getFullYear();
	var vMon = d.getMonth() + 1;
	var vDay = d.getDate();
	var h = d.getHours();
	var m = d.getMinutes();
	var se = d.getSeconds();
	var ms = d.getMilliseconds();
	billno = "" + vYear + (vMon < 10 ? "0" + vMon : vMon) + (vDay < 10 ? "0" + vDay : vDay) + (h < 10 ? "0" + h : h) + (m < 10 ? "0" + m : m) + (se < 10 ? "0" + se : se) + ms;
	return billno;
};

mui.plusReady(function () {
	plus.payment.getChannels(function(s) {
		channels = s;
	}, function(e) {
		alert("获取支付渠道信权限失败:" + e.message);
	});
});

function checkServices(pc) {
	if (!pc.serviceReady) {
		var txt = null;
		switch (pc.id) {
			case "alipay":
				txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
				break;
			default:
				txt = "系统未安装“" + pc.description + "”服务，无法完成支付，是否立即安装？";
				break;
		}
		plus.nativeUI.confirm(txt, function(e) {
			if (e.index == 0) {
				pc.installService();
			}
		}, pc.description);
		return false;
	}
	return true;
}

function getRandomHost() {
	var hosts = ['https://apibj.beecloud.cn',
		'https://apihz.beecloud.cn',
		'https://apisz.beecloud.cn',
		'https://apiqd.beecloud.cn'
	];
	return "" + hosts[parseInt(3 * Math.random())] + "/2/rest/app/bill";
}

function getPayChannel(bc_channel) {
	var dc_channel_id = '';
	switch (bc_channel) {
		case 'ALI_APP':
			dc_channel_id = 'alipay';
			break;
		case 'WX_APP':
			dc_channel_id = 'wxpay';
			break;
		default:
			break;
	}

	for (var i in channels) {
		if (channels[i].id == dc_channel_id && checkServices(channels[i])) {
			return channels[i];
		}
	}
	return null;
}

function doPay(payData, cbsuccess, cberror) {
	if (w) return;
	console.log('doPay: ' + JSON.stringify(payData));

	w = plus.nativeUI.showWaiting();
	mui.ajax(getRandomHost(), {
		data: JSON.stringify(payData),
		type: 'post',
		dataType: 'json',
		contentType: "application/json",
		success: function(data) {
			console.log(JSON.stringify(data));
			w.close();
			w = null;
			var paySrc = '';

			if (data.result_code == 0) {
				var payChannel = getPayChannel(payData.channel);
				if (payChannel) {
					if (payChannel.id === 'alipay') {
						paySrc = data.order_string;
					} else if (payChannel.id === 'wxpay') {
						var statement = {};
						statement.appid = data.app_id;
						statement.noncestr = data.nonce_str;
						statement.package = data.package;
						statement.partnerid = data.partner_id;
						statement.prepayid = data.prepay_id;
						statement.timestamp = parseInt(data.timestamp);
						statement.sign = data.pay_sign;
						paySrc = JSON.stringify(statement);
					}
					plus.payment.request(payChannel, paySrc, cbsuccess, cberror);
				}
			} else {
				var bcError = {};
				bcError.code = data.result_code;
				bcError.message = data.result_msg + ":" + data.err_detail;
				cberror(bcError);
			}
		},
		error: function(xhr, errorType, error) {
			w.close();
			w = null;
			cberror(error);
		}
	});
}