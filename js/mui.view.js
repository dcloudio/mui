/**
 * <div class=“mui-views">
	<div class=“mui-view">
		<div class=“mui-navbar">
			<div class=“mui-navbar-inner”>
				<div class=“mui-navbar-left”></div>
			        <div class=“mui-navbar-center”></div>
		        	<div class=“mui-navbar-right”></div>
			 </div>
			<div class=“mui-navbar-inner”>
				<div class=“mui-navbar-left”></div>
			        <div class=“mui-navbar-center”></div>
		        	<div class=“mui-navbar-right”></div>
			 </div>
		</div>
		<div class=“mui-pages”>
		     <div class=“mui-page”>
				<div class=“mui-page-content"></div>
			 </div>
		        <div class=“mui-page”>
				<div class=“mui-page-content"></div>
			 </div>
		</div>
	</div>
</div>
 * @param {Object} $
 * @param {Object} window
 */
(function($, window) {
	var CLASS_PAGE_LEFT = $.className('page-left');
	var CLASS_PAGE_CENTER = $.className('page-center');

	var CLASS_TRANSITIONING = $.className('transitioning');

	var SELECTOR_NAVBAR = $.classSelector('.navbar');
	var SELECTOR_PAGES = $.classSelector('.pages');
	var SELECTOR_PAGE_LEFT = '.' + CLASS_PAGE_LEFT;
	var SELECTOR_PAGE_CENTER = '.' + CLASS_PAGE_CENTER;

	var View = $.Class.extend({
		init: function(element, options) {
			this.view = this.element;

			this.options = $.extend({
				swipeBackPageActiveArea: 30,
				hardwareAccelerated: true
			}, options);

			this.navbars = this.querySelector(SELECTOR_NAVBAR);
			this.pages = this.querySelector(SELECTOR_PAGES);

			this.maxScrollX = this.view.offsetWidth;
			this.x = this.y = 0;
			this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';
			this.moved = this.dragging = false;
			this.activePage = this.previousPage = null;

			this.initEvent();
		},
		initEvent: function() {
			this.view.addEventListener('drag', this);
			this.view.addEventListener('dragend', this);
		},
		handleEvent: function(event) {
			switch (e.type) {
				case 'drag':
					this._drag(event);
					break;
				case 'dragend':
					this._dragend(event);
					break;
			}
		},
		_drag: function(event) {
			var detail = event.detail;
			if (!this.dragging) {
				if ((detail.start.x - this.view.offsetLeft) < this.options.swipeBackPageActiveArea) {
					this.previousPage = this.pages.querySelector(SELECTOR_PAGE_LEFT);
					this.activePage = this.pages.querySelector(SELECTOR_PAGE_CENTER);
					this.previousPageStyle = this.previousPage.style;
					this.activePageStyle = this.activePage.style;

					this.previousPage.classList.remove(CLASS_TRANSITIONING);
					this.activePage.classList.remove(CLASS_TRANSITIONING);

					if (this.previousPage && this.activePage) {
						this.dragging = true;
						$.gestures.session.lockDirection = true; //锁定方向
						$.gestures.session.startDirection = detail.direction;
					}
				}
			}
			if (this.dragging) {
				var deltaX = 0;
				if (!this.moved) { //start
					deltaX = detail.deltaX;
				} else { //move
					deltaX = detail.deltaX - detail.lastDeltaX;
				}

				var newX = this.x + deltaX;

				if (newX > 0 || newX < this.maxScrollX) {
					newX = newX > 0 ? 0 : this.maxScrollX;
				}

				event.stopPropagation();
				detail.gesture.preventDefault();

				if (!this.requestAnimationFrame) {
					this._updateTranslate();
				}

				this.moved = true;
				this.x = newX;
				this.y = 0;
			}
		},
		_dragend: function(event) {
			if (!this.dragging) {
				this.dragging = this.moved = false;

				event.stopPropagation();

				var detail = event.detail;

				this._clearRequestAnimationFrame();

				this.previousPage.classList.add(CLASS_TRANSITIONING);
				this.activePage.classList.add(CLASS_TRANSITIONING);



				return;
			}
		},
		_clearRequestAnimationFrame: function() {
			if (this.requestAnimationFrame) {
				cancelAnimationFrame(this.requestAnimationFrame);
				this.requestAnimationFrame = null;
			}
		},
		_getTranslateStr: function(x, y) {
			if (this.options.hardwareAccelerated) {
				return 'translate3d(' + x + 'px,' + y + 'px,0px) ' + this.translateZ;
			}
			return 'translate(' + x + 'px,' + y + 'px) ';
		},

		_updateTranslate: function() {
			var self = this;
			if (self.x !== self.lastX || self.y !== self.lastY) {
				self.setTranslate(self.x, self.y);
			}
			self.requestAnimationFrame = requestAnimationFrame(function() {
				self._updateTranslate();
			});
		},
		setTranslate: function(x, y) {
			this.x = x;
			this.y = y;
			this.previousPageStyle['webkitTransform'] = this._getTranslateStr(x, y);
			this.activePageStyle['webkitTransform'] = this._getTranslateStr(x, y);

			if (this.navbars) {
				this.navbars.setTranslate(x, y);
			}
			this.lastX = this.x;
			this.lastY = this.y;
		},
	});
})(mui, window);