/**
 * @fileOverview
 * @author rekey
 * Created by rekey on 22/4/14.
 */
//bitTotal函数
  //计算出当前密码当中一共有多少种模式
define('common/util/password.js', [], function (require, exports, module) {  function bitTotal(num){
    var modes = 0;
    for (var i = 0; i < 4; i++) {
      if (num & 1) modes++;
      num >>>= 1;
    }
    return modes;
  }

  function CharMode(iN){
    if (iN >= 48 && iN <= 57) //数字
      return 1;
    if (iN >= 65 && iN <= 90) //大写字母
      return 2;
    if (iN >= 97 && iN <= 122) //小写
      return 4;
    else
      return 8; //特殊字符
  }

  function SHA1(msg){

    function rotate_left(n, s){
      var t4 = ( n << s ) | (n >>> (32 - s));
      return t4;
    };

    function lsb_hex(val){
      var str = "";
      var i;
      var vh;
      var vl;

      for (i = 0; i <= 6; i += 2) {
        vh = (val >>> (i * 4 + 4)) & 0x0f;
        vl = (val >>> (i * 4)) & 0x0f;
        str += vh.toString(16) + vl.toString(16);
      }
      return str;
    };

    function cvt_hex(val){
      var str = "";
      var i;
      var v;

      for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
      }
      return str;
    };


    function Utf8Encode(string){
      var string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128){
          utftext += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048)){
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }

      return utftext;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    var msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
      j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
        msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
      word_array.push(j);
    }

    switch (msg_len % 4) {
      case 0:
        i = 0x080000000;
        break;
      case 1:
        i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
        break;

      case 2:
        i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
        break;

      case 3:
        i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
        break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);


    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

      for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
      for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;

      for (i = 0; i <= 19; i++) {
        temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 20; i <= 39; i++) {
        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 40; i <= 59; i++) {
        temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 60; i <= 79; i++) {
        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
  }

  function MD5(){
    this.hex_chr = "0123456789abcdef";
  }

  MD5.prototype.rhex = function (num){
    var str = "";
    for (var j = 0; j <= 3; j++)
      str += this.hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + this.hex_chr.charAt((num >> (j * 8)) & 0x0F);
    return str;
  }
  MD5.prototype.str2blks_MD5 = function (str){
    var nblk = ((str.length + 8) >> 6) + 1;
    var blks = new Array(nblk * 16);
    for (var i = 0; i < nblk * 16; i++){
      blks[i] = 0;
    }
    for (var i = 0; i < str.length; i++){
      blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    }
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks;
  }
  MD5.prototype.add = function (x, y){
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  MD5.prototype.rol = function (num, cnt){
    return (num << cnt) | (num >>> (32 - cnt));
  }
  MD5.prototype.cmn = function (q, a, b, x, s, t){
    return this.add(this.rol(this.add(this.add(a, q), this.add(x, t)), s), b);
  }
  MD5.prototype.ff = function (a, b, c, d, x, s, t){
    return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  MD5.prototype.gg = function (a, b, c, d, x, s, t){
    return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  MD5.prototype.hh = function (a, b, c, d, x, s, t){
    return this.cmn(b ^ c ^ d, a, b, x, s, t);
  }
  MD5.prototype.ii = function (a, b, c, d, x, s, t){
    return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  MD5.prototype.md5 = function (str){
    var x = this.str2blks_MD5(str);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = this.ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
      b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = this.gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
      d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = this.hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = this.ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = this.add(a, olda);
      b = this.add(b, oldb);
      c = this.add(c, oldc);
      d = this.add(d, oldd);
    }
    return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d);
  };
  module.exports = {
    encryPw: function (userPw){
      var md5 = new MD5();
      return md5.md5(userPw).toUpperCase();
    },
    checkStrong: function (sPW){
      if (sPW == "")
        return -1;
      var Modes = 0;
      for (var i = 0; i < sPW.length; i++) {
        //测试每一个字符的类别并统计一共有多少种模式.
        Modes |= CharMode(sPW.charCodeAt(i));
      }
      return bitTotal(Modes);
    },
    showPwdStrong: function (password, errorContainer){
      if (password.length >= 6){
        var pwdStrong = SNB.Password.checkStrong(password);
        if (pwdStrong == 1 || pwdStrong == 0 || pwdStrong == -1){
          errorContainer.html("<img src='" + SNB.domain['static'] + "/images/icon_ok.png'>  密码强度：弱").css("color", "#0E931C");
        } else if (pwdStrong == 2){
          errorContainer.html("<img src='" + SNB.domain['static'] + "/images/icon_ok.png'>  密码强度：中").css("color", "#0E931C");
        } else if (pwdStrong == 3 || pwdStrong == 4){
          errorContainer.html("<img src='" + SNB.domain['static'] + "/images/icon_ok.png'>  密码强度：强").css("color", "#0E931C");
        }
      }
    }
  };
});
