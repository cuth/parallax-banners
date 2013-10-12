(function() {
    for (var d = 0, a = ["ms", "moz", "webkit", "o"], b = 0; b < a.length && !window.requestAnimationFrame; ++b)
        window.requestAnimationFrame = window[a[b] + "RequestAnimationFrame"], window.cancelRequestAnimationFrame = window[a[b] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
        var a = (new Date).getTime(), c = Math.max(0, 16 - (a - d)), e = window.setTimeout(function() {
            b(a + c)
        }, c);
        d = a + c;
        return e
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
        clearTimeout(a)
    })
})();

spweb.parallaxScroller = function(g) {
    return {scroller: {init: function(a) {
                var a = a || {}, b = this;
                this.items = a.items || [];
                this.speed = a.speed;
                this.supportedFeatures = spweb.ui.applyCssGetSupportedFeatures();
                this.world = window;
                this.scrollDistance = 0;
                this.busy = !1;
                this.bounds = this._getBounds();
                this.tiles = [];
                this.items.each(function() {
                    var a = g(this), b = g('<div class="scroller-holder"><img src="' + a.data("image") + '" class="scroller-tile" /></div>');
                    g("body").prepend(b);
                    a.data("holder", b)
                });
                g(window).load(function() {
                    b._initTiles();
                    b._updateTiles()
                });
                g(window).resize(function() {
                    b._initTiles();
                    b._requestTick()
                });
                g(window).scroll(function(a) {
                    b.scrollDistance = b._getScrollDistance(a);
                    b._requestTick()
                })
            },_initTiles: function() {
                var a = this;
                a.bounds = this._getBounds();
                var b = a.bounds.width, c = a.bounds.height;
                a.tiles = [];
                a.items.each(function() {
                    var d = g(this), e = d.data("holder");
                    e.width(b);
                    var f = 0.75 * c, j = d.data("extra-height") || 0, f = (200 < f ? f : 200) + j;
                    d.height(f);
                    var h = d.data("width"), k = d.data("height"), i, j = c - (c - f) * a.speed;
                    i = h * (j / k);
                    i >= b ? h = j : (i = 
                    b, h = k * (i / h));
                    d = new spweb.parallaxScroller.tile({main: d[0],holder: e[0],holderWidth: b,holderHeight: f,backgroundWidth: i,backgroundHeight: h,initBackgroundOffsetX: -(i - b) / 2,initBackgroundOffsetY: -(h - j) / 2});
                    a.tiles.push(d)
                })
            },_requestTick: function() {
                var a = this;
                this.busy || (this.busy = !0, window.requestAnimationFrame(function() {
                    a._updateTiles()
                }))
            },_updateTiles: function() {
                for (var a = this.scrollDistance, b = this.scrollDistance + this.bounds.height, c = 0, d = this.tiles.length; c < d; c++) {
                    var e = this.tiles[c], f = e.initHolderLocation.y;
                    a < e.initHolderLocation.y + e.holderHeight && b > f ? (e.holderLocation.y = e.initHolderLocation.y - this.scrollDistance, e.backgroundOffset.y = e.initBackgroundOffset.y - e.holderLocation.y + e.holderLocation.y * this.speed, this.tiles[c].visibility = "visible") : this.tiles[c].visibility = "hidden"
                }
                c = 0;
                for (d = this.tiles.length; c < d; c++)
                    this.tiles[c].draw(this.supportedFeatures);
                this.busy = !1
            },_getBounds: function() {
                var a = this.world;
                return !a ? null : a === window ? (a = spweb.parallaxScroller.utils.getWindowSize(), {width: a.width,height: a.height}) : 
                {width: a.offsetWidth,height: a.offsetHeight}
            },_getScrollDistance: function(a) {
                return a.target ? a.target.body.scrollTop || document.documentElement.scrollTop : a.srcElement ? a.srcElement.body.scrollTop || document.documentElement.scrollTop : document.documentElement.scrollTop
            }},tile: function(a) {
            var b = {init: function(a) {
                    this.main = a.main;
                    this.holder = a.holder;
                    this.img = this.holder.firstChild;
                    this.initBackgroundOffset = {x: a.initBackgroundOffsetX || 0,y: a.initBackgroundOffsetY || 0};
                    this.backgroundOffset = {x: this.initBackgroundOffset.x,
                        y: this.initBackgroundOffset.y};
                    this.backgroundWidth = a.backgroundWidth || 0;
                    this.backgroundHeight = a.backgroundHeight || 0;
                    this.initHolderLocation = {x: this.main.offsetLeft,y: this.main.offsetTop};
                    this.holderLocation = {x: this.initHolderLocation.x,y: this.initHolderLocation.y};
                    this.holderWidth = a.holderWidth || 0;
                    this.holderHeight = a.holderHeight || 0;
                    this.visibility = a.visibility || "visible"
                },draw: function(a) {
                    spweb.ui.applyCss(this.holder, a, {x: this.holderLocation.x,y: this.holderLocation.y,width: this.holderWidth,height: this.holderHeight,
                        visibility: this.visibility});
                    spweb.ui.applyCss(this.img, a, {x: this.backgroundOffset.x,y: this.backgroundOffset.y,width: this.backgroundWidth,height: this.backgroundHeight,visibility: this.visibility})
                }};
            b.init(a);
            return b
        },utils: {getWindowSize: function() {
                var a = {width: !1,height: !1};
                "undefined" !== typeof window.innerWidth ? a.width = window.innerWidth : "undefined" !== typeof document.documentElement && "undefined" !== typeof document.documentElement.clientWidth ? a.width = document.documentElement.clientWidth : "undefined" !== 
                typeof document.body && (a.width = document.body.clientWidth);
                "undefined" !== typeof window.innerHeight ? a.height = window.innerHeight : "undefined" !== typeof document.documentElement && "undefined" !== typeof document.documentElement.clientHeight ? a.height = document.documentElement.clientHeight : "undefined" !== typeof document.body && (a.height = document.body.clientHeight);
                return a
            }}}
}(jQuery);
