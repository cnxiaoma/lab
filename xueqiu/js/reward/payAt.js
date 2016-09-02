define('reward/payAt.js', ["reward/pay","lib/store","widget/util/modal"], function (require, exports, module) {  var Pay = require('./pay.js').Pay;
  var PayModal = require('./pay.js').Modal;
  var store = require('lib/store');
  var Modal = require('widget/util/modal.js');
  /**
    * 初始化付费问答按钮
    * @param {Object} $container [jquery dom] - 父容器
    * @param {Object} editor [umeditor] - 文本编辑器
    * @param {Object} config - 配置
    * @param {Number} config.paid_mention_type - 发布类型
  */
  function initPayAtEvent ($container, editor, config) {
    var config = config || {};
    var $mod = $('<div>').addClass('pay-select-mod hidden').appendTo($container);
    var $modInput = $('<input>').attr({
      type: 'text',
      placeholder: '输入用户昵称'
    });
    $('<div>').addClass('pay-select-hd').append($modInput).appendTo($mod);
    $('<div>').addClass('pay-select-bd').appendTo($mod);
    var $entry = $container.find('.pay-at').length ? $container.find('.pay-at') : $container.find('.editor-pay');
    var $input = $mod.find('.pay-select-hd').children('input');
    var $list = $container.find('.pay-select-bd');
    var timer = null;
    var index = -1;
    var selectTarget = false;
    var $paySubmit = $container.find('.pay-submit');
    var $StatusBtn = $container.find('.status-submit');
    var rotary_timer = null;
    var um = editor;
    var paymentInfo = {
      uid: '',
      name: '',
      amount: 0
    };
    var labelInfo = {
      has: false,
      content: ''
    };
    var self_id = '';
    var elShow = function ($el) {
      $el.removeClass('hidden');
    };
    var elHide = function ($el) {
      $el.addClass('hidden');
    };
    /**
      * 切换支付与普通发布
      * @param {Boolean} condition - true: 支付; false: 普通发布
    */
    var togglePay = function (condition) {
      if (condition) {
        elShow($paySubmit);
        elHide($StatusBtn);
        $entry.addClass('disabled');
        $entry.parents('.modal-wrap').addClass('pay-at-modal');
      } else {
        elHide($paySubmit);
        elShow($StatusBtn);
        $entry.removeClass('disabled');
        $entry.parents('.modal-wrap').removeClass('pay-at-modal');
      }
    };
    /**
      * 清除最近at过人列表
      * @param {Boolean} clear - 清除当前列表
    */
    var historyList = function (clear) {
      var pay_history = store.get('payMember');
      clear = clear || true;
      if (pay_history) {
        if (clear) {
          $list.children().remove();
        }
        var limit = 5;
        pay_history.splice(limit, limit);
        $.each(pay_history, function (index, item) {
          var cell = $('<div>').addClass('pay-select-item').data('id', item.id).html(item.name);
          $list.append(cell);
        });
      }
    };
    /**
      * 高亮用户选择
    */
    var hightlight = function () {
      var max = $list.children().size();
      if (index < 0) {
        index = max - 1;
      } else if (index > max - 1) {
        index = 0;
      }
      $list.children().removeClass('active');
      $list.children().eq(index).addClass('active');
    };
    // 付费@按钮点击
    $entry.on('click', function (e) {
      e.preventDefault();
      if ($(this).hasClass('disabled')) {
        return false;
      }
      var editorHeight = $(um.body).height();
      if (editorHeight < 80) {
        um.setHeight(80);
      }
      um.focus();
      // 获取用户选择历史记录
      historyList();
      // 显示用户选择列表
      elShow($mod);
      $input.focus();
    });
    // 用户列表hover效果
    $list.on('mouseover', '.pay-select-item', function () {
      index = $(this).index();
      hightlight();
    });
    // 移除hover效果
    $list.on('mouseout', function () {
      index = -1;
      $list.children().removeClass('active');
    });
    // 键盘操作
    $input.on('keyup', function (e) {
      if (e.which === 38) {
        // up
        index--;
        hightlight();
        e.preventDefault();
      } else if (e.which === 40) {
        // down
        index++;
        hightlight();
        e.preventDefault();
      } else if (e.which === 13) {
        // enter
        $list.children().eq(index).trigger('click');
        e.preventDefault();
      }
    });
    // 失去焦点时 关闭用户选择列表
    $input.on('blur', function (e) {
      if (!$input.val() && !selectTarget) {
        index = -1;
        elHide($mod);
      }
    });
    // 防止选择用户时触发blur事件
    $input.on('focus', function (e) {
      selectTarget = false;
    });
    $list.on('mousedown', '.pay-select-item', function () {
      selectTarget = true;
    });
    // 确认金额
    function confirmAmount (id, screen_name) {
      var user_info = $.ajax({
        type: 'GET',
        url: '/user/show.json',
        data: {
          id: id
        }
      });
      var donate_amount = $.ajax({
        type: 'GET',
        url: '/user/setting/donate_amount.json',
        data: {
          uid: id
        }
      });
      $.when(user_info, donate_amount).then(function (user, donate) {
        var user_data = user[0];
        var donate_data = donate[0];
        // 获取用户最小打赏金额
        user_data.min = donate_data.amount/100;
        if (!/\./g.test(donate_data.amount/100)) {
          user_data.min = donate_data.amount/100 + '.00';
        }
        if (user_data.min < 1) {
          user_data.min = 1.00;
        }
        index = -1;
        paymentInfo.name = screen_name;
        // 保存最近@过的人
        var member = store.get('payMember') || [];
        var memberstr = JSON.stringify(member);
        // 保留10条记录
        if (memberstr.indexOf(id) === -1 ) {
          member.unshift({
            name: screen_name,
            id: id
          });
          if (member.length > 10) {
            member.splice(10, member.length - 10);
          }
          store.set('payMember', member);
        }
        // 隐藏窗口
        elHide($mod);
        // 清空输入框
        $input.val('');
        // 清空列表
        $list.children().remove();
        // 确认选择弹窗
        var tpl = $('#payConfirmTpl').html();
        var htmlstr = _.template(tpl, {
          data: user_data
        });
        var $dom = $.parseHTML(htmlstr);
        $('body').append($dom);
        var $confirm = $('#payConfirm');
        var modal = PayModal({
          el: $confirm,
          destroy: true
        });
        $('#payAmount').on('keyup', amountInputControl);
        $confirm.find('.pay-confirm-btn').on('click', submitPayment);
        paymentInfo.uid = id;
        modal.show();
      });
    }
    // 选择用户
    $list.on('click', '.pay-select-item', function () {
      var self = this;
      var id = $(this).data('id');
      var screen_name = $(this).text();
      if (!self_id) {
        $.ajax({
          url: '/user/show.json'
        }).success(function (data) {
          self_id = data.id;
          if (self_id == id) {
            Modal.alert('不能向自己发出提问', 'error');
          } else {
            confirmAmount.call(self, id, screen_name);
          }
        });
      } else {
        if (self_id == id) {
          Modal.alert('不能向自己发出提问', 'error');
          return;
        }
        confirmAmount.call(self, id, screen_name);
      }
    });
    // 个人页打赏
    if (config.profile) {
      var profile_pay_modal = PayModal({
        el: $('#payEditor')
      });
      var profile_uid = $('.user-center-pay').data('id');
      $.ajax({
        type: 'GET',
        url: '/user/white_list/select.json',
        data: {
          user_id: profile_uid
        },
        success: function (data) {
          if (data[profile_uid]) {
            $('.user-center-pay').removeClass('hidden');
          }
        }
      });
      $('.user-center-pay').on('click', function (e) {
        e.preventDefault();
        var self = this;
        var screen_name = $('.profile_info_content span').eq(0).text();
        SNB.Util.checkLogin(function() {
          var id = profile_uid;
          confirmAmount.call(self, id, screen_name);
        });
      });
      $('.user-btn').on('click', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var screen_name = $(this).data('name');
        confirmAmount.call(this, id, screen_name);
      });
    }
    // 搜索用户
    $input.on('input', function (e) {
      clearTimeout(timer);
      var q = $(this).val();
      if (!q) {
        index = -1;
        $list.children().remove();
        historyList(false);
        return;
      }
      timer = setTimeout(function () {
        var XHR = $.ajax({
          url: '/users/search.json',
          data: {
            q: q,
            count: 5
          }
        });
        XHR.done(function (data) {
          $list.children().remove();
          if (data && data.users.length > 0) {
            $.each(data.users, function (index, item) {
              var cell = $('<div>').addClass('pay-select-item').data('id', item.id).html(item.screen_name);
              $list.append(cell);
            });
          }
        });
      }, 500);
    });
    // 支付金额的控制
    function amountInputControl () {
      var $amount = $('#payAmount');
      var min = $amount.attr('min');
      var max = $amount.attr('max');
      var val = $amount.val();
      var result;
      var error = '';
      if (!val) {
        $('.pay-confirm-btn').addClass('disabled');
        return;
      } else {
        $('.pay-confirm-btn').removeClass('disabled');
      }
      if (isNaN(val)) {
        result = min;
      } else if (+val > +max) {
        result = max;
      }
      if (result) {
        $amount.val(result);
      }
    }
    // 确认支付金额
    var doNotAttatchChange = false;
    function submitPayment () {
      if ($(this).hasClass('disabled')) {
        return;
      }
      var $amount = $('#payAmount');
      var val = $amount.val();
      var min = $amount.attr('min');
      var max = $amount.attr('max');
      var error = '';
      var result;
      // 输入验证
      if (isNaN(val)) {
        error = '价格只支持输入数字';
      } else if (val > +max) {
        error = '不能超过提问金额上限10000元';
      } else if (val < +min) {
        error = '不能低于用户设置的最低提问金额';
        result = min;
      } else if (! val.match(/^\d+(\.\d{1,2})?$/g) ) {
        error = '最多输入两位小数';
        result = val.match(/\d+(\.\d{1,2})?/g)[0];
      }
      // 输入验证提示错误
      if (error) {
        if (result) {
          $amount.val(result);
        }
        Modal.alert(error, 'error');
        return;
      }
      doNotAttatchChange = true;
      if (config.profile) {
        um.execCommand('cleardoc');
      }
      paymentInfo.amount = val;
      var labelContent = '@' + paymentInfo.name + '<i>[¥' + val + ']</i>'
      var label = '<span class="pay-at-label">' + labelContent + '</span>';
      um.execCommand("inserthtml", '&nbsp;' + label + '&nbsp;');
      labelInfo.has = true;
      labelInfo.content = labelContent;
      um.focus();
      doNotAttatchChange = false;
      // 个人页显示支付编辑器
      if (config.profile) {
        $('#payEditor').trigger('modal:show');
      }
      $('#payConfirm').trigger('modal:hide');
      togglePay(true);
    }
    // 金at标签删除
    var change_timer = null;
    um.addListener('contentChange', function () {
      var $label = $('.pay-at-label');
      var editor_content = um.getContent();
      if (doNotAttatchChange) {
        return;
      }
      if (!editor_content) {
        return;
      }
      if (!labelInfo.has) {
        togglePay();
        return;
      }
      clearTimeout(change_timer);
      // setTimeout(function () {
        var content = $label.html();
        var reg = new RegExp( '\^' + labelInfo.content.replace(/[\[\]]/,'\\$&') + '\$', 'g');
        if (!reg.test(content)) {
          labelInfo.has = false;
          $label.remove();
          togglePay();
          if (config.profile) {
            $('#payEditor').trigger('modal:hide');
            $('.profile_operations .at').trigger('click');
          }
        }
      // }, 200);

    });
    $('.edui-body-container').on('keydown', function (e) {
      // 当ctrl+del时，清空文档
      if ((e.metaKey || e.ctrlKey) && e.which === 8 ) {
        um.execCommand('cleardoc');
        if (config.profile) {
          $('#payEditor').trigger('modal:hide');
          $('.profile_operations .at').trigger('click');
        }
      }
    });
    // 支付并发布
    $paySubmit.on('click', function (e) {
      e.preventDefault();
      if (!$.trim( um.getContent() )) {
        Modal.alert('内容不能为空', 'error');
        return;
      }
      if (config.profile) {
        $('#payEditor').trigger('modal:hide');
      }
      config.paid_mention_type = $(this).data('type');
      var htmlstr = $('#payWindowTpl').html();
      var tpl = _.template(htmlstr, {
        amount: paymentInfo.amount
      });
      var $dom = $.parseHTML(tpl);
      $('body').append($dom);
      var $modal = $('#payWindow');
      var modal = PayModal({
        el: $modal,
        destroy: true
      });
      $modal.find('.reward-payment').on('click', selectPaymentType);
      $modal.find('.pay-btn').on('click', function (e) {
        e.preventDefault();
        confirmPay();
      });
      modal.show();
    });
    // 支付方式
    function selectPaymentType () {
      $('#payWindow .reward-payment').removeClass('checked');
      $(this).addClass('checked');
    }
    // 支付流程
    function confirmPay () {
      var $name = $('.pay-info-name');
      var $amount = $('.pay-info-amount');
      var status = um.getContent();
      var amount = $('.pay-info-amount span').text();
      var $btn = $(this);
      var channel = ($('#payWindow .reward-payment').filter('.checked').hasClass('alipay'))?'alipay':'wechat';
      var mention_type = parseInt(config.paid_mention_type, 10);
      var postData = {
        mentions: paymentInfo.uid,
        mentions_amount: paymentInfo.amount * 100
      };
      if (mention_type === 1) {
        postData.status = um.getContent();
      } else if (mention_type === 2) {
        postData.id = $container.find('[name=id]').val();
        postData.comment = um.getContent();
      } else if (mention_type === 3) {
        postData.id = $container.find('[name=id]').val();
        postData.status = um.getContent();
      }
      var pay = new Pay({
        channel: channel,
        paid_mention_type: config.paid_mention_type,
        data: postData
      });
      var startEvent = function(data) {
        $btn.addClass('disabled');
        if (channel === 'wechat') {
          $('#payWindow').trigger('modal:hide');
        }
        if (data.status === 'new') {
          pay.openPaymentURL(data.recharge_url);
        }
      };

      var rotaryEvent = function(data) {
        rotary_timer = pay.getTimer();
        if (data.status === 'complete') {
          // 关闭支付窗口
          $('#payWindow').trigger('modal:hide');
          // 显示支付成功窗口
          var htmlstr = $('#payAtSuccessTpl').html();
          var $dom = $.parseHTML(htmlstr);
          $('body').append($dom);
          var modal = PayModal({
            el: $('#payAtSuccessModal'),
            destroy: true
          });
          modal.show();
          // 支付完成确定按钮
          $('.pay-at-done').on('click', function (e) {
            e.preventDefault();
            clearInterval(rotary_timer);
            $('#payAtSuccessModal').trigger('modal:hide');
          });
          togglePay();
          // 清空编辑器
          um.setContent('');
          store.remove('home-editor');
          // 触发未读消息
          // 发布付费支付时无法获得帖子ID 无法使用timeline.js 更新timeline
          if (mention_type === 1) {
            $('#status-list-new').trigger('click');
          } else if (mention_type === 2) {
            $contianer.find('.btn-sort').trigger('click');
          } else if (mention_type === 3) {
            $('#status-list-new').trigger('click');
          }
          if (channel !== 'alipay') {
            $('#qrcodeModal').trigger('modal:hide');
          }
          modal.show();
        }
      };
      pay.normal(startEvent, rotaryEvent);
    }
  }
  module.exports = {
    initPayAtEvent: initPayAtEvent
  }
});
