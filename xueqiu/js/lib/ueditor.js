define('lib/ueditor.js', [], function (require, exports, module) { var UEDITOR_CONFIG = window.UEDITOR_CONFIG || {};

var baidu = window.baidu || {};

window.baidu = baidu;

window.UE = baidu.editor =  {};

UE.plugins = {};

UE.commands = {};

UE.instants = {};

UE.I18N = {};

//UE.defaultplugins = {};
//
//UE.commands = function(){
//    var commandList = {},tmpList= {};
//    return {
//
//        register : function(commandsName,pluginName){
//            commandsName = commandsName.split(',');
//            for(var i= 0,ci;ci=commandsName[i++];){
//                commandList[ci] = pluginName;
//            }
//
//        },
//        get : function(commandName){
//            return commandList[commandName];
//        },
//        getList : function(){
//            return commandList;
//        }
//    }
//}();

UE.version = "1.2.3.0";

var dom = UE.dom = {};///import editor.js
/**
 * @class baidu.editor.browser     判断浏览器
 */

var browser = UE.browser = function(){
    var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
        /**
         * 检测浏览器是否为IE
         * @name baidu.editor.browser.ie
         * @property    检测浏览器是否为IE
         * @grammar     baidu.editor.browser.ie
         * @return     {Boolean}    返回是否为ie浏览器
         */
        ie		: !!window.ActiveXObject,

        /**
         * 检测浏览器是否为Opera
         * @name baidu.editor.browser.opera
         * @property    检测浏览器是否为Opera
         * @grammar     baidu.editor.browser.opera
         * @return     {Boolean}    返回是否为opera浏览器
         */
        opera	: ( !!opera && opera.version ),

        /**
         * 检测浏览器是否为WebKit内核
         * @name baidu.editor.browser.webkit
         * @property    检测浏览器是否为WebKit内核
         * @grammar     baidu.editor.browser.webkit
         * @return     {Boolean}    返回是否为WebKit内核
         */
        webkit	: ( agent.indexOf( ' applewebkit/' ) > -1 ),

        /**
         * 检查是否为Macintosh系统
         * @name baidu.editor.browser.mac
         * @property    检查是否为Macintosh系统
         * @grammar     baidu.editor.browser.mac
         * @return     {Boolean}    返回是否为Macintosh系统
         */
        mac	: ( agent.indexOf( 'macintosh' ) > -1 ),

        /**
         * 检查浏览器是否为quirks模式
         * @name baidu.editor.browser.quirks
         * @property    检查浏览器是否为quirks模式
         * @grammar     baidu.editor.browser.quirks
         * @return     {Boolean}    返回是否为quirks模式
         */
        quirks : ( document.compatMode == 'BackCompat' )
    };

    /**
     * 检测浏览器是否为Gecko内核，如Firefox
     * @name baidu.editor.browser.gecko
     * @property    检测浏览器是否为Gecko内核
     * @grammar     baidu.editor.browser.gecko
     * @return     {Boolean}    返回是否为Gecko内核
     */
    browser.gecko = ( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );

    var version = 0;

    // Internet Explorer 6.0+
    if ( browser.ie )
    {
        version = parseFloat( agent.match( /msie (\d+)/ )[1] );
        /**
         * 检测浏览器是否为 IE9 模式
         */
        browser.ie9Compat = document.documentMode == 9;
        /**
         * 检测浏览器是否为 IE8 浏览器
         * @name baidu.editor.browser.IE8
         * @property    检测浏览器是否为 IE8 浏览器
         * @grammar     baidu.editor.browser.IE8
         * @return     {Boolean}    返回是否为 IE8 浏览器
         */
        browser.ie8 = !!document.documentMode;

        /**
         * 检测浏览器是否为 IE8 模式
         * @name baidu.editor.browser.ie8Compat
         * @property    检测浏览器是否为 IE8 模式
         * @grammar     baidu.editor.browser.ie8Compat
         * @return     {Boolean}    返回是否为 IE8 模式
         */
        browser.ie8Compat = document.documentMode == 8;

        /**
         * 检测浏览器是否运行在 兼容IE7模式
         * @name baidu.editor.browser.ie7Compat
         * @property    检测浏览器是否为兼容IE7模式
         * @grammar     baidu.editor.browser.ie7Compat
         * @return     {Boolean}    返回是否为兼容IE7模式
         */
        browser.ie7Compat = ( ( version == 7 && !document.documentMode )
                || document.documentMode == 7 );

        /**
         * 检测浏览器是否IE6模式或怪异模式
         * @name baidu.editor.browser.ie6Compat
         * @property    检测浏览器是否IE6 模式或怪异模式
         * @grammar     baidu.editor.browser.ie6Compat
         * @return     {Boolean}    返回是否为IE6 模式或怪异模式
         */
        browser.ie6Compat = ( version < 7 || browser.quirks );

    }

    // Gecko.
    if ( browser.gecko )
    {
        var geckoRelease = agent.match( /rv:([\d\.]+)/ );
        if ( geckoRelease )
        {
            geckoRelease = geckoRelease[1].split( '.' );
            version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
        }
    }
    /**
     * 检测浏览器是否为chrome
     * @name baidu.editor.browser.chrome
     * @property    检测浏览器是否为chrome
     * @grammar     baidu.editor.browser.chrome
     * @return     {Boolean}    返回是否为chrome浏览器
     */
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = + RegExp['\x241'];
    }
    /**
     * 检测浏览器是否为safari
     * @name baidu.editor.browser.safari
     * @property    检测浏览器是否为safari
     * @grammar     baidu.editor.browser.safari
     * @return     {Boolean}    返回是否为safari浏览器
     */
    if(/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)){
    	browser.safari = + (RegExp['\x241'] || RegExp['\x242']);
    }


    // Opera 9.50+
    if ( browser.opera )
        version = parseFloat( opera.version() );

    // WebKit 522+ (Safari 3+)
    if ( browser.webkit )
        version = parseFloat( agent.match( / applewebkit\/(\d+)/ )[1] );

    /**
     * 浏览器版本
     *
     * gecko内核浏览器的版本会转换成这样(如 1.9.0.2 -> 10900).
     *
     * webkit内核浏览器版本号使用其build号 (如 522).
     * @name baidu.editor.browser.version
     * @grammar     baidu.editor.browser.version
     * @return     {Boolean}    返回浏览器版本号
     * @example
     * if ( baidu.editor.browser.ie && <b>baidu.editor.browser.version</b> <= 6 )
     *     alert( "Ouch!" );
     */
    browser.version = version;

    /**
     * 是否是兼容模式的浏览器
     * @name baidu.editor.browser.isCompatible
     * @grammar     baidu.editor.browser.isCompatible
     * @return     {Boolean}    返回是否是兼容模式的浏览器
     * @example
     * if ( baidu.editor.browser.isCompatible )
     *     alert( "Your browser is pretty cool!" );
     */
    browser.isCompatible =
        !browser.mobile && (
        ( browser.ie && version >= 6 ) ||
        ( browser.gecko && version >= 10801 ) ||
        ( browser.opera && version >= 9.5 ) ||
        ( browser.air && version >= 1 ) ||
        ( browser.webkit && version >= 522 ) ||
        false );
    return browser;
}();
//快捷方式
var ie = browser.ie,
    webkit = browser.webkit,
    gecko = browser.gecko,
    opera = browser.opera;///import editor.js
/**
 * @class baidu.editor.browser     判断浏览器
 */

var browser = UE.browser = function(){
    var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
        /**
         * 检测浏览器是否为IE
         * @name baidu.editor.browser.ie
         * @property    检测浏览器是否为IE
         * @grammar     baidu.editor.browser.ie
         * @return     {Boolean}    返回是否为ie浏览器
         */
        ie		: !!window.ActiveXObject,

        /**
         * 检测浏览器是否为Opera
         * @name baidu.editor.browser.opera
         * @property    检测浏览器是否为Opera
         * @grammar     baidu.editor.browser.opera
         * @return     {Boolean}    返回是否为opera浏览器
         */
        opera	: ( !!opera && opera.version ),

        /**
         * 检测浏览器是否为WebKit内核
         * @name baidu.editor.browser.webkit
         * @property    检测浏览器是否为WebKit内核
         * @grammar     baidu.editor.browser.webkit
         * @return     {Boolean}    返回是否为WebKit内核
         */
        webkit	: ( agent.indexOf( ' applewebkit/' ) > -1 ),

        /**
         * 检查是否为Macintosh系统
         * @name baidu.editor.browser.mac
         * @property    检查是否为Macintosh系统
         * @grammar     baidu.editor.browser.mac
         * @return     {Boolean}    返回是否为Macintosh系统
         */
        mac	: ( agent.indexOf( 'macintosh' ) > -1 ),

        /**
         * 检查浏览器是否为quirks模式
         * @name baidu.editor.browser.quirks
         * @property    检查浏览器是否为quirks模式
         * @grammar     baidu.editor.browser.quirks
         * @return     {Boolean}    返回是否为quirks模式
         */
        quirks : ( document.compatMode == 'BackCompat' )
    };

    /**
     * 检测浏览器是否为Gecko内核，如Firefox
     * @name baidu.editor.browser.gecko
     * @property    检测浏览器是否为Gecko内核
     * @grammar     baidu.editor.browser.gecko
     * @return     {Boolean}    返回是否为Gecko内核
     */
    browser.gecko = ( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );

    var version = 0;

    // Internet Explorer 6.0+
    if ( browser.ie )
    {
        version = parseFloat( agent.match( /msie (\d+)/ )[1] );
        /**
         * 检测浏览器是否为 IE9 模式
         */
        browser.ie9Compat = document.documentMode == 9;
        /**
         * 检测浏览器是否为 IE8 浏览器
         * @name baidu.editor.browser.IE8
         * @property    检测浏览器是否为 IE8 浏览器
         * @grammar     baidu.editor.browser.IE8
         * @return     {Boolean}    返回是否为 IE8 浏览器
         */
        browser.ie8 = !!document.documentMode;

        /**
         * 检测浏览器是否为 IE8 模式
         * @name baidu.editor.browser.ie8Compat
         * @property    检测浏览器是否为 IE8 模式
         * @grammar     baidu.editor.browser.ie8Compat
         * @return     {Boolean}    返回是否为 IE8 模式
         */
        browser.ie8Compat = document.documentMode == 8;

        /**
         * 检测浏览器是否运行在 兼容IE7模式
         * @name baidu.editor.browser.ie7Compat
         * @property    检测浏览器是否为兼容IE7模式
         * @grammar     baidu.editor.browser.ie7Compat
         * @return     {Boolean}    返回是否为兼容IE7模式
         */
        browser.ie7Compat = ( ( version == 7 && !document.documentMode )
                || document.documentMode == 7 );

        /**
         * 检测浏览器是否IE6模式或怪异模式
         * @name baidu.editor.browser.ie6Compat
         * @property    检测浏览器是否IE6 模式或怪异模式
         * @grammar     baidu.editor.browser.ie6Compat
         * @return     {Boolean}    返回是否为IE6 模式或怪异模式
         */
        browser.ie6Compat = ( version < 7 || browser.quirks );

    }

    // Gecko.
    if ( browser.gecko )
    {
        var geckoRelease = agent.match( /rv:([\d\.]+)/ );
        if ( geckoRelease )
        {
            geckoRelease = geckoRelease[1].split( '.' );
            version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
        }
    }
    /**
     * 检测浏览器是否为chrome
     * @name baidu.editor.browser.chrome
     * @property    检测浏览器是否为chrome
     * @grammar     baidu.editor.browser.chrome
     * @return     {Boolean}    返回是否为chrome浏览器
     */
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = + RegExp['\x241'];
    }
    /**
     * 检测浏览器是否为safari
     * @name baidu.editor.browser.safari
     * @property    检测浏览器是否为safari
     * @grammar     baidu.editor.browser.safari
     * @return     {Boolean}    返回是否为safari浏览器
     */
    if(/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)){
    	browser.safari = + (RegExp['\x241'] || RegExp['\x242']);
    }


    // Opera 9.50+
    if ( browser.opera )
        version = parseFloat( opera.version() );

    // WebKit 522+ (Safari 3+)
    if ( browser.webkit )
        version = parseFloat( agent.match( / applewebkit\/(\d+)/ )[1] );

    /**
     * 浏览器版本
     *
     * gecko内核浏览器的版本会转换成这样(如 1.9.0.2 -> 10900).
     *
     * webkit内核浏览器版本号使用其build号 (如 522).
     * @name baidu.editor.browser.version
     * @grammar     baidu.editor.browser.version
     * @return     {Boolean}    返回浏览器版本号
     * @example
     * if ( baidu.editor.browser.ie && <b>baidu.editor.browser.version</b> <= 6 )
     *     alert( "Ouch!" );
     */
    browser.version = version;

    /**
     * 是否是兼容模式的浏览器
     * @name baidu.editor.browser.isCompatible
     * @grammar     baidu.editor.browser.isCompatible
     * @return     {Boolean}    返回是否是兼容模式的浏览器
     * @example
     * if ( baidu.editor.browser.isCompatible )
     *     alert( "Your browser is pretty cool!" );
     */
    browser.isCompatible =
        !browser.mobile && (
        ( browser.ie && version >= 6 ) ||
        ( browser.gecko && version >= 10801 ) ||
        ( browser.opera && version >= 9.5 ) ||
        ( browser.air && version >= 1 ) ||
        ( browser.webkit && version >= 522 ) ||
        false );
    return browser;
}();
//快捷方式
var ie = browser.ie,
    webkit = browser.webkit,
    gecko = browser.gecko,
    opera = browser.opera;///import editor.js
///import core/utils.js
/**
 * @class baidu.editor.utils     工具类
 */

    var utils = UE.utils =
	/**@lends baidu.editor.utils.prototype*/
    {
		/**
         * 以obj为原型创建实例
         * @public
         * @function
         * @param {Object} obj
         * @return {Object} 返回新的对象
         */
		makeInstance: function(obj) {
            var noop = new Function();
			noop.prototype = obj;
			obj = new noop;
			noop.prototype = null;
			return obj;
		},
        /**
         * 将s对象中的属性扩展到t对象上
         * @public
         * @function
         * @param {Object} t
         * @param {Object} s
         * @param {Boolean} b 是否保留已有属性
         * @returns {Object}  t 返回扩展了s对象属性的t
         */
		extend: function(t, s, b) {
			if (s) {
				for (var k in s) {
					if (!b || !t.hasOwnProperty(k)) {
						t[k] = s[k];
					}
				}
			}
			return t;
		},
		/**
         * 判断是否为数组
         * @public
         * @function
         * @param {Object} array
         * @return {Boolean} true：为数组，false：不为数组
         */
		isArray: function(array) {
			return Object.prototype.toString.apply(array) === '[object Array]';
		},
		/**
         * 判断是否为字符串
         * @public
         * @function
         * @param {Object} str
         * @return {Boolean} true：为字符串。 false：不为字符串
         */
		isString: function(str) {
			return typeof str == 'string' || str.constructor == String;
		},
		/**
         * subClass继承superClass
         * @public
         * @function
         * @param {Object} subClass       子类
         * @param {Object} superClass    超类
         * @return    {Object}    扩展后的新对象
         */
		inherits: function(subClass, superClass) {
			var oldP = subClass.prototype,
			    newP = utils.makeInstance(superClass.prototype);
			utils.extend(newP, oldP, true);
			subClass.prototype = newP;
			return (newP.constructor = subClass);
		},

		/**
         * 为对象绑定函数
         * @public
         * @function
         * @param {Function} fn        函数
         * @param {Object} this_       对象
         * @return {Function}  绑定后的函数
         */
		bind: function(fn, this_) {
			return function() {
				return fn.apply(this_, arguments);
			};
		},

		/**
         * 创建延迟执行的函数
         * @public
         * @function
         * @param {Function} fn       要执行的函数
         * @param {Number} delay      延迟时间，单位为毫秒
         * @param {Boolean} exclusion 是否互斥执行，true则执行下一次defer时会先把前一次的延迟函数删除
         * @return {Function}    延迟执行的函数
         */
		defer: function(fn, delay, exclusion) {
			var timerID;
			return function() {
				if (exclusion) {
					clearTimeout(timerID);
				}
				timerID = setTimeout(fn, delay);
			};
		},



		/**
         * 查找元素在数组中的索引, 若找不到返回-1
         * @public
         * @function
         * @param {Array} array     要查找的数组
         * @param {*} item          查找的元素
         * @param {Number} at       开始查找的位置
         * @returns {Number}        返回在数组中的索引
         */
		indexOf: function(array, item, at) {
            for(var i=at||0,l = array.length;i<l;i++){
               if(array[i] === item){
                   return i;
               }
            }
            return -1;
		},

        findNode : function(nodes,tagNames,fn){
            for(var i=0,ci;ci=nodes[i++];){
                if(fn? fn(ci) : this.indexOf(tagNames,ci.tagName.toLowerCase())!=-1){
                    return ci;
                }
            }
        },
		/**
         * 移除数组中的元素
         * @public
         * @function
         * @param {Array} array       要删除元素的数组
         * @param {*} item            要删除的元素
         */
		removeItem: function(array, item) {
            for(var i=0,l = array.length;i<l;i++){
                if(array[i] === item){
                    array.splice(i,1);
                    i--;
                }
            }
		},

		/**
         * 删除字符串首尾空格
         * @public
         * @function
         * @param {String} str        字符串
         * @return {String} str       删除空格后的字符串
         */
		trim: function(str) {
            return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
		},

		/**
         * 将字符串转换成hashmap
         * @public
         * @function
         * @param {String/Array} list       字符串，以‘，’隔开
         * @returns {Object}          转成hashmap的对象
         */
		listToMap: function(list) {
            if(!list)return {};
            list = utils.isArray(list) ? list : list.split(',');
            for(var i=0,ci,obj={};ci=list[i++];){
                obj[ci.toUpperCase()] = obj[ci] = 1;
            }
            return obj;
		},

		/**
         * 将str中的html符号转义
         * @public
         * @function
         * @param {String} str      需要转义的字符串
         * @returns {String}        转义后的字符串
         */
		unhtml: function(str,reg) {
           return str ? str.replace(reg || /[&<">]/g, function(m){
               return {
                   '<': '&lt;',
                   '&': '&amp;',
                   '"': '&quot;',
                   '>': '&gt;'
               }[m]
           }) : '';
		},
        html:  function(str) {
            return str ? str.replace(/&((g|l|quo)t|amp);/g, function(m){
                return {
                    '&lt;':'<',
                    '&amp;':'&',
                    '&quot;':'"',
                    '&gt;': '>'
                }[m]
            }) : '';
        },
		/**
         * 将css样式转换为驼峰的形式。如font-size -> fontSize
         * @public
         * @function
         * @param {String} cssName      需要转换的样式
         * @returns {String}        转换后的样式
         */
		cssStyleToDomStyle: function() {
            var test = document.createElement('div').style,
               cache = {
                   'float': test.cssFloat != undefined ? 'cssFloat' : test.styleFloat != undefined ? 'styleFloat': 'float'
               };

            return function(cssName) {
               return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function(match){return match.charAt(1).toUpperCase();}));
            };
		}(),
		/**
         * 加载css文件，执行回调函数
         * @public
         * @function
         * @param {document}   doc  document对象
         * @param {String}    path  文件路径
         * @param {Function}   fun  回调函数
         * @param {String}     id   元素id
         */
        loadFile : function(){
            var tmpList = {};
            return function(doc,obj,fun){
                var item = tmpList[obj.src||obj.href];
                if(item){
                    if(utils.isArray(item.funs)){
                        item.ready?fun():tmpList[obj.src||obj.href].funs.push(fun);
                    }
                    return;
                }
                tmpList[obj.src||obj.href] = fun? {'funs' : [fun]} :1;

                if(!doc.body){
                    doc.write('<script src="'+obj.src+'"></script>');
                    return;
                }
                if (obj.id && doc.getElementById(obj.id)) {
                    return;
                }
                var element = doc.createElement(obj.tag);
                delete obj.tag;
                for(var p in obj){
                    element.setAttribute(p,obj[p]);
                }
                element.onload = element.onreadystatechange = function() {
                    if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                        item =  tmpList[obj.src||obj.href];
                        if(item.funs){
                            item.ready = 1;
                            for(var fi;fi=item.funs.pop();){
                                fi();
                            }
                        }
                        element.onload = element.onreadystatechange = null;
                    }
                };
                doc.getElementsByTagName("head")[0].appendChild(element);
            }
        }(),
        /**
         * 判断对象是否为空
         * @param {Object} obj
         * @return {Boolean} true 空，false 不空
         */
        isEmptyObject : function(obj){
            for ( var p in obj ) {
                return false;
            }
            return true;
        },
        isFunction : function (source) {
            // chrome下,'function' == typeof /a/ 为true.
            return '[object Function]' == Object.prototype.toString.call(source);
        },
        fixColor : function (name, value) {
            if (/color/i.test(name) && /rgba?/.test(value)) {
                var array = value.split(",");
                if (array.length > 3)
                    return "";
                value = "#";
                for (var i = 0, color; color = array[i++];) {
                    color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                    value += color.length == 1 ? "0" + color : color;
                }
                value = value.toUpperCase();
            }
            return  value;
        },
        /**
        * 只针对border,padding,margin做了处理，因为性能问题
        * @public
        * @function
        * @param {String}    val style字符串
        */
        optCss : function(val){
            var padding,margin,border;
            val = val.replace(/(padding|margin|border)\-([^:]+):([^;]+);?/gi,function(str,key,name,val){
                if(val.split(' ').length == 1){
                    switch (key){
                        case 'padding':
                            !padding && (padding = {});
                            padding[name] = val;
                            return '';
                        case 'margin':
                            !margin && (margin = {});
                            margin[name] = val;
                            return '';
                        case 'border':
                            return val == 'initial' ? '' : str;
                    }
                }
                return str;
            });

            function opt(obj,name){
                if(!obj){
                    return '';
                }
                var t = obj.top ,b = obj.bottom,l = obj.left,r = obj.right,val = '';
                if(!t || !l || !b || !r){
                    for(var p in obj){
                        val +=';'+name+'-' + p + ':' + obj[p]+';';
                    }
                }else{
                    val += ';'+name+':' +
                        (t == b && b == l && l == r ? t :
                            t == b && l == r ? (t + ' ' + l) :
                                l == r ?  (t + ' ' + l + ' ' + b) : (t + ' ' + r + ' ' + b + ' ' + l))+';'
                }
                return val;
            }
            val += opt(padding,'padding') + opt(margin,'margin');
            return val.replace(/^[ \n\r\t;]*|[ \n\r\t]*$/,'').replace(/;([ \n\r\t]+)|\1;/g,';')
                .replace(/(&((l|g)t|quot|#39))?;{2,}/g,function(a,b){
                    return b ? b + ";;" : ';'
                });
        },
        /**
         * DOMContentLoaded 事件注册
         * @public
         * @function
         * @param {Function} 触发的事件
         */
        domReady : function (){
            var isReady = false,
                fnArr = [];
            function doReady(){
                //确保onready只执行一次
                isReady = true;
                for(var ci;ci=fnArr.pop();){
                   ci();
                }
            }
            return function(onready){
                if ( document.readyState === "complete" ) {
                    return onready && setTimeout( onready, 1 );
                }
                onready && fnArr.push(onready);
                isReady && doReady();
                if( browser.ie ){
                    (function(){
                        if ( isReady ) return;
                        try {
                            document.documentElement.doScroll("left");
                        } catch( error ) {
                            setTimeout( arguments.callee, 0 );
                            return;
                        }
                        doReady();
                    })();
                    window.attachEvent('onload',doReady);
                }else{
                    document.addEventListener( "DOMContentLoaded", function(){
                        document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
                        doReady();
                    }, false );
                    window.addEventListener('load',doReady,false);
                }
            }
        }()
	};
    utils.domReady();///import editor.js
///import core/utils.js

    /**
     * 事件基础类
     * @public
     * @class
     * @name baidu.editor.EventBase
     */
    var EventBase = UE.EventBase = function(){};

    EventBase.prototype = /**@lends baidu.editor.EventBase.prototype*/{
        /**
         * 注册事件监听器
         * @public
         * @function
         * @param {String} types 事件名
         * @param {Function} listener 监听器数组
         */
        addListener : function ( types, listener ) {
            types = utils.trim(types).split(' ');
            for(var i= 0,ti;ti=types[i++];){
                getListener( this, ti, true ).push( listener );
            }
        },
        /**
         * 移除事件监听器
         * @public
         * @function
         * @param {String} types 事件名
         * @param {Function} listener 监听器数组
         */
        removeListener : function ( types, listener ) {
            types = utils.trim(types).split(' ');
            for(var i= 0,ti;ti=types[i++];){
                utils.removeItem( getListener( this, ti ) || [], listener );
            }
        },
        /**
         * 触发事件
         * @public
         * @function
         * @param {String} type 事件名
         *
         */
        fireEvent : function ( types ) {
            types = utils.trim(types).split(' ');
            for(var i= 0,ti;ti=types[i++];){
                var listeners = getListener( this, ti ),
                    r, t, k;
                if ( listeners ) {
                    k = listeners.length;
                    while ( k -- ) {
                        t = listeners[k].apply( this, arguments );
                        if ( t !== undefined ) {
                            r = t;
                        }
                    }
                }
                if ( t = this['on' + ti.toLowerCase()] ) {
                    r = t.apply( this, arguments );
                }
            }
            return r;
        }
    };
    /**
     * 获得对象所拥有监听类型的所有监听器
     * @public
     * @function
     * @param {Object} obj  查询监听器的对象
     * @param {String} type 事件类型
     * @param {Boolean} force  为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组
     * @returns {Array} 监听器数组
     */
    function getListener( obj, type, force ) {
        var allListeners;
        type = type.toLowerCase();
        return ( ( allListeners = ( obj.__allListeners || force && ( obj.__allListeners = {} ) ) )
            && ( allListeners[type] || force && ( allListeners[type] = [] ) ) );
    }

///import editor.js
//注册命名空间
/**
 * @class baidu.editor.dom
 */
baidu.editor.dom = baidu.editor.dom || {};///import editor.js
///import core/dom/dom.js
/**
 * dtd html语义化的体现类
 * @constructor
 * @namespace dtd
 */
