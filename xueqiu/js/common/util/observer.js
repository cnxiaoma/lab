define('common/util/observer.js', [], function (require, exports, module) {  var $ = jQuery;
  var o = $({});
  module.exports = {
    subscribe: function () {
      o.on.apply(o, arguments);
    },
    unsubscribe: function () {
      o.off.apply(o, arguments);
    },
    publish: function () {
      o.trigger.apply(o, arguments);
    }
  };
});