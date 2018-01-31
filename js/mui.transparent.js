(function($, window) {
    var CLASS_ACTIVE = $.className('active');
    var rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;
    var getColor = function(colorStr) {
        var matches = colorStr.match(rgbaRegex);
        if (matches && matches.length === 5) {
            return [
                matches[1],
                matches[2],
                matches[3],
                matches[4]
            ];
        }
        return [];
    };
    var Transparent = function(element, options) {
        this.element = element;
        this.options = $.extend({
            top: 0, //距离顶部高度(到达该高度即触发)
            offset: 150, //滚动透明距离
            duration: 16, //过渡时间
            scrollby: window//监听滚动距离容器
        }, options || {});

        this.scrollByElem = this.options.scrollby || window;
        if (!this.scrollByElem) {
            throw new Error("监听滚动的元素不存在");
        }
        this.isNativeScroll = false;
        if (this.scrollByElem === window) {
            this.isNativeScroll = true;
        } else if (!~this.scrollByElem.className.indexOf($.className('scroll-wrapper'))) {
            this.isNativeScroll = true;
        }

        this._style = this.element.style;
        this._bgColor = this._style.backgroundColor;
        var color = getColor(mui.getStyles(this.element, 'backgroundColor'));
        if (color.length) {
            this._R = color[0];
            this._G = color[1];
            this._B = color[2];
            this._A = parseFloat(color[3]);
            this.lastOpacity = this._A;
            this._bufferFn = $.buffer(this.handleScroll, this.options.duration, this);
            this.initEvent();
        } else {
            throw new Error("元素背景颜色必须为RGBA");
        }
    };

    Transparent.prototype.initEvent = function() {
        this.scrollByElem.addEventListener('scroll', this._bufferFn);
        if (this.isNativeScroll) { //原生scroll
            this.scrollByElem.addEventListener($.EVENT_MOVE, this._bufferFn);
        }
    }
    Transparent.prototype.handleScroll = function(e) {
        var y = window.scrollY;
        if (!this.isNativeScroll && e && e.detail) {
            y = -e.detail.y;
        }
        var opacity = (y - this.options.top) / this.options.offset + this._A;
        opacity = Math.min(Math.max(this._A, opacity), 1);
        this._style.backgroundColor = 'rgba(' + this._R + ',' + this._G + ',' + this._B + ',' + opacity + ')';
        if (opacity > this._A) {
            this.element.classList.add(CLASS_ACTIVE);
        } else {
            this.element.classList.remove(CLASS_ACTIVE);
        }
        if (this.lastOpacity !== opacity) {
            $.trigger(this.element, 'alpha', {
                alpha: opacity
            });
            this.lastOpacity = opacity;
        }
    };
    Transparent.prototype.destory = function() {
        this.scrollByElem.removeEventListener('scroll', this._bufferFn);
        this.scrollByElem.removeEventListener($.EVENT_MOVE, this._bufferFn);
        this.element.style.backgroundColor = this._bgColor;
        this.element.mui_plugin_transparent = null;
    };
    $.fn.transparent = function(options) {
        options = options || {};
        var transparentApis = [];
        this.each(function() {
            var transparentApi = this.mui_plugin_transparent;
            if (!transparentApi) {
                var top = this.getAttribute('data-top');
                var offset = this.getAttribute('data-offset');
                var duration = this.getAttribute('data-duration');
                var scrollby = this.getAttribute('data-scrollby');
                if (top !== null && typeof options.top === 'undefined') {
                    options.top = top;
                }
                if (offset !== null && typeof options.offset === 'undefined') {
                    options.offset = offset;
                }
                if (duration !== null && typeof options.duration === 'undefined') {
                    options.duration = duration;
                }
                if (scrollby !== null && typeof options.scrollby === 'undefined') {
                    options.scrollby = document.querySelector(scrollby) || window;
                }
                transparentApi = this.mui_plugin_transparent = new Transparent(this, options);
            }
            transparentApis.push(transparentApi);
        });
        return transparentApis.length === 1 ? transparentApis[0] : transparentApis;
    };
    $.ready(function() {
        $($.classSelector('.bar-transparent')).transparent();
    });
})(mui, window);