var dtd = dom.dtd = (function() {
    function _( s ) {
        for (var k in s) {
            s[k.toUpperCase()] = s[k];
        }
        return s;
    }
    function X( t ) {
        var a = arguments;
        for ( var i=1; i<a.length; i++ ) {
            var x = a[i];
            for ( var k in x ) {
                if (!t.hasOwnProperty(k)) {
                    t[k] = x[k];
                }
            }
        }
        return t;
    }
    var A = _({isindex:1,fieldset:1}),
        B = _({input:1,button:1,select:1,textarea:1,label:1}),
        C = X( _({a:1}), B ),
        D = X( {iframe:1}, C ),
        E = _({hr:1,ul:1,menu:1,div:1,blockquote:1,noscript:1,table:1,center:1,address:1,dir:1,pre:1,h5:1,dl:1,h4:1,noframes:1,h6:1,ol:1,h1:1,h3:1,h2:1}),
        F = _({ins:1,del:1,script:1,style:1}),
        G = X( _({b:1,acronym:1,bdo:1,'var':1,'#':1,abbr:1,code:1,br:1,i:1,cite:1,kbd:1,u:1,strike:1,s:1,tt:1,strong:1,q:1,samp:1,em:1,dfn:1,span:1}), F ),
        H = X( _({sub:1,img:1,embed:1,object:1,sup:1,basefont:1,map:1,applet:1,font:1,big:1,small:1}), G ),
        I = X( _({p:1}), H ),
        J = X( _({iframe:1}), H, B ),
        K = _({img:1,embed:1,noscript:1,br:1,kbd:1,center:1,button:1,basefont:1,h5:1,h4:1,samp:1,h6:1,ol:1,h1:1,h3:1,h2:1,form:1,font:1,'#':1,select:1,menu:1,ins:1,abbr:1,label:1,code:1,table:1,script:1,cite:1,input:1,iframe:1,strong:1,textarea:1,noframes:1,big:1,small:1,span:1,hr:1,sub:1,bdo:1,'var':1,div:1,object:1,sup:1,strike:1,dir:1,map:1,dl:1,applet:1,del:1,isindex:1,fieldset:1,ul:1,b:1,acronym:1,a:1,blockquote:1,i:1,u:1,s:1,tt:1,address:1,q:1,pre:1,p:1,em:1,dfn:1}),

        L = X( _({a:0}), J ),//a不能被切开，所以把他
        M = _({tr:1}),
        N = _({'#':1}),
        O = X( _({param:1}), K ),
        P = X( _({form:1}), A, D, E, I ),
        Q = _({li:1}),
        R = _({style:1,script:1}),
        S = _({base:1,link:1,meta:1,title:1}),
        T = X( S, R ),
        U = _({head:1,body:1}),
        V = _({html:1});

    var block = _({address:1,blockquote:1,center:1,dir:1,div:1,dl:1,fieldset:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,isindex:1,menu:1,noframes:1,ol:1,p:1,pre:1,table:1,ul:1}),
        //针对优酷的embed他添加了结束标识，导致粘贴进来会变成两个，暂时去掉 ,embed:1
        empty =  _({area:1,base:1,br:1,col:1,hr:1,img:1,input:1,link:1,meta:1,param:1,embed:1});

    return  _({

        // $ 表示自定的属性

        // body外的元素列表.
        $nonBodyContent: X( V, U, S ),

        //块结构元素列表
        $block : block,

        //内联元素列表
        $inline : L,

        $body : X( _({script:1,style:1}), block ),

        $cdata : _({script:1,style:1}),

        //自闭和元素
        $empty : empty,

        //不是自闭合，但不能让range选中里边
        $nonChild : _({iframe:1,textarea:1}),
        //列表元素列表
        $listItem : _({dd:1,dt:1,li:1}),

        //列表根元素列表
        $list: _({ul:1,ol:1,dl:1}),

        //不能认为是空的元素
        $isNotEmpty : _({table:1,ul:1,ol:1,dl:1,iframe:1,area:1,base:1,col:1,hr:1,img:1,embed:1,input:1,link:1,meta:1,param:1}),

        //如果没有子节点就可以删除的元素列表，像span,a
        $removeEmpty : _({a:1,abbr:1,acronym:1,address:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1}),

        $removeEmptyBlock : _({'p':1,'div':1}),

        //在table元素里的元素列表
        $tableContent : _({caption:1,col:1,colgroup:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1,table:1}),
        //不转换的标签
        $notTransContent : _({pre:1,script:1,style:1,textarea:1}),
        html: U,
        head: T,
        style: N,
        script: N,
        body: P,
        base: {},
        link: {},
        meta: {},
        title: N,
        col : {},
        tr : _({td:1,th:1}),
        img : {},
        embed: {},
        colgroup : _({thead:1,col:1,tbody:1,tr:1,tfoot:1}),
        noscript : P,
        td : P,
        br : {},
        th : P,
        center : P,
        kbd : L,
        button : X( I, E ),
        basefont : {},
        h5 : L,
        h4 : L,
        samp : L,
        h6 : L,
        ol : Q,
        h1 : L,
        h3 : L,
        option : N,
        h2 : L,
        form : X( A, D, E, I ),
        select : _({optgroup:1,option:1}),
        font : L,
        ins : L,
        menu : Q,
        abbr : L,
        label : L,
        table : _({thead:1,col:1,tbody:1,tr:1,colgroup:1,caption:1,tfoot:1}),
        code : L,
        tfoot : M,
        cite : L,
        li : P,
        input : {},
        iframe : P,
        strong : L,
        textarea : N,
        noframes : P,
        big : L,
        small : L,
        span :_({'#':1,br:1}),
        hr : L,
        dt : L,
        sub : L,
        optgroup : _({option:1}),
        param : {},
        bdo : L,
        'var' : L,
        div : P,
        object : O,
        sup : L,
        dd : P,
        strike : L,
        area : {},
        dir : Q,
        map : X( _({area:1,form:1,p:1}), A, F, E ),
        applet : O,
        dl : _({dt:1,dd:1}),
        del : L,
        isindex : {},
        fieldset : X( _({legend:1}), K ),
        thead : M,
        ul : Q,
        acronym : L,
        b : L,
        a : X( _({a:1}), J ),
        blockquote :X(_({td:1,tr:1,tbody:1,li:1}),P),
        caption : L,
        i : L,
        u : L,
        tbody : M,
        s : L,
        address : X( D, I ),
        tt : L,
        legend : L,
        q : L,
        pre : X( G, C ),
        p : X(_({'a':1}),L),
        em :L,
        dfn : L
    });
})();
///import editor.js
///import core/utils.js
///import core/browser.js
///import core/dom/dom.js
///import core/dom/dtd.js
/**
 * for getNextDomNode getPreviousDomNode
 */
function getDomNode( node, start, ltr, startFromChild, fn, guard ) {
    var tmpNode = startFromChild && node[start],
            parent;
    !tmpNode && (tmpNode = node[ltr]);
    while ( !tmpNode && (parent = (parent || node).parentNode) ) {
        if ( parent.tagName == 'BODY' || guard && !guard( parent ) ) {
            return null;
        }
        tmpNode = parent[ltr];
    }
    if ( tmpNode && fn && !fn( tmpNode ) ) {
        return  getDomNode( tmpNode, start, ltr, false, fn );
    }
    return tmpNode;
}
var attrFix = ie && browser.version < 9 ? {
            tabindex:"tabIndex",
            readonly:"readOnly",
            "for":"htmlFor",
            "class":"className",
            maxlength:"maxLength",
            cellspacing:"cellSpacing",
            cellpadding:"cellPadding",
            rowspan:"rowSpan",
            colspan:"colSpan",
            usemap:"useMap",
            frameborder:"frameBorder"
        } : {
            tabindex:"tabIndex",
            readonly:"readOnly"
        },
        styleBlock = utils.listToMap( [
            '-webkit-box', '-moz-box', 'block' ,
            'list-item' , 'table' , 'table-row-group' ,
            'table-header-group', 'table-footer-group' ,
            'table-row' , 'table-column-group' , 'table-column' ,
            'table-cell' , 'table-caption'
        ] );
var domUtils = dom.domUtils = {
    //节点常量
    NODE_ELEMENT:1,
    NODE_DOCUMENT:9,
    NODE_TEXT:3,
    NODE_COMMENT:8,
    NODE_DOCUMENT_FRAGMENT:11,

    //位置关系
    POSITION_IDENTICAL:0,
    POSITION_DISCONNECTED:1,
    POSITION_FOLLOWING:2,
    POSITION_PRECEDING:4,
    POSITION_IS_CONTAINED:8,
    POSITION_CONTAINS:16,
    //ie6使用其他的会有一段空白出现
    fillChar:ie && browser.version == '6' ? '\ufeff' : '\u200B',
    //-------------------------Node部分--------------------------------
    keys:{
        /*Backspace*/ 8:1, /*Delete*/ 46:1,
        /*Shift*/ 16:1, /*Ctrl*/ 17:1, /*Alt*/ 18:1,
        37:1, 38:1, 39:1, 40:1,
        13:1 /*enter*/
    },
    /**
     * 获取两个节点的位置关系
     * @function
     * @param {Node} nodeA     节点A
     * @param {Node} nodeB     节点B
     * @returns {Number}       返回位置关系
     */
    getPosition:function ( nodeA, nodeB ) {
        // 如果两个节点是同一个节点
        if ( nodeA === nodeB ) {
            // domUtils.POSITION_IDENTICAL
            return 0;
        }
        var node,
                parentsA = [nodeA],
                parentsB = [nodeB];
        node = nodeA;
        while ( node = node.parentNode ) {
            // 如果nodeB是nodeA的祖先节点
            if ( node === nodeB ) {
                // domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING
                return 10;
            }
            parentsA.push( node );
        }
        node = nodeB;
        while ( node = node.parentNode ) {
            // 如果nodeA是nodeB的祖先节点
            if ( node === nodeA ) {
                // domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING
                return 20;
            }
            parentsB.push( node );
        }
        parentsA.reverse();
        parentsB.reverse();
        if ( parentsA[0] !== parentsB[0] ) {
            // domUtils.POSITION_DISCONNECTED
            return 1;
        }
        var i = -1;
        while ( i++, parentsA[i] === parentsB[i] ) {
        }
        nodeA = parentsA[i];
        nodeB = parentsB[i];
        while ( nodeA = nodeA.nextSibling ) {
            if ( nodeA === nodeB ) {
                // domUtils.POSITION_PRECEDING
                return 4
            }
        }
        // domUtils.POSITION_FOLLOWING
        return  2;
    },

    /**
     * 返回节点索引，zero-based
     * @function
     * @param {Node} node     节点
     * @returns {Number}    节点的索引
     */
    getNodeIndex : function (node,normalized) {

        var preNode = node,i=0;
        while(preNode = preNode.previousSibling){
            if(normalized && preNode.nodeType == 3){

                continue;
            }
            i++;

        }
        return i;
    },

    /**
     * 判断节点是否在树上
     * @param node
     */
    inDoc:function ( node, doc ) {
        while ( node = node.parentNode ) {
            if ( node === doc ) {
                return true;
            }
        }
        return false;
    },

    /**
     * 查找祖先节点
     * @function
     * @param {Node}     node        节点
     * @param {Function} tester      以函数为规律
     * @param {Boolean} includeSelf 包含自己
     * @returns {Node}      返回祖先节点
     */
    findParent:function ( node, tester, includeSelf ) {
        if ( !domUtils.isBody( node ) ) {
            node = includeSelf ? node : node.parentNode;
            while ( node ) {
                if ( !tester || tester( node ) || this.isBody( node ) ) {
                    return tester && !tester( node ) && this.isBody( node ) ? null : node;
                }
                node = node.parentNode;
            }
        }
        return null;
    },
    /**
     * 查找祖先节点
     * @function
     * @param {Node}     node        节点
     * @param {String}   tagName      标签名称
     * @param {Boolean} includeSelf 包含自己
     * @returns {Node}      返回祖先节点
     */
    findParentByTagName:function ( node, tagName, includeSelf, excludeFn ) {
        if ( node && node.nodeType && !this.isBody( node ) && (node.nodeType == 1 || node.nodeType) ) {
            tagName = utils.listToMap( utils.isArray( tagName ) ? tagName : [tagName] );
            node = node.nodeType == 3 || !includeSelf ? node.parentNode : node;
            while ( node && node.tagName && node.nodeType != 9 ) {
                if ( excludeFn && excludeFn( node ) ) {
                    break;
                }
                if ( tagName[node.tagName] )
                    return node;
                node = node.parentNode;
            }
        }

        return null;
    },
    /**
     * 查找祖先节点集合
     * @param {Node} node               节点
     * @param {Function} tester         函数
     * @param {Boolean} includeSelf     是否从自身开始找
     * @param {Boolean} closerFirst
     * @returns {Array}     祖先节点集合
     */
    findParents:function ( node, includeSelf, tester, closerFirst ) {
        var parents = includeSelf && ( tester && tester( node ) || !tester ) ? [node] : [];
        while ( node = domUtils.findParent( node, tester ) ) {
            parents.push( node );
        }
        return closerFirst ? parents : parents.reverse();
    },

    /**
     * 往后插入节点
     * @function
     * @param  {Node}     node            基准节点
     * @param  {Node}     nodeToInsert    要插入的节点
     * @return {Node}     返回node
     */
    insertAfter:function ( node, nodeToInsert ) {
        return node.parentNode.insertBefore( nodeToInsert, node.nextSibling );
    },

    /**
     * 删除该节点
     * @function
     * @param {Node} node            要删除的节点
     * @param {Boolean} keepChildren 是否保留子节点不删除
     * @return {Node} 返回要删除的节点
     */
    remove:function ( node, keepChildren ) {
        var parent = node.parentNode,
                child;
        if ( parent ) {
            if ( keepChildren && node.hasChildNodes() ) {
                while ( child = node.firstChild ) {
                    parent.insertBefore( child, node );
                }
            }
            parent.removeChild( node );
        }
        return node;
    },

    /**
     * 取得node节点在dom树上的下一个节点
     * @function
     * @param {Node} node       节点
     * @param {Boolean} startFromChild 为true从子节点开始找
     * @param {Function} fn fn为真的节点
     * @return {Node}    返回下一个节点
     */
    getNextDomNode:function ( node, startFromChild, filter, guard ) {
        return getDomNode( node, 'firstChild', 'nextSibling', startFromChild, filter, guard );
    },
    /**
     * 是bookmark节点
     * @param {Node} node        判断是否为书签节点
     * @return {Boolean}        返回是否为书签节点
     */
    isBookmarkNode:function ( node ) {
        return node.nodeType == 1 && node.id && /^_baidu_bookmark_/i.test( node.id );
    },
    /**
     * 获取节点所在window对象
     * @param {Node} node     节点
     * @return {window}    返回window对象
     */
    getWindow:function ( node ) {
        var doc = node.ownerDocument || node;
        return doc.defaultView || doc.parentWindow;
    },
    /**
     * 得到公共的祖先节点
     * @param   {Node}     nodeA      节点A
     * @param   {Node}     nodeB      节点B
     * @return {Node} nodeA和nodeB的公共节点
     */
    getCommonAncestor:function ( nodeA, nodeB ) {
        if ( nodeA === nodeB )
            return nodeA;
        var parentsA = [nodeA] , parentsB = [nodeB], parent = nodeA, i = -1;
        while ( parent = parent.parentNode ) {
            if ( parent === nodeB ) {
                return parent;
            }
            parentsA.push( parent );
        }
        parent = nodeB;
        while ( parent = parent.parentNode ) {
            if ( parent === nodeA )
                return parent;
            parentsB.push( parent );
        }
        parentsA.reverse();
        parentsB.reverse();
        while ( i++, parentsA[i] === parentsB[i] ) {
        }
        return i == 0 ? null : parentsA[i - 1];

    },
    /**
     * 清除该节点左右空的inline节点
     * @function
     * @param {Node}     node
     * @param {Boolean} ingoreNext   默认为false清除右边为空的inline节点。true为不清除右边为空的inline节点
     * @param {Boolean} ingorePre    默认为false清除左边为空的inline节点。true为不清除左边为空的inline节点
     * @exmaple <b></b><i></i>xxxx<b>bb</b> --> xxxx<b>bb</b>
     */
    clearEmptySibling:function ( node, ingoreNext, ingorePre ) {
        function clear( next, dir ) {
            var tmpNode;
            while ( next && !domUtils.isBookmarkNode( next ) && (domUtils.isEmptyInlineElement( next )
                //这里不能把空格算进来会吧空格干掉，出现文字间的空格丢掉了
                    || !new RegExp( '[^\t\n\r' + domUtils.fillChar + ']' ).test( next.nodeValue ) ) ) {
                tmpNode = next[dir];
                domUtils.remove( next );
                next = tmpNode;
            }
        }

        !ingoreNext && clear( node.nextSibling, 'nextSibling' );
        !ingorePre && clear( node.previousSibling, 'previousSibling' );
    },
    //---------------------------Text----------------------------------
    /**
     * 将一个文本节点拆分成两个文本节点
     * @param {TextNode} node          文本节点
     * @param {Integer} offset         拆分的位置
     * @return {TextNode}   拆分后的后一个文本节
     */
    split:function ( node, offset ) {
        var doc = node.ownerDocument;
        if ( browser.ie && offset == node.nodeValue.length ) {
            var next = doc.createTextNode( '' );
            return domUtils.insertAfter( node, next );
        }
        var retval = node.splitText( offset );
        //ie8下splitText不会跟新childNodes,我们手动触发他的更新
        if ( browser.ie8 ) {
            var tmpNode = doc.createTextNode( '' );
            domUtils.insertAfter( retval, tmpNode );
            domUtils.remove( tmpNode );
        }
        return retval;
    },

    /**
     * 判断是否为空白节点
     * @param {TextNode}   node   节点
     * @return {Boolean}      返回是否为文本节点
     */
    isWhitespace:function ( node ) {
        return !new RegExp( '[^ \t\n\r' + domUtils.fillChar + ']' ).test( node.nodeValue );
    },
    //------------------------------Element-------------------------------------------
    /**
     * 获取元素相对于viewport的像素坐标
     * @param {Element} element      元素
     * @returns {Object}             返回坐标对象{x:left,y:top}
     */
    getXY:function ( element ) {
        var x = 0, y = 0;
        while ( element.offsetParent ) {
            y += element.offsetTop;
            x += element.offsetLeft;
            element = element.offsetParent;
        }
        return {
            'x':x,
            'y':y
        };
    },
    /**
     * 绑原生DOM事件
     * @param {Element|Window|Document} target     元素
     * @param {Array|String} type                  事件类型
     * @param {Function} handler                   执行函数
     */
    on:function ( obj, type, handler ) {

        var types = utils.isArray(type) ? type : [type],
                k = types.length;
        if ( k ) while ( k-- ) {
            type = types[k];
            if ( obj.addEventListener ) {
                obj.addEventListener( type, handler, false );
            } else {
                if ( !handler._d ) {
                    handler._d = {};
                }
                var key = type + handler.toString();
                if ( !handler._d[key] ) {
                    handler._d[key] = function ( evt ) {
                        return handler.call( evt.srcElement, evt || window.event );
                    };
                    obj.attachEvent( 'on' + type, handler._d[key] );
                }
            }
        }

        obj = null;
    },

    /**
     * 解除原生DOM事件绑定
     * @param {Element|Window|Document} obj         元素
     * @param {Array|String} type                   事件类型
     * @param {Function} handler                    执行函数
     */
    un:function ( obj, type, handler ) {
        var types = utils.isArray(type) ? type : [type],
                k = types.length;
        if ( k ) while ( k-- ) {
            type = types[k];
            if ( obj.removeEventListener ) {
                obj.removeEventListener( type, handler, false );
            } else {
                var key = type + handler.toString();
                obj.detachEvent( 'on' + type, handler._d ? handler._d[key] : handler );
                if ( handler._d && handler._d[key] ) {
                    delete handler._d[key];
                }
            }
        }
    },

    /**
     * 比较两个节点是否tagName相同且有相同的属性和属性值
     * @param {Element}   nodeA              节点A
     * @param {Element}   nodeB              节点B
     * @return {Boolean}     返回两个节点的标签，属性和属性值是否相同
     * @example
     * &lt;span  style="font-size:12px"&gt;ssss&lt;/span&gt;和&lt;span style="font-size:12px"&gt;bbbbb&lt;/span&gt; 相等
     *  &lt;span  style="font-size:13px"&gt;ssss&lt;/span&gt;和&lt;span style="font-size:12px"&gt;bbbbb&lt;/span&gt; 不相等
     */
    isSameElement:function ( nodeA, nodeB ) {
        if ( nodeA.tagName != nodeB.tagName ) {
            return 0;
        }
        var thisAttribs = nodeA.attributes,
                otherAttribs = nodeB.attributes;
        if ( !ie && thisAttribs.length != otherAttribs.length ) {
            return 0;
        }
        var attrA, attrB, al = 0, bl = 0;
        for ( var i = 0; attrA = thisAttribs[i++]; ) {
            if ( attrA.nodeName == 'style' ) {
                if ( attrA.specified ) {
                    al++;
                }
                if ( domUtils.isSameStyle( nodeA, nodeB ) ) {
                    continue;
                } else {
                    return 0;
                }
            }
            if ( ie ) {
                if ( attrA.specified ) {
                    al++;
                    attrB = otherAttribs.getNamedItem( attrA.nodeName );
                } else {
                    continue;
                }
            } else {
                attrB = nodeB.attributes[attrA.nodeName];
            }
            if ( !attrB.specified || attrA.nodeValue != attrB.nodeValue ) {
                return 0;
            }
        }
        // 有可能attrB的属性包含了attrA的属性之外还有自己的属性
        if ( ie ) {
            for ( i = 0; attrB = otherAttribs[i++]; ) {
                if ( attrB.specified ) {
                    bl++;
                }
            }
            if ( al != bl ) {
                return 0;
            }
        }
        return 1;
    },

    /**
     * 判断两个元素的style属性是不是一致
     * @param {Element} elementA       元素A
     * @param {Element} elementB       元素B
     * @return   {boolean}   返回判断结果，true为一致
     */
    isSameStyle:function ( elementA, elementB ) {
        var styleA = elementA.style.cssText.replace( /( ?; ?)/g, ';' ).replace( /( ?: ?)/g, ':' ),
                styleB = elementB.style.cssText.replace( /( ?; ?)/g, ';' ).replace( /( ?: ?)/g, ':' );
        if ( browser.opera ) {
            styleA = elementA.style;
            styleB = elementB.style;
            if ( styleA.length != styleB.length )
                return 0;
            for ( var p in styleA ) {
                if ( /^(\d+|csstext)$/i.test( p ) ) {
                    continue;
                }
                if ( styleA[p] != styleB[p] ) {
                    return 0;
                }
            }
            return 1;
        }


        if ( !styleA || !styleB ) {
            return styleA == styleB ? 1 : 0;
        }
        styleA = styleA.split( ';' );
        styleB = styleB.split( ';' );
        if ( styleA.length != styleB.length ) {
            return 0;
        }
        for ( var i = 0, ci; ci = styleA[i++]; ) {
            if ( utils.indexOf( styleB, ci ) == -1 ) {
                return 0;
            }
        }
        return 1;
    },

    /**
     * 检查是否为块元素
     * @function
     * @param {Element} node       元素
     * @param {String} customNodeNames 自定义的块元素的tagName
     * @return {Boolean} 是否为块元素
     */
    isBlockElm:function ( node ) {
        return node.nodeType == 1 && (dtd.$block[node.tagName] || styleBlock[domUtils.getComputedStyle( node, 'display' )]) && !dtd.$nonChild[node.tagName];
    },

    /**
     * 判断是否body
     * @param {Node} 节点
     * @return {Boolean}   是否是body节点
     */
    isBody:function ( node ) {
        return  node && node.nodeType == 1 && node.tagName.toLowerCase() == 'body';
    },
    /**
     * 以node节点为中心，将该节点的父节点拆分成2块
     * @param {Element} node       节点
     * @param {Element} parent 要被拆分的父节点
     * @example <div>xxxx<b>xxx</b>xxx</div> ==> <div>xxx</div><b>xx</b><div>xxx</div>
     */
    breakParent:function ( node, parent ) {
        var tmpNode, parentClone = node, clone = node, leftNodes, rightNodes;
        do {
            parentClone = parentClone.parentNode;
            if ( leftNodes ) {
                tmpNode = parentClone.cloneNode( false );
                tmpNode.appendChild( leftNodes );
                leftNodes = tmpNode;
                tmpNode = parentClone.cloneNode( false );
                tmpNode.appendChild( rightNodes );
                rightNodes = tmpNode;
            } else {
                leftNodes = parentClone.cloneNode( false );
                rightNodes = leftNodes.cloneNode( false );
            }
            while ( tmpNode = clone.previousSibling ) {
                leftNodes.insertBefore( tmpNode, leftNodes.firstChild );
            }
            while ( tmpNode = clone.nextSibling ) {
                rightNodes.appendChild( tmpNode );
            }
            clone = parentClone;
        } while ( parent !== parentClone );
        tmpNode = parent.parentNode;
        tmpNode.insertBefore( leftNodes, parent );
        tmpNode.insertBefore( rightNodes, parent );
        tmpNode.insertBefore( node, rightNodes );
        domUtils.remove( parent );
        return node;
    },

    /**
     * 检查是否是空inline节点
     * @param   {Node}    node      节点
     * @return {Boolean}  返回1为是，0为否
     * @example
     * &lt;b&gt;&lt;i&gt;&lt;/i&gt;&lt;/b&gt; //true
     * <b><i></i><u></u></b> true
     * &lt;b&gt;&lt;/b&gt; true  &lt;b&gt;xx&lt;i&gt;&lt;/i&gt;&lt;/b&gt; //false
     */
    isEmptyInlineElement:function ( node ) {
        if ( node.nodeType != 1 || !dtd.$removeEmpty[ node.tagName ] ) {
            return 0;
        }
        node = node.firstChild;
        while ( node ) {
            //如果是创建的bookmark就跳过
            if ( domUtils.isBookmarkNode( node ) ) {
                return 0;
            }
            if ( node.nodeType == 1 && !domUtils.isEmptyInlineElement( node ) ||
                    node.nodeType == 3 && !domUtils.isWhitespace( node )
                    ) {
                return 0;
            }
            node = node.nextSibling;
        }
        return 1;

    },

    /**
     * 删除空白子节点
     * @param   {Element}   node    需要删除空白子节点的元素
     */
    trimWhiteTextNode:function ( node ) {
        function remove( dir ) {
            var child;
            while ( (child = node[dir]) && child.nodeType == 3 && domUtils.isWhitespace( child ) ) {
                node.removeChild( child )
            }
        }

        remove( 'firstChild' );
        remove( 'lastChild' );
    },

    /**
     * 合并子节点
     * @param    {Node}    node     节点
     * @param    {String}    tagName     标签
     * @param    {String}    attrs     属性
     * @example &lt;span style="font-size:12px;"&gt;xx&lt;span style="font-size:12px;"&gt;aa&lt;/span&gt;xx&lt;/span  使用后
     * &lt;span style="font-size:12px;"&gt;xxaaxx&lt;/span
     */
    mergChild:function ( node, tagName, attrs ) {
        var list = domUtils.getElementsByTagName( node, node.tagName.toLowerCase() );
        for ( var i = 0, ci; ci = list[i++]; ) {
            if ( !ci.parentNode || domUtils.isBookmarkNode( ci ) ) {
                continue;
            }
            //span单独处理
            if ( ci.tagName.toLowerCase() == 'span' ) {
                if ( node === ci.parentNode ) {
                    domUtils.trimWhiteTextNode( node );
                    if ( node.childNodes.length == 1 ) {
                        node.style.cssText = ci.style.cssText + ";" + node.style.cssText;
                        domUtils.remove( ci, true );
                        continue;
                    }
                }
                ci.style.cssText = node.style.cssText + ';' + ci.style.cssText;
                if ( attrs ) {
                    var style = attrs.style;
                    if ( style ) {
                        style = style.split( ';' );
                        for ( var j = 0, s; s = style[j++]; ) {
                            ci.style[utils.cssStyleToDomStyle( s.split( ':' )[0] )] = s.split( ':' )[1];
                        }
                    }
                }
                if ( domUtils.isSameStyle( ci, node ) ) {
                    domUtils.remove( ci, true );
                }
                continue;
            }
            if ( domUtils.isSameElement( node, ci ) ) {
                domUtils.remove( ci, true );
            }
        }

        if ( tagName == 'span' ) {
            var as = domUtils.getElementsByTagName( node, 'a' );
            for ( var i = 0, ai; ai = as[i++]; ) {
                ai.style.cssText = ';' + node.style.cssText;
                ai.style.textDecoration = 'underline';
            }
        }
    },

    /**
     * 封装原生的getElemensByTagName
     * @param  {Node}    node       根节点
     * @param  {String}   name      标签的tagName
     * @return {Array}      返回符合条件的元素数组
     */
    getElementsByTagName:function ( node, name ) {
        var list = node.getElementsByTagName( name ), arr = [];
        for ( var i = 0, ci; ci = list[i++]; ) {
            arr.push( ci )
        }
        return arr;
    },
    /**
     * 将子节点合并到父节点上
     * @param {Element} node    节点
     * @example &lt;span style="color:#ff"&gt;&lt;span style="font-size:12px"&gt;xxx&lt;/span&gt;&lt;/span&gt; ==&gt; &lt;span style="color:#ff;font-size:12px"&gt;xxx&lt;/span&gt;
     */
    mergToParent:function ( node ) {
        var parent = node.parentNode;
        while ( parent && dtd.$removeEmpty[parent.tagName] ) {
            if ( parent.tagName == node.tagName || parent.tagName == 'A' ) {//针对a标签单独处理
                domUtils.trimWhiteTextNode( parent );
                //span需要特殊处理  不处理这样的情况 <span stlye="color:#fff">xxx<span style="color:#ccc">xxx</span>xxx</span>
                if ( parent.tagName == 'SPAN' && !domUtils.isSameStyle( parent, node )
                        || (parent.tagName == 'A' && node.tagName == 'SPAN') ) {
                    if ( parent.childNodes.length > 1 || parent !== node.parentNode ) {
                        node.style.cssText = parent.style.cssText + ";" + node.style.cssText;
                        parent = parent.parentNode;
                        continue;
                    } else {
                        parent.style.cssText += ";" + node.style.cssText;
                        //trace:952 a标签要保持下划线
                        if ( parent.tagName == 'A' ) {
                            parent.style.textDecoration = 'underline';
                        }
                    }
                }
                if ( parent.tagName != 'A' ) {
                    parent === node.parentNode && domUtils.remove( node, true );
                    break;
                }
            }
            parent = parent.parentNode;
        }
    },
    /**
     * 合并左右兄弟节点
     * @function
     * @param {Node}     node
     * @param {Boolean} ingoreNext   默认为false合并上一个兄弟节点。true为不合并上一个兄弟节点
     * @param {Boolean} ingorePre    默认为false合并下一个兄弟节点。true为不合并下一个兄弟节点
     * @example &lt;b&gt;xxxx&lt;/b&gt;&lt;b&gt;xxx&lt;/b&gt;&lt;b&gt;xxxx&lt;/b&gt; ==> &lt;b&gt;xxxxxxxxxxx&lt;/b&gt;
     */
    mergSibling:function ( node, ingorePre, ingoreNext ) {
        function merg( rtl, start, node ) {
            var next;
            if ( (next = node[rtl]) && !domUtils.isBookmarkNode( next ) && next.nodeType == 1 && domUtils.isSameElement( node, next ) ) {
                while ( next.firstChild ) {
                    if ( start == 'firstChild' ) {
                        node.insertBefore( next.lastChild, node.firstChild );
                    } else {
                        node.appendChild( next.firstChild );
                    }
                }
                domUtils.remove( next );
            }
        }

        !ingorePre && merg( 'previousSibling', 'firstChild', node );
        !ingoreNext && merg( 'nextSibling', 'lastChild', node );
    },

    /**
     * 使得元素及其子节点不能被选择
     * @function
     * @param   {Node}     node      节点
     */
    unselectable:ie || browser.opera ? function ( node ) {
        //for ie9
        node.onselectstart = function () {
            return false;
        };
        node.onclick = node.onkeyup = node.onkeydown = function () {
            return false;
        };
        node.unselectable = 'on';
        node.setAttribute( "unselectable", "on" );
        for ( var i = 0, ci; ci = node.all[i++]; ) {
            switch ( ci.tagName.toLowerCase() ) {
                case 'iframe' :
                case 'textarea' :
                case 'input' :
                case 'select' :
                    break;
                default :
                    ci.unselectable = 'on';
                    node.setAttribute( "unselectable", "on" );
            }
        }
    } : function ( node ) {
        node.style.MozUserSelect =
                node.style.webkitUserSelect =
                        node.style.KhtmlUserSelect = 'none';
    },
    /**
     * 删除元素上的属性，可以删除多个
     * @function
     * @param {Element} element      元素
     * @param {Array} attrNames      要删除的属性数组
     */
    removeAttributes:function ( elm, attrNames ) {
        for ( var i = 0, ci; ci = attrNames[i++]; ) {
            ci = attrFix[ci] || ci;
            switch ( ci ) {
                case 'className':
                    elm[ci] = '';
                    break;
                case 'style':
                    elm.style.cssText = '';
                    !browser.ie && elm.removeAttributeNode( elm.getAttributeNode( 'style' ) )
            }
            elm.removeAttribute( ci );
        }
    },
    creElm:function ( doc, tag, attrs ) {
        return this.setAttributes( doc.createElement( tag ), attrs )
    },
    /**
     * 给节点添加属性
     * @function
     * @param {Node} node      节点
     * @param {Object} attrNames     要添加的属性名称，采用json对象存放
     */
    setAttributes:function ( node, attrs ) {
        for ( var name in attrs ) {
            var value = attrs[name];
            switch ( name ) {
                case 'class':
                    //ie下要这样赋值，setAttribute不起作用
                    node.className = value;
                    break;
                case 'style' :
                    node.style.cssText = node.style.cssText + ";" + value;
                    break;
                case 'innerHTML':
                    node[name] = value;
                    break;
                case 'value':
                    node.value = value;
                    break;
                default:
                    node.setAttribute( attrFix[name] || name, value );
            }
        }
        return node;
    },

    /**
     * 获取元素的样式
     * @function
     * @param {Element} element    元素
     * @param {String} styleName    样式名称
     * @return  {String}    样式值
     */
    getComputedStyle:function ( element, styleName ) {
        function fixUnit( key, val ) {
            if ( key == 'font-size' && /pt$/.test( val ) ) {
                val = Math.round( parseFloat( val ) / 0.75 ) + 'px';
            }
            return val;
        }

        if ( element.nodeType == 3 ) {
            element = element.parentNode;
        }
        //ie下font-size若body下定义了font-size，则从currentStyle里会取到这个font-size. 取不到实际值，故此修改.
        if ( browser.ie && browser.version < 9 && styleName == 'font-size' && !element.style.fontSize &&
                !dtd.$empty[element.tagName] && !dtd.$nonChild[element.tagName] ) {
            var span = element.ownerDocument.createElement( 'span' );
            span.style.cssText = 'padding:0;border:0;font-family:simsun;';
            span.innerHTML = '.';
            element.appendChild( span );
            var result = span.offsetHeight;
            element.removeChild( span );
            span = null;
            return result + 'px';
        }
        try {
            var value = domUtils.getStyle( element, styleName ) ||
                    (window.getComputedStyle ? domUtils.getWindow( element ).getComputedStyle( element, '' ).getPropertyValue( styleName ) :
                            ( element.currentStyle || element.style )[utils.cssStyleToDomStyle( styleName )]);

        } catch ( e ) {
            return null;
        }
        return fixUnit( styleName, utils.fixColor( styleName, value ) );
    },

    /**
     * 删除cssClass，可以支持删除多个class
     * @param {Element} element         元素
     * @param {Array} classNames        删除的className
     */
    removeClasses:function ( element, classNames ) {
        classNames = utils.isArray( classNames ) ? classNames : [classNames];
        element.className = (' ' + element.className + ' ').replace(
                new RegExp( '(?:\\s+(?:' + classNames.join( '|' ) + '))+\\s+', 'g' ), ' ' );
    },
    /**
     * 增加一个class
     * @param element
     * @param className
     */
    addClass:function ( element, className ) {
        if ( !this.hasClass( element, className ) ) {
            element.className += " " + className;
        }
    },
    /**
     * 删除元素的样式
     * @param {Element} element元素
     * @param {String} name        删除的样式名称
     */
    removeStyle:function ( node, name ) {
        node.style[utils.cssStyleToDomStyle( name )] = '';
        if ( !node.style.cssText ) {
            domUtils.removeAttributes( node, ['style'] );
        }
    },
    /**
     * 判断元素属性中是否包含某一个classname
     * @param {Element} element    元素
     * @param {String} className    样式名
     * @returns {Boolean}       是否包含该classname
     */
    hasClass:function ( element, className ) {
        return ( ' ' + element.className + ' ' ).indexOf( ' ' + className + ' ' ) > -1;
    },

    /**
     * 阻止事件默认行为
     * @param {Event} evt    需要组织的事件对象
     */
    preventDefault:function ( evt ) {
        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    },
    /**
     * 获得元素样式
     * @param {Element} element    元素
     * @param {String}  name    样式名称
     * @return  {String}   返回元素样式值
     */
    getStyle:function ( element, name ) {
        var value = element.style[ utils.cssStyleToDomStyle( name ) ];
        return utils.fixColor( name, value );
    },
    setStyle:function ( element, name, value ) {
        element.style[utils.cssStyleToDomStyle( name )] = value;
    },
    setStyles:function ( element, styles ) {
        for ( var name in styles ) {
            if ( styles.hasOwnProperty( name ) ) {
                domUtils.setStyle( element, name, styles[name] );
            }
        }
    },
    /**
     * 删除_moz_dirty属性
     * @function
     * @param {Node}    node    节点
     */
    removeDirtyAttr:function ( node ) {
        for ( var i = 0, ci, nodes = node.getElementsByTagName( '*' ); ci = nodes[i++]; ) {
            ci.removeAttribute( '_moz_dirty' );
        }
        node.removeAttribute( '_moz_dirty' );
    },
    /**
     * 返回子节点的数量
     * @function
     * @param {Node}    node    父节点
     * @param  {Function}    fn    过滤子节点的规则，若为空，则得到所有子节点的数量
     * @return {Number}    符合条件子节点的数量
     */
    getChildCount:function ( node, fn ) {
        var count = 0, first = node.firstChild;
        fn = fn || function () {
            return 1;
        };
        while ( first ) {
            if ( fn( first ) ) {
                count++;
            }
            first = first.nextSibling;
        }
        return count;
    },

    /**
     * 判断是否为空节点
     * @function
     * @param {Node}    node    节点
     * @return {Boolean}    是否为空节点
     */
    isEmptyNode:function ( node ) {
        return !node.firstChild || domUtils.getChildCount( node, function ( node ) {
            return  !domUtils.isBr( node ) && !domUtils.isBookmarkNode( node ) && !domUtils.isWhitespace( node )
        } ) == 0
    },
    /**
     * 清空节点所有的className
     * @function
     * @param {Array}    nodes    节点数组
     */
    clearSelectedArr:function ( nodes ) {
        var node;
        while ( node = nodes.pop() ) {
            domUtils.removeAttributes( node, ['class'] );
        }
    },
    /**
     * 将显示区域滚动到显示节点的位置
     * @function
     * @param    {Node}   node    节点
     * @param    {window}   win      window对象
     * @param    {Number}    offsetTop    距离上方的偏移量
     */
    scrollToView:function ( node, win, offsetTop ) {
        var getViewPaneSize = function () {
                    var doc = win.document,
                            mode = doc.compatMode == 'CSS1Compat';
                    return {
                        width:( mode ? doc.documentElement.clientWidth : doc.body.clientWidth ) || 0,
                        height:( mode ? doc.documentElement.clientHeight : doc.body.clientHeight ) || 0
                    };
                },
                getScrollPosition = function ( win ) {
                    if ( 'pageXOffset' in win ) {
                        return {
                            x:win.pageXOffset || 0,
                            y:win.pageYOffset || 0
                        };
                    }
                    else {
                        var doc = win.document;
                        return {
                            x:doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
                            y:doc.documentElement.scrollTop || doc.body.scrollTop || 0
                        };
                    }
                };
        var winHeight = getViewPaneSize().height, offset = winHeight * -1 + offsetTop;
        offset += (node.offsetHeight || 0);
        var elementPosition = domUtils.getXY( node );
        offset += elementPosition.y;
        var currentScroll = getScrollPosition( win ).y;
        // offset += 50;
        if ( offset > currentScroll || offset < currentScroll - winHeight ) {
            win.scrollTo( 0, offset + (offset < 0 ? -20 : 20) );
        }
    },
    /**
     * 判断节点是否为br
     * @function
     * @param {Node}    node   节点
     */
    isBr:function ( node ) {
        return node.nodeType == 1 && node.tagName == 'BR';
    },
    isFillChar:function ( node ) {
        return node.nodeType == 3 && !node.nodeValue.replace( new RegExp( domUtils.fillChar ), '' ).length
    },
    isStartInblock:function ( range ) {
        var tmpRange = range.cloneRange(),
                flag = 0,
                start = tmpRange.startContainer,
                tmp;
        while ( start && domUtils.isFillChar( start ) ) {
            tmp = start;
            start = start.previousSibling
        }
        if ( tmp ) {
            tmpRange.setStartBefore( tmp );
            start = tmpRange.startContainer;
        }
        if ( start.nodeType == 1 && domUtils.isEmptyNode( start ) && tmpRange.startOffset == 1 ) {
            tmpRange.setStart( start, 0 ).collapse( true );
        }
        while ( !tmpRange.startOffset ) {
            start = tmpRange.startContainer;
            if ( domUtils.isBlockElm( start ) || domUtils.isBody( start ) ) {
                flag = 1;
                break;
            }
            var pre = tmpRange.startContainer.previousSibling,
                    tmpNode;
            if ( !pre ) {
                tmpRange.setStartBefore( tmpRange.startContainer );
            } else {
                while ( pre && domUtils.isFillChar( pre ) ) {
                    tmpNode = pre;
                    pre = pre.previousSibling;
                }
                if ( tmpNode ) {
                    tmpRange.setStartBefore( tmpNode );
                } else {
                    tmpRange.setStartBefore( tmpRange.startContainer );
                }
            }
        }
        return flag && !domUtils.isBody( tmpRange.startContainer ) ? 1 : 0;
    },
    isEmptyBlock:function ( node ) {
        var reg = new RegExp( '[ \t\r\n' + domUtils.fillChar + ']', 'g' );
        if ( node[browser.ie ? 'innerText' : 'textContent'].replace( reg, '' ).length > 0 ) {
            return 0;
        }
        for ( var n in dtd.$isNotEmpty ) {
            if ( node.getElementsByTagName( n ).length ) {
                return 0;
            }
        }
        return 1;
    },

    setViewportOffset:function ( element, offset ) {
        var left = parseInt( element.style.left ) | 0;
        var top = parseInt( element.style.top ) | 0;
        var rect = element.getBoundingClientRect();
        var offsetLeft = offset.left - rect.left;
        var offsetTop = offset.top - rect.top;
        if ( offsetLeft ) {
            element.style.left = left + offsetLeft + 'px';
        }
        if ( offsetTop ) {
            element.style.top = top + offsetTop + 'px';
        }
    },
    fillNode:function ( doc, node ) {
        var tmpNode = browser.ie ? doc.createTextNode( domUtils.fillChar ) : doc.createElement( 'br' );
        node.innerHTML = '';
        node.appendChild( tmpNode );
    },
    moveChild:function ( src, tag, dir ) {
        while ( src.firstChild ) {
            if ( dir && tag.firstChild ) {
                tag.insertBefore( src.lastChild, tag.firstChild );
            } else {
                tag.appendChild( src.firstChild );
            }
        }
    },
    //判断是否有额外属性
    hasNoAttributes:function ( node ) {
        return browser.ie ? /^<\w+\s*?>/.test( node.outerHTML ) : node.attributes.length == 0;
    },
    //判断是否是编辑器自定义的参数
    isCustomeNode:function ( node ) {
        return node.nodeType == 1 && node.getAttribute( '_ue_custom_node_' );
    },
    isTagNode:function ( node, tagName ) {
        return node.nodeType == 1 && node.tagName.toLowerCase() == tagName;
    }
};
var fillCharReg = new RegExp( domUtils.fillChar, 'g' );
var fillCharSpaceReg = new RegExp( domUtils.fillChar + '\u0020', 'g' );

