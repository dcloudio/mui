---
title: WebIM 开发指南
sidebar: webimsidebar
secondnavwebim: true
---

# 快速入门  

## 初始化

### 创建连接{#conn_new}
<pre class="hll"><code class="language-javascript">
var conn = new Easemob.im.Connection();
</code></pre>

### 初始化连接{#conn_init}
<pre class="hll"><code class="language-javascript">
conn.init({
    https : true,//非必填，url值未设置时有效，优先采用url配置的参数。默认采用http连接，地址为‘http://im-api.easemob.com/http-bind/’，启用https时传递此值，地址为：‘https://im-api.easemob.com/http-bind/’
    url ： 'http://im-api.easemob.com/http-bind/',//非必填，默认聊天服务器地址，
    domain : 'aa.com',//非必填，默认：‘easemob.com’
    wait ： '60',//非必填，连接超时，默认：60，单位seconds
    onOpened : function() {
        curUserId = conn.context.userId;
        //查询好友列表
        conn.getRoster(....);
    },
    onClosed : function() {
        //处理登出事件
    },
    onTextMessage : function(message) {
        /**处理文本消息，消息格式为：
            {	type :'chat',//群聊为“groupchat”
                from : from,
                to : too,
                data : { "type":"txt",
                    "msg":"hello from test2"
                }
            }
        */
        handleTextMessage(message);
    },
    onEmotionMessage : function(message) {
        /*处理表情消息,消息格式为：
            {	type :'chat',//群聊为“groupchat”
                from : from,
                to : too,
                data : [{ "type":"txt",
                    "msg":"hello from test2"
                },
                { "type":"emotion",
                  "msg":"data:image/png;base64, ……"//图片的base64编码
                }]
            }
        */
        handleEmotion(message);
    },
    onPictureMessage : function(message) {
        /**处理图片消息，消息格式为：
            {	type :'chat',//群聊为“groupchat”
                from : "test1",
                to : "test2",
                url : "http://s1.easemob.com/weiquan2/a2/chatfiles/0c0f5f3a-e66b-11e3-8863-f1c202c2b3ae",
                secret : "NSgGYPCxEeOou00jZasg9e-GqKUZGdph96EFxJ4WxW-qkxV4",
                filename : "logo.png",
                thumb : "http://s1.easemob.com/weiquan2/a2/chatfiles/0c0f5f3a-e66b-11e3-8863-f1c202c2b3ae",
                thumb_secret : "0595b06a-ed8b-11e3-9b85-93fade9c198c",
                file_length : 42394,
                width : 280,
                height : 160,
                filetype : "image/png",
                accessToken :"YWMtjPPoovCqEeOQs7myPqqaOwAAAUaqNH0a8rRj4PwJLQju6-S47ZO6wYs3Lwo"
            }
        */

        handlePictureMessage(message);
    },
    onAudioMessage : function(message) {
        /**处理音频消息，消息格式为：
           {	type :'chat',//群聊为“groupchat”
                from : "test1",
                to : "test2",
                url : "http://s1.easemob.com/weiquan2/a2/chatfiles/0c0f5f3a-e66b-11e3-8863-f1c202c2b3ae",
                secret :"NSgGYPCxEeOou00jZasg9e-GqKUZGdph96EFxJ4WxW-qkxV4",
                filename : "风雨无阻.mp3",
                length :45223,
                file_length : 304,
                filetype : "mp3",
                accessToken :"YWMtjPPoovCqEeOQs7myPqqaOwAAAUaqNH0a8rRj4PwJLQju6-S47ZO6wYs3Lwo"
            }
        */
        handleAudioMessage(message);
    },
    //收到联系人订阅请求的回调方法
    onPresence : function (message){
        /**
            {
                from: "l2",
                fromJid: "easemob-demo#chatdemoui_l2@easemob.com",
                status: "下午11:44:47",
                to: "test1",
                toJid: "easemob-demo#chatdemoui_test1@easemob.com/13856640471403797405809685",
                type: "subscribed"
            }
        */
        handlePresence(message);
    },
    //收到联系人信息的回调方法
    onRoster : function (message){
        /**
            [{
                groups: [{0: "default",
                        length: 1}],
                jid: "easemob-demo#chatdemoui_l2@easemob.com",
                name: "l2",
                subscription: "to"
            }]
        */
        handleRoster(message);
    },
    onError : function(e) {
        //异常处理
        alert(e.msg);
    }
});
</code></pre>

