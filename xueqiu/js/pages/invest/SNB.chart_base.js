define('pages/invest/SNB.chart_base.js', [], function (require, exports, module) {  if (!window.SNB) {
    window.SNB = {};
  }

  SNB.chartUtil = {

    // 获取二维数组的最大最小值
    minMax2d: function(data) {
      var max = -Infinity,
        min = Infinity;
      
      for (var i in data) {
        for (j in data[i]) {
          if (data[i][j] >= max) {
            max = data[i][j];
          }
          if (data[i][j] < min) {
            min = data[i][j]; 
          }
        }
      }
      return [min, max];
    },

    // 一维数组最大最小值
    minMax1d: function(data, isRemoveZero) { 
      var max = -Infinity,
        min = Infinity;
      
      if (isRemoveZero) {
        data = _.filter(data, function (a) {
          return a > 0; 
        });
      }

      for (var i in data) {
        var current = data[i];
        if (current >= max) {
         max = current;
        }

        if (current < min) {
         min = current; 
        }
      }
      return [min, max];
    },

    // 成交量分割线
    volumeGrid: function(maxvol, howmany) {
      var labels = [],
        lookup = [1000000000.0, 1000000.0, 1000.0, 1.0],
        avols = [],
        suffix = ['B', 'M', 'K', ''];

      for (var i = 0; i < howmany; i++) {
        avols.push(maxvol / (howmany - i));
      }

      _.each(lookup, function (l) {
        if (avols[0] / l > 1) {
          if ( labels.length < howmany ) {
            _.each(avols, function (a) {
              var n =  (a - a % l) / l + suffix[i];
              labels.push([n, a]);
            });
          }
        }
      });

      return labels;
    }, 

    // 当前价分割线
    currentGrid: function(ymin, ymax, howmany, lastClose) {
      var approx = (ymax - ymin) / howmany,
        lookup = [0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 25.0, 50.0,
             100.0, 250.0, 500.0, 1000.0, 2500.0, 5000.0, 
             10000.0, 25000.0, 50000.0, 100000.0, 500000.0, 1000000.0],
        na = [];

      _.each(lookup, function (l) {
        var b = l / approx;

        if (b < 1.0) {
          b = 1 / b; 
        } 

        na.push(b);
      });

      var closest = lookup[_.indexOf(na, _.min(na))],
        minindex = Math.ceil(ymin / closest) - 1,
        maxindex = Math.floor(ymax / closest) + 1,
        vals = [];

      if (lastClose) {
        vals.push(lastClose);

        var down = lastClose,
          up = lastClose;

        while (down > ymin) {
          down -= closest;
          vals.unshift(down);
        }

        while (up < ymax) {
          up += closest;
          vals.push(up);
        }
      } else {
        for (var j = minindex; j <= maxindex; j++) { 
          vals.push(j * closest);
        }
      }

      return vals;
    },
    getIndexByTs: function(array, bts, ets) {
      var right = array.length,
        left = 0,
        bindex,
        eindex;

      // 数组只有一个元素直接返回
      if (array.length === 1) {
        if (ets) {
          return [0, 1];
        } else {
          return 0;
        }
      }

      while (left <= right) {
        var center = Math.floor((left + right) / 2);

        if (bts >= array[center] && (!array[center + 1] || bts <= array[center + 1])) {
          bindex = center;
        }

        if (bts < array[center]) {
          right = center - 1;
        } else {
          left = center + 1;
        }
      }  

      if (ets) {
        left = bindex;
        right = array.length;
        while (left <= right) {
          var center = Math.floor((left + right) / 2);

          if (ets >= array[center] && ets <= array[center + 1]) {
            eindex = center;
            if (ets = array[center + 1]) {
              eindex = center + 1;
            }
          }

          if (ets < array[center]) {
            right = center - 1;
          } else {
            left = center + 1;
          }
        }  
      }
      if (_.isUndefined(bindex)) {
        bindex = 0;
      }

      if (ets) {
        if (_.isUndefined(eindex)) {
          eindex = array.length - 1;
        }
        return [bindex, eindex];
      } else {
        return bindex;
      }
    },
    formatTime: function(ts, format, is$) {
      // 冬令时13  夏令时12
      if (is$) {
        ts -= 12 * 60 * 60 * 1000;
      }
      var date = new Date(ts),
        y = date.getFullYear(),
        M = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();

      if (M < 10) {
        M = "0" + M;
      }
      if (d < 10) {
        d = "0" + d;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }

      if (format === "yyyy-MM-dd hh:mm") {
        return y + "-" + M + "-" + d + " " + h + ":" + m;
      } else if (format === "hh:mm") {
        return h + ":" + m;
      } else if (format === "MM-dd") {
        return M + "-" + d;
      } else if (format === "yyyy-MM") {
        return y + "-" + M;
      } else {
        return y + "-" + M + "-" + d;
      }
    },
    getStockInfo: function(stockid){
      var specialHKStocks = {
          HKHSI: 1,
          HKHSF: 1,
          HKHSU: 1,
          HKHSP: 1,
          HKHSC: 1,
          HKVHSI: 1,
          HKHSCEI: 1,
          HKHSCCI: 1,
          HKGEM: 1,
          HKHKL: 1
        },
        USIndexes = {
          DJI30: 1,
          NASDAQ: 1,
          SP500: 1,
          ICS30: 1,
          SLR10: 1,
          TMT20: 1,
          HCP10: 1,
          EDU10: 1
        },
        bitcoins = {
          BTCNCNY: {
            money: "￥",
            market: "比特币（CNY）"
          },
          MTGOXAUD: {
            money: "AU$",
            market: "比特币（AUD）"
          },
          MTGOXCNY: {
            money: "￥",
            market: "比特币（CNY）"
          },
          MTGOXEUR: {
            money: "€",
            market: "比特币（EUR）"
          },
          MTGOXGBP: {
            money: "£",
            market: "比特币（GBP）"
          },
          MTGOXJPY: {
            money: "J￥",
            market: "比特币（JPY）"
          },
          MTGOXUSD: {
            money: "$",
            market: "比特币（USD）"
          },

          // 新增一些Bitcoins
          LOCALBTCAUD: {
            money: "AU$",
            market: "比特币（AUD）"
          },
          MTGOXCNY: {
            money: "￥",
            market: "比特币（CNY）"
          },
          BTCDEEUR: {
            money: "€",
            market: "比特币（EUR）"
          },
          BTCEEUR: {
            money: "€",
            market: "比特币（EUR）"
          },
          LOCALBTCGBP: {
            money: "£",
            market: "比特币（GBP）"
          },
          BTCEUSD: {
            money: "$",
            market: "比特币（USD）"
          },
          BITSTAMPUSD: {
            money: "$",
            market: "比特币（USD）"
          }
        },
        fundSymbolArray = ["SH500", "SH510", "SH511", "SH513", "SZ15", "SZ18", "SZ16"],
        stockInfo;

      if ( stockid && ( ~_.indexOf(fundSymbolArray, stockid.substr(0,5)) || ~_.indexOf(fundSymbolArray, stockid.substr(0,4))) ) {
        stockInfo = { money: "￥", market: "", bigType: "基金", type: "基金" };
      } else if ( /^S[HZ]\d+$/.test(stockid) ){

        // SH900||SZ200为HK$B股
        if ( /^SZ200/.test(stockid) ) {
          stockInfo = { money: "HK$", market: "深B", bigType: "沪深", type: "股票" };

          // 回购
        } else if ( /^(SH(201|202|203|204|131)|SZ(13|395032))/.test(stockid) ) {
          stockInfo = { money: "￥", market: "回购", bigType: "沪深", type: "回购" };

          // 国债
        } else if ( /^(SH(01|02|13)|SZ(10|09))/.test(stockid) ) {
          stockInfo = { money: "￥", market: "国债", bigType: "沪深", type: "国债" };

          // 企债
        } else if ( /^(SH12|SZ11)/.test(stockid) ) {
          stockInfo = { money: "￥", market: "企债", bigType: "沪深", type: "企债" };

          // 可转债
        } else if ( /^(SH11|SZ12)/i.test(stockid) ) {
          stockInfo = { money: "￥", market: "可转债", bigType: "沪深", type: "可转债" };

          // 沪B
        } else if ( /^SH900/.test(stockid) ) {
          stockInfo = { money: "$", market: "沪B", bigType: "沪深", type: "股票" };

          // 指数
        } else if ( /^(SH00|SZ399)/.test(stockid) ) {//指数
          stockInfo = { money: "", market: "", bigType: "沪深", type: "指数" };

          // 普通股票
        } else {
          stockInfo = { money: "￥", market: "A股", bigType: "沪深", type: "股票" };
        }

        // 货币基金
      } else if ( /^MF\d+$/.test(stockid) ) {
        stockInfo = { money: "￥", market: "MF", bigType: "货币基金", type: "货币基金" };

        // 信托产品
      } else if ( /^TP\d+$/.test(stockid) ) {
        stockInfo = { money: "￥", market: "TP", bigType: "信托产品", type: "信托产品" };

        // 国债期货
      } else if ( /^[\d\w]+\.FM$/.test(stockid) ) {
        stockInfo = { money: "￥", market: "FM", bigType: "国债期货", type: "国债期货" };

        // 私募基金
      } else if ( /^P\d+$/.test(stockid) ) {
        stockInfo = { money: "￥", market: "P", bigType: "私募基金", type: "私募基金" };

        if (stockid === "P000057") {
          stockInfo.money = "$";
        }
        // 理财产品
      } else if ( /^FP\d+$/.test(stockid) ) {
        stockInfo = { money: "￥", market: "FP", bigType: "理财产品", type: "理财产品" };

        // 港股
      } else if ( /^\d+$/.test(stockid) ) {
        stockInfo = { money: /^8/.test(stockid) ? "￥": "HK$", market: "港股", bigType: "港股", type: "股票" };

        // 指数
      } else if ( specialHKStocks[stockid] || USIndexes[stockid] ) {//指数
        stockInfo = { money: "", market: "", bigType: "指数", type: "指数" };

        // bitcoin 美股
      } else {
        var bitcoin = bitcoins[stockid];

        if ( bitcoin ) {
          stockInfo = { money: bitcoin.money, market: bitcoin.market, bigType: "比特币", type: "比特币" };
        } else {
          stockInfo = { money: "$", market: "美股", bigType: "美股", type: "股票" };
        }
      }
      return stockInfo;
    },
    decimal_2: function(decimal) {
      if(!decimal){//TODO
        return "-";
      }
      var f_x = parseFloat(decimal);
      var readable = ["", "万", "亿"];
      var index = 0;
      while (decimal > 10000 && index < 2) {
        decimal /= 10000;
        index ++;
      }
      f_x = Math.round(decimal*100)/100;
      var s_x = f_x.toString();
      var pos_decimal = s_x.indexOf('.');
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
      }
      return s_x + readable[index];
    }
  }
});