///import editor.js
///import core/utils.js
///import core/browser.js
///import core/dom/dom.js
///import core/dom/dtd.js
///import core/dom/domUtils.js
/**
 * @class baidu.editor.dom.Range    Range类
 */
/**
 * @description Range类实现
 * @author zhanyi
 */
(function () {
    var guid = 0,
            fillChar = domUtils.fillChar,
            fillData;

    /**
     * 更新range的collapse状态
     * @param  {Range}   range    range对象
     */
    function updateCollapse( range ) {
        range.collapsed =
                range.startContainer && range.endContainer &&
                        range.startContainer === range.endContainer &&
                        range.startOffset == range.endOffset;
    }

    function setEndPoint( toStart, node, offset, range ) {
        //如果node是自闭合标签要处理
        if ( node.nodeType == 1 && (dtd.$empty[node.tagName] || dtd.$nonChild[node.tagName]) ) {
            offset = domUtils.getNodeIndex( node ) + (toStart ? 0 : 1);
            node = node.parentNode;
        }
        if ( toStart ) {
            range.startContainer = node;
            range.startOffset = offset;
            if ( !range.endContainer ) {
                range.collapse( true );
            }
        } else {
            range.endContainer = node;
            range.endOffset = offset;
            if ( !range.startContainer ) {
                range.collapse( false );
            }
        }
        updateCollapse( range );
        return range;
    }

    function execContentsAction( range, action ) {
        //调整边界
        //range.includeBookmark();
        var start = range.startContainer,
                end = range.endContainer,
                startOffset = range.startOffset,
                endOffset = range.endOffset,
                doc = range.document,
                frag = doc.createDocumentFragment(),
                tmpStart, tmpEnd;
        if ( start.nodeType == 1 ) {
            start = start.childNodes[startOffset] || (tmpStart = start.appendChild( doc.createTextNode( '' ) ));
        }
        if ( end.nodeType == 1 ) {
            end = end.childNodes[endOffset] || (tmpEnd = end.appendChild( doc.createTextNode( '' ) ));
        }
        if ( start === end && start.nodeType == 3 ) {
            frag.appendChild( doc.createTextNode( start.substringData( startOffset, endOffset - startOffset ) ) );
            //is not clone
            if ( action ) {
                start.deleteData( startOffset, endOffset - startOffset );
                range.collapse( true );
            }
            return frag;
        }
        var current, currentLevel, clone = frag,
                startParents = domUtils.findParents( start, true ), endParents = domUtils.findParents( end, true );
        for ( var i = 0; startParents[i] == endParents[i]; ) {
            i++;
        }
        for ( var j = i, si; si = startParents[j]; j++ ) {
            current = si.nextSibling;
            if ( si == start ) {
                if ( !tmpStart ) {
                    if ( range.startContainer.nodeType == 3 ) {
                        clone.appendChild( doc.createTextNode( start.nodeValue.slice( startOffset ) ) );
                        //is not clone
                        if ( action ) {
                            start.deleteData( startOffset, start.nodeValue.length - startOffset );
                        }
                    } else {
                        clone.appendChild( !action ? start.cloneNode( true ) : start );
                    }
                }
            } else {
                currentLevel = si.cloneNode( false );
                clone.appendChild( currentLevel );
            }
            while ( current ) {
                if ( current === end || current === endParents[j] ) {
                    break;
                }
                si = current.nextSibling;
                clone.appendChild( !action ? current.cloneNode( true ) : current );
                current = si;
            }
            clone = currentLevel;
        }
        clone = frag;
        if ( !startParents[i] ) {
            clone.appendChild( startParents[i - 1].cloneNode( false ) );
            clone = clone.firstChild;
        }
        for ( var j = i, ei; ei = endParents[j]; j++ ) {
            current = ei.previousSibling;
            if ( ei == end ) {
                if ( !tmpEnd && range.endContainer.nodeType == 3 ) {
                    clone.appendChild( doc.createTextNode( end.substringData( 0, endOffset ) ) );
                    //is not clone
                    if ( action ) {
                        end.deleteData( 0, endOffset );
                    }
                }
            } else {
                currentLevel = ei.cloneNode( false );
                clone.appendChild( currentLevel );
            }
            //如果两端同级，右边第一次已经被开始做了
            if ( j != i || !startParents[i] ) {
                while ( current ) {
                    if ( current === start ) {
                        break;
                    }
                    ei = current.previousSibling;
                    clone.insertBefore( !action ? current.cloneNode( true ) : current, clone.firstChild );
                    current = ei;
                }
            }
            clone = currentLevel;
        }
        if ( action ) {
            range.setStartBefore( !endParents[i] ? endParents[i - 1] : !startParents[i] ? startParents[i - 1] : endParents[i] ).collapse( true );
        }
        tmpStart && domUtils.remove( tmpStart );
        tmpEnd && domUtils.remove( tmpEnd );
        return frag;
    }
    /**
     * Range类
     * @param {Document} document 编辑器页面document对象
     */
    var Range = dom.Range = function ( document ) {
        var me = this;
        me.startContainer =
                me.startOffset =
                        me.endContainer =
                                me.endOffset = null;
        me.document = document;
        me.collapsed = true;
    };

    /**
     * 防止 fillData 后面的空格因两个 \u0020 相连而丢失
     * @param node
     */
    function keepNextSpace(node) {
      try {
        node = node && node.nextSibling;
        if (!node) return;
        while (node && node.nodeType == 1 && node.children.length) {
          node = node.children[0];
        }
        if (node.nodeType == 3) {
          node.nodeValue = node.nodeValue.replace(/^\u0020/, '\u00a0');
        }
      } catch(e) {}
    }

    /**
     * 删除fillData
     * @param doc
     * @param excludeNode
     */
    function removeFillData( doc, excludeNode ) {
        try {
            if ( fillData && domUtils.inDoc( fillData, doc ) ) {
                if ( !fillData.nodeValue.replace( fillCharReg, '' ).length ) {
                    var tmpNode = fillData.parentNode;
                    keepNextSpace(fillData);
                    domUtils.remove( fillData );
                    while ( tmpNode && domUtils.isEmptyInlineElement( tmpNode ) && !tmpNode.contains( excludeNode ) ) {
                        fillData = tmpNode.parentNode;
                        keepNextSpace(tmpNode);
                        domUtils.remove( tmpNode );
                        tmpNode = fillData;
                    }
                } else {
                    fillData.nodeValue = fillData.nodeValue.replace(fillCharSpaceReg, '\u00a0').replace( fillCharReg, '' );
                }
            }
        } catch ( e ) {
        }
    }

    /**
     *
     * @param node
     * @param dir
     */
    function mergSibling( node, dir ) {
        var tmpNode;
        node = node[dir];
        while ( node && domUtils.isFillChar( node ) ) {
            tmpNode = node[dir];
            domUtils.remove( node );
            node = tmpNode;
        }
    }
    Range.prototype = {
        /**
         * 克隆选中的内容到一个fragment里
         * @public
         * @function
         * @name    baidu.editor.dom.Range.cloneContents
         * @return {Fragment}    frag|null 返回选中内容的文本片段或者空
         */
        cloneContents:function () {
            return this.collapsed ? null : execContentsAction( this, 0 );
        },
        /**
         * 删除所选内容
         * @public
         * @function
         * @name    baidu.editor.dom.Range.deleteContents
         * @return {Range}    删除选中内容后的Range
         */
        deleteContents:function () {
            var txt;
            if ( !this.collapsed ) {
                execContentsAction( this, 1 );
            }
            if ( browser.webkit ) {
                txt = this.startContainer;
                if ( txt.nodeType == 3 && !txt.nodeValue.length ) {
                    this.setStartBefore( txt ).collapse( true );
                    domUtils.remove( txt );
                }
            }
            return this;
        },
        /**
         * 取出内容
         * @public
         * @function
         * @name    baidu.editor.dom.Range.extractContents
         * @return {String}    获得Range选中的内容
         */
        extractContents:function () {
            return this.collapsed ? null : execContentsAction( this, 2 );
        },
        /**
         * 设置range的开始位置
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setStart
         * @param    {Node}     node     range开始节点
         * @param    {Number}   offset   偏移量
         * @return   {Range}    返回Range
         */
        setStart:function ( node, offset ) {
            return setEndPoint( true, node, offset, this );
        },
        /**
         * 设置range结束点的位置
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setEnd
         * @param    {Node}     node     range结束节点
         * @param    {Number}   offset   偏移量
         * @return   {Range}    返回Range
         */
        setEnd:function ( node, offset ) {
            return setEndPoint( false, node, offset, this );
        },
        /**
         * 将开始位置设置到node后
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setStartAfter
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setStartAfter:function ( node ) {
            return this.setStart( node.parentNode, domUtils.getNodeIndex( node ) + 1 );
        },
        /**
         * 将开始位置设置到node前
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setStartBefore
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setStartBefore:function ( node ) {
            return this.setStart( node.parentNode, domUtils.getNodeIndex( node ) );
        },
        /**
         * 将结束点位置设置到node后
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setEndAfter
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setEndAfter:function ( node ) {
            return this.setEnd( node.parentNode, domUtils.getNodeIndex( node ) + 1 );
        },
        /**
         * 将开始设置到node的最开始位置  <element>^text</element>
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setEndAfter
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setStartAtFirst:function ( node ) {
            return this.setStart( node, 0 );
        },
        /**
         * 将开始设置到node的最开始位置  <element>text^</element>
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setEndAfter
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setStartAtLast:function ( node ) {
            return this.setStart( node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length );
        },
        /**
         * 将结束设置到node的最开始位置  <element>^text</element>
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setEndAfter
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setEndAtFirst:function ( node ) {
            return this.setEnd( node, 0 );
        },
        /**
         * 将结束设置到node的最开始位置  <element>text^</element>
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setEndAfter
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setEndAtLast:function ( node ) {
            return this.setEnd( node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length );
        },
        /**
         * 将结束点位置设置到node前
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setEndBefore
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        setEndBefore:function ( node ) {
            return this.setEnd( node.parentNode, domUtils.getNodeIndex( node ) );
        },
        /**
         * 选中指定节点
         * @public
         * @function
         * @name    baidu.editor.dom.Range.selectNode
         * @param    {Node}     node     节点
         * @return   {Range}    返回Range
         */
        selectNode:function ( node ) {
            return this.setStartBefore( node ).setEndAfter( node );
        },
        /**
         * 选中node下的所有节点
         * @public
         * @function
         * @name    baidu.editor.dom.Range.selectNodeContents
         * @param {Element} node 要设置的节点
         * @return   {Range}    返回Range
         */
        selectNodeContents:function ( node ) {
            return this.setStart( node, 0 ).setEnd( node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length );
        },

        /**
         * 克隆range
         * @public
         * @function
         * @name    baidu.editor.dom.Range.cloneRange
         * @return {Range} 克隆的range对象
         */
        cloneRange:function () {
            var me = this, range = new Range( me.document );
            return range.setStart( me.startContainer, me.startOffset ).setEnd( me.endContainer, me.endOffset );

        },

        /**
         * 让选区闭合
         * @public
         * @function
         * @name    baidu.editor.dom.Range.collapse
         * @param {Boolean} toStart 是否在选区开始位置闭合选区，true在开始位置闭合，false反之
         * @return {Range}  range对象
         */
        collapse:function ( toStart ) {
            var me = this;
            if ( toStart ) {
                me.endContainer = me.startContainer;
                me.endOffset = me.startOffset;
            }
            else {
                me.startContainer = me.endContainer;
                me.startOffset = me.endOffset;
            }

            me.collapsed = true;
            return me;
        },
        /**
         * 调整range的边界，“缩”到合适的位置
         * @public
         * @function
         * @name    baidu.editor.dom.Range.shrinkBoundary
         * @param    {Boolean}     ignoreEnd      是否考虑前面的元素
         */
        shrinkBoundary:function ( ignoreEnd ) {
            var me = this, child,
                    collapsed = me.collapsed;
            while ( me.startContainer.nodeType == 1 //是element
                    && (child = me.startContainer.childNodes[me.startOffset]) //子节点也是element
                    && child.nodeType == 1 && !domUtils.isBookmarkNode( child )
                    && !dtd.$empty[child.tagName] && !dtd.$nonChild[child.tagName] ) {
                me.setStart( child, 0 );
            }
            if ( collapsed ) {
                return me.collapse( true );
            }
            if ( !ignoreEnd ) {
                while ( me.endContainer.nodeType == 1//是element
                        && me.endOffset > 0 //如果是空元素就退出 endOffset=0那么endOffst-1为负值，childNodes[endOffset]报错
                        && (child = me.endContainer.childNodes[me.endOffset - 1]) //子节点也是element
                        && child.nodeType == 1 && !domUtils.isBookmarkNode( child )
                        && !dtd.$empty[child.tagName] && !dtd.$nonChild[child.tagName] ) {
                    me.setEnd( child, child.childNodes.length );
                }
            }
            return me;
        },
        /**
         * 找到startContainer和endContainer的公共祖先节点
         * @public
         * @function
         * @name    baidu.editor.dom.Range.getCommonAncestor
         * @param {Boolean} includeSelf 是否包含自身
         * @param {Boolean} ignoreTextNode 是否忽略文本节点
         * @return   {Node}   祖先节点
         */
        getCommonAncestor:function ( includeSelf, ignoreTextNode ) {
            var start = this.startContainer,
                    end = this.endContainer;
            if ( start === end ) {
                if ( includeSelf && start.nodeType == 1 && this.startOffset == this.endOffset - 1 ) {
                    return start.childNodes[this.startOffset];
                }
                //只有在上来就相等的情况下才会出现是文本的情况
                return ignoreTextNode && start.nodeType == 3 ? start.parentNode : start;
            }
            return domUtils.getCommonAncestor( start, end );

        },
        /**
         * 切割文本节点，将边界扩大到element
         * @public
         * @function
         * @name    baidu.editor.dom.Range.trimBoundary
         * @param {Boolean}  ignoreEnd    为真就不处理结束边界
         * @return {Range}    range对象
         * @example <b>|xxx</b>
         * startContainer = xxx; startOffset = 0
         * 执行后
         * startContainer = <b>;  startOffset = 0
         * @example <b>xx|x</b>
         * startContainer = xxx;  startOffset = 2
         * 执行后
         * startContainer = <b>; startOffset = 1  因为将xxx切割成2个节点了
         */
        trimBoundary:function ( ignoreEnd ) {
            this.txtToElmBoundary();
            var start = this.startContainer,
                    offset = this.startOffset,
                    collapsed = this.collapsed,
                    end = this.endContainer;
            if ( start.nodeType == 3 ) {
                if ( offset == 0 ) {
                    this.setStartBefore( start );
                } else {
                    if ( offset >= start.nodeValue.length ) {
                        this.setStartAfter( start );
                    } else {
                        var textNode = domUtils.split( start, offset );
                        //跟新结束边界
                        if ( start === end ) {
                            this.setEnd( textNode, this.endOffset - offset );
                        } else if ( start.parentNode === end ) {
                            this.endOffset += 1;
                        }
                        this.setStartBefore( textNode );
                    }
                }
                if ( collapsed ) {
                    return this.collapse( true );
                }
            }
            if ( !ignoreEnd ) {
                offset = this.endOffset;
                end = this.endContainer;
                if ( end.nodeType == 3 ) {
                    if ( offset == 0 ) {
                        this.setEndBefore( end );
                    } else {
                        if ( offset >= end.nodeValue.length ) {
                            this.setEndAfter( end );
                        } else {
                            domUtils.split( end, offset );
                            this.setEndAfter( end );
                        }
                    }
                }
            }
            return this;
        },
        /**
         * 如果选区在文本的边界上，就扩展选区到文本的父节点上
         * @public
         * @function
         * @name    baidu.editor.dom.Range.txtToElmBoundary
         * @return {Range}    range对象
         * @example <b> |xxx</b>
         * startContainer = xxx;  startOffset = 0
         * 执行后
         * startContainer = <b>; startOffset = 0
         * @example <b> xxx| </b>
         * startContainer = xxx; startOffset = 3
         * 执行后
         * startContainer = <b>; startOffset = 1
         */
        txtToElmBoundary:function () {
            function adjust( r, c ) {
                var container = r[c + 'Container'],
                        offset = r[c + 'Offset'];
                if ( container.nodeType == 3 ) {
                    if ( !offset ) {
                        r['set' + c.replace( /(\w)/, function ( a ) {
                            return a.toUpperCase();
                        } ) + 'Before']( container );
                    } else if ( offset >= container.nodeValue.length ) {
                        r['set' + c.replace( /(\w)/, function ( a ) {
                            return a.toUpperCase();
                        } ) + 'After' ]( container );
                    }
                }
            }

            if ( !this.collapsed ) {
                adjust( this, 'start' );
                adjust( this, 'end' );
            }
            return this;
        },

        /**
         * 在当前选区的开始位置前插入一个节点或者fragment
         * @public
         * @function
         * @name    baidu.editor.dom.Range.insertNode
         * @param {Node/DocumentFragment}    node    要插入的节点或fragment
         * @return  {Range}    返回range对象
         */
        insertNode:function ( node ) {
            var first = node, length = 1;
            if ( node.nodeType == 11 ) {
                first = node.firstChild;
                length = node.childNodes.length;
            }
            this.trimBoundary( true );
            var start = this.startContainer,
                    offset = this.startOffset;
            var nextNode = start.childNodes[ offset ];
            if ( nextNode ) {
                start.insertBefore( node, nextNode );
            } else {
                start.appendChild( node );
            }
            if ( first.parentNode === this.endContainer ) {
                this.endOffset = this.endOffset + length;
            }
            return this.setStartBefore( first );
        },
        /**
         * 设置光标位置
         * @public
         * @function
         * @name    baidu.editor.dom.Range.setCursor
         * @param {Boolean}   toEnd   true为闭合到选区的结束位置后，false为闭合到选区的开始位置前
         * @return  {Range}    返回range对象
         */
        setCursor:function ( toEnd, notFillData ) {
            return this.collapse( !toEnd ).select( notFillData );
        },
        /**
         * 创建书签
         * @public
         * @function
         * @name    baidu.editor.dom.Range.createBookmark
         * @param {Boolean}   serialize    true：为true则返回对象中用id来分别表示书签的开始和结束节点
         * @param  {Boolean}   same        true：是否采用唯一的id，false将会为每一个标签产生一个唯一的id
         * @returns {Object} bookmark对象
         */
        createBookmark:function ( serialize, same ) {
            var endNode,
                    startNode = this.document.createElement( 'span' );
            startNode.style.cssText = 'display:none;line-height:0px;';
            startNode.appendChild( this.document.createTextNode( '\uFEFF' ) );
            startNode.id = '_baidu_bookmark_start_' + (same ? '' : guid++);

            if ( !this.collapsed ) {
                endNode = startNode.cloneNode( true );
                endNode.id = '_baidu_bookmark_end_' + (same ? '' : guid++);
            }
            this.insertNode( startNode );
            if ( endNode ) {
                this.collapse( false ).insertNode( endNode );
                this.setEndBefore( endNode );
            }
            this.setStartAfter( startNode );
            return {
                start:serialize ? startNode.id : startNode,
                end:endNode ? serialize ? endNode.id : endNode : null,
                id:serialize
            }
        },
        /**
         *  移动边界到书签，并删除书签
         *  @public
         *  @function
         *  @name    baidu.editor.dom.Range.moveToBookmark
         *  @params {Object} bookmark对象
         *  @returns {Range}    Range对象
         */
        moveToBookmark:function ( bookmark ) {
            var start = bookmark.id ? this.document.getElementById( bookmark.start ) : bookmark.start,
                    end = bookmark.end && bookmark.id ? this.document.getElementById( bookmark.end ) : bookmark.end;
            this.setStartBefore( start );
            domUtils.remove( start );
            if ( end ) {
                this.setEndBefore( end );
                domUtils.remove( end );
            } else {
                this.collapse( true );
            }
            return this;
        },
        /**
         * 获取光标相对于文档的定位
         * @public
         * @function
         * @name    baidu.editor.dom.Range.getCursorPosition
         * @param {Boolean}   start    true：是否返回 range 开始处的位置
         * @param {Boolean}   end      true：是否返回 range 结束处的位置，range.collapsed 则与 start 相同
         * @returns {Object} 位置对象， result.start.x/y result.end.x/y 获取开始，结束的位置
         */
        getCursorPosition : function( start, end ) {
            start = start !== false
            end = end !== false
            var startNode = this.document.createElement( 'span' ),
                result = {},
                endNode, bk;

            startNode.appendChild( this.document.createTextNode( browser.ie ? '&nbsp;' : '\u200B' ));

            this.insertNode( startNode );
            result.start = domUtils.getXY( startNode );

            if ( end ) {
                if ( !this.collapsed ) {
                    endNode = startNode.cloneNode( true );
                    bk = this.createBookmark()
                    this.collapse( false ).insertNode( endNode );
                    result.end = domUtils.getXY( endNode );
                    domUtils.remove( endNode );
                    this.moveToBookmark( bk );
                } else {
                    result.end = result.start
                }
            }

            if ( !start ) delete result.start
            domUtils.remove( startNode );

            return result
        },
        /**
         * 调整边界到一个block元素上，或者移动到最大的位置
         * @public
         * @function
         * @name    baidu.editor.dom.Range.enlarge
         * @params {Boolean}  toBlock    扩展到block元素
         * @params {Function} stopFn      停止函数，若返回true，则不再扩展
         * @return   {Range}    Range对象
         */
        enlarge:function ( toBlock, stopFn ) {
            var isBody = domUtils.isBody,
                    pre, node, tmp = this.document.createTextNode( '' );
            if ( toBlock ) {
                node = this.startContainer;
                if ( node.nodeType == 1 ) {
                    if ( node.childNodes[this.startOffset] ) {
                        pre = node = node.childNodes[this.startOffset]
                    } else {
                        node.appendChild( tmp );
                        pre = node = tmp;
                    }
                } else {
                    pre = node;
                }
                while ( 1 ) {
                    if ( domUtils.isBlockElm( node ) ) {
                        node = pre;
                        while ( (pre = node.previousSibling) && !domUtils.isBlockElm( pre ) ) {
                            node = pre;
                        }
                        this.setStartBefore( node );
                        break;
                    }
                    pre = node;
                    node = node.parentNode;
                }
                node = this.endContainer;
                if ( node.nodeType == 1 ) {
                    if ( pre = node.childNodes[this.endOffset] ) {
                        node.insertBefore( tmp, pre );
                    } else {
                        node.appendChild( tmp );
                    }
                    pre = node = tmp;
                } else {
                    pre = node;
                }
                while ( 1 ) {
                    if ( domUtils.isBlockElm( node ) ) {
                        node = pre;
                        while ( (pre = node.nextSibling) && !domUtils.isBlockElm( pre ) ) {
                            node = pre;
                        }
                        this.setEndAfter( node );
                        break;
                    }
                    pre = node;
                    node = node.parentNode;
                }
                if ( tmp.parentNode === this.endContainer ) {
                    this.endOffset--;
                }
                domUtils.remove( tmp );
            }

            // 扩展边界到最大
            if ( !this.collapsed ) {
                while ( this.startOffset == 0 ) {
                    if ( stopFn && stopFn( this.startContainer ) ) {
                        break;
                    }
                    if ( isBody( this.startContainer ) ) {
                        break;
                    }
                    this.setStartBefore( this.startContainer );
                }
                while ( this.endOffset == (this.endContainer.nodeType == 1 ? this.endContainer.childNodes.length : this.endContainer.nodeValue.length) ) {
                    if ( stopFn && stopFn( this.endContainer ) ) {
                        break;
                    }
                    if ( isBody( this.endContainer ) ) {
                        break;
                    }
                    this.setEndAfter( this.endContainer );
                }
            }
            return this;
        },
        /**
         * 调整边界
         * @public
         * @function
         * @name    baidu.editor.dom.Range.adjustmentBoundary
         * @return   {Range}    Range对象
         * @example
         * <b>xx[</b>xxxxx] ==> <b>xx</b>[xxxxx]
         * <b>[xx</b><i>]xxx</i> ==> <b>[xx</b>]<i>xxx</i>
         *
         */
        adjustmentBoundary:function () {
            if ( !this.collapsed ) {
                while ( !domUtils.isBody( this.startContainer ) &&
                        this.startOffset == this.startContainer[this.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length
                        ) {
                    this.setStartAfter( this.startContainer );
                }
                while ( !domUtils.isBody( this.endContainer ) && !this.endOffset ) {
                    this.setEndBefore( this.endContainer );
                }
            }
            return this;
        },
        /**
         * 给选区中的内容加上inline样式
         * @public
         * @function
         * @name    baidu.editor.dom.Range.applyInlineStyle
         * @param {String} tagName 标签名称
         * @param {Object} attrObj 属性
         * @return   {Range}    Range对象
         */
        applyInlineStyle:function ( tagName, attrs, list ) {
            if ( this.collapsed )return this;
            this.trimBoundary().enlarge( false,
                    function ( node ) {
                        return node.nodeType == 1 && domUtils.isBlockElm( node )
                    } ).adjustmentBoundary();
            var bookmark = this.createBookmark(),
                    end = bookmark.end,
                    filterFn = function ( node ) {
                        return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !domUtils.isWhitespace( node );
                    },
                    current = domUtils.getNextDomNode( bookmark.start, false, filterFn ),
                    node,
                    pre,
                    range = this.cloneRange();
            while ( current && (domUtils.getPosition( current, end ) & domUtils.POSITION_PRECEDING) ) {
                if ( current.nodeType == 3 || dtd[tagName][current.tagName] ) {
                    range.setStartBefore( current );
                    node = current;
                    while ( node && (node.nodeType == 3 || dtd[tagName][node.tagName]) && node !== end ) {
                        pre = node;
                        node = domUtils.getNextDomNode( node, node.nodeType == 1, null, function ( parent ) {
                            return dtd[tagName][parent.tagName];
                        } );
                    }
                    var frag = range.setEndAfter( pre ).extractContents(), elm;
                    if ( list && list.length > 0 ) {
                        var level, top;
                        top = level = list[0].cloneNode( false );
                        for ( var i = 1, ci; ci = list[i++]; ) {
                            level.appendChild( ci.cloneNode( false ) );
                            level = level.firstChild;
                        }
                        elm = level;
                    } else {
                        elm = range.document.createElement( tagName );
                    }
                    if ( attrs ) {
                        domUtils.setAttributes( elm, attrs );
                    }
                    elm.appendChild( frag );
                    range.insertNode( list ? top : elm );
                    //处理下滑线在a上的情况
                    var aNode;
                    if ( tagName == 'span' && attrs.style && /text\-decoration/.test( attrs.style ) && (aNode = domUtils.findParentByTagName( elm, 'a', true )) ) {
                        domUtils.setAttributes( aNode, attrs );
                        domUtils.remove( elm, true );
                        elm = aNode;
                    } else {
                        domUtils.mergSibling( elm );
                        domUtils.clearEmptySibling( elm );
                    }
                    //去除子节点相同的
                    domUtils.mergChild( elm, tagName, attrs );
                    current = domUtils.getNextDomNode( elm, false, filterFn );
                    domUtils.mergToParent( elm );
                    if ( node === end ) {
                        break;
                    }
                } else {
                    current = domUtils.getNextDomNode( current, true, filterFn );
                }
            }
            return this.moveToBookmark( bookmark );
        },
        /**
         * 去掉inline样式
         * @public
         * @function
         * @name    baidu.editor.dom.Range.removeInlineStyle
         * @param  {String/Array}    tagName    要去掉的标签名
         * @return   {Range}    Range对象
         */
        removeInlineStyle:function ( tagName ) {
            if ( this.collapsed )return this;
            tagName = utils.isArray( tagName ) ? tagName : [tagName];
            this.shrinkBoundary().adjustmentBoundary();
            var start = this.startContainer, end = this.endContainer;
            while ( 1 ) {
                if ( start.nodeType == 1 ) {
                    if ( utils.indexOf( tagName, start.tagName.toLowerCase() ) > -1 ) {
                        break;
                    }
                    if ( start.tagName.toLowerCase() == 'body' ) {
                        start = null;
                        break;
                    }
                }
                start = start.parentNode;
            }
            while ( 1 ) {
                if ( end.nodeType == 1 ) {
                    if ( utils.indexOf( tagName, end.tagName.toLowerCase() ) > -1 ) {
                        break;
                    }
                    if ( end.tagName.toLowerCase() == 'body' ) {
                        end = null;
                        break;
                    }
                }
                end = end.parentNode;
            }
            var bookmark = this.createBookmark(),
                    frag,
                    tmpRange;
            if ( start ) {
                tmpRange = this.cloneRange().setEndBefore( bookmark.start ).setStartBefore( start );
                frag = tmpRange.extractContents();
                tmpRange.insertNode( frag );
                domUtils.clearEmptySibling( start, true );
                start.parentNode.insertBefore( bookmark.start, start );
            }
            if ( end ) {
                tmpRange = this.cloneRange().setStartAfter( bookmark.end ).setEndAfter( end );
                frag = tmpRange.extractContents();
                tmpRange.insertNode( frag );
                domUtils.clearEmptySibling( end, false, true );
                end.parentNode.insertBefore( bookmark.end, end.nextSibling );
            }
            var current = domUtils.getNextDomNode( bookmark.start, false, function ( node ) {
                return node.nodeType == 1;
            } ), next;
            while ( current && current !== bookmark.end ) {
                next = domUtils.getNextDomNode( current, true, function ( node ) {
                    return node.nodeType == 1;
                } );
                if ( utils.indexOf( tagName, current.tagName.toLowerCase() ) > -1 ) {
                    domUtils.remove( current, true );
                }
                current = next;
            }
            return this.moveToBookmark( bookmark );
        },
        /**
         * 得到一个自闭合的节点
         * @public
         * @function
         * @name    baidu.editor.dom.Range.getClosedNode
         * @return  {Node}    闭合节点
         * @example
         * <img />,<br />
         */
        getClosedNode:function () {
            var node;
            if ( !this.collapsed ) {
                var range = this.cloneRange().adjustmentBoundary().shrinkBoundary();
                if ( range.startContainer.nodeType == 1 && range.startContainer === range.endContainer && range.endOffset - range.startOffset == 1 ) {
                    var child = range.startContainer.childNodes[range.startOffset];
                    if ( child && child.nodeType == 1 && (dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName]) ) {
                        node = child;
                    }
                }
            }
            return node;
        },
        /**
         * 根据range选中元素
         * @public
         * @function
         * @name    baidu.editor.dom.Range.select
         * @param  {Boolean}    notInsertFillData        true为不加占位符
         */
        select:browser.ie ? function ( notInsertFillData, textRange ) {
            var nativeRange;
            if ( !this.collapsed )
                this.shrinkBoundary();
            var node = this.getClosedNode();
            if ( node && !textRange ) {
                try {
                    nativeRange = this.document.body.createControlRange();
                    nativeRange.addElement( node );
                    nativeRange.select();
                } catch ( e ) {}
                return this;
            }
            var bookmark = this.createBookmark(),
                    start = bookmark.start,
                    end;
            nativeRange = this.document.body.createTextRange();
            nativeRange.moveToElementText( start );
            nativeRange.moveStart( 'character', 1 );
            if ( !this.collapsed ) {
                var nativeRangeEnd = this.document.body.createTextRange();
                end = bookmark.end;
                nativeRangeEnd.moveToElementText( end );
                nativeRange.setEndPoint( 'EndToEnd', nativeRangeEnd );
            } else {
                if ( !notInsertFillData && this.startContainer.nodeType != 3 ) {
                    //使用<span>|x<span>固定住光标
                    var tmpText = this.document.createTextNode( fillChar ),
                            tmp = this.document.createElement( 'span' );
                    tmp.appendChild( this.document.createTextNode( fillChar ) );
                    start.parentNode.insertBefore( tmp, start );
                    start.parentNode.insertBefore( tmpText, start );
                    //当点b,i,u时，不能清除i上边的b
                    removeFillData( this.document, tmpText );
                    fillData = tmpText;
                    mergSibling( tmp, 'previousSibling' );
                    mergSibling( start, 'nextSibling' );
                    nativeRange.moveStart( 'character', -1 );
                    nativeRange.collapse( true );
                }
            }
            this.moveToBookmark( bookmark );
            tmp && domUtils.remove( tmp );
            //IE在隐藏状态下不支持range操作，catch一下
            try{
                nativeRange.select();
            }catch(e){}
            return this;
        } : function ( notInsertFillData ) {
            var win = domUtils.getWindow( this.document ),
                    sel = win.getSelection(),
                    txtNode;
            //FF下关闭自动长高时滚动条在关闭dialog时会跳
            browser.gecko && browser.version < 140000 ? this.document.body.focus() : win.focus();
            if ( sel ) {
                sel.removeAllRanges();
                // trace:870 chrome/safari后边是br对于闭合得range不能定位 所以去掉了判断
                // this.startContainer.nodeType != 3 &&! ((child = this.startContainer.childNodes[this.startOffset]) && child.nodeType == 1 && child.tagName == 'BR'
                if ( this.collapsed ) {
                    //opear如果没有节点接着，原生的不能够定位,不能在body的第一级插入空白节点
                    if ( notInsertFillData && browser.opera && !domUtils.isBody( this.startContainer ) && this.startContainer.nodeType == 1 ) {
                        var tmp = this.document.createTextNode( '' );
                        this.insertNode( tmp ).setStart( tmp, 0 ).collapse( true );
                    }
                    if ( !notInsertFillData ) {
                        txtNode = this.document.createTextNode( fillChar );
                        //跟着前边走
                        this.insertNode( txtNode );
                        removeFillData( this.document, txtNode );
                        mergSibling( txtNode, 'previousSibling' );
                        mergSibling( txtNode, 'nextSibling' );
                        fillData = txtNode;
                        this.setStart( txtNode, browser.webkit ? 1 : 0 ).collapse( true );
                    }
                }
                var nativeRange = this.document.createRange();
                nativeRange.setStart( this.startContainer, this.startOffset );
                nativeRange.setEnd( this.endContainer, this.endOffset );
                sel.addRange( nativeRange );
            }
            return this;
        },
        /**
         * 滚动到可视范围
         * @public
         * @function
         * @name    baidu.editor.dom.Range.scrollToView
         * @param    {Boolean}   win       操作的window对象，若为空，则使用当前的window对象
         * @param    {Number}   offset     滚动的偏移量
         * @return   {Range}    Range对象
         */
        scrollToView:function ( win, offset ) {
            win = win ? window : domUtils.getWindow( this.document );
            var span = this.document.createElement( 'span' );
            //trace:717
            span.innerHTML = '&nbsp;';
            var tmpRange = this.cloneRange();
            tmpRange.insertNode( span );
            domUtils.scrollToView( span, win, offset );
            domUtils.remove( span );
            return this;
        }
    };
})();
///import editor.js
///import core/browser.js
///import core/dom/dom.js
///import core/dom/dtd.js
///import core/dom/domUtils.js
///import core/dom/Range.js
/**
 * @class baidu.editor.dom.Selection    Selection类
 */
