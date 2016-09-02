/**
 * @fileOverview
 * @author rekey
 * Created by rekey on 24/7/14.
 */
define('widget/util/user.js', ["common/util/jquery.extend","widget/bootstrap/modal","pagelets/util/login.jade.js","common/util/observer","common/util/password","widget/util/modal","widget/util/areas","pagelets/util/bindphone-prompt.jade.js"], function (require, exports, module) {  require('common/util/jquery.extend.js');
  require('widget/bootstrap/modal.js');

  var $ = jQuery;
  var loginHtml = require('pagelets/util/login.jade');
  var html = loginHtml();
  var Observer = require('common/util/observer.js');
  var Password = require('common/util/password.js');
  var Modal = require('widget/util/modal');
  var areas = require('widget/util/areas');
  var $div = $('<div />');

  $div.html(html);

  $(function () {
    $('body').append($div);
    // 首页退出登陆后 redirect到首页
    if (/^\/\d+\/?$/.test(window.location.pathname)) {
      $('.dropdown-menu .exit').attr('href', '/user/logout?redirect_uri=/');
    }
  });

  var $modal = $('#modal-login', $div),
    $form = $('#login-form', $div),
    $link = $('#region-switcher', $div),
    $usernameInput = $('#pop_username', $div),
    $navLogin = $('#nav-login'),
    $loginLink = $('#nav-login-link'),
    $account = $('#nav-account'),
    $isLogin = $navLogin.css('display') === 'block',
    regEmail = /^[a-z0-9](\w|\.|-|\+)*@([a-z0-9]+-?[a-z0-9]+\.){1,3}[a-z]{2,4}$/i;

  $modal.hide();

  function isPhoneNumber(str) {
    if (!str || str.length !== 11) {
      return false;
    }
    str = $.trim(str + '');
    var s = str.slice(0, 3);
    if (!/^\d{11}$/.test(str)) {
      return false;
    }

    /*
    Modified by yahuang.wu 2015-3-31
    130、131、132、133、134、135、136、137、138、139、
    145、147
    150、151、152、153、155、156、157、158、159
    170、176、177、178
    180、181、182、183、184、185、186、187、188、189
    */
    if (/^1[3|8][0-9]/.test(s) || /^17[0|6|7|8]/.test(s)|| /^15[0|1|2|3|5|6|7|8|9]/.test(s)|| /^14[5|7]/.test(s)) {
      return true;
    }
  }

  function isEmail(str) {
    if (!str) {
      return false;
    }
    str = $.trim(str + '');
    return regEmail.test(str);
  }

  function showLoginModal() {
    var userLoginFailCallback = function (e, data) {
      if (data && data.data && data.data.error && data.data.error.error_description) {
        Modal.alert(data.data.error.error_description, 'warn');
      }
    };
    $modal.modal();
    $modal.on('hide', function () {
      Observer.unsubscribe('user:login:fail', userLoginFailCallback);
      $modal.off('hide', arguments.callee);
    });
    Observer.subscribe('user:login:fail', userLoginFailCallback);
  }

  function hideLoginModal() {
    $modal.off('hide');
    $modal.modal('hide');
  }

  function render(template, data) {
    return template.replace(/\{\w+}/g, function ($1) {
      var key = $1.replace(/[{}]/g, '');
      return data[key];
    });
  }

  function post(data) {
    if(isPhoneNumber(data.username)){
      data.telephone = data.username;
      delete data.username;
    }
    data.password = Password.encryPw(data.password, data.username);
    return $.ajax({
      type: 'post',
      url: $form.attr('action'),
      data: data
    }).done(function (resp) {
      Observer.publish('user:login:success', {
        data: resp
      });
    }).fail(function (xhr) {
      var data = xhr.responseJSON;
      if (!data) {
        try {
          data = $.parseJSON(xhr.responseText);
        } catch (e) {
          data = {};
        }
      }
      data.statusCode = xhr.status;
      Observer.publish('user:login:fail', {
        data: {
          error: data,
          xhr: xhr,
          formData: data
        }
      });
    });
  }

  function initForm($form) {
    var $select = $form.find('select[name=areacode]');
    var deferred = $.Deferred();
    deferred.promise().then(function (resp) {
      $select.html(resp);
    });
    var str = '';
    (function (i) {
      var fn = arguments.callee;
      if (areas[i]) {
        str += '<option value="' + areas[i].code + '">' + areas[i].name + '</option>';
        setTimeout(function () {
          fn(i + 1);
        }, 0);
      } else {
        deferred.resolve(str);
      }
    })(0);
    $form.on('submit', function () {
      var formData = $form.formSerialize();
      formData.areacode = formData.areacode - 0;
      if(!formData.username){
        Modal.alert("请输入手机号或邮箱","warn");
        return false;
      }
      if(!formData.password){
        Modal.alert("请输入密码","warn");
        return false;
      }
      var isOtherPhoneNumber = formData.areacode !== 86 && /^[\d]+$/.test(formData.username);
      var isErrorFormat = !isPhoneNumber(formData.username) && !isEmail(formData.username);
      if (!isOtherPhoneNumber && isErrorFormat) {
        Observer.publish('user:login:fail', {
          data: {
            error: {
              error_code: 1,
              error_description: '帐号格式错误，请重新输入。'
            },
            formData: formData
          }
        });
        return false;
      }
      //强制检测是否手机号
      if (isPhoneNumber(formData.username) || isOtherPhoneNumber) {
        formData.telephone = formData.username;
        delete formData.username;
      }
      formData.password = Password.encryPw(formData.password, formData.username);
      //text-small
      $.ajax({
        type: 'post',
        url: $form.attr('action'),
        data: formData
      }).done(function (resp) {
        Observer.publish('user:login:success', {
          data: resp
        });
      }).fail(function (xhr) {
        var data = xhr.responseJSON;
        if (!data) {
          try {
            data = $.parseJSON(xhr.responseText);
          } catch (e) {
            data = {};
          }
        }
        data.statusCode = xhr.status;
        Observer.publish('user:login:fail', {
          data: {
            error: data,
            xhr: xhr,
            formData: formData
          }
        });
      });
      return false;
    });
  }

  initForm($form);

  function getWindowSize(options) {
    var screenX = typeof window.screenX || window.screenLeft,
      screenY = typeof window.screenY || window.screenTop,
      outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.documentElement.clientWidth,
      outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.documentElement.clientHeight - 22),
      width = typeof options !== "undefined" && typeof options.width !== "undefined" ? options.width : 580,
      height = typeof options !== "undefined" && typeof options.height !== "undefined" ? options.height : 355,
      left = parseInt(screenX + ((outerWidth - width) / 2), 10),
      top = parseInt(screenY + ((outerHeight - height) / 2.5), 10);

    return 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no';
  }

  $link.on('click', function () {
    var text = $link.data('text');
    var placeholder = $usernameInput.data('placeholder');
    $link.data('text', $link.html());
    $link.html(text);
    $usernameInput.data('placeholder', $usernameInput.attr('placeholder'));
    $usernameInput.attr('placeholder', placeholder);
    $usernameInput.val('');
    $form.find('.region-code').toggle();
    if ($usernameInput.data('value') == '0') {
      $usernameInput.data('value', 1);
      $usernameInput.addClass('text-small');
    } else {
      $usernameInput.data('value', 0);
      $usernameInput.removeClass('text-small');
    }
    return false;
  });

  $loginLink.on('click', function () {
    try {
      showLoginModal();
    } catch (e) {
    }
    return false;
  });

  $(document).on('click', '#modal-login .popup-login-oauth a', function () {
    var $link = $(this);
    module.exports.oauthLogin($link.attr('class'));
    return false;
  });

  Observer.subscribe('user:login:fail', function (e, data) {
    if (data.data.error_description) {
      alert(data.data.error_description);
    }
  });

  Observer.subscribe('user:oauthLogin:success', function () {
    $.get('/user/show.json').done(function (resp) {
      Observer.publish('user:login:success', {
        data: {
          user: resp
        }
      });
    });
  });

  Observer.subscribe('user:login:success', function (e, data) {
    var $profile = $('#nav-account-profile'),
      $name = $('#nav-account-name'),
      user = {};
    $.extend(user, data.data.user);
    user.photo_domain = '//xavatar.imedao.com/';
    user.profile_image_url = user.profile_image_url.split(',');
    user.profile_image_url = user.profile_image_url[1] || user.profile_image_url[0];
    try {
      $profile.html(render($profile.find('script')[0].text, user));
      $name.html(render($name.find('script')[0].text, user));
    } catch (e) {

    }
    $account.show();
    $navLogin.hide();
    hideLoginModal();
  });

  Observer.subscribe('user:login:success', function (e, data) {
    window.SNB = window.SNB || {};
    window.SNB.currentUser = data.data.user;

    $('#nav-logined').show();
    //注册页面如果登录成功的话需要跳转到首页，两种情况。1、通过登录弹框登录成功。2、通过绑定的QQ、微博、微信账号登录成功。我擦，这代码好恶心。created by yahuang.wu
    if(window.location.host.indexOf("account/reg") >= 0){
      window.location.href = data.data.user.profile;
    }

  });

  /*
   * 登录
   * @return {Promise}
   * */
  function login() {
    //创建deferred对象
    var deferred = jQuery.Deferred();

    Observer.subscribe('user:login:success', function (e, data) {
      deferred.resolve(data.data);
      Observer.unsubscribe('user:login:success', arguments.callee);
    });

    Observer.subscribe('user:login:fail', function (e, data) {
      deferred.reject(data);
      Observer.unsubscribe('user:login:fail', arguments.callee);
    });

    return deferred.promise();
  }

  // 检测是否垃圾用户
  $(function () {
    if (!$.cookie) {
      (function (a) {
        a.cookie = function (b, c, d) {
          if (arguments.length > 1 && String(c) !== "[object Object]") {
            d = a.extend({}, d);
            if (c === null || c === undefined)d.expires = -1;
            if (typeof d.expires == "number") {
              var e = d.expires, f = d.expires = new Date;
              f.setDate(f.getDate() + e)
            }
            c = String(c);
            return document.cookie = [encodeURIComponent(b), "=", d.raw ? c : encodeURIComponent(c), d.expires ? "; expires=" + d.expires.toUTCString() : "", d.path ? "; path=" + d.path : "", d.domain ? "; domain=" + d.domain : "", d.secure ? "; secure" : ""].join("")
          }
          d = c || {};
          var g, h = d.raw ? function (a) {
            return a
          } : decodeURIComponent;
          return (g = (new RegExp("(?:^|; )" + encodeURIComponent(b) + "=([^;]*)")).exec(document.cookie)) ? h(g[1]) : null
        }
      })($);
    }

    var isSpamUser = $.cookie("is_spam");
    var telephone = $.cookie("telephone");
    var url = "/account/verfiy-binded-phone-number";

    if (!isSpamUser) {
      return;
    }

    if (window.location.href.indexOf(url) > -1) {
      return;
    }

    // 已绑定手机号的话  跳到验证手机号页面
    if (telephone) {
      window.location.href = "/account/verfiy-binded-phone-number"
    } else {
      var template = require('pagelets/util/bindphone-prompt.jade');

      var $dialog = $(template({
        data: {}
      }));

      $("body").append($dialog);
      $dialog.modal({
        "backdrop": "static"
      });

      $dialog.find(".close").hide();
      $dialog
        .css("width", 500)
        .find(".modal-wrap")
        .css("height", "auto")
        .on("click", ".submit", function () {
          window.location.href = "/about/what-is-xueqiu"
        })
        .on("click", ".cancel", function () {
          $.get("/service/account/remove_spam", function (ret) {
            if (ret.success) {
              window.location.href = "/user/logout";
            }
          });
        });
    }
  });


  module.exports = {
    /*
     * 登录
     * @param callback {Function} 登录成功回调函数
     * @param fallback {Function} 登录失败回调函数，需要注意的是用户主动放弃登录会被认为登录失败
     * @return {Promise}
     * */
    login: function () {
      var deferred = jQuery.Deferred();
      var info = this.info();
      info.done(function (resp) {
        deferred.resolve(resp);
      });
      info.fail(function () {
        var promise = login();
        promise.done(function (resp) {
          deferred.resolve(resp);
        });
        promise.fail(function (resp) {
          deferred.reject(resp);
        });
        //登录成功的回调会取消这个事件绑定，并且隐藏登录窗口
        //如果不是登录成功，则认为用户手动关闭登录窗口，判定为登录失败。
        $modal.on('hide', function () {
          Observer.publish('user:login:fail', {
            data: {}
          });
          $modal.off('hide', arguments.callee);
        });
        //展示登录窗口
        showLoginModal();
      });
      return deferred.promise();
    },
    logout: function () {
    },
    info: function () {
      var deferred = jQuery.Deferred();
      if (window.SNB && SNB.currentUser && SNB.currentUser.id) {
        deferred.resolve(SNB.currentUser);
      } else {
        deferred.reject(SNB.currentUser);
      }
      return deferred.promise();
    },
    oauthLogin: function (source) {
      var url = '',
        name = '',
        parameters = getWindowSize({width: 840, height: 600});

      source = source || 'weibo';

      switch (source) {
        case 'weibo' :
          //if (!$isLogin) {
          //  url = '/oauth2/bind?source=' + source;
          //} else {
          //  url = '/oauth2/login3?source=' + source;
          //}
          url = '/oauth2/login3?source=' + source;
          name = 'sina_connect';
          parameters = getWindowSize();
          break;
        case 'qq':
          name = "qq_oauthLogin";
          url = "https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=100229413&redirect_uri=" + window.location.protocol + "%2F%2Fxueqiu.com/service/qqconnect&scope=get_user_info,add_share,add_t";
          break;
        case 'weixin':
          name = "weixin_oauthLogin";
          url = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx0c5bd6af79a89c2d&redirect_uri=http%3A%2F%2Fxueqiu.com/service/wcconnect&response_type=code&scope=snsapi_login';
          break;
        default:
          break;
      }
      window.open(url, name, parameters);
      //$("body").prepend('<iframe width="800" height="600" src="' + url + '"></iframe>');
      return login();
    },
    initForm: initForm,
    post: post,
    isPhoneNumber: isPhoneNumber,
    isEmail: isEmail
  };
});
;
define("pagelets/util/login.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var modal_mixin = function(data){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<div');
buf.push(attrs({ 'id':("" + (data.id || '') + ""), "class": ("modal" + (data.className ? ' ' + data.className : '') + "") }, {"id":true,"class":true}));
buf.push('><div class="modal-wrap">');
if ((data.title))
{
buf.push('<div class="modal-title"><h3>' + escape((interp = data.title) == null ? '' : interp) + '</h3></div>');
}
if ((!data.hideClose))
{
buf.push('<span data-dismiss="modal" aria-hidden="true" class="close">X</span>');
}
buf.push('<div class="modal-content">');
if ( (block))
{
block && block();
}
buf.push('</div></div></div>');
};
 var modalLoginView = {title:'登录', id:'modal-login', className:'modal-login'};
