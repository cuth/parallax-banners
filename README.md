# Parallax Banners

This script does a parallax effect similar to spotify.com. You create frame element with an element inside of it that is larger than the frame. The script will position the element inside the frame as the window is scrolled as to show the whole element from when the top of the frame reaches the bottom of the window to when the bottom of the frame reaches the top of the window.

### Set Up

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/ParallaxBanners.js"></script>
<script>
    new ParallaxBanners('.frame','img', { allowReverse: true });
</script>
```

First parameter is a selector, jQuery object or DOM element.

Second parameter is a selector starting from the first parameter element.

Third parameter allows you to change the default options.

```javascript
var defaults = {
    allowReverse: false,
    allowStick: false,
    usePositionTop: false,
    offMediaQuery: '',
    activeClassName: '_parallaxed',
    onWindowLoad: false
}
```

You can call methods on the instance.

```javascript
var instance = new ParallaxBanners('.Frames','.tallElements');

// Re-measure the heights of the Frames and tallElements and browser window and position of the Frames
instance.measure();

// Calculate the new position of all the tallElements depending on window scrollTop.
instance.calcAllPos();

// Turn the parallax effect off
instance.turnSwitch(true);

// or back on
instance.turnSwitch(false);
```