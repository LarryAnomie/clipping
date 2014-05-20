/* global polyClip, window, requestAnimationFrame */

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var example = (function () {

    'use strict';

    var $newCar,
        width, height,
        $clipParent,
        mouseOffset = 20,
        frameReq,
        hasGranularRequestAnimationFrame = window.requestAnimationFrame && requestAnimationFrame !== window.webkitRequestAnimationFrame && requestAnimationFrame.toString().indexOf('[native code]') > -1;

    var init = function () {
        $newCar = $('#new-car');
        $clipParent = $('#clip');

        width = $newCar.width();
        height = $newCar.height();

        /*
         * Setup mouse and touch events to translate the clipping path to be
         * underneath the event fired.  Note that we use the click event as
         * well -- although iOS Safari can keep up with the touchmove event,
         * Android Chrome and "Browser" cannot, so use the click event as a
         * type of fallback.
         */
        $clipParent.bind({
            mousemove: mouseoverEvent,
            touchmove: mouseoverEvent,
            click: mouseoverEvent
        });


    };

    function mouseoverEvent(e) {

        /*
         * We use requestAnimationFrame() here to make the animation
         * smoother, if:
         *
         * a) a native implementation (i.e. non-polyfill) is available.
         * b) it is not the WebkitRequestAnimationFrame.
         *
         * Both the polyfill and WebkitRequestAnimationFrame slow down
         * the animation of the mouseover.
         *
         */

        frameReq = requestAnimationFrame(
            function () {
                animateClipRegion(e);
            }
        );
    }


    /*
     * This is the function that is used by the mouseoverEvent()
     * function to generate the clipping region underneath the
     * mouse pointer.
     */
    function animateClipRegion(e) {

        console.log('animateClipRegion');

        var x = e.pageX - 150;
        var y = e.pageY - 400;

        console.log(polyClip);

        //polyClip.transformClip($newCar, 'translateX(' + x + 'px)');
        polyClip.transformClip($newCar, 'translateY(' + y + 'px)');


    }

    return {
        init: init
    };

}());

polyClip.useSVGGlobally = true;

/*
 * Use this call instead of $(document).ready to initialize
 * to ensure that polyClip has initialized before you
 * start the animation routines.
 */
polyClip.addCallback(example.init);