### 打开连接{#conn_open}

支持username/password和username/token登录两种方式，sdk中会根据传入的参数进行自动选择是否登录usergrid，获取登录成功的token后再进行登录聊天，如果使用token的打开连接将跳过登录usergird，直接登录IM服务器。

<pre class="hll"><code class="language-javascript">
//用户名
var user = $("#username").val();
//密码
var pass = $("#password").val();
if (user == '' || pass == '') {
    alert("请输入用户名和密码");
    return;
}
conn.open({
    user : user,
    pwd : pass,
    appKey : 'easemob-demo#chatdemoui'//开发者APPKey
    //accessToken : 'YWMt8bfZfFk5EeSiAzsQ0OXu4QAAAUpoZFOMJ66ic5m2LOZRhYUsRKZWINA06HI'
});
</code></pre>

## 单聊{#single_chat}

### 查询好友列表{#getRoster}

查询好友列表时，要注意susciption（both，to,from）为不同值得处理,此处默认both和to的为好友，开发者自定义处理，保持跟APP端处理一致即可。

<pre class="hll"><code class="language-javascript">
conn.getRoster({
    success : function(roster) {
        //获取好友列表，并进行好友列表渲染，roster格式为：
        /** [
                {
                    jid:"asemoemo#chatdemoui_test1@easemob.com",
                    name:"test1",
                    subscription: "both"
                },
                {
                    jid:"asemoemo#chatdemoui_test2@easemob.com",
                    name:"test2",
                    subscription: "from"
                }
            ]
        */
        for(var i in roster){
            var ros = roster[i];    
            //ros.subscriptio值为both/to为要显示的联系人,此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
            if(ros.subscription =='both' || ros.subscription=='to'){
                newroster.push(ros);
            }
        }
        if (newroster.length >=0) {
            buildContactDiv("contractlist", newroster);//页面处理
            if (newroster.length > 0) {
                setCurrentContact(newroster[0].name);//页面处理将第一个联系人作为当前聊天div
            }
        }
        //conn.setPresence();
    },    
});
</code></pre>

### 添加好友{#subscribe}
通过sdk的subscribe和unsubcribe进行添加或者删除好友操作，登录用户通过注册onPresence，监听对方的添加或者删除好友请求，并做相应的处理。
<pre class="hll"><code class="language-javascript">   
//easemobwebim-sdk中收到联系人订阅请求的处理方法，具体的type值所对应的值请参考xmpp协议规范
var handlePresence = function (e){
	//（发送者希望订阅接收者的出席信息），即别人申请加你为好友
	if (e.type == 'subscribe') {
		//若e.status中含有[resp:true],则表示为对方同意好友后反向添加自己为好友的消息，demo中发现此类消息，默认同意操作，完成双方互为好友；如果不含有[resp:true]，则表示为正常的对方请求添加自己为好友的申请消息。
		......
	}
	//(发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
	if (e.type == 'subscribed') {
		......
	}
	//（发送者取消订阅另一个实体的出席信息）,即删除现有好友
	if (e.type == 'unsubscribe') {
		.......
	}
	//（订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
	if (e.type == 'unsubscribed') {
		.......
	}
};
</code></pre>

#### 申请添加对方为好友{#addFriend}
<pre class="hll"><code class="language-javascript">   
//主动申请添加对方为好友
var startAddFriend = function startAddFriend(){
    //对方用户账号
    var user = $("addfridentId").val();
    //请求添加对方为好友
    conn.subscribe({
		to : user,
		message : "加个好友呗-" + getLoacalTimeString()
	});
    return;
};
var getLoacalTimeString = function getLoacalTimeString() {
		var date = new Date();
		var time = date.getHours() + ":" + date.getMinutes() + ":"
				+ date.getSeconds();
		return time;
	}
</code></pre>

#### 对方收到请求，同意或者拒绝{#agreed_reject}

