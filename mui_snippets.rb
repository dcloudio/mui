require 'ruble'
=begin 
 HBuilder可使用ruby脚本来扩展代码块和增强操作命令。这是极客的神奇玩具。
  本文档用于用户自定义HTML扩展命令，并非HBuilder预置命令的文档，预置的代码块不可改。查阅预置代码块，请在弹出预置代码块界面时点右下角的编辑按钮，比如div代码块。
  本文档修改完毕，保存即可生效。
  玩的愉快，别玩坏！
  
  脚本开源地址 https://github.com/dcloudio/HBuilderRubyBundle
  可以把你的配置共享到这里，也可以在这里获取其他网友的版本
  
  注：如果1.9版本之前的用户修改过HTML代码块，请点右键打开本文档所在目录，找之前的snippets.rb.bak文件，把修改过的内容放置进来。 
=end

with_defaults :scope => 'text.html text' do |bundle|  #=====HTML标签代码块================================================================================
#如下是一个示例代码块，可以复制后再添加新代码块
  snippet 'div_class' do |cmd|  #div_class是显示名称，代码助手提示列表显示时可见
    cmd.trigger = 'divc'        #divc是激活字符，即按下divc后会触发该代码块
    cmd.expansion = "<div class=\"$1\">
	$0
</div>"                         #expansion是代码块的输出内容，其中$0、$1是光标的停留和切换位置。$1是第一个停留光标，$0是最后回车时停留的光标。
													      #如果输出涉及到换行和tab，也需严格在这里使用换行和tab。
													      #输出双引号在前面加\来转义，输出$使用\$(单引号中)或\\$(双引号中)转义
    cmd.needApplyReContentAssist = true  #这句话的意思是输出后同时激活代码助手，即在$1的位置直接拉出样式列表
  end #div_class代码块结束
  
  snippet 'ng-pluralize' do |cmd|
    cmd.trigger = 'ngp'
    cmd.expansion = "<ng-pluralize>$1</ng-pluralize>"
  end

end


with_defaults :scope => 'text.html entity.other.attribute-name.html' do |bundle|  #=====HTML属性代码块====================================================
#如下是一个示例代码块，可以复制后再添加新代码块
  snippet 'ng-' do |s|   #ng-是显示名称，代码助手提示列表显示时可见
    s.trigger = 'ng-'		 #ng-是激活字符，即按下ng-后会触发该代码块
    s.expansion='ng-${1:app/bind/bind-html/bind-template/blur/change/checked/class/class-even/class-odd/click/cloak/controller/copy/csp/cut/dblclick/disabled/focus/hide/href/if/include/init/keydown/keypress/keyup/list/model/mousedown/mouseenter/mouseleave/mousemove/mouseover/mouseup/ng-non-bindable/open/options/paste/readonly/repeat-start/repeat-end/selected/show/src/srcset/style/submit/swipe-left/swipe-right/switch/switch-default/switch-when/view}="$2"'
		#expansion是代码块的输出内容，其中$0、$1是光标的停留和切换位置。
	  #$1是第一个停留光标，$0是最后回车时停留的光标。
	  #使用{}包围的内容，是提示值域。
	  #如果输出涉及到换行和tab，也需严格在这里使用换行和tab。
	  #输出双引号在前面加\来转义，输出$使用\$(单引号中)或\\$(双引号中)转义
    s.locationType='HTML_ATTRIBUTE'
  end #ng代码块结束

end


with_defaults :scope => 'text.html - source', :input => :none, :output => :insert_as_snippet do |bundle|  #=====无显示名称的快捷命令=======================
=begin
如下示例均为系统已经预置的命令，无需重复制作
示例1 Ctrl+Enter输出<br />
  command t(:quick_br) do |cmd|
    cmd.key_binding = 'M2+ENTER'
    cmd.output = :insert_as_snippet
    cmd.input = :none
    cmd.invoke { "<br />" }
  end
示例2 Ctrl+9为选中文字添加包围标签
  command t(:wrap_selection_in_tag_pair) do |cmd|
    cmd.key_binding = "CONTROL+9"
    cmd.input = :selection
    cmd.invoke do |context|
      selection = ENV['TM_SELECTED_TEXT'] || ''
      if selection.length > 0
        "<${1:p}>#{selection.gsub('/', '\/')}</${1:p}>"
      else
        "<${1:p}>$0</${1:p}>"
      end
    end
  end