modal_mixin.call({
block: function(){
buf.push('<div class="popup-login"><div class="popup-login-form"><form id="login-form" action="/user/login" method="post" class="formbox"><p><label class="region-code left"><select name="areacode" value="86"></select></label><input id="pop_username" type="text" data-value="0" name="username" placeholder="手机号/邮箱" data-placeholder="海外手机号码" class="placeholder text"/></p><p><input id="pop_password" type="password" name="password" placeholder="密码" class="placeholder text"/></p><p><input id="login_days" type="checkbox" name="remember_me" value="1" checked="checked"/><label for="login_days">&nbsp;&nbsp;一个月内自动登录</label><span class="lostpw"><a href="/account/lostpasswd" target="_blank">忘记密码？</a></span></p><p><button id="loginButton" type="submit" class="submit btn">登 录</button></p></form><div class="bottom"><p class="popup-login-oauth"><span>社交帐号登录</span><a id="sina_login" href="javascript:;" title="使用新浪微博帐号登录" class="weibo"><img src="//assets.imedao.com/images/pages/user/icon_login_sina_color@2x.png" class="weibo"/></a><a id="weixin_login" href="javascript:;" title="使用QQ帐号登录" class="weixin"><img src="//assets.imedao.com/images/pages/user/icon_login_wechat_color@2x.png" class="weixin"/></a><a id="qq_login" href="javascript:;" title="使用QQ帐号登录" class="qq"><img src="//assets.imedao.com/images/pages/user/icon_login_qq_color@2x.png" class="qq"/></a><a id="region-switcher" href="javascript:void(0);" data-text="邮箱登录">海外手机号登录</a></p></div></div><div class="popup-login-info"><p class="tip">还没有雪球帐号?</p><a href="/account/reg" class="btn btn-2">马上注册</a></div></div>');
}
}, modalLoginView);
}
return buf.join("");
};module.exports = anonymous;});;
define("pagelets/util/bindphone-prompt.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var modal_mixin = function(data){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<div');
buf.push(attrs({ 'id':("" + (data.id || '') + ""), "class": ("modal" + (data.className ? ' ' + data.className : '') + "") }, {"id":true,"class":true}));
buf.push('><div class="modal-wrap">');
if ((data.title))
{
buf.push('<div class="modal-title"><h3>' + escape((interp = data.title) == null ? '' : interp) + '</h3></div>');
}
if ((!data.hideClose))
{
buf.push('<span data-dismiss="modal" aria-hidden="true" class="close">X</span>');
}
buf.push('<div class="modal-content">');
if ( (block))
{
block && block();
}
buf.push('</div></div></div>');
};
 var title = "帐号验证";
 var modalView = {hideClose: false, id: 'bindphone-dialog', className: 'modal-bindphone', title: title};
 var bindOptions = data.bindOptions;
 var user = data.user;
modal_mixin.call({
block: function(){
buf.push('<div class="before"></div><div class="after"></div><div class="dialog-bindphone"><div style="line-height: 18px" class="bind-title">您当前使用帐号存在异常,为了您的账户安全,请到雪球App客户端绑定手机号解除异常状态</div><div style="text-align: center; margin: 20px 0px;" class="bind-button"><input type="button" value="下载雪球App" class="submit btn btn-medium"/><input type="button" value="完成验证" class="cancel btn btn-gray btn-medium cancel"/></div><div style="line-height: 18px; font-size: 12px; color: #aaa" class="bind-prompt">提示: 登录雪球App在(个人设置-帐号绑定-手机号) 中完成手机号绑定. 若已绑定请点击完成验证按钮重新登录. 如有疑问请联系小秘书<a href="mailto:secreatary@xueqiu.com">secreatary@xueqiu.com</a></div></div>');
}
}, modalView);
}
return buf.join("");
};module.exports = anonymous;});