<pre class="hll"><code class="language-javascript">  
//对方收到请求加为好友，接受请求
$('#confirm-block-footer-confirmButton').click(function() {
	//同意好友请求
	agreeAddFriend(e.from);//e.from用户名
	//反向添加对方好友
	conn.subscribe({
		to : e.from,
		message : "[resp:true]"
	});
}
//同意
var agreeAddFriend = function agreeAddFriend(connection,who,jid){
   conn.subscribed({
			to : user,
			message : "[resp:true]"//同意后发送反加对方为好友的消息，反加消息标识[resp:true]
		});
};

//对方收到请求加为好友，拒绝请求
$('#confirm-block-footer-cancelButton').click(function() {
	rejectAddFriend(e.from);//拒绝加为好友
});
//拒绝
var rejectAddFriend = function(user) {
	conn.unsubscribed({
		to : user,
		message : getLoacalTimeString()
	});
};
</code></pre>

对于好友的分组，添加好友时在addroster可以指定group属性（默认为：default组），添加好友成功后，好友列表渲染时，根据好友的group属性进行分组渲染，实现类似其他聊天工具的自定义好友分组管理的功能。

#### 删除好友{#delfriend}

取消订阅，同时将对方从自己的好友列表上删除掉。

<pre class="hll"><code class="language-javascript">
var delFriend = function(user) {
	conn.removeRoster({
		to : user,
		groups : [ 'default' ],
		success : function() {
			conn.**unsubscribed**({
				to : user
			});
		}
	});
};
</code></pre>

### 发送文本（表情）聊天消息{#sendTextMessage}

<pre class="hll"><code class="language-javascript">
//发送文本消息
conn.sendTextMessage({
    to : to,//用户登录名，sd根据appkey和domain组织jid，如easemob-demo#chatdemoui_**TEST**@easemob.com，中"to:TEST",下同
    msg :'hello world！' //文本消息
});

//发送表情消息，调用接口同文本消息
conn.sendTextMessage({
    to : to,
    msg :'hello world！[(*)][(#)]' //文本消息+表情
});
</code></pre>

### 发送图片消息{#sendPic}

发送图片消息sdk自动分两步完成：<br>
1）上传图片文件到服务器，并得到服务返回的图片信息等<br>
2）发送图片消息，消息体包含图片的基本信息、服务器路径、secret等，接收方初始化连接中的onPictureMessage的格式，根据图片消息内容到服务器下载图片，并进行显示

<pre class="hll"><code class="language-javascript">
function sendPic() {
    //图片接收者，如“test1”
    var to = curChatUserId;
    if (to == null) {
        alert("请选择联系人");
        return;
    }
    //fileInputId：文件选择输入框的Id，sdk自动根据id自动获取文件对象（含图片，或者其他类型文件）
    var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
    if (fileObj.url == null || fileObj.url == '') {
        alert("请选择发送图片");
        return;
    }
    var filetype = fileObj.filetype;
    var filename = fileObj.filename;
    if (filetype in  {
                    "jpg" : true,
                    "gif" : true,
                    "png" : true,
                    "bmp" : true
                    }) {
        var opt = {
            fileInputId : fileInputId,
            to : to,
            onFileUploadError : function(error) {
                //处理图片上传失败
            },
            onFileUploadComplete : function(data) {
                //处理图片上传成功，如本地消息显示
            }
        };
        conn.sendPicture(opt);
        return;
    }
    alert("不支持此图片类型" + filetype);
};
</code></pre>

### 发送音频消息{#sendAudio}

sdk处理同发送图片消息，分两步：

1. 上传音频文件到服务器，得到音频文件的信息；
2. 发送音频消息给接收方，消息体包含音频的基本信息、下载路径和secret信息等，接收方收到消息后，根据消息体内部的音频下载路径和secret路径，下载音频并进行显示。

<pre class="hll"><code class="language-javascript">
function sendAudio () {
    var to = curChatUserId;
    if (to == null) {
        alert("请选择联系人");
        return;
    }
    var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
    if (fileObj.url == null || fileObj.url == '') {
        alert("请选择发送音频");
        return;
    }
    var filetype = fileObj.filetype;
    var filename = fileObj.filename;
    if (filetype in {
                "mp3" : true,
                "wma" : true,
                "wav" : true,
                "avi" : true
                })
    {
        var opt = {
            fileInputId : fileInputId,
            to : to,
            onFileUploadError : function(error) {
                //处理上传音频失败
            },
            onFileUploadComplete : function(data) {
                //处理上传音频成功，如本地消息提示发送成功
            }
        };
        conn.sendAudio(opt);
        return;
    }
    alert("不支持此音频类型" + filetype);
};
</code></pre>

### 接收消息

#### 注册接收消息 {#onmessage}

<pre class="hll"><code class="language-javascript">
conn.init({
	onTextMessage : function(message) {        },//收到文本消息处理动作
    onEmotionMessage : function(message) {        },//收到表情消息处理动作
    onPictureMessage : function(message) {         },//收到图片消息处理动作
    onAudioMessage : function(message) {        }, //收到语音消息处理动作
	...
});
</code></pre>

#### 处理消息{#options}

conn.init()中注册不同消息接收handler之后，可自行解析消息体，定位聊天好友，并追加到与其聊天窗口。具体参考webim.easemob.com效果，消息体格式参见前章节：初始化连接。<br>
注：对于图片、语音消息需要先进行下载，然后进行显示或者播放处理。如下(下载图片，音频同)：
<pre class="hll"><code class="language-javascript">
var handlePictureMessage = function(message) {
var filename = message.filename;//文件名称，带文件扩展名
var from = message.from;//文件的发送者
var mestype = message.type;//消息发送的类型是群组消息还是个人消息
......
...
var options = message;
// 图片消息下载成功后的处理逻辑
options.onFileDownloadComplete = function(response, xhr) {
	var objectURL = window.URL.createObjectURL(response);
	img = document.createElement("img");
	img.onload = function(e) {
		img.onload = null;
		window.URL.revokeObjectURL(img.src);
	};
	img.onerror = function() {
		img.onerror = null;
		if (typeof FileReader == 'undefined') {
			img.alter = "当前浏览器不支持blob方式";
			return;
		}
		img.onerror = function() {
			img.alter = "当前浏览器不支持blob方式";
		};
		var reader = new FileReader();
		reader.onload = function(event) {
			img.src = this.result;
		};
		reader.readAsDataURL(response);
	}
	img.src = objectURL;
	var pic_real_width = options.width;
	......
	...
};
options.onFileDownloadError = function(e) {
	appendMsg(from, contactDivId, e.msg + ",下载图片" + filename + "失败");
};
Easemob.im.Helper.download(options);

</code></pre>

#### 历史消息{#history_message}

sdk暂不具有缓存历史消息功能，demo中聊天窗口只能显示，当前登录后会话实时在聊天信息，不能查看历史消息，可以对登录后的聊天信息进行清除操作。

#### 新消息提示{#new_message}

sdk在收到新消息是会直接转发给登录用户，接收到消息后，demo中会在好友或者群组的后面显示红色消息数，具体样式开发者可自行处理。

## 群聊{#group_chat}

### 查询群组成员{#queryOccupants}

<pre class="hll"><code class="language-javascript">
//根据roomId查询room成员列表
var queryOccupants = function queryOccupants(roomId) {
    var occupants = [];//存放成员容器
    //查询获取room信息
    conn.queryRoomInfo({
        roomId : roomId,
        success : function(occs) {
            if (occs) {
                for ( var i = 0; i < occs.length; i++) {
                    occupants.push(occs[i]);
                }
            }
            //查询获取room成员信息
            conn.queryRoomMember({
                roomId : roomId,
                success : function(members) {
                    if (members) {
                        for ( var i = 0; i < members.length; i++) {
                            occupants.push(members[i]);
                        }
                    }
                }
            });
        }
    });
};
</code></pre>

### 发送文本（表情）聊天消息{#group_sendTextMessage}

<pre class="hll"><code class="language-javascript">
//发送文本消息
conn.sendTextMessage({
    to : to,
    type : 'groupchat',
    msg :'hello world！' //文本消息
});

//发送表情消息，调用接口同文本消息
conn.sendTextMessage({
    to : to,
    type : 'groupchat',
    msg :'hello world！[(*)][(#)]' //文本消息+表情
});
</code></pre>

### 发送图片消息{#group_sendPic}

发送图片消息sdk自动分两步完成

1. 上传图片文件
2. 发送图片消息初始化连接中的onPictureMessage的格式

<pre class="hll"><code class="language-javascript">
//发送图片消息时调用方法
var sendPic = function() {
    var to = curChatUserId;
    if (to == null) {
        return;
    }
    // Easemob.im.Helper.getFileUrl为easemobwebim-sdk获取发送文件对象的方法，fileInputId为 input 标签的id值
    var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
    if (fileObj.url == null || fileObj.url == '') {
        alert("请选择发送图片");
        return;
    }
    var filetype = fileObj.filetype;
    var filename = fileObj.filename;
    if (filetype in pictype) {
        document.getElementById("fileSend").disabled = true;
        document.getElementById("cancelfileSend").disabled = true;
        var opt = {
            type:'chat',
            fileInputId : fileInputId,
            to : to,
            onFileUploadError : function(error) {
                //处理图片上传失败
            },
            onFileUploadComplete : function(data) {
                //关闭文件选择窗口
                $('#fileModal').modal('hide');
                //本地缩略图
                var file = document.getElementById(fileInputId);
                if (file && file.files) {
                    var objUrl = getObjectURL(file.files[0]);
                    if (objUrl) {
                        var img = document.createElement("img");
                        img.src = objUrl;
                        img.width = maxWidth;
                    }
                }
            
            }
        };
        //判断是否为群组标识
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            opt.type = 'groupchat';//群组标识符
            opt.to = curRoomId;
        }
        conn.sendPicture(opt);
        return;
    }
    alert("不支持此图片类型" + filetype);
};
</code></pre>

### 发送音频消息{#group_sendAudio}

sdk处理同群发送图片消息，分两步

1. 上传音频
2. 发送消息

<pre class="hll"><code class="language-javascript">
//发送音频消息时调用的方法
var sendAudio = function() {
    var to = curChatUserId;
    if (to == null) {
        alert("请选择联系人");
        return;
    }
    //利用easemobwebim-sdk提供的方法来构造一个file对象
    var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
    if (fileObj.url == null || fileObj.url == '') {
            alert("请选择发送音频");
        return;
    }
    var filetype = fileObj.filetype;
    var filename = fileObj.filename;
    if (filetype in audtype) {
        document.getElementById("fileSend").disabled = true;
        document.getElementById("cancelfileSend").disabled = true;
        var opt = {
            type:"chat",
            fileInputId : fileInputId,
            to : to,//发给谁
            onFileUploadError : function(error) {
                //处理上传音频失败
            },
            onFileUploadComplete : function(data) {
                //处理上传音频成功，如本地消息提示发送成功
            }
        };
        //构造完opt对象后调用easemobwebim-sdk中发送音频的方法
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            opt.type = 'groupchat';
            opt.to = curRoomId;
        }
        conn.sendAudio(opt);
        return;
    }
    alert("不支持此音频类型" + filetype);
};
</code></pre>
### 接收及处理消息{#messageType}
群聊接收及处理消息同单聊，消息体与单聊消息根据message的type进行区分，单聊为：“chat”，群聊为：“groupchat”。根据消息的类型进行不同处理即可。