=end
#可复制一段命令，在下面开始制作新命令
snippet 'mBody(主体)' do |cmd|
    cmd.trigger = 'mbody'
    cmd.expansion = '<div class="mui-content">
    $0
</div>'
end

snippet 'mCheckbox(复选框)' do |cmd|
    cmd.trigger = 'mcheckbox'
    cmd.expansion = "<div class=\"mui-input-row mui-checkbox \">
    <label>${1:Checkbox}</label>
    <input name=\"${3:Checkbox}\" type=\"checkbox\" ${2:checked}>
</div>
$0"
end 

snippet 'mCheckbox(复选框居左)' do |cmd|
    cmd.trigger = 'mcheckbox'
    cmd.expansion = "<div class=\"mui-input-row mui-checkbox mui-left\">
  <label>${1:checkbox左侧显示示例}</label>
  <input name=\"${3:checkbox1}\" value=\"Item 1\" type=\"checkbox\" ${2:checked} >
</div>
$0"
end 
  
snippet 'mCheckbox(复选框禁用选项)' do |cmd|
    cmd.trigger = 'mcheckbox'
    cmd.expansion = "<div class=\"mui-input-row mui-checkbox mui-left mui-disabled\">
    <label>${1:disabled checkbox}</label>
    <input name=\"checkbox\" type=\"checkbox\" ${2:disabled=\"disabled\"}>
</div>
$0"
end 
  
snippet 'mHeader(标题栏)' do |cmd|
    cmd.trigger = 'mheader'
    cmd.expansion = '<header class="mui-bar mui-bar-nav">
    <h1 class="mui-title">${1:标题}</h1>
</header>
$0'
end
snippet 'mHeader(带返回箭头的标题栏)' do |cmd|
    cmd.trigger = 'mheaderwithBack'
    cmd.expansion = '<header class="mui-bar mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"><\/a>
    <h1 class="mui-title">${1:标题}</h1>
</header>
$0'
end
    
snippet 'mText(文本框)' do |cmd|
    cmd.trigger = 'minputtext'
    cmd.needApplyReContentAssist = true 
    cmd.expansion = "<div class=\"mui-input-row\">
    <label>${3:Input}</label>
    <input type=\"${1:text}\" placeholder=\"${2:普通输入框}\">
</div>
$0"
end
  
snippet 'mText_Search(搜索框)' do |cmd|
    cmd.trigger = 'minputsearch'
    cmd.expansion = "<div class=\"mui-input-row mui-search\">
    <input type=\"search\" class=\"mui-input-clear\" placeholder=\"$1\">
</div>
$0"
end

snippet 'mText_Clear(带清除按钮的文本框)' do |cmd|
    cmd.trigger = 'minputclear'
    cmd.expansion = "<div class=\"mui-input-row\">
    <label>Input</label>
    <input type=\"text\" class=\"mui-input-clear\" placeholder=\"${1:带清除按钮的输入框}\">
</div>
$0"
end

snippet 'mText_Speech(语音输入)' do |cmd|
    cmd.trigger = 'minputspeech'
    cmd.expansion = "<div class=\"mui-input-row\">
    <label>${2:Input}</label>
    <input type=\"text\" class=\"mui-input-speech mui-input-clear\" placeholder=\"${1:语音输入}\">
</div>
$0"
end
  
snippet 'mForm(表单)' do |cmd|
    cmd.trigger = 'mform'
    cmd.needApplyReContentAssist = true 
    cmd.expansion = "<form class=\"mui-input-group\">
    <div class=\"mui-input-row\">
        <label>${3:input}</label>
        <input type=\"${1:text}\" class=\"${2:mui-input-clear}\" placeholder=\"${3:请输入}\">
    </div>
</form>$0"
end
  
snippet 'mRadio(单选框)' do |cmd|
    cmd.trigger = 'mradio'
    cmd.expansion = "<div class=\"mui-input-row mui-radio \">
    <label>${1:Radio}</label>
    <input name=\"$2\" type=\"radio\" ${3:checked}>
</div>$0"
end
  
