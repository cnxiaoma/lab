define('SNB.atDialog.js', ["at-dialog.jade.js","SNB.editor"], function (require, exports, module) {  var template = require('./at-dialog.jade')
    , editor = require('SNB.editor.js')
    , dTa = $.Deferred()
    , pTa = dTa.promise()
    , defaultText
    , screenName
    , showDialog = function($atDialog) {
        var $tdc = $('.tipsdivcontent', $atDialog)
          , ta = $tdc.data('ta')
          , $errMsg = $('.errMsg', $atDialog)
          , $submit = $(".submitAtHeButton", $atDialog)
        $atDialog.dialog({
          title: "有什么话对" + screenName + "说：",
          modal: true,
          width: 520
        });
        if (!ta) { // 初次载入 atDialog
          function submitAt () {
            if ($submit.hasClass('disabled')) return
            var content = SNB.Util.cleanContent(ta.getContent(), false, ta.editor)
            // send content;
            if (!content) {
              ta.$textarea.addClass("error");
              $errMsg.text('请输入内容。')
              return false;
            //} else if (SNB.Util.isContentSame(content, defaultText)&&!$atDialog.data("isShare")) {
            //  ta.$textarea.addClass("error");
            //  $errMsg.text('请输入内容再发布')
            //  return false;
            }
            $submit.addClass('disabled')
            SNB.Util.updateStatus({status: content}, function(){
              $submit.removeClass('disabled')
              $atDialog.dialog("close");
            },function(ret){
              $submit.removeClass('disabled')
            })
          }
          ta = editor.init($tdc, {
              $emotion: $('.showFaceButton', $atDialog)
            , $stock: $('.addStock', $atDialog)
            , ctrlReturn: true
            , submitFunc: submitAt
          })
          var keyUpCb = function() {
            $errMsg.text('')
            ta.$textarea.removeClass("error")
          }
          ta.$textarea.focus(keyUpCb)
          $(".cancelAtHeButton", $atDialog).click(function () {
            $atDialog.dialog("close");
          })

          if ($.browser.isMobile) dTa.resolve(ta)
          else if (!ta.editor) ta.upgrade({ autoheight: false }, function() {
            $('.ueditor-wrapper', $atDialog).height(100)
            ta.editor.addListener('keyup', keyUpCb)
            dTa.resolve(ta)
          })

          $submit.click(submitAt)
        }
        $errMsg.text('')
        $submit.removeClass('disabled')
      }

  $(function() {
    $('body').on('click', '[data-toggle="at"]', function(e) {
      e.preventDefault();
      var that = this;
      screenName = $(this).data('target') || $(this).attr("data-target"),
      defaultText = $(this).attr("data-defaulttext")||("对@" + screenName + " 说：");
      if(SNB.data.app_type !== "tablet"){
        SNB.Util.checkLogin(function(){
          $('body').findOrAppend('>.ui-dialog>#dialog-at-he', template, function($atDialog) {
            showDialog($atDialog)
            //分享到雪球  暂且先用这个弹出框吧
            if($(that).data("isShare")){
              $atDialog.dialog({
                title:"分享到雪球"
              }).data("isShare",$(that).data("isShare"));
            }
            pTa.done(function(ta) {
              ta.reset(defaultText, true)
            })
          })
        }, e);
      }else{
        SNB.Util.callBrick({atUser:{name:screenName,atUserContent:defaultText}});
      }
    })
  })
})
;
define("at-dialog.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="dialog-at-he" class="dialog-wrapper"><div class="tipsdivcontent"><textarea id="atHeStatusTextBox" class="tips_textarea"></textarea></div><p class="counttxt"><span title="表情" class="showFaceButton"></span><span title="股票" class="addStock"></span><span class="wordsRemain"></span></p><div style="text-align:center;width:100%"><span style="color: red" class="errMsg"></span><input type="button" value="发布" class="submit submitAtHeButton disabled"/></div></div>');
}
return buf.join("");
};module.exports = anonymous;});