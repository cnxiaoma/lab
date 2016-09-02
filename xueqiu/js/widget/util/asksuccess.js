/**
 * Created by orange on 16/7/5.
 */
define('widget/util/asksuccess.js', ["pagelets/ask/success.jade.js"], function (require, exports, module) {  var tmpl = require('pagelets/ask/success.jade');


  function Dialog(data, callback) {
    return this.init( data, callback);
  }

  Dialog.prototype = {
    init: function (data, callback) {
      data.title = '发送成功';

      var $dialog = $(tmpl({
        data: data
      }));

      $dialog.appendTo('body').modal('show');

      $dialog.on('hide',function(){
        console.log("触发");
        if (callback && typeof callback === 'function') {
          callback();
        }
      });


      return $dialog;
    }
  };

  module.exports = exports = function (data, callback) {
    return new Dialog(data, callback);
  };

});;
define("pagelets/ask/success.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
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
 var modalView = {hideClose: false, id: 'donate-dialog', className: 'modal-donate', title: '回复成功'};
 var staticDomain=staticDomain||"//assets.imedao.com";
modal_mixin.call({
block: function(){
buf.push('<style>.dialog-asksuccess .success-content{\n  width: 340px;\n}\n.dialog-asksuccess .icon{\n  width: 50px;\n  margin: auto;\n  margin-top: 10px;\n}\n.dialog-asksuccess .icon img{\n  width: 100%;\n}\n.dialog-asksuccess .title {\n  text-align: center;\n  font-size: 16px;\n  margin: 10px;\n  padding-left: 0 !important;\n}\n.dialog-asksuccess .sub-title{\n  text-align: center;\n  margin-bottom: 20px;\n  color: #aaa;\n}\n.dialog-asksuccess .pwd-ft {\n  width: 340px;\n}\n.dialog-asksuccess .btn{\n  width: 340px;\n  height: 40px;\n  text-align: center;\n  padding: 0;\n  line-height: 40px;\n  margin: 0 !important;\n}</style><div class="before"></div><div class="after"></div><div style="width:360px" class="dialog-asksuccess"><div class="donate-bd"><div class="bd-wrap"><div class="success-content"><div class="icon"><img');
buf.push(attrs({ 'src':("" + (staticDomain) + "/images/reward/success.png") }, {"src":true}));
buf.push('/></div><div class="title"> 已获得 ¥' + escape((interp = ((data.paid_amount)/100).toFixed(2)) == null ? '' : interp) + '</div><div class="sub-title"> 可到钱包中进行查看</div></div><div class="pwd-ft"><a href="/c" class="btn">去看看</a></div></div></div></div>');
}
}, modalView);
}
return buf.join("");
};module.exports = anonymous;});