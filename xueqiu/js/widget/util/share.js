define('widget/util/share.js', ["at-dialog.jade.js","SNB.editor"], function (require, exports, module) {  var template = require('at-dialog.jade'),
    editor = require('SNB.editor.js'),
    title;

  function showDialog(tit, text) {
    var dTa = $.Deferred(),
      pTa = dTa.promise(),
      $atDialog = $(template()),
      $tdc = $('.tipsdivcontent', $atDialog),
      $errMsg = $('.errMsg', $atDialog),
      $submit = $('.submitAtHeButton', $atDialog);

    $('body').append($atDialog);

    $atDialog.dialog({
      title: title,
      modal: true,
      width: 520,
      close: function () {
        $atDialog.dialog('destroy').remove();
        $('#editor-at-suggestion').remove();
        ta.$textarea.remove();
      }
    });

    function submitAt() {
      if ($submit.hasClass('disabled')) {
        return false;
      }

      var content = SNB.Util.cleanContent(ta.getContent(), false, ta.editor);

      if (!content) {
        ta.$textarea.addClass("error");
        $errMsg.text('请输入内容。');

        return false;
      }

      $submit.addClass('disabled');

      SNB.Util.updateStatus({status: content}, function () {
        $submit.removeClass('disabled');
        $atDialog.dialog("close");
      }, function () {
        $submit.removeClass('disabled');
      });
    }

    var ta = editor.init($tdc, {
      $emotion: $('.showFaceButton', $atDialog),
      $stock: $('.addStock', $atDialog),
      ctrlReturn: true,
      submitFunc: submitAt
    });

    var keyUpCb = function () {
      $errMsg.text('');
      ta.$textarea.removeClass('error');
    };

    ta.$textarea.focus(keyUpCb);

    $('.cancelAtHeButton', $atDialog).click(function () {
      $atDialog.dialog('close');
    });

    if ($.browser.isMobile) {
      dTa.resolve(ta);
    } else if (!ta.editor) {
      ta.upgrade({autoheight: false}, function () {
        $('.ueditor-wrapper', $atDialog).height(100);
        ta.editor.addListener('keyup', keyUpCb);
        dTa.resolve(ta);
      });
    }

    $submit.click(submitAt);

    $errMsg.text('');
    $submit.removeClass('disabled');

    pTa.done(function (ta) {
      ta.reset(text);
    });
  }

  //exports入口
  function Dialog(tit, text) {
    return this.init(tit, text);
  }

  Dialog.prototype = {
    init: function (tit, text) {
      title = tit;
      $('#editor-at-suggestion').remove();
      showDialog(tit, text);
    }
  };

  module.exports = function (title, defaults) {
    return new Dialog(title, defaults);
  };

});;
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