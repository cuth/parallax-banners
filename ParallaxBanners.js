(function (namespace, $) {
    "use strict";
    var $win = $(window),
        winHeight = $win.height(),
        slideWith = function (item) {
            var scrollTop = $win.scrollTop(),
                layerTravelDistance = winHeight - item.layerHeight,
                frameTravelDistance = winHeight - item.frameHeight,
                speedDifference = layerTravelDistance / frameTravelDistance,
                bleed = item.frameHeight * speedDifference;
            console.log(bleed);
        },
        calcPos = function (item) {
            if (item.layerHeight < winHeight) {
                slideWith.call(self, item);
            }
        },
        calcAllPos = function () {
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                calcPos.call(this, this.set[x]);
            }
        },
        measure = function () {
            for (var x = 0, xlen = this.set.length; x < xlen; x += 1) {
                this.set[x].frameHeight = this.set[x].$frame.outerHeight();
                this.set[x].layerHeight = this.set[x].$layer.outerHeight();
            }
            winHeight = $win.height();
        },
        bindEvents = function () {
            var self = this;
            $win.on('scroll', function () {
                calcAllPos.call(self);
            });
            $win.on('resize', function () {
                measure.call(self);
            });
        },
        init = function (frames, layer) {
            var self = this,
                $frames = $(frames);
            this.set = [];
            $frames.each(function () {
                var $this = $(this),
                    $layer = $this.find(layer);
                if (!$this.length || !$layer.length) return;
                self.set.push({
                    $frame: $this,
                    $layer: $layer.eq(0)
                });
            });
            measure.call(this);
            bindEvents.call(this);
        };
    namespace.ParallaxBanners = function (frames, layer) {
        this.result = init.call(this, frames, layer);
    };
}(this, jQuery));