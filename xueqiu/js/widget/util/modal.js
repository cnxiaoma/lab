/**
 * @fileOverview
 * @author rekey
 * Created by rekey on 27/8/14.
 */
define('widget/util/modal.js', ["widget/bootstrap/modal","pagelets/util/alert.jade.js","pagelets/util/confirm.jade.js","pagelets/util/tooltip.jade.js"], function (require, exports, module) {  require('widget/bootstrap/modal.js');

  var $ = jQuery;
  var alertTemplate = require('pagelets/util/alert.jade');
  var confirmTemplate = require('pagelets/util/confirm.jade');
  var tooltipTemplate = require('pagelets/util/tooltip.jade');
  var Tooltip = {
    current: null,
    cache: {},
    fragment: $(document.createDocumentFragment()),
    make: function (opts) {

      var data = {
        text: (opts.type === 'text' ? opts.content : '')
      };

      var html = tooltipTemplate({
        data: data
      });

      return $(html).addClass(opts.className);
    },
    hide: function (opts) {

      var $div = this.cache[opts.cacheId].$div;

      opts.$target.off('mouseleave', opts.mouseLeaveHandler);

      if (opts.cache) {
        $div.modal('hide');
        $div.hide();
      } else {
        Tooltip.cache[opts.cacheId] = null;
        $div.remove();
      }
    },
    show: function ($target, opts) {

      var $div;

      var pos = this.pos;

      //如果在缓存里找到了，直接展示
      if (this.cache[opts.cacheId]) {
        $div = this.cache[opts.cacheId].$div;
        $div.show();
        pos($target, $div);
        $target.on('mouseleave', opts.mouseLeaveHandler);
        return $div;
      }

      //创建 dom
      $div = this.make(opts);

      $target.on('mouseleave', opts.mouseLeaveHandler);

      //存入缓存
      this.cache[opts.cacheId] = {
        opts: opts,
        $div: $div
      };

      $div.appendTo('body');
      $div.show();

      switch (opts.type) {
        case 'dom':
          $div.find('.tooltip').append(opts.content);
          pos($target, $div);
          break;
        case 'uri':
          $div.css('visibility', 'hidden');
          var $iframe = $('<iframe frameborder="0"></iframe>');
          $iframe.on('load', function () {
            $iframe.off('load', arguments.callee);
            pos($target, $div);
            $div.css('visibility', 'visible');
          });
          $div.find('.tooltip').append($iframe);
          $iframe.attr('src', opts.content);
          break;
        default :
          pos($target, $div);
      }

      return $div;
    },
    pos: function ($target, $div) {
      var offset = $target.offset();
      var $win = $(window);
      var targetHeight = $target.outerHeight();
      var targetWidth = $target.innerWidth();
      var divHeight = $div.outerHeight();
      var winHeight = $win.height();
      var pos = {
        left: offset.left + targetWidth / 2,
        top: offset.top + targetHeight
      };

      if (winHeight - (offset.top - $win.scrollTop()) - targetHeight < divHeight && offset.top > divHeight) {
        pos.top = offset.top - divHeight;
        $div.removeClass('tooltip-top');
        $div.addClass('tooltip-bottom');
      } else {
        $div.removeClass('tooltip-bottom');
        $div.addClass('tooltip-top');
      }

      $div.css(pos);
    }
  };

  $(document).on('show', function (e) {
    var $div = $(e.target),
      marginTop = 0 - Math.floor($div.outerHeight() * 0.382);

    if($div.data('toggle')=="tab"){
      return ;
    }

    $div.css({
      marginTop: 0,
      top: 0
    });

    $div.css({
      marginTop: marginTop,
      top: '38.2%'
    });

  });

  module.exports = {
    /*
     * 弹层提示框
     * @param text {String} 提示文字，必填参数
     * @param status {String} 状态，可选为 success warn error三种，默认为 success
     * @return {Object} 返回当前浮层的 jQuery 包装对象
     * */
    alert: function (text, status) {

      status = status || 'success';

      var html = alertTemplate({
          data: {
            text: text,
            status: status
          }
        }),
        $div = $(html),
        timer = 0;

      $('body').append($div);

      $div.on('show', function () {
        timer = setTimeout(function () {
          $div.modal('hide');
        }, 3000);
      });

      $div.on('hide', function () {
        $div.remove();
        clearTimeout(timer);
      });

      $div.modal({
//        backdrop: 'static',
//        keyboard: false
      });

      return $div;
    },
    /*
     * 确认提示框
     * @param text {String} 提示文字，必填参数
     * @param options {Object} 按钮文字,example : {sure:'确定', cancel:'取消'}
     * @return {Promise}
     * */
    confirm: function (text, options) {
      var deferred = jQuery.Deferred();

      options = $.extend({
        sure: '确定',
        cancel: '取消'
      }, options);

      var html = confirmTemplate({
          data: {
            text: text,
            options: options
          }
        }),
        $div = $(html);

      $('body').append($div);

      $div.on('hide', function () {
        $div.remove();
        deferred.reject();
      });

      $div.find('.sure').on('click', function () {
        $div.off('hide');
        $div.modal('hide');
        $div.remove();
        deferred.resolve();
      });

      $div.find('.cancel').on('click', function () {
        $div.modal('hide');
      });

      $div.modal({
        backdrop: 'static',
        keyboard: false
      });

      return deferred.promise();
    },
    /*
     * 基于某个 dom 显示一个浮层提示信息
     * @param target {Element} 浮层相对定位的 dom 对象
     * @param options {Object} 浮层内容相关信息,其中 content 和 type 是一定要有的
     * @return {Object} 返回浮层的 jQuery 包装对象
     * @example Modal.tooltip($('a')[0], {content:'aaa', type:'text', className:''})
     * @example Modal.tooltip($('a')[0], {content:'/', type:'uri', className:''})
     * @example Modal.tooltip($('a')[0], {content:$('div')[0], type:'dom', className:''})
     * @example Modal.tooltip($('a')[0], {content:$('div')[0], type:'dom', className:'',mouseLeave:function(){}})
     * */
    tooltip: function (target, options) {

      var opts = $.extend({
        content: '',
        className: '',
        mouseLeave: null
      }, options);

      var $target = $(target);
      var $div;

      opts.cache = true;

      //如果 content 或者 type 不存在直接报错
      if (!opts.content || !opts.type) {
        throw 'Modal.tooltip : content or type is no defined';
      }

      //处理 cacheId
      if (opts.type !== 'dom') {
        opts.cacheId = opts.className + opts.content;
      } else {
        var $content = $(opts.content);
        opts.cacheId = $content.data('modalCacheId') || (opts.className + jQuery.now());
        $content.data('modalCacheId', opts.cacheId);
      }

      if (Tooltip.cache[opts.cacheId]) {
        opts = Tooltip.cache[opts.cacheId].opts;
      }

      //如果当前已经出现的 tooltip 了，就隐藏。
      if (Tooltip.current && Tooltip.current.cacheId !== opts.cacheId) {
        Tooltip.hide(Tooltip.current);
      }

      Tooltip.current = opts;

      //定时器存在就取消，防止显示又消失。
      if (opts.timer) {
        clearTimeout(opts.timer);
      }

      opts.timer = 0;

      if (!opts.mouseLeaveHandler) {
        //默认的激活区域和内容区域的 mouseout 事件
        var mouseLeaveHandler = opts.mouseLeave || function () {
            opts.timer = setTimeout(function () {
              Tooltip.hide(opts);
            }, 200);
          };

        opts.mouseLeaveHandler = function (e) {
          mouseLeaveHandler(e, $div);
        };
      }

      //默认先清除事件，show 的时候会默认绑定的
      if (opts.$target) {
        $target.off('mouseleave', opts.mouseLeaveHandler);
      }

      opts.$target = $target;

      $div = Tooltip.show($target, opts);

      $div.off('mouseenter').on('mouseenter', function () {
        if (opts.timer) {
          clearTimeout(opts.timer);
        }
      });

      $div.off('mouseleave').on('mouseleave', opts.mouseLeaveHandler);

      return $div;
    }
  };

});;
define("pagelets/util/alert.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var modal_mixin = function(data){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<div');
buf.push(attrs({ 'id':("" + (data.id || '') + ""), "class": ("modal" + (data.className ? ' ' + data.className : '') + "") }, {"id":true,"class":true}));
buf.push('><div class="modal-wrap">');
if ((data.title))
{
buf.push('<div class="modal-title"><h3>' + escape((interp = data.title) == null ? '' : interp) + '</h3></div>');
}
if ((!data.hideClose))
{
buf.push('<span data-dismiss="modal" aria-hidden="true" class="close">X</span>');
}
buf.push('<div class="modal-content">');
if ( (block))
{
block && block();
}
buf.push('</div></div></div>');
};
 var modalTooltipView = {hideClose:true, id:'modal-alert', className:'modal-alert'};