## 退出{#quit}

### 关闭连接{#conn_close}
//sdk关闭连接并处理连接状态为CLOSED
<pre class="hll"><code class="language-javascript">
conn.close();
</code></pre>

## 工具类说明{#sdk_tools}

### 表情工具类{#emotion}

<pre class="hll"><code class="language-javascript">
//返回表情JSON object，格式为：
    {
        "[):]" : "data:image/png;base64,iVBORw0K....==",
        "[:D]" : "data:image/png;base64,iVBORw0KGgoAAAANSUh....=="
    }

var emotion_json = Easemob.im.Helper.EmotionPicData;
</code></pre>

### Base64工具类{#base64}

<pre class="hll"><code class="language-javascript">
var base64  = Easemob.im.Helper.Base64;
var srcstr="ssss";
var base64str = base64.encode(srcstr);
var orgstr = base64.decode(srcstr);
</code></pre>

### 文件上传工具类{#fileupload}

<pre class="hll"><code class="language-javascript">
//是否能上传file
var canupload = Easemob.im.Helper.isCanUploadFile;
//是否能下载file
var candownload = Easemob.im.Helper.isCanDownLoadFile ;
//是否设置header
var hasheader = Easemob.im.Helper.hasSetRequestHeader;
//是否设置mimetype
var hasmimetype = Easemob.im.Helper.hasOverrideMimeType;
</code></pre>

