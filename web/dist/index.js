/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./src/js/fix_ie8.js */ 1);
	__webpack_require__(/*! ppmoneyDialog */ 2);
	__webpack_require__(/*! ./src/js/common.js */ 10);
	__webpack_require__(/*! ./src/css/base.css */ 11);
	__webpack_require__(/*! ./src/css/common.css */ 13);
	var fileA = __webpack_require__(/*! ./tpl/fileA.html */ 15);
	var fileB = __webpack_require__(/*! ./tpl/fileB.html */ 17);
	$('body').append(fileA+fileB);
	__webpack_require__(/*! ./src/js/init.js */ 18);


/***/ },
/* 1 */
/*!***************************!*\
  !*** ./src/js/fix_ie8.js ***!
  \***************************/
/***/ function(module, exports) {

	if(!Function.prototype.bind){
	Function.prototype.bind = function(){
	    var fn = this,
	    args = [].slice.call(arguments),
	    object = args.shift();
	    return function(){
	        return fn.apply(object,args.concat([].slice.call(arguments)));
	    };
	};
	}
	if (!Array.prototype.filter){
	Array.prototype.filter = function(fun /*, thisp*/){
	var len = this.length;
	    if (typeof fun != "function")
	        throw new TypeError();
	        var res = new Array();
	        var thisp = arguments[1];
	        for (var i = 0; i < len; i++){
	            if (i in this){
	                var val = this[i]; // in case fun mutates this
	                if (fun.call(thisp, val, i, this))
	                res.push(val);
	            }
	        }
	    return res;
	};
	}


/***/ },
/* 2 */
/*!**********************************!*\
  !*** ./~/ppmoneyDialog/index.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./src/css/base.css */ 3);
	__webpack_require__(/*! ./src/css/dialog.css */ 7);
	__webpack_require__(/*! ./src/js/dialog */ 9);

