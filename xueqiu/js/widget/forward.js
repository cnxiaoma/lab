/**
 * @fileOverview
 * @author rekey
 * Created by rekey on 20/9/14.
 */
define('widget/forward.js', ["common/util/jquery.extend","common/util/observer","widget/editor","widget/util/modal","pagelets/util/forward.jade.js"], function (require, exports, module) {  require('common/util/jquery.extend.js');
  var Observer = require('common/util/observer');
  //检测是否 Webkit
  var Editor = require('widget/editor');
  var Modal = require('widget/util/modal');
  var template = require('pagelets/util/forward.jade');
  var $ = jQuery;

  function getContentLength(content) {
    content = content.replace(/[\r\n]/g, '');

    if (!content) {
      return 0;
    }

    var chars = content.split('');
    var count = 0;

    $(chars).each(function () {
      if (this.charCodeAt(0) < 256) {
        count++;
      }
    });

    var unicode = content.length - count;

    return unicode + Math.round(count / 2);
  }

  function checkWordsRemain(form, um) {
    var $label = form.find('.word-count');
    var len = getContentLength(um.getPlainTxt());

    if (len > 140) {
      $label.html('已超出<em>' + (len - 140) + '</em>字').css('color', '#C30801');
    } else {
      $label.html('还能输入<em>' + (140 - len) + '</em>字').css('color', '');
    }
  }

  module.exports = {
    /*
     * 转发浮层
     * @param initData {Object} 初始化弹层需要的参数
     * @param fields {Object} 需要在转发表单里附加的字段
     * @return {Promise} 转发发送的 Promise 对象
     * @example
     *   initData = {name:'textarea 的 name',text:'textarea 默认文字',title:'浮层标题',hideClose:true,id:'modal-forward',className:'modal-forward'};
     *   fields = {'需要附加的字段 name':'需要附加的字段 value'}
     *   show(initData, fields);
     * */
    show: function (initData, fields) {
      var deferred = jQuery.Deferred();

      var $forward = $(template({
        data: {
          init: initData,
          fields: fields
        }
      }));
      $('body').append($forward);
      $forward.modal();

      var $form = $forward.find('.comment-form');
      var $button = $form.find('button[type=submit]');
      var $textarea = $form.find('textarea');
      var um = Editor.comment($form, {
        autoHeightEnabled: false,
        height: 127
      });
      um.ready(function () {
        um.focus();
        setTimeout(function () {
          var obj = {
            html: initData.text
          };
          Editor.pasteFilter(obj, um);
          um.setContent(obj.html);
          //um.execCommand("insertHtml", obj.html);
          obj = null;
          checkWordsRemain($form, um);
          um.focus();
        });

        um.on('keyup', function () {
          checkWordsRemain($form, um);
        });
      });


      //.find('button.btn')
      $form.on('submit', function (e) {
        e.preventDefault();
        if (getContentLength(um.getPlainTxt()) > 140) {
          Modal.alert('字数超出限制', 'warn');
          return false;
        }
        $textarea.val(um.getPlainTxt());
        var data = $form.formSerialize();

        $button.attr('disabled', true);

        if (typeof data.comment === 'undefined') {
          data.forward = $.trim(data.status) !== '' ? 1 : 0;
        }

        if ('string' === typeof(data.status)) {
          var sArr = data.status.split('//');
          if ('' === $.trim(sArr[0])) {
            data.forward = 0;
          }
        }

        $.ajax({
          url: $form.attr('action'),
          data: data,
          type: 'post'
        }).done(function (resp) {
          if (resp.created_at||resp) {
            Observer.publish('status:forward:success', {
              data: resp
            });
            deferred.resolve(resp);
            $forward.modal('hide');
          }
        }).fail(function (jqxhr) {
          if (jqxhr.responseJSON && jqxhr.responseJSON.error_code) {
            Modal.alert(jqxhr.responseJSON.error_description, 'warn');
          } else {
            Modal.alert('内部错误，请稍后重试。', 'warn');
          }
          deferred.reject(jqxhr);
          //$forward.modal('hide');
        });
        return ;
      });
      $forward.on('hide', function () {
        $button.removeAttr('disabled');
        //由于状态只会触发一次，所以这里是安全的。
        deferred.reject('');
        try {
          um.destroy();
        } catch (e) {

        }
        setTimeout(function () {
          $forward.remove();
        }, 0);
      });

      $forward.find('.cancel').on('click', function (e) {
        e.preventDefault();
        $forward.modal('hide');
        return false;
      });

      return deferred.promise();
    }
  };
});
;
define("pagelets/util/forward.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
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
var editor_comment_mixin = function(data, opts){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
 var data = data || {};
 var opts = opts || {};
buf.push('<div');
buf.push(attrs({ 'id':("" + (data.id || 'id-editor-' + (+new Date())) + ""), "class": ("editor-comment") }, {"class":true,"id":true}));
buf.push('><form');
buf.push(attrs({ 'action':("" + (data.action || '/service/comment/add?type=status') + ""), 'method':("post"), 'enctype':("application/x-www-form-urlencoded"), "class": ("comment-form") }, {"class":true,"action":true,"method":true,"enctype":true}));
buf.push('>');
 if (block)
{
block && block();
}
buf.push('<div class="editor-textarea"><div class="arrow"><span class="arrow-top-out"></span><span class="arrow-top-in"></span></div><textarea');
buf.push(attrs({ 'name':("" + (data.name || 'comment') + "") }, {"name":true}));
buf.push('></textarea></div><div class="editor-ctrl"><div class="extra"><b class="editor-emotion"><span class="icon-icon_16_-25"></span></b><b class="editor-stock"><span class="icon-icon_16_-26"></span></b>');
 if (opts.checkWord)
{
buf.push('<span class="word-count">还能输入<em>140</em>字</span>');
}
 if (!opts.hideForward)
{
buf.push('<label><input type="checkbox" name="forward" value="1"/>同时转发到我的首页</label>');
}
buf.push('</div><div class="submit"><button type="submit" class="btn btn-medium">发布</button>');
 if (!opts.hideCancelBtn)
{
buf.push('<a class="btn btn-gray btn-medium cancel">取消</a>');
}
buf.push('</div></div></form></div>');
};
 var staticDomain = staticDomain || '//assets.imedao.com';
 var init = data.init || {};
 var fields = data.fields || {};
 var forwardView = {id: init.id || 'modal-forward-' + (+new Date()), className: 'modal-forward', title: init.title || '转发到我的首页'};
 var editorView = {action: init.action, name: init.name || 'status'};
 var editorOpts = {hideForward: true, checkWord: true};
 fields.forward = 1;
modal_mixin.call({
block: function(){
editor_comment_mixin.call({
block: function(){
// iterate fields
;(function(){
  if ('number' == typeof fields.length) {

    for (var key = 0, $$l = fields.length; key < $$l; key++) {
      var item = fields[key];

buf.push('<input');
buf.push(attrs({ 'type':("hidden"), 'name':("" + (key) + ""), 'value':("" + (item) + "") }, {"type":true,"name":true,"value":true}));
buf.push('/>');
    }

  } else {
    var $$l = 0;
    for (var key in fields) {
      $$l++;      var item = fields[key];

buf.push('<input');
buf.push(attrs({ 'type':("hidden"), 'name':("" + (key) + ""), 'value':("" + (item) + "") }, {"type":true,"name":true,"value":true}));
buf.push('/>');
    }

  }
}).call(this);

}
}, editorView, editorOpts);
}
}, forwardView);
}
return buf.join("");
};module.exports = anonymous;});