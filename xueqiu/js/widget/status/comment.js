/**
 * @fileOverview
 * @author rekey
 * Created by rekey on 12/8/14.
 */
define('widget/status/comment.js', ["common/util/jquery.extend","widget/util/asksuccess","widget/util/user","common/util/observer","pagelets/mixin/comment-dialog.jade.js","pagelets/util/editor.jade.js","widget/editor","widget/util/modal","widget/status/data","widget/util/TSNB.donate"], function (require, exports, module) {  require('common/util/jquery.extend.js');
  var AskSuccess = require('widget/util/asksuccess.js');

  var $ = jQuery;
  var User = require('widget/util/user.js');
  var Observer = require('common/util/observer.js');
  //var $html = $('html');
  var modalCommentHtml = require('pagelets/mixin/comment-dialog.jade');
  var commentEditorHtml = require('pagelets/util/editor.jade');
  var Editor = require('widget/editor');
  var Modal = require('widget/util/modal.js');
  var filterContent = Editor.filterContent;
  var Data = require('widget/status/data');
  var Donate = require('widget/util/TSNB.donate');


  Observer.subscribe('comment:post:done', function (e, data) {
    var id = data.data.id;
    var $status = $('#status-' + id);
    var $commentBox = $status.find('.comment-all');
    if (!$commentBox[0]) {
      module.exports.getAllComments(id, $status.data('uid'));
    } else {
      $commentBox.find('.comment-list').prepend(data.resp);
      var $totalCount = $commentBox.find('.total-count');
      var total = $totalCount.html().match(/[\d]+/);
      $totalCount.html('(' + (++total[0]) + ')');
    }
    if (data.form.parents('.comment-item').length > 0) {
      data.form.parent().hide();
    }
    Modal.alert('发布成功', 'success');
  });

  Observer.subscribe('comment:post:fail', function (e, data) {
    if (data.jqxhr && data.jqxhr.responseJSON && data.jqxhr.responseJSON.error_description) {
      Modal.alert(data.jqxhr.responseJSON.error_description, 'warn');
    }
  });

  /*
   * 获取 status 的评论列表
   * */
  function getComments(data) {
    data.type = 'status';
    return $.get('/service/comment/list', data);
  }

  /*
   * 发送评论
   * @param uri {String} 发表评论 api 地址
   * @param data {Object} 评论数据
   * @param $form {Object} form Element 的 jQuery Wrap 对象
   * @return {Promise} jQuery ajax Promise
   * */
  function post(uri, data, $form) {
    //data.comment = data.comment.replace(/</g, '&lt;');
    //data.comment = data.comment.replace(/>/g, '&gt;');
    data.comment = filterContent(data.comment).replace(/\n/g, '<br />');
    var $button = $form.find('button[type=submit]');
    return $.ajax({
      url: uri,
      data: data,
      type: 'post'
    }).always(function (resp, status/*, jqxhr*/) {
      $button.removeAttr('disabled');
      if (status === 'success') {
        Observer.publish('comment:post:done', {
          resp: resp,
          data: data,
          form: $form
        });
      } else {
        Observer.publish('comment:post:fail', {
          jqxhr: resp,
          data: data,
          form: $form
        });
      }
    });
  }

  /*
   * 更换排序，分页内容更新
   * @param resp {String} ajax 返回的 html 片段
   * @param $commentBD {Object} 评论列表的包装 dom
   * */
  function updateComments($comment, resp) {
    var $commentAll = $comment;
    var $commentModBD = $commentAll.find('.comment-mod-bd');
    var $commentModFT = $commentAll.find('.comment-mod-ft');
    $commentAll.append(resp);
    $commentModBD.remove();
    $commentModFT.remove();
  }

  /*
   * 初始化评论表单
   * @param $form {Element} form Element
   * @return undefined
   * */
  function initForm(form, successCallback, failCallback) {
    var $form = $(form);
    var $textarea = $form.find('textarea');
    var um = $form.data('um') || Editor.comment($form);
    var $button = $form.find('button[type=submit]');
    var isAskReply = $form.hasClass('comment-form-ask');//问答帖待回复
    var paid_amount = $form.closest('.comment-item').length != 1 ? $form.closest('.status-item').data('paid') : $form.closest('.comment-item').data('paid'); //回复可以获得的钱数
    var paid_payment = $form.closest('.status-item').data('payment'); //提问支付的钱

    //command + enter 提交
    um.on('keySubmit', function () {
      $form.submit();
    });

    if (isAskReply) {

      var insertHtml = "<div class='placeholder'></div>";
      var insertText = "接收对方的提问支付[¥" + (paid_amount / 100).toFixed(2) + "]";
      var insertText2 = "拒绝后将得不到对方所支付费用";

      $form.find(".edui-editor-body").append(insertHtml);
      var $placeholder = $form.find(".edui-editor-body .placeholder");

      $placeholder.text(insertText);
      um.on('focus', function () {
        $placeholder.hide();
      });
      um.on('blur', function () {
        if (um.getContent() == "") {
          $placeholder.show();
        }
      });
      $form.find('.ask-refuse input').on('click', function () {
        if ($form.find('.ask-refuse input').prop("checked")) {
          $form.removeClass("comment-form-ask");
          if ($form.closest('.comment-item').length > 0) {
            $form.closest('.comment-item').find(".btn-reply").attr('style', 'color:#0055aa !important');
          } else {
            $form.closest('.status-item').find(".btn-ask-reply").attr('style', 'color:#0055aa !important');
          }
          $form.find('.ask-refuse').show();
          $placeholder.text(insertText2);
        } else {
          $form.addClass("comment-form-ask");
          if ($form.closest('.comment-item').length > 0) {
            $form.closest('.comment-item').find(".btn-reply").attr('style', '');
          } else {
            $form.closest('.status-item').find(".btn-ask-reply").attr('style', '')
          }
          $placeholder.text(insertText);
        }
      });
    }


    $form.on('submit', function () {

      $textarea.val(um.getContent());
      var data = $form.formSerialize();
      var isAskFinished = $form.data('finished') || false;//回复完成
      var $reply = $form.closest('.status-item').find('.btn-status-reply');
      var $repost = $form.closest('.status-item').find('.btn-repost');
      var is_Repost = $form.find('input[name=forward]').prop("checked");

      if (isAskReply) {
        data.answer = true;
        data.charge = !$form.find('.ask-refuse input').prop("checked");
        if (isAskFinished) {
          data.answer = false;
        }
      }
      var uri = $form.attr('action');

      var poster = post(uri, data, $form);

      $button.attr('disabled', true);

      poster.done(function (resp) {
        um.setContent('');
        if (isAskReply) {
          $form.removeClass('comment-form-ask');

          var $closestItem = "";
          var $ask_status ="";
          if ($form.closest('.comment-item').length > 0) {
            $closestItem = $form.closest('.comment-item');
            $ask_status = $closestItem.find(".comment-item-bd .ask-status");
            $closestItem.removeClass("comment-item-ask");
          } else {
            $closestItem = $form.closest('.status-item');
            $closestItem.removeClass("status-item-ask");
            $ask_status = $closestItem.find(".status-bd .ask-status");
          }

          $ask_status.removeClass('askgold').html(data.charge ? "已回复" : "已拒绝");
          $closestItem.find(".ask-time").closest("a").remove();
          $closestItem.find(".ask-refuse").hide();
          $form.data('finished', "true");

          if (data.charge && !isAskFinished) {
            AskSuccess({
              paid_amount: paid_amount
            }, function () {
              console.log("回复成功");
            });
          }
        }
        if ($.isFunction(successCallback)) {
          successCallback({
            data: data,
            resp: resp
          });
        }
        //更新评论数,转发数
        var oldreply = Number($reply.find('.em_number').html());
        $reply.find('.number').show().find('.em_number').html(oldreply + 1);
        if (is_Repost) {
          var oldrepost = Number($repost.find('.em_number').html());
          $repost.find('.number').show().find('.em_number').html(oldrepost + 1);
        }
      });
      poster.fail(function (jqxhr) {

        //如果是因为没有登录，默认调用登录模块登录后重发。
        //error_code = 10022 代表用户没有登录。
        var responseJSON = jqxhr ? jqxhr.responseJSON : {};

        if (responseJSON && responseJSON.error_code == '10022') {
          User.login().done(function () {
            $form.submit();
          });
        }

        //问答回复超时
        if (responseJSON && responseJSON.error_code == '20227') {
          $form.removeClass("comment-form-ask");
          Modal.confirmOther("已超时提示", "你未在48小时内进行回复,选择仍发布后将得不到相关费用", {
            sure: '仍发布',
            title: "已经超时提示"
          }).done(function () {
            $form.submit();
          }).fail(function () {
            $form.find(".edui-editor-body .placeholder").hide();
          });
        }

        if ($.isFunction(failCallback)) {
          failCallback(jqxhr.responseJSON);
        }
      });
      return false;
    });

    return um;
  }

  function loading($comment) {
    var $commentAll = $comment;
    var offset = $commentAll.offset().top - 50;
    var $commentModBD = $commentAll.find('.comment-mod-bd');
    var height = $commentAll.find('.comment-mod-bd').height();

    $(window).scrollTop(offset);

    $commentModBD.css('min-height', height);
    $commentModBD.empty();
    $commentModBD.prepend('<div class="loading"></div>');
  }

  //查看对话的单例对象
  var Talks = {
    $wrap: null,
    $content: null,
    data: {},
    xhr: {},
    loading: false,
    max: null,
    init: function () {
      if (this.$wrap) {
        return;
      }

      var me = this;
      var html = modalCommentHtml();
      var $wrap = $(html);
      var $content = $wrap.find('.modal-content');

      var width = $('.status-content').width();

      $wrap.css({'marginLeft': -(width / 2 + 5)});
      $wrap.find('.modal-wrap').css({'width': width});
      $wrap.appendTo('body');
      me.$wrap = $wrap;
      me.$content = $content;

      $wrap.on('hide', function () {
//        $html.css({
//          'overflow-y': 'auto',
//          'height': 'auto'
//        });
        //如果正在拉数据，尝试终止
        if ($.isFunction(me.xhr.abort)) {
          me.xhr.abort();
        }
      });

//      $wrap.on('show', function () {
//        $html.css({
//          'overflow-y': 'hidden',
//          'height': '100%'
//        });
//      });

      $content.on('scroll', function () {
        var contentElement = this;
        var scrollHeight = contentElement.clientHeight + contentElement.scrollTop + 100;
        //没有再加载
        //没有到最后一页
        //滑动到了具体底部100px
        if (me.loading !== true && me.max > me.data.page && scrollHeight > contentElement.scrollHeight) {
          me.data.page++;
          me.get();
        }
      });

    },
    show: function (data) {
      this.init();
      this.clean();
      this.data = data;
      this.get();
    },
    get: function () {
      if (this.loading) {
        return;
      }
      var me = this;
      var data = $.extend({}, me.data);
      var xhr;
      me.loading = true;
      //xhr 对象保存一份，供取消时调用
      xhr = this.xhr = $.get('/service/comment/talks', data);
      xhr.done(function (resp) {
        me.loading = false;
        //检测当前请求的 commentId 和 最新的 commentId 是否一致，不是直接放弃操作
        if (data.comment_id !== me.data.comment_id) {
          return;
        }
        me.render(resp, data);
      });
      xhr.fail(function () {
        alert('未知错误，请刷新后重试。');
      });
    },
    render: function (resp, data) {
      var $content = this.$content;
      if (data.page === 1) {
        $content.html(resp);
        //贴完 html 以后将滑动条拉回到最顶的位置。
        this.max = $content.find('.comment').data('max');
        setTimeout(function () {
          $content.scrollTop(0);
        }, 1);
      } else {
        var $div = $(resp);
        $content.find('.comment-bd').append($div.find('.comment-list'));
        $div.remove();
      }
      this.$wrap.modal({
        keyboard: true
      });
      //this.$wrap.trigger('show');
    },
    clean: function () {
      this.$content.html('');
    }
  };

  $(function () {
    Talks.init();
  });

  //初始化评论事件
  $(function () {
    //排序点击事件
    $(document).on('click', '.comment-mod .btn-sort', function (e) {
      e.preventDefault();

      var $link = $(this);
      var $comment = $link.parents('.comment-mod');
      var $status = $comment.parents('.status-item');
      var $sortActive = $($comment.find('.sort .active'));

      loading($comment);

      var comments = getComments({
        id: $status.data('id'),
        sort: $link.data('sort')
      });

      comments.done(function (resp) {
        $sortActive.removeClass('active');
        $link.addClass('active');
        $sortActive = $link;
        updateComments($comment, resp);
      });

      return false;
    });

    //分页
    $(document).on('click', '.comment-mod .pages a', function (e) {
      e.preventDefault();

      var $link = $(this);
      var $comment = $link.parents('.comment-mod');
      var $status = $comment.parents('.status-item');
      var $pager = $comment.find('.pages');
      var $sortActive = $comment.find('.sort .active');

      var _page = $link.html();
      var page = $pager.find('.active a').html() - 0;
      var sort = $sortActive.data('sort');

      if ($link.hasClass('prev')) {
        _page = page - 1;

      } else if ($link.hasClass('next')) {
        _page = page + 1;
      }

      loading($comment);

      var comments = getComments({
        id: $status.data('id'),
        user_id: $status.data('uid'),
        sort: sort,
        page: _page
      });

      comments.done(function (resp) {
        page = _page - 0;
        updateComments($comment, resp);
      });

      return false;
    });

    //查看对话
    $(document).on('click', '.comment-item .btn-review', function (e) {
      e.preventDefault();

      var $link = $(this);
      var $comment = $link.parents('.comment-item');
      var $status = $comment.parents('.status-item');

      Talks.show({
        id: $status.data('id'),
        comment_id: $comment.data('id'),
        page: 1
      });

      return false;
    });

    //回复评论
    $(document).on('click', '.comment-item .btn-reply', function (e) {
      e.preventDefault();

      var $this = $(this);
      var $item = $this.parents('.comment-meta');
      var $next = $item.next('.editor-comment');
      var isaskreply = $this.closest('.comment-item').data('ask');

      if ($next[0]) {
        $next.toggle();

        if ($next.css('display') === 'block') {
          $next.find('form').data('um').focus();
        }
        return;
      }

      var $comment = $item.parents('.comment-item');

      $next = $(commentEditorHtml({
        data: {
          data: {
            id: $comment.data('statusid'),
            cid: $comment.data('id'),
            split: true,
            qtype: "COMMENT"
          },
          opts: {
            showRefuse: true,
            isAsk: isaskreply
          }
        }
      }));

      $item.after($next);

      $next.show();

      var $form = $next.find('form');

      var um = Editor.comment($form, {
        height: 55
      });

      $form.data('um', um);

      initForm($form);

      $form.find('.cancel').on('click', function () {
        $this.trigger('click');
      });
    });

    //删除评论
    $(document).on('click', '.comment-item .btn-delete', function (e) {
      e.preventDefault();

      var $this = $(this);
      var $commentItem = $this.parents('.comment-item');
      var id = $commentItem.attr('id').replace('comment-', '');
      var showText = "确定删除吗？";
      if ($commentItem.data('ask_state') == "UNANSWERED" && SNB.currentUser && SNB.currentUser.id == $commentItem.data('comment-status-id')) {
        showText = "删除后钱不退还，将转给被提问者";
      }
      var check = Modal.confirm(showText);
      check.done(function () {
        var post = $.post('	/comments/destroy/' + id + '.json');
        post.done(function (resp) {
          Observer.publish('comment:delete:success', {
            data: {
              resp: resp
            }
          });
          Modal.alert('删除成功', 'success');
          $commentItem.remove();
        });
        post.fail(function (jqxhr) {
          var responseJSON = jqxhr.responseJSON;
          if (responseJSON && responseJSON.error_description) {
            Modal.alert(responseJSON.error_description, 'error');
          } else {
            Modal.alert('内部问题，请稍后重试。', 'error');
          }
        });
      });
    });

    //修改评论
    $(document).on('click', '.comment-item .btn-edit', function (e) {
      e.preventDefault();

      var $this = $(this);
      var $comment = $(this).parents('.comment-item');
      var $div = $comment.find('.comment-edit');
      if ($div.length > 0) {
        $comment.find('.comment-item-bd,.comment-item-ft').toggle();
        $div.toggle();
        return;
      }
      //问答编辑删除声明
      $comment.find('.askstatement').remove();

      var $next = $(commentEditorHtml({
        data: {
          action: '/comments/edit.json',
          name: 'text',
          data: {
            id: $comment.data('id'),
            split: true
          },
          opts: {
            hideForward: true
          }
        }
      }));
      $div = $('<div style="overflow: hidden" class="comment-edit"></div>');
      $comment.find('.comment-item-bd,.comment-item-ft').hide();
      $comment.append($div);
      $div.append($next);
      $next.show();

      var um = Editor.comment($next, {
        height: 55
      });

      var $form = $next.find('form');
      var $textarea = $form.find('textarea');
      $form.on('submit', function () {
        $textarea.val(um.getContent());
        var data = $form.formSerialize();
        var uri = $form.attr('action');
        data.text = filterContent(data.text).replace(/\n/g, '<br />');
        //检测是否可以发送评论
        $.ajax({
          url: uri,
          data: data,
          type: 'post'
        }).done(function (resp) {
          $comment.find('.comment-item-bd .detail').eq(0).html(resp.text);
          $comment.find('.comment-item-bd,.comment-item-ft').show();
          $comment.find('.data-comment').html(JSON.stringify(resp));
          um.destroy();
          $div.remove();
          Modal.alert('修改成功', 'success');
        }).fail(function (jqxhr) {
          var data = jqxhr.responseJSON;
          if (data.error_description) {
            Modal.alert(data.error_description, 'warn');
          }
        });
        return false;
      });

      um.ready(function () {
        var $box = $('<div>' + $comment.find('.detail').eq(0).html() + '</div>');
        $box.find('img').each(function (index, img) {
          if (Editor.tools.isFace(img.src)) {
            $(img).after(img.alt).remove();
          }
        });
        $box.find('a').each(function (index, a) {
          var $a = $(a);
          var href = $a.attr('href');
          if (href.indexOf('//xueqiu.com/S/') > -1 || href.indexOf('//xueqiu.com/n/')) {
            $a.after($a.text()).remove();
          } else {
            $a.after(a.title).remove();
          }
        });
        //um.setContent($.trim($box.html()));
        $(um.body).find('p').children().remove();
        um.execCommand('insertHtml', $.trim($box.html()));
        $box.remove();
      });

      $form.find('.cancel').on('click', function () {
        $this.trigger('click');
      });
    });

    //$(document).on('click', '.comment-item .comment-folder', function (e) {
    //  e.preventDefault();
    //
    //  var $this = $(this);
    //  var $comment = $(this).parents('.comment-item');
    //  var comment = $.parseJSON($comment.find('.data-comment').html());
    //  var $box = $this.prev();
    //  if ($this.data('folder') === 'off') {
    //    $this.data('folder', 'on');
    //    $this.text('收起');
    //    $box.html(comment.reply_comment.text);
    //  } else {
    //    $this.data('folder', 'off');
    //    $this.text('展开');
    //    $box.html(comment.reply_comment.description);
    //  }
    //});
  });

  // 赞助评论
  $(document).on('click', '.btn-donate-comment', function (e) {
    e.preventDefault();

    var $this = $(this);

    var $comment = $this.parents('.comment-item');

    if ($this.is('.self') || !$this.data('candonate')) {
      return false;
    }

    User.login()
      .then(function () {
        return $.when(Data.status($comment.data('statusid')), Data.comment($comment.data('id')));
      })
      .then(function (status, comment) {
        Donate($this, {
          id: comment.id,
          type: 'comment',
          user: comment.user,
          status: status
        });
      });

    return false;
  });

  // 顶
  $(document).on('click', '.btn-like-comment,.btn-unlike-comment', function (e) {
    e.preventDefault();

    var $this = $(this);
    var currentCount = $this.attr('data-count');

    var $comment = $this.parents('.comment-item');

    if ($this.is('.self') || !$this.attr('data-canlike')) {
      return false;
    }

    var id = $comment.data('id');
    var api = "/service/comment/unlike";

    if ($this.hasClass("btn-like-comment")) {
      api = "/service/comment/like";
    }

    $.post(api, {
      comment_id: id
    }).done(function (resp) {
      if (resp.success) {
        if ($this.hasClass("btn-like-comment")) {
          currentCount++;
          toggleLiked($this, '已顶(' + currentCount + ')', "btn-like-comment", "btn-unlike-comment", currentCount);
        } else {
          currentCount--;
          var displayCount = '顶(' + currentCount + ')';
          if (currentCount === 0) {
            displayCount = "顶";
          }
          toggleLiked($this, displayCount, "btn-unlike-comment", "btn-like-comment", currentCount);
        }
      } else if (resp.error_code && resp.error_description) {
        Modal.alert(resp.error_description, 'warn');
      }
    });
    return false;
  });

  function toggleLiked(element, text, removeClass, addClass, currentCount) {
    var id = element.parents(".comment-item").attr("id");
    $("[id='" + id + "']").find("." + removeClass).each(function () {
      $(this).text(text).removeClass(removeClass).addClass(addClass).attr("data-count", currentCount);
    });
  }

  module.exports = {
    initForm: initForm,
    initComment: function () {
//      var $status = $comment.parents('.status-item');


    },
    getAllComments: function (sid, uid) {
      var $status = $('#status-' + sid);
      var $placeholder = $status.find('.all-comment-placeholder');
      var $placeholderNext = $placeholder.next();
      var rid = $status.data("rid");
      var $loadInfo;
      if ($placeholderNext && $placeholderNext.is('.comment-load')) {
        $loadInfo = $placeholderNext;
      } else {
        $loadInfo = $('<div class="comment-load"></div>');
        $placeholder.after($loadInfo);
      }
      $loadInfo.html('评论加载中...');
      // 加载全部评论
      $.get('/service/comment/all', {
        id: sid,
        user_id: uid,
        type: 'status',
        sort: 'false',
        rid: rid
      }).done(function (resp) {
        if ($.trim(resp) !== '') {
          $loadInfo.after(resp);
          $loadInfo.remove();
          //if ($status.find('.comment-good').length) {
          //  $status.find('.comment-good').after(resp);
          //} else {
          //  $status.find('.editor-comment').after(resp);
          //}
        } else {
          $loadInfo.html('<div class="comment-empty">暂无评论，来发表第一个评论吧</div>');
        }
      }).fail(function () {
        $loadInfo.html('<div class="comment-empty">加载评论超时，请刷新页面</div>');
      });
    },
    getGoodComments: function (sid, uid) {
      console.log("getGoodComments");
      var $status = $('#status-' + sid);
      // 加载精彩评论
      $.get('/service/comment/good', {
        id: sid,
        user_id: uid
      }).done(function (resp) {
        if ($.trim(resp) !== '') {
          var placeholder = $status.find('.good-comment-placeholder');
          placeholder.after(resp);
          //$status.find('.editor-comment').after(resp);
        }
      });
    },
    getAskComments: function (rid, sid, uid) {
      var $status = $('#status-' + sid);
      // 金@回复
      $.get('/service/comment/ask', {
        rid: rid,
        id: sid,
        user_id: uid
      }).done(function (resp) {
        if ($.trim(resp) !== '') {
          var placeholder = $status.find('.ask-comment-placeholder');
          placeholder.after(resp);
          //$status.find('.editor-comment').after(resp);
        }
      });
    },
    updataAllComments: function ($that, sid, uid) {
      if ($($that).closest('.comment-mod.comment-all').length > 0) {
        $($that).closest('.comment-mod.comment-all').remove();
        this.getAllComments(sid, uid);
      } else {
        $($that).closest('.commentInfo').find('.sort a[class="active"]').click();
      }
    }
  };

});
;
define("pagelets/mixin/comment-dialog.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
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
 var modalCommentView = {title:'查看对话', id:'modal-comment', className:'modal-comment'};
modal_mixin(modalCommentView);
}
return buf.join("");
};module.exports = anonymous;});;
define("pagelets/util/editor.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var editor_comment_mixin = function(data, opts){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
 var data = data || {};
 var opts = opts || {};
 var payAtType = 0;
 if (data.action == '/statuses/repost.json') payAtType = 3;
 if (!data.action) payAtType = 2;
 var payAtShow = (payAtType > 0)
buf.push('<div');
buf.push(attrs({ 'id':("" + (data.id || 'id-editor-' + (+new Date())) + ""), "class": ("editor-comment") }, {"class":true,"id":true}));
buf.push('><form');
buf.push(attrs({ 'action':("" + (data.action || '/service/comment/add?type=status') + ""), 'method':("post"), 'enctype':("application/x-www-form-urlencoded"), "class": ("comment-form " + (opts.isAsk? 'comment-form-ask':'') + "") }, {"class":true,"action":true,"method":true,"enctype":true}));
buf.push('>');
 if (block)
{
block && block();
}
buf.push('<div class="editor-textarea"><div class="arrow"><span class="arrow-top-out"></span><span class="arrow-top-in"></span></div><textarea');
buf.push(attrs({ 'name':("" + (data.name || 'comment') + "") }, {"name":true}));
buf.push('></textarea></div><div class="editor-ctrl"><div class="extra"><b class="editor-emotion"><span class="icon-icon_16_-25"></span></b><b class="editor-stock"><span class="icon-icon_16_-26"></span></b>');
 if (payAtShow)
{
buf.push('<b class="editor-pay"><span class="icon-icon_16_-70"></span></b>');
}
 if (opts.checkWord)
{
buf.push('<span class="word-count">还能输入<em>140</em>字</span>');
}
 if (!opts.hideForward)
{
buf.push('<label><input');
buf.push(attrs({ 'type':("checkbox"), 'name':("forward"), 'value':("1"), 'checked':((opts.isAsk?true:false)) }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/>同时转发到我的首页</label>');
}
 if (opts.showRefuse)
{
buf.push('<label class="ask-refuse"><input type="checkbox" name="charge" value="1"/>拒绝回复</label>');
}
buf.push('</div><div class="submit"><button');
buf.push(attrs({ 'type':("submit"), 'data-type':("" + (payAtType) + ""), "class": ("btn btn-medium pay-submit hidden") }, {"class":true,"type":true,"data-type":true}));
buf.push('>支付并发布</button><button type="submit" class="btn btn-medium status-submit">发布</button>');
 if (!opts.hideCancelBtn)
{
buf.push('<a class="btn btn-gray btn-medium cancel">取消</a>');
}
buf.push('</div></div></form></div>');
};
 var editorComment = {action:data.action, name:data.name};
 var editorOpts = data.opts || {};
editor_comment_mixin.call({
block: function(){
 if(typeof data !== 'undefined' && data.data)
{
// iterate data.data
;(function(){
  if ('number' == typeof data.data.length) {

    for (var key = 0, $$l = data.data.length; key < $$l; key++) {
      var item = data.data[key];

buf.push('<input');
buf.push(attrs({ 'type':("hidden"), 'name':("" + (key) + ""), 'value':("" + (item) + "") }, {"type":true,"name":true,"value":true}));
buf.push('/>');
    }

  } else {
    var $$l = 0;
    for (var key in data.data) {
      $$l++;      var item = data.data[key];

buf.push('<input');
buf.push(attrs({ 'type':("hidden"), 'name':("" + (key) + ""), 'value':("" + (item) + "") }, {"type":true,"name":true,"value":true}));
buf.push('/>');
    }

  }
}).call(this);

}
}
}, editorComment, editorOpts);
}
return buf.join("");
};module.exports = anonymous;});