/***/ },
/* 3 */
/*!******************************************!*\
  !*** ./~/ppmoneyDialog/src/css/base.css ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../css-loader!./base.css */ 4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../style-loader/addStyles.js */ 6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../css-loader/index.js!./base.css", function() {
				var newContent = require("!!./../../../css-loader/index.js!./base.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/*!*********************************************************!*\
  !*** ./~/css-loader!./~/ppmoneyDialog/src/css/base.css ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../css-loader/lib/css-base.js */ 5)();
	// imports
	
	
	// module
	exports.push([module.id, "@charset \"utf-8\";\r\n/*CSS reset Start*/\r\nbody,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,lable{margin:0;padding:0;}\r\nh1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500;}\r\nselect,textarea{font-size:100%;}\r\ntable{border-collapse:collapse;border-spacing:0;}\r\nfieldset,img{border:0;}\r\nimg{vertical-align:top;}\r\nabbr,acronym{border:0;font-variant:normal;}\r\ndel{text-decoration:line-through;}\r\naddress,caption,cite,code,dfn,em,b,i,th,var {font-weight:normal; font-style:normal;} \r\nol,ul{list-style:none;}\r\ncaption,th{text-align:left;}\r\nins{text-decoration:none;}\r\ninput, button, select, textarea {outline:none;}\r\ninput{border:1px solid #dedede;vertical-align:middle;font-family: \"Microsoft YaHei\",\"Helvetica Neue\", Helvetica Neue, Helvetica, Hiragino Sans GB,tahoma,arial,sans-serif;}\r\ninput:-webkit-autofill {-webkit-box-shadow: 0 0 0px 1000px white inset;}\r\ntextarea {resize:none;}\r\na{color:#333;text-decoration:none;outline: none;}\r\na:hover{color: #1194d3;}\r\nbody {color:#333;font:12px/1.5 \"Microsoft YaHei\",\"Helvetica Neue\", Helvetica Neue, Helvetica, Hiragino Sans GB,tahoma,arial,sans-serif}\r\n/*CSS reset End*/\r\n\r\n\r\n\r\n", ""]);
	
	// exports


/***/ },
/* 5 */
/*!**************************************!*\
  !*** ./~/css-loader/lib/css-base.js ***!
  \**************************************/
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/*!*************************************!*\
  !*** ./~/style-loader/addStyles.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/*!********************************************!*\
  !*** ./~/ppmoneyDialog/src/css/dialog.css ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../css-loader!./dialog.css */ 8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../style-loader/addStyles.js */ 6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../css-loader/index.js!./dialog.css", function() {
				var newContent = require("!!./../../../css-loader/index.js!./dialog.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/*!***********************************************************!*\
  !*** ./~/css-loader!./~/ppmoneyDialog/src/css/dialog.css ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../css-loader/lib/css-base.js */ 5)();
	// imports
	
	
	// module
	exports.push([module.id, "/*!\r\n * ui-dialog.css\r\n * Date: 2014-07-03\r\n * https://github.com/aui/artDialog\r\n * (c) 2009-2014 TangBin, http://www.planeArt.cn\r\n *\r\n * This is licensed under the GNU LGPL, version 2.1 or later.\r\n * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html\r\n */\r\n.ui-dialog {\r\n    *zoom:1;\r\n    _float: left;\r\n    position: relative;\r\n    background-color: #FFF;\r\n    border: 1px solid #999;\r\n    border-radius: 6px;\r\n    outline: 0;\r\n    background-clip: padding-box;\r\n    font-size: 14px;\r\n    line-height: 1.428571429;\r\n    \r\n  color: #333;\r\n    opacity: 0;\r\n    -webkit-transform: scale(0);\r\n    transform: scale(0);\r\n    -webkit-transition: -webkit-transform .15s ease-in-out, opacity .15s ease-in-out;\r\n    transition: transform .15s ease-in-out, opacity .15s ease-in-out;\r\n    \r\n  background-color: rgba(47, 47, 47, 0.2);  border: none;  FILTER: progid:DXImageTransform.Microsoft.Gradient(startColorstr=#88000000, endColorstr=#88000000);  padding: 6px;  outline: none;\r\n}\r\n.ui-popup-show .ui-dialog {\r\n    opacity: 1;\r\n    -webkit-transform: scale(1);\r\n    transform: scale(1);\r\n}\r\n.ui-popup-focus .ui-dialog {\r\n    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);\r\n}\r\n.ui-popup-modal .ui-dialog {\r\n    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1), 0 0 256px rgba(255, 255, 255, .3);\r\n}\r\n\r\n.ui-pp-tips .ui-dialog {\r\n    border: 1px solid #d1d1d1;  \r\n    FILTER: progid:DXImageTransform.Microsoft.Gradient(startColorstr=#88000000, endColorstr=#88000000);  \r\n    padding: 0;  outline: none;\r\n}\r\n.ui-pp-tips-box .ui-dialog { \r\n    background-color: transparent;\r\n}\r\n.ui-pp-tips .ui-dialog-grid {\r\n    border-radius: 6px; \r\n}\r\n.ui-dialog-grid {\r\n    width: auto;\r\n    margin: 0;\r\n    border: 0 none;\r\n    border-collapse:collapse;\r\n    border-spacing: 0;\r\n    background: #fff;\r\n}\r\n.ui-dialog-header,\r\n.ui-dialog-body,\r\n.ui-dialog-footer {\r\n    padding: 0;\r\n    border: 0 none;\r\n    text-align: left;\r\n    background: transparent;\r\n}\r\n.ui-dialog-header {\r\n    white-space: nowrap;\r\n    /* border-bottom: 1px solid #E5E5E5; */\r\n    background: #f5f5f5;\r\n}\r\n.ui-dialog-close {\r\n    -moz-transition: all 0.3s;  \r\n    -webkit-transition: all 0.3s;  \r\n    -o-transition: all 0.3s;\r\n    transition: all 0.3s;  \r\n    position: relative;\r\n    _position: absolute;\r\n    float: right;\r\n    top: 13px;\r\n    right: 13px;\r\n    _height: 26px;\r\n    padding: 0 4px;\r\n    font-size: 21px;\r\n    font-weight: bold;\r\n    line-height: 1;\r\n    color: #000;\r\n    text-shadow: 0 1px 0 #FFF;\r\n    opacity: .2;\r\n    filter: alpha(opacity=20);\r\n    cursor: pointer;\r\n    background: transparent;\r\n    _background: #FFF;\r\n    border: 0;\r\n    -webkit-appearance: none;\r\n}\r\n.ui-dialog-close:hover,\r\n.ui-dialog-close:focus {\r\n    color: #000000;\r\n    text-decoration: none;\r\n    cursor: pointer;\r\n    outline: 0;\r\n    opacity: 0.5;\r\n    filter: alpha(opacity=50);\r\n    -ms-transform: rotate(180deg);  \r\n    -webkit-transform: rotate(180deg);  \r\n    -o-transform: rotate(180deg); \r\n    -moz-transform: rotate(180deg);\r\n    transform: rotate(180deg);\r\n    transform: rotate(180deg);\r\n}\r\n.ui-dialog-title {\r\n    margin: 0;\r\n    line-height: 1.428571429;\r\n    min-height: 16.428571429px;\r\n    padding: 15px;\r\n    overflow:hidden; \r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n    font-weight: bold;\r\n    cursor: move;\r\n}\r\n.ui-dialog-body {\r\n    padding: 10px;\r\n    text-align: center;\r\n}\r\n.ui-dialog-content {\r\n    display: inline-block;\r\n    position: relative;\r\n    vertical-align: middle;\r\n    *zoom: 1;\r\n    *display: inline;\r\n    text-align: left;\r\n    padding: 0 !important;\r\n}\r\n.ui-dialog-footer {\r\n    padding: 10px;\r\n    /* background: #f5f5f5; */\r\n}\r\n.ui-dialog-statusbar {\r\n    float: left;\r\n    margin-right: 20px;\r\n    padding: 6px 0;\r\n    line-height: 1.428571429;\r\n    font-size: 14px;\r\n    color: #888;\r\n    white-space: nowrap;\r\n}\r\n.ui-dialog-statusbar label:hover {\r\n    color: #333;\r\n}\r\n.ui-dialog-statusbar input,\r\n.ui-dialog-statusbar .label {\r\n    vertical-align: middle;\r\n}\r\n.ui-dialog-button {\r\n    float: right;\r\n    white-space: nowrap;\r\n}\r\n.ui-dialog-footer button:first-child{\r\n    padding: 8px 21px;\r\n}\r\n.ui-dialog-footer button+button {\r\n    margin-bottom: 0;\r\n    margin-left: 5px;\r\n}\r\n.ui-dialog-footer button {\r\n    width:auto;\r\n    overflow:visible;\r\n    display: inline-block;\r\n    padding: 8px 36px;\r\n    _margin-left: 5px;\r\n    margin-bottom: 0;\r\n    font-size: 14px;\r\n    font-weight: normal;\r\n    line-height: 1.428571429;\r\n    text-align: center;\r\n    white-space: nowrap;\r\n    vertical-align: middle;\r\n    cursor: pointer;\r\n    background-image: none;\r\n    border: 0;\r\n    border-radius: 3px;\r\n    font-family: \"Microsoft YaHei\",\"Helvetica Neue\", Helvetica Neue, Helvetica, Hiragino Sans GB,tahoma,arial,sans-serif;\r\n    -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n       -o-user-select: none;\r\n          user-select: none;\r\n}\r\n\r\n.ui-dialog-footer button:focus {\r\n  outline: thin dotted #333;\r\n  outline: 5px auto -webkit-focus-ring-color;\r\n  outline-offset: -2px;\r\n}\r\n\r\n.ui-dialog-footer button:hover,\r\n.ui-dialog-footer button:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n}\r\n\r\n.ui-dialog-footer button:active {\r\n  background-image: none;\r\n  outline: 0;\r\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\r\n          box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\r\n}\r\n.ui-dialog-footer button[disabled] {\r\n  pointer-events: none;\r\n  cursor: not-allowed;\r\n  opacity: 0.65;\r\n  filter: alpha(opacity=65);\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n}\r\n\r\n.ui-dialog-footer button {\r\n  color: #fff;\r\n  background-color: #9e9e9e;\r\n  /* border-color: #666; */\r\n  float: left;\r\n}\r\n\r\n.ui-dialog-footer button:hover,\r\n.ui-dialog-footer button:focus,\r\n.ui-dialog-footer button:active {\r\n  /* color: #ecf0f1; */\r\n  background-color: #787878;\r\n  border-color: #787878;\r\n}\r\n\r\n.ui-dialog-footer button:active{\r\n  background-image: none;\r\n}\r\n\r\n.ui-dialog-footer button[disabled],\r\n.ui-dialog-footer button[disabled]:hover,\r\n.ui-dialog-footer button[disabled]:focus,\r\n.ui-dialog-footer button[disabled]:active {\r\n  background-color: #ffffff;\r\n  border-color: #cccccc;\r\n}\r\n\r\n.ui-dialog-footer button.ui-dialog-autofocus {\r\n  color: #ffffff;\r\n  background-color: #45b8ef;\r\n  /* border-color: #357ebd; */\r\n}\r\n\r\n.ui-dialog-footer button.ui-dialog-autofocus:hover,\r\n.ui-dialog-footer button.ui-dialog-autofocus:focus,\r\n.ui-dialog-footer button.ui-dialog-autofocus:active {\r\n  color: #ffffff;\r\n  background-color: #1194d3;\r\n  /* border-color: #285e8e; */\r\n}\r\n\r\n.ui-dialog-footer button.ui-dialog-autofocus:active {\r\n  background-image: none;\r\n}\r\n.ui-popup-top-left .ui-dialog,\r\n.ui-popup-top .ui-dialog,\r\n.ui-popup-top-right .ui-dialog {\r\n    top: -8px;\r\n}\r\n.ui-popup-bottom-left .ui-dialog,\r\n.ui-popup-bottom .ui-dialog,\r\n.ui-popup-bottom-right .ui-dialog {\r\n    top: 8px;\r\n}\r\n.ui-popup-left-top .ui-dialog,\r\n.ui-popup-left .ui-dialog,\r\n.ui-popup-left-bottom .ui-dialog {\r\n    left: -8px;\r\n}\r\n.ui-popup-right-top .ui-dialog,\r\n.ui-popup-right .ui-dialog,\r\n.ui-popup-right-bottom .ui-dialog {\r\n    left: 8px;\r\n}\r\n\r\n.ui-dialog-arrow-a,\r\n.ui-dialog-arrow-b {\r\n    position: absolute;\r\n    display: none;\r\n    width: 0;\r\n    height: 0;\r\n    overflow:hidden;\r\n    _color:#FF3FFF;\r\n    _filter:chroma(color=#FF3FFF);\r\n    border:8px dashed transparent;\r\n}\r\n.ui-popup-follow .ui-dialog-arrow-a,\r\n.ui-popup-follow .ui-dialog-arrow-b{\r\n    display: block;\r\n}\r\n.ui-popup-top-left .ui-dialog-arrow-a,\r\n.ui-popup-top .ui-dialog-arrow-a,\r\n.ui-popup-top-right .ui-dialog-arrow-a {\r\n    bottom: -16px;\r\n    border-top:8px solid #d1d1d1;\r\n}\r\n.ui-popup-top-left .ui-dialog-arrow-b,\r\n.ui-popup-top .ui-dialog-arrow-b,\r\n.ui-popup-top-right .ui-dialog-arrow-b {\r\n    bottom: -15px;\r\n    border-top:8px solid #fff;\r\n}\r\n.ui-popup-top-left .ui-dialog-arrow-a,\r\n.ui-popup-top-left .ui-dialog-arrow-b  {\r\n    left: 15px;\r\n}\r\n.ui-popup-top .ui-dialog-arrow-a,\r\n.ui-popup-top .ui-dialog-arrow-b  {\r\n    left: 50%;\r\n    margin-left: -8px;\r\n}\r\n.ui-popup-top-right .ui-dialog-arrow-a,\r\n.ui-popup-top-right .ui-dialog-arrow-b {\r\n    right: 15px;\r\n}\r\n.ui-popup-bottom-left .ui-dialog-arrow-a,\r\n.ui-popup-bottom .ui-dialog-arrow-a,\r\n.ui-popup-bottom-right .ui-dialog-arrow-a {\r\n    top: -16px;\r\n    border-bottom:8px solid #d1d1d1;\r\n}\r\n.ui-popup-bottom-left .ui-dialog-arrow-b,\r\n.ui-popup-bottom .ui-dialog-arrow-b,\r\n.ui-popup-bottom-right .ui-dialog-arrow-b {\r\n    top: -15px;\r\n    border-bottom:8px solid #fff;\r\n}\r\n.ui-popup-bottom-left .ui-dialog-arrow-a,\r\n.ui-popup-bottom-left .ui-dialog-arrow-b {\r\n    left: 15px;\r\n}\r\n.ui-popup-bottom .ui-dialog-arrow-a,\r\n.ui-popup-bottom .ui-dialog-arrow-b {\r\n    margin-left: -8px;\r\n    left: 50%;\r\n}\r\n.ui-popup-bottom-right .ui-dialog-arrow-a,\r\n.ui-popup-bottom-right .ui-dialog-arrow-b {\r\n    right: 15px;\r\n}\r\n.ui-popup-left-top .ui-dialog-arrow-a,\r\n.ui-popup-left .ui-dialog-arrow-a,\r\n.ui-popup-left-bottom .ui-dialog-arrow-a {\r\n    right: -16px;\r\n    border-left:8px solid #d1d1d1;\r\n}\r\n.ui-popup-left-top .ui-dialog-arrow-b,\r\n.ui-popup-left .ui-dialog-arrow-b,\r\n.ui-popup-left-bottom .ui-dialog-arrow-b {\r\n    right: -15px;\r\n    border-left:8px solid #fff;\r\n}\r\n.ui-popup-left-top .ui-dialog-arrow-a,\r\n.ui-popup-left-top .ui-dialog-arrow-b {\r\n    top: 15px;\r\n}\r\n.ui-popup-left .ui-dialog-arrow-a,\r\n.ui-popup-left .ui-dialog-arrow-b {\r\n    margin-top: -8px;\r\n    top: 50%;\r\n}\r\n.ui-popup-left-bottom .ui-dialog-arrow-a,\r\n.ui-popup-left-bottom .ui-dialog-arrow-b {\r\n    bottom: 15px;\r\n}\r\n.ui-popup-right-top .ui-dialog-arrow-a,\r\n.ui-popup-right .ui-dialog-arrow-a,\r\n.ui-popup-right-bottom .ui-dialog-arrow-a {\r\n    left: -16px;\r\n    border-right:8px solid #d1d1d1;\r\n}\r\n.ui-popup-right-top .ui-dialog-arrow-b,\r\n.ui-popup-right .ui-dialog-arrow-b,\r\n.ui-popup-right-bottom .ui-dialog-arrow-b {\r\n    left: -15px;\r\n    border-right:8px solid #fff;\r\n}\r\n.ui-popup-right-top .ui-dialog-arrow-a,\r\n.ui-popup-right-top .ui-dialog-arrow-b {\r\n    top: 15px;\r\n}\r\n.ui-popup-right .ui-dialog-arrow-a,\r\n.ui-popup-right .ui-dialog-arrow-b {\r\n    margin-top: -8px;\r\n    top: 50%;\r\n}\r\n.ui-popup-right-bottom .ui-dialog-arrow-a,\r\n.ui-popup-right-bottom .ui-dialog-arrow-b {\r\n    bottom: 15px;\r\n}\r\n\r\n\r\n@-webkit-keyframes ui-dialog-loading {\r\n    0% {\r\n        -webkit-transform: rotate(0deg);\r\n    }\r\n    100% {\r\n        -webkit-transform: rotate(360deg);\r\n    }\r\n}\r\n@keyframes ui-dialog-loading {\r\n    0% {\r\n        transform: rotate(0deg);\r\n    }\r\n    100% {\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n\r\n.ui-dialog-loading {\r\n    vertical-align: middle;\r\n    position: relative;\r\n    display: block;\r\n    *zoom: 1;\r\n    *display: inline;\r\n    overflow: hidden;\r\n    width: 32px;\r\n    height: 32px;\r\n    top: 50%;\r\n    margin: -16px auto 0 auto;\r\n    font-size: 0;\r\n    text-indent: -999em;\r\n    color: #666;\r\n}\r\n.ui-dialog-loading {\r\n    width: 100%\\9;\r\n    text-indent: 0\\9;\r\n    line-height: 32px\\9;\r\n    text-align: center\\9;\r\n    font-size: 12px\\9;\r\n}\r\n\r\n.ui-dialog-loading::after {\r\n    position: absolute;\r\n    content: '';\r\n    width: 3px;\r\n    height: 3px;\r\n    margin: 14.5px 0 0 14.5px;\r\n    border-radius: 100%;\r\n    box-shadow: 0 -10px 0 1px #ccc, 10px 0px #ccc, 0 10px #ccc, -10px 0 #ccc, -7px -7px 0 0.5px #ccc, 7px -7px 0 1.5px #ccc, 7px 7px #ccc, -7px 7px #ccc;\r\n    -webkit-transform: rotate(360deg);\r\n    -webkit-animation: ui-dialog-loading 1.5s infinite linear;\r\n    transform: rotate(360deg);\r\n    animation: ui-dialog-loading 1.5s infinite linear;\r\n    display: none\\9;\r\n}\r\n\r\n/*PPmoney-dialog*/\r\n.ui-dialog-content .ui-dialog-confirm{\r\n    padding: 20px;\r\n    min-width:150px;\r\n}\r\n.artDialog-hover {\r\n    z-index: 9999;\r\n    position: relative;\r\n}\r\n/**dialog-notitle*/\r\n.no-title .ui-dialog-title{visibility: hidden;padding: 5px;}\r\n.no-title .ui-dialog-header{background-color:#fff;}\r\n", ""]);
	
	// exports


/***/ },
/* 9 */
/*!******************************************!*\
  !*** ./~/ppmoneyDialog/src/js/dialog.js ***!
  \******************************************/
