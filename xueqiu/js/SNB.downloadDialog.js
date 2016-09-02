define('SNB.downloadDialog.js', ["download-dialog.jade.js","SNB.editor"], function (require, exports, module) {  var template = require('./download-dialog.jade')
    , editor = require('SNB.editor.js')
    , dTa = $.Deferred()
    , pTa = dTa.promise()
    , id, href, defaultText, screenName
    , showDialog = function($atDialog) {
        var $tdc = $('.tipsdivcontent', $atDialog)
          , ta = $tdc.data('ta')
          , $errMsg = $('.errMsg', $atDialog)
          , $submit = $(".downloadRepost", $atDialog)
        $atDialog.dialog({
          title: "下载研报",
          modal: true,
          width: 520
        });
        if (!ta) { // 初次载入 atDialog
          function submit () {
            var content = SNB.Util.cleanContent(ta.getContent(), false, ta.editor)
            var repostForward = SNB.Util.isContentSame(content, defaultText) ? 0 : 1;
            if (id) SNB.post('/statuses/repost.json', {id: id, status: content, forward: repostForward});
          }
          ta = editor.init($tdc, {
              ctrlReturn: true
            , submitFunc: submit
          })

          if ($.browser.isMobile) dTa.resolve(ta)
          else if (!ta.editor) ta.upgrade({ autoheight: false }, function() {
            $('.ueditor-wrapper', $atDialog).height(70)
            dTa.resolve(ta)
          })

          $('.downloadOnly, .downloadRepost', $atDialog).click(function () {
            if ($(this).hasClass('downloadRepost')) submit();
            window.open(href);
            $atDialog.dialog("close");
          });
        }
      }

  $(function() {
    $('body').on('click', '[data-toggle="download"]', function(e) {
      var $el = $(this);
      href = $el.attr('href');
      screenName = $el.data('screen-name');
      var profile = $el.data('profile');
      if (!screenName) {
        var $a = $el.parents('.retweet,.detail').children('a[data-name]'); //单条页
        if (!$a.length) $a = $el.parents('.expandable').find('>p>a[data-name]'); //timeline
        if (!$a.length) return true;
        screenName = $a.data('name');
        profile = $a.attr('href');
      }

      id = $el.data('status-id');
      if (!id) {
        var $atime = $el.parents('.retweet').find('>.meta>a'); //转发单条页
        if (!$atime.length) $atime = $el.parents('.detail').siblings('.meta').find('>a').eq(0) //单条页原文
        if (!$atime.length) $atime = $el.parents('.retweet.expandable').find('>.meta>a') // timeline 上的转发
        if (!$atime.length) $atime = $el.parents('.status.expandable').siblings('.meta').find('>.infos>a').eq(0) //timeline上的原文
        id = $atime.length ? $atime.attr('href').match(/\d+$/) : undefined;
        if (id) id = id[0];
      }

      if (profile.match(/\/S\//i)) {
        defaultText = '我刚下载了 $' + screenName + '$ 的雪球投资研报，推荐给你。';
      } else {
        var title = $.trim($a.parents('.retweet,.detail,.expandable').find('>h4,>h3').text());
        if (title) title = '《' + title + '》';
        defaultText = '我刚下载了 @' + screenName + ' 分享的研报' + title + '，推荐给你。';
      }
      e.preventDefault();
      SNB.Util.checkLogin(function(){
        $('body').findOrAppend('>.ui-dialog>#dialog-download', template, function($dlDialog) {
          showDialog($dlDialog)
          pTa.done(function(ta) {
            ta.reset(defaultText, true)
          })
        })
      }, e);
    })
  })
})
;
define("download-dialog.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="dialog-download" class="dialog-wrapper"><div class="tipsdivcontent"><textarea id="atHeStatusTextBox" class="tips_textarea"></textarea></div><div style="text-align:right;width:100%"><input type="button" value="下载" class="button downloadOnly"/><input type="button" value="下载并转发" class="submit downloadRepost"/></div></div>');
}
return buf.join("");
};module.exports = anonymous;});