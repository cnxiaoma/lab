/*
 SeaJS - A Module Loader for the Web
 v1.2.1 | seajs.org | MIT Licensed
*/
this.seajs={_seajs:this.seajs};seajs.version="1.2.1";seajs._util={};seajs._config={debug:"",preload:[]};
(function(a){var c=Object.prototype.toString,d=Array.prototype;a.isString=function(a){return"[object String]"===c.call(a)};a.isFunction=function(a){return"[object Function]"===c.call(a)};a.isRegExp=function(a){return"[object RegExp]"===c.call(a)};a.isObject=function(a){return a===Object(a)};a.isArray=Array.isArray||function(a){return"[object Array]"===c.call(a)};a.indexOf=d.indexOf?function(a,c){return a.indexOf(c)}:function(a,c){for(var b=0;b<a.length;b++)if(a[b]===c)return b;return-1};var b=a.forEach=
d.forEach?function(a,c){a.forEach(c)}:function(a,c){for(var b=0;b<a.length;b++)c(a[b],b,a)};a.map=d.map?function(a,c){return a.map(c)}:function(a,c){var e=[];b(a,function(a,b,d){e.push(c(a,b,d))});return e};a.filter=d.filter?function(a,c){return a.filter(c)}:function(a,c){var e=[];b(a,function(a,b,d){c(a,b,d)&&e.push(a)});return e};var e=a.keys=Object.keys||function(a){var c=[],b;for(b in a)a.hasOwnProperty(b)&&c.push(b);return c};a.unique=function(a){var c={};b(a,function(a){c[a]=1});return e(c)};
a.now=Date.now||function(){return(new Date).getTime()}})(seajs._util);(function(a,c){var d=Array.prototype;a.log=function(){if("undefined"!==typeof console){var a=d.slice.call(arguments),e="log";console[a[a.length-1]]&&(e=a.pop());if("log"!==e||c.debug)a="dir"===e?a[0]:d.join.call(a," "),console[e](a)}}})(seajs._util,seajs._config);
(function(a,c,d){function b(a){a=a.match(n);return(a?a[0]:".")+"/"}function e(a){f.lastIndex=0;f.test(a)&&(a=a.replace(f,"$1/"));if(-1===a.indexOf("."))return a;for(var c=a.split("/"),b=[],e,d=0;d<c.length;d++)if(e=c[d],".."===e){if(0===b.length)throw Error("The path is invalid: "+a);b.pop()}else"."!==e&&b.push(e);return b.join("/")}function o(a){var a=e(a),c=a.charAt(a.length-1);if("/"===c)return a;"#"===c?a=a.slice(0,-1):-1===a.indexOf("?")&&!g.test(a)&&(a+=".js");0<a.indexOf(":80/")&&(a=a.replace(":80/",
"/"));return a}function k(a){if("#"===a.charAt(0))return a.substring(1);var b=c.alias;if(b&&q(a)){var e=a.split("/"),d=e[0];b.hasOwnProperty(d)&&(e[0]=b[d],a=e.join("/"))}return a}function h(a){return 0<a.indexOf("://")||0===a.indexOf("//")}function j(a){return"/"===a.charAt(0)&&"/"!==a.charAt(1)}function q(a){var c=a.charAt(0);return-1===a.indexOf("://")&&"."!==c&&"/"!==c}var n=/.*(?=\/.*$)/,f=/([^:\/])\/\/+/g,g=/\.(?:css|js)$/,l=/^(.*?\w)(?:\/|$)/,i={},d=d.location,p=d.protocol+"//"+d.host+function(a){"/"!==
a.charAt(0)&&(a="/"+a);return a}(d.pathname);0<p.indexOf("\\")&&(p=p.replace(/\\/g,"/"));a.dirname=b;a.realpath=e;a.normalize=o;a.parseAlias=k;a.parseMap=function(b){var e=c.map||[];if(!e.length)return b;for(var d=b,f=0;f<e.length;f++){var h=e[f];if(a.isArray(h)&&2===h.length){var j=h[0];if(a.isString(j)&&-1<d.indexOf(j)||a.isRegExp(j)&&j.test(d))d=d.replace(j,h[1])}else a.isFunction(h)&&(d=h(d))}d!==b&&(i[d]=b);return d};a.unParseMap=function(a){return i[a]||a};a.id2Uri=function(a,d){if(!a)return"";
a=k(a);d||(d=p);var e;h(a)?e=a:0===a.indexOf("./")||0===a.indexOf("../")?(0===a.indexOf("./")&&(a=a.substring(2)),e=b(d)+a):e=j(a)?d.match(l)[1]+a:c.base+"/"+a;return o(e)};a.isAbsolute=h;a.isRoot=j;a.isTopLevel=q;a.pageUri=p})(seajs._util,seajs._config,this);
(function(a,c){function d(a,b){a.onload=a.onerror=a.onreadystatechange=function(){n.test(a.readyState)&&(a.onload=a.onerror=a.onreadystatechange=null,a.parentNode&&!c.debug&&h.removeChild(a),a=void 0,b())}}function b(c,b){i||p?(a.log("Start poll to fetch css"),setTimeout(function(){e(c,b)},1)):c.onload=c.onerror=function(){c.onload=c.onerror=null;c=void 0;b()}}function e(a,c){var b;if(i)a.sheet&&(b=!0);else if(a.sheet)try{a.sheet.cssRules&&(b=!0)}catch(d){"NS_ERROR_DOM_SECURITY_ERR"===d.name&&(b=
!0)}setTimeout(function(){b?c():e(a,c)},1)}function o(){}var k=document,h=k.head||k.getElementsByTagName("head")[0]||k.documentElement,j=h.getElementsByTagName("base")[0],q=/\.css(?:\?|$)/i,n=/loaded|complete|undefined/,f,g;a.fetch=function(c,e,i){var k=q.test(c),g=document.createElement(k?"link":"script");i&&(i=a.isFunction(i)?i(c):i)&&(g.charset=i);e=e||o;"SCRIPT"===g.nodeName?d(g,e):b(g,e);k?(g.rel="stylesheet",g.href=c):(g.async="async",g.src=c);f=g;j?h.insertBefore(g,j):h.appendChild(g);f=null};
a.getCurrentScript=function(){if(f)return f;if(g&&"interactive"===g.readyState)return g;for(var a=h.getElementsByTagName("script"),c=0;c<a.length;c++){var b=a[c];if("interactive"===b.readyState)return g=b}};a.getScriptAbsoluteSrc=function(a){return a.hasAttribute?a.src:a.getAttribute("src",4)};a.importStyle=function(a,c){if(!c||!k.getElementById(c)){var b=k.createElement("style");c&&(b.id=c);h.appendChild(b);b.styleSheet?b.styleSheet.cssText=a:b.appendChild(k.createTextNode(a))}};var l=navigator.userAgent,
i=536>Number(l.replace(/.*AppleWebKit\/(\d+)\..*/,"$1")),p=0<l.indexOf("Firefox")&&!("onload"in document.createElement("link"))})(seajs._util,seajs._config,this);(function(a){var c=/(?:^|[^.$])\brequire\s*\(\s*(["'])([^"'\s\)]+)\1\s*\)/g;a.parseDependencies=function(d){var b=[],e,d=d.replace(/^\s*\/\*[\s\S]*?\*\/\s*$/mg,"").replace(/^\s*\/\/.*$/mg,"");for(c.lastIndex=0;e=c.exec(d);)e[2]&&b.push(e[2]);return a.unique(b)}})(seajs._util);
(function(a,c,d){function b(a,c){this.uri=a;this.status=c||0}function e(a,d){return c.isString(a)?b._resolve(a,d):c.map(a,function(a){return e(a,d)})}function o(a,e){var m=c.parseMap(a);w[m]?(f[a]=f[m],e()):p[m]?s[m].push(e):(p[m]=!0,s[m]=[e],b._fetch(m,function(){w[m]=!0;var b=f[a];b.status===i.FETCHING&&(b.status=i.FETCHED);t&&(k(a,t),t=null);r&&b.status===i.FETCHED&&(f[a]=r,r.realUri=a);r=null;p[m]&&delete p[m];s[m]&&(c.forEach(s[m],function(a){a()}),delete s[m])},d.charset))}function k(a,d){var m=
f[a]||(f[a]=new b(a));m.status<i.SAVED&&(m.id=d.id||a,m.dependencies=e(c.filter(d.dependencies||[],function(a){return!!a}),a),m.factory=d.factory,m.status=i.SAVED);return m}function h(a,c){var b=a(c.require,c.exports,c);void 0!==b&&(c.exports=b)}function j(a){var b=a.realUri||a.uri,d=g[b];d&&(c.forEach(d,function(c){h(c,a)}),delete g[b])}function q(a){var b=a.uri;return c.filter(a.dependencies,function(a){u=[b];if(a=n(f[a],b))u.push(b),c.log("Found circular dependencies:",u.join(" --\> "),void 0);
return!a})}function n(a,b){if(!a||a.status!==i.SAVED)return!1;u.push(a.uri);var d=a.dependencies;if(d.length){if(-1<c.indexOf(d,b))return!0;for(var e=0;e<d.length;e++)if(n(f[d[e]],b))return!0}return!1}var f={},g={},l=[],i={FETCHING:1,FETCHED:2,SAVED:3,READY:4,COMPILING:5,COMPILED:6};b.prototype._use=function(a,b){c.isString(a)&&(a=[a]);var d=e(a,this.uri);this._load(d,function(){var a=c.map(d,function(a){return a?f[a]._compile():null});b&&b.apply(null,a)})};b.prototype._load=function(a,d){function e(a){(a||
{}).status<i.READY&&(a.status=i.READY);0===--j&&d()}var h=c.filter(a,function(a){return a&&(!f[a]||f[a].status<i.READY)}),g=h.length;if(0===g)d();else for(var j=g,k=0;k<g;k++)(function(a){function d(){h=f[a];if(h.status>=i.SAVED){var x=q(h);x.length?b.prototype._load(x,function(){e(h)}):e(h)}else c.log("It is not a valid CMD module: "+a),e()}var h=f[a]||(f[a]=new b(a,i.FETCHING));h.status>=i.FETCHED?d():o(a,d)})(h[k])};b.prototype._compile=function(){function a(c){c=e(c,b.uri);c=f[c];if(!c)return null;
if(c.status===i.COMPILING)return c.exports;c.parent=b;return c._compile()}var b=this;if(b.status===i.COMPILED)return b.exports;if(b.status<i.READY&&!g[b.realUri||b.uri])return null;b.status=i.COMPILING;a.async=function(a,c){b._use(a,c)};a.resolve=function(a){return e(a,b.uri)};a.cache=f;b.require=a;b.exports={};var d=b.factory;c.isFunction(d)?(l.push(b),h(d,b),l.pop()):void 0!==d&&(b.exports=d);b.status=i.COMPILED;j(b);return b.exports};b._define=function(a,b,d){var h=arguments.length;1===h?(d=a,
a=void 0):2===h&&(d=b,b=void 0,c.isArray(a)&&(b=a,a=void 0));!c.isArray(b)&&c.isFunction(d)&&(b=c.parseDependencies(d.toString()));var h={id:a,dependencies:b,factory:d},g;if(document.attachEvent){var j=c.getCurrentScript();j&&(g=c.unParseMap(c.getScriptAbsoluteSrc(j)));g||c.log("Failed to derive URI from interactive script for:",d.toString(),"warn")}if(j=a?e(a):g){if(j===g){var l=f[g];l&&(l.realUri&&l.status===i.SAVED)&&(f[g]=null)}h=k(j,h);if(g){if((f[g]||{}).status===i.FETCHING)f[g]=h,h.realUri=
g}else r||(r=h)}else t=h};b._getCompilingModule=function(){return l[l.length-1]};b._find=function(a){var b=[];c.forEach(c.keys(f),function(d){if(c.isString(a)&&-1<d.indexOf(a)||c.isRegExp(a)&&a.test(d))d=f[d],d.exports&&b.push(d.exports)});return b};b._modify=function(b,c){var d=e(b),j=f[d];j&&j.status===i.COMPILED?h(c,j):(g[d]||(g[d]=[]),g[d].push(c));return a};b.STATUS=i;b._resolve=c.id2Uri;b._fetch=c.fetch;b.cache=f;var p={},w={},s={},t=null,r=null,u=[],v=new b(c.pageUri,i.COMPILED);a.use=function(c,
b){var e=d.preload;e.length?v._use(e,function(){d.preload=[];v._use(c,b)}):v._use(c,b);return a};a.define=b._define;a.cache=b.cache;a.find=b._find;a.modify=b._modify;a.pluginSDK={Module:b,util:c,config:d}})(seajs,seajs._util,seajs._config);
(function(a,c,d){var b="seajs-ts="+c.now(),e=document.getElementById("seajsnode");e||(e=document.getElementsByTagName("script"),e=e[e.length-1]);var o=c.getScriptAbsoluteSrc(e)||c.pageUri,o=c.dirname(function(a){if(a.indexOf("??")===-1)return a;var b=a.split("??"),a=b[0],b=c.filter(b[1].split(","),function(a){return a.indexOf("sea.js")!==-1});return a+b[0]}(o));c.loaderDir=o;var k=o.match(/^(.+\/)seajs\/[\d\.]+\/$/);k&&(o=k[1]);d.base=o;if(e=e.getAttribute("data-main"))d.main=e;d.charset="utf-8";
a.config=function(e){for(var j in e)if(e.hasOwnProperty(j)){var k=d[j],n=e[j];if(k&&j==="alias")for(var f in n){if(n.hasOwnProperty(f)){var g=k[f],l=n[f];/^\d+\.\d+\.\d+$/.test(l)&&(l=f+"/"+l+"/"+f);g&&g!==l&&c.log("The alias config is conflicted:","key =",'"'+f+'"',"previous =",'"'+g+'"',"current =",'"'+l+'"',"warn");k[f]=l}}else if(k&&(j==="map"||j==="preload")){c.isString(n)&&(n=[n]);c.forEach(n,function(a){a&&k.push(a)})}else d[j]=n}if((e=d.base)&&!c.isAbsolute(e))d.base=c.id2Uri((c.isRoot(e)?
"":"./")+e+"/");if(d.debug===2){d.debug=1;a.config({map:[[/^.*$/,function(a){a.indexOf("seajs-ts=")===-1&&(a=a+((a.indexOf("?")===-1?"?":"&")+b));return a}]]})}if(d.debug)a.debug=!!d.debug;return this};d.debug&&(a.debug=!!d.debug)})(seajs,seajs._util,seajs._config);
(function(a,c,d){a.log=c.log;a.importStyle=c.importStyle;a.config({alias:{seajs:c.loaderDir}});c.forEach(function(){var a=[],e=d.location.search,e=e.replace(/(seajs-\w+)(&|$)/g,"$1=1$2"),e=e+(" "+document.cookie);e.replace(/seajs-(\w+)=[1-9]/g,function(c,d){a.push(d)});return c.unique(a)}(),function(b){a.use("seajs/plugin-"+b);"debug"===b&&(a._use=a.use,a._useArgs=[],a.use=function(){a._useArgs.push(arguments);return a})})})(seajs,seajs._util,this);
(function(a,c,d){var b=a._seajs;if(b&&!b.args)d.seajs=a._seajs;else{d.define=a.define;c.main&&a.use(c.main);if(c=(b||0).args)for(var b={"0":"config",1:"use",2:"define"},e=0;e<c.length;e+=2)a[b[c[e]]].apply(a,c[e+1]);d.define.cmd={};delete a.define;delete a._util;delete a._config;delete a._seajs}})(seajs,seajs._config,this);

var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(b&&typeof b!="function"&&(typeof b!="object"||typeof b.length!="number"))throw new Error("JSON.stringify");return str("",{"":a})}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()

/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Contains: borderradius | boxshadow | cssgradients | input | inputtypes | cssclasses | testprop | testallprops | prefixes | domprefixes
 */
;window.Modernizr=function(a,b,c){function D(){e.input=function(a){for(var b=0,c=a.length;b<c;b++)s[a[b]]=a[b]in l;return s}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)l.setAttribute("type",f=a[d]),e=l.type!=="text",e&&(l.value=m,l.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&l.style.WebkitAppearance!==c?(g.appendChild(l),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(l,null).WebkitAppearance!=="textfield"&&l.offsetHeight!==0,g.removeChild(l)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=l.checkValidity&&l.checkValidity()===!1:/^color$/.test(f)?(g.appendChild(l),g.offsetWidth,e=l.value!=m,g.removeChild(l)):e=l.value!=m)),r[a[d]]=!!e;return r}("search tel url email datetime date month week time datetime-local number range color".split(" "))}function C(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+p.join(c+" ")+c).split(" ");return B(d,b)}function B(a,b){for(var d in a)if(k[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function A(a,b){return!!~(""+a).indexOf(b)}function z(a,b){return typeof a===b}function y(a,b){return x(o.join(a+";")+(b||""))}function x(a){k.cssText=a}var d="2.0.6",e={},f=!0,g=b.documentElement,h=b.head||b.getElementsByTagName("head")[0],i="modernizr",j=b.createElement(i),k=j.style,l=b.createElement("input"),m=":)",n=Object.prototype.toString,o=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),p="Webkit Moz O ms Khtml".split(" "),q={},r={},s={},t=[],u,v={}.hasOwnProperty,w;!z(v,c)&&!z(v.call,c)?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],c)},q.borderradius=function(){return C("borderRadius")},q.boxshadow=function(){return C("boxShadow")},q.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";x((a+o.join(b+a)+o.join(c+a)).slice(0,-a.length));return A(k.backgroundImage,"gradient")};for(var E in q)w(q,E)&&(u=E.toLowerCase(),e[u]=q[E](),t.push((e[u]?"":"no-")+u));e.input||D(),x(""),j=l=null,e._version=d,e._prefixes=o,e._domPrefixes=p,e.testProp=function(a){return B([a])},e.testAllProps=C,g.className=g.className.replace(/\bno-js\b/,"")+(f?" js "+t.join(" "):"");return e}(this,this.document);


/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.3",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
	assertGetIdNotName,
	Expr,
	getText,
	isXML,
	contains,
	compile,
	sortOrder,
	hasDuplicate,
	outermostContext,

	baseHasDuplicate = true,
	strundefined = "undefined",

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	Token = String,
	document = window.document,
	docElem = document.documentElement,
	dirruns = 0,
	done = 0,
	pop = [].pop,
	push = [].push,
	slice = [].slice,
	// Use a stripped-down indexOf if a native one is unavailable
	indexOf = [].indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	// Augment a function for special use by Sizzle
	markFunction = function( fn, value ) {
		fn[ expando ] = value == null || value;
		return fn;
	},

	createCache = function() {
		var cache = {},
			keys = [];

		return markFunction(function( key, value ) {
			// Only keep the most recent entries
			if ( keys.push( key ) > Expr.cacheLength ) {
				delete cache[ keys.shift() ];
			}

			// Retrieve with (key + " ") to avoid collision with native Object.prototype properties (see Issue #157)
			return (cache[ key + " " ] = value);
		}, cache );
	},

	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments not in parens/brackets,
	//   then attribute selectors and non-pseudos (denoted by :),
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

	// For matchExpr.POS and matchExpr.needsContext
	pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
		"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rnot = /^:not/,
	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"POS": new RegExp( pos, "i" ),
		"CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	// Support

	// Used for testing something on an element
	assert = function( fn ) {
		var div = document.createElement("div");

		try {
			return fn( div );
		} catch (e) {
			return false;
		} finally {
			// release memory in IE
			div = null;
		}
	},

	// Check if getElementsByTagName("*") returns only elements
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

function Sizzle( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	docElem.compareDocumentPosition ?
	function( a, b ) {
		return b && !!( a.compareDocumentPosition( b ) & 16 );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

Sizzle.attr = function( elem, name ) {
	var val,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( xml || assertAttributes ) {
		return elem.getAttribute( name );
	}
	val = elem.getAttributeNode( name );
	return val ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			val.specified ? val.value : null :
		null;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	// IE6/7 return a modified href
	attrHandle: assertHrefNotNormalized ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		},

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			},

		"NAME": assertUsableName && function( tag, context ) {
			if ( typeof context.getElementsByName !== strundefined ) {
				return context.getElementsByName( name );
			}
		},

		"CLASS": assertUsableClassName && function( className, context, xml ) {
			if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
				return context.getElementsByClassName( className );
			}
		}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var unquoted, excess;
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			if ( match[3] ) {
				match[2] = match[3];
			} else if ( (unquoted = match[4]) ) {
				// Only check arguments that contain a pseudo
				if ( rpseudo.test(unquoted) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					unquoted = unquoted.slice( 0, excess );
					match[0] = match[0].slice( 0, excess );
				}
				match[2] = unquoted;
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ expando ][ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem, context ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				return function( elem ) {
					var node, diff,
						parent = elem.parentNode;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					if ( parent ) {
						diff = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								diff++;
								if ( elem === node ) {
									break;
								}
							}
						}
					}

					// Incorporate the offset (or cast to NaN), then check against cycle size
					diff -= last;
					return diff === first || ( diff % first === 0 && diff / first >= 0 );
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
				}
			};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			var nodeType;
			elem = elem.firstChild;
			while ( elem ) {
				if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
					return false;
				}
				elem = elem.nextSibling;
			}
			return true;
		},

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputPseudo("radio"),
		"checkbox": createInputPseudo("checkbox"),
		"file": createInputPseudo("file"),
		"password": createInputPseudo("password"),
		"image": createInputPseudo("image"),

		"submit": createButtonPseudo("submit"),
		"reset": createButtonPseudo("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		},

		// Positional types
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			for ( var i = 0; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			for ( var i = 1; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

function siblingCheck( a, b, ret ) {
	if ( a === b ) {
		return ret;
	}

	var cur = a.nextSibling;

	while ( cur ) {
		if ( cur === b ) {
			return -1;
		}

		cur = cur.nextSibling;
	}

	return 1;
}

sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	} :
	function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	hasDuplicate = baseHasDuplicate;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ expando ][ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			tokens.push( matched = new Token( match.shift() ) );
			soFar = soFar.slice( matched.length );

			// Cast descendant combinators to space
			matched.type = match[0].replace( rtrim, " " );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {

				tokens.push( matched = new Token( match.shift() ) );
				soFar = soFar.slice( matched.length );
				matched.type = type;
				matched.matches = match;
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( checkNonElements || elem.nodeType === 1  ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( !xml ) {
				var cache,
					dirkey = dirruns + " " + doneName + " ",
					cachedkey = dirkey + cachedruns;
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( (cache = elem[ expando ]) === cachedkey ) {
							return elem.sizset;
						} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
							if ( elem.sizset ) {
								return elem;
							}
						} else {
							elem[ expando ] = cachedkey;
							if ( matcher( elem, context, xml ) ) {
								elem.sizset = true;
								return elem;
							}
							elem.sizset = false;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( matcher( elem, context, xml ) ) {
							return elem;
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && tokens.join("")
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Nested matchers should use non-integer dirruns
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = superMatcher.el;
			}

			// Add elements passing elementMatchers directly to results
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++superMatcher.el;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	superMatcher.el = 0;
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ expando ][ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed, xml ) {
	var i, tokens, token, type, find,
		match = tokenize( selector ),
		j = match.length;

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !xml &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().length );
			}

			// Fetch a seed set for right-to-left matching
			for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( rbackslash, "" ),
						rsibling.test( tokens[0].type ) && context.parentNode || context,
						xml
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && tokens.join("");
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		xml,
		results,
		rsibling.test( selector )
	);
	return results;
}

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

			// qSa(:focus) reports false when true (Chrome 21), no need to also add to buggyMatches since matches checks buggyQSA
			// A support test would require too much code (would include document ready)
			rbuggyQSA = [ ":focus" ],

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [ ":active" ],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'/>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		// rbuggyQSA always contains :focus, so no need for a length check
		rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && !rbuggyQSA.test( selector ) ) {
				var groups, i,
					old = true,
					nid = expando,
					newContext = context,
					newSelector = context.nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + groups[i].join("");
					}
					newContext = rsibling.test( selector ) && context.parentNode || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							newSelector
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( "!=", pseudos );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active and :focus, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && !rbuggyQSA.test( expr ) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rcheckableType = /^(?:checkbox|radio)$/,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
		}
	},

	after: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( !isDisconnected( this[0] ) ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		}

		return this.length ?
			this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
			this;
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = [].concat.apply( [], args );

		var results, first, fragment, iNoClone,
			i = 0,
			value = args[0],
			scripts = [],
			l = this.length;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call( this, i, table ? self.html() : undefined );
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			results = jQuery.buildFragment( args, this, scripts );
			fragment = results.fragment;
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				// Fragments from the fragment cache must always be cloned and never used in place.
				for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						i === iNoClone ?
							fragment :
							jQuery.clone( fragment, true, true )
					);
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						if ( jQuery.ajax ) {
							jQuery.ajax({
								url: elem.src,
								type: "GET",
								dataType: "script",
								async: false,
								global: false,
								"throws": true
							});
						} else {
							jQuery.error("no ajax");
						}
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	if ( nodeName === "object" ) {
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
	var fragment, cacheable, cachehit,
		first = args[ 0 ];

	// Set context from what may come in as undefined or a jQuery collection or a node
	// Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
	// also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
	context = context || document;
	context = !context.nodeType && context[0] || context;
	context = context.ownerDocument || context;

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		// Mark cacheable and look for a hit
		cacheable = true;
		fragment = jQuery.fragments[ first ];
		cachehit = fragment !== undefined;
	}

	if ( !fragment ) {
		fragment = context.createDocumentFragment();
		jQuery.clean( args, context, fragment, scripts );

		// Update the cache, but only store false
		// unless this is a second parsing of the same content
		if ( cacheable ) {
			jQuery.fragments[ first ] = cachehit && fragment;
		}
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			l = insert.length,
			parent = this.length === 1 && this[0].parentNode;

		if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
			insert[ original ]( this[0] );
			return this;
		} else {
			for ( ; i < l; i++ ) {
				elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			clone;

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
			safe = context === document && safeFragment,
			ret = [];

		// Ensure that context is a document
		if ( !context || typeof context.createDocumentFragment === "undefined" ) {
			context = document;
		}

		// Use the already-created safe fragment if context permits
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Ensure a safe container in which to render the html
					safe = safe || createSafeFragment( context );
					div = context.createElement("div");
					safe.appendChild( div );

					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Go to html and back, then peel off extra wrappers
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					depth = wrap[0];
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Take out of fragment container (we need a fresh div each time)
					div.parentNode.removeChild( div );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				jQuery.merge( ret, elem );
			}
		}

		// Fix #11356: Clear elements from safeFragment
		if ( div ) {
			elem = div = safe = null;
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
					fixDefaultChecked( elem );
				} else if ( typeof elem.getElementsByTagName !== "undefined" ) {
					jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
				}
			}
		}

		// Append elements to a provided document fragment
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( elem.removeAttribute ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						jQuery.deletedIds.push( id );
					}
				}
			}
		}
	}
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

	eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem, display,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {
			display = curCSS( elem, "display" );

			if ( !values[ index ] && display !== "none" ) {
				jQuery._data( elem, "olddisplay", display );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state, fn2 ) {
		var bool = typeof state === "boolean";

		if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
			return eventsToggle.apply( this, arguments );
		}

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, numeric, extra ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( numeric || extra !== undefined ) {
			num = parseFloat( val );
			return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	curCSS = function( elem, name ) {
		var ret, width, minWidth, maxWidth,
			computed = window.getComputedStyle( elem, null ),
			style = elem.style;

		if ( computed ) {

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			// we use jQuery.css instead of curCSS here
			// because of the reliableMarginRight CSS hook!
			val += jQuery.css( elem, extra + cssExpand[ i ], true );
		}

		// From this point on we use curCSS for maximum performance (relevant in animations)
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		valueIsBorderBox = true,
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox
		)
	) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	if ( elemdisplay[ nodeName ] ) {
		return elemdisplay[ nodeName ];
	}

	var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
		display = elem.css("display");
	elem.remove();

	// If the simple way fails,
	// get element's real default display by attaching it to a temp iframe
	if ( display === "none" || display === "" ) {
		// Use the already-created iframe if possible
		iframe = document.body.appendChild(
			iframe || jQuery.extend( document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			})
		);

		// Create a cacheable copy of the iframe document on first call.
		// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
		// document to it; WebKit & Firefox won't allow reusing the iframe document.
		if ( !iframeDoc || !iframe.createElement ) {
			iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
			iframeDoc.write("<!doctype html><html><body>");
			iframeDoc.close();
		}

		elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

		display = curCSS( elem, "display" );
		document.body.removeChild( iframe );
	}

	// Store the correct default display
	elemdisplay[ nodeName ] = display;

	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				} else {
					return getWidthOrHeight( elem, name, extra );
				}
			}
		},

		set: function( elem, value, extra ) {
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
				style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "marginRight" );
					}
				});
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						var ret = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType, list, placeBefore,
			dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
			i = 0,
			length = dataTypes.length;

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var selection,
		list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters );

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	// Don't do a request if no elements are being requested
	if ( !this.length ) {
		return this;
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// Request the remote document
	jQuery.ajax({
		url: url,

		// if "type" variable is undefined, then "GET" method will be used
		type: type,
		dataType: "html",
		data: params,
		complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
		}
	}).done(function( responseText ) {

		// Save response for use in complete callback
		response = arguments;

		// See if a selector was specified
		self.html( selector ?

			// Create a dummy div to hold the results
			jQuery("<div>")

				// inject the contents of the document in, removing the scripts
				// to avoid any 'Permission Denied' errors in IE
				.append( responseText.replace( rscript, "" ) )

				// Locate the specified elements
				.find( selector ) :

			// If not, just inject the full result
			responseText );

	});

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // ifModified key
			ifModifiedKey,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || strAbort;
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ ifModifiedKey ] = modified;
					}
					modified = jqXHR.getResponseHeader("Etag");
					if ( modified ) {
						jQuery.etag[ ifModifiedKey ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.always( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();

		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ],
		converters = {},
		i = 0;

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
var oldCallbacks = [],
	rquestion = /\?/,
	rjsonp = /(=)\?(?=&|$)|\?\?/,
	nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		data = s.data,
		url = s.url,
		hasCallback = s.jsonp !== false,
		replaceInUrl = hasCallback && rjsonp.test( url ),
		replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
			!( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
			rjsonp.test( data );

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		overwritten = window[ callbackName ];

		// Insert callback into url or form data
		if ( replaceInUrl ) {
			s.url = url.replace( rjsonp, "$1" + callbackName );
		} else if ( replaceInData ) {
			s.data = data.replace( rjsonp, "$1" + callbackName );
		} else if ( hasCallback ) {
			s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});
var xhrCallbacks,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( e ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback, 0 );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	}, 0 );
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing any value as a 4th parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, false, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ||
			// special check for .toggle( handler, handler, ... )
			( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations resolve immediately
				if ( empty ) {
					anim.stop( true );
				}
			};

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	if ( (body = doc.body) === elem ) {
		return jQuery.offset.bodyOffset( elem );
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	return {
		top: box.top  + scrollTop  - clientTop,
		left: box.left + scrollLeft - clientLeft
	};
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.body;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, value, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define('SNB.lib.bundle.js', [], function (require, exports, module) { return jQuery; } );
}

})( window );

