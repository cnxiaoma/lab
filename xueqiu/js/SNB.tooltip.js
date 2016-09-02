
define('SNB.tooltip.js', ["SNB.atDialog","SNB.dialog","tooltip.jade.js","profile-tooltip.jade.js","stock-tooltip.jade.js"], function (require, exports, module) {  SNB.data.profiles = SNB.data.profiles || {};
  SNB.data.quotes = SNB.data.quotes || {};

  require("./SNB.atDialog.js");
  require("./SNB.dialog.js");

//	var dmDialog = require('./SNB.dmDialog.js');

  $("body>.temp").findOrAppend(">.profileTooltip", require("./tooltip.jade"));

  var $body = $('body'),
    $tooltip = $(".temp > .tooltip"),
    $tooltipInner = $tooltip.find(".tooltip-inner"),
    renderProfile = function (profile) {
      if (profile) {
        if (profile.verified_description) {
          profile.verified_description = SNB.Util.splitWordWithElipse(profile.verified_description, 42);
        }

        if (profile.description) {
          profile.description = SNB.Util.splitWordWithElipse(profile.description, 44);
        }
      }

      return require("./profile-tooltip.jade")({profile: profile, domain: SNB.domain});
    },
    renderStock = function (quote) {
      return require("./stock-tooltip.jade")({quote: quote, domain: SNB.domain});
    },
    listener = function (obj, $tooltipInner) {
      if (obj.symbol) {
        $tooltipInner
          .find(".exchange")
          .click(function () {
            var dialog = SNB.dialog.performanceDialog({
              stock: obj,
              type: 1,
              callback: function () {
                var msg = '添加成功，可到<a href="/performance" target="_blank">持仓盈亏</a>&nbsp;查看所有记录';
                SNB.Util.stateDialog(msg, 3000, undefined, undefined, 300);
              }
            });

            dialog.dialog({
              modal: true,
              width: '360px',
              title: '新增交易'
            });
          });
      }

      if ($tooltipInner.data("listened")) {
        return false;
      }

      $tooltipInner.data("listened", true);

      $tooltipInner.delegate(".relations a", "click", function (e) {
        var $this = $(this),
          symbol = '',
          stock = '';

        if ($this.hasClass("removeStock")) {
          symbol = $this.attr("data-id");
          stock = SNB.data.quotes[symbol];

          var dialog = SNB.dialog.deleteStockDialog(stock, function () {
            SNB.data.quotes[symbol].following = false;
            SNB.Util.stateDialog("取消关注成功", 400);
          }, "全部", "");

          dialog.dialog({
            title: "删除自选股"
          });
        } else if ($this.hasClass("foStock")) {
          symbol = $this.attr("data-id");

          SNB.Util.checkLogin(function (e) {
            SNB.dialog.addStock(SNB.data.quotes[symbol], function () {
              SNB.data.quotes[symbol].following = true;
            });
          }, e);
        } else if ($this.hasClass("removeFriend")) {
          SNB.Util.checkLogin(function () {
            SNB.Util.confirmDialog("确定取消关注吗？", function () {
              SNB.Util.removeFriend($this.attr("data-id"), function () {
                SNB.Util.stateDialog("取消关注成功", 400);
                SNB.data.profiles[$this.data("name")].following = false;
              });
            }).dialog({
              modal: true,
              width: 200,
              minHeight: 50,
              position: [e.clientX - 95, e.clientY - 110]
            }).siblings('.ui-dialog-titlebar').remove();
          }, e);
        } else if ($this.hasClass("foFriend")) {
          SNB.Util.checkLogin(function () {
            var user = {
              id: $this.data("id"),
              name: $this.data("name")
            };

            SNB.Util.addFriend(user, function () {
              var profile = SNB.data.profiles[$this.data("name")];

              SNB.data.profiles[$this.data("name")].following = true;

              if (profile.follow_me) {
                $tooltipInner.find(".relations").html('<span class="interfollow"><s></s>互相关注&nbsp;|&nbsp;</span><a data-id="' + profile.id + '" class="removeFriend">取消</a>')
              } else {
                $tooltipInner.find(".relations").html('<span class="onefollow"><s></s>已关注&nbsp;|&nbsp;</span><a data-id="' + profile.id + '" class="removeFriend">取消</a>')
              }

              $tooltipInner.find(".relations").append('<a data-id="' + profile.id + '" data-name="' + profile.screen_name + '" class="groupUser">分组</a>');

              return false;
            });
          }, e);
        } else if ($this.hasClass("groupUser")) {
          var d = SNB.dialog.userGroup({name: $this.data("name"), id: $this.data("id")});

          if (d) {
            d.dialog({
              title: "用户分组",
              width: "auto",
              modal: true
            });
          }

          return false;
        } else if ($this.hasClass("groupStock")) {
          symbol = $this.attr("data-id");
          stock = SNB.data.quotes[symbol];

          stock.isEdit = true;

          SNB.Util.checkLogin(function () {
            SNB.dialog.addStock(stock, $.noop);
          }, e);
        }
      });
    };

  var tooltipSelector = "#center a, #stockChartFullscreen a, .ui-dialog a, #container a";

  $body
    .delegate(tooltipSelector, "mouseenter", function (e) {
      if (SNB.currentUser.isGuest || $(e.currentTarget).hasClass("noToolTip")) {
        return false;
      }

      var $this = $(e.currentTarget),
        href = $this.attr('href'),
        isProfile = false,
        isStock = false,
        screen_name = "",
        symbol = "";

      href = href && href.replace(/^http:\/\/xueqiu.com/, '');
      var href_splits = href && href.split('/');

      if (!href_splits) {
        return false;
      }

      href_splits.shift();

      // 判断股票和用户
      var isProfileLink = $this.data("name") || href_splits[0] === "n";

      if (isProfileLink) {
        isProfile = true;
        screen_name = $this.data("name") || decodeURIComponent(href_splits[1]);

        if ($tooltip.css("visibility") == 'visible' && $tooltip.data("screen_name") == screen_name) {
          return false;
        }

        if (screen_name == SNB.currentUser.screen_name) {
          return false;
        }

        $tooltip.data("screen_name", screen_name);
        $this.data("profile", true);
      }

      var isStockLink = $this.data("symbol");

      if (!isStockLink) {
        if (href_splits.length === 2) {
          var first = href_splits[0].toUpperCase(),
            second = href_splits[1].toUpperCase();

          if (_.indexOf(["S", "P"], first) > -1 && second && second[0] !== "?") {
            isStockLink = true;

            if (first === "P") {
              isStockLink = SNB.Util.getStockInfo(second).bigType === "投资组合";
            }
          }
        }
      }

      if (isStockLink) {
        isStock = true;
        symbol = href_splits[1] || $this.data("symbol");

        if ($tooltip.css("visibility") == 'visible' && $tooltip.data("symbol") == symbol) {
          return false;
        }

        $tooltip.data("symbol", symbol);
        $this.data("stock", true);
      }

      if (!isProfile && !isStock) {
        return false;
      }

      // 股票发推的情况  两种情况都符合
      if (isProfile && isStock) {
        isProfile = false;
      }

      clearTimeout($this.data('timeout'));
      $this.data("hoverState", "in");

      $this.data('timeout', setTimeout(function () {
        if ($this.data("hoverState") == "in") {
          var pos = $this.offset(),
            tooltip_height = $tooltip[0].offsetHeight,
            tooltip_pos = {top: pos.top - tooltip_height + 4, left: pos.left},
            type;

          if ((pos.top - $(document).scrollTop()) < (tooltip_height + 41)) {
            tooltip_pos.top = pos.top + $this[0].offsetHeight;
            type = 'above';
            $tooltip.addClass("above");
          }

          // 链接折行的情况
          if ($this.height() > 20) {
            if (e.offsetY < 20) {
              tooltip_pos.left += $this.width() - 40;
              if (type === 'above') {
                tooltip_pos.top -= 17;
              }
            } else {
              if (type != 'above') {
                tooltip_pos.top += 17;
              }
            }
          }

          //右侧宽度不够的情况
          if ((pos.left + $tooltip.width()) > $(window).width()) {
            //tooltip_pos.left = $(window).width() - $tooltip.width() - 4;
            tooltip_pos.left = pos.left - $tooltip.width() + 50;
            $tooltip.addClass("right");
          }

          var isOverlay = function () {
            return $this.closest(".ui-dialog").length;
          };

          var getMaxZindex = function () {
            return isOverlay() ? $.ui.dialog.maxZ + 1 : 1000;
          };

          if (isProfile) {
            if (SNB.data.profiles[screen_name]) {
              $tooltipInner.html(renderProfile(SNB.data.profiles[screen_name]));
              $tooltip.css("z-index", getMaxZindex());
              listener(SNB.data.profiles[screen_name], $tooltipInner);
            } else {
              $tooltipInner.html(renderProfile());

              SNB.get("/user/show.json?id=" + encodeURIComponent(screen_name), function (profile) {
                var images = profile.profile_image_url && profile.profile_image_url.split(",");

                profile.profile_image_url = ((images && images.length >= 3) ? images[2] : "community/default/avatar.png!50x50.png");

                if (profile.city == '不限' || profile.province == '其他') {
                  profile.city = '';
                }

                profile.defaulttext = $this.data("defaulttext") || "";
                SNB.data.profiles[profile.screen_name] = profile;
                $tooltipInner.html(renderProfile(profile));
                $tooltip.css("z-index", getMaxZindex());

                listener(profile, $tooltipInner);
              }, function (error) {
                if (error.error_code == 21702) {
                  $tooltipInner.find('.load').html("没有找到这个用户");
                  return false;
                }
              });
            }
          } else {
            $tooltipInner.html(renderStock());
//						var quote = {};

            // 因为行情的实时性 所以每次新取行情
            SNB.get("/stock/quote.json", {code: symbol}, function (quote) {
              var quotes = quote.quotes;
              if (quotes && quotes.length) {
                quote = $.extend(quote, quotes[0]);
                quote.money = SNB.Util.getStockInfo(quote.symbol).money;

                if (quote.percentage > 0) {
                  quote.updown = "stock_up";
                  quote.change = "+" + quote.change;
                  quote.percentage = "+" + quote.percentage;
                } else if (quote.percentage < 0) {
                  quote.updown = "stock_down";
                }

                var stockInfo = SNB.Util.getStockInfo(quote.symbol);

                if (stockInfo.bigType == "美股") {
                  quote.bigType = "美股";
                  quote.beforeAfter = SNB.Util.getBeforeAfterTrade(quote);
                  if (quote.afterHoursPct > 0) {
                    quote.afterHourUpdown = "stock_up";
                    quote.afterHoursChg = "+" + quote.afterHoursChg;
                    quote.afterHoursPct = "+" + quote.afterHoursPct;
                  } else if (quote.afterHoursPct < 0) {
                    quote.afterHourUpdown = "stock_down";
                  }
                }

                if (stockInfo.type == "回购") {
                  quote.current = parseFloat(quote.current).toFixed(3);
                }

                if (stockInfo.bigType == "货币基金") {
                  quote.isMF = true;
                  quote.pe_ttm += "%";
                }

                if (stockInfo.bigType == "信托产品") {
                  quote.isTP = true;
                }

                if (stockInfo.bigType == "理财产品") {
                  quote.isFP = true;
                }

                if (stockInfo.bigType == "私募基金") {
                  quote.isPF = true;
                }

                quote.url = "/S/" + quote.symbol;

                if (stockInfo.bigType === "投资组合") {
                  quote.isZH = true;
                  quote.url = "/P/" + quote.symbol;
                }

                quote.splitName = SNB.Util.splitWord(quote.name, 10);

                if (quote.splitName.length !== quote.name.length) {
                  quote.splitName += "...";
                }

                quote.percentage += "%";
                quote.afterHoursPct += "%";
                $tooltipInner.html(renderStock(quote));
              }

              // 关注关系使用缓存
              if (SNB.data.quotes[symbol]) {
                quote = $.extend({}, SNB.data.quotes[symbol], quote);
                SNB.data.quotes[symbol] = quote;
                $tooltipInner.html(renderStock(quote));

                listener(quote, $tooltipInner);
              } else {
                var access_token = SNB.Util.getAccessToken(),
                  uid = SNB.currentUser.id;

                $.getJSON("/service/stockfollows", {symbol: symbol, uid: uid}, function (obj) {
                  quote = $.extend({}, obj, quote);
                  SNB.data.quotes[symbol] = quote;
                  $tooltipInner.html(renderStock(quote));

                  listener(quote, $tooltipInner);
                });
              }
            });
          }

          $tooltip
            .css(tooltip_pos)
            .css("visibility", "visible");
        }
      }, '600'));
    })
    .delegate(tooltipSelector, "mouseleave", function (e) {
      var $this = $(e.currentTarget);

      if (!$this.data("profile") && !$this.data("stock")) {
        return false;
      }

      clearTimeout($this.data('l_timeout'));

      $this.data("l_timeout", setTimeout(function () {
        if ($tooltip.hasClass("hover")) {
          return false;
        }

        $tooltip.css("visibility", "hidden");
        $tooltip.removeClass("above myself right");
        $this.data('hoverState', '');
      }, '200'));
    })
    .delegate(tooltipSelector, "click", function (e) {
      var $this = $(e.currentTarget);

      if ($this.data("profile") || $this.data("stock")) {
        clearTimeout($this.data('l_timeout'));

        $this.data("l_timeout", setTimeout(function () {
          if ($tooltip.hasClass("hover")) {
            return false;
          }

          $tooltip.css("visibility", "hidden");
          $tooltip.removeClass("above myself right");
          $this.data('hoverState', '');
        }, '200'));
      }
    });

  $tooltip
    .on("mouseleave", function () {
      $tooltip
        .css("visibility", "hidden")
        .removeClass("hover above myself right");
    }).on("mouseenter", function () {
      $tooltip.addClass("hover");
    });

});
;
define("tooltip.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="tooltip"><div class="tooltip-arrow above"><div class="tooltip-arrow-in"></div><div class="tooltip-arrow-out"></div></div><div class="tooltip-alpha"></div><div class="tooltip-inner"></div><div class="tooltip-arrow below"><div class="tooltip-arrow-out"></div><div class="tooltip-arrow-in"></div></div></div>');
}
return buf.join("");
};module.exports = anonymous;});;
define("profile-tooltip.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 if (profile)
{
 var domain_host = domain.host
buf.push('<div class="info"><div class="card"><div class="headpic"><a');
buf.push(attrs({ 'href':(domain_host + profile.profile), 'target':('_blank') }, {"href":true,"target":true}));
buf.push('><img');
buf.push(attrs({ 'src':('//xavatar.imedao.com/' + profile.profile_image_url), 'alt':(profile.screen_name), 'width':('50px'), 'height':('50px') }, {"src":true,"alt":true,"width":true,"height":true}));
buf.push('/></a></div><div class="content"><div><a');
buf.push(attrs({ 'href':(domain_host + profile.profile), 'target':('_blank') }, {"href":true,"target":true}));
buf.push('>');
var __val__ = profile.screen_name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>');
 if(profile.following)
{
buf.push('<a');
buf.push(attrs({ 'href':("#"), 'data-user-name':(profile.screen_name), 'data-user-id':(profile.id), 'data-user-remark':(profile.remark), "class": (profile.remark ? "user_remark" : "setRemark") }, {"class":true,"href":true,"data-user-name":true,"data-user-id":true,"data-user-remark":true}));
buf.push('>(' + escape((interp = profile.remark || '备注') == null ? '' : interp) + ')</a>');
}
 if (profile.verified)
{
 var verified_img = profile.verified_type || 1
buf.push('<img');
buf.push(attrs({ 'src':("//assets.imedao.com/images/vipicon_"+verified_img+".png"), 'alt':(profile.verified_description), "class": ('vipicon') }, {"src":true,"alt":true}));
buf.push('/>');
}
buf.push('</div><div>');
 if (profile.gender == 'f')
{
buf.push('<span class="f head">&nbsp;&nbsp;&nbsp;</span>女');
}
 else if (profile.gender == 'm')
{
buf.push('<span class="m head">&nbsp;&nbsp;&nbsp;</span>男');
}
 else
{
buf.push('<span class="m head">&nbsp;&nbsp;&nbsp;</span>保密');
}
 if(profile.province !== "其他" && profile.province !== "省/直辖市")
{
buf.push('，' + escape((interp = profile.province) == null ? '' : interp) + '');
}
 if(profile.city !== "其他" && profile.city !== "不限" && profile.city !== "城市/地区")
{
buf.push('' + escape((interp = profile.city) == null ? '' : interp) + '');
}
buf.push('</div><div><span>股票&nbsp;<a href=\'' + escape((interp = domain_host) == null ? '' : interp) + '' + escape((interp = profile.profile) == null ? '' : interp) + '/portfolios\' target=\'_blank\'>' + escape((interp = profile.stocks_count) == null ? '' : interp) + '</a>&nbsp;&nbsp;&nbsp;</span><span>讨论&nbsp;<a href=\'' + escape((interp = domain_host) == null ? '' : interp) + '' + escape((interp = profile.profile) == null ? '' : interp) + '\' target=\'_blank\'>' + escape((interp = profile.status_count) == null ? '' : interp) + '</a>&nbsp;&nbsp;&nbsp;</span><span>粉丝&nbsp;<a href=\'' + escape((interp = domain_host) == null ? '' : interp) + '' + escape((interp = profile.profile) == null ? '' : interp) + '/followers\' target=\'_blank\'>' + escape((interp = profile.followers_count) == null ? '' : interp) + '</a></span></div></div></div><div class="desc">');
 if (profile.verified_description)
{
buf.push('<label>认证信息：</label><span>');
var __val__ = profile.verified_description
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
 else
{
 if (profile.description)
{
buf.push('<label>简介：</label><span>');
var __val__ = profile.description
buf.push(null == __val__ ? "" : __val__);
buf.push('</span>');
}
}
buf.push('</div></div><div class="operations"><div class="relations">');
 if (profile.follow_me)
{
 if (profile.following)
{
buf.push('<span class="interfollow"> <s></s>互相关注&nbsp;|&nbsp;</span><a');
buf.push(attrs({ 'data-id':('' + (profile.id) + ''), 'data-name':('' + (profile.screen_name) + ''), "class": ('removeFriend') }, {"data-id":true,"data-name":true}));
buf.push('>取消</a><a');
buf.push(attrs({ 'data-id':('' + (profile.id) + ''), 'data-name':('' + (profile.screen_name) + ''), "class": ('groupUser') }, {"data-id":true,"data-name":true}));
buf.push('>分组</a>');
}
 else
{
buf.push('<a');
buf.push(attrs({ 'data-id':('' + (profile.id) + ''), 'data-name':('' + (profile.screen_name) + ''), "class": ('foFriend') }, {"data-id":true,"data-name":true}));
buf.push('>加关注</a>');
}
}
 else
{
 if (profile.following)
{
buf.push('<span class="onefollow"><s></s>已关注&nbsp;|&nbsp;</span><a');
buf.push(attrs({ 'data-id':('' + (profile.id) + ''), 'data-name':('' + (profile.screen_name) + ''), "class": ('removeFriend') }, {"data-id":true,"data-name":true}));
buf.push('>取消</a><a');
buf.push(attrs({ 'data-id':('' + (profile.id) + ''), 'data-name':('' + (profile.screen_name) + ''), "class": ('groupUser') }, {"data-id":true,"data-name":true}));
buf.push('>分组</a>');
}
 else
{
buf.push('<a');
buf.push(attrs({ 'data-id':('' + (profile.id) + ''), 'data-name':('' + (profile.screen_name) + ''), "class": ('foFriend') }, {"data-id":true,"data-name":true}));
buf.push('>加关注</a>');
}
}
buf.push('</div><div class="contact">');
 if (profile.gender == 'f')
{
buf.push('<a');
buf.push(attrs({ 'data-toggle':('at'), 'data-target':('' + (profile.screen_name) + ''), "class": ('at') }, {"data-toggle":true,"data-target":true}));
buf.push('>@她</a>');
}
 else
{
buf.push('<a');
buf.push(attrs({ 'data-toggle':('at'), 'data-target':('' + (profile.screen_name) + ''), 'data-defaulttext':('' + (profile.defaulttext) + ''), "class": ('at') }, {"data-toggle":true,"data-target":true,"data-defaulttext":true}));
buf.push('>@他</a>');
}
buf.push('</div></div>');
}
 else
{
buf.push('<ad>正在获取用户信息...</ad>');
}
}
return buf.join("");
};module.exports = anonymous;});;
define("stock-tooltip.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 if (quote)
{
 var domain_host = domain.host
buf.push('<div class="info"><div class="stockname"><a');
buf.push(attrs({ 'href':("" + (quote.url) + ""), 'target':("_blank"), 'title':("" + (quote.name) + "") }, {"href":true,"target":true,"title":true}));
buf.push('>' + escape((interp = quote.splitName) == null ? '' : interp) + '</a>');
 if (quote.isZH)
{
buf.push('<span>(' + escape((interp = quote.symbol) == null ? '' : interp) + ')</span>');
}
 else
{
buf.push('<span>(' + escape((interp = quote.exchange) == null ? '' : interp) + ':' + escape((interp = quote.code) == null ? '' : interp) + ')</span>');
}
buf.push('</div><span');
buf.push(attrs({ "class": ('stockquote') + ' ' + ("" + (quote.updown) + "") }, {"class":true}));
buf.push('>');
 if ( quote.isFP ) 
{
buf.push('<span>预期收益：</span><span class="stockcurrent">' + escape((interp = (quote.current * 100).toFixed(2)) == null ? '' : interp) + '%</span>');
}
 else
{
 if (quote.isZH)
{
buf.push('<span class="stockcurrent">' + escape((interp = quote.current) == null ? '' : interp) + '</span>');
}
 else
{
buf.push('<span class="stockcurrent">' + escape((interp = quote.money) == null ? '' : interp) + '' + escape((interp = quote.current) == null ? '' : interp) + '</span>');
}
}
 if(quote.isMF)
{
buf.push('<span class="stockpercentage">(七日年化收益：' + escape((interp = quote.pe_ttm) == null ? '' : interp) + ')</span>');
}
 else
{
 if ( quote.isPF ) 
{
buf.push('<span class="stockpercentage"> </span>');
}
 else
{
 if ( !quote.isTP && !quote.isFP ) 
{
buf.push('<span class="stockchange">' + escape((interp = quote.change) == null ? '' : interp) + '</span><span class="stockpercentage">(' + escape((interp = quote.percentage) == null ? '' : interp) + ')</span>');
}
}
}
buf.push('</span>');
 if (quote.bigType=="美股")
{
buf.push('<span>' + escape((interp = quote.beforeAfter) == null ? '' : interp) + ' </span><span');
buf.push(attrs({ "class": ('afterHour') + ' ' + ("" + (quote.afterHourUpdown) + "") }, {"class":true}));
buf.push('><span class="stockafterhourchg">' + escape((interp = quote.afterHoursChg) == null ? '' : interp) + '</span><span class="stockafterhourpct">(' + escape((interp = quote.afterHoursPct) == null ? '' : interp) + ')</span></span>');
}
 if (quote.followers)    
 var len=quote.followers.length
{
buf.push('<div class="stockfollows"><div class="followsdesc">');
 if (quote.followers_count)
{
 if (quote.isZH)
{
buf.push('<span>' + escape((interp = quote.followers_count) == null ? '' : interp) + '</span>');
}
 else
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (quote.url) + "/follows"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = quote.followers_count) == null ? '' : interp) + '</a>');
}
buf.push('人关注，');
}
 if (len)
{
buf.push('最活跃用户：');
}
buf.push('</div>');
 if (len)
{
buf.push('<div class="imglist">');
// iterate quote.followers
;(function(){
  if ('number' == typeof quote.followers.length) {

    for (var $index = 0, $$l = quote.followers.length; $index < $$l; $index++) {
      var follower = quote.followers[$index];

buf.push('<a');
buf.push(attrs({ 'href':("" + (domain_host) + "" + (follower.profile) + ""), 'target':("_blank"), 'title':("" + (follower.screen_name) + "") }, {"href":true,"target":true,"title":true}));
buf.push('><img');
buf.push(attrs({ 'src':("" + (follower.img) + "") }, {"src":true}));
buf.push('/></a>');
    }

  } else {
    var $$l = 0;
    for (var $index in quote.followers) {
      $$l++;      var follower = quote.followers[$index];

buf.push('<a');
buf.push(attrs({ 'href':("" + (domain_host) + "" + (follower.profile) + ""), 'target':("_blank"), 'title':("" + (follower.screen_name) + "") }, {"href":true,"target":true,"title":true}));
buf.push('><img');
buf.push(attrs({ 'src':("" + (follower.img) + "") }, {"src":true}));
buf.push('/></a>');
    }

  }
}).call(this);

buf.push('</div>');
}
buf.push('</div>');
}
buf.push('</div><div class="operations">');
 if(quote.followers)
{
buf.push('<div class="relations">');
 if (quote.following)
{
buf.push('<span class="onefollow"><s></s>已关注&nbsp;|&nbsp;</span><a');
buf.push(attrs({ 'data-id':('' + (quote.symbol) + ''), 'data-name':('' + (quote.name) + ''), "class": ('removeStock') }, {"data-id":true,"data-name":true}));
buf.push('>取消</a><a');
buf.push(attrs({ 'data-id':('' + (quote.symbol) + ''), 'data-name':('' + (quote.symbol) + ''), "class": ('groupStock') }, {"data-id":true,"data-name":true}));
buf.push('>分组</a>');
}
 else
{
buf.push('<a');
buf.push(attrs({ 'data-id':('' + (quote.symbol) + ''), 'data-name':('' + (quote.name) + ''), "class": ('foStock') }, {"data-id":true,"data-name":true}));
buf.push('>加关注</a>');
}
buf.push('</div>');
}
buf.push('<div class="contact"><a');
buf.push(attrs({ 'data-toggle':('at'), 'data-defaulttext':('$' + (quote.name) + '(' + (quote.symbol) + ')$ '), 'data-target':('$' + (quote.name) + '(' + (quote.symbol) + ')$') }, {"data-toggle":true,"data-defaulttext":true,"data-target":true}));
buf.push('>讨论</a>');
if ( ( !quote.isTP && !quote.isFP && !quote.isZH ))
{
buf.push('<a');
buf.push(attrs({ 'data-target':('' + (quote.symbol) + ''), "class": ('exchange') }, {"data-target":true}));
buf.push('>持仓 </a>');
}
buf.push('</div></div>');
}
 else
{
buf.push('<div class="load">正在获取股票信息...</div>');
}
}
return buf.join("");
};module.exports = anonymous;});