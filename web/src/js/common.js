/**
 * common.js 全站公共事件
 */

/*正在加载...*/
function PPLoading(elem) {
    console.log(elem);
    var html = '<div class="g-loading-wrap"><div class="loading-box"><div class="loading-c animated"></div><div class="loading-pp"></div></div></div>';
    if (elem) {
        $(elem).addClass('PPLoading').append(html).css("position", "relative");
        return;
    }
    $(".PPLoading").append(html).css("position", "relative");
}

function hideLoading(elem) {
    $(elem || ".PPLoading").removeClass('PPLoading').find(".g-loading-wrap").remove();
}

/*加载出错*/
function PPError(elem, size) {
    var _size = "";
    if (size) {
        _size = " small";
    }
    var html = '<div class="g-error-box-wrap"><div class="g-error-box"><div class="error-cat' + _size + '"></div><div class="error-tips">您所访问的内容找不到，或被运走，您可以<a href="javascript:location.reload();" class="in">刷新</a></div></div></div>';
    if (elem) {
        $(elem).addClass('PPError').append(html).css("position", "relative");
        return;
    }
    $("body").append(html).css("position", "relative");
}



var UserCookie = {
    init: window.navigator.cookieEnabled ? true : false,
    setItem: function (key, value, expireTimes) {
        if (!UserCookie.init) {
            return;
        }
        var expires = new Date();
        expires.setTime(expires.getTime() + expireTimes)
        document.cookie = key + "=" + escape(value) +
        ((expireTimes == null) ? "" : ";expires=" + expires.toGMTString() + "; path=/;" + (window.location.toString().indexOf(".ppmoney.") > 0 ? "domain=.ppmoney.com" : ""))
    },
    getItem: function (key) {
        if (!UserCookie.init) {
            return;
        }
        if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(key + "=")
            if (start != -1) {
                start = start + key.length + 1
                var end = document.cookie.indexOf(";", start)
                if (end == -1)
                    end = document.cookie.length
                return unescape(document.cookie.substring(start, end))
            }
        }
        return ""
    },
    clear: function () {
        if (!UserCookie.init) {
            return;
        }
        if (document.cookie.length > 0) {
            document.cookie.clear();
        }
    },
    removeItem: function (key) {
        if (!UserCookie.init) {
            return;
        }
        if (document.cookie.length > 0) {
            var old = UserCookie.getItem(key);
            if (old != null)
                UserCookie.setItem(key, old, -999);
        }
    }
};
var UserLocalStorage = {
    init: window.localStorage ? true : false,
    setItem: function (key, value, expireTimes) {
        if (!UserLocalStorage.init) {
            return;
        }
        var expires = new Date();
        var record = { value: JSON.stringify(value), expires: expires.getTime() + expireTimes }
        window.localStorage.setItem(key, JSON.stringify(record));
    },
    getItem: function (key) {
        if (!UserLocalStorage.init) {
            return;
        }
        var value = "";
        var record = JSON.parse(window.localStorage.getItem(key));
        if (record != null && new Date().getTime() <= record.expires) {
            value = record.value.replace(/"/g, "");
        }
        return value;
    },
    clear: function () {
        if (!UserLocalStorage.init) {
            return;
        }
        window.localStorage.clear();
    },
    removeItem: function (key) {
        if (!UserLocalStorage.init) {
            return;
        }
        window.localStorage.removeItem(key);
    }
};



/*PPmoney 新对话框*/
var PPmoney = PPmoney || {};
PPmoney.config = {
    title: "系统提示",
    tel: "10101212转8"
};

PPmoney.dialog = {
    //鼠标提示
    hoverTips: function (data) {
        var a;
        data.elem.mouseover(function () {
            var d = dialog({
                align: data.align || "bottom",
                content: data.content || $(this).attr("data-tips"),
                quickClose: true
            });
            d.show($(this).get(0)),
            $(this).addClass("artDialog-hover"),
            a = d
        }).mouseout(function () {
            a.close().remove(),
            $(this).removeClass("artDialog-hover")
        })
    },
    //提示
    tips: function (data) {
        var d = dialog({
            align: data.align || "top",
            width: data.width || "auto",
            height: data.height || "auto",
            content: data.content,
            quickClose: data.quickClose || false
        }).show(data.elem.get(0));
        return d;
    },
    //确认
    confirm: function (data) {
        if (Object.prototype.toString.call(data) === "[object String]") {
            data = { content: data };
        }
        var d = top.dialog({
            id: data.id || null,
            title: data.title || PPmoney.config.title,
            content: '<div class="ui-dialog-confirm">' + data.content + '</div>',
            width: data.width || "auto",
            height: data.height || "auto",
            ok: data.ok || null
        });
        return d.showModal().focus();
    },
    //默认常用
    show: function (data) {
        var d = top.dialog({
            id: data.id || null,
            title: data.title || PPmoney.config.title,
            content: '<div class="ui-dialog-confirm">' + data.content + '</div>',
            width: data.width || "auto",
            height: data.height || "auto",
            ok: data.ok || null,
            cancel: data.cancel || null
        });
        return d.show();
    },
    //遮罩层
    showModal: function (data) {
        var d = top.dialog({
            id: data.id || null,
            title: data.title || PPmoney.config.title,
            skin: data.skin || '',
            content: '<div class="ui-dialog-confirm">' + data.content + '</div>',
            width: data.width || "auto",
            height: data.height || "auto",
            onshow: data.onshow || null,
            ok: data.ok || null,
            cancel: data.cancel || null,
            onshow: data.onshow || null,
            onclose: data.onclose || null
        });
        return d.showModal();
    },
    //快速提示后消失
    quickClose: function (data) {
        if (Object.prototype.toString.call(data) === "[object String]") {
            data = { content: data };
        }
        var d = top.dialog({
            content: '<div class="p-20">' + data.content + '</div>',
            onclose: data.onclose || null
        });
        data.onclose ? d.showModal() : d.show();
        setTimeout(function () {
            data.callback && data.callback();
            d.close().remove();
        }, data.time || 2000);
    },
    //打开新页面
    iframe: function (data) {
        //dialog.get(id)根据获取打开的对话框实例
        var d = top.dialog({
            id: data.id || '',//dialog.get(id)获取对话框的实例
            title: data.title || PPmoney.config.title,
            data: data.data,
            url: data.url,
            width: data.width || "auto",
            height: data.height || "auto",
            skin: data.skin + ' PPLoading' || 'PPLoading',
            scroll: data.scroll || false,//是否显示滚动条
            onshow: function (data) {
                PPLoading();
            },
            oniframeload: function () {
                hideLoading();
                if (this.options.height === "auto") {
                    this.height(this.iframeNode.contentDocument.body.offsetHeight + 20);
                }
            },
            onclose: data.onclose || null,
            onremove: data.onremove || null
        })
        .showModal();
        return d;
    }
};



/**
 * tab选项卡
 */
(function ($) {
    $.fn.pptab = function (options) {
        $.each(this, function () {
            var _event = $(this).hasClass("z-hover") ? "mouseover" : "click";
            var _this = $(this);
            $(this).find(">.pp-tab-list li").on(
            _event, function () {
                if (typeof ($(this).attr("data-ignore")) != "undefined") {
                    return;
                }
                $(this).parent().find(">li").removeClass("on");
                $(this).addClass("on");
                _this.find(">.pp-tab-c").removeClass("on").eq($(this).index()).addClass("on");
            });
        });
    };
})(jQuery);
