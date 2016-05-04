/**
 * <div id="app" class="mui-views">
	<div class="mui-view">
		<div class="mui-navbar">
		</div>
		<div class="mui-pages">
		</div>
	</div>
</div>
 * @param {Object} $
 * @param {Object} window
 */
(function($, window) {
	var CLASS_LEFT = $.className('left');
	var CLASS_CENTER = $.className('center');
	var CLASS_RIGHT = $.className('right');
	var CLASS_PAGE = $.className('page');
	var CLASS_PAGE_LEFT = $.className('page-left');
	var CLASS_PAGE_CENTER = $.className('page-center');
	var CLASS_NAVBAR_LEFT = $.className('navbar-left');
	var CLASS_NAVBAR_CENTER = $.className('navbar-center');
	var CLASS_PAGE_SHADOW = $.className('page-shadow');

	var CLASS_TRANSITIONING = $.className('transitioning');

	var SELECTOR_LEFT = '.' + CLASS_LEFT;
	var SELECTOR_CENTER = '.' + CLASS_CENTER;
	var SELECTOR_RIGHT = '.' + CLASS_RIGHT;

	var SELECTOR_ICON = $.classSelector('.icon');
	var SELECTOR_NAVBAR = $.classSelector('.navbar');
	var SELECTOR_NAVBAR_INNER = $.classSelector('.navbar-inner');
	var SELECTOR_PAGES = $.classSelector('.pages');
	var SELECTOR_BTN_NAV = $.classSelector('.btn-nav');
	var SELECTOR_PAGE_LEFT = '.' + CLASS_PAGE_LEFT;
	var SELECTOR_PAGE_CENTER = '.' + CLASS_PAGE_CENTER;
	var SELECTOR_NAVBAR_LEFT = '.' + CLASS_NAVBAR_LEFT;
	var SELECTOR_NAVBAR_CENTER = '.' + CLASS_NAVBAR_CENTER;

	var View = $.Class.extend({
		init: function(element, options) {
			this.view = this.element = element;
			this.options = $.extend({
				animateNavbar: 'ios', //ios
				swipeBackPageActiveArea: 30,
				hardwareAccelerated: true
			}, options);
			this.navbars = this.view.querySelector(SELECTOR_NAVBAR);
			this.pages = this.view.querySelector(SELECTOR_PAGES);

			this.history = []; //history

			this.maxScrollX = this.view.offsetWidth;
			this.x = this.y = 0;
			this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';
			this.ratio = 0;
			this.isBack = true;
			this.moved = this.dragging = false;

			this.activeNavbar = this.previousNavbar = null;
			this.activePage = this.previousPage = null;

			this._initPageEventMethod();

			this._initDefaultPage();

			this.navbars && this._initNavBar();

			this.initEvent();
		},
		_initPageEventMethod: function() {
			var self = this;
			$.each(['onPageBeforeShow', 'onPageShow', 'onPageBeforeBack', 'onPageBack'], function(index, event) {
				self[event + 'Callbacks'] = {};
				self[event] = function(page, callback) {
					var eventCallbacks = event + 'Callbacks';
					if (!self[eventCallbacks].hasOwnProperty(page)) {
						self[eventCallbacks][page] = [callback];
					} else {
						self[eventCallbacks][page].push(callback);
					}
				};
			});
		},
		_initDefaultPage: function() {
			var defaultPage = document.querySelector(this.options.defaultPage);
			if (defaultPage) {
				this._appendPage(defaultPage);
			} else {
				throw new Error('defaultPage[' + this.options.defaultPage + '] does not exist');
			}
		},
		initEvent: function() {
			this.view.addEventListener('click', this);
			this.view.addEventListener('tap', this);
			this.pages.addEventListener('drag', this);
			this.pages.addEventListener('dragend', this);
			this.pages.addEventListener('webkitTransitionEnd', this);
		},
		handleEvent: function(event) {
			switch (event.type) {
				case 'click':
					this._click(event);
					break;
				case 'tap':
					this._tap(event);
					break;
				case 'drag':
					this._drag(event);
					break;
				case 'dragend':
					this._dragend(event);
					break;
				case 'webkitTransitionEnd':
					this._webkitTransitionEnd(event);
					break;
			}
		},
		shadow: function() {
			var shadow = document.createElement('div');
			shadow.className = CLASS_PAGE_SHADOW;
			return shadow;
		}(),
		_removePage: function(page, navbar) {
			navbar && this._removeNavbar(page, navbar);
			document.body.appendChild(page);
			this._cleanPageClass(page);
		},
		_prependPage: function(page) {
			var navbar = page.querySelector(SELECTOR_NAVBAR_INNER);
			navbar && this._prependNavbar(navbar);
			page.classList.add(CLASS_PAGE_LEFT);
			this.pages.insertBefore(page, this.pages.firstElementChild);
		},
		_appendPage: function(page) {
			var navbar = page.querySelector(SELECTOR_NAVBAR_INNER);
			navbar && this._appendNavbar(navbar);
			page.classList.add(CLASS_PAGE_CENTER);
			this.pages.appendChild(page);
		},
		_removeNavbar: function(page, navbar) {
			page.insertBefore(navbar, page.firstElementChild);
			this._cleanNavbarClass(navbar);
		},
		_prependNavbar: function(navbar) {
			navbar.classList.add(CLASS_NAVBAR_LEFT);
			this.navbars.insertBefore(navbar, this.navbars.firstElementChild);
		},
		_appendNavbar: function(navbar) {
			navbar.classList.add(CLASS_NAVBAR_CENTER);
			this.navbars.appendChild(navbar);
		},
		_cleanPageClass: function(page) {
			page.classList.remove(CLASS_PAGE_CENTER);
			page.classList.remove(CLASS_PAGE_LEFT);
		},
		_cleanNavbarClass: function(navbar) {
			navbar.classList.remove(CLASS_NAVBAR_CENTER);
			navbar.classList.remove(CLASS_NAVBAR_LEFT);
		},
		_tap: function(event) {
			var target = event.target;
			for (; target && target !== document; target = target.parentNode) {
				if (target.tagName === 'A' && target.hash) {
					var page = document.getElementById(target.hash.replace('#', ''));
					if (page && page.classList.contains(CLASS_PAGE)) {
						event.stopPropagation();
						event.detail.gesture.preventDefault();
						this.go(target.hash);
						break;
					}
				}
			}
		},
		_click: function(event) {
			var target = event.target;
			for (; target && target !== document; target = target.parentNode) {
				if (target.tagName === 'A' && target.hash) {
					var page = document.getElementById(target.hash.replace('#', ''));
					if (page && page.classList.contains(CLASS_PAGE)) {
						event.preventDefault();
						break;
					}
				}
			}
		},
		_cleanStyle: function(el) {
			if (el) {
				el.style.webkitTransform = '';
				el.style.opacity = '';
			}
		},
		_isAnimateNavbarIOS: function() {
			return !$.os.android && this.options.animateNavbar === 'ios';
		},
		_webkitTransitionEnd: function(event) {
			this.dragging = this.moved = false;
			if (this.activePage !== event.target) {
				return;
			}

			this.isInTransition = false;

			this.shadow.parentNode === this.activePage && this.activePage.removeChild(this.shadow);
			this.previousPageClassList.remove(CLASS_TRANSITIONING);
			this.activePageClassList.remove(CLASS_TRANSITIONING);

			var self = this;
			if (this._isAnimateNavbarIOS() && this.previousNavElements && this.activeNavElements) {
				var isBack = this.isBack;
				$.each(this.previousNavElements, function(i, el) {
					el.classList.remove(CLASS_TRANSITIONING);
					isBack && self._cleanStyle(el);
				});
				$.each(this.activeNavElements, function(i, el) {
					el.classList.remove(CLASS_TRANSITIONING);
					self._cleanStyle(el);
				});
				if (this.previousNavBackIcon) {
					this.previousNavBackIcon.classList.remove(CLASS_TRANSITIONING);
					isBack && this._cleanStyle(this.previousNavBackIcon);
				}
				if (this.activeNavBackIcon) {
					this.activeNavBackIcon.classList.remove(CLASS_TRANSITIONING);
					this._cleanStyle(this.activeNavBackIcon);
				}
			} else {
				this.previousNavbar && this.previousNavbar.classList.remove(CLASS_TRANSITIONING);
				this.activeNavbar && this.activeNavbar.classList.remove(CLASS_TRANSITIONING);
				this._cleanStyle(this.previousNavbar);
				this._cleanStyle(this.activeNavbar);
			}

			this._cleanStyle(this.previousPage);
			this._cleanStyle(this.activePage);

			if (this.ratio <= 0.5) {
				return;
			}
			if (this.isBack) {
				this._removePage(this.activePage, this.activeNavbar);
				this.previousPageClassList.remove(CLASS_PAGE_LEFT);
				this.previousPageClassList.add(CLASS_PAGE_CENTER);
				if (this.previousNavbar) {
					this.previousNavbar.classList.remove(CLASS_NAVBAR_LEFT);
					this.previousNavbar.classList.add(CLASS_NAVBAR_CENTER);
				}
				if (this.history.length > 0) {
					this._prependPage(this.history.pop());
				}
				this.navbars && this._initNavBar();
				this._trigger('pageBack', this.activePage);
				this._trigger('pageShow', this.previousPage);
			} else {
				this.previousPageClassList.add(CLASS_PAGE_LEFT);
				this.activePageClassList.add(CLASS_PAGE_CENTER);
				this._trigger('pageShow', this.activePage);
			}


		},
		_trigger: function(eventType, page) {
			var eventCallbacks = 'on' + eventType.charAt(0).toUpperCase() + eventType.slice(1) + 'Callbacks';
			if (this[eventCallbacks].hasOwnProperty(page.id)) {
				var callbacks = this[eventCallbacks][page.id];
				var event = new CustomEvent(eventType, {
					detail: {
						page: page
					},
					bubbles: true,
					cancelable: true
				});
				for (var len = callbacks.length; len--;) {
					callbacks[len].call(this, event);
				}
			}
			$.trigger(this.view, eventType, {
				page: page
			});
		},
		_initPageTransform: function() {
			this.previousPage = this.pages.querySelector(SELECTOR_PAGE_LEFT);
			this.activePage = this.pages.querySelector(SELECTOR_PAGE_CENTER);
			if (this.previousPage && this.activePage) {
				this.activePage.appendChild(this.shadow);
				this.previousPageClassList = this.previousPage.classList;
				this.activePageClassList = this.activePage.classList;

				this.previousPageStyle = this.previousPage.style;
				this.activePageStyle = this.activePage.style;

				this.previousPageClassList.remove(CLASS_TRANSITIONING);
				this.activePageClassList.remove(CLASS_TRANSITIONING);

				if (this.navbars) {
					this.previousNavbar = this.navbars.querySelector(SELECTOR_NAVBAR_LEFT);
					this.activeNavbar = this.navbars.querySelector(SELECTOR_NAVBAR_CENTER);
					if (this._isAnimateNavbarIOS() && this.previousNavbar && this.activeNavbar) {
						this.previousNavElements = this.previousNavbar.querySelectorAll(SELECTOR_LEFT + ',' + SELECTOR_CENTER + ',' + SELECTOR_RIGHT);
						this.activeNavElements = this.activeNavbar.querySelectorAll(SELECTOR_LEFT + ',' + SELECTOR_CENTER + ',' + SELECTOR_RIGHT);
						this.previousNavBackIcon = this.previousNavbar.querySelector(SELECTOR_LEFT + SELECTOR_BTN_NAV + ' ' + SELECTOR_ICON);
						this.activeNavBackIcon = this.activeNavbar.querySelector(SELECTOR_LEFT + SELECTOR_BTN_NAV + ' ' + SELECTOR_ICON);
					}
				}
				this.x = 0;
				this.dragging = true;
				return true;
			}
			return false;
		},
		_initNavBar: function() {
			if (this._isAnimateNavbarIOS() && this.navbars) {
				var inners = this.navbars.querySelectorAll(SELECTOR_NAVBAR_INNER);
				var inner, left, right, center, leftWidth, rightWidth, centerWidth, noLeft, onRight, currLeft, diff, navbarWidth;
				for (var i = 0, len = inners.length; i < len; i++) {
					inner = inners[i];
					left = inner.querySelector(SELECTOR_LEFT);
					right = inner.querySelector(SELECTOR_RIGHT);
					center = inner.querySelector(SELECTOR_CENTER);
					noLeft = !left;
					noRight = !right;
					leftWidth = noLeft ? 0 : left.offsetWidth;
					rightWidth = noRight ? 0 : right.offsetWidth;
					centerWidth = center ? center.offsetWidth : 0;
					navbarWidth = this.maxScrollX;
					onLeft = inner.classList.contains('navbar-left');
					if (noRight) {
						currLeft = navbarWidth - centerWidth;
					}
					if (noLeft) {
						currLeft = 0;
					}
					if (!noLeft && !noRight) {
						currLeft = (navbarWidth - rightWidth - centerWidth + leftWidth) / 2;
					}
					var requiredLeft = (navbarWidth - centerWidth) / 2;
					if (navbarWidth - leftWidth - rightWidth > centerWidth) {
						if (requiredLeft < leftWidth) {
							requiredLeft = leftWidth;
						}
						if (requiredLeft + centerWidth > navbarWidth - rightWidth) {
							requiredLeft = navbarWidth - rightWidth - centerWidth;
						}
						diff = requiredLeft - currLeft;
					} else {
						diff = 0;
					}

					var centerLeft = diff;
					if (center) {
						center.style.marginLeft = -leftWidth + 'px';
						center.mNavbarLeftOffset = -(currLeft + diff) + 30; //这个30是测出来的。后续要实际计算一下
						center.mNavbarRightOffset = navbarWidth - currLeft - diff - centerWidth;
					}

					if (onLeft) center.style.webkitTransform = ('translate3d(' + center.mNavbarLeftOffset + 'px, 0, 0)');

					if (!noLeft) {
						left.mNavbarLeftOffset = -leftWidth;
						left.mNavbarRightOffset = (navbarWidth - leftWidth) / 2;
						if (onLeft) left.style.webkitTransform = ('translate3d(' + left[0].mNavbarLeftOffset + 'px, 0, 0)');
					}

					if (!noRight) {
						right.mNavbarLeftOffset = -(navbarWidth - rightWidth) / 2;
						right.mNavbarRightOffset = rightWidth;
						if (onLeft) right.style.webkitTransform = ('translate3d(' + right[0].mNavbarLeftOffset + 'px, 0, 0)');
					}

				}
			}
		},
		_drag: function(event) {
			if (this.isInTransition) {
				return;
			}
			var detail = event.detail;
			if (!this.dragging) {
				if (($.gestures.session.firstTouch.center.x - this.view.offsetLeft) < this.options.swipeBackPageActiveArea) {
					this.isBack = true;
					this._initPageTransform();
				}
			}
			if (this.dragging) {
				var deltaX = 0;
				if (!this.moved) { //start
					deltaX = detail.deltaX;
					$.gestures.session.lockDirection = true; //锁定方向
					$.gestures.session.startDirection = detail.direction;
				} else { //move
					deltaX = detail.deltaX - ($.gestures.session.prevTouch && $.gestures.session.prevTouch.deltaX || 0);
				}
				var newX = this.x + deltaX;
				if (newX < 0 || newX > this.maxScrollX) {
					newX = newX < 0 ? 0 : this.maxScrollX;
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
			if (!this.moved) {
				return;
			}

			event.stopPropagation();

			var detail = event.detail;

			this._clearRequestAnimationFrame();

			this._prepareTransition();

			this.ratio = this.x / this.maxScrollX;
			if (this.ratio === 1 || this.ratio === 0) {
				$.trigger(this.activePage, 'webkitTransitionEnd');
				return;
			}
			if (this.ratio > 0.5) {
				this.setTranslate(this.maxScrollX, 0);
			} else {
				this._cleanStyle(this.previousPage);
				this._cleanStyle(this.activePage);
			}
		},
		_prepareTransition: function() {
			this.isInTransition = true;
			this.previousPageClassList.add(CLASS_TRANSITIONING);
			this.activePageClassList.add(CLASS_TRANSITIONING);
			var self = this;
			if (this.previousNavbar && this.activeNavbar) {
				this.previousNavbar.classList.add(CLASS_TRANSITIONING);
				this.activeNavbar.classList.add(CLASS_TRANSITIONING);
				if (this._isAnimateNavbarIOS() && this.previousNavElements && this.activeNavElements) {
					$.each(this.previousNavElements, function(i, el) {
						el.classList.add(CLASS_TRANSITIONING);
						self._cleanStyle(el);
					});
					$.each(this.activeNavElements, function(i, el) {
						el.classList.add(CLASS_TRANSITIONING);
						self._cleanStyle(el);
					});
					if (this.previousNavBackIcon) {
						this._cleanStyle(this.previousNavBackIcon);
						this.previousNavBackIcon.classList.add(CLASS_TRANSITIONING);
					}
					if (this.activeNavBackIcon) {
						this._cleanStyle(this.activeNavBackIcon);
						this.activeNavBackIcon.classList.add(CLASS_TRANSITIONING);
					}
				}
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
		_setNavbarTranslate: function(x, y) {
			var percentage = x / this.maxScrollX;
			//only for ios
			if (this._isAnimateNavbarIOS()) {
				if (this.previousNavElements && this.activeNavElements) {
					this.animateNavbarByIOS(percentage);
				}
			} else { //pop-in
				this.activeNavbar.style.opacity = 1 - percentage * 1.3;
				this.previousNavbar.style.opacity = percentage * 1.3 - 0.3;
			}
		},
		animateNavbarByIOS: function(percentage) {
			var i, len, style, el;
			for (i = 0, len = this.activeNavElements.length; i < len; i++) {
				el = this.activeNavElements[i];
				style = el.style;
				style.opacity = (1 - percentage * (el.classList.contains(CLASS_LEFT) ? 3.5 : 1.3));
				if (!el.classList.contains(CLASS_RIGHT)) {
					var activeNavTranslate = percentage * el.mNavbarRightOffset;
					el.style.webkitTransform = ('translate3d(' + activeNavTranslate + 'px,0,0)');
					if (el.classList.contains(CLASS_LEFT) && this.activeNavBackIcon) {
						this.activeNavBackIcon.style.webkitTransform = ('translate3d(' + -activeNavTranslate + 'px,0,0)');
					}
				}
			}
			for (i = 0, len = this.previousNavElements.length; i < len; i++) {
				el = this.previousNavElements[i];
				style = el.style;
				style.opacity = percentage * 1.3 - 0.3;
				if (!el.classList.contains(CLASS_RIGHT)) {
					var previousNavTranslate = el.mNavbarLeftOffset * (1 - percentage);
					el.style.webkitTransform = ('translate3d(' + previousNavTranslate + 'px,0,0)');
					if (el.classList.contains(CLASS_LEFT) && this.previousNavBackIcon) {
						this.previousNavBackIcon.style.webkitTransform = ('translate3d(' + -previousNavTranslate + 'px,0,0)');
					}
				}
			}
		},
		setTranslate: function(x, y) {
			this.x = x;
			this.y = y;
			this.previousPage.style.opacity = 0.9 + 0.1 * x / this.maxScrollX;
			this.previousPage.style['webkitTransform'] = this._getTranslateStr((x / 6 - this.maxScrollX / 6), y);
			this.activePage.style['webkitTransform'] = this._getTranslateStr(x, y);

			this.navbars && this._setNavbarTranslate(x, y);
			this.lastX = this.x;
			this.lastY = this.y;
		},
		canBack: function() {
			return this.pages.querySelector(SELECTOR_PAGE_LEFT);
		},
		back: function() {
			if (this.isInTransition) {
				return;
			}
			this.isBack = true;
			this.ratio = 1;
			if (this._initPageTransform()) {
				this._trigger('pageBeforeBack', this.activePage);
				this._trigger('pageBeforeShow', this.previousPage);
				this._prepareTransition();
				this.previousPage.offsetHeight;
				this.activePage.offsetHeight;
				this.setTranslate(this.maxScrollX, 0);
			}
		},
		go: function(pageSelector) {
			if (this.isInTransition) {
				return;
			}
			var nextPage = document.querySelector(pageSelector);

			if (nextPage) {
				var previousPage = this.pages.querySelector(SELECTOR_PAGE_LEFT);
				var activePage = this.pages.querySelector(SELECTOR_PAGE_CENTER);
				var previousNavbar;
				var activeNavbar;
				if (this.navbars) {
					previousNavbar = this.navbars.querySelector(SELECTOR_NAVBAR_LEFT);
					activeNavbar = this.navbars.querySelector(SELECTOR_NAVBAR_CENTER);
				}
				if (activeNavbar) {
					activeNavbar.classList.remove(CLASS_NAVBAR_CENTER);
					activeNavbar.classList.add(CLASS_NAVBAR_LEFT);
				}

				if (previousPage) {
					this._removePage(previousPage, previousNavbar);
					this.history.push(previousPage); //add to history
				}

				if (activePage) {
					activePage.classList.remove(CLASS_PAGE_CENTER);
					activePage.style.webkitTransform = 'translate3d(0,0,0)';
					activePage.classList.add(CLASS_PAGE_LEFT);
				}


				nextPage.style.webkitTransform = 'translate3d(100%,0,0)';
				this._appendPage(nextPage);
				nextPage.appendChild(this.shadow); //shadow
				nextPage.offsetHeight; //force
				this.isBack = false;
				this.ratio = 1;

				this._initPageTransform();

				this.navbars && this._initNavBar();

				this.navbars && this._setNavbarTranslate(this.maxScrollX, 0);
				//force
				this.previousPage.offsetHeight;
				this.activePage.offsetHeight;

				if (this.navbars) {
					this.previousNavbar.offsetHeight;
					this.activeNavbar.offsetHeight;
				}

				this._trigger('pageBeforeShow', this.activePage);
				this._prepareTransition();
				this.setTranslate(0, 0);
			}
		}

	});


	$.fn.view = function(options) {
		var self = this[0];
		var viewApi = null;
		var id = self.getAttribute('data-view');
		if (!id) {
			id = ++$.uuid;
			$.data[id] = viewApi = new View(self, options);
			self.setAttribute('data-view', id);
		} else {
			viewApi = $.data[id];
		}
		return viewApi;
	}
})(mui, window);