/*! jQuery UI - v1.9.2 - 2012-12-05
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.resizable.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js
* Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
  runiqueId = /^ui-id-\d+$/;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
  return;
}

$.extend( $.ui, {
  version: "1.9.2",

  keyCode: {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
  }
});

// plugins
$.fn.extend({
  _focus: $.fn.focus,
  focus: function( delay, fn ) {
    return typeof delay === "number" ?
      this.each(function() {
        var elem = this;
        setTimeout(function() {
          $( elem ).focus();
          if ( fn ) {
            fn.call( elem );
          }
        }, delay );
      }) :
      this._focus.apply( this, arguments );
  },

  scrollParent: function() {
    var scrollParent;
    if (($.ui.ie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
      scrollParent = this.parents().filter(function() {
        return (/(relative|absolute|fixed)/).test($.css(this,'position')) && (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
      }).eq(0);
    } else {
      scrollParent = this.parents().filter(function() {
        return (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
      }).eq(0);
    }

    return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
  },

  zIndex: function( zIndex ) {
    if ( zIndex !== undefined ) {
      return this.css( "zIndex", zIndex );
    }

    if ( this.length ) {
      var elem = $( this[ 0 ] ), position, value;
      while ( elem.length && elem[ 0 ] !== document ) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = elem.css( "position" );
        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
          // IE returns 0 when zIndex is not specified
          // other browsers return a string
          // we ignore the case of nested elements with an explicit value of 0
          // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
          value = parseInt( elem.css( "zIndex" ), 10 );
          if ( !isNaN( value ) && value !== 0 ) {
            return value;
          }
        }
        elem = elem.parent();
      }
    }

    return 0;
  },

  uniqueId: function() {
    return this.each(function() {
      if ( !this.id ) {
        this.id = "ui-id-" + (++uuid);
      }
    });
  },

  removeUniqueId: function() {
    return this.each(function() {
      if ( runiqueId.test( this.id ) ) {
        $( this ).removeAttr( "id" );
      }
    });
  }
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
  var map, mapName, img,
    nodeName = element.nodeName.toLowerCase();
  if ( "area" === nodeName ) {
    map = element.parentNode;
    mapName = map.name;
    if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
      return false;
    }
    img = $( "img[usemap=#" + mapName + "]" )[0];
    return !!img && visible( img );
  }
  return ( /input|select|textarea|button|object/.test( nodeName ) ?
    !element.disabled :
    "a" === nodeName ?
      element.href || isTabIndexNotNaN :
      isTabIndexNotNaN) &&
    // the element and all of its ancestors must be visible
    visible( element );
}

function visible( element ) {
  return $.expr.filters.visible( element ) &&
    !$( element ).parents().andSelf().filter(function() {
      return $.css( this, "visibility" ) === "hidden";
    }).length;
}

$.extend( $.expr[ ":" ], {
  data: $.expr.createPseudo ?
    $.expr.createPseudo(function( dataName ) {
      return function( elem ) {
        return !!$.data( elem, dataName );
      };
    }) :
    // support: jQuery <1.8
    function( elem, i, match ) {
      return !!$.data( elem, match[ 3 ] );
    },

  focusable: function( element ) {
    return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
  },

  tabbable: function( element ) {
    var tabIndex = $.attr( element, "tabindex" ),
      isTabIndexNaN = isNaN( tabIndex );
    return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
  }
});

// support
$(function() {
  var body = document.body,
    div = body.appendChild( div = document.createElement( "div" ) );

  // access offsetHeight before setting the style to prevent a layout bug
  // in IE 9 which causes the element to continue to take up space even
  // after it is removed from the DOM (#8026)
  div.offsetHeight;

  $.extend( div.style, {
    minHeight: "100px",
    height: "auto",
    padding: 0,
    borderWidth: 0
  });

  $.support.minHeight = div.offsetHeight === 100;
  $.support.selectstart = "onselectstart" in div;

  // set display to none to avoid a layout bug in IE
  // http://dev.jquery.com/ticket/4014
  body.removeChild( div ).style.display = "none";
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
  $.each( [ "Width", "Height" ], function( i, name ) {
    var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
      type = name.toLowerCase(),
      orig = {
        innerWidth: $.fn.innerWidth,
        innerHeight: $.fn.innerHeight,
        outerWidth: $.fn.outerWidth,
        outerHeight: $.fn.outerHeight
      };

    function reduce( elem, size, border, margin ) {
      $.each( side, function() {
        size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
        if ( border ) {
          size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
        }
        if ( margin ) {
          size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
        }
      });
      return size;
    }

    $.fn[ "inner" + name ] = function( size ) {
      if ( size === undefined ) {
        return orig[ "inner" + name ].call( this );
      }

      return this.each(function() {
        $( this ).css( type, reduce( this, size ) + "px" );
      });
    };

    $.fn[ "outer" + name] = function( size, margin ) {
      if ( typeof size !== "number" ) {
        return orig[ "outer" + name ].call( this, size );
      }

      return this.each(function() {
        $( this).css( type, reduce( this, size, true, margin ) + "px" );
      });
    };
  });
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
  $.fn.removeData = (function( removeData ) {
    return function( key ) {
      if ( arguments.length ) {
        return removeData.call( this, $.camelCase( key ) );
      } else {
        return removeData.call( this );
      }
    };
  })( $.fn.removeData );
}





// deprecated

(function() {
  var uaMatch = /msie ([\w.]+)/.exec( navigator.userAgent.toLowerCase() ) || [];
  $.ui.ie = uaMatch.length ? true : false;
  $.ui.ie6 = parseFloat( uaMatch[ 1 ], 10 ) === 6;
})();

$.fn.extend({
  disableSelection: function() {
    return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
      ".ui-disableSelection", function( event ) {
        event.preventDefault();
      });
  },

  enableSelection: function() {
    return this.unbind( ".ui-disableSelection" );
  }
});

$.extend( $.ui, {
  // $.ui.plugin is deprecated.  Use the proxy pattern instead.
  plugin: {
    add: function( module, option, set ) {
      var i,
        proto = $.ui[ module ].prototype;
      for ( i in set ) {
        proto.plugins[ i ] = proto.plugins[ i ] || [];
        proto.plugins[ i ].push( [ option, set[ i ] ] );
      }
    },
    call: function( instance, name, args ) {
      var i,
        set = instance.plugins[ name ];
      if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
        return;
      }

      for ( i = 0; i < set.length; i++ ) {
        if ( instance.options[ set[ i ][ 0 ] ] ) {
          set[ i ][ 1 ].apply( instance.element, args );
        }
      }
    }
  },

  contains: $.contains,

  // only used by resizable
  hasScroll: function( el, a ) {

    //If overflow is hidden, the element might have extra content, but the user wants to hide it
    if ( $( el ).css( "overflow" ) === "hidden") {
      return false;
    }

    var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
      has = false;

    if ( el[ scroll ] > 0 ) {
      return true;
    }

    // TODO: determine which cases actually cause this to happen
    // if the element doesn't have the scroll set, see if it's possible to
    // set the scroll
    el[ scroll ] = 1;
    has = ( el[ scroll ] > 0 );
    el[ scroll ] = 0;
    return has;
  },

  // these are odd functions, fix the API or move into individual plugins
  isOverAxis: function( x, reference, size ) {
    //Determines when x coordinate is over "b" element axis
    return ( x > reference ) && ( x < ( reference + size ) );
  },
  isOver: function( y, x, top, left, height, width ) {
    //Determines when x, y coordinates is over "b" element
    return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
  }
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
  slice = Array.prototype.slice,
  _cleanData = $.cleanData;
$.cleanData = function( elems ) {
  for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
    try {
      $( elem ).triggerHandler( "remove" );
    // http://bugs.jquery.com/ticket/8235
    } catch( e ) {}
  }
  _cleanData( elems );
};

$.widget = function( name, base, prototype ) {
  var fullName, existingConstructor, constructor, basePrototype,
    namespace = name.split( "." )[ 0 ];

  name = name.split( "." )[ 1 ];
  fullName = namespace + "-" + name;

  if ( !prototype ) {
    prototype = base;
    base = $.Widget;
  }

  // create selector for plugin
  $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
    return !!$.data( elem, fullName );
  };

  $[ namespace ] = $[ namespace ] || {};
  existingConstructor = $[ namespace ][ name ];
  constructor = $[ namespace ][ name ] = function( options, element ) {
    // allow instantiation without "new" keyword
    if ( !this._createWidget ) {
      return new constructor( options, element );
    }

    // allow instantiation without initializing for simple inheritance
    // must use "new" keyword (the code above always passes args)
    if ( arguments.length ) {
      this._createWidget( options, element );
    }
  };
  // extend with the existing constructor to carry over any static properties
  $.extend( constructor, existingConstructor, {
    version: prototype.version,
    // copy the object used to create the prototype in case we need to
    // redefine the widget later
    _proto: $.extend( {}, prototype ),
    // track widgets that inherit from this widget in case this widget is
    // redefined after a widget inherits from it
    _childConstructors: []
  });

  basePrototype = new base();
  // we need to make the options hash a property directly on the new instance
  // otherwise we'll modify the options hash on the prototype that we're
  // inheriting from
  basePrototype.options = $.widget.extend( {}, basePrototype.options );
  $.each( prototype, function( prop, value ) {
    if ( $.isFunction( value ) ) {
      prototype[ prop ] = (function() {
        var _super = function() {
            return base.prototype[ prop ].apply( this, arguments );
          },
          _superApply = function( args ) {
            return base.prototype[ prop ].apply( this, args );
          };
        return function() {
          var __super = this._super,
            __superApply = this._superApply,
            returnValue;

          this._super = _super;
          this._superApply = _superApply;

          returnValue = value.apply( this, arguments );

          this._super = __super;
          this._superApply = __superApply;

          return returnValue;
        };
      })();
    }
  });
  constructor.prototype = $.widget.extend( basePrototype, {
    // TODO: remove support for widgetEventPrefix
    // always use the name + a colon as the prefix, e.g., draggable:start
    // don't prefix for widgets that aren't DOM-based
    widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
  }, prototype, {
    constructor: constructor,
    namespace: namespace,
    widgetName: name,
    // TODO remove widgetBaseClass, see #8155
    widgetBaseClass: fullName,
    widgetFullName: fullName
  });

  // If this widget is being redefined then we need to find all widgets that
  // are inheriting from it and redefine all of them so that they inherit from
  // the new version of this widget. We're essentially trying to replace one
  // level in the prototype chain.
  if ( existingConstructor ) {
    $.each( existingConstructor._childConstructors, function( i, child ) {
      var childPrototype = child.prototype;

      // redefine the child widget using the same prototype that was
      // originally used, but inherit from the new version of the base
      $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
    });
    // remove the list of existing child constructors from the old constructor
    // so the old child constructors can be garbage collected
    delete existingConstructor._childConstructors;
  } else {
    base._childConstructors.push( constructor );
  }

  $.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
  var input = slice.call( arguments, 1 ),
    inputIndex = 0,
    inputLength = input.length,
    key,
    value;
  for ( ; inputIndex < inputLength; inputIndex++ ) {
    for ( key in input[ inputIndex ] ) {
      value = input[ inputIndex ][ key ];
      if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
        // Clone objects
        if ( $.isPlainObject( value ) ) {
          target[ key ] = $.isPlainObject( target[ key ] ) ?
            $.widget.extend( {}, target[ key ], value ) :
            // Don't extend strings, arrays, etc. with objects
            $.widget.extend( {}, value );
        // Copy everything else by reference
        } else {
          target[ key ] = value;
        }
      }
    }
  }
  return target;
};

$.widget.bridge = function( name, object ) {
  var fullName = object.prototype.widgetFullName || name;
  $.fn[ name ] = function( options ) {
    var isMethodCall = typeof options === "string",
      args = slice.call( arguments, 1 ),
      returnValue = this;

    // allow multiple hashes to be passed on init
    options = !isMethodCall && args.length ?
      $.widget.extend.apply( null, [ options ].concat(args) ) :
      options;

    if ( isMethodCall ) {
      this.each(function() {
        var methodValue,
          instance = $.data( this, fullName );
        if ( !instance ) {
          return $.error( "cannot call methods on " + name + " prior to initialization; " +
            "attempted to call method '" + options + "'" );
        }
        if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
          return $.error( "no such method '" + options + "' for " + name + " widget instance" );
        }
        methodValue = instance[ options ].apply( instance, args );
        if ( methodValue !== instance && methodValue !== undefined ) {
          returnValue = methodValue && methodValue.jquery ?
            returnValue.pushStack( methodValue.get() ) :
            methodValue;
          return false;
        }
      });
    } else {
      this.each(function() {
        var instance = $.data( this, fullName );
        if ( instance ) {
          instance.option( options || {} )._init();
        } else {
          $.data( this, fullName, new object( options, this ) );
        }
      });
    }

    return returnValue;
  };
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
  widgetName: "widget",
  widgetEventPrefix: "",
  defaultElement: "<div>",
  options: {
    disabled: false,

    // callbacks
    create: null
  },
  _createWidget: function( options, element ) {
    element = $( element || this.defaultElement || this )[ 0 ];
    this.element = $( element );
    this.uuid = uuid++;
    this.eventNamespace = "." + this.widgetName + this.uuid;
    this.options = $.widget.extend( {},
      this.options,
      this._getCreateOptions(),
      options );

    this.bindings = $();
    this.hoverable = $();
    this.focusable = $();

    if ( element !== this ) {
      // 1.9 BC for #7810
      // TODO remove dual storage
      $.data( element, this.widgetName, this );
      $.data( element, this.widgetFullName, this );
      this._on( true, this.element, {
        remove: function( event ) {
          if ( event.target === element ) {
            this.destroy();
          }
        }
      });
      this.document = $( element.style ?
        // element within the document
        element.ownerDocument :
        // element is window or document
        element.document || element );
      this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
    }

    this._create();
    this._trigger( "create", null, this._getCreateEventData() );
    this._init();
  },
  _getCreateOptions: $.noop,
  _getCreateEventData: $.noop,
  _create: $.noop,
  _init: $.noop,

  destroy: function() {
    this._destroy();
    // we can probably remove the unbind calls in 2.0
    // all event bindings should go through this._on()
    this.element
      .unbind( this.eventNamespace )
      // 1.9 BC for #7810
      // TODO remove dual storage
      .removeData( this.widgetName )
      .removeData( this.widgetFullName )
      // support: jquery <1.6.3
      // http://bugs.jquery.com/ticket/9413
      .removeData( $.camelCase( this.widgetFullName ) );
    this.widget()
      .unbind( this.eventNamespace )
      .removeAttr( "aria-disabled" )
      .removeClass(
        this.widgetFullName + "-disabled " +
        "ui-state-disabled" );

    // clean up events and states
    this.bindings.unbind( this.eventNamespace );
    this.hoverable.removeClass( "ui-state-hover" );
    this.focusable.removeClass( "ui-state-focus" );
  },
  _destroy: $.noop,

  widget: function() {
    return this.element;
  },

  option: function( key, value ) {
    var options = key,
      parts,
      curOption,
      i;

    if ( arguments.length === 0 ) {
      // don't return a reference to the internal hash
      return $.widget.extend( {}, this.options );
    }

    if ( typeof key === "string" ) {
      // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
      options = {};
      parts = key.split( "." );
      key = parts.shift();
      if ( parts.length ) {
        curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
        for ( i = 0; i < parts.length - 1; i++ ) {
          curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
          curOption = curOption[ parts[ i ] ];
        }
        key = parts.pop();
        if ( value === undefined ) {
          return curOption[ key ] === undefined ? null : curOption[ key ];
        }
        curOption[ key ] = value;
      } else {
        if ( value === undefined ) {
          return this.options[ key ] === undefined ? null : this.options[ key ];
        }
        options[ key ] = value;
      }
    }

    this._setOptions( options );

    return this;
  },
  _setOptions: function( options ) {
    var key;

    for ( key in options ) {
      this._setOption( key, options[ key ] );
    }

    return this;
  },
  _setOption: function( key, value ) {
    this.options[ key ] = value;

    if ( key === "disabled" ) {
      this.widget()
        .toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
        .attr( "aria-disabled", value );
      this.hoverable.removeClass( "ui-state-hover" );
      this.focusable.removeClass( "ui-state-focus" );
    }

    return this;
  },

  enable: function() {
    return this._setOption( "disabled", false );
  },
  disable: function() {
    return this._setOption( "disabled", true );
  },

  _on: function( suppressDisabledCheck, element, handlers ) {
    var delegateElement,
      instance = this;

    // no suppressDisabledCheck flag, shuffle arguments
    if ( typeof suppressDisabledCheck !== "boolean" ) {
      handlers = element;
      element = suppressDisabledCheck;
      suppressDisabledCheck = false;
    }

    // no element argument, shuffle and use this.element
    if ( !handlers ) {
      handlers = element;
      element = this.element;
      delegateElement = this.widget();
    } else {
      // accept selectors, DOM elements
      element = delegateElement = $( element );
      this.bindings = this.bindings.add( element );
    }

    $.each( handlers, function( event, handler ) {
      function handlerProxy() {
        // allow widgets to customize the disabled handling
        // - disabled as an array instead of boolean
        // - disabled class as method for disabling individual parts
        if ( !suppressDisabledCheck &&
            ( instance.options.disabled === true ||
              $( this ).hasClass( "ui-state-disabled" ) ) ) {
          return;
        }
        return ( typeof handler === "string" ? instance[ handler ] : handler )
          .apply( instance, arguments );
      }

      // copy the guid so direct unbinding works
      if ( typeof handler !== "string" ) {
        handlerProxy.guid = handler.guid =
          handler.guid || handlerProxy.guid || $.guid++;
      }

      var match = event.match( /^(\w+)\s*(.*)$/ ),
        eventName = match[1] + instance.eventNamespace,
        selector = match[2];
      if ( selector ) {
        delegateElement.delegate( selector, eventName, handlerProxy );
      } else {
        element.bind( eventName, handlerProxy );
      }
    });
  },

  _off: function( element, eventName ) {
    eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
    element.unbind( eventName ).undelegate( eventName );
  },

  _delay: function( handler, delay ) {
    function handlerProxy() {
      return ( typeof handler === "string" ? instance[ handler ] : handler )
        .apply( instance, arguments );
    }
    var instance = this;
    return setTimeout( handlerProxy, delay || 0 );
  },

  _hoverable: function( element ) {
    this.hoverable = this.hoverable.add( element );
    this._on( element, {
      mouseenter: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-hover" );
      },
      mouseleave: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-hover" );
      }
    });
  },

  _focusable: function( element ) {
    this.focusable = this.focusable.add( element );
    this._on( element, {
      focusin: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-focus" );
      },
      focusout: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-focus" );
      }
    });
  },

  _trigger: function( type, event, data ) {
    var prop, orig,
      callback = this.options[ type ];

    data = data || {};
    event = $.Event( event );
    event.type = ( type === this.widgetEventPrefix ?
      type :
      this.widgetEventPrefix + type ).toLowerCase();
    // the original event may come from any element
    // so we need to reset the target on the new event
    event.target = this.element[ 0 ];

    // copy original event properties over to the new event
    orig = event.originalEvent;
    if ( orig ) {
      for ( prop in orig ) {
        if ( !( prop in event ) ) {
          event[ prop ] = orig[ prop ];
        }
      }
    }

    this.element.trigger( event, data );
    return !( $.isFunction( callback ) &&
      callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
      event.isDefaultPrevented() );
  }
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
  $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
    if ( typeof options === "string" ) {
      options = { effect: options };
    }
    var hasOptions,
      effectName = !options ?
        method :
        options === true || typeof options === "number" ?
          defaultEffect :
          options.effect || defaultEffect;
    options = options || {};
    if ( typeof options === "number" ) {
      options = { duration: options };
    }
    hasOptions = !$.isEmptyObject( options );
    options.complete = callback;
    if ( options.delay ) {
      element.delay( options.delay );
    }
    if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
      element[ method ]( options );
    } else if ( effectName !== method && element[ effectName ] ) {
      element[ effectName ]( options.duration, options.easing, callback );
    } else {
      element.queue(function( next ) {
        $( this )[ method ]();
        if ( callback ) {
          callback.call( element[ 0 ] );
        }
        next();
      });
    }
  };
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
  $.Widget.prototype._getCreateOptions = function() {
    return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
  };
}

})( jQuery );
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
  mouseHandled = false;
});

$.widget("ui.mouse", {
  version: "1.9.2",
  options: {
    cancel: 'input,textarea,button,select,option',
    distance: 1,
    delay: 0
  },
  _mouseInit: function() {
    var that = this;

    this.element
      .bind('mousedown.'+this.widgetName, function(event) {
        return that._mouseDown(event);
      })
      .bind('click.'+this.widgetName, function(event) {
        if (true === $.data(event.target, that.widgetName + '.preventClickEvent')) {
          $.removeData(event.target, that.widgetName + '.preventClickEvent');
          event.stopImmediatePropagation();
          return false;
        }
      });

    this.started = false;
  },

  // TODO: make sure destroying one instance of mouse doesn't mess with
  // other instances of mouse
  _mouseDestroy: function() {
    this.element.unbind('.'+this.widgetName);
    if ( this._mouseMoveDelegate ) {
      $(document)
        .unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
        .unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
    }
  },

  _mouseDown: function(event) {
    // don't let more than one widget handle mouseStart
    if( mouseHandled ) { return; }

    // we may have missed mouseup (out of window)
    (this._mouseStarted && this._mouseUp(event));

    this._mouseDownEvent = event;

    var that = this,
      btnIsLeft = (event.which === 1),
      // event.target.nodeName works around a bug in IE 8 with
      // disabled inputs (#7620)
      elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
    if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
      return true;
    }

    this.mouseDelayMet = !this.options.delay;
    if (!this.mouseDelayMet) {
      this._mouseDelayTimer = setTimeout(function() {
        that.mouseDelayMet = true;
      }, this.options.delay);
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted = (this._mouseStart(event) !== false);
      if (!this._mouseStarted) {
        event.preventDefault();
        return true;
      }
    }

    // Click event may never have fired (Gecko & Opera)
    if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
      $.removeData(event.target, this.widgetName + '.preventClickEvent');
    }

    // these delegates are required to keep context
    this._mouseMoveDelegate = function(event) {
      return that._mouseMove(event);
    };
    this._mouseUpDelegate = function(event) {
      return that._mouseUp(event);
    };
    $(document)
      .bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      .bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

    event.preventDefault();

    mouseHandled = true;
    return true;
  },

  _mouseMove: function(event) {
    // IE mouseup check - mouseup happened when mouse was out of window
    if ($.ui.ie && !(document.documentMode >= 9) && !event.button) {
      return this._mouseUp(event);
    }

    if (this._mouseStarted) {
      this._mouseDrag(event);
      return event.preventDefault();
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted =
        (this._mouseStart(this._mouseDownEvent, event) !== false);
      (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
    }

    return !this._mouseStarted;
  },

  _mouseUp: function(event) {
    $(document)
      .unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      .unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

    if (this._mouseStarted) {
      this._mouseStarted = false;

      if (event.target === this._mouseDownEvent.target) {
        $.data(event.target, this.widgetName + '.preventClickEvent', true);
      }

      this._mouseStop(event);
    }

    return false;
  },

  _mouseDistanceMet: function(event) {
    return (Math.max(
        Math.abs(this._mouseDownEvent.pageX - event.pageX),
        Math.abs(this._mouseDownEvent.pageY - event.pageY)
      ) >= this.options.distance
    );
  },

  _mouseDelayMet: function(event) {
    return this.mouseDelayMet;
  },

  // These are placeholder methods, to be overriden by extending plugin
  _mouseStart: function(event) {},
  _mouseDrag: function(event) {},
  _mouseStop: function(event) {},
  _mouseCapture: function(event) { return true; }
});

})(jQuery);
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
  max = Math.max,
  abs = Math.abs,
  round = Math.round,
  rhorizontal = /left|center|right/,
  rvertical = /top|center|bottom/,
  roffset = /[\+\-]\d+%?/,
  rposition = /^\w+/,
  rpercent = /%$/,
  _position = $.fn.position;

function getOffsets( offsets, width, height ) {
  return [
    parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
    parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
  ];
}
function parseCss( element, property ) {
  return parseInt( $.css( element, property ), 10 ) || 0;
}

$.position = {
  scrollbarWidth: function() {
    if ( cachedScrollbarWidth !== undefined ) {
      return cachedScrollbarWidth;
    }
    var w1, w2,
      div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
      innerDiv = div.children()[0];

    $( "body" ).append( div );
    w1 = innerDiv.offsetWidth;
    div.css( "overflow", "scroll" );

    w2 = innerDiv.offsetWidth;

    if ( w1 === w2 ) {
      w2 = div[0].clientWidth;
    }

    div.remove();

    return (cachedScrollbarWidth = w1 - w2);
  },
  getScrollInfo: function( within ) {
    var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
      overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
      hasOverflowX = overflowX === "scroll" ||
        ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
      hasOverflowY = overflowY === "scroll" ||
        ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
    return {
      width: hasOverflowX ? $.position.scrollbarWidth() : 0,
      height: hasOverflowY ? $.position.scrollbarWidth() : 0
    };
  },
  getWithinInfo: function( element ) {
    var withinElement = $( element || window ),
      isWindow = $.isWindow( withinElement[0] );
    return {
      element: withinElement,
      isWindow: isWindow,
      offset: withinElement.offset() || { left: 0, top: 0 },
      scrollLeft: withinElement.scrollLeft(),
      scrollTop: withinElement.scrollTop(),
      width: isWindow ? withinElement.width() : withinElement.outerWidth(),
      height: isWindow ? withinElement.height() : withinElement.outerHeight()
    };
  }
};

$.fn.position = function( options ) {
  if ( !options || !options.of ) {
    return _position.apply( this, arguments );
  }

  // make a copy, we don't want to modify arguments
  options = $.extend( {}, options );

  var atOffset, targetWidth, targetHeight, targetOffset, basePosition,
    target = $( options.of ),
    within = $.position.getWithinInfo( options.within ),
    scrollInfo = $.position.getScrollInfo( within ),
    targetElem = target[0],
    collision = ( options.collision || "flip" ).split( " " ),
    offsets = {};

  if ( targetElem.nodeType === 9 ) {
    targetWidth = target.width();
    targetHeight = target.height();
    targetOffset = { top: 0, left: 0 };
  } else if ( $.isWindow( targetElem ) ) {
    targetWidth = target.width();
    targetHeight = target.height();
    targetOffset = { top: target.scrollTop(), left: target.scrollLeft() };
  } else if ( targetElem.preventDefault ) {
    // force left top to allow flipping
    options.at = "left top";
    targetWidth = targetHeight = 0;
    targetOffset = { top: targetElem.pageY, left: targetElem.pageX };
  } else {
    targetWidth = target.outerWidth();
    targetHeight = target.outerHeight();
    targetOffset = target.offset();
  }
  // clone to reuse original targetOffset later
  basePosition = $.extend( {}, targetOffset );

  // force my and at to have valid horizontal and vertical positions
  // if a value is missing or invalid, it will be converted to center
  $.each( [ "my", "at" ], function() {
    var pos = ( options[ this ] || "" ).split( " " ),
      horizontalOffset,
      verticalOffset;

    if ( pos.length === 1) {
      pos = rhorizontal.test( pos[ 0 ] ) ?
        pos.concat( [ "center" ] ) :
        rvertical.test( pos[ 0 ] ) ?
          [ "center" ].concat( pos ) :
          [ "center", "center" ];
    }
    pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
    pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

    // calculate offsets
    horizontalOffset = roffset.exec( pos[ 0 ] );
    verticalOffset = roffset.exec( pos[ 1 ] );
    offsets[ this ] = [
      horizontalOffset ? horizontalOffset[ 0 ] : 0,
      verticalOffset ? verticalOffset[ 0 ] : 0
    ];

    // reduce to just the positions without the offsets
    options[ this ] = [
      rposition.exec( pos[ 0 ] )[ 0 ],
      rposition.exec( pos[ 1 ] )[ 0 ]
    ];
  });

  // normalize collision option
  if ( collision.length === 1 ) {
    collision[ 1 ] = collision[ 0 ];
  }

  if ( options.at[ 0 ] === "right" ) {
    basePosition.left += targetWidth;
  } else if ( options.at[ 0 ] === "center" ) {
    basePosition.left += targetWidth / 2;
  }

  if ( options.at[ 1 ] === "bottom" ) {
    basePosition.top += targetHeight;
  } else if ( options.at[ 1 ] === "center" ) {
    basePosition.top += targetHeight / 2;
  }

  atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
  basePosition.left += atOffset[ 0 ];
  basePosition.top += atOffset[ 1 ];

  return this.each(function() {
    var collisionPosition, using,
      elem = $( this ),
      elemWidth = elem.outerWidth(),
      elemHeight = elem.outerHeight(),
      marginLeft = parseCss( this, "marginLeft" ),
      marginTop = parseCss( this, "marginTop" ),
      collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
      collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
      position = $.extend( {}, basePosition ),
      myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

    if ( options.my[ 0 ] === "right" ) {
      position.left -= elemWidth;
    } else if ( options.my[ 0 ] === "center" ) {
      position.left -= elemWidth / 2;
    }

    if ( options.my[ 1 ] === "bottom" ) {
      position.top -= elemHeight;
    } else if ( options.my[ 1 ] === "center" ) {
      position.top -= elemHeight / 2;
    }

    position.left += myOffset[ 0 ];
    position.top += myOffset[ 1 ];

    // if the browser doesn't support fractions, then round for consistent results
    if ( !$.support.offsetFractions ) {
      position.left = round( position.left );
      position.top = round( position.top );
    }

    collisionPosition = {
      marginLeft: marginLeft,
      marginTop: marginTop
    };

    $.each( [ "left", "top" ], function( i, dir ) {
      if ( $.ui.position[ collision[ i ] ] ) {
        $.ui.position[ collision[ i ] ][ dir ]( position, {
          targetWidth: targetWidth,
          targetHeight: targetHeight,
          elemWidth: elemWidth,
          elemHeight: elemHeight,
          collisionPosition: collisionPosition,
          collisionWidth: collisionWidth,
          collisionHeight: collisionHeight,
          offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
          my: options.my,
          at: options.at,
          within: within,
          elem : elem
        });
      }
    });

    if ( $.fn.bgiframe ) {
      elem.bgiframe();
    }

    if ( options.using ) {
      // adds feedback as second argument to using callback, if present
      using = function( props ) {
        var left = targetOffset.left - position.left,
          right = left + targetWidth - elemWidth,
          top = targetOffset.top - position.top,
          bottom = top + targetHeight - elemHeight,
          feedback = {
            target: {
              element: target,
              left: targetOffset.left,
              top: targetOffset.top,
              width: targetWidth,
              height: targetHeight
            },
            element: {
              element: elem,
              left: position.left,
              top: position.top,
              width: elemWidth,
              height: elemHeight
            },
            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
          };
        if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
          feedback.horizontal = "center";
        }
        if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
          feedback.vertical = "middle";
        }
        if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
          feedback.important = "horizontal";
        } else {
          feedback.important = "vertical";
        }
        options.using.call( this, props, feedback );
      };
    }

    elem.offset( $.extend( position, { using: using } ) );
  });
};

$.ui.position = {
  fit: {
    left: function( position, data ) {
      var within = data.within,
        withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
        outerWidth = within.width,
        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
        overLeft = withinOffset - collisionPosLeft,
        overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
        newOverRight;

      // element is wider than within
      if ( data.collisionWidth > outerWidth ) {
        // element is initially over the left side of within
        if ( overLeft > 0 && overRight <= 0 ) {
          newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
          position.left += overLeft - newOverRight;
        // element is initially over right side of within
        } else if ( overRight > 0 && overLeft <= 0 ) {
          position.left = withinOffset;
        // element is initially over both left and right sides of within
        } else {
          if ( overLeft > overRight ) {
            position.left = withinOffset + outerWidth - data.collisionWidth;
          } else {
            position.left = withinOffset;
          }
        }
      // too far left -> align with left edge
      } else if ( overLeft > 0 ) {
        position.left += overLeft;
      // too far right -> align with right edge
      } else if ( overRight > 0 ) {
        position.left -= overRight;
      // adjust based on position and margin
      } else {
        position.left = max( position.left - collisionPosLeft, position.left );
      }
    },
    top: function( position, data ) {
      var within = data.within,
        withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
        outerHeight = data.within.height,
        collisionPosTop = position.top - data.collisionPosition.marginTop,
        overTop = withinOffset - collisionPosTop,
        overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
        newOverBottom;

      // element is taller than within
      if ( data.collisionHeight > outerHeight ) {
        // element is initially over the top of within
        if ( overTop > 0 && overBottom <= 0 ) {
          newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
          position.top += overTop - newOverBottom;
        // element is initially over bottom of within
        } else if ( overBottom > 0 && overTop <= 0 ) {
          position.top = withinOffset;
        // element is initially over both top and bottom of within
        } else {
          if ( overTop > overBottom ) {
            position.top = withinOffset + outerHeight - data.collisionHeight;
          } else {
            position.top = withinOffset;
          }
        }
      // too far up -> align with top
      } else if ( overTop > 0 ) {
        position.top += overTop;
      // too far down -> align with bottom edge
      } else if ( overBottom > 0 ) {
        position.top -= overBottom;
      // adjust based on position and margin
      } else {
        position.top = max( position.top - collisionPosTop, position.top );
      }
    }
  },
  flip: {
    left: function( position, data ) {
      var within = data.within,
        withinOffset = within.offset.left + within.scrollLeft,
        outerWidth = within.width,
        offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
        overLeft = collisionPosLeft - offsetLeft,
        overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
        myOffset = data.my[ 0 ] === "left" ?
          -data.elemWidth :
          data.my[ 0 ] === "right" ?
            data.elemWidth :
            0,
        atOffset = data.at[ 0 ] === "left" ?
          data.targetWidth :
          data.at[ 0 ] === "right" ?
            -data.targetWidth :
            0,
        offset = -2 * data.offset[ 0 ],
        newOverRight,
        newOverLeft;

      if ( overLeft < 0 ) {
        newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
        if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
          position.left += myOffset + atOffset + offset;
        }
      }
      else if ( overRight > 0 ) {
        newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
        if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
          position.left += myOffset + atOffset + offset;
        }
      }
    },
    top: function( position, data ) {
      var within = data.within,
        withinOffset = within.offset.top + within.scrollTop,
        outerHeight = within.height,
        offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
        collisionPosTop = position.top - data.collisionPosition.marginTop,
        overTop = collisionPosTop - offsetTop,
        overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
        top = data.my[ 1 ] === "top",
        myOffset = top ?
          -data.elemHeight :
          data.my[ 1 ] === "bottom" ?
            data.elemHeight :
            0,
        atOffset = data.at[ 1 ] === "top" ?
          data.targetHeight :
          data.at[ 1 ] === "bottom" ?
            -data.targetHeight :
            0,
        offset = -2 * data.offset[ 1 ],
        newOverTop,
        newOverBottom;
      if ( overTop < 0 ) {
        newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
        if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
          position.top += myOffset + atOffset + offset;
        }
      }
      else if ( overBottom > 0 ) {
        newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
        if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
          position.top += myOffset + atOffset + offset;
        }
      }
    }
  },
  flipfit: {
    left: function() {
      $.ui.position.flip.left.apply( this, arguments );
      $.ui.position.fit.left.apply( this, arguments );
    },
    top: function() {
      $.ui.position.flip.top.apply( this, arguments );
      $.ui.position.fit.top.apply( this, arguments );
    }
  }
};

// fraction support test
(function () {
  var testElement, testElementParent, testElementStyle, offsetLeft, i,
    body = document.getElementsByTagName( "body" )[ 0 ],
    div = document.createElement( "div" );

  //Create a "fake body" for testing based on method used in jQuery.support
  testElement = document.createElement( body ? "div" : "body" );
  testElementStyle = {
    visibility: "hidden",
    width: 0,
    height: 0,
    border: 0,
    margin: 0,
    background: "none"
  };
  if ( body ) {
    $.extend( testElementStyle, {
      position: "absolute",
      left: "-1000px",
      top: "-1000px"
    });
  }
  for ( i in testElementStyle ) {
    testElement.style[ i ] = testElementStyle[ i ];
  }
  testElement.appendChild( div );
  testElementParent = body || document.documentElement;
  testElementParent.insertBefore( testElement, testElementParent.firstChild );

  div.style.cssText = "position: absolute; left: 10.7432222px;";

  offsetLeft = $( div ).offset().left;
  $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

  testElement.innerHTML = "";
  testElementParent.removeChild( testElement );
})();

// DEPRECATED
if ( $.uiBackCompat !== false ) {
  // offset option
  (function( $ ) {
    var _position = $.fn.position;
    $.fn.position = function( options ) {
      if ( !options || !options.offset ) {
        return _position.call( this, options );
      }
      var offset = options.offset.split( " " ),
        at = options.at.split( " " );
      if ( offset.length === 1 ) {
        offset[ 1 ] = offset[ 0 ];
      }
      if ( /^\d/.test( offset[ 0 ] ) ) {
        offset[ 0 ] = "+" + offset[ 0 ];
      }
      if ( /^\d/.test( offset[ 1 ] ) ) {
        offset[ 1 ] = "+" + offset[ 1 ];
      }
      if ( at.length === 1 ) {
        if ( /left|center|right/.test( at[ 0 ] ) ) {
          at[ 1 ] = "center";
        } else {
          at[ 1 ] = at[ 0 ];
          at[ 0 ] = "center";
        }
      }
      return _position.call( this, $.extend( options, {
        at: at[ 0 ] + offset[ 0 ] + " " + at[ 1 ] + offset[ 1 ],
        offset: undefined
      } ) );
    };
  }( jQuery ) );
}

}( jQuery ) );
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
  version: "1.9.2",
  widgetEventPrefix: "drag",
  options: {
    addClasses: true,
    appendTo: "parent",
    axis: false,
    connectToSortable: false,
    containment: false,
    cursor: "auto",
    cursorAt: false,
    grid: false,
    handle: false,
    helper: "original",
    iframeFix: false,
    opacity: false,
    refreshPositions: false,
    revert: false,
    revertDuration: 500,
    scope: "default",
    scroll: true,
    scrollSensitivity: 20,
    scrollSpeed: 20,
    snap: false,
    snapMode: "both",
    snapTolerance: 20,
    stack: false,
    zIndex: false
  },
  _create: function() {

    if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
      this.element[0].style.position = 'relative';

    (this.options.addClasses && this.element.addClass("ui-draggable"));
    (this.options.disabled && this.element.addClass("ui-draggable-disabled"));

    this._mouseInit();

  },

  _destroy: function() {
    this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
    this._mouseDestroy();
  },

  _mouseCapture: function(event) {

    var o = this.options;

    // among others, prevent a drag on a resizable-handle
    if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
      return false;

    //Quit if we're not on a valid handle
    this.handle = this._getHandle(event);
    if (!this.handle)
      return false;

    $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
      $('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
      .css({
        width: this.offsetWidth+"px", height: this.offsetHeight+"px",
        position: "absolute", opacity: "0.001", zIndex: 1000
      })
      .css($(this).offset())
      .appendTo("body");
    });

    return true;

  },

  _mouseStart: function(event) {

    var o = this.options;

    //Create and append the visible helper
    this.helper = this._createHelper(event);

    this.helper.addClass("ui-draggable-dragging");

    //Cache the helper size
    this._cacheHelperProportions();

    //If ddmanager is used for droppables, set the global draggable
    if($.ui.ddmanager)
      $.ui.ddmanager.current = this;

    /*
     * - Position generation -
     * This block generates everything position related - it's the core of draggables.
     */

    //Cache the margins of the original element
    this._cacheMargins();

    //Store the helper's css position
    this.cssPosition = this.helper.css("position");
    this.scrollParent = this.helper.scrollParent();

    //The element's absolute position on the page minus margins
    this.offset = this.positionAbs = this.element.offset();
    this.offset = {
      top: this.offset.top - this.margins.top,
      left: this.offset.left - this.margins.left
    };

    $.extend(this.offset, {
      click: { //Where the click happened, relative to the element
        left: event.pageX - this.offset.left,
        top: event.pageY - this.offset.top
      },
      parent: this._getParentOffset(),
      relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
    });

    //Generate the original position
    this.originalPosition = this.position = this._generatePosition(event);
    this.originalPageX = event.pageX;
    this.originalPageY = event.pageY;

    //Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
    (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

    //Set a containment if given in the options
    if(o.containment)
      this._setContainment();

    //Trigger event + callbacks
    if(this._trigger("start", event) === false) {
      this._clear();
      return false;
    }

    //Recache the helper size
    this._cacheHelperProportions();

    //Prepare the droppable offsets
    if ($.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(this, event);


    this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

    //If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
    if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);

    return true;
  },

  _mouseDrag: function(event, noPropagation) {

    //Compute the helpers position
    this.position = this._generatePosition(event);
    this.positionAbs = this._convertPositionTo("absolute");

    //Call plugins and callbacks and use the resulting position if something is returned
    if (!noPropagation) {
      var ui = this._uiHash();
      if(this._trigger('drag', event, ui) === false) {
        this._mouseUp({});
        return false;
      }
      this.position = ui.position;
    }

    if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
    if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
    if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

    return false;
  },

  _mouseStop: function(event) {

    //If we are using droppables, inform the manager about the drop
    var dropped = false;
    if ($.ui.ddmanager && !this.options.dropBehaviour)
      dropped = $.ui.ddmanager.drop(this, event);

    //if a drop comes from outside (a sortable)
    if(this.dropped) {
      dropped = this.dropped;
      this.dropped = false;
    }

    //if the original element is no longer in the DOM don't bother to continue (see #8269)
    var element = this.element[0], elementInDom = false;
    while ( element && (element = element.parentNode) ) {
      if (element == document ) {
        elementInDom = true;
      }
    }
    if ( !elementInDom && this.options.helper === "original" )
      return false;

    if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
      var that = this;
      $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
        if(that._trigger("stop", event) !== false) {
          that._clear();
        }
      });
    } else {
      if(this._trigger("stop", event) !== false) {
        this._clear();
      }
    }

    return false;
  },

  _mouseUp: function(event) {
    //Remove frame helpers
    $("div.ui-draggable-iframeFix").each(function() {
      this.parentNode.removeChild(this);
    });

    //If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
    if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);

    return $.ui.mouse.prototype._mouseUp.call(this, event);
  },

  cancel: function() {

    if(this.helper.is(".ui-draggable-dragging")) {
      this._mouseUp({});
    } else {
      this._clear();
    }

    return this;

  },

  _getHandle: function(event) {

    var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
    $(this.options.handle, this.element)
      .find("*")
      .andSelf()
      .each(function() {
        if(this == event.target) handle = true;
      });

    return handle;

  },

  _createHelper: function(event) {

    var o = this.options;
    var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

    if(!helper.parents('body').length)
      helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

    if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
      helper.css("position", "absolute");

    return helper;

  },

  _adjustOffsetFromHelper: function(obj) {
    if (typeof obj == 'string') {
      obj = obj.split(' ');
    }
    if ($.isArray(obj)) {
      obj = {left: +obj[0], top: +obj[1] || 0};
    }
    if ('left' in obj) {
      this.offset.click.left = obj.left + this.margins.left;
    }
    if ('right' in obj) {
      this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
    }
    if ('top' in obj) {
      this.offset.click.top = obj.top + this.margins.top;
    }
    if ('bottom' in obj) {
      this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
    }
  },

  _getParentOffset: function() {

    //Get the offsetParent and cache its position
    this.offsetParent = this.helper.offsetParent();
    var po = this.offsetParent.offset();

    // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
    if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
    || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
      po = { top: 0, left: 0 };

    return {
      top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
    };

  },

  _getRelativeOffset: function() {

    if(this.cssPosition == "relative") {
      var p = this.element.position();
      return {
        top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
        left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
      };
    } else {
      return { top: 0, left: 0 };
    }

  },

  _cacheMargins: function() {
    this.margins = {
      left: (parseInt(this.element.css("marginLeft"),10) || 0),
      top: (parseInt(this.element.css("marginTop"),10) || 0),
      right: (parseInt(this.element.css("marginRight"),10) || 0),
      bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
    };
  },

  _cacheHelperProportions: function() {
    this.helperProportions = {
      width: this.helper.outerWidth(),
      height: this.helper.outerHeight()
    };
  },

  _setContainment: function() {

    var o = this.options;
    if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
    if(o.containment == 'document' || o.containment == 'window') this.containment = [
      o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
      o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
      (o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
      (o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
    ];

    if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
      var c = $(o.containment);
      var ce = c[0]; if(!ce) return;
      var co = c.offset();
      var over = ($(ce).css("overflow") != 'hidden');

      this.containment = [
        (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
        (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
        (over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
        (over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
      ];
      this.relative_container = c;

    } else if(o.containment.constructor == Array) {
      this.containment = o.containment;
    }

  },

  _convertPositionTo: function(d, pos) {

    if(!pos) pos = this.position;
    var mod = d == "absolute" ? 1 : -1;
    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

    return {
      top: (
        pos.top                                 // The absolute mouse position
        + this.offset.relative.top * mod                    // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.top * mod                      // The offsetParent's offset without borders (offset + border)
        - ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
      ),
      left: (
        pos.left                                // The absolute mouse position
        + this.offset.relative.left * mod                   // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.left * mod                     // The offsetParent's offset without borders (offset + border)
        - ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
      )
    };

  },

  _generatePosition: function(event) {

    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
    var pageX = event.pageX;
    var pageY = event.pageY;

    /*
     * - Position constraining -
     * Constrain the position to a mix of grid, containment.
     */

    if(this.originalPosition) { //If we are not dragging yet, we won't check for options
      var containment;
      if(this.containment) {
      if (this.relative_container){
        var co = this.relative_container.offset();
        containment = [ this.containment[0] + co.left,
          this.containment[1] + co.top,
          this.containment[2] + co.left,
          this.containment[3] + co.top ];
      }
      else {
        containment = this.containment;
      }

        if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
        if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
        if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
        if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
      }

      if(o.grid) {
        //Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
        var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
        pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

        var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
        pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
      }

    }

    return {
      top: (
        pageY                               // The absolute mouse position
        - this.offset.click.top                         // Click offset (relative to the element)
        - this.offset.relative.top                        // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.top                        // The offsetParent's offset without borders (offset + border)
        + ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
      ),
      left: (
        pageX                               // The absolute mouse position
        - this.offset.click.left                        // Click offset (relative to the element)
        - this.offset.relative.left                       // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.left                       // The offsetParent's offset without borders (offset + border)
        + ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
      )
    };

  },

  _clear: function() {
    this.helper.removeClass("ui-draggable-dragging");
    if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
    //if($.ui.ddmanager) $.ui.ddmanager.current = null;
    this.helper = null;
    this.cancelHelperRemoval = false;
  },

  // From now on bulk stuff - mainly helpers

  _trigger: function(type, event, ui) {
    ui = ui || this._uiHash();
    $.ui.plugin.call(this, type, [event, ui]);
    if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
    return $.Widget.prototype._trigger.call(this, type, event, ui);
  },

  plugins: {},

  _uiHash: function(event) {
    return {
      helper: this.helper,
      position: this.position,
      originalPosition: this.originalPosition,
      offset: this.positionAbs
    };
  }

});

$.ui.plugin.add("draggable", "connectToSortable", {
  start: function(event, ui) {

    var inst = $(this).data("draggable"), o = inst.options,
      uiSortable = $.extend({}, ui, { item: inst.element });
    inst.sortables = [];
    $(o.connectToSortable).each(function() {
      var sortable = $.data(this, 'sortable');
      if (sortable && !sortable.options.disabled) {
        inst.sortables.push({
          instance: sortable,
          shouldRevert: sortable.options.revert
        });
        sortable.refreshPositions();  // Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
        sortable._trigger("activate", event, uiSortable);
      }
    });

  },
  stop: function(event, ui) {

    //If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
    var inst = $(this).data("draggable"),
      uiSortable = $.extend({}, ui, { item: inst.element });

    $.each(inst.sortables, function() {
      if(this.instance.isOver) {

        this.instance.isOver = 0;

        inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
        this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

        //The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
        if(this.shouldRevert) this.instance.options.revert = true;

        //Trigger the stop of the sortable
        this.instance._mouseStop(event);

        this.instance.options.helper = this.instance.options._helper;

        //If the helper has been the original item, restore properties in the sortable
        if(inst.options.helper == 'original')
          this.instance.currentItem.css({ top: 'auto', left: 'auto' });

      } else {
        this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
        this.instance._trigger("deactivate", event, uiSortable);
      }

    });

  },
  drag: function(event, ui) {

    var inst = $(this).data("draggable"), that = this;

    var checkPos = function(o) {
      var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
      var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
      var itemHeight = o.height, itemWidth = o.width;
      var itemTop = o.top, itemLeft = o.left;

      return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
    };

    $.each(inst.sortables, function(i) {

      var innermostIntersecting = false;
      var thisSortable = this;
      //Copy over some variables to allow calling the sortable's native _intersectsWith
      this.instance.positionAbs = inst.positionAbs;
      this.instance.helperProportions = inst.helperProportions;
      this.instance.offset.click = inst.offset.click;

      if(this.instance._intersectsWith(this.instance.containerCache)) {
        innermostIntersecting = true;
        $.each(inst.sortables, function () {
          this.instance.positionAbs = inst.positionAbs;
          this.instance.helperProportions = inst.helperProportions;
          this.instance.offset.click = inst.offset.click;
          if  (this != thisSortable
            && this.instance._intersectsWith(this.instance.containerCache)
            && $.ui.contains(thisSortable.instance.element[0], this.instance.element[0]))
            innermostIntersecting = false;
            return innermostIntersecting;
        });
      }


      if(innermostIntersecting) {
        //If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
        if(!this.instance.isOver) {

          this.instance.isOver = 1;
          //Now we fake the start of dragging for the sortable instance,
          //by cloning the list group item, appending it to the sortable and using it as inst.currentItem
          //We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
          this.instance.currentItem = $(that).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
          this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
          this.instance.options.helper = function() { return ui.helper[0]; };

          event.target = this.instance.currentItem[0];
          this.instance._mouseCapture(event, true);
          this.instance._mouseStart(event, true, true);

          //Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
          this.instance.offset.click.top = inst.offset.click.top;
          this.instance.offset.click.left = inst.offset.click.left;
          this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
          this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

          inst._trigger("toSortable", event);
          inst.dropped = this.instance.element; //draggable revert needs that
          //hack so receive/update callbacks work (mostly)
          inst.currentItem = inst.element;
          this.instance.fromOutside = inst;

        }

        //Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
        if(this.instance.currentItem) this.instance._mouseDrag(event);

      } else {

        //If it doesn't intersect with the sortable, and it intersected before,
        //we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
        if(this.instance.isOver) {

          this.instance.isOver = 0;
          this.instance.cancelHelperRemoval = true;

          //Prevent reverting on this forced stop
          this.instance.options.revert = false;

          // The out event needs to be triggered independently
          this.instance._trigger('out', event, this.instance._uiHash(this.instance));

          this.instance._mouseStop(event, true);
          this.instance.options.helper = this.instance.options._helper;

          //Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
          this.instance.currentItem.remove();
          if(this.instance.placeholder) this.instance.placeholder.remove();

          inst._trigger("fromSortable", event);
          inst.dropped = false; //draggable revert needs that
        }

      };

    });

  }
});

$.ui.plugin.add("draggable", "cursor", {
  start: function(event, ui) {
    var t = $('body'), o = $(this).data('draggable').options;
    if (t.css("cursor")) o._cursor = t.css("cursor");
    t.css("cursor", o.cursor);
  },
  stop: function(event, ui) {
    var o = $(this).data('draggable').options;
    if (o._cursor) $('body').css("cursor", o._cursor);
  }
});

$.ui.plugin.add("draggable", "opacity", {
  start: function(event, ui) {
    var t = $(ui.helper), o = $(this).data('draggable').options;
    if(t.css("opacity")) o._opacity = t.css("opacity");
    t.css('opacity', o.opacity);
  },
  stop: function(event, ui) {
    var o = $(this).data('draggable').options;
    if(o._opacity) $(ui.helper).css('opacity', o._opacity);
  }
});

$.ui.plugin.add("draggable", "scroll", {
  start: function(event, ui) {
    var i = $(this).data("draggable");
    if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
  },
  drag: function(event, ui) {

    var i = $(this).data("draggable"), o = i.options, scrolled = false;

    if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

      if(!o.axis || o.axis != 'x') {
        if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
          i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
        else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
          i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
      }

      if(!o.axis || o.axis != 'y') {
        if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
          i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
        else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
          i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
      }

    } else {

      if(!o.axis || o.axis != 'x') {
        if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
        else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
      }

      if(!o.axis || o.axis != 'y') {
        if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
        else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
      }

    }

    if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(i, event);

  }
});

$.ui.plugin.add("draggable", "snap", {
  start: function(event, ui) {

    var i = $(this).data("draggable"), o = i.options;
    i.snapElements = [];

    $(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
      var $t = $(this); var $o = $t.offset();
      if(this != i.element[0]) i.snapElements.push({
        item: this,
        width: $t.outerWidth(), height: $t.outerHeight(),
        top: $o.top, left: $o.left
      });
    });

  },
  drag: function(event, ui) {

    var inst = $(this).data("draggable"), o = inst.options;
    var d = o.snapTolerance;

    var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
      y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

    for (var i = inst.snapElements.length - 1; i >= 0; i--){

      var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
        t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

      //Yes, I know, this is insane ;)
      if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
        if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
        inst.snapElements[i].snapping = false;
        continue;
      }

      if(o.snapMode != 'inner') {
        var ts = Math.abs(t - y2) <= d;
        var bs = Math.abs(b - y1) <= d;
        var ls = Math.abs(l - x2) <= d;
        var rs = Math.abs(r - x1) <= d;
        if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
        if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
        if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
        if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
      }

      var first = (ts || bs || ls || rs);

      if(o.snapMode != 'outer') {
        var ts = Math.abs(t - y1) <= d;
        var bs = Math.abs(b - y2) <= d;
        var ls = Math.abs(l - x1) <= d;
        var rs = Math.abs(r - x2) <= d;
        if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
        if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
        if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
        if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
      }

      if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
        (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
      inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

    };

  }
});

$.ui.plugin.add("draggable", "stack", {
  start: function(event, ui) {

    var o = $(this).data("draggable").options;

    var group = $.makeArray($(o.stack)).sort(function(a,b) {
      return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
    });
    if (!group.length) { return; }

    var min = parseInt(group[0].style.zIndex) || 0;
    $(group).each(function(i) {
      this.style.zIndex = min + i;
    });

    this[0].style.zIndex = min + group.length;

  }
});

$.ui.plugin.add("draggable", "zIndex", {
  start: function(event, ui) {
    var t = $(ui.helper), o = $(this).data("draggable").options;
    if(t.css("zIndex")) o._zIndex = t.css("zIndex");
    t.css('zIndex', o.zIndex);
  },
  stop: function(event, ui) {
    var o = $(this).data("draggable").options;
    if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
  }
});

})(jQuery);
(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
  version: "1.9.2",
  widgetEventPrefix: "resize",
  options: {
    alsoResize: false,
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 10,
    zIndex: 1000
  },
  _create: function() {

    var that = this, o = this.options;
    this.element.addClass("ui-resizable");

    $.extend(this, {
      _aspectRatio: !!(o.aspectRatio),
      aspectRatio: o.aspectRatio,
      originalElement: this.element,
      _proportionallyResizeElements: [],
      _helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
    });

    //Wrap the element if it cannot hold child nodes
    if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

      //Create a wrapper element and set the wrapper to the new current internal element
      this.element.wrap(
        $('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
          position: this.element.css('position'),
          width: this.element.outerWidth(),
          height: this.element.outerHeight(),
          top: this.element.css('top'),
          left: this.element.css('left')
        })
      );

      //Overwrite the original this.element
      this.element = this.element.parent().data(
        "resizable", this.element.data('resizable')
      );

      this.elementIsWrapper = true;

      //Move margins to the wrapper
      this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
      this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

      //Prevent Safari textarea resize
      this.originalResizeStyle = this.originalElement.css('resize');
      this.originalElement.css('resize', 'none');

      //Push the actual element to our proportionallyResize internal array
      this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

      // avoid IE jump (hard set the margin)
      this.originalElement.css({ margin: this.originalElement.css('margin') });

      // fix handlers offset
      this._proportionallyResize();

    }

    this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
    if(this.handles.constructor == String) {

      if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
      var n = this.handles.split(","); this.handles = {};

      for(var i = 0; i < n.length; i++) {

        var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
        var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

        // Apply zIndex to all handles - see #7960
        axis.css({ zIndex: o.zIndex });

        //TODO : What's going on here?
        if ('se' == handle) {
          axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
        };

        //Insert into internal handles object and append to element
        this.handles[handle] = '.ui-resizable-'+handle;
        this.element.append(axis);
      }

    }

    this._renderAxis = function(target) {

      target = target || this.element;

      for(var i in this.handles) {

        if(this.handles[i].constructor == String)
          this.handles[i] = $(this.handles[i], this.element).show();

        //Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
        if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

          var axis = $(this.handles[i], this.element), padWrapper = 0;

          //Checking the correct pad and border
          padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

          //The padding type i have to apply...
          var padPos = [ 'padding',
            /ne|nw|n/.test(i) ? 'Top' :
            /se|sw|s/.test(i) ? 'Bottom' :
            /^e$/.test(i) ? 'Right' : 'Left' ].join("");

          target.css(padPos, padWrapper);

          this._proportionallyResize();

        }

        //TODO: What's that good for? There's not anything to be executed left
        if(!$(this.handles[i]).length)
          continue;

      }
    };

    //TODO: make renderAxis a prototype function
    this._renderAxis(this.element);

    this._handles = $('.ui-resizable-handle', this.element)
      .disableSelection();

    //Matching axis name
    this._handles.mouseover(function() {
      if (!that.resizing) {
        if (this.className)
          var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
        //Axis, default = se
        that.axis = axis && axis[1] ? axis[1] : 'se';
      }
    });

    //If we want to auto hide the elements
    if (o.autoHide) {
      this._handles.hide();
      $(this.element)
        .addClass("ui-resizable-autohide")
        .mouseenter(function() {
          if (o.disabled) return;
          $(this).removeClass("ui-resizable-autohide");
          that._handles.show();
        })
        .mouseleave(function(){
          if (o.disabled) return;
          if (!that.resizing) {
            $(this).addClass("ui-resizable-autohide");
            that._handles.hide();
          }
        });
    }

    //Initialize the mouse interaction
    this._mouseInit();

  },

  _destroy: function() {

    this._mouseDestroy();

    var _destroy = function(exp) {
      $(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
        .removeData("resizable").removeData("ui-resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
    };

    //TODO: Unwrap at same DOM position
    if (this.elementIsWrapper) {
      _destroy(this.element);
      var wrapper = this.element;
      this.originalElement.css({
        position: wrapper.css('position'),
        width: wrapper.outerWidth(),
        height: wrapper.outerHeight(),
        top: wrapper.css('top'),
        left: wrapper.css('left')
      }).insertAfter( wrapper );
      wrapper.remove();
    }

    this.originalElement.css('resize', this.originalResizeStyle);
    _destroy(this.originalElement);

    return this;
  },

  _mouseCapture: function(event) {
    var handle = false;
    for (var i in this.handles) {
      if ($(this.handles[i])[0] == event.target) {
        handle = true;
      }
    }

    return !this.options.disabled && handle;
  },

  _mouseStart: function(event) {

    var o = this.options, iniPos = this.element.position(), el = this.element;

    this.resizing = true;
    this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

    // bugfix for http://dev.jquery.com/ticket/1749
    if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
      el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
    }

    this._renderProxy();

    var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

    if (o.containment) {
      curleft += $(o.containment).scrollLeft() || 0;
      curtop += $(o.containment).scrollTop() || 0;
    }

    //Store needed variables
    this.offset = this.helper.offset();
    this.position = { left: curleft, top: curtop };
    this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
    this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
    this.originalPosition = { left: curleft, top: curtop };
    this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
    this.originalMousePosition = { left: event.pageX, top: event.pageY };

    //Aspect Ratio
    this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

    var cursor = $('.ui-resizable-' + this.axis).css('cursor');
    $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

    el.addClass("ui-resizable-resizing");
    this._propagate("start", event);
    return true;
  },

  _mouseDrag: function(event) {

    //Increase performance, avoid regex
    var el = this.helper, o = this.options, props = {},
      that = this, smp = this.originalMousePosition, a = this.axis;

    var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
    var trigger = this._change[a];
    if (!trigger) return false;

    // Calculate the attrs that will be change
    var data = trigger.apply(this, [event, dx, dy]);

    // Put this in the mouseDrag handler since the user can start pressing shift while resizing
    this._updateVirtualBoundaries(event.shiftKey);
    if (this._aspectRatio || event.shiftKey)
      data = this._updateRatio(data, event);

    data = this._respectSize(data, event);

    // plugins callbacks need to be called first
    this._propagate("resize", event);

    el.css({
      top: this.position.top + "px", left: this.position.left + "px",
      width: this.size.width + "px", height: this.size.height + "px"
    });

    if (!this._helper && this._proportionallyResizeElements.length)
      this._proportionallyResize();

    this._updateCache(data);

    // calling the user callback at the end
    this._trigger('resize', event, this.ui());

    return false;
  },

  _mouseStop: function(event) {

    this.resizing = false;
    var o = this.options, that = this;

    if(this._helper) {
      var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
        soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
        soffsetw = ista ? 0 : that.sizeDiff.width;

      var s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) },
        left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
        top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

      if (!o.animate)
        this.element.css($.extend(s, { top: top, left: left }));

      that.helper.height(that.size.height);
      that.helper.width(that.size.width);

      if (this._helper && !o.animate) this._proportionallyResize();
    }

    $('body').css('cursor', 'auto');

    this.element.removeClass("ui-resizable-resizing");

    this._propagate("stop", event);

    if (this._helper) this.helper.remove();
    return false;

  },

  _updateVirtualBoundaries: function(forceAspectRatio) {
    var o = this.options, pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;

    b = {
      minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
      maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
      minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
      maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
    };

    if(this._aspectRatio || forceAspectRatio) {
      // We want to create an enclosing box whose aspect ration is the requested one
      // First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
      pMinWidth = b.minHeight * this.aspectRatio;
      pMinHeight = b.minWidth / this.aspectRatio;
      pMaxWidth = b.maxHeight * this.aspectRatio;
      pMaxHeight = b.maxWidth / this.aspectRatio;

      if(pMinWidth > b.minWidth) b.minWidth = pMinWidth;
      if(pMinHeight > b.minHeight) b.minHeight = pMinHeight;
      if(pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
      if(pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
    }
    this._vBoundaries = b;
  },

  _updateCache: function(data) {
    var o = this.options;
    this.offset = this.helper.offset();
    if (isNumber(data.left)) this.position.left = data.left;
    if (isNumber(data.top)) this.position.top = data.top;
    if (isNumber(data.height)) this.size.height = data.height;
    if (isNumber(data.width)) this.size.width = data.width;
  },

  _updateRatio: function(data, event) {

    var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

    if (isNumber(data.height)) data.width = (data.height * this.aspectRatio);
    else if (isNumber(data.width)) data.height = (data.width / this.aspectRatio);

    if (a == 'sw') {
      data.left = cpos.left + (csize.width - data.width);
      data.top = null;
    }
    if (a == 'nw') {
      data.top = cpos.top + (csize.height - data.height);
      data.left = cpos.left + (csize.width - data.width);
    }

    return data;
  },

  _respectSize: function(data, event) {

    var el = this.helper, o = this._vBoundaries, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
        ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
          isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

    if (isminw) data.width = o.minWidth;
    if (isminh) data.height = o.minHeight;
    if (ismaxw) data.width = o.maxWidth;
    if (ismaxh) data.height = o.maxHeight;

    var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
    var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

    if (isminw && cw) data.left = dw - o.minWidth;
    if (ismaxw && cw) data.left = dw - o.maxWidth;
    if (isminh && ch) data.top = dh - o.minHeight;
    if (ismaxh && ch) data.top = dh - o.maxHeight;

    // fixing jump error on top/left - bug #2330
    var isNotwh = !data.width && !data.height;
    if (isNotwh && !data.left && data.top) data.top = null;
    else if (isNotwh && !data.top && data.left) data.left = null;

    return data;
  },

  _proportionallyResize: function() {

    var o = this.options;
    if (!this._proportionallyResizeElements.length) return;
    var element = this.helper || this.element;

    for (var i=0; i < this._proportionallyResizeElements.length; i++) {

      var prel = this._proportionallyResizeElements[i];

      if (!this.borderDif) {
        var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
          p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

        this.borderDif = $.map(b, function(v, i) {
          var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
          return border + padding;
        });
      }

      prel.css({
        height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
        width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
      });

    };

  },

  _renderProxy: function() {

    var el = this.element, o = this.options;
    this.elementOffset = el.offset();

    if(this._helper) {

      this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

      // fix ie6 offset TODO: This seems broken
      var ie6offset = ($.ui.ie6 ? 1 : 0),
      pxyoffset = ( $.ui.ie6 ? 2 : -1 );

      this.helper.addClass(this._helper).css({
        width: this.element.outerWidth() + pxyoffset,
        height: this.element.outerHeight() + pxyoffset,
        position: 'absolute',
        left: this.elementOffset.left - ie6offset +'px',
        top: this.elementOffset.top - ie6offset +'px',
        zIndex: ++o.zIndex //TODO: Don't modify option
      });

      this.helper
        .appendTo("body")
        .disableSelection();

    } else {
      this.helper = this.element;
    }

  },

  _change: {
    e: function(event, dx, dy) {
      return { width: this.originalSize.width + dx };
    },
    w: function(event, dx, dy) {
      var o = this.options, cs = this.originalSize, sp = this.originalPosition;
      return { left: sp.left + dx, width: cs.width - dx };
    },
    n: function(event, dx, dy) {
      var o = this.options, cs = this.originalSize, sp = this.originalPosition;
      return { top: sp.top + dy, height: cs.height - dy };
    },
    s: function(event, dx, dy) {
      return { height: this.originalSize.height + dy };
    },
    se: function(event, dx, dy) {
      return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
    },
    sw: function(event, dx, dy) {
      return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
    },
    ne: function(event, dx, dy) {
      return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
    },
    nw: function(event, dx, dy) {
      return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
    }
  },

  _propagate: function(n, event) {
    $.ui.plugin.call(this, n, [event, this.ui()]);
    (n != "resize" && this._trigger(n, event, this.ui()));
  },

  plugins: {},

  ui: function() {
    return {
      originalElement: this.originalElement,
      element: this.element,
      helper: this.helper,
      position: this.position,
      size: this.size,
      originalSize: this.originalSize,
      originalPosition: this.originalPosition
    };
  }

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

  start: function (event, ui) {
    var that = $(this).data("resizable"), o = that.options;

    var _store = function (exp) {
      $(exp).each(function() {
        var el = $(this);
        el.data("resizable-alsoresize", {
          width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
          left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10)
        });
      });
    };

    if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
      if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
      else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
    }else{
      _store(o.alsoResize);
    }
  },

  resize: function (event, ui) {
    var that = $(this).data("resizable"), o = that.options, os = that.originalSize, op = that.originalPosition;

    var delta = {
      height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
      top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
    },

    _alsoResize = function (exp, c) {
      $(exp).each(function() {
        var el = $(this), start = $(this).data("resizable-alsoresize"), style = {},
          css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

        $.each(css, function (i, prop) {
          var sum = (start[prop]||0) + (delta[prop]||0);
          if (sum && sum >= 0)
            style[prop] = sum || null;
        });

        el.css(style);
      });
    };

    if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
      $.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
    }else{
      _alsoResize(o.alsoResize);
    }
  },

  stop: function (event, ui) {
    $(this).removeData("resizable-alsoresize");
  }
});

