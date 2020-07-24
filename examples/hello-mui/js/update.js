/**
 * 5+ App客户端升级参考：http://ask.dcloud.net.cn/article/431
 * 服务端升级逻辑参考：https://ext.dcloud.net.cn/plugin?id=2226
 * 
 * 检查升级返回值为JSON格式，如下：
 * 
 * 需升级
 {
	"isUpdate":true,
	"version": "2.6.0",
	"title": "Hello MUI版本更新",
	"note": "修复“选项卡+下拉刷新”示例中，某个选项卡滚动到底时，会触发所有选项卡上拉加载事件的bug；\n修复Android4.4.4版本部分手机上，软键盘弹出时影响图片轮播组件，导致自动轮播停止的bug；",
	"url": "http://www.dcloud.io/hellomui/HelloMUI.apk"
}
*
* 无需升级
{
  "isUpdate":false
}
*
*/

//服务端检查更新地址，这里是 uniCloud 实现示例，开发者可替换为自己的地址
var server = "https://7a3e3fa9-7820-41d0-be80-11927ac2026c.bspapp.com/http/update"; 

function update() {
	mui.getJSON(server, {
		"appid": plus.runtime.appid,
		"version": plus.runtime.version,
		"imei": plus.device.imei
	}, function(data) {
		if (data.isUpdate) {
			plus.nativeUI.confirm(data.note, function(event) {
				if (0 == event.index) {
					plus.runtime.openURL(data.url);
				}
			}, data.title, ["立即更新", "取　　消"]);
		}
	});
}

// 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
if(plus.runtime.appid !== 'HBuilder' && mui.os.plus && !mui.os.stream ){
  mui.plusReady(update);
} 