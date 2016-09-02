define('SNB.editor.emotion.js', ["emotion.jade.js"], function (require, exports, module) {  function emotion(ev, callback) {
    var $emotion = $(ev.target)
    if ($emotion.parents('#main-editor').length) {
      if (!$emotion.is('span.emotion')) $emotion = $emotion.parents('span.emotion')
    }
    var pos = $emotion.offset();
    var height = $emotion.outerHeight();
    function init($emotionPanel) {
      var eph;
      function close() {
        eph = false;
        $emotionPanel.hide()
      }
      $emotionPanel.find('.tooltip-inner').findOrAppend('table', '<table />', function ($table, appended) {
        if (appended) {
          var content = ''
            , row = ''
            , $hover = $('.emotion-hover')
          _.each(SNB.Util.BBCODE_MAPPING.slice(40), function(mapping, i) {
            row += '<td><img src="' + SNB.Util.BBCODE_IMAGE_BASEURL + mapping[0] + '.png" title="' + mapping[1] + '" width="24" height="24"/></td>';
            if ((i + 1) % 9 === 0) {
              content += "<tr>" + row + "</tr>";
              row = "";
            };
          });
          if (row) content += "<tr>" + row + "</tr>";
          $table.html(content)
          $table.on('mouseenter', 'img', function (ev) {
            $hover.text($(ev.target).attr('title'))
          }).on('mouseleave', function () {
            $hover.text('')
          }).on('click', 'img', function (ev) {
            ev.preventDefault()
            $emotionPanel.data('callback')($(ev.target).attr('title') || '');
            close();
          })
          $emotionPanel.on('click', 'a.close', function () {
            ev.preventDefault()
            close()
          })
          $emotion.on('mouseleave', function () {
            setTimeout(function () {
              if (!eph) close()
            }, 100)
          })
          $emotionPanel.on('mouseenter', function () {
            eph = true;
            $emotionPanel.on('mouseleave', close)
          })
        }
      })
    }
    $body.findOrAppend('>.emotion-panel', require('./emotion.jade'), function ($emotionPanel, appended) {
      if (appended) init($emotionPanel)
      $emotionPanel.data('callback', callback)
      var left = pos.left - 18;
      var top = pos.top + height;
      var eph;
      if (top + (eph = $emotionPanel.height()) - 70 > $win.scrollTop() + $win.height()) {
        top = top - eph - height;
        if (top < 0) top = 0;
        $emotionPanel.removeClass('above').addClass('below');
      } else {
        $emotionPanel.addClass('above').removeClass('below');
      }
      if (SNB.scroll.isEditorMode()) left += 4;
      $emotionPanel.css({
          display: 'block'
        , top: top
        , left: left
        , 'z-index': 9999
      }).show();
    })
  }
  module.exports = function (ta, $emotion) {
    $emotion.on($emotion.parents('#main-editor').length ? 'mouseenter' : 'click', function(ev) {
      emotion(ev, function(str) {
        if (!ta.editor) {
          var content = ta.getContent()
          ta.upgrade(function() {
            ta.insert(content + str)
          })
        } else {
          ta.insert(str)
        }
      })
    })
  }
})
;
define("emotion.jade.js", function(require, exports, module){function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="tooltip emotion-panel above"><div class="tooltip-arrow above"><div class="tooltip-arrow-in"></div><div class="tooltip-arrow-out"></div></div><div class="tooltip-alpha"></div><div class="tooltip-inner"><div class="operations"><span>插入表情：</span><span class="emotion-hover"></span><!--a.close(href="javascript:;")--></div></div><div class="tooltip-arrow below"><div class="tooltip-arrow-in"></div><div class="tooltip-arrow-out"></div></div></div>');
}
return buf.join("");
};module.exports = anonymous;});