modal_mixin.call({
block: function(){
buf.push('<div');
buf.push(attrs({ "class": ("alert alert-" + (data.status) + "") }, {"class":true}));
buf.push('><i></i>' + ((interp = data.text) == null ? '' : interp) + '</div>');
}
}, modalTooltipView);
}
return buf.join("");
};module.exports = anonymous;});;
define("pagelets/util/confirm.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var modal_mixin = function(data){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<div');
buf.push(attrs({ 'id':("" + (data.id || '') + ""), "class": ("modal" + (data.className ? ' ' + data.className : '') + "") }, {"id":true,"class":true}));
buf.push('><div class="modal-wrap">');
if ((data.title))
{
buf.push('<div class="modal-title"><h3>' + escape((interp = data.title) == null ? '' : interp) + '</h3></div>');
}
if ((!data.hideClose))
{
buf.push('<span data-dismiss="modal" aria-hidden="true" class="close">X</span>');
}
buf.push('<div class="modal-content">');
if ( (block))
{
block && block();
}
buf.push('</div></div></div>');
};
 var modalTooltipView = {hideClose:true, id:'modal-confirm', className:'modal-confirm'};
modal_mixin.call({
block: function(){
buf.push('<div class="confirm"><div class="text">' + escape((interp = data.text) == null ? '' : interp) + '</div><div class="ctrl"><button class="btn btn-medium sure">' + escape((interp = data.options.sure) == null ? '' : interp) + '</button><button class="btn btn-medium btn-gray cancel">' + escape((interp = data.options.cancel) == null ? '' : interp) + '</button></div></div>');
}
}, modalTooltipView);
}
return buf.join("");
};module.exports = anonymous;});;
define("pagelets/util/tooltip.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var modal_mixin = function(data){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<div');
buf.push(attrs({ 'id':("" + (data.id || '') + ""), "class": ("modal" + (data.className ? ' ' + data.className : '') + "") }, {"id":true,"class":true}));
buf.push('><div class="modal-wrap">');
if ((data.title))
{
buf.push('<div class="modal-title"><h3>' + escape((interp = data.title) == null ? '' : interp) + '</h3></div>');
}
if ((!data.hideClose))
{
buf.push('<span data-dismiss="modal" aria-hidden="true" class="close">X</span>');
}
buf.push('<div class="modal-content">');
if ( (block))
{
block && block();
}
buf.push('</div></div></div>');
};
 var modalTooltipView = {hideClose: true, id: data.id || 'modal-tooltip-' + (+new Date()), className: 'modal-tooltip'};
modal_mixin.call({
block: function(){
buf.push('<div class="before"></div><div class="after"></div><div class="tooltip">' + escape((interp = data.text || '') == null ? '' : interp) + '</div>');
}
}, modalTooltipView);
}
return buf.join("");
};module.exports = anonymous;});