$.ui.plugin.add("resizable", "animate", {

  stop: function(event, ui) {
    var that = $(this).data("resizable"), o = that.options;

    var pr = that._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
          soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
            soffsetw = ista ? 0 : that.sizeDiff.width;

    var style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
          left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
            top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

    that.element.animate(
      $.extend(style, top && left ? { top: top, left: left } : {}), {
        duration: o.animateDuration,
        easing: o.animateEasing,
        step: function() {

          var data = {
            width: parseInt(that.element.css('width'), 10),
            height: parseInt(that.element.css('height'), 10),
            top: parseInt(that.element.css('top'), 10),
            left: parseInt(that.element.css('left'), 10)
          };

          if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

          // propagating resize, and updating values for each animation step
          that._updateCache(data);
          that._propagate("resize", event);

        }
      }
    );
  }

});

$.ui.plugin.add("resizable", "containment", {

  start: function(event, ui) {
    var that = $(this).data("resizable"), o = that.options, el = that.element;
    var oc = o.containment, ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
    if (!ce) return;

    that.containerElement = $(ce);

    if (/document/.test(oc) || oc == document) {
      that.containerOffset = { left: 0, top: 0 };
      that.containerPosition = { left: 0, top: 0 };

      that.parentData = {
        element: $(document), left: 0, top: 0,
        width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
      };
    }

    // i'm a node, so compute top, left, right, bottom
    else {
      var element = $(ce), p = [];
      $([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

      that.containerOffset = element.offset();
      that.containerPosition = element.position();
      that.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

      var co = that.containerOffset, ch = that.containerSize.height,  cw = that.containerSize.width,
            width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

      that.parentData = {
        element: ce, left: co.left, top: co.top, width: width, height: height
      };
    }
  },

  resize: function(event, ui) {
    var that = $(this).data("resizable"), o = that.options,
        ps = that.containerSize, co = that.containerOffset, cs = that.size, cp = that.position,
        pRatio = that._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = that.containerElement;

    if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

    if (cp.left < (that._helper ? co.left : 0)) {
      that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
      if (pRatio) that.size.height = that.size.width / that.aspectRatio;
      that.position.left = o.helper ? co.left : 0;
    }

    if (cp.top < (that._helper ? co.top : 0)) {
      that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
      if (pRatio) that.size.width = that.size.height * that.aspectRatio;
      that.position.top = that._helper ? co.top : 0;
    }

    that.offset.left = that.parentData.left+that.position.left;
    that.offset.top = that.parentData.top+that.position.top;

    var woset = Math.abs( (that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width ),
          hoset = Math.abs( (that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height );

    var isParent = that.containerElement.get(0) == that.element.parent().get(0),
      isOffsetRelative = /relative|absolute/.test(that.containerElement.css('position'));

    if(isParent && isOffsetRelative) woset -= that.parentData.left;

    if (woset + that.size.width >= that.parentData.width) {
      that.size.width = that.parentData.width - woset;
      if (pRatio) that.size.height = that.size.width / that.aspectRatio;
    }

    if (hoset + that.size.height >= that.parentData.height) {
      that.size.height = that.parentData.height - hoset;
      if (pRatio) that.size.width = that.size.height * that.aspectRatio;
    }
  },

  stop: function(event, ui){
    var that = $(this).data("resizable"), o = that.options, cp = that.position,
        co = that.containerOffset, cop = that.containerPosition, ce = that.containerElement;

    var helper = $(that.helper), ho = helper.offset(), w = helper.outerWidth() - that.sizeDiff.width, h = helper.outerHeight() - that.sizeDiff.height;

    if (that._helper && !o.animate && (/relative/).test(ce.css('position')))
      $(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

    if (that._helper && !o.animate && (/static/).test(ce.css('position')))
      $(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

  }
});

$.ui.plugin.add("resizable", "ghost", {

  start: function(event, ui) {

    var that = $(this).data("resizable"), o = that.options, cs = that.size;

    that.ghost = that.originalElement.clone();
    that.ghost
      .css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
      .addClass('ui-resizable-ghost')
      .addClass(typeof o.ghost == 'string' ? o.ghost : '');

    that.ghost.appendTo(that.helper);

  },

  resize: function(event, ui){
    var that = $(this).data("resizable"), o = that.options;
    if (that.ghost) that.ghost.css({ position: 'relative', height: that.size.height, width: that.size.width });
  },

  stop: function(event, ui){
    var that = $(this).data("resizable"), o = that.options;
    if (that.ghost && that.helper) that.helper.get(0).removeChild(that.ghost.get(0));
  }

});

$.ui.plugin.add("resizable", "grid", {

  resize: function(event, ui) {
    var that = $(this).data("resizable"), o = that.options, cs = that.size, os = that.originalSize, op = that.originalPosition, a = that.axis, ratio = o._aspectRatio || event.shiftKey;
    o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
    var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

    if (/^(se|s|e)$/.test(a)) {
      that.size.width = os.width + ox;
      that.size.height = os.height + oy;
    }
    else if (/^(ne)$/.test(a)) {
      that.size.width = os.width + ox;
      that.size.height = os.height + oy;
      that.position.top = op.top - oy;
    }
    else if (/^(sw)$/.test(a)) {
      that.size.width = os.width + ox;
      that.size.height = os.height + oy;
      that.position.left = op.left - ox;
    }
    else {
      that.size.width = os.width + ox;
      that.size.height = os.height + oy;
      that.position.top = op.top - oy;
      that.position.left = op.left - ox;
    }
  }

});

var num = function(v) {
  return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
  return !isNaN(parseInt(value, 10));
};

})(jQuery);
(function( $, undefined ) {

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.autocomplete", {
  version: "1.9.2",
  defaultElement: "<input>",
  options: {
    appendTo: "body",
    autoFocus: false,
    delay: 300,
    minLength: 1,
    position: {
      my: "left top",
      at: "left bottom",
      collision: "none"
    },
    source: null,

    // callbacks
    change: null,
    close: null,
    focus: null,
    open: null,
    response: null,
    search: null,
    select: null
  },

  pending: 0,

  _create: function() {
    // Some browsers only repeat keydown events, not keypress events,
    // so we use the suppressKeyPress flag to determine if we've already
    // handled the keydown event. #7269
    // Unfortunately the code for & in keypress is the same as the up arrow,
    // so we use the suppressKeyPressRepeat flag to avoid handling keypress
    // events when we know the keydown event was used to modify the
    // search term. #7799
    var suppressKeyPress, suppressKeyPressRepeat, suppressInput;

    this.isMultiLine = this._isMultiLine();
    this.valueMethod = this.element[ this.element.is( "input,textarea" ) ? "val" : "text" ];
    this.isNewMenu = true;

    this.element
      .addClass( "ui-autocomplete-input" )
      .attr( "autocomplete", "off" );

    this._on( this.element, {
      keydown: function( event ) {
        if ( this.element.prop( "readOnly" ) ) {
          suppressKeyPress = true;
          suppressInput = true;
          suppressKeyPressRepeat = true;
          return;
        }

        suppressKeyPress = false;
        suppressInput = false;
        suppressKeyPressRepeat = false;
        var keyCode = $.ui.keyCode;
        switch( event.keyCode ) {
        case keyCode.PAGE_UP:
          suppressKeyPress = true;
          this._move( "previousPage", event );
          break;
        case keyCode.PAGE_DOWN:
          suppressKeyPress = true;
          this._move( "nextPage", event );
          break;
        case keyCode.UP:
          suppressKeyPress = true;
          this._keyEvent( "previous", event );
          break;
        case keyCode.DOWN:
          suppressKeyPress = true;
          this._keyEvent( "next", event );
          break;
        case keyCode.ENTER:
        case keyCode.NUMPAD_ENTER:
          // when menu is open and has focus
          if ( this.menu.active ) {
            // #6055 - Opera still allows the keypress to occur
            // which causes forms to submit
            suppressKeyPress = true;
            event.preventDefault();
            this.menu.select( event );
          }
          break;
        case keyCode.TAB:
          if ( this.menu.active ) {
            this.menu.select( event );
          }
          break;
        case keyCode.ESCAPE:
          if ( this.menu.element.is( ":visible" ) ) {
            this._value( this.term );
            this.close( event );
            // Different browsers have different default behavior for escape
            // Single press can mean undo or clear
            // Double press in IE means clear the whole form
            event.preventDefault();
          }
          break;
        default:
          suppressKeyPressRepeat = true;
          // search timeout should be triggered before the input value is changed
          this._searchTimeout( event );
          break;
        }
      },
      keypress: function( event ) {
        if ( suppressKeyPress ) {
          suppressKeyPress = false;
          event.preventDefault();
          return;
        }
        if ( suppressKeyPressRepeat ) {
          return;
        }

        // replicate some key handlers to allow them to repeat in Firefox and Opera
        var keyCode = $.ui.keyCode;
        switch( event.keyCode ) {
        case keyCode.PAGE_UP:
          this._move( "previousPage", event );
          break;
        case keyCode.PAGE_DOWN:
          this._move( "nextPage", event );
          break;
        case keyCode.UP:
          this._keyEvent( "previous", event );
          break;
        case keyCode.DOWN:
          this._keyEvent( "next", event );
          break;
        }
      },
      input: function( event ) {
        if ( suppressInput ) {
          suppressInput = false;
          event.preventDefault();
          return;
        }
        this._searchTimeout( event );
      },
      focus: function() {
        this.selectedItem = null;
        this.previous = this._value();
      },
      blur: function( event ) {
        if ( this.cancelBlur ) {
          delete this.cancelBlur;
          return;
        }

        clearTimeout( this.searching );
        this.close( event );
        this._change( event );
      }
    });

    this._initSource();
    this.menu = $( "<ul>" )
      .addClass( "ui-autocomplete" )
      .appendTo( this.document.find( this.options.appendTo || "body" )[ 0 ] )
      .menu({
        // custom key handling for now
        input: $(),
        // disable ARIA support, the live region takes care of that
        role: null
      })
      .zIndex( this.element.zIndex() + 1 )
      .hide()
      .data( "menu" );

    this._on( this.menu.element, {
      mousedown: function( event ) {
        // prevent moving focus out of the text field
        event.preventDefault();

        // IE doesn't prevent moving focus even with event.preventDefault()
        // so we set a flag to know when we should ignore the blur event
        this.cancelBlur = true;
        this._delay(function() {
          delete this.cancelBlur;
        });

        // clicking on the scrollbar causes focus to shift to the body
        // but we can't detect a mouseup or a click immediately afterward
        // so we have to track the next mousedown and close the menu if
        // the user clicks somewhere outside of the autocomplete
        var menuElement = this.menu.element[ 0 ];
        if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
          this._delay(function() {
            var that = this;
            this.document.one( "mousedown", function( event ) {
              if ( event.target !== that.element[ 0 ] &&
                  event.target !== menuElement &&
                  !$.contains( menuElement, event.target ) ) {
                that.close();
              }
            });
          });
        }
      },
      menufocus: function( event, ui ) {
        // #7024 - Prevent accidental activation of menu items in Firefox
        if ( this.isNewMenu ) {
          this.isNewMenu = false;
          if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
            this.menu.blur();

            this.document.one( "mousemove", function() {
              $( event.target ).trigger( event.originalEvent );
            });

            return;
          }
        }

        // back compat for _renderItem using item.autocomplete, via #7810
        // TODO remove the fallback, see #8156
        var item = ui.item.data( "ui-autocomplete-item" ) || ui.item.data( "item.autocomplete" );
        if ( false !== this._trigger( "focus", event, { item: item } ) ) {
          // use value to match what will end up in the input, if it was a key event
          if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
            this._value( item.value );
          }
        } else {
          // Normally the input is populated with the item's value as the
          // menu is navigated, causing screen readers to notice a change and
          // announce the item. Since the focus event was canceled, this doesn't
          // happen, so we update the live region so that screen readers can
          // still notice the change and announce it.
          this.liveRegion.text( item.value );
        }
      },
      menuselect: function( event, ui ) {
        // back compat for _renderItem using item.autocomplete, via #7810
        // TODO remove the fallback, see #8156
        var item = ui.item.data( "ui-autocomplete-item" ) || ui.item.data( "item.autocomplete" ),
          previous = this.previous;

        // only trigger when focus was lost (click on menu)
        if ( this.element[0] !== this.document[0].activeElement ) {
          this.element.focus();
          this.previous = previous;
          // #6109 - IE triggers two focus events and the second
          // is asynchronous, so we need to reset the previous
          // term synchronously and asynchronously :-(
          this._delay(function() {
            this.previous = previous;
            this.selectedItem = item;
          });
        }

        if ( false !== this._trigger( "select", event, { item: item } ) ) {
          this._value( item.value );
        }
        // reset the term after the select event
        // this allows custom select handling to work properly
        this.term = this._value();

        this.close( event );
        this.selectedItem = item;
      }
    });

    this.liveRegion = $( "<span>", {
        role: "status",
        "aria-live": "polite"
      })
      .addClass( "ui-helper-hidden-accessible" )
      .insertAfter( this.element );

    if ( $.fn.bgiframe ) {
      this.menu.element.bgiframe();
    }

    // turning off autocomplete prevents the browser from remembering the
    // value when navigating through history, so we re-enable autocomplete
    // if the page is unloaded before the widget is destroyed. #7790
    this._on( this.window, {
      beforeunload: function() {
        this.element.removeAttr( "autocomplete" );
      }
    });
  },

  _destroy: function() {
    clearTimeout( this.searching );
    this.element
      .removeClass( "ui-autocomplete-input" )
      .removeAttr( "autocomplete" );
    this.menu.element.remove();
    this.liveRegion.remove();
  },

  _setOption: function( key, value ) {
    this._super( key, value );
    if ( key === "source" ) {
      this._initSource();
    }
    if ( key === "appendTo" ) {
      this.menu.element.appendTo( this.document.find( value || "body" )[0] );
    }
    if ( key === "disabled" && value && this.xhr ) {
      this.xhr.abort();
    }
  },

  _isMultiLine: function() {
    // Textareas are always multi-line
    if ( this.element.is( "textarea" ) ) {
      return true;
    }
    // Inputs are always single-line, even if inside a contentEditable element
    // IE also treats inputs as contentEditable
    if ( this.element.is( "input" ) ) {
      return false;
    }
    // All other element types are determined by whether or not they're contentEditable
    return this.element.prop( "isContentEditable" );
  },

  _initSource: function() {
    var array, url,
      that = this;
    if ( $.isArray(this.options.source) ) {
      array = this.options.source;
      this.source = function( request, response ) {
        response( $.ui.autocomplete.filter( array, request.term ) );
      };
    } else if ( typeof this.options.source === "string" ) {
      url = this.options.source;
      this.source = function( request, response ) {
        if ( that.xhr ) {
          that.xhr.abort();
        }
        that.xhr = $.ajax({
          url: url,
          data: request,
          dataType: "json",
          success: function( data ) {
            response( data );
          },
          error: function() {
            response( [] );
          }
        });
      };
    } else {
      this.source = this.options.source;
    }
  },

  _searchTimeout: function( event ) {
    clearTimeout( this.searching );
    this.searching = this._delay(function() {
      // only search if the value has changed
      if ( this.term !== this._value() ) {
        this.selectedItem = null;
        this.search( null, event );
      }
    }, this.options.delay );
  },

  search: function( value, event ) {
    value = value != null ? value : this._value();

    // always save the actual value, not the one passed as an argument
    this.term = this._value();

    if ( value.length < this.options.minLength ) {
      return this.close( event );
    }

    if ( this._trigger( "search", event ) === false ) {
      return;
    }

    return this._search( value );
  },

  _search: function( value ) {
    this.pending++;
    this.element.addClass( "ui-autocomplete-loading" );
    this.cancelSearch = false;

    this.source( { term: value }, this._response() );
  },

  _response: function() {
    var that = this,
      index = ++requestIndex;

    return function( content ) {
      if ( index === requestIndex ) {
        that.__response( content );
      }

      that.pending--;
      if ( !that.pending ) {
        that.element.removeClass( "ui-autocomplete-loading" );
      }
    };
  },

  __response: function( content ) {
    if ( content ) {
      content = this._normalize( content );
    }
    this._trigger( "response", null, { content: content } );
    if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
      this._suggest( content );
      this._trigger( "open" );
    } else {
      // use ._close() instead of .close() so we don't cancel future searches
      this._close();
    }
  },

  close: function( event ) {
    this.cancelSearch = true;
    this._close( event );
  },

  _close: function( event ) {
    if ( this.menu.element.is( ":visible" ) ) {
      this.menu.element.hide();
      this.menu.blur();
      this.isNewMenu = true;
      this._trigger( "close", event );
    }
  },

  _change: function( event ) {
    if ( this.previous !== this._value() ) {
      this._trigger( "change", event, { item: this.selectedItem } );
    }
  },

  _normalize: function( items ) {
    // assume all items have the right format when the first item is complete
    if ( items.length && items[0].label && items[0].value ) {
      return items;
    }
    return $.map( items, function( item ) {
      if ( typeof item === "string" ) {
        return {
          label: item,
          value: item
        };
      }
      return $.extend({
        label: item.label || item.value,
        value: item.value || item.label
      }, item );
    });
  },

  _suggest: function( items ) {
    var ul = this.menu.element
      .empty()
      .zIndex( this.element.zIndex() + 1 );
    this._renderMenu( ul, items );
    this.menu.refresh();

    // size and position menu
    ul.show();
    this._resizeMenu();
    ul.position( $.extend({
      of: this.element
    }, this.options.position ));

    if ( this.options.autoFocus ) {
      this.menu.next();
    }
  },

  _resizeMenu: function() {
    var ul = this.menu.element;
    ul.outerWidth( Math.max(
      // Firefox wraps long text (possibly a rounding bug)
      // so we add 1px to avoid the wrapping (#7513)
      ul.width( "" ).outerWidth() + 1,
      this.element.outerWidth()
    ) );
  },

  _renderMenu: function( ul, items ) {
    var that = this;
    $.each( items, function( index, item ) {
      that._renderItemData( ul, item );
    });
  },

  _renderItemData: function( ul, item ) {
    return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
  },

  _renderItem: function( ul, item ) {
    return $( "<li>" )
      .append( $( "<a>" ).text( item.label ) )
      .appendTo( ul );
  },

  _move: function( direction, event ) {
    if ( !this.menu.element.is( ":visible" ) ) {
      this.search( null, event );
      return;
    }
    if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
        this.menu.isLastItem() && /^next/.test( direction ) ) {
      this._value( this.term );
      this.menu.blur();
      return;
    }
    this.menu[ direction ]( event );
  },

  widget: function() {
    return this.menu.element;
  },

  _value: function() {
    return this.valueMethod.apply( this.element, arguments );
  },

  _keyEvent: function( keyEvent, event ) {
    if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
      this._move( keyEvent, event );

      // prevents moving cursor to beginning/end of the text field in some browsers
      event.preventDefault();
    }
  }
});

