/**
 * Created by rekey on 12/10/14.
 */
define('widget/status/data.js', [], function (require, exports, module) {  function getStatusData(id) {
    var deferred = $.Deferred();
    $.get('/statuses/show.json', {id: id}).done(function (resp) {
      deferred.resolve(resp);
    });
    return deferred.promise();
  }

  function getCommentData(id) {
    var deferred = $.Deferred();
    $.get('/comments/show.json', {id: id}).done(function (resp) {
      deferred.resolve(resp);
    });
    return deferred.promise();
  }

  function getWallet() {
    var deferred = $.Deferred();
    $.post('/c/balance').done(function (resp) {
      deferred.resolve(resp);
    });
    return deferred.promise();
  }

  function getPinFansPrice(statusId) {
    var deferred = $.Deferred();
    $.post('/valueadded/top/get_price.json', {
      top_type: 0,
      status_id: statusId
    }).done(function (resp) {
      deferred.resolve(resp);
    });
    return deferred.promise();
  }

  function getPinIndexPrice(statusId) {
    var deferred = $.Deferred();
    $.post('/valueadded/top/get_price.json', {
      top_type: 1,
      status_id: statusId
    }).done(function (resp) {
      deferred.resolve(resp);
    });
    return deferred.promise();
  }

  function getPinSession() {
    var deferred = $.Deferred();
    $.get('/c/pin/session').done(function (resp) {
      deferred.resolve(resp);
    });
    return deferred.promise();
  }

  function addPinIndex(statusId){
    var deferred = $.Deferred();
    $.ajax({
      url: '/valueadded/top/add.json',
      type:'POST',
      dataType:'json',
      data: {
        top_type: 1,
        status_id: statusId
      },
      success: function (resp) {
        deferred.resolve(resp);
      },
      error:function(res){
        var res=JSON.parse(res.responseText);
        deferred.reject(res);
      }
    });
    return deferred.promise();
  }

  function getPinIndex(){
    var deferred = $.Deferred();
    $.post('/valueadded/top/get.json', {
      top_type: 1
    }).done(function (pin) {
      console.log(pin);
      deferred.resolve(pin);
    });
    return deferred.promise();
  }
  module.exports = {
    status: getStatusData,
    comment: getCommentData,
    wallet: getWallet,
    pinFansPrice: getPinFansPrice,
    pinIndexPrice: getPinIndexPrice,
    pinSession: getPinSession,
    addPinIndex:addPinIndex,
    getPinIndex:getPinIndex
  };
});