snippet 'mPopover(弹出菜单)' do |cmd|
    cmd.trigger = 'mpopover'
    cmd.expansion = '<div class="mui-popover">
    <ul class="mui-table-view">
        <li class="mui-table-view-cell"><a href="#">${1:Item1}</a></li>
        <li class="mui-table-view-cell"><a href="#">${2:Item2}</a></li>
        <li class="mui-table-view-cell"><a href="#">${3:Item3}</a></li>
    </ul>
</div>$0'
end
  
snippet 'mPopover(H5模式弹出菜单)' do |cmd|
    cmd.trigger = 'mactionsheet'
    cmd.expansion = '<div class="mui-popover mui-popover-action mui-popover-bottom">
    <ul class="mui-table-view">
        <li class="mui-table-view-cell"><a href="#">${1:Item1}</a></li>
        <li class="mui-table-view-cell"><a href="#">${2:Item2}</a></li>
        <li class="mui-table-view-cell"><a href="#">${3:Item3}</a></li>
    </ul>
</div>$0'
end
  
snippet 'mRange(label+输入框+滑块)' do |cmd|
    cmd.trigger = 'mrangeinput'
    cmd.expansion = "<h5>label+输入框+滑块：</h5> 
<div class=\"mui-input-row mui-input-range field-contain\">
    <div style=\"float:left\">
        <label >${4:滑块：}</label>
        <input type=\"text\" id=\'field-range-input\' value=\'${1:60}\'>
    </div>
    <div style=\"margin-left:121px;\">
        <input type=\"range\" id=\'field-range\' value=\"${1:60}\" min=\"${2:0}\" max=\"${3:100}\" />
    </div>
</div> $0"
end
  
snippet 'mRange(Label+滑块)' do |cmd|
    cmd.trigger = 'mrangelabel'
    cmd.expansion = "<h5>label+滑块：<span id=\'inline-range-val\'>${1:20}</span></h5> 
<div class=\"mui-input-row mui-input-range\">
    <label>${4:滑块：}</label>
    <input type=\"range\" id='inline-range' value=\"${1:20}\" min=\"${2:0}\" max=\"${3:100}\" >
</div>$0"
end

snippet 'mRange(整行滑块)' do |cmd|
    cmd.trigger = 'mrangeline'
    cmd.expansion = "<h5 style=\"clear: left;\">${4:整行滑块：}<span id=\'block-range-val\'>${1:50}</span></h5>   
    <div class=\"mui-input-row mui-input-range\">
        <input type=\"range\" id=\'block-range\' value=\"${1:50}\" min=\"${2:0}\" max=\"${3:100}\" >
    </div>$0"
end
  
snippet 'mSwitch(开关)' do |cmd|
    cmd.trigger = 'mswitch'
    cmd.expansion = "<div class=\"mui-input-row\">
    <label>${2:Switch}</label>
    <div class=\"mui-switch${1: mui-active}\">
        <div class=\"mui-switch-handle\"></div>
    </div>
</div>$0"
end
  
snippet 'mSwitch(开关Mini)' do |cmd|
    cmd.trigger = 'mswitchmini'
    cmd.expansion = "<div class=\"mui-switch mui-switch-mini${1: mui-active}\">
  <div class=\"mui-switch-handle\"></div>
</div>"
end
  
snippet 'mbadge（数字角标）' do |cmd|
    cmd.trigger = 'mbadge'
    cmd.expansion = "<span class=\"mui-badge ${1:mui-btn-blue/mui-btn-green/mui-btn-yellow/mui-btn-red/mui-btn-purple/mui-btn-grey}\">${2:1}</span>$0"
end
snippet 'mbadge（数字角标无底色）' do |cmd|
    cmd.trigger = 'mbadge_inverted'
    cmd.expansion = "<span class=\"mui-badge mui-badge-inverted ${1:mui-btn-blue/mui-btn-green/mui-btn-yellow/mui-btn-red/mui-btn-purple/mui-btn-grey}\">${2:1}</span>$0"
end
  
