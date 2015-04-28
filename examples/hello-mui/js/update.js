var server="http://www.dcloud.io/check/update";//获取升级描述文件服务器地址
	
function update(){
	mui.getJSON(server,{"appid":plus.runtime.appid,"version":plus.runtime.version,"imei":plus.device.imei},function (data) {
		if(data.status){
			plus.ui.confirm( data.note, function(i){
				if ( 0==i ) {
					plus.runtime.openURL( data.url );
				}
			}, data.title, ["立即更新","取　　消"] );
		}
	});
}

mui.plusReady(update);