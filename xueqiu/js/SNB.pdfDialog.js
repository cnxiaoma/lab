define('SNB.pdfDialog.js', ["pdf-dialog.jade.js","lib/upload"], function (require, exports, module) {  var template = require('./pdf-dialog.jade')
    , upload = require('./lib/upload')
  function init($pdfDialog) {
    // 选取文件上传部分的初始化
    var $uploadBox = $('.upload-box', $pdfDialog)
      , $filename = $('.filename', $uploadBox)
      , $hint = $('.hint', $pdfDialog)
      , $uploadErrMsg = $('.uploadErrMsg', $pdfDialog)
    function status(status, msg) {
      if (_.indexOf(['upload', 'uploading', 'uploaded'], status) == -1) return
      $uploadBox.removeClass().addClass('upload-box').addClass(status)
      if (status == 'upload') {
        var $err = $('span.uploadErrMsg', $uploadBox)
        if (msg) {
          $hint.hide()
          $err.text(msg)
        } else {
          $hint.show()
          $err.text('')
        }
      } else if (status == 'uploading') {
        var $filename = $('span.filename', $uploadBox)
        $filename.text(msg)
      }
    }
    upload($('span.upload .button', $uploadBox), {
          action: SNB.domain.host + '/service/upload_pdf',
      //?access_token=' + $.cookie('xq_a_token')
          flashAction: '/pdf/upload.json'
        , type: ['pdf']
        , accept: 'application/pdf'
        , sizeLimit: 10240
        , timeout: 60000
        , $progress: $('span.progress', $uploadBox)
      })
      .on('upload.fail.ret', function(ev, ret) {
        var msg = ({
            '20701': '请上传小于 10M 的文件'
          , '20704': '只支持 PDF 格式的文档'
          , '22701': '文档无法在线播放，请换个文件试试'
          , '20703': '文档上传失败，请重试'
        })[ret.code] || '文档无法在线播放，请换个文件试试'
        status('upload', msg)
      })
      .on('upload.fail.unknown', function() { status('upload', '文档无法在线播放，请换个文件试试') })
      .on('upload.fail.timeout', function() { status('upload', '上传超时，请重新上传或换个文件试试') })
      .on('upload.fail.limit', function() { status('upload', '请上传小于 10M 的文件') })
      .on('upload.fail.type', function() { status('upload', '只支持 PDF 格式的文档') })
      .on('upload.started', function(ev, filename) {
        var filename = filename.split(/\\|\//).pop().split('.')
          , ext = filename.pop()
        filename = filename.join('.')
        if (filename.length >= 28) filename = filename.substring(0, 27) + '...'
        status('uploading', filename + '.' + ext + ' ')
      })
      .on('upload.success', function (ev, ret) {
        $uploadBox.data('filename', ret.filename)
        status('uploaded')
        $errMsg.text('')
      })
    $('a.cancelUpload', $pdfDialog).on('click', function() {
      $uploadBox.data('filename', null)
      status('upload')
    })

    // stock
    var $stock = $('.stock', $pdfDialog)
      , $stockInput = $('input', $stock)
      , $stockFakeInput
      , maxStocks = 10
      , errMsgStocks = '填写相关性最强的股票，最多不超过'+maxStocks+'个'
      , checkMaxStocks = function (ev) {
          setTimeout(function () {
            if (ev && ev.type == 'keydown' && ev.keyCode != $.ui.keyCode.BACKSPACE) return
            if ($stockInput.val().split('||').length > maxStocks) $errMsg.text(errMsgStocks)
            else $errMsg.text('')
          })
        }
      , dt = '相关股票'
    require.async("jquery.tagsinput.js",function(){
      var phcolor = '#a9a9a9'
      $stockInput.tagsInput({
          width:"464px"
        , height:"auto"
        , delimiter:"||"
        , placeholderColor: phcolor
        , defaultText: dt
        , autocomplete_url: true
        , autocomplete: SNB.Util.insertStockAutocompletionOptions
      });
      $stockFakeInput = $('.tagsinput input', $stock)
      function refreshCloseButton() {
        setTimeout(function () {
          $('span.tag a', $stock).off('click.refresh').on('click.refresh', checkMaxStocks)
        }, 0)
      }
      $stockFakeInput.on('blur', function () {
        var $this = $(this)
        $this.css('color', phcolor)
        setTimeout(function (){
          var val
          if ((val = $stockFakeInput.val()) && val != dt) {
            $stockInput.addTag(val, {focus:true,unique:true})
            setTimeout(function (){ refreshCloseButton() }, 0)
          }
          else $this.val(dt)
        }, 0)
      }).off("autocompleteselect").on("autocompleteselect", function(ev, ui){
        ev.preventDefault()
        $stockInput.addTag('$' + ui.item.name + '(' + ui.item.value + ')$',{focus:true,unique:true});
        checkMaxStocks()
        refreshCloseButton()
      }).off('keypress.tagsinput').on('keydown', function (ev) {
        var menu = $stockFakeInput.autocomplete('widget')
        menu = menu && menu.data('menu')
        var val
        if (ev.keyCode == $.ui.keyCode.SPACE) {
          if (menu.active) {
            ev.preventDefault()
            menu.select()
          } else if ((val = $stockFakeInput.val()) && val != dt) {
            $stockInput.addTag(val, {focus:true,unique:true})
            refreshCloseButton()
            return false
          }
        }
        checkMaxStocks(ev)
      })
    })

    var $errMsg = $('div.errMsg', $pdfDialog)
    // input 的初始化
    $('input:text, textarea', $pdfDialog).trigger('blur').on('keyup', function(ev) {
      var $el = $(ev.target)
      var val = $el.val()
      if (val && val != $el.attr('placeholder')) {
        $el.removeClass('error')
        $errMsg.text('')
      }
    })

    // 摘要部分编辑器的初始化
    var $tabox = $('.content', $pdfDialog)
      , $textarea = $('textarea', $pdfDialog)
      , taplaceholder = $textarea.attr('placeholder')
      , taplaceholderspan = '<span class=placeholder style="color:#a9a9a9">' + taplaceholder + '</span>'
      , $uew
      , ta

    ta = SNB.editor.init($tabox, {
        $emotion: $('.showFaceButton', $pdfDialog)
      , $stock: $('.addStock', $pdfDialog)
    })
    if (!$.browser.isMobile && !ta.editor) ta.upgrade({ autoheight: false }, function() {
      $uew = $('.ueditor-wrapper', $pdfDialog)
      $uew.height(160)
      ta.reset(taplaceholderspan, false) // 实现富文本编辑的 placeholder，有点 tricky
      ta.editor.addListener('keyup', $.proxy($uew, 'removeClass', 'error'))
      $(ta.editor.body).on('click focus keydown', function () {
        $(ta.editor.body).find('span.placeholder').remove()
        $errMsg.text('')
      })
      $body.on('click', function (ev) {
        if ($pdfDialog.is(':hidden')) return
        $t = $(ev.target)
        if ($('.showFaceButton, .addStock', $pdfDialog).index($t) > -1 ||
            $('#faceTablePanel').css('display') == 'block') {
          $(ta.editor.body).find('span.placeholder').remove()
        } else if (!$('<div>' + ta.getContent() + '</div>').text()) {
          ta.reset(taplaceholderspan, false)
        }
      })
    })

    var $title = $('.title input', $pdfDialog)
      , $org = $('input.org', $pdfDialog)
      , $author = $('input.author', $pdfDialog)
    // 取消或发布成功清除表单
    var $submit = $('div.submit input.submit', $pdfDialog)
      , $cancel = $('div.submit input.button', $pdfDialog)
    function clear () {
      $submit.prop('disabled', false)
      $('input:text, textarea', $pdfDialog).val('').removeClass('error')
      ta.reset(taplaceholderspan, false)
      $uploadBox.data('filename', null)
      status('upload')
      $errMsg.text('')
      $stockInput.importTags('')
      $stockFakeInput.val(dt)
    }

    $pdfDialog.dialog('option', 'close', clear)
    var closePdfDialog = $.proxy($pdfDialog, 'dialog', 'close')

    $cancel.on('click', closePdfDialog)

    $submit.on('click', function () {
      if ($submit.prop('disabled')) return
      var filename = $uploadBox.data('filename')
        , pdf = SNB.domain.pdf + '/' + filename + '.pdf'
        , png = SNB.domain.upyun + '/' + filename + '.png!custom.jpg'
        , title = $title.val()
        , org = $org.val()
        , author = $author.val()
        , stocks = $stockInput.val()
      $(ta.editor.body).find('span.placeholder').remove()
      var content = SNB.Util.cleanContent(ta.getContent(), false, ta.editor)
      if (!filename) return $errMsg.text('请完成 PDF 上传再发布')
      if (!title || title == $title.attr('placeholder')) $title.addClass('error')
      if (!org || org == $org.attr('placeholder')) org = ''
      if (org) org = '报告出处：' + org
      if (!author || author == $author.attr('placeholder')) author = ''
      if (author) author = '报告作者：' + author + '&nbsp; &nbsp; &nbsp;'
      if (stocks) stocks = '<br>相关股票：' + stocks
      if (!content) $uew.addClass('error')
      if ($('input.error', $pdfDialog).length) return $errMsg.text('请填写标题后再发布')
      if (!content) return $errMsg.text('请填写研究报告的摘要信息或评论后再发布')
      if (stocks.split('||').length > maxStocks) return $errMsg.text(errMsgStocks)
      else stocks = stocks.replace(/\|\|/g, ' ')
      content = author + org + stocks + (author || org || stocks ? '<br><br>' : '') + content
      content += '<br>' + pdf
      $submit.prop('disabled', true)
      SNB.post("/statuses/update.json", { title: title, status: content }, function (ret) {
        closePdfDialog()
        SNB.Util.statusPdf(ret)
        SNB.data.tempStatus.push(ret.id);
        SNB.data.stCollection.add(ret);
        SNB.data.stCollection.trigger("addStatuses", [SNB.data.stCollection.get(ret.id)]);
        SNB.data.stView.refreshTime();
        SNB.Util.stateDialog('研究报告发布成功')
      }, function(xhr){
        if (xhr.status == 400) $errMsg.text('您提交的内容过长，请更改后重试。')
        else $errMsg.text('服务器出错，请重试。')
        $submit.prop('disabled', false)
      })
    })
  }
  exports = module.exports = function () {
    $('body').findOrAppend('>.ui-dialog>#dialog-pdf', template, function($pdfDialog, appended) {
      $pdfDialog.dialog({
        title: '发布研究报告',
        modal: true,
        width: 520
      })
      if (appended) init($pdfDialog)
      return
    })
  }
})
;
define("pdf-dialog.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="dialog-pdf"><div class="upload-box upload"><span class="uploading">正在上传<span class="filename"></span><span class="progress"></span><i class="loading"></i></span><span class="uploaded">已上传<span class="filename"></span><a href="javascript:;" class="cancelUpload">取消</a></span><span class="upload"><span>上传研究报告</span><span class="button">选择 PDF 文件</span><span class="hint">文件最大不超过10M</span><span class="uploadErrMsg"></span></span></div><div class="title"><input placeholder="研究报告标题，不超过 30 个汉字" maxlength="30" type="text"/></div><div class="author"><input placeholder="研究报告作者，多人请用逗号隔开" type="text" class="author"/><input placeholder="研究报告出处" type="text" class="org"/></div><div class="stock"><input maxlength="30" type="text"/></div><div class="content"><textarea placeholder="请填写研究报告的摘要信息或对该报告的评论"></textarea></div><div class="counttxt"><span title="表情" class="showFaceButton"></span><span title="股票" class="addStock"></span></div><div class="errMsg"></div><div class="submit"><input value="确定" type="submit" class="submit"/><input value="取消" type="button" class="button"/></div></div>');
}
return buf.join("");
};module.exports = anonymous;});