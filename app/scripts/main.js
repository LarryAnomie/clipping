/* global polyClip, window, requestAnimationFrame */

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

        console.log(width, height);

        $newCar.find('img').css('height:' + height);
        $newCar.find('img').css('width:' + width);

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
        if (hasGranularRequestAnimationFrame) {
            if (frameReq) {
                cancelAnimationFrame(frameReq);
            }
            frameReq = requestAnimationFrame(
                function () {
                    animateClipRegion(e);
                });
        } else {
            animateClipRegion(e);
        }
    }


    /*
     * This is the function that is used by the mouseoverEvent()
     * function to generate the clipping region underneath the
     * mouse pointer.
     */
    function animateClipRegion(e) {

        console.log('animateClipRegion');


        var pos = $clipParent.position();
        var x = e.pageX - mouseOffset - $clipParent.get(0).offsetLeft;

        polyClip.transformClip($newCar, 'translateX(' + x + 'px)');


    }

    return {
        init: init
    };

}());

/*
 * Use this call instead of $(document).ready to initialize
 * to ensure that polyClip has initialized before you
 * start the animation routines.
 */
polyClip.addCallback(example.init);
