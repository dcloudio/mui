# 问题反馈云服务上线

为简化广大开发者的开发工作量，HBuilder 7.2.0版本发布了问题反馈云服务，大家在HBuilder中选择问题反馈模板，直接集成使用，然后登陆DCloud开发者中心，就可以查看用户的反馈情况。整个过程基本无需开发，即可实现问题反馈全流程的功能。

![image](http://7rflw8.com1.z0.glb.clouddn.com//mui/templatefeedback02.png)

## 客户端集成
在HBuilder中新建HTML页面，选择“问题反馈”模板，如下图所示：

![image](http://7rflw8.com1.z0.glb.clouddn.com/feedback01.png)

会自动生成问题反馈模板所需的html、js、css资源文件；

问题反馈模板依赖mui框架，请注意修改mui.min.js及mui.min.css的引用路径，其它代码无需修改即可直接使用。

###快捷输入
反馈模板将软件使用中的常见问题，整理成了“快捷输入”功能，如下图所示：

![image](http://7rflw8.com1.z0.glb.clouddn.com//mui/templatefeedback03.png)

用户点击快捷输入中的项，可以直接将该短语插入到“问题和意见”输入框中。开发者可根据实际情况修改常见问题，变成新的常用语，无需其它JS逻辑。

## 云端查看反馈数据

开发者使用 HBuilder 账号或 ASK 社区账号登录 [开发者中心](https://dev.dcloud.net.cn) 。

登录成功后如下图所示：

![image](http://7rflw8.com2.z0.glb.clouddn.com/dev_index.png)

### 问题反馈列表

点击列表中的应用名称进入二级页面，点击左侧导航“问题反馈”，进入问题反馈列表，如下图所示：

![image](http://7rflw8.com2.z0.glb.clouddn.com/feedback_list.png)

说明：列表中内容为**粗体**的表示未读内容。

### 问题详情

点击问题列表中的内容列，可以查看反馈问题的详细信息，如下图所示：

![image](http://7rflw8.com2.z0.glb.clouddn.com/feedback_detail.png)

在详情页面可以设置该问题的解决方案，如图中红框部分所示。



