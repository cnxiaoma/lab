define('pages/invest/chart.js', ["pages/invest/SNB.chart_base","pages/invest/chart/TSNB.chart.base","pages/invest/chart/TSNB.chart.stock","pages/invest/chart/TSNB.chart.networth","pages/invest/chart/TSNB.chart.kline","pages/invest/chart/TSNB.chart.status","pages/invest/chart/TSNB.chart.thumbnail","pages/invest/chart/TSNB.chart.event","pages/invest/chart/TSNB.chart.compare"], function (require, exports, module) {  require('pages/invest/SNB.chart_base');
  require('pages/invest/chart/TSNB.chart.base');
  require('pages/invest/chart/TSNB.chart.stock');
  require('pages/invest/chart/TSNB.chart.networth');
  require('pages/invest/chart/TSNB.chart.kline');
  require('pages/invest/chart/TSNB.chart.status');
  require('pages/invest/chart/TSNB.chart.thumbnail');
  require('pages/invest/chart/TSNB.chart.event');
  require('pages/invest/chart/TSNB.chart.compare');
});
;
/*
 *主对象
 */

define('pages/invest/chart/TSNB.chart.base.js', [], function (require, exports, module) {  window.SNB = SNB || {};

  // 行情图样式
  var theme = {
    light: {
      currentRect: {
        "stroke-width": 1,
        "stroke": "#d0d0d0",
        "fill": "white"
      },
      currentPath: {
        "stroke": "#2f84cc",
        "stroke-width": 1
      },
      volumePath: {
        "stroke": "#2f84cc",
        "stroke-width": 1
      },
      currentBackground: {
        "fill": "#2f84cc",
        "stroke-width": 1,
        "stroke-opacity": 0,
        "opacity": 0.2
      },
      splitLine: {
        "stroke-width": 1,
        "stroke": "#e4dfdd"
      },
      dashedSplitLine: {
        "stroke-width": 1,
        //"stroke": "#e4dfdd",
        "stroke": "#f0f0f0"
        //"stroke-dasharray": ". "
      },
      restPath: {
        "stroke-width": 1,
        "stroke": "#2f84cc",
        "stroke-dasharray": ". "
      },
      leftText: {
        "text-anchor": "end",
        "font-family": "Arial",
        "font-size": "10"
      },
      rightText: {
        "text-anchor": "start",
        "font-family": "Arial",
        "font-size": "10"
      },
      centerText: {
        "font-family": "Arial",
        "font-size": "10"
      },
      titleText: {
        "font-family": "Arial",
        "font-size": "11",
        "text-anchor": "start",
        "fill": "#888"
      },
      valueText: {
        "font-family": "Arial",
        "font-size": "11",
        "text-anchor": "start",
        "fill": "#000"
      },
      ma5: {
        "stroke": "#cd4343",
        "stroke-width": 1
      },
      ma10: {
        "stroke": "#8C3037",
        "stroke-width": 1
      },
      ma20: {
        "stroke": "#FFCA53",
        "stroke-width": 1
      },
      ma30: {
        "stroke": "#0055A2",
        "stroke-width": 1
      },
      dif: {
        "stroke": "#d20",
        "stroke-width": 1
      },
      dea: {
        "stroke": "#014375",
        "stroke-width": 1
      },
      compareColors: ["#4F9AE2", "#CF635C", "#CB4BAC", "#54B198", "#6A76EF"]
    },
    dark: {

    }
  };

  var klinePeriod = ["1month", "1day", "1week"],
    stockPeriod = ["1d", "5d", "1m", "6m", "1y", "3y", "all"],
    nwPeriod = ["nw-1m", "nw-6m", "nw-1y", "nw-3y", "nw-all"],
    MAArray = ["ma5", "ma10", "ma20", "ma30"];

  var noFuQuanSymbols = ["SH000001", "SZ399001", "SZ399006"];

  function fixCoord(coord) {
    return Math.floor(coord) + 0.5;
  }


  SNB.stockChart = function (options) {
    if (!options.container) {
      return;
    }

    this.init(options);
  };

  SNB.stockChart.prototype = {
    /*
     *  options 属性:
     *  symbol 画图的symbol
     *  wrapper 最外层的div .class 形式
     *  width svg宽 
     *  height svg高 
     *  container 初始化svg的div  id 形式
     *  overlay 鼠标滑动时候的画图层 比如十字线等
     *  eventOverlay 事件层 监听处理各种鼠标事件 拖动 滑动等
     *  dragbarOverlay 下方的缩略图 和 dragbar
     *  klineIndexOverlay 技术指标层
     *  loadingOverlay loading 图标层 
     *  statusOverlay 显示讨论点层
     */

    init: function (options) {
      var symbol = options.symbol,
        name = options.stockName,
        quote = options.quote;

      this.symbol = symbol;
      this.quote = quote;
      this.stockInfo = SNB.Util.getStockInfo(symbol);

      if (quote) {
        this.isFund = quote.isFund;
        this.fundType = quote.fundType;
      }
      // 默认设置
      this.width = options.width;
      this.labelWidth = 0;
      this.period = options.period || "1d";
      this.ctype = options.ctype || "day";
      this.ktype = options.ktype || "normal";
      this.klineIndex = options.klineIndex || "MACD";

      this.chart = {
        width: options.width - this.labelWidth * 2,
        height: options.height,

        // 状态信息
        stateHeight: 20,

        // 当前价 框高
        currentHeight: 180,

        // 时间框
        timeHeight: 20,

        // 成交量框
        volumeHeight: 65,

        // 底部拖动层高
        bottomHeight: 50,

        // 技术指标切换tab高
        //indexButtonHeight: 15, 
        indexButtonHeight: 0,

        // 技术指标高
        indexHeight: 60
      };

      // 扩展chart
      if (options.chart) {
        _.extend(this.chart, options.chart);
      }

      // current 底部y坐标
      this.chart.cy = this.chart.stateHeight + this.chart.currentHeight;

      // volume 底部y坐标
      this.chart.vy = this.chart.cy + this.chart.volumeHeight + this.chart.timeHeight;

      // bottom 底部y坐标
      this.chart.by = this.chart.vy + this.chart.bottomHeight;

      // 技术指标
      this.chart.iby = this.chart.vy + this.chart.indexButtonHeight;
      this.chart.iy = this.chart.iby + this.chart.indexHeight;

      this.chart.drag = {
        isDragging: false
      };

      this.wrapper = $(options.wrapper);
      this.container = $("#" + options.container);

      this.paper = new Raphael(options.container, options.width, this.chart.by + 10);

      // overlay paper
      this.overlay = $("#" + options.overlay);
      this.fromChart = options.fromChart;

      // 事件层
      this.eventOverlay = $("#" + options.eventOverlay);

      this.dragbarOverlay = $("#" + options.dragbarOverlay);

      this.klineIndexOverlay = $("#" + options.klineIndexOverlay);

      this.loadingOverlay = $("#" + options.loadingOverlay);

      this.statusOverlay = $("#" + options.statusOverlay);

      // compare data
      this.compareData = options.compareData || {};
      // data
      this.data = options.data || {};

      this.lastClose = SNB.data.lastClose;

      if(SNB.data && SNB.data.quote && SNB.data.quote.type && parseInt(SNB.data.quote.type) === 25){
        //期权页面，分时图的中线以及昨收替换成昨结算价
        this.lastClose = parseFloat(SNB.data.quote.kzz_putback_price);
      }

      // 股票symbol 和 name对应关
      this.symbolNames = options.symbolNames || {};
      this.symbolNames[symbol] = name;

      // 分段取kline 先取到的放这里面 跟后面合并
      this.kdata = options.kdata || {};

      // 样式
      this.theme = theme.light;

      // 过滤讨论参数 默认全部
      this.filterStatusOptions = {
        source: "all"
      };

      // 全屏
      this.isFullScreen = options.isFullScreen;
      this.isCompare = options.isCompare;
      this.isShowStatus = options.isShowStatus;

      // 底部缩略图信息
      this.thumbnailInfo = {};

      // 各个层距离顶部位置
      this.overlayTop = 26;

      // mouse move out event 层
      this.overlay.show();
      this.opaper = new Raphael(options.overlay, options.width, this.chart.iy);

      // 底部拖动层
      this.dragbarOverlay.show();
      this.dragbarPaper = new Raphael(options.dragbarOverlay, options.width, this.chart.by + 1);

      // 事件层
      this.eventOverlay.css({
        width: options.width,
        height: this.chart.vy
      }).show();

      this.statusOverlay.show();
      this.statusPaper = new Raphael(options.statusOverlay, options.width, this.chart.cy);
      this.klineIndexPaper = new Raphael(options.klineIndexOverlay, options.width, this.chart.iy);
      this.dragRightMargin = this.wrapper.offset().left + this.labelWidth + this.chart.width;

      // ma线设置  是否显示和颜色
      this.maShowInfo = {
        ma5: {
          show: "1",
          color: "#cd4343"
        },
        ma10: {
          show: "1",
          color: "#8C3037"
        },
        ma20: {
          show: "1",
          color: "#FFCA53"
        },
        ma30: {
          show: "1",
          color: "#0055A2"
        }
      };

      this.isIE8 = $.browser.msie && $.browser.version < 9;

      // hack for ie
      if (this.isIE8) {
        this.wrapper.addClass("style-for-ie");
      }

      // 默认显示MA
      this.showMA = true;

      this.is$ = this.stockInfo.bigType === "美股";
      this.noKline = this.stockInfo.bigType === "比特币";
      this.noStatus = this.stockInfo.bigType === "比特币";

      this.renderHtml();
      this.drawBase();
      var that = this;

      // 全屏的话 会使用小图的data 不需要重新画
      if (this.isFullScreen) {
        this.begin = options.begin;
        this.end = options.end;
        this.howmany = options.howmany;
        this.isCompare = options.isCompare;
        this.current = options.current;


        //this.changeHtmlByPeriod(this.period);

        if (this.ctype === "kline") {
          this.drawKlineChart();
          this.drawThumbnail();
        } else if (this.ctype === "net-worth") {
          this.drawNetWorthChart();
          this.drawThumbnail();
        } else {
          if (this.isCompare) {
            this.drawCompareStock();
            this.drawThumbnail();
          } else {
            if (this.isShowStatus) {
              this.drawStatusChart();
            } else {
              this.drawStockChart();
            }
            this.drawThumbnail();
          }
        }

        this.bindEvent();
      } else {
        this.getKlineConfig(function () {
          that.getData("1d", function () {
            that.begin = 0;
            that.howmany = that.getStockDayLineCount(that.stockInfo.bigType, "1d");
            that.end = that.begin + that.howmany;

            that.current = that.data[that.period];

            if (that.current.current.length > 0) {
              that.drawChart();
              that.drawThumbnail();
              that.bindEvent();

              // 自动刷新1d的行情图 和闪烁点
              that.refreshDayChart();
              that.blinkCurrentPoint()
            } else {
              // 没有行情数据的话  先隐藏掉图吧
              that.wrapper.hide();
            }
          });
        });
      }
    },

    /**
     * 抽离净值数据获取
     * @param period
     */
    getNetWorthData: function (period, cb) {
      var period = period.replace("nw-", ""),
        that = this;

      $.ajax({
        url: "/fund/forchart/day.json",
        type: "GET",
        data: {
          symbol: that.symbol,
          period: period
        },
        success: function (ret) {
          that.wrapDataForNetWorth(ret, "nw-" + period);

          if (cb) {
            cb();
          }
        }
      });
    },

    // 获取数据
    getData: function (period, cb, isRefresh) {
      var that = this,
        klineData = this.kdata[this.period] && this.kdata[this.period][this.ktype],
        hasData;

      if (_.indexOf(stockPeriod, period) > -1 && this.data[period]) {
        hasData = true;
      }

      if (_.indexOf(klinePeriod, period) > -1 && klineData) {
        hasData = true;

        // k线数据取了一半的情况
        // 有一些特殊处理， 拿日K举例：
        // 当第一次切换到日K的时候 klineData 为undefined 此时hasData 为false 取最近一年的数据
        // 当第二次切换到日K的时候 klineData为上次取的数据 且status 为 half 但是这个时候 isRefresh 为false
        // 不用重新请求数据
        // 当拖动底部mini图的时候 会调用getData 并且 isRefresh 为true  这时候请求后一段kline数据
        if (klineData && klineData.status === "half" && isRefresh) {
          hasData = false;
        }

        if (klineData && klineData.status === "all") {
          hasData = true;
          isRefresh = false;
        }
      }

      if (hasData && !isRefresh) {
        cb();
      } else {
        if (period != "5d") {
          this.loadingOverlay.show();
        }

        var url = "/stock/forchart/stocklist.json",
          params = {
            symbol: this.symbol,
            period: period
          };

        if (period === "1d") {
          params.one_min = 1;
        }

        if (_.indexOf(klinePeriod, period) > -1) {
          url = "/stock/forchartk/stocklist.json";
          params.type = this.ktype;

          if (_.indexOf(noFuQuanSymbols, this.symbol) > -1) {
            params.type = "normal";
          }

          var now = Date.now(),
            dayTs = 1000 * 60 * 60 * 24,
            begin;

          if (that.period === "1day") {
            begin = now - 365 * dayTs;
          } else if (that.period === "1week") {
            begin = now - 365 * dayTs * 4
          }

          if (klineData) {
            if (klineData.status == "half" && klineData.data && klineData.data.chartlist && klineData.data.chartlist.length) {
              var first = klineData.data.chartlist[0];
              params.end = Date.parse(first.time);
            } else {
              params.end = begin;
            }
          } else {
            params.begin = begin;
            params.end = now;
          }
        }

        SNB.get(url, params, function (ret) {
          that.loadingOverlay.hide();
          that.wrapData(ret, period);
          cb();
        }, function () {
          that.loadingOverlay.hide();
          alert("数据获取出错");
        });
      }
    },

    fixPeriod: function (period) {
      if (period === "1m") {
        period = "6m";
      }

      if (period === "1y" || period === "3y") {
        period = "all";
      }
      return period;
    },

    // wrapData
    wrapData: function (data, period) {
      if (this.ctype === "day" || period === "all" || period === "5d") {
        this.wrapDataForStockChart(data, period);
      } else {
        this.wrapDataForKlineChart(data, period);
      }
    },

    drawChart: function () {
      if (this.ctype === "day") {
        if (this.isCompare) {
          this.drawCompareStock()
        } else {
          if (this.isShowStatus) {
            this.drawStatusChart();
          } else {
            this.drawStockChart();
          }
        }
      } else {
        this.drawKlineChart();
      }
    },

    drawSplitTime: function (x, time, cy) {
      var chart = this.chart,
        cy = cy || chart.cy;

      this.paper.path([
        "M",
        fixCoord(x),
        fixCoord(chart.stateHeight),
        "L",
        fixCoord(x),
        fixCoord(cy)
      ]).attr(this.theme.dashedSplitLine);

      this.paper.text(x, cy + 10, time).attr({
        "fill": "#888",
        "text-anchor": "start",
        "font-family": "Arial",
        "font-size": "10"
      });
    },

    // isRemoveZero 剔除0的点
    // rate 最大最小值 距离上线边框的 比例
    drawSplitLine: function (current, vol, rate, isRemoveZero) {
      var chart = this.chart,
        that = this,
        cd = that.ctype === "kline" ? SNB.chartUtil.minMax2d(current) : SNB.chartUtil.minMax1d(current, isRemoveZero),
        cmin = cd[0],
        cmax = cd[1];

      if (this.period == "1d" && this.stockInfo.bigType == "沪深" && this.lastClose && !this.isCompare) {
        var max = Math.max(Math.abs(cmin - this.lastClose), Math.abs(cmax - this.lastClose));
        cmax = this.lastClose + max;
        cmin = this.lastClose - max;
      }

      var crange = cmax === cmin ? (rate * cmax) : (cmax - cmin),
        cymin = cmin - rate * crange,
        cymax = cmax + rate * crange,
        cscale = cymax === cymin ? 0 : (chart.currentHeight / (cymax - cymin)),
        cy = chart.cy;

      if (!vol) {
        cy += chart.volumeHeight;
      }

      this.chart.cscale = cscale;
      this.chart.cymin = cymin;

      this.chart.cmin = cmin;
      this.chart.cmax = cmax;

      var lastClose,
        ystops;

      if (this.ctype === "day") {
        if (this.period === "1d") {
          lastClose = this.lastClose;
        } else {
          lastClose = _.first(current);
        }
      }

      // 如果lastClose = 0 取最近一个不为0 的点
      // 对比的话  就得取lastClose=0
      if (lastClose === 0 && !that.isCompare) {
        lastClose = _.find(current, function (c) {
          return c > 0;
        });
      }

      if (that.isCompare) {
        lastClose = undefined;
      }

      var count = 5;

      if (that.isFullScreen) {
        count = 10;
      }

      ystops = SNB.chartUtil.currentGrid(cymin, cymax, count, lastClose);

      var i = 0,
        len = ystops.length;

      for (; i < len; i++) {
        var logystp = ystops[i],
          y = cy - (logystp - cymin) * cscale;

        if (y > cy - 20 || y < chart.stateHeight + 20) {
          continue;
        }

        // 横线
        this.paper.path([
          "M",
          fixCoord(this.labelWidth),
          fixCoord(y),
          "L",
          fixCoord(this.labelWidth + chart.width),
          fixCoord(y)
        ]).attr(this.theme.dashedSplitLine);

        var color = "#888",
          label = "",
          fixedCount = 2,
          num;

        if (that.isCompare && that.ctype === "day") {
          num = logystp * 100;
          color = that.getUpDownColor(num);

          if (Math.abs(num) >= 100) {
            fixedCount = 0;
          } else if (Math.abs(num) >= 10) {
            fixedCount = 1;
          }

          label = num.toFixed(fixedCount) + "%";
          this.paper.text(fixCoord(this.labelWidth + chart.width + 3), fixCoord(y), label)
            .attr(this.theme.rightText)
            .attr({
              "fill": color
            });
        } else {
          // 分时图的时候  画上百分比
          if (!_.isUndefined(lastClose)) {
            num = (logystp - lastClose) / lastClose * 100;
            color = this.getUpDownColor(num);

            if (Math.abs(num) >= 100) {
              fixedCount = 0;
            } else if (Math.abs(num) >= 10) {
              fixedCount = 1;
            }

            var percentStr = num.toFixed(fixedCount) + "%";

            if (num == 0) {
              color = "#888";
            }

            this.paper.text(fixCoord(this.labelWidth + chart.width - 3), fixCoord(y - 7), percentStr)
              .attr(this.theme.leftText)
              .attr({
                "fill": color
              });
          }
        }

        // 左侧价格刻度
        fixedCount = 2;
        if (logystp >= 1000) {
          fixedCount = 0;
        }

        if(SNB.data && SNB.data.quote && SNB.data.quote.type){
          var type = parseInt(SNB.data.quote.type);
          if(type === 25){
            //期权截取小数后4位
            fixedCount = 4;
          }else if(type === 32 || type === 13 || type === 18 || type === 23 || type ===24){
            //港股涡轮、基金截取小数后3位
            fixedCount = 3;
          }

          if (this.symbol && this.symbol.indexOf("SH900") > -1) {
            fixedCount = 3;
          }
        }

        label = label || parseFloat(logystp).toFixed(fixedCount);

        var a = this.paper.text(fixCoord(this.labelWidth + 3), fixCoord(y - 7), label)
          .attr(this.theme.rightText)
          .attr({
            "fill": color
          });

        // 现在复权挪到tab里面去了 右侧也可以放刻度了
        if (this.ctype === "kline") {
          this.paper.text(fixCoord(this.labelWidth + chart.width - 3), fixCoord(y - 7), label)
            .attr(this.theme.leftText)
            .attr({
              "fill": color
            });
        }
      }

      // volume
      if (vol && vol.length) {
        var vd = SNB.chartUtil.minMax1d(vol),
          vheight = this.chart.volumeHeight,
          vmax = vd[1],
          vymax = vmax + rate * vmax,
          vscale = vheight / vymax,
          vy = chart.vy;

        this.chart.vscale = vscale;
        // draw volume splitLine
        var volstops = SNB.chartUtil.volumeGrid(vymax, 2);

        _.each(volstops, function (v, index) {
          var y = vy - v[1] * vscale;

          if (index < volstops.length - 1) {
            var label = v[0];

            that.paper.path([
              "M",
              fixCoord(that.labelWidth),
              fixCoord(y),
              "L",
              fixCoord(that.labelWidth + chart.width),
              fixCoord(y)
            ]).attr(that.theme.dashedSplitLine);

            that.paper.text(fixCoord(that.labelWidth - 3), fixCoord(y), label)
              .attr(that.theme.leftText);

            if (that.ctype === "day") {
              that.paper.text(fixCoord(that.labelWidth + chart.width + 3), fixCoord(y), label)
                .attr(that.theme.rightText);

            }
          }
        });

      }
    },

    // 获取服务端存储的k线的相关设置
    getKlineConfig: function (cb) {
      var that = this;

      if (SNB.currentUser.isGuest) {
        that.showMA = true;
        cb();
      } else {
        // 是否显示ma线， ma线颜色, 默认的沪深复权
        var params = ["showKlineMa", "klineMaColor", "klineFuquan"];

        SNB.Util.getConfig(params, function (ret) {
          if (ret && ret.length == 3) {
            if (ret[0]) {
              that.showMA = (ret[0].value != 0);
            } else {
              that.showMA = true;
            }

            if (ret[1]) {
              var tempArray = ret[1].value.split("-"),
                tempObj = {};

              _.each(tempArray, function (str, index) {
                var ma = MAArray[index],
                  show = str.slice(0, 1),
                  color = str.slice(1, 7);

                tempObj[ma] = {
                  show: show != "0",
                  color: "#" + color
                };
              });

              that.maShowInfo = tempObj;
            }

            if (ret[2] && (that.stockInfo.bigType === "沪深" || that.stockInfo.bigType == "美股")) {
              that.ktype = ret[2].value;

              if (that.stockInfo.bigType == "美股" && that.ktype == "after") {
                that.ktype = "normal";
              }
            }
          } else {
            that.showMA = true;
          }
          cb();
        });
      }
    },

    // 获取涨跌幅颜色
    getUpDownColor: function (num, st_color, defaultColor) {
      var color = defaultColor || "#000";

      if (_.isUndefined(st_color)) {
        st_color = SNB.currentUser.st_color || 1;
      }

      if (num > 0) {
        color = st_color == 1 ? "#d20" : "#3a1";
      } else if (num < 0) {
        color = st_color == 1 ? "#3a1" : "#d20";
      }
      return color;
    },

    renderHtml: function () {
      var periodHtml = ''
        + '<div class="period-wrapper">'
          + '<ul class="period">'
            + '<li data-period="1d">1日</li>'
            + '<li data-period="5d">5日</li>'
            + '<li data-period="1m">1月</li>'
            + '<li data-period="6m">6月</li>'
            + '<li data-period="1y">1年</li>'
            + '<li data-period="3y">3年</li>'
            + '<li data-period="all" class="all">全部</li>'
          + '</ul>'
        + '</div>';

      var nwPeriodHtml = ''
        + '<div class="nw-period-wrapper">'
          + '<ul class="period">'
            + '<li data-period="nw-1m" class="select">1月</li>'
            + '<li data-period="nw-6m">6月</li>'
            + '<li data-period="nw-1y">1年</li>'
            + '<li data-period="nw-3y">3年</li>'
            + '<li data-period="nw-all" class="all">全部</li>'
          + '</ul>'
        + '</div>';

      var configHtml = ' '
        + '<div class="chart-config">'
          + '<ul class="type-list">'
            + '<li data-period="1d">分时</li>'
            + '<li data-period="1day">日k</li>'
            + '<li data-period="1week">周k</li>'
            + '<li data-period="1month">月k</li>'
          + '</ul>'
          + '<ul class="chart-operate">'
            + '<li class="show-compare">'
              + '<a href="#">股票对比</a>'
            + '</li>'
            + '<li class="filter-status">'
              + '<a href="#">筛选讨论</a>'
            + '</li>'
            + '<li class="show-status">'
              + '<a href="#">查看讨论</a>'
            + '</li>'
            + '<li class="kline-config">'
              + '<a href="#">偏好设置</a>'
            + '</li>'
            + '<li class="enter-fs">'
              + '<a href="#">全屏显示</a>'
            + '</li>'
            + '<li class="exit-fs">'
              + '<a href="#">退出全屏</a>'
            + '</li>'
          + '</ul>'
          + '<div class="fixit"></div>'
        + '</div>';

      var fuquanHtml = ''
        + '<ul class="fuquan">'
          + '<li data-fuquan="before">前复权</li>'
          + '<li data-fuquan="normal">不复权</li>'
          + '<li data-fuquan="after">后复权</li>'
        + '</ul>';

      var compareHtml = ''
        + '<div class="stock-compare">'
          + '<div class="arrow-out arrow"></div>'
          + '<div class="arrow-in arrow"></div>'
          + '<div class="compare-stocks">'
          + '</div>'
          + '<div class="search-stock">'
            + '<input type="text" class="search-stock-input" placeholder="输入股票名称/代码"/>'
          + '</div>'
          + '<input type="button" value="收起" class="close-compare btn"/>'
        + '</div>';

      var filterHtml = ''
        + '<div class="status-filter">'
          + '<div class="arrow-out arrow"></div>'
          + '<div class="arrow-in arrow"></div>'
          + '<div class="filter-options">'
            + '<label for="filter-all" class="compareListLabel">'
              + '<input type="radio" id="filter-all" name="status-filter" checked>'
              + '<span>全部</span>'
            + '</label>'
            + '<label for="filter-news" class="compareListLabel">'
              + '<input type="radio" id="filter-news" name="status-filter">'
              + '<span>新闻</span>'
            + '</label>'
            + '<label for="filter-notice" class="compareListLabel">'
              + '<input type="radio" id="filter-notice" name="status-filter">'
              + '<span>公告</span>'
            + '</label>'
            + '<label for="filter-myself" class="compareListLabel">'
              + '<input type="radio" id="filter-myself" name="status-filter">'
              + '<span>我自己</span>'
            + '</label>'
          + '</div>'
          + '<div class="search-user">'
            + '<input type="radio" id="filter-search" name="status-filter">'
            + '<input type="text" class="search-user-input" placeholder="输入用户名/讨论"/>'
            +'<div class="dropdown-menu">'
              + '<h3>用户</h3>'
              + '<ul class="search-user"></ul>'
              + '<h3>讨论</h3>'
              + '<ul class="search-status"></ul>'
            +'</div>'
          + '</div>'
          + '<input type="button" value="收起" class="close-filter btn"/>'
        + '</div>';

      var klineInfoHtml = '<div class="currentStockInfo right"></div>';

      this.wrapper.prepend(configHtml);
      this.wrapper.append(periodHtml + compareHtml + filterHtml);
      this.wrapper.append(klineInfoHtml);

      if (this.noKline) {
        this.wrapper.find(".type-list li").hide();
      }

      if (this.noStatus) {
        this.wrapper.find(".show-status").remove();
      }

      if (this.isShowStatus) {
        this.wrapper.find(".filter-status").show();
        this.wrapper.find(".show-status a").text("隐藏讨论");
      }

      if (this.isFund && this.fundType == 13) {
        this.wrapper.append(nwPeriodHtml);
        var $li = this.wrapper.find(".type-list li[data-period='1d']");
        $li.after('<li data-period="nw-1m">净值</li>');

        // 删除查看讨论
        this.wrapper.find(".chart-config .show-status").remove();
      }

      // 隐藏股票对比
      if (this.ctype === "net-worth") {
        this.wrapper.find(".period-wrapper").hide();
        this.wrapper.find(".nw-period-wrapper").show();
        this.wrapper.find(".chart-config .show-compare").hide();
      }

      // 没有登录的话  去掉筛选讨论里面 我自己的选项
      if (SNB.currentUser.isGuest) {
        this.wrapper.find("#filter-myself").remove();
      }

      // 上方日期
      var p = this.period;
      if (this.ctype === "day") {
        p = "1d";
      }
      if (this.ctype === "net-worth") {
        p = "nw-1m";
      }

      this
        .wrapper
        .find('.type-list li[data-period="' + p + '"]')
        .addClass("select");

      // 下方日期
      p = this.ctype === "day" ? this.period : "1d";
      this
        .wrapper
        .find(".period li[data-period='" + p + "']")
        .addClass("select");

      // 沪深添加复权下拉选项
      var that = this;
      var quoteType = SNB.data && SNB.data.quote && SNB.data.quote.type && parseInt(SNB.data.quote.type);
      this.wrapper.find(".type-list > li").each(function () {
        if ($(this).data("period") !== "1d"
          && $(this).data("period")  !== "nw-1m"
          && (that.stockInfo.bigType === "沪深" || that.stockInfo.bigType == "美股")
          && _.indexOf(noFuQuanSymbols, that.symbol) === -1
          && quoteType !== 25) {
          $(this).append(fuquanHtml);

          // 美股没有后复权
          if (that.stockInfo.bigType == "美股") {
            $(this).find('li[data-fuquan="after"]').remove();
          }
        }
      });

      // 隐藏/显示全屏对应的按钮
      if (this.isFullScreen) {
        this.wrapper.find(".enter-fs").hide();
        this.wrapper.find(".exit-fs").show();
      } else {
        this.wrapper.find(".enter-fs").show();
        this.wrapper.find(".exit-fs").hide();
      }

      if (this.isCompare) {
        this.wrapper.find(".show-status").addClass("disabled");
      }
      this.wrapper.find(".filter-status").hide();

      // 获取用来对比的股票
      SNB.get("/stock/portfolio/popstocks.json", {
        code: this.symbol,
        start: 0,
        count: 4
      }, function (ret) {
        if (ret.length) {
          var html = '',
            symbols = _.keys(that.compareData);

          _.each(ret, function (stock) {
            that.symbolNames[stock.code] = stock.name;

            var checked = "",
              id = "stock_" + stock.code;

            if (that.isFullScreen) {
              id += "_fs";
            }

            if (_.indexOf(symbols, stock.code) > -1) {
              checked = "checked";
            }

            html += ' '
              + '<label for="' + id + '" class="compareListLabel">'
              + '<input type="checkbox" data-symbol="' + stock.code + '" id="' + id + '" ' + checked + '>'
              + '<span>' + stock.name + '</span>'
              + '</label>';
          });

          that.wrapper.find(".compare-stocks").html(html);
        }
      });
    },

    // 画矩形框
    drawBase: function () {
      var chart = this.chart;

      // draw current rect
      var x = fixCoord(this.labelWidth),
        y = 0.5;

      if (this.isIE8) {
        x = this.labelWidth;
        y = -2;
      }

      this.paper
        .rect(x, y, chart.width - 1, chart.currentHeight + chart.stateHeight)
        .attr(this.theme.currentRect);

      // draw state line  
      var array = [
        "M",
        fixCoord(this.labelWidth),
        fixCoord(chart.stateHeight),
        "L",
        fixCoord(this.labelWidth + chart.width),
        fixCoord(chart.stateHeight)
      ];

      this.paper
        .path(array)
        .attr(this.theme.splitLine);

      // draw volume rect   
      var volumeY = fixCoord(chart.stateHeight + chart.currentHeight + chart.timeHeight);
      this.paper
        .rect(fixCoord(this.labelWidth), volumeY, chart.width - 1, chart.volumeHeight)
        .attr(this.theme.currentRect);

      // 水印  
      var logoStr = "© XUEQIU.COM";
      this.paper
        .text(this.labelWidth + 5, chart.cy - 7, logoStr)
        .attr(this.theme.rightText)
        .attr({
          "fill": "#aaa"
        });
    },

    /**
     * 净值基础图  current 占用volume 部分
     */
    drawNetWorthBase: function () {
      var chart = this.chart;

      // draw current rect
      var x = fixCoord(this.labelWidth),
        y = 0.5;

      if (this.isIE8) {
        x = this.labelWidth;
        y = -2;
      }

      var currentHeight = chart.currentHeight + chart.stateHeight + chart.volumeHeight;
      this.paper
        .rect(x, y, chart.width - 1, currentHeight)
        .attr(this.theme.currentRect);

      // draw state line
      var array = [
        "M",
        fixCoord(this.labelWidth),
        fixCoord(chart.stateHeight),
        "L",
        fixCoord(this.labelWidth + chart.width),
        fixCoord(chart.stateHeight)
      ];

      this.paper
        .path(array)
        .attr(this.theme.splitLine);

      // 水印
      var logoStr = "© XUEQIU.COM";
      this.paper
        .text(this.labelWidth + 5, currentHeight - 7, logoStr)
        .attr(this.theme.rightText)
        .attr({
          "fill": "#aaa"
        });

    },

    // 修复股票类型
    fixBigType: function (bigType) {
      if (bigType === "指数") {
        if (this.symbol.indexOf("HK") > -1) {
          bigType = "港股";
        } else {
          bigType = "美股";
        }
      } else if (bigType === "基金") {
        bigType = "沪深";
      }
      return bigType;
    },

    getStockDayLineCount: function (bigType, period) {
      period = period || this.period;

      var dayPointsCount = {
          "沪深": 60 * 4 + 2,
          "基金": 60 * 4 + 2,
          "港股": 60 * 5.5 + 2,
          "美股": 60 * 6.5 + 1,
          "比特币": 60 * 24
        },
        pointsCount5d = {
          "美股": 200,
          "基金": 200,
          "沪深": 130,
          "港股": 175,
          "比特币": 720
        },
        howmany;

      bigType = this.fixBigType(bigType);

      if (period === "1d") {
        howmany = dayPointsCount[bigType];
      } else if (period === "5d") {
        howmany = pointsCount5d[bigType];
      } else {
        howmany = this.current.current.length;
      }

      return howmany;
    },

    // refresh chart  分时图1天  2分钟刷新一次
    refreshDayChart: function () {
      var that = this;

      setInterval(function () {
        if (that.ctype === "day" && that.period === "1d" && !that.isShowStatus) {
          if (that.stockInfo && that.stockInfo.bigType == "港股") {
            return false;
          }
          that.getData("1d", function () {
            that.current = that.data[that.period];
            that.paper.clear();
            that.opaper.clear();

            that.blinkPoint = undefined;
            that.blinkPath = undefined;

            that.drawBase();
            that.drawChart();
          }, true);
        }
      }, 1000 * 60);
    },

    // 通过quotec 接口 刷新点
    refreshQuotec: function (c) {
      if (this.isCompare) {
        return;
      }
      var chart = this.chart;

      if (this.ctype === "day" && this.period === "1d") {
        var current = this.showCurrent.current,
          perWidth = chart.perWidth,
          cscale = chart.cscale,
          cymin = chart.cymin,
          cy = chart.cy,
          lastCurrent = _.last(current),
          preX = this.labelWidth + (current.length - 1) * perWidth,
          preY = cy - (lastCurrent - cymin) * cscale,
          x = preX + perWidth,
          y = cy - (c - cymin) * cscale;

        // 画满的话
        if (current.length === this.howmany) {
          return false;
        }

        if (y < 0 || y > cy) {
          if (this.blinkPoint && this.blinkPath) {
            this.blinkPoint.remove();
            this.blinkPath.remove();

            this.blinkPoint = undefined;
            this.blinkPath = undefined;
          }
          return false;
        }

        // 一个闪烁的发光点
        if (this.blinkPoint && this.blinkPath) {
          this.blinkPath.animate({
            path: [
              "M",
              fixCoord(preX),
              fixCoord(preY),
              "L",
              fixCoord(x),
              fixCoord(y)
            ]
          });

          this.blinkPoint.animate({
            cx: x,
            cy: y
          });
        } else {
          this.blinkPath = this.paper.path([
            "M",
            fixCoord(preX),
            fixCoord(preY),
            "L",
            fixCoord(x),
            fixCoord(y)
          ]).attr(this.theme.currentPath);

          this.blinkPoint = this.paper.circle(x, y, 3).attr({
            "stroke": "none",
            "stroke-width": "0px",
            "fill": "#2f84cc"
          });
        }
      }
    },

    // 闪烁动画
    blinkCurrentPoint: function () {
      var that = this;

      setInterval(function () {
        if (that.blinkPoint && that.ctype === "day" && that.period === "1d") {
          that.blinkPoint.animate({
            "fill": "#cfe0f1",
            "r": "3"
          }, 1000, function () {
            if (that.blinkPoint) {
              that.blinkPoint.animate({
                "fill": "#2f84cc",
                "r": "4"
              }, 1000);
            }
          });
        }
      }, 2000);
    },

    // 根据不同的period 来显示或者隐藏html
    changeHtmlByPeriod: function (period) {
      var that = this,
        chart = this.chart,
        top,
        height,
        display;

      that.wrapper.find(".stock-compare").slideUp("fast");

      if (_.indexOf(klinePeriod, period) > -1) {
        top = that.overlayTop + chart.indexButtonHeight + chart.indexHeight;
        display = "block";
        height = "458px";
        that.wrapper.find(".toolbar").hide();

        that.wrapper.find(".show-compare").hide();
        that.wrapper.find(".show-status").hide();
        that.wrapper.find(".filter-status").hide();

        that.statusPaper.clear();

        // show的话  会加上display: list-item 样式
        // 未登录用户 不显示k线设置
        if (!SNB.currentUser.isGuest) {
          that.wrapper.find(".kline-config").css({
            "display": "inline-block"
          });
        }

        that.wrapper.find(".period-wrapper").hide();

      // 加入了基金单位净值图的逻辑
      } else if (_.indexOf(nwPeriod, period) > -1) {
        top = that.overlayTop;
        height = "388px";
        display = "none";
        that.wrapper.find(".chart-operate li").hide();
        that.wrapper.find(".enter-fs").show();

        that.wrapper.find(".period-wrapper").hide();
        that.wrapper.find(".nw-period-wrapper").show();
      } else {
        top = that.overlayTop;
        display = "none";
        height = "388px";
        that.wrapper.find(".toolbar").show();

        that.wrapper.find(".show-compare").show();
        that.wrapper.find(".show-status").show();
        that.wrapper.find(".kline-config").hide();

        that.wrapper.find(".period-wrapper").show();
        that.wrapper.find(".nw-period-wrapper").hide();

        if (that.isShowStatus) {
          that.wrapper.find(".filter-status").show();
        }
      }

      that.klineIndexOverlay.css({
        display: display
      });

      // TODO 全屏 并且kline 的时候 需要把dragbar向下移一点  具体原因还没找到
      if (that.isFullScreen && _.indexOf(klinePeriod, period) > -1) {
        top += 1;
      }
      that.dragbarOverlay.css({
        "top": top
      });
      that.wrapper.css({
        height: height
      });
    }
  };
});
;
/*
 *股票对比
 */