### 表情解析工具类{#handleMotion}

<pre class="hll"><code class="language-javascript">
//返回表情JSON，格式为：
{
    isemotion:true;
    body:[{
        type:txt,
        msg:ssss
    },
    {
        type:emotion,
        msg:imgdata
    }]
}

var emotionMsg = Easemob.im.Helper.parseTextMessage(message);
</code></pre>

### 文件上传工具类{#fileupdate}

<pre class="hll"><code class="language-javascript">
//返回fileinfo对象，格式为：
    {
        url : '',
        filename : '',
        filetype : ''
    }
var fileInfo = Easemob.im.Helper.getFileUrl(fileInputId);
//上传
var options={
    appName = 'chatdemoui',
    orgName = 'easemob-demo',
    accessToken = 'YWMtjPPoovCqEeOQs7myPqqaOwAAAUaqNH0a8rRj4PwJLQju6-S47ZO6wYs3Lwo',
    onFileUploadComplete:function(data){//upload file success },
    onFileUploadError:function(e){//upload file error },
    width:100,//only for pic
    heght:100//only for pic
}
Easemob.im.Helper.upload(options);
//下载
var options = {
    method:'GET',//default GET
    responseType:'blob',//default blob
    mimeType:'text/plain; charset=x-user-defined',//default
    url:'http://s1.easemob.com/weiquan2/a2/chatfiles/0c0f5f3a-e66b-11e3-8863-f1c202c2b3ae',
    secret = 'NSgGYPCxEeOou00jZasg9e-GqKUZGdph96EFxJ4WxW-qkxV4',
    accessToken = 'YWMtjPPoovCqEeOQs7myPqqaOwAAAUaqNH0a8rRj4PwJLQju6-S47ZO6wYs3Lwo',
    onFileUploadComplete:function(data){//upload file success },
    onFileUploadError:function(e){//upload file error },
}
Easemob.im.Helper.download(options);
//文件大小 
var options={
    fileInputId:'uploadfileinput'//文件输入框id
};
var fileSize = getFileSize(options.fileInputId);;
</code></pre>

### 发送Ajax请求{#ajaxresquest}

<pre class="hll"><code class="language-javascript">
var options = {
    dataType:'text',//default
    success:function(){//handle request success},
    error :function(){//handle request error},
    type : 'post',//default 'post'
    url : 'http://s1.easemob.com/weiquan2/a2/chatfiles/0c0f5f3a-e66b-11e3-8863-f1c202c2b3ae',
    headers:'',//default {}
    data : '';//default null
};
Easemob.im.Helper.xhr(options);
</code></pre>

### 登录{#sdk_login}

<pre class="hll"><code class="language-javascript">
var options = {
    appKey:'easemob-demo#chatdemoui',//default ''
    success:function(data){ //login success },//default emptyFn
    error : cunction(error){ //login error }, //default emptyFn
    user : 'test1', //default ''
    pwd : '123456'  //default ''
};
Easemob.im.Helper.login2UserGrid(options);
</code></pre>

### 注册{#sdk_regist}

<pre class="hll"><code class="language-javascript">
vvar options = {
	username : 'zjj8',
	password : '123456',
	appKey : 'easemob-demo#chatdemoui',
	success : function(result) {
		//注册成功
		},
		error : function(e) {
		//注册失败			
		}
	};
Easemob.im.Helper.registerUser(options);
</code></pre>

### 内置空函数{#null_function}

当所有需要回调的地方接受到函数时，默认采用此函数

<pre class="hll"><code class="language-javascript">
var emptyFn = function() {};
</code></pre>
