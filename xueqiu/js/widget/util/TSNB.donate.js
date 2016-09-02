/**
 * Created by gaowhen on 14-9-10.
 */

define('widget/util/TSNB.donate.js', ["common/util/password","widget/forward","pagelets/donate/donate.jade.js"], function (require, exports, module) {  var Password = require('common/util/password');
  var Forward = require('widget/forward.js');

  var tmpl = require('pagelets/donate/donate.jade');

  function getBalance(amount, dialog, callback) {
    var $tip = dialog.find('.tip');
    var $btnDonate = dialog.find('.btn-donate');
    var text = '';

    $tip.hide();

    if (!amount || !/^[1-9]\d*$/.test(amount)) {
      text = '输入数量错误，请输入整数';
      $tip.addClass('warn');
      $btnDonate.addClass('disabled');
      $tip.text(text).show();
    } else if (amount >= 50000) {
      text = '赞助数额不能超过50000雪球币';
      $tip.addClass('warn');
      $btnDonate.addClass('disabled');
      $tip.text(text).show();
    } else {
      $.post('/c/balance', function (res) {
        var balance = res.snow_coin;

        if (balance >= amount) {
          text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币';
          $tip.removeClass('warn');
          $btnDonate.removeClass('disabled');

          if (callback && typeof callback === 'function') {
            callback();
          }
        } else if (balance < amount) {
          text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币，请先购买雪球币';
          $tip.addClass('warn');
          $btnDonate.addClass('disabled');
        }

        $tip.text(text).show();
      });
    }
  }

  function Dialog($ele, data, callback) {
    return this.init($ele, data, callback);
  }

  Dialog.prototype = {
    init: function ($ele, data, callback) {
      data.title = '赞助';

      var $dialog = $(tmpl({
        data: data
      }));

      $dialog.appendTo('body').modal('show');

      $dialog.find('.coin-amount').blur();

      $dialog.find('.item')
        .on('click', function () {
          var $this = $(this),
            $btn = $dialog.find('.btn-donate');

          $btn.removeClass('disabled');

          $this.siblings('li').removeClass('on');
          $this.addClass('on');

          $('.coin-amount').val('');

          var amount = $this.data('amount');

          getBalance(amount,$dialog);

          $dialog
            .find('.btn-donate')
            .data('amount', amount)
            .removeClass('validate');
        });

      //默认激活赞助1雪球币
      $dialog.find('.item').eq(0).trigger('click');

      $dialog.find('.coin-amount')
        .on('focus', function () {
          $dialog.find('.tip').hide();

          var $this = $(this),
            $item = $this.parents('.item-custom'),
            $btn = $dialog.find('.btn-donate');

          $btn
            .data('amount', 0)
            .addClass('disabled');

          $item.addClass('on');
          $item.siblings('li').removeClass('on');
          $dialog.find('.tip').hide();

          var amount = $.trim($this.val());

          if (amount) {
            $btn.data('amount', amount);
          }

          $dialog.find('.btn-donate').addClass('validate');
        })
        .on('keyup', function () {
          var $this = $(this),
            $item = $this.parents('.item-custom'),
            $btn = $dialog.find('.btn-donate');

          var $btnDonate = $('#donate-wrap .btn-donate');
          var $tip = $('#donate-wrap .tip');
          var text = '';

          $btn.removeClass('disabled');

          $item.addClass('on');
          $item.siblings('li').removeClass('on');

          var amount = $.trim($this.val());

          if (!amount) {
            $tip.text('').hide();
            $btnDonate.addClass('disabled');
            $btnDonate.data('amount', 0);

            return false;
          }

          if (!/^[1-9]\d*$/.test(amount)) {
            text = '输入数量错误，请输入整数';
            $tip.addClass('warn');
            $btnDonate.addClass('disabled');
            $tip.text(text).show();
          } else if (amount >= 50000) {
            text = '赞助数额不能超过50000雪球币';
            $tip.addClass('warn');
            $btnDonate.addClass('disabled');
            $tip.text(text).show();
          } else {
            $.post('/c/balance', function (res) {
              var balance = res.snow_coin;

              if (balance >= amount) {
                text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币';
                $tip.removeClass('warn');
                $btnDonate.removeClass('disabled');
                $btnDonate.data('amount', amount);
              } else if (balance < amount) {
                text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币，请先购买雪球币';
                $tip.addClass('warn');
                $btnDonate.addClass('disabled');
              }

              $tip.text(text).show();
            });
          }
        });

      function done(amount, res) {
        if (res.success) {
          data.amount = amount;
          var text = '';

          $dialog.modal('hide');

          // refresh donate coins number
          var $coin = $ele.find('.snow-coin');
          var coinPrev = $coin.data('count');
          var total = coinPrev - 0 + (amount - 0);
          var coin = total;

          if (total > 9999) {
            if (total % 10000 > 99) {
              coin = (total / 10000).toFixed(2) + '万';
            } else {
              coin = Math.floor(total / 10000) + '万';
            }
          }

          $coin.data('count', total);
          $coin.text(coin);
          $ele.find('.number').show();

          var $status = $ele.parents('.status-item');
          var statusId = $status.data("id");

          if (!statusId) {
            statusId = $ele.parents(".comment-item").data("statusid");
          }

          switch (data.type) {
            case 'comment':
              var $comment = $ele.parents('.comment-item');

              text = '我刚赞助了这条评论 ' + amount + ' 雪球币，也推荐给你。';

              Forward.show({
                action: '/statuses/reply.json',
                name: 'comment',
                text: text
              }, {
                id: statusId,
                cid: $comment.data('id'),
                forward: 1
              });

              break;
            case 'status':
              text = '我刚赞助了这篇帖子 ' + amount + ' 雪球币，也推荐给你。';
              if (data.status.retweeted_status && data.status.user && data.status.user.screen_name) {
                text += '&nbsp;//@' + data.status.user.screen_name + ': ' + data.status.text;
              }
              // refresh donators list
              var $donators = $status.find('.donators');
              var foldStatus = $donators.data('.status');

              $.get('/service/status/' + $status.data('id') + '/donators', function (html) {
                $donators.replaceWith(html);

                var $list = $('#donator-list');

                if (!foldStatus || foldStatus === 'fold') {
                  $list.css({
                    overflow: 'hidden',
                    height: '45px'
                  });
                } else {
                  $list.css({
                    height: 'auto'
                  });
                }
              });

              Forward.show({
                action: '/statuses/repost.json',
                name: 'status',
                text: text
              }, {
                id: $status.data('id')
              });

              break;
            default:
          }

          if (callback && typeof callback === 'function') {
            callback(amount);
          }
        } else if (21722 == res.error_code) {
          $dialog.find('.bd-wrap').hide();
          try {
            $dialog.find('#pwd-wrap').show().find('.pwd').focus().find('.amount').text(amount);
          } catch (e) {

          }
        } else if (28015 == res.error_code) {
          $dialog.find('.tip').show();
        } else if (21723 == res.error_code) {
          $('#pwd-wrap .warn').show();
        } else {
          alert(res.error_description);
        }
      }

      $dialog.find('.btn-donate').on('click', function (e) {
        e.preventDefault();
        var $this = $(this),
          amount = $this.data('amount');

        if ($this.hasClass('disabled') || $this.data('amount') === 0) {
          return;
        }

        var cb = function () {
          $.get('/c/donate/session', function (res) {
            var token = res.toString();

            $.post('/c/donate', {
              to_id: data.id,
              to_type: data.type,
              amount: amount,
              session_token: token
            }, function (res) {
              done(amount, res);
            });
          });
        };

        $this.addClass('disabled');

        if ($this.hasClass('validate')) {
          var $tip = $('#donate-wrap .tip');
          var text = '';

          $tip.hide();

          if (!amount || !/^[1-9]\d*$/.test(amount)) {
            text = '输入数量错误，请输入整数';
            $tip.addClass('warn');
            $tip.text(text).show();
          } else if (amount >= 50000) {
            text = '赞助数额不能超过50000雪球币';
            $tip.addClass('warn');
            $tip.text(text).show();
          } else {
            $.post('/c/balance', function (res) {
              var balance = res.snow_coin;

              if (balance < amount) {
                text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币，请先购买雪球币';
                $tip.addClass('warn');

                $tip.text(text).show();
              } else {
                if (cb && typeof cb === 'function') {
                  cb();
                }
              }
            });
          }
        } else {
          cb();
        }

        return false;
      });

      $dialog.find('.btn-confirm')
        .on('click', function (e) {
          e.preventDefault();
          var $this = $(this);

          if ($this.hasClass('disabled')) {
            return false;
          }

          $this.addClass('disabled');

          var amount = $dialog.find('.btn-donate').data('amount'),
            pwd = $.trim($dialog.find('.pwd').val());

          pwd = Password.encryPw(pwd);

          $.get('/c/donate/session', function (res) {
            var token = res.toString();

            $.post('/c/donate', {
              to_id: data.id,
              to_type: data.type,
              amount: amount,
              password: pwd,
              session_token: token
            }, function (res) {
              done(amount, res);
            });
          });

          return false;
        });

      $dialog.find('.pwd')
        .on('keyup', function (e) {
          if (e.keyCode == 13) {
            $dialog.find('.btn-confirm').trigger('click');
          }
        });

      $dialog.find('.btn-recharge')
        .on('click', function () {
          $('.bd-wrap').hide();
          $('#recharge-wrap').show();
          $dialog.trigger('show');
        });

      $dialog.find('.btn-done')
        .on('click', function (e) {
          e.preventDefault();

          $('#recharge-wrap').hide();
          $('#donate-wrap').show();
          $dialog.trigger('show');

          var $on = $('#donate-wrap .on');

          if ($on.length) {
            if ($on.is('.item-custom')) {
              $on.find('.coin-amount').trigger('keyup');
            } else {
              $on.trigger('click');
            }
          }

          return false;
        });

      $dialog.find('.pwd')
        .on('focus', function () {
          var $this = $(this);
          var $wrap = $this.parents('.bd-wrap');
          var $warn = $wrap.find('.warn');

          $dialog.trigger('show');

          $warn.hide();
          $dialog.find('.btn-confirm').removeClass('disabled');
        });

      return $dialog;
    }
  };

  module.exports = exports = function ($ele, data, callback) {
    return new Dialog($ele, data, callback);
  };

});
;
define("pagelets/donate/donate.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
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
 var modalView = {hideClose: false, id: 'donate-dialog', className: 'modal-donate', title: '赞助'};
modal_mixin.call({
block: function(){
buf.push('<div class="before"></div><div class="after"></div><div style="width:380px" class="dialog-donate"><div class="donate-bd"><div id="donate-wrap" class="bd-wrap"><p class="title">欢迎赞助！请选择赞助给 ' + escape((interp = data.user.screen_name) == null ? '' : interp) + ' 的金额</p><ul class="item-list"><li data-amount="1" class="item">1雪球币</li><li data-amount="6" class="item">6雪球币</li><li data-amount="10" class="item">10雪球币</li><li data-amount="66" class="item">66雪球币</li><li data-amount="100" class="item">100雪球币</li><li data-amount="" class="item-custom"><input type="text" placeholder="其他金额" maxlength="5" class="coin-amount"/></li></ul><p style="display:none" class="tip"></p><div class="donate-ft"><button href="#" class="btn btn-medium btn-donate disabled">赞助</button><a href="/c/deposit" target="_blank" class="btn-recharge">购买雪球币</a></div></div><div id="recharge-wrap" style="display:none" class="bd-wrap"><p>请在新窗口购买雪球币，完成之前请不要关闭此窗口</p><div class="recharge-ft"><button href="#" class="btn btn-medium btn-done">已完成</button><a href="/c/deposit" target="_blank" class="btn btn-medium btn-redo">重新购买</a></div></div><div id="pwd-wrap" style="display:none" class="bd-wrap"><p>你最近消费较多雪球币，为确保账户安全，</p><p>请输入登录密码进行确认:</p><p><input type="password" class="pwd"/><span style="display:none" class="warn">密码错误</span></p><div class="pwd-ft"><button href="#" class="btn btn-medium btn-confirm">确认</button></div></div></div></div>');
}
}, modalView);
}
return buf.join("");
};module.exports = anonymous;});