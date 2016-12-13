/**
 * Button
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {
    var CLASS_ICON = $.className('icon');
    var CLASS_DISABLED = $.className('disabled');

    var STATE_RESET = 'reset';
    var STATE_LOADING = 'loading';

    var defaultOptions = {
        loadingText: 'Loading...', //文案
        loadingIcon: $.className('spinner') + ' ' + $.className('spinner-white'), //图标，可为空
        loadingIconPosition: 'left' //图标所处位置，仅支持left|right
    };

    var Button = function(element, options) {
        this.element = element;
        this.options = $.extend({}, defaultOptions, options);
        if (!this.options.loadingText) {
            this.options.loadingText = defaultOptions.loadingText;
        }
        if (this.options.loadingIcon === null) {
            this.options.loadingIcon = $.className('spinner');
            if ($.getStyles(this.element, 'color') === 'rgb(255, 255, 255)') {
                this.options.loadingIcon += ' ' + $.className('spinner-white');
            }
        }
        this.isInput = this.element.tagName === 'INPUT';
        this.resetHTML = this.isInput ? this.element.value : this.element.innerHTML;
        this.state = '';
    };
    Button.prototype.loading = function() {
        this.setState(STATE_LOADING);
    };
    Button.prototype.reset = function() {
        this.setState(STATE_RESET);
    };
    Button.prototype.setState = function(state) {
        if (this.state === state) {
            return false;
        }
        this.state = state;
        if (state === STATE_RESET) {
            this.element.disabled = false;
            this.element.classList.remove(CLASS_DISABLED);
            this.setHtml(this.resetHTML);
        } else if (state === STATE_LOADING) {
            this.element.disabled = true;
            this.element.classList.add(CLASS_DISABLED);
            var html = this.isInput ? this.options.loadingText : ('<span>' + this.options.loadingText + '</span>');
            if (this.options.loadingIcon && !this.isInput) {
                if (this.options.loadingIconPosition === 'right') {
                    html += '&nbsp;<span class="' + this.options.loadingIcon + '"></span>';
                } else {
                    html = '<span class="' + this.options.loadingIcon + '"></span>&nbsp;' + html;
                }
            }
            this.setHtml(html);
        }
    };
    Button.prototype.setHtml = function(html) {
        if (this.isInput) {
            this.element.value = html;
        } else {
            this.element.innerHTML = html;
        }
    }
    $.fn.button = function(state) {
        var buttonApis = [];
        this.each(function() {
            var buttonApi = this.mui_plugin_button;
            if (!buttonApi) {
                var loadingText = this.getAttribute('data-loading-text');
                var loadingIcon = this.getAttribute('data-loading-icon');
                var loadingIconPosition = this.getAttribute('data-loading-icon-position');
                this.mui_plugin_button = buttonApi = new Button(this, {
                    loadingText: loadingText,
                    loadingIcon: loadingIcon,
                    loadingIconPosition: loadingIconPosition
                });
            }
            if (state === STATE_LOADING || state === STATE_RESET) {
                buttonApi.setState(state);
            }
            buttonApis.push(buttonApi);
        });
        return buttonApis.length === 1 ? buttonApis[0] : buttonApis;
    };
})(mui, window, document);