snippet 'mTab(底部选项卡)' do |cmd|
    cmd.trigger = 'mtab'
    cmd.expansion = "<nav class=\"mui-bar mui-bar-tab\">
    <a class=\"mui-tab-item mui-active\">
        <span class=\"mui-icon mui-icon-home\"></span>
        <span class=\"mui-tab-label\">${1:首页}</span>
    </a>
    <a class=\"mui-tab-item\">
        <span class=\"mui-icon mui-icon-phone\"></span>
        <span class=\"mui-tab-label\">${2:电话}</span>
    </a>
    <a class=\"mui-tab-item\">
        <span class=\"mui-icon mui-icon-email\"></span>
        <span class=\"mui-tab-label\">${3:邮件}</span>
    </a>
    <a class=\"mui-tab-item\">
        <span class=\"mui-icon mui-icon-gear\"></span>
        <span class=\"mui-tab-label\">${4:设置}</span>
    </a>
</nav>$0"
end
  
snippet 'mTabSegmented(div选项卡)' do |cmd|
    cmd.trigger = 'mtabsegmented'
    cmd.expansion = "<div class=\"mui-segmented-control\">
    <a class=\"mui-control-item mui-active\" href=\"#item1\">${1:选项卡1}</a>
    <a class=\"mui-control-item\" href=\"#item2\">${1:选项卡2}</a>
</div>$0"
end
  
snippet 'mTabSegmented(可左右拖动的选项卡)' do |cmd|
    cmd.trigger = 'mtabviewpage'
    cmd.expansion = '<div class="mui-slider">
    <div class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="mui-control-item" href="#item1">${1:选项卡1}</a>
        <a class="mui-control-item" href="#item2">${2:选项卡2}</a>
    </div>
    <div id="sliderProgressBar" class="mui-slider-progress-bar mui-col-xs-4"></div>
    <div class="mui-slider-group">
        <div id="item1" class="mui-slider-item mui-control-content mui-active">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell">${3:第1个选项卡子项}</li>
                <li class="mui-table-view-cell">${4:第1个选项卡子项}</li>
            </ul>
        </div>
        <div id="item2mobile" class="mui-slider-item mui-control-content">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell">${5:第2个选项卡子项}</li>
                <li class="mui-table-view-cell">${6:第2个选项卡子项}</li>
            </ul>
        </div>
    </div>
</div>$0'
end
  
snippet 'mPagination(分页)' do |cmd|
    cmd.trigger = 'mpagination'
    cmd.expansion = "<ul class=\"mui-pagination\">
    <li class=\"mui-disabled\">
        <span> &laquo; </span>
    </li>
    <li class=\"mui-active\">
        <a href=\"#\">${1:1}</a>
    </li>
    <li>
        <a href=\"#\">${2:2}</a>
    </li>
    <li>
        <a href=\"#\">&raquo;</a>
    </li>
</ul>$0"
end
  
snippet 'mList(列表)' do |cmd|
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
                 ${2:Item 2}
            </a>
        </li>
        <li class=\"mui-table-view-cell\">
            <a class=\"mui-navigate-right\">
                 ${3:Item 3}
            </a>
        </li>
    </ul>
</div>$0"
end
  
snippet 'mListMedia(图文列表图片居左)' do |cmd|
    cmd.trigger = 'mlist_Media_left'
    cmd.needApplyReContentAssist = true 
    cmd.expansion = "<ul class=\"mui-table-view\">
    <li class=\"mui-table-view-cell mui-media\">
        <a href=\"javascript:;\">
            <img class=\"mui-media-object mui-pull-left\" src=\"$1\">
            <div class=\"mui-media-body\">
                ${4:幸福}
                <p class=\"mui-ellipsis\">${5:能和心爱的人一起睡觉，是件幸福的事情；可是，打呼噜怎么办？}</p>
            </div>
        </a>
    </li>
    <li class=\"mui-table-view-cell mui-media\">
        <a href=\"javascript:;\">
            <img class=\"mui-media-object mui-pull-left\" src=\"$2\">
            <div class=\"mui-media-body\">
                ${6:木屋}
                <p class=\"mui-ellipsis\">${7:想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖.}</p>
            </div>
        </a>
    </li>
    <li class=\"mui-table-view-cell mui-media\">
        <a href=\"javascript:;\">
            <img class=\"mui-media-object mui-pull-left\" src=\"$3\">
            <div class=\"mui-media-body\">
               ${8: CBD}
                <p class=\"mui-ellipsis\">${9:烤炉模式的城，到黄昏，如同打翻的调色盘一般.}</p>
            </div>
        </a>
    </li>