$.extend( $.ui.autocomplete, {
  escapeRegex: function( value ) {
    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  },
  filter: function(array, term) {
    var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
    return $.grep( array, function(value) {
      return matcher.test( value.label || value.value || value );
    });
  }
});


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
  options: {
    messages: {
      noResults: "No search results.",
      results: function( amount ) {
        return amount + ( amount > 1 ? " results are" : " result is" ) +
          " available, use up and down arrow keys to navigate.";
      }
    }
  },

  __response: function( content ) {
    var message;
    this._superApply( arguments );
    if ( this.options.disabled || this.cancelSearch ) {
      return;
    }
    if ( content && content.length ) {
      message = this.options.messages.results( content.length );
    } else {
      message = this.options.messages.noResults;
    }
    this.liveRegion.text( message );
  }
});


}( jQuery ));
(function( $, undefined ) {

var lastActive, startXPos, startYPos, clickDragged,
  baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
  stateClasses = "ui-state-hover ui-state-active ",
  typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
  formResetHandler = function() {
    var buttons = $( this ).find( ":ui-button" );
    setTimeout(function() {
      buttons.button( "refresh" );
    }, 1 );
  },
  radioGroup = function( radio ) {
    var name = radio.name,
      form = radio.form,
      radios = $( [] );
    if ( name ) {
      if ( form ) {
        radios = $( form ).find( "[name='" + name + "']" );
      } else {
        radios = $( "[name='" + name + "']", radio.ownerDocument )
          .filter(function() {
            return !this.form;
          });
      }
    }
    return radios;
  };

$.widget( "ui.button", {
  version: "1.9.2",
  defaultElement: "<button>",
  options: {
    disabled: null,
    text: true,
    label: null,
    icons: {
      primary: null,
      secondary: null
    }
  },
  _create: function() {
    this.element.closest( "form" )
      .unbind( "reset" + this.eventNamespace )
      .bind( "reset" + this.eventNamespace, formResetHandler );

    if ( typeof this.options.disabled !== "boolean" ) {
      this.options.disabled = !!this.element.prop( "disabled" );
    } else {
      this.element.prop( "disabled", this.options.disabled );
    }

    this._determineButtonType();
    this.hasTitle = !!this.buttonElement.attr( "title" );

    var that = this,
      options = this.options,
      toggleButton = this.type === "checkbox" || this.type === "radio",
      activeClass = !toggleButton ? "ui-state-active" : "",
      focusClass = "ui-state-focus";

    if ( options.label === null ) {
      options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
    }

    this._hoverable( this.buttonElement );

    this.buttonElement
      .addClass( baseClasses )
      .attr( "role", "button" )
      .bind( "mouseenter" + this.eventNamespace, function() {
        if ( options.disabled ) {
          return;
        }
        if ( this === lastActive ) {
          $( this ).addClass( "ui-state-active" );
        }
      })
      .bind( "mouseleave" + this.eventNamespace, function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).removeClass( activeClass );
      })
      .bind( "click" + this.eventNamespace, function( event ) {
        if ( options.disabled ) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });

    this.element
      .bind( "focus" + this.eventNamespace, function() {
        // no need to check disabled, focus won't be triggered anyway
        that.buttonElement.addClass( focusClass );
      })
      .bind( "blur" + this.eventNamespace, function() {
        that.buttonElement.removeClass( focusClass );
      });

    if ( toggleButton ) {
      this.element.bind( "change" + this.eventNamespace, function() {
        if ( clickDragged ) {
          return;
        }
        that.refresh();
      });
      // if mouse moves between mousedown and mouseup (drag) set clickDragged flag
      // prevents issue where button state changes but checkbox/radio checked state
      // does not in Firefox (see ticket #6970)
      this.buttonElement
        .bind( "mousedown" + this.eventNamespace, function( event ) {
          if ( options.disabled ) {
            return;
          }
          clickDragged = false;
          startXPos = event.pageX;
          startYPos = event.pageY;
        })
        .bind( "mouseup" + this.eventNamespace, function( event ) {
          if ( options.disabled ) {
            return;
          }
          if ( startXPos !== event.pageX || startYPos !== event.pageY ) {
            clickDragged = true;
          }
      });
    }

    if ( this.type === "checkbox" ) {
      this.buttonElement.bind( "click" + this.eventNamespace, function() {
        if ( options.disabled || clickDragged ) {
          return false;
        }
        $( this ).toggleClass( "ui-state-active" );
        that.buttonElement.attr( "aria-pressed", that.element[0].checked );
      });
    } else if ( this.type === "radio" ) {
      this.buttonElement.bind( "click" + this.eventNamespace, function() {
        if ( options.disabled || clickDragged ) {
          return false;
        }
        $( this ).addClass( "ui-state-active" );
        that.buttonElement.attr( "aria-pressed", "true" );

        var radio = that.element[ 0 ];
        radioGroup( radio )
          .not( radio )
          .map(function() {
            return $( this ).button( "widget" )[ 0 ];
          })
          .removeClass( "ui-state-active" )
          .attr( "aria-pressed", "false" );
      });
    } else {
      this.buttonElement
        .bind( "mousedown" + this.eventNamespace, function() {
          if ( options.disabled ) {
            return false;
          }
          $( this ).addClass( "ui-state-active" );
          lastActive = this;
          that.document.one( "mouseup", function() {
            lastActive = null;
          });
        })
        .bind( "mouseup" + this.eventNamespace, function() {
          if ( options.disabled ) {
            return false;
          }
          $( this ).removeClass( "ui-state-active" );
        })
        .bind( "keydown" + this.eventNamespace, function(event) {
          if ( options.disabled ) {
            return false;
          }
          if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
            $( this ).addClass( "ui-state-active" );
          }
        })
        .bind( "keyup" + this.eventNamespace, function() {
          $( this ).removeClass( "ui-state-active" );
        });

      if ( this.buttonElement.is("a") ) {
        this.buttonElement.keyup(function(event) {
          if ( event.keyCode === $.ui.keyCode.SPACE ) {
            // TODO pass through original event correctly (just as 2nd argument doesn't work)
            $( this ).click();
          }
        });
      }
    }

    // TODO: pull out $.Widget's handling for the disabled option into
    // $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
    // be overridden by individual plugins
    this._setOption( "disabled", options.disabled );
    this._resetButton();
  },

  _determineButtonType: function() {
    var ancestor, labelSelector, checked;

    if ( this.element.is("[type=checkbox]") ) {
      this.type = "checkbox";
    } else if ( this.element.is("[type=radio]") ) {
      this.type = "radio";
    } else if ( this.element.is("input") ) {
      this.type = "input";
    } else {
      this.type = "button";
    }

    if ( this.type === "checkbox" || this.type === "radio" ) {
      // we don't search against the document in case the element
      // is disconnected from the DOM
      ancestor = this.element.parents().last();
      labelSelector = "label[for='" + this.element.attr("id") + "']";
      this.buttonElement = ancestor.find( labelSelector );
      if ( !this.buttonElement.length ) {
        ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
        this.buttonElement = ancestor.filter( labelSelector );
        if ( !this.buttonElement.length ) {
          this.buttonElement = ancestor.find( labelSelector );
        }
      }
      this.element.addClass( "ui-helper-hidden-accessible" );

      checked = this.element.is( ":checked" );
      if ( checked ) {
        this.buttonElement.addClass( "ui-state-active" );
      }
      this.buttonElement.prop( "aria-pressed", checked );
    } else {
      this.buttonElement = this.element;
    }
  },

  widget: function() {
    return this.buttonElement;
  },

  _destroy: function() {
    this.element
      .removeClass( "ui-helper-hidden-accessible" );
    this.buttonElement
      .removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
      .removeAttr( "role" )
      .removeAttr( "aria-pressed" )
      .html( this.buttonElement.find(".ui-button-text").html() );

    if ( !this.hasTitle ) {
      this.buttonElement.removeAttr( "title" );
    }
  },

  _setOption: function( key, value ) {
    this._super( key, value );
    if ( key === "disabled" ) {
      if ( value ) {
        this.element.prop( "disabled", true );
      } else {
        this.element.prop( "disabled", false );
      }
      return;
    }
    this._resetButton();
  },

  refresh: function() {
    //See #8237 & #8828
    var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

    if ( isDisabled !== this.options.disabled ) {
      this._setOption( "disabled", isDisabled );
    }
    if ( this.type === "radio" ) {
      radioGroup( this.element[0] ).each(function() {
        if ( $( this ).is( ":checked" ) ) {
          $( this ).button( "widget" )
            .addClass( "ui-state-active" )
            .attr( "aria-pressed", "true" );
        } else {
          $( this ).button( "widget" )
            .removeClass( "ui-state-active" )
            .attr( "aria-pressed", "false" );
        }
      });
    } else if ( this.type === "checkbox" ) {
      if ( this.element.is( ":checked" ) ) {
        this.buttonElement
          .addClass( "ui-state-active" )
          .attr( "aria-pressed", "true" );
      } else {
        this.buttonElement
          .removeClass( "ui-state-active" )
          .attr( "aria-pressed", "false" );
      }
    }
  },

  _resetButton: function() {
    if ( this.type === "input" ) {
      if ( this.options.label ) {
        this.element.val( this.options.label );
      }
      return;
    }
    var buttonElement = this.buttonElement.removeClass( typeClasses ),
      buttonText = $( "<span></span>", this.document[0] )
        .addClass( "ui-button-text" )
        .html( this.options.label )
        .appendTo( buttonElement.empty() )
        .text(),
      icons = this.options.icons,
      multipleIcons = icons.primary && icons.secondary,
      buttonClasses = [];

    if ( icons.primary || icons.secondary ) {
      if ( this.options.text ) {
        buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
      }

      if ( icons.primary ) {
        buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
      }

      if ( icons.secondary ) {
        buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
      }

      if ( !this.options.text ) {
        buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

        if ( !this.hasTitle ) {
          buttonElement.attr( "title", $.trim( buttonText ) );
        }
      }
    } else {
      buttonClasses.push( "ui-button-text-only" );
    }
    buttonElement.addClass( buttonClasses.join( " " ) );
  }
});

$.widget( "ui.buttonset", {
  version: "1.9.2",
  options: {
    items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"
  },

  _create: function() {
    this.element.addClass( "ui-buttonset" );
  },

  _init: function() {
    this.refresh();
  },

  _setOption: function( key, value ) {
    if ( key === "disabled" ) {
      this.buttons.button( "option", key, value );
    }

    this._super( key, value );
  },

  refresh: function() {
    var rtl = this.element.css( "direction" ) === "rtl";

    this.buttons = this.element.find( this.options.items )
      .filter( ":ui-button" )
        .button( "refresh" )
      .end()
      .not( ":ui-button" )
        .button()
      .end()
      .map(function() {
        return $( this ).button( "widget" )[ 0 ];
      })
        .removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
        .filter( ":first" )
          .addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
        .end()
        .filter( ":last" )
          .addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
        .end()
      .end();
  },

  _destroy: function() {
    this.element.removeClass( "ui-buttonset" );
    this.buttons
      .map(function() {
        return $( this ).button( "widget" )[ 0 ];
      })
        .removeClass( "ui-corner-left ui-corner-right" )
      .end()
      .button( "destroy" );
  }
});

}( jQuery ) );
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.9.2" } });

