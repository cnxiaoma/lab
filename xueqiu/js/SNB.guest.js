define('SNB.guest.js', ["nav_imeigu.jade.js","nav.jade.js","loginDialog.jade.js"], function (require, exports, module) {	require.async("SNB.password.js");

  function delCookie(name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + '=a; expires=' + date.toGMTString();
  }

	SNB.Guest = {
		clearCookie: function () {
      delCookie('xq_a_token');
      delCookie('xq_r_token');
      delCookie('xq_is_login');
      $.cookie("xq_a_token", null, { path: "/", domain: 'xueqiu.com'});
      $.cookie("xq_a_token", null, { path: "/", domain: '.xueqiu.com'});
      $.cookie("xq_r_token", null, { path: "/", domain: 'xueqiu.com'});
      $.cookie("xq_r_token", null, { path: "/", domain: '.xueqiu.com'});
      $.cookie("xq_is_login", null, { path: "/", domain: 'xueqiu.com'});
      $.cookie("xq_is_login", null, { path: "/", domain: '.xueqiu.com'});
		},
		loginIn: function (email, areacode, telephone, password, remember_me, callback, error_callback) {
      SNB.Guest.clearCookie();
      $.ajax('/user/login', {
        type: 'post',
        data: {
          username: email,
          areacode: areacode,
          telephone: telephone,
          remember_me: remember_me || 0,
          password: SNB.Password.encryPw(password, email)
        },
        error: function (xhr) {
          var ret = {};
          try {
            ret = $.parseJSON(xhr.responseText);
          } catch (e) {

          }
          if ($.isFunction(error_callback)) {
            error_callback(ret);
          }
        }
      }).done(function (data) {
        if ($.isFunction(callback)) {
          callback(data);
        }
      });
		},
		applyRegister: function (email, nickname, pw, pws, errorMsg, loading_image, email_err, verifyCode) {
			var email_val = $.trim(email.val());

			var login_xueqiu = function () {
				$('body').on('click', '.login_xueqiu', function (e) {
					e.preventDefault();

					SNB.Guest.showLoginDialog(function () {
						location.href = SNB.domain.host;
					});
				});
			};

			SNB.Util.verifyEmail(email_val, function (ret) {
				if (ret.success) {
					SNB.post('/account/signup_by_email.json', {
						email: email_val,
						nickname: nickname,
						passwd1: SNB.Password.encryPw(pw, email_val),
						passwd2: SNB.Password.encryPw(pws, email_val),
            verify_code: verifyCode || ''
					}, function (data) {
						loading_image.hide();

						if (data.success) {
							location.href = '/account/regSuc?email=' + encodeURIComponent(email_val);
						}
					}, function (ret) {
						SNB.data.submitting = false;
						loading_image.hide();

						switch (ret.error_code) {
							case '21715':
								errorMsg.text("该帐号涉嫌恶意注册已被禁用。如需帮助，请发邮件至：service@xueqiu.com")

								break;
							case '22601':
								errorMsg.text("您注册过于频繁，请稍后再试");

								break;
							case '20021':
								errorMsg.html("该邮箱已经注册，<a href='#' class ='login_xueqiu'>请登录雪球</a>");
								login_xueqiu();

                break;
              case '22617':
                // 验证码无效
                $('.verify-code').find('.reload-code').trigger('click');

								break;
							default:
						}

						errorMsg.text(ret.error_description);
					});
				} else {
					loading_image.hide();
					SNB.data.submitting = false;

					email_err.html('该邮箱已经注册，<a href="#" class ="login_xueqiu">请登录雪球</a>');
					login_xueqiu();
					email.focus();
				}
			});
		},
		updateLoginState: function (user) {
			var images = user.profile_image_url && user.profile_image_url.split(",");
			user.profile_image_url = images && images.length >= 3 ? images[2] : "community/default/avatar.png!50x50.png";
			var obj = {
				currentUser: user,
				id: $body.attr("id") || "",
				domain: SNB.domain
			};
			var $nav_template = SNB.data.loginIn_imeigu ? require("./nav_imeigu.jade")(obj) : require("./nav.jade")(obj),
				$navbar = $(".navbar.navbar-fixed-top");

			$navbar.find('.notlogined').remove();
			//置换登录导航条
			SNB.currentUser = user;

			if ($navbar.find(".nav_logined").length === 0) {
				$nav_template = $($nav_template);
				//找一下现有的导航条里的搜索框
				var _dom = $navbar.find('.search');
				if (_dom.length > 0) {
					//如果有就替换到即将加载进来的导航条里
					var _search = $nav_template.find('.search');
					_search.after(_dom);
					_search.remove();
				}
				$navbar.find("#logo").after($nav_template);
			}
		},
		updateOverlayLogin: function () {
			var $inputArea = $(".inputArea");
			$inputArea
				.removeClass("notlogined")
				.find(".loginDialog")
				.hide()
				.end()
				.find(".ui-widget-overlay")
				.hide()
				.end()
				.find(".commentEditor")
				.removeProp("disabled")
				.height(60);
		},
		showLoginDialog: function (callback) {
			SNB.data.show_login_dialog = true
			SNB.data.login_callback = callback;

			var regEmail = /^([0-9a-zA-Z_\.\-\+]+)\@([0-9a-zA-Z\-\.]+)\.([0-9a-zA-Z\.]{1,})$/,
				regChinaMobile = /^1[3|4|5|8][0-9]\d{4,8}$/,
				regDigit = /^[0-9]*$/,
				regAbroadMobile = /^(\+\d+|\(?\d+\)?)\d+$/;

			function validateForm(email, pw) {
				var account = $.trim(email.val()),
					pw_val = $.trim(pw.val()),
					isEmail = regEmail.test(account),
					isChinaMobile = regChinaMobile.test(account),
					isAbroadMobile = regAbroadMobile.test(account);

				if (account === "") {
					alert("请输入邮箱或手机号码，海外手机号码需要国家区号，如 +82");
					email.focus();

					return false;
				} else if (!isEmail && !isChinaMobile && !isAbroadMobile) {
					alert("帐号格式不正确");
					email.focus();

					return false;
				}

				if (!pw_val) {
					alert("请输入密码");
					pw.focus();

					return false;
				} else if (pw_val.length < 6 || pw_val.length > 16) {
					alert("密码应该大于6位，小于16位。");
					pw.focus();

					return false;
				}

				return true;
			}

			require.async('SNB.third_oauth.js');

			var userId = $.cookie("last_account"),
				loginDialog_template = require('./loginDialog.jade');

      $('#dialog-login').remove();
			$("body").findOrAppend("#dialog-login", loginDialog_template);

			var $loginDialog = $("#dialog-login");

			// load region code list
			SNB.get('/user/setting/areacode.json', function (res) {
				var $select = $('select');

				$.each(res, function (i, v) {
					var $option = $('<option value="' + v.code + '">' + v.name_cn + '</option>');

					if (v.code === '86') {
						$option
							.val('86')
							.attr('selected', 'selected');
					}

					$select
						.append($option);
				});

				$('.region-code')
					.append($select.html());
			});

			$loginDialog.dialog({
				title: "登录",
				modal: true,
				dialogClass: "poploginbox",
				width: 600
//        open: function () {
//          $('html').css({
//            overflow: 'hidden'
//          });
//        },
//        close: function () {
//          $('html').css({
//            overflow: 'visible'
//          });
//        }
			}).css({"padding": "0px"});

			SNB.Util.dialog_vertical_middle($loginDialog.closest(".ui-dialog"));

			if (userId) {
				userId = userId.replace(/"([^"]*)"/g, "$1");
				$loginDialog
					.find("#pop_email")
					.val(userId)
					.end()
					.find("#pop_password")
					.focus();
			}

			var isPlaceholderSupport = "placeholder" in document.createElement("input");

			$loginDialog
				.off("click", ".pop_connect_link a")
				.off("blur", ".placeholder")
				.off("click", "#loginButton")
				.on("click", ".pop_connect_link a", function (e) {
					if (e.target.id === "qq_login") {
						SNB.third_oauth.oauthLogin_qq({directLogin: true});
					} else if (e.target.id === "sina_login") {
						SNB.third_oauth.oauthLogin("sina");
					} else if(e.target.id === 'wc_login'){
            SNB.third_oauth.oauthLogin_wc({directLogin: true});
          }
				})
				.on("blur", ".placeholder", function () {
					var $this = $(this),
						placeholder = $this.attr("placeholder");

					if ($this.val() === "") {
						$this
							.css("color", "#ccc")
							.val(placeholder);
					}
				})
				.on('focus', '.placeholder', function () {
					var $this = $(this),
						placeholder = $this.attr('placeholder');

					if ($this.val() === placeholder) {
						$this
							.css('color', '#000')
							.val('');
					}
				})
				.on('click', '.region-switcher', function (e) {
					e.preventDefault();

					var $this = $(this),
						text = $this.text(),
						data = $this.data('text'),
						$region = $loginDialog.find('.region-code'),
						$account = $('#pop_email'),
						placeholder = $account.attr('placeholder'),
						dataPlaceholder = $account.data('placeholder');

					$region
						.toggle()
						.parents('p')
						.toggleClass('abroad');

					$this
						.text(data)
						.data('text', text);

					$account
						.val('')
						.attr('placeholder', dataPlaceholder)
						.data('placeholder', placeholder);

					return false;
				})
				.on("click", "#loginButton", function (e) {
					e.preventDefault();

					var email = $loginDialog.find("#pop_email"),
						account = $.trim(email.val()),
						pw = $loginDialog.find("#pop_password"),
						pw_val = $.trim(pw.val()),
						emailVal = '',
						code = $loginDialog.find('.region-code :selected').val(),
						mobile = '',
						isEmail = regEmail.test(account),
						isChinaMobile = regChinaMobile.test(account),
						isAbroadMobile = regAbroadMobile.test(account),
						remember_me = 0;

					if ($loginDialog.find("#login_days").is(":checked")) {
						remember_me = 1;
					}

					if (account === email.attr('placeholder')) {
						account = '';
					}

					if (pw_val === pw.attr('placeholder')) {
						pw_val = '';
					}

					if (validateForm(email, pw)) {
						if (isEmail) {
							emailVal = account;
						} else {
							mobile = account;
						}
						SNB.Guest.loginIn(emailVal, code, mobile, pw_val, remember_me, function (ret) {
							if (!$.cookie("xq_is_login")) {
								alert("无法写入cookies,请检查当前浏览器设置")
							} else {
								$loginDialog.dialog("close");
								SNB.Guest.updateLoginState(ret.user);
								SNB.Guest.updateOverlayLogin();

								if (callback) {
									callback();
								}

								window.location.reload();
							}
						}, function (ret) {
							SNB.Util.failDialog(ret.error_description);

							return false;
						});
					}
				})
				.on('keyup blur', '#pop_email', function (e) {
					var $this = $(this),
						account = $.trim($this.val()),
						$error = $loginDialog.find('.err');

					if (!account) {
						$error.hide();
					}

					if (account.length < 2) {
						return false;
					}

					if (regDigit.test(account) && !/^1[3|4|5|8]$/.test(account.substr(0, 2))) {
						$error.show();
					} else {
						$error.hide();
					}
				})
				.on('focus', '#pop_email', function () {
					var $error = $loginDialog.find('.err');

					$error.hide();
				});
		}
	}

});
;
define("nav_imeigu.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var nav_item_mixin = function(link_id,url,title,link_class,target){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
 link_class = link_class || ''
buf.push('<li');
buf.push(attrs({ 'title':(title), "class": (id === link_id ? 'active' + link_class : link_class) }, {"class":true,"title":true}));
buf.push('><a');
buf.push(attrs({ 'href':(url), 'target':(target) }, {"href":true,"target":true}));
buf.push('>');
var __val__ = title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
};
var nav_wrapper_mixin = function(){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
nav_item_mixin("",domain.host + "/S?exchange=US&industry=%E6%98%8E%E6%98%9F%E8%82%A1","明星股","","_blank");
nav_item_mixin("",domain.host + "/S?exchange=US&industry=%E4%B8%AD%E5%9B%BD%E6%A6%82%E5%BF%B5%E8%82%A1","中国概念股","","_blank");
nav_item_mixin("",domain.host + "/S?exchange=US&industry=%E4%B8%AD%E5%9B%BD%E4%BA%92%E8%81%94%E7%BD%91%E4%BF%A1%E6%81%AF%E6%9C%8D%E5%8A%A1","互联网","","_blank");
nav_item_mixin("",domain.host + "/S?exchange=US&industry=%E4%B8%AD%E5%9B%BD%E7%BD%91%E7%BB%9C%E6%B8%B8%E6%88%8F","网游","","_blank");
nav_item_mixin("",domain.host + "/S?exchange=US&industry=%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD","教育","","_blank");
nav_item_mixin("",domain.host + "/S?exchange=US","全部美股","","_blank");
nav_item_mixin("",domain.host,"雪球","","_blank");
};
buf.push('<div><ul class="nav">');
nav_wrapper_mixin();
buf.push('</ul></div>');
}
return buf.join("");
};module.exports = anonymous;});;
define("nav.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var nav_item_mixin = function(link_id,url,title,link_class){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
 link_class = link_class || ''
buf.push('<li');
buf.push(attrs({ "class": (id === link_id ? 'active' + link_class : link_class) }, {"class":true}));
buf.push('><a');
buf.push(attrs({ 'href':(url) }, {"href":true}));
buf.push('>');
var __val__ = title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
};
var nav_wrapper_mixin = function(){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
nav_item_mixin("my-home","/","首页");
buf.push('<li class="dropdown hots"><a href="/today" data-toggle="dropdown" data-target="#" class="dropdown-toggle">精华<b class="caret"></b></a><ul class="dropdown-menu">');
nav_item_mixin("","/today/all","今日话题");
buf.push('<!--mixin nav-item("","/today/hots","热门讨论")-->');
nav_item_mixin("","/talks/all","雪球访谈");
nav_item_mixin("","/people","找人");
buf.push('</ul></li><li class="dropdown hq"><a href="/hq" data-toggle="dropdown" data-target="#" class="dropdown-toggle">行情<b class="caret"></b></a><ul class="dropdown-menu">');
nav_item_mixin("","/hq","行情中心");
nav_item_mixin("","/hq/screener","筛选器");
nav_item_mixin("","/hq#exchange=P&industry=私募工场&firstName=私募","私募工场");
nav_item_mixin("","/hq#xgss","新股上市");
buf.push('</ul></li>');
nav_item_mixin("userRecommend","/p/discover","买什么","guide_div_two guide_div");
};
var nav_account_logined_mixin = function(currentUser){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<li class="dropdown"><a href="#" data-toggle="dropdown" data-target="#" class="dropdown-toggle">');
var __val__ = currentUser.screen_name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<b class="caret"></b></a><ul class="dropdown-menu"><li id="nav-account-profile"><a');
buf.push(attrs({ 'href':(currentUser.profile + '/profile') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(domain.photo + '/' + currentUser.profile_image_url), 'width':('30px'), 'height':('30px') }, {"src":true,"width":true,"height":true}));
buf.push('/>');
var __val__ = currentUser.screen_name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
nav_item_mixin("","/setting/user","个人设置");
nav_item_mixin("","/setting/st_privacy","股票设置");
buf.push('<li><a href="/user/logout" class="exit">退出</a></li></ul></li><li class="dropdown"><a id="btn-notice" href="#" data-toggle="dropdown" data-target="#" class="dropdown-toggle">消息<sup>0</sup><b class="caret"></b></a><ul class="notices-list dropdown-menu"><li class="comments"><a href="/comments" class="pjax"><span class="count"></span>收到的评论</a></li><li class="dm"><a href="/messages"><span class="count"></span>新私信</a></li><li class="mentions"><a href="/atme" class="pjax"><span class="count"></span>@我的</a></li><li class="followers"><a href="/follows"><span class="count"></span>新增粉丝</a></li><li class="notices"><a href="#" class="pjax"><span class="count"></span>新公告</a></li><li class="events"><a href="/calendar" class="pjax"><span class="count"></span>事件提醒</a></li><li class="setting"><a href="/setting/notice">提醒设置</a></li></ul></li>');
 if (currentUser.enableIM)
{
buf.push('<li class="dropdown"><!--a#btn-open-im(href="#")--><!--  聊天--><!--  sup 0--></li>');
}
};
buf.push('<div class="nav_logined"><ul class="nav">');
nav_wrapper_mixin();
buf.push('</ul><div class="search"><form method="get" action="/k"><input id="quick-search" name="q" type="text" autocomplete="off" placeholder="搜索 股票/讨论/用户/组合/群组" class="typeahead"/></form><span class="icon"><i></i></span></div><ul class="nav pull-right account">');
if ( currentUser.id)
{
nav_account_logined_mixin(currentUser);
}
buf.push('</ul></div>');
}
return buf.join("");
};module.exports = anonymous;});;
define("loginDialog.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<style>.ui-dialog p{\n  margin:10px 0;\n}\n.region-switcher{\n  float:right;\n}\n.region-code{\n  display:none;\n}\n.abroad .region-code{\n  display:inline;\n  margin-right:10px;\n  width:55px;\n}\n.poploginbox.ui-dialog.ui-widget-content .poploginbox_left .abroad #pop_email{\n  width:165px;\n}\n.ui-dialog .title{\n  width:245px;\n  font-size:14px;\n}\n</style><div id="dialog-login" class="dialog-wrapper">');
 var domain_host = "http://xueqiu.com"
buf.push('<div class="poploginbox_left"><p class="title"><a href="javascript:void(0);" data-text="邮箱登录" class="region-switcher">海外手机号登录</a>登录雪球</p><form');
buf.push(attrs({ 'id':('loginForm'), 'action':("" + (domain_host) + "/service/login"), 'method':("post"), "class": ('formbox') }, {"action":true,"method":true}));
buf.push('><p><select class="region-code"></select><input id="pop_email" style="" type="text" name="email" placeholder="邮箱/手机号码" data-placeholder="海外手机号码" class="placeholder"/></p><p><input id="pop_password" name="passwd" type="password" placeholder="密码" class="placeholder"/><span class="lostpw"><a');
buf.push(attrs({ 'href':("" + (domain_host) + "/account/lostpasswd"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>忘记密码？</a></span></p><p><input id="loginButton" type="submit" value="登 录" class="submit"/><input id="login_days" type="checkbox" name="remember_me" value="1" style="margin-left:70px;" checked="checked"/><label for="login_days">下次自动登录</label></p></form><p style="float:left" class="regtxt">或使用合作网站账号登录：</p><div class="pop_connect_link"><ul class="icon_connect"><li><a id="sina_login" href="javascript:;" title="使用新浪微博帐号登录"><span class="icon_sina"></span>微博</a></li><li><a id="qq_login" href="javascript:;" title="使用QQ帐号登录"><span class="icon_qq"></span>QQ</a></li><li><a id="wc_login" href="javascript:;" title="使用微信帐号登录"><span class="icon_wc"></span>微信</a></li></ul></div></div><div class="poploginbox_right"><h4>没有帐号？</h4><p class="regtxt">加入雪球，讨论关注的股票和话题</p><p><a');
buf.push(attrs({ 'href':("" + (domain_host) + "/account/reg"), "class": ('green_button') }, {"href":true}));
buf.push('>注册</a></p></div></div>');
}
return buf.join("");
};module.exports = anonymous;});