</ul>$0"
end

snippet 'mListMedia(图文列表图片居右)' do |cmd|
    cmd.trigger = 'mlist_Media_right'
    cmd.needApplyReContentAssist = true 
    cmd.expansion = "<ul class=\"mui-table-view\">
    <li class=\"mui-table-view-cell mui-media\">
        <a href=\"javascript:;\">
            <img class=\"mui-media-object mui-pull-right\" src=\"$1\">
            <div class=\"mui-media-body\">
                ${4:幸福}
                <p class=\"mui-ellipsis\">${5:能和心爱的人一起睡觉，是件幸福的事情；可是，打呼噜怎么办？}</p>
            </div>
        </a>
    </li>
    <li class=\"mui-table-view-cell mui-media\">
        <a href=\"javascript:;\">
            <img class=\"mui-media-object mui-pull-right\" src=\"$2\">
            <div class=\"mui-media-body\">
                ${6:木屋}
                <p class=\"mui-ellipsis\">${7:想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖.}</p>
            </div>
        </a>
    </li>
    <li class=\"mui-table-view-cell mui-media\">
        <a href=\"javascript:;\">
            <img class=\"mui-media-object mui-pull-right\" src=\"$3\">
            <div class=\"mui-media-body\">
               ${8: CBD}
                <p class=\"mui-ellipsis\">${9:烤炉模式的城，到黄昏，如同打翻的调色盘一般.}</p>
            </div>
        </a>
    </li>
</ul>$0"
end

snippet 'mGrid(九宫格)' do |cmd|
    cmd.trigger = 'mgrid'
    cmd.expansion = "<div class=\"mui-card\">
    <ul class=\"mui-table-view mui-grid-view mui-grid-9\">
        <li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
            <a href=\"#\">
                <span class=\"mui-icon mui-icon-home\"></span>
                <div class=\"mui-media-body\">${1:Home}</div>
            </a>
        </li>
        <li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
            <a href=\"#\">
                <span class=\"mui-icon mui-icon-email\"><span class=\"mui-badge mui-badge-red\">5</span></span>
                <div class=\"mui-media-body\">${2:Email}</div>
            </a>
        </li>
        <li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
            <a href=\"#\">
                <span class=\"mui-icon mui-icon-chatbubble\"></span>
                <div class=\"mui-media-body\">${3:Chat}</div>
            </a>
        </li>
        <li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
            <a href=\"#\">
                <span class=\"mui-icon mui-icon-location\"></span>
                <div class=\"mui-media-body\">${4:Location}</div>
            </a>
        </li>
        <li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
            <a href=\"#\">
                <span class=\"mui-icon mui-icon-search\"></span>
                <div class=\"mui-media-body\">${5:Search}</div>
            </a>
        </li>
        <li class=\"mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3\">
            <a href=\"#\">
                <span class=\"mui-icon mui-icon-phone\"></span>
                <div class=\"mui-media-body\">${6:Phone}</div>
            </a>
        </li>
    </ul>
</div>$0"
end
  
snippet 'mGallery-Table(图文表格)' do |cmd|
    cmd.needApplyReContentAssist = true 
    cmd.trigger = 'mgallerytable'
    cmd.expansion = "<ul class=\"mui-table-view mui-grid-view\">
    <li class=\"mui-table-view-cell mui-media mui-col-xs-6\">
        <a href=\"#\">
            <img class=\"mui-media-object\" src=\"http://placehold.it/400x300\">
            <div class=\"mui-media-body\">${1:文字说明1}</div>
        </a>
    </li>
    <li class=\"mui-table-view-cell mui-media mui-col-xs-6\">
        <a href=\"#\">
            <img class=\"mui-media-object\" src=\"http://placehold.it/400x300\">
            <div class=\"mui-media-body\">${2:文字说明2}</div>
        </a>
    </li>
</ul>$0"
end
  