/***/ function(module, exports) {

	/*! artDialog v6.0.2 | https://github.com/aui/artDialog */ ! function() {
		function a(b) {
			var d = c[b],
				e = "exports";
			return "object" == typeof d ? d : (d[e] || (d[e] = {}, d[e] = d.call(d[e], a, d[e], d) || d[e]), d[e])
		}
	
		function b(a, b) {
			c[a] = b
		}
		var c = {};
		b("jquery", function() {
			return jQuery
		}), b("popup", function(a) {
			function b() {
				this.destroyed = !1, this.__popup = c("<div />").attr({
					tabindex: "-1"
				}).css({
					display: "none",
					position: "absolute",
					outline: 0
				}).html(this.innerHTML).appendTo("body"), this.__backdrop = c("<div />"), this.node = this.__popup[0], this.backdrop = this.__backdrop[0], d++
			}
			var c = a("jquery"),
				d = 0,
				e = !("minWidth" in c("html")[0].style),
				f = !e;
			return c.extend(b.prototype, {
				node: null,
				backdrop: null,
				fixed: !1,
				destroyed: !0,
				open: !1,
				returnValue: "",
				autofocus: !0,
				align: "bottom left",
				backdropBackground: "#000",
				backdropOpacity: .3,
				innerHTML: "",
				className: "ui-popup",
				show: function(a) {
					if (this.destroyed) return this;
					var b = this,
						d = this.__popup;
					return this.__activeElement = this.__getActive(), this.open = !0, this.follow = a || this.follow, this.__ready || (d.addClass(this.className), this.modal && this.__lock(), d.html() || d.html(this.innerHTML), e || c(window).on("resize", this.__onresize = function() {
						b.reset()
					}), this.__ready = !0), d.addClass(this.className + "-show").attr("role", this.modal ? "alertdialog" : "dialog").css("position", this.fixed ? "fixed" : "absolute").show(),a&&d.addClass("ui-pp-tips"), this.__backdrop.show(), this.reset().focus(), this.__dispatchEvent("show"), this
				},
				showModal: function() {
					return this.modal = !0, this.show.apply(this, arguments)
				},
				close: function(a) {
					return !this.destroyed && this.open && (void 0 !== a && (this.returnValue = a), this.__popup.hide().removeClass(this.className + "-show"), this.__backdrop.hide(), this.open = !1, this.blur(), this.__dispatchEvent("close")), this
				},
				remove: function() {
					if (this.destroyed) return this;
					this.__dispatchEvent("beforeremove"), b.current === this && (b.current = null), this.__unlock(), this.__popup.remove(), this.__backdrop.remove(), e || c(window).off("resize", this.__onresize), this.__dispatchEvent("remove");
					for (var a in this) delete this[a];
					return this
				},
				reset: function() {
					var a = this.follow;
					return a ? this.__follow(a) : this.__center(), this.__dispatchEvent("reset"), this
				},
				focus: function() {
					var a = this.node,
						d = b.current;
					if (d && d !== this && d.blur(!1), !c.contains(a, this.__getActive())) {
						var e = this.__popup.find("[autofocus]")[0];
						!this._autofocus && e ? this._autofocus = !0 : e = a, this.__focus(e)
					}
					return b.current = this, this.__popup.addClass(this.className + "-focus"), this.__zIndex(), this.__dispatchEvent("focus"), this
				},
				blur: function() {
					var a = this.__activeElement,
						b = arguments[0];
					return b !== !1 && this.__focus(a), this._autofocus = !1, this.__popup.removeClass(this.className + "-focus"), this.__dispatchEvent("blur"), this
				},
				addEventListener: function(a, b) {
					return this.__getEventListener(a).push(b), this
				},
				removeEventListener: function(a, b) {
					for (var c = this.__getEventListener(a), d = 0; d < c.length; d++) b === c[d] && c.splice(d--, 1);
					return this
				},
				__getEventListener: function(a) {
					var b = this.__listener;
					return b || (b = this.__listener = {}), b[a] || (b[a] = []), b[a]
				},
				__dispatchEvent: function(a) {
					var b = this.__getEventListener(a);
					this["on" + a] && this["on" + a]();
					for (var c = 0; c < b.length; c++) b[c].call(this)
				},
				__focus: function(a) {
					try {
						this.autofocus && !/^iframe$/i.test(a.nodeName) && a.focus()
					} catch (b) {}
				},
				__getActive: function() {
					try {
						var a = document.activeElement,
							b = a.contentDocument,
							c = b && b.activeElement || a;
						return c
					} catch (d) {}
				},
				__zIndex: function() {
					var a = b.zIndex++;
					this.__popup.css("zIndex", a), this.__backdrop.css("zIndex", a - 1), this.zIndex = a
				},
				__center: function() {
					var a = this.__popup,
						b = c(window),
						d = c(document),
						e = this.fixed,
						f = e ? 0 : d.scrollLeft(),
						g = e ? 0 : d.scrollTop(),
						h = b.width(),
						i = b.height(),
						j = a.width(),
						k = a.height(),
						l = (h - j) / 2 + f,
						m = 382 * (i - k) / 1e3 + g,
						n = a[0].style;
					n.left = Math.max(parseInt(l), f) + "px", n.top = Math.max(parseInt(m), g) + "px"
				},
				__follow: function(a) {
					var b = a.parentNode && c(a),
						d = this.__popup;
					if (this.__followSkin && d.removeClass(this.__followSkin), b) {
						var e = b.offset();
						if (e.left * e.top < 0) return this.__center()
					}
					var f = this,
						g = this.fixed,
						h = c(window),
						i = c(document),
						j = h.width(),
						k = h.height(),
						l = i.scrollLeft(),
						m = i.scrollTop(),
						n = d.width(),
						o = d.height(),
						p = b ? b.outerWidth() : 0,
						q = b ? b.outerHeight() : 0,
						r = this.__offset(a),
						s = r.left,
						t = r.top,
						u = g ? s - l : s,
						v = g ? t - m : t,
						w = g ? 0 : l,
						x = g ? 0 : m,
						y = w + j - n,
						z = x + k - o,
						A = {},
						B = this.align.split(" "),
						C = this.className + "-",
						D = {
							top: "bottom",
							bottom: "top",
							left: "right",
							right: "left"
						},
						E = {
							top: "top",
							bottom: "top",
							left: "left",
							right: "left"
						},
						F = [{
							top: v - o,
							bottom: v + q,
							left: u - n,
							right: u + p
						}, {
							top: v,
							bottom: v - o + q,
							left: u,
							right: u - n + p
						}],
						G = {
							left: u + p / 2 - n / 2,
							top: v + q / 2 - o / 2
						},
						H = {
							left: [w, y],
							top: [x, z]
						};
					c.each(B, function(a, b) {
						F[a][b] > H[E[b]][1] && (b = B[a] = D[b]), F[a][b] < H[E[b]][0] && (B[a] = D[b])
					}), B[1] || (E[B[1]] = "left" === E[B[0]] ? "top" : "left", F[1][B[1]] = G[E[B[1]]]), C += B.join("-") + " " + this.className + "-follow", f.__followSkin = C, b && d.addClass(C), A[E[B[0]]] = parseInt(F[0][B[0]]), A[E[B[1]]] = parseInt(F[1][B[1]]), d.css(A)
				},
				__offset: function(a) {
					var b = a.parentNode,
						d = b ? c(a).offset() : {
							left: a.pageX,
							top: a.pageY
						};
					a = b ? a : a.target;
					var e = a.ownerDocument,
						f = e.defaultView || e.parentWindow;
					if (f == window) return d;
					var g = f.frameElement,
						h = c(e),
						i = h.scrollLeft(),
						j = h.scrollTop(),
						k = c(g).offset(),
						l = k.left,
						m = k.top;
					return {
						left: d.left + l - i,
						top: d.top + m - j
					}
				},
				__lock: function() {
					var a = this,
						d = this.__popup,
						e = this.__backdrop,
						g = {
							position: "fixed",
							left: 0,
							top: 0,
							width: "100%",
							height: "100%",
							overflow: "hidden",
							userSelect: "none",
							opacity: 0,
							background: this.backdropBackground
						};
					d.addClass(this.className + "-modal"), b.zIndex = b.zIndex + 2, this.__zIndex(), f || c.extend(g, {
						position: "absolute",
						width: c(window).width() + "px",
						height: c(document).height() + "px"
					}), e.css(g).animate({
						opacity: this.backdropOpacity
					}, 150).insertAfter(d).attr({
						tabindex: "0"
					}).on("focus", function() {
						a.focus()
					})
				},
				__unlock: function() {
					this.modal && (this.__popup.removeClass(this.className + "-modal"), this.__backdrop.remove(), delete this.modal)
				}
			}), b.zIndex = 1024, b.current = null, b
		}), b("dialog-config", {
			content: '<span class="ui-dialog-loading">Loading..</span>',
			title: "",
			statusbar: "",
			button: null,
			ok: null,
			cancel: null,
			okValue: "确认",
			cancelValue: "取消",
			cancelDisplay: !0,
			width: "",
			height: "",
			padding: "",
			skin: "",
			quickClose: !1,
			cssUri: "../css/ui-dialog.css",
			innerHTML: '<div i="dialog" class="ui-dialog"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div><table class="ui-dialog-grid"><tr><td i="header" class="ui-dialog-header"><button i="close" class="ui-dialog-close">&#215;</button><div i="title" class="ui-dialog-title"></div></td></tr><tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content"></div></td></tr><tr><td i="footer" class="ui-dialog-footer"><div i="statusbar" class="ui-dialog-statusbar"></div><div i="button" class="ui-dialog-button"></div></td></tr></table></div>'
		}), b("dialog", function(a) {
			var b = a("jquery"),
				c = a("popup"),
				d = a("dialog-config"),
				e = d.cssUri;
			if (e) {
				var f = a[a.toUrl ? "toUrl" : "resolve"];
				f && (e = f(e), e = '<link rel="stylesheet" href="' + e + '" />', b("base")[0] ? b("base").before(e) : b("head").append(e))
			}
			var g = 0,
				h = new Date - 0,
				i = !("minWidth" in b("html")[0].style),
				j = "createTouch" in document && !("onmousemove" in document) || /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
				k = !i && !j,
				l = function(a, c, d) {
					var e = a = a || {};
					("string" == typeof a || 1 === a.nodeType) && (a = {
						content: a,
						fixed: !j
					}), a = b.extend(!0, {}, l.defaults, a), a._ = e;
					var f = a.id = a.id || h + g,
						i = l.get(f);
					return i ? i.focus() : (k || (a.fixed = !1), a.quickClose && (a.modal = !0, e.backdropOpacity || (a.backdropOpacity = 0)), b.isArray(a.button) || (a.button = []), void 0 !== d && (a.cancel = d), a.cancel && a.button.push({
						id: "cancel",
						value: a.cancelValue,
						callback: a.cancel,
						display: a.cancelDisplay
					}), void 0 !== c && (a.ok = c), a.ok && a.button.push({
						id: "ok",
						value: a.okValue,
						callback: a.ok,
						autofocus: !0
					}), l.list[f] = new l.create(a))
				},
				m = function() {};
			m.prototype = c.prototype;
			var n = l.prototype = new m;
			return l.create = function(a) {
				var d = this;
				b.extend(this, new c);
				var e = b(this.node).html(a.innerHTML);
				return this.options = a, this._popup = e, b.each(a, function(a, b) {
					"function" == typeof d[a] ? d[a](b) : d[a] = b
				}), a.zIndex && (c.zIndex = a.zIndex), e.attr({
					"aria-labelledby": this._$("title").attr("id", "title:" + this.id).attr("id"),
					"aria-describedby": this._$("content").attr("id", "content:" + this.id).attr("id")
				}), this._$("close").css("display", this.cancel === !1 ? "none" : "").attr("title", this.cancelValue).on("click", function(a) {
					d._trigger("cancel"), a.preventDefault()
				}), this._$("dialog").addClass(this.skin), this._$("body").css("padding", this.padding), e.on("click", "[data-id]", function(a) {
					var c = b(this);
					c.attr("disabled") || d._trigger(c.data("id")), a.preventDefault()
				}), a.quickClose && b(this.backdrop).on("onmousedown" in document ? "mousedown" : "click", function() {
					return d._trigger("cancel"), !1
				}), this._esc = function(a) {
					var b = a.target,
						e = b.nodeName,
						f = /^input|textarea$/i,
						g = c.current === d,
						h = a.keyCode;
					!g || f.test(e) && "button" !== b.type || 27 === h && d._trigger("cancel")
				}, b(document).on("keydown", this._esc), this.addEventListener("remove", function() {
					b(document).off("keydown", this._esc), delete l.list[this.id]
				}), g++, l.oncreate(this), this
			}, l.create.prototype = n, b.extend(n, {
				content: function(a) {
					return this._$("content").empty("")["object" == typeof a ? "append" : "html"](a), this.reset()
				},
				title: function(a) {
					return this._$("title").text(a), this._$("header")[a ? "show" : "hide"](), this
				},
				width: function(a) {
					return this._$("content").css("width", a), this.reset()
				},
				height: function(a) {
					return this._$("content").css("height", a), this.reset()
				},
				button: function(a) {
					a = a || [];
					var c = this,
						d = "",
						e = 0;
					return this.callbacks = {}, "string" == typeof a ? d = a : b.each(a, function(a, b) {
						b.id = b.id || b.value, c.callbacks[b.id] = b.callback;
						var f = "";
						b.display === !1 ? f = ' style="display:none"' : e++, d += '<button type="button" data-id="' + b.id + '"' + f + (b.disabled ? " disabled" : "") + (b.autofocus ? ' autofocus class="ui-dialog-autofocus"' : "") + ">" + b.value + "</button>"
					}), this._$("footer")[e ? "show" : "hide"](), this._$("button").html(d), this
				},
				statusbar: function(a) {
					return this._$("statusbar").html(a)[a ? "show" : "hide"](), this
				},
				_$: function(a) {
					return this._popup.find("[i=" + a + "]")
				},
				_trigger: function(a) {
					var b = this.callbacks[a];
					return "function" != typeof b || b.call(this) !== !1 ? this.close().remove() : this
				}
			}), l.oncreate = b.noop, l.getCurrent = function() {
				return c.current
			}, l.get = function(a) {
				return void 0 === a ? l.list : l.list[a]
			}, l.list = {}, l.defaults = d, l
		}), b("drag", function(a) {
			var b = a("jquery"),
				c = b(window),
				d = b(document),
				e = "createTouch" in document,
				f = document.documentElement,
				g = !("minWidth" in f.style),
				h = !g && "onlosecapture" in f,
				i = "setCapture" in f,
				j = {
					start: e ? "touchstart" : "mousedown",
					over: e ? "touchmove" : "mousemove",
					end: e ? "touchend" : "mouseup"
				},
				k = e ? function(a) {
					return a.touches || (a = a.originalEvent.touches.item(0)), a
				} : function(a) {
					return a
				},
				l = function() {
					this.start = b.proxy(this.start, this), this.over = b.proxy(this.over, this), this.end = b.proxy(this.end, this), this.onstart = this.onover = this.onend = b.noop
				};
			return l.types = j, l.prototype = {
				start: function(a) {
					return a = this.startFix(a), d.on(j.over, this.over).on(j.end, this.end), this.onstart(a), !1
				},
				over: function(a) {
					return a = this.overFix(a), this.onover(a), !1
				},
				end: function(a) {
					return a = this.endFix(a), d.off(j.over, this.over).off(j.end, this.end), this.onend(a), !1
				},
				startFix: function(a) {
					return a = k(a), this.target = b(a.target), this.selectstart = function() {
						return !1
					}, d.on("selectstart", this.selectstart).on("dblclick", this.end), h ? this.target.on("losecapture", this.end) : c.on("blur", this.end), i && this.target[0].setCapture(), a
				},
				overFix: function(a) {
					return a = k(a)
				},
				endFix: function(a) {
					return a = k(a), d.off("selectstart", this.selectstart).off("dblclick", this.end), h ? this.target.off("losecapture", this.end) : c.off("blur", this.end), i && this.target[0].releaseCapture(), a
				}
			}, l.create = function(a, e) {
				var f, g, h, i, j = b(a),
					k = new l,
					m = l.types.start,
					n = function() {},
					o = a.className.replace(/^\s|\s.*/g, "") + "-drag-start",
					p = {
						onstart: n,
						onover: n,
						onend: n,
						off: function() {
							j.off(m, k.start)
						}
					};
				return k.onstart = function(b) {
					var e = "fixed" === j.css("position"),
						k = d.scrollLeft(),
						l = d.scrollTop(),
						m = j.width(),
						n = j.height();
					f = 0, g = 0, h = e ? c.width() - m + f : d.width() - m, i = e ? c.height() - n + g : d.height() - n;
					var q = j.offset(),
						r = this.startLeft = e ? q.left - k : q.left,
						s = this.startTop = e ? q.top - l : q.top;
					this.clientX = b.clientX, this.clientY = b.clientY, j.addClass(o), p.onstart.call(a, b, r, s)
				}, k.onover = function(b) {
					var c = b.clientX - this.clientX + this.startLeft,
						d = b.clientY - this.clientY + this.startTop,
						e = j[0].style;
					c = Math.max(f, Math.min(h, c)), d = Math.max(g, Math.min(i, d)), e.left = c + "px", e.top = d + "px", p.onover.call(a, b, c, d)
				}, k.onend = function(b) {
					var c = j.position(),
						d = c.left,
						e = c.top;
					j.removeClass(o), p.onend.call(a, b, d, e)
				}, k.off = function() {
					j.off(m, k.start)
				}, e ? k.start(e) : j.on(m, k.start), p
			}, l
		}), b("dialog-plus", function(a) {
			var b = a("jquery"),
				c = a("dialog"),
				d = a("drag");
			return c.oncreate = function(a) {
				var c, e = a.options,
					f = e._,
					g = e.url,
					h = e.oniframeload;
				if (g && (this.padding = e.padding = 0, c = b("<iframe />"),e.scroll == false ? c.attr({scrolling: "no"}) : 1, c.attr({
						src: g,
						name: a.id,
						width: "100%",
						height: "100%",
						allowtransparency: "yes",
						frameborder: "no"
					}).on("load", function() {
						var b;
						try {
							b = c[0].contentWindow.frameElement
						} catch (d) {}
						b && (e.width || a.width(c.contents().width()), e.height || a.height(c.contents().height())), h && h.call(a)
					}), a.addEventListener("beforeremove", function() {
						c.attr("src", "about:blank").remove()
					}, !1), a.content(c[0]), a.iframeNode = c[0]), !(f instanceof Object))
					for (var i = function() {
							a.close().remove()
						}, j = 0; j < frames.length; j++) try {
						if (f instanceof frames[j].Object) {
							b(frames[j]).one("unload", i);
							break
						}
					} catch (k) {}
				b(a.node).on(d.types.start, "[i=title]", function(b) {
					a.follow || (a.focus(), d.create(a.node, b))
				})
			}, c.get = function(a) {
				if (a && a.frameElement) {
					var b, d = a.frameElement,
						e = c.list;
					for (var f in e)
						if (b = e[f], b.node.getElementsByTagName("iframe")[0] === d) return b
				} else if (a) return c.list[a]
			}, c
		}), window.dialog = a("dialog-plus")
	}();
	
	try {
		if(!PPmoney){
			
		}
	}catch(e){
		window.PPmoney = {};
	}
	
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
	            title: data.title || "系统提示",
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
	            title: data.title || "系统提示",
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
	            title: data.title || "系统提示",
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
	            title: data.title || "系统提示",
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
	
	
	module.exports = PPmoney;

/***/ },
/* 10 */
/*!**************************!*\
  !*** ./src/js/common.js ***!
  \**************************/