(function () {

    function getBoundaryInformation( range, start ) {
        var getIndex = domUtils.getNodeIndex;
        range = range.duplicate();
        range.collapse( start );
        var parent = range.parentElement();
        //如果节点里没有子节点，直接退出
        if ( !parent.hasChildNodes() ) {
            return  {container:parent, offset:0};
        }
        var siblings = parent.children,
                child,
                testRange = range.duplicate(),
                startIndex = 0, endIndex = siblings.length - 1, index = -1,
                distance;
        while ( startIndex <= endIndex ) {
            index = Math.floor( (startIndex + endIndex) / 2 );
            child = siblings[index];
            testRange.moveToElementText( child );
            var position = testRange.compareEndPoints( 'StartToStart', range );
            if ( position > 0 ) {
                endIndex = index - 1;
            } else if ( position < 0 ) {
                startIndex = index + 1;
            } else {
                //trace:1043
                return  {container:parent, offset:getIndex( child )};
            }
        }
        if ( index == -1 ) {
            testRange.moveToElementText( parent );
            testRange.setEndPoint( 'StartToStart', range );
            distance = testRange.text.replace( /(\r\n|\r)/g, '\n' ).length;
            siblings = parent.childNodes;
            if ( !distance ) {
                child = siblings[siblings.length - 1];
                return  {container:child, offset:child.nodeValue.length};
            }

            var i = siblings.length;
            while ( distance > 0 ){
                distance -= siblings[ --i ].nodeValue.length;
            }
            return {container:siblings[i], offset:-distance};
        }
        testRange.collapse( position > 0 );
        testRange.setEndPoint( position > 0 ? 'StartToStart' : 'EndToStart', range );
        distance = testRange.text.replace( /(\r\n|\r)/g, ie && browser.version == 9 ? '' : '\n' ).length;
        if ( !distance ) {
            return  dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName] ?
                {container:parent, offset:getIndex( child ) + (position > 0 ? 0 : 1)} :
                {container:child, offset:position > 0 ? 0 : child.childNodes.length}
        }
        while ( distance > 0 ) {
            try {
                var pre = child;
                child = child[position > 0 ? 'previousSibling' : 'nextSibling'];
                distance -= child.nodeValue.length;
            } catch ( e ) {
                return {container:parent, offset:getIndex( pre )};
            }
        }
        return  {container:child, offset:position > 0 ? -distance : child.nodeValue.length + distance}
    }

    /**
     * 将ieRange转换为Range对象
     * @param {Range}   ieRange    ieRange对象
     * @param {Range}   range      Range对象
     * @return  {Range}  range       返回转换后的Range对象
     */
    function transformIERangeToRange( ieRange, range ) {
        if ( ieRange.item ) {
            range.selectNode( ieRange.item( 0 ) );
        } else {
            var bi = getBoundaryInformation( ieRange, true );
            range.setStart( bi.container, bi.offset );
            if ( ieRange.compareEndPoints( 'StartToEnd', ieRange ) != 0 ) {
                bi = getBoundaryInformation( ieRange, false );
                range.setEnd( bi.container, bi.offset );
            }
        }
        return range;
    }

    /**
     * 获得ieRange
     * @param {Selection} sel    Selection对象
     * @return {ieRange}    得到ieRange
     */
    function _getIERange( sel ) {
        var ieRange;
        //ie下有可能报错
        try {
            ieRange = sel.getNative().createRange();
        } catch ( e ) {
            return null;
        }
        var el = ieRange.item ? ieRange.item( 0 ) : ieRange.parentElement();
        if ( ( el.ownerDocument || el ) === sel.document ) {
            return ieRange;
        }
        return null;
    }

    var Selection = dom.Selection = function ( doc ) {
        var me = this, iframe;
        me.document = doc;
        if ( ie ) {
            iframe = domUtils.getWindow( doc ).frameElement;
            domUtils.on( iframe, 'beforedeactivate', function () {
                me._bakIERange = me.getIERange();
            } );
            domUtils.on( iframe, 'activate', function () {
                try {
                    if ( !_getIERange( me ) && me._bakIERange ) {
                        me._bakIERange.select();
                    }
                } catch ( ex ) {
                }
                me._bakIERange = null;
            } );
        }
        iframe = doc = null;
    };

    Selection.prototype = {
        /**
         * 获取原生seleciton对象
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getNative
         * @return {Selection}    获得selection对象
         */
        getNative:function () {
            var doc = this.document;
            try {
                return !doc ? null : ie ? doc.selection : domUtils.getWindow( doc ).getSelection();
            } catch ( e ) {
                return null;
            }
        },
        /**
         * 获得ieRange
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getIERange
         * @return {ieRange}    返回ie原生的Range
         */
        getIERange:function () {
            var ieRange = _getIERange( this );
            if ( !ieRange ) {
                if ( this._bakIERange ) {
                    return this._bakIERange;
                }
            }
            return ieRange;
        },

        /**
         * 缓存当前选区的range和选区的开始节点
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.cache
         */
        cache:function () {
            this.clear();
            this._cachedRange = this.getRange();
            this._cachedStartElement = this.getStart();
            this._cachedStartElementPath = this.getStartElementPath();
        },

        getStartElementPath:function () {
            if ( this._cachedStartElementPath ) {
                return this._cachedStartElementPath;
            }
            var start = this.getStart();
            if ( start ) {
                return domUtils.findParents( start, true, null, true )
            }
            return [];
        },
        /**
         * 清空缓存
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.clear
         */
        clear:function () {
            this._cachedStartElementPath = this._cachedRange = this._cachedStartElement = null;
        },
        /**
         * 编辑器是否得到了选区
         */
        isFocus:function () {
            try {
                return browser.ie && _getIERange( this ) || !browser.ie && this.getNative().rangeCount ? true : false;
            } catch ( e ) {
                return false;
            }

        },
        /**
         * 获取选区对应的Range
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getRange
         * @returns {baidu.editor.dom.Range}    得到Range对象
         */
        getRange:function () {
            var me = this;
            function optimze( range ) {
                var child = me.document.body.firstChild,
                        collapsed = range.collapsed;
                while ( child && child.firstChild ) {
                    range.setStart( child, 0 );
                    child = child.firstChild;
                }
                if ( !range.startContainer ) {
                    range.setStart( me.document.body, 0 )
                }
                if ( collapsed ) {
                    range.collapse( true );
                }
            }

            if ( me._cachedRange != null ) {
                return this._cachedRange;
            }
            var range = new baidu.editor.dom.Range( me.document );
            if ( ie ) {
                var nativeRange = me.getIERange();
                if ( nativeRange ) {
                    transformIERangeToRange( nativeRange, range );
                } else {
                    optimze( range );
                }
            } else {
                var sel = me.getNative();
                if ( sel && sel.rangeCount ) {
                    var firstRange = sel.getRangeAt( 0 );
                    var lastRange = sel.getRangeAt( sel.rangeCount - 1 );
                    range.setStart( firstRange.startContainer, firstRange.startOffset ).setEnd( lastRange.endContainer, lastRange.endOffset );
                    if ( range.collapsed && domUtils.isBody( range.startContainer ) && !range.startOffset ) {
                        optimze( range );
                    }
                } else {
                    //trace:1734 有可能已经不在dom树上了，标识的节点
                    if ( this._bakRange && domUtils.inDoc( this._bakRange.startContainer, this.document ) ){
                        return this._bakRange;
                    }
                    optimze( range );
                }
            }
            return this._bakRange = range;
        },

        /**
         * 获取开始元素，用于状态反射
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getStart
         * @return {Element}     获得开始元素
         */
        getStart:function () {
            if ( this._cachedStartElement ) {
                return this._cachedStartElement;
            }
            var range = ie ? this.getIERange() : this.getRange(),
                    tmpRange,
                    start, tmp, parent;
            if ( ie ) {
                if ( !range ) {
                    //todo 给第一个值可能会有问题
                    return this.document.body.firstChild;
                }
                //control元素
                if ( range.item ){
                    return range.item( 0 );
                }
                tmpRange = range.duplicate();
                //修正ie下<b>x</b>[xx] 闭合后 <b>x|</b>xx
                tmpRange.text.length > 0 && tmpRange.moveStart( 'character', 1 );
                tmpRange.collapse( 1 );
                start = tmpRange.parentElement();
                parent = tmp = range.parentElement();
                while ( tmp = tmp.parentNode ) {
                    if ( tmp == start ) {
                        start = parent;
                        break;
                    }
                }
            } else {
                range.shrinkBoundary();
                start = range.startContainer;
                if ( start.nodeType == 1 && start.hasChildNodes() ){
                    start = start.childNodes[Math.min( start.childNodes.length - 1, range.startOffset )];
                }
                if ( start.nodeType == 3 ){
                    return start.parentNode;
                }
            }
            return start;
        },
        /**
         * 得到选区中的文本
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getText
         * @return  {String}    选区中包含的文本
         */
        getText:function () {
            var nativeSel, nativeRange;
            if ( this.isFocus() && (nativeSel = this.getNative()) ) {
                nativeRange = browser.ie ? nativeSel.createRange() : nativeSel.getRangeAt( 0 );
                return browser.ie ? nativeRange.text : nativeRange.toString();
            }
            return '';
        }
    };
})();///import editor.js
///import core/utils.js
///import core/EventBase.js
///import core/browser.js
///import core/dom/dom.js
///import core/dom/domUtils.js
///import core/dom/Selection.js
///import core/dom/dtd.js
(function () {
    var uid = 0,
            _selectionChangeTimer;

    function replaceSrc( div ) {
        var imgs = div.getElementsByTagName( "img" ),
                orgSrc;
        for ( var i = 0, img; img = imgs[i++]; ) {
            if ( orgSrc = img.getAttribute( "orgSrc" ) ) {
                img.src = orgSrc;
                img.removeAttribute( "orgSrc" );
            }
        }
        var as = div.getElementsByTagName( "a" );
        for ( var i = 0, ai; ai = as[i++]; i++ ) {
            if ( ai.getAttribute( 'data_ue_src' ) ) {
                ai.setAttribute( 'href', ai.getAttribute( 'data_ue_src' ) )
            }
        }
    }
    function setValue( form, editor ) {
        var textarea;
        if ( editor.textarea ) {
            if ( utils.isString( editor.textarea ) ) {
                for ( var i = 0, ti, tis = domUtils.getElementsByTagName( form, 'textarea' ); ti = tis[i++]; ) {
                    if ( ti.id == 'ueditor_textarea_' + editor.options.textarea ) {
                        textarea = ti;
                        break;
                    }
                }
            } else {
                textarea = editor.textarea;
            }
        }
        if ( !textarea ) {
            form.appendChild( textarea = domUtils.creElm( document, 'textarea', {
                'name':editor.options.textarea,
                'id':'ueditor_textarea_' + editor.options.textarea,
                'style':"display:none"
            } ) );
        }
        textarea.value = editor.options.allHtmlEnabled ? editor.getAllHtml() : editor.getContent(null,null,true)
    }

    /**
     * 编辑器类
     * @public
     * @class
     * @extends baidu.editor.EventBase
     * @name baidu.editor.Editor
     * @param {Object} options
     */
    var Editor = UE.Editor = function ( options ) {
        var me = this;
        me.uid = uid++;
        EventBase.call( me );
        me.commands = {};
        me.options = utils.extend( options || {},UEDITOR_CONFIG, true );
        //设置默认的常用属性
        me.setOpt( {
            isShow:true,
            initialContent:'欢迎使用ueditor!',
            autoClearinitialContent:false,
            iframeCssUrl:me.options.UEDITOR_HOME_URL + '/themes/default/iframe.css',
            textarea:'editorValue',
            focus:false,
            minFrameHeight:320,
            autoClearEmptyNode:true,
            fullscreen:false,
            readonly:false,
            zIndex:999,
            imagePopup:true,
            enterTag:'p',
            pageBreakTag:'_baidu_page_break_tag_',
            customDomain:false,
            allHtmlEnabled:true
        } );

        //初始化插件
        for ( var pi in UE.plugins ) {
            UE.plugins[pi].call( me )
        }
        me.langIsReady = true;

        me.fireEvent( "langReady" );
        UE.instants['ueditorInstant' + me.uid] = me;
    };
    Editor.prototype = /**@lends baidu.editor.Editor.prototype*/{
        /**
         * 当编辑器ready后执行传入的fn,如果编辑器已经ready好了，就马上执行fn，fn的中的this是编辑器实例
         * @param {function} fn 需要执行的函数
         */
        ready:function ( fn ) {
            var me = this;
            if ( fn )
                me.isReady ? fn.apply( me ) : me.addListener( 'ready', fn );
        },
        setOpt:function ( key, val ) {
            var obj = {};
            if ( utils.isString( key ) ) {
                obj[key] = val
            } else {
                obj = key;
            }
            utils.extend( this.options, obj, true );
        },
        destroy:function () {
            var me = this;
            me.fireEvent( 'destroy' );
            me.container.innerHTML = '';
            domUtils.remove( me.container );
            //trace:2004
            for ( var p in me ) {
                if ( me.hasOwnProperty( p ) ) {
                    delete this[p];
                }
            }
        },
        /**
         * 渲染编辑器的DOM到指定容器，必须且只能调用一次
         * @public
         * @function
         * @param {Element|String} container
         */
        render:function ( container ) {
            var me = this, options = me.options;
            if ( container.constructor === String ) {
                container = document.getElementById( container );
            }
            if ( container ) {
                var useBodyAsViewport = ie && browser.version < 9,
                        html = ( ie && browser.version < 9 ? '' : '<!DOCTYPE html>') +
                                '<html xmlns=\'http://www.w3.org/1999/xhtml\'' + (!useBodyAsViewport ? ' class=\'view\'' : '') + '><head>' +
                                ( options.iframeCssUrl ? '<link rel=\'stylesheet\' type=\'text/css\' href=\'' + utils.unhtml( options.iframeCssUrl ) + '\'/>' : '' ) +
                                '<style type=\'text/css\'>' +
                            //这些默认属性不能够让用户改变
                            //选中的td上的样式
                                '.selectTdClass{background-color:#3399FF !important;}' +
                                'table.noBorderTable td{border:1px dashed #ddd !important}' +
                            //插入的表格的默认样式
                                'table{clear:both;margin-bottom:10px;border-collapse:collapse;word-break:break-all;}' +
                            //分页符的样式
                                '.pagebreak{display:block;clear:both !important;cursor:default !important;width: 100% !important;margin:0;}' +
                            //锚点的样式,注意这里背景图的路径
                                '.anchorclass{background: url(\'' + me.options.UEDITOR_HOME_URL + 'themes/default/images/anchor.gif\') no-repeat scroll left center transparent;border: 1px dotted #0000FF;cursor: auto;display: inline-block;height: 16px;width: 15px;}' +
                            //设置四周的留边
                                '.view{padding:0;word-wrap:break-word;cursor:text;height:100%;}\n' +
                            //设置默认字体和字号
                                'body{margin:8px;font-family:\'宋体\';font-size:16px;}' +
                            //针对li的处理
                                'li{clear:both}' +
                            //设置段落间距
                                'p{margin:5px 0;}'
                                + ( options.initialStyle || '' ) +
                                'body, input, label, select, option, textarea, button, fieldset, legend{font: 14px "Helvetica Neue",Helvetica,Arial,sans-serif;}'+
                                'body{line-height:1.5}' +
                                '</style></head><body' + (useBodyAsViewport ? ' class=\'view\'' : '') + '></body>';

                if ( options.customDomain && document.domain != location.hostname ) {
                    html += '<script>window.parent.UE.instants[\'ueditorInstant' + me.uid + '\']._setup(document);</script></html>';
                    container.appendChild( domUtils.creElm( document, 'iframe', {
                        id:'baidu_editor_' + me.uid,
                        width:"100%",
                        height:"100%",
                        frameborder:"0",
                        src:'javascript:void(function(){document.open();document.domain="' + document.domain + '";' +
                                'document.write("' + html + '");document.close();}())'
                    } ) );
                } else {
                    container.innerHTML = '<iframe id="' + 'baidu_editor_' + this.uid + '"' + 'width="100%" height="100%" scroll="no" frameborder="0" ></iframe>';
                    var doc = container.firstChild.contentWindow.document;
                    !browser.webkit && doc.open();
                    doc.write( html + '</html>' );
                    !browser.webkit && doc.close();
                    me._setup( doc );
                }
                container.style.overflow = 'hidden';
            }
        },
        _setup:function ( doc ) {
            var me = this,
                    options = me.options;
            if ( ie ) {
                doc.body.disabled = true;
                doc.body.contentEditable = true;
                doc.body.disabled = false;
            } else {
                doc.body.contentEditable = true;
                doc.body.spellcheck = false;
            }
            me.document = doc;
            me.window = doc.defaultView || doc.parentWindow;
            me.iframe = me.window.frameElement;
            me.body = doc.body;
            //设置编辑器最小高度
            me.setHeight( options.minFrameHeight );
            me.body.style.height = 'auto';
            me.selection = new dom.Selection( doc );
            //gecko初始化就能得到range,无法判断isFocus了
            var geckoSel;
            if ( browser.gecko && (geckoSel = this.selection.getNative()) ) {
                geckoSel.removeAllRanges();
            }
            this._initEvents();
            if ( options.initialContent ) {
                if ( options.autoClearinitialContent ) {
                    var oldExecCommand = me.execCommand;
                    me.execCommand = function () {
                        me.fireEvent( 'firstBeforeExecCommand' );
                        oldExecCommand.apply( me, arguments );
                    };
                    this.setDefaultContent( options.initialContent );
                } else
                    this.setContent( options.initialContent, true );
            }
            //为form提交提供一个隐藏的textarea
            for ( var form = this.iframe.parentNode; !domUtils.isBody( form ); form = form.parentNode ) {
                if ( form.tagName == 'FORM' ) {
                    domUtils.on( form, 'submit', function () {
                        setValue( this, me );
                    } );
                    break;
                }
            }
            //编辑器不能为空内容
            if ( domUtils.isEmptyNode( me.body ) ) {
                me.body.innerHTML = '<p>' + (browser.ie ? '' : '<br/>') + '</p>';
            }
            //如果要求focus, 就把光标定位到内容开始
            if ( options.focus ) {
                setTimeout( function () {
                    me.focus();
                    //如果自动清除开着，就不需要做selectionchange;
                    !me.options.autoClearinitialContent && me._selectionChange();
                } );
            }
            if ( !me.container ) {
                me.container = this.iframe.parentNode;
            }
            if ( options.fullscreen && me.ui ) {
                me.ui.setFullScreen( true );
            }
            me.isReady = 1;
            me.fireEvent( 'ready' );
            if ( !browser.ie ) {
                domUtils.on( me.window, ['blur', 'focus'], function ( e ) {
                    //chrome下会出现alt+tab切换时，导致选区位置不对
                    if ( e.type == 'blur' ) {
                        me._bakRange = me.selection.getRange();
                        try{
                            me.selection.getNative().removeAllRanges();
                        }catch(e){}

                    } else {
                        try {
                            me._bakRange && me._bakRange.select();
                        } catch ( e ) {
                        }
                    }
                } );
            }
            //trace:1518 ff3.6body不够寛，会导致点击空白处无法获得焦点
            if ( browser.gecko && browser.version <= 10902 ) {
                //修复ff3.6初始化进来，不能点击获得焦点
                me.body.contentEditable = false;
                setTimeout( function () {
                    me.body.contentEditable = true;
                }, 100 );
                setInterval( function () {
                    me.body.style.height = me.iframe.offsetHeight - 20 + 'px'
                }, 100 )
            }
            !options.isShow && me.setHide();
            options.readonly && me.setDisabled();
        },
        /**
         * 创建textarea,同步编辑的内容到textarea,为后台获取内容做准备
         * @param formId 制定在那个form下添加
         * @public
         * @function
         */
        sync:function ( formId ) {
            var me = this,
                    form = formId ? document.getElementById( formId ) :
                            domUtils.findParent( me.iframe.parentNode, function ( node ) {
                                return node.tagName == 'FORM'
                            }, true );
            form && setValue( form, me );
        },
        /**
         * 设置编辑器高度
         * @public
         * @function
         * @param {Number} height    高度
         */
        setHeight:function ( height ) {
            if ( height !== parseInt( this.iframe.parentNode.style.height ) ) {
                this.iframe.parentNode.style.minHeight = height + 'px';
            }
            this.document.body.style.minHeight = height + 'px';
        },

        /**
         * 获取编辑器内容
         * @public
         * @function
         * @returns {String}
         */
        getContent:function ( cmd, fn, isPreview ) {
            var me = this;
            if ( cmd && utils.isFunction( cmd ) ) {
                fn = cmd;
                cmd = '';
            }
            if ( fn ? !fn() : !this.hasContents() ) {
                return '';
            }
            me.fireEvent( 'beforegetcontent', cmd );
            var reg = new RegExp( domUtils.fillChar, 'g' ),
            //ie下取得的html可能会有\n存在，要去掉，在处理replace(/[\t\r\n]*/g,'');代码高量的\n不能去除
                    html = me.body.innerHTML.replace( reg, '' ).replace( />[\t\r\n]*?</g, '><' );
            me.fireEvent( 'aftergetcontent', cmd );
            if ( me.serialize ) {
                var node = me.serialize.parseHTML( html );
                node = me.serialize.transformOutput( node );
                html = me.serialize.toHTML( node );
            }

            if ( ie && isPreview ) {
                //trace:2471
                //两个br会导致空行，所以这里先注视掉
                html = html//.replace(/<\s*br\s*\/?\s*>/gi,'<br/><br/>')
                        .replace( /<p>\s*?<\/p>/g, '<p>&nbsp;</p>' );
            } else {
                //多个&nbsp;要转换成空格加&nbsp;的形式，要不预览时会所成一个
                html = html.replace( /(&nbsp;)+/g, function ( s ) {
                    for ( var i = 0, str = [], l = s.split( ';' ).length - 1; i < l; i++ ) {
                        str.push( i % 2 == 0 ? ' ' : '&nbsp;' );
                    }
                    return str.join( '' );
                } );
            }

            return  html;

        },
        getAllHtml:function () {
            var me = this,
                    headHtml = {html:''},
                    html = '';
            me.fireEvent( 'getAllHtml', headHtml );
            return '<html><head>' + (me.options.charset ? '<meta http-equiv="Content-Type" content="text/html; charset=' + me.options.charset + '"/>' : '') + me.document.getElementsByTagName( 'head' )[0].innerHTML + headHtml.html + '</head>'
                    + '<body ' + (ie && browser.version < 9 ? 'class="view"' : '') + '>' + me.getContent( null, null, true ) + '</body></html>';
        },
        /**
         * 得到编辑器的纯文本内容，但会保留段落格式
         * @public
         * @function
         * @returns {String}
         */
        getPlainTxt:function () {
            var reg = new RegExp( domUtils.fillChar, 'g' ),
                    html = this.body.innerHTML.replace( /[\n\r]/g, '' );//ie要先去了\n在处理
            html = html.replace( /<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n' )
                    .replace( /<br\/?>/gi, '\n' )
                    .replace( /<[^>/]+>/g, '' )
                    .replace( /(\n)?<\/([^>]+)>/g, function ( a, b, c ) {
                        return dtd.$block[c] ? '\n' : b ? b : '';
                    } );
            //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
            return html.replace(reg,'').replace(/\u00a0/g,' ').replace(/&nbsp;/g,' ').replace(/\u200B<img/gi, '<img');
            // 配合 fiximgclick_xueqiu.js 插件去除 img 前的占位符
        },

        /**
         * 获取编辑器中的文本内容
         * @public
         * @function
         * @returns {String}
         */
        getContentTxt:function () {
            var reg = new RegExp( domUtils.fillChar, 'g' );
            //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
            return this.body[browser.ie ? 'innerText' : 'textContent'].replace( reg, '' ).replace( /\u00a0/g, ' ' );
        },

        /**
         * 设置编辑器内容
         * @public
         * @function
         * @param {String} html
         */
        setContent:function ( html, notFireSelectionchange ) {
            var me = this,
                    inline = utils.extend( {a:1, A:1}, dtd.$inline, true ),
                    lastTagName;

            html = html
                    .replace( /^[ \t\r\n]*?</, '<' )
                    .replace( />[ \t\r\n]*?$/, '>' )
                    .replace( />[\t\r\n]*?</g, '><' )//代码高量的\n不能去除
                    .replace( /[\s\/]?(\w+)?>[ \t\r\n]*?<\/?(\w+)/gi, function ( a, b, c ) {
                        if ( b ) {
                            lastTagName = c;
                        } else {
                            b = lastTagName;
                        }
                        return !inline[b] && !inline[c] ? a.replace( />[ \t\r\n]*?</, '><' ) : a;
                    } );
            me.fireEvent( 'beforesetcontent' );
            var serialize = this.serialize;
            if ( serialize ) {
                var node = serialize.parseHTML( html );
                node = serialize.transformInput( node );
                node = serialize.filter( node );
                html = serialize.toHTML( node );
            }
            //html.replace(new RegExp('[\t\n\r' + domUtils.fillChar + ']*','g'),'');
            //去掉了\t\n\r 如果有插入的代码，在源码切换所见即所得模式时，换行都丢掉了
            //\r在ie下的不可见字符，在源码切换时会变成多个&nbsp;
            //trace:1559
            this.body.innerHTML = html.replace( new RegExp( '[\r' + domUtils.fillChar + ']*', 'g' ), '' );
            //处理ie6下innerHTML自动将相对路径转化成绝对路径的问题
            if ( browser.ie && browser.version < 7 ) {
                replaceSrc( this.document.body );
            }
            //给文本或者inline节点套p标签
            if ( me.options.enterTag == 'p' ) {

                var child = this.body.firstChild, tmpNode;
                if ( !child || child.nodeType == 1 &&
                        (dtd.$cdata[child.tagName] ||
                                domUtils.isCustomeNode( child )
                                )
                        && child === this.body.lastChild ) {
                    this.body.innerHTML = '<p>' + (browser.ie ? '&nbsp;' : '<br/>') + '</p>' + this.body.innerHTML;

                } else {
                    var p = me.document.createElement( 'p' );
                    while ( child ) {
                        while ( child && (child.nodeType == 3 || child.nodeType == 1 && dtd.p[child.tagName] && !dtd.$cdata[child.tagName]) ) {
                            tmpNode = child.nextSibling;
                            p.appendChild( child );
                            child = tmpNode;
                        }
                        if ( p.firstChild ) {
                            if ( !child ) {
                                me.body.appendChild( p );
                                break;
                            } else {
                                me.body.insertBefore( p, child );
                                p = me.document.createElement( 'p' );
                            }
                        }
                        child = child.nextSibling;
                    }
                }
            }
            me.adjustTable && me.adjustTable( me.body );
            me.fireEvent( 'aftersetcontent' );
            me.fireEvent( 'contentchange' );
            !notFireSelectionchange && me._selectionChange();
            //清除保存的选区
            me._bakRange = me._bakIERange = null;
            //trace:1742 setContent后gecko能得到焦点问题
            var geckoSel;
            if ( browser.gecko && (geckoSel = this.selection.getNative()) ) {
                geckoSel.removeAllRanges();
            }


        },

        /**
         * 让编辑器获得焦点
         * @public
         * @function
         * @param{boolean}toEnd 默认是到头部,true到尾部
         */
        focus:function ( toEnd ) {
            try {
                var me = this,
                        rng = me.selection.getRange();
                if ( toEnd ) {
                    rng.setStartAtLast( me.body.lastChild ).setCursor( false, true );
                } else {
                    rng.select( true );
                }
            } catch ( e ) {
            }
        },

        /**
         * 初始化事件，绑定selectionchange
         * @private
         * @function
         */
        _initEvents:function () {
            var me = this,
                    doc = me.document,
                    win = me.window;
            me._proxyDomEvent = utils.bind( me._proxyDomEvent, me );
            domUtils.on( doc, ['click', 'contextmenu', 'mousedown', 'keydown', 'keyup', 'keypress', 'mouseup', 'mouseover', 'mouseout', 'selectstart'], me._proxyDomEvent );
            domUtils.on( win, ['focus', 'blur'], me._proxyDomEvent );
            domUtils.on( doc, ['mouseup', 'keydown'], function ( evt ) {
                //特殊键不触发selectionchange
                if ( evt.type == 'keydown' && (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey) ) {
                    return;
                }
                if ( evt.button == 2 )return;
                me._selectionChange( 250, evt );
            } );
            //处理拖拽
            //ie ff不能从外边拖入
            //chrome只针对从外边拖入的内容过滤
            var innerDrag = 0, source = browser.ie ? me.body : me.document, dragoverHandler;
            domUtils.on( source, 'dragstart', function () {
                innerDrag = 1;
            } );
            domUtils.on( source, browser.webkit ? 'dragover' : 'drop', function () {
                return browser.webkit ?
                        function () {
                            clearTimeout( dragoverHandler );
                            dragoverHandler = setTimeout( function () {
                                if ( !innerDrag ) {
                                    var sel = me.selection,
                                            range = sel.getRange();
                                    if ( range ) {
                                        var common = range.getCommonAncestor();
                                        if ( common && me.serialize ) {
                                            var f = me.serialize,
                                                    node =
                                                            f.filter(
                                                                    f.transformInput(
                                                                            f.parseHTML(
                                                                                    f.word( common.innerHTML )
                                                                            )
                                                                    )
                                                            );
                                            common.innerHTML = f.toHTML( node );
                                        }
                                    }
                                }
                                innerDrag = 0;
                            }, 200 );
                        } :
                        function ( e ) {
                            if ( !innerDrag ) {
                                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                            }
                            innerDrag = 0;
                        }
            }() );
        },
        _proxyDomEvent:function ( evt ) {
            return this.fireEvent( evt.type.replace( /^on/, '' ), evt );
        },
        _selectionChange:function ( delay, evt ) {
            var me = this;
            //有光标才做selectionchange 为了解决未focus时点击source不能触发更改工具栏状态的问题（source命令notNeedUndo=1）
//            if ( !me.selection.isFocus() ){
//                return;
//            }
            var hackForMouseUp = false;
            var mouseX, mouseY;
            if ( browser.ie && browser.version < 9 && evt && evt.type == 'mouseup' ) {
                var range = this.selection.getRange();
                if ( !range.collapsed ) {
                    hackForMouseUp = true;
                    mouseX = evt.clientX;
                    mouseY = evt.clientY;
                }
            }
            clearTimeout( _selectionChangeTimer );
            _selectionChangeTimer = setTimeout( function () {
                if ( !me.selection.getNative() ) {
                    return;
                }
                //修复一个IE下的bug: 鼠标点击一段已选择的文本中间时，可能在mouseup后的一段时间内取到的range是在selection的type为None下的错误值.
                //IE下如果用户是拖拽一段已选择文本，则不会触发mouseup事件，所以这里的特殊处理不会对其有影响
                var ieRange;
                if ( hackForMouseUp && me.selection.getNative().type == 'None' ) {
                    ieRange = me.document.body.createTextRange();
                    try {
                        ieRange.moveToPoint( mouseX, mouseY );
                    } catch ( ex ) {
                        ieRange = null;
                    }
                }
                var bakGetIERange;
                if ( ieRange ) {
                    bakGetIERange = me.selection.getIERange;
                    me.selection.getIERange = function () {
                        return ieRange;
                    };
                }
                me.selection.cache();
                if ( bakGetIERange ) {
                    me.selection.getIERange = bakGetIERange;
                }
                if ( me.selection._cachedRange && me.selection._cachedStartElement ) {
                    me.fireEvent( 'beforeselectionchange' );
                    // 第二个参数causeByUi为true代表由用户交互造成的selectionchange.
                    me.fireEvent( 'selectionchange', !!evt );
                    me.fireEvent( 'afterselectionchange' );
                    me.selection.clear();
                }
            }, delay || 50 );
        },
        _callCmdFn:function ( fnName, args ) {
            var cmdName = args[0].toLowerCase(),
                    cmd, cmdFn;
            cmd = this.commands[cmdName] || UE.commands[cmdName];
            cmdFn = cmd && cmd[fnName];
            //没有querycommandstate或者没有command的都默认返回0
            if ( (!cmd || !cmdFn) && fnName == 'queryCommandState' ) {
                return 0;
            } else if ( cmdFn ) {
                return cmdFn.apply( this, args );
            }
        },

        /**
         * 执行命令
         * @public
         * @function
         * @param {String} cmdName 执行的命令名
         *
         */
        execCommand:function ( cmdName ) {
            cmdName = cmdName.toLowerCase();
            var me = this,
                    result,
                    cmd = me.commands[cmdName] || UE.commands[cmdName];
            if ( !cmd || !cmd.execCommand ) {
                return;
            }
            if ( !cmd.notNeedUndo && !me.__hasEnterExecCommand ) {
                me.__hasEnterExecCommand = true;
                if ( me.queryCommandState( cmdName ) != -1 ) {
                    me.fireEvent( 'beforeexeccommand', cmdName );
                    result = this._callCmdFn( 'execCommand', arguments );
                    me.fireEvent( 'afterexeccommand', cmdName );
                }
                me.__hasEnterExecCommand = false;
            } else {
                result = this._callCmdFn( 'execCommand', arguments );
            }
            me._selectionChange();
            return result;
        },
        /**
         * 查询命令的状态
         * @public
         * @function
         * @param {String} cmdName 执行的命令名
         * @returns {Number|*} -1 : disabled, false : normal, true : enabled.
         *
         */
        queryCommandState:function ( cmdName ) {
            return this._callCmdFn( 'queryCommandState', arguments );
        },

        /**
         * 查询命令的值
         * @public
         * @function
         * @param {String} cmdName 执行的命令名
         * @returns {*}
         */
        queryCommandValue:function ( cmdName ) {
            return this._callCmdFn( 'queryCommandValue', arguments );
        },
        /**
         * 检查编辑区域中是否有内容
         * @public
         * @params{Array} 自定义的标签
         * @function
         * @returns {Boolean} true 有,false 没有
         */
        hasContents:function ( tags ) {
            if ( tags ) {
                for ( var i = 0, ci; ci = tags[i++]; ) {
                    if ( this.document.getElementsByTagName( ci ).length > 0 ) {
                        return true;
                    }
                }
            }
            if ( !domUtils.isEmptyBlock( this.body ) ) {
                return true
            }
            //随时添加,定义的特殊标签如果存在，不能认为是空
            tags = ['div'];
            for ( i = 0; ci = tags[i++]; ) {
                var nodes = domUtils.getElementsByTagName( this.document, ci );
                for ( var n = 0, cn; cn = nodes[n++]; ) {
                    if ( domUtils.isCustomeNode( cn ) ) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 从新设置
         * @public
         * @function
         */
        reset:function () {
            this.fireEvent( 'reset' );
        },
        /**
         * 设置编辑区域可以编辑
         */
        setEnabled:function () {
            var me = this, range;
            if ( me.body.contentEditable == 'false' ) {
                me.body.contentEditable = true;
                range = me.selection.getRange();
                //有可能内容丢失了
                try {
                    range.moveToBookmark( me.lastBk );
                    delete me.lastBk
                } catch ( e ) {
                    range.setStartAtFirst( me.body ).collapse( true )
                }
                range.select( true );
                if ( me.bkqueryCommandState ) {
                    me.queryCommandState = me.bkqueryCommandState;
                    delete me.bkqueryCommandState;
                }
                me.fireEvent( 'selectionchange' );
            }
        },
        /**
         * 设置编辑区域不可以编辑
         */
        setDisabled:function ( exclude ) {
            var me = this;
            exclude = exclude ? utils.isArray( exclude ) ? exclude : [exclude] : [];
            if ( me.body.contentEditable == 'true' ) {
                if ( !me.lastBk ) {
                    me.lastBk = me.selection.getRange().createBookmark( true );
                }
                me.body.contentEditable = false;
                me.bkqueryCommandState = me.queryCommandState;
                me.queryCommandState = function ( type ) {
                    if ( utils.indexOf( exclude, type ) != -1 ) {
                        return me.bkqueryCommandState.apply( me, arguments );
                    }
                    return -1;
                };
                me.fireEvent( 'selectionchange' );
            }
        },
        /**
         * 设置默认内容
         * @function
         * @param    {String}    cont     要存入的内容
         */
        setDefaultContent:function () {
            function clear() {
                var me = this;
                if ( me.document.getElementById( 'initContent' ) ) {
                    me.document.body.innerHTML = '<p>' + (ie ? '' : '<br/>') + '</p>';
                    var range = me.selection.getRange();
                    me.removeListener( 'firstBeforeExecCommand', clear );
                    me.removeListener( 'focus', clear );
                    setTimeout( function () {
                        range.setStart( me.document.body.firstChild, 0 ).collapse( true ).select( true );
                        me._selectionChange();
                    } )
                }
            }

            return function ( cont ) {
                var me = this;
                me.document.body.innerHTML = '<p id="initContent">' + cont + '</p>';
                if ( browser.ie && browser.version < 7 ) {
                    replaceSrc( me.document.body );
                }
                me.addListener( 'firstBeforeExecCommand', clear );
                me.addListener( 'focus', clear );
            }
        }(),
        /**
         * 设置编辑器显示
         * @function
         */
        setShow:function () {
            var me = this,
                    range = me.selection.getRange();
            if ( me.container.style.display == 'none' ) {
                //有可能内容丢失了
                try {
                    range.moveToBookmark( me.lastBk );
                    delete me.lastBk
                } catch ( e ) {
                    range.setStartAtFirst( me.body ).collapse( true )
                }
                range.select( true );
                me.container.style.display = '';
            }

        },
        /**
         * 设置编辑器隐藏
         * @function
         */
        setHide:function () {
            var me = this;
            if ( !me.lastBk ) {
                me.lastBk = me.selection.getRange().createBookmark( true );
            }
            me.container.style.display = 'none'
        },
        getLang:function ( path ) {
            var lang = UE.I18N[this.options.lang];
            path = (path || "").split( "." );
            for ( var i = 0, ci; ci = path[i++]; ) {
                lang = lang[ci];
                if ( !lang )break;
            }
            return lang;
        }
    };
    utils.inherits( Editor, EventBase );
})();
///import core
///commands 修复chrome下图片不能点击的问题
///commandsName  FixImgClick
///commandsTitle  修复chrome下图片不能点击的问题
//修复chrome下图片不能点击的问题
//
//雪球hack by yuest
//不可改大小
//插入图片时根据浏览器判断在 img 上加如下 attribute
/*
if ($.browser.webkit) {
  editable = ''
} else if ($.browser.mozilla) {
  editable = 'contenteditable="false"'
} else if ($.browser.msie) {
  if (parseInt($.browser.version, 10) < 9)
    editable = ''
  else
    editable = 'unselectable="on"'
}
*/
UE.plugins['fiximgclick'] = function() {
    var me = this;
    if ( browser.webkit ) {
        me.addListener( 'click', function( type, e ) {
            if ( e.target.tagName == 'IMG' ) {
                var range = new dom.Range( me.document );
                range.selectNode( e.target ).select();

            }
        } )
    } else {
      var insert = function (img) {
          var range = new dom.Range(me.document)
          range
            .selectNode(img)
            .collapse(true)
            .insertNode(me.document.createTextNode('\u200B'))
        }
      , select = function (img) {
          var range = new dom.Range(me.document)
          range
            .selectNode(img)
            .setStart(range.startContainer, range.startOffset - 1)
            .select()
        }
      , getCharBefore = function (img) {
          var range = new dom.Range(me.document)
          range
            .selectNode(img)
            .collapse(true)
            .setStart(range.startContainer, range.startOffset - 1)
          var fc = range.cloneContents().firstChild
          return fc ? fc.textContent || fc.innerText : null
        }
      , selectImg = function (img) {
          var range = me.selection.getRange()
          if (!range.startOffset) {
            insert(img)
            select(img)
          } else {
            if ('\u200B' === getCharBefore(img)) {
              select(img)
            } else {
              insert(img)
              select(img)
            }
          }
        }
      me.addListener('click', function(type, e) {
        if ( e.target && e.target.tagName == 'IMG' ) {
          selectImg(e.target)
        }
      })
      me.addListener("selectionchange", function() {
        var range = me.selection.getRange()
        if (range.endOffset - range.startOffset === 1) {
          if (range.startContainer.nodeType === 1) {
            var selElm = range.startContainer.childNodes[range.startOffset]
            if (selElm && selElm.nodeType === 1 && selElm.tagName === 'IMG') {
              selectImg(selElm)
              return
            }
          }
        }
      })
    }
};
///import core
///commands 清除格式
///commandsName  RemoveFormat
///commandsTitle  清除格式
/**
 * @description 清除格式
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     removeformat清除格式命令
 * @param   {String}   tags                以逗号隔开的标签。如：span,a
 * @param   {String}   style               样式
 * @param   {String}   attrs               属性
 * @param   {String}   notIncluedA    是否把a标签切开
 * @author zhanyi
 */
UE.plugins['removeformat'] = function(){
    var me = this;
    me.setOpt({
       'removeFormatTags': 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var',
       'removeFormatAttributes':'class,style,lang,width,height,align,hspace,valign'
    });
    me.commands['removeformat'] = {
        execCommand : function( cmdName, tags, style, attrs,notIncludeA ) {

            var tagReg = new RegExp( '^(?:' + (tags || this.options.removeFormatTags).replace( /,/g, '|' ) + ')$', 'i' ) ,
                removeFormatAttributes = style ? [] : (attrs || this.options.removeFormatAttributes).split( ',' ),
                range = new dom.Range( this.document ),
                bookmark,node,parent,
                filter = function( node ) {
                    return node.nodeType == 1;
                };

            function isRedundantSpan (node) {
                if (node.nodeType == 3 || node.tagName.toLowerCase() != 'span'){
                    return 0;
                }
                if (browser.ie) {
                    //ie 下判断实效，所以只能简单用style来判断
                    //return node.style.cssText == '' ? 1 : 0;
                    var attrs = node.attributes;
                    if ( attrs.length ) {
                        for ( var i = 0,l = attrs.length; i<l; i++ ) {
                            if ( attrs[i].specified ) {
                                return 0;
                            }
                        }
                        return 1;
                    }
                }
                return !node.attributes.length;
            }
            function doRemove( range ) {

                var bookmark1 = range.createBookmark();
                if ( range.collapsed ) {
                    range.enlarge( true );
                }

                //不能把a标签切了
                if(!notIncludeA){
                    var aNode = domUtils.findParentByTagName(range.startContainer,'a',true);
                    if(aNode){
                        range.setStartBefore(aNode);
                    }

                    aNode = domUtils.findParentByTagName(range.endContainer,'a',true);
                    if(aNode){
                        range.setEndAfter(aNode);
                    }

                }


                bookmark = range.createBookmark();

                node = bookmark.start;

                //切开始
                while ( (parent = node.parentNode) && !domUtils.isBlockElm( parent ) ) {
                    domUtils.breakParent( node, parent );

                    domUtils.clearEmptySibling( node );
                }
                if ( bookmark.end ) {
                    //切结束
                    node = bookmark.end;
                    while ( (parent = node.parentNode) && !domUtils.isBlockElm( parent ) ) {
                        domUtils.breakParent( node, parent );
                        domUtils.clearEmptySibling( node );
                    }

                    //开始去除样式
                    var current = domUtils.getNextDomNode( bookmark.start, false, filter ),
                        next;
                    while ( current ) {
                        if ( current == bookmark.end ) {
                            break;
                        }

                        next = domUtils.getNextDomNode( current, true, filter );

                        if ( !dtd.$empty[current.tagName.toLowerCase()] && !domUtils.isBookmarkNode( current ) ) {
                            if ( tagReg.test( current.tagName ) ) {
                                if ( style ) {
                                    domUtils.removeStyle( current, style );
                                    if ( isRedundantSpan( current ) && style != 'text-decoration'){
                                        domUtils.remove( current, true );
                                    }
                                } else {
                                    domUtils.remove( current, true );
                                }
                            } else {
                                //trace:939  不能把list上的样式去掉
                                if(!dtd.$tableContent[current.tagName] && !dtd.$list[current.tagName]){
                                    domUtils.removeAttributes( current, removeFormatAttributes );
                                    if ( isRedundantSpan( current ) ){
                                        domUtils.remove( current, true );
                                    }
                                }

                            }
                        }
                        current = next;
                    }
                }
                //trace:1035
                //trace:1096 不能把td上的样式去掉，比如边框
                var pN = bookmark.start.parentNode;
                if(domUtils.isBlockElm(pN) && !dtd.$tableContent[pN.tagName] && !dtd.$list[pN.tagName]){
                    domUtils.removeAttributes(  pN,removeFormatAttributes );
                }
                pN = bookmark.end.parentNode;
                if(bookmark.end && domUtils.isBlockElm(pN) && !dtd.$tableContent[pN.tagName]&& !dtd.$list[pN.tagName]){
                    domUtils.removeAttributes(  pN,removeFormatAttributes );
                }
                range.moveToBookmark( bookmark ).moveToBookmark(bookmark1);
                //清除冗余的代码 <b><bookmark></b>
                var node = range.startContainer,
                    tmp,
                    collapsed = range.collapsed;
                while(node.nodeType == 1 && domUtils.isEmptyNode(node) && dtd.$removeEmpty[node.tagName]){
                    tmp = node.parentNode;
                    range.setStartBefore(node);
                    //trace:937
                    //更新结束边界
                    if(range.startContainer === range.endContainer){
                        range.endOffset--;
                    }
                    domUtils.remove(node);
                    node = tmp;
                }

                if(!collapsed){
                    node = range.endContainer;
                    while(node.nodeType == 1 && domUtils.isEmptyNode(node) && dtd.$removeEmpty[node.tagName]){
                        tmp = node.parentNode;
                        range.setEndBefore(node);
                        domUtils.remove(node);

                        node = tmp;
                    }


                }
            }

            if ( this.currentSelectedArr && this.currentSelectedArr.length ) {
                for ( var i = 0,ci; ci = this.currentSelectedArr[i++]; ) {
                    range.selectNodeContents( ci );
                    doRemove( range );
                }
                range.selectNodeContents( this.currentSelectedArr[0] ).select();
            } else {

                range = this.selection.getRange();
                doRemove( range );
                range.select();
            }
        },
        queryCommandState : function(){
            return this.highlight ? -1 :0;
        }

    };

};
///import core
///import plugins\removeformat.js
///commands 字体颜色,背景色,字号,字体,下划线,删除线
///commandsName  ForeColor,BackColor,FontSize,FontFamily,Underline,StrikeThrough
///commandsTitle  字体颜色,背景色,字号,字体,下划线,删除线
/**
 * @description 字体
 * @name baidu.editor.execCommand
 * @param {String}     cmdName    执行的功能名称
 * @param {String}    value             传入的值
 */
UE.plugins['font'] = function() {
    var me = this,
        fonts = {
            'forecolor':'color',
            'backcolor':'background-color',
            'fontsize':'font-size',
            'fontfamily':'font-family',
            'underline':'text-decoration',
            'strikethrough':'text-decoration'
        };
    me.setOpt({
        'fontfamily':[
            { name:'songti',val:'宋体,SimSun'},
            { name:'yahei',val:'微软雅黑,Microsoft YaHei'},
            { name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
            { name:'heiti',val:'黑体, SimHei'},
            { name:'lishu',val:'隶书, SimLi'},
            { name:'andaleMono',val:'andale mono'},
            { name:'arial',val:'arial, helvetica,sans-serif'},
            { name:'arialBlack',val:'arial black,avant garde'},
            { name:'comicSansMs',val:'comic sans ms'},
            { name:'impact',val:'impact,chicago'},
            { name:'timesNewRoman',val:'times new roman'}
          ],
        'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]
    });

    for ( var p in fonts ) {
        (function( cmd, style ) {
            UE.commands[cmd] = {
                execCommand : function( cmdName, value ) {
                    value = value || (this.queryCommandState(cmdName) ? 'none' : cmdName == 'underline' ? 'underline' : 'line-through');
                    var me = this,
                        range = this.selection.getRange(),
                        text;

                    if ( value == 'default' ) {

                        if(range.collapsed){
                            text = me.document.createTextNode('font');
                            range.insertNode(text).select();

                        }
                        me.execCommand( 'removeFormat', 'span,a', style);
                        if(text){
                            range.setStartBefore(text).setCursor();
                            domUtils.remove(text);
                        }


                    } else {
                        if(me.currentSelectedArr && me.currentSelectedArr.length > 0){
                            for(var i=0,ci;ci=me.currentSelectedArr[i++];){
                                range.selectNodeContents(ci);
                                range.applyInlineStyle( 'span', {'style':style + ':' + value} );

                            }
                            range.selectNodeContents(this.currentSelectedArr[0]).select();
                        }else{
                            if ( !range.collapsed ) {
                                if((cmd == 'underline'||cmd=='strikethrough') && me.queryCommandValue(cmd)){
                                     me.execCommand( 'removeFormat', 'span,a', style );
                                }
                                range = me.selection.getRange();

                                range.applyInlineStyle( 'span', {'style':style + ':' + value} ).select();
                            } else {

                                var span = domUtils.findParentByTagName(range.startContainer,'span',true);
                                text = me.document.createTextNode('font');
                                if(span && !span.children.length && !span[browser.ie ? 'innerText':'textContent'].replace(fillCharReg,'').length){
                                    //for ie hack when enter
                                    range.insertNode(text);
                                     if(cmd == 'underline'||cmd=='strikethrough'){
                                         range.selectNode(text).select();
                                         me.execCommand( 'removeFormat','span,a', style, null );

                                         span = domUtils.findParentByTagName(text,'span',true);
                                         range.setStartBefore(text);

                                    }
                                    span.style.cssText += ';' + style + ':' + value;
                                    range.collapse(true).select();


                                }else{
                                    range.insertNode(text);
                                    range.selectNode(text).select();
                                    span = range.document.createElement( 'span' );

                                    if(cmd == 'underline'||cmd=='strikethrough'){
                                        //a标签内的不处理跳过
                                        if(domUtils.findParentByTagName(text,'a',true)){
                                            range.setStartBefore(text).setCursor();
                                             domUtils.remove(text);
                                             return;
                                         }
                                         me.execCommand( 'removeFormat','span,a', style );
                                    }

                                    span.style.cssText = style + ':' + value;


                                    text.parentNode.insertBefore(span,text);
                                    //修复，span套span 但样式不继承的问题
                                    if(!browser.ie || browser.ie && browser.version == 9){
                                        var spanParent = span.parentNode;
                                        while(!domUtils.isBlockElm(spanParent)){
                                            if(spanParent.tagName == 'SPAN'){
                                                //opera合并style不会加入";"
                                                span.style.cssText = spanParent.style.cssText + ";" + span.style.cssText;
                                            }
                                            spanParent = spanParent.parentNode;
                                        }
                                    }


                                    if(opera){
                                        setTimeout(function(){
                                            range.setStart(span,0).setCursor();
                                        });
                                    }else{
                                        range.setStart(span,0).setCursor();
                                    }

                                    //trace:981
                                    //domUtils.mergToParent(span)


                                }
                                domUtils.remove(text);
                            }
                        }

                    }
                    return true;
                },
                queryCommandValue : function (cmdName) {
                    var startNode = this.selection.getStart();

                    //trace:946
                    if(cmdName == 'underline'||cmdName=='strikethrough' ){
                        var tmpNode = startNode,value;
                        while(tmpNode && !domUtils.isBlockElm(tmpNode) && !domUtils.isBody(tmpNode)){
                            if(tmpNode.nodeType == 1){
                                value = domUtils.getComputedStyle( tmpNode, style );

                                if(value != 'none'){
                                    return value;
                                }
                            }

                            tmpNode = tmpNode.parentNode;
                        }
                        return 'none';
                    }
                    return  domUtils.getComputedStyle( startNode, style );
                },
                queryCommandState : function(cmdName){
                    if(this.highlight){
                       return -1;
                   }
                    if(!(cmdName == 'underline'||cmdName=='strikethrough')){
                        return 0;
                    }
                    return this.queryCommandValue(cmdName) == (cmdName == 'underline' ? 'underline' : 'line-through');
                }
            };
        })( p, fonts[p] );
    }


};///import core
///commands 加粗,斜体,上标,下标
///commandsName  Bold,Italic,Subscript,Superscript
///commandsTitle  加粗,加斜,下标,上标
/**
 * b u i等基础功能实现
 * @function
 * @name baidu.editor.execCommands
 * @param    {String}    cmdName    bold加粗。italic斜体。subscript上标。superscript下标。
*/
UE.plugins['basestyle'] = function(){
    var basestyles = {
            'bold':['strong','b'],
            'italic':['em','i'],
            'subscript':['sub'],
            'superscript':['sup']
        },
        getObj = function(editor,tagNames){
           //var start = editor.selection.getStart();
            var path = editor.selection.getStartElementPath();
//            return  domUtils.findParentByTagName( start, tagNames, true )
            return utils.findNode(path,tagNames);
        },
        me = this;
    for ( var style in basestyles ) {
        (function( cmd, tagNames ) {
            me.commands[cmd] = {
                execCommand : function( cmdName ) {

                    var range = new dom.Range(me.document),obj = '';
                    //table的处理
                    if(me.currentSelectedArr && me.currentSelectedArr.length > 0){
                        for(var i=0,ci;ci=me.currentSelectedArr[i++];){
                            if(ci.style.display != 'none'){
                                range.selectNodeContents(ci).select();
                                //trace:943
                                !obj && (obj = getObj(this,tagNames));
                                if(cmdName == 'superscript' || cmdName == 'subscript'){

                                    if(!obj || obj.tagName.toLowerCase() != cmdName){
                                        range.removeInlineStyle(['sub','sup']);
                                    }

                                }
                                obj ? range.removeInlineStyle( tagNames ) : range.applyInlineStyle( tagNames[0] );
                            }

                        }
                        range.selectNodeContents(me.currentSelectedArr[0]).select();
                    }else{
                        range = me.selection.getRange();
                        obj = getObj(this,tagNames);

                        if ( range.collapsed ) {
                            if ( obj ) {
                                var tmpText =  me.document.createTextNode('');
                                range.insertNode( tmpText ).removeInlineStyle( tagNames );

                                range.setStartBefore(tmpText);
                                domUtils.remove(tmpText);
                            } else {

                                var tmpNode = range.document.createElement( tagNames[0] );
                                if(cmdName == 'superscript' || cmdName == 'subscript'){
                                    tmpText = me.document.createTextNode('');
                                    range.insertNode(tmpText)
                                        .removeInlineStyle(['sub','sup'])
                                        .setStartBefore(tmpText)
                                        .collapse(true);

                                }
                                range.insertNode( tmpNode ).setStart( tmpNode, 0 );



                            }
                            range.collapse( true );

                        } else {
                            if(cmdName == 'superscript' || cmdName == 'subscript'){
                                if(!obj || obj.tagName.toLowerCase() != cmdName){
                                    range.removeInlineStyle(['sub','sup']);
                                }

                            }
                            obj ? range.removeInlineStyle( tagNames ) : range.applyInlineStyle( tagNames[0] );
                        }

                        range.select();

                    }

                    return true;
                },
                queryCommandState : function() {
                   if(this.highlight){
                       return -1;
                   }
                   return getObj(this,tagNames) ? 1 : 0;
                }
            };
        })( style, basestyles[style] );

    }
};

///import core
/**
 * @description 插入内容
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     inserthtml插入内容的命令
 * @param   {String}   html                要插入的内容
 * @author zhanyi
    */
    UE.commands['inserthtml'] = {
        execCommand: function (command,html,notSerialize){
            var me = this,
                range,
                div,
                tds = me.currentSelectedArr;

            range = me.selection.getRange();

            div = range.document.createElement( 'div' );
            div.style.display = 'inline';
            var serialize = me.serialize;
            if (!notSerialize && serialize) {
                var node = serialize.parseHTML(html);
                node = serialize.transformInput(node);
                node = serialize.filter(node);
                html = serialize.toHTML(node);
            }
            div.innerHTML = utils.trim( html );
            try{
                me.adjustTable && me.adjustTable(div);
            }catch(e){}


            if(tds && tds.length){
                for(var i=0,ti;ti=tds[i++];){
                    ti.className = '';
                }
                tds[0].innerHTML = '';
                range.setStart(tds[0],0).collapse(true);
                me.currentSelectedArr = [];
            }

            if ( !range.collapsed ) {

                range.deleteContents();
                if(range.startContainer.nodeType == 1){
                    var child = range.startContainer.childNodes[range.startOffset],pre;
                    if(child && domUtils.isBlockElm(child) && (pre = child.previousSibling) && domUtils.isBlockElm(pre)){
                        range.setEnd(pre,pre.childNodes.length).collapse();
                        while(child.firstChild){
                            pre.appendChild(child.firstChild);

                        }
                        domUtils.remove(child);
                    }
                }

            }


            var child,parent,pre,tmp,hadBreak = 0;
            while ( child = div.firstChild ) {
                range.insertNode( child );
                if ( !hadBreak && child.nodeType == domUtils.NODE_ELEMENT && domUtils.isBlockElm( child ) ){

                    parent = domUtils.findParent( child,function ( node ){ return domUtils.isBlockElm( node ); } );
                    if ( parent && parent.tagName.toLowerCase() != 'body' && !(dtd[parent.tagName][child.nodeName] && child.parentNode === parent)){
                        if(!dtd[parent.tagName][child.nodeName]){
                            pre = parent;
                        }else{
                            tmp = child.parentNode;
                            while (tmp !== parent){
                                pre = tmp;
                                tmp = tmp.parentNode;

                            }
                        }


                        domUtils.breakParent( child, pre || tmp );
                        //去掉break后前一个多余的节点  <p>|<[p> ==> <p></p><div></div><p>|</p>
                        var pre = child.previousSibling;
                        domUtils.trimWhiteTextNode(pre);
                        if(!pre.childNodes.length){
                            domUtils.remove(pre);
                        }
                        //trace:2012,在非ie的情况，切开后剩下的节点有可能不能点入光标添加br占位

                        if(!browser.ie &&
                            (next = child.nextSibling) &&
                            domUtils.isBlockElm(next) &&
                            next.lastChild &&
                            !domUtils.isBr(next.lastChild)){
                            next.appendChild(me.document.createElement('br'));
                        }
                        hadBreak = 1;
                    }
                }
                var next = child.nextSibling;
                if(!div.firstChild && next && domUtils.isBlockElm(next)){

                    range.setStart(next,0).collapse(true);
                    break;
                }
                range.setEndAfter( child ).collapse();

            }


            child = range.startContainer;

            //用chrome可能有空白展位符
            if(domUtils.isBlockElm(child) && domUtils.isEmptyNode(child)){
                child.innerHTML = browser.ie ? '' : '<br/>';
            }
            // TODO
            // true 导致 chrome 下传图之后无法输入中文
            //加上true因为在删除表情等时会删两次，第一次是删的fillData
            //range.select(true);


            setTimeout(function(){
                range = me.selection.getRange();
                range.scrollToView(me.autoHeightEnabled,me.autoHeightEnabled ? domUtils.getXY(me.iframe).y:0);
            },200);




        }
    };
///import core
///commands 定制过滤规则
///commandsName  Serialize
///commandsTitle  定制过滤规则
UE.plugins['serialize'] = function () {
    var ie = browser.ie,
        version = browser.version;

    function ptToPx(value){
        return /pt/.test(value) ? value.replace( /([\d.]+)pt/g, function( str ) {
            return  Math.round(parseFloat(str) * 96 / 72) + "px";
        } ) : value;
    }
    var me = this, autoClearEmptyNode = me.options.autoClearEmptyNode,
            EMPTY_TAG = dtd.$empty,
            parseHTML = function () {
                 //干掉<a> 后便变得空格，保留</a>  这样的空格
                var RE_PART = /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\s\/>]+)\s*((?:(?:"[^"]*")|(?:'[^']*')|[^"'<>])*)\/?>))/g,
                        RE_ATTR = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
                                        EMPTY_ATTR = {checked:1,compact:1,declare:1,defer:1,disabled:1,ismap:1,multiple:1,nohref:1,noresize:1,noshade:1,nowrap:1,readonly:1,selected:1},
                                        CDATA_TAG = {script:1,style: 1},
                                        NEED_PARENT_TAG = {
                                            "li": { "$": 'ul', "ul": 1, "ol": 1 },
                                            "dd": { "$": "dl", "dl": 1 },
                                            "dt": { "$": "dl", "dl": 1 },
                                            "option": { "$": "select", "select": 1 },
                                            "td": { "$": "tr", "tr": 1 },
                                            "th": { "$": "tr", "tr": 1 },
                                            "tr": { "$": "tbody", "tbody": 1, "thead": 1, "tfoot": 1, "table": 1 },
                                            "tbody": { "$": "table", 'table':1,"colgroup": 1 },
                                            "thead": { "$": "table", "table": 1 },
                                            "tfoot": { "$": "table", "table": 1 },
                                            "col": { "$": "colgroup","colgroup":1 }
                                        };
                                var NEED_CHILD_TAG = {
                    "table": "td", "tbody": "td", "thead": "td", "tfoot": "td", "tr": "td",
                    "colgroup": "col",
                    "ul": "li", "ol": "li",
                    "dl": "dd",
                    "select": "option"
                };

                function parse( html, callbacks ) {

                    var match,
                            nextIndex = 0,
                            tagName,
                            cdata;
                    RE_PART.exec( "" );
                    while ( (match = RE_PART.exec( html )) ) {

                        var tagIndex = match.index;
                        if ( tagIndex > nextIndex ) {
                            var text = html.slice( nextIndex, tagIndex );
                            if ( cdata ) {
                                cdata.push( text );
                            } else {
                                callbacks.onText( text );
                            }
                        }
                        nextIndex = RE_PART.lastIndex;
                        if ( (tagName = match[1]) ) {
                            tagName = tagName.toLowerCase();
                            if ( cdata && tagName == cdata._tag_name ) {
                                callbacks.onCDATA( cdata.join( '' ) );
                                cdata = null;
                            }
                            if ( !cdata ) {
                                callbacks.onTagClose( tagName );
                                continue;
                            }
                        }
                        if ( cdata ) {
                            cdata.push( match[0] );
                            continue;
                        }
                        if ( (tagName = match[3]) ) {
                            if ( /="/.test( tagName ) ) {
                                continue;
                            }
                            tagName = tagName.toLowerCase();
                            var attrPart = match[4],
                                    attrMatch,
                                    attrMap = {},
                                    selfClosing = attrPart && attrPart.slice( -1 ) == '/';
                            if ( attrPart ) {
                                RE_ATTR.exec( "" );
                                while ( (attrMatch = RE_ATTR.exec( attrPart )) ) {
                                    var attrName = attrMatch[1].toLowerCase(),
                                            attrValue = attrMatch[2] || attrMatch[3] || attrMatch[4] || '';
                                    if ( !attrValue && EMPTY_ATTR[attrName] ) {
                                        attrValue = attrName;
                                    }
                                    if ( attrName == 'style' ) {
                                        if ( ie && version <= 6 ) {
                                            attrValue = attrValue.replace( /(?!;)\s*([\w-]+):/g, function ( m, p1 ) {
                                                return p1.toLowerCase() + ':';
                                            } );
                                        }
                                    }
                                    //没有值的属性不添加
                                    if ( attrValue ) {
                                        attrMap[attrName] = attrValue.replace( /:\s*/g, ':' )
                                    }

                                }
                            }
                            callbacks.onTagOpen( tagName, attrMap, selfClosing );
                            if ( !cdata && CDATA_TAG[tagName] ) {
                                cdata = [];
                                cdata._tag_name = tagName;
                            }
                            continue;
                        }
                        if ( (tagName = match[2]) ) {
                            callbacks.onComment( tagName );
                        }
                    }
                    if ( html.length > nextIndex ) {
                        callbacks.onText( html.slice( nextIndex, html.length ) );
                    }
                }

                return function ( html, forceDtd ) {

                    var fragment = {
                        type: 'fragment',
                        parent: null,
                        children: []
                    };
                    var currentNode = fragment;

                    function addChild( node ) {
                        node.parent = currentNode;
                        currentNode.children.push( node );
                    }

                    function addElement( element, open ) {
                        var node = element;
                        // 遇到结构化标签的时候
                        if ( NEED_PARENT_TAG[node.tag] ) {
                            // 考虑这种情况的时候, 结束之前的标签
                            // e.g. <table><tr><td>12312`<tr>`4566
                            while ( NEED_PARENT_TAG[currentNode.tag] && NEED_PARENT_TAG[currentNode.tag][node.tag] ) {
                                currentNode = currentNode.parent;
                            }
                            // 如果前一个标签和这个标签是同一级, 结束之前的标签
                            // e.g. <ul><li>123<li>
                            if ( currentNode.tag == node.tag ) {
                                currentNode = currentNode.parent;
                            }
                            // 向上补齐父标签
                            while ( NEED_PARENT_TAG[node.tag] ) {
                                if ( NEED_PARENT_TAG[node.tag][currentNode.tag] ) break;
                                node = node.parent = {
                                    type: 'element',
                                    tag: NEED_PARENT_TAG[node.tag]['$'],
                                    attributes: {},
                                    children: [node]
                                };
                            }
                        }
                        if ( forceDtd ) {
                            // 如果遇到这个标签不能放在前一个标签内部，则结束前一个标签,span单独处理
                            while ( dtd[node.tag] && !(currentNode.tag == 'span' ? utils.extend( dtd['strong'], {'a':1,'A':1} ) : (dtd[currentNode.tag] || dtd['div']))[node.tag] ) {
                                if ( tagEnd( currentNode ) ) continue;
                                if ( !currentNode.parent ) break;
                                currentNode = currentNode.parent;
                            }
                        }
                        node.parent = currentNode;
                        currentNode.children.push( node );
                        if ( open ) {
                            currentNode = element;
                        }
                        if ( element.attributes.style ) {
                            element.attributes.style = element.attributes.style.toLowerCase();
                        }
                        return element;
                    }

                    // 结束一个标签的时候，需要判断一下它是否缺少子标签
                    // e.g. <table></table>
                    function tagEnd( node ) {
                        var needTag;
                        if ( !node.children.length && (needTag = NEED_CHILD_TAG[node.tag]) ) {
                            addElement( {
                                type: 'element',
                                tag: needTag,
                                attributes: {},
                                children: []
                            }, true );
                            return true;
                        }
                        return false;
                    }

                    parse( html, {
                        onText: function ( text ) {

                            while ( !(dtd[currentNode.tag] || dtd['div'])['#'] ) {
                                //节点之间的空白不能当作节点处理
//                                if(/^[ \t\r\n]+$/.test( text )){
//                                    return;
//                                }
                                if ( tagEnd( currentNode ) ) continue;
                                currentNode = currentNode.parent;
                            }
                            //if(/^[ \t\n\r]*/.test(text))
                                addChild( {
                                    type: 'text',
                                    data: text
                                } );

                        },
                        onComment: function ( text ) {
                            addChild( {
                                type: 'comment',
                                data: text
                            } );
                        },
                        onCDATA: function ( text ) {
                            while ( !(dtd[currentNode.tag] || dtd['div'])['#'] ) {
                                if ( tagEnd( currentNode ) ) continue;
                                currentNode = currentNode.parent;
                            }
                            addChild( {
                                type: 'cdata',
                                data: text
                            } );
                        },
                        onTagOpen: function ( tag, attrs, closed ) {
                            closed = closed || EMPTY_TAG[tag] ;
                            addElement( {
                                type: 'element',
                                tag: tag,
                                attributes: attrs,
                                closed: closed,
                                children: []
                            }, !closed );
                        },
                        onTagClose: function ( tag ) {
                            var node = currentNode;
                            // 向上找匹配的标签, 这里不考虑dtd的情况是因为tagOpen的时候已经处理过了, 这里不会遇到
                            while ( node && tag != node.tag ) {
                                node = node.parent;
                            }
                            if ( node ) {
                                // 关闭中间的标签
                                for ( var tnode = currentNode; tnode !== node.parent; tnode = tnode.parent ) {
                                    tagEnd( tnode );
                                }
                                //去掉空白的inline节点
                                //分页，锚点保留
                                //|| dtd.$removeEmptyBlock[node.tag])
//                                if ( !node.children.length && dtd.$removeEmpty[node.tag] && !node.attributes.anchorname && node.attributes['class'] != 'pagebreak' && node.tag != 'a') {
//
//                                    node.parent.children.pop();
//                                }
                                currentNode = node.parent;
                            } else {
                                // 如果没有找到开始标签, 则创建新标签
                                // eg. </div> => <div></div>
                                //针对视屏网站embed会给结束符，这里特殊处理一下
                                if ( !(dtd.$removeEmpty[tag] || dtd.$removeEmptyBlock[tag] || tag == 'embed') ) {
                                    node = {
                                        type: 'element',
                                        tag: tag,
                                        attributes: {},
                                        children: []
                                    };
                                    addElement( node, true );
                                    tagEnd( node );
                                    currentNode = node.parent;
                                }


                            }
                        }
                    } );
                    // 处理这种情况, 只有开始标签没有结束标签的情况, 需要关闭开始标签
                    // eg. <table>
                    while ( currentNode !== fragment ) {
                        tagEnd( currentNode );
                        currentNode = currentNode.parent;
                    }
                    return fragment;
                };
            }();
    var unhtml1 = function () {
        var map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

        function rep( m ) {
            return map[m];
        }

        return function ( str ) {
            str = str + '';
            return str ? str.replace( /[<>"']/g, rep ) : '';
        };
    }();
    var toHTML = function () {
        function printChildren( node, pasteplain ) {
            var children = node.children;

            var buff = [];
            for ( var i = 0,ci; ci = children[i]; i++ ) {

                buff.push( toHTML( ci, pasteplain ) );
            }
            return buff.join( '' );
        }

        function printAttrs( attrs ) {
            var buff = [];
            for ( var k in attrs ) {
                var value = attrs[k];

                if(k == 'style'){

                    //pt==>px
                    value = ptToPx(value);
                    //color rgb ==> hex
                    if(/rgba?\s*\([^)]*\)/.test(value)){
                        value = value.replace( /rgba?\s*\(([^)]*)\)/g, function( str ) {
                            return utils.fixColor('color',str);
                        } )
                    }
                    //过滤掉所有的white-space,在纯文本编辑器里粘贴过来的内容，到chrome中会带有span和white-space属性，导致出现不能折行的情况
                    //所以在这里去掉这个属性
                    attrs[k] = utils.optCss(value.replace(/windowtext/g,'#000'))
                                .replace(/white-space[^;]+;/g,'');

                }

                buff.push( k + '="' + unhtml1( attrs[k] ) + '"' );
            }
            return buff.join( ' ' )
        }

        function printData( node, notTrans ) {
            //trace:1399 输入html代码时空格转换成为&nbsp;
            //node.data.replace(/&nbsp;/g,' ') 针对pre中的空格和出现的&nbsp;把他们在得到的html代码中都转换成为空格，为了在源码模式下显示为空格而不是&nbsp;
            return notTrans ? node.data.replace(/&nbsp;/g,' ') : unhtml1( node.data ).replace(/ /g,'&nbsp;');
        }

        //纯文本模式下标签转换
        var transHtml = {
            'div':'p',
            'li':'p',
            'tr':'p',
            'br':'br',
            'p':'p'//trace:1398 碰到p标签自己要加上p,否则transHtml[tag]是undefined

        };

        function printElement( node, pasteplain ) {
            if ( node.type == 'element' && !node.children.length && (dtd.$removeEmpty[node.tag]) && node.tag != 'a' && utils.isEmptyObject(node.attributes) && autoClearEmptyNode) {// 锚点保留
                return html;
            }
            var tag = node.tag;
            if ( pasteplain && tag == 'td' ) {
                if ( !html ) html = '';
                html += printChildren( node, pasteplain ) + '&nbsp;&nbsp;&nbsp;';
            } else {
                var attrs = printAttrs( node.attributes );
                var html = '<' + (pasteplain && transHtml[tag] ? transHtml[tag] : tag) + (attrs ? ' ' + attrs : '') + (EMPTY_TAG[tag] ? ' />' : '>');
                if ( !EMPTY_TAG[tag] ) {
                    //trace:1627 ,2070
                    //p标签为空，将不占位这里占位符不起作用，用&nbsp;或者br
                    if( tag == 'p' && !node.children.length){
                        html += browser.ie ? '&nbsp;' : '<br/>';
                    }
                    html += printChildren( node, pasteplain );
                    html += '</' + (pasteplain && transHtml[tag] ? transHtml[tag] : tag) + '>';
                }
            }

            return html;
        }

        return function ( node, pasteplain ) {
            if ( node.type == 'fragment' ) {
                return printChildren( node, pasteplain );
            } else if ( node.type == 'element' ) {
                return printElement( node, pasteplain );
            } else if ( node.type == 'text' || node.type == 'cdata' ) {
                return printData( node, dtd.$notTransContent[node.parent.tag] );
            } else if ( node.type == 'comment' ) {
                return '<!--' + node.data + '-->';
            }
            return '';
        };
    }();

    //过滤word
    var transformWordHtml = function () {

        function isWordDocument( strValue ) {
            var re = new RegExp( /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<v:)/ig );
            return re.test( strValue );
        }

        function ensureUnits( v ) {
            v = v.replace( /([\d.]+)([\w]+)?/g, function ( m, p1, p2 ) {
                return (Math.round( parseFloat( p1 ) ) || 1) + (p2 || 'px');
            } );
            return v;
        }

        function filterPasteWord( str ) {
            str = str.replace( /<!--\s*EndFragment\s*-->[\s\S]*$/, '' )
                //remove link break
                .replace( /^(\r\n|\n|\r)|(\r\n|\n|\r)$/ig, "" )
                //remove &nbsp; entities at the start of contents
                .replace( /^\s*(&nbsp;)+/ig, "" )
                //remove &nbsp; entities at the end of contents
                .replace( /(&nbsp;|<br[^>]*>)+\s*$/ig, "" )
                // Word comments like conditional comments etc
                .replace( /<!--[\s\S]*?-->/ig, "" )
                //转换图片
                .replace(/<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi,function(str){
                    //opera能自己解析出image所这里直接返回空
                    if(browser.opera){
                        return '';
                    }

                    try{
                        var width = str.match(/width:([ \d.]*p[tx])/i)[1],
                            height = str.match(/height:([ \d.]*p[tx])/i)[1],
                            src =  str.match(/src=\s*"([^"]*)"/i)[1];
                        return '<img width="'+ptToPx(width)+'" height="'+ptToPx(height)+'" src="' + src + '" />'
                    } catch(e){
                        return '';
                    }

                })
                //去掉多余的属性
                .replace( /v:\w+=["']?[^'"]+["']?/g, '' )
                // Remove comments, scripts (e.g., msoShowComment), XML tag, VML content, MS Office namespaced tags, and a few other tags
                .replace( /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi, "" )
                //convert word headers to strong
                .replace( /<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi, "<p><strong>$1</strong></p>" )
                //remove lang attribute
                .replace( /(lang)\s*=\s*([\'\"]?)[\w-]+\2/ig, "" )
                //清除多余的font不能匹配&nbsp;有可能是空格
                .replace( /<font[^>]*>\s*<\/font>/gi, '' )
                //清除多余的class
                .replace( /class\s*=\s*["']?(?:(?:MsoTableGrid)|(?:MsoListParagraph)|(?:MsoNormal(Table)?))\s*["']?/gi, '')



            //修复了原有的问题, 比如style='fontsize:"宋体"'原来的匹配失效了
            str = str.replace( /(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function( str, tag, tmp, style ) {

                var n = [],
                        i = 0,
                        s = style.replace( /^\s+|\s+$/, '' ).replace( /&quot;/gi, "'" ).split( /;\s*/g );

                // Examine each style definition within the tag's style attribute
                for ( var i = 0; i < s.length; i++ ) {
                    var v = s[i];
                    var name, value,
                            parts = v.split( ":" );

                    if ( parts.length == 2 ) {
                        name = parts[0].toLowerCase();
                        value = parts[1].toLowerCase();

                        // Translate certain MS Office styles into their CSS equivalents
                        switch ( name ) {
                            case "mso-padding-alt":
                            case "mso-padding-top-alt":
                            case "mso-padding-right-alt":
                            case "mso-padding-bottom-alt":
                            case "mso-padding-left-alt":
                            case "mso-margin-alt":
                            case "mso-margin-top-alt":
                            case "mso-margin-right-alt":
                            case "mso-margin-bottom-alt":
                            case "mso-margin-left-alt":
                            //ie下会出现挤到一起的情况
//                            case "mso-table-layout-alt":
                            case "mso-height":
                            case "mso-width":
                            case "mso-vertical-align-alt":
                                //trace:1819 ff下会解析出padding在table上
                                if(!/<table/.test(tag))
                                    n[i] = name.replace( /^mso-|-alt$/g, "" ) + ":" + ensureUnits( value );
                                continue;
                            case "horiz-align":
                                n[i] = "text-align:" + value;
                                continue;

                            case "vert-align":
                                n[i] = "vertical-align:" + value;
                                continue;

                            case "font-color":
                            case "mso-foreground":
                                n[i] = "color:" + value;
                                continue;

                            case "mso-background":
                            case "mso-highlight":
                                n[i] = "background:" + value;
                                continue;

                            case "mso-default-height":
                                n[i] = "min-height:" + ensureUnits( value );
                                continue;

                            case "mso-default-width":
                                n[i] = "min-width:" + ensureUnits( value );
                                continue;

                            case "mso-padding-between-alt":
                                n[i] = "border-collapse:separate;border-spacing:" + ensureUnits( value );
                                continue;

                            case "text-line-through":
                                if ( (value == "single") || (value == "double") ) {
                                    n[i] = "text-decoration:line-through";
                                }
                                continue;


                            //trace:1870
//                            //word里边的字体统一干掉
//                            case 'font-family':
//                                continue;
                            case "mso-zero-height":
                                if ( value == "yes" ) {
                                    n[i] = "display:none";
                                }
                                continue;
                            case 'margin':

                                if ( !/[1-9]/.test( parts[1] ) ) {
                                    continue;
                                }
                        }

                        if ( /^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/.test( name ) ) {
//                            if ( !/mso\-list/.test( name ) )
                                continue;
                        }

                        if(/text\-indent|padding|margin/.test(name) && /\-[\d.]+/.test(value)){

                            continue;
                        }
                        n[i] = name + ":" + parts[1];
                    }
                }
                // If style attribute contained any valid styles the re-write it; otherwise delete style attribute.
                if ( i > 0 ) {
                    return tag + ' style="' + n.join( ';' ) + '"';
                } else {
                    return tag;
                }
            } );
            str = str.replace( /([ ]+)<\/span>/ig, function ( m, p ) {
                return new Array( p.length + 1 ).join( '&nbsp;' ) + '</span>';
            } );
            return str;
        }

        return function ( html ) {

            //过了word,才能转p->li
            first = null;
            parentTag = '',liStyle = '',firstTag = '';
            if ( isWordDocument( html ) ) {
                html = filterPasteWord( html );
            }
            return html.replace( />[ \t\r\n]*</g, '><' );
        };
    }();
    var NODE_NAME_MAP = {
        'text': '#text',
        'comment': '#comment',
        'cdata': '#cdata-section',
        'fragment': '#document-fragment'
    };

//    function _likeLi( node ) {
//        var a;
//        if ( node && node.tag == 'p' ) {
//            //office 2011下有效
//            if ( node.attributes['class'] == 'MsoListParagraph' || /mso-list/.test( node.attributes.style ) ) {
//                a = 1;
//            } else {
//                var firstChild = node.children[0];
//                if ( firstChild && firstChild.tag == 'span' && /Wingdings/i.test( firstChild.attributes.style ) ) {
//                    a = 1;
//                }
//            }
//        }
//        return a;
//    }

    //为p==>li 做个标志
    var first,
//            orderStyle = {
//                'decimal' : /\d+/,
//                'lower-roman': /^m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/,
//                'upper-roman': /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
//                'lower-alpha' : /^\(?[a-z]+\)?$/,
//                'upper-alpha': /^\(?[A-Z]+\)?$/
//            },
//            unorderStyle = { 'disc' : /^[l\u00B7\u2002]/, 'circle' : /^[\u006F\u00D8]/,'square' : /^[\u006E\u25C6]/},
            parentTag = '',liStyle = '',firstTag;


    //写入编辑器时，调用，进行转换操作
    function transNode( node, word_img_flag ) {

        var sizeMap = [0, 10, 12, 16, 18, 24, 32, 48],
                attr,
                indexOf = utils.indexOf;
        switch ( node.tag ) {
            case 'script':
                node.tag = 'div';
                node.attributes._ue_div_script = 1;
                node.attributes._ue_script_data = node.children[0] ? encodeURIComponent(node.children[0].data)  : '';
                node.attributes._ue_custom_node_ = 1;
                node.children = [];
                break;
            case 'style':
                node.tag = 'div';
                node.attributes._ue_div_style = 1;
                node.attributes._ue_style_data = node.children[0] ? encodeURIComponent(node.children[0].data)  : '';
                node.attributes._ue_custom_node_ = 1;
                node.children = [];
                break;
            case 'img':
                //todo base64暂时去掉，后边做远程图片上传后，干掉这个
                if(node.attributes.src && /^data:/.test(node.attributes.src)){
                    return {
                        type : 'fragment',
                        children:[]
                    }
                }
                if ( node.attributes.src && /^(?:file)/.test( node.attributes.src ) ) {
                    if ( !/(gif|bmp|png|jpg|jpeg)$/.test( node.attributes.src ) ) {
                        return {
                            type : 'fragment',
                            children:[]
                        }
                    }
                    node.attributes.word_img = node.attributes.src;
                    node.attributes.src = me.options.UEDITOR_HOME_URL + 'themes/default/images/spacer.gif';
                    var flag = parseInt(node.attributes.width)<128||parseInt(node.attributes.height)<43;
                    node.attributes.style="background:url(" + (flag? me.options.UEDITOR_HOME_URL +"themes/default/images/word.gif":me.options.langPath+me.options.lang + "/images/localimage.png")+") no-repeat center center;border:1px solid #ddd";
                    //node.attributes.style = 'width:395px;height:173px;';
                    word_img_flag && (word_img_flag.flag = 1);
                }
                if(browser.ie && browser.version < 7 )
                    node.attributes.orgSrc = node.attributes.src;
                node.attributes.data_ue_src = node.attributes.data_ue_src || node.attributes.src;
                break;
            case 'li':
                var child = node.children[0];

                if ( !child || child.type != 'element' || child.tag != 'p' && dtd.p[child.tag] ) {
                    var tmpPNode = {
                        type: 'element',
                        tag: 'p',
                        attributes: {},

                        parent : node
                    };
                    tmpPNode.children = child ? node.children :[
                            browser.ie ? {
                                type:'text',
                                data:domUtils.fillChar,
                                parent : tmpPNode

                            }:
                            {
                                type : 'element',
                                tag : 'br',
                                attributes:{},
                                closed: true,
                                children: [],
                                parent : tmpPNode
                            }
                    ];
                    node.children =   [tmpPNode];
                }
                break;
            case 'table':
            case 'td':
                optStyle( node );
                break;
            case 'a'://锚点，a==>img
                if ( node.attributes['anchorname'] ) {
                    node.tag = 'img';
                    node.attributes = {
                        'class' : 'anchorclass',
                        'anchorname':node.attributes['name']
                    };
                    node.closed = 1;
                }
                node.attributes.href && (node.attributes.data_ue_src = node.attributes.href);
                break;
            case 'b':
                node.tag = node.name = 'strong';
                break;
            case 'i':
                node.tag = node.name = 'em';
                break;
            case 'u':
                node.tag = node.name = 'span';
                node.attributes.style = (node.attributes.style || '') + ';text-decoration:underline;';
                break;
            case 's':
            case 'del':
                node.tag = node.name = 'span';
                node.attributes.style = (node.attributes.style || '') + ';text-decoration:line-through;';
                if ( node.children.length == 1 ) {
                    child = node.children[0];
                    if ( child.tag == node.tag ) {
                        node.attributes.style += ";" + child.attributes.style;
                        node.children = child.children;

                    }
                }
                break;
            case 'span':
//                if ( /mso-list/.test( node.attributes.style ) ) {
//
//
//                    //判断了两次就不在判断了
//                    if ( firstTag != 'end' ) {
//
//                        var ci = node.children[0],p;
//                        while ( ci.type == 'element' ) {
//                            ci = ci.children[0];
//                        }
//                        for ( p in unorderStyle ) {
//                            if ( unorderStyle[p].test( ci.data ) ) {
//
//                                // ci.data = ci.data.replace(unorderStyle[p],'');
//                                parentTag = 'ul';
//                                liStyle = p;
//                                break;
//                            }
//                        }
//
//
//                        if ( !parentTag ) {
//                            for ( p in orderStyle ) {
//                                if ( orderStyle[p].test( ci.data.replace( /\.$/, '' ) ) ) {
//                                    //   ci.data = ci.data.replace(orderStyle[p],'');
//                                    parentTag = 'ol';
//                                    liStyle = p;
//                                    break;
//                                }
//                            }
//                        }
//                        if ( firstTag ) {
//                            if ( ci.data == firstTag ) {
//                                if ( parentTag != 'ul' ) {
//                                    liStyle = '';
//                                }
//                                parentTag = 'ul'
//                            } else {
//                                if ( parentTag != 'ol' ) {
//                                    liStyle = '';
//                                }
//                                parentTag = 'ol'
//                            }
//                            firstTag = 'end'
//                        } else {
//                            firstTag = ci.data
//                        }
//                        if ( parentTag ) {
//                            var tmpNode = node;
//                            while ( tmpNode && tmpNode.tag != 'ul' && tmpNode.tag != 'ol' ) {
//                                tmpNode = tmpNode.parent;
//                            }
//                            if(tmpNode ){
//                                  tmpNode.tag = parentTag;
//                                tmpNode.attributes.style = 'list-style-type:' + liStyle;
//                            }
//
//
//
//                        }
//
//                    }
//
//                    node = {
//                        type : 'fragment',
//                        children : []
//                    };
//                    break;
//
//
//                }
                var style = node.attributes.style;
                if ( style ) {
                    if ( !node.attributes.style  || browser.webkit && style == "white-space:nowrap;") {
                        delete node.attributes.style;
                    }
                }

                //针对ff3.6span的样式不能正确继承的修复

                if(browser.gecko && browser.version <= 10902 && node.parent){
                    var parent = node.parent;
                    if(parent.tag == 'span' && parent.attributes && parent.attributes.style){
                        node.attributes.style = parent.attributes.style + ';' + node.attributes.style;
                    }
                }
                if ( utils.isEmptyObject( node.attributes ) && autoClearEmptyNode) {
                    node.type = 'fragment'
                }
                break;
            case 'font':
                node.tag = node.name = 'span';
                attr = node.attributes;
                node.attributes = {
                    'style': (attr.size ? 'font-size:' + (sizeMap[attr.size] || 12) + 'px' : '')
                    + ';' + (attr.color ? 'color:'+ attr.color : '')
                    + ';' + (attr.face ? 'font-family:'+ attr.face : '')
                    + ';' + (attr.style||'')
                };

                while(node.parent.tag == node.tag && node.parent.children.length == 1){
                    node.attributes.style && (node.parent.attributes.style ? (node.parent.attributes.style += ";" + node.attributes.style) : (node.parent.attributes.style = node.attributes.style));
                    node.parent.children = node.children;
                    node = node.parent;

                }
                break;
            case 'p':
                if ( node.attributes.align ) {
                    node.attributes.style = (node.attributes.style || '') + ';text-align:' +
                            node.attributes.align + ';';
                    delete node.attributes.align;
                }

//                if ( _likeLi( node ) ) {
//
//                    if ( !first ) {
//
//                        var ulNode = {
//                            type: 'element',
//                            tag: 'ul',
//                            attributes: {},
//                            children: []
//                        },
//                                index = indexOf( node.parent.children, node );
//                        node.parent.children[index] = ulNode;
//                        ulNode.parent = node.parent;
//                        ulNode.children[0] = node;
//                        node.parent = ulNode;
//
//                        while ( 1 ) {
//                            node = ulNode.parent.children[index + 1];
//                            if ( _likeLi( node ) ) {
//                                ulNode.children[ulNode.children.length] = node;
//                                node.parent = ulNode;
//                                ulNode.parent.children.splice( index + 1, 1 );
//
//                            } else {
//                                break;
//                            }
//                        }
//
//                        return ulNode;
//                    }
//                    node.tag = node.name = 'li';
//                    //为chrome能找到标号做的处理
//                    if ( browser.webkit ) {
//                        var span = node.children[0];
//
//                        while ( span && span.type == 'element' ) {
//                            span = span.children[0]
//                        }
//                        span && (span.parent.attributes.style = (span.parent.attributes.style || '') + ';mso-list:10');
//                    }
//
//
//                    delete node.attributes['class'];
//                    delete node.attributes.style;
//
//
//                }
        }
        return node;
    }

    function optStyle( node ) {
        if ( ie && node.attributes.style ) {
            var style = node.attributes.style;
            node.attributes.style = style.replace(/;\s*/g,';');
            node.attributes.style = node.attributes.style.replace( /^\s*|\s*$/, '' )
        }
    }
    //getContent调用转换
    function transOutNode( node ) {

        switch ( node.tag ) {
            case 'div' :
                if(node.attributes._ue_div_script){
                    node.tag = 'script';
                    node.children = [{type:'cdata',data:node.attributes._ue_script_data?decodeURIComponent(node.attributes._ue_script_data):'',parent:node}];
                    delete node.attributes._ue_div_script;
                    delete node.attributes._ue_script_data;
                    delete node.attributes._ue_custom_node_;

                }
                if(node.attributes._ue_div_style){
                    node.tag = 'style';
                    node.children = [{type:'cdata',data:node.attributes._ue_style_data?decodeURIComponent(node.attributes._ue_style_data):'',parent:node}];
                    delete node.attributes._ue_div_style;
                    delete node.attributes._ue_style_data;
                    delete node.attributes._ue_custom_node_;

                }
                break;
            case 'table':
                !node.attributes.style && delete node.attributes.style;
                if ( ie && node.attributes.style ) {

                    optStyle( node );
                }
                if(node.attributes['class'] == 'noBorderTable'){
                    delete node.attributes['class'];
                }
                break;
            case 'td':
            case 'th':
                if ( /display\s*:\s*none/i.test( node.attributes.style ) ) {
                    return {
                        type: 'fragment',
                        children: []
                    };
                }
                if ( ie && !node.children.length ) {
                    var txtNode = {
                        type: 'text',
                        data:domUtils.fillChar,
                        parent : node
                    };
                    node.children[0] = txtNode;
                }
                if ( ie && node.attributes.style ) {
                    optStyle( node );

                }
                if(node.attributes['class'] == 'selectTdClass'){
                    delete node.attributes['class']
                }
                break;
            case 'img'://锚点，img==>a
                if ( node.attributes.anchorname ) {
                    node.tag = 'a';
                    node.attributes = {
                        name : node.attributes.anchorname,
                        anchorname : 1
                    };
                    node.closed = null;
                }else{
                    if(node.attributes.data_ue_src){
                        node.attributes.src = node.attributes.data_ue_src;
                        delete node.attributes.data_ue_src;
                    }
                }
                break;

            case 'a':
                if(node.attributes.data_ue_src){
                    node.attributes.href = node.attributes.data_ue_src;
                    delete node.attributes.data_ue_src;
                }
        }

        return node;
    }

    function childrenAccept( node, visit, ctx ) {

        if ( !node.children || !node.children.length ) {
            return node;
        }
        var children = node.children;
        for ( var i = 0; i < children.length; i++ ) {
            var newNode = visit( children[i], ctx );
            if ( newNode.type == 'fragment' ) {
                var args = [i, 1];
                args.push.apply( args, newNode.children );
                children.splice.apply( children, args );
                //节点为空的就干掉，不然后边的补全操作会添加多余的节点
                if ( !children.length ) {
                    node = {
                        type: 'fragment',
                        children: []
                    }
                }
                i --;
            } else {
                children[i] = newNode;
            }
        }
        return node;
    }

    function Serialize( rules ) {
        this.rules = rules;
    }

    Serialize.prototype = {
        // NOTE: selector目前只支持tagName
        rules: null,
        // NOTE: node必须是fragment
        filter: function ( node, rules, modify ) {
            rules = rules || this.rules;
            var whiteList = rules && rules.whiteList;
            var blackList = rules && rules.blackList;

            function visitNode( node, parent ) {
                node.name = node.type == 'element' ?
                        node.tag : NODE_NAME_MAP[node.type];
                if ( parent == null ) {
                    return childrenAccept( node, visitNode, node );
                }

                if ( blackList && blackList[node.name] ) {
                    modify && (modify.flag = 1);
                    return {
                        type: 'fragment',
                        children: []
                    };
                }
                if ( whiteList ) {
                    if ( node.type == 'element' ) {
                        if ( node.name == 'img' || (node.name == 'span' && node.attributes.id == '___ie_paste_end___') || parent.type == 'fragment' ? whiteList[node.name] : whiteList[node.name] && whiteList[parent.name][node.name] ) {

                            var props;
                            if ( (props = whiteList[node.name].$) && node.attributes.id != '___ie_paste_end___' ) {
                                var oldAttrs = node.attributes;
                                var newAttrs = {};
                                for ( var k in props ) {
                                    if ( oldAttrs[k] ) {
                                        newAttrs[k] = oldAttrs[k];
                                    }
                                }
                                node.attributes = newAttrs;
                            }


                        } else {
                            //用户名的 a 标签确保加 @
                            if ( node.tag == 'a'
                              && node.attributes['data-name']
                              && node.children
                              && node.children.length == 1
                            ) {
                              if (node.children[0].type == 'text' && node.children[0].data[0] != '@') {
                                node.children[0].data = '@' + node.children[0].data
                              } else if (node.children[0].type == 'element'
                                && node.children[0].tag == 'span'
                                && node.children[0].attributes.style
                                && node.children[0].attributes.style.match(/0055a2/i)
                                && node.children[0].children
                                && node.children[0].children.length == 1
                                && node.children[0].children[0].type == 'text'
                                && node.children[0].children[0].data[0] != '@'
                              ) {
                                node.children[0].children[0].data = '@' + node.children[0].children[0].data
                              }
                            }
                            modify && (modify.flag = 1);
                            node.type = 'fragment';
                            // NOTE: 这里算是一个hack
                            node.name = parent.name;
                        }
                    } else {
                        // NOTE: 文本默认允许
                    }
                }
                if ( blackList || whiteList ) {
                    childrenAccept( node, visitNode, node );
                }
                return node;
            }

            return visitNode( node, null );
        },
        transformInput: function ( node, word_img_flag ) {

            function visitNode( node ) {
                node = transNode( node, word_img_flag );
//                if ( node.tag == 'ol' || node.tag == 'ul' ) {
//                    first = 1;
//                }
                node = childrenAccept( node, visitNode, node );
//                if ( node.tag == 'ol' || node.tag == 'ul' ) {
//                    first = 0;
//                    parentTag = '',liStyle = '',firstTag = '';
//                }
                if ( me.options.pageBreakTag && node.type == 'text' && node.data.replace( /\s/g, '' ) == me.options.pageBreakTag ) {

                    node.type = 'element';
                    node.name = node.tag = 'hr';

                    delete node.data;
                    node.attributes = {
                        'class' : 'pagebreak',
                        noshade:"noshade",
                        size:"5",
                        'unselectable' : 'on',
                        'style' : 'moz-user-select:none;-khtml-user-select: none;'
                    };

                    node.children = [];

                }
                //去掉多余的空格和换行
                if(node.type == 'text' && !dtd.$notTransContent[node.parent.tag]){
                    node.data = node.data.replace(/[\r\t\n]*/g,'')//.replace(/[ ]*$/g,'')
                }
                return node;
            }

            return visitNode( node );
        },
        transformOutput: function ( node ) {
            function visitNode( node ) {

                if ( node.tag == 'hr' && node.attributes['class'] == 'pagebreak' ) {
                    delete node.tag;
                    node.type = 'text';
                    node.data = me.options.pageBreakTag;
                    delete node.children;

                }

                node = transOutNode( node );
                if ( node.tag == 'ol' || node.tag == 'ul' ) {
                    first = 1;
                }
                node = childrenAccept( node, visitNode, node );
                if ( node.tag == 'ol' || node.tag == 'ul' ) {
                    first = 0;
                }
                return node;
            }

            return visitNode( node );
        },
        toHTML: toHTML,
        parseHTML: parseHTML,
        word: transformWordHtml
    };
    me.serialize = new Serialize( me.options.serialize || {});
    UE.serialize = new Serialize( {} );
};
///import core
///import plugins/inserthtml.js
///import plugins/undo.js
///import plugins/serialize.js
///commands 粘贴
///commandsName  PastePlain
///commandsTitle  纯文本粘贴模式
/*
 ** @description 粘贴
 * @author zhanyi
 */
(function() {
    var browser = UE.browser
    var pasteFilter = UE.pasteFilter = function(html, editor) {
        var f = editor.serialize;
        var word_img_flag = editor.paste_options.word_img_flag
        var modify_num = editor.paste_options.modify_num
        var pasteplain = editor.options.pasteplain
        if(f){
            //如果过滤出现问题，捕获它，直接插入内容，避免出现错误导致粘贴整个失败
            try{
                var node =  f.transformInput(
                            f.parseHTML(
                                //todo: 暂时不走dtd的过滤
                                f.word(html)//, true
                            ),word_img_flag
                        );
                //trace:924
                //纯文本模式也要保留段落
                node = f.filter(node,pasteplain ? {
                    whiteList: {
                        'p': {'br':1,'BR':1,'$':{}},
                        'br':{'$':{}},
                        'div':{'br':1,'BR':1,'$':{}},
                        'li':{'$':{}},
                        'img':{'$':{'height':1,'width':1,'src':1,'class':1}},
                        'span':{'br':1,'$':{'style':1,'id':1}},
                        'strong':{'br':1,'span':1}
                    },
                    blackList: {
                        'style':1,
                        'script':1,
                        'object':1
                    }
                } : null, !pasteplain ? modify_num : null);

                if(browser.webkit){
                    var length = node.children.length,
                        child;
                    while((child = node.children[length-1]) && child.tag == 'br'){
                        node.children.splice(length-1,1);
                        length = node.children.length;
                    }
                }
                html = f.toHTML(node,pasteplain)

            }catch(e){}
        }
        return html;
    };
    function getClipboardData( callback ) {

        var doc = this.document;

        if ( doc.getElementById( 'baidu_pastebin' ) ) {
            return;
        }

        var range = this.selection.getRange(),
            bk = range.createBookmark(),
            //创建剪贴的容器div
            pastebin = doc.createElement( 'div' );

        pastebin.id = 'baidu_pastebin';


        // Safari 要求div必须有内容，才能粘贴内容进来
        browser.webkit && pastebin.appendChild( doc.createTextNode( domUtils.fillChar + domUtils.fillChar ) );
        doc.body.appendChild( pastebin );
        //trace:717 隐藏的span不能得到top
        //bk.start.innerHTML = '&nbsp;';
        bk.start.style.display = '';
        pastebin.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;top:" +
            //要在现在光标平行的位置加入，否则会出现跳动的问题
            domUtils.getXY( bk.start ).y + 'px';

        range.selectNodeContents( pastebin ).select( true );

        setTimeout( function() {

            if (browser.webkit) {

                for(var i=0,pastebins = doc.querySelectorAll('#baidu_pastebin'),pi;pi=pastebins[i++];){
                    if(domUtils.isEmptyNode(pi)){
                        domUtils.remove(pi);
                    }else{
                        pastebin = pi;
                        break;
                    }
                }


            }

			try{
                pastebin.parentNode.removeChild(pastebin);
            }catch(e){}

            range.moveToBookmark( bk ).select(true);
            callback( pastebin );
        }, 0 );


    }

    UE.plugins['paste'] = function() {
        var me = this;
        var po = me.paste_options = {}
        var word_img_flag = po.word_img_flag = {flag:""};

        var pasteplain = me.options.pasteplain === true;
        var modify_num = po.modify_num = {flag:""};
        me.commands['pasteplain'] = {
            queryCommandState: function (){
                return pasteplain;
            },
            execCommand: function (){
                pasteplain = !pasteplain|0;
            },
            notNeedUndo : 1
        };

        function filter(div){

            var html;
            if ( div.firstChild ) {
                    //去掉cut中添加的边界值
                    var nodes = domUtils.getElementsByTagName(div,'span');
                    for(var i=0,ni;ni=nodes[i++];){
                        if(ni.id == '_baidu_cut_start' || ni.id == '_baidu_cut_end'){
                            domUtils.remove(ni);
                        }
                    }

                    if(browser.webkit){

                        var brs = div.querySelectorAll('div br');
                        for(var i=0,bi;bi=brs[i++];){
                            var pN = bi.parentNode;
                            if(pN.tagName == 'DIV' && pN.childNodes.length ==1){
                                pN.innerHTML = '<p><br/></p>';

                                domUtils.remove(pN);
                            }
                        }
                        var divs = div.querySelectorAll('#baidu_pastebin');
                        for(var i=0,di;di=divs[i++];){
                            var tmpP = me.document.createElement('p');
                            di.parentNode.insertBefore(tmpP,di);
                            while(di.firstChild){
                                tmpP.appendChild(di.firstChild);
                            }
                            domUtils.remove(di);
                        }



                        var metas = div.querySelectorAll('meta');
                        for(var i=0,ci;ci=metas[i++];){
                            domUtils.remove(ci);
                        }

                        var brs = div.querySelectorAll('br');
                        for(i=0;ci=brs[i++];){
                            if(/^apple-/.test(ci)){
                                domUtils.remove(ci);
                            }
                        }

                    }
                    if(browser.gecko){
                        var dirtyNodes = div.querySelectorAll('[_moz_dirty]');
                        for(i=0;ci=dirtyNodes[i++];){
                            ci.removeAttribute( '_moz_dirty' );
                        }
                    }
                    if(!browser.ie ){
                        var spans = div.querySelectorAll('span.apple-style-span');
                        for(var i=0,ci;ci=spans[i++];){
                            domUtils.remove(ci,true);
                        }
                    }


                    html = div.innerHTML;
                    if (SNB && SNB.Util && 'function' == typeof SNB.Util.parseContent) {
                      html = SNB.Util.parseContent(html, true)
                    }

                    html = pasteFilter(html, me)

                    //自定义的处理
                   html = {'html':html};

                   me.fireEvent('beforepaste',html);
                    //不用在走过滤了
                   me.execCommand( 'insertHtml',html.html,true);

	               me.fireEvent("afterpaste");

                }
        }

        me.addListener('ready',function(){
            domUtils.on(me.body,'cut',function(){

                var range = me.selection.getRange();
                if(!range.collapsed && me.undoManger){
                    me.undoManger.save();
                }

            });
            var ctrlv
            //ie下beforepaste在点击右键时也会触发，所以用监控键盘才处理
            domUtils.on(me.body, browser.ie ? 'keydown' : 'paste',function(e){
                if (browser.ie) {
                  if (!e.ctrlKey || e.keyCode != '86') {
                    return;
                  } else {
                    ctrlv = true
                  }
                }
                getClipboardData.call( me, function( div ) {
                    filter(div);
                } );
            });

            var doc = me.document
              , bk = {}
              , pb
            if (browser.ie) {
              function rf(type) {
                if (bk.start) domUtils.remove(bk.start)
                if (bk.end) domUtils.remove(bk.end)
                var divs = doc.getElementsByTagName('div')
                  , div, i
                if (divs.length) for (i=-1;div=divs[++i];) {
                  if (div.className != 'ie_pastebin') continue
                  else domUtils.remove(div)
                }
                pb = bk.start = bk.end = null
              }
              me.addListener('contentchange', rf);
              me.addListener('keyup', rf);
              me.addListener('mouseup', rf);
              me.addListener('contextmenu', function() {
                var range = me.selection.getRange()
                  , pb = doc.createElement( 'div' )
                  , contents = range.cloneContents()
                  , cihtml = ''
                  , i, node

                //以下粘贴 getClipboardData() 简化
                bk = range.createBookmark()
                doc.body.appendChild( pb );
                //trace:717 隐藏的span不能得到top
                //bk.start.innerHTML = '&nbsp;';
                bk.start.style.display = '';
                pb.className = 'ie_pastebin';
                pb.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;top:" +
                    //要在现在光标平行的位置加入，否则会出现跳动的问题
                    domUtils.getXY( bk.start ).y + 'px';

                //为右键 cut 复制内容
                if ( contents && contents.childNodes && contents.childNodes.length ) {
                  for ( i = -1, cihtml = ''; node = contents.childNodes[++i]; ) {
                    if (node.outerHTML) cihtml += node.outerHTML.match(/<span[>]*bookmark/i) ? '' : node.outerHTML
                    else cihtml += node.textContent || node.innerText || node.nodeValue || ''
                  }
                }
                pb.innerHTML = cihtml
                range.selectNodeContents( pb ).select( true );
              });

              //cut 和 copy 只差是否删除原选区内容，用 donUtils.on(me.body, ['cut', 'copy']... 会有问题
              domUtils.on(me.body, 'cut', function(){
                setTimeout(function(){
                  var range = me.selection.getRange()
                  if (!bk.start) return
                  range.moveToBookmark(bk)
                  if (!range.collapsed) range.deleteContents()
                  range.select()
                  rf()
                },0)
              })
              domUtils.on(me.body, 'copy', function(){
                setTimeout(function(){
                  var range = me.selection.getRange()
                  if (!bk.start) return
                  range.moveToBookmark(bk).select()
                  rf()
                },0)
              })
              domUtils.on(me.body, 'paste', function(ev){
                if (ctrlv) {
                  ctrlv = false
                  return
                } else if (bk.start) {
                  setTimeout(function(){
                    var b = bk
                    var range = me.selection.getRange()
                    var doc = me.document
                    var pbs = doc.getElementsByTagName('div')
                      , pb, i, html, start, node, nextNode, p
                    if (pbs.length) for (i=-1;pb=pbs[++i];) {
                      if (pb.className != 'ie_pastebin') continue
                      else if (domUtils.isEmptyNode(pb)) domUtils.remove(pb)
                      else break
                    }
                    if (pb) {
                      try{
                        pb.parentNode.removeChild(pb);
                      }catch(e){}
                      //以下粘贴简化 filter()
                      html = pb.innerHTML;
                      if (SNB && SNB.Util && 'function' == typeof SNB.Util.parseContent) {
                        html = SNB.Util.parseContent(html, true)
                      }

                      html = pasteFilter(html, me)

                      //自定义的处理
                      html = {'html':html};

                      me.fireEvent('beforepaste',html);
                      //不用在走过滤了
                      try {
                        range.moveToBookmark(bk).select()
                      }catch(e){}
                      if (range.startContainer.id == 'ie_pastebin') return alert('error')
                      me.execCommand('insertHtml',html.html,true);
                      me.fireEvent("afterpaste");
                      me.adjustHeight()
                    }
                  },0)
                }
              })
            }

        });

    };

})();
///import core
///commands 当输入内容超过编辑器高度时，编辑器自动增高
///commandsName  AutoHeight,autoHeightEnabled
///commandsTitle  自动增高
/**
 * @description 自动伸展
 * @author zhanyi
 */
UE.plugins['autoheight'] = function () {
    var me = this;
    //提供开关，就算加载也可以关闭
    me.autoHeightEnabled = me.options.autoHeightEnabled !== false ;
    if (!me.autoHeightEnabled){
        return;
    }

    var bakOverflow,
        lastHeight = 0,
        $uew,
        body,
        timer;
    var adjustHeight = me.adjustHeight = function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            var dsh = browser.ie ? body.scrollHeight : $(body).height()
            var mh = me.options.minFrameHeight || 70
            dsh = dsh > mh ? dsh : mh
            $uew.height(dsh)
        }, 50);
    }
    me.addListener('destroy', function () {
        me.removeListener('contentchange', adjustHeight);
        me.removeListener('keyup', adjustHeight);
        me.removeListener('mouseup', adjustHeight);
    });
    me.enableAutoHeight = function () {
        if(!me.autoHeightEnabled){
            return;
        }
        $uew = $(me.iframe).parent();
        body = me.document.body;
        me.autoHeightEnabled = true;
        bakOverflow = body.style.overflowY;
        body.style.overflowY = 'hidden';
        me.addListener('contentchange', adjustHeight);
        me.addListener('keyup', adjustHeight);
        me.addListener('mouseup', adjustHeight);
        //ff不给事件算得不对
        setTimeout(function () {
            adjustHeight();
        }, browser.gecko ? 100 : 0);
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.disableAutoHeight = function () {

        me.body.style.overflowY = bakOverflow || '';

        me.removeListener('contentchange', adjustHeight);
        me.removeListener('keyup', adjustHeight);
        me.removeListener('mouseup', adjustHeight);
        me.autoHeightEnabled = false;
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.addListener('ready', function () {
        me.enableAutoHeight();
        //trace:1764
        var timer;
        domUtils.on(browser.ie ? me.body : me.document,browser.webkit ? 'dragover' : 'drop',function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                adjustHeight();
            },100);

        });
        var win = domUtils.getWindow(me.document)
        domUtils.on(win, 'scroll', function () {
            win.scrollTo(0, 0)
        })
    });






};

module.exports = UE
})
