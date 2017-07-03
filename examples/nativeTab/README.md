## nativeObj 模式底部选项卡 + webview 子窗口 实现示例
## 概述

这是一个利用原生view控件绘制底部选项卡的示例，有以下几个特点：
1.操作简单：选项卡常用于App首页，为加快渲染，首页的原生底部选项卡是在manifest.json中通过plus -> launchwebview -> subNViews 节点配置的；
2.绘制内容支持字体，图片，矩形区域
3.开发者自定义选项卡点击事件
4.同样支持页内手动绘制 view 控件，也就是说在非首页也可以使用此方法，参考示例：底部选项卡中央凸起悬浮大图标的绘制

#### 说明：中央凸起悬浮大图标，因涉及屏幕分辨率动态计算和为给出开发者页内手动绘制的示例的原因，放在首页plusReady事件中实现绘制的。该悬浮大图标支持点击事件，开发者可定制实现对应的点击逻辑。

## 应用截图

![截图](http://img-cdn-qiniu.dcloud.net.cn/uploads/article/20170623/04c03ba9ad4afa7d11735e52c771cf94.png)

## 快速体验

[流应用app下载](http://liuyingyong.cn/) --> 扫描下方二维码快速体验

![二维码](images/ma.png)


## 使用教程

[教程参考](http://ask.dcloud.net.cn/article/12602)