/***/ function(module, exports) {

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


/***/ },
/* 11 */
/*!**************************!*\
  !*** ./src/css/base.css ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../~/css-loader!./base.css */ 12);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../~/style-loader/addStyles.js */ 6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./base.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./base.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 12 */
/*!*****************************************!*\
  !*** ./~/css-loader!./src/css/base.css ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../~/css-loader/lib/css-base.js */ 5)();
	// imports
	
	
	// module
	exports.push([module.id, "@charset \"utf-8\";\r\n/*reset*/\r\nbody,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,lable{margin:0;padding:0;}\r\nh1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500;}\r\nselect,textarea{font-size:100%;}\r\ntable{border-collapse:collapse;border-spacing:0;}\r\nfieldset,img{border:0;}\r\nimg{vertical-align:top;}\r\nabbr,acronym{border:0;font-variant:normal;}\r\ndel{text-decoration:line-through;}\r\naddress,caption,cite,code,dfn,em,b,i,th,var {font-weight:normal; font-style:normal;} \r\nol,ul{list-style:none;}\r\ncaption,th{text-align:left;}\r\nins{text-decoration:none;}\r\ninput, button, select, textarea {outline:none;}\r\ninput{border:1px solid #dedede;vertical-align:middle;font-family: \"Microsoft YaHei\",\"Helvetica Neue\", Helvetica Neue, Helvetica, Hiragino Sans GB,tahoma,arial,sans-serif;}\r\ninput:-webkit-autofill {-webkit-box-shadow: 0 0 0px 1000px white inset;}\r\ntextarea {resize:none;}\r\na{color:#333;text-decoration:none;outline: none;}\r\na:hover{color: #1194d3;}\r\nbody {color:#333;font:12px/1.5 \"Microsoft YaHei\",\"Helvetica Neue\", Helvetica Neue, Helvetica, Hiragino Sans GB,tahoma,arial,sans-serif}\r\n\r\n\r\n\r\n", ""]);
	
	// exports


