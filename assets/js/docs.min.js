$(function() {
		"use strict";
		var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r = function() {
				l = 0, m = [], n = $(window), a = $(document), o = $(document.body), b = b || $(".js-device"), h = $(".js-jump-menu"), i = $(".js-component-group"), j = $(".component-example a"), k = $(".component"), m = k.map(function() {
					return $(this).offset().top
				}), d = $(window).height() / 3, c = $(window).width(), e = $(document).height(), f = parseInt($(".docs-content").css("padding-bottom"), 10), g = $(".docs-footer").outerHeight(!1), q = $(".js-docs-component-toolbar"), c >= 768 && b.offset() && (b.initialLeft = b.offset().left, b.initialTop = b.initialTop || b.offset().top, b.dockingOffset = ($(window).height() - b.height()) / 2), t(), u(), v(), p || s()
			},
			s = function() {
				p = !0, b.on("click", function(a) {
					//a.preventDefault()
				}), $(".js-docs-nav-trigger").on("click", function() {
					var a = $(".docs-nav-group"),
						b = $(".js-docs-nav-trigger");
					b.toggleClass("mui-active"), a.toggleClass("mui-active")
				}), h.click(function(a) {
					a.stopPropagation(), a.preventDefault(), i.toggleClass("mui-active")
				}), a.on("click", function() {
					i.removeClass("mui-active")
				}), $(".platform-switch").on("click", function() {
					var a = $(".docs-components"),
						b = $(this).attr("data-platform");
					a.hasClass("platform-ios") ? (a.removeClass("platform-ios"), a.addClass(b)) : a.hasClass("platform-android") ? (a.removeClass("platform-android"), a.addClass(b)) : a.addClass(b), $(this).siblings(".mui-active").removeClass("mui-active"), $(this).addClass("mui-active")
				}), n.on("scroll", u), n.on("scroll", v)
			},
			t = function() {
				if (c = $(window).width(), 768 >= c) {
					var a = $(".mui-content");
					a.length > 1 && $(a[0]).remove()
				}
			},
			u = function() {
				function a(a) {
					var iwindow = document.getElementById("iwindow");
					$(iwindow).html(a);
					//slider
					var slider = mui(mui.classSelector('.slider'), iwindow);
					if (slider.length === 1) {
						slider.slider();
						//slider-switch
						var sliderSwitch = document.getElementById("slider_switch");
						if (sliderSwitch) {
							sliderSwitch.addEventListener('toggle', function(e) {
								if (e.detail.isActive) {
									slider.slider({
										interval: 3000
									});
								} else {
									slider.slider({
										interval: 0
									});
								}
							});
						}
					}
					//offcanvas
					var offCanvasContainer = iwindow.querySelector('.mui-off-canvas-wrap');
					if (offCanvasContainer) {
						var offCanvasInnerContainer = offCanvasContainer.querySelector('.mui-inner-wrap');
						var offCanvas = mui('#offCanvas', iwindow);
						document.getElementById('offCanvas_switch').addEventListener('toggle', function(event) {
							if (event.detail.isActive) { //整体滑动时，侧滑菜单在inner-wrap内
								offCanvasInnerContainer.insertBefore(offCanvas[0], offCanvasInnerContainer.firstElementChild);
							} else { //仅主内容滑动时，侧滑菜单在off-canvas-wrap内
								offCanvasContainer.insertBefore(offCanvas[0], offCanvasContainer.firstElementChild)
							}
						});
					}

					//input
					mui(mui.classSelector('.input-row input'), iwindow).input();
					//简单处理label点击触发radio或checkbox
					iwindow.addEventListener('tap', function(event) {
						var target = event.target;
						for (; target && target !== document; target = target.parentNode) {
							if (target.tagName && target.tagName === 'LABEL') {
								var parent = target.parentNode;
								if (parent.classList && (parent.classList.contains('mui-radio') || parent.classList.contains('mui-checkbox'))) {
									var input = parent.querySelector('input');
									if (input) {
										input.click();
									}
								}
							}
						}
					});
					//segmented controls
					var segmentedControl = document.getElementById('segmentedControl');
					if (segmentedControl) {
						mui('.mui-input-group', iwindow).on('change', 'input', function() {
							if (this.checked) {
								var styleEl = iwindow.querySelector('input[name="style"]:checked');
								var colorEl = iwindow.querySelector('input[name="color"]:checked');
								if (styleEl && colorEl) {
									var style = styleEl.value;
									var color = colorEl.value;
									segmentedControl.className = 'mui-segmented-control' + (style ? (' mui-segmented-control-' + style) : '') + ' mui-segmented-control-' + color;
								}
							}
						});
					}
					var sliderSegmentedControl = document.getElementById('sliderSegmentedControl');
					if (sliderSegmentedControl) {
						var html2 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第二个选项卡子项-1</li><li class="mui-table-view-cell">第二个选项卡子项-2</li><li class="mui-table-view-cell">第二个选项卡子项-3</li><li class="mui-table-view-cell">第二个选项卡子项-4</li><li class="mui-table-view-cell">第二个选项卡子项-5</li></ul>';
						var html3 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第三个选项卡子项-1</li><li class="mui-table-view-cell">第三个选项卡子项-2</li><li class="mui-table-view-cell">第三个选项卡子项-3</li><li class="mui-table-view-cell">第三个选项卡子项-4</li><li class="mui-table-view-cell">第三个选项卡子项-5</li></ul>';
						var item2 = document.getElementById('item2mobile');
						var item3 = document.getElementById('item3mobile');
						document.getElementById('slider').addEventListener('slide', function(e) {
							if (e.detail.slideNumber === 1) {
								if (item2.querySelector('.mui-loading')) {
									setTimeout(function() {
										item2.innerHTML = html2;
									}, 1000);
								}
							} else if (e.detail.slideNumber === 2) {
								if (item3.querySelector('.mui-loading')) {
									setTimeout(function() {
										item3.innerHTML = html3;
									}, 1000);
								}
							}
						});
						mui('.mui-input-group', iwindow).on('change', 'input', function() {
							if (this.checked) {
								sliderSegmentedControl.className = 'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted mui-segmented-control-' + this.value;
							}
						});
					}
				}
				if (!(768 >= c)) {
					var e, f = n.scrollTop();
					if (b.length) {
						b.initialTop - f <= b.dockingOffset ? (b[0].className = "device device-fixed", b.css({
							top: b.dockingOffset
						})) : (b[0].className = "device", b[0].setAttribute("style", ""));
						for (var g = k.length; g--;)
							if (m[g] - f < d) {
								if (l === g) return;
								l = g, o.find(".component.mui-active").removeClass("mui-active"), e = $(k[g]), e.addClass("mui-active"), e.attr("id") ? b.attr("id", e.attr("id") + "InDevice") : b.attr("id", ""), e.hasClass("informational") || a(e.find(".highlight .language-html").text());
								break
							}
					}
				}
			},
			v = function() {
				var a = n.scrollTop(),
					b = $(".docs-sub-header").outerHeight();
				a >= b ? q.addClass("visible") : b >= a && (q.removeClass("visible"), i.removeClass("mui-active"))
			};
		$(window).on("load resize", r), $(window).on("load", function() {
			window.FingerBlast && new FingerBlast(".device-content")
		})
	}),
	function() {
		"use strict";

		function a(a) {
			this.element = "string" == typeof a ? document.querySelector(a) : a, this.element && this.listen()
		}
		a.prototype = {
			x: 0 / 0,
			y: 0 / 0,
			startDistance: 0 / 0,
			startAngle: 0 / 0,
			mouseIsDown: !1,
			listen: function() {
				function a(a, b) {
					var c, d, e;
					if (a) {
						if ("compareDocumentPosition" in b) return !!(16 & b.compareDocumentPosition(a));
						if ("contains" in b) return b !== a && b.contains(a);
						for (c = b.getElementsByTagName("*"), d = 0; e = c[d++];)
							if (e === a) return !0;
						return !1
					}
				}
				var b = this.activate.bind(this),
					c = this.deactivate.bind(this);
				this.element.addEventListener("mouseover", function(c) {
					var d = c.relatedTarget;
					d === this || a(d, this) || b()
				}), this.element.addEventListener("mouseout", function(b) {
					var d = b.relatedTarget;
					d === this || a(d, this) || c(b)
				})
			},
			activate: function() {
				this.active || (this.element.addEventListener("mousedown", this.touchStart = this.touchStart.bind(this), !0), this.element.addEventListener("mousemove", this.touchMove = this.touchMove.bind(this), !0), this.element.addEventListener("mouseup", this.touchEnd = this.touchEnd.bind(this), !0), this.element.addEventListener("click", this.click = this.click.bind(this), !0), this.active = !0)
			},
			deactivate: function(a) {
				this.active = !1, this.mouseIsDown && this.touchEnd(a), this.element.removeEventListener("mousedown", this.touchStart, !0), this.element.removeEventListener("mousemove", this.touchMove, !0), this.element.removeEventListener("mouseup", this.touchEnd, !0), this.element.removeEventListener("click", this.click, !0)
			},
			click: function(a) {
				if (/input|textarea/.test(a.target.tagName.toLowerCase())) {
					if (a.synthetic) {
						a.preventDefault(), a.stopPropagation()
					}
				} else {
					a.synthetic || (a.preventDefault(), a.stopPropagation())
				}
			},
			touchStart: function(a) {
				a.synthetic || /input|textarea/.test(a.target.tagName.toLowerCase()) || (this.mouseIsDown = !0, a.preventDefault(), a.stopPropagation(), this.fireTouchEvents("touchstart", a))
			},
			touchMove: function(a) {
				a.synthetic || (a.preventDefault(), a.stopPropagation(), this.move(a.clientX, a.clientY), this.mouseIsDown && this.fireTouchEvents("touchmove", a))
			},
			touchEnd: function(a) {
				a.synthetic || (this.mouseIsDown = !1, a.preventDefault(), a.stopPropagation(), this.fireTouchEvents("touchend", a), this.target && (this.target.dispatchEvent(this.createMouseEvent("mouseover", a)), this.target.dispatchEvent(this.createMouseEvent("mousemove", a)), this.target.dispatchEvent(this.createMouseEvent("mousedown", a))))
			},
			fireTouchEvents: function(a, b) {
				var c = [],
					d = [];
				if (this.target) {
					var e = "on" + a;
					if (e in this.target && (console.warn("Converting `" + e + "` property to event listener.", this.target), this.target.addEventListener(a, this.target[e], !1), delete this.target[e]), this.target.hasAttribute(e)) {
						console.warn("Converting `" + e + "` attribute to event listener.", this.target);
						var f = new GLOBAL.Function("event", this.target.getAttribute(e));
						this.target.addEventListener(a, f, !1), this.target.removeAttribute(e)
					}
					var g = this.createMouseEvent(a, b);
					if (c.push(g), c.length > 1) {
						var h = c[0].pageX - c[1].pageX,
							i = c[0].pageY - c[1].pageY,
							j = Math.sqrt(Math.pow(h, 2) + Math.pow(i, 2)),
							k = Math.atan2(h, i) * (180 / Math.PI),
							l = "gesturechange";
						"touchstart" === a && (l = "gesturestart", this.startDistance = j, this.startAngle = k), "touchend" === a && (l = "gestureend"), c.forEach(function(a) {
							var b = this.createMouseEvent.call(a._finger, l, a);
							d.push(b)
						}.bind(this)), c.concat(d).forEach(function(a) {
							a.scale = j / this.startDistance, a.rotation = this.startAngle - k
						})
					}
					c.forEach(function(a) {
						a.touches = c.filter(function(a) {
							return ~a.type.indexOf("touch") && "touchend" !== a.type
						}), a.changedTouches = c.filter(function(b) {
							return ~b.type.indexOf("touch") && b._finger.target === a._finger.target
						}), a.targetTouches = a.changedTouches.filter(function(a) {
							return ~a.type.indexOf("touch") && "touchend" !== a.type
						})
					}), c.concat(d).forEach(function(a, b) {
						a.identifier = b, a._finger.target.dispatchEvent(a)
					})
				}
			},
			createMouseEvent: function(a, b) {
				var c = new MouseEvent(a, {
					view: window,
					detail: b.detail,
					bubbles: !0,
					cancelable: !0,
					target: this.target || b.relatedTarget,
					clientX: this.x || b.clientX,
					clientY: this.y || b.clientY,
					screenX: this.x || b.screenX,
					screenY: this.y || b.screenY,
					ctrlKey: b.ctrlKey,
					shiftKey: b.shiftKey,
					altKey: b.altKey,
					metaKey: b.metaKey,
					button: b.button
				});
				return c.synthetic = !0, c._finger = this, c
			},
			move: function(a, b) {
				isNaN(a) || isNaN(b) ? this.target = null : (this.x = a, this.y = b, this.mouseIsDown || (this.target = document.elementFromPoint(a, b)))
			}
		}, window.FingerBlast = a
	}();