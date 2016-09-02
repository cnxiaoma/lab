define('SNB.singleStock.js', ["SNB.atDialog"], function (require, exports, module) {  require('SNB.atDialog.js')
  var apiKey = "47bce5c74f",
    symbol = stockData.stockInfo.stockid,
    stockName = stockData.stockInfo.name,
    loading = $(".stockNews").find(".loading"),
    textValue = "$" + stockName + "(" + symbol + ")$ ",
    stockType = SNB.Util.getStockInfo(symbol),
    isFund = stockType.bigType === "基金",
    isB = /^SH900/.test(symbol) || isFund;

  SNB.data = SNB.data || {};

  var chartWidth = 568;
  var quoteType = SNB.data.quote.type;
  quoteType = quoteType ? parseInt(quoteType) : 0;
  if ((stockType.bigType === "沪深" || stockType.bigType === "基金") && quoteType !== 12 && quoteType !== 18 && quoteType !== 23 && quoteType !== 24 && quoteType !== 26) {
    chartWidth = 400;
  }
  // 遇到特殊情况随时切换图片
  if ($(".stockChart").length) {
    if ($.browser.msie && $.browser.version < 8) {
      //var stockInfo=stockData.stockInfo;
      //var imgUrl="/chart/";
      //var suffix=stockInfo.is$?".new.png":".png";
      //var html=''
      //  + '<ul id="changeChart">'
      //    + '<li class="active" id="1d">日分时图</li>'
      //    + '<li  id="5d" class="common">5天</li>'
      //    + '<li  id="1m" class="common">1月</li>'
      //    + '<li  id="3m" class="common">3月</li>'
      //    + '<li  id="6m" class="common">6月</li>'
      //    + '<li  id="1y" class="common">1年</li>'
      //    + '<li  id="3y" class="common">3年</li>'
      //    + '<li  id="5y" class="common">5年</li>'
      //    + '<li  id="10y" class="common">10年</li>'
      //    + '<li  id="all" class="common">全部</li>'
      //  + '</ul>'
      //  + '<img id="chart" src="'+imgUrl+stockInfo.stockid+'/1d'+suffix+"?v="+120+'" width="570px" height="306px"/>'
      //  + '<div id="chartLoading"></div>';
      //
      //$(".stockChart").html(html);
      //$("#changeChart").delegate("li","click",function(e){
      //  var id=e.target.id,
      //      imgUrl="/chart/";
      //
      //  $("#changeChart .active").removeClass("active").addClass("common");
      //  $("#"+id).removeClass("common").addClass("active");
      //  $("#chart").hide();
      //  $("#chartLoading").show();
      //  $("#chart").data("hasError",false).attr("src",imgUrl+stockData.stockInfo.stockid+"/"+id+(stockData.stockInfo.is$?".new":"")+".png?v="+new Date().getTime()).bind("load",function(e){
      //    $("#chartLoading").hide();
      //    $(this).show();
      //  });
      //});
      ////图片出错的默认显示。
      //$("#chart").bind("error",function(e){
      //  if(!$(this).data("hasError")){//避免默认图片404 重复提交请求。
      //    this.src=SNB.domain['static']+"/images/blankChart.png";
      //    $(this).data("hasError",true);
      //  }
      //});
      var html = '<p class="ie6">当前浏览器版本过低，无法显示完整功能。请升级浏览器。</p>';
      $(".stockChart").html(html).css('height', 'auto');
    } else {
      if ($("#newChart").length) {
        seajs.use("pages/invest/chart.js", function () {
          var options = {
            container: "newChart",
            dragbarOverlay: "overlay-dragbar",
            overlay: "overlay-chart",
            eventOverlay: "overlay-event",
            klineIndexOverlay: "overlay-klineIndex",
            loadingOverlay: "overlay-loading",
            statusOverlay: "overlay-status",
            wrapper: ".stockChart",//jq selector format
            symbol: symbol,
            stockName: stockName,
            quote: stockData.stockInfo,
            width: chartWidth,
            height: 340
          };
          SNB.chart = new SNB.stockChart(options);
        });
      }
    }
  } else {
    if ($(".fundChart").length) {
      seajs.use("pages/invest/SNB.fund_chart.js", function (obj) {
        SNB.chart = new obj.fundChart({
          container: "chart",
          wrapper: ".fundChart",//jq selector format
          //noVolume: true,
          symbol: symbol,
          width: chartWidth,
          height: 340
        });
      });
    }
  }

  function renderPankou() {
    var pankou = $("#pankou");
    if (pankou.length && !pankou.is(":visible")) {
      return;
    }
    //var noPankouSymbols = ["SH000001", "SZ399001", "SZ399006"];
    //if ( (stockType.bigType === "沪深" || stockType.bigType === "基金") && _.indexOf(noPankouSymbols, symbol) === -1 ) {
    if ((stockType.bigType === "沪深" || stockType.bigType === "基金") && quoteType !== 12 && quoteType !== 18 && quoteType !== 23 && quoteType !== 24 && quoteType !== 26) {
      seajs.use("pages/invest/TSNB.pankou.js", function (pankou) {
        pankou.init(symbol, stockData.stockInfo.last_close, SNB.data.quote.type);
      });
    }
  }

  renderPankou();


  //是否关注该股票
  if (!SNB.currentUser.isGuest) {
    SNB.get("/stock/portfolio/hasexist.json", {
      code: stockData.stockInfo.stockid,
      uid: SNB.currentUser.id,
      key: apiKey
    }, function (ret) {
      if (ret && ret.hasExist) {
        $(".stockOp").prepend('<a href="#" class="groupStock" style="float:left;">分组</a>');
        $(".stockOp").prepend('<a href="#" class="alertStock" style="float:left;">提醒</a>');
        $(".stockFollowRelation").html('<span class="icon_small"><s class="newIcon_small_onefollow newIcon_small"></s>&nbsp;</span><span title="取消关注" class="op removeFriend" id="removeFollow">取消关注</span>');
      }
      $(".stockOp").show();
    });
  } else {
    $(".stockOp").show();
  }

  var typeName = {
    "all": "信息",
    "user": "讨论",
    "ir": "投资者关系",
    "news": "新闻",
    "notice": "公告",
    "trans": "交易",
    "report": "研报"
  };
  var statusOptions = {
    source: "all",
    sort: "alpha",
    page: 1
  };

  function renderRemoveStatus() {
    var $each_status = $("#statusList").find("li");

    $each_status.each(function () {
      var $current_status = $(this),
        status_id = parseInt($current_status.attr("id").match(/\d+/ig)),
        remove_status_html = "<span class='remove_status'  title='屏蔽帖子'></span>";

      // filter own status
      if ($current_status.find('.headpic a').attr('data-name') == SNB.currentUser.screen_name) {
        return false;
      }

      $current_status.findOrAppend(".remove_status", remove_status_html);
      $current_status.on("click", ".remove_status", function (e) {
        e.preventDefault();
        var options = {}
        options.symbol = stockData.stockInfo.symbol;
        options.status_id = status_id;
        options.reason = 2;
        SNB.Util.checkLogin(function () {
          $current_status.hide()
          SNB.post("/statuses/user_stock_status_delete.json", options, function (ret) {
          }, function (ret) {
            var error_description = typeof ret === "object" && ret.error_description || "提交出错，请稍后重试"
            SNB.Util.failDialog(error_description);
          })
        })
      });
    });
  }

  function renderStatus(options, cb) {
    $("#statusList").unbind();
    var baseParams = {
      count: 10,
      comment: 0,
      symbol: symbol,
      hl: 0
    };
    var params, url;
    if (options.sort === "follow") {
      params = {
        code: symbol,
        count: 10,
        page: options.page
      };
      url = "/statuses/followers_to_stock.json";
    } else {
      params = $.extend({}, baseParams, options);
      url = "/statuses/search.json";
    }
    var source = options.source;

    // 非搜索时的新闻和公告  不用搜索接口。
    if ((source === "news" || source === "notice" || source === "ir" || source == "report") && !options.q) {
      url = "/statuses/stock_timeline.json";
      params = {
        symbol_id: symbol,
        count: 10,
        source: source === "news" ? ("自选股" + typeName[source]) : typeName[source],
        page: options.page
      };
      if (source === "ir") {
        params.source = "ir";
      }
    }

    SNB.get(url, params, function (ret) {
      var list = options.sort === "follow" ? ret : ret.list;

      loading.hide();
      $("#stockCommentPager").remove();

      if (options.q) {
        $(".statusCatagory").hide();
        $(".returnBack").show();

        var tip = '关于<a href="/k?q=' + options.q + '" target="_blank">#' + options.q + '#</a>的' + typeName[source] + '<span class="red">' + ret.count + '</span>条</span>';
        $(".searchResultTip").html(tip);
        $("#searchResult").show();
      } else {
        if (source === "all") {
          $("#allCata").show();
        }

        if (source === "user") {
          $("#statusCata").show();
          $("#statusCata").find("a").removeClass("active").eq(0).addClass("active");
        }
      }

      if (list && list.length) {
        var collection, view;
        collection = new SNB.Collections.Statuses(list);
        view = new SNB.Views.StatusList({
          el: $("#statusList"),
          collection: collection
        });
        if (source === "notice" || source === "news") {
          $("#statusList").addClass("simplify")
          SNB.data.collection = undefined;
        } else {
          $("#statusList").removeClass("simplify")
          SNB.data.collection = collection;
        }
        view.render();
        if (source != "notice" && source != "news") {
          renderRemoveStatus()
        }
        if (ret.maxPage > 1 && options.sort !== "follow") {
          $("#statusList").append("<div id='stockCommentPager'>" + SNB.Pager(ret.page, ret.maxPage, {jump: true}) + "</div>");
        }
        $("#statusList").css("min-height", $("#statusList").find(".status-list").height());

        $(".stockNews").find('.jump_input input').keydown(function (evt) {
          if (evt.keyCode != 13) {
            return;
          }
          var val = $(this).val(),
            self = this;
          val = typeof val === "string" ? parseInt(val) : val;
          if (isNaN(val) || val > ret.maxPage) {
            SNB.Util.failDialog('请输入正确的页码', null, function () {
              $(self).select();
            });
            return
          }
          statusOptions.page = val;
          renderStatus(statusOptions);
          SNB.Util.scrollTop(".stockNews", {top: 45});
          loading.show();
          $("#statusList").html("");
        });
      } else {
        var noneTip = '暂无' + (options.q ? ('关于<a href="/k?q=' + options.q + '" target="_blank">#' + options.q + '#</a>的') : '相关') + typeName[options.source];
        if (options.source == "ir") {
          noneTip += "交流";
        }
        $("#statusList").html("<div style='text-align:center;margin-top:20px;'>" + noneTip + "</div>");
      }
      if (cb) {
        cb();
      }
    });
  }

  $(".stockNews").delegate("#statusList #stockCommentPager a", "click", function (e) {
    e.preventDefault();
    statusOptions.page = $(this).attr("data-page");
    renderStatus(statusOptions);
    $('html, body').animate({
      scrollTop: $(".stockNews").offset().top
    }, 200);
    loading.show();
    $("#statusList").html("");
  });

  $(".stockNews").delegate(".newsTab a", "click", function (e) {
    e.preventDefault();
    $(".statusCatagory").hide();
    $("#statusList").html("");
    loading.show();

    if (!$(this).hasClass("active")) {
      $(this).parent().addClass("active").siblings().removeClass("active");
    }
    var type = $(this).attr("data-type");
    statusOptions.source = type;
    statusOptions.page = 1;

    //删除搜索
    delete statusOptions.q;
    var placeholder = "搜索该股票相关" + typeName[type];
    if (type == "ir") {
      placeholder = "搜索相关讨论";
    }
    $("#statusSearch").val("").attr("placeholder", placeholder);
    if ($.browser.msie) {
      $("#statusSearch").trigger("focus").trigger("blur");
    }
    $(".returnBack").hide();

    if (type === "user") {
      statusOptions.sort = "time";
    } else if (type === "all") {
      statusOptions.sort = $(".stockNews").data("userSort") || "alpha";
    } else {
      delete statusOptions.sort;
    }
    renderStatus(statusOptions);
    return false;
  });

  $(".stockNews").delegate(".statusCatagory a", "click", function (e) {
    if ($(this).attr("href") === "#") {
      $("#statusList").unbind();
      e.preventDefault();
      if (!$(this).hasClass("active")) {
        $(this).addClass("active").siblings().removeClass("active");
        $("#statusList").html("");
        loading.show();
        var sort = $(this).attr("data-sort");
        statusOptions.sort = sort;
        statusOptions.page = 1;
        renderStatus(statusOptions);
        if (statusOptions.source === "all" && !statusOptions.q) {
          var s = sort === "time" ? "newest" : "marrow";
          SNB.Util.saveConfig({singleStock_allCata: s});
          $(".stockNews").data("userSort", sort);
        }
      }
      return false;
    }
  });
  $(".stockNews").delegate(".returnBack", "click", function (e) {
    $(this).hide();
    $("#searchResult").hide();
    $("#statusSearch").val("");
    if (statusOptions.source === "all") {
      $("#allCata").show();
      statusOptions.sort = $("#allCata").find(".active").attr("data-sort");
    }
    if (statusOptions.source === "user") {
      $("#statusCata").show();
      statusOptions.sort = $("#statusCata").find(".active").attr("data-sort");
    }
    delete statusOptions.q;
    loading.show();
    $("#statusList").html("");
    renderStatus(statusOptions);
    return false;
  });

  function search() {
    var $search = $("#statusSearch");
    var placeholder = $search.attr("placeholder"),
      value = $search.val();

    if (value === "" || placeholder === value) {
      $search.trigger("focus");
    } else {
      $(".statusCatagory").hide();
      statusOptions.sort = "time";
      statusOptions.q = value;
      statusOptions.page = 1;
      loading.show();
      $("#statusList").html("");
      renderStatus(statusOptions);
    }
    return false;
  }

  $(".stockNews").delegate(".seachbar .glass", "click", function (e) {
    search();
  });

  $(".stockNews").on("keydown", "#statusSearch", function (e) {
    if (e.keyCode === 13) {
      search();
    }
  });

  /*
   *  if($.msie){
   *    $("#statusSearch").focus(function(e){
   *      var placeholder=$(this).attr("placeholder"),
   *          value=$(this).val();
   *
   *      if(placeholder===value){
   *        $(this).val("");
   *      }
   *    }).blur(function(e){
   *      var placeholder=$(this).attr("placeholder"),
   *          value=$(this).val();
   *
   *      if(value===""){
   *        $(this).val(placeholder);
   *      }
   *    });
   *  }
   */

  //初始化
  var hash = window.location.hash,
    isStatusHash = false;
  if (hash) {
    var temp = hash.substr(1);
    if (/^(?:\d+\w)|(all)/.test(temp)) {
      $("#" + temp).trigger("click");
    } else {
      var array = temp.split("_"),
        source = array[0],
        q = array[1];


      if (source == "status") {
        source = "user";
      }
      if (source == "trade") {
        source = "trans";
        statusOptions.sort = "time";
      }

      if (typeName[source]) {
        statusOptions.source = source;
        $(".newsTab").find("li").removeClass("active");
        $(".newsTab").find("a[data-type='" + source + "']").parent().addClass("active");
        if (q) {
          var searchContens = {
            trade: "涨|跌|交易",
            comment: "分析|解析|评论",
            notice: "财报|季报"
          }
          statusOptions.q = searchContens[q];
          $("#statusSearch").val(statusOptions.q);
        }
        if (temp === "status") {
          statusOptions.source = "all";
          statusOptions.sort = "time";
        }
        isStatusHash = true;
      }
    }
  }

  if ($.cookie("xq_is_login") && statusOptions.source === "all") {
    SNB.get('/user/setting/select.json', {types: "singleStock_allCata"}, function (ret) {
      if (ret[0]) {
        var sort = ret[0].value;
        if (sort === "marrow") {
          sort = "alpha";
        }
        if (sort === "newest") {
          sort = "time";
        }
        statusOptions.sort = sort;
        $(".stockNews").data("userSort", sort);
        if (sort === "time") {
          $("#allCata a").removeClass("active").last().addClass("active");
        }
      }
      renderStatus(statusOptions, function () {
        if (isStatusHash) {
          $('html, body').animate({
            scrollTop: $(".stockNews").offset().top - 40
          }, 200);
        }
      });
    });
  } else {
    renderStatus(statusOptions, function () {
      if (isStatusHash) {
        $('html, body').animate({
          scrollTop: $(".stockNews").offset().top - 40
        }, 200);
      }
    });
  }

  //关注股票
  $("body").on("click", "#addStock", function () {
    SNB.Util.checkLogin(function () {
      seajs.use("pages/invest/portfolio/TSNB.portfolio-util.js", function (util) {
        var promise = util.addStock(stockData.stockInfo);
        promise.done(function () {
          $(".stockFollowRelation").html('<span class="icon_small"><s class="newIcon_small_onefollow newIcon_small"></s>&nbsp;</span><span title="取消关注" class="op removeFriend" id="removeFollow">取消关注</span>');
          $(".stockOp").prepend('<a href="#" class="groupStock" style="float:left;">分组</a>');
          $(".stockOp").prepend('<a href="#" class="alertStock" style="float:left;">提醒</a>');
        }).fail(function (error) {
          if (error) {
            alert(error.error_description);
          }
        });
      });
    });
  });

  // 取消关注
  $("#removeFollow").live("click", function (e) {
    e.preventDefault();
    var dialog = SNB.dialog.deleteGroupDialog({
      isStock: true,
      id: stockData.stockInfo.symbol,
      callback: function () {
        $(".stockFollowRelation").html("<span class='op addFriendBtn' id='addStock' title='加关注'><b>＋</b>加关注</span>");
        $(".stockOp").find(".groupStock, .alertStock").remove();
      }
    });

    dialog.dialog({
      title: "删除股票"
    });
  });

  // 持仓 
  $(".stockOp").on("click", ".stockPerformance", function (e) {
    SNB.Util.checkLogin(function (e) {
      var dialog = SNB.dialog.performanceDialog({
        stock: SNB.data.quote,
        type: 1,
        callback: function (params) {
          var msg = '添加成功，可到<a href="/performance?groupid=' + params.groupId + '" target="_blank">持仓盈亏</a>&nbsp;查看所有记录';
          SNB.Util.stateDialog(msg, 3000, undefined, undefined, 300);
        }
      });

      dialog.dialog({
        modal: true,
        width: '360px',
        title: '添加持仓盈亏'
      });
    }, e);
    return false;
  });

  // 交易
  $(".stockOp").on("click", ".stockTrade", function (e) {
    var that = this,
      $broker = $(".broker-list");
    if ($broker.length) {
      if ($broker.is(":visible")) {
        $broker.slideUp("fast");
      } else {
        $broker.slideDown("fast");
      }
    } else {
      SNB.get("/app/broker_info/list.json", {agent: "web", symbol: symbol}, function (ret) {
        var html = '<ul id="group-operation" class="broker-list">',
          offset = $(that).offset(),
          width = $(that).outerWidth(),
          right = $("body").outerWidth() - width - offset.left - 5,
          params = {
            code: stockData.stockInfo.code,
            xq_uid: SNB.currentUser.id
          },
          paramStr = $.param(params);

        _.each(ret, function (broker) {
          url = broker.app_callback_url;

          if (url.indexOf("?") > -1) {
            url += "&" + paramStr;
          } else {
            url += "?" + paramStr;
          }

          html += ' '
            + '<li>'
            + '<a href="' + url + '" target="_blank">' + broker.app_name + '</a>'
            + '</li>'
        });
        html += '</ul>';

        $("body").append(html);

        $(".broker-list").css({
          top: offset.top + 20,
          right: right
        });
        $(".broker-list").slideDown("fast");
      });
    }
    return false;
  });

  $('body').on("click", function (e) {
    var $broker = $(".broker-list"),
      tagName = $(e.target).prop("tagName"),
      length = $broker.has(e.target).length;

    if ((length && tagName !== "A") || $(e.target).hasClass("broker-list")) {

      return false;
    }
    $(".broker-list").slideUp("fast");
  });


  // 股票分组
  $(".stockOp").on("click", ".groupStock", function (e) {
    var symbol = stockData.stockInfo.symbol;
    SNB.Util.checkLogin(function (e) {
      seajs.use("widget/TSNB.stockgroup.js", function (stockGroup) {
        stockGroup.init({
          symbol: symbol,
          isOld: true
        })
      });
    }, e);
    return false;
  });

  // 提醒
  $(".stockOp").on("click", ".alertStock", function (e) {
    var symbol = stockData.stockInfo.symbol;
    SNB.Util.checkLogin(function (e) {
      seajs.use("widget/TSNB.stockalert.js", function (stockAlert) {
        stockAlert.init({
          symbol: symbol,
          isOld: true
        })
      });
    }, e);
    return false;
  });

  // 长的stock data 处理
  $(".stockQuote").on("mouseenter", "tbody span", function (e) {
    if ($(this).data("content")) {
      var $showDetail = $(".showDetail");
      if (!$showDetail.length) {
        $("body").append('<div class="showDetail editTip"></div>');
        $showDetail = $(".showDetail");
      }

      $showDetail.html($(this).data("content")).css({
        left: e.pageX + 10,
        top: e.pageY + 10
      }).show();
    }
  }).on("mouseout", "tbody span", function (e) {
    $(".showDetail").hide();
  });

  // 理财产品
  $(".feature-income-input").on("keyup", function () {
    var val = $.trim($(this).val()),
      num = parseFloat(val),
      rate = $(this).data("rate"),
      days = $(this).data("days"),
      $alert = $(".fp-caculate td span.alert");

    if (days == "-") {
      days = 0;
    }
    if (!_.isNaN(num)) {
      $(".feature-income").html((num * 10000 * rate * days / 365).toFixed(2));
      $alert.hide();
    } else {
      $(".feature-income").html("0.00");
      if (!val) {
        $alert.hide();
      } else {
        $alert.show();
      }
    }
  });
  $(".fp-more").on("click", "span", function (e) {
    if ($(this).hasClass("show-all")) {
      $(".fp-more-container").show();
      $(this).removeClass("show-all").addClass("fold-all").html("<i></i>收起");
    } else {
      $(".fp-more-container").hide();
      $(this).removeClass("fold-all").addClass("show-all").html("<i></i>更多");
    }

  });

  $(".update-quote").on("click", function () {
    refreshQuote();

    function AnimateRotate(d) {
      var elem = $(".update-quote img");

      $({deg: 0}).animate({deg: d}, {
        duration: 600,
        step: function (now) {
          elem.css({
            '-webkit-transform': 'rotate(' + now + 'deg)',
            '-moz-transform': 'rotate(' + now + 'deg)',
            '-ms-transform': 'rotate(' + now + 'deg)',
            '-o-transform': 'rotate(' + now + 'deg)',
            'transform': 'rotate(' + now + 'deg)'
          });
        }
      });
    }

    AnimateRotate(360);
  });

  function refreshQuote() {
    var stockid = stockData.stockInfo.stockid;

    if (stockData.stockInfo.isMF || stockData.stockInfo.isPF || stockData.stockInfo.isTP || stockData.stockInfo.isFund) {
      return false;
    }

    SNB.get("/v4/stock/quote.json", {code: stockid}, function (ret) {
      updateQuote(ret[stockid], true);
    });
  }

  function updateQuote(ret, isAll) {
    var quote;

    if (ret.quotes && ret.quotes.length) {
      quote = ret.quotes[0];
    } else {
      quote = ret;
    }

    if (isAll) {
      SNB.data.quote = quote;
      stockData.stockInfo.last_close = quote.last_close;

      if ($("#quote-high").length) {
        //期权类型，不截取小数后四位
        var high = noChangeDecimal_2(quote.high, isB);
        if (quote.type && parseInt(quote.type) === 25 || parseInt(quote.type) === 32) {
          high = quote.high;
        }
        $("#quote-high").html(high);
      }

      if ($("#quote-low").length) {
        //期权类型，不截取小数后四位
        var low = noChangeDecimal_2(quote.low, isB);
        if (quote.type && (parseInt(quote.type) === 25 || parseInt(quote.type) === 32)) {
          low = quote.low;
        }
        $("#quote-low").html(low);
      }

      if ($("#quote-marketCapital").length) {
        $("#quote-marketCapital").html(SNB.Util.decimal_2(quote.marketCapital) + (isFund ? "元" : ""));
      }

      if ($("#quote-liutongshizhi").length) {
        $("#quote-liutongshizhi").html(SNB.Util.decimal_2(quote.liutongshizhi));
      }

      if ($("#quote-volume").length) {
        var append = "股";
        var volume = SNB.Util.decimal_2(quote.volume);

        if (volume && parseFloat(volume) === 0.00) {
          volume = '-';
          append = '';
        } else if (quote.type && parseInt(quote.type) === 25) {
          append = "张";
          volume = quote.volume;
        }
        $("#quote-volume").html(volume + append);
      }
    }

    var noParse = {
      current: 1
    };

    var noChange = {
      //change: 1,
      percentage: 1,
      afterHoursPct: 1,
      afterHoursChg: 1,
      afterHours: 1
    };

    if (SNB.data.quote.type && parseInt(SNB.data.quote.type) === 25) {
      //期权类型，不转换当前价，涨跌额
      noParse.change = 1;
    } else {
      noChange.change = 1;
    }

    if (stockData.stockInfo.isFund) {
      noParse.change = 1;
    }
    if (symbol.indexOf("SH900") > -1) {
      noParse.change = 1;
    }
    if (!stockData.stockInfo.isMF) {
      for (var key in quote) {
        if (noParse[key]) {
          if (key == "current" && stockData.stockInfo.type == "回购") {
            quote[key] = parseFloat(quote[key]).toFixed(3);
          } else if (key == "current" && (stockData.stockInfo.isTP)) {
            quote[key] = parseFloat(quote[key]).toFixed(4);
          } else if (key == "current" && stockData.stockInfo.isPF) {
            quote[key] = parseFloat(quote[key]).toFixed(4);
          } else if (key == "current" && SNB.data.quote.type == 25) {
            quote[key] = parseFloat(quote[key]).toFixed(4);
          } else if (key == "change" && SNB.data.quote.type == 25) {
            quote[key] = parseFloat(quote[key]).toFixed(4);
          } else if ((key === "current" || key === "change") && stockData.stockInfo.isFund) {
            quote[key] = parseFloat(quote[key]).toFixed(3);
          } else if ((key === "current" || key === "change") && symbol.indexOf("SH900") > -1) {
            quote[key] = parseFloat(quote[key]).toFixed(3);
          } else {
            quote[key] = noChangeDecimal_2(quote[key], isB);
          }
        } else if (noChange[key]) {
          if (/\.\d$/.test(quote[key])) {
            quote[key] += "0";
          } else {
            quote[key] = noChangeDecimal_2(quote[key]);
          }
        }
      }
    }

    if (isAll) {
      if (stockData.stockInfo.is$) {
        var afterColor = quote.afterHoursPct > 0 ? "stockUp" : (quote.afterHoursPct < 0 ? "stockDown" : ""),
          afterHours = quote.afterHours == 0 ? quote.current : quote.afterHours,
          afterChg = quote.afterHoursPct > 0 ? ( "+" + quote.afterHoursChg ) : quote.afterHoursChg,
          afterPer = quote.afterHoursPct > 0 ? ( "+" + quote.afterHoursPct ) : quote.afterHoursPct;

        //$(".afterHoursTip").html(SNB.Util.getBeforeAfterTrade(quote) + "交易&nbsp;&nbsp;");
        $(".afterHoursTip").html(SNB.Util.getBeforeAfterTradeNew(quote) + "交易&nbsp;&nbsp;");

        var afterHoursHtml = ''
          + '<span id="afterHoursData" class="' + afterColor + '">'
          + stockData.stockInfo.money + afterHours + '&nbsp;&nbsp;' + afterChg + '&nbsp;&nbsp;(' + afterPer + '%)'
          + '</span>';

        $("#afterHoursData").replaceWith(afterHoursHtml);
      }
    }

    var curColor = quote.percentage > 0 ? "stockUp" : ( quote.percentage < 0 ? "stockDown" : "" ),
      change = quote.percentage > 0 ? ( "+" + quote.change ) : quote.change,
      percentage = quote.percentage > 0 ? ( "+" + quote.percentage ) : quote.percentage,
      originCurrent = $(".currentInfo strong").attr("data-current"),
      lastChange = quote.current > originCurrent ? "up" : ( quote.current < originCurrent ? "down" : "" ),
      html = "<strong class='" + curColor + "' data-current='" + quote.current + "'>" + stockData.stockInfo.money + quote.current + "</strong>";

    if (lastChange) {
      $(".currentInfo").addClass(lastChange);

      setTimeout(function () {
        $(".currentInfo").removeClass(lastChange);
      }, 500);
    }

    if (stockData.stockInfo.type == "货币基金" || stockData.stockInfo.type == "信托产品" || stockData.stockInfo.type == "私募基金") {
      $(".currentInfo strong").replaceWith(html);
    } else {
      html += "<span class='" + curColor + "'><span>" + change + "</span><span class='quote-percentage'>&nbsp;&nbsp;(" + percentage + "%)</span></span>";
      $("#currentQuote .currentInfo").html(html);

      if (quote.time) {
        var dateInfo = $.trim($("#timeInfo").html()).split(" ")[0];
        $("#timeInfo").html(dateInfo + " " + parseStockTime(quote.time, stockData.stockInfo) + "&nbsp;&nbsp;");
      }

      var desType = {
          "货币基金": "基金行情,净值,新闻,公告,数据",
          "基金": "基金行情,净值,新闻,公告,数据",
          "可转债": "可转债行情,新闻,数据",
          "国债": "债券行情,新闻,数据",
          "企债": "债券行情,新闻,数据",
          "回购": "回购行情,新闻,数据",
          "股票": "股票股价,行情,新闻,财报,数据",
          "指数": "股票股价,行情,新闻,财报,数据",
          "比特币": "比特币价格,行情,新闻,数据",// bitcoin类型是40
          '信托产品': '信托产品, 行情, 新闻, 数据',
          "理财产品": "新闻,数据"// bitcoin类型是40
        },
        postfix = desType[stockData.stockInfo.stockType] + " - 雪球";

      document.title = stockData.stockInfo.name.replace(/&#039;/ig, "'").replace(/&amp;/ig, "&") + " " + quote.current + " (" + percentage + "%) (" + quote.symbol + ") " + postfix;
    }
  }

  function noChangeDecimal_2(decimal, isB) {//仅精确至小数点后两位
    if (isB) {
      return decimal;
    }

    if (decimal === "") {
      return "0.00";
    }

    var f_x = parseFloat(decimal);
    return f_x.toFixed(2);
  }

  function parseStockTime(time, stock) {
    if (time) {
      var timeInfo = stock.is$ ? "(美东时间)" : "(北京时间)",
        tempArray = time.split(" ");

      return tempArray[3] + " " + timeInfo;
    } else {
      return "-";
    }
  }

  var currentQuoteInterval;

  function currentQuote() {
    var market = stockType.bigType;

    if (market == "基金" || market == "指数") {
      market = "沪深";
    }

    //改成9点15分开始刷盘口数据
    var time = SNB.Util.getTradeTime(market, "09:15:00");

    if (time.phase == "before") {
      setTimeout(function () {
        currentQuote();
      }, time.ts);
    } else {
      if (time.phase == "end" && currentQuoteInterval) {
        clearInterval(currentQuoteInterval);
      } else {
        if (!currentQuoteInterval) {
          var ts = 2000;
          currentQuoteInterval = setInterval(function () {
            currentQuote();
            if (time.phase == "end") {
              return false;
            }

            if (!stockData.stockInfo.isFundChart) {
              SNB.get("/v4/stock/quotec.json", {code: symbol}, function (ret) {
                var keys = ["current", "change", "percentage", "time"],
                  tempQuote = ret[symbol],
                  quote = {};

                _.each(keys, function (key, index) {
                  quote[key] = tempQuote[index];
                });
                quote.symbol = symbol;

                updateQuote(quote);
                renderPankou();

                if (SNB.chart && SNB.chart.refreshQuotec) {
                  SNB.chart.refreshQuotec(quote.current);
                }
              })
            }
          }, ts);
        }
      }
    }
  }

  if (stockData.stockInfo.exchange == "港股") {
    // 港股免责声明
    seajs.use("widget/TSNB.risk.js", function (risk) {
      risk.init();
    });
  } else {
    setInterval(function () {
      refreshQuote();
    }, 60000);

    currentQuote();
  }

  refreshQuote();

  $(window).focus(function () {
    if (stockData.stockInfo.exchange != "港股") {
      refreshQuote();
    }
  });

  // 编辑器
  require.async('SNB.editor.js', function (editor) {
    var $mainEditor = $('#main-editor'),
      $body = $('body');

    function submitStatus() {
      var ta = $mainEditor.data('ta');

      if (ta.submitting) {
        return false;
      }

      var $title = $('body.main-editor-mode #main-editor>.editor input.title'),
        title = $title.is(':visible') ? $title.val() : '',
        content = ta.getContent();

      if (title === $title.attr('placeholder')) {
        title = '';
      }

      if (SNB.Util.getWordsCount(title) > 30) {
        SNB.Util.failDialog('标题超出' + (SNB.Util.getWordsCount(title) - 30) + '个字', false, false, 1500);

        return false;
      }

      content = SNB.Util.cleanContent(content, false, ta.editor, false, true);

      if (!content || SNB.Util.isContentSame(content, textValue)) {
        SNB.Util.failDialog('请填写你的看法之后再发布', 240)
        return false;
      }

      var pasted = editor.pasteImages(ta.editor, content);

      if (pasted.upload) {
        ta.editor.body.innerHTML = pasted.html;
      }

      if (ta && ta.uploadStatus()) {
        SNB.Util.failDialog('正在上传图片，请稍候...', false, false, 1500);

        return false;
      }

      if (SNB.Util.getWordsCount(content) > SNB.Util.MAX_LONG_STATUS_WORDS) {
        SNB.Util.failDialog('讨论最长不能超过' + SNB.Util.MAX_LONG_STATUS_WORDS + '字', 220, false, 1500);

        return false;
      }

      ta.submitting = true;
      ta.$textarea.data('title', '');

      SNB.Util.updateStatus({
        status: content,
        title: title
      }, function (ret) {
        ta.submitting = false;
        $title.val('');

        if ($body.hasClass('main-editor-mode')) {
          $body
            .removeClass('main-editor-mode');

          $(window)
            .off('resize.fullEditor');
        }

        var st = $(window).scrollTop(),
          sst = $('#main-editor').offset().top + 150;

        if (st > sst) {
          $(window).scrollTop(sst);
        }

        if (ta.editor) {
          ta.editor.setMinFrameHeight(70);
        }

        ta.reset(textValue);

        if (SNB.data.collection) {
          SNB.data.collection.add(ret);
          SNB.data.collection.trigger("addStatuses", [SNB.data.collection.get(ret.id)]);
        }
      }, function (ret) {
        ta.submitting = false;
      });
    }

    var le = SNB.store.get('editor');

    if (le) {
      SNB.store.remove('editor');
    }

    // SNB.editor.js LN 1374
    editor.main($mainEditor, le || {}, submitStatus, true, true, true);
    $mainEditor.data("ta").reset(textValue);
  });

  (function () {
    var isControl = false;
    $("#status-box").keydown(function (e) {
        if (e.keyCode == 17 || e.keyCode == 91) {
          isControl = true;
        }

        if (isControl && e.keyCode === 13) {
          submitStatus();
          return false;
        }
      })
      .keyup(function (e) {
        if (e.keyCode == 17 || e.keyCode == 91) {
          isControl = false;
        }
      })

    if (window._hmt) {
      if (stockType.bigType === "基金" || stockType.bigType === "货币基金") {
        _hmt.push(['_trackEvent', "基金", "页面加载", "个股页面", symbol]);

        $("body").on("click", ".stockLinks a", function (e) {
          _hmt.push(['_trackEvent', "基金", "点击", "个股页面", "左侧链接"]);
        });

        $("body").on("click", ".stock-activeUser a", function (e) {
          _hmt.push(['_trackEvent', "基金", "点击", "个股页面", "影响力"]);
        });

        $("body").on("click", ".stock-follows a", function (e) {
          _hmt.push(['_trackEvent', "基金", "点击", "个股页面", "关注人数"]);
        });

        $("body").on("click", "#alsoFollow a", function (e) {
          _hmt.push(['_trackEvent', "基金", "点击", "个股页面", "大家还关注"]);
        });

        $("body").on("click", "#relatedIndustry a", function (e) {
          _hmt.push(['_trackEvent', "基金", "点击", "个股页面", "相关行业"]);
        });

        $("body").on("click", "#statusList a", function (e) {
          _hmt.push(['_trackEvent', "基金", "点击", "个股页面", "讨论"]);
        });

      }
    }
  })();

  $('body').click(function (e) {
    if (!$(e.target).parents('.set-sub-menu').length) {
      $('.set-sub-menu').hide();
    }
  });
})