snippet 'mGallery图片轮播' do |cmd|
    cmd.needApplyReContentAssist = true 
    cmd.trigger = 'mgallery'
    cmd.expansion = "<div class=\"mui-slider\">
    <div class=\"mui-slider-group\">
        <div class=\"mui-slider-item\">
            <a href=\"#\">
                <img src=\"$1\">
                <p class=\"mui-slider-title\">${3:文字说明1}</p>
            </a>
        </div>
        <div class=\"mui-slider-item\">
            <a href=\"#\">
                <img src=\"$2\">
                <p class=\"mui-slider-title\">${4:文字说明2}</p>
            </a>
        </div>
    </div>
    <div class=\"mui-slider-indicator\">
        <div class=\"mui-indicator mui-active\"></div>
        <div class=\"mui-indicator\"></div>
    </div>
</div>$0"
end
  
snippet 'mactionsheet（操作表）' do |cmd|
    cmd.trigger = 'actionsheet'
    cmd.expansion = "<div id=\"sheet1\" class=\"mui-popover mui-popover-bottom mui-popover-action \">
    <!-- 可选择菜单 -->
    <ul class=\"mui-table-view\">
      <li class=\"mui-table-view-cell\">
        <a href=\"#\">${1菜单1}</a>
      </li>
      <li class=\"mui-table-view-cell\">
        <a href=\"#\">${2菜单2}</a>
      </li>
    </ul>
    <!-- 取消菜单 -->
    <ul class=\"mui-table-view\">
      <li class=\"mui-table-view-cell\">
        <a href=\"#sheet1\"><b>${3取消}</b></a>
      </li>
    </ul>
</div>$0"
end

snippet 'maccordion（折叠面板）' do |cmd|
    cmd.trigger = 'maccordion'
    cmd.expansion = '<ul class="mui-table-view">
    <li class="mui-table-view-cell mui-collapse">
        <a class="mui-navigate-right" href="#">${1:面板1}</a>
        <div class="mui-collapse-content">
            <p>${2:面板1子内容}</p>
        </div>
    </li>
    <li class="mui-table-view-cell mui-collapse">
        <a class="mui-navigate-right" href="#">${3:面板}</a>
            <div class="mui-collapse-content">
            <p>${4:面板2子内容}</p>
        </div>
    </li>
    <li class="mui-table-view-cell mui-collapse">
        <a class="mui-navigate-right" href="#">${5:面板3}</a>
        <div class="mui-collapse-content">
            <p>${6:面板3子内容}</p>
        </div>
    </li>
</ul>$0'
end

snippet 'mnumbox(数字输入框)' do |cmd|
    cmd.trigger = 'mnumbox'
    cmd.expansion = "<div class=\"mui-numbox\" data-numbox-step=\'${1:1}\' data-numbox-min=\'${2:0}\' data-numbox-max=\'${3:10}\'>
  <button class=\"mui-btn mui-numbox-btn-minus\" type=\"button\">-</button>
  <input class=\"mui-numbox-input\" type=\"number\" />
  <button class=\"mui-btn mui-numbox-btn-plus\" type=\"button\">+</button>
</div>$0"
end
snippet 'mrefreshContainer(刷新容器)' do |cmd|
    cmd.trigger = 'mrefresh'
    cmd.expansion = "<!--下拉刷新容器-->
<div id=\"refreshContainer\" class=\"mui-content mui-scroll-wrapper\">
  <div class=\"mui-scroll\">
    <!--数据列表-->
    <ul class=\"mui-table-view mui-table-view-chevron\">
      $0
    </ul>
  </div>
</div>"
end
 
snippet 'mButton(按钮)' do |cmd|
    cmd.trigger = 'mbutton'
    cmd.expansion = "<button type=\"button\" class=\"mui-btn ${1:mui-btn-blue/mui-btn-green/mui-btn-yellow/mui-btn-red/mui-btn-purple/mui-btn-grey}\">${2:按钮}</button>$0"
end
snippet 'mButton(按钮无底色,有边框)' do |cmd|
    cmd.trigger = 'mbutton_outline'
    cmd.expansion = "<button type=\"button\" class=\"mui-btn ${1:mui-btn-blue/mui-btn-green/mui-btn-yellow/mui-btn-red/mui-btn-purple/mui-btn-grey} mui-btn-outlined\">${2:按钮}</button>$0"
end
  
end

  