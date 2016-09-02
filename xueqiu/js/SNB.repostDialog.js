define('SNB.repostDialog.js', ["SNB.editor"], function (require, exports, module) {  var $dialogRepost = $("#dialog-repost");
  if (!$dialogRepost.length) {
    var rthtml = ''
      + '<div id="dialog-repost" class="dialog-wrapper" style="display:none">'
        + '<textarea></textarea>'
        + '<p class="counttxt">'
          + '<span class="showFaceButton" title="表情">&nbsp;</span>'
          + '<span class="addStock" title="股票">&nbsp</span>'
          + '<span class="wordsRemain"></span>'
        + '</p>'
      + '<p style="text-align:center"><input type="submit" class="submit" value="确定"/><input type="button" class="cancel button" value="取消"/></p></div>';
    $dialogRepost = $(rthtml).appendTo("body>.temp:first")
  }

  $dialogRepost.find(".cancel").click(function () {
    $dialogRepost.dialog("close");
  });
  var maxWords = SNB.Util.MAX_STATUS_WORDS;
  var remainLabel = $dialogRepost.find(".wordsRemain");

  var getContent = function(forCount) {
    var content = SNB.Util.cleanContent(ta.getContent(), false, ta.editor)
    if (forCount) content = content.replace(/&nbsp;/gi, ' ')
    content = content.replace(/<br>/gi, '\n')
    return content;
  };
  var getContentCount = function() {
    return SNB.Util.getWordsCount(getContent(true))
  }

  var keyUpCb = function() {
    var ta = $dialogRepost.data('ta')
      , wordCount= getContentCount()
    $('.ueditor-wrapper, textarea', $dialogRepost).removeClass('error')
    if (wordCount > maxWords) {
      remainLabel.html('已超出<em>' + (wordCount - maxWords) + '</em>字').css('color', '#C30801');
    } else {
      remainLabel.html('还能输入<em>' + (maxWords - wordCount) + '</em>字').css('color', '');
    }
  }

  var $textarea = $dialogRepost.find("textarea");

  var lastContent, lastStatusId
  // submit
  var submitRepost = function() {
    var content = getContent()
      , id = $dialogRepost.data("statusId")
      , count = getContentCount()
    if (content == lastContent && id == lastStatusId) return;
    lastContent = content
    lastStatusId = id
    if (count > SNB.Util.MAX_STATUS_WORDS) {
      ta.$uew.addClass("error");
      return false;
    }
    $dialogRepost.dialog("close");
    var repostForward = SNB.Util.isContentSame(content, $dialogRepost.data('default')) ? 0 : 1;
    var callback = $dialogRepost.data('callback')
    var _data = {id: id, status: content, forward: repostForward }
    if(typeof SNB.data.status_module_id !== "undefined"){
      _data.module_id  = SNB.data.status_module_id
    }
    SNB.post("/statuses/repost.json", _data, function(ret) {
      if (callback) {
        callback(ret);
      }
    }, function(xhr, error) {
      if (xhr.error_code) {
        SNB.Util.failDialog(xhr.error_description);
      }
    })
  }

  $dialogRepost.find(".submit").click(submitRepost)

  var editor = require('SNB.editor.js')
  , ta = editor.init($dialogRepost, {
        $emotion: $('.showFaceButton', $dialogRepost)
      , $stock: $('.addStock', $dialogRepost)
      , ctrlReturn: true
      , submitFunc: submitRepost
      , insertFunc: function(editor, value){
          // #4105 插入表情或股票的时候也更新一下限制文字数
          keyUpCb();
      }
    })
  , dTa = $.Deferred()
  , pTa = dTa.promise()

  $textarea.focus(keyUpCb)

  $textarea.bind("keyup", keyUpCb)

  $dialogRepost.hide();

  exports = module.exports = function(status, callback, content){
    var isRetweet = !!status.retweet_status_id && status.retweeted_status
      , outputStatus = isRetweet ? status.retweeted_status : status
      , user = outputStatus.user

    $dialogRepost.data('statusId', status.id);
    $dialogRepost.data('callback', callback);

    $dialogRepost.dialog({
      modal: 'true',
      width: '520px',
      title: "转发到我的首页"
    });

    if ($.browser.isMobile) {
      dTa.resolve(ta);
    } else if (!ta.editor) {
      ta.upgrade({ autoheight: false }, function() {
        $('.ueditor-wrapper', $dialogRepost).height(100);
        ta.editor.addListener('keyup', keyUpCb);
        dTa.resolve(ta);
      });
    }

    var repostContent = content || '';

    if (isRetweet) {
      repostContent = ' //@' + status.user.screen_name + ": " + $("<div>" + SNB.Util.reparseContent(status.text) + "</div>").text();
    }

    $dialogRepost.data('default', repostContent);

    pTa.done(function(ta) {
      ta.reset(repostContent, true, true)
      keyUpCb()
    });

    SNB.Util.dialog_vertical_middle($dialogRepost.closest(".ui-dialog"));

  }
})
