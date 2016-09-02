define('SNB.base.js', ["lib/store","dialog-with-buttonLink.jade.js"], function (require, exports, module) {//常用的全局变量
  window.$win = $(window)
  window.$doc = $(document)
  window.$body = $('body')
  window.baidu = {} // baidu 作为全局变量，方便 cleanContent 内拿到 UE 对象
  if(!SNB.currentUser){
    SNB.currentUser={
      isGuest:true
    }
  }
  Date.now = Date.now || function() { return +new Date; };

  Backbone.sync = function (method, model, options) {
    var getUrl = function(object) {
      if (!(object && object.url)) return null;
      return _.isFunction(object.url) ? object.url() : object.url;
    };

    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
    if (!options.url) {
      options.url = getUrl(model) || urlError();
    }
    options.dataType = 'jsonp'
    options.data = options.data || {}
//    options.data.access_token = SNB.Util.getAccessToken()
    return $.ajax(options);
  };

  // inject $.ajax start
  if (!$.ajax._xq) {
    var _ajax = $.ajax;
    $.ajax = function (url, options) {
      // If url is an object, simulate pre-1.5 signature
      if (typeof url === "object") {
        options = url;
        url = undefined;
      }
      // Force options to be an object
      options = options || {};
      //options.type = 'string' === typeof(options.type) ? options.type : 'get';

      var _url = url || options.url;

      var urlFlag = 'string' === typeof(_url) && _url.replace('http://', '').replace('https://', '').indexOf('im') === -1;
      var typeFlag = 'string' === typeof(options.type) && 'post' === options.type.toLowerCase();
      var defaultFlag = !options.type && jQuery.ajaxSettings.type && 'post' === jQuery.ajaxSettings.type.toLowerCase();

      if ((defaultFlag || typeFlag) && urlFlag) {
        var deferred = $.Deferred();
        var promise = deferred.promise();
        var api = options.url;

        if ('/service/poster' === _url.replace('http://xueqiu.com', '').replace('https://xueqiu.com', '')) {
          api = options.data.url || options.url;
        }

        var _xhr = _ajax.call($, '/service/csrf', {
          data: {
            api: api
          },
          type: 'get'
        });

        promise.abort = function () {
          _xhr.abort();
        };

        _xhr.always(function (resp) {
          if (resp.token) {
            options.data.session_token = resp.token;
          }
          _xhr = _ajax.call($, url, options);
          _xhr.success(function () {
            deferred.resolve.apply(deferred, [].slice.call(arguments));
          }).fail(function () {
            deferred.reject.apply(deferred, [].slice.call(arguments));
          });
        });
        promise.success = promise.done;
        return promise;
      }
      return _ajax.call($, url, options);
    };
    $.ajax._xq = true;
  }
  // inject $.ajax end

  $.ajaxSetup({
    cache: false
  });
  $.ajaxSetup({
    type: 'POST',
    headers: { "cache-control": "no-cache" }
  });

  if (window.AndroidJsObject && window.AndroidJsObject.doRequest) {
    $.ajax = function (options) {
      try {
        if (options && typeof options.data === "string") {
          options.data = parseParams(options.data);
        }
      } catch (e) {
        alert(e.message);
      }

      var url = options.url,
        params = JSON.stringify(options.data);

      if (url.indexOf("http") === -1) {
        url = "http://xueqiu.com" + url;
      }

      var res = window.AndroidJsObject.doRequest(url, params, options.type);
      var resObj = $.parseJSON(res);

      if (resObj.error_code) {
        if (options.error) {
          options.error(resObj);
        }
      } else {
        if (options.success) {
          options.success(resObj);
        }
      }

      if (options.complete) {
        options.complete(resObj);
      }
    };
  }

  if( navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i)
    ) $.browser.isMobile = true;
  if (navigator.userAgent.match(/iPad/i)) $.browser.isPad = true
  if (!$.browser.isMobile && !$.browser.isPad) $.browser.isPC = true
  $.browser.supportUpload = (function () {
    var ipt = document.createElement('input')
    ipt.setAttribute('type', 'file')
    return ipt.type != 'text' && !ipt.disabled
  }())

  ;(function($) {
    if ($.browser.webkit) { $body.addClass('webkit') }
    if ($.browser.mozilla) { $body.addClass('moz') }
    if ($.browser.msie) { $body.addClass('ms') }
    if (typeof SNB == 'undefined') {
      SNB = {
        Views: {},
        Templates: {},
        Models: {}
      };
    }

    SNB.run = SNB.log = SNB.error = SNB.debug = function () {}
    if (SNB.env && SNB.env != 'production') { // 非 production 环境有 SNB.run()
      SNB.run = function () {
        /* 默认为 development 环境
         * SNB.run('test', function () ...) 在 test 环境运行
         * 在多个环境可以用 SNB.run(['test', 'development'], function () ...)
         * 或 SNB.run('test', 'development', function () ...)
         */
        var args = Array.prototype.slice.call(arguments)
          , envs = []
        func = args.pop()
        if (!args.length) envs = ['development']
        else if (typeof args[0] == 'string') envs = args
        else if (args[0] instanceof Array) envs = args[0]
        if (~_.indexOf(envs, SNB.env)) func()
      }
    }

    SNB.run('development', function () { // 仅 development 环境有 SNB.log/error/debug
      SNB.log = function (s) { window.console && console.log(s) }
      SNB.error = function (s) { window.console && console[console.error ? 'error' : 'log'](s) }
      SNB.debug = function (str) { window.console && SNB.error('DEBUG: ' + str) }
    })
    if (!window.console) { // 防止 IE8 报错
      window.console = { log: function () {} }
    }
    SNB.logger = function(data){
      if (typeof data == 'string') {
        data = {
          event: data,
          time: (new Date()).getTime() - WATCH.pageStart
        }
      }
      $.post("/service/logger", data)
    }
    //先放在这里。回头重构的时候丢到 node 去做。
    if ($.cookie("xq_is_login")) {
      $.cookie("last_account", null, {path: '/'});
    }
    if(!SNB.get){
      SNB.get = function(url, data, callback, error_callback) {
        var dataType="json";
        if (typeof data == 'function') {
          error_callback = callback
          callback = data
          data = {}
        }
        if (data == '') {
          data = {};
        }
//        data.access_token = SNB.Util.getAccessToken()
        if (url.search('http://api.xueqiu.com') == 0) {
          url = url.substr(21)
        };
        if(url.search('https://') == 0){
          dataType="jsonp";
        }
        if(location.host.match(/imeigu.com/i)){
          url = "http://xueqiu.com" + url;
          dataType="jsonp";
        }
        var xhr = $.ajax({
          url: url,
          data: data,
          type: "GET",
          dataType: dataType,
          success: function (ret) {
            var suc_ret = typeof ret !== "object" ? $.parseJSON(ret) : ret;
            callback && callback(suc_ret)
          },
          error: function (ret) {
            var errorObj = ret.responseText;
            if (typeof errorObj !== "object") {
              errorObj = $.parseJSON(errorObj);
            }
            if (errorObj && (errorObj.error_code == '400016' || errorObj.error_code == '400013')) {
              $.get('/user/is_login?prev_url=' + url + '&error_code=' + errorObj.error_code).done(function (ret) {
                if (!ret || ret.logout) {
                  location.href = '/user/clearCookie?_=' + (+new Date).toString(36);
                } else {
//                  error_callback && error_callback(errorObj);
                  error_callback && error_callback({});
                }
              }).fail(function () {
                location.href = '/user/clearCookie?_=' + (+new Date).toString(36);
              });
            } else if (errorObj && errorObj.error_code === "10022") {
              SNB.currentUser = {isGuest: true}
              SNB.Util.checkLogin(function () {
                SNB.get(url, data, callback, error_callback)
              })
              return;
            }
          }
        })
        return xhr
      }
    }

    (function () {
      var img = new Image();

      SNB.isSupportHttps = false;

      img.onload = function () {
        SNB.isSupportHttps = true;
      };

      img.onerror = function () {
        SNB.isSupportHttps = false;
      };

      img.src = '//xueqiu.com/blank.png?_' + (+new Date());
    })();

    SNB.post = function(url, data, callback, error_callback) {
      var https = {
        '/provider/oauth/token': true,
        '/account/signup_by_email.json': true,
        '/account/change_password.json': true
      };

      if (typeof data == 'function') {
        callback = data;
        error_callback = callback;
        data = {};
      }

//      data.access_token = SNB.Util.getAccessToken();
      data._ = new Date().getTime();

      var uri = '/service/poster';

      if (SNB.isSupportHttps && SNB.env != 'development' && https[url]) {
        uri = 'https://xueqiu.com/service/poster';
      }

      return $.ajax({
        url: uri,
        data: {
          url: url,
          data: data
        },
        type: "POST",
        success: function(ret){
          if (typeof ret !== 'object') {
            ret = $.parseJSON(ret);
          }
          callback && callback(ret)
        },
        error: function(ret){
          var errorObj = ret.responseText;
          if(typeof errorObj !== "object"){
            errorObj = $.parseJSON(errorObj);
          }
          if(errorObj && errorObj.error_code === "10022"){
            SNB.currentUser = {isGuest: true}
            SNB.Util.checkLogin(function(){
              SNB.post(url,data,callback,error_callback)
            })
            return;
          }
          error_callback && error_callback(errorObj);
        }
      })
    }

    var origParse = Date.parse;
    Date.parse = function(date) {
      var timestamp = origParse(date),
        minutesOffset = 0,
        struct;
      if (isNaN(timestamp) && /\+|-/.test(date)) {
        date = date.replace(/(\+|-)/g, 'UTC$1');
        timestamp = origParse(date);
      }
      return timestamp;
    };
    (function() {
      this.getFullMonth = function() {
        var month = this.getMonth() + 1;
        month = month < 10 ? '0' + month: month;
        return month;
      };
      this.getFullDate = function() {
        var date = this.getDate();
        date = date < 10 ? '0' + date: date;
        return date;
      };
      this.getFullHours = function() {
        var h = this.getHours();
        h = h < 10 ? '0' + h: h;
        return h;
      };
      this.getFullMinutes = function() {
        var m = this.getMinutes() + 1;
        if (m == 60) {m = 59}
        m = m < 10 ? '0' + m: m;
        return m;
      };
    }).call(Date.prototype);

    $.extend({
      getParam: function(str) {
        var url = str || window.location.search;

        url = url.indexOf('?') !== -1 ? url.substring(url.indexOf('?') + 1) : url;

        var urlParams = decodeURIComponent(url);

        if (urlParams == false || urlParams == '') {
          return null;
        }

        var pairs = urlParams.split("&");

        var keyValue_Collection = {};
        for (var i=0; i<pairs.length; i++) {
          var equalsignPosition = pairs[i].indexOf("=");

          if (equalsignPosition == -1) {
            keyValue_Collection[ pairs[i] ] = ''; //you could change the value to true as per your needs
          } else {
            keyValue_Collection[ pairs[i].substring(0, equalsignPosition) ] = pairs[i].substr(equalsignPosition + 1);
          }
        }
        // for in trap on IE
        //for(var value in pairs) {
        //  var equalsignPosition = pairs[value].indexOf("=");

        //  if (equalsignPosition == -1) {
        //    keyValue_Collection[ pairs[value] ] = ''; //you could change the value to true as per your needs
        //  } else {
        //    keyValue_Collection[ pairs[value].substring(0, equalsignPosition) ] = pairs[value].substr(equalsignPosition + 1);
        //  }
        //}
        return keyValue_Collection;
      }
    })

    $.extend($.fn, {
      found: function(callback, notFoundCallback) {
        if (this.length) {
          var $this = $(this)
          callback.call($this, $this)
        } else if (notFoundCallback) {
          this.notFound(notFoundCallback)
        }
        return this
      }
      , notFound: function(callback) {
        if (!this.length) callback()
        return this
      }
      , findOrAppend: function(selector, template, locals, callback) {
        var $el = $.fn.find.call(this, selector)
        if ('function' === typeof locals) {
          callback = locals
          locals = {}
        }
        if (!$el.length) {
          locals = locals || {}
          $el = $('function' === typeof template ? template(locals) : template).appendTo(this)
          callback && callback.call($el, $el, true)
        } else {
          callback && callback.call($el, $el, false)
        }
        return this
      }
      , reverse: Array.prototype.reverse
    });

    SNB.Pager = function(page, maxPage, options) {
      var pagerHtml = "<div class='pager-wrapper'><ul class='pager'>",
        adjPager = "",
        lastPage = page - 2,
        more_query = "";
      var params = $.getParam() || {};
      var _nextpageHtml = "";
      page = typeof page === "string" ? parseInt(page) : page;
      maxPage = typeof maxPage === "string" ? parseInt(maxPage) : maxPage;

      if(typeof options !== "undefined"){
        _.map(options,function(val,key){
          params[key] = val
        })
      }
      if ($.isPlainObject(params)) {
        delete params.page;
        delete params.jump;
        $.map(params, function(val, key){
          more_query += "&" + encodeURIComponent(key)+ '=' + encodeURIComponent(val);
        });
      }
      while (lastPage <= maxPage && ((lastPage - page) <= 2 || lastPage <= 5)) {
        if (lastPage > 0) {
          adjPager += "<li" + (lastPage === page ? " class='active'": "") + "><a data-page='" + lastPage + "' href='?page=" + lastPage + more_query+ "'>" + lastPage + "</a></li>";
        }

        lastPage ++;
      }
      if (page != 1) {
        pagerHtml += "<li class='last'><a data-page='" + (page - 1) + "' href='?page=" + (page - 1) + more_query+  "'><span>上一页</span><i></i></a></li>";
        if (page > 3) {
          pagerHtml += "<li><a data-page='" + 1 + "' href='?page=1" + more_query + "'>1</a></li>";
          if (page > 4) {
            pagerHtml += '<li>...</li>';
          }
        }
      }
      pagerHtml += adjPager;
      if (page != maxPage) {
        if ((page + 2) < maxPage) {
          if ((page + 3) < maxPage) {
            pagerHtml += "<li>...<li>";
          }
          if(lastPage-maxPage!==1){
            pagerHtml += "<li><a data-page='" + maxPage + "' href='?page=" + maxPage + more_query + "'>" + maxPage + "</a></li>";
          }
        }
        _nextpageHtml = "<li class='next'><a data-page='" + (page + 1) + "' href='?page=" + (page + 1) + more_query + "'><span>下一页</span><i></i></a></li>";
      }
      // console.log(options);
      maxPage>4 && options && options.jump && (_nextpageHtml = "<li title=\"输入页码 按Enter 进行跳转\" class=\"jump_input\"><input style=\"padding: 6px 0; border: 1px solid #ccc; font-size: 13px; width: 40px; text-align: center;\"></li>"+_nextpageHtml)
      pagerHtml += _nextpageHtml+"</ul></div>";
      return pagerHtml;
    };


    SNB.Util = {
      MAX_STATUS_WORDS: 140,
      MAX_LONG_STATUS_WORDS: 20000,
      MAX_DM_WORDS: 300,
      BBCODE_IMAGE_BASEURL: "//assets.imedao.com/images/face/",
      BBCODE_TO_TEXT: {},
      TEXT_TO_BBCODE: {},
      BBCODE_MAPPING: [['01smile', '[微笑]'], ['02smile-big', '[呵呵]'], ['03laugh', '[哈哈]'], ['04clap', '[鼓掌]'],
        ['05confused', '[困惑]'], ['06sad', '[难过]'], ['07angry', '[生气]'], ['08cute', '[可爱]'], ['09act-up', '[调皮]'],
        ['10sweat', '[汗]'], ['11good', '[赞]'], ['12bad', '[贬]'], ['13love', '[爱]'], ['14love-over', '[心碎]'],
        ['15rose', '[献花]'], ['16rose-dead', '[凋谢]'], ['17in-love', '[色]'], ['18kiss', '[亲亲]'], ['19poop', '[屎]'],
        ['20victory', '[胜利]'], ['21desire', '[仰慕]'], ['22moneymouth', '[贪财]'], ['23quiet', '[无语]'],
        ['24secret', '[秘密]'], ['25shut-mouth', '[闭嘴]'], ['26shame', '[害羞]'], ['27sick', '[讨厌]'], ['28dazed', '[晕]'],
        ['29question', '[疑问]'], ['30sleepy', '[困]'], ['31arrogant', '[傲慢]'], ['32curse', '[诅咒]'], ['33crying', '[哭]'],
        ['34disapointed', '[失望]'], ['35embarrassed', '[尴尬]'], ['36dont-know', '[不知道]'], ['37handshake', '[握手]'],
        ['38struggle', '[挣扎]'], ['39thinking', '[思考]'], ['40tongue', '[吐舌]'],
        // BBCODE after 40 is for editor emotions,
        // since "SNB.Util.BBCODE_MAPPING.slice(40)..." in SNB.editor.emotion.js
        ['20smile-smile', '[笑]'],
        ['21lol', '[大笑]'],
        ['14guzhang', '[鼓鼓掌]'],
        ['19qiaopi', '[俏皮]'],
        ['08jiayou', '[加油]'],
        ['23earn', '[赚大了]'],
        ['11niubi', '[牛]'],
        ['24angry', '[怒了]'],
        ['25weep', '[哭泣]'],
        ['09lose', '[亏大了]'],
        ['26sleepy', '[困顿]'],
        ['18shiwang', '[好失望]'],
        ['10han', '[滴汗]'],
        ['13why', '[为什么]'],
        ['16guile', '[跪了]'],
        ['12hand', '[摊手]'],
        ['22buxie', '[不屑]'],
        ['15xunka', '[好逊]'],
        // added for Support#5196
        ['emoji_chimian_40','[关灯吃面]'],  //1
        ['emoji_shabi_40','[呵呵傻逼]'],    //2
        ['emoji_gerou_40','[割肉]'],       //3
        ['emoji_maishen_40','[卖身]'],     //4
        ['emoji_tuxie_40','[吐血]'],       //5
        ['emoji_kelian_40','[可怜]'],      //6
        ['emoji_haixiu_40','[害羞]'],      //7
        ['emoji_koubi_40','[抠鼻]'],       //8
        ['emoji_jiong_40','[囧]'],         //9
        // end of Support#5196
        ['43kunhuo', '[好困惑]'],
        ['44sikao', '[想一下]'],
        ['45aoman', '[傲]'],
        ['17shutup', '[不说了]'],
        ['27weiguan', '[围观]'],
        ['03zan', '[很赞]'],
        ['04bian', '[不赞]'],
        ['05woshou', '[赞成]'],
        ['40cheers', '[干杯]'],
        ['36heart', '[心心]'],
        ['37heartbreak', '[心碎了]'],
        ['38flower', '[献花花]'],
        ['39shit', '[一坨屎]'],
        ['41full', '[满仓]'],
        ['42empty', '[空仓]'],
        ['34reverse', '[复盘]'],
        ['35bottom', '[抄底]'],
        ['33nengliquan', '[能力圈]'],
        ['29put', '[看空]'],
        ['30call', '[看多]'],
        ['31add', '[加仓]'],
        ['32reduce', '[减仓]'],
        ['01buy', '[买入]'],
        ['02sell', '[卖出]'],
        ['06maogugu', '[毛估估]'],
        ['07deal', '[成交]'],
        ['28moat', '[护城河]']
      ],
      personalityResult: function(resultText) {
        var w = [10, 5, 10, 10, 10, 10, 10, 10, 5, 20];
        var result = _.map(resultText.replace(/^\s+|\s+$/g, '').split(''), function(l) {
          return parseInt(l, 36)-10;
        });
        var s = _.reduce(w, function (p, c, i) {
          return p + c*result[i];
        }, 0);
        if (s <= 150) return '股市弄潮儿';
        else if (s <= 220) return '假装在投资';
        else if (s <= 270) return '奥马哈之雾';
        else return '说中文的巴菲特';
      },
      isSnowBrick:function(){
        return navigator.userAgent.match(/SnowBrick/i)
      },
      callBrick:function(parameters) {
        if (!SNB.Util.isSnowBrick()) {
          return false;
        }
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'js:' + encodeURIComponent(JSON.stringify(parameters)));
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
      },
      getAccessToken:function() {
        return $.cookie("xq_a_token") || SNB.data.access_token
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
      },
      decimal_2_noparse:function(decimal,isB){//如果是沪B的话原样返回
        if(typeof decimal==="undefined"||decimal===""){//TODO
          return "-";
        }
        if(isB){
          return decimal;
        }
        var f_x = parseFloat(decimal);
        if(f_x>0&&f_x<1){
          return f_x.toFixed(3);
        }else if(f_x>=1||f_x<=0){
          return f_x.toFixed(2);
        }
        return decimal;
      },
      upStock: function(change) {
        if(_.isUndefined(change) || _.isNull(change)){
          return "-";
        }
        change = Number(change);
        var changeString = ( Math.round(change*100)/100 ).toString();
        var pos_decimal = changeString.indexOf(".");
        if (pos_decimal < 0 ) {
          pos_decimal = changeString.length;
          changeString += ".";
        }
        while (changeString.length <= pos_decimal + 2) {
          changeString += "0";
        }
        return change > 0 ? "+" + changeString : changeString;
      },
      upDownClass: function(quote) {
        quote = Number(quote);
        if (quote > 0) {
          return "stock_up";
        } else if (quote < 0) {
          return "stock_down";
        }
        return "";
      },
      getStockInfo: function (stockid) {
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
            HKHKL: 1,
            SGXCN: 1
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

        if (stockid && ( _.indexOf(fundSymbolArray, stockid.substr(0, 5)) > -1 || _.indexOf(fundSymbolArray, stockid.substr(0, 4)) > -1)) {
          stockInfo = { money: "￥", market: "", bigType: "基金", type: "基金" };
        } else if (/^S[HZ]\d+$/.test(stockid)) {

          // SH900||SZ200为HK$B股
          if (/^SZ200/.test(stockid)) {
            stockInfo = {money: "HK$", market: "深B", bigType: "沪深", type: "股票"};

            // 回购
          } else if (/^(SH(201|202|203|204|131)|SZ(13|395032))/.test(stockid)) {
            stockInfo = {money: "￥", market: "回购", bigType: "沪深", type: "回购"};

            // 国债
          } else if (/^(SH(01|02|13)|SZ(10|09))/.test(stockid)) {
            stockInfo = {money: "￥", market: "国债", bigType: "沪深", type: "国债"};

            // 企债
          } else if (/^(SH12|SZ11)/.test(stockid)) {
            stockInfo = {money: "￥", market: "企债", bigType: "沪深", type: "企债"};

            // 可转债
          } else if (/^(SH11|SZ12)/i.test(stockid)) {
            stockInfo = {money: "￥", market: "可转债", bigType: "沪深", type: "可转债"};

            // 沪B
          } else if (/^SH900/.test(stockid)) {
            stockInfo = {money: "$", market: "沪B", bigType: "沪深", type: "股票"};

            // 指数
          } else if (/^(SH00|SZ399)/.test(stockid)) {//指数
            stockInfo = {money: "", market: "", bigType: "沪深", type: "指数"};

            // 普通股票
          } else {
            stockInfo = {money: "￥", market: "A股", bigType: "沪深", type: "股票"};
          }
        } else if (/CSI\d+/.test(stockid)) {
          // 雪球精选指数
          stockInfo = {money: "", market: "", bigType: "沪深", type: "指数"};
          // 货币基金
        } else if (/^MF\d+$/.test(stockid)) {
          stockInfo = {money: "￥", market: "MF", bigType: "货币基金", type: "货币基金"};

          // 新加的基金
        } else if (/^F\d+$/.test(stockid)){
          stockInfo = {money: "￥", market: "F", bigType: "基金", type: "基金"};
          // 信托产品
        } else if (/^TP\d+$/.test(stockid)) {
          stockInfo = { money: "￥", market: "TP", bigType: "信托产品", type: "信托产品" };

          // 国债期货
        } else if (/^[\d\w]+\.FM$/.test(stockid)) {
          stockInfo = { money: "￥", market: "FM", bigType: "国债期货", type: "国债期货" };

          // 私募基金
        } else if (/^P\d+$/.test(stockid)) {
          stockInfo = { money: "￥", market: "P", bigType: "私募基金", type: "私募基金" };

          if (stockid === "P000057") {
            stockInfo.money = "$";
          }

          // 理财产品
        } else if (/^FP\d+$/.test(stockid)) {
          stockInfo = { money: "￥", market: "FP", bigType: "理财产品", type: "理财产品" };

          // 投资组合
        } else if (/^ZH\d{6}$/.test(stockid)) {
          stockInfo = { money: "￥", market: "ZH", bigType: "投资组合", type: "投资组合" };

          // 港股
        } else if (/^\d+$/.test(stockid)) {
          stockInfo = { money: /^8/.test(stockid) ? "￥" : "HK$", market: "港股", bigType: "港股", type: "股票" };

          // 指数
        } else if (specialHKStocks[stockid] || USIndexes[stockid]) {//指数
          stockInfo = { money: "", market: "", bigType: "指数", type: "指数" };

          // 新三板
        } else if (/^OC\d{6}$/.test(stockid)) {//指数
          stockInfo = {money: "￥", market: "A股", bigType: "沪深", type: "股票"};

          // bitcoin 美股
        } else {
          var bitcoin = bitcoins[stockid];

          if (bitcoin) {
            stockInfo = { money: bitcoin.money, market: bitcoin.market, bigType: "比特币", type: "比特币" };
          } else {
            stockInfo = { money: "$", market: "美股", bigType: "美股", type: "股票" };
          }
        }
        return stockInfo;
      },
      parseTime: function(time, render) {
        var curTime = new Date();
        var fromTime;

        if (typeof time === 'object') {
          fromTime = time;
        } else {
          time = typeof render == 'function' ? render(time) : time

          fromTime = new Date()
          fromTime.setTime(time)
          if (fromTime == 'Invalid Date') {
            fromTime.setTime(parseInt(time))
          }
        }



        var beforeSeconds = (curTime.getTime() - fromTime.getTime()) / 1000;
        var format, day, h, m, month;
        month = fromTime.getFullMonth();
        day = fromTime.getFullDate();
        h = fromTime.getFullHours();
        m = fromTime.getFullMinutes();

        if (curTime.getYear() != fromTime.getYear()) {
          format = fromTime.getFullYear() + '-' + month + '-' + day + ' ' + h + ':' + m;
        } else if (curTime.getMonth() != fromTime.getMonth() || curTime.getDate() != fromTime.getDate()) {
          format = month + '-' + day + ' ' + h + ':' + m;
        } else if (beforeSeconds < 60) {
          beforeSeconds = beforeSeconds < 3 ? 3: beforeSeconds;
          format = Math.ceil(beforeSeconds) + '秒前';
        } else if (beforeSeconds < 3600) {
          format = Math.ceil(beforeSeconds / 60) + '分钟前';
        } else {
          format = '今天 ' + h + ':' + m;
        }
        return format;
      },
      getTimestamp: Date.now || function(){
        return new Date().getTime()
      },
      pdfLink: function ($fv, href,title) {
        var pdf = $fv.data('pdf')
          , $div = $('<div class="zoom-pdf-box"></div>')
        if (pdf && !$fv.next().is('div.zoom-pdf-box')) {
          $div.append('<a class="zoom" href="' + href + '/pdf' +
            '" target="_blank"><i></i><span>全屏查看</span></a>');
          var pdfExt = title ? '.pdf' : '';
          $div.append('<a class="zoom download" target="_blank" ' +
            'href="/stockreport/download?name=' + pdf +
            '&_upd='+title+pdfExt+'" target="_blank" data-toggle="download"><i></i><span>下载查看</span></a>')
          $fv.after($div)
        }
      },
      statusPdf: function (status) {
        if (status.retweeted_status) return status
        var pdfLinkReg = /<a href=['"]?(\/\/(xqdoc.b0.upaiyun.com|doc.xueqiu.com|xqdoc.imedao.com|u.xqdoc.imedao.com)\/([^'"\s]+)\.pdf)['"\s][^>]*>[^<]+<\/a>$/i
        status.pdfRemovedContent = status.text.replace(pdfLinkReg, function (all, p1, p2, p3) {
          status.pdfLink = p1
          status.pdf = p3
          return ''
        })
        status.description = status.description.replace(pdfLinkReg, '')
        return status
      },
      showTip: function (name, $tip, $close) {
        var store = SNB.store || require('./lib/store')
          , tipStatus = store.get('tip:' + name)
          , setShow = function () {
            store.set('tip:' + name, 's')
            if (!SNB.currentUser.isGuest) SNB.get('/tips/status/update.json', { source: name, status: 's' })
          }
          , setHide = function () {
            store.set('tip:' + name, 'h')
            if (!SNB.currentUser.isGuest) SNB.get('/tips/status/update.json', { source: name, status: 'h' })
          }
        $tip.hide()
        $tip.data('setShow', setShow)
        $tip.data('setHide', setHide)
        if (!tipStatus) {
          if (SNB.currentUser.isGuest) {
            tipStatus = 's'
          } else {
            SNB.get('/tips/status/show.json?source=' + name, function (data) {
              var s = data.tips_statuses
              if (s.length && s[0].status != 's') {
                tipStatus = 'h'
              } else {
                tipStatus = 's'
              }
              store.set('tip:' + name, tipStatus)
            })
          }
          showTip(tipStatus)
        } else showTip(tipStatus)
        function showTip (showOrHide) {
          if (showOrHide !== 's') return
          $tip.fadeIn()
          $close.off('click.closeTip').on('click.closeTip', function (ev) {
            $tip.fadeOut()
            setHide()
          })
        }
      },
      pdfFullscreenHint: function ($fv) {
        if (!$fv || !$fv.length) return
        $fv.findOrAppend('.fullscreen-hint', '<div class="fullscreen-hint dropdown-menu"><span>提示：点击此处以全屏模式查看</span><span class="close-button">X</span></div>', function ($fh) {
          SNB.Util.showTip('pdf_fullscreen', $fh, $fh.find('.close-button'))
        })
      },
      pdfViewer: function (id, pdfFileName) {
        seajs.use(['flexpaper.js', 'flexpaper_handlers.js'], function () {
          var $fp = $('#' + id)
          $fp.FlexPaperViewer({
              config : {
                SWFFile : '//xqdoc.imedao.com/' + pdfFileName + '.swf',
                key : "$ffc627e4203219a906c",

                Scale : 0.6,
                ZoomTransition : 'easeOut',
                ZoomTime : 0.5,
                ZoomInterval : 0.2,
                FitPageOnLoad : false,
                FitWidthOnLoad : true,
                PrintEnabled : false,
                FullScreenAsMaxWindow : false,
                ProgressiveLoading : true,
                MinZoomSize : 0.2,
                MaxZoomSize : 5,
                SearchMatchAll : false,
                InitViewMode : 'Portrait',
                RenderingOrder : 'flash,html',
                StartAtPage : '',

                ViewModeToolsVisible : false,
                ZoomToolsVisible : true,
                NavToolsVisible : true,
                CursorToolsVisible : false,
                SearchToolsVisible : false,
                WMode : 'opaque',
                localeChain: 'zh_CN'
              }}
          );
          var $m = $fp.siblings('.flexpaper_mask')
          if (!$m.length) return
          var $loaded = $m.find('.fp_loaded')
            , $total = $m.find('.fp_total')
            , show = function () {
              if ($fp.data('mask_removed')) return
              $fp.data('mask_removed', true)
              setTimeout(function () {
                $loaded.text('0%')
                $m.find('.flexpaper_hint').hide()
                $m.fadeOut(function () {
                  $fp.data('mask', $m.detach())
                })
              }, 800)
            }
            , ratio
          $fp.data('show', show)
          $fp.on('onProgress', function (ev, loaded, total) {
            loaded = parseInt(loaded, 10)
            total = parseInt(total, 10)
            ratio = loaded / total * 100 | 0
            if (ratio > 95) show()
            $loaded.text(ratio + '%')
          })
          $fp.on('onDocumentLoaded onCurrentPageChanged', show)
          setTimeout(function () {
            if (!ratio) show()
          }, 3000)
          SNB.Util.pdfFullscreenHint($fp.parent())
        })
      },
      parseContent: function(content, pasted, leadingSpace) {
        content = (content || '')
          .replace(/<!--.*?-->|&lt;!--.*?--&gt;/g, '')
          .replace(/\uF0A7|\uF020/g, '') //pdf 粘贴过来的非法字符
          .replace(/\uFEFF|\u200B/g, '') //ueditor 使用的空白字符
          .replace(/<\/?wbr[^>]*>|<\/?o:p[^>]*>|<\/?font[^>]*>|<\/?st1:[^>]*>|<\/?i(?!m)[^>]*>/gi, '') //删除不支持的标签
          .replace(/<style[^>]*>[\s\S]*?<\/style>|&lt;style.*?&gt;[\s\S]*?&lt;\/style&gt;/gi, '') //删除style标签
          .replace(/\n/g, '\r')
          .replace(/<\/tr*>/ig, '<\/tr>\n')
          .replace(/<br[^>]*>/ig, '\n')
          .replace(/<\/p>/ig, pasted ? '\n\n' : '\n')
          .replace(/([\u0020\u00a0\t\r]|&nbsp;)*<p[^>]*>|\r/gi, '')
          .replace(/^[\s\u00a0]+|([\s\u00a0]|&nbsp;)+$/gi, '')
          .replace(/([\u0020\u00a0]|&nbsp;)+(?=\n)/gi, '')

        if (!leadingSpace) content = content.replace(/^([\s\u00a0]|&nbsp;)+/gi, '');
        if (pasted) content = content.replace(/\n{2,}/g, '<br><br>')
          .replace(/<\/?strong[^>]*>/gi, '') // paste 时在这里过滤 strong
        if(pasted){
          var $pasted_div = $("<div>" + content + "</div>")
          var $url_ellipsis = $pasted_div.find(".url_ellipsis")
          if($url_ellipsis.length){
            $url_ellipsis.after("<span class='keep_whitespace'>&nbsp;&nbsp;</span>").remove()
          }
          content = $pasted_div.html()
        }
        content = content
          .replace(/\n/g, '<br>')
          .replace(/\u200B<img/g, '<img') //解决IE图片点击bug的空字符
          .replace(/<span([^>]*)>([\s\S]*?)<\/span>/gi, function(all, attrs, inner) {
            if (pasted) {
              if (attrs.match(/keep_whitespace/i)) {
                return all
              }
              return attrs.match(/_ie_paste_/i) ? all : inner
            }
            if (attrs.match(/_baidu_bookmark_/i)) return all //保留百度书签 span，否则会在主编辑器初始化时出错
            if (attrs.match(/highlight/i)) return all //保留highlight，否则会在搜索页无法出现高亮关键字
            var matched = attrs.match(/text-decoration:\s*underline/i)
            return matched ? '<span style="text-decoration: underline;">' + inner + '</span>' : inner
          })
          .replace(/([^>\s])((?:&nbsp;)+)/g, function(all, s1, s2) { return s1 + ' ' + s2.substring(6) })
        return content
      },
      reparseContent: function(content) {
        content = content || ''
        var faceReg = /<img[^>]+src=('|")\/\/js\.xueqiu\.com\/images\/face\/([^>]+)\.png\1[^>]*\/?>/ig,
          lazyImgReg = /<img[^>]+data-image="([^"]+)"[^>]*>/ig,
          linkReg = /<\/?a[^>]*>/ig,
        //替换A标签
          content = content.replace(linkReg, "");
        //face
        content = content.replace(faceReg, function(all, first, second) {
          var result;
          if ((result = SNB.Util.BBCODE_TO_TEXT[second])) return result
          else return all
        });
        //lazy loading images
        content = content.replace(lazyImgReg, '<img class="ke_img" src="$1" />');
        // 转义防止 xss
        //content = content.replace(/&/g, '&amp').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        return content;
      },
      cleanContent: function(content, keepBookmark, editor, pasted, leadingSpace) {
        content = content || ''
        if (editor) {
          if (window.UE) content = UE.pasteFilter(content, editor)
          if (editor.ta && !editor.ta.$uew.parent().is('.editor, .editor-wrapper')) //非主编辑器去掉图片
            content = content.replace(/<img([^>]+)>/gi, '')
        }
        content = SNB.Util.parseContent(content, pasted, leadingSpace)
        var $el = $('<div>'+content+'</div>')
        if (!$.trim($el.text()).length && !$el.find('img').length) return ''

        if (!keepBookmark)
          $el.find('span').each(function(i, el) {
            if (/^_baidu_bookmark_/.test(el.id)) $(el).remove()
          }) // 正常应该不存在书签 span，以防万一
        $el.find('img.ke_img_paste').remove()
        $el.find('img.ke_img[src*=".xueqiu.com/images/blank.png"]').remove()
        $el.find('.url_invisible').remove()
        content = $el.html()

        var reg = /<img[^>]+class="?ke_img[^>]*>/ig
        content = content.replace(reg, function(all) {
          var matched = all.match(/src="?([^"\s]+)/i)
          if (matched) return '<img class="ke_img" src="' + matched[1] + '" />'
          else return all
        })

        content = content.replace(/<([uo]l)([^>]*)>/ig, function(all, tag, attr) {
          var match
          if ( (match = attr.match(/style="[^"]+"/)) ) {
            return '<'+tag+' '+match[0]+'>'
          }
          return '<'+tag+'>'
        }) //数据出现 <ul ... /> 的bug
        return content
      },
      isContentSame: function(a, b) {
        a = a.replace(/\s|\u00a0|\u0020|&nbsp;/g, '')
        b = b.replace(/\s|\u00a0|\u0020|&nbsp;/g, '')
        return a == b
      },
      htmlizeContent: function(content) {
        content = content || ''
        content = content.replace(/\r\n?|\n/g, '<br>')
        content = content.replace(/&lt;|&amp;|&quot;|&gt;/g,function(m){
          return {
            '&lt;': '<',
            '&amp;': '&',
            '&quot;': '"',
            '&gt;': '>'
          }[m]
        })
        return content
      },
      unhtml:function(str) {
        return str ? str.replace(/[&<">]/g, function(m){
          return {
            '<': '&lt;',
            '&': '&amp;',
            '"': '&quot;',
            '>': '&gt;'
          }[m]
        }) : '';
      },
      updateCount: function (content, option) {
        var reg = /\d+/ig;
        if (reg.test(content)) {
          content = content.replace(reg, function (all) {
            if (option < 0) {
              return parseInt(all) - 1;
            } else {
              return parseInt(all) + 1;
            }
          });
        } else {
          content += "(1)";
        }
        return content;
      },
      getWordsCount: function(content) {
        if ( _.isUndefined(content) ) {
          return 0;
        }
        var chars = content.split('');
        var count = 0;
        $(chars).each(function() {
          if (this.charCodeAt(0) < 256) {
            count++;
          }
        });
        var unic = content.length - count;
        return unic + Math.round(count / 2);
      },
      splitWord:function(content,length){
        if (content && content.length > length) {
          var count = 0,
            index = 0,
            chars = content.split('');

          for (var i = 0, len = chars.length; i < len; i++) {
            var cha = chars[i];
            if (cha.charCodeAt(0) < 256) {
              count += 0.5;
            } else {
              count += 1;
            }
            if (count > length) {
              return content.substr(0, index);
            }
            index++;
          }
        }
        return content;
      },

      splitWordWithElipse:function(str,length){
        var len=length||4;
        if(this.getWordsCount(str)>len){
          return this.splitWord(str,len)+"...";
        }else{
          return str;
        }
      },
      getWindowSize: function(options){
        var screenX = typeof window.screenX != 'undefined' ? window.screenX: window.screenLeft,
          screenY = typeof window.screenY != 'undefined' ? window.screenY: window.screenTop,
          outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth: document.documentElement.clientWidth,
          outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight: (document.documentElement.clientHeight - 22),
          width = typeof options !== "undefined" && typeof options.width !== "undefined"? options.width : 580,
          height = typeof options !== "undefined" && typeof options.height !== "undefined"? options.height : 355,
          left = parseInt(screenX + ((outerWidth - width) / 2), 10),
          top = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
          features = ('width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',toolbar=no,menubar=no,scrollbars=no,   resizable=no,location=no,status=no');
        return features;
      },
      dialog_vertical_middle:function(ui_dialog){
        var dialogHeight = ui_dialog.height(),
          docElem = document.documentElement,
          top = 0,
          clientHeight = docElem.clientHeight;
        top = clientHeight > dialogHeight && (clientHeight - dialogHeight) / 2;
        ui_dialog.css("top",top + $(document).scrollTop())
      },
      checkLogin: function (callback) {//new checkLogin
        if(SNB.data.is_brick) {
          return false;
        }

        var that = this,
          show_dialog = function () {
            SNB.Guest.showLoginDialog(function () {
              if (callback) {
                callback();
              }
            });
          };

        if (SNB.currentUser.isGuest) {
          if (typeof SNB.Guest !== "undefined") {
            show_dialog()
          } else {
            seajs.use("SNB.guest.js", function () {
              show_dialog()
            })
          }
        } else {
          if (callback) {
            callback();
          }
        }
      },
      insertStockAutocompletionOptions: {
        source: function(request, response){
          SNB.get("/stock/search.json", {size: 10, code: request.term}, function(data) {
            response($.map(data.stocks, function(stock){
              return {
                label: stock.name + "(" + stock.code + ")",
                name: stock.name,
                value: stock.code
              }
            }));
          })
        },
        autoFocus:true
      },
      insertStock: function (pos, callback) {
        $("#stockbox").remove()

        var dialogInsertStock = $('<div id="stockbox"/>').appendTo("body>.temp")
          , stockboxinput = $('<input type="text" class="stockboxinput" id= "stockboxinput" />').appendTo(dialogInsertStock)

        dialogInsertStock.dialog({
          modal: true,
          stack: true,
          width: "330px",
          minHeight: "54px",
          title: "请输入股票代码/中文名/英文名",
          close: function(){
            stockboxinput.val("");
            stockboxinput.autocomplete("close");
          },
          dragStart: function(){
            stockboxinput.autocomplete("close");
          },
          dragStop: function(){
            stockboxinput.autocomplete("search");
          },
          position: pos
        });

        stockboxinput.autocomplete(SNB.Util.insertStockAutocompletionOptions);

        stockboxinput.bind("autocompleteselect", function(event, ui){
          if (callback) {
            callback(ui.item);
          }
          dialogInsertStock.dialog("close");
        });
      },
      deleteDialog:function(elm,callback){
        var $target = $(elm),
          deleteDialog_html = "",
          deleteDialog = $("#dialog-delete"),
          canBlock = $target.attr("canBlock"),
          blockUserId = $target.attr("blockUserId");
        if(canBlock){
          deleteDialog_html =   '<p class="dialog-msg hasBlock">确定删除这条评论吗？</p>'
            + "<div class='block'><input type='checkbox' name='block' id='block_user'></input><label for='block_user'>将对方拉黑</label></div>"
            + '<div>'
            + '<input type="button" class="submit ok" value="确定"/>'
            + '<input type="button" class="button cancel" value="取消"/>'
            + '</div>';
        }else{
          deleteDialog_html =   '<p class="dialog-msg">确定删除这条评论吗？</p>'
            + '<div>'
            + '<input type="button" class="submit ok" value="确定"/>'
            + '<input type="button" class="button cancel" value="取消"/>'
            + '</div>';
        }

        if(deleteDialog.length===0){
          $("body").append('<div id="dialog-delete" class="dialog-wrapper">'+deleteDialog_html+"</div>");
        }else{
          $("#dialog-delete").html(deleteDialog_html);
        }

        deleteDialog = $("#dialog-delete");
        deleteDialog.find(".cancel").click(function(){
          deleteDialog.dialog("close");
        })
        deleteDialog.find(".submit").unbind("click").click(function () {
          deleteDialog.dialog("close");
          if(deleteDialog.find("input#block_user").is(":checked")){
            SNB.post("/blocks/create.json",{user_id:blockUserId},function(){
            })
          }
          if (callback) {
            callback();
          }
        });
        return deleteDialog;
      },
      confirmDialog:function(msg,callback){
        var confirmDialog = $("#dialog-confirm");
        if (confirmDialog.length < 1) {
          var html = '<div id="dialog-confirm" class="dialog-wrapper">'
            + '<p  class="dialog-msg">' + msg + '</p>'
            + '<p style="width:100%;text-align:center;">'
            + '<input type="button" class="submit" value="确定"/>'
            + '<input type="button" class="cancel button" value="取消"/>'
            + '</p>'
            + '</div>';
          $("body").append(html);
          confirmDialog = $("#dialog-confirm");

          confirmDialog.find(".cancel").click(function(){
            confirmDialog.dialog("close");
          })
        }
        confirmDialog.find(".dialog-msg").html(msg);
        confirmDialog.find(".submit").unbind("click").click(function () {
          confirmDialog.dialog("close");
          if (callback) {
            callback();
          }
        });
        return confirmDialog;
      },
      stateDialog:function(msg,timeout,callback,modal,width,position,minWidth){
        var savedDialog = $("#dialog-saved-success"),
          _modal = typeof modal !== "undefined"  ? modal : true,
          _width = typeof width !== "undefined"  ? width : 200,
          _minWidth = typeof minWidth !== "undefined"  ? minWidth : 150,
          _position = typeof position !== "undefined"  ? position : ["center","center"];
        if (savedDialog.length < 1) {
          var html = '<div id="dialog-saved-success" class="dialog-wrapper"><span class="savedsuccesstip">' + msg + '</span></div>';
          $("body").append(html);
          savedDialog = $("#dialog-saved-success");
        }
        if(_minWidth < 150){
          savedDialog.addClass("lite-content");
        }
        savedDialog.find(".savedsuccesstip").html(msg);
        savedDialog.dialog({ modal: _modal, width: _width, minHeight: 20 ,position: _position,minWidth: _minWidth}).prev().hide();
        setTimeout(function () { savedDialog.dialog("close");if(callback){ callback(); }}, timeout || 2000);
        return savedDialog;
      },
      failDialog: function(msg, width, callback,timeout) {
        var failDialog = $("#dialog-failed");
        if (failDialog.length < 1) {
          var html = '<div id="dialog-failed" class="dialog-wrapper"><s class="info"></s><span class="savedfailtip"></span></div>';
          $("body").append(html);
          failDialog = $("#dialog-failed");
        }
        failDialog.find(".savedfailtip").text(msg);
        failDialog.dialog({ modal: true, width: width || 200, minHeight: 50 }).prev().hide();
        setTimeout(function () {
          failDialog.dialog("close");
          if (callback) {callback()}
        }, timeout || 1000);
      },
      reportSpam: function(options,callback){
        SNB.Util.checkLogin(function(){
          require.async("SNB.reportSpam.js",function(exports){
            exports.reportSpam(options,callback);
          })
        })
      },
      getShareInfo:function(cb){
        SNB.data.is_bind = false;
        SNB.data.qq_bind = false;
        SNB.data.sina_bind = false;
        SNB.Util.checkLogin(function(){
          SNB.get("/account/oauth/show.json",{},function(ret){
            if (typeof ret !== 'object') {
              ret = $.parseJSON(ret);
            }
            var oauthdata = ret.oauthbind,
              oauthdata_length = oauthdata.length;
            if(oauthdata_length){
              _.forEach(oauthdata,function(index,value){
                if(oauthdata[value][0] == "qq"){
                  SNB.data.qq_bind = true;
                  SNB.data.qq_expireIn = oauthdata[value][3];
                  SNB.data.qq_accessToken = oauthdata[value][1];
                  SNB.data.is_bind = true;
                }else if(oauthdata[value][0] == "sina"){
                  SNB.data.sina_expireIn = oauthdata[value][3];
                  SNB.data.sina_bind = true;
                  SNB.data.is_bind = true;
                }
              })
            }
            if(cb){
              cb();
            }
          })
        })
      },
      shareDialog: function(status,callback){
        SNB.Util.getShareInfo(function(){
          require.async("SNB.shareDialog.js",function(exports){
            if(typeof status.canEdit !== "undefined"){
              exports.shareStatus(status,callback);
            }else{
              exports.shareMsg(status,callback)
            }
          })
        })
      },
      shareModule:function(options){
        SNB.Util.getShareInfo(function(){
          require.async("SNB.portfolioShareDialog.js",function(share){
            var portfolioShare=share.portfolioShare;
            var p=SNB.data.share=new portfolioShare(options);
          })
        })
      },
      addFriend: function (user, callback, traceId) {
        var that = this,
          id = user.id,
          remark = '',
          url = '/friendships/create/' + id + '.json';

        if (traceId) {
          url += "?trace_id=" + traceId;
        }

        SNB.post(url, {remark: true}, function (data) {
          if (data.success) {
            if (callback) {
              callback();
            }

            if (data.contact_name) {
              remark = data.contact_name;
            } else if (data.weibo_name) {
              remark = data.weibo_name;
            }

            var d = SNB.dialog.userGroup(user, true, remark);

            if (d) {
              d.dialog({
                title: "关注成功",
                width: "auto",
                modal: true
              });
            }
          } else {
            SNB.Util.failDialog(data.message,220);
          }
        },function(ret){
          SNB.Util.addFriend_errorCallback(ret)
        })
      },
      addFriend_errorCallback:function(ret){
        var ret_error_code = ret && ret.error_code,
          ret_error_desc = ret && ret.error_description || "关注出错，请稍后重试";
        if(ret_error_code === "22801"){
          if($(".addfri_dialog_full").length){
            $(".addfri_dialog_full").dialog();
            return
          }
          var $addfri_dialog_full = $("<div class='addfri_dialog_full'>"),
            template = require("./dialog-with-buttonLink.jade")({desc:"你今天已新增关注了50人，绑定微博还能查找到好友",a_href:"/people",a_text:"去绑定微博"})
          $addfri_dialog_full.append(template).dialog({width:210, minHeight:70, modal:true}).prev().hide()
          $addfri_dialog_full.on("click",".cancel",function(){
            $addfri_dialog_full.dialog("close");
          })
        }else{
          SNB.Util.failDialog(ret_error_desc,220,function(){},2000)
        }
      },
      removeFriend:function(id,callback){
        SNB.post("/friendships/destroy/"+id+".json", callback, function(){
          SNB.Util.failDialog('取消关注失败');
        })
      },
      verifyEmail:function(email,callback){
        SNB.get("/account/verify_email.json",{
          email: email
        },callback);
      },
      getEmailService: function(email){
        var emailService="";
        if (email.search("@sina.com")!=-1 || email.search("@vip.sina.com")!=-1 || email.search("@sina.cn")!=-1) {
          emailService =  "http://mail.sina.com.cn/";
        } else if (email.search("@sohu.com")!=-1) {
          emailService =  "http://mail.sohu.com";
        } else if (email.search("@yahoo.com.cn")!=-1 || email.search("@yahoo.cn")!=-1) {
          emailService =  "http://mail.cn.yahoo.com";
        } else if (email.search("@yahoo.cn")!=-1) {
          emailService =  "http://mail.cn.yahoo.com";
        } else if (email.search("@qq.com")!=-1 || email.search("@vip.qq.com")!=-1 || email.search("@foxmail.com")!=-1) {
          emailService =  "http://mail.qq.com";
        } else if (email.search("@hotmail.com")!=-1 || email.search("@msn.com")!=-1 || email.search("@live.com")!=-1) {
          emailService =  "http://www.hotmail.com";
        } else if (email.search("@gmail.com")!=-1) {
          emailService =  "http://mail.google.com";
        } else if (email.search("@139.com")!=-1) {
          emailService =  "http://mail.10086.cn/";
        } else if (email.search("@21cn.com")!=-1 || email.search("@21cn.net")!=-1) {
          emailService =  "http://mail.21cn.com";
        } else if (email.search("@tom.com")!=-1 || email.search("@vip.tom.com")!=-1 || email.search("163.net")!=-1) {
          emailService =  "http://mail.tom.com";
        } else if (email.search("@163.com")!=-1) {
          emailService =  "http://mail.163.com";
        } else if (email.search("@126.com")!=-1) {
          emailService = "http://mail.126.com/";
        } else if (email.search("@yeah.net")!=-1) {
          emailService = "http://www.yeah.net/";
        } else if (email.search("@sogou.com")!=-1) {
          emailService = "http://mail.sogou.com/";
        } else if(email.search("@189.cn")!=-1) {
          emailService = "http://webmail17.189.cn/webmail/";
        } else if(email.search("@eyou.com")!=-1) {
          emailService = "http://www.eyou.com/";
        } else if(email.search("@188.com")!=-1) {
          emailService = "http://www.188.com/";
        } else if(email.search("@wo.com.cn")!=-1) {
          emailService = "http://mail.wo.com";
        }
        return emailService;
      },
      activate_send_email: function(email, callback, type){
        var url = typeof type !== "undefined" && type === "modify_email" ? "/account/activate_send_newemail.json" : "/account/activate_send_email.json";
        // 如果 email 被打码，或者为空，参数设置为空
        var data = /\*/.test(email) || !email? {}: {email: email};

        SNB.post(url, data, function(ret){
          if(callback){
            callback()
          }else{
            SNB.Util.stateDialog("激活邮件已重发，请登录邮箱确认")
          }
        },function(ret){
          SNB.Util.failDialog(ret.error_description);
        })
      },
      oauth_bind_verify:function(data_obj){
        seajs.use("SNB.bind_verify.js",function(){
          SNB.bind.bind_verify(data_obj);
        })
      },
      parseDate:function(input){
        var parts = input.match(/(\d+)/g);
        return new Date(parts[0], parts[1]-1, parts[2]);
      },
      scrollTop:function(className,options){
        var top = typeof options === "object" && typeof options.top !== "undefined" ? options.top : 40;
        var offset_top = $(className).offset().top;
        offset_top = offset_top - top
        $(window).scrollTop(offset_top);
      },
      portfolio_addstock:function(data,callback,error_callback){
        SNB.post("/stock/portfolio/addstock.json",data,function(ret){
          callback && callback(ret)
        },function(ret){
          var ret_error_code = ret && ret.error_code,
            ret_error_desc = ret && ret.error_description || "添加股票出错，请稍后重试";
          if(ret_error_code === "22804"){
            if($(".addStock_dialog_full").length){
              $(".addStock_dialog_full").dialog();
              return
            }
            var $addStock_dialog_full = $("<div class='addStock_dialog_full'>"),
              template = require("./dialog-with-buttonLink.jade")({desc:"你今天已新增关注了10只股票，下载客户端可随时获取行情变化 ",a_href:"/about/mobile-xueqiu",a_text:"了解详情"})
            $addStock_dialog_full.append(template).dialog({width:220, minHeight:70, modal:true}).prev().hide()
            $addStock_dialog_full.on("click",".cancel",function(){
              $addStock_dialog_full.dialog("close");
            })
          }else{
            SNB.Util.failDialog(ret_error_desc,220,function(){},2000)
          }
          error_callback && error_callback(ret)
        })
      },
      saveConfig:function(option, callback){
        if (!SNB.Util.getAccessToken()) return
        var typeList=[],
          valueList=[];

        for(var key in option){
          typeList.push(key);
          valueList.push(option[key]);
          if(key=="timeline_source"){
            $.cookie("source",null);
          }else{
            if(key.indexOf("portfolio")==0){
              $.cookie(key.replace("portfolio_",""),null);
            }
          }
        }
        SNB.get("/user/setting/set_select.json",{type:typeList+"",value:valueList+""},function(ret){
          if ( callback ) {
            callback();
          }
        });
      },
      getConfig:function(cNames,callback){
        SNB.get("/user/setting/select.json",{types:cNames.toString()},function(ret){
          callback(ret);
        })
      },
      autoCompleteSearchStock:function($el,callback,isLongValue){
        $el.autocomplete({
          source: function(request, response) {
            SNB.get("/stock/search.json", {size: 10, code: request.term}, function(data) {
              response( $.map(data.stocks, function(stock) {
                if(SNB&&SNB.stocksSearch){
                  SNB.stocksSearch[stock.code] = stock;
                }
                var label = stock.name + "(" + stock.code + ")",
                  value = stock.code;

                if ( isLongValue ) {
                  value = "$" + label + "$";
                }
                return {
                  label: label,
                  name: stock.name,
                  value: value
                }
              }));
            });
          },
          select: function(event, ui) {
            var code=ui.item.value,
              name=ui.item.name;

            if(callback){
              callback(code,name);
            }
          },
          autoFocus:true
        });
      },
      formatTime: function(ts) {
        if (_.isUndefined(ts)) {
          return "";
        }
        var months = {
          Jan: "01",
          Feb: "02",
          Mar: "03",
          Apr: "04",
          May: "05",
          Jun: "06",
          Jul: "07",
          Aug: "08",
          Sep: "09",
          Oct: "10",
          Nov: "11",
          Dec: "12"
        };

        var dateStr = _.isNumber(ts) ? new Date(ts).toString() : ts,
          arr = dateStr.split(" ");

        if ((arr[2] + "").length == 1) {
          arr[2] = "0" + arr[2];
        }

        if (arr[3] && /\d{4}/.test(arr[3])) {
          return [arr[3], months[arr[1]], arr[2]].join("-");
        } else {
          return [arr[5], months[arr[1]], arr[2]].join("-");
        }
      },
      redirectToIndex:function($count,count,userEmail){
        setTimeout(_.bind(function c(count){
          if (--count > 0) {
            $count.html(count);
            setTimeout(_.bind(c, null, count), 1000)
          } else {
            var url = "/?_=" + SNB.Util.getTimestamp();

            if(typeof userEmail !== "undefined"){
              url = url + "#userEmail=" + userEmail
            }
            window.location.href = url;
          }
        }, null, count), 1000)
      },
      updateStatus:function(data,callback,error_callback){
        SNB.post("/statuses/update.json",data,function(ret){
          callback && callback(ret)
        },function(ret){
          if(ret.error_code){
            SNB.Util.failDialog(ret.error_description);
          }else{
            SNB.Util.failDialog("服务器出错，请重试。");
          }
          error_callback && error_callback(ret)
        })
      },
      getDesc:function(user){
        return user.recommend || user.verified_description || user.description || ""
      },
      calculateTs:function(ts,specialTime){
        var specialTimeStr=new Date(ts).toString();
        specialTimeStr=specialTimeStr.replace(/\d+:\d+:\d+/g,specialTime);
        return Date.parse(specialTimeStr);
      },
      getUSTimezoneOffset: function(){
        var date = new Date(),
          timezone = date.getTimezoneOffset(),
          timezoneOffset = timezone / 60 * -1 - (-4); // 冬令时 -5

        return timezoneOffset;
      },
      getBeforeAfterTrade: function(quote){
        var timezoneOffset = this.getUSTimezoneOffset(),
          ts = Date.now(),
          tsRelative = ts - timezoneOffset * (60 * 60 * 1000),
          specialTimeStr = new Date(tsRelative).toString(),
          startTimeStr = specialTimeStr.replace(/\d+:\d+:\d+/g, "04:00:00"),
          endTimeStr = specialTimeStr.replace(/\d+:\d+:\d+/g, "16:00:00"),
          startTs = Date.parse(startTimeStr),
          endTs = Date.parse(endTimeStr),
          afterHoursTimespan = Date.parse(quote.afterHoursTime);

        if ( tsRelative > startTs && tsRelative < endTs ) {
          if ( afterHoursTimespan > startTs && afterHoursTimespan < endTs ) {
            return "盘后";
          } else {
            return "盘前";
          }
        } else {
          return "盘后";
        }
      },
      getBeforeAfterTradeNew: function (quote) {
        if(!quote || !quote.afterHoursTime){
          return;
        }
        var hour = parseInt(quote.afterHoursTime.substring(11, 13));
        if (hour < 12) {
          return "盘前";
        } else if (hour > 12) {
          return "盘后";
        }
      },
      getTradeTime: function(stockType, defineStartTime){
        var startTime = defineStartTime ? defineStartTime : "09:30:00";
        var date = new Date(),
          ts = Date.parse(date),
          timezone = date.getTimezoneOffset(),
          timezoneOffset = stockType === "美股" ? this.getUSTimezoneOffset() : 0,
          tsRelative = ts - timezoneOffset * (60 * 60 * 1000),
          date = new Date(tsRelative),
          weekday = date.getDay(),
          marketTradeTime = {
            start: SNB.Util.calculateTs(tsRelative, startTime),
            end: SNB.Util.calculateTs(tsRelative, stockType == "沪深" ? "15:05:00" : "16:20:00")
          };

        // 周六日直接除去
        if ( weekday == 0 || weekday == 6 ) {
          return { phase: "end" };
        }

        if ( tsRelative >= marketTradeTime.start && tsRelative <= marketTradeTime.end ) {
          return { phase: "trade" };
        } else {
          if ( tsRelative < marketTradeTime.start ) {
            // 获取距开盘的时间  setTimeout用
            return { phase: "before", ts: marketTradeTime.start - tsRelative };
          } else {
            return { phase: "end" };
          }
        }
      },
      getNewStocklistUrl: function(industry, plate, exchange){
        var specialIndustries = {
          "明星股": {
            firstName: "美国股市",
            industry: "明星股",
            exchange: "US"
          },
          "中国概念股": {
            firstName: "美国股市",
            industry: "中国概念股",
            exchange: "US"
          },
          "上市预告": {
            firstName: "美国股市",
            industry: "上市预告",
            exchange: "US"
          },
          "新上市公司": {
            firstName: "美国股市",
            industry: "新上市公司",
            exchange: "US"
          },
          "可转债": {
            firstName: "债券及回购",
            industry: "可转债",
            exchange: "CN"
          },
          "国债": {
            firstName: "债券及回购",
            industry: "国债",
            exchange: "CN"
          },
          "企债": {
            firstName: "债券及回购",
            industry: "企债",
            exchange: "CN"
          },
          "回购": {
            firstName: "债券及回购",
            industry: "回购",
            exchange: "CN"
          },
          "封闭式基金": {
            firstName: "基金",
            industry: "封闭式基金",
            exchange: "CN"
          },
          "传统封闭式基金": {
            firstName: "基金",
            industry: "传统封闭式基金",
            exchange: "CN"
          },
          "货币式基金": {
            firstName: "基金",
            industry: "货币式基金",
            exchange: "CN"
          },
          "ETF": {
            firstName: "基金",
            industry: "ETF",
            exchange: "CN"
          },
          "LOF": {
            firstName: "基金",
            industry: "LOF",
            exchange: "CN"
          },
          "比特币(CNY)": {
            firstName: "比特币",
            industry: "比特币(CNY)",
            exchange: "比特币"
          },
          "比特币(USD)": {
            firstName: "比特币",
            industry: "比特币(USD)",
            exchange: "比特币"
          },
          "比特币(EUR)": {
            firstName: "比特币",
            industry: "比特币(EUR)",
            exchange: "比特币"
          },
          "比特币(GBP)": {
            firstName: "比特币",
            industry: "比特币(GBP)",
            exchange: "比特币"
          },
          "比特币(JPY)": {
            firstName: "比特币",
            industry: "比特币(JPY)",
            exchange: "比特币"
          },
          "比特币(AUD)": {
            firstName: "比特币",
            industry: "比特币(AUD)",
            exchange: "比特币"
          },
          "QH": {
            firstName: "期货",
            industry: "国债期货",
            exchange: "QH"
          },
          "TP": {
            firstName: "信托",
            industry: "信托",
            exchange: "TP"
          },
          "FP": {
            firstName: "理财",
            industry: "理财产品",
            exchange: "FP"
          },
          "US": {
            firstName: "美国股市",
            secondName: "雪球行业",
            plate: plate,
            industry: industry,
            exchange: "US"
          },
          "CN": {
            firstName: "沪深股市",
            secondName: "雪球行业",
            plate: plate,
            industry: industry,
            exchange: "CN"
          },
          "HK": {
            firstName: "香港股市",
            secondName: "雪球行业",
            plate: plate,
            industry: industry,
            exchange: "HK"
          },
          "私募工场": {
            firstName: "私募",
            industry: "私募工场",
            exchange: "P"
          }
        };
        var params = specialIndustries[industry] || specialIndustries[exchange],
          array = [];
        for ( var key in params ) {
          array.push(key + "=" + params[key]);
        }
        return SNB.domain.host + "/hq#" + array.join("&");
      }
    };
    _.each(SNB.Util.BBCODE_MAPPING, function(a) {
      SNB.Util.BBCODE_TO_TEXT[a[0]] = a[1]
      SNB.Util.TEXT_TO_BBCODE[a[1]] = a[0]
    })
    $(function(){
      if(!('placeholder' in document.createElement('input'))){
        $("[placeholder]").live('focus', function() {
          var $input = $(this);
          $input.removeClass("placeholder");
          if ($input.val() == $input.attr("placeholder")) {
            $input.val("");
          }
        }).live('blur', function() {
          var $input = $(this);
          if ($input.val() == "") {
            $input.addClass("placeholder");
            if($input.attr("type")!="password"){
              $input.val($input.attr("placeholder"));
            }else{
              $input.val("");
            }
          }
        }).blur();
        // 避免val取到placeholder值
        var hooks={
          get:function(element){
            var $element = $(element);
            return $element.hasClass('placeholder') ? '' : element.value;
          }
        }
        $.valHooks.input=hooks;
        $.valHooks.textarea=hooks;
      }

      //$(".dropdown-menu a.exit").click(function(e) {
      //  SNB.get("/account/oauth/show.json", function(ret) {
      //    $.cookie("last_account",ret.email, {path: '/', expires: 90});
      //    $.cookie("tab",null, {path: "/"});
      //    $.cookie("xq_a_token",null, {path: "/"});
      //    $.cookie("xq_r_token",null, {path: "/"});
      //    $.cookie("order",null, {path: "/"});
      //    $.cookie("col",null, {path: "/"});
      //    location.href = "/";
      //  })
      //  return false
      //});
    });
    //remove useless cookie
    $.cookie("x_nickname",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("x_passwd",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("x_token",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("x_userid",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("x_tuserid",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("bbs_auth",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("bbs_sid",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("x_userip",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("__utma",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("__utmb",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("__utmc",null, {path: "/", domain: ".xueqiu.com"});
    $.cookie("__utmz",null, {path: "/", domain: ".xueqiu.com"});


    $.cookie("order", null, {path: "/"});
    $.cookie("col", null, {path: "/"});
    $.cookie("__exp_t", null, {path: "/"});

    // login
    $('body')
      .on('click', '.nav.account .login, #openLoginDialog', function(e) {
        e.preventDefault();
        SNB.Util.checkLogin(function(){}, e);
      });

    //search
    require.async("SNB.typeahead.js")

    var $messagesList = $('.notices-list');

    SNB.notification = function () {
      var noMentions = $body.hasClass('noMentions');

      if (!SNB.currentUser.id || noMentions) {
        return false;
      }

      SNB.get('/remind/unread.json', function (ret) {
        //delete ret.notices;
        delete ret.user_id;
        delete ret.status;
        // 把事件ID拼进URL
        //var events_id = ret.events_id;

        // 去掉通讯录好友
        delete ret.contact_friends;
        // 去掉微博好友
        delete ret.weibo_friends;

        delete ret.events_id;
        delete ret.events;

        // 屏蔽掉私信
        delete ret.dm;

        /*
         *if (events_id && events_id.length) {
         *  // 目前只装载第一个提醒ID
         *  $messagesList
         *    .find('.events a')
         *      .attr('href', '/calendar#' + events_id[0]);
         *}
         */

        $messagesList
          .find('li:not(.setting)')
          .hide();

        var allCount = 0;

        _.each(ret, function (count, key) {
          if (count) {
            $messagesList
              .find('.' + key)
              .show()
              .find('.count')
              .html(count);

            allCount = allCount + (count|0);
          }
        });

        if (allCount > 0) {
          $('#btn-notice')
            .css({
              display: 'block',
              lineHeight: '11px'
            })
            .find('sup')
            .text(allCount)
            .show();
        } else {
          $('#btn-notice')
            .css({
              display: 'none',
              lineHeight: '20px'
            })
            .find('sup')
            .text('0')
            .hide();
        }
      });
    }

    var uri = (SNB.currentUser.profile || '/') + '?source=3#notices';

    $messagesList
      .find('.notices a')
      .attr('href', uri)
      .end()
      .find('li:not(.setting)')
      .hide();

    SNB.Image = {
      default_30 : "community/default/avatar.png!30x30.png",
      default_50 : "community/default/avatar.png!50x50.png",
      default_180 : "community/default/avatar.png!180x180.png",
      zoomIn:function(imageElm){
        var image_zoomIn = imageElm.attr("src"),
          endIndex = image_zoomIn.indexOf("%21custom.jpg") != -1 ? image_zoomIn.indexOf("%21custom.jpg")  :  image_zoomIn.indexOf("!custom.jpg") ;
        if(endIndex == -1){
          return;
        }
        var image_zoomOut = image_zoomIn.substr(0,endIndex),
          $html = "<a class='zoom' href='"+image_zoomOut+"'target='_blank'><i></i><span>查看原图</span></a>";
        imageElm.next().is('br') && imageElm.next().remove()
        imageElm.after($html);
      },
      lazyload:function(text){
        return text.replace(/<img(.*?)src="?(https?:\/\/xqimg.*?custom.jpg)"?(.*?)\/?>/gi,'<img$1src="//assets.imedao.com/images/blank.png" data-image="$2"$3/>')
      },
      getProfileImage:function(profile_image_url,size){
        profile_image_url = profile_image_url && profile_image_url.split(",") || [];
        var img = SNB.domain.photo + "/" + (profile_image_url.length > 3 ? profile_image_url[3] : (profile_image_url.length == 1 ? profile_image_url[0] : 'community/default/avatar.png!30x30.png'))
        img = typeof size !== "undefined" ? img.replace(/([0-9]+)x([0-9]+)/,size + "x" + size) : img
        return img;
      }
    }

    $(function() {
      SNB.notification();
    });
    window.isActive = true;
    setInterval(function(){
      if (window.isActive) {
        SNB.notification()
      }
    }, 60000);
    $(window).focus(function() {
      SNB.notification()
    });
    $(function() {
      $(window).focus(function() {
        window.isActive = true;
      });
      $(window).blur(function() {
        window.isActive = false;
      });
    })

    // 禁用 backspace，避免不小心离开页面
    $doc.on('keydown', function(ev) {
      if ( !( $(ev.target).is('input, textarea') || $(ev.target).prop('contenteditable') )&& ev.keyCode === 8) {
        ev.preventDefault()
      }
    })

      // scroll 事件
    ;(function() {
      var didScroll = true
        , checkScrollInterval = $.browser.msie ? 100 : 50

      SNB.scroll = {}

      var ConditionHandler = SNB.scroll.ConditionHandler = function(condition, handle) {
        var condFunc = ('function' === typeof condition) ? condition : function () { return condition }
        return function(st) {
          if (condFunc()) {
            handle(st)
          }
        }
      }
      var handlers = SNB.scroll.handlers = []

      setTimeout(function doScrollCheck () {
        var st
        if (didScroll) {
          didScroll = false
          st = $win.scrollTop()
          _.each(handlers, function(handler) {
            handler(st)
          })
        }
        setTimeout(doScrollCheck, checkScrollInterval)
      }, checkScrollInterval)

      $win.scroll(function() {
        didScroll = true
      })

      //检查是否是编辑器全屏状态
      var isEditorMode = SNB.scroll.isEditorMode = function() {
          return $body.hasClass('editor-mode') || $body.hasClass('main-editor-mode')
        }
        , isNotEditorMode = SNB.scroll.isNotEditorMode = function() {
          return !isEditorMode()
        }

      //指定各 handler
      /*
       *handlers.push(ConditionHandler(isNotEditorMode, function(st) {
       *  if (st > 0) {
       *    unreadMessagePanel.css('position','fixed');
       *  } else {
       *    unreadMessagePanel.css('position','absolute');
       *  }
       *}))
       */

      /*
       handlers.push(ConditionHandler(isEditorMode, function(st) {
       var $editor = $('.editor:visible')
       , dh = $doc.height()
       , wh = $win.height()
       if (st > 45) $('.editor-toolbar', $editor).addClass('fixed')
       else $('.editor-toolbar', $editor).removeClass('fixed')
       //if (dh - st - wh > 32) $('.editor-footer', $editor).addClass('fixed')
       //else $('.editor-footer', $editor).removeClass('fixed')
       }))
       */

      $(function(){
        $('body#jade-single,body#search,body#my-home,body#my-profile,body#his-profile,body#hots-statuses,body#jade-singleStock,body.scrollToTop').found(function() {
          var $center = $('#center')
            , data_offset_left = parseInt($body.attr("data_offset_left")) || 0
            , $toTop = $('<a href="#" title="回到顶部" id="toTop"></a>')
              .hide()
              .on('click', function(e) {
                e.preventDefault()
                $win.scrollTop(0)
                $toTop.fadeOut(200)
              })
              .appendTo($body)
            , leftOffset = $('body#jade-single').length ? 780 : 740
          handlers.push(ConditionHandler(isNotEditorMode, function(st) {
            if ( st > 1200 )
              $toTop.fadeIn(200);
            else
              $toTop.fadeOut(200);
          }))
          $toTop.css("left", $center.offset().left + leftOffset + data_offset_left);
          window.onresize = function() {
            $toTop.css("left", $center.offset().left + leftOffset + data_offset_left);
          };
        })
      })

    }())

    if (!$body.hasClass('noPreload')) {
      require.async("SNB.editor.js")
      require.async("SNB.repostDialog.js");
      require.async("SNB.downloadDialog.js")
      require.async("SNB.userRemark.js")
      if ($.browser.isPC) require.async("SNB.tooltip.js");
    }

    //转义IE下@链接
    if ($.browser.msie) {
      $("body").on("click", "a", function(e) {
        var href = $(this).attr("href")
        if (!href || href.substr(0, 2) != '/n/') return
        e.preventDefault()
        window.open('/n/' + encodeURIComponent(href.substr(3)))
      })
    }

    /*
     *  var originGetJSON=$.getJSON;
     *  $.getJSON=function(url,params,callback){
     *    var reg=/^\/stock\/portfolio\/((create)|(remove)|(modify)|(modifyorder)|(addstock)|(addstocks)|(delstock)|(updstock)|(addtrans)|(deltrans)|(updtrans))\.json$/i;
     *
     *    if(reg.test(url)){
     *      alert("自选股系统维护中，暂时不能进行操作。");
     *      return false;
     *    }else{
     *      originGetJSON(url,params,callback);
     *    }
     *  }
     */

    if (typeof console != 'undefined') {
      console.log('%c', 'padding:60px;background:url(//assets.imedao.com/images/logos/logo_xueqiu_120/logo_xueqiu_120-02.png) no-repeat;line-height:120px;height:1px;')
      console.log('%cSnowball F2E: Looking for you.', 'color:#949494;font-weight:500;font-size:14px;font-family:"Hiragino Sans GB W3"');
      console.log('%cThe Greed Island: %c//xueqiu.com/about/jobs#senior-frontend-engineer', 'color:#949494;font-size:12px;', 'color:#949494;font-size:12px;')
    }

  })($);
})
;
define("dialog-with-buttonLink.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<p class="hd">');
var __val__ = desc
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p><p class="ops"><a');
buf.push(attrs({ 'href':(a_href), 'target':("_blank"), "class": ('btn_link') }, {"href":true,"target":true}));
buf.push('>');
var __val__ = a_text
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a><input type="button" value="取消" class="cancel button"/></p>');
}
return buf.join("");
};module.exports = anonymous;});