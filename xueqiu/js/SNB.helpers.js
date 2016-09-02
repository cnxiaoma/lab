(function (){
  var helpers = function (){
    var that = this;
    that.parseLongUrl = function (text){
      if (!text){
        return text;
      }
      var match_urls = [],
        display_url = "",
        display_url_pre = "",
        display_url_suf = "";

      var changeUrl = function (match_url, all){
        //过滤雪球链接以及又拍云链接
        if (match_url.match(/xueqiu.com|xqdoc.b0.upaiyun.com/i)) return all
        if (match_url){

          if (match_url.indexOf("http://") !== -1 || match_url.indexOf("https://") !== -1){
            display_url_pre = match_url.indexOf("http://") !== -1 ? "http://" : "https://"
          }
          var match_url_length = match_url.length;
          var display_url_pre_len = display_url_pre.length;
          var display_url_last_len = display_url_pre_len + 30 < match_url_length ? display_url_pre_len + 30 + 1 : match_url_length
          display_url = match_url.substr(display_url_pre_len, display_url_last_len)

          var display_url_len = display_url.length;
          display_url_suf = match_url.substr(display_url_len + display_url_pre_len)

        }

        var url_html = "";
        url_html = ""
          + '<a href="' + match_url + '" class="xueqiu_timleine_link" target="_blank" title="' + match_url + '" >'
          + '<span class="" >' + display_url_pre + '</span>'
          + '<span class="js-display-url">' + display_url + '</span>'

        if (display_url_suf){
          url_html += ""
            + '<span class="url_invisible" >' + display_url_suf + '</span>'
            + '<span class="url_ellipsis">'
            + '<span class="url_invisible" >&nbsp;</span>'
            + '…'
            + '</span>'
        }

        url_html += '</a>'
        return url_html
      };

      var LinkReg = /<a href=(['"].+?['"\s])[^>]*>[^<]+<\/a>/g
      text = text.replace(LinkReg, function (all, match_url){
        match_url = match_url.substr(1, match_url.length - 2)
        all = changeUrl(match_url, all);
        return all
      });

      return text
    };

    that.queryUrl = function (url, separator, key){
      url = url.replace(/^[^?=]*\?/ig, '').split('#')[0];
      separator = separator || '&';
      key = key || '';
      var json = {};
      url.replace(new RegExp('(^|' + separator + ')([^' + separator + '=]+)=([^' + separator + ']*)', 'g'), function (a, b, key, value){
        try {
          key = decodeURIComponent(key).replace(/^[\s\uFEFF\xa0\u3000]+|[\uFEFF\xa0\u3000\s]+$/g, "");
        } catch (e) {
        }
        try {
          value = decodeURIComponent(value);
        } catch (e) {
        }
        if (!(key in json)){
          json[key] = /\[\]$/.test(key) ? [value] : value;
        }
        else if (json[key] instanceof Array){
          json[key].push(value);
        }
        else {
          json[key] = [json[key], value];
        }
      });
      return key ? json[key] : json;
    };

    that.keys = (function (){
      return Object.keys || function (obj){
        var a = [];
        for (var key in obj) {
          if (obj.hasOwnProperty(key)){
            a.push(key);
          }
        }
        return a;
      }
    })();
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports = function (){
      return new helpers();
    };
  } else {
    window.SNB = window.SNB || {};
    SNB.helpers = new helpers();
  }

}());
