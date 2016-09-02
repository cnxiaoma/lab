define('lib/upload.js', ["jquery.uploadify"], function (require, exports, module) {  var uid = 0;

  require('../jquery.uploadify.js');

  module.exports = exports = function ($btn, options) {
    $('form', $btn).remove();

    var $form = $('<form method="POST" enctype="multipart/form-data"></form>').appendTo($btn),
      $inputProto = $('<input name="file" type="file">'),
      $iframe;

    $form.prop('action', options.action);

    if (options.accept) {
      $inputProto.prop('accept', options.accept)
    }

    function newInput() {
      $form.show();

      if ($btn.data('swf-ready')) {
        $form.find('.mask').remove();

        return false;
      }

      uid++;

      $form.empty();

      if ($iframe && $iframe.length) {
        $iframe.remove()
      }

      var $input = $inputProto
          .clone()
            .on('change', inputOnChange)
            .prop('id', '__upload_uid_' + uid)
          .appendTo($form);

      return $input;
    }

    function _processUploadData (data) {
      var match,
        ret;

      if (data && $.isPlainObject(data)) {
        ret = data;
      } else if (!data || !(match = data.match(/\{[\s\S]*?(filename|code)[\s\S]*?\}/))) {
        data ? $btn.trigger('upload.fail.unknown') : $btn.trigger('upload.fail.timeout')

        $btn.trigger('upload.done');

        return false;
      }

      data = match[0];

      try {
        ret = $.parseJSON(data);
        ret.code = ret.code || ret.error_code;
        ret.msg = ret.msg || ret.error_description;
        $btn.trigger(ret.code ? 'upload.fail.ret' : 'upload.success', ret);
      } catch(e) {
        $btn.trigger('upload.fail.unknown');
      } finally {
        $btn.trigger('upload.done');
      }
    }

    var inputOnChange = function () {
      var processUploadData = _.once(_processUploadData),
        $input = $(this);

      if (!this.value) {
        return false;
      }

      var image = new Image();

      image.DYNSRC = this.value;

      var size = image.fileSize || this.files[0].fileSize;

      var formData;

      // 超过尺寸
      if (size > (options.sizeLimit || 5120) * 1024) {
        $btn.trigger('upload.fail.limit');
        $btn.trigger('upload.done');
        return false;
      } else {
        try {
          formData = new FormData($form[0]);
        } catch (e) {}
      }

      var ext = this.value.substring(this.value.lastIndexOf(".") + 1).toLowerCase();

      // 类型不符
      if ($.inArray(ext, options.type) == -1) {
        $btn.trigger('upload.fail.type')
        $btn.trigger('upload.done')
        return false;
      }

      setTimeout(processUploadData, options.timeout || 40000);

      $btn.trigger('upload.started', $input.val());

      if (formData) {
        // 使用 HTML5 xhr 上传图片
        $.ajax({
          url: options.action,
          type: 'POST',
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: function (data) {
            processUploadData(data);
            $btn.trigger('upload.done');
          }
        });

        $form.hide();
      } else {
        // 老旧浏览器使用 iframe 上传
        var iframeName = '__upload_uid_' + $form.find('input').prop('id'),
          $iframe = $('<iframe name="' + iframeName + '" src="about:blank" style="display:none;width:0;height:0;"/>')
            .insertAfter($form);

        $form.attr('target', iframeName);

        $iframe.on('load', function(){
          try {
            var body = $iframe.contents().find('body').text();

            processUploadData(body);
          } catch(e){
            $btn.trigger('upload.fail.unknown');
          } finally {
            $btn.trigger('upload.done');
          }
        });

        $form.hide();
        $form.submit();
      }
    }

    var progressCount = 0,
      timer,
      fallbackTimer,
      queuedCount = 0,
      finishedCount = 1;

    options.$progress = options.$progress || $();

    $btn.on('upload.done', function () {
      newInput();

      try {
        $btn.uploadify('cancel', '*');
      } catch (e) {}

      try {
        clearTimeout(timer)
      } catch (e) {}

      progressCount = 0

      if (options.$progress.length) {
        options.$progress.text('');
      }
    });

    if (!$.browser) {
      $.browser = {};
      $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    }
    if ($.browser.msie) {
      newInput().uploadify({
        swf: '//assets.imedao.com/js/uploadify.swf'
      , queueSizeLimit: options.queueSizeLimit || 1
      , buttonText: ''
      , fileObjName: 'file'
      , uploader: options.flashAction || options.action
      , width: $btn.outerWidth()
      , height: $btn.outerHeight()
      , multi: options.queueSizeLimit && options.queueSizeLimit > 1
      , fileSizeLimit: options.flashSizeLimit || options.sizeLimit || 5120
      , successTimeout: (options.flashTimeout || options.timeout || 40000) / 1000
      , fileTypeExts: options.type ? _.map(options.type, function (item) { return '*.' + item }).join('; ') : '*.*'
      , overrideEvents: ['onSelectError', 'onDialogClose']
      , onDialogClose: function (queueData) {
          queuedCount = queueData.filesQueued
          finishedCount = 1
        }
      , onQueueComplete: function (queueData) {
          queuedCount = 0
        }
      , onSelectError: function (file, errorCode, errorMsg) {
          if (errorCode == SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT) {
            $btn.trigger('upload.fail.limit')
          } else if (errorCode == SWFUpload.QUEUE_ERROR.INVALID_FILETYPE) {
            $btn.trigger('upload.fail.type')
          } else if (errorCode == SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
            $btn.trigger('upload.fail.queue')
          }
          $btn.trigger('upload.done')
        }
      , onUploadStart: function (file) {
          $btn.trigger('upload.started', file.name);
          //$form.css('visibility', 'hidden')
          var $object = $btn.find('object'),
            $p = $object.parent();

          $p.css('position', 'relative');
          $('<div class="mask" />').css({
            position: 'absolute',
            top: '0',
            left:'0',
            width: $btn.outerWidth(),
            height: $btn.outerHeight(),
            background: 'transparent',
            'z-index': 1 + ($object.css('z-index') || 0)
          }).appendTo($p);

          timer = setTimeout(function () {
            _processUploadData();
          }, options.flashTimeout || options.timeout || 40000);

          try {
            clearTimeout(fallbackTimer);
          } catch (e) {}
        }
      , onUploadError: function (file, errorCode, errorMsg, errorString) {
          finishedCount++
          _processUploadData('unknown error')
        }
      , onUploadProgress: function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
          var uploaded = bytesUploaded/bytesTotal*99|0
          if (++progressCount > 3) {
            var $progress = options.$progress.length ? options.$progress : $btn.parent().find('.progress')
            if ($progress) $progress.text((queuedCount>1?finishedCount+'/'+queuedCount+' ':'') + uploaded + '%')
          }
        }
      , onUploadSuccess: function (file, data, response) {
          finishedCount++
          _processUploadData(data)
        }
      , onSWFReady: function () {
          var $dialog = $form.parents().filter('.ui-dialog')
          $btn.data('swf-ready', true)
          if (!$dialog.length) return
          $form.find('object').css('z-index', 1 + $dialog.css('z-index'))
          try {
            clearTimeout(fallbackTimer)
          } catch (e) {}
        }
      })
      fallbackTimer = setTimeout(newInput, 3000) // fallback
    } else {
      newInput();
    }

    return $btn;
  }
})