/***/ },
/* 13 */
/*!****************************!*\
  !*** ./src/css/common.css ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../~/css-loader!./common.css */ 14);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../~/style-loader/addStyles.js */ 6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./common.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./common.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 14 */
/*!*******************************************!*\
  !*** ./~/css-loader!./src/css/common.css ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../~/css-loader/lib/css-base.js */ 5)();
	// imports
	
	
	// module
	exports.push([module.id, "/*公共模块*/\r\n", ""]);
	
	// exports


/***/ },
/* 15 */
/*!************************!*\
  !*** ./tpl/fileA.html ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<h1>test</h1>\n<img src=\"" + __webpack_require__(/*! ../src/img/image.jpg */ 16) + "\" alt=\"\" data-src=\"../src/img/image.jpg\" id=\"pic\" />\n";

/***/ },
/* 16 */
/*!***************************!*\
  !*** ./src/img/image.jpg ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "dist/img/ec98abae.image.jpg";

/***/ },
/* 17 */
/*!************************!*\
  !*** ./tpl/fileB.html ***!
  \************************/
/***/ function(module, exports) {

	module.exports = "<p>\r\n  this is file B .html ,! test;;;\r\n</p>\r\n";

/***/ },
/* 18 */
/*!************************!*\
  !*** ./src/js/init.js ***!
  \************************/
/***/ function(module, exports) {

	$('#pic').on('click',function(){
	  PPmoney.dialog.confirm({id:'3',content:'333'});
	})


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map