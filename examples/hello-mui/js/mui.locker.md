### 集成方式
1. 首先在页面中引入 mui ，包括相关 style 和 script

### 使用方式
1. 通过实例化 Locker, 示例: new Locker(element, options);
2. 通过扩展方法, 示例:  mui('选择器').locker(options);
3. 通过添加 className, 示例: <div class='mui-locker' data-locker-options='{}'></div> (注: data-locker-options 值为 options 的 json 字符串);

### options 结构说明
```javascript
{
	lineColor: "#999", //连接线颜色，省略时此参数将使用默认值
	ringColor: "#888", //圆圈边框颜色，省略时此参数将使用默认值
	fillColor: "#f3f3f3", //圆圈填充颜色，省略时此参数将使用默认值
	pointColor: "#777", //圆圈中心点颜色，省略时此参数将使用默认值
	width:300 , //宽度，通常省略，省略时可以通过 element 的样式控制
	height:300, //高度，通常少略，省略时可以通过 element 的样式控制
}
```

### done 事件
1. 可以通过 element.addEventListener('done',function(event){},false); 处理 "绘的制完成" 事件
2. event.detail.points 为绘制结果，points 是一个数组，包括了当时绘制手势数据
3. event.detail.sender 为当前 "手势解锁" 实例，包括 clear 方法，可以清除当前会制的内容


### 示例

HMTL:
```html
<div id='holder' class="mui-locker" style="width:300px;height:300px;" data-locker-options='{"ringColor":"rgba(221,221,221,1)","fillColor":"#ffffff","pointColor":"rgba(0,136,204,1)","lineColor":"rgba(0,136,204,1)"}'></div>
<div id='alert'></div>
```

JavaScript:
```javascript
(function($,doc){
	$.init();
	
	var holder = doc.querySelector('#holder'),
		alert = doc.querySelector('#alert'),
		record = [];
	 //处理事件
	holder.addEventListener('done', function(event) {
		var rs = event.detail;
		if (rs.points.length < 4) {
			alert.innerText = '设定的手势太简单了';
			record = [];
			rs.sender.clear();
			return;
		}
		record.push(rs.points.join(''));
		if (record.length >= 2) {
			if (record[0] == record[1]) {
				alert.innerText = '手势设定完成';
			} else {
				alert.innerText = '两次手势设定不一致';
			}
			rs.sender.clear();
			record = [];
		} else {
			alert.innerText = '请确认手势设定';
			rs.sender.clear();
		}
	});
}(mui,document));
```


