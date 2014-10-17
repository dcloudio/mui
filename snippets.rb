=begin 
本文档是HBuilder预置的mui框架的HTML代码块。
使用代码块可以快速构建App页面，比如输入mheader，可以直接生成mui导航代码块。
关于代码块的使用介绍，请参考：http://dcloud.io/readme/#title7
=end


########## MUI代码块 begin ##########

  snippet 'mButton' do |cmd|
    cmd.trigger = 'mbutton'
    cmd.expansion = "<button class=\"mui-btn\">按钮$1</button>"
  end
  snippet 'mButton-blue' do |cmd|
    cmd.trigger = 'mbuttonblue'
    cmd.expansion = "<button class=\"mui-btn mui-btn-blue\">按钮$1</button>"
  end
  snippet 'mButton-green' do |cmd|
    cmd.trigger = 'mbuttongreen'
    cmd.expansion = "<button class=\"mui-btn mui-btn-green\">按钮$1</button>"
  end
  snippet 'mButton-yellow' do |cmd|
    cmd.trigger = 'mbuttonyellow'
    cmd.expansion = "<button class=\"mui-btn mui-btn-yellow\">按钮$1</button>"
  end
  snippet 'mButton-red' do |cmd|
    cmd.trigger = 'mbuttonred'
    cmd.expansion = "<button class=\"mui-btn mui-btn-red\">按钮$1</button>"
  end
  snippet 'mButton-purple' do |cmd|
    cmd.trigger = 'mbuttonred'
    cmd.expansion = "<button class=\"mui-btn mui-btn-purple\">按钮$1</button>"
  end
  
  
  snippet 'mHeader' do |cmd|
      cmd.trigger = 'mheader'
      cmd.expansion = '<header class="mui-bar mui-bar-nav">
	<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
	<h1 class="mui-title">标题$1</h1>
</header>'
  end
  
    snippet 'mHeader_withoutBack' do |cmd|
      cmd.trigger = 'mheaderwithoutback'
      cmd.expansion = '<header class="mui-bar mui-bar-nav">
    <h1 class="mui-title">标题$1</h1>
</header>'
  end
  
  
  snippet 'mBody' do |cmd|
      cmd.trigger = 'mbody'
      cmd.expansion = '<div class="mui-content">
	$1
</div>'
  end
  
  snippet 'mText' do |cmd|
    cmd.trigger = 'mtext'
    cmd.expansion = "<input type=\"text\" class=\"mui-input-clear mui-input-speech\" placeholder=\"$1\">"
  end
  snippet 'mSearch' do |cmd|
    cmd.trigger = 'msearch'
    cmd.expansion = "<input type=\"search\" class=\"mui-input-clear mui-input-speech\" placeholder=\"$1\">"
  end
  snippet 'mForm' do |cmd|
    cmd.trigger = 'mform'
    cmd.expansion = "<form class=\"mui-input-group\">
	<div class=\"mui-input-row\">
		<label>input</label>
		<input type=\"text\" class=\"mui-input-clear\" placeholder=\"${1:请输入}\">
	</div>
</form>"
  end
  snippet 'mRadio' do |cmd|
    cmd.trigger = 'mradio'
    cmd.expansion = "<div class=\"mui-input-row mui-radio \">
	<label>${1:Radio}</label>
	<input name=\"$2\" type=\"radio\" checked>
</div>"
  end
  snippet 'mCheckbox' do |cmd|
    cmd.trigger = 'mcheckbox'
    cmd.expansion = "<div class=\"mui-input-row mui-checkbox \">
	<label>${1:Checkbox}</label>
	<input name=\"$2\" type=\"checkbox\" checked>
</div>"
  end
  snippet 'mRange' do |cmd|
    cmd.trigger = 'mrange'
    cmd.expansion = "<div class=\"mui-input-row mui-input-range\">
	<label>slider</label>
	<input type=\"range\" min=\"0\" max=\"100\">
</div>"
  end
  snippet 'mSwitch' do |cmd|
    cmd.trigger = 'mswitch'
    cmd.expansion = "<div class=\"mui-input-row\">
	<label>Switch</label>
	<div class=\"mui-switch mui-active\">
		<div class=\"mui-switch-handle\"></div>
	</div>
</div>"
  end
  snippet 'mSpeech' do |cmd|
    cmd.trigger = 'mspecch'
    cmd.expansion = "<div class=\"mui-input-row\">
	<label>${1:Input}</label>
	<input type=\"text\" class=\"mui-input-clear mui-input-speech\" placeholder=\"请输入\">
</div>"
  end
  snippet 'mBadge' do |cmd|
    cmd.trigger = 'mbadge'
    cmd.expansion = "<span class=\"mui-badge mui-badge-negative\">${1:1}</span>"
  end
  
  snippet 'mTab' do |cmd|
    cmd.trigger = 'mtab'
    cmd.expansion = "<nav class=\"mui-bar mui-bar-tab\">
	<a class=\"mui-tab-item mui-active\">
		<span class=\"mui-icon mui-icon-home\"></span>
		<span class=\"mui-tab-label\">${1:首页}</span>
	</a>
	<a class=\"mui-tab-item\">
		<span class=\"mui-icon mui-icon-phone\"></span>
		<span class=\"mui-tab-label\">电话</span>
	</a>
	<a class=\"mui-tab-item\">
		<span class=\"mui-icon mui-icon-email\"></span>
		<span class=\"mui-tab-label\">邮件</span>
	</a>
	<a class=\"mui-tab-item\">
		<span class=\"mui-icon mui-icon-gear\"></span>
		<span class=\"mui-tab-label\">设置</span>
	</a>
