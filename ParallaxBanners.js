(function (namespace, $) {
    "use strict";
    var defaults = {
            allowReverse: false,
            allowStick: false,
            usePositionTop: false,
            offMediaQuery: '',
            activeClassName: '_parallaxed'
        },
        $win = $(window),
        winHeight = $win.height(),
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
            if (this.off) return;
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                calcPos.call(this, this.set[x]);
            }
        },
        measure = function () {
            if (this.off) return;
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                this.set[x].frameTop = this.set[x].$frame.offset().top;
                this.set[x].frameHeight = this.set[x].$frame.outerHeight();
                this.set[x].layerHeight = this.set[x].$layer.outerHeight();
            }
            winHeight = $win.height();
        },
        jump = function (delta) {
            $win.scrollTop($win.scrollTop() - delta);
            calcAllPos.call(this);
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
        bindEvents = function () {
            var self = this;
            $win.on('scroll', function () {
                calcAllPos.call(self);
            });
            $win.on('resize', function () {
                measure.call(self);
                calcAllPos.call(self);
            });
            $win.on('mousewheel', function (e) {
                e.preventDefault();
                jump.call(self, e.originalEvent.wheelDeltaY || e.originalEvent.wheelDelta);
            });
            if (matchMedia && this.opts.offMediaQuery) {
                matchMedia(this.opts.offMediaQuery).addListener(function (mql) {
                    turnSwitch.call(self, mql.matches);
                });
            }
        },
        init = function (frames, layer, options) {
            var self = this,
                $frames = $(frames);
            this.opts = $.extend({}, defaults, options);
            this.set = [];
            $frames.each(function () {
                var $this = $(this),
                    $layer = $this.find(layer).addClass(self.opts.activeClassName);
                if (!$this.length || !$layer.length) return;
                self.set.push({
                    $frame: $this,
                    $layer: $layer.eq(0)
                });
            });
            this.off = false;
            measure.call(this);
            calcAllPos.call(this);
            bindEvents.call(this);
        };
    namespace.ParallaxBanners = function (frames, layer, options) {
        this.result = init.call(this, frames, layer, options);
    };
    namespace.ParallaxBanners.turnSwitch = turnSwitch;
}(this, jQuery));