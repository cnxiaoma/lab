/**
 * Created by gaowhen on 14-7-24.
 */

define('widget/repost_comment.js', ["SNB.editor"], function (require, exports, module) {  var $dialogRepost = $("#dialog-repost-comment");

  if (!$dialogRepost.length) {
    var rthtml = ''
      + '<div id="dialog-repost-comment" class="dialog-wrapper" style="display:none">'
        + '<textarea></textarea>'
        + '<p class="counttxt">'
          + '<span class="showFaceButton" title="表情">&nbsp;</span>'
          + '<span class="addStock" title="股票">&nbsp</span>'
          + '<span class="wordsRemain"></span>'
        + '</p>'
        + '<p style="text-align:center"><input type="submit" class="submit" value="确定"/><input type="button" class="cancel button" value="取消"/></p>'
      + '</div>';

    $dialogRepost = $(rthtml).appendTo("body>.temp");
  }

  $dialogRepost.find(".cancel").click(function () {
    $dialogRepost.dialog("close");
  });

  var maxWords = SNB.Util.MAX_STATUS_WORDS;
  var remainLabel = $dialogRepost.find(".wordsRemain");

  var getContent = function (forCount) {
    var content = SNB.Util.cleanContent(ta.getContent(), false, ta.editor);

    if (forCount) {
      content = content.replace(/&nbsp;/gi, ' ');
    }

    content = content.replace(/<br>/gi, '\n');

    return content;
  };

  var getContentCount = function () {
    return SNB.Util.getWordsCount(getContent(true));
  };

  function keyUp() {
    var wordCount = getContentCount();

    $('.ueditor-wrapper, textarea', $dialogRepost).removeClass('error');

    if (wordCount > maxWords) {
      remainLabel.html('已超出<em>' + (wordCount - maxWords) + '</em>字').css('color', '#C30801');
    } else {
      remainLabel.html('还能输入<em>' + (maxWords - wordCount) + '</em>字').css('color', '');
    }
  }

  var $textarea = $dialogRepost.find("textarea");

  // submit
  function submitRepost() {
    var content = getContent(),
      sid = $dialogRepost.data('id'),
      cid = $dialogRepost.data('cid'),
      count = getContentCount();

    if (count > SNB.Util.MAX_STATUS_WORDS) {
      ta.$uew.addClass("error");

      return false;
    }

    $dialogRepost.dialog("close");

    var _data = {
      id: sid,
      cid: cid,
      comment: content,
      forward: 1,
      split: true
    };

    SNB.post("/statuses/reply.json", _data, function () {

    }, function (xhr) {
      if (xhr.status && xhr.status != 200) {
        SNB.Util.failDialog('转发失败');
      }
    });
  }

  $dialogRepost.find(".submit").click(submitRepost);

  var editor = require('SNB.editor.js'),
    ta = editor.init($dialogRepost, {
      $emotion: $('.showFaceButton', $dialogRepost),
      $stock: $('.addStock', $dialogRepost),
      ctrlReturn: true,
      submitFunc: submitRepost,
      insertFunc: keyUp
    }),
    dTa = $.Deferred(),
    pTa = dTa.promise();

  $textarea.focus(keyUp);

  $textarea.bind("keyup", keyUp);

  $dialogRepost.hide();

  /**
   * status: {
   *  id: 1
   * }
   *
   * comment: {
   *  id: 2
   * }
   *
   *  content: 评论内容，必须做URLEncode，信息内容不超过140个汉字
    */

  exports = module.exports = function (sid, cid, content) {
    $dialogRepost.dialog({
      modal: 'true',
      width: '520px',
      title: "转发到我的首页"
    });

    $dialogRepost
      .data('id', sid)
      .data('cid', cid);

    if ($.browser.isMobile) {
      dTa.resolve(ta);
    } else if (!ta.editor) {
      ta.upgrade({
        autoheight: false
      }, function () {
        $('.ueditor-wrapper', $dialogRepost).height(100);

        ta.editor.addListener('keyup', keyUp);
        dTa.resolve(ta);
      });
    }

    var _content = content || '';

    pTa.done(function (ta) {
      ta.reset(_content, true, true);
      keyUp();
    });

    SNB.Util.dialog_vertical_middle($dialogRepost.closest(".ui-dialog"));
  };

});