define('pages/invest/chart/TSNB.chart.compare.js', [], function (require, exports, module) {  function fixCoord(coord) {
    return Math.floor(coord) + 0.5;   
  }

  var obj = {

    // 获取要对比股票的数据
    getCompareData: function (symbol, period, cb) {
      var url = "/stock/forchart/stocklist.json",
        that = this,
        params = {
          symbol: symbol,
          period: period
        };

      if (period === "1d") {
        params.one_min = 1;
      }

      if (this.compareData[symbol] && this.compareData[symbol][period]) {
        cb();
      } else {
        SNB.get(url, params, function(ret) {
          that.wrapDataForCompare(ret, symbol, period);
          cb();
        });  
      }
    }, 

    wrapDataForCompare: function(data, symbol, period) {
      period = this.fixPeriod(period);
      var baseCount = this.data[period].current.length,
        count = data.chartlist.length,
        baseTsArray = this.data[period].ts,
        diff = count - baseCount,
        list = data.chartlist,
        i = 0,
        ts = [],
        current = [],
        max = Math.max(baseCount, count);

      // 有种情况 比如一直股票13年12月退市  对比的话  就得把后面的点先给补出来  然后再去算前面的点
      // 拿最后的时间  跟原数组来比
      if (period !== "1d") {
        var last = _.last(list),
          lastCurrentTs = Date.parse(last.time),
          index = SNB.chartUtil.getIndexByTs(baseTsArray, lastCurrentTs);

        // 拿到最后时间在原时间数组里面的位置
        // 过于靠前 则为退市
        // 补完整。
        if (index < baseCount - 3) {
          var j = 0;
          for (; j < baseCount - index; j ++) {
            var obj = _.extend(last, {});
            list.push(obj);
          }

          // 重新定义 count diff max
          count = list.length;
          diff = count - baseCount;
          max = Math.max(baseCount, count);
        }
      }

      for (; i < max; i++) {
        var d; 

        // 两个数组对比  如果新的大于老得  截取 小于的话  就在前面补上undefined
        // 如果diff大于0 就说明新数组长度大于老数组
        // 需要舍掉新数组前面多余的部分
        if (diff > 0) {
          if (i >= diff) {
            d = list[i];
            if (d) {
              ts[i - diff] = Date.parse(d.time);
              current[i - diff] = d.current;
            }
          }
        } else {
          // 1天或者5天得图 应该补全后面的点
          if (period === "1d" || period === "5d") {
            d = list[i];
            if (d) {
              ts[i] = Date.parse(d.time);
              current[i] = d.current;
            } else {
              ts[i] = undefined;
              current[i] = undefined;
            }
          } else {
            if (i + diff >= 0) {
              d = list[i + diff];
              ts[i] = Date.parse(d.time);
              current[i] = d.current;
            } else {
              ts[i] = undefined;
              current[i] = undefined;
            }
          }
        }
      }

      if (_.isUndefined(this.compareData[symbol])) {
        this.compareData[symbol] = {};
      } 
      this.compareData[symbol][period] = {
        current: current,
        ts: ts
      };
    },

    // 对比某只股票
    compareStock: function (symbol) {
      var period = this.fixPeriod(this.period),
        that = this;
      
      this.statusPaper.clear();
      this.wrapper.find(".show-status").addClass("disabled");

      if (symbol) {
        this.getCompareData(symbol, period, function() {
          that.paper.clear();
          that.drawBase();
          that.drawCompareStock();
        });
      } else {
        var symbols = _.keys(this.compareData),
          count = symbols.length;

        _.each(symbols, function(symbol) {
          that.getCompareData(symbol, period, function() {
            count--;

            if (!count) {
              that.paper.clear();
              that.drawBase();
              that.drawCompareStock();
            }
          });
        });  
      }
    },

    // 画图
    drawCompareStock: function() {
      var symbols = _.keys(this.compareData),
        percentObj = {},
        chart = this.chart,
        cy = chart.cy,
        vy = chart.vy,
        that = this,
        percentsArray = [],
        period = this.fixPeriod(this.period);

      _.each(symbols, function(symbol) {
        var current = that.compareData[symbol][period].current, 
          showCurrent = current.slice(that.begin, that.end),
          percentArray = [],
          firstCurrent = _.first(showCurrent);

        if (firstCurrent == 0) {
          firstCurrent = _.find(showCurrent, function (current) {
            return current > 0;
          })
        }

        _.each(showCurrent, function(c, i) {
          if (_.isUndefined(c) || c == 0) {
            percentArray[i] = undefined;
          } else {
            if (_.isUndefined(firstCurrent)) {
              firstCurrent = c;
            }
            percentArray[i] = (c - firstCurrent) / firstCurrent; 
          }  
        });  

        percentObj[symbol] = percentArray;
        percentsArray = percentsArray.concat(percentArray);
      });

      this.showPercentObj = percentObj;

      var current = this.current.current.slice(this.begin, this.end),
        vol = this.current.vol.slice(this.begin, this.end),
        ts = this.current.ts.slice(this.begin, this.end);

      current = _.filter(current, function(a) {
        return a > 0; 
      });

      this.showCurrent = {
        current: current,
        vol: vol,
        ts: ts
      };

      this.drawSplitLine(percentsArray, vol, 0.3);
      this.howmany = this.end - this.begin;

      var perWidth = chart.width / (this.howmany - 1),
        count = this.howmany,
        cymin = chart.cymin,
        cscale = chart.cscale,
        vscale = chart.vscale,
        timeCount = Math.round(count / 5);

      this.chart.perWidth = perWidth;

      // draw time split
      if ( that.period === "1d") {
        that.draw1dSplitTime();
      }

      _.each(symbols, function(symbol, index) {
        var pathArray = ["M"],
          percentArray = that.showPercentObj[symbol],
          lastTime;

        _.each(percentArray, function(p, i) {
          if (!_.isUndefined(p)) {
            var ycurrent = cy - (p - cymin) * cscale,
              yvol = vy - vol[i] * vscale,
              x = that.labelWidth + i * perWidth;
            
            pathArray.push(fixCoord(x), fixCoord(ycurrent));  

            if (symbol === that.symbol) {
              var time = SNB.chartUtil.formatTime(ts[i], "yyyy-MM-dd");

              that.paper.path([
                "M",
                fixCoord(x),
                fixCoord(yvol), 
                "L",
                fixCoord(x), 
                fixCoord(vy)
              ]).attr(that.theme.volumePath);

              if (time !==lastTime) {
                /*
                 *if (that.period === "5d") {
                 *  drawSplitTime(x, time);
                 *}
                 */

                if (i % timeCount === 0 && that.period !== "1d") {
                  that.drawSplitTime(x, time)  
                }
              }
            }

            if (pathArray.length !== 1) {
              pathArray.push("L");
            }
          }
        });  

        var color = that.theme.compareColors[index];

        that.paper.path(pathArray).attr({
          "stroke-width": "1.5px",
          "stroke": color 
        });
        if (_.isUndefined(that.compareColors)) {
          that.compareColors = {};
        }

        that.compareColors[symbol] = color;

      });

      // 循环股票会调用好几次
      that.opaper.clear();
      var i = current.length - 1;
      that.showCompareStateInfo(i);
    },

    // 鼠标事件
    showCompareCurrentInfo: function (index) {
      this.opaper.clear();  

      var that = this,
        chart = this.chart,
        cymin = chart.cymin,
        cscale = chart.cscale,
        vscale = chart.vscale,
        sy = chart.stateHeight,
        ty =  chart.cy + chart.timeHeight,
        cy = chart.cy,
        vy = chart.vy,
        ts = this.showCurrent.ts[index],
        x = this.labelWidth + index * chart.perWidth,
        isUSTime = this.is$,
        tsformat; 

      if (!ts) {
        return false;
      }  

      if (this.period === "1d" || this.period === "5d") {
        tsformat = "hh:mm";
      } else if (this.period === "1m" || this.period === "6m") {
        tsformat = "MM-dd";
      } else {
        tsformat = "yyyy-MM-dd";
      } 

      var percentObj = this.showPercentObj;

      // 竖线
      this.opaper.path([
        "M",
        fixCoord(x),
        fixCoord(chart.stateHeight),
        "L",
        fixCoord(x),
        fixCoord(cy)
      ]).attr(this.theme.dashedSplitLine)
      .attr({
        "stroke": "#888"
      });


      var timeStr = SNB.chartUtil.formatTime(ts, tsformat, isUSTime),
        timeEl = this.opaper.text(fixCoord(x), fixCoord(cy + 10), timeStr).attr(this.theme.centerText),
        timeWidth = timeEl.getBBox().width,
        timeRectWidth = timeWidth + 10;

      this.opaper.rect(fixCoord(x - timeRectWidth / 2), fixCoord(cy + 2), timeRectWidth, 16).attr({
        "stroke": "#ccc",
        "fill": "#f0f0f0"
      });
      timeEl.toFront();
    },

    showCompareStateInfo: function (index) {
      if (index < 0 || _.isNaN(index)) {
        return false;
      }

      var that = this,
        startX = this.labelWidth +  10,
        y = 10.5,
        percentObj = this.showPercentObj,
        symbols = _.keys(percentObj);

      _.each(symbols, function(symbol) {
        var color = that.compareColors[symbol],
          name = SNB.Util.splitWord(that.symbolNames[symbol], 4),
          percent = that.showPercentObj[symbol][index];

        that.opaper.circle(startX, y, 5).attr({
          "storke": "none",
          "stroke-width": "0px",
          "fill": color
        });   
        startX += 7;

        var text = that.opaper.text(startX, y, name).attr({
          "fill": color,
          "text-anchor": "start"
        });

        startX += text.getBBox().width + 5;

        if (!_.isUndefined(percent)) {
          var percentStr = (percent * 100).toFixed(2) + "%";
          var pcolor = that.getUpDownColor(percent);
          var percentTxt = that.opaper.text(startX, y, percentStr).attr({
            "fill": pcolor,
            "text-anchor": "start",
            "font-size": "10px"
          });

          startX += percentTxt.getBBox().width;
        }  
        startX += 12;
      });  
    }
  };

  _.extend(SNB.stockChart.prototype, obj);
});
;
define('pages/invest/chart/TSNB.chart.event.js', [], function (require, exports, module) {  var obj = {
    bindEvent: function() {
      var that = this,
        offset = this.container.offset(),
        chart = this.chart;

      // 点击事件层 显示相应的讨论点
      this.eventOverlay.on("click", function (e) {
        if (that.isShowStatus) {
          var x = e.pageX - offset.left;
          if (that.statusCircles && that.statusCircles.length) {

            // 选出鼠标范围内的所有点
            var circles = [];

            that.statusCircles.forEach(function (circle) {
              var cx = circle.attr("cx") || circle.attr("x");

              if (circle.type === "image") {
                if (!circle.data("isPop")) {
                  circle.node.href.baseVal = circle.data("defaultSrc");
                }

                circle.data("cx", cx + 8);
                circle.data("cy", circle.attr("y") + 4);

                if (x >= cx && x <= cx + 12) {
                  circles.push(circle);
                }
              } else {
                if (!circle.data("isPop")) {
                  circle.animate({
                    r: "3"
                  });
                }

                if (x >= cx - 3 && x <= cx + 3) {
                  circles.push(circle);
                }
              }
            });

            // 确定出最近的一个点
            var circle;

            if (circles.length) {
              _.each(circles, function (c) {
                if (circle) {
                  var cx = c.data("cx") || c.attr("cx"),
                    circleX = circle.data("cx") || circle.attr("cx"),
                    x1 = Math.abs(x - cx),
                    x2 = Math.abs(x - circleX);

                  if (x1 <= x2) {
                    circle = c;
                  }
                } else {
                  circle = c;
                }
              });

              if (circle.type === "image") {
                circle.node.href.baseVal = circle.data("hoverSrc");
              } else {
                circle.animate({
                  r: "5"
                });
              }
            }

            // 关掉弹出层 圆点回复正常 删除牵引线
            function removePopStatus(circle) {
              if (circle.data("status")) {
                var $pop = circle.data("status");
                if ($pop.data("relatedLine")) {
                  $pop.data("relatedLine").remove();
                }
                $pop.remove();

                circle.removeData("status");
                circle.removeData("isPop");


                if (circle.type === "image") {
                  circle.node.href.baseVal = circle.data("defaultSrc");
                } else {
                  circle.animate({
                    r: "3",
                    fill: "#05c"
                  });
                }
              }
            }

            // 选出点中得点
            if (circle) {
              // 不是弹出状态 弹出
              if (!circle.data("isPop")) {
                that.popStatus(circle);
                circle.data("isPop", true);
              } else {
                // 弹出状态的话  关闭掉
                removePopStatus(circle);
              }
            } else {
              // 点击空白的地方 关掉所有的弹出
              that.statusCircles.forEach(function (circle) {
                if (circle.data("isPop")) {
                  removePopStatus(circle);
                }
              });
            }
          }
        }
      });

      // 鼠标移动  显示当前行情信息
      this.eventOverlay.on("mousemove", function(e) {
        if (!that.chart.drag.isDragging) {
          var top = offset.top,
            left = offset.left,
            pageX = e.pageX,
            pageY = e.pageY,
            index = Math.round((pageX - left - that.labelWidth) / that.chart.perWidth);

          /*
           *if (that.isShowStatus) {
           *  var x = pageX - left;
           *  that.showStatusStockInfo(x);
           *} else {
           *  that.currentIndex = index;
           */

          if (!that.isShowStatus) {
            that.currentIndex = index;
          }

          if (that.ctype === "day") {
            if (that.isCompare) {
              that.showCompareCurrentInfo(index);
              that.showCompareStateInfo(index);
            } else {
              if (that.isShowStatus) {
                var x = pageX - left;
                that.showStatusStockInfo(x);
              } else {
                that.showStockCurrentInfo(index);
                that.showStockStateInfo(index);
              }
            }
          } else if (that.ctype === "net-worth"){
            that.showNetWorthCurrentInfo(index);
            that.showNetWorthStateInfo(index);
          } else {
            that.showKlineCurrentInfo(index);
            that.showKlineStateInfo(index);
          }
        }
      });

      // 鼠标移除  显示最后一个点得行情信息
      this.eventOverlay.on("mouseout", function(e) {
        that.opaper.clear();
        var index;
        if (that.ctype === "day") {
          index = that.showCurrent.current.length - 1;

          if (that.isCompare) {
            that.showCompareStateInfo(index);
          } else {
            that.showStockStateInfo(index);
          }
        } else if (that.ctype === "net-worth") {
          index = that.showCurrent.current.length - 1;

          that.showNetWorthCurrentInfo(index);
          that.showNetWorthStateInfo(index);
        } else {
          index = that.showCurrent.ohlcma.length - 1;
          that.showKlineStateInfo(index);

          // 鼠标移出后隐藏 弹出层
          that.wrapper.find(".currentStockInfo").hide();
        }
        that.currentIndex = undefined;
      });

      // 左右键 移动十字线
      $("body").on("keydown", function(e) {
        var length = that.showCurrent.ts.length,
          index = that.currentIndex;

        if (e.keyCode === 37 || e.keyCode === 39) {
          if (e.keyCode == 37) {
            index--;
          }
          if (e.keyCode == 39) {
            index++;
          }
          if (index < 0) {
            index = length - 1;
          }
          if (index == length) {
            index = 0;
          }

          if (that.ctype === "day") {
            if (that.isCompare) {
              that.showCompareCurrentInfo(index);
              that.showCompareStateInfo(index);
            } else {
              that.showStockCurrentInfo(index);
              that.showStockStateInfo(index);
            }
          } else {
            that.showKlineCurrentInfo(index);
            that.showKlineStateInfo(index);
          }

          that.currentIndex = index;
        }
      }).on("keydown", function (e) {
        // esc 退出全屏
        if (that.isFullScreen && e.keyCode == 27 ) {
          that.wrapper.find(".exit-fs").trigger("click");
        }
      });

      // 点击任意位置关闭 股票对比和筛选讨论的弹框
      $("body").on("click", function (e) {
        var $target = $(e.target);

        if (!$target.parents(".stock-compare").length && !$target.parents(".status-filter").length) {
          that.wrapper.find(".stock-compare").hide("fast");
          that.wrapper.find(".status-filter").hide("fast");
        }
      });

      // k线图的拖动
      this.eventOverlay.on("mousedown", function(e) {
        // 只有k线能拖动
        if (that.ctype === "kline") {
          that.chart.drag = {
            isDragging: true,
            startX: e.pageX
          }
        }
      }).on("mouseup", function(e) {
        that.chart.drag.isDragging = false;
      }).on("mousemove", function(e) {
        if (that.chart.drag.isDragging) {
          var dx = e.pageX - that.chart.drag.startX,
            dcount = Math.round(dx / that.chart.perWidth);

          that.begin -= dcount;
          that.end -= dcount;
          var time1 = Date.now();

          if (!that.chart.isDrawingKline) {
            that.paper.clear();
            that.drawBase();
            that.drawChart();
          }
        }
      });


      var newChartSvg = $("#newChart").children().eq(0);
      var chartSvg = $("#overlay-chart").children().eq(0);
      var dragbarSvg = $("#overlay-dragbar").children().eq(0);
      var klineIndexSvg = $("#overlay-klineIndex").children().eq(0);
      var statusSvg = $("#overlay-status").children().eq(0);
      var eventDiv = $("#overlay-event");
      var loadingDiv = $("#overlay-loading");

      var isIE_eight = false;

      if($("#newChart svg").length === 0){
        //没有SVG。说明是IE8浏览器
        isIE_eight = true;
      }

      function zoom(width){
        var pankouDiv = $("#pankou");
        if(chart.width === width || that.isFullScreen || !pankouDiv.length){
          return;
        }
        chart.width = width;
        if(width === 400){
          pankouDiv.show();
        }else{
          pankouDiv.hide();
        }

        if(isIE_eight){
          newChartSvg.css("width",width);
          chartSvg.css("width",width);
          dragbarSvg.css("width",width);
          klineIndexSvg.css("width",width);
          statusSvg.css("width",width);
        }else{
          newChartSvg.attr("width",width);
          dragbarSvg.attr("width",width);
          klineIndexSvg.attr("width",width);
          statusSvg.attr("width",width);
          chartSvg.attr("width",width);
        }
        loadingDiv.css("width",width);
        eventDiv.css("width",width);
      }

      // 切换日期
      this.wrapper.on("click", ".period > li, .type-list > li", function (e) {
        if ($(this).hasClass("select") && !e.isTrigger) {
          return false;
        }

        $(".fuquan").hide();
        $(".currentStockInfo").hide();

        that.wrapper.find(".tt").remove();
        var period = $(this).data("period"),
          splitx = that.thumbnailInfo.splitx;

        $(this).siblings().removeClass("select");
        $(this).addClass("select");

        if (period === "1d" || period === "5d") {
          if (period === "1d") {
            zoom(400);
          } else {
            zoom(568);
          }

          // 变换各个层的位置 
          that.changeHtmlByPeriod(period);

          that.period = period;
          that.ctype = "day";
          var x1, x2, width, lx, rx, bindex, eindex;

          if (period === "1d") {
            width = chart.width / 5;
            x1 = that.labelWidth + 4 * width;
            x2 = x1 + width;
            lx = x1 - 5;
            rx = x2 - 5;
            bindex = 4;
            eindex = 5;
          } else if (period === "5d") {
            x1 = that.labelWidth;
            width = chart.width;
            lx = x1 - 5;
            rx = x1 + width - 5;
            bindex = 0;
            eindex = 5;
          } 
          that.dragRect.attr({
            x: x1, 
            width: width
          });
          that.dragLeft.attr({
            x: lx
          });
          that.dragRight.attr({
            x: rx
          });
          that.drawThumbnail();
          that.drawChartByDragBar(bindex, eindex);
        } else if (period === "1m" || period === "6m") {
          zoom(568);
          // 变换各个层的位置 
          that.changeHtmlByPeriod(period);

          that.period = period; 
          that.ctype = "day";

          that.getData("6m", function() {
            that.current = that.data["6m"];

            var count = that.current.current.length;
            that.howmany = period === "1m" ? 30 : count;
            that.begin = count - that.howmany;
            that.end = count;

            if (that.begin < 0) {
              that.begin = 0;
            }

            if (that.isCompare) {
              that.compareStock();
              that.drawThumbnail();
            } else {
              that.paper.clear();
              that.drawBase();
              that.drawChart();
            }
          });
          that.drawThumbnail();
        } else if (period === "1y" || period === "3y" || period === "all") {
          zoom(568);
          // 变换各个层的位置 
          that.changeHtmlByPeriod(period);

          that.ctype = "day";
          var bts,
            yearTs = 365 * 24 * 60 * 60 * 1000,
            now = Date.now();

          that.getData("all", function () {
            that.period = period;
            if (period === "1y") {
              bts = now - yearTs;
            } else if (period === "3y") {
              bts = now - 3 * yearTs;
            } else if (period === "all") {
              bts = that.data["all"].ts[0];
            }

            that.current = that.data["all"];
            that.begin = SNB.chartUtil.getIndexByTs(that.current.ts, bts);
            that.end = that.current.current.length;
            that.howmany = that.end - that.begin;

            if (that.isCompare) {
              that.compareStock();
              that.drawThumbnail();
            } else {
              that.paper.clear();
              that.drawBase();
              that.drawChart();
              that.drawThumbnail();
            }
          });
        } else if (_.indexOf(["nw-1m", "nw-6m", "nw-1y", "nw-3y", "nw-all"], period) > -1) {
          zoom(568);
          that.changeHtmlByPeriod(period);
          that.ctype = "net-worth";
          that.period = period.replace("nw-", "");
          that.paper.clear();
          that.drawNetWorthBase();
          that.getNetWorthData(that.period, function () {
            that.current = that.data[period];
            var count = that.current.current.length;
            that.begin = 0;
            that.end = count;
            that.howmany = that.end - that.begin;
            that.drawNetWorthChart();
            that.drawThumbnail();
          });
          //that.drawChart();
        } else {
          zoom(568);
          that.ctype = "kline";
          that.period = period;
          
          that.getData(period, function() {
            // 变换各个层的位置 
            that.changeHtmlByPeriod(period);

            that.current = that.data[that.period][that.ktype];
            var count = that.current.ohlcma.length,
              points = that.isFullScreen ? 160: 70;

            that.begin = count - points;
            that.end = count;
            that.howmany = that.end - that.begin;

            if (that.begin < 0) {
              that.begin = 0;
              that.howmany = count;
              that.end = that.begin + that.howmany; 
            } else if (that.end > count) {
              that.end = count;
              that.begin = that.end - that.howmany;
            }

            that.paper.clear();
            that.drawBase();
            that.drawChart();
            that.drawThumbnail();
          });
        }

        return false;
      });

      // 鼠标滑动到type-list上上面  显示复权列表
      this.wrapper.find(".type-list > li").hover(function (e) {
        var period = $(this).data("period"),
          $fuquan = $(this).find(".fuquan");

        if (period !== "1d") {
          $fuquan.show();
          $fuquan.data("show", true);
        }
        return false;
      
      }, function (e) {
        var $fuquan = $(this).find(".fuquan");

        $fuquan.data("show", false);
        setTimeout(function () {
          if (!$fuquan.data("show")) {
            $fuquan.hide();
          }
        }, 200);
        return false;
      });

      // 复权list的鼠标移动事件
      this.wrapper.find(".fuquan").hover(function (e) {
        $(this).data("show", true);
        return false;
      }, function (e) {
        var $fuquan = $(this);

        $fuquan.data("show", false);
        setTimeout(function () {
          if (!$fuquan.data("show")) {
            $fuquan.hide();
          }
        }, 200);
        return false;
      });

      // 点击复权
      this.wrapper.on("click", ".fuquan li", function (e) {
        that.ktype = $(this).data("fuquan");

        var $period = $(this).parent().parent();
        $period.trigger("click");
        //同步偏好设置复权选项
        SNB.Util.saveConfig({
          klineFuquan: that.ktype
        });
        return false;
      });

      // 显示讨论
      this.wrapper.on("click", ".show-status", function (e) {
        var $el = $(this);

        if ($el.hasClass("disabled")) {
          return false;
        }

        that.paper.clear();
        that.opaper.clear();
        that.drawBase();

        if (that.isShowStatus) {
          that.isShowStatus = false;
          $el.find("a").text("显示讨论");
          that.wrapper.find(".filter-status").hide();
          that.wrapper.find(".tt").remove();
          that.drawChart();
        } else {
          that.isShowStatus = true;
          $el.find("a").text("隐藏讨论");
          that.wrapper.find(".filter-status").show();
          that.drawChart();
        }

        return false;
      });

      // 显示过滤选项
      this.wrapper.on("click", ".filter-status", function (e) {
        var $filter = that.wrapper.find(".status-filter"),
          wrapperOffset = that.wrapper.offset(),
          thisOffset = $(this).offset(),
          left = thisOffset.left - wrapperOffset.left;

        $filter.css("left", left);

        if ($filter.is(":visible")) {
          $filter.hide("fast");
        } else {
          $filter.show("fast");
        }
        return false;
      });

      // 选择过滤项
      this.wrapper.on("change", ".status-filter input[type='radio']", function (e) {
        var $this = $(this);
        if ($this.is(":checked")) {
          var source = this.id.replace("filter-", "");
          if (source === "search") {

          } else {
            if (source === "myself") {
              that.filterStatusOptions = {
                uid: SNB.currentUser.id
              };
            } else {
              that.filterStatusOptions = {
                source: source
              };
            }

            that.paper.clear();
            that.opaper.clear();
            that.drawBase();
            that.drawChart();
          }
        }
      });

      // 过滤讨论搜索框focus 前面radio checked
      this.wrapper.on("focus", ".search-user-input", function (e) {
        $(this).prev().attr("checked", "checked");
      });

      // 搜索时候键盘事件
      var qsl_index = 0;

      function searchStatus() {
        var $dropdown = that.wrapper.find(".dropdown-menu"),
          $el = $dropdown.find("a.active"),
          name = $el.data("sname"),
          id = $el.data("id");

        if (id) {
          that.filterStatusOptions = {
            uid: id
          };
        } else {
          that.filterStatusOptions = {
            q: name
          }
        }
        that.wrapper.find(".search-user-input").val(name);
        $dropdown.hide();

        that.paper.clear();
        that.opaper.clear();
        that.drawBase();
        that.drawChart();
      }
      this.wrapper.on("keyup", ".search-user-input", function (e) {
        var $dropdown = that.wrapper.find(".dropdown-menu"),
          $this = $(this),
          val = $.trim($this.val()),
          Links = $dropdown.find("a"),
          toggleCurrent = function (index) {
            $dropdown.find("a.active").removeClass("active");
            Links.eq(index).addClass("active");
          };

        if (e.keyCode === 38) {
          if (qsl_index === -1) {
            qsl_index = Links.length - 1;
          } else {
            qsl_index --;
          }
          toggleCurrent(qsl_index);
          return false;
        } else if (e.keyCode === 40) {
          if (qsl_index >= Links.length - 1) {
            qsl_index = -1;
          }
          qsl_index++;
          toggleCurrent(qsl_index);
          return false;
        } else if (e.keyCode ===  13) {
          searchStatus();
          return false;
        }

        qsl_index = 0;
        if (val) {
          $dropdown.find("strong").html(val);
          $dropdown
            .find(".search-status")
            .html('<li><a href="#" data-sname="' + val + '">' + val + '</a></li>');

          SNB.get("/users/search.json", {q: val, page: 1, count: 5}, function (data) {
            var searchUserHtml = "";
            _.each(data.users, function (user, index) {
              var screen_name = user.screen_name,
                id = user.id,
                cclass = "";

              if (screen_name) {
                screen_name = screen_name.replace(/<span class='highlight'>(.+?)<\/span>/ig, "$1")
              }

              if (!index) {
                cclass = ' class="active"';
              }
              searchUserHtml += '<li><a href="#" data-id="' + id + '" data-sname="' + screen_name + '"' + cclass + '>' + screen_name + '</a></li>';
            });

            if (!searchUserHtml) {
              searchUserHtml = '<li class="noUser">没有找到用户</li>';
              $dropdown.find(".search-status li a").addClass("active");
            }
            $dropdown.find(".search-user").html(searchUserHtml);

            $dropdown.show();
          })
        } else {
          $dropdown.hide();
        }
        return false;
      });

      // 鼠标点击筛选出来的用户列表
      this.wrapper.on("click", ".dropdown-menu a", function (e) {
        var $dropdown = that.wrapper.find(".dropdown-menu");

        $dropdown.find("a").removeClass("active");
        $(this).addClass("active");
        searchStatus();
      });

      // 关闭筛选讨论
      this.wrapper.on("click", ".close-filter", function (e) {
        that.wrapper.find(".status-filter").slideUp("fast");
      });


      // 显示对比
      this.wrapper.on("click", ".show-compare", function (e) {
        var $compare = that.wrapper.find(".stock-compare"),
          wrapperOffset = that.wrapper.offset(),
          thisOffset = $(this).offset(),
          left = thisOffset.left - wrapperOffset.left;

        $compare.css("left", left);

        if ($compare.is(":visible")) {
          $compare.hide("fast");
        } else {
          $compare.show("fast");
        }
        return false;
      });

      // 选择对比股票
      this.wrapper.on("change", ".compare-stocks input", function (e) {
        var symbol = $(this).data("symbol");
        if ($(this).is(":checked")) {
          that.isCompare = true;
          that.compareStock(symbol);
        } else {

          delete that.compareData[symbol];

          if (_.keys(that.compareData).length > 1) {
            that.compareStock();
          } else {
            that.isCompare = false;
            that.paper.clear();
            that.drawBase();
            that.drawChart();

            that.wrapper.find(".show-status").removeClass("disabled");
          }
        }
      });

      // 选取对比股票
      SNB.Util.autoCompleteSearchStock(this.wrapper.find(".search-stock-input"), function (symbol, name) {
        if (symbol === that.symbol) {
          return false;
        }

        var symbols = [];
        that.wrapper.find(".compare-stocks label input").each(function () {
          symbols.push($(this).data("symbol"));
        });

        if (_.indexOf(symbols, symbol) > -1) {
          that.wrapper.find("#stock_" + symbol).attr("checked", "checked");
        } else {
          var id = "stock_" + symbol;

          if (that.isFullScreen) {
            id += "_fs";
          }
          var html = ' '
            + '<label for="' + id+ '" class="compareListLabel">'
            + '<input type="checkbox" checked data-symbol="' + symbol + '" id="' + id + '">'
            + '<span>' + name + '</span>'
            + '</label>';

          that.wrapper.find(".compare-stocks").append(html);
        }

        that.isCompare = true;
        that.symbolNames[symbol] = name;
        that.compareStock(symbol);
      });

      // 关闭对比按钮
      this.wrapper.on("click", ".close-compare", function (e) {
        that.wrapper.find(".stock-compare").slideUp("fast");
      });

      // k线偏好设置
      this.wrapper.on("click", ".kline-config", function (e) {
        var dialog = that.klineConfigDialog();
        dialog.dialog({
          modal: true,
          title: "K线图偏好设置",
          width:450,
          close: function () {
            $(".klineMaColorPicker").hide();
          }
        });
        return false;
      });

      // 全屏
      this.wrapper.on("click", ".enter-fs", function () {
        var $body = $("body");
        $body.addClass("editor-mode-stock");

        var html = ' '
          + '<div class="stockChart fs">'
            + '<div id="newChart-fs"></div>'
            + '<div id="overlay-klineIndex-fs"></div>'
            + '<div id="overlay-chart-fs"></div>'
            + '<div id="overlay-dragbar-fs"></div>'
            + '<div id="overlay-loading-fs"></div>'
            + '<div id="overlay-status-fs"></div>'
            + '<div id="overlay-event-fs"></div>'
          + '</div>';

        $body.append(html);

        $(".fs").css({
          margin: "30px auto",
          width: "95%"
        });

        var options = {
          container: "newChart-fs",
          dragbarOverlay: "overlay-dragbar-fs",
          overlay: "overlay-chart-fs",
          eventOverlay: "overlay-event-fs",
          klineIndexOverlay: "overlay-klineIndex-fs",
          loadingOverlay: "overlay-loading-fs",
          statusOverlay: "overlay-status-fs",
          wrapper: ".fs",//jq selector format
          symbol: that.symbol,
          isFullScreen: true
        };

        var widthRate = 0.95,
          currentHeightRate = 200 / 330,
          volumeHeightRate = 60 / 330,
          heightRate = 0.90,//85%的高度
          width = $(window).width() * widthRate,
          height = $(window).height() * heightRate;

        options.width = width;
        options.height = height;

        options.chart = {
          currentHeight: height * currentHeightRate,
          volumeHeight: 80,
          bottomHeight: 80,
          indexHeight: 80
        };

        options.data = SNB.chart.data;
        options.kdata = SNB.chart.kdata;
        options.compareData = SNB.chart.compareData;
        options.current = SNB.chart.current;
        options.symbolNames = SNB.chart.symbolNames;
        options.stockName = SNB.chart.symbolNames[SNB.chart.symbol];
        options.period = SNB.chart.period;
        options.ctype = SNB.chart.ctype;
        options.ktype = SNB.chart.ktype;
        options.isCompare = SNB.chart.isCompare;
        options.labelWidth = 70;

        options.fromChart = SNB.chart;

        options.isShowStatus = SNB.chart.isShowStatus;

        options.quote = SNB.chart.quote;

        options.begin = SNB.chart.begin;
        options.end = SNB.chart.end;
        options.howmany = SNB.chart.howmany;

        new SNB.stockChart(options);

        return false;
      });

      // 双击 全屏
      this.eventOverlay.on("dblclick", function (e) {
        if (!that.isFullScreen) {
          that.wrapper.find(".enter-fs").trigger("click");
        } else {
          that.wrapper.find(".exit-fs").trigger("click");
        }
      });

      // 退出全屏
      this.wrapper.on("click", ".exit-fs", function () {
        $(".fs").remove();
        $("body").removeClass("editor-mode-stock");

        // 更新下原图tab
        if (that.fromChart) {
          var period = that.period;

          if (that.ctype === "day") {
            that
              .fromChart
              .wrapper
              .find(".type-list > li")
              .removeClass("select")
              .end()
              .find(".type-list li[data-period='1d']")
              .addClass("select");

            that
              .fromChart
              .wrapper
              .find(".period li[data-period='" + period + "']")
              .trigger("click");
          } else if (that.ctype === "net-worth") {
            that
              .fromChart
              .wrapper
              .find(".type-list li[data-period='nw-" + period + "']")
              .trigger("click");
          } else {
            that
              .fromChart
              .wrapper
              .find(".type-list li[data-period='" + period + "']")
              .trigger("click");
          }
        }
      });

      // 屏幕截图
      $(".screenshot").on("click", "input", function (e) {
        $.post("/chart/screenshot", {
          html: that.wrapper.html()
        }, function(ret) {
          var str = "data:image/jpg;base64," + ret;

          $.post("/photo/base64_upload.json", {
            base64_str: str
          }, function(ret) {
            var img = ret.url + "/" + ret.filename + "!custom.jpg",
              status = '<img class="ke_img" src="' + img + '"/>';

            SNB.post("/statuses/update.json", {
              status: "test" + status
            }, function(ret) {
              alert("分享成功");
            });
          });
        });
      });
    }  
  };

  _.extend(SNB.stockChart.prototype, obj);
});
;
/*
 *kline 相关
 */

