/* Parallax Banners
 * version: 1.5
 * https://github.com/cuth/parallax-banners
 */
(function (exports, $) {
    "use strict";
    var defaults = {
            allowReverse: false,
            allowStick: false,
            usePositionTop: false,
            offMediaQuery: '',
            activeClassName: '_parallaxed',
            onWindowLoad: false
        },
        $win = $(window),
        winHeight = $win.height(),
        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
        // debounce is taken from _underscore.js
        debounce = function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            return function() {
                context = this;
                args = arguments;
                timestamp = new Date();
                var later = function() {
                    var last = (new Date()) - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) result = func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) result = func.apply(context, args);
                return result;
            };
        },
        updateLayerStyle = function (item, top) {
            if (this.opts.usePositionTop) {
                item.$layer.css('top', top + 'px');
                return;
            }
            item.$layer.css('transform', 'translate3d(0, ' + top + 'px, 0)');
        },
        removeLayerStyle = function (item) {
            if (this.opts.usePositionTop) {
                item.$layer.css('top', '');
                return;
            }
            item.$layer.css('transform', '');
        },
        stick = function (item, scrollTop) {
            updateLayerStyle.call(this, item, scrollTop - item.frameTop);
        },
        reverse = function (item, scrollTop) {
            var animateStart = item.frameTop - winHeight,
                percentageThrough = (scrollTop - animateStart) / (winHeight + item.frameHeight),
                layerTravel = item.layerHeight + item.frameHeight,
                layerTranslate = percentageThrough * layerTravel - item.layerHeight;
            updateLayerStyle.call(this, item, layerTranslate);
        },
        slideWith = function (item, scrollTop) {
            var animateStart = item.frameTop - winHeight,
                percentageThrough = (scrollTop - animateStart) / (winHeight + item.frameHeight),
                speedDifference = (winHeight - item.layerHeight) / (winHeight - item.frameHeight),
                bleed = item.frameHeight * speedDifference,
                realLayerTravel = item.layerHeight + item.frameHeight - bleed * 2,
                layerTranslate = percentageThrough * realLayerTravel - item.layerHeight + bleed;
            updateLayerStyle.call(this, item, layerTranslate);
        },
        calcPos = function (item) {
            var scrollTop = $win.scrollTop();
            item.$frame.css({ 'top': item.frameTop - scrollTop })
            if (scrollTop + winHeight < item.frameTop || scrollTop > item.frameTop + item.frameHeight) return;
            if (item.layerHeight >= winHeight) {
                if (this.opts.allowReverse) {
                    reverse.call(this, item, scrollTop);
                    return;
                }
                if (this.opts.allowStick) {
                    stick.call(this, item, scrollTop);
                    return;
                }
                removeLayerStyle.call(this, item);
                return;
            }
            slideWith.call(this, item, scrollTop);
        },
        calcAllPos = function () {
            var self = this;
            if (this.off) return;
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                calcPos.call(this, this.set[x]);
            }
            if (this.requesting) {
                requestAnimationFrame(function () {
                    calcAllPos.call(self);
                });
            }
        },
        setFixed = function () {
            var self = this;
            if (this.off) return;
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                calcPos.call(this, this.set[x]);
            }
        },
        measure = function () {
            if (this.off) return;
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                this.set[x].frameTop = this.set[x].$placeholder.offset().top;
                this.set[x].frameHeight = this.set[x].$frame.outerHeight();
                this.set[x].layerHeight = this.set[x].$layer.outerHeight();
            }
            winHeight = $win.height();
        },
        turnSwitch = function (off) {
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                if (off) {
                    removeLayerStyle.call(this, this.set[x]);
                    this.set[x].$layer.removeClass(this.opts.activeClassName);
                } else {
                    this.set[x].$layer.addClass(this.opts.activeClassName);
                }
            }
            this.off = off;
        },
        startRequesting = function () {
            var self = this;
            this.requesting = true;
            requestAnimationFrame(function () {
                calcAllPos.call(self);
            });
        },
        killRequesting = debounce(function () {
            this.requesting = false;
        }, 100),
        bindEvents = function () {
            var self = this;
            $win.on('scroll', function () {
                if (!self.requesting) {
                    startRequesting.call(self);
                }
                killRequesting.call(self);
            });
            $win.on('resize', function () {
                measure.call(self);
                if (!self.requesting) {
                    startRequesting.call(self);
                }
                killRequesting.call(self);
            });
            if (this.opts.onWindowLoad) {
                $(window).on('load', function () {
                    measure.call(self);
                    calcAllPos.call(self);
                });
            }
            if (matchMedia && this.opts.offMediaQuery) {
                matchMedia(this.opts.offMediaQuery).addListener(function (mql) {
                    turnSwitch.call(self, mql.matches);
                });
            }
        },
        init = function (frames, layer, options) {
            var self = this,
                $frames = $(frames);
            if (!requestAnimationFrame) return;
            this.opts = $.extend({}, defaults, options);
            this.set = [];
            $frames.each(function () {
                var $this = $(this),
                    $layer = $this.find(layer),
                    top, $placeholder;
                if (!$this.length || !$layer.length) return;
                top = $this.offset().top - $win.scrollTop();
                $placeholder = $('<' + $this.prop('tagName') + '/>', {
                    'class': $this.attr('class')
                });
                $this.addClass(self.opts.activeClassName).css({ 'top': top }).after($placeholder);
                self.set.push({
                    '$frame': $this,
                    '$placeholder': $placeholder,
                    '$layer': $layer.eq(0)
                });
            });
            this.off = false;
            this.requesting = false;
            if (!this.opts.onWindowLoad) {
                measure.call(this);
                calcAllPos.call(this);
            }
            bindEvents.call(this);
        };
    exports.ParallaxBanners = function (frames, layer, options) {
        this.result = init.call(this, frames, layer, options);
    };
    exports.ParallaxBanners.prototype.measure = measure;
    exports.ParallaxBanners.prototype.calcAllPos = calcAllPos;
    exports.ParallaxBanners.prototype.turnSwitch = turnSwitch;
}(this, jQuery));