var PROP_NAME = 'datepicker';
var dpuuid = new Date().getTime();
var instActive;

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
  this.debug = false; // Change this to true to start debugging
  this._curInst = null; // The current instance in use
  this._keyEvent = false; // If the last event was a key event
  this._disabledInputs = []; // List of date picker inputs that have been disabled
  this._datepickerShowing = false; // True if the popup picker is showing , false if not
  this._inDialog = false; // True if showing within a "dialog", false if not
  this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker division
  this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker class
  this._appendClass = 'ui-datepicker-append'; // The name of the append marker class
  this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger marker class
  this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker class
  this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled covering marker class
  this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the unselectable cell marker class
  this._currentClass = 'ui-datepicker-current-day'; // The name of the current day marker class
  this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the day hover marker class
  this.regional = []; // Available regional settings, indexed by language code
  this.regional[''] = { // Default regional settings
    closeText: 'Done', // Display text for close link
    prevText: 'Prev', // Display text for previous month link
    nextText: 'Next', // Display text for next month link
    currentText: 'Today', // Display text for current month link
    monthNames: ['January','February','March','April','May','June',
      'July','August','September','October','November','December'], // Names of months for drop-down and formatting
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
    dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
    weekHeader: 'Wk', // Column header for week of the year
    dateFormat: 'mm/dd/yy', // See format options on parseDate
    firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
    isRTL: false, // True if right-to-left language, false if left-to-right
    showMonthAfterYear: false, // True if the year select precedes month, false for month then year
    yearSuffix: '' // Additional text to append to the year in the month headers
  };
  this._defaults = { // Global defaults for all the date picker instances
    showOn: 'focus', // 'focus' for popup on focus,
      // 'button' for trigger button, or 'both' for either
    showAnim: 'fadeIn', // Name of jQuery animation for popup
    showOptions: {}, // Options for enhanced animations
    defaultDate: null, // Used when field is blank: actual date,
      // +/-number for offset from today, null for today
    appendText: '', // Display text following the input box, e.g. showing the format
    buttonText: '...', // Text for trigger button
    buttonImage: '', // URL for trigger button image
    buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
    hideIfNoPrevNext: false, // True to hide next/previous month links
      // if not applicable, false to just disable them
    navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
    gotoCurrent: false, // True if today link goes back to current selection instead
    changeMonth: false, // True if month can be selected directly, false if only prev/next
    changeYear: false, // True if year can be selected directly, false if only prev/next
    yearRange: 'c-10:c+10', // Range of years to display in drop-down,
      // either relative to today's year (-nn:+nn), relative to currently displayed year
      // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
    showOtherMonths: false, // True to show dates in other months, false to leave blank
    selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
    showWeek: false, // True to show week of the year, false to not show it
    calculateWeek: this.iso8601Week, // How to calculate the week of the year,
      // takes a Date and returns the number of the week for it
    shortYearCutoff: '+10', // Short year values < this are in the current century,
      // > this are in the previous century,
      // string value starting with '+' for current year + value
    minDate: null, // The earliest selectable date, or null for no limit
    maxDate: null, // The latest selectable date, or null for no limit
    duration: 'fast', // Duration of display/closure
    beforeShowDay: null, // Function that takes a date and returns an array with
      // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
      // [2] = cell title (optional), e.g. $.datepicker.noWeekends
    beforeShow: null, // Function that takes an input field and
      // returns a set of custom settings for the date picker
    onSelect: null, // Define a callback function when a date is selected
    onChangeMonthYear: null, // Define a callback function when the month or year is changed
    onClose: null, // Define a callback function when the datepicker is closed
    numberOfMonths: 1, // Number of months to show at a time
    showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
    stepMonths: 1, // Number of months to step back/forward
    stepBigMonths: 12, // Number of months to step back/forward for the big links
    altField: '', // Selector for an alternate field to store selected dates into
    altFormat: '', // The date format to use for the alternate field
    constrainInput: true, // The input is constrained by the current date format
    showButtonPanel: false, // True to show button panel, false to not show it
    autoSize: false, // True to size the input for the date format, false to leave as is
    disabled: false // The initial disabled state
  };
  $.extend(this._defaults, this.regional['']);
  this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
}

