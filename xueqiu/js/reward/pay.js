define('reward/pay.js', ["widget/util/modal"], function (require, exports, module) {  var util_modal = require('widget/util/modal.js');
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
  * @param {Boolean} config.destroy - 关闭后自动摧毁窗口
  * @param {Boolean} config.closed - 弹窗关闭按钮
  * @default config.closed [true]
  * @param {Function} config.onclose - cb 弹窗关闭时回调
  * @param {Function} config.onopen - cb 弹窗显示时回调
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
  * 打赏 付费at 支付类
  * @constructor
  * @param {Object} config
  * @param {String} config.channel = 'alipay' - 支付方式
  * @param {Object} config.data - 创建订单参数
  * @param {Number} config.data.status_id - 帖子id
  * @param {Number} config.data.comment_id - 评论id
  * @param {Object} config.data.amount - 支付金额
  * @param {Number} config.paid_mention_type - 付费at类型 1:发帖;2:评论;3:转发;
  * @param {String} config.data.status - 讨论信息 （发帖、转发）
  * @param {String} config.data.mentions - 提到的用户
  * @param {String} config.data.comment - 评论内容 (评论)
  * @param {String} config.id - 支付金额 (评论、转发)
  * @example
  * new Pay ({channel: 'weixin', data: {status_id: '72112225', amount: 100}})
  * new Pay ({channel: 'weixin', paid_mention_type: 1, data: {status: '这是一条付费at内容', 'mentions': '3607403927', mentions_amount: 100}})
   */
  function Pay(config) {
    this.data = config.data;
    if (this.data.amount) {
      this.data.amount = parseInt(this.data.amount, 10);
    } else if (this.data.mentions_amount) {
      this.data.mentions_amount = parseInt(this.data.mentions_amount, 10);
      this.data.amount = parseInt(this.data.mentions_amount, 10);
    }
    this.channel = config.channel || 'alipay';
    this.timer = null;
    this.paid_mention_type = config.paid_mention_type;
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
    var payAtType = this.paid_mention_type;
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
    } else if (payAtType === 1) {
      createXHR = $.ajax({
        type: 'POST',
        url: '/statuses/paid_mention/update.json',
        data: self.data
      });
    } else if (payAtType === 2) {
      createXHR = $.ajax({
        type: 'POST',
        url: '/statuses/paid_mention/reply.json',
        data: self.data
      });
    } else if (payAtType === 3) {
      createXHR = $.ajax({
        type: 'POST',
        url: '/statuses/paid_mention/repost.json',
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
    });
  };
  /**
    * 创建付费提问
  */
  Pay.prototype.createAt = function () {
    // 发帖
    var createXHR = $.ajax({
      type: 'POST',
      url: '/statuses/paid_mention/update.json',
      data: self.data
    });
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
  module.exports = {
    Pay: Pay,
    Modal: Modal
  };
})
