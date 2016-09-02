/**
 * Created by gaowhen on 14-7-4.
 */

define('widget/global_pin.js', [], function (require, exports, module) {//  var Share = require('./util/share');

  function tmpl(data) {
    var _tmpl = _.template('' +
      '<div id="dialog-global-pin">' +
        '<div class="global-pin-bd">' +
          '<div id="pin-wrap" class="bd-wrap">' +
            '<h4>把本帖推荐到粉丝首页第一条位置</h4>' +
            '<% if (discount > 0) { %>' +
              '<p><del class="original-price">原价：<%= amount %> 雪球币</del><span class="discount-price"><%= resultPrice %> 雪球币</span><span class="discount">限时优惠 <%= discount %>%</span></p>' +
            '<% } %>' +
            '<% if (balance >= resultPrice) { %>' +
              '<p class="tip">' +
                '应付：<%= resultPrice %> 雪球币，' +
                '<span class="balance">帐号余额：<%= balance %> 雪球币</p>' +
              '</p>' +
            '<% } else { %>' +
              '<p class="tip warn">' +
                '应付：<%= resultPrice %> 雪球币，' +
                '<span class="balance">帐号余额：<%= balance %> 雪球币，请先购买雪球币</p>' +
              '</p>' +
            '<% } %>' +
            '<div class="global-pin-ft">' +
              '<% if (balance > resultPrice) { %>' +
                '<a href="#" class="btns btn-confirm" data-amount="<%= amount %>">购买粉丝头条</a>' +
              '<% } else { %>' +
                '<a href="#" class="btns btn-confirm disable" data-amount="<%= amount %>">购买粉丝头条</a>' +
              '<% } %>' +
              '<a href="/c/deposit" target="_blank" class="btn-recharge">购买雪球币</a>' +
            '</div>' +
          '</div>' +
          '<div id="recharge-wrap" class="bd-wrap" style="display:none;">' +
            '<p>请在新窗口购买雪球币，完成之前请不要关闭此窗口</p>' +
            '<div class="recharge-ft">' +
              '<a href="#" class="btns btn-done">已完成</a>' +
              '<a href="/c/deposit" target="_blank" class="btns btn-redo">重新购买</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>');

    return $(_tmpl(data));
  }

  function Dialog(status) {
    return this.init(status);
  }

  Dialog.prototype = {
    init: function (data) {
      $.post('/c/balance', function (res) {
        $.post('/valueadded/top/get_price.json', {
          top_type: 0,
          status_id: data.id
        }, function (result) {
          var $dialog = tmpl({
            balance: res.snow_coin,
            amount: result.price,
            resultPrice: result.resultPrice,
            discount: 100 - (result.discount * 100)
          });

          $dialog
            .dialog({
              modal: true,
              title: '粉丝头条',
              width: 400,
              close: function () {
                $dialog.dialog('destroy').remove();
              }
            });

          $dialog
            .find('.btn-confirm')
              .on('click', function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.is('.disable')) {
                  return false;
                }

                $.get('/c/pin/session', function (tokenRes) {
                  var token = tokenRes[0].toString();

                  $.post('/c/pin', {
                    top_type: 0,
                    status_id: data.id,
                    session_token: token
                  }, function (res) {
                    $dialog.dialog('close');

                    if (res.error_code) {
                      SNB.Util.failDialog(res.error_description);
                    } else {
                      SNB.Util.stateDialog('粉丝头条购买成功');
                    }
                  });
                });

                return false;
              })
            .end()
            .find('.btn-recharge')
              .on('click', function () {
                $('.bd-wrap').hide();
                $('#recharge-wrap').show();
              })
            .end()
            .find('.btn-done')
              .on('click', function (e) {
                e.preventDefault();

                $('.bd-wrap').hide();
                $('#pin-wrap').show();

                $.post('/c/balance', function (res) {
                  $.post('/valueadded/top/get_price.json', {
                    top_type: 0,
                    status_id: data.id
                  }, function (result) {
                    var $tip = $dialog.find('#pin-wrap .tip'),
                      tip = '应付：' + result.resultPrice + '雪球币，';

                    if (res.snow_coin < result.resultPrice) {
                      tip += '<span class="balance">帐号余额：' + res.snow_coin + '雪球币，请先购买雪球币</span>';
                      $tip.addClass('warn').html(tip);

                      $dialog.find('.btn-confirm').addClass('disable');
                    } else {
                      tip += '<span class="balance">帐号余额：' + res.snow_coin + '雪球币</span>';
                      $tip.removeClass('warn').html(tip);

                      $dialog.find('.btn-confirm').removeClass('disable');
                    }
                  });
                });

                return false;
              });
        });
      });
    }
  };

  module.exports = exports = function (data) {
    return new Dialog(data);
  };

});