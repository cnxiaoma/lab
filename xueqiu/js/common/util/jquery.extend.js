/**
 * @fileOverview
 * @author rekey
 * Created by rekey on 29/7/14.
 */
define('common/util/jquery.extend.js', [], function (require, exports, module) {  var $ = jQuery;

  $.support.placeholder = $.support.placeholder || (function () {
      var attr = "placeholder";
      var input = document.createElement("input");
      var ret = attr in input;
      $(input).remove();
      return ret;
    })();

  function serialize(form) {
    if (!form) {
      return;
    }
    form = $(form);
    var nodeList = [].slice.call(form.find('select,input,textarea'), 0),
      ret = {};
    $.each(nodeList, function () {
      var el = this,
        type = el.type;
      if (!el.name || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') {
        return;
      }
      var name = el.name,
        value = (function () {
          if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) {
            return '';
          }
          if (el.value && $.trim(el.value) !== '') {
            return el.value;
          }
          return '';
        })();
      if (name && typeof ret[name] === 'undefined') {
        ret[name] = '';
      }
      if (value !== '') {
        if (ret[name] === '') {
          ret[name] = value;
        } else {
          if (typeof ret[name] === 'string') {
            ret[name] = [ret[name]];
          }
          ret[name].push(value);
        }
      }
    });
    return ret;
  }

  $.fn.formSerialize = function () {
    var form = this[0];
    return (form && form.tagName && form.tagName.toLowerCase() === 'form') ? serialize(form) : {};
  };

  //ajax 返回的 statusCode 为 400 的话默认尝试解析 responseText 为 responseJSON
  //如果解析失败，就默认赋予 jqxhr.responseJSON 为 {}
  $.ajaxSetup({
    error: function (error) {
      if (error.status && error.status === 400) {
        try {
          error.responseJSON = $.parseJSON(error.responseText);
        } catch (e) {
          error.responseJSON = {};
        }
      }
    }
  });

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

      if (options.method) {
        options.type = options.method;
      }

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

  (function ($) {

    var $doc = $(document);

    var api = {
      w3c: {
        requestFullscreen: 'requestFullscreen',
        exitFullscreen: 'exitFullscreen',
        fullscreenChange: 'fullscreenChange',
        fullScreen: 'fullScreen',
        fullscreenElement: 'webkitFullscreenElement'
      },
      ms: {
        requestFullscreen: 'msRequestFullscreen',
        exitFullscreen: 'msExitFullscreen',
        fullscreenChange: 'MSFullscreenChange',
        fullScreen: 'MSFullScreen',
        fullscreenElement: 'msFullscreenElement'
      },
      moz: {
        requestFullscreen: 'mozRequestFullScreen',
        exitFullscreen: 'mozCancelFullScreen',
        fullscreenChange: 'mozfullscreenchange',
        fullScreen: 'mozFullScreen',
        fullscreenElement: 'mozFullScreenElement'
      },
      webkit: {
        requestFullscreen: 'webkitRequestFullScreen',
        exitFullscreen: 'webkitCancelFullScreen',
        fullscreenChange: 'webkitfullscreenchange',
        fullScreen: 'webkitIsFullScreen',
        fullscreenElement: 'webkitFullscreenElement'
      }
    };

    var fullScreenApi = {
      supportFullScreen: false,
      requestFullscreen: function () {
      },
      exitFullscreen: function () {
      },
      fullScreenEventName: '',
      prefix: ''
    };

    var prefix = '';

    //检测是否支持，记录浏览器前缀
    fullScreenApi.supportFullScreen = (function () {
      var div = document.createElement('div');
      if (div.requestFullscreen) {
        prefix = fullScreenApi.prefix = 'w3c';
        return true;
      }
      if (div.msRequestFullscreen) {
        prefix = fullScreenApi.prefix = 'ms';
        return true;
      }
      if (div.mozRequestFullScreen) {
        prefix = fullScreenApi.prefix = 'moz';
        return true;
      }
      if (div.webkitRequestFullscreen) {
        prefix = fullScreenApi.prefix = 'webkit';
        return true;
      }
      return false;
    })();

    if (fullScreenApi.supportFullScreen) {
      var pre = api[prefix];
      var requestFullscreen = pre.requestFullscreen;
      var exitFullscreen = pre.exitFullscreen;
      var event = pre.fullscreenChange;
      var fullScreen = pre.fullScreen;
      var fullscreenElement = pre.fullscreenElement;
      var apiWrap = function (el) {
        el.requestFullscreen = el[requestFullscreen];
        el.exitFullscreen = el[exitFullscreen];
      };
      var currentFullscreenElement = null;
      $doc.on(event, function () {
        var element = document[fullscreenElement];
        if (currentFullscreenElement && currentFullscreenElement !== element) {
          $(currentFullscreenElement).trigger($.Event('fullscreenChange', {
            fullScreen: false
          }));
        }
        if (element) {
          currentFullscreenElement = element;
          $(element).trigger($.Event('fullscreenChange', {
            fullScreen: true
          }));
        }
      });
      fullScreenApi.requestFullscreen = function (el) {
        var $el = $(el);
        apiWrap(el);
        el.requestFullscreen();
        $el.on('fullscreenChange', function (e) {
          if (!e.fullScreen) {
            $el.off('fullscreenChange', arguments.callee);
          }
          console.log(e.fullScreen);
        });
      };

      fullScreenApi.exitFullscreen = function (el) {
        var fn = api[fullScreenApi.prefix].exitFullscreen;
        el[fn]();
      };
    }

    $.support.fullScreen = fullScreenApi.supportFullScreen;

    $.fn.requestFullscreen = function () {
      this.each(function () {
        fullScreenApi.requestFullscreen(this);
      });
    };

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
  }(jQuery));
});