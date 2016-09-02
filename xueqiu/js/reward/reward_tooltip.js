/**
 * Created by orange on 16/7/7.
 */
define('reward/reward_tooltip.js', [], function (require, exports, module) {  var $body = $('body'),
    selector = '.ops .reward, .ops .btn-reward,#status-list .btn-reward',
    $tooltip,
    $tooltipinner;

  var Type = {
    'status': '这篇帖子',
    'comment': '这条评论'
  };

  function tmpl(data) {
    var tpl = _.template('' +
      '<div class="donate-list">' +
      '<div class="donate-list-hd">' +
      '<h4 class="donators-tip">已有<%= people %>人次打赏了<%= type %></h4>' +
      '</div>' +
      '<div class="donate-list-bd">' +
      '<ul class="donators-list">' +
      '<% for (var i=0; i<users.length; i++) { %>' +
      '<li class="donator-item">' +
      '<a href="<%= users[i].uri %>" target="_blank"><img src="<%= users[i].avatar %>" alt="<%= users[i].name %>" width="30" height="30" /></a>' +
      '<strong><%= users[i].paid %></strong>' +
      '</li>' +
      '<% } %>' +
      '</ul>' +
      '</div>' +
      '</div>');

    return tpl(data);
  }
  $body.append('<div class="temp"></div>');

  if (!$body.find('.temp .new-tooltip').length) {
//		$tooltip = require('../new_tooltip.jade');
    $tooltip = '<div class="new-tooltip" style="position: absolute;">' +
      '<div class="new-tooltip-arrow above">' +
      '<div class="new-tooltip-arrow-in"></div>' +
      '<div class="new-tooltip-arrow-out"></div>' +
      '</div>' +
      '<div class="new-tooltip-alpha"></div>' +
      '<div class="new-tooltip-inner"></div>' +
      '<div class="new-tooltip-arrow below">' +
      '<div class="new-tooltip-arrow-out"></div>' +
      '<div class="new-tooltip-arrow-in"></div>' +
      '</div>' +
      '</div>';

    $body
      .find('.temp')
      .append($tooltip);
  }


  $tooltip = $body.find('.temp .new-tooltip');
  $tooltipinner = $tooltip.find('.new-tooltip-inner');

  $body
    .on('mouseenter', selector, function () {

      var $this = $(this),
        id = $this.data('id'),
        type = $this.is('.reward') ? 'status' : 'comment',
        url = $this.is('.reward') ? '/statuses/reward/list.json':'/statuses/reward/comment/list.json';

      // 不做处理
      // 主帖页的 赞助
      // 没有赞助记录
      if (($this.is('.donate') && $this.parents('#jade-single').length)
        || !$this.data('id')
        || $this.find('.snow-coin').data('count') === 0) {
        return false;
      }

      clearTimeout($this.data('timeout'));
      $this.data('state', 'in');

      $this.data('timeout', setTimeout(function () {
        if ($this.data('state') === 'in') {
          $.get(url, {
            status_id: id,
            comment_id: id,
            page: 1,
            size: 100
          }, function (users) {
            console.log(users);
            var coins = 0,
              _users = [],
              data = {
                people: users.total_items,
                type: Type[type]
              };

            _.each(users.items, function (v, i) {
              coins += v.amount;

              var user = {
                uri: v.user_id,
                avatar: v.photo_domain  + v.profile_image_url.split(',')[0] + '!30x30.png',
                name: v.name,
                paid: v.amount/100
              };

              _users.push(user);
            });

            data.coins = coins;
            data.users = _users;

            var inner = tmpl(data);

            $tooltipinner.html(inner);

            var h = $tooltipinner.height(),
              w = $tooltipinner.width();

            $tooltip
              .css({
                width: w + 5,
                height: h + 18
              })
              .find('.new-tooltip-alpha')
              .css({
                width: w + 8,
                height: h + 8
              });

            var pos = $this.offset(),
              tooltipHeight = $tooltip[0].offsetHeight,
              tooltipPos = {
                top: pos.top - tooltipHeight,
                left: pos.left
              };

            if ((pos.top - $(document).scrollTop()) < (tooltipHeight + 41)) {
              tooltipPos.top = pos.top + $this[0].offsetHeight;
              type = 'above';
              $tooltip.addClass("above");
            }

            //右侧宽度不够的情况
            if ((pos.left + $tooltip.width()) > $(window).width()) {
              tooltipPos.left = pos.left - $tooltip.width() + 50;
              $tooltip.addClass("right");
            }

            $tooltip
              .css(tooltipPos)
              .css({
                'visibility': 'visible',
                'zIndex': 1024
              });
          });
        }
      }, 600));
    })
    .on('mouseleave', selector, function () {
      var $this = $(this);

      clearTimeout($this.data('leave_timeout'));

      $this.data('leave_timeout', setTimeout(function () {
        if ($tooltip.hasClass('hover')) {
          return false;
        }

        $tooltip
          .css('visibility', 'hidden')
          .removeClass('above myself right');

        $this.data('state', 'out');
      }, '200'));
    });

  $tooltip
    .on('mouseleave', function () {
      $tooltip
        .css('visibility', 'hidden')
        .removeClass('hover above myself right');
    }).on('mouseenter', function () {
    $tooltip.addClass('hover');
  });

});