</nav>"
  end
  snippet 'mTabSegmented' do |cmd|
    cmd.trigger = 'mtabsegmented'
    cmd.expansion = "<div class=\"mui-segmented-control\">
	<a class=\"mui-control-item mui-active\" href=\"#item1\">${1:选项卡1}</a>
	<a class=\"mui-control-item\" href=\"#item2\">选项卡2</a>
</div>"
  end
  snippet 'mPagination' do |cmd|
    cmd.trigger = 'mpagination'
    cmd.expansion = "<ul class=\"mui-pagination\">
	<li class=\"mui-disabled\">
		<span> &laquo; </span>
	</li>
	<li class=\"mui-active\">
		<a href=\"#\">${1:1}</a>
	</li>
	<li>
		<a href=\"#\">2</a>
	</li>
	<li>
		<a href=\"#\">&raquo;</a>
	</li>
</ul>"
  end
  snippet 'mList' do |cmd|
    cmd.trigger = 'mlist'
    cmd.expansion = "<div class=\"mui-card\">
	<ul class=\"mui-table-view\">
		<li class=\"mui-table-view-cell\">
			<a class=\"mui-navigate-right\">
				${1:Item 1}
			</a>
		</li>
		<li class=\"mui-table-view-cell\">
			<a class=\"mui-navigate-right\">
				Item 2
			</a>
		</li>
		<li class=\"mui-table-view-cell\">
			<a class=\"mui-navigate-right\">
				Item 3
			</a>
		</li>
	</ul>
</div>"
  end
  snippet 'mList-Media' do |cmd|
    cmd.trigger = 'mlist-Media'
    cmd.expansion = "<ul class=\"mui-table-view\">
	<li class=\"mui-table-view-cell\">
		<a class=\"mui-navigate-right\">
			<img class=\"mui-media-object mui-pull-left\" src=\"img/hbuilder.png\">
			<div class=\"mui-media-body\">
				主标题
				<p class='mui-ellipsis'>这里是摘要</p>
			</div>
		</a>
	</li>
	<li class=\"mui-table-view-cell\">
		<a class=\"mui-navigate-right\">
			<img class=\"mui-media-object mui-pull-left\" src=\"img/hbuilder.png\">
			<div class=\"mui-media-body\">
				主标题
				<p class='mui-ellipsis'>这里是摘要</p>
			</div>
		</a>
	</li>
</ul>"
  end
  snippet 'mGrid' do |cmd|
    cmd.trigger = 'mgrid'
    cmd.expansion = "<div class=\"mui-card\">
	<ul class=\"mui-table-view mui-grid-view mui-grid-9\">
		<li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
			<a href=\"#\">
				<span class=\"mui-icon mui-icon-home\"></span>
				<div class=\"mui-media-body\">Home</div>
			</a>
		</li>
		<li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
			<a href=\"#\">
				<span class=\"mui-icon mui-icon-email\"><span class=\"mui-badge mui-badge-red\">5</span></span>
				<div class=\"mui-media-body\">Email</div>
			</a>
		</li>
		<li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
			<a href=\"#\">
				<span class=\"mui-icon mui-icon-chatbubble\"></span>
				<div class=\"mui-media-body\">Chat</div>
			</a>
		</li>
		<li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
			<a href=\"#\">
				<span class=\"mui-icon mui-icon-location\"></span>
				<div class=\"mui-media-body\">Location</div>
			</a>
		</li>
		<li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
			<a href=\"#\">
				<span class=\"mui-icon mui-icon-search\"></span>
				<div class=\"mui-media-body\">Search</div>
			</a>
		</li>
		<li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
			<a href=\"#\">
				<span class=\"mui-icon mui-icon-phone\"></span>
				<div class=\"mui-media-body\">Phone</div>
			</a>
		</li>
	</ul>
</div>"
  end
  snippet 'mGrid-picture' do |cmd|
    cmd.trigger = 'mgrid-picture'
    cmd.expansion = "<ul class=\"mui-table-view mui-grid-view\">
	<li class=\"mui-table-view-cell mui-media mui-col-xs-6\">
		<a href=\"#\">
			<img class=\"mui-media-object\" src=\"http://placehold.it/400x300\">
			<div class=\"mui-media-body\">文字说明1</div>
		</a>
	</li>
	<li class=\"mui-table-view-cell mui-media mui-col-xs-6\">
		<a href=\"#\">
			<img class=\"mui-media-object\" src=\"http://placehold.it/400x300\">
			<div class=\"mui-media-body\">文字说明2</div>
		</a>
	</li>
</ul>"
  end
  snippet 'mGallery' do |cmd|
    cmd.trigger = 'mgallery'
    cmd.expansion = "<div class=\"mui-slider\">
	<div class=\"mui-slider-group\">
		<div class=\"mui-slider-item\">
			<a href=\"#\">
				<img src=\"http://placehold.it/200x100\">
				<p class=\"mui-slider-title\">文字说明1</p>
			</a>
		</div>
		<div class=\"mui-slider-item\">
			<a href=\"#\">
				<img src=\"http://placehold.it/200x100\">
				<p class=\"mui-slider-title\">文字说明2</p>
			</a>
		</div>
	</div>
	<div class=\"mui-slider-indicator\">
		<div class=\"mui-indicator mui-active\"></div>
		<div class=\"mui-indicator\"></div>
	</div>
</div>"
  end


########## MUI代码块 end ##########