$.extend(Datepicker.prototype, {
  /* Class name added to elements to indicate already configured with a date picker. */
  markerClassName: 'hasDatepicker',

  //Keep track of the maximum number of rows displayed (see #7043)
  maxRows: 4,

  /* Debug logging (if enabled). */
  log: function () {
    if (this.debug)
      console.log.apply('', arguments);
  },

  // TODO rename to "widget" when switching to widget factory
  _widgetDatepicker: function() {
    return this.dpDiv;
  },

  /* Override the default settings for all instances of the date picker.
     @param  settings  object - the new settings to use as defaults (anonymous object)
     @return the manager object */
  setDefaults: function(settings) {
    extendRemove(this._defaults, settings || {});
    return this;
  },

  /* Attach the date picker to a jQuery selection.
     @param  target    element - the target input field or division or span
     @param  settings  object - the new settings to use for this date picker instance (anonymous) */
  _attachDatepicker: function(target, settings) {
    // check for settings on the control itself - in namespace 'date:'
    var inlineSettings = null;
    for (var attrName in this._defaults) {
      var attrValue = target.getAttribute('date:' + attrName);
      if (attrValue) {
        inlineSettings = inlineSettings || {};
        try {
          inlineSettings[attrName] = eval(attrValue);
        } catch (err) {
          inlineSettings[attrName] = attrValue;
        }
      }
    }
    var nodeName = target.nodeName.toLowerCase();
    var inline = (nodeName == 'div' || nodeName == 'span');
    if (!target.id) {
      this.uuid += 1;
      target.id = 'dp' + this.uuid;
    }
    var inst = this._newInst($(target), inline);
    inst.settings = $.extend({}, settings || {}, inlineSettings || {});
    if (nodeName == 'input') {
      this._connectDatepicker(target, inst);
    } else if (inline) {
      this._inlineDatepicker(target, inst);
    }
  },

  /* Create a new instance object. */
  _newInst: function(target, inline) {
    var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
    return {id: id, input: target, // associated target
      selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
      drawMonth: 0, drawYear: 0, // month being drawn
      inline: inline, // is datepicker inline or not
      dpDiv: (!inline ? this.dpDiv : // presentation div
      bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')))};
  },

  /* Attach the date picker to an input field. */
  _connectDatepicker: function(target, inst) {
    var input = $(target);
    inst.append = $([]);
    inst.trigger = $([]);
    if (input.hasClass(this.markerClassName))
      return;
    this._attachments(input, inst);
    input.addClass(this.markerClassName).keydown(this._doKeyDown).
      keypress(this._doKeyPress).keyup(this._doKeyUp).
      bind("setData.datepicker", function(event, key, value) {
        inst.settings[key] = value;
      }).bind("getData.datepicker", function(event, key) {
        return this._get(inst, key);
      });
    this._autoSize(inst);
    $.data(target, PROP_NAME, inst);
    //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
    if( inst.settings.disabled ) {
      this._disableDatepicker( target );
    }
  },

  /* Make attachments based on settings. */
  _attachments: function(input, inst) {
    var appendText = this._get(inst, 'appendText');
    var isRTL = this._get(inst, 'isRTL');
    if (inst.append)
      inst.append.remove();
    if (appendText) {
      inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
      input[isRTL ? 'before' : 'after'](inst.append);
    }
    input.unbind('focus', this._showDatepicker);
    if (inst.trigger)
      inst.trigger.remove();
    var showOn = this._get(inst, 'showOn');
    if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
      input.focus(this._showDatepicker);
    if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
      var buttonText = this._get(inst, 'buttonText');
      var buttonImage = this._get(inst, 'buttonImage');
      inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
        $('<img/>').addClass(this._triggerClass).
          attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
        $('<button type="button"></button>').addClass(this._triggerClass).
          html(buttonImage == '' ? buttonText : $('<img/>').attr(
          { src:buttonImage, alt:buttonText, title:buttonText })));
      input[isRTL ? 'before' : 'after'](inst.trigger);
      inst.trigger.click(function() {
        if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0])
          $.datepicker._hideDatepicker();
        else if ($.datepicker._datepickerShowing && $.datepicker._lastInput != input[0]) {
          $.datepicker._hideDatepicker();
          $.datepicker._showDatepicker(input[0]);
        } else
          $.datepicker._showDatepicker(input[0]);
        return false;
      });
    }
  },

  /* Apply the maximum length for the date format. */
  _autoSize: function(inst) {
    if (this._get(inst, 'autoSize') && !inst.inline) {
      var date = new Date(2009, 12 - 1, 20); // Ensure double digits
      var dateFormat = this._get(inst, 'dateFormat');
      if (dateFormat.match(/[DM]/)) {
        var findMax = function(names) {
          var max = 0;
          var maxI = 0;
          for (var i = 0; i < names.length; i++) {
            if (names[i].length > max) {
              max = names[i].length;
              maxI = i;
            }
          }
          return maxI;
        };
        date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
          'monthNames' : 'monthNamesShort'))));
        date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
          'dayNames' : 'dayNamesShort'))) + 20 - date.getDay());
      }
      inst.input.attr('size', this._formatDate(inst, date).length);
    }
  },

  /* Attach an inline date picker to a div. */
  _inlineDatepicker: function(target, inst) {
    var divSpan = $(target);
    if (divSpan.hasClass(this.markerClassName))
      return;
    divSpan.addClass(this.markerClassName).append(inst.dpDiv).
      bind("setData.datepicker", function(event, key, value){
        inst.settings[key] = value;
      }).bind("getData.datepicker", function(event, key){
        return this._get(inst, key);
      });
    $.data(target, PROP_NAME, inst);
    this._setDate(inst, this._getDefaultDate(inst), true);
    this._updateDatepicker(inst);
    this._updateAlternate(inst);
    //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
    if( inst.settings.disabled ) {
      this._disableDatepicker( target );
    }
    // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
    // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
    inst.dpDiv.css( "display", "block" );
  },

  /* Pop-up the date picker in a "dialog" box.
     @param  input     element - ignored
     @param  date      string or Date - the initial date to display
     @param  onSelect  function - the function to call when a date is selected
     @param  settings  object - update the dialog date picker instance's settings (anonymous object)
     @param  pos       int[2] - coordinates for the dialog's position within the screen or
                       event - with x/y coordinates or
                       leave empty for default (screen centre)
     @return the manager object */
  _dialogDatepicker: function(input, date, onSelect, settings, pos) {
    var inst = this._dialogInst; // internal instance
    if (!inst) {
      this.uuid += 1;
      var id = 'dp' + this.uuid;
      this._dialogInput = $('<input type="text" id="' + id +
        '" style="position: absolute; top: -100px; width: 0px;"/>');
      this._dialogInput.keydown(this._doKeyDown);
      $('body').append(this._dialogInput);
      inst = this._dialogInst = this._newInst(this._dialogInput, false);
      inst.settings = {};
      $.data(this._dialogInput[0], PROP_NAME, inst);
    }
    extendRemove(inst.settings, settings || {});
    date = (date && date.constructor == Date ? this._formatDate(inst, date) : date);
    this._dialogInput.val(date);

    this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
    if (!this._pos) {
      var browserWidth = document.documentElement.clientWidth;
      var browserHeight = document.documentElement.clientHeight;
      var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      this._pos = // should use actual width/height below
        [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
    }

    // move input on screen for focus, but hidden behind dialog
    this._dialogInput.css('left', (this._pos[0] + 20) + 'px').css('top', this._pos[1] + 'px');
    inst.settings.onSelect = onSelect;
    this._inDialog = true;
    this.dpDiv.addClass(this._dialogClass);
    this._showDatepicker(this._dialogInput[0]);
    if ($.blockUI)
      $.blockUI(this.dpDiv);
    $.data(this._dialogInput[0], PROP_NAME, inst);
    return this;
  },

  /* Detach a datepicker from its control.
     @param  target    element - the target input field or division or span */
  _destroyDatepicker: function(target) {
    var $target = $(target);
    var inst = $.data(target, PROP_NAME);
    if (!$target.hasClass(this.markerClassName)) {
      return;
    }
    var nodeName = target.nodeName.toLowerCase();
    $.removeData(target, PROP_NAME);
    if (nodeName == 'input') {
      inst.append.remove();
      inst.trigger.remove();
      $target.removeClass(this.markerClassName).
        unbind('focus', this._showDatepicker).
        unbind('keydown', this._doKeyDown).
        unbind('keypress', this._doKeyPress).
        unbind('keyup', this._doKeyUp);
    } else if (nodeName == 'div' || nodeName == 'span')
      $target.removeClass(this.markerClassName).empty();
  },

  /* Enable the date picker to a jQuery selection.
     @param  target    element - the target input field or division or span */
  _enableDatepicker: function(target) {
    var $target = $(target);
    var inst = $.data(target, PROP_NAME);
    if (!$target.hasClass(this.markerClassName)) {
      return;
    }
    var nodeName = target.nodeName.toLowerCase();
    if (nodeName == 'input') {
      target.disabled = false;
      inst.trigger.filter('button').
        each(function() { this.disabled = false; }).end().
        filter('img').css({opacity: '1.0', cursor: ''});
    }
    else if (nodeName == 'div' || nodeName == 'span') {
      var inline = $target.children('.' + this._inlineClass);
      inline.children().removeClass('ui-state-disabled');
      inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
        prop("disabled", false);
    }
    this._disabledInputs = $.map(this._disabledInputs,
      function(value) { return (value == target ? null : value); }); // delete entry
  },

  /* Disable the date picker to a jQuery selection.
     @param  target    element - the target input field or division or span */
  _disableDatepicker: function(target) {
    var $target = $(target);
    var inst = $.data(target, PROP_NAME);
    if (!$target.hasClass(this.markerClassName)) {
      return;
    }
    var nodeName = target.nodeName.toLowerCase();
    if (nodeName == 'input') {
      target.disabled = true;
      inst.trigger.filter('button').
        each(function() { this.disabled = true; }).end().
        filter('img').css({opacity: '0.5', cursor: 'default'});
    }
    else if (nodeName == 'div' || nodeName == 'span') {
      var inline = $target.children('.' + this._inlineClass);
      inline.children().addClass('ui-state-disabled');
      inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
        prop("disabled", true);
    }
    this._disabledInputs = $.map(this._disabledInputs,
      function(value) { return (value == target ? null : value); }); // delete entry
    this._disabledInputs[this._disabledInputs.length] = target;
  },

  /* Is the first field in a jQuery collection disabled as a datepicker?
     @param  target    element - the target input field or division or span
     @return boolean - true if disabled, false if enabled */
  _isDisabledDatepicker: function(target) {
    if (!target) {
      return false;
    }
    for (var i = 0; i < this._disabledInputs.length; i++) {
      if (this._disabledInputs[i] == target)
        return true;
    }
    return false;
  },

  /* Retrieve the instance data for the target control.
     @param  target  element - the target input field or division or span
     @return  object - the associated instance data
     @throws  error if a jQuery problem getting data */
  _getInst: function(target) {
    try {
      return $.data(target, PROP_NAME);
    }
    catch (err) {
      throw 'Missing instance data for this datepicker';
    }
  },

  /* Update or retrieve the settings for a date picker attached to an input field or division.
     @param  target  element - the target input field or division or span
     @param  name    object - the new settings to update or
                     string - the name of the setting to change or retrieve,
                     when retrieving also 'all' for all instance settings or
                     'defaults' for all global defaults
     @param  value   any - the new value for the setting
                     (omit if above is an object or to retrieve a value) */
  _optionDatepicker: function(target, name, value) {
    var inst = this._getInst(target);
    if (arguments.length == 2 && typeof name == 'string') {
      return (name == 'defaults' ? $.extend({}, $.datepicker._defaults) :
        (inst ? (name == 'all' ? $.extend({}, inst.settings) :
        this._get(inst, name)) : null));
    }
    var settings = name || {};
    if (typeof name == 'string') {
      settings = {};
      settings[name] = value;
    }
    if (inst) {
      if (this._curInst == inst) {
        this._hideDatepicker();
      }
      var date = this._getDateDatepicker(target, true);
      var minDate = this._getMinMaxDate(inst, 'min');
      var maxDate = this._getMinMaxDate(inst, 'max');
      extendRemove(inst.settings, settings);
      // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
      if (minDate !== null && settings['dateFormat'] !== undefined && settings['minDate'] === undefined)
        inst.settings.minDate = this._formatDate(inst, minDate);
      if (maxDate !== null && settings['dateFormat'] !== undefined && settings['maxDate'] === undefined)
        inst.settings.maxDate = this._formatDate(inst, maxDate);
      this._attachments($(target), inst);
      this._autoSize(inst);
      this._setDate(inst, date);
      this._updateAlternate(inst);
      this._updateDatepicker(inst);
    }
  },

  // change method deprecated
  _changeDatepicker: function(target, name, value) {
    this._optionDatepicker(target, name, value);
  },

  /* Redraw the date picker attached to an input field or division.
     @param  target  element - the target input field or division or span */
  _refreshDatepicker: function(target) {
    var inst = this._getInst(target);
    if (inst) {
      this._updateDatepicker(inst);
    }
  },

  /* Set the dates for a jQuery selection.
     @param  target   element - the target input field or division or span
     @param  date     Date - the new date */
  _setDateDatepicker: function(target, date) {
    var inst = this._getInst(target);
    if (inst) {
      this._setDate(inst, date);
      this._updateDatepicker(inst);
      this._updateAlternate(inst);
    }
  },

  /* Get the date(s) for the first entry in a jQuery selection.
     @param  target     element - the target input field or division or span
     @param  noDefault  boolean - true if no default date is to be used
     @return Date - the current date */
  _getDateDatepicker: function(target, noDefault) {
    var inst = this._getInst(target);
    if (inst && !inst.inline)
      this._setDateFromField(inst, noDefault);
    return (inst ? this._getDate(inst) : null);
  },

  /* Handle keystrokes. */
  _doKeyDown: function(event) {
    var inst = $.datepicker._getInst(event.target);
    var handled = true;
    var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
    inst._keyEvent = true;
    if ($.datepicker._datepickerShowing)
      switch (event.keyCode) {
        case 9: $.datepicker._hideDatepicker();
            handled = false;
            break; // hide on tab out
        case 13: var sel = $('td.' + $.datepicker._dayOverClass + ':not(.' +
                  $.datepicker._currentClass + ')', inst.dpDiv);
            if (sel[0])
              $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
              var onSelect = $.datepicker._get(inst, 'onSelect');
              if (onSelect) {
                var dateStr = $.datepicker._formatDate(inst);

                // trigger custom callback
                onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
              }
            else
              $.datepicker._hideDatepicker();
            return false; // don't submit the form
            break; // select the value on enter
        case 27: $.datepicker._hideDatepicker();
            break; // hide on escape
        case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
              -$.datepicker._get(inst, 'stepBigMonths') :
              -$.datepicker._get(inst, 'stepMonths')), 'M');
            break; // previous month/year on page up/+ ctrl
        case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
              +$.datepicker._get(inst, 'stepBigMonths') :
              +$.datepicker._get(inst, 'stepMonths')), 'M');
            break; // next month/year on page down/+ ctrl
        case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
            handled = event.ctrlKey || event.metaKey;
            break; // clear on ctrl or command +end
        case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
            handled = event.ctrlKey || event.metaKey;
            break; // current on ctrl or command +home
        case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
            handled = event.ctrlKey || event.metaKey;
            // -1 day on ctrl or command +left
            if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                  -$.datepicker._get(inst, 'stepBigMonths') :
                  -$.datepicker._get(inst, 'stepMonths')), 'M');
            // next month/year on alt +left on Mac
            break;
        case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
            handled = event.ctrlKey || event.metaKey;
            break; // -1 week on ctrl or command +up
        case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
            handled = event.ctrlKey || event.metaKey;
            // +1 day on ctrl or command +right
            if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                  +$.datepicker._get(inst, 'stepBigMonths') :
                  +$.datepicker._get(inst, 'stepMonths')), 'M');
            // next month/year on alt +right
            break;
        case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
            handled = event.ctrlKey || event.metaKey;
            break; // +1 week on ctrl or command +down
        default: handled = false;
      }
    else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
      $.datepicker._showDatepicker(this);
    else {
      handled = false;
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  },

  /* Filter entered characters - based on date format. */
  _doKeyPress: function(event) {
    var inst = $.datepicker._getInst(event.target);
    if ($.datepicker._get(inst, 'constrainInput')) {
      var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
      var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
      return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
    }
  },

  /* Synchronise manual entry and field/alternate field. */
  _doKeyUp: function(event) {
    var inst = $.datepicker._getInst(event.target);
    if (inst.input.val() != inst.lastVal) {
      try {
        var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
          (inst.input ? inst.input.val() : null),
          $.datepicker._getFormatConfig(inst));
        if (date) { // only if valid
          $.datepicker._setDateFromField(inst);
          $.datepicker._updateAlternate(inst);
          $.datepicker._updateDatepicker(inst);
        }
      }
      catch (err) {
        $.datepicker.log(err);
      }
    }
    return true;
  },

  /* Pop-up the date picker for a given input field.
     If false returned from beforeShow event handler do not show.
     @param  input  element - the input field attached to the date picker or
                    event - if triggered by focus */
  _showDatepicker: function(input) {
    input = input.target || input;
    if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
      input = $('input', input.parentNode)[0];
    if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
      return;
    var inst = $.datepicker._getInst(input);
    if ($.datepicker._curInst && $.datepicker._curInst != inst) {
      $.datepicker._curInst.dpDiv.stop(true, true);
      if ( inst && $.datepicker._datepickerShowing ) {
        $.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
      }
    }
    var beforeShow = $.datepicker._get(inst, 'beforeShow');
    var beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
    if(beforeShowSettings === false){
      //false
      return;
    }
    extendRemove(inst.settings, beforeShowSettings);
    inst.lastVal = null;
    $.datepicker._lastInput = input;
    $.datepicker._setDateFromField(inst);
    if ($.datepicker._inDialog) // hide cursor
      input.value = '';
    if (!$.datepicker._pos) { // position below input
      $.datepicker._pos = $.datepicker._findPos(input);
      $.datepicker._pos[1] += input.offsetHeight; // add the height
    }
    var isFixed = false;
    $(input).parents().each(function() {
      isFixed |= $(this).css('position') == 'fixed';
      return !isFixed;
    });
    var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
    $.datepicker._pos = null;
    //to avoid flashes on Firefox
    inst.dpDiv.empty();
    // determine sizing offscreen
    inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
    $.datepicker._updateDatepicker(inst);
    // fix width for dynamic number of date pickers
    // and adjust position before showing
    offset = $.datepicker._checkOffset(inst, offset, isFixed);
    inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
      'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
      left: offset.left + 'px', top: offset.top + 'px'});
    if (!inst.inline) {
      var showAnim = $.datepicker._get(inst, 'showAnim');
      var duration = $.datepicker._get(inst, 'duration');
      var postProcess = function() {
        var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
        if( !! cover.length ){
          var borders = $.datepicker._getBorders(inst.dpDiv);
          cover.css({left: -borders[0], top: -borders[1],
            width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()});
        }
      };
      inst.dpDiv.zIndex($(input).zIndex()+1);
      $.datepicker._datepickerShowing = true;

      // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
      if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
        inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
      else
        inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
      if (!showAnim || !duration)
        postProcess();
      if (inst.input.is(':visible') && !inst.input.is(':disabled'))
        inst.input.focus();
      $.datepicker._curInst = inst;
    }
  },

  /* Generate the date picker content. */
  _updateDatepicker: function(inst) {
    this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
    var borders = $.datepicker._getBorders(inst.dpDiv);
    instActive = inst; // for delegate hover events
    inst.dpDiv.empty().append(this._generateHTML(inst));
    this._attachHandlers(inst);
    var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
    if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
      cover.css({left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()})
    }
    inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();
    var numMonths = this._getNumberOfMonths(inst);
    var cols = numMonths[1];
    var width = 17;
    inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
    if (cols > 1)
      inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
    inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
      'Class']('ui-datepicker-multi');
    inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
      'Class']('ui-datepicker-rtl');
    if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
        // #6694 - don't focus the input if it's already focused
        // this breaks the change event in IE
        inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
      inst.input.focus();
    // deffered render of the years select (to avoid flashes on Firefox)
    if( inst.yearshtml ){
      var origyearshtml = inst.yearshtml;
      setTimeout(function(){
        //assure that inst.yearshtml didn't change.
        if( origyearshtml === inst.yearshtml && inst.yearshtml ){
          inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
        }
        origyearshtml = inst.yearshtml = null;
      }, 0);
    }
  },

  /* Retrieve the size of left and top borders for an element.
     @param  elem  (jQuery object) the element of interest
     @return  (number[2]) the left and top borders */
  _getBorders: function(elem) {
    var convert = function(value) {
      return {thin: 1, medium: 2, thick: 3}[value] || value;
    };
    return [parseFloat(convert(elem.css('border-left-width'))),
      parseFloat(convert(elem.css('border-top-width')))];
  },

  /* Check positioning to remain on screen. */
  _checkOffset: function(inst, offset, isFixed) {
    var dpWidth = inst.dpDiv.outerWidth();
    var dpHeight = inst.dpDiv.outerHeight();
    var inputWidth = inst.input ? inst.input.outerWidth() : 0;
    var inputHeight = inst.input ? inst.input.outerHeight() : 0;
    var viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());
    var viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

    offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
    offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
    offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

    // now check if datepicker is showing outside window viewport - move to a better place if so.
    offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
      Math.abs(offset.left + dpWidth - viewWidth) : 0);
    offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
      Math.abs(dpHeight + inputHeight) : 0);

    return offset;
  },

  /* Find an object's position on the screen. */
  _findPos: function(obj) {
    var inst = this._getInst(obj);
    var isRTL = this._get(inst, 'isRTL');
    while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
      obj = obj[isRTL ? 'previousSibling' : 'nextSibling'];
    }
    var position = $(obj).offset();
    return [position.left, position.top];
  },

  /* Hide the date picker from view.
     @param  input  element - the input field attached to the date picker */
  _hideDatepicker: function(input) {
    var inst = this._curInst;
    if (!inst || (input && inst != $.data(input, PROP_NAME)))
      return;
    if (this._datepickerShowing) {
      var showAnim = this._get(inst, 'showAnim');
      var duration = this._get(inst, 'duration');
      var postProcess = function() {
        $.datepicker._tidyDialog(inst);
      };

      // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
      if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
        inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
      else
        inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp' :
          (showAnim == 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), postProcess);
      if (!showAnim)
        postProcess();
      this._datepickerShowing = false;
      var onClose = this._get(inst, 'onClose');
      if (onClose)
        onClose.apply((inst.input ? inst.input[0] : null),
          [(inst.input ? inst.input.val() : ''), inst]);
      this._lastInput = null;
      if (this._inDialog) {
        this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
        if ($.blockUI) {
          $.unblockUI();
          $('body').append(this.dpDiv);
        }
      }
      this._inDialog = false;
    }
  },

  /* Tidy up after a dialog display. */
  _tidyDialog: function(inst) {
    inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
  },

  /* Close date picker if clicked elsewhere. */
  _checkExternalClick: function(event) {
    if (!$.datepicker._curInst)
      return;

    var $target = $(event.target),
      inst = $.datepicker._getInst($target[0]);

    if ( ( ( $target[0].id != $.datepicker._mainDivId &&
        $target.parents('#' + $.datepicker._mainDivId).length == 0 &&
        !$target.hasClass($.datepicker.markerClassName) &&
        !$target.closest("." + $.datepicker._triggerClass).length &&
        $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
      ( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != inst ) )
      $.datepicker._hideDatepicker();
  },

  /* Adjust one of the date sub-fields. */
  _adjustDate: function(id, offset, period) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    if (this._isDisabledDatepicker(target[0])) {
      return;
    }
    this._adjustInstDate(inst, offset +
      (period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
      period);
    this._updateDatepicker(inst);
  },

  /* Action for current link. */
  _gotoToday: function(id) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
      inst.selectedDay = inst.currentDay;
      inst.drawMonth = inst.selectedMonth = inst.currentMonth;
      inst.drawYear = inst.selectedYear = inst.currentYear;
    }
    else {
      var date = new Date();
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
    }
    this._notifyChange(inst);
    this._adjustDate(target);
  },

  /* Action for selecting a new month/year. */
  _selectMonthYear: function(id, select, period) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
    inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
      parseInt(select.options[select.selectedIndex].value,10);
    this._notifyChange(inst);
    this._adjustDate(target);
  },

  /* Action for selecting a day. */
  _selectDay: function(id, month, year, td) {
    var target = $(id);
    if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
      return;
    }
    var inst = this._getInst(target[0]);
    inst.selectedDay = inst.currentDay = $('a', td).html();
    inst.selectedMonth = inst.currentMonth = month;
    inst.selectedYear = inst.currentYear = year;
    this._selectDate(id, this._formatDate(inst,
      inst.currentDay, inst.currentMonth, inst.currentYear));
  },

  /* Erase the input field and hide the date picker. */
  _clearDate: function(id) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    this._selectDate(target, '');
  },

  /* Update the input field with the selected date. */
  _selectDate: function(id, dateStr) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
    if (inst.input)
      inst.input.val(dateStr);
    this._updateAlternate(inst);
    var onSelect = this._get(inst, 'onSelect');
    if (onSelect)
      onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
    else if (inst.input)
      inst.input.trigger('change'); // fire the change event
    if (inst.inline)
      this._updateDatepicker(inst);
    else {
      this._hideDatepicker();
      this._lastInput = inst.input[0];
      if (typeof(inst.input[0]) != 'object')
        inst.input.focus(); // restore focus
      this._lastInput = null;
    }
  },

  /* Update any alternate field to synchronise with the main field. */
  _updateAlternate: function(inst) {
    var altField = this._get(inst, 'altField');
    if (altField) { // update alternate field too
      var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
      var date = this._getDate(inst);
      var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
      $(altField).each(function() { $(this).val(dateStr); });
    }
  },

  /* Set as beforeShowDay function to prevent selection of weekends.
     @param  date  Date - the date to customise
     @return [boolean, string] - is this date selectable?, what is its CSS class? */
  noWeekends: function(date) {
    var day = date.getDay();
    return [(day > 0 && day < 6), ''];
  },

  /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
     @param  date  Date - the date to get the week for
     @return  number - the number of the week within the year that contains this date */
  iso8601Week: function(date) {
    var checkDate = new Date(date.getTime());
    // Find Thursday of this week starting on Monday
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    var time = checkDate.getTime();
    checkDate.setMonth(0); // Compare with Jan 1
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
  },

  /* Parse a string value into a date object.
     See formatDate below for the possible formats.

     @param  format    string - the expected format of the date
     @param  value     string - the date in the above format
     @param  settings  Object - attributes include:
                       shortYearCutoff  number - the cutoff year for determining the century (optional)
                       dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
                       dayNames         string[7] - names of the days from Sunday (optional)
                       monthNamesShort  string[12] - abbreviated names of the months (optional)
                       monthNames       string[12] - names of the months (optional)
     @return  Date - the extracted date value or null if value is blank */
  parseDate: function (format, value, settings) {
    if (format == null || value == null)
      throw 'Invalid arguments';
    value = (typeof value == 'object' ? value.toString() : value + '');
    if (value == '')
      return null;
    var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
    shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
        new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
    var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
    var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
    var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
    var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
    var year = -1;
    var month = -1;
    var day = -1;
    var doy = -1;
    var literal = false;
    // Check whether a format character is doubled
    var lookAhead = function(match) {
      var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      if (matches)
        iFormat++;
      return matches;
    };
    // Extract a number from the string value
    var getNumber = function(match) {
      var isDoubled = lookAhead(match);
      var size = (match == '@' ? 14 : (match == '!' ? 20 :
        (match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
      var digits = new RegExp('^\\d{1,' + size + '}');
      var num = value.substring(iValue).match(digits);
      if (!num)
        throw 'Missing number at position ' + iValue;
      iValue += num[0].length;
      return parseInt(num[0], 10);
    };
    // Extract a name from the string value and convert to an index
    var getName = function(match, shortNames, longNames) {
      var names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
        return [ [k, v] ];
      }).sort(function (a, b) {
        return -(a[1].length - b[1].length);
      });
      var index = -1;
      $.each(names, function (i, pair) {
        var name = pair[1];
        if (value.substr(iValue, name.length).toLowerCase() == name.toLowerCase()) {
          index = pair[0];
          iValue += name.length;
          return false;
        }
      });
      if (index != -1)
        return index + 1;
      else
        throw 'Unknown name at position ' + iValue;
    };
    // Confirm that a literal character matches the string value
    var checkLiteral = function() {
      if (value.charAt(iValue) != format.charAt(iFormat))
        throw 'Unexpected literal at position ' + iValue;
      iValue++;
    };
    var iValue = 0;
    for (var iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal)
        if (format.charAt(iFormat) == "'" && !lookAhead("'"))
          literal = false;
        else
          checkLiteral();
      else
        switch (format.charAt(iFormat)) {
          case 'd':
            day = getNumber('d');
            break;
          case 'D':
            getName('D', dayNamesShort, dayNames);
            break;
          case 'o':
            doy = getNumber('o');
            break;
          case 'm':
            month = getNumber('m');
            break;
          case 'M':
            month = getName('M', monthNamesShort, monthNames);
            break;
          case 'y':
            year = getNumber('y');
            break;
          case '@':
            var date = new Date(getNumber('@'));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case '!':
            var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "'":
            if (lookAhead("'"))
              checkLiteral();
            else
              literal = true;
            break;
          default:
            checkLiteral();
        }
    }
    if (iValue < value.length){
      var extra = value.substr(iValue);
      if (!/^\s+/.test(extra)) {
        throw "Extra/unparsed characters found in date: " + extra;
      }
    }
    if (year == -1)
      year = new Date().getFullYear();
    else if (year < 100)
      year += new Date().getFullYear() - new Date().getFullYear() % 100 +
        (year <= shortYearCutoff ? 0 : -100);
    if (doy > -1) {
      month = 1;
      day = doy;
      do {
        var dim = this._getDaysInMonth(year, month - 1);
        if (day <= dim)
          break;
        month++;
        day -= dim;
      } while (true);
    }
    var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
    if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
      throw 'Invalid date'; // E.g. 31/02/00
    return date;
  },

  /* Standard date formats. */
  ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
  COOKIE: 'D, dd M yy',
  ISO_8601: 'yy-mm-dd',
  RFC_822: 'D, d M y',
  RFC_850: 'DD, dd-M-y',
  RFC_1036: 'D, d M y',
  RFC_1123: 'D, d M yy',
  RFC_2822: 'D, d M yy',
  RSS: 'D, d M y', // RFC 822
  TICKS: '!',
  TIMESTAMP: '@',
  W3C: 'yy-mm-dd', // ISO 8601

  _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
    Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

  /* Format a date object into a string value.
     The format can be combinations of the following:
     d  - day of month (no leading zero)
     dd - day of month (two digit)
     o  - day of year (no leading zeros)
     oo - day of year (three digit)
     D  - day name short
     DD - day name long
     m  - month of year (no leading zero)
     mm - month of year (two digit)
     M  - month name short
     MM - month name long
     y  - year (two digit)
     yy - year (four digit)
     @ - Unix timestamp (ms since 01/01/1970)
     ! - Windows ticks (100ns since 01/01/0001)
     '...' - literal text
     '' - single quote

     @param  format    string - the desired format of the date
     @param  date      Date - the date value to format
     @param  settings  Object - attributes include:
                       dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
                       dayNames         string[7] - names of the days from Sunday (optional)
                       monthNamesShort  string[12] - abbreviated names of the months (optional)
                       monthNames       string[12] - names of the months (optional)
     @return  string - the date in the above format */
  formatDate: function (format, date, settings) {
    if (!date)
      return '';
    var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
    var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
    var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
    var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
    // Check whether a format character is doubled
    var lookAhead = function(match) {
      var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      if (matches)
        iFormat++;
      return matches;
    };
    // Format a number, with leading zero if necessary
    var formatNumber = function(match, value, len) {
      var num = '' + value;
      if (lookAhead(match))
        while (num.length < len)
          num = '0' + num;
      return num;
    };
    // Format a name, short or long as requested
    var formatName = function(match, value, shortNames, longNames) {
      return (lookAhead(match) ? longNames[value] : shortNames[value]);
    };
    var output = '';
    var literal = false;
    if (date)
      for (var iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal)
          if (format.charAt(iFormat) == "'" && !lookAhead("'"))
            literal = false;
          else
            output += format.charAt(iFormat);
        else
          switch (format.charAt(iFormat)) {
            case 'd':
              output += formatNumber('d', date.getDate(), 2);
              break;
            case 'D':
              output += formatName('D', date.getDay(), dayNamesShort, dayNames);
              break;
            case 'o':
              output += formatNumber('o',
                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
              break;
            case 'm':
              output += formatNumber('m', date.getMonth() + 1, 2);
              break;
            case 'M':
              output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
              break;
            case 'y':
              output += (lookAhead('y') ? date.getFullYear() :
                (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
              break;
            case '@':
              output += date.getTime();
              break;
            case '!':
              output += date.getTime() * 10000 + this._ticksTo1970;
              break;
            case "'":
              if (lookAhead("'"))
                output += "'";
              else
                literal = true;
              break;
            default:
              output += format.charAt(iFormat);
          }
      }
    return output;
  },

  /* Extract all possible characters from the date format. */
  _possibleChars: function (format) {
    var chars = '';
    var literal = false;
    // Check whether a format character is doubled
    var lookAhead = function(match) {
      var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      if (matches)
        iFormat++;
      return matches;
    };
    for (var iFormat = 0; iFormat < format.length; iFormat++)
      if (literal)
        if (format.charAt(iFormat) == "'" && !lookAhead("'"))
          literal = false;
        else
          chars += format.charAt(iFormat);
      else
        switch (format.charAt(iFormat)) {
          case 'd': case 'm': case 'y': case '@':
            chars += '0123456789';
            break;
          case 'D': case 'M':
            return null; // Accept anything
          case "'":
            if (lookAhead("'"))
              chars += "'";
            else
              literal = true;
            break;
          default:
            chars += format.charAt(iFormat);
        }
    return chars;
  },

  /* Get a setting value, defaulting if necessary. */
  _get: function(inst, name) {
    return inst.settings[name] !== undefined ?
      inst.settings[name] : this._defaults[name];
  },

  /* Parse existing date and initialise date picker. */
  _setDateFromField: function(inst, noDefault) {
    if (inst.input.val() == inst.lastVal) {
      return;
    }
    var dateFormat = this._get(inst, 'dateFormat');
    var dates = inst.lastVal = inst.input ? inst.input.val() : null;
    var date, defaultDate;
    date = defaultDate = this._getDefaultDate(inst);
    var settings = this._getFormatConfig(inst);
    try {
      date = this.parseDate(dateFormat, dates, settings) || defaultDate;
    } catch (event) {
      this.log(event);
      dates = (noDefault ? '' : dates);
    }
    inst.selectedDay = date.getDate();
    inst.drawMonth = inst.selectedMonth = date.getMonth();
    inst.drawYear = inst.selectedYear = date.getFullYear();
    inst.currentDay = (dates ? date.getDate() : 0);
    inst.currentMonth = (dates ? date.getMonth() : 0);
    inst.currentYear = (dates ? date.getFullYear() : 0);
    this._adjustInstDate(inst);
  },

  /* Retrieve the default date shown on opening. */
  _getDefaultDate: function(inst) {
    return this._restrictMinMax(inst,
      this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
  },

  /* A date may be specified as an exact value or a relative one. */
  _determineDate: function(inst, date, defaultDate) {
    var offsetNumeric = function(offset) {
      var date = new Date();
      date.setDate(date.getDate() + offset);
      return date;
    };
    var offsetString = function(offset) {
      try {
        return $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
          offset, $.datepicker._getFormatConfig(inst));
      }
      catch (e) {
        // Ignore
      }
      var date = (offset.toLowerCase().match(/^c/) ?
        $.datepicker._getDate(inst) : null) || new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
      var matches = pattern.exec(offset);
      while (matches) {
        switch (matches[2] || 'd') {
          case 'd' : case 'D' :
            day += parseInt(matches[1],10); break;
          case 'w' : case 'W' :
            day += parseInt(matches[1],10) * 7; break;
          case 'm' : case 'M' :
            month += parseInt(matches[1],10);
            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
            break;
          case 'y': case 'Y' :
            year += parseInt(matches[1],10);
            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
            break;
        }
        matches = pattern.exec(offset);
      }
      return new Date(year, month, day);
    };
    var newDate = (date == null || date === '' ? defaultDate : (typeof date == 'string' ? offsetString(date) :
      (typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));
    newDate = (newDate && newDate.toString() == 'Invalid Date' ? defaultDate : newDate);
    if (newDate) {
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    }
    return this._daylightSavingAdjust(newDate);
  },

  /* Handle switch to/from daylight saving.
     Hours may be non-zero on daylight saving cut-over:
     > 12 when midnight changeover, but then cannot generate
     midnight datetime, so jump to 1AM, otherwise reset.
     @param  date  (Date) the date to check
     @return  (Date) the corrected date */
  _daylightSavingAdjust: function(date) {
    if (!date) return null;
    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
    return date;
  },

  /* Set the date(s) directly. */
  _setDate: function(inst, date, noChange) {
    var clear = !date;
    var origMonth = inst.selectedMonth;
    var origYear = inst.selectedYear;
    var newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
    inst.selectedDay = inst.currentDay = newDate.getDate();
    inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
    inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
    if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange)
      this._notifyChange(inst);
    this._adjustInstDate(inst);
    if (inst.input) {
      inst.input.val(clear ? '' : this._formatDate(inst));
    }
  },

  /* Retrieve the date(s) directly. */
  _getDate: function(inst) {
    var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
      this._daylightSavingAdjust(new Date(
      inst.currentYear, inst.currentMonth, inst.currentDay)));
      return startDate;
  },

  /* Attach the onxxx handlers.  These are declared statically so
   * they work with static code transformers like Caja.
   */
  _attachHandlers: function(inst) {
    var stepMonths = this._get(inst, 'stepMonths');
    var id = '#' + inst.id.replace( /\\\\/g, "\\" );
    inst.dpDiv.find('[data-handler]').map(function () {
      var handler = {
        prev: function () {
          window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, -stepMonths, 'M');
        },
        next: function () {
          window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, +stepMonths, 'M');
        },
        hide: function () {
          window['DP_jQuery_' + dpuuid].datepicker._hideDatepicker();
        },
        today: function () {
          window['DP_jQuery_' + dpuuid].datepicker._gotoToday(id);
        },
        selectDay: function () {
          window['DP_jQuery_' + dpuuid].datepicker._selectDay(id, +this.getAttribute('data-month'), +this.getAttribute('data-year'), this);
          return false;
        },
        selectMonth: function () {
          window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'M');
          return false;
        },
        selectYear: function () {
          window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'Y');
          return false;
        }
      };
      $(this).bind(this.getAttribute('data-event'), handler[this.getAttribute('data-handler')]);
    });
  },

  /* Generate the HTML for the current state of the date picker. */
  _generateHTML: function(inst) {
    var today = new Date();
    today = this._daylightSavingAdjust(
      new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
    var isRTL = this._get(inst, 'isRTL');
    var showButtonPanel = this._get(inst, 'showButtonPanel');
    var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
    var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
    var numMonths = this._getNumberOfMonths(inst);
    var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
    var stepMonths = this._get(inst, 'stepMonths');
    var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
    var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
      new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
    var minDate = this._getMinMaxDate(inst, 'min');
    var maxDate = this._getMinMaxDate(inst, 'max');
    var drawMonth = inst.drawMonth - showCurrentAtPos;
    var drawYear = inst.drawYear;
    if (drawMonth < 0) {
      drawMonth += 12;
      drawYear--;
    }
    if (maxDate) {
      var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
        maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
      maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
      while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
        drawMonth--;
        if (drawMonth < 0) {
          drawMonth = 11;
          drawYear--;
        }
      }
    }
    inst.drawMonth = drawMonth;
    inst.drawYear = drawYear;
    var prevText = this._get(inst, 'prevText');
    prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
      this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
      this._getFormatConfig(inst)));
    var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
      '<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click"' +
      ' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
      (hideIfNoPrevNext ? '' : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+ prevText +'"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));
    var nextText = this._get(inst, 'nextText');
    nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
      this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
      this._getFormatConfig(inst)));
    var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
      '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click"' +
      ' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
      (hideIfNoPrevNext ? '' : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+ nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));
    var currentText = this._get(inst, 'currentText');
    var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
    currentText = (!navigationAsDateFormat ? currentText :
      this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
    var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">' +
      this._get(inst, 'closeText') + '</button>' : '');
    var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
      (this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click"' +
      '>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
    var firstDay = parseInt(this._get(inst, 'firstDay'),10);
    firstDay = (isNaN(firstDay) ? 0 : firstDay);
    var showWeek = this._get(inst, 'showWeek');
    var dayNames = this._get(inst, 'dayNames');
    var dayNamesShort = this._get(inst, 'dayNamesShort');
    var dayNamesMin = this._get(inst, 'dayNamesMin');
    var monthNames = this._get(inst, 'monthNames');
    var monthNamesShort = this._get(inst, 'monthNamesShort');
    var beforeShowDay = this._get(inst, 'beforeShowDay');
    var showOtherMonths = this._get(inst, 'showOtherMonths');
    var selectOtherMonths = this._get(inst, 'selectOtherMonths');
    var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
    var defaultDate = this._getDefaultDate(inst);
    var html = '';
    for (var row = 0; row < numMonths[0]; row++) {
      var group = '';
      this.maxRows = 4;
      for (var col = 0; col < numMonths[1]; col++) {
        var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
        var cornerClass = ' ui-corner-all';
        var calender = '';
        if (isMultiMonth) {
          calender += '<div class="ui-datepicker-group';
          if (numMonths[1] > 1)
            switch (col) {
              case 0: calender += ' ui-datepicker-group-first';
                cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
              case numMonths[1]-1: calender += ' ui-datepicker-group-last';
                cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
              default: calender += ' ui-datepicker-group-middle'; cornerClass = ''; break;
            }
          calender += '">';
        }
        calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' +
          (/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
          (/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
          this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
          row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
          '</div><table class="ui-datepicker-calendar"><thead>' +
          '<tr>';
        var thead = (showWeek ? '<th class="ui-datepicker-week-col">' + this._get(inst, 'weekHeader') + '</th>' : '');
        for (var dow = 0; dow < 7; dow++) { // days of the week
          var day = (dow + firstDay) % 7;
          thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
            '<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
        }
        calender += thead + '</tr></thead><tbody>';
        var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
        if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
          inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
        var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
        var curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
        var numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
        this.maxRows = numRows;
        var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
        for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
          calender += '<tr>';
          var tbody = (!showWeek ? '' : '<td class="ui-datepicker-week-col">' +
            this._get(inst, 'calculateWeek')(printDate) + '</td>');
          for (var dow = 0; dow < 7; dow++) { // create date picker days
            var daySettings = (beforeShowDay ?
              beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
            var otherMonth = (printDate.getMonth() != drawMonth);
            var unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
              (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
            tbody += '<td class="' +
              ((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') + // highlight weekends
              (otherMonth ? ' ui-datepicker-other-month' : '') + // highlight days from other months
              ((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
              (defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
              // or defaultDate is current printedDate and defaultDate is selectedDate
              ' ' + this._dayOverClass : '') + // highlight selected day
              (unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') +  // highlight unselectable days
              (otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
              (printDate.getTime() == currentDate.getTime() ? ' ' + this._currentClass : '') + // highlight selected day
              (printDate.getTime() == today.getTime() ? ' ui-datepicker-today' : '')) + '"' + // highlight today (if different)
              ((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
              (unselectable ? '' : ' data-handler="selectDay" data-event="click" data-month="' + printDate.getMonth() + '" data-year="' + printDate.getFullYear() + '"') + '>' + // actions
              (otherMonth && !showOtherMonths ? '&#xa0;' : // display for other months
              (unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>' : '<a class="ui-state-default' +
              (printDate.getTime() == today.getTime() ? ' ui-state-highlight' : '') +
              (printDate.getTime() == currentDate.getTime() ? ' ui-state-active' : '') + // highlight selected day
              (otherMonth ? ' ui-priority-secondary' : '') + // distinguish dates from other months
              '" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display selectable date
            printDate.setDate(printDate.getDate() + 1);
            printDate = this._daylightSavingAdjust(printDate);
          }
          calender += tbody + '</tr>';
        }
        drawMonth++;
        if (drawMonth > 11) {
          drawMonth = 0;
          drawYear++;
        }
        calender += '</tbody></table>' + (isMultiMonth ? '</div>' +
              ((numMonths[0] > 0 && col == numMonths[1]-1) ? '<div class="ui-datepicker-row-break"></div>' : '') : '');
        group += calender;
      }
      html += group;
    }
    html += buttonPanel + ($.ui.ie6 && !inst.inline ?
      '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : '');
    inst._keyEvent = false;
    return html;
  },

  /* Generate the month and year header. */
  _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
      secondary, monthNames, monthNamesShort) {
    var changeMonth = this._get(inst, 'changeMonth');
    var changeYear = this._get(inst, 'changeYear');
    var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
    var html = '<div class="ui-datepicker-title">';
    var monthHtml = '';
    // month selection
    if (secondary || !changeMonth)
      monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span>';
    else {
      var inMinYear = (minDate && minDate.getFullYear() == drawYear);
      var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
      monthHtml += '<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
      for (var month = 0; month < 12; month++) {
        if ((!inMinYear || month >= minDate.getMonth()) &&
            (!inMaxYear || month <= maxDate.getMonth()))
          monthHtml += '<option value="' + month + '"' +
            (month == drawMonth ? ' selected="selected"' : '') +
            '>' + monthNamesShort[month] + '</option>';
      }
      monthHtml += '</select>';
    }
    if (!showMonthAfterYear)
      html += monthHtml + (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '');
    // year selection
    if ( !inst.yearshtml ) {
      inst.yearshtml = '';
      if (secondary || !changeYear)
        html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
      else {
        // determine range of years to display
        var years = this._get(inst, 'yearRange').split(':');
        var thisYear = new Date().getFullYear();
        var determineYear = function(value) {
          var year = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) :
            (value.match(/[+-].*/) ? thisYear + parseInt(value, 10) :
            parseInt(value, 10)));
          return (isNaN(year) ? thisYear : year);
        };
        var year = determineYear(years[0]);
        var endYear = Math.max(year, determineYear(years[1] || ''));
        year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
        endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
        inst.yearshtml += '<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';
        for (; year <= endYear; year++) {
          inst.yearshtml += '<option value="' + year + '"' +
            (year == drawYear ? ' selected="selected"' : '') +
            '>' + year + '</option>';
        }
        inst.yearshtml += '</select>';

        html += inst.yearshtml;
        inst.yearshtml = null;
      }
    }
    html += this._get(inst, 'yearSuffix');
    if (showMonthAfterYear)
      html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthHtml;
    html += '</div>'; // Close datepicker_header
    return html;
  },

  /* Adjust one of the date sub-fields. */
  _adjustInstDate: function(inst, offset, period) {
    var year = inst.drawYear + (period == 'Y' ? offset : 0);
    var month = inst.drawMonth + (period == 'M' ? offset : 0);
    var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
      (period == 'D' ? offset : 0);
    var date = this._restrictMinMax(inst,
      this._daylightSavingAdjust(new Date(year, month, day)));
    inst.selectedDay = date.getDate();
    inst.drawMonth = inst.selectedMonth = date.getMonth();
    inst.drawYear = inst.selectedYear = date.getFullYear();
    if (period == 'M' || period == 'Y')
      this._notifyChange(inst);
  },

  /* Ensure a date is within any min/max bounds. */
  _restrictMinMax: function(inst, date) {
    var minDate = this._getMinMaxDate(inst, 'min');
    var maxDate = this._getMinMaxDate(inst, 'max');
    var newDate = (minDate && date < minDate ? minDate : date);
    newDate = (maxDate && newDate > maxDate ? maxDate : newDate);
    return newDate;
  },

  /* Notify change of month/year. */
  _notifyChange: function(inst) {
    var onChange = this._get(inst, 'onChangeMonthYear');
    if (onChange)
      onChange.apply((inst.input ? inst.input[0] : null),
        [inst.selectedYear, inst.selectedMonth + 1, inst]);
  },

  /* Determine the number of months to show. */
  _getNumberOfMonths: function(inst) {
    var numMonths = this._get(inst, 'numberOfMonths');
    return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
  },

  /* Determine the current maximum date - ensure no time components are set. */
  _getMinMaxDate: function(inst, minMax) {
    return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
  },

  /* Find the number of days in a given month. */
  _getDaysInMonth: function(year, month) {
    return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
  },

  /* Find the day of the week of the first of a month. */
  _getFirstDayOfMonth: function(year, month) {
    return new Date(year, month, 1).getDay();
  },

  /* Determines if we should allow a "next/prev" month display change. */
  _canAdjustMonth: function(inst, offset, curYear, curMonth) {
    var numMonths = this._getNumberOfMonths(inst);
    var date = this._daylightSavingAdjust(new Date(curYear,
      curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
    if (offset < 0)
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    return this._isInRange(inst, date);
  },

  /* Is the given date in the accepted range? */
  _isInRange: function(inst, date) {
    var minDate = this._getMinMaxDate(inst, 'min');
    var maxDate = this._getMinMaxDate(inst, 'max');
    return ((!minDate || date.getTime() >= minDate.getTime()) &&
      (!maxDate || date.getTime() <= maxDate.getTime()));
  },

  /* Provide the configuration settings for formatting/parsing. */
  _getFormatConfig: function(inst) {
    var shortYearCutoff = this._get(inst, 'shortYearCutoff');
    shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
      new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
    return {shortYearCutoff: shortYearCutoff,
      dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
      monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
  },

  /* Format the given date for display. */
  _formatDate: function(inst, day, month, year) {
    if (!day) {
      inst.currentDay = inst.selectedDay;
      inst.currentMonth = inst.selectedMonth;
      inst.currentYear = inst.selectedYear;
    }
    var date = (day ? (typeof day == 'object' ? day :
      this._daylightSavingAdjust(new Date(year, month, day))) :
      this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
    return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
  }
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function bindHover(dpDiv) {
  var selector = 'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
  return dpDiv.delegate(selector, 'mouseout', function() {
      $(this).removeClass('ui-state-hover');
      if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
      if (this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
    })
    .delegate(selector, 'mouseover', function(){
      if (!$.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
        $(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
        $(this).addClass('ui-state-hover');
        if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
        if (this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
      }
    });
}

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
  $.extend(target, props);
  for (var name in props)
    if (props[name] == null || props[name] == undefined)
      target[name] = props[name];
  return target;
};

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                  Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

  /* Verify an empty collection wasn't passed - Fixes #6976 */
  if ( !this.length ) {
    return this;
  }

  /* Initialise the date picker. */
  if (!$.datepicker.initialized) {
    $(document).mousedown($.datepicker._checkExternalClick).
      find(document.body).append($.datepicker.dpDiv);
    $.datepicker.initialized = true;
  }

  var otherArgs = Array.prototype.slice.call(arguments, 1);
  if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
    return $.datepicker['_' + options + 'Datepicker'].
      apply($.datepicker, [this[0]].concat(otherArgs));
  if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
    return $.datepicker['_' + options + 'Datepicker'].
      apply($.datepicker, [this[0]].concat(otherArgs));
  return this.each(function() {
    typeof options == 'string' ?
      $.datepicker['_' + options + 'Datepicker'].
        apply($.datepicker, [this].concat(otherArgs)) :
      $.datepicker._attachDatepicker(this, options);
  });
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.9.2";

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
window['DP_jQuery_' + dpuuid] = $;

})(jQuery);
(function( $, undefined ) {

var uiDialogClasses = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
  sizeRelatedOptions = {
    buttons: true,
    height: true,
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true,
    width: true
  },
  resizableRelatedOptions = {
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true
  };

$.widget("ui.dialog", {
  version: "1.9.2",
  options: {
    autoOpen: true,
    buttons: {},
    closeOnEscape: true,
    closeText: "close",
    dialogClass: "",
    draggable: true,
    hide: null,
    height: "auto",
    maxHeight: false,
    maxWidth: false,
    minHeight: 150,
    minWidth: 150,
    modal: false,
    position: {
      my: "center",
      at: "center",
      of: window,
      collision: "fit",
      // ensure that the titlebar is never outside the document
      using: function( pos ) {
        var topOffset = $( this ).css( pos ).offset().top;
        if ( topOffset < 0 ) {
          $( this ).css( "top", pos.top - topOffset );
        }
      }
    },
    resizable: false,
    show: null,
    stack: true,
    title: "",
    width: 300,
    zIndex: 1000
  },

  _create: function() {
    this.originalTitle = this.element.attr( "title" );
    // #5742 - .attr() might return a DOMElement
    if ( typeof this.originalTitle !== "string" ) {
      this.originalTitle = "";
    }
    this.oldPosition = {
      parent: this.element.parent(),
      index: this.element.parent().children().index( this.element )
    };
    this.options.title = this.options.title || this.originalTitle;
    var that = this,
      options = this.options,

      title = options.title || "&#160;",
      uiDialog,
      uiDialogTitlebar,
      uiDialogTitlebarClose,
      uiDialogTitle,
      uiDialogButtonPane;

      uiDialog = ( this.uiDialog = $( "<div>" ) )
        .addClass( uiDialogClasses + options.dialogClass )
        .css({
          display: "none",
          outline: 0, // TODO: move to stylesheet
          zIndex: options.zIndex
        })
        // setting tabIndex makes the div focusable
        .attr( "tabIndex", -1)
        .keydown(function( event ) {
          if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
              event.keyCode === $.ui.keyCode.ESCAPE ) {
            that.close( event );
            event.preventDefault();
          }
        })
        .mousedown(function( event ) {
          that.moveToTop( false, event );
        })
        .appendTo( "body" );

      this.element
        .show()
        .removeAttr( "title" )
        .addClass( "ui-dialog-content ui-widget-content" )
        .appendTo( uiDialog );

      uiDialogTitlebar = ( this.uiDialogTitlebar = $( "<div>" ) )
        .addClass( "ui-dialog-titlebar  ui-widget-header  " +
          "ui-corner-all  ui-helper-clearfix" )
        .bind( "mousedown", function() {
          // Dialog isn't getting focus when dragging (#8063)
          uiDialog.focus();
        })
        .prependTo( uiDialog );

      uiDialogTitlebarClose = $( "<a href='#'></a>" )
        .addClass( "ui-dialog-titlebar-close  ui-corner-all" )
        .attr( "role", "button" )
        .click(function( event ) {
          event.preventDefault();
          that.close( event );
        })
        .appendTo( uiDialogTitlebar );

      ( this.uiDialogTitlebarCloseText = $( "<span>" ) )
        .addClass( "ui-icon ui-icon-closethick" )
        .text( options.closeText )
        .appendTo( uiDialogTitlebarClose );

      uiDialogTitle = $( "<span>" )
        .uniqueId()
        .addClass( "ui-dialog-title" )
        .html( title )
        .prependTo( uiDialogTitlebar );

      uiDialogButtonPane = ( this.uiDialogButtonPane = $( "<div>" ) )
        .addClass( "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" );

      ( this.uiButtonSet = $( "<div>" ) )
        .addClass( "ui-dialog-buttonset" )
        .appendTo( uiDialogButtonPane );

    uiDialog.attr({
      role: "dialog",
      "aria-labelledby": uiDialogTitle.attr( "id" )
    });

    uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
    this._hoverable( uiDialogTitlebarClose );
    this._focusable( uiDialogTitlebarClose );

    if ( options.draggable && $.fn.draggable ) {
      this._makeDraggable();
    }
    if ( options.resizable && $.fn.resizable ) {
      this._makeResizable();
    }

    this._createButtons( options.buttons );
    this._isOpen = false;

    if ( $.fn.bgiframe ) {
      uiDialog.bgiframe();
    }

    // prevent tabbing out of modal dialogs
    this._on( uiDialog, { keydown: function( event ) {
      if ( !options.modal || event.keyCode !== $.ui.keyCode.TAB ) {
        return;
      }

      var tabbables = $( ":tabbable", uiDialog ),
        first = tabbables.filter( ":first" ),
        last  = tabbables.filter( ":last" );

      if ( event.target === last[0] && !event.shiftKey ) {
        first.focus( 1 );
        return false;
      } else if ( event.target === first[0] && event.shiftKey ) {
        last.focus( 1 );
        return false;
      }
    }});
  },

  _init: function() {
    if ( this.options.autoOpen ) {
      this.open();
    }
  },

  _destroy: function() {
    var next,
      oldPosition = this.oldPosition;

    if ( this.overlay ) {
      this.overlay.destroy();
    }
    this.uiDialog.hide();
    this.element
      .removeClass( "ui-dialog-content ui-widget-content" )
      .hide()
      .appendTo( "body" );
    this.uiDialog.remove();

    if ( this.originalTitle ) {
      this.element.attr( "title", this.originalTitle );
    }

    next = oldPosition.parent.children().eq( oldPosition.index );
    // Don't try to place the dialog next to itself (#8613)
    if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
      next.before( this.element );
    } else {
      oldPosition.parent.append( this.element );
    }
  },

  widget: function() {
    return this.uiDialog;
  },

  close: function( event ) {
    var that = this,
      maxZ, thisZ;

    if ( !this._isOpen ) {
      return;
    }

    if ( false === this._trigger( "beforeClose", event ) ) {
      return;
    }

    this._isOpen = false;

    if ( this.overlay ) {
      this.overlay.destroy();
    }

    if ( this.options.hide ) {
      this._hide( this.uiDialog, this.options.hide, function() {
        that._trigger( "close", event );
      });
    } else {
      this.uiDialog.hide();
      this._trigger( "close", event );
    }

    $.ui.dialog.overlay.resize();

    // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
    if ( this.options.modal ) {
      maxZ = 0;
      $( ".ui-dialog" ).each(function() {
        if ( this !== that.uiDialog[0] ) {
          thisZ = $( this ).css( "z-index" );
          if ( !isNaN( thisZ ) ) {
            maxZ = Math.max( maxZ, thisZ );
          }
        }
      });
      $.ui.dialog.maxZ = maxZ;
    }

    return this;
  },

  isOpen: function() {
    return this._isOpen;
  },

  // the force parameter allows us to move modal dialogs to their correct
  // position on open
  moveToTop: function( force, event ) {
    var options = this.options,
      saveScroll;

    if ( ( options.modal && !force ) ||
        ( !options.stack && !options.modal ) ) {
      return this._trigger( "focus", event );
    }

    if ( options.zIndex > $.ui.dialog.maxZ ) {
      $.ui.dialog.maxZ = options.zIndex;
    }
    if ( this.overlay ) {
      $.ui.dialog.maxZ += 1;
      $.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ;
      this.overlay.$el.css( "z-index", $.ui.dialog.overlay.maxZ );
    }

    // Save and then restore scroll
    // Opera 9.5+ resets when parent z-index is changed.
    // http://bugs.jqueryui.com/ticket/3193
    saveScroll = {
      scrollTop: this.element.scrollTop(),
      scrollLeft: this.element.scrollLeft()
    };
    $.ui.dialog.maxZ += 1;
    this.uiDialog.css( "z-index", $.ui.dialog.maxZ );
    this.element.attr( saveScroll );
    this._trigger( "focus", event );

    return this;
  },

  open: function() {
    if ( this._isOpen ) {
      return;
    }

    var hasFocus,
      options = this.options,
      uiDialog = this.uiDialog;

    this._size();
    this._position( options.position );
    uiDialog.show( options.show );
    this.overlay = options.modal ? new $.ui.dialog.overlay( this ) : null;
    this.moveToTop( true );

    // set focus to the first tabbable element in the content area or the first button
    // if there are no tabbable elements, set focus on the dialog itself
    hasFocus = this.element.find( ":tabbable" );
    if ( !hasFocus.length ) {
      hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
      if ( !hasFocus.length ) {
        hasFocus = uiDialog;
      }
    }
    hasFocus.eq( 0 ).focus();

    this._isOpen = true;
    this._trigger( "open" );

    return this;
  },

  _createButtons: function( buttons ) {
    var that = this,
      hasButtons = false;

    // if we already have a button pane, remove it
    this.uiDialogButtonPane.remove();
    this.uiButtonSet.empty();

    if ( typeof buttons === "object" && buttons !== null ) {
      $.each( buttons, function() {
        return !(hasButtons = true);
      });
    }
    if ( hasButtons ) {
      $.each( buttons, function( name, props ) {
        var button, click;
        props = $.isFunction( props ) ?
          { click: props, text: name } :
          props;
        // Default to a non-submitting button
        props = $.extend( { type: "button" }, props );
        // Change the context for the click callback to be the main element
        click = props.click;
        props.click = function() {
          click.apply( that.element[0], arguments );
        };
        button = $( "<button></button>", props )
          .appendTo( that.uiButtonSet );
        if ( $.fn.button ) {
          button.button();
        }
      });
      this.uiDialog.addClass( "ui-dialog-buttons" );
      this.uiDialogButtonPane.appendTo( this.uiDialog );
    } else {
      this.uiDialog.removeClass( "ui-dialog-buttons" );
    }
  },

  _makeDraggable: function() {
    var that = this,
      options = this.options;

    function filteredUi( ui ) {
      return {
        position: ui.position,
        offset: ui.offset
      };
    }

    this.uiDialog.draggable({
      cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
      handle: ".ui-dialog-titlebar",
      containment: "document",
      start: function( event, ui ) {
        $( this )
          .addClass( "ui-dialog-dragging" );
        that._trigger( "dragStart", event, filteredUi( ui ) );
      },
      drag: function( event, ui ) {
        that._trigger( "drag", event, filteredUi( ui ) );
      },
      stop: function( event, ui ) {
        options.position = [
          ui.position.left - that.document.scrollLeft(),
          ui.position.top - that.document.scrollTop()
        ];
        $( this )
          .removeClass( "ui-dialog-dragging" );
        that._trigger( "dragStop", event, filteredUi( ui ) );
        $.ui.dialog.overlay.resize();
      }
    });
  },

  _makeResizable: function( handles ) {
    handles = (handles === undefined ? this.options.resizable : handles);
    var that = this,
      options = this.options,
      // .ui-resizable has position: relative defined in the stylesheet
      // but dialogs have to use absolute or fixed positioning
      position = this.uiDialog.css( "position" ),
      resizeHandles = typeof handles === 'string' ?
        handles :
        "n,e,s,w,se,sw,ne,nw";

    function filteredUi( ui ) {
      return {
        originalPosition: ui.originalPosition,
        originalSize: ui.originalSize,
        position: ui.position,
        size: ui.size
      };
    }

    this.uiDialog.resizable({
      cancel: ".ui-dialog-content",
      containment: "document",
      alsoResize: this.element,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      minWidth: options.minWidth,
      minHeight: this._minHeight(),
      handles: resizeHandles,
      start: function( event, ui ) {
        $( this ).addClass( "ui-dialog-resizing" );
        that._trigger( "resizeStart", event, filteredUi( ui ) );
      },
      resize: function( event, ui ) {
        that._trigger( "resize", event, filteredUi( ui ) );
      },
      stop: function( event, ui ) {
        $( this ).removeClass( "ui-dialog-resizing" );
        options.height = $( this ).height();
        options.width = $( this ).width();
        that._trigger( "resizeStop", event, filteredUi( ui ) );
        $.ui.dialog.overlay.resize();
      }
    })
    .css( "position", position )
    .find( ".ui-resizable-se" )
      .addClass( "ui-icon ui-icon-grip-diagonal-se" );
  },

  _minHeight: function() {
    var options = this.options;

    if ( options.height === "auto" ) {
      return options.minHeight;
    } else {
      return Math.min( options.minHeight, options.height );
    }
  },

  _position: function( position ) {
    var myAt = [],
      offset = [ 0, 0 ],
      isVisible;

    if ( position ) {
      // deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
  //    if (typeof position == 'string' || $.isArray(position)) {
  //      myAt = $.isArray(position) ? position : position.split(' ');

      if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
        myAt = position.split ? position.split( " " ) : [ position[ 0 ], position[ 1 ] ];
        if ( myAt.length === 1 ) {
          myAt[ 1 ] = myAt[ 0 ];
        }

        $.each( [ "left", "top" ], function( i, offsetPosition ) {
          if ( +myAt[ i ] === myAt[ i ] ) {
            offset[ i ] = myAt[ i ];
            myAt[ i ] = offsetPosition;
          }
        });

        position = {
          my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
            myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
          at: myAt.join( " " )
        };
      }

      position = $.extend( {}, $.ui.dialog.prototype.options.position, position );
    } else {
      position = $.ui.dialog.prototype.options.position;
    }

    // need to show the dialog to get the actual offset in the position plugin
    isVisible = this.uiDialog.is( ":visible" );
    if ( !isVisible ) {
      this.uiDialog.show();
    }
    this.uiDialog.position( position );
    if ( !isVisible ) {
      this.uiDialog.hide();
    }
  },

  _setOptions: function( options ) {
    var that = this,
      resizableOptions = {},
      resize = false;

    $.each( options, function( key, value ) {
      that._setOption( key, value );

      if ( key in sizeRelatedOptions ) {
        resize = true;
      }
      if ( key in resizableRelatedOptions ) {
        resizableOptions[ key ] = value;
      }
    });

    if ( resize ) {
      this._size();
    }
    if ( this.uiDialog.is( ":data(resizable)" ) ) {
      this.uiDialog.resizable( "option", resizableOptions );
    }
  },

  _setOption: function( key, value ) {
    var isDraggable, isResizable,
      uiDialog = this.uiDialog;

    switch ( key ) {
      case "buttons":
        this._createButtons( value );
        break;
      case "closeText":
        // ensure that we always pass a string
        this.uiDialogTitlebarCloseText.text( "" + value );
        break;
      case "dialogClass":
        uiDialog
          .removeClass( this.options.dialogClass )
          .addClass( uiDialogClasses + value );
        break;
      case "disabled":
        if ( value ) {
          uiDialog.addClass( "ui-dialog-disabled" );
        } else {
          uiDialog.removeClass( "ui-dialog-disabled" );
        }
        break;
      case "draggable":
        isDraggable = uiDialog.is( ":data(draggable)" );
        if ( isDraggable && !value ) {
          uiDialog.draggable( "destroy" );
        }

        if ( !isDraggable && value ) {
          this._makeDraggable();
        }
        break;
      case "position":
        this._position( value );
        break;
      case "resizable":
        // currently resizable, becoming non-resizable
        isResizable = uiDialog.is( ":data(resizable)" );
        if ( isResizable && !value ) {
          uiDialog.resizable( "destroy" );
        }

        // currently resizable, changing handles
        if ( isResizable && typeof value === "string" ) {
          uiDialog.resizable( "option", "handles", value );
        }

        // currently non-resizable, becoming resizable
        if ( !isResizable && value !== false ) {
          this._makeResizable( value );
        }
        break;
      case "title":
        // convert whatever was passed in o a string, for html() to not throw up
        $( ".ui-dialog-title", this.uiDialogTitlebar )
          .html( "" + ( value || "&#160;" ) );
        break;
    }

    this._super( key, value );
  },

  _size: function() {
    /* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
     * divs will both have width and height set, so we need to reset them
     */
    var nonContentHeight, minContentHeight, autoHeight,
      options = this.options,
      isVisible = this.uiDialog.is( ":visible" );

    // reset content sizing
    this.element.show().css({
      width: "auto",
      minHeight: 0,
      height: 0
    });

    if ( options.minWidth > options.width ) {
      options.width = options.minWidth;
    }

    // reset wrapper sizing
    // determine the height of all the non-content elements
    nonContentHeight = this.uiDialog.css({
        height: "auto",
        width: options.width
      })
      .outerHeight();
    minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );

    if ( options.height === "auto" ) {
      // only needed for IE6 support
      if ( $.support.minHeight ) {
        this.element.css({
          minHeight: minContentHeight,
          height: "auto"
        });
      } else {
        this.uiDialog.show();
        autoHeight = this.element.css( "height", "auto" ).height();
        if ( !isVisible ) {
          this.uiDialog.hide();
        }
        this.element.height( Math.max( autoHeight, minContentHeight ) );
      }
    } else {
      this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
    }

    if (this.uiDialog.is( ":data(resizable)" ) ) {
      this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
    }
  }
});

$.extend($.ui.dialog, {
  uuid: 0,
  maxZ: 0,

  getTitleId: function($el) {
    var id = $el.attr( "id" );
    if ( !id ) {
      this.uuid += 1;
      id = this.uuid;
    }
    return "ui-dialog-title-" + id;
  },

  overlay: function( dialog ) {
    this.$el = $.ui.dialog.overlay.create( dialog );
  }
});

$.extend( $.ui.dialog.overlay, {
  instances: [],
  // reuse old instances due to IE memory leak with alpha transparency (see #5185)
  oldInstances: [],
  maxZ: 0,
  events: $.map(
    "focus,mousedown,mouseup,keydown,keypress,click".split( "," ),
    function( event ) {
      return event + ".dialog-overlay";
    }
  ).join( " " ),
  create: function( dialog ) {
    if ( this.instances.length === 0 ) {
      // prevent use of anchors and inputs
      // we use a setTimeout in case the overlay is created from an
      // event that we're going to be cancelling (see #2804)
      setTimeout(function() {
        // handle $(el).dialog().dialog('close') (see #4065)
        if ( $.ui.dialog.overlay.instances.length ) {
          $( document ).bind( $.ui.dialog.overlay.events, function( event ) {
            // stop events if the z-index of the target is < the z-index of the overlay
            // we cannot return true when we don't want to cancel the event (#3523)
            if ( $( event.target ).zIndex() < $.ui.dialog.overlay.maxZ ) {
              return false;
            }
          });
        }
      }, 1 );

      // handle window resize
      $( window ).bind( "resize.dialog-overlay", $.ui.dialog.overlay.resize );
    }

    var $el = ( this.oldInstances.pop() || $( "<div>" ).addClass( "ui-widget-overlay" ) );

    // allow closing by pressing the escape key
    $( document ).bind( "keydown.dialog-overlay", function( event ) {
      var instances = $.ui.dialog.overlay.instances;
      // only react to the event if we're the top overlay
      if ( instances.length !== 0 && instances[ instances.length - 1 ] === $el &&
        dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
        event.keyCode === $.ui.keyCode.ESCAPE ) {

        dialog.close( event );
        event.preventDefault();
      }
    });

    $el.appendTo( document.body ).css({
      width: this.width(),
      height: this.height()
    });

    if ( $.fn.bgiframe ) {
      $el.bgiframe();
    }

    this.instances.push( $el );
    return $el;
  },

  destroy: function( $el ) {
    var indexOf = $.inArray( $el, this.instances ),
      maxZ = 0;

    if ( indexOf !== -1 ) {
      this.oldInstances.push( this.instances.splice( indexOf, 1 )[ 0 ] );
    }

    if ( this.instances.length === 0 ) {
      $( [ document, window ] ).unbind( ".dialog-overlay" );
    }

    $el.height( 0 ).width( 0 ).remove();

    // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
    $.each( this.instances, function() {
      maxZ = Math.max( maxZ, this.css( "z-index" ) );
    });
    this.maxZ = maxZ;
  },

  height: function() {
    var scrollHeight,
      offsetHeight;
    // handle IE
    if ( $.ui.ie ) {
      scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      offsetHeight = Math.max(
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );

      if ( scrollHeight < offsetHeight ) {
        return $( window ).height() + "px";
      } else {
        return scrollHeight + "px";
      }
    // handle "good" browsers
    } else {
      return $( document ).height() + "px";
    }
  },

  width: function() {
    var scrollWidth,
      offsetWidth;
    // handle IE
    if ( $.ui.ie ) {
      scrollWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth
      );
      offsetWidth = Math.max(
        document.documentElement.offsetWidth,
        document.body.offsetWidth
      );

      if ( scrollWidth < offsetWidth ) {
        return $( window ).width() + "px";
      } else {
        return scrollWidth + "px";
      }
    // handle "good" browsers
    } else {
      return $( document ).width() + "px";
    }
  },

  resize: function() {
    /* If the dialog is draggable and the user drags it past the
     * right edge of the window, the document becomes wider so we
     * need to stretch the overlay. If the user then drags the
     * dialog back to the left, the document will become narrower,
     * so we need to shrink the overlay to the appropriate size.
     * This is handled by shrinking the overlay before setting it
     * to the full document size.
     */
    var $overlays = $( [] );
    $.each( $.ui.dialog.overlay.instances, function() {
      $overlays = $overlays.add( this );
    });

    $overlays.css({
      width: 0,
      height: 0
    }).css({
      width: $.ui.dialog.overlay.width(),
      height: $.ui.dialog.overlay.height()
    });
  }
});

$.extend( $.ui.dialog.overlay.prototype, {
  destroy: function() {
    $.ui.dialog.overlay.destroy( this.$el );
  }
});

}( jQuery ) );
(function( $, undefined ) {

var mouseHandled = false;

$.widget( "ui.menu", {
  version: "1.9.2",
  defaultElement: "<ul>",
  delay: 300,
  options: {
    icons: {
      submenu: "ui-icon-carat-1-e"
    },
    menus: "ul",
    position: {
      my: "left top",
      at: "right top"
    },
    role: "menu",

    // callbacks
    blur: null,
    focus: null,
    select: null
  },

  _create: function() {
    this.activeMenu = this.element;
    this.element
      .uniqueId()
      .addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
      .toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
      .attr({
        role: this.options.role,
        tabIndex: 0
      })
      // need to catch all clicks on disabled menu
      // not possible through _on
      .bind( "click" + this.eventNamespace, $.proxy(function( event ) {
        if ( this.options.disabled ) {
          event.preventDefault();
        }
      }, this ));

    if ( this.options.disabled ) {
      this.element
        .addClass( "ui-state-disabled" )
        .attr( "aria-disabled", "true" );
    }

    this._on({
      // Prevent focus from sticking to links inside menu after clicking
      // them (focus should always stay on UL during navigation).
      "mousedown .ui-menu-item > a": function( event ) {
        event.preventDefault();
      },
      "click .ui-state-disabled > a": function( event ) {
        event.preventDefault();
      },
      "click .ui-menu-item:has(a)": function( event ) {
        var target = $( event.target ).closest( ".ui-menu-item" );
        if ( !mouseHandled && target.not( ".ui-state-disabled" ).length ) {
          mouseHandled = true;

          this.select( event );
          // Open submenu on click
          if ( target.has( ".ui-menu" ).length ) {
            this.expand( event );
          } else if ( !this.element.is( ":focus" ) ) {
            // Redirect focus to the menu
            this.element.trigger( "focus", [ true ] );

            // If the active item is on the top level, let it stay active.
            // Otherwise, blur the active item since it is no longer visible.
            if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
              clearTimeout( this.timer );
            }
          }
        }
      },
      "mouseenter .ui-menu-item": function( event ) {
        var target = $( event.currentTarget );
        // Remove ui-state-active class from siblings of the newly focused menu item
        // to avoid a jump caused by adjacent elements both having a class with a border
        target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
        this.focus( event, target );
      },
      mouseleave: "collapseAll",
      "mouseleave .ui-menu": "collapseAll",
      focus: function( event, keepActiveItem ) {
        // If there's already an active item, keep it active
        // If not, activate the first item
        var item = this.active || this.element.children( ".ui-menu-item" ).eq( 0 );

        if ( !keepActiveItem ) {
          this.focus( event, item );
        }
      },
      blur: function( event ) {
        this._delay(function() {
          if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
            this.collapseAll( event );
          }
        });
      },
      keydown: "_keydown"
    });

    this.refresh();

    // Clicks outside of a menu collapse any open menus
    this._on( this.document, {
      click: function( event ) {
        if ( !$( event.target ).closest( ".ui-menu" ).length ) {
          this.collapseAll( event );
        }

        // Reset the mouseHandled flag
        mouseHandled = false;
      }
    });
  },

  _destroy: function() {
    // Destroy (sub)menus
    this.element
      .removeAttr( "aria-activedescendant" )
      .find( ".ui-menu" ).andSelf()
        .removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons" )
        .removeAttr( "role" )
        .removeAttr( "tabIndex" )
        .removeAttr( "aria-labelledby" )
        .removeAttr( "aria-expanded" )
        .removeAttr( "aria-hidden" )
        .removeAttr( "aria-disabled" )
        .removeUniqueId()
        .show();

    // Destroy menu items
    this.element.find( ".ui-menu-item" )
      .removeClass( "ui-menu-item" )
      .removeAttr( "role" )
      .removeAttr( "aria-disabled" )
      .children( "a" )
        .removeUniqueId()
        .removeClass( "ui-corner-all ui-state-hover" )
        .removeAttr( "tabIndex" )
        .removeAttr( "role" )
        .removeAttr( "aria-haspopup" )
        .children().each( function() {
          var elem = $( this );
          if ( elem.data( "ui-menu-submenu-carat" ) ) {
            elem.remove();
          }
        });

    // Destroy menu dividers
    this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
  },

  _keydown: function( event ) {
    var match, prev, character, skip, regex,
      preventDefault = true;

    function escape( value ) {
      return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
    }

    switch ( event.keyCode ) {
    case $.ui.keyCode.PAGE_UP:
      this.previousPage( event );
      break;
    case $.ui.keyCode.PAGE_DOWN:
      this.nextPage( event );
      break;
    case $.ui.keyCode.HOME:
      this._move( "first", "first", event );
      break;
    case $.ui.keyCode.END:
      this._move( "last", "last", event );
      break;
    case $.ui.keyCode.UP:
      this.previous( event );
      break;
    case $.ui.keyCode.DOWN:
      this.next( event );
      break;
    case $.ui.keyCode.LEFT:
      this.collapse( event );
      break;
    case $.ui.keyCode.RIGHT:
      if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
        this.expand( event );
      }
      break;
    case $.ui.keyCode.ENTER:
    case $.ui.keyCode.SPACE:
      this._activate( event );
      break;
    case $.ui.keyCode.ESCAPE:
      this.collapse( event );
      break;
    default:
      preventDefault = false;
      prev = this.previousFilter || "";
      character = String.fromCharCode( event.keyCode );
      skip = false;

      clearTimeout( this.filterTimer );

      if ( character === prev ) {
        skip = true;
      } else {
        character = prev + character;
      }

      regex = new RegExp( "^" + escape( character ), "i" );
      match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
        return regex.test( $( this ).children( "a" ).text() );
      });
      match = skip && match.index( this.active.next() ) !== -1 ?
        this.active.nextAll( ".ui-menu-item" ) :
        match;

      // If no matches on the current filter, reset to the last character pressed
      // to move down the menu to the first item that starts with that character
      if ( !match.length ) {
        character = String.fromCharCode( event.keyCode );
        regex = new RegExp( "^" + escape( character ), "i" );
        match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
          return regex.test( $( this ).children( "a" ).text() );
        });
      }

      if ( match.length ) {
        this.focus( event, match );
        if ( match.length > 1 ) {
          this.previousFilter = character;
          this.filterTimer = this._delay(function() {
            delete this.previousFilter;
          }, 1000 );
        } else {
          delete this.previousFilter;
        }
      } else {
        delete this.previousFilter;
      }
    }

    if ( preventDefault ) {
      event.preventDefault();
    }
  },

  _activate: function( event ) {
    if ( !this.active.is( ".ui-state-disabled" ) ) {
      if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
        this.expand( event );
      } else {
        this.select( event );
      }
    }
  },

  refresh: function() {
    var menus,
      icon = this.options.icons.submenu,
      submenus = this.element.find( this.options.menus );

    // Initialize nested menus
    submenus.filter( ":not(.ui-menu)" )
      .addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
      .hide()
      .attr({
        role: this.options.role,
        "aria-hidden": "true",
        "aria-expanded": "false"
      })
      .each(function() {
        var menu = $( this ),
          item = menu.prev( "a" ),
          submenuCarat = $( "<span>" )
            .addClass( "ui-menu-icon ui-icon " + icon )
            .data( "ui-menu-submenu-carat", true );

        item
          .attr( "aria-haspopup", "true" )
          .prepend( submenuCarat );
        menu.attr( "aria-labelledby", item.attr( "id" ) );
      });

    menus = submenus.add( this.element );

    // Don't refresh list items that are already adapted
    menus.children( ":not(.ui-menu-item):has(a)" )
      .addClass( "ui-menu-item" )
      .attr( "role", "presentation" )
      .children( "a" )
        .uniqueId()
        .addClass( "ui-corner-all" )
        .attr({
          tabIndex: -1,
          role: this._itemRole()
        });

    // Initialize unlinked menu-items containing spaces and/or dashes only as dividers
    menus.children( ":not(.ui-menu-item)" ).each(function() {
      var item = $( this );
      // hyphen, em dash, en dash
      if ( !/[^\-—–\s]/.test( item.text() ) ) {
        item.addClass( "ui-widget-content ui-menu-divider" );
      }
    });

    // Add aria-disabled attribute to any disabled menu item
    menus.children( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

    // If the active item has been removed, blur the menu
    if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
      this.blur();
    }
  },

  _itemRole: function() {
    return {
      menu: "menuitem",
      listbox: "option"
    }[ this.options.role ];
  },

  focus: function( event, item ) {
    var nested, focused;
    this.blur( event, event && event.type === "focus" );

    this._scrollIntoView( item );

    this.active = item.first();
    focused = this.active.children( "a" ).addClass( "ui-state-focus" );
    // Only update aria-activedescendant if there's a role
    // otherwise we assume focus is managed elsewhere
    if ( this.options.role ) {
      this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
    }

    // Highlight active parent menu item, if any
    this.active
      .parent()
      .closest( ".ui-menu-item" )
      .children( "a:first" )
      .addClass( "ui-state-active" );

    if ( event && event.type === "keydown" ) {
      this._close();
    } else {
      this.timer = this._delay(function() {
        this._close();
      }, this.delay );
    }

    nested = item.children( ".ui-menu" );
    if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
      this._startOpening(nested);
    }
    this.activeMenu = item.parent();

    this._trigger( "focus", event, { item: item } );
  },

  _scrollIntoView: function( item ) {
    var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
    if ( this._hasScroll() ) {
      borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
      paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
      offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
      scroll = this.activeMenu.scrollTop();
      elementHeight = this.activeMenu.height();
      itemHeight = item.height();

      if ( offset < 0 ) {
        this.activeMenu.scrollTop( scroll + offset );
      } else if ( offset + itemHeight > elementHeight ) {
        this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
      }
    }
  },

  blur: function( event, fromFocus ) {
    if ( !fromFocus ) {
      clearTimeout( this.timer );
    }

    if ( !this.active ) {
      return;
    }

    this.active.children( "a" ).removeClass( "ui-state-focus" );
    this.active = null;

    this._trigger( "blur", event, { item: this.active } );
  },

  _startOpening: function( submenu ) {
    clearTimeout( this.timer );

    // Don't open if already open fixes a Firefox bug that caused a .5 pixel
    // shift in the submenu position when mousing over the carat icon
    if ( submenu.attr( "aria-hidden" ) !== "true" ) {
      return;
    }

    this.timer = this._delay(function() {
      this._close();
      this._open( submenu );
    }, this.delay );
  },

  _open: function( submenu ) {
    var position = $.extend({
      of: this.active
    }, this.options.position );

    clearTimeout( this.timer );
    this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
      .hide()
      .attr( "aria-hidden", "true" );

    submenu
      .show()
      .removeAttr( "aria-hidden" )
      .attr( "aria-expanded", "true" )
      .position( position );
  },

  collapseAll: function( event, all ) {
    clearTimeout( this.timer );
    this.timer = this._delay(function() {
      // If we were passed an event, look for the submenu that contains the event
      var currentMenu = all ? this.element :
        $( event && event.target ).closest( this.element.find( ".ui-menu" ) );

      // If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
      if ( !currentMenu.length ) {
        currentMenu = this.element;
      }

      this._close( currentMenu );

      this.blur( event );
      this.activeMenu = currentMenu;
    }, this.delay );
  },

  // With no arguments, closes the currently active menu - if nothing is active
  // it closes all menus.  If passed an argument, it will search for menus BELOW
  _close: function( startMenu ) {
    if ( !startMenu ) {
      startMenu = this.active ? this.active.parent() : this.element;
    }

    startMenu
      .find( ".ui-menu" )
        .hide()
        .attr( "aria-hidden", "true" )
        .attr( "aria-expanded", "false" )
      .end()
      .find( "a.ui-state-active" )
        .removeClass( "ui-state-active" );
  },

  collapse: function( event ) {
    var newItem = this.active &&
      this.active.parent().closest( ".ui-menu-item", this.element );
    if ( newItem && newItem.length ) {
      this._close();
      this.focus( event, newItem );
    }
  },

  expand: function( event ) {
    var newItem = this.active &&
      this.active
        .children( ".ui-menu " )
        .children( ".ui-menu-item" )
        .first();

    if ( newItem && newItem.length ) {
      this._open( newItem.parent() );

      // Delay so Firefox will not hide activedescendant change in expanding submenu from AT
      this._delay(function() {
        this.focus( event, newItem );
      });
    }
  },

  next: function( event ) {
    this._move( "next", "first", event );
  },

  previous: function( event ) {
    this._move( "prev", "last", event );
  },

  isFirstItem: function() {
    return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
  },

  isLastItem: function() {
    return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
  },

  _move: function( direction, filter, event ) {
    var next;
    if ( this.active ) {
      if ( direction === "first" || direction === "last" ) {
        next = this.active
          [ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
          .eq( -1 );
      } else {
        next = this.active
          [ direction + "All" ]( ".ui-menu-item" )
          .eq( 0 );
      }
    }
    if ( !next || !next.length || !this.active ) {
      next = this.activeMenu.children( ".ui-menu-item" )[ filter ]();
    }

    this.focus( event, next );
  },

  nextPage: function( event ) {
    var item, base, height;

    if ( !this.active ) {
      this.next( event );
      return;
    }
    if ( this.isLastItem() ) {
      return;
    }
    if ( this._hasScroll() ) {
      base = this.active.offset().top;
      height = this.element.height();
      this.active.nextAll( ".ui-menu-item" ).each(function() {
        item = $( this );
        return item.offset().top - base - height < 0;
      });

      this.focus( event, item );
    } else {
      this.focus( event, this.activeMenu.children( ".ui-menu-item" )
        [ !this.active ? "first" : "last" ]() );
    }
  },

  previousPage: function( event ) {
    var item, base, height;
    if ( !this.active ) {
      this.next( event );
      return;
    }
    if ( this.isFirstItem() ) {
      return;
    }
    if ( this._hasScroll() ) {
      base = this.active.offset().top;
      height = this.element.height();
      this.active.prevAll( ".ui-menu-item" ).each(function() {
        item = $( this );
        return item.offset().top - base + height > 0;
      });

      this.focus( event, item );
    } else {
      this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
    }
  },

  _hasScroll: function() {
    return this.element.outerHeight() < this.element.prop( "scrollHeight" );
  },

  select: function( event ) {
    // TODO: It should never be possible to not have an active item at this
    // point, but the tests don't trigger mouseenter before click.
    this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
    var ui = { item: this.active };
    if ( !this.active.has( ".ui-menu" ).length ) {
      this.collapseAll( event, true );
    }
    this._trigger( "select", event, ui );
  }
});

}( jQuery ));

jQuery(function($){
  $.datepicker.regional['zh-CN'] = {
    closeText: '关闭',
    prevText: '&#x3c;上月',
    nextText: '下月&#x3e;',
    currentText: '今天',
    monthNames: ['一月','二月','三月','四月','五月','六月',
    '七月','八月','九月','十月','十一月','十二月'],
    monthNamesShort: ['一','二','三','四','五','六',
    '七','八','九','十','十一','十二'],
    dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
    dayNamesMin: ['日','一','二','三','四','五','六'],
    weekHeader: '周',
    dateFormat: 'yy-mm-dd',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: true,
    yearSuffix: '年'};
  $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});

(function(a){a.cookie=function(b,c,d){if(arguments.length>1&&String(c)!=="[object Object]"){d=a.extend({},d);if(c===null||c===undefined)d.expires=-1;if(typeof d.expires=="number"){var e=d.expires,f=d.expires=new Date;f.setDate(f.getDate()+e)}c=String(c);return document.cookie=[encodeURIComponent(b),"=",d.raw?c:encodeURIComponent(c),d.expires?"; expires="+d.expires.toUTCString():"",d.path?"; path="+d.path:"",d.domain?"; domain="+d.domain:"",d.secure?"; secure":""].join("")}d=c||{};var g,h=d.raw?function(a){return a}:decodeURIComponent;return(g=(new RegExp("(?:^|; )"+encodeURIComponent(b)+"=([^;]*)")).exec(document.cookie))?h(g[1]):null}})($);
//     Underscore.js 1.4.2
//     http://underscorejs.org
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.
(function(){var e=this,t=e._,n={},r=Array.prototype,i=Object.prototype,s=Function.prototype,o=r.push,u=r.slice,a=r.concat,f=r.unshift,l=i.toString,c=i.hasOwnProperty,h=r.forEach,p=r.map,d=r.reduce,v=r.reduceRight,m=r.filter,g=r.every,y=r.some,b=r.indexOf,w=r.lastIndexOf,E=Array.isArray,S=Object.keys,x=s.bind,T=function(e){if(e instanceof T)return e;if(!(this instanceof T))return new T(e);this._wrapped=e};typeof exports!="undefined"?(typeof module!="undefined"&&module.exports&&(exports=module.exports=T),exports._=T):e._=T,T.VERSION="1.4.2";var N=T.each=T.forEach=function(e,t,r){if(e==null)return;if(h&&e.forEach===h)e.forEach(t,r);else if(e.length===+e.length){for(var i=0,s=e.length;i<s;i++)if(t.call(r,e[i],i,e)===n)return}else for(var o in e)if(T.has(e,o)&&t.call(r,e[o],o,e)===n)return};T.map=T.collect=function(e,t,n){var r=[];return e==null?r:p&&e.map===p?e.map(t,n):(N(e,function(e,i,s){r[r.length]=t.call(n,e,i,s)}),r)},T.reduce=T.foldl=T.inject=function(e,t,n,r){var i=arguments.length>2;e==null&&(e=[]);if(d&&e.reduce===d)return r&&(t=T.bind(t,r)),i?e.reduce(t,n):e.reduce(t);N(e,function(e,s,o){i?n=t.call(r,n,e,s,o):(n=e,i=!0)});if(!i)throw new TypeError("Reduce of empty array with no initial value");return n},T.reduceRight=T.foldr=function(e,t,n,r){var i=arguments.length>2;e==null&&(e=[]);if(v&&e.reduceRight===v)return r&&(t=T.bind(t,r)),arguments.length>2?e.reduceRight(t,n):e.reduceRight(t);var s=e.length;if(s!==+s){var o=T.keys(e);s=o.length}N(e,function(u,a,f){a=o?o[--s]:--s,i?n=t.call(r,n,e[a],a,f):(n=e[a],i=!0)});if(!i)throw new TypeError("Reduce of empty array with no initial value");return n},T.find=T.detect=function(e,t,n){var r;return C(e,function(e,i,s){if(t.call(n,e,i,s))return r=e,!0}),r},T.filter=T.select=function(e,t,n){var r=[];return e==null?r:m&&e.filter===m?e.filter(t,n):(N(e,function(e,i,s){t.call(n,e,i,s)&&(r[r.length]=e)}),r)},T.reject=function(e,t,n){var r=[];return e==null?r:(N(e,function(e,i,s){t.call(n,e,i,s)||(r[r.length]=e)}),r)},T.every=T.all=function(e,t,r){t||(t=T.identity);var i=!0;return e==null?i:g&&e.every===g?e.every(t,r):(N(e,function(e,s,o){if(!(i=i&&t.call(r,e,s,o)))return n}),!!i)};var C=T.some=T.any=function(e,t,r){t||(t=T.identity);var i=!1;return e==null?i:y&&e.some===y?e.some(t,r):(N(e,function(e,s,o){if(i||(i=t.call(r,e,s,o)))return n}),!!i)};T.contains=T.include=function(e,t){var n=!1;return e==null?n:b&&e.indexOf===b?e.indexOf(t)!=-1:(n=C(e,function(e){return e===t}),n)},T.invoke=function(e,t){var n=u.call(arguments,2);return T.map(e,function(e){return(T.isFunction(t)?t:e[t]).apply(e,n)})},T.pluck=function(e,t){return T.map(e,function(e){return e[t]})},T.where=function(e,t){return T.isEmpty(t)?[]:T.filter(e,function(e){for(var n in t)if(t[n]!==e[n])return!1;return!0})},T.max=function(e,t,n){if(!t&&T.isArray(e)&&e[0]===+e[0]&&e.length<65535)return Math.max.apply(Math,e);if(!t&&T.isEmpty(e))return-Infinity;var r={computed:-Infinity};return N(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o>=r.computed&&(r={value:e,computed:o})}),r.value},T.min=function(e,t,n){if(!t&&T.isArray(e)&&e[0]===+e[0]&&e.length<65535)return Math.min.apply(Math,e);if(!t&&T.isEmpty(e))return Infinity;var r={computed:Infinity};return N(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o<r.computed&&(r={value:e,computed:o})}),r.value},T.shuffle=function(e){var t,n=0,r=[];return N(e,function(e){t=T.random(n++),r[n-1]=r[t],r[t]=e}),r};var k=function(e){return T.isFunction(e)?e:function(t){return t[e]}};T.sortBy=function(e,t,n){var r=k(t);return T.pluck(T.map(e,function(e,t,i){return{value:e,index:t,criteria:r.call(n,e,t,i)}}).sort(function(e,t){var n=e.criteria,r=t.criteria;if(n!==r){if(n>r||n===void 0)return 1;if(n<r||r===void 0)return-1}return e.index<t.index?-1:1}),"value")};var L=function(e,t,n,r){var i={},s=k(t);return N(e,function(t,o){var u=s.call(n,t,o,e);r(i,u,t)}),i};T.groupBy=function(e,t,n){return L(e,t,n,function(e,t,n){(T.has(e,t)?e[t]:e[t]=[]).push(n)})},T.countBy=function(e,t,n){return L(e,t,n,function(e,t,n){T.has(e,t)||(e[t]=0),e[t]++})},T.sortedIndex=function(e,t,n,r){n=n==null?T.identity:k(n);var i=n.call(r,t),s=0,o=e.length;while(s<o){var u=s+o>>>1;n.call(r,e[u])<i?s=u+1:o=u}return s},T.toArray=function(e){return e?e.length===+e.length?u.call(e):T.values(e):[]},T.size=function(e){return e.length===+e.length?e.length:T.keys(e).length},T.first=T.head=T.take=function(e,t,n){return t!=null&&!n?u.call(e,0,t):e[0]},T.initial=function(e,t,n){return u.call(e,0,e.length-(t==null||n?1:t))},T.last=function(e,t,n){return t!=null&&!n?u.call(e,Math.max(e.length-t,0)):e[e.length-1]},T.rest=T.tail=T.drop=function(e,t,n){return u.call(e,t==null||n?1:t)},T.compact=function(e){return T.filter(e,function(e){return!!e})};var A=function(e,t,n){return N(e,function(e){T.isArray(e)?t?o.apply(n,e):A(e,t,n):n.push(e)}),n};T.flatten=function(e,t){return A(e,t,[])},T.without=function(e){return T.difference(e,u.call(arguments,1))},T.uniq=T.unique=function(e,t,n,r){var i=n?T.map(e,n,r):e,s=[],o=[];return N(i,function(n,r){if(t?!r||o[o.length-1]!==n:!T.contains(o,n))o.push(n),s.push(e[r])}),s},T.union=function(){return T.uniq(a.apply(r,arguments))},T.intersection=function(e){var t=u.call(arguments,1);return T.filter(T.uniq(e),function(e){return T.every(t,function(t){return T.indexOf(t,e)>=0})})},T.difference=function(e){var t=a.apply(r,u.call(arguments,1));return T.filter(e,function(e){return!T.contains(t,e)})},T.zip=function(){var e=u.call(arguments),t=T.max(T.pluck(e,"length")),n=new Array(t);for(var r=0;r<t;r++)n[r]=T.pluck(e,""+r);return n},T.object=function(e,t){var n={};for(var r=0,i=e.length;r<i;r++)t?n[e[r]]=t[r]:n[e[r][0]]=e[r][1];return n},T.indexOf=function(e,t,n){if(e==null)return-1;var r=0,i=e.length;if(n){if(typeof n!="number")return r=T.sortedIndex(e,t),e[r]===t?r:-1;r=n<0?Math.max(0,i+n):n}if(b&&e.indexOf===b)return e.indexOf(t,n);for(;r<i;r++)if(e[r]===t)return r;return-1},T.lastIndexOf=function(e,t,n){if(e==null)return-1;var r=n!=null;if(w&&e.lastIndexOf===w)return r?e.lastIndexOf(t,n):e.lastIndexOf(t);var i=r?n:e.length;while(i--)if(e[i]===t)return i;return-1},T.range=function(e,t,n){arguments.length<=1&&(t=e||0,e=0),n=arguments[2]||1;var r=Math.max(Math.ceil((t-e)/n),0),i=0,s=new Array(r);while(i<r)s[i++]=e,e+=n;return s};var O=function(){};T.bind=function(t,n){var r,i;if(t.bind===x&&x)return x.apply(t,u.call(arguments,1));if(!T.isFunction(t))throw new TypeError;return i=u.call(arguments,2),r=function(){if(this instanceof r){O.prototype=t.prototype;var e=new O,s=t.apply(e,i.concat(u.call(arguments)));return Object(s)===s?s:e}return t.apply(n,i.concat(u.call(arguments)))}},T.bindAll=function(e){var t=u.call(arguments,1);return t.length==0&&(t=T.functions(e)),N(t,function(t){e[t]=T.bind(e[t],e)}),e},T.memoize=function(e,t){var n={};return t||(t=T.identity),function(){var r=t.apply(this,arguments);return T.has(n,r)?n[r]:n[r]=e.apply(this,arguments)}},T.delay=function(e,t){var n=u.call(arguments,2);return setTimeout(function(){return e.apply(null,n)},t)},T.defer=function(e){return T.delay.apply(T,[e,1].concat(u.call(arguments,1)))},T.throttle=function(e,t){var n,r,i,s,o,u,a=T.debounce(function(){o=s=!1},t);return function(){n=this,r=arguments;var f=function(){i=null,o&&(u=e.apply(n,r)),a()};return i||(i=setTimeout(f,t)),s?o=!0:(s=!0,u=e.apply(n,r)),a(),u}},T.debounce=function(e,t,n){var r,i;return function(){var s=this,o=arguments,u=function(){r=null,n||(i=e.apply(s,o))},a=n&&!r;return clearTimeout(r),r=setTimeout(u,t),a&&(i=e.apply(s,o)),i}},T.once=function(e){var t=!1,n;return function(){return t?n:(t=!0,n=e.apply(this,arguments),e=null,n)}},T.wrap=function(e,t){return function(){var n=[e];return o.apply(n,arguments),t.apply(this,n)}},T.compose=function(){var e=arguments;return function(){var t=arguments;for(var n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},T.after=function(e,t){return e<=0?t():function(){if(--e<1)return t.apply(this,arguments)}},T.keys=S||function(e){if(e!==Object(e))throw new TypeError("Invalid object");var t=[];for(var n in e)T.has(e,n)&&(t[t.length]=n);return t},T.values=function(e){var t=[];for(var n in e)T.has(e,n)&&t.push(e[n]);return t},T.pairs=function(e){var t=[];for(var n in e)T.has(e,n)&&t.push([n,e[n]]);return t},T.invert=function(e){var t={};for(var n in e)T.has(e,n)&&(t[e[n]]=n);return t},T.functions=T.methods=function(e){var t=[];for(var n in e)T.isFunction(e[n])&&t.push(n);return t.sort()},T.extend=function(e){return N(u.call(arguments,1),function(t){for(var n in t)e[n]=t[n]}),e},T.pick=function(e){var t={},n=a.apply(r,u.call(arguments,1));return N(n,function(n){n in e&&(t[n]=e[n])}),t},T.omit=function(e){var t={},n=a.apply(r,u.call(arguments,1));for(var i in e)T.contains(n,i)||(t[i]=e[i]);return t},T.defaults=function(e){return N(u.call(arguments,1),function(t){for(var n in t)e[n]==null&&(e[n]=t[n])}),e},T.clone=function(e){return T.isObject(e)?T.isArray(e)?e.slice():T.extend({},e):e},T.tap=function(e,t){return t(e),e};var M=function(e,t,n,r){if(e===t)return e!==0||1/e==1/t;if(e==null||t==null)return e===t;e instanceof T&&(e=e._wrapped),t instanceof T&&(t=t._wrapped);var i=l.call(e);if(i!=l.call(t))return!1;switch(i){case"[object String]":return e==String(t);case"[object Number]":return e!=+e?t!=+t:e==0?1/e==1/t:e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object RegExp]":return e.source==t.source&&e.global==t.global&&e.multiline==t.multiline&&e.ignoreCase==t.ignoreCase}if(typeof e!="object"||typeof t!="object")return!1;var s=n.length;while(s--)if(n[s]==e)return r[s]==t;n.push(e),r.push(t);var o=0,u=!0;if(i=="[object Array]"){o=e.length,u=o==t.length;if(u)while(o--)if(!(u=M(e[o],t[o],n,r)))break}else{var a=e.constructor,f=t.constructor;if(a!==f&&!(T.isFunction(a)&&a instanceof a&&T.isFunction(f)&&f instanceof f))return!1;for(var c in e)if(T.has(e,c)){o++;if(!(u=T.has(t,c)&&M(e[c],t[c],n,r)))break}if(u){for(c in t)if(T.has(t,c)&&!(o--))break;u=!o}}return n.pop(),r.pop(),u};T.isEqual=function(e,t){return M(e,t,[],[])},T.isEmpty=function(e){if(e==null)return!0;if(T.isArray(e)||T.isString(e))return e.length===0;for(var t in e)if(T.has(e,t))return!1;return!0},T.isElement=function(e){return!!e&&e.nodeType===1},T.isArray=E||function(e){return l.call(e)=="[object Array]"},T.isObject=function(e){return e===Object(e)},N(["Arguments","Function","String","Number","Date","RegExp"],function(e){T["is"+e]=function(t){return l.call(t)=="[object "+e+"]"}}),T.isArguments(arguments)||(T.isArguments=function(e){return!!e&&!!T.has(e,"callee")}),typeof /./!="function"&&(T.isFunction=function(e){return typeof e=="function"}),T.isFinite=function(e){return T.isNumber(e)&&isFinite(e)},T.isNaN=function(e){return T.isNumber(e)&&e!=+e},T.isBoolean=function(e){return e===!0||e===!1||l.call(e)=="[object Boolean]"},T.isNull=function(e){return e===null},T.isUndefined=function(e){return e===void 0},T.has=function(e,t){return c.call(e,t)},T.noConflict=function(){return e._=t,this},T.identity=function(e){return e},T.times=function(e,t,n){for(var r=0;r<e;r++)t.call(n,r)},T.random=function(e,t){return t==null&&(t=e,e=0),e+(0|Math.random()*(t-e+1))};var _={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};_.unescape=T.invert(_.escape);var D={escape:new RegExp("["+T.keys(_.escape).join("")+"]","g"),unescape:new RegExp("("+T.keys(_.unescape).join("|")+")","g")};T.each(["escape","unescape"],function(e){T[e]=function(t){return t==null?"":(""+t).replace(D[e],function(t){return _[e][t]})}}),T.result=function(e,t){if(e==null)return null;var n=e[t];return T.isFunction(n)?n.call(e):n},T.mixin=function(e){N(T.functions(e),function(t){var n=T[t]=e[t];T.prototype[t]=function(){var e=[this._wrapped];return o.apply(e,arguments),F.call(this,n.apply(T,e))}})};var P=0;T.uniqueId=function(e){var t=P++;return e?e+t:t},T.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var H=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},j=/\\|'|\r|\n|\t|\u2028|\u2029/g;T.template=function(e,t,n){n=T.defaults({},n,T.templateSettings);var r=new RegExp([(n.escape||H).source,(n.interpolate||H).source,(n.evaluate||H).source].join("|")+"|$","g"),i=0,s="__p+='";e.replace(r,function(t,n,r,o,u){s+=e.slice(i,u).replace(j,function(e){return"\\"+B[e]}),s+=n?"'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'":r?"'+\n((__t=("+r+"))==null?'':__t)+\n'":o?"';\n"+o+"\n__p+='":"",i=u+t.length}),s+="';\n",n.variable||(s="with(obj||{}){\n"+s+"}\n"),s="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+s+"return __p;\n";try{var o=new Function(n.variable||"obj","_",s)}catch(u){throw u.source=s,u}if(t)return o(t,T);var a=function(e){return o.call(this,e,T)};return a.source="function("+(n.variable||"obj")+"){\n"+s+"}",a},T.chain=function(e){return T(e).chain()};var F=function(e){return this._chain?T(e).chain():e};T.mixin(T),N(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=r[e];T.prototype[e]=function(){var n=this._wrapped;return t.apply(n,arguments),(e=="shift"||e=="splice")&&n.length===0&&delete n[0],F.call(this,n)}}),N(["concat","join","slice"],function(e){var t=r[e];T.prototype[e]=function(){return F.call(this,t.apply(this._wrapped,arguments))}}),T.extend(T.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
//     Backbone.js 0.5.3
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object.
  var root = this;

  // Save the previous value of the `Backbone` variable.
  var previousBackbone = root.Backbone;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.5.3';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore')._;

  // For Backbone's purposes, jQuery or Zepto owns the `$` variable.
  var $ = root.jQuery || root.Zepto;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option will
  // fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and set a
  // `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may `bind` or `unbind` a callback function to an event;
  // `trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.bind('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback` function.
    // Passing `"all"` will bind the callback to all events fired.
    bind : function(ev, callback, context) {
      var calls = this._callbacks || (this._callbacks = {});
      var list  = calls[ev] || (calls[ev] = []);
      list.push([callback, context]);
      return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
      var calls;
      if (!ev) {
        this._callbacks = {};
      } else if (calls = this._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          var list = calls[ev];
          if (!list) return this;
          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] && callback === list[i][0]) {
              list[i] = null;
              break;
            }
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(eventName) {
      var list, calls, ev, callback, args;
      var both = 2;
      if (!(calls = this._callbacks)) return this;
      while (both--) {
        ev = both ? eventName : 'all';
        if (list = calls[ev]) {
          for (var i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1); i--; l--;
            } else {
              args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
              callback[0].apply(callback[1] || this, args);
            }
          }
        }
      }
      return this;
    }

  };

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (defaults = this.defaults) {
      if (_.isFunction(defaults)) defaults = defaults.call(this);
      attributes = _.extend({}, defaults, attributes);
    }
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.set(attributes, {silent : true});
    this._changed = false;
    this._previousAttributes = _.clone(this.attributes);
    if (options && options.collection) this.collection = options.collection;
    this.initialize(attributes, options);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // A snapshot of the model's previous attributes, taken immediately
    // after the last `"change"` event was fired.
    _previousAttributes : null,

    // Has the item been changed since the last `"change"` event?
    _changed : false,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute : 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Return a copy of the model's `attributes` object.
    toJSON : function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get : function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape : function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = escapeHTML(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has : function(attr) {
      return this.attributes[attr] != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    set : function(attrs, options) {

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs.attributes) attrs = attrs.attributes;
      var now = this.attributes, escaped = this._escapedAttributes;

      // Run validation.
      if (!options.silent && this.validate && !this._performValidation(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // We're about to start triggering change events.
      var alreadyChanging = this._changing;
      this._changing = true;

      // Update attributes.
      for (var attr in attrs) {
        var val = attrs[attr];
        if (!_.isEqual(now[attr], val)) {
          now[attr] = val;
          delete escaped[attr];
          this._changed = true;
          if (!options.silent) this.trigger('change:' + attr, this, val, options);
        }
      }

      // Fire the `"change"` event, if the model has been changed.
      if (!alreadyChanging && !options.silent && this._changed) this.change(options);
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset : function(attr, options) {
      if (!(attr in this.attributes)) return this;
      options || (options = {});
      var value = this.attributes[attr];

      // Run validation.
      var validObj = {};
      validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      // Remove the attribute.
      delete this.attributes[attr];
      delete this._escapedAttributes[attr];
      if (attr == this.idAttribute) delete this.id;
      this._changed = true;
      if (!options.silent) {
        this.trigger('change:' + attr, this, void 0, options);
        this.change(options);
      }
      return this;
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear : function(options) {
      options || (options = {});
      var attr;
      var old = this.attributes;

      // Run validation.
      var validObj = {};
      for (attr in old) validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      this.attributes = {};
      this._escapedAttributes = {};
      this._changed = true;
      if (!options.silent) {
        for (attr in old) {
          this.trigger('change:' + attr, this, void 0, options);
        }
        this.change(options);
      }
      return this;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch : function(options) {
      options || (options = {});
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
      options || (options = {});
      if (attrs && !this.set(attrs, options)) return false;
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp, xhr);
      };
      options.error = wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      return (this.sync || Backbone.sync).call(this, method, this, options);
    },

    // Destroy this model on the server if it was already persisted. Upon success, the model is removed
    // from its collection, if it has one.
    destroy : function(options) {
      options || (options = {});
      if (this.isNew()) return this.trigger('destroy', this, this.collection, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        model.trigger('destroy', model, model.collection, options);
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'delete', this, options);
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url : function() {
      var base = getUrl(this.collection) || this.urlRoot || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse : function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone : function() {
      return new this.constructor(this);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew : function() {
      return this.id == null;
    },

    // Call this method to manually fire a `change` event for this model.
    // Calling this will cause all objects observing the model to update.
    change : function(options) {
      this.trigger('change', this, options);
      this._previousAttributes = _.clone(this.attributes);
      this._changed = false;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged : function(attr) {
      if (attr) return this._previousAttributes[attr] != this.attributes[attr];
      return this._changed;
    },

    // Return an object containing all the attributes that have changed, or false
    // if there are no changed attributes. Useful for determining what parts of a
    // view need to be updated and/or what attributes need to be persisted to
    // the server.
    changedAttributes : function(now) {
      now || (now = this.attributes);
      var old = this._previousAttributes;
      var changed = false;
      for (var attr in now) {
        if (!_.isEqual(old[attr], now[attr])) {
          changed = changed || {};
          changed[attr] = now[attr];
        }
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous : function(attr) {
      if (!attr || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes : function() {
      return _.clone(this._previousAttributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _performValidation : function(attrs, options) {
      var error = this.validate(attrs);
      if (error) {
        if (options.error) {
          options.error(this, error, options);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
      return true;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) this.comparator = options.comparator;
    _.bindAll(this, '_onModelEvent', '_removeReference');
    this._reset();
    if (models) this.reset(models, {silent: true});
    this.initialize.apply(this, arguments);
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model : Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `added` event for every new model.
    add : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._add(models[i], options);
        }
      } else {
        this._add(models, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `removed` event for every model removed.
    remove : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._remove(models[i], options);
        }
      } else {
        this._remove(models, options);
      }
      return this;
    },

    // Get a model from the set by id.
    get : function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid : function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under normal
    // circumstances, as the set will maintain sort order as each item is added.
    sort : function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      this.models = this.sortBy(this.comparator);
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck : function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `reset` when finished.
    reset : function(models, options) {
      models  || (models = []);
      options || (options = {});
      this.each(this._removeReference);
      this._reset();
      this.add(models, {silent: true});
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch : function(options) {
      options || (options = {});
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. After the model
    // has been created on the server, it will be added to the collection.
    // Returns the model, or 'false' if validation on a new model fails.
    create : function(model, options) {
      var coll = this;
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        coll.add(nextModel, options);
        if (success) success(nextModel, resp, xhr);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse : function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset : function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model to be added to this collection
    _prepareModel: function(model, options) {
      if (!(model instanceof Backbone.Model)) {
        var attrs = model;
        model = new this.model(attrs, {collection: this});
        if (model.validate && !model._performValidation(attrs, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal implementation of adding a single model to the set, updating
    // hash indexes for `id` and `cid` lookups.
    // Returns the model, or 'false' if validation on a new model fails.
    _add : function(model, options) {
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var already = this.getByCid(model);
      if (already) throw new Error(["Can't add the same model to a set twice", already.id]);
      this._byId[model.id] = model;
      this._byCid[model.cid] = model;
      var index = options.at != null ? options.at :
                  this.comparator ? this.sortedIndex(model, this.comparator) :
                  this.length;
      this.models.splice(index, 0, model);
      model.bind('all', this._onModelEvent);
      this.length++;
      if (!options.silent) model.trigger('add', model, this, options);
      return model;
    },

    // Internal implementation of removing a single model from the set, updating
    // hash indexes for `id` and `cid` lookups.
    _remove : function(model, options) {
      options || (options = {});
      model = this.getByCid(model) || this.get(model);
      if (!model) return null;
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      this.models.splice(this.indexOf(model), 1);
      this.length--;
      if (!options.silent) model.trigger('remove', model, this, options);
      this._removeReference(model);
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference : function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.unbind('all', this._onModelEvent);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent : function(ev, model, collection, options) {
      if ((ev == 'add' || ev == 'remove') && collection != this) return;
      if (ev == 'destroy') {
        this._remove(model, options);
      }
      if (model && ev === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
    'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
    'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:([\w\d]+)/g;
  var splatParam    = /\*([\w\d]+)/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Backbone.Router.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate : function(fragment, triggerRoute) {
      Backbone.history.navigate(fragment, triggerRoute);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes : function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp : function(route) {
      route = route.replace(escapeRegExp, "\\$&")
                   .replace(namedParam, "([^\/]*)")
                   .replace(splatParam, "(.*?)");
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters : function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning hashes.
  var hashStrip = /^#*/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  var historyStarted = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment : function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
          if (fragment.indexOf(this.options.root) == 0) fragment = fragment.substr(this.options.root.length);
        } else {
          fragment = window.location.hash;
        }
      }
      return decodeURIComponent(fragment.replace(hashStrip, ''));
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start : function(options) {

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      if (historyStarted) throw new Error("Backbone.history has already been started");
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else {
        setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      historyStarted = true;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;
      if (this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = loc.hash.replace(hashStrip, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Add a route to be tested when the fragment changes. Routes added later may
    // override previous routes.
    route : function(route, callback) {
      this.handlers.unshift({route : route, callback : callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl : function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
      if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(window.location.hash);
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl : function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history. You are responsible for properly
    // URL-encoding the fragment in advance. This does not trigger
    // a `hashchange` event.
    navigate : function(fragment, triggerRoute) {
      var frag = (fragment || '').replace(hashStrip, '');
      if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;
      if (this._hasPushState) {
        var loc = window.location;
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history.pushState({}, document.title, loc.protocol + '//' + loc.host + frag);
      } else {
        window.location.hash = this.fragment = frag;
        if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
          this.iframe.document.open().close();
          this.iframe.location.hash = frag;
        }
      }
      if (triggerRoute) this.loadUrl(fragment);
    }

  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.delegateEvents();
    this.initialize.apply(this, arguments);
  };

  // Element lookup, scoped to DOM elements within the current view.
  // This should be prefered to global lookups, if you're dealing with
  // a specific view.
  var selectorDelegate = function(selector) {
    return $(selector, this.el);
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName : 'div',

    // Attach the `selectorDelegate` function as the `$` property.
    $       : selectorDelegate,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render : function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove : function() {
      $(this.el).remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make : function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Set callbacks, where `this.callbacks` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents : function(events) {
      if (!(events || (events = this.events))) return;
      if (_.isFunction(events)) events = events.call(this);
      $(this.el).unbind('.delegateEvents' + this.cid);
      for (var key in events) {
        var method = this[events[key]];
        if (!method) throw new Error('Event "' + events[key] + '" does not exist');
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          $(this.el).bind(eventName, method);
        } else {
          $(this.el).delegate(selector, eventName, method);
        }
      }
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure : function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` proeprties.
    _ensureElement : function() {
      if (!this.el) {
        var attrs = this.attributes || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.el = this.make(this.tagName, attrs);
      } else if (_.isString(this.el)) {
        this.el = $(this.el).get(0);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Router.extend = Backbone.View.extend = extend;

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, uses makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded` instead of
  // `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json'
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
      params.url = getUrl(model) || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request.
    return $.ajax(params);
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a URL from a Model or Collection as a property
  // or as a function.
  var getUrl = function(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(onError, model, options) {
    return function(resp) {
      if (onError) {
        onError(model, resp, options);
      } else {
        model.trigger('error', model, resp, options);
      }
    };
  };

  // Helper function to escape a string for HTML rendering.
  var escapeHTML = function(string) {
    return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

}).call(this);

/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/var Mustache=function(){var a=function(){};a.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":!0},context:{},render:function(a,b,c,d){d||(this.context=b,this.buffer=[]);if(!this.includes("",a)){if(d)return a;this.send(a)}else{a=this.render_pragmas(a);var e=this.render_section(a,b,c);if(d)return this.render_tags(e,b,c,d);this.render_tags(e,b,c,d)}},send:function(a){a!=""&&this.buffer.push(a)},render_pragmas:function(a){if(!this.includes("%",a))return a;var b=this,c=new RegExp(this.otag+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+this.ctag);return a.replace(c,function(a,c,d){if(!b.pragmas_implemented[c])throw{message:"This implementation of mustache doesn't understand the '"+c+"' pragma"};b.pragmas[c]={};if(d){var e=d.split("=");b.pragmas[c][e[0]]=e[1]}return""})},render_partial:function(a,b,c){a=this.trim(a);if(!c||c[a]===undefined)throw{message:"unknown_partial '"+a+"'"};if(typeof b[a]!="object")return this.render(c[a],b,c,!0);return this.render(c[a],b[a],c,!0)},render_section:function(a,b,c){if(!this.includes("#",a)&&!this.includes("^",a))return a;var d=this,e=new RegExp(this.otag+"(\\^|\\#)\\s*(.+)\\s*"+this.ctag+"\n*([\\s\\S]+?)"+this.otag+"\\/\\s*\\2\\s*"+this.ctag+"\\s*","mg");return a.replace(e,function(a,e,f,g){var h=d.find(f,b);if(e=="^")return!h||d.is_array(h)&&h.length===0?d.render(g,b,c,!0):"";if(e=="#")return d.is_array(h)?d.map(h,function(a){return d.render(g,d.create_context(a),c,!0)}).join(""):d.is_object(h)?d.render(g,d.create_context(h),c,!0):typeof h=="function"?h.call(b,g,function(a){return d.render(a,b,c,!0)}):h?d.render(g,b,c,!0):""})},render_tags:function(a,b,c,d){var e=this,f=function(){return new RegExp(e.otag+"(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?"+e.ctag+"+","g")},g=f(),h=function(a,d,h){switch(d){case"!":return"";case"=":e.set_delimiters(h),g=f();return"";case">":return e.render_partial(h,b,c);case"{":return e.find(h,b);default:return e.escape(e.find(h,b))}},i=a.split("\n");for(var j=0;j<i.length;j++)i[j]=i[j].replace(g,h,this),d||this.send(i[j]);if(d)return i.join("\n")},set_delimiters:function(a){var b=a.split(" ");this.otag=this.escape_regex(b[0]),this.ctag=this.escape_regex(b[1])},escape_regex:function(a){if(!arguments.callee.sRE){var b=["/",".","*","+","?","|","(",")","[","]","{","}","\\"];arguments.callee.sRE=new RegExp("(\\"+b.join("|\\")+")","g")}return a.replace(arguments.callee.sRE,"\\$1")},find:function(a,b){function c(a){return a===!1||a===0||a}a=this.trim(a);var d;c(b[a])?d=b[a]:c(this.context[a])&&(d=this.context[a]);if(typeof d=="function")return d.apply(b);if(d!==undefined)return d;return""},includes:function(a,b){return b.indexOf(this.otag+a)!=-1},escape:function(a){a=String(a===null?"":a);return a.replace(/&(?!\w+;)|["'<>\\]/g,function(a){switch(a){case"&":return"&amp;";case"\\":return"\\\\";case'"':return"&quot;";case"'":return"&#39;";case"<":return"&lt;";case">":return"&gt;";default:return a}})},create_context:function(a){if(this.is_object(a))return a;var b=".";this.pragmas["IMPLICIT-ITERATOR"]&&(b=this.pragmas["IMPLICIT-ITERATOR"].iterator);var c={};c[b]=a;return c},is_object:function(a){return a&&typeof a=="object"},is_array:function(a){return Object.prototype.toString.call(a)==="[object Array]"},trim:function(a){return a.replace(/^\s*|\s*$/g,"")},map:function(a,b){if(typeof a.map=="function")return a.map(b);var c=[],d=a.length;for(var e=0;e<d;e++)c.push(b(a[e]));return c}};return{name:"mustache.js",version:"0.3.1-dev",to_html:function(b,c,d,e){var f=new a;e&&(f.send=e),f.render(b,c,d);if(!e)return f.buffer.join("\n")}}}();
// doT.js
// 2011, Laura Doktorova
// https://github.com/olado/doT
//
// doT is a custom blend of templating functions from jQote2.js
// (jQuery plugin) by aefxx (http://aefxx.com/jquery-plugins/jqote2/)
// and underscore.js (http://documentcloud.github.com/underscore/)
// plus extensions.
//
// Licensed under the MIT license.
//
(function(){function resolveDefs(c,block,def){return(typeof block=="string"?block:block.toString()).replace(c.define,function(match,code,assign,value){code.indexOf("def.")===0&&(code=code.substring(4)),code in def||(assign===":"?def[code]=value:eval("def[code]="+value));return""}).replace(c.use,function(match,code){var v=eval(code);return v?resolveDefs(c,v,def):v})}var doT={version:"0.1.6"};typeof module!="undefined"&&module.exports?module.exports=doT:this.doT=doT,doT.templateSettings={evaluate:/\{\{([\s\S]+?)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,varname:"it",strip:!0,append:!0},doT.template=function(a,b,c){b=b||doT.templateSettings;var d=b.append?"'+(":"';out+=(",e=b.append?")+'":");out+='",f=b.use||b.define?resolveDefs(b,a,c||{}):a;f=("var out='"+(b.strip?f.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]|(\/\*[\s\S]*?\*\/)/g,""):f).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(b.interpolate,function(a,b){return d+b.replace(/\\'/g,"'").replace(/\\\\/g,"\\").replace(/[\r\t\n]/g," ")+e}).replace(b.encode,function(a,b){return d+b.replace(/\\'/g,"'").replace(/\\\\/g,"\\").replace(/[\r\t\n]/g," ")+").toString().replace(/&(?!\\w+;)/g, '&#38;').split('<').join('&#60;').split('>').join('&#62;').split('"+'"'+"').join('&#34;').split("+'"'+"'"+'"'+").join('&#39;').split('/').join('&#47;'"+e}).replace(b.evaluate,function(a,b){return"';"+b.replace(/\\'/g,"'").replace(/\\\\/g,"\\").replace(/[\r\t\n]/g," ")+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").split("out+='';").join("").split("var out='';out+=").join("var out=");try{return new Function(b.varname,f)}catch(g){typeof console!="undefined"&&console.log("Could not create a template function: "+f);throw g}}})();
var jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  } 
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj){
  var buf = []
    , terse = obj.terse;
  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;
  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];
      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else {
        buf.push(key + '="' + exports.escape(val) + '"');
      }
    }
  }
  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
};

  return exports;

})({});

