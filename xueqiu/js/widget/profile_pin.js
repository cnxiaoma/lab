/**
 * Created by gaowhen on 14-7-3.
 */

define('widget/profile_pin.js', [], function (require, exports, module) {//  var Share = require('./util/share');
//  var Retweet = require('SNB.repostDialog');
  var price = {};

  function tmpl(data) {
    var _tmpl = _.template('' +
      '<div id="dialog-profile-pin">' +
        '<div class="profile-pin-bd">' +
          '<div id="pin-wrap" class="bd-wrap">' +
            '<h4>将本帖设置在个人主页顶部展示</h4>' +
            '<p>置顶时间：</p>' +
            '<ul>' +
              '<li class="item on" data-day="30">30天</li>' +
              '<li class="item" data-day="60">60天</li>' +
              '<li class="item" data-day="90">90天</li>' +
            '</ul>' +
            '<% if (discount > 0) { %>' +
              '<p class="discount-tip"><del class="original-price">原价：<%= price %>雪球币</del><span class="discount-price"><%= resultPrice %>雪球币</span><span class="discount">限时优惠 <%=  discount %>%</span></p>' +
            '<% } else { %>' +
              '<p class="discount-tip" style="display:none;"><del class="original-price">原价：<%= price %>雪球币</del><span class="discount-price"><%= resultPrice %>雪球币</span><span class="discount">限时优惠 <%=  discount * 100 %>%</span></p>' +
            '<% } %>' +
            '<% if (balance >= resultPrice) { %>' +
              '<p class="tip">应付：<%= resultPrice %>雪球币，帐号余额：<%= balance %>雪球币</p>' +
            '<% } else { %>' +
              '<p class="tip warn">应付：<%= resultPrice %>雪球币，帐号余额：<%= balance %>雪球币，请先购买雪球币</p>' +
            '<% } %>' +
            '<div class="profile-pin-ft">' +
              '<% if (balance > resultPrice) { %>' +
                '<a href="#" class="btns btn-confirm">购买主页置顶</a>' +
              '<% } else { %>' +
                '<a href="#" class="btns btn-confirm disable">购买主页置顶</a>' +
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

  function showPinDilaog(data) {
    $.post('/c/balance', function (res) {
      $.post('/valueadded/top/get_price.json', {
        top_type: 1,
        status_id: data.id
      }, function (result) {
        price = result;

        var $dialog = tmpl({
          balance: res.snow_coin,
          price: result['30'].price,
          resultPrice: result['30'].resultPrice,
          discount: 100 - (result['30'].discount * 100)
        });

        $dialog
          .dialog({
            modal: true,
            title: '个人主页置顶',
            width: 400,
            close: function () {
              $dialog.dialog('destroy').remove();
            }
          });

        $dialog
          .find('.item')
            .on('click', function () {
            var $this = $(this),
              day = $this.attr('data-day'),
              amount = price[day].resultPrice,
              _price = price[day].price,
              discount = price[day].discount * 100,
              $tip = $dialog.find('.tip'),
              $confirm = $dialog.find('.btn-confirm');

            $this
              .addClass('on')
              .siblings('.item')
              .removeClass('on');

            $.post('/c/balance', function (result) {
              var balance = result.snow_coin;
              var text = '';

              if (balance >= amount) {
                text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币';
                $tip.removeClass('warn');
                $confirm.removeClass('disable');
              } else if (balance < amount) {
                text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币，请先购买雪球币';
                $tip.addClass('warn');
                $confirm.addClass('disable');
              }

              $tip.text(text);

              if (discount < 100) {
                $('.discount-tip').show();
                $('.original-price').text('原价：' + _price + '雪球币');
                $('.discount-price').text(amount + '雪球币');
                $('.discount').text('限时优惠' + (100 - discount) + '%');
              } else {
                $('.discount-tip').hide();
              }
            });
          })
          .end()
          .find('.btn-confirm')
            .on('click', function (e) {
              e.preventDefault();

              var $this = $(this);

              //if ($this.is('.disable')) {
              //  return false;
              //}

              var day = $dialog.find('.on').attr('data-day');

              $.get('/c/pin/session', function (tokenRes) {
                var token = tokenRes[0].toString();

                $.post('/c/pin', {
                  top_type: 1,
                  status_id: data.id,
                  day: day,
                  session_token: token
                }, function (res) {
                  $dialog.dialog('close');

                  if (res.error_code) {
                    SNB.Util.failDialog(res.error_description);
                  } else {
                    if ($('body').is('#my-profile')) {
                      SNB.Util.stateDialog('主页置顶购买成功');
                      setTimeout(function () {
                        window.location.reload();
                      }, 3000);
                    } else {
                      SNB.Util.stateDialog('主页置顶购买成功');

                      $('#status_' + data.id)
                        .find('.profile-pin')
                          .addClass('btn-cancel-profile-pin')
                          .removeClass('profile-pin')
                          .text('取消置顶')
                        .end()
                        .find('.infos')
                          .append('<span class="status-marker status-pin">置顶</span>');
                    }
//                    Retweet(data.status, '', '我刚把这条帖子设置了主页置顶，推荐给你');
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

            $dialog.find('.on').click();

            return false;
          });
      });
    });
  }

  function showPinDialogFree(data) {
    $.ajax({
      url: '/valueadded/top/add.json',
      type: 'POST',
      dataType: 'json',
      data: {
        top_type: 1,
        status_id: data.id
      },
      success: function () {
        if ($('body').is('#my-profile')) {
          SNB.Util.stateDialog('主页置顶成功');
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        } else {
          SNB.Util.stateDialog('主页置顶成功');
          $('#status_' + data.id)
            .find('.profile-pin')
            .addClass('btn-cancel-profile-pin')
            .removeClass('profile-pin')
            .text('取消置顶')
            .end()
            .find('.infos')
            .append('<span class="status-marker status-pin">置顶</span>');
        }
      },
      error: function (res) {
        var res = JSON.parse(res.responseText);
        if (res.error_code) {
          SNB.Util.failDialog(res.error_description);
        }
      }
    })
  }

  Dialog.prototype = {
    init: function (data) {
      $.post('/valueadded/top/get.json', {
        top_type: 1
      }, function (pin) {
        if (pin.status_id === 0) {
          showPinDialogFree(data);
        } else {
          SNB.Util.confirmDialog('确认将该帖置顶，替换现有置顶贴？', function () {
            showPinDialogFree(data);
          }).dialog({
            modal: true,
            width: 300,
            minHeight: 50
          });
        }
      });
    }
  };

  module.exports = exports = function (data) {
    return new Dialog(data);
  };

});
