/**
 * Created by lyj on 5/15/15.
 */
define('pages/invest/TSNB.pankou.js', ["pagelets/invest/singleStock_pankou.jade.js"], function (require, exports, module) {  var template = require('pagelets/invest/singleStock_pankou.jade');

  module.exports = {
    /**
     * 初始化入口
     * @param params
     * @returns {*}
     */
    init: function (symbol, lastClose, quoteType) {
      this.symbol = symbol;
      this.lastClose = lastClose;
      var stockInfo = SNB.Util.getStockInfo(symbol);
      this.type = stockInfo.bigType;
      this.market = stockInfo.market;
      this.getData(stockInfo);
      this.quoteType = quoteType ? quoteType : "";
    },

    /**
     * 获取数据  类型 热门推荐基金
     * @param params
     */
    getData: function (stockInfo) {
      var that = this;
      $.ajax({
        url: "/stock/pankou.json",
        type: "GET",
        data: {
          symbol: that.symbol
        },
        success: function (ret) {
          if (_.isEmpty(ret)) {
            var buySellArray = [];
            for (var i = 1; i < 6; i++) {
              var array = [];
              array.push("买" + i);
              array.push("0.00");
              array.push("0.00");
              array.push("0.00");

              array.push("卖" + i);
              array.push("0.00");
              array.push("0.00");
              array.push("0.00");

              buySellArray.push(array);
            }
            var obj = {
              list: buySellArray,
              buypct: "0.00",
              sellpct: "0.00",
              bigType: "0.00",
              current: "0.00",
              currentColor: "#000",
              diff:0,
              ratio:0
            }
            that.renderHtml(obj);
            return false;
          }
          ret.bigType = stockInfo.bigType;
          var data = that.fixData(ret);
          that.renderHtml(data);
        }
      })
    },
    upDownClass: function (quote) {
      quote = Number(quote);
      if (quote > 0) {
        return "stockUp";
      } else if (quote < 0) {
        return "stockDown";
      }
      return "";
    },
    fixData: function (data) {
      var i = 1;
      var buySellArray = [];
      var lastClose = this.lastClose || data.current;
      var fixedCount = this.type === "基金" ? 3 : 2;

      //期权类型，显示小数后四位
      //封闭式基金类型，显示小数后三位
      if (this.quoteType) {
        var quoteType = parseInt(this.quoteType);
        if (quoteType === 25) {
          fixedCount = 4;
        } else if (quoteType === 13) {
          fixedCount = 3;
        }

        if (this.market == "沪B") {
          fixedCount = 3;
        }
      }

      var that = this;

      for (; i < 6; i++) {
        var array = [];
        var bp = data["bp" + i];
        array.push("买" + i);
        array.push(parseFloat(bp).toFixed(fixedCount));
        array.push(data["bc" + i]);
        array.push(that.upDownClass(bp - lastClose));

        var sp = data["sp" + i];
        array.push("卖" + i);
        array.push(parseFloat(sp).toFixed(fixedCount));
        array.push(data["sc" + i]);
        array.push(that.upDownClass(sp - lastClose));

        buySellArray.push(array);
      }

      var currentColor = "";
      var current = data.current;
      current = current.toFixed(fixedCount);
      if(SNB && SNB.data && SNB.data.quote && SNB.data.quote.last_close){
        var close = SNB.data.quote.last_close;
        if(current > close){
          currentColor = "stockUp";
        }else{
          currentColor = "stockDown";
        }
      }

      var obj = {
        list: buySellArray,
        buypct: data.buypct,
        sellpct: data.sellpct,
        bigType: data.bigType,
        current: current,
        currentColor: currentColor,
        diff:data.diff,
        ratio:data.ratio
      }
      return obj;
    },
    renderHtml: function (data) {
      var html = template({
        data: data
      });
      var pankou = $("#pankou");
      if(pankou.length && !pankou.is(":visible")){
        return;
      }
      if ($(".pankou").length) {
        $(".pankou").replaceWith(html);
      } else {
        $(".stockChart").after(html);
      }
      $("#overlay-loading").css("right","165px");
    }
  };
});
;
define("pagelets/invest/singleStock_pankou.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="pankou" class="pankou"><div class="table"><div class="thead">');
 for(var i=4;i>=0;i--)
{
var array = (data.list[i]);
{
buf.push('<div class="tr"><div class="td"><span class="left"><span class="title">' + escape((interp = array[4]) == null ? '' : interp) + '</span><span');
buf.push(attrs({ "class": ("" + (array[7]) + " red price") }, {"class":true}));
buf.push('>' + escape((interp = array[5]) == null ? '' : interp) + '</span></span><span class="right">' + escape((interp = array[6] + "") == null ? '' : interp) + '</span></div></div>');
}
}
buf.push('</div><div class="tbody current"><div class="tr"><span class="current_text">当前价</span><span');
buf.push(attrs({ "class": ("current_value " + (data.currentColor) + "") }, {"class":true}));
buf.push('>' + escape((interp = data.current) == null ? '' : interp) + '</span></div></div><div class="tfoot">');
// iterate data.list
;(function(){
  if ('number' == typeof data.list.length) {

    for (var $index = 0, $$l = data.list.length; $index < $$l; $index++) {
      var array = data.list[$index];

buf.push('<div class="tr"><div class="td"><span class="left"><span class="title">' + escape((interp = array[0]) == null ? '' : interp) + '</span><span');
buf.push(attrs({ "class": ("" + (array[3]) + " green price") }, {"class":true}));
buf.push('>' + escape((interp = array[1]) == null ? '' : interp) + '</span></span><span class="right">' + escape((interp = array[2]) == null ? '' : interp) + '</span></div></div>');
    }

  } else {
    var $$l = 0;
    for (var $index in data.list) {
      $$l++;      var array = data.list[$index];

buf.push('<div class="tr"><div class="td"><span class="left"><span class="title">' + escape((interp = array[0]) == null ? '' : interp) + '</span><span');
buf.push(attrs({ "class": ("" + (array[3]) + " green price") }, {"class":true}));
buf.push('>' + escape((interp = array[1]) == null ? '' : interp) + '</span></span><span class="right">' + escape((interp = array[2]) == null ? '' : interp) + '</span></div></div>');
    }

  }
}).call(this);

buf.push('</div><div class="tbody percent"><div class="tr"><div class="td">委比' + escape((interp = data.ratio) == null ? '' : interp) + '%</div><div class="td right">委差' + escape((interp = data.diff) == null ? '' : interp) + '</div></div></div></div></div>');
}
return buf.join("");
};module.exports = anonymous;});