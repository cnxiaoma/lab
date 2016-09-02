define('reward/index.js', ["pages/cashier/cashier","widget/forward","widget/util/modal","widget/util/user","widget/status/data","widget/status/comment"], function (require, exports, module) {  var cashier = require('pages/cashier/cashier');
  var Forward = require('widget/forward');
  var util_modal = require('widget/util/modal');
  var User = require('widget/util/user.js');
  var Data = require('widget/status/data.js');
  var Comment = require('widget/status/comment.js');
  (function($) {
    $.deparam = function(params, coerce) {
      var obj = {},
        coerce_types = {
          'true': !0,
          'false': !1,
          'null': null
        };

      // Iterate over all name=value pairs.
      $.each(params.replace(/\+/g, ' ').split('&'), function(j, v) {
        var param = v.split('='),
          key = decodeURIComponent(param[0]),
          val,
          cur = obj,
          i = 0,

          // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
          // into its component parts.
          keys = key.split(']['),
          keys_last = keys.length - 1;

        // If the first keys part contains [ and the last ends with ], then []
        // are correctly balanced.
        if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
          // Remove the trailing ] from the last keys part.
          keys[keys_last] = keys[keys_last].replace(/\]$/, '');

          // Split first keys part into two parts on the [ and add them back onto
          // the beginning of the keys array.
          keys = keys.shift().split('[').concat(keys);

          keys_last = keys.length - 1;
        } else {
          // Basic 'foo' style key.
          keys_last = 0;
        }

        // Are we dealing with a name=value pair, or just a name?
        if (param.length === 2) {
          val = decodeURIComponent(param[1]);

          // Coerce values.
          if (coerce) {
            val = val && !isNaN(val) ? +val // number
              :
              val === 'undefined' ? undefined // undefined
              :
              coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
              :
              val; // string
          }

          if (keys_last) {
            // Complex key, build deep object structure based on a few rules:
            // * The 'cur' pointer starts at the object top-level.
            // * [] = array push (n is set to array length), [n] = array if n is
            //   numeric, otherwise object.
            // * If at the last keys part, set the value.
            // * For each keys part, if the current level is undefined create an
            //   object or array based on the type of the next keys part.
            // * Move the 'cur' pointer to the next level.
            // * Rinse & repeat.
            for (; i <= keys_last; i++) {
              key = keys[i] === '' ? cur.length : keys[i];
              cur = cur[key] = i < keys_last ?
                cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) :
                val;
            }

          } else {
            // Simple key, even simpler rules, since only scalars and shallow
            // arrays are allowed.

            if ($.isArray(obj[key])) {
              // val is already an array, so push on the next value.
              obj[key].push(val);

            } else if (obj[key] !== undefined) {
              // val isn't an array, but since a second value has been specified,
              // convert val into an array.
              obj[key] = [obj[key], val];

            } else {
              // val is a scalar.
              obj[key] = val;
            }
          }

        } else if (key) {
          // No value was defined, so set something meaningful.
          obj[key] = coerce ?
            undefined :
            '';
        }
      });

      return obj;
    };
  })(jQuery);
  /**
  * 弹出窗口
  * @param {Object} config
  * @param {Object} config.el - jquery dom 弹窗根元素
  * @param {Boolean} config.closed - 弹窗自动关闭
  */
  function Modal(config) {
    if (!(this instanceof Modal)) {
      return new Modal(config);
    }
    config = config || {};
    var closed = true;
    if (config.closed !== undefined) {
      closed = config.closed
    }
    var destroy = config.destroy;
    var modal = config.el || $('.reward-modal').eq(0);
    this.modal = modal;
    var self = this;
    var body = $('body');
    if (closed) {
      modal.find('.close').on('click', function() {
        modal.trigger('modal:hide');
      });
      $('body').on('keyup', function (e) {
        if (e.which === 27) {
          modal.find('.close').trigger('click');
        }
      });
    }
    modal.on('modal:hide', function() {
      modal.addClass('hidden');
      body.removeClass('no-scroll');
      if (destroy) {
        self.destroy();
      }
      if (config.onclose && typeof config.onclose === 'function') {
        config.onclose.call(self);
      }
    });
    modal.on('modal:show', function() {
      modal.removeClass('hidden');
      body.addClass('no-scroll');
      if (config.onopen && typeof config.onopen === 'function') {
        config.onopen.call(self);
      }
    });
  }
  /**
  * @function
  */
  Modal.prototype.show = function () {
    this.modal.trigger('modal:show');
  };
  /**
  * @function
  */
  Modal.prototype.hide = function () {
    this.modal.trigger('modal:hide');
  };
  /**
  * @function
  */
  Modal.prototype.destroy = function () {
    this.modal.remove();
  };
  /**
  * 分享弹出窗口
  * @function
  * @param {Object} data
  * @param {Number} data.sid - 帖子id
  * @param {Number} data.cid - 评论id
  * @param {String} data.type - 类型
  * @param {String} shareText - 分享文本
  */
  function shareModal (data, shareText) {
    var sid = data.sid;
    var cid = data.cid;
    var type = data.type;
    var forwardData = {
      name: 'comment',
      text: shareText
    };
    return Data.status(sid).then(function () {
      if (type === 'status') {
        forwardData.action = '/service/comment/add?type=status';
        return Forward.show(forwardData, {
          id: sid
        });
      } else {
        forwardData.action = '/service/comment/add';
        return Forward.show(forwardData, {
          id: sid,
          cid: cid,
          split: true
        });
      }
    });
  }

  /**
  * 打赏支付类
  * @constructor
  * @param {Object} config
  * @param {String} config.channel = 'alipay' - 支付方式
  * @param {Object} config.data
  * @param {Number} config.data.status_id - 帖子id
  * @param {Number} config.data.comment_id - 评论id
  * @param {Object} config.data.amount - 支付金额
   */
  function Pay(config) {
    this.data = config.data;
    if (this.data.amount) {
      this.data.amount = parseInt(this.data.amount, 10);
    }
    this.channel = config.channel || 'alipay';
    this.timer = null;
  }
  Pay.util = {
    /**
    * @function isSafari - 判断是否为safari浏览器
    */
    isSafari: function() {
      var ua = navigator.userAgent.toLowerCase();
      var result = false;
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') <= -1) {
          result = true;
        }
      }
      return result;
    }
  };
  /**
  * 获取轮询定时器
  * @function
  * @returns {Number} id
  */
  Pay.prototype.getTimer = function () {
    return this.timer;
  };
  /**
  * 创建支付订单
  * @function
  * @returns {Object} XHR
  */
  Pay.prototype.create = function() {
    var self = this;
    var isStatus = this.data.status_id;
    var isComment = this.data.comment_id;
    var createXHR;
    if (isStatus) {
      createXHR = $.ajax({
        type: 'POST',
        url: '/statuses/reward/create.json',
        data: self.data
      });
    } else if (isComment) {
      createXHR = $.ajax({
        type: 'POST',
        url: '/statuses/reward/comment/create.json',
        data: self.data
      });
    } else {
      createXHR = $.ajax({
        type: 'POST',
        url: '/statuses/paid_mention/update.json',
        data: self.data
      });
    }
    return createXHR.then(function(data) {
      var data = $.deparam(data.paymentInfo);
      return $.ajax({
        type: 'GET',
        url: '/tc/snowpay/trade/checkstand.json',
        data: data
      });
    }, function(jqXHR) {
      var data = JSON.parse(jqXHR.responseText);
      if (data && data.error_description) {
        util_modal.alert(data.error_description, 'error');
      }
    });
  };
  /**
  * 开始支付流程
  * @function
  */
  Pay.prototype.startPay = function(data) {
    var XHR = $.ajax({
      type: "POST",
      url: "/service/tc/snowpay/trade/prepay",
      data: data
    });
    return XHR;
  };
  /**
  * 查询订单状态
  * @function
  * @param {Object} data
  * @param {Number} data.out_service_no - 服务端号码
  * @param {Number} data.out_trade_no - 交易号码
  * @returns {Object} XHR
  */
  Pay.prototype.requestStatus = function(data) {
    var XHR = $.ajax({
      type: 'GET',
      url: '/service/tc/snowpay/trade/get_prepay_info',
      data: {
        out_service_no: data.out_service_no,
        out_trade_no: data.out_trade_no
      }
    });
    return XHR;
  };
  /**
  * 打开支付链接
  * @function
  */
  Pay.prototype.openPaymentURL = function(url) {
    if (this.channel === 'alipay') {
      var isSafari = Pay.util.isSafari();
      if (!isSafari) {
        var open = window.open('', '_blank');
        window.successCallback = function() {
          open.close();
        }
        open.location = url;
      } else {
        window.location = url;
      }
    } else {
      qrcodeModal(this.data.amount, url, this);
    }
  };
  /**
  * 普通支付流程
  * @param {startCallback} startCB - 支付开始后回调
  * @param {pollingCallback} rotaryCB - 支付开始后轮询
  * @param {Number} delay = 1 - 轮询间隔
  */
  Pay.prototype.normal = function(startCB, rotaryCB, delay) {
    var createRequest = this.create();
    var self = this;
    delay = delay || 1;
    var createData;
    createRequest.then(function(data) {
      if (self.channel === 'alipay') {
        data.third_pay_channel = 'alipay_web';
      } else {
        data.third_pay_channel = 'wxpay_web';
      }
      data.useWallet = false;
      createData = data;
      return self.startPay(createData);
    }).then(function(data) {
      startCB.call(self, data);
      if (rotaryCB && data.status === 'new') {
        self.timer = setInterval(function() {
          var statusRequest = self.requestStatus(createData);
          statusRequest.then(function(data) {
            if (data.status === 'complete') {
              clearInterval(self.timer);
            }
            rotaryCB.call(self, data);
          }, function () {
            clearInterval(self.timer);
          });
        }, delay * 1000);
      }
    })
  };
  /**
  * 微信二维码支付
  * @param {Number} amount - 支付金额
  */
  function qrcodeModal (amount, url, context) {
    var $modal = $('#qrcodeModal');
    if (!$modal.size()) {
      var tpl = $('#qrcodeTemplate').html();
      var compiled = $.parseHTML(tpl);
      $('body').append(compiled);
      $modal = $('#qrcodeModal');
    }
    var modal = Modal({
      el: $modal,
      destroy: true,
      onclose: function () {
        clearInterval(context.timer);
      }
    });
    $modal.find('.wechat-amount').text((amount/100).toFixed(2));
    var qrcode = 'data:image/png;base64,' + url;
    $modal.find('img').attr('src', qrcode);
    modal.show();
    $('#payAmountModal').trigger('modal:hide');
  }

  /**
  * 捐赠窗口
  * @function
  * @param {Object} config
  * @param {Object} config.pay
  * @param {Number} config.pay.id - 帖子id、评论id
  * @param {String} config.pay.type - 类型 ['status', 'comment']
  */
  function donateModal(config) {
    config = config || {};
    config.pay = config.pay || {};
    var sid = config.pay.id;
    var type = config.pay.type;
    var cid = config.pay.cid;
    // 获取雪球币以显示雪球币打赏入口
    var $entry = $('.reward-by-snowicon');
    var getBalance = $.ajax({
      type: 'POST',
      url: '/c/balance'
    });
    getBalance.done(function (data) {
      if (data.snow_coin) {
        $('.reward-by-snowicon').removeClass('hidden');
        $('.reward-by-snowicon').on('click', function (e) {
          e.preventDefault();
          init(data.snow_coin);
          $('#payAmountModal').trigger('modal:hide');
          $('#donateAmountModal').trigger('modal:show');
        });
      }
    });
    function init (balance) {
      var tpl = $('#donateAmountTemplate').html();
      var compiled = $.parseHTML(tpl);
      $('body').append(compiled);
      var $modal = $('#donateAmountModal');
      var modal = Modal({
        el: $modal,
        destroy: true
      });
      $modal.find('.close').on('click', function () {
        $('#payAmountModal').remove();
      });
      var $customAmount = $modal.find('.reward-amount-custom').find('input');
      var $amountOptions = $modal.find('.reward-amount-bd .reward-amount-item');
      var $balance = $('.donate-balance');
      var $amount = $('.donate-amount');
      var defaultAmount = $modal.find('.reward-amount-item.active').data('amount');
      var $error = $('.donate-error');
      var $detail = $('.donate-detail');
      var $payBtn = $modal.find('.pay-btn');
      var input_debounce = null;
      var changeAmount = function () {
        var $currentOption = $modal.find('.reward-amount-item.active');
        if ($currentOption.size()) {
          defaultAmount = $currentOption.data('amount');
        } else {
          defaultAmount = $customAmount.val();
        }
        $amount.text(defaultAmount);
      };
      var errorLog = function (text) {
        if (text) {
          $error.removeClass('hidden');
          $error.text(text);
          $detail.addClass('hidden');
          $payBtn.addClass('disabled');
        } else {
          $error.addClass('hidden');
          $detail.removeClass('hidden');
        }
      };
      var validate = function () {
        if (!/^\d+$/.test(defaultAmount)) {
          errorLog('输入数量错误，请输入整数');
          return;
        } else if (defaultAmount > balance) {
          var text = $detail.text() + '；余额不足';
          errorLog(text);
          return;
        }
        errorLog();
        return true;
      };
      // 初始化
      $amountOptions.removeClass('active');
      $amountOptions.eq(0).addClass('active');
      $customAmount.val('');
      $customAmount.blur();
      $balance.text(balance);
      changeAmount();
      validate();
      // 选择打赏数目
      $amountOptions.on('click', function() {
        clearTimeout(input_debounce);
        $amountOptions.removeClass('active');
        $(this).addClass('active');
        changeAmount();
        if (!validate()) {
          return;
        }
        $payBtn.removeClass('disabled');
        $customAmount.blur();
      });
      $customAmount.on('blur', function () {
        var val = $(this).val();
        if (!val) {
          $(this).attr('placeholder', '其他金额');
        } else {
          validate();
        }
      });
      $customAmount.on('focus', function () {
        var val = $(this).val();
        $amountOptions.removeClass('active');
        if (!val) {
          $(this).attr('placeholder', '');
          $payBtn.addClass('disabled');
        } else {
          changeAmount();
          validate();
        }
      });
      $customAmount.on('input', function () {
        var val = $(this).val();
        clearTimeout(input_debounce);
        input_debounce = setTimeout(function () {
          changeAmount();
          if (!validate(val)) {
            return;
          }
          $payBtn.removeClass('disabled');
        }, 500);
      });
      $payBtn.on('click', function () {
        if ($(this).hasClass('active')) {
          return;
        }
        // 锁定按钮
        $(this).addClass('active');
        var getSession = $.ajax({
          url: '/c/donate/session'
        });
        var donateDone = function () {
          var shareText;
          if (type === 'comment' ) {
            shareText = '我刚打赏了这条评论 ' + defaultAmount + ' 雪球币，也推荐给你。';
          } else if (type === 'status' ) {
            shareText = '我刚打赏了这篇帖子 ' + defaultAmount + ' 雪球币，也推荐给你。';
          }
          var XHR = shareModal({
            sid: sid,
            cid: cid,
            type: type
          }, shareText);
          XHR.done(function(resp) {
            setTimeout(function () {
              util_modal.alert('分享成功');
            }, 500);
            if (config.share) {
              config.share(resp);
            }
          });
        };
        getSession.then(function (data) {
          var token = data.toString();
          var donateData = {
            to_type: type,
            amount: defaultAmount,
            session_token: token
          };
          if (type === 'status') {
            donateData.to_id = sid;
          } else {
            donateData.to_id = cid;
          }
          return $.ajax({
            type: 'POST',
            url: '/c/donate',
            data: donateData
          });
        }).then(function (data) {
          if (data.success) {
            donateDone();
          } else {
            util_modal.alert(data.error_description, 'error');
          }
          $payBtn.removeClass('active');
          modal.hide();
        });
      });
    }
  }
  // 打赏入口
  function payModal(config) {
    config = config || {};
    config.pay = config.pay || {};
    var sid = config.pay.id;
    var type = config.pay.type;
    var cid = config.pay.cid;
    var $donateModal;
    var rotary_timer = null;
    var tpl = $('#payAmountTemplate').html();
    var compiled = $.parseHTML(tpl);
    $('body').append(compiled);
    var $modal = $('#payAmountModal');
    donateModal(config);
    var $payBtn = $modal.find('.pay-btn');
    var $custom = $modal.find('.reward-amount-custom');
    var $customAmount = $custom.find('input');
    var $amountOptions = $modal.find('.reward-amount-bd .reward-amount-item');
    var $otherAmount = $modal.find('.reward-amount-other');
    var $mainMod = $modal.find('.payment-mod');
    var $payType = $modal.find('.reward-payment');
    var amountDisplay;
    // 弹出打赏窗口
    var modal = Modal({
      el: $modal,
      destroy: true,
      onclose: function () {
        $customAmount.val('');
        toggleCustomInput();
        clearInterval(rotary_timer);
      }
    });
    // 初始化选项
    $amountOptions.removeClass('active');
    $amountOptions.eq(0).addClass('active');
    $customAmount.val('');
    $payType.removeClass('checked');
    $payType.eq(0).addClass('checked');
    // 切换其他金额输入
    var toggleCustomInput = function (editable) {
      if (editable) {
        $custom.removeClass('hidden');
        $otherAmount.addClass('hidden');
      } else {
        $custom.addClass('hidden');
        $otherAmount.removeClass('hidden');
      }
    };
    var validateInput = function () {
      var val = $customAmount.val() || 0;
      var inputError = function() {
        $payBtn.addClass('disabled');
        $custom.addClass('error');
      };
      var inputSuccess = function() {
        $payBtn.removeClass('disabled');
        $custom.removeClass('error');
      };
      if (!val) {
        $custom.addClass('empty');
        $custom.removeClass('error');
        $payBtn.addClass('disabled');
        return false;
      } else {
        $custom.removeClass('empty');
      }
      if (val.match(/^\d{1,3}(\.\d{1,2})?$/g) && val <= 200 && val >= 1) {
        inputSuccess();
      } else {
        inputError();
      }
    };
    var getAmount = function () {
      var result
      if ($amountOptions.hasClass('active')) {
        result = $amountOptions.filter('.active').data('amount') * 100;
      } else {
        result = $customAmount.val() * 100;
      }
      return result;
    };
    // 选择打赏数目
    $amountOptions.on('click', function() {
      $amountOptions.removeClass('active');
      $(this).addClass('active');
      $payBtn.removeClass('disabled');
      $customAmount.trigger('blur');
    });
    // 其他金额
    $otherAmount.on('click', function() {
      $amountOptions.removeClass('active');
      toggleCustomInput(true);
      $payBtn.addClass('disabled');
      $customAmount.focus();
    });
    // 自定义金额取消焦点
    $customAmount.on('blur', function() {
      if ($(this).val() === '') {
        toggleCustomInput();
      }
    });
    $customAmount.on('focus', function() {
      $amountOptions.removeClass('active');
      validateInput();
    });
    $customAmount.on('input', function() {
      validateInput();
    });
    // 支付方式
    $payType.on('click', function() {
      $payType.removeClass('checked');
      $(this).addClass('checked');
    });
    // 打赏
    $payBtn.on('click', function() {
      if ($(this).hasClass('disabled')) {
        return;
      }
      var amount = getAmount();
      if (amount <= 0 || !amount) {
        alert("打赏数额不正确");
        return;
      }
      // 成功提示文案
      if (/\d+\.\d+/g.test(amount / 100)) {
        amountDisplay = (amount / 100).toFixed(2);
      } else {
        amountDisplay = amount / 100
      }
      var channel = ($payType.filter('.checked').hasClass('alipay'))?'alipay':'wechat';
      var payData = {
        channel: channel,
        data: {
          amount: amount
        }
      };
      if (type === 'status') {
        payData.data.status_id = sid;
      } else if (type === 'comment') {
        payData.data.comment_id = cid;
      }
      var pay = new Pay(payData);
      var startEvent = function(data) {
        $payBtn.addClass('disabled');
        if (data.status === 'new') {
          pay.openPaymentURL(data.recharge_url);
        }
      };
      var rotaryEvent = function(data) {
        rotary_timer = pay.getTimer();
        if (data.status === 'complete') {
          var successTpl = $('#successTemplate').html();
          var compiled = _.template(successTpl, {
            amount: amountDisplay,
            type: (type === 'status')?'帖': '评论'
          });
          var $dom = $.parseHTML(compiled);
          $('body').append($dom);
          var successModal = Modal({
            el: $('#successModal'),
            destroy: true
          });
          modal.hide();
          successModal.show();
          // 分享
          $('#successModal').find('.reward-share').on('click', function() {
            var shareText;
            if (type === 'status') {
              shareText = '我刚打赏了这篇帖子￥'
            } else {
              shareText = '我刚打赏了这条评论￥'
            }
            shareText += amountDisplay + '，也推荐给你。 '
            successModal.hide();
            var XHR = shareModal({
              sid: sid,
              cid: cid,
              type: type
            }, shareText);
            XHR.done(function(resp) {
              setTimeout(function () {
                util_modal.alert('分享成功');
                //刷新
                if (type != 'status') {
                  if($('#comment-'+cid).length>0){
                    Comment.updataAllComments($('#comment-'+cid),sid,SNB.currentUser.id);
                  }else{
                    Comment.updataAllComments($('#comment_'+cid),sid,SNB.currentUser.id);
                  }
                }
              }, 500);
              if (config.share) {
                config.share(resp);
              }
            });
          });
          if (channel !== 'alipay') {
            $('#qrcodeModal').trigger('modal:hide');
          }
          if (config.complete) {
            config.complete.call(null, amountDisplay);
          }
        }
      };
      $(this).addClass('disabled');
      pay.normal(startEvent, rotaryEvent);
    });
  }

  function rewardPost() {
    var $custom = $('.reward-amount-custom');
    var $payBtn = $('.pay-btn');
    var $input = $custom.find('input');
    var sid = $('#sid').val();
    var uid = $('#status-' + sid).data('uid');
    $('.reward-btn').on('click', function() {
      if ($(this).hasClass('is-self')) {

        util_modal.alert("不能打赏自己",'warn');
        return false;
      }
      // 打赏弹窗
      payModal({
        pay: {
          id: sid,
          type: 'status'
        },
        complete: function (pay) {
          var size = $('#listSize').text();
          $('#listSize').text(+size + 1);
          var amount = $('#listAmount').text()
          $('#listAmount').text(+amount + pay);
          initList(+size + 1);
        },
        share: function (data) {
          var $commentContainer = $('.comment-all');
          if ($commentContainer.size()) {
            var $commentList = $commentContainer.find('.comment-list');
            var $dom = $.parseHTML(data);
            $commentList.prepend($dom);
          } else {
            Comment.getAllComments(sid, uid);
          }
        }
      });

      User.login().then(function() {
        $('#payAmountModal').trigger('modal:show');
      })
    });

    // 展开
    var firstFold = true;
    $(document).on('click', '.fold-icon', function () {
      var target = $('.reward-member-bd');
      if (target.hasClass('list-fold')) {
        target.removeClass('list-fold');
      } else {
        if (firstFold) {
          var size = $('#listSize').text();
          initList(size, function () {
            target.addClass('list-fold');
            firstFold = false;
          });
        } else {
          target.addClass('list-fold');
        }
      }
    });
    // 打赏列表
    var listTpl = $('#rewardListTpl').html();
    function listRequest (size) {
      size = size || 0;
      if (size == 0) {
        return false;
      }
      return $.ajax({
        url: '/statuses/reward/list.json',
        data: {
          status_id: sid,
          page: 1,
          size: size
        }
      });
    }

    function initList (size, cb) {
      if (listRequest(size)) {
        listRequest(size).then(function (data) {
          if (data && data.items.length > 0) {
            if (cb) {
              cb();
            }
            var htmlstr = _.template(listTpl, {
              data: data.items
            });
            $('.reward-member-bd').html(htmlstr);
            if (size > 14) {
              $('.fold-icon').removeClass('hidden');
            }
            $('.reward-member').removeClass('hidden');
          }
        });
      }
    };
    (function initOnLoad () {
      var reward_count = $('#listSize').text();
      if (reward_count > 14) {
        initList(reward_count);
      } else {
        initList(14);
      }
    })();
  }

  module.exports = {
    rewardPost: rewardPost,
    Pay: Pay,
    Modal: Modal,
    payModal: payModal,
    donateModal: donateModal
  }
})