define('pages/invest/chart/TSNB.chart.kline.js', [], function (require, exports, module) {  function fixCoord(coord) {
    return Math.floor(coord) + 0.5;
  }

  //需要截取小数后2位
  var toFixedLength = 2 ;

  if(SNB.data && SNB.data.quote && SNB.data.quote.type){
    var type = parseInt(SNB.data.quote.type);
    if(type === 25){
      //期权截取小数后4位
      toFixedLength = 4;
    }else if(type === 32 || type ===13){
      //港股涡轮、基金截取小数后3位
      toFixedLength = 3;
    }
  }

  var klinePeriod = ["1month", "1day", "1week"],
    stockPeriod = ["1d", "5d", "1m", "6m", "1y", "3y", "all"],
    MAArray = ["ma5", "ma10", "ma20", "ma30"];

  var noFuQuanSymbols = ["SH000001", "SZ399001", "SZ399006"];

  var klineObj = {
    wrapDataForKlineChart: function (data) {
      var obj = this.kdata[this.period] && this.kdata[this.period][this.ktype];

      // 分段取 k线
      if (obj) {
        if (data.chartlist && data.chartlist.length) {
          data.chartlist = data.chartlist.concat(obj.data.chartlist);
        } else {
          data.chartlist = obj.data.chartlist;
        }

        obj.status = "all";
      } else {
        obj = {
          "status": "half",
          "data": data
        };

        this.kdata[this.period] = {};
        this.kdata[this.period][this.ktype] = obj;
      }

      var ts = [],
        ohlcma = [],
        chg = [],
        vol = [],
        p = [],
        ma = [],
        macd = [],
        t = [];

      _.each(data.chartlist, function (item, i) {
        ts[i] = Date.parse(item.time);
        ohlcma[i] = [
          item.open,
          item.high,
          item.low,
          item.close,
          item.ma5,
          item.ma10,
          item.ma20,
          item.ma30
        ];
        macd[i] = [
          item.dif,
          item.dea,
          item.macd
        ];

        vol[i] = item.volume;
        p[i] = item.percent;
        chg[i] = item.chg;
        t[i] = item.turnrate;
      });

      if (!this.data[this.period]) {
        this.data[this.period] = {};
      }

      this.data[this.period][this.ktype] = this.current = {
        ts: ts,
        ohlcma: ohlcma,
        vol: vol,
        p: p,
        macd: macd,
        chg: chg,
        t: t
      };

      if (this.bts && this.ets) {
        var indexArray = SNB.chartUtil.getIndexByTs(this.current.ts, this.bts, this.ets);

        this.begin = indexArray[0];
        this.end = indexArray[1] + 1;
        this.howmany = this.end - this.begin;

        this.bts = undefined;
        this.ets = undefined;
      }
    },

    // draw kline
    drawKlineChart: function() {
      this.opaper.clear();

      var that = this,
        chart = this.chart;

      var ts = this.current.ts.slice(this.begin, this.end),
        ohlcma = this.current.ohlcma.slice(this.begin, this.end),
        vol = this.current.vol.slice(this.begin, this.end),
        p = this.current.p.slice(this.begin, this.end),
        chg = this.current.chg.slice(this.begin, this.end),
        macd = this.current.macd.slice(this.begin, this.end),
        t = this.current.t.slice(this.begin, this.end);

      this.showCurrent = {
        ts: ts,
        ohlcma: ohlcma,
        vol: vol,
        p: p,
        macd: macd,
        chg: chg,
        t: t
      };

      that.drawSplitLine(ohlcma, vol, 0.2);

      var perWidth = chart.width / that.howmany,
        timeCount = Math.round(that.howmany / 5);

      if (that.isFullScreen) {
        if (perWidth > 50) {
          perWidth = 30;
          timeCount = that.howmany / 3;
        }
      } else {
        if (perWidth > 20) {
          perWidth = 14;
          timeCount = that.howmany / 2;
        }
      }

      var candleWidth = perWidth * 0.6,
        cy = chart.cy,
        vy = chart.vy,
        cscale = chart.cscale,
        vscale = chart.vscale,
        cymin = chart.cymin,
        cmin = chart.cmin,
        cmax = chart.cmax,
        i = 0,
        ma5PathArray = ["M"],
        ma10PathArray = ["M"],
        ma20PathArray = ["M"],
        ma30PathArray = ["M"];

      this.chart.perWidth = perWidth;
      this.chart.candleWidth = candleWidth;

      this.chart.isDrawingKline = true;
      this.chart.klineIndex = 0;

      var isDrawMax = false,
        isDrawMin = false;

      for(; i < that.howmany; i++) {
        var array = ohlcma[i],
          volume = vol[i];

        if (!array) {
          break;
        }

        var yop = cy - (array[0] - cymin) * cscale,
          yhi = cy - (array[1] - cymin) * cscale,
          ylo = cy - (array[2] - cymin) * cscale,
          ycl = cy - (array[3] - cymin) * cscale,
          yma5 = cy - (array[4] - cymin) * cscale,
          yma10 = cy - (array[5] - cymin) * cscale,
          yma20 = cy - (array[6] - cymin) * cscale,
          yma30 = cy - (array[7] - cymin) * cscale,
          yvol = vy - volume * vscale;

        // 矩形开始x
        var xlo = i * perWidth + perWidth * 0.2 + this.labelWidth;

        // 矩形中心x  用来画中心线
        var xline = xlo + candleWidth / 2;

        var num = yop - ycl;
        if (num === 0) {
          num = p[i];
        }
        var color = this.getUpDownColor(num);

        // attr 的顺序很重要。。。
        var height = Math.abs(ycl - yop);

        var currentTs = ts[i],
          timeStr = SNB.chartUtil.formatTime(currentTs);

        if (i % timeCount === 0) {
          this.drawSplitTime(xline, timeStr);
        }

        // draw max min
        if (array[1] === cmax && !isDrawMax) {
          that.drawKlineMaxMin(xline, yhi, array[1], timeStr);
          isDrawMax = true;
        }

        if (array[2] === cmin && !isDrawMin) {
          that.drawKlineMaxMin(xline, ylo, array[2], timeStr);
          isDrawMin = true;
        }

        (function(height, ycl, yop, yhi, ylo, yvol, color, xlo, xline, period){
          setTimeout(function() {
            if (that.ctype !== "kline" || period !== that.period) {
              return false;
            }
            that.chart.klineIndex++;

            if (height) {
              var y = Math.min(ycl, yop);
              that.paper.rect(fixCoord(xlo), fixCoord(y), candleWidth, Math.abs(ycl - yop))
                .attr({
                  "stroke-width": "1px",
                  "stroke": color,
                  "fill": color
                });
            } else {
              that.paper.path([
                "M",
                fixCoord(xlo),
                fixCoord(yop),
                "L",
                fixCoord(xlo + candleWidth),
                fixCoord(yop)
              ]).attr({
                "stroke": color
              });
            }


            // 最高最低
            that.paper.path([
              "M",
              fixCoord(xline),
              fixCoord(yhi),
              "L",
              fixCoord(xline),
              fixCoord(ylo)
            ]).attr({
              "stroke": color
            });

            // 成交量
            that.paper.rect(fixCoord(xlo), fixCoord(yvol), candleWidth, (vy - yvol))
              .attr({
                "stroke-width": "1px",
                "stroke": color,
                "fill": color
              });

            if (that.chart.klineIndex === that.howmany - 1) {
              that.chart.isDrawingKline = false;
            }
          }, 0);
        })(height, ycl, yop, yhi, ylo, yvol, color, xlo, xline, that.period);

        if (i) {
          ma5PathArray.push("L");
          ma10PathArray.push("L");
          ma20PathArray.push("L");
          ma30PathArray.push("L");
        }
        ma5PathArray.push(fixCoord(xline), fixCoord(yma5));
        ma10PathArray.push(fixCoord(xline), fixCoord(yma10));
        ma20PathArray.push(fixCoord(xline), fixCoord(yma20));
        ma30PathArray.push(fixCoord(xline), fixCoord(yma30));

      }

      if (this.showMA) {
        var array = [ma5PathArray, ma10PathArray, ma20PathArray, ma30PathArray];

        _.each(MAArray, function(ma, index) {
          if (that.maShowInfo[ma].show == "1") {
            that.paper.path(array[index]).attr({
              "stroke": that.maShowInfo[ma].color
            });
          }
        });
      }

      this.drawKlineIndex();
      this.showKlineStateInfo(ohlcma.length - 1);
      this.wrapper.find(".currentStockInfo").hide();
    },

    // k线技术指标tab
    drawKlineIndex: function (indexName) {
      var that = this;
      this.klineIndexPaper.clear();

      if (_.isUndefined(indexName)) {
        indexName = this.klineIndex;;
      }

      var klineIndexs = ["MACD", "KDJ", "BOLL", "PSY", "OBV", "RSI", "WVAD", "CCI"],
        x = that.labelWidth,
        y = that.chart.vy + 1,
        rectWidth = 40,
        rectHeight = 15;


      if (this.chart.indexButtonHeight) {
        _.each(klineIndexs, function(name) {
          var attr = {
            "stroke-width": "1px",
            "stroke": "#eee",
            "fill": "#f0f0f0"
          };
          if (name === indexName) {
            attr.fill = "#ccc";
          }

          var rect = that.klineIndexPaper.rect(x, y, rectWidth, rectHeight).attr(attr);
          var text = that.klineIndexPaper.text(x + rectWidth / 2, y + 7, name)
              .attr(that.theme.valueText)
              .attr({"text-anchor": "middle"});

          rect.click(function(e) {
            that.drawKlineIndex(name);
            that.klineIndex = name;
          });
          text.click(function(e) {
            that.drawKlineIndex(name);
            that.klineIndex = name;
          });

          x += rectWidth;
        });
      }

      x = fixCoord(that.labelWidth);
      y = fixCoord(that.chart.iby);

      this.klineIndexPaper.rect(x, y, that.chart.width - 1, that.chart.indexHeight)
        .attr(this.theme.currentRect);

      this.drawKlineIndexLine(indexName);
    },

    // 具体技术指标
    drawKlineIndexLine: function(indexName) {
      switch(indexName) {
        case "MACD":
          this.drawKlineMACD();
          break;
      };
    },

    // 画k线的最大最小值
    drawKlineMaxMin: function (x, y, num, time) {
      var textX,
        rectX,
        lineWidth = 10,
        lineX,
        padding = 3,
        rectWidth,
        rectHeight = 16,
        textAttr = "rightText",
        chart = this.chart;

      if ( x > this.labelWidth + chart.width - 50 ) {
        textX = x - (lineWidth + padding);
        lineX = x - lineWidth;
        textAttr = "leftText";
      } else {
        textX = x + (lineWidth + padding);
        lineX = x + lineWidth;
      }

      // 横线
      this.paper.path([
        "M",
        fixCoord(x),
        fixCoord(y),
        "L",
        fixCoord(lineX),
        fixCoord(y)
      ]);

      // 文字
      var txt = this.paper.text(textX, y, num.toFixed(toFixedLength)).attr(this.theme[textAttr]),
        txtWidth = txt.getBBox().width;

      // 方框 根据文字长度来画矩形
      rectWidth = txtWidth + padding * 2;

      if ( x > this.labelWidth + chart.width - 50 ) {
        rectX = x - lineWidth - rectWidth;
      } else {
        rectX = x + lineWidth;
      }

      var rectY = y - rectHeight / 2;

      this.paper.rect(fixCoord(rectX), fixCoord(rectY), rectWidth, rectHeight).attr({
        "stroke": "#ccc",
        "stroke-width": "1px",
        "fill": "#f0f0f0"
      });

      txt.toFront();
    },

    // 到时候会有各种技术指标
    drawKlineMACD: function () {
      var chart = this.chart,
        ih = chart.indexHeight - 15, // 加了15 的 state高度
        iy = chart.iy,
        iby = chart.iby,
        that = this,
        startX = this.labelWidth,
        macd = this.showCurrent.macd,
        d = SNB.chartUtil.minMax2d(macd),
        min = d[0],
        max = d[1],
        maxABS = _.max([Math.abs(min), Math.abs(max)]),
        maxMacd = maxABS,
        minMacd = maxMacd * -1,
        macdScale = ih / (maxABS * 2);

      // 一个点的话  就不画线了
      if (macd.length <= 1) {
        return false;
      }

      this.macdScale = macdScale;
      this.minMacd = minMacd;

      this.klineIndexPaper.text(startX, iby, maxMacd.toFixed(2)).attr(this.theme.leftText);
      this.klineIndexPaper.text(startX, iy - 5, minMacd.toFixed(2)).attr(this.theme.leftText);

      var midY = iby + 15 + ih / 2;
      this.klineIndexPaper.path([
        "M",
        fixCoord(startX),
        fixCoord(midY),
        "L",
        fixCoord(startX + chart.width),
        fixCoord(midY)
      ]).attr(this.theme.dashedSplitLine);

      this.klineIndexPaper.text(startX, midY, "0").attr(this.theme.leftText);

      var i = 0,
        count = macd.length,
        difPathArray = ["M"],
        deaPathArray = ["M"],
        perWidth = that.chart.perWidth,
        x = that.labelWidth + perWidth / 2;

      for(; i < count; i++) {
        var ydif = iy - (macd[i][0] - minMacd) * macdScale,
          ydea = iy - (macd[i][1] - minMacd) * macdScale,
          ymacd = iy - (macd[i][2] - minMacd) * macdScale;

        if (i) {
          difPathArray.push("L");
          deaPathArray.push("L");
        }

        difPathArray.push(fixCoord(x), fixCoord(ydif));
        deaPathArray.push(fixCoord(x), fixCoord(ydea));

        var color = that.getUpDownColor(macd[i][2]);

        this.klineIndexPaper.path([
          "M",
          fixCoord(x),
          fixCoord(ymacd),
          "L",
          fixCoord(x),
          fixCoord(midY)
        ]).attr({
          "stroke": color,
          "stroke-width": "1px"
        });
        x += perWidth;
      }

      // 避免一个点的情况 [M, 1, 2] 画线报错
      if (difPathArray.length > 3) {
        this.klineIndexPaper.path(difPathArray)
          .attr(this.theme.dif);

        this.klineIndexPaper.path(deaPathArray)
          .attr(this.theme.dea);

      }

      return false;
    },

    // 鼠标hover事件
    showKlineCurrentInfo: function (index) {
      this.opaper.clear();

      if (!this.showCurrent.ohlcma) {
        return false;
      }

      var ohlcma = this.showCurrent.ohlcma[index],
        chart = this.chart,
        cymin = chart.cymin,
        cscale = chart.cscale,
        vscale = chart.vscale,
        cy = chart.cy,
        vy = chart.vy,
        iy = chart.iy;

      if (_.isUndefined(ohlcma)) {
        return false;
      }

      var current = ohlcma[3],
        volume = this.showCurrent.vol[index],
        ts = this.showCurrent.ts[index],
        x = this.labelWidth + index * chart.perWidth + chart.perWidth / 2;
        tsformat = "yyyy-MM-dd",
        ycurrent = cy - Math.round((current - cymin) * cscale),
        yvol = vy - volume * vscale;

      if (_.isUndefined(current)) {
        return false;
      }

      // 横线
      this.opaper.path([
        "M",
        fixCoord(this.labelWidth),
        fixCoord(ycurrent),
        "L",
        fixCoord(this.labelWidth + chart.width),
        fixCoord(ycurrent)
      ]).attr(this.theme.dashedSplitLine)
      .attr({
        "stroke": "#888"
      });

      // 竖线
      this.opaper.path([
        "M",
        fixCoord(x),
        fixCoord(chart.stateHeight),
        "L",
        fixCoord(x),
        fixCoord(vy)
      ]).attr(this.theme.dashedSplitLine)
      .attr({
        "stroke": "#888"
      });

      // 左侧边框
      //this.opaper.rect(0.5, fixCoord(ycurrent - 8), 44, 16).attr({
      //  "stroke": "#ccc",
      //  "fill": "#f0f0f0"
      //});
      //
      //this.opaper.text(this.labelWidth + 3, ycurrent, current).attr(this.theme.rightText);

      // 画时间
      var timeStr = SNB.chartUtil.formatTime(ts, tsformat),
        timeEl = this.opaper.text(fixCoord(x), fixCoord(cy + 10), timeStr).attr(this.theme.centerText),
        timeWidth = timeEl.getBBox().width,
        timeRectWidth = timeWidth + 10;

      this.opaper.rect(fixCoord(x - timeRectWidth / 2), fixCoord(cy + 2), timeRectWidth, 16).attr({
        "stroke": "#ccc",
        "fill": "#f0f0f0"
      });
      timeEl.toFront();
    },

    // 显示状态栏信息 
    showKlineStateInfo: function (index) {
      if (!this.showCurrent || !this.showCurrent.ohlcma) {
        return false;
      }

      var that = this,
        startX = this.labelWidth +  10,
        y = 10.5,
        chart = this.chart,
        ohlcma = this.showCurrent.ohlcma[index],
        volume = this.showCurrent.vol[index],
        ts = this.showCurrent.ts[index],
        percent = this.showCurrent.p[index],
        percentStr = percent + "%",
        ktypes = {
          "normal":"不复权",
          "before":"前复权",
          "after":"后复权"
        };

      if (percent > 0) {
        percentStr = "+" + percentStr;
      }

      if (_.isUndefined(ohlcma)) {
        return false;
      }

      var str = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd")
        + " 开：" + ohlcma[0].toFixed(toFixedLength)
        + " 高：" + ohlcma[1].toFixed(toFixedLength)
        + " 低：" + ohlcma[2].toFixed(toFixedLength)
        + " 收：" + ohlcma[3].toFixed(toFixedLength)
        + " 量：" + SNB.Util.decimal_2(volume)
        + " 幅：" + percentStr;

      var info = this.opaper.text(startX, y, str).attr(this.theme.titleText);
      startX += info.getBBox().width + 5;

      if ((this.stockInfo.bigType === "沪深" && _.indexOf(noFuQuanSymbols, this.symbol) === -1)
        || this.stockInfo.bigType == "美股") {
        var str = "(" + ktypes[this.ktype] + ")";

        that.opaper.text(startX, y, str).attr({
          fill: "#d20",
          "text-anchor": "start",
          "font-size":"12px"
        });
      }

      // draw ma
      startX = that.labelWidth + 10;
      y += 20;

      if (this.showMA) {

        _.each(MAArray, function(ma, index) {
          if (that.maShowInfo[ma].show == "1") {
            var str = ma.toUpperCase() + "：" + ohlcma[index + 4].toFixed(toFixedLength),
              maText = that.opaper.text(startX, y, str)
                          .attr(that.theme.titleText)
                          .attr("fill", that.maShowInfo[ma].color);

            startX += maText.getBBox().width + 10;
          }
        });
      }

      this.showKlineInfo(index);

      // 技术指标
      this.showKlineIndexInfo(index);
    },

    // 显示k线技术指标信息
    showKlineIndexInfo: function (index) {
      switch(this.klineIndex) {
        case "MACD":
          this.showKlineMacdInfo(index);
      }
    },

    // 显示macd
    showKlineMacdInfo: function (index) {
      var macd = this.showCurrent.macd[index];

      if (!macd) {
        return false;
      }

      var dif = macd[0],
        dea = macd[1],
        m = macd[2],
        chart = this.chart,
        iby = chart.iby,
        y = iby + 8,
        startX = this.labelWidth + 10,
        difStr = "DIF：" + dif.toFixed(2),
        deaStr = "DEA：" + dea.toFixed(2),
        mStr = "MACD：" + m.toFixed(2);

      if (this.indexSVGSet) {
        _.each(this.indexSVGSet, function (el) {
          el.remove();
        });
      }

      this.indexSVGSet = [];

      var difColor = this.theme.dif.stroke,
        deaColor = this.theme.dea.stroke,
        mColor = this.getUpDownColor(m);

      var difEl = this.klineIndexPaper.text(startX, y, difStr)
        .attr(this.theme.rightText)
        .attr({
          "fill": difColor
        });
      startX += difEl.getBBox().width;
      this.indexSVGSet.push(difEl);

      startX += 10;

      var deaEl = this.klineIndexPaper.text(startX, y, deaStr)
        .attr(this.theme.rightText)
        .attr({
          "fill": deaColor
        });
      startX += deaEl.getBBox().width;
      this.indexSVGSet.push(deaEl);

      startX += 10;

      var mEl = this.klineIndexPaper.text(startX, y, mStr)
        .attr(this.theme.rightText)
        .attr({
          "fill": mColor
        });
      this.indexSVGSet.push(mEl);

      // 标出点
      var minMacd = this.minMacd,
        macdScale = this.macdScale,
        iy = this.chart.iy,
        ydif = iy - (dif - minMacd) * macdScale,
        ydea = iy - (dea - minMacd) * macdScale,
        ymacd = iy - (m - minMacd) * macdScale,
        x = this.labelWidth + this.chart.perWidth / 2 + index * this.chart.perWidth;

      var difCircle = this.klineIndexPaper.circle(x, ydif, 2)
        .attr({
          "stroke": "none",
          "stroke-width": "0px",
          "fill": difColor
        });

      this.indexSVGSet.push(difCircle);

      var deaCircle = this.klineIndexPaper.circle(x, ydea, 2)
        .attr({
          "stroke": "none",
          "stroke-width": "0px",
          "fill": deaColor
        });

      this.indexSVGSet.push(deaCircle);

      var mCircle = this.klineIndexPaper.circle(x, ymacd, 2)
        .attr({
          "stroke": "none",
          "stroke-width": "0px",
          "fill": mColor
        });

      this.indexSVGSet.push(mCircle);
    },

    // 显示k线信息浮层
    showKlineInfo: function(index) {
      var ohlcma = this.showCurrent.ohlcma[index],
        volume = this.showCurrent.vol[index],
        ts = this.showCurrent.ts[index],
        chg = this.showCurrent.chg[index],
        t = this.showCurrent.t[index],
        turnrateStr = t.toFixed(2) + "%",
        percent = this.showCurrent.p[index],
        percentStr = percent + "%",
        lastPoint,
        lastClose,
        that = this;

      if (index > 0) {
        lastPoint = this.showCurrent.ohlcma[index - 1];
      } else {
        var i = 0;
        if (this.start > 0) {
          i = this.start - 1;
        }
        lastPoint = this.current.ohlcma[i];
      }

      lastClose = lastPoint[3];

      var html = ' '
        + '<p class="currentStock-time">'
          + SNB.chartUtil.formatTime(ts, "yyyy-MM-dd")
        + '</p>'
        + '<table>'
          + '<tr>'
            + '<td>开盘价</td>'
            + '<td class="currentStockInfo-td">'
              + '<span style="color:' + this.getUpDownColor(ohlcma[0] - lastClose) + '">'
                + ohlcma[0].toFixed(toFixedLength)
              + '</span>'
            +'</td>'
          + '</tr>'
          + '<tr>'
            + '<td>最高价</td>'
            + '<td class="currentStockInfo-td">'
              + '<span style="color:' + this.getUpDownColor(ohlcma[1] - lastClose) + '">'
                + ohlcma[1].toFixed(toFixedLength)
              + '</span>'
            +'</td>'
          + '</tr>'
          + '<tr>'
            + '<td>最低价</td>'
            + '<td class="currentStockInfo-td">'
              + '<span style="color:' + this.getUpDownColor(ohlcma[2] - lastClose) + '">'
                + ohlcma[2].toFixed(toFixedLength)
              + '</span>'
            +'</td>'
          + '</tr>'
          + '<tr>'
            + '<td>收盘价</td>'
            + '<td class="currentStockInfo-td">'
              + '<span style="color:' + this.getUpDownColor(ohlcma[3] - lastClose) + '">'
                + ohlcma[3].toFixed(toFixedLength)
              + '</span>'
            +'</td>'
          + '</tr>'
          + '<tr>'
            + '<td>涨跌额</td>'
            + '<td class="currentStockInfo-td">'
              + '<span style="color:' + this.getUpDownColor(chg) + '">'
                + chg.toFixed(toFixedLength)
              + '</span>'
            +'</td>'
          + '</tr>'
          + '<tr>'
            + '<td>涨跌幅</td>'
            + '<td class="currentStockInfo-td">'
              + '<span style="color:' + this.getUpDownColor(chg) + '">'
                + percentStr
              + '</span>'
            +'</td>'
          + '</tr>'
          + '<tr>'
            + '<td>成交量</td>'
            + '<td class="currentStockInfo-td">'
              + '<span class="currentStock-volume">' + SNB.chartUtil.decimal_2(volume) + '</span>'
            +'</td>'
          + '</tr>'
          + '<tr>'
            + '<td>换手率</td>'
            + '<td class="currentStockInfo-td">'
              + '<span class="currentStock-volume">' + turnrateStr + '</span>'
            +'</td>'
          + '</tr>';

      var $container = this.wrapper.find(".currentStockInfo"),
        x = this.chart.perWidth * index;

      if (x < 140) {
        $container.removeClass("left");
        $container.addClass("right");
      } else if( x > this.chart.width - 140) {
        $container.removeClass("right");
        $container.addClass("left");
      }
      $container.html(html).show();
    },

    // k线偏好设置
    klineConfigDialog: function () {
      var that = this;

      if (!$(".dialog-klineConfig").length) {
        var dialogHtml = ' '
          + '<div class="dialog-klineConfig" class="dialog-wrapper">'
            + '<form style="margin-top:10px;">'
              + '<h2>显示均线：</h2>'
              + '<p>'
                + '<label><input type="radio" name="showMA" id="showMAYes" value="1"/>显示</label>'
                + '<label><input type="radio" name="showMA" id="showMANo" value="0"/>不显示</label>'
              + '</p>'
              + '<h2>均线颜色：</h2>'
              + '<p class="maColorConfig">'
                + '<label id="ma5Color">'
                  + '<input type="checkbox" value="ma5" checked/>'
                  + 'MA5'
                  + '<span class="MAColor" data-color="cd4343"></span>'
                + '</label>'
                + '<label id="ma10Color">'
                  + '<input type="checkbox" value="ma10" checked/>'
                  + 'MA10'
                  + '<span class="MAColor" data-color="8C3037"></span>'
                + '</label>'
                + '<label id="ma20Color">'
                  + '<input type="checkbox" value="ma20" checked/>'
                  + 'MA20'
                  + '<span class="MAColor" data-color="FFCA53"></span>'
                + '</label>'
                + '<label id="ma30Color">'
                  + '<input type="checkbox" value="ma30" checked/>'
                  + 'MA30'
                  + '<span class="MAColor" data-color="0055A2"></span>'
                + '</label>'
              + '</p>'
              + '<h2>沪深默认复权：</h2>'
              + '<p>'
                + '<label><input type="radio" name="fuquan" value="normal" id="normalFuquan"/>不复权</label>'
                + '<label><input type="radio" name="fuquan" value="before" id="beforeFuquan"/>前复权</label>'
                + '<label><input type="radio" name="fuquan" value="after" id="afterFuquan"/>后复权</label>'
              + '</p>'
              +' <div class="dialog-center" style="overflow:hidden;margin-top:10px;">'
                + ' <input type="submit" class="submit" value="确定" /> '
                + '<input type="button" class="cancel button" value="取消" /> '
              + '</div>'
            + '</form>'
          + '</div>';

        $("body").append(dialogHtml);

        $(".dialog-klineConfig").on("click", ".MAColor", function(e){
          if ( !$(".klineMaColorPicker").length ) {
            var pickerHtml = ' '
              + '<ul class="klineMaColorPicker">'
                + '<li style="background:#cd4343" data-color="cd4343"></li>'
                + '<li style="background:#8C3037" data-color="8C3037"></li>'
                + '<li style="background:#FFCA53" data-color="FFCA53"></li>'
                + '<li style="background:#0055A2" data-color="0055A2"></li>'
                + '<li style="background:#deefff" data-color="deefff"></li>'
                + '<li style="background:#fbdeeb" data-color="fbdeeb"></li>'
                + '<li style="background:#fff0d0" data-color="fff0d0"></li>'
                + '<li style="background:#e4e5ff" data-color="e4e5ff"></li>'
                + '<li style="background:#ffe4da" data-color="ffe4da"></li>'
                + '<li style="background:#f1ce67" data-color="f1ce67"></li>'
                + '<li style="background:#dd9475" data-color="dd9475"></li>'
                + '<li style="background:#e57b7e" data-color="e57b7e"></li>'
                + '<li style="background:#d3d2b6" data-color="d3d2b6"></li>'
                + '<li style="background:#fdefd0" data-color="fdefd0"></li>'
                + '<li style="background:#9f6fcb" data-color="9f6fcb"></li>'
                + '<li style="background:#55b4dd" data-color="55b4dd"></li>'
              + '</ul>';

            $("body").append(pickerHtml);

            $(".klineMaColorPicker").on("click", "li", function(e){
              $(".klineMaColorPicker")
                .data("eventSource")
                .data("color", $(this).data("color"))
                .css("background-color", "#" + $(this).data("color"));

              $(".klineMaColorPicker").hide();
            });
          }

          var offset = $(this).offset();
          $(".klineMaColorPicker")
            .css({
              left: offset.left,
              top: offset.top + 14
            })
            .data("eventSource", $(this))
            .toggle();

          return false;
        });

        $(".dialog-klineConfig").on("click", ".submit", function(e){
          var showMAConfig = $("input[name='showMA']:checked").val(),
            maFuquanConfig = $("input[name='fuquan']:checked").val(),
            maColorConfigArray = [],
            maColorConfig,
            kline = $(".dialog-klineConfig").data("kline");

          $(".maColorConfig label").each(function(){
            var ma = $(this).find("input").val(),
              show = $(this).find("input").is(":checked") ? "1" : "0",
              color = $(this).find("span").data("color");

            maColorConfigArray.push(show + "" + color);
            kline.maShowInfo[ma].show = (show != "0");
            kline.maShowInfo[ma].color = "#" + color;
          });
          maColorConfig = maColorConfigArray.join("-");

          SNB.Util.saveConfig({
            showKlineMa: showMAConfig,
            klineMaColor: maColorConfig,
            klineFuquan: maFuquanConfig
          });
          //修复chart复权lebel显示
          that.ktype = maFuquanConfig;

          $(".dialog-klineConfig").dialog("close");

          kline.showMA = (showMAConfig == "1");
          kline.paper.clear();
          kline.drawBase();
          kline.drawChart();
          kline.drawThumbnail();
          return false;
        });

        $(".dialog-klineConfig").on("click", ".cancel", function(e){
          $(".dialog-klineConfig").dialog("close");
        });
      }

      var $klineConfig = $(".dialog-klineConfig");
      $klineConfig.data("kline", this);

      SNB.Util.getConfig(["showKlineMa", "klineMaColor", "klineFuquan"], function(ret){
        if (ret && ret.length == 3) {

          var showMAConfig = ret[0],
            maColorConfig = ret[1],
            maFuquanConfig = ret[2];

          if ( showMAConfig ) {
            if (showMAConfig.value == "1") {
              $("#showMAYes").attr("checked", "checked");
            } else {
              $("#showMANo").attr("checked", "checked");
            }
          } else {
            $("#showMAYes").attr("checked", "checked");
          }

          // 格式  MA5-0-55a2c3*MA10-1-55a2c3
          // value字段 长度有限  只能存成055a2c3-155a2c3
          // 第一位是是否显示  后面是颜色
          if (maColorConfig) {
            var configArray = maColorConfig.value.split("-");

            _.each(configArray, function(configStr, index){
              var ma = MAArray[index],
                show = configStr.slice(0, 1),
                color = configStr.slice(1, 7),
                $label = $("#" + ma + "Color");

              if ( show == "1" ) {
                $label.find("input").attr("checked", "checked");
              } else {
                $label.find("input").removeAttr("checked");
              }

              $label.find("span").css({
                background: "#" + color,
                visibility: "visible"
              });
            });
          } else {
            $(".maColorConfig").find("span").css("visibility", "visible");
          }

          if ( maFuquanConfig ) {
            $("#" + maFuquanConfig.value + "Fuquan").attr("checked", "checked");
          } else {
            $("#normalFuquan").attr("checked", "checked");
          }
        }
      });
      return $(".dialog-klineConfig");
    }
  };

  if (SNB.stockChart) {
    _.extend(SNB.stockChart.prototype, klineObj);
  }
});
;
define('pages/invest/chart/TSNB.chart.networth.js', [], function (require, exports, module) {  function fixCoord(coord) {
    return Math.floor(coord) + 0.5;
  }

  var obj = {
    wrapDataForNetWorth: function (data, period) {
      var ts = [],
        current = [];

      _.each(data.fund, function(d, i){
        ts[i] = Date.parse(d.nav_date);
        current[i] = d.unit_nav;
      });

      this.data[period] = {
        ts: ts,
        current: current
      };

      this.current = this.data[period];
    },

    // 画图
    drawNetWorthChart: function () {
      this.opaper.clear();
      this.statusPaper.clear();
      var current = this.current.current.slice(this.begin, this.end),
        chart = this.chart,
        ts = this.current.ts.slice(this.begin, this.end),
        cy = chart.cy + chart.volumeHeight,
        that = this;

      /*
       *current = _.filter(current, function(a) {
       *  return a > 0;
       *});
       */

      // 只有一个点的情况 复制成2个点  成一条线
      if (current.length === 1) {
        current.push(current[0]);
        ts.push(ts[0]);
      }

      this.showCurrent = {
        current: current,
        ts: ts
      };

      var currentArray = current.slice();

      this.drawSplitLine(currentArray, undefined, 0.3, true);

      // draw chart
      // 1日或者5日图 的点数是固定的  所以用howmany
      // 月线和年线 的点数不固定 所以用当前数据长度
      var count = current.length,
        perWidth = chart.width / (count - 1),
        cymin = chart.cymin,
        cscale = chart.cscale,
        lastX;

      this.chart.perWidth = perWidth;

      var i = 0,
        lastTime,
        pathArray = ["M"],
        timeCount = Math.round(that.howmany / 5);

      for(; i < that.howmany; i++) {
        var c = current[i];

        if (_.isNumber(c)) {
          var ycurrent = cy - (c - cymin) * cscale,
            t = ts[i],
            time = SNB.chartUtil.formatTime(t, "MM-dd", that.is$),
            x = that.labelWidth + i * perWidth;

          // 0的话 就不画了
          if (c === 0) {
            continue;
          }

          pathArray.push(fixCoord(x), fixCoord(ycurrent));

          if (i) {
            pathArray.push("L");
          }

          // draw time split
          if (time !== lastTime) {
            if (i % timeCount === 0 && that.period !== "1d") {
              that.drawSplitTime(x, time, cy)
            }
          }

          lastX = x;
          lastTime = time;
        }
      }

      if (pathArray.length > 3) {
        this
          .paper
          .path(pathArray)
          .attr(this.theme.currentPath)
          .attr("stroke-width", "2px");
      }
      this.showNetWorthCurrentInfo(current.length - 1);
    },

    // 鼠标hover事件
    showNetWorthCurrentInfo: function(index) {
      this.opaper.clear();

      var that = this,
        chart = this.chart,
        cymin = chart.cymin,
        cscale = chart.cscale,
        cy = chart.cy + chart.volumeHeight,
        current = this.showCurrent.current[index],
        ts = this.showCurrent.ts[index],
        x = this.labelWidth + index * chart.perWidth,
        ycurrent = cy - Math.round((current - cymin) * cscale),
        tsFormat = "yyyy-MM-dd",
        isUSTime = false;

      if (_.isUndefined(current)) {
        return false;
      }

      this.opaper.circle(x, ycurrent, 5).attr({
        fill: "#2f84cc",
        "stroke-width": 0,
        "stroke": "none"
      });
    },

    // state 状态信息
    showNetWorthStateInfo: function (index) {
      if (index < 0 || _.isNaN(index)) {
        return false;
      }

      var startX = this.labelWidth +  10,
        y = 10.5;

      if (!this.showCurrent.current) {
        return false;
      }

      var current = this.showCurrent.current[index],
        ts = this.showCurrent.ts[index],
        str = "净值：",
        txt;

      if (_.isUndefined(current)) {
        return false;
      }

      current = current.toFixed(3);

      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.titleText);

      startX += txt.getBBox().width;

      str = current;
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.valueText);

      startX += txt.getBBox().width + 10;
      str = "时间：";
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.titleText);

      startX += txt.getBBox().width;
      str = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd", this.is$);
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.valueText);
    }
  };

  _.extend(SNB.stockChart.prototype, obj);
});
;
define('pages/invest/chart/TSNB.chart.status.js', [], function (require, exports, module) {  function fixCoord(coord) {
    return Math.floor(coord) + 0.5;   
  }

  var obj = {
    drawStatusChart: function () {
      this.opaper.clear();
      this.statusPaper.clear();

      var current = this.current.current.slice(this.begin, this.end),
        chart = this.chart,
        vol = this.current.vol.slice(this.begin, this.end),
        ts = this.current.ts.slice(this.begin, this.end),
        cy = chart.cy,
        vy = chart.vy,
        that = this;

      current = _.filter(current, function(a) {
        return a > 0; 
      });

      this.showCurrent = {
        current: current,
        vol: vol,
        ts: ts
      };

      var currentArray = current.slice();

      if (this.period == "1d") {
        currentArray.push(this.lastClose);
      }

      function getTimespanBySpecialHMS(ts, hms, is$) {
        var str = ts;
        if (_.isNumber(ts)) {
          str = new Date(ts).toString();
        }

        str = str.replace(/\d\d:\d\d:\d\d/, hms);
        return Date.parse(str);
      }

      var dayTimespan = 24 * 60 * 60 * 1000,
        now = Date.now(),
        firstTs = _.first(ts),
        lastTs = _.last(ts),
        days = Math.ceil((lastTs - firstTs) / dayTimespan),
        preTimeStr,
        preTs,
        preY,
        currentPathArray = ["M"],
        restPathArray = ["M"],
        todayEndTs = getTimespanBySpecialHMS(now, "23:59:59"),
        todayBeginTs = getTimespanBySpecialHMS(now, "00:00:00"),
        startTs = getTimespanBySpecialHMS(firstTs, "00:00:00"), 
        dayWidth = chart.width / days,
        restDayWidth = dayWidth / 2,
        tradeDayWidth = restDayWidth,
        startX = that.labelWidth,
        dayCounts = current.length,
        perWidth = tradeDayWidth / (dayCounts - 1),  
        periodType = "day",
        overOneDay = false;

      if (_.indexOf(["1d", "5d"], that.period) > -1) {
        periodType = "day";
      } else if (_.indexOf(["1m", "6m"], that.period) > -1) {
        periodType = "month";
      } else if (_.indexOf(["1y", "3y", "all"], that.period) > -1) {
        periodType = "year";
      }  

      that.showCurrent.x = [];
      that.showCurrent.y = [];

      if (that.is$) {
        var date = new Date(),
          hour = date.getHours();

        // 冬令时 时候还得调整
        if (hour < 12) {
          todayBeginTs = getTimespanBySpecialHMS(now - dayTimespan, "12:00:00");
          todayEndTs = getTimespanBySpecialHMS(now, "11:59:59");
        } else {
          todayBeginTs = getTimespanBySpecialHMS(now, "12:00:00");
          todayEndTs = getTimespanBySpecialHMS(now + dayTimespan, "11:59:59");
        }  
      }  

      if (periodType === "day") {
        
        // 默认状况下是1填
        dayCounts = that.getStockDayLineCount(that.stockInfo.bigType, "1d"),

        // 每个trade点之间的距离
        perWidth = tradeDayWidth / (dayCounts - 1);  

        preTs = todayBeginTs;
        preTimeStr = SNB.chartUtil.formatTime(preTs, that.is$);

        that.startTs = preTs;
        that.endTs = todayEndTs;
        that.chart.perWidth = perWidth;

        // 跨天情况 比如今天是周六 昨天有成交量
        if (firstTs < todayBeginTs) {
          if (that.period === "1d") {

            // 计算 从有成交量开始 到今天（包含）的总天数
            days = Math.ceil((todayBeginTs - firstTs) / dayTimespan) + 1;

            preTs = todayBeginTs -   (days - 1) * dayTimespan;
            preTimeStr = SNB.chartUtil.formatTime(preTs, that.is$);

            // 每一天的宽度
            dayWidth = chart.width / days;
            restDayWidth = dayWidth / 2;
            tradeDayWidth = restDayWidth;
            perWidth = tradeDayWidth / (dayCounts - 1);  

            that.chart.perWidth = perWidth;
            that.startTs = preTs;
            that.endTs = todayEndTs;

            overOneDay = true;

            drawChartWithStatus();
          } else {
            that.getData("5d", function() {

              preTs = firstTs;
              preTimeStr = SNB.chartUtil.formatTime(preTs, that.is$);

              days = Math.round((todayEndTs - firstTs) / dayTimespan),
              dayWidth = chart.width / days;
              restDayWidth = dayWidth / 2;
              tradeDayWidth = restDayWidth;

              dayCounts = that.getStockDayLineCount(that.stockInfo.bigType, "5d") / 5;

              perWidth = tradeDayWidth / (dayCounts - 1);

              that.chart.perWidth = perWidth;
              that.startTs = preTs;
              that.endTs = todayEndTs;
              
              drawChartWithStatus();
            });
          }
        } else {
          drawChartWithStatus();
        }
      } else {
        days = Math.round((todayEndTs - firstTs) / dayTimespan);
        dayWidth = chart.width / days;
        perWidth = dayWidth;  

        if (periodType === "year") {
          days = current.length;
          dayWidth = chart.width / days;
          perWidth = dayWidth;  
        }

        that.startTs = firstTs;
        that.endTs = todayEndTs;
        that.chart.perWidth = perWidth;

        preTs = firstTs;
        preTimeStr = SNB.chartUtil.formatTime(preTs, "yyyy-MM-dd", that.is$);
        drawChartWithStatus();
      }  

      function drawChartWithStatus() {
        that.drawSplitLine(current, vol, 0.3);
        var restPart = {
          "沪深": [9.5 / 20, 1.5 / 20, 9 / 20],
          "基金": [9.5 / 20, 1.5 / 20, 9 / 20],
          "港股": [9.5 / 18.5, 1 / 18.5, 8 / 18.5],
          "美股": [9.5 / 17.5, 8 / 17.5]
        };

        var tss = ts,
          part = restPart[that.stockInfo.bigType],
          cymin = chart.cymin,
          cscale = chart.cscale,
          vscale = chart.vscale;

        _.each(current, function (c, i) {
          var ts = tss[i],
            timeStr = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd", that.is$),
            y = cy - Math.round((c - cymin) * cscale);

          if (timeStr !== preTimeStr) {

            // 按周画点的话 不包含虚线 单独处理
            if (periodType === "year") {
              startX += dayWidth;

              // 实线的点 move 到这里
              if (currentPathArray.length === 1) {
                currentPathArray.push(fixCoord(startX), fixCoord(y));
              } else {
                currentPathArray.push("L", fixCoord(startX), fixCoord(y));
              }

              var len = Math.round(current.length / 5);

              if (i % len === 0) {
                var str = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd", that.is$);
                that.drawSplitTime(startX, str);
              }

              if (that.showCurrent.x) {
                that.showCurrent.x[i] = startX;
                that.showCurrent.y[i] = y;
              }
              return false;
            }

            // 当前时间点 距离上个有成交量的点之间的天数
            // days === 0 说明是当天
            var days = Math.ceil((ts - preTs) / dayTimespan) - 1;
            
            // 大于1天的话  画整天的虚线
            // 相当于中间间隔了几天
            if (days) {
            
              // 先移到位置 开始画虚线
              if (restPathArray.length > 1) {
                restPathArray.push("M", fixCoord(startX), fixCoord(preY || y));
              } else {
                restPathArray.push(fixCoord(startX), fixCoord(preY || y));
              }

              for (var index = 0; index < days; index ++) {

                // 虚线的开始 画时间
                if (that.period === "5d") {
                  var str = SNB.chartUtil.formatTime(preTs + (index + 1) * dayTimespan, "MM-dd", that.is$);
                  that.drawSplitTime(startX, str);
                }

                startX += dayWidth;
                
                // 画虚线
                if (restPathArray.length > 1) {
                  restPathArray.push("L", fixCoord(startX), fixCoord(preY || y));
                } else {
                  restPathArray.push(fixCoord(startX), fixCoord(preY || y));
                }
              }

              if (periodType === "month") {
                // 实线的点 move 到这里 需要多走一步  要不5个点就四条线段
                // 五个点只能有4段 也就是4天  这里开始的时候多画1天
                currentPathArray.push("M", fixCoord(startX), fixCoord(preY));

                startX += dayWidth;
                currentPathArray.push("L", fixCoord(startX), fixCoord(y));
              }
            } else {
              if (periodType === "month") {
                startX += dayWidth;

                // 实线的点 move 到这里
                if (currentPathArray.length === 1) {
                  currentPathArray.push(fixCoord(startX), fixCoord(y));
                } else {
                  currentPathArray.push("L", fixCoord(startX), fixCoord(y));
                }
              }
            } 

            preTimeStr = timeStr;

            if (periodType === "day") {
              // 第二天的第一个点  逻辑同9.30那个点
              var str = SNB.chartUtil.formatTime(ts, "MM-dd", that.is$);
              that.drawSplitTime(startX, str);

              // 凌晨到9:30那段虚线
              startX += part[0] * restDayWidth;

              // == 1的话相当于虚线开始
              if (restPathArray.length > 1) {
                restPathArray.push("L", fixCoord(startX), fixCoord(preY || y));
              } else {
                restPathArray.push(fixCoord(that.labelWidth), fixCoord(y));
                restPathArray.push("L", fixCoord(startX), fixCoord(preY || y));
              }

              // 实线的点 move 到这里
              if (currentPathArray.length === 1) {
                currentPathArray.push(fixCoord(startX), fixCoord(y));
              } else {
                currentPathArray.push("M", fixCoord(startX), fixCoord(y));
              }
            }
          // 当天的的点
          } else {
            var timeStr = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd hh:mm", that.is$),
              reg = /test/,
              bigType = that.stockInfo.bigType;

            startX += perWidth;

            if (periodType === "day") {
              if (bigType === "沪深" || bigType === "基金") {
                reg = /11:30/;
              } else if (bigType === "港股") {
                reg = /12:00/;
              }


              // 特殊的几个点  虚实相交的部分 特殊处理
              var isSpecialPoint = false;

              // 开盘 逻辑同上面if
              if (/09:30/.test(timeStr)) {
                isSpecialPoint = true;

                startX += part[0] * restDayWidth;

                if (restPathArray.length > 1) {
                  restPathArray.push("L", fixCoord(startX), fixCoord(y));
                } else {
                  if (that.period === "5d") {
                    that.drawSplitTime(that.labelWidth, SNB.chartUtil.formatTime(ts, "MM-dd", that.is$));
                  }
                  restPathArray.push(fixCoord(that.labelWidth), fixCoord(y));
                  restPathArray.push("L", fixCoord(startX), fixCoord(y));
                }

                if (currentPathArray.length === 1) {
                  currentPathArray.push(fixCoord(startX), fixCoord(y));
                } else {
                  currentPathArray.push("M", fixCoord(startX), fixCoord(y));
                }
                if (that.period === "1d" && !overOneDay) {
                  that.drawSplitTime(startX, "09:30");
                }
              }

              // 中场休息 restPathArray 出没
              if (that.stockInfo.bigType !== "美股") {
                if (reg.test(timeStr)) {
                  isSpecialPoint = true;
                  restPathArray.push("M", fixCoord(startX), fixCoord(y));

                  // 提前画虚线
                  var restWidth = (part[1] * restDayWidth);
                  restPathArray.push("L", fixCoord(startX + restWidth), fixCoord(y));

                  currentPathArray.push("L", fixCoord(startX), fixCoord(y));
                }

                // 休息完毕
                if (/13:00/.test(timeStr)) {
                  isSpecialPoint = true;
                  startX -= perWidth;

                  startX += (part[1] * restDayWidth);
                  currentPathArray.push("M", fixCoord(startX), fixCoord(y));

                  if (that.period === "1d" && !overOneDay) {
                    that.drawSplitTime(startX, "13:00");
                  }
                }
              }

              // 终场 restPathArray出没
              var closeReg = /16:00/;
              if (bigType === "沪深" || bigType === "基金") {
                closeReg = /15:00/;
              }

              // 有时候收盘最后一个点不是16:00  这时候判断是否是最后一个点
              if (closeReg.test(timeStr) || i === current.length - 1) {
                isSpecialPoint = true;
                currentPathArray.push("L", fixCoord(startX), fixCoord(y));
                restPathArray.push("M", fixCoord(startX), fixCoord(y));

                if (that.period === "1d" && !overOneDay) {
                  that.drawSplitTime(startX, "16:00");
                }

                if (that.showCurrent.x) {
                  that.showCurrent.x[i] = startX;
                  that.showCurrent.y[i] = y;
                }

                // 把这天画完
                startX += (_.last(part) * restDayWidth); 
                restPathArray.push("L", fixCoord(startX), fixCoord(y));
              }

              if (!isSpecialPoint) {
                currentPathArray.push("L", fixCoord(startX), fixCoord(y));
              }
            } else {
              if (currentPathArray.length === 1) {
                currentPathArray.push(fixCoord(startX - dayWidth), fixCoord(y));
              } else {
                currentPathArray.push("L", fixCoord(startX), fixCoord(y));
              }
            }
          }  

          var yvol = vy - vol[i] * vscale;

          // specialPoint 先不画成交量
          // 因为结束的那个点  startX 往前走了点 走到了一天的结束位置
          // 画出来的成交量在一天的结束位置 不是交易时段的成交位置
          if (!isSpecialPoint) {
            // 成交量
            that.paper.path([
              "M",
              fixCoord(startX),
              fixCoord(yvol),
              "L",
              fixCoord(startX),
              fixCoord(vy)
            ]).attr(that.theme.volumePath);
          }

          preTimeStr = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd", that.is$);
          preTs = ts;
          preY = y;

          if (that.showCurrent.x) {
            if (_.isUndefined(that.showCurrent.x[i])) {
              that.showCurrent.x[i] = startX;
              that.showCurrent.y[i] = y;
            }
          }

          var len = Math.round(current.length / 5);
          if (periodType === "month" || periodType === "year") {
            if (i % len === 0) {
              var str = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd", that.is$);
              that.drawSplitTime(startX, str);
            }
          }
        });


        var days = Math.ceil((todayEndTs - preTs) / dayTimespan) - 1;
        
        // 大于1天的话  画整天的虚线
        if (days) {
          if (periodType === "month") {
            restPathArray.push("M", fixCoord(startX), fixCoord(preY || y));
          }

          for(var index = 0; index < days; index ++) {

            if (that.period === "5d" || that.period === "1d") {
              var str = SNB.chartUtil.formatTime(preTs + (index + 1) * dayTimespan, "MM-dd", that.is$);
              that.drawSplitTime(startX, str);
            }

            startX += dayWidth;

            // 保证path数组正确性 不能直接以 "M", "L" 开头
            if (restPathArray.length >= 3) {
              restPathArray.push("L", fixCoord(startX), fixCoord(preY || y));
            }
          }
        }  

        that.paper.path(currentPathArray).attr(that.theme.currentPath);

        // 有效画线数组
        if (restPathArray.length >=3) {
          that.paper.path(restPathArray).attr(that.theme.restPath);
        }

        that.drawStatusPoint();
      }  
    },
    drawStatusPoint: function() {
      var that = this,
        chart = this.chart,
        y = chart.stateHeight,
        ts = this.showCurrent.ts,
        startTs = this.startTs,
        endTs = this.endTs,
        colors= this.theme.compareColors,
        params = {
          source: "all",
          symbol: this.symbol,
          range: startTs + "," + endTs,
          sort: "reply",
          summary_count: 20,
          ex: 1
        };

      params = _.extend(params, this.filterStatusOptions);
      this.statusCircles = new that.statusPaper.set();
      SNB.get("/statuses/summary_search.json", params, function(ret) {
        var summary = ret.summary,
          list = ret.list;

        that.statusList = list;

        var showCurrentTs = that.showCurrent.ts.slice(0, that.howmany),
          showCurrentX = that.showCurrent.x.slice(0, that.howmany),
          showCurrentY = that.showCurrent.y.slice(0, that.howmany);

        showCurrentTs.unshift(startTs);
        showCurrentTs.push(endTs);  

        showCurrentX.push(that.labelWidth + chart.width);
        showCurrentX.unshift(that.labelWidth);

        showCurrentY.push(_.last(showCurrentY));
        showCurrentY.unshift(_.first(showCurrentY));

        // 存储图片
        var images = [];
        _.each(summary, function(s, index) {
          var color = colors[index] || "#05c";

          // TODO
          // 遍历每个讨论点得ts  用showCurrent的ts 加上 startTs 和 endTs  用2分查找到index 从而确定x的区间
          // 再根据区间来跟 perWidth比较 看时rest 还是trade time 通过x, y 来确定讨论点得 x, y
          // 讨论点得事件 就通过 移动触发来完成
          
          var sts = s.created_at,
            i = SNB.chartUtil.getIndexByTs(showCurrentTs, sts),
            t1 = showCurrentTs[i],
            t2 = showCurrentTs[i + 1],
            x1 = showCurrentX[i],
            x2 = showCurrentX[i + 1],
            y1 = showCurrentY[i],
            y2 = showCurrentY[i + 1],
            x, y;

          x = x1 + (x2 - x1) / (t2 - t1) * (sts - t1);

          if (Math.round(x2 - x1) > Math.round(chart.perWidth)) {
            if (that.period === "1m" || that.period === "6m") {

              if (x2 - x < that.chart.perWidth) {
                x1 = x2 - that.chart.perWidth;
                var a = (y1 - y2) / (x1 - x2),
                  b = (x1 * y2 - x2 * y1) / (x1 - x2);

                y = a * x + b;
              } else {
                y = y1;
              }
            } else {
              y = y1;
            }
          } else {
            // 根据 y = ax + b 计算出 a = (y1 - y2) / (x1 - x2) ; b = (x1 * y2 - x2 * y1) / (x1 - x2);
            if (y1 === y2) {
              y = y1;
            } else {
              var a = (y1 - y2) / (x1 - x2),
                b = (x1 * y2 - x2 * y1) / (x1 - x2);

              y = a * x + b;
            }
          }

          var circle;

          if (index < 5) {
            var defaultSrc = SNB.staticDomain + "/images/icons/" + (index + 1) + ".png",
              hoverSrc = SNB.staticDomain + "/images/icons/popobk_hover_" + (index + 1) + ".png";

            circle = that.statusPaper.image(defaultSrc, x - 8, y - 16, 16, 16)
                      .attr({
                        title: "点击查看讨论"
                      })
                      .data("defaultSrc", defaultSrc)
                      .data("hoverSrc", hoverSrc);

            images.push(circle);
          } else {
            circle = that.statusPaper.circle(x, y, 3).attr({
              "stroke": "none",
              "stroke-width": "0px",
              "fill": color
            });  
          
          }

          circle.data("id", s.id);
          that.statusCircles.push(circle);
        });

        // 反序一下  把index靠前的优先显示出来
        if (images.length) {
          images = images.reverse();
          _.each(images, function (image) {
            image.toFront();
          });
        }
      });
    },
    popStatus: function (circle) {
      var id = circle.data("id"),
        x = circle.attr("cx") || circle.attr("x"),
        y = circle.attr("cy") || circle.attr("y"),
        status = _.find(this.statusList, function(s) {
          return s.id == id;
        }),
        that = this;

      var popStatus = ''
        + '<div class="tt">'
          + '<div class="tt-arrow above">'
            + '<div class="tt-arrow-in"></div>'
            + '<div class="tt-arrow-out"></div>'
          + '</div>'  
          + '<div class="tt-alpha"></div>'
          + '<div class="popStatus">'
            + '<img src="{{=it.img}}" class="popHeadPic"/>'
            + '<div class="popStatusRight">'
              + '<div class="popStatusName">'
                + '<span class="popStatusNameContainer">'
                  + '<a href="{{=it.user.profile}}" target="_blank">{{=it.user.screen_name}}'
                + '{{ if (it.user.verified){ }}'
                  + '<img  class="vipicon" width="16px" height="16px" title="{{=it.user.verified_description}}" src="'+SNB.domain['static']+'/images/vipicon_{{=it.user.verified_type||1}}.png"/>'
                + '{{ } }}'
                + '：</a>'
                + '</span>'
                + '<span class="popStatusTimeContainer">'
                  + '<span class="popStatusTime">{{=it.createdAt}}</span>'
                  + '<a class="popStatusClose"></a>'
                + '</span>'  
              + '</div>'
            + '{{if (it.title){ }}'  
              + '<div class="popStatusTitle">'
                + '<h4><a href="{{=it.target}}" target="_blank" title="{{=it.fullTitle}}">{{=it.title}}</a></h4>'
              + '</div>'
            + '{{ } }}'  
            + '<div class="popStatusContent">'
              + '{{=it.description}}'
              + '{{if (it.target){ }}'
                + '<a href="{{=it.target}}" target="_blank" class="popStatusReply">评论({{=it.reply_count}})</a>'
              + '{{ } }}'  
            + '</div>'
            + '{{ if (it.retweeted_status){ }}'
              + '<div class="popRetweetedStatus">'
                + '<a href="{{=it.retweeted_status.user.profile}}" href="_blank">{{=it.retweeted_status.user.screen_name}}'
              + '{{ if (it.retweeted_status.user.verified){ }}'
                + '<img width="16px"  class="vipicon" height="16px" title="{{=it.retweeted_status.user.verified_description}}" src="'+SNB.domain['static']+'/images/vipicon_{{=it.retweeted_status.user.verified_type||1}}.png"/>'
              + '{{ } }}'
              + '：</a>'
              + '{{if (it.retweeted_status.title){ }}'  
                + '<div class="popStatusTitle">'
                  + '<h4><a href="{{=it.retweeted_status.target}}" target="_blank" title="{{=it.retweeted_status.fullTitle}}">{{=it.retweeted_status.title}}</a></h4>'
                + '</div>'
              + '{{ } }}'  
                + '<div class="popStatusContent">{{=it.retweeted_status.description}}<a href="{{=it.retweeted_status.target}}" target="_blank" class="popStatusReply">评论({{=it.retweeted_status.reply_count}})</a></div>'
              + '</div>'
            + '{{ } }}'
            + '</div>'
          + '</div>'
          + '<div class="tt-arrow below">'
            + '<div class="tt-arrow-in"></div>'
            + '<div class="tt-arrow-out"></div>'
          + '</div>'  
        +'</div>';  

      var func = doT.template(popStatus);

      function fixStatus (ret) {
        var status = ret.status || ret;

        if (!status.ts) {
          var imgUrlArray = status.user.profile_image_url ? status.user.profile_image_url.split(",") : [''];
          imageUrl = status.user.id ? _.last(imgUrlArray) : imgUrlArray[1];

          if (!imageUrl) {
            imageUrl = "community/default/avatar.png!30x30.png";
          }

          status.img=SNB.domain.photo + "/" + imageUrl;

          if (status.title) {
            if (SNB.Util.getWordsCount(status.title) > 15) {
              status.fullTitle = status.title;
              status.title = SNB.Util.splitWord(status.title, 15) + "...";
            } else {
              status.fullTitle = status.title;
            }
          }

          status.description = $("<div>" + status.description + "</div>").text();

          if (SNB.Util.getWordsCount(status.description) > 70) {
            status.description = SNB.Util.splitWord(status.description, 70) + "...";
          }
          if (status.retweeted_status) {
            var retweeted_status = status.retweeted_status;
            if (retweeted_status.title) {
              var title = retweeted_status.title;
              if (SNB.Util.getWordsCount(title) > 15) {
                retweeted_status.fullTitle = title;
                retweeted_status.title = SNB.Util.splitWord(title, 15) + "...";
              } else {
                retweeted_status.fullTitle = retweeted_status.title;
              }
            }
          }
          status.createdAt = SNB.Util.parseTime(status.created_at);
        }
        return status;
      }

      // 弹出层
      function generateStatus(ret, circle) {
        var status = fixStatus(ret);

        // 正在loading的 popStatus 外壳
        //that.loadingPopStatus.remove();

        var $pop = $(func(status)).addClass("status_show");
        
        // 把对话框内的a标签加_blank属性 
        $pop.find("a").each(function() {
          $(this).attr("target", "_blank");
        });

        $pop
          .data("statusid", status.id)
          .data("circle", circle);

        // 弹出框引用圆点
        //that.popStatuses.push($pop);

        $pop
          .css({
            "visibility": "hidden"
          })
          .appendTo(that.wrapper);

        var height = $pop.find(".popStatus").outerHeight() + 6;
        $pop.css("height", (height + 10));
        $pop.find(".tt-alpha").css("height", height);

        var py = y - height + 15,
          px = x - 26;

        if (circle.type === "image") {
          px += 8;
          py += 4;
        }
        $pop.css({
          position: "absolute",
          left: px,
          top: py,
          visibility: "visible"
        });

        $pop.on("click", ".popStatusClose", function (e) {
          circle.removeData("isPop");
          circle.removeData("status");

          if (circle.type === "image") {
            circle.node.href.baseVal = circle.data("defaultSrc");
          } else {
            circle.animate({
              r: "3",
              fill: "#05c"
            });
          }
          if ($pop.data("relatedLine")) {
            $pop.data("relatedLine").remove();
            $pop.removeData("relatedLine");
          }
          $pop.remove();
        });

        var dragEl,
          originEventPosition,
          originPopPosition = {
            left: px + 2,
            top: py
          },
          originArrowPosition = {
            left: px + 30,
            top: py + height - 30
          };

        // 拖动事件
        $pop.on("mousedown", function (e) {
          var tag = e.target.tagName;

          // 除了A标签 其他元素都能拖动
          if (tag !== "A") {
            dragEl = $(this);
            dragEl.data("isDragable", true);

            originEventPosition = {
              left: e.pageX,
              top: e.pageY
            };
          }

          $("body").unbind("mousemove").bind("mousemove", function (e) {
            if (dragEl && dragEl.data("isDragable")) {
              var offsetTop = e.pageY - originEventPosition.top,
                offsetLeft = e.pageX - originEventPosition.left,
                top = originPopPosition.top + offsetTop,
                left = originPopPosition.left + offsetLeft,
                arrowTop = originArrowPosition.top + offsetTop,
                arrowLeft = originArrowPosition.left + offsetLeft,
                lineEndPoint = {left: arrowLeft, top: arrowTop};

              $pop.css({left: left, top: top});
              top = lineEndPoint.top - 7;

              // 拖动的时候边框变色。
              if ($pop.find(".tt-arrow").length) {
                $pop.find(".tt-arrow").remove();
                $pop.find(".tt-alpha").remove();
                $pop.find(".popStatus").css({"border": "1px solid #ff7c00"});
              }

              var x = circle.data("cx") || circle.attr("cx"),
                y = circle.data("cy") || circle.attr("cy");

              if ($pop.data("relatedLine") && !$pop.data("relatedLine").removed) {
                $pop
                  .data("relatedLine")
                  .animate({path: ["M", x, y, "L", lineEndPoint.left, top]})
              } else {
                var path = that
                            .paper
                            .path(["M", x, y, "L", lineEndPoint.left, top])
                            .attr({stroke: "#ff7c00"});

                $pop.data("relatedLine", path);
              }
            }
          });
          return false;
        });

        $pop.on("mouseup", function (e) {
          var tag = e.target.tagName;

          if (tag !== "A") {
            $(this).data("isDragable", false);

            originPopPosition = {
              top: originPopPosition.top + (e.pageY - originEventPosition.top),
              left: originPopPosition.left + (e.pageX - originEventPosition.left)
            };

            originArrowPosition = {
              left: originPopPosition.left + 30,
              top: originPopPosition.top + height - 30
            };

            originEventPosition = {
              top: e.pageY,
              left: e.pageX
            }
          }
        });
        return $pop;
      }

      function renderStatus(s) {
        var html = ' '
          + '<div class="status-container">'
            + '<div class="content">' + s.description + '</div>'
              + '<s></s>'
              + '<i></i>'
            + '</div>'
          + '</div>';  

        var $statusContainer = $(html);
        $statusContainer.css({
          top: y + 30,
          left: x - 150 
        });
        that.wrapper.append($statusContainer);  
      }

      // 接口里面吐出前几条完整的讨论  没吐的话 从讨论接口去取
      if (status) {
        var $pop = generateStatus(status, circle);
        circle.data("status", $pop);
      } else {
        SNB.get("/statuses/show.json", {
          id: id,
          symbol: that.symbol,
          fg: 1
        }, function(status) {
          var $pop = generateStatus(status, circle);
          circle.data("status", $pop);
        });
      }
    },
    showStatusStockInfo: function (x) {
      this.opaper.clear();
      var that = this,
        chart = this.chart;

      this.opaper.path([
        "M",
        fixCoord(x),
        fixCoord(chart.stateHeight),
        "L",
        fixCoord(x),
        fixCoord(chart.cy)
      ]).attr(this.theme.dashedSplitLine);  

      var currentX = that.showCurrent.x.slice(0, that.howmany + 1);
      currentX.unshift(this.labelWidth);
      currentX.push(this.labelWidth + chart.width);

      var index = SNB.chartUtil.getIndexByTs(currentX, x),
        x1 = currentX[index],
        x2 = currentX[index + 1];

      if (x - x1 < x2 - x) {
        index = index - 1;
      }

      this.showStockStateInfo(index);

      if (that.statusCircles && that.statusCircles.length) {
        var circles = [];

        that.statusCircles.forEach(function (circle) {
          var cx = circle.attr("cx") || circle.attr("x");

          if (!circle.data("isPop")) {
            if (circle.type === "image") {
              circle.node.href.baseVal = circle.data("defaultSrc");

              // image 没有cx 属性
              circle.data("cx", cx + 8);
              circle.data("cy", circle.attr("y") + 4);

              if (x >= cx && x <= cx + 12) {
                circles.push(circle);
              }
            } else {
              circle.animate({
                r: "3",
                fill: "#05c"
              });

              if (x >= cx - 3 && x <= cx + 3) {
                circles.push(circle);
              }
            }
          }
        });

        var circle; 

        if (circles.length) {
          _.each(circles, function (c) {
            if (circle) {
              var cx = c.data("cx") || c.attr("cx"),
                circleX = circle.data("cx") || circle.attr("cx"),
                x1 = Math.abs(x - cx),
                x2 = Math.abs(x - circleX);

              if (x1 <= x2) {
                circle = c;
              }  
            } else {
              circle = c;
            }
          });

          if (circle.type === "image") {
            circle.node.href.baseVal = circle.data("hoverSrc");
          } else {
            circle.animate({
              r: "5",
              fill: "#fd6609"
            });
          }
        }
      }
    }
  };

  _.extend(SNB.stockChart.prototype, obj);  
});
;
define('pages/invest/chart/TSNB.chart.stock.js', [], function (require, exports, module) {  function fixCoord(coord) {
    return Math.floor(coord) + 0.5;
  }

  //需要截取小数后2位
  var toFixedLength = 2;

  if (SNB.data && SNB.data.quote && SNB.data.quote.type) {
    var type = parseInt(SNB.data.quote.type);
    if (type === 25) {
      //期权截取小数后4位
      toFixedLength = 4;
    } else if (type === 32 || type === 13) {
      //港股涡轮、基金截取小数后3位
      toFixedLength = 3;
    }
  }

  var obj = {
    wrapDataForStockChart: function (data, period) {
      var ts = [],
        vol = [],
        avg = [],
        current = [];

      _.each(data.chartlist, function (d, i) {
        ts[i] = Date.parse(d.time);
        vol[i] = d.volume;
        avg[i] = d.avg_price;
        current[i] = d.current;
      });

      this.data[period] = {
        ts: ts,
        vol: vol,
        avg: avg,
        current: current
      };

      if (_.isUndefined(this.compareData[this.symbol])) {
        this.compareData[this.symbol] = {};
      }

      this.compareData[this.symbol][period] = this.data[period];
    },

    // 画图
    drawStockChart: function () {
      this.opaper.clear();
      this.statusPaper.clear();
      var current = this.current.current.slice(this.begin, this.end),
        chart = this.chart,
        vol = this.current.vol.slice(this.begin, this.end),
        ts = this.current.ts.slice(this.begin, this.end),
        avg = this.current.avg.slice(this.begin, this.end),
        cy = chart.cy,
        vy = chart.vy,
        that = this;

      /*
       *current = _.filter(current, function(a) {
       *  return a > 0; 
       *});
       */

      // 只有一个点的情况 复制成2个点  成一条线
      if (current.length === 1) {
        current.push(current[0]);
        vol.push(vol[0]);
        ts.push(ts[0]);
        avg.push(avg[0]);
      }

      this.showCurrent = {
        current: current,
        avg: avg,
        vol: vol,
        ts: ts
      };

      var currentArray = current.slice();

      // 把lastClose 放入数组 
      if (this.period === "1d") {
        currentArray.push(this.lastClose);
      }

      this.drawSplitLine(currentArray, vol, 0.3, true);

      // draw chart
      // 1日或者5日图 的点数是固定的  所以用howmany
      // 月线和年线 的点数不固定 所以用当前数据长度
      var count = (this.period === "1d" || this.period === "5d") ? this.howmany : current.length,
        perWidth = chart.width / (count - 1),
        cymin = chart.cymin,
        cscale = chart.cscale,
        vscale = chart.vscale,
        lastX;

      this.chart.perWidth = perWidth;

      if (this.period === "1d") {
        this.draw1dSplitTime();
      }

      var i = 0,
        lastTime,
        pathArray = ["M"],
        avgArray = ["M"],
        timeCount = Math.round(that.howmany / 5);

      for (; i < that.howmany; i++) {
        var v = vol[i],
          c = current[i],
          a = avg[i];

        if (_.isNumber(c)) {
          var ycurrent = cy - (c - cymin) * cscale,
            yavg = cy - (a - cymin) * cscale,
            yvol = vy - v * vscale,
            t = ts[i],
            time = SNB.chartUtil.formatTime(t, "MM-dd", that.is$),
            x = that.labelWidth + i * perWidth;

          // 0的话 就不画了
          if (c === 0) {
            continue;
          }

          avgArray.push(fixCoord(x), fixCoord(yavg));
          pathArray.push(fixCoord(x), fixCoord(ycurrent));

          // 成交量
          that.paper.path([
            "M",
            fixCoord(x),
            fixCoord(yvol),
            "L",
            fixCoord(x),
            fixCoord(vy)
          ]).attr(that.theme.volumePath);

          if (i) {
            pathArray.push("L");
            avgArray.push("L");
          }

          // draw time split
          if (time !== lastTime) {
            if (that.period === "5d") {
              that.drawSplitTime(x, time);
            }

            if (i % timeCount === 0 && that.period !== "1d") {
              that.drawSplitTime(x, time)
            }
          }

          lastX = x;
          lastTime = time;
        }
      }

      if (pathArray.length > 3) {
        this.paper.path(pathArray).attr(this.theme.currentPath);

        // 背景
        pathArray.push("L", lastX, cy, "L", pathArray[1], cy, "Z");
        this.paper.path(pathArray).attr(this.theme.currentBackground);
      }

      if (that.period === "1d" || that.period === "5d") {
        // 指数没有均线
        if (that.stockInfo.type != "指数" && avgArray.length > 3) {
          this.paper.path(avgArray).attr({
            "stroke": "#f70",
            "stroke-width": 1
          });
        }
      }

      // 昨收线
      if (this.period === "1d") {
        var lcy = cy - Math.round((this.lastClose - cymin) * cscale);

        this.paper.path([
          "M",
          fixCoord(this.labelWidth),
          fixCoord(lcy),
          "L",
          fixCoord(this.labelWidth + chart.width),
          fixCoord(lcy)
        ]).attr(this.theme.dashedSplitLine)
          .attr({
            "stroke": "#e40",
            "stroke-dasharray": "- "
          });
      }

      this.showStockStateInfo(current.length - 1);
    },
    draw1dSplitTime: function () {
      var that = this,
        chart = this.chart,
        cy = chart.cy,
        count = this.howmany;

      var timeIndex = {
        "美股": [0, 180, 390],
        "沪深": [0, 120, 241],
        "港股": [0, 150, 331],
        "比特币": [0]
      };

      var exchange = this.fixBigType(this.stockInfo.bigType),
        indexArray = timeIndex[exchange];

      _.each(indexArray, function (i, index) {
        var label = "12:00",
          xline = that.labelWidth + i * chart.perWidth,
          align = "center";

        if (exchange === "美股") {
          label = "12:30";
        }
        if (exchange === "沪深") {
          label = "13:00";
        }
        if (i === 0) {
          align = "start";
          label = "09:30";
        } else if (i === count - 1) {
          align = "end";
          label = "16:00";
          if (exchange === "沪深") {
            label = "15:00";
          }
        }

        if (index == 1) {
          that.paper.path([
            "M",
            fixCoord(xline),
            fixCoord(chart.stateHeight),
            "L",
            fixCoord(xline),
            fixCoord(cy)
          ]).attr(that.theme.dashedSplitLine);
        }

        that.paper.text(xline, cy + 10, label).attr({
          "fill": "#888",
          "text-anchor": align,
          "font-size": "10px"
        });
      });
    },

    // 鼠标hover事件
    showStockCurrentInfo: function (index) {
      this.opaper.clear();

      var that = this,
        chart = this.chart,
        cymin = chart.cymin,
        cscale = chart.cscale,
        vscale = chart.vscale,
        cy = chart.cy,
        vy = chart.vy,
        current = this.showCurrent.current[index],
        volume = this.showCurrent.vol[index],
        ts = this.showCurrent.ts[index];
      x = this.labelWidth + index * chart.perWidth,
        ycurrent = cy - Math.round((current - cymin) * cscale),
        yvol = vy - volume * vscale,
        tsFormat = "hh:mm",
        isUSTime = that.is$;

      if (this.period === "1d" || this.period === "5d") {
        tsFormat = "hh:mm";
      } else if (this.period === "1m" || this.period === "6m") {
        tsFormat = "MM-dd";
      } else {
        tsFormat = "yyyy-MM-dd";
      }

      if (_.isUndefined(current)) {
        return false;
      }

      if (this.ctype === "day") {
        this.opaper.circle(x, ycurrent, 3).attr({
          fill: "#2f84cc",
          "stroke-width": 0,
          "stroke": "none"
        });

        this.opaper.circle(x, yvol, 2).attr({
          fill: "#2f84cc",
          "stroke-width": 0,
          "stroke": "none"
        });
      }

      // 横线
      this.opaper.path([
        "M",
        fixCoord(this.labelWidth + 44),
        fixCoord(ycurrent),
        "L",
        fixCoord(this.labelWidth + chart.width - 44),
        fixCoord(ycurrent)
      ]).attr(this.theme.dashedSplitLine)
        .attr({
          "stroke": "#888"
        });

      // 竖线
      this.opaper.path([
        "M",
        fixCoord(x),
        fixCoord(chart.stateHeight),
        "L",
        fixCoord(x),
        fixCoord(cy)
      ]).attr(this.theme.dashedSplitLine)
        .attr({
          "stroke": "#888"
        });

      // 当前价的方框 和文字
      this.opaper.rect(0.5, fixCoord(ycurrent - 8), 44, 16).attr({
        "stroke": "#ccc",
        "fill": "#f0f0f0",
        "opacity": "0.5"
      });
      this.opaper.text(this.labelWidth + 3, ycurrent, parseFloat(current).toFixed(toFixedLength)).attr(this.theme.rightText);

      // 涨跌幅 和百分比
      var lastClose = this.period === "1d" ? this.lastClose : _.first(this.showCurrent.current),
        percentStr;

      if (lastClose === 0) {
        lastClose = _.find(this.showCurrent.current, function (c) {
          return c > 0;
        });
      }
      if (lastClose) {
        percentStr = ((current - lastClose) / lastClose * 100).toFixed(2) + "%";
      } else {
        percentStr = "0.00%";
      }

      this
        .opaper
        .rect(fixCoord(chart.width - 44), fixCoord(ycurrent - 8), 44, 16)
        .attr({
          "stroke": "#ccc",
          "fill": "#f0f0f0",
          "opacity": "0.5"
        });

      this.opaper.text(this.labelWidth + chart.width - 3, ycurrent, percentStr).attr(this.theme.leftText);

      // 时间
      var timeStr = SNB.chartUtil.formatTime(ts, tsFormat, isUSTime),
        timeEl = this.opaper.text(fixCoord(x), fixCoord(cy + 10), timeStr).attr(this.theme.centerText),
        timeWidth = timeEl.getBBox().width,
        timeRectWidth = timeWidth + 10;

      this.opaper.rect(fixCoord(x - timeRectWidth / 2), fixCoord(cy + 2), timeRectWidth, 16).attr({
        "stroke": "#ccc",
        "fill": "#f0f0f0"
      });
      timeEl.toFront();
    },

    // state 状态信息
    showStockStateInfo: function (index) {
      if (index < 0 || _.isNaN(index)) {
        return false;
      }

      var startX = this.labelWidth + 10,
        y = 10.5;

      if (!this.showCurrent.current) {
        return false;
      }

      var current = this.showCurrent.current[index],
        avg = this.showCurrent.avg[index],
        volume = this.showCurrent.vol[index],
        percent = (current - this.lastClose) / this.lastClose,
        color = this.getUpDownColor(percent),
        percentStr = (percent * 100).toFixed(2) + "%",
        ts = this.showCurrent.ts[index],
        str = "当前价：",
        txt;

      if (this.period !== "1d") {
        var first = _.first(this.showCurrent.current);
        percent = (current - first) / first;
        if (first === 0) {
          //如果初始值是0，则百分比直接显示0%.
          percent = 0;
        }
        color = this.getUpDownColor(percent);
        percentStr = (percent * 100).toFixed(2) + "%";
      }

      if (_.isUndefined(current)) {
        return false;
      }

      if (_.isNaN(percent)) {
        percentStr = "0.00%";
      }

      current = current.toFixed(toFixedLength);
      volume = parseInt(volume);

      if (percent > 0) {
        percentStr = "+" + percentStr;
      }

      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.titleText);

      startX += txt.getBBox().width;

      str = current;
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.valueText);

      startX += txt.getBBox().width + 2;
      str = "(" + percentStr + ")";
      txt = this.opaper.text(fixCoord(startX), y, str)
        .attr(this.theme.valueText)
        .attr({fill: color});

      startX += txt.getBBox().width + 10;
      str = "成交量：";
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.titleText);

      startX += txt.getBBox().width;
      str = volume;
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.valueText);

      if (this.period === "1d" || this.period === "5d") {
        startX += txt.getBBox().width + 10;
        str = "均价：";
        txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.titleText);

        startX += txt.getBBox().width;
        str = avg;
        txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.valueText);
      }

      startX += txt.getBBox().width + 10;
      str = "时间：";
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.titleText);

      startX += txt.getBBox().width;
      str = SNB.chartUtil.formatTime(ts, "yyyy-MM-dd hh:mm", this.is$);
      if (this.period === "1d") {
        str = str.split(" ")[1];
      }
      txt = this.opaper.text(fixCoord(startX), y, str).attr(this.theme.valueText);
    }
  };

  _.extend(SNB.stockChart.prototype, obj);
});
;
define('pages/invest/chart/TSNB.chart.thumbnail.js', [], function (require, exports, module) {  function fixCoord(coord) {
    return Math.floor(coord) + 0.5;
  }

  var obj = {
    drawThumbnail: function () {
      var that = this,
        chart = this.chart,
        period,
        count,
        dayPoints;

      this.dragbarPaper.clear();
      this.dragbarPaper
        .rect(fixCoord(this.labelWidth), fixCoord(chart.vy), chart.width - 1, chart.bottomHeight)
        .attr(this.theme.currentRect);

      if (this.period === "1d" || this.period === "5d") {
        period = "5d";
        count = this.getStockDayLineCount(this.stockInfo.bigType, period);
        dayPoints = count / 5;
      } else {
        period = "all";
      }

      this.getData(period, function () {
        if (period === "all") {
          count = that.data[period].current.length;
          dayPoints = Math.round(count / 5);
        }

        that.thumbnailInfo.splitx = [];

        var perWidth;

        // 至少得2个点才能画线
        if (count > 1) {
          var current = that.data[period].current,
            cd = SNB.chartUtil.minMax1d(current, true),
            cheight = chart.bottomHeight,
            cmin = cd[0],
            cmax = cd[1],
            crange = cmax - cmin,
            cymin = parseFloat(cmin - (0.3 * crange)),
            cymax = parseFloat(cmax + (0.3 * crange)),
            cscale = cheight / (cymax - cymin),
            by = chart.by,
            i = 0,
            pathArray = ["M"];

          perWidth = chart.width / (count - 1);

          for (; i < count; i++) {
            var c = current[i];

            if (!_.isUndefined(c)) {
              var x = that.labelWidth + i * perWidth,
                y = by - Math.round((c - cymin) * cscale);

              if (c !== 0) {
                if (i) {
                  pathArray.push("L");
                }
                pathArray.push(x, y);
              }

              if (i % dayPoints == 0) {
                that.dragbarPaper.path([
                  "M",
                  fixCoord(x),
                  fixCoord(by),
                  "L",
                  fixCoord(x),
                  fixCoord(by - chart.bottomHeight)
                ]).attr(that.theme.dashedSplitLine);

                that.thumbnailInfo.splitx.push({
                  index: 1,
                  x: x
                });

                if (x < that.labelWidth + chart.width - 20) {
                  var ts = that.data[period].ts[i],
                    tsFormat = period === "all" ? "yyyy-MM" : "MM-dd",
                    timeStr = SNB.chartUtil.formatTime(ts, tsFormat, that.is$);

                  that.dragbarPaper.text(x + 5, by - 5, timeStr).attr({
                    "text-anchor": "start"
                  });
                }
              }
            }
          }

          if (pathArray.length > 3) {
            // 画线
            that.dragbarPaper.path(pathArray).attr({
              "stroke-width": "1px",
              "stroke": "#ccc"
            });

            // 画背景
            pathArray.push("L", x, by, "L", that.labelWidth, by, "Z");

            that.dragbarPaper.path(pathArray).attr({
              "stroke-width": "0px",
              "stroke": "none",
              "fill": "#ccc",
              "opacity": "0.3"
            });
          }
        } else {
          perWidth = chart.width;
        }

        // 在这里确定drag bar 的范围
        if (period === "all") {
          var bts = _.first(that.showCurrent.ts),
            ets = _.last(that.showCurrent.ts),
            indexArray = SNB.chartUtil.getIndexByTs(that.data["all"].ts, bts, ets),
            x1 = that.labelWidth + perWidth * indexArray[0],
            x2 = that.labelWidth + perWidth * indexArray[1];

          if (indexArray[0] < 3) {
            x1 = that.labelWidth;
          }
          that.drawDragBar(x1, x2);
        } else {
          that.drawDragBar();
        }
      });
    },
    drawDragBar: function (x1, x2) {
      var chart = this.chart,
        that = this;

      if (_.isUndefined(x1) || _.isUndefined(x2)) {
        if (this.period === "1d" || this.period === "5d") {
          var width = (chart.width - 6) / 5,
            splitx = this.thumbnailInfo.splitx,
            x1 = splitx[4].x,
            x2 = this.labelWidth + chart.width,
            y = chart.vy;

          if (this.period === "5d") {
            x1 = this.labelWidth;
            x2 = x1 + chart.width;
          }
        }
      } else {
        var y = chart.vy,
          width = x2 - x1;
      }

      function getStopX(x1, iscurrent) {
        var stopx; // 最终停靠的x

        _.each(splitx, function (tempx, i) {
          if (_.isUndefined(stopx)) {
            var current = splitx[i],
              next = splitx[i + 1];

            if (_.isUndefined(next)) {
              stopx = current.x + width;

              if (iscurrent) {
                stopx = current.x;
              }
            } else if (x1 == current.x) {
              stopx = current.x;
            } else {
              if (x1 == next.x) {
                stopx = next.x;
              }

              if (x1 > current.x && x1 < next.x) {
                if (x1 - current.x <= next.x - x1) {
                  stopx = current.x;
                } else {
                  stopx = next.x;
                }

                if (iscurrent) {
                  stopx = current.x;
                }
              }
            }
          }
        });

        return stopx;
      }

      var rect = this.dragbarPaper.rect(fixCoord(x1), fixCoord(y), x2 - x1, chart.bottomHeight).attr({
        "stroke": "#000",
        "storke-width": "1px",
        "fill": "#2f84cc",
        "opacity": "0.2"
      });


      var dragImgSrc = "//assets.imedao.com/images/drag_btn.png",
        lcx = x1 - 5,
        rcx = x2 - 5,
        left = this.dragbarPaper.image(dragImgSrc, x1 - 5, y + 15, 9, 16),
        right = this.dragbarPaper.image(dragImgSrc, x2 - 5, y + 15, 9, 16),
        rectWidth = width;

      that.dragRect = rect;
      that.dragLeft = left;
      that.dragRight = right;

      left.drag(function (dx, dy) {
        var tempx = x1 + dx,
          templcx = tempx - 5;

        if (tempx < that.labelWidth || tempx > that.labelWidth + chart.width) {
          return false;
        }

        rect.attr({
          x: tempx,
          width: rectWidth - dx
        });
        this.attr("x", templcx);
      }, function () {
        x1 = rect.attr("x");
        lcx = this.attr("x");
        rcx = right.attr("x");
        rectWidth = rect.attr("width");
      }, function () {
        rectWidth = rect.attr("width");
        x1 = rect.attr("x");
        lcx = left.attr("x");

        if (that.period === "1d" || that.period === "5d") {
          var animateX = getStopX(x1, rectWidth < width) - x1;

          x1 += animateX;
          lcx += animateX;
          rectWidth -= animateX;

          var bindex = Math.round((rect.attr("x") - that.labelWidth) / width),
            eindex = bindex + Math.round(rectWidth / width);

          if (bindex === 5) {
            bindex = 4;
            eindex = 5;
          }
          that.drawChartByDragBar(bindex, eindex);

          rect.animate({
            x: x1,
            width: rectWidth
          }, 100, ">");

          this.animate({
            x: lcx
          }, 100, ">");
        } else {
          that.drawChartByDragBar(x1, x1 + rectWidth);
        }
      });

      right.drag(function (dx, dy) {
        var tempx = rcx + dx;
        tempWidth = rectWidth + dx;

        if (tempx > that.labelWidth + chart.width) {
          return false;
        }

        rect.attr({
          width: tempWidth
        });

        this.attr("x", tempx);
      }, function () {
        x1 = rect.attr("x");
        lcx = left.attr("x");
        rcx = this.attr("x");
        rectWidth = rect.attr("width");
      }, function (event) {
        rcx = this.attr("x");
        rectWidth = rect.attr("width");

        if (that.period === "1d" || that.period === "5d") {
          if (rectWidth < width) {
            rectWidth = width;
            rcx = rect.attr("x") + width - 5;
          } else {
            rectWidth = getStopX(rcx + 5) - rect.attr("x");
            rcx = getStopX(rcx + 5) - 5;
          }

          var bindex = Math.round((rect.attr("x") - that.labelWidth) / width),
            eindex = bindex + Math.round(rectWidth / width);

          that.drawChartByDragBar(bindex, eindex);

          rect.animate({
            width: rectWidth
          }, 100, "<");

          this.animate({
            x: rcx
          }, 100, "<");
        } else {
          that.drawChartByDragBar(x1, x1 + rectWidth);
        }
      });

      rect.drag(function (dx, dy) {
        var tempx = x1 + dx;

        if (tempx < that.labelWidth || tempx > that.labelWidth + chart.width - rectWidth) {
          return false;
        }
        this.attr("x", x1 + dx);
        left.attr("x", lcx + dx);
        right.attr("x", rcx + dx);
      }, function () {
        x1 = this.attr("x");
        lcx = left.attr("x");
        rcx = right.attr("x");
        rectWidth = this.attr("width");
      }, function (event) {
        x1 = this.attr("x");
        lcx = left.attr("x");
        rcx = right.attr("x");

        if (that.period === "1d" || that.period === "5d") {
          var animateX = getStopX(x1) - x1;

          x1 += animateX;
          lcx += animateX;
          rcx += animateX

          var bindex = Math.round((x1 - that.labelWidth) / width),
            eindex = bindex + Math.round(this.attr("width") / width);

          that.drawChartByDragBar(bindex, eindex);

          this.animate({
            x: x1
          }, 100, ">");

          left.animate({
            x: lcx
          }, 100, ">");

          right.animate({
            x: rcx
          }, 100, ">");
        } else {
          if (event.pageX > that.dragRightMargin) {
            var animateX = that.labelWidth + chart.width - x1 - rectWidth;

            x1 += animateX;
            lcx += animateX;
            rcx += animateX

            this.animate({
              x: x1
            }, 100, ">");

            left.animate({
              x: lcx
            }, 100, ">");

            right.animate({
              x: rcx
            }, 100, ">");
          }
          that.drawChartByDragBar(x1, x1 + rectWidth);
        }
      });
    },

    drawChartByDragBar: function (bindex, eindex) {
      var that = this,
        chart = this.chart;

      if (this.period === "1d" || this.period === "5d") {
        if (bindex === 4 && eindex === 5) {
          this.period = "1d";
          this.getData("1d", function () {
            that.current = that.data["1d"];
            that.begin = 0;
            that.howmany = that.getStockDayLineCount(that.stockInfo.bigType, "1d");
            that.end = that.begin + that.howmany;

            if (that.isCompare) {
              that.compareStock();
            } else {
              that.paper.clear();
              that.drawBase();
              that.drawChart();
            }
          });
        } else {
          this.period = "5d";
          var period = "5d",
            count = this.getStockDayLineCount(this.stockInfo.bigType, period),
            dayPoints = count / 5;

          this.getData("5d", function () {
            that.current = that.data["5d"];
            that.begin = bindex * dayPoints;
            that.howmany = (eindex - bindex) * dayPoints;
            that.end = that.begin + that.howmany;

            if (that.isCompare) {
              that.compareStock();
            } else {
              that.paper.clear();
              that.drawBase();
              that.drawChart();
            }
          });
        }
      } else {
        var x1 = bindex,
          x2 = eindex,
          bts, ets,
          dataPeriod = "all",
          indexArray;

        bindex = Math.floor((x1 - that.labelWidth) / chart.width * that.data["all"].current.length);
        eindex = Math.floor((x2 - that.labelWidth) / chart.width * that.data["all"].current.length);

        bts = that.data["all"].ts[bindex];

        if (that.data["6m"]) {
          var bts6m = _.first(that.data["6m"].ts);

          dataPeriod = bts < bts6m ? "all" : "6m";

          if (dataPeriod === "6m") {

            // 接近今天  直接变成今天
            if (x2 > that.labelWidth + chart.width - 1) {
              ets = Date.now();
            } else {
              bts = that.data["all"].ts[eindex];
            }
            indexArray = SNB.chartUtil.getIndexByTs(that.data["6m"].ts, bts, ets);

            bindex = indexArray[0];
            eindex = indexArray[1];
          }
        }

        if (that.ctype === "day") {
          that.begin = bindex;
          that.end = eindex;
          that.howmany = that.end - that.begin;
          that.current = that.data[dataPeriod];
          that.period = dataPeriod;
        } else {
          ets = that.data["all"].ts[eindex];
          if (_.isUndefined(ets)) {
            ets = Date.now();
          }
          indexArray = SNB.chartUtil.getIndexByTs(that.current.ts, bts, ets);

          that.begin = indexArray[0];
          // 数组splice 的话 后面参数那一位 不会选取
          that.end = indexArray[1] + 1;
          that.howmany = that.end - that.begin;

          that.bts = bts;
          that.ets = ets;
        }

        if (that.isCompare) {
          that.compareStock();
        } else {
          // k线图的时候  底部拖动 会触发获取剩下来的K线
          var isRefresh = that.ctype === "kline";

          // 画K线图
          function drawKline () {
            that.paper.clear();
            that.drawBase();
            that.drawChart();
          }

          // 画净值图
          function drawNWChart () {
            that.paper.clear();
            that.drawNetWorthBase();
            that.drawNetWorthChart();
          }

          if (that.ctype === "kline" || that.ctype === "day") {
            // 因为Month是全部取过来的 就不用分批再取乐
            if (that.period === "1month") {
              drawKline();
            } else {
              that.getData(that.period, function () {
                drawKline();
              }, isRefresh);
            }
          } else {
            if (that.period === "1month") {
              drawNWChart();
            } else {
              that.getNetWorthData(that.period, function () {
                drawNWChart();
              });
            }
          }
        }
      }
    }
  };
  _.extend(SNB.stockChart.prototype, obj);
});
