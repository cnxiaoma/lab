/** @license
 * AutoResize v1.1.2
 *  A jQuery Plugin that matches a textarea to the height of its text content
 *  http://azoffdesign.com/autoresize
 *
 * Intended for use with the latest jQuery
 *  http://code.jquery.com/jquery-latest.js
 *
 * Copyright 2011, Jonathan Azoff
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://jquery.org/license
 *
 * For API documentation, see the README file
 *  https://github.com/azoff/AutoResize/blob/master/README.md
 *
 * Date: Tuesday, October 10th 2011
 */

/*jslint onevar: true, strict: true */

/*global jQuery */

"use strict";

define('lib/autoresize.js', [], function (require, exports, module) { var

    $win = $(window),

    ALLOWED_NODES = 'textarea',

    EVENTS = 'keyup change paste input';

    function init(textarea) { var
        target = $(textarea),
        value = target.val(),
        height = target.val('').height(),
        scroll = textarea.scrollHeight,
        offset = scroll > height ? (scroll - height) : 0;
        target.data('minHeight', height);
        target.data('scrollOffset', offset);
        $.browser.msie && target.css('overflow-y', 'hidden').scroll(function(){this.scrollTop = 0})
        return target.val(value);
    }

    function resize() { var
        target = $(this),
        targetHeight = target.height(),
        scrollOffset = target.data('scrollOffset'),
        minHeight = target.data('minHeight'),
        scrollTop = $win.scrollTop(),
        scrollHeight;
        $.browser.msie || target.height(minHeight)
        scrollHeight = target.prop('scrollHeight') - scrollOffset;
        target.height(scrollHeight);
        $win.scrollTop(scrollTop);
        if (targetHeight !== scrollHeight) {
            target.trigger('autoresize:resize', scrollHeight);
        }
    }

    function apply() {
        init(this).bind(EVENTS, resize);
        resize.call(this)
    }

    exports = module.exports = function($elements) {
        $elements.filter(ALLOWED_NODES).each(apply);
    };

 });
