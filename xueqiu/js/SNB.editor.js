define('SNB.editor.js', ["lib/store","SNB.editor.emotion","lib/autoresize","lib/upload","SNB.pdfDialog","lib/ueditor","editor_inline.css.js","editor.jade.js","editor-footer.jade.js"], function (require, exports, module) {  // main 的全屏实现是隐藏除 editor 外的其他部分
  var store = exports.store = require('./lib/store'),
    emotion = require('./SNB.editor.emotion'),
    ss = (function () {
      var supported = (function () {
        var mod = 'modernizr';

        try {
          sessionStorage.setItem(mod, mod);
          sessionStorage.removeItem(mod);

          return true;
        } catch (e) {
          return false;
        }
      }());

      if (!supported) {
        return {set: $.noop, get: $.noop};
      }

      return {
        set: function (key, value) {
          sessionStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key) {
          var value = sessionStorage.getItem(key);

          if (typeof value != 'string') {
            return undefined;
          }

          return JSON.parse(value);
        }
      }
    }()),
    autoresize = exports.autoresize = require('./lib/autoresize'),
    upload = exports.upload = require('./lib/upload'),
    pdfDialog = require('./SNB.pdfDialog'),
    UE = window.UE = require('./lib/ueditor'),
    domUtils = UE.dom.domUtils,
    tap = Textarea.prototype,
    $win = $(window),
    $body = $('body'),
    isFullScreen = function () {
      return SNB.scroll.isEditorMode();
    };

  if (window.SNB) {
    SNB.editor = exports;
    SNB.store = store;
  }

  function listenResize(editor) {
    $win
      .off('resize.fullEditor')
      .on('resize.fullEditor', function () {
        editor.setMinFrameHeight();
      });
  }

  function getAbsoluteCursorPosition(range, $uew) {
    var sl = $win.scrollLeft(),
      st = $win.scrollTop(),
      offset = $uew.find('>iframe').offset(),
      pos = range.getCursorPosition(),
      result = {
        start: {},
        end: {}
      };

    result.start.x = 'number' == typeof pos.start.x ? pos.start.x + offset.left - sl : undefined
    result.start.y = 'number' == typeof pos.start.y ? pos.start.y + offset.top - st : undefined
    result.end.x = 'number' == typeof pos.end.x ? pos.end.x + offset.left - sl : undefined
    result.end.y = 'number' == typeof pos.end.y ? pos.end.y + offset.top - st : undefined

    return result;
  }

  // editor 通用的辅助函数
  var atSuggestion = {};

  function atKeyup(ta) {
    if (!ta || ta.atSelectionchange) {
      return false;
    }

    ta.atSelectionchange = true
    var $uew = ta.$uew
      , isComment = ta.$textarea && ta.$textarea.parent().is('.inputArea')
      , MAX_SNAME_LENGTH = 30
      , $ats = $body.find('#editor-at-suggestion')
      , $atsHint, $atsUl
    if (!$ats.length) {
      $ats = $('<div id="editor-at-suggestion" class="dropdown-menu arrow-up"><div class="hint">请输入</div><ul></ul></div>').hide().appendTo($body)
        .on('click', 'li', function (ev) {
          $(ev.target).siblings().removeClass('selected').end().addClass('selected')
          $ats.data('atSelect')()
        })
        .on('mouseover', 'li', function (ev) {
          $(ev.target).siblings().removeClass('selected').end().addClass('selected')
        })
      $doc.on('click', function () {
        $ats.hide()
      })
    }
    $atsUl = $ats.find('>ul')
    $atsHint = $ats.find('>.hint')

    function atSelect() {
      // 选中某个 at 提示昵称，点击或回车时触发
      var range = getAtRange().range
      range.deleteContents()
        .insertNode(range.document.createTextNode($atsUl.find('.selected').text()))
        .collapse()
      spaceSelect(range)
      $ats.hide()
    }

    function spaceSelect(range) {
      // 判断光标后面是否有空格，没有的话就插入
      var _range = range.cloneRange()
        , i, next, charCode
        , spaceChar = $.browser.msie ? '\u0020' : '\u00a0'
      for (i = range.endOffset; next = range.endContainer.childNodes[i++];) {
        if (next.nodeType === 1) {
          if (next.tagName.match(/span/i) && next.id.match(/^_baidu_bookmark_/)) {
            continue // 跳过 baidu bookmark
          } else if (domUtils.isEmptyNode(next)) {
            continue // skip empty element node
          } else if (next.tagName.match(/span|strong|b/i)) {
            _range.selectNode(next).shrinkBoundary(true)
            next = _range.startContainer.childNodes[0]
            break  // span|strong|b 三种标签选中里面的第一个 text node
          } else {
            break
          }
        } else if (next.nodeType === 3 && !next.nodeValue.length) {
          continue // skip empty text node
        } else {
          break
        }
      }
      charCode = next && next.nodeType === 3 && next.nodeValue.charCodeAt(0)
      if (charCode === 32 || charCode === 160) {
        range.setStart(next, 1).collapse(true) //光标定位到空格后面
      } else {
        range.insertNode(range.document.createTextNode(spaceChar)).collapse() //插入空格
      }
      range.select(true)
    }

    function rr(term, response) {
      // 查询 @ 自动提示
      var stored
      if (term in atSuggestion && atSuggestion[term] instanceof Array) {
        return response(atSuggestion[term])
      } else if ((stored = ss.get('at:' + term))) {
        if ((new Date).valueOf() - stored.updatedAt < 10 * 60 * 1000) {
          atSuggestion[term] = stored.names
          return response(stored.names)
        }
      }
      SNB.get("/users/autocomplete.json", {q: term, count: 8}, function (data) {
        atSuggestion[term] = data.names
        data.names && data.names instanceof Array && ss.set('at:' + term, {
          updatedAt: (new Date).valueOf(), names: data.names
        })
        response(atSuggestion[term])
      })
    }

    function getAtRange() {
      //获取从 @ 符号到光标的 range
      var atsVisible = $ats.is(':visible')
        , range = ta.editor.selection.getRange()
        , lrange, rrange
        , start = range.startContainer
        , startOffset = range.startOffset
        , nstart = 0, nend = 0
        , $sp = $(start.parentNode)
        , text, i, node
      if (start.nodeType != 3) {
        if (start.nodeType == 1 &&
          range.endContainer.nodeType == 1 &&
          startOffset &&
          startOffset == range.endOffset &&
          start.childNodes[startOffset - 1].nodeType == 3
          ) {
          var startTextNode = start.childNodes[startOffset - 1]
          range.setStart(startTextNode, startTextNode.nodeValue.length).collapse(true)
          start = range.startContainer
          startOffset = range.startOffset
        } else {
          return atsVisible && $ats.hide()
        }
      }
      var ca = range.getCommonAncestor()
      if (ca.nodeType != 3 && ca != start.parentNode) return atsVisible && $ats.hide()

      function trim(text) {
        return text.replace(/^[\s\u0020\u00a0]+|[\s\u0020\u00a0]+/g, '')
      }

      //当前选中的文字
      var text = $(range.cloneContents()).text() || ''
      if (text && text.match(/[^a-zA-Z0-9_\-\u4e00-\u9fa5\u200B]/)) return atsVisible && $ats.hide()

      //向前查找到 @ 符号
      var i, ltext, lnode, lindex, lmatch
      i = domUtils.getNodeIndex(start)
      ltext = start.nodeValue.substring(0, startOffset)
      lindex = ltext.lastIndexOf('@')
      lmatch = ltext.match(/[^@a-zA-Z0-9_\-\u4e00-\u9fa5\u200B][a-zA-Z0-9_\-\u4e00-\u9fa5\u200B]*$/)
      if (lmatch && lindex < lmatch.index) return atsVisible && $ats.hide()
      if (lindex >= 0) {
        range.setStart(start, lindex + 1)
        ltext = ltext.substring(lindex + 1)
      } else {
        while (--i >= 0 && ltext.length <= 30) {
          lnode = start.parentNode.childNodes[i]
          if (lnode.nodeType != 3) {
            if (lnode.nodeType == 4) continue
            else break
          }
          ltext = lnode.nodeValue + ltext
          lindex = ltext.lastIndexOf('@')
          lmatch = ltext.match(/[^@a-zA-Z0-9_\-\u4e00-\u9fa5\u200B][a-zA-Z0-9_\-\u4e00-\u9fa5\u200B]*$/)
          if (lmatch && lindex < lmatch.index + 1) return atsVisible && $ats.hide()
          if (lindex >= 0) {
            range.setStart(lnode, lindex + 1)
            ltext = ltext.substring(lindex + 1)
            break
          }
        }
        if (lindex < 0) return atsVisible && $ats.hide()
      }
      ltext = ltext || ''
      text = (ltext + text).replace(/\u200B/g, '')
      if (text.length > 30) return atsVisible && $ats.hide()
      return {
        success: true, range: range, text: text, start: ltext.length, end: text.length
      }
    }

    var _atSupress

    function checkAtSign() {
      if (_atSupress) { //按上下键选择昵称时会触发 selectionchange，忽略这个事件
        return _atSupress = false
      }

      var _atRange = getAtRange()
      if (!_atRange.success) return
      var range = _atRange.range
        , text = _atRange.text
        , selStart = _atRange.start
        , selEnd = _atRange.end

      range.deleteContents()
      //var pos = getAbsoluteCursorPosition(range, $uew)
      var startNode = range.document.createElement('span')
        , uewOffset = $uew.offset()
      startNode.style.cssText = 'width:0px;overflow:hidden;margin:0;padding:0;border:0;'
      startNode.appendChild(range.document.createTextNode(text ? text : '\u200B'))
      range.insertNode(startNode)
      pos = domUtils.getXY(startNode);
      pos.x += uewOffset.left - 10
      pos.y -= $uew.find('iframe').contents().scrollTop()
      if ($.browser.msie) {
        pos.y += uewOffset.top + (isComment ? 23 : isFullScreen() ? 22 : 30)
      } else {
        pos.y += uewOffset.top + (isComment ? 19 : isFullScreen() ? 21 : 27)
        if ($.browser.mozilla) pos.y += 2
      }
      //return range.select(true)
      range.deleteContents()

      if (text) {
        var textNode = range.document.createTextNode(text)
        range
          .insertNode(textNode)
          .setStart(textNode, selStart)
          .setEnd(textNode, selEnd)
          .select(true)
      }

      $atsHint.text(text ? '选择想@的人或敲空格完成输入' : '输入昵称或选择经常@的人')
      $atsUl
        .empty()
        .append('<li class="loading" style="width:136px;height:45px;background-color:#fff;cursor:default;"></li>')
      $ats
        .css({
          left: pos.x, top: $ats.hasClass('arrow-down') ? pos.y - $ats.height() - 40 : pos.y, opacity: 1
        })
        .show()
        .data('atSelect', atSelect)
      var $dialog, zIndex
      if (($dialog = $('.ui-dialog:visible', $body)).length
        && (zIndex = $dialog.css('z-index'))
        && (zIndex = parseInt(zIndex, 10)))
        $ats.css('z-index', zIndex + 10)

      rr(text, function (names) {
        if (!names.length) names = [text]
        var lis = ''
          , i = -1
        _.each(names, function (name) {
          lis += '<li' + (++i ? '' : ' class="selected"') + '>' + name + '</li>'
        })
        $atsUl
          .empty()
          .html(lis)
        $ats
          .show()
        var ah = $ats.height()
          , ab = pos.y + ah
          , wh = $win.height()
          , st = $win.scrollTop()
          , wb = wh + st
        if (ab > wb && !isFullScreen()) $('html,body').animate({scrollTop: Math.min(ab - wh + 10, pos.y - 72)}, 200)
        else if (ab > wb && pos.y - ah - 20 > st) $ats.css({top: pos.y - ah - 40}).removeClass('arrow-up').addClass('arrow-down')
        else $ats.css({top: pos.y}).removeClass('arrow-down').addClass('arrow-up')
      })
    }

    ta.editor.addListener('selectionchange', checkAtSign)
    ta.editor.addListener('keydown', function (type, ev) {
      var keyCode = ev.keyCode || ev.which
        , range, start, end, br, $prev, $next
      if (keyCode == 27) {// esc
        if ($ats.is(':visible')) {
          _atSupress = true
          $ats.hide()
        }
      } else if (keyCode == 229) {// 输入法候选词未确定状态
        if ($ats.is(':visible')) {
          _atSupress = true
        }
      } else if (keyCode == 38) {// up
        if ($ats.is(':visible')) {
          _atSupress = true
          ev.preventDefault ? ev.preventDefault() : ( ev.returnValue = false);
          $prev = $('.selected', $ats).prev()
          if ($prev.length) {
            $('li', $ats).removeClass('selected')
            $prev.addClass('selected')
          } else {
            $('li', $ats).removeClass('selected').eq(-1).addClass('selected')
          }
        } else {
          scVisible(ta)
        }
      } else if (keyCode == 40) {// down
        if ($ats.is(':visible')) {
          _atSupress = true
          ev.preventDefault ? ev.preventDefault() : ( ev.returnValue = false);
          $next = $('.selected', $ats).next()
          if ($next.length) {
            $('li', $ats).removeClass('selected')
            $next.addClass('selected')
          } else {
            $('li', $ats).removeClass('selected').eq(0).addClass('selected')
          }
        }
      } else if (keyCode == 13) {//回车
        ev.preventDefault ? ev.preventDefault() : ( ev.returnValue = false);
        if (ev.ctrlKey) return; // ctrl + enter 提交，这里不添加换行或做其他操作了
        range = ta.editor.selection.getRange()

        if ($ats.is(':visible')) {
          atSelect()
        } else if (!range.collapsed) {
          range.deleteContents();
          start = range.startContainer;
          if (start.nodeType == 1 && (start = start.childNodes[range.startOffset])) {
            while (start.nodeType == 1) {
              if (UE.dom.dtd.$empty[start.tagName]) {
                range.setStartBefore(start).setCursor();
                return false;
              }
              if (!start.firstChild) {
                br = range.document.createElement('br');
                start.appendChild(br);
                range.setStart(start, 0).setCursor();
                return false;
              }
              start = start.firstChild
            }
            if (start === range.startContainer.childNodes[range.startOffset]) {
              br = range.document.createElement('br');
              range.insertNode(br).setCursor();

            } else {
              range.setStart(start, 0).setCursor();
            }
          } else {
            br = range.document.createElement('br');
            range.insertNode(br).setStartAfter(br).setCursor();
          }
        } else {
          br = range.document.createElement('br');
          range.insertNode(br);
          var parent = br.parentNode;
          if (parent.lastChild === br) {
            br.parentNode.insertBefore(br.cloneNode(true), br);
            range.setStartBefore(br)
          } else {
            range.setStartAfter(br)
          }
          range.setCursor();
        }
      }
    })
    return function (type, ev) {
      var keyCode = ev.keyCode || ev.which
      if ((keyCode >= 49 && keyCode <= 57) || keyCode == 32 || keyCode == 13) checkAtSign()
      if (keyCode == 13) {
        setTimeout(function () {
          ta.editor.selection.getRange().scrollToView(ta.editor.autoHeightEnabled, ta.editor.autoHeightEnabled ? domUtils.getXY(ta.editor.iframe).y : 0);
        }, 50)
      }
    }
  }

  // editor 通用的辅助函数
  function stockKeyup(ta) {
    return function (ev) {
      var $box = ta.editor ? ta.$uew : ta.$textarea
        , $editor = $('body.editor-mode>.editor, body.main-editor-mode #main-editor>.editor')
        , $toolbar = $editor.length && $('.editor-toolbar', $editor)
        , editor = $toolbar && $editor.parent().data('editor')
        , evType = ev.type
        , pos, start, aleft, range, value;
      if (evType === 'keyup') {
        if (ev.keyCode !== 52) return
        if (ta.editor) {
          range = ta.editor.selection.getRange()
          index = range.startOffset
          if (!range.collapsed) return
          if (!index) return
          if (range.startContainer.nodeType !== 3) return
          value = $.text(range.startContainer)
        } else {
          value = ta.textarea.value
          index = ta.getSelectionStart()
        }
        if (!value || !value.match(/\$$/)) return
      }
      if ($toolbar && evType === 'keyup') {
        start = getAbsoluteCursorPosition(range, ta.$uew, true).start
        aleft = ta.$uew.find('>iframe').offset().left - $win.scrollLeft()
        pos = [ start.x + 10
          , start.y - 46]
      } else if ($toolbar) {
        pos = [ window.innerWidth / 2 - 120 , $toolbar.hasClass('fixed') ? 0 : $toolbar.offset().top - $win.scrollTop()]
      } else {
        pos = [ $box.offset().left - $win.scrollLeft()
          , $box.offset().top - $win.scrollTop() + $box.height()];
      }
      if(ta.editor){ //插入股票数提示
        var oldText=ta.editor.iframe.contentDocument.firstElementChild.innerText;
        if(getStockCode(oldText).length>=3){
          SNB.Util.failDialog('帖子插入股票太多（限制3只）', 300, null, 2000);
          return ;
        }
      }else{
        ta.upgrade();
      }
      SNB.Util.insertStock(pos, function (stock) {
        ta.insert((evType === 'keyup' ? '' : '$') + stock.name + "(" + stock.value + ")$ ");
        if (ta.$textarea && ta.$textarea.hasClass('not-init')) {
          ta.$textarea.trigger('mouseup');
          ta.$textarea.removeClass('not-init');
        }
      });
    }
  }

  function getStockCode(str) {
    str = str || '';
    var arr = str.match(/\$[^\$]+\$/g) || [];
    var ret = [];
    $.each(arr, function (index, item) {
      item = item || '';
      var arr = item.match(/\((.*)\)/);
      if ($.isArray(arr) && arr[1]) {
        ret.push(arr[1]);
      }
    });
    return ret;
  }

  var insertedImgEditable = ' unselectable="on" contenteditable="false" ';

  if ($.browser.webkit) {
    insertedImgEditable = '';
  } else if ($.browser.mozilla) {
    insertedImgEditable = 'contenteditable="false"';
  } else if ($.browser.msie) {
    if (parseInt($.browser.version, 10) < 9) {
      insertedImgEditable = '';
    } else {
      insertedImgEditable = 'unselectable="on"';
    }
  }

  function insertImage(editor, img, callback) {
    var height = '',
      width = '';

    if (img.width) {
      if (img.width > 480) {
        width = ' width="480" ';

        if (img.height) {
          height = ' height="' + Math.round(img.height * 480 / img.width) + '" ';
        }
      } else {
        width = ' width="' + img.width + '" ';

        if (img.height) {
          height = ' height="' + img.height + '" ';
        }
      }
    }

    var uri = img.url ? img.url + '/' + img.filename + '!custom.jpg' : SNB.domain.upyun + '/' + img.filename + '!custom.jpg';
    var imgStr = '<p>\u200B<img class="ke_img" src="' + uri + '" ' + width + height + insertedImgEditable + '/></p>';

    setTimeout(function () {
      editor.execCommand("insertHtml", imgStr);

      editor.autoHeightEnabled && setTimeout(function () {
        editor.adjustHeight();
      }, 100);
    }, 0)

    callback && callback();
  }

  tap.uploadStatusUploading = function (hint) {
    var $root = this.$root;

    if (!$root || !$root.length) {
      $root = this.$uew.closest('.editor')
    }

    var $ticon = $root.find('.editor-toolbar .upload'),
      $fhint = $root.find('.editor-footer .upload_status');

    $fhint.html(hint || '图片正在上传中，请稍候... <span class="progress"></span>');
    $ticon.addClass('uploading');
    $fhint.html((hint || '上传中 <span class="progress"></span> ') + '<img src="' + SNB.domain['static'] + '/images/loading_020.gif" title=""/>');
  }

  tap.uploadStatusClear = function () {
    var $root = this.$root;

    if (!$root || !$root.length) {
      $root = this.$uew.closest('.editor');
    }

    var $ticon = $root.find('.editor-toolbar .upload'),
      $fhint = $root.find('.editor-footer .upload_status');

    $ticon.removeClass('uploading');
    $fhint.html('');
  }

  tap.uploadStatus = function () {
    var $root = this.$root;

    if (!$root || !$root.length) {
      $root = this.$uew.closest('.editor')
    }

    var $fhint = $root.find('.editor-footer .upload_status');

    return !!$fhint.text();
  }

  function uploadBtn(ta, $upload) {
//    action: SNB.domain.host + '/service/upload_photo',
//    flashAction: SNB.domain.base + '/photo/upload.json?access_token=' + $.cookie('xq_a_token'),
// 暂时把 api.xueqiu.com 换成 xueqiu.com 以解决跨域问题。
    // 似乎不传flashAction可以直接屏蔽掉 flash 上传选项。
    var $btn = upload($upload, {
      action: '/service/upload_photo',
      type: ['gif', 'png', 'jpg', 'jpeg'],
      accept: 'image/*',
      sizeLimit: 5 * 1024,
      flashSizeLimit: 5 * 1024,
      timeout: 30000,
      flashTimeout: 60000,
      queueSizeLimit: 10
      //, disableFlash: $.browser.webkit
    });

    $btn.on('upload.fail upload.done upload.success', function () {
      ta.uploadStatusClear();
    });

    $btn.on('upload.fail.ret upload.fail.unknown', function (ev, ret) {
      SNB.Util.failDialog('上传失败，请重试或换张图片试试', 300, null, 2000);
    });

    $btn.on('upload.fail.timeout', function () {
      SNB.Util.failDialog('上传超时，请确保图片小于5M', 300, null, 2000);
    });

    $btn.on('upload.fail.queue', function () {
      SNB.Util.failDialog('一次至多可以选取上传10张图片', 300, null, 2000);
    });

    $btn.on('upload.fail.limit', function () {
      SNB.Util.failDialog("请上传小于5M的图片", 240);
    });

    $btn.on('upload.fail.type', function () {
      SNB.Util.failDialog("只支持PNG，JPG，GIF格式图片", 240);
    });

    $btn.on('upload.success', function (ev, ret) {
      ta.insertImage(ret);
    });

    $btn.on('upload.started', function () {
      ta.uploadStatusUploading();
    });
  }

  var ctbk = exports.ctbk = function (editor) {
    var bk = editor.selection.getRange().createBookmark(),
      content = editor.getContent();

    return { content: content, bk: {
      id: true, start: bk.start.id, end: bk.end && bk.end.id
    }};
  };

  var setCtbk = exports.setCtbk = function (editor, cb) {
    editor.setContent(cb.content);
    setTimeout(function () {
      editor.selection.getRange().moveToBookmark(cb.bk).select()
    }, 0);
  };

  function getSelectionStart(textarea) {
    if (typeof textarea.selectionStart === "number") {
      return textarea.selectionStart;
    } else if (document.selection) {
      var r = document.selection.createRange();
      if (!r) return 0;

      var re = textarea.createTextRange()
        , rc = re.duplicate()
      re.moveToBookmark(r.getBookmark())
      rc.setEndPoint('EndToStart', re)

      return rc.text.length
    }

    return 0;
  }

  tap.getSelectionStart = function () {
    return getSelectionStart(this.textarea)
  }

  function getSelectionEnd(textarea) {
    if (textarea.selectionEnd) {
      return textarea.selectionEnd;
    } else if (document.selection) {
      var r = document.selection.createRange();
      if (!r) return 0;

      var re = textarea.createTextRange()
        , rc = re.duplicate()
      re.moveToBookmark(r.getBookmark())
      rc.setEndPoint('EndToEnd', re)

      return rc.text.length
    }

    return 0;
  }

  tap.getSelectionEnd = function () {
    return getSelectionEnd(this.textarea)
  }

  tap.insertString = function (str) {
    if (!str) {
      return
    }
    var textarea = this.textarea
      , $textarea = this.$textarea
      , start = $textarea.data("start") || textarea.selectionStart || 0
      , end = $textarea.data("end") || textarea.selectionEnd
    if (end === undefined || end < start) {
      end = start;
    }

    if ('function' === typeof str) {
      str = str(textarea.value.substring(start, end))
    }

    var newstart = start + str.length;
    $textarea.val(textarea.value.substring(0, start) + str + textarea.value.substring(end));

    if (typeof textarea.selectionStart === "number") {
      $textarea.get(0).selectionStart = newstart;
      $textarea.get(0).selectionEnd = newstart;
      $textarea.focus();
    } else {
      $textarea.data("start", newstart);
      $textarea.data("end", newstart);
      $textarea.focus();
      this.setSelection(newstart, 0);
    }
  }

  function setSelection(textarea, startIndex, len) {
    if (textarea.setSelectionRange) {
      textarea.setSelectionRange(startIndex, startIndex + len);
    } else if (document.selection) {
      var range = textarea.createTextRange();
      range.collapse(true);
      range.moveStart('character', startIndex);
      range.moveEnd('character', len);
      range.select();
    } else {
      textarea.selectionStart = startIndex;
      textarea.selectionEnd = startIndex + len;
    }
  }

  tap.setSelection = function (startIndex, len) {
    return setSelection(this.textarea, startIndex, len)
  }

  tap.setSelection200B = function () {
    var start, end, content = this.textarea.value
    if (-1 != (start = content.indexOf('\u200B'))) {
      if (-1 != (end = content.indexOf('\u200B', start + 1))) {
        end--
      } else {
        end = start
      }
    } else {
      start = end = 0
    }
    this.reset(content.replace(/\u200B/g, ''))
    this.setSelection(start, end - start)
  }

  tap.getContent = function () {
    return this.editor
      ? this.editor.getContent()
      : SNB.Util.htmlizeContent(this.textarea.value)
  }

  tap.hasContent = function () {
    var $el = $("<div>" + this.getContent() + "</div>")
    if ($.trim($el.text()).length || $el.find('img').length) {
      return true
    } else {
      return false
    }
  }

  tap.insert = function (str) {
    var r = this.editor
      ? this.editor.execCommand("insertHtml", str)
      : this.insertString(str);
    if (this.options && this.options.insertFunc) {
      this.options.insertFunc(tap, str);
    }
    this.editor.focus();
    return r;
  }

  tap.reset = function (str, focus, focusStart) {
    if (this.editor) {
      this.editor.setContent(str || domUtils.fillChar)
      if (focus) {
        this.editor.selection.getRange()
          .selectNodeContents(this.editor.document.body)
          .shrinkBoundary()
          .collapse(focusStart)
          .select()
      }
    } else {
      this.textarea.value = str || '';
      this.$textarea.height(70);
      if (focus) {
        this.$textarea.focus();
        this.setSelection(focusStart ? 0 : (str || '').length, 0);
      }
    }
  };

  tap.setBookmark200B = function () {
    // 记录 textarea 的 selection
    this.insertString(function (content) {
      return '\u200B' + content + (content && '\u200B')
    })
  }

  tap.ctbk = function () {
    var bk, value, content
      , editor = this.editor
      , textarea = this.textarea
      , end

    if (editor) {
      return ctbk(editor)
    } else {
      value = textarea.value
      this.setBookmark200B()
      content = textarea.value
      textarea.value = value

      if (~content.indexOf('\u200B')) {
        content = content
          .replace('\u200B', '<span id="_baidu_bookmark_cursor_start_">\uFEFF</span>')
          .replace('\u200B', '<span id="_baidu_bookmark_cursor_end_">\uFEFF</span>')
        if (~content.indexOf('<span id="_baidu_bookmark_cursor_end_">\uFEFF</span>'))
          end = '_baidu_bookmark_cursor_end_'
      } else {
        content += '<span id="_baidu_bookmark_cursor_start_">\uFEFF</span>'
      }

      content = SNB.Util.htmlizeContent(content)
      return { content: content, bk: { id: true, start: '_baidu_bookmark_cursor_start_', end: end } }
    }
  }

  tap.insertImage = function (img, cb) {
    var ta = this;

    if (!ta.editor) {
      ta.upgrade(function () {
        insertImage(ta.editor, img, cb);
      });
    } else {
      insertImage(ta.editor, img, cb);
    }
  }

  //三种状态：textarea embed fullscreen
  function Textarea($textarea, options) {
    if (!(this instanceof Textarea)) {
      return new Textarea($textarea, options);
    }

    if ('string' === typeof $textarea) {
      return new Textarea($($textarea), options);
    }
    if ($textarea.data('ta')) {
      return $textarea.data('ta');
    }

    var ta = this;

    // 只处理第一个
    $textarea = $textarea.eq(0);
    ta.$textarea = $textarea;
    ta.textarea = $textarea[0];

    $textarea.data('ta', ta);

    //针对IE记录光标位置
    if ($.browser.msie) {
      $textarea.on('keyup keydown mouseup', function () {
        try {
          $(this)
            .data("start", ta.getSelectionStart())
            .data("end", ta.getSelectionEnd())
        } catch (e) {
        }
      });
    }

    $textarea
      .on('paste', function () {
        setTimeout(function () {
          var value = ta.textarea.value;
          if (~value.indexOf('\uF0A7') || ~value.indexOf('\uF020')) {
            ta.setBookmark200B();
            //pdf 粘贴过来的非法字符
            ta.textarea.value = ta.textarea.value.replace(/\uF0A7|\uF020/g, '');
            ta.setSelection200B();
          }
        }, 0);
      });

    options = ta.options = {
      $emotion: options && options.$emotion,
      $stock: options && options.$stock,
      $upload: options && options.$upload,
      $pdf: options && options.$pdf,
      ctrlReturn: options && options.ctrlReturn || false,
      submitFunc: options && options.submitFunc || function () {
      },
      insertFunc: options && options.insertFunc || function () {
      },//插入表情或者股票代码的时候调用此方法
      autoResize: options && options.autoResize || false,
      content: options && options.content || ''
    };

    // ctrl + enter submit
    options.ctrlReturn && (function () {
      ta.$textarea.keydown(function (ev) {
        if (ev.ctrlKey && ev.keyCode === 13) {
          options.submitFunc();

          return false;
        }
      })
    }());

    if (options.$emotion && options.$emotion.length) {
      emotion(ta, options.$emotion);
    }

    if (options.$stock && options.$stock.length) {
      ta.stockKeyup = stockKeyup(ta);
      ta.$textarea.bind("keyup", ta.stockKeyup);
      options.$stock.on('click', ta.stockKeyup);
    }

    // upload image
    if (options.$upload && options.$upload.length) {
      uploadBtn(ta, options.$upload);
    }

    if (options.$pdf) {
      options.$pdf.on('click', pdfDialog);
    }

    ta.$textarea.val(options.content);

    options.focus && ta.$textarea.focus();

    if (options.autoResize) {
      ta.$textarea.css('min-height', options.autoResize);
      autoresize(ta.$textarea);
    }
  }

  var init = exports.init = function (wrapper, options) {
    var $wrapper = $(wrapper);

    $wrapper.show();

    var ta = exports.textarea($('textarea', $wrapper), options || {
      $emotion: $('.emotion', $wrapper),
      $stock: $('.stock', $wrapper),
      $upload: $('.upload', $wrapper)
    });

    ta.$root = $wrapper;
    $wrapper.data('ta', ta);

    return ta;
  };

  exports.textarea = function ($textarea, options) {
    var ta = $textarea.data('ta');

    if (!ta) {
      ta = new Textarea($textarea, options);
    }

    return ta;
  }

  var upimgid = 0;

  var editor = exports.editor = function (height, content, wrapper, options, callback) {
    height = height || 70
    if ('function' === typeof options) {
      callback = options
      options = {}
    }
    UE.Editor.prototype.setMinFrameHeight = function (height) {
      var wh = $win.height()
      if (!height) height = (wh > 400 ? wh - 177 : 310)
      if (UE.browser.gecko) height -= 1 // 不知道为毛 firefox 会多一像素
      this.options.minFrameHeight = height
      this.fireEvent('contentchange')
    }
    var cssv = SNB.cssVersion && SNB.cssVersion['editor.css']
      , cssUrl = cssv ? '/style/editor-' + cssv + '.css' : '/style/editor.css?v=' + (new Date).getTime()
    options = {
      minFrameHeight: height, pasteplain: true, autoHeightEnabled: false === options.autoheight ? false : true, enterTag: 'br', initialStyle: require('./editor_inline.css.js') + options.style, iframeCssUrl: false
    }
    if (content) {
      if (/\r|\n/.test(content) && !~content.indexOf('<p>')) {
        content = textToHtml(content)
      }
      options.initialContent = content
    }
    var editor = new UE.Editor(options);
    editor.UE = UE
    editor.addListener('beforepaste', function (ev, obj) {
      obj.html = obj.html.replace(/<(p|li|div|tr|td) [^>]*/gi, function (_, tag) {
        return '<' + tag
      })
      obj.html = SNB.Util.cleanContent(obj.html, false, false, true)
      var pasted = pasteImages(editor, obj.html, true)
      obj.html = pasted.html
      if (pasted.local) SNB.Util.failDialog('本地图片请手动上传', 200, null, 3000)
    })
    wrapper && editor.render(wrapper)
    callback && callback(editor)
  };

  var pasteImages = exports.pasteImages = function (editor, html, pasted) {
    console.log('=========== paste images =============')
    var upobj = [],
      ret = {
        // 返回对象
        // html: 处理过的 html
        // upload: 是否有需要上传的图片
        // local: 是否包含本地图片
      };

    ret.html = html.replace(/(<br\s*\/?>)?<img([^>]+)>(<br\s*\/?>)?/gi, function (all, brbefore, attrs, brafter) {
      //需要过滤掉一些图片，vip 和 头像
      var src = attrs.match(/src=["']([^"'\s]+)[\s"']/);

      if (!src) {
        return '';
      }

      src = src[1];

      if ($.browser.isMobile || editor.ta && !editor.ta.$uew.parent().is('.editor, .editor-wrapper')) {
        return '';
      }

      var matched;

      matched = src.match(/(\/images\/vipicon_[0-9].png|\d+-\d{2}x\d{2}\.(gif|jpg))(\?.*)?$/i);

      if (matched) {
        return '';
      }

      matched = src.match(/\/images\/face\/(\d{2}[^\.]+)\.png(\?.*)?$/i);

      if (matched) {
        return SNB.Util.BBCODE_TO_TEXT[matched[1]] || all;
      }

//      matched = src.match(/(http:\/\/xqimg\.b0\.upaiyun\.com\/.+?)(!|%21).*?$/i);
//			matched = src.match(/(http:\/\/xqimg\.u\.qiniudn\.com\/.+?)(!|%21).*?$/i);
      matched = src.match(/(http:\/\/xqimg\.imedao\.com\/.+?)(!|%21).*?$/i) || src.match(/(http:\/\/u\.xqimg\.imedao\.com\/.+?)(!|%21).*?$/i);

      if (matched) {
        src = matched[1] + '!custom.jpg';

        return (pasted || brbefore ? '<br>\u200B' : '') + '<img class="ke_img" src="' + src + '" ' + insertedImgEditable + ' />' + (pasted || brafter ? '<br>\u200B' : '')
      }

      //需要抓取的图片
      var id = 'ke_img_paste_' + (++upimgid).toString(10),
        duplicated,
        width,
        height,
        wl;

      //本地图片
      if (!src.match(/https?:\/\//i)) {
        ret.local = true;
        return '';
      }

      if ((width = attrs.match(/width=["']?(\d+)/i))) {
        width = parseInt(width[1], 10);

        if (width && width < 80) {
          wl = true;
        }
      }

      if (wl && (height = attrs.match(/height=["']?(\d+)/i))) {
        height = parseInt(height[1], 10);

        // 在这里就可以判断长宽都小于 80 的就直接干掉
        if (height && height < 80) {
          return ''
        }
      }
      _.each(upobj, function (id_src) {
        if (id_src[1] == src) {
          upobj.push([id, id_src[0]]);
          // 重复图片不重复上传
          duplicated = true
        }
      });

      duplicated || upobj.push([id, src]);

      return (pasted || brbefore ? '<br>\u200B' : '') + '<img id="' + id + '" class="ke_img_paste" style="max-width: 480px;" src="' + src + '" ' + insertedImgEditable + ' />' + ($.browser.msie ? '&nbsp;' : '') + (pasted || brafter ? '<br>\u200B' : '');
    });

    if (upobj.length) {
      ret.upload = true;
      uploadImages(editor, upobj);
    }

    return ret;
  };

  var uploadImages = exports.uploadImages = function (editor, upobj) {
    editor.uploadImagesCount = editor.uploadImagesCount || 0;

    var ta = editor.ta,
      same = {},
      imgurls = [],
      _imgurls,
      pUpload = [];

    _.map(upobj, function (id_src) {
      var obj = {
        id: id_src[0]
      };

      if (id_src[1].indexOf('ke_img_paste_') > -1) {
        if (same[id_src[1]]) {
          same[id_src[1]].push(id_src[0]);
        } else {
          same[id_src[1]] = [id_src[0]];
        }
      } else {
        obj.src = id_src[1];
        imgurls.push(obj);
      }
    });

    _.map(imgurls, function (obj) {
      if (same[obj.id]) {
        obj.same = same[obj.id];
      }
    });

    while ((_imgurls = imgurls.splice(0, 10)).length) {
      console.log('_imgurls ', _imgurls)
      pUpload.push(_uploadImages(editor, _imgurls));
    }

    if (!pUpload.length) {
      return false;
    }

    ta.uploadStatusUploading('正在上传图片，请稍候');
    editor.uploadImagesCount++;

    $.when.apply($, pUpload).done(function () {
      var args = Array.prototype.slice.call(arguments, 0),
        min = Math.min.apply(Math, args),
        max = Math.max.apply(Math, args);

      --editor.uploadImagesCount || ta.uploadStatusClear();

      if (max) {
        SNB.Util.failDialog((min > 1 ? '' : '部分') + "图片未成功上传，请尝试手动上传。", 300, null, 3000);
      }
    })
  };

  function _uploadImages(editor, imgurls) {
    var $doc = $(editor.document),
      d = $.Deferred();

    $.ajax({
      url: '/service/pasted_images',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(imgurls),
      dataType: 'json',
      timeout: 70000,
      complete: function (xhr) {
        if (xhr.status != 200) {
          return d.resolve(2);
        }

        var error,
          succ,
          result;

        try {
          result = $.parseJSON(xhr.responseText);
        } catch (e) {
        }

        if (!result || !$.isPlainObject(result)) {
          return d.resolve(2);
        }

        var range,
          bk;

        if ($.browser.msie) {
          range = editor.selection.getRange();
          bk = range.createBookmark();
        }

        _.each(result, function (obj, id) {
          var $el = $doc.find('#' + id),
            width,
            height;

          if (obj && obj.filename && obj.code != -1) {
            width = parseInt(obj.width, 10);
            height = parseInt(obj.height, 10);

            if (width < 80 && height < 80) {
              $el.remove();

              if (obj.same) {
                _.each(obj.same, function (id) {
                  $doc.find('#' + id).remove();
                });
              }
            } else {
              $el
                .attr({
                  src: obj.src,
                  'class': 'ke_img'
                })
                .removeAttr('width')
                .removeAttr('height')
                .removeAttr('id');

              if (obj.same) {
                _.each(obj.same, function (id) {
                  var $el = $doc.find('#' + id);

                  $el
                    .attr({
                      src: obj.src,
                      'class': 'ke_img'
                    })
                    .removeAttr('width')
                    .removeAttr('height')
                    .removeAttr('id')
                })
              }

              succ = true;
            }
          } else {
            $el.remove();
            error = true;
          }
        });

        if ($.browser.msie) {
          range.moveToBookmark(bk)
        }

        d.resolve(error ? (succ ? 1 : 2) : 0);
      },
      error: function () {
        _.map(imgurls, function (obj) {
          $doc
            .find('#' + obj.id)
            .remove();

          if (obj.same) {
            _.each(obj.same, function (id) {
              $doc
                .find('#' + id)
                .remove();
            });
          }
        });

        d.resolve(2);
      }
    });

    return d.promise();
  }

  function scVisible(ta) {
    if (!ta.editor.autoHeightEnabled) return setTimeout(function () {
      ta.editor.selection.getRange().scrollToView(false, 0)
    }, 50)

    setTimeout(function () {
      var range = ta.editor.selection.getRange()
        , y = range.collapsed
          ? range.getCursorPosition().start.y
          : 0
        , st = y && $win.scrollTop()
        , wh = y && $win.height()
        , hf = ta.$uew.parent().is('.inputArea') ? 50 : isFullScreen() ? 40 : 44
        , ut = ta.$uew.offset().top
      if (y && (y + ut - st < hf)) {
        $win.scrollTop(y + ut - hf)
      } else if (isFullScreen() && y && y + 80 - st > wh - 100) {
        $win.scrollTop(y - wh + 181)
      }
    }, 50)
  }

  tap.upgrade = function (cb, callback) {
    if (this.editor) {
      return false;
    }

    if ('function' === typeof cb) {
      callback = cb;
      cb = false;
    }

    if (!cb && cb !== false) {
      cb = this.ctbk();
    }

    var ta = this,
      $textarea = ta.$textarea,
      $wrapper = $textarea.siblings('.ueditor-wrapper'),
      style = '';

    if (!$wrapper.length) {
      $wrapper = $('<div class="ueditor-wrapper" />').insertAfter($textarea);
      style += 'body,input,label,select,option,textarea,button,fieldset,legend{font:' + $textarea.css('font') + ';}';
    }

    ta.$uew = ta.$ueditorWrapper = $wrapper;

    cb = cb || {};

    $textarea.attr('readonly', true);

    editor(cb.height || 70, domUtils.fillChar, false, {style: style, autoheight: cb.autoheight}, function (editor) {
      ta.editor = editor;
      ta.$root.data('editor', editor);
      editor.ta = ta;
      $textarea.hide();
      $wrapper.show();

      editor.addListener('ready', function () {
        ta.stockKeyup && editor.addListener('keyup', function (type, ev) {
          ta.stockKeyup(ev);
        });
        editor.addListener('keyup', atKeyup(ta));
        editor.addListener('keyup', _.bind(ta.$uew.removeClass, ta.$uew, 'error'));

        // ctrl + enter post
        ta.options.ctrlReturn && editor.addListener('keydown', function (type, ev) {
          if (ev.ctrlKey && ev.keyCode === 13) {
            ta.options.submitFunc();

            setTimeout(function () {
              $('body>.temp>.at-user-input')
                .trigger('blur')
                .remove();
            }, 200);

            return false;
          }
        });

        //setTimeout(function() {
        editor.setContent(cb.content || domUtils.fillChar);
        cb.bk && editor.selection.getRange().moveToBookmark(cb.bk).select();
        editor.focus();
        callback && callback(editor);
        //}, 0)
      });

      editor.render($wrapper[0])
    });
  };

  tap.fullscreen = function () {
    var ta = this
    fullEditor(ta.$root).then(function (editor) {
      $win.scrollTop(0);
      $body.addClass('main-editor-mode')
      editor.setMinFrameHeight()
      listenResize(editor)
      $win.trigger('scroll').trigger('resize')
      var $title = ta.$root.find('.editor-title input.title')
      if (!$title.val().length && $.browser.msie) $title.val($title.attr('placeholder')).addClass('placeholder')
      setTimeout(function () { //for firefox
        editor.focus()
      }, 0)
    })
  };

  var $fullTitle,
    $fullSubmit,
    $backContainer,
    $submitContainer,
    editorReady = exports.editorReady = function (editor, $toolbar) {
      listenResize(editor)
      if ($toolbar.data('ready')) return
      $toolbar.data('ready', true)
      var $bold = $('.bold', $toolbar)
        , $underline = $('.underline', $toolbar)
        , $numberlist = $('.numberlist', $toolbar)
        , $bulletlist = $('.bulletlist', $toolbar)
        , $emotion = $('.emotion', $toolbar)
        , $stock = $('.stock', $toolbar)
        , $upload = $('.upload', $toolbar)
        , $uew = $toolbar.closest('.editor').find('.ueditor-wrapper')

      $bold.on('click', function () {
        editor.execCommand("bold");
      })
      $underline.on('click', function () {
        editor.execCommand("underline");
      })
      $numberlist.on('click', function () {
        editor.execCommand("insertorderedlist", 'decimal');
      })
      $bulletlist.on('click', function () {
        editor.execCommand("insertunorderedlist", 'disc');
      })
      emotion({ editor: editor, insert: tap.insert }, $emotion)
      $stock.on('click', stockKeyup({
        editor: true, $uew: $uew, insert: function (str) {
          editor.execCommand("insertHtml", str);
        }
      }))
      uploadBtn({
        insertImage: function (img, cb) {
          insertImage(editor, img, cb)
        }, $uew: $uew, uploadStatusUploading: tap.uploadStatusUploading, uploadStatusClear: tap.uploadStatusClear, uploadStatus: tap.uploadStatus
      }, $upload)
      editor.addListener("selectionchange", function () {
        if (editor.queryCommandState("Bold") > 0) {
          $bold.addClass("toolbar-item-active");
        } else {
          $bold.removeClass("toolbar-item-active");
        }

        if (editor.queryCommandState("underline") > 0) {
          $underline.addClass("toolbar-item-active");
        } else {
          $underline.removeClass("toolbar-item-active");
        }

        if (editor.queryCommandState('insertorderedlist') > 0) {
          $numberlist.addClass("toolbar-item-active");
        } else {
          $numberlist.removeClass("toolbar-item-active");
        }

        if (editor.queryCommandState('insertunorderedlist') > 0) {
          $bulletlist.addClass("toolbar-item-active");
        } else {
          $bulletlist.removeClass("toolbar-item-active");
        }
      })
    },
    fullEditor = function ($parent) {
      if ($parent.data('fullscreen')) return $parent.data('fullscreen')
      var deferred = $.Deferred()
      $parent.data('fullscreen', deferred.promise())
      $parent.findOrAppend('>.editor', require('./editor.jade'), { hostDomain: SNB.domain.host }, function ($editor) {
        var $title = $('input.title', $editor)
          , $submit = $('input.submit', $editor)
          , $toolbar = $('.editor-toolbar', $editor)
          , $uew = $('.ueditor-wrapper', $editor)

        $backContainer = $('.back-container', $editor)
        $submitContainer = $('.submit-container', $editor)

        var ta = $parent.data('ta')
        if (ta) {
          if (ta.editor) {
            editorReady(ta.editor, $toolbar)
            deferred.resolve(ta.editor)
            $parent.addClass('editor-mode')
          } else {
            ta.upgrade(function (editor) {
              editorReady(editor, $toolbar)
              deferred.resolve(editor)
              $parent.addClass('editor-mode')
              editor.setMinFrameHeight()
            })
          }
          $uew.data('ta', ta)
        } else {
          editor(window.innerHeight > 350 ? window.innerHeight - 260 : 90, '', false, function (editor) {
            ta = {
              editor: editor, $uew: $uew, uploadStatusUploading: tap.uploadStatusUploading, uploadStatusClear: tap.uploadStatusClear, uploadStatus: tap.uploadStatus, insert: function (str) {
                editor.execCommand("insertHtml", str);
              }
            }
            ta.reset = $.proxy(tap.reset, ta)
            editor.ta = ta
            editor.addListener('ready', function () {
              var sk = stockKeyup(ta)
              editor.addListener('keyup', function (type, ev) {
                sk(ev)
              })
              editor.addListener('keyup', atKeyup(ta))
              editorReady(editor, $toolbar)
              deferred.resolve(editor)
            })
            $parent.addClass('editor-mode')
            $parent.data('editor', editor)
            $uew.data('ta', ta)
            editor.render($uew[0])
          })
        }
        $uew.find('>iframe').prop('tabindex', '2')
        $('.submit-container input[type=button]', $editor).prop('tabindex', '3')
      })
      return $parent.data('fullscreen')
    },
    fullscreen = exports.fullscreen = function (content, title, bk, options, cb) {
      fullEditor($body).then(function (editor) {
        $body.addClass('editor-mode')
        listenResize(editor)
        $win.trigger('resize')
        options && options.$back && options.$back.length && (function () {
          $backContainer.empty().each(function (i, el) {
            options.$back.clone(true).appendTo(el)
          })
        }());
        options && options.$submit && options.$submit.length && (function () {
          $submitContainer.empty().each(function (i, el) {
            options.$submit.clone(true).appendTo(el)
          })
          $('input[type=button]', $submitContainer).prop('tabindex', '3')
        }());
        var $upload = $('body>.editor .editor-toolbar .toolbar-item.upload')
        if (options && typeof(options.uploadImage) == 'boolean' && options.uploadImage === false) {
          $upload.hide()
        } else {
          $upload.show()
        }
        editor.setContent(content)
        $body.data('editorInitialContent', editor.getContent())
        var range = editor.selection.getRange()
        if (bk) range.moveToBookmark(bk)
        else range.collapse(true)
        range.select(true)
        cb && cb(editor)
        title = 'string' === typeof title ? title : ''
        var $title = $('body>.editor .editor-title input.title')
        $title.val(title)
        if (!title && $.browser.msie) $title.val($title.attr('placeholder')).addClass('placeholder')
      })
    },
    editChanged = function () {
      return $body.data('editor').getContent() != $body.data('editorInitialContent');
    },
    main = exports.main = function (selector, initData, submitFunc, enableUpload, fullscreen, pdf) {
      initData = initData || {};
      initData.content = SNB.Util.cleanContent(initData.content || '', true);

      $(selector)
        .findOrAppend('>.editor', require('./editor.jade'), {hostDomain: SNB.domain.host}, function ($editor) {
          var $title = $('input.title', $editor),
            $uew = $('.ueditor-wrapper', $editor),
            $toolbar = $('.editor-toolbar', $editor),
            $footer = $('.editor-footer', $editor),
            isMobile = $.browser.isMobile;

          fullscreen = fullscreen && !isMobile;
          enableUpload = enableUpload && $.browser.supportUpload;

          $editor.show();

          $footer.html(require('./editor-footer.jade')({hostDomain: SNB.domain.host}));

          var $submit = $('input.main-submit', $footer);

          $('.ueditor-wrapper')
            .hide()
            .after('<textarea id="status-box"></textarea>');

          var opt = {
            $emotion: $('.emotion', $footer),
            $stock: $('.stock', $footer),
            $upload: $('.upload', $footer),
            $pdf: $('.pdf', $footer),
            ctrlReturn: true,
            submitFunc: submitFunc,
            autoResize: 70
          };

          if (!enableUpload) {
            opt.$upload.remove();
            delete opt.$upload;
          }

          if (!pdf) {
            opt.$pdf.remove();
            delete opt.$pdf;
          }

          var ta = init(selector, opt);

          if (initData.editor) {
            ta.upgrade(initData);
          } else if (initData.content) {
            ta.reset(initData.content);
            ta.setSelection200B();
            ta.upgrade();
          } else {
            ta.$textarea.addClass('not-init');
            // for at suggestion, 只在非 mobile 时使用
            ta.$textarea.one('mouseup', function () {
              ta.$textarea.removeClass('not-init');

              if (!isMobile) {
                ta.upgrade();
              }
            });
          }

          if (initData.title) {
            $title.val(initData.title);
          }

          if (!fullscreen) {
            $('.fullscreen', $footer).remove();
          } else {
            $('.fullscreen', $footer)
              .click(function () {
                ta.$textarea.trigger('focus');
                ta.fullscreen();
              });

            $('.back-container', $editor)
              .each(function (i, el) {
                $('<a href="javascript:;" class="back">返回</a>')
                  .on('click', function (ev) {
                    $body
                      .removeClass('main-editor-mode');
                    //ta.$root.find('.editor-toolbar').removeClass('fixed')

                    $win
                      .off('resize.fullEditor');

                    ta.editor.setMinFrameHeight(70);

                    setTimeout(function () { //for firefox
                      ta.editor.focus();
                    }, 0);

                    ev.preventDefault();
                  })
                  .appendTo(el);
              });
          }

          $submit.on('click', submitFunc);
        });
    };

  $body.data('editChanged', editChanged);

  function windowUnload(ev) {
    if ($body.is('#my-home')) { // 只对首页保存 main editor 内容
      var ta = $('#main-editor').data('ta')
      if (ta && ta.hasContent()) {
        var $title = ta.$uew.closest('.editor').find('input.title')
          , title = $title.length && $title.val()
        if (ta.editor) {
          var cb = ta.ctbk()
          store.set('editor', {
            editor: true, content: cb.content, bk: cb.bk, title: title || ''
          })
        } else {
          ta.setBookmark200B()
          store.set('editor', {
            content: ta.textarea.value, title: title || ''
          })
        }
      } else {
        store.remove('editor')
      }
    } else if ($body.hasClass('editor-mode')) { // 任何页编辑文章都提醒
      if (editChanged()) return '关闭窗口将放弃当前修改，你确定吗？'
    }
  }

  if ($.browser.msie && parseFloat($.browser.version) < 9) {
    $(window.top).on('beforeunload', windowUnload);
  } else {
    $win.on('beforeunload', windowUnload);
  }

  $body
    .on('click', '.ui-widget-overlay', function (ev) {
      var $overlay = $(ev.target),
        $dialog = $('#stockbox, #at-suggestion', $overlay.prev());

      if ($dialog.length) {
        $dialog.dialog('close');
      }
    });

});;
define("editor_inline.css.js" ,[] ,function(require, exports, module){module.exports="a,abbr,acronym,address,applet,b,big,blockquote,body,caption,center,cite,code,dd,del,dfn,div,dl,dt,em,fieldset,font,form,h1,h2,h3,h4,h5,h6,html,i,iframe,img,ins,kbd,label,legend,object,ol,p,pre,q,s,samp,small,span,strike,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,tt,u,ul,var{margin:0;border:0;padding:0;outline:0}body{color:#000;padding:0;word-wrap:break-word}body,button,fieldset,input,label,legend,option,select,textarea{font:14px/1.5 'Helvetica Neue',Helvetica,Arial,sans-serif}ol,ul{padding-left:3em}ul li{list-style:disc}ol li{list-style:decimal}.ke_img{background:#f9f9f9}a{color:#000!important;text-decoration:none!important}";});;
define("editor.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="editor"><div class="editor-toolbar-wrapper"><div class="editor-toolbar fixed"><span title="加粗" class="toolbar-item bold"></span><span title="下划线" class="toolbar-item underline"></span><span title="有序列表" class="toolbar-item numberlist"></span><span title="无序列表" class="toolbar-item bulletlist"></span><div class="toolbar-line"></div><span title="插入表情" class="toolbar-item emotion"></span><span title="插入股票" class="toolbar-item stock"></span><span title="插入图片" class="toolbar-item upload"><form action="/service/upload_photo" method="post" enctype="multipart/form-data"><input name="file" type="file"/></form></span><span class="upload_status"></span><div class="back-container"></div></div></div><div class="editor-title"><input name="title" tabindex="1" type="text" placeholder="点击这里输入标题" class="title"/></div><div class="editor-wrapper"><div class="ueditor-wrapper"></div></div><div class="editor-footer"><div class="submit-container"><input type="button" value="发布" class="submit main-submit disabled"/></div><div class="back-container"></div><div class="footer-controller"></div></div></div>');
}
return buf.join("");
};module.exports = anonymous;});;
define("editor-footer.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="back-container"></div><div class="footer-controller"><span title="插入表情" class="emotion"><s></s><span>表情</span></span><span title="插入股票代码" class="stock"><s></s><span>股票</span></span><span title="上传图片" class="upload"><s></s><span>图片</span></span>');
 var showPdf = (function () { if (typeof req_isMobile != 'undefined' && !req_isMobile && typeof req_isPad != 'undefined' && !req_isPad) return true; else if (typeof $ != 'undefined' && $.browser && !$.browser.isMobile && !$.browser.isPad) return true; else return false }())
 if (showPdf)
{
buf.push('<span title="上传研报 pdf 文件" class="pdf"><s></s><span>PDF</span></span>');
}
buf.push('<span title="添加标题，给文章排版" class="fullscreen"><s></s><span>长文</span></span><span class="upload_status"></span></div><div class="submit-container"><input type="button" value="发布" class="main-submit disabled"/></div>');
}
return buf.join("");
};module.exports = anonymous;});