/**
 * Created by flynngao on 15/4/16.
 */

define('pages/cashier/cashier.js', ["widget/util/modal"], function (require, exports, module) {  var alertModal = require('widget/util/modal.js').alert;
  var confirmModal = require('widget/util/modal.js').confirm;

  var errorShow = function (msg) {
    alertModal(msg, "error");
  };
  /**
   * 简单校验器
   */
  var Validator = function (rules) {
    this.rules = rules;
  };


  /**
   * 全规则校验，返回提示文案
   */
  Validator.prototype.validateAll = function () {
    for (var name in rules) {
      if (!!rules[name].submitskip || !$('#' + name).length) {
        continue;
      }
      if (rules[name].rule() !== true) {

        errorShow(rules[name].rule());
        return false;
      }
    }
    return true;
  };

  /**
   * 根据ID进行校验
   */
  Validator.prototype.validate = function (rulename) {
    if (this.rules[rulename]) {
      return this.rules[rulename].rule();
    }
    return true;
  }

  /**
   * cube校验规则
   */
  var rules = {
    "cube_name": {
      "rule": function() {
        var val = $('#cube_name').val();
        if (!val) {
          return "组合名字不能为空"
        }
        return true;
      }
    }
  };


  module.exports = {
    init: function (param,cb) {
      this.validate = new Validator(rules);
      this.cashierInfo = param;
      this.cashierInfo.useWallet = false;
      this.cb = cb;
      this.cashierInfo.third_pay_channel ="alipay_web";
      this.bindEvent();
    },
    // 工作地点数据初始化
    sendRequest: function (cb) {

      var param = this.cashierInfo;

      $.ajax({
        type: 'POST',
        url: '/tc/snowpay/trade/prepay.json',
        data: param
      }).success(function (data) {
        if (cb) {

          cb(data.recharge_url);
        }
      }).fail(function (e) {
        $('#cashier-submit').removeClass('disabled');
        var errmsg = JSON.parse(e.responseText);
        errorShow(errmsg.error_description);
      });
    },
    showBlock: function(){
      var that = this;
      confirmModal("请在新打开的页面完成支付，支付完成前请不要关闭此窗口", {
        sure: "完成支付",
        cancel: "关闭订单"
      }).done(function (e) {
        location.href = that.cb;
      }).fail(function (e) {
        location.href = that.cb;
      })
    },
    resultGet: function(cb){
      var that = this;
      setInterval(function(){
        $.ajax({
          url:"/tc/snowpay/trade/get_prepay_info.json",
          data:{
            out_service_no: that.cashierInfo.out_service_no,
            out_trade_no: that.cashierInfo.out_trade_no
          }
        }).success(function (data){
          if(data.status == 'complete'){
            alertModal('支付成功');
            cb && cb();
          }
        }).fail(function(e){

        })
      },1000);
    },
    bindEvent: function () {
      var that = this;

      $('#use-wallet').click(function() {
        var $this = $(this);
        if ($this.is(':checked')) {
          that.cashierInfo.useWallet = true;
          $('.wallet').removeClass('disabled');
          $('.rest-money .num').text(parseFloat(that.cashierInfo.amount - that.cashierInfo.balance).toFixed(2))
        } else {
          $('.wallet').addClass('disabled');
          that.cashierInfo.useWallet = false;
          $('.rest-money .num').text(parseFloat(that.cashierInfo.amount).toFixed(2))
        }
      });

      $('.cashier-form').submit(function(e){
        e.preventDefault();

      });

      $('#cashier-submit').click(function(e){
        e.preventDefault();

        if(!(that.cashierInfo.useWallet && that.cashierInfo.amount <= that.cashierInfo.balance)){
          var open = window.open();
          window.successCallback = function(){
            open.close();
          }
        }
        if (!$("#cashier-submit").hasClass('disabled') && that.validate.validateAll()) {
          that.sendRequest(function (url) {
            // 判断是否有跳转新开窗口
            if(url){
              that.showBlock();
              open.location = url ;
              that.resultGet(function(){
                open.close();
                location.href = that.cb;
              });

            } else {
              location.href = that.cb;
            }
          });
        }
      });
    }
  }

});