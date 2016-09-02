define('widget/donate.js', ["common/util/password","widget/util/share","SNB.repostDialog","widget/repost_comment"], function (require, exports, module) {	var Password = require('common/util/password');
	var Share = require('widget/util/share');
  var Retweet = require('SNB.repostDialog');
  var Repost = require('widget/repost_comment');

	var Type = {
		'status': '篇帖子',
		'comment': '条评论'
	};

	function tmpl(status) {
		var _tmpl = _.template('' +
			'<div id="donate-dialog">' +
				'<div class="donate-bd">' +
					'<div id="donate-wrap" class="bd-wrap">' +
						'<p class="title">欢迎赞助！请选择赞助给 <%= user.screen_name %> 的金额：</p>' +
						'<ul class="item-list">' +
							'<li class="item" data-amount="1">1雪球币</li>' +
							'<li class="item" data-amount="6">6雪球币</li>' +
							'<li class="item" data-amount="10">10雪球币</li>' +
							'<li class="item" data-amount="66">66雪球币</li>' +
							'<li class="item" data-amount="100">100雪球币</li>' +
							'<li class="item-custom" data-amount=""><input type="text" class="coin-amount" placeholder="其他金额" maxlength="5"></li>' +
						'</ul>' +
						'<p class="tip" style="display:none;"></p>' +
						'<div class="donate-ft">' +
							'<a href="#" class="btns btn-donate disabled">赞助</a>' +
							'<a href="/c/deposit" target="_blank" class="btn-recharge">购买雪球币</a>' +
						'</div>' +
					'</div>' +
					'<div id="recharge-wrap" class="bd-wrap" style="display:none;">' +
						'<p>请在新窗口购买雪球币，完成之前请不要关闭此窗口</p>' +
						'<div class="recharge-ft">' +
							'<a href="#" class="btns btn-done">已完成</a>' +
							'<a href="/c/deposit" target="_blank" class="btns btn-redo">重新购买</a>' +
						'</div>' +
					'</div>' +
					'<div id="pwd-wrap" class="bd-wrap" style="display:none;">' +
						'<p>你最近消费较多雪球币，为确保账户安全，</p>' +
						'<p>请输入登录密码进行确认:</p>' +
						'<p><input type="password" class="pwd" /><span class="warn" style="display:none;">密码错误</span></span></p>' +
						'<div class="pwd-ft">' +
						'	<a href="#" class="btns btn-confirm">确认</a>' +
						'</div>' +
					'</div>' +
					'<div id="done-wrap" class="bd-wrap" style="display:none;">' +
						'<p class="success">感谢赞助</p>' +
						'<p class="success-tip"><%= user.screen_name %> 已收到你赞助的 <span class="amount"></span>雪球币</p>' +
						'<p><a href="#" class="btn-share">分享到雪球</a></p>' +
					'</div>' +
				'</div>' +
			'</div>');

		return $(_tmpl(status));
	}

	function shareTpl(data) {
		data._type = Type[data.type];
		var tmpl = _.template('我刚向 @<%= user.screen_name %> 的<%= _type %>赞助了 <%= amount %> 雪球币，<%= _type %>地址 <%= uri %>');

		return tmpl(data);
	}

	function getBalance(amount, callback) {
		var $tip = $('#donate-wrap .tip');
		var $btnDonate = $('#donate-wrap .btn-donate');
		var text = '';

		$tip.hide();

		if (!amount || !/^[1-9]\d*$/.test(amount)) {
			text = '输入数量错误，请输入整数';
			$tip.addClass('warn');
			$btnDonate.addClass('disabled');
			$tip.text(text).show();
		} else if (amount >= 50000) {
			text = '赞助数额不能超过50000雪球币';
			$tip.addClass('warn');
			$btnDonate.addClass('disabled');
			$tip.text(text).show();
		} else {
			$.post('/c/balance', function (res) {
				var balance = res.snow_coin;

				if (balance >= amount) {
					text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币';
					$tip.removeClass('warn');
					$btnDonate.removeClass('disabled');

					if (callback && typeof callback === 'function') {
						callback();
					}
				} else if (balance < amount) {
					text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币，请先购买雪球币';
					$tip.addClass('warn');
					$btnDonate.addClass('disabled');
				}

				$tip.text(text).show();
			});
		}
	}

	function Dialog(status, callback) {
		return this.init(status, callback);
	}

	Dialog.prototype = {
		init: function (data, callback) {
			var $dialog = tmpl(data);

			$dialog
				.dialog({
					modal: true,
					title: '赞助',
					width: 400,
					close: function () {
						$dialog.dialog('destroy').remove();
					}
				});

			$dialog.find('.coin-amount').blur();
			$dialog.find('.item')
				.on('click', function () {
					var $this = $(this),
						$btn = $dialog.find('.btn-donate');

					$btn.removeClass('disabled');

					$this.siblings('li').removeClass('on');
					$this.addClass('on');

					$('.coin-amount').val('');

					var amount = $this.data('amount');

					getBalance(amount);

					$dialog
						.find('.btn-donate')
							.data('amount', amount)
							.removeClass('validate');
				});

      //默认激活赞助1雪球币
      $dialog.find('.item').eq(0).trigger('click');

			$dialog.find('.coin-amount')
				.on('focus', function () {
					$dialog.find('.tip').hide();

					var $this = $(this),
						$item = $this.parents('.item-custom'),
						$btn = $dialog.find('.btn-donate');

					$btn
						.data('amount', 0)
						.addClass('disabled');

					$item.addClass('on');
					$item.siblings('li').removeClass('on');
					$dialog.find('.tip').hide();

					var amount = $.trim($this.val());

					if (amount) {
						$btn.data('amount', amount);
					}

					$dialog.find('.btn-donate').addClass('validate');
				})
				.on('keyup', function () {
					var $this = $(this),
						$item = $this.parents('.item-custom'),
						$btn = $dialog.find('.btn-donate');

					var $btnDonate = $('#donate-wrap .btn-donate');
					var $tip = $('#donate-wrap .tip');
					var text = '';

					$btn.removeClass('disabled');

					$item.addClass('on');
					$item.siblings('li').removeClass('on');

					var amount = $.trim($this.val());

					if (!amount) {
						$tip.text('').hide();
						$btnDonate.addClass('disabled');
						$btnDonate.data('amount', 0);

						return false;
					}

					if (!/^[1-9]\d*$/.test(amount)) {
						text = '输入数量错误，请输入整数';
						$tip.addClass('warn');
						$btnDonate.addClass('disabled');
						$tip.text(text).show();
					} else if (amount >= 50000) {
						text = '赞助数额不能超过50000雪球币';
						$tip.addClass('warn');
						$btnDonate.addClass('disabled');
						$tip.text(text).show();
					} else {
						$.post('/c/balance', function (res) {
							var balance = res.snow_coin;

							if (balance >= amount) {
								text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币';
								$tip.removeClass('warn');
								$btnDonate.removeClass('disabled');
								$btnDonate.data('amount', amount);
							} else if (balance < amount) {
								text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币，请先购买雪球币';
								$tip.addClass('warn');
								$btnDonate.addClass('disabled');
							}

							$tip.text(text).show();
						});
					}
				});

			function done(amount, res) {
				if (res.success) {
//					$('.bd-wrap').hide();
//					$('#done-wrap')
//						.show()
//						.find('.amount')
//						.text(amount);

          data.amount = amount;
          var text = '';

          $dialog.dialog('close');

          if (data.type == 'comment') {
//            var title = '分享';
//            text = shareTpl(data);

//            Share(title, text);
            text = '我刚赞助了这条评论 ' + amount + ' 雪球币，也推荐给你。';
            Repost(data.status.id, data.id, text);
          } else {
            text = '我刚赞助了这篇帖子 ' + amount + ' 雪球币，也推荐给你。';

            Retweet(data.status, '', text);
          }

					if (callback && typeof callback === 'function') {
						callback(amount);
					}
				} else if (21722 == res.error_code) {
					$dialog
						.find('.bd-wrap')
							.hide()
						.end()
						.find('#pwd-wrap')
							.show()
							.find('.pwd')
								.focus()
						.find('.amount')
							.text(amount);
				} else if (28015 == res.error_code) {
					$dialog.find('.tip').show();
				} else if (21723 == res.error_code) {
					$('#pwd-wrap .warn').show();
				} else {
					alert(res.error_description);
				}
			}

			$dialog.find('.btn-donate')
				.on('click', function (e) {
					e.preventDefault();
					var $this = $(this),
						amount = $this.data('amount');

					if ($this.hasClass('disabled') || $this.data('amount') === 0) {
						return false;
					}

					var cb = function () {
						$.get('/c/donate/session', function (res) {
							var token = res.toString();

							$.post('/c/donate', {
								to_id: data.id,
								to_type: data.type,
								amount: amount,
								session_token: token
							}, function (res) {
								done(amount, res);
							});
						});
					};

					$this.addClass('disabled');

					if ($this.hasClass('validate')) {
						var $tip = $('#donate-wrap .tip');
						var text = '';

						$tip.hide();

						if (!amount || !/^[1-9]\d*$/.test(amount)) {
							text = '输入数量错误，请输入整数';
							$tip.addClass('warn');
							$tip.text(text).show();
						} else if (amount >= 50000) {
							text = '赞助数额不能超过50000雪球币';
							$tip.addClass('warn');
							$tip.text(text).show();
						} else {
							$.post('/c/balance', function (res) {
								var balance = res.snow_coin;

								if (balance < amount) {
									text = '应付:' + amount + '雪球币，帐号余额:' + balance + '雪球币，请先购买雪球币';
									$tip.addClass('warn');

									$tip.text(text).show();
								} else {
									if (cb && typeof cb === 'function') {
										cb();
									}
								}
							});
						}
					} else {
						cb();
					}

					return false;
				});

			$dialog.find('.btn-confirm')
				.on('click', function (e) {
					e.preventDefault();
					var $this = $(this);

					if ($this.hasClass('disabled')) {
						return false;
					}

					$this.addClass('disabled');

					var amount = $dialog.find('.btn-donate').data('amount'),
						pwd = $.trim($dialog.find('.pwd').val());

					pwd = Password.encryPw(pwd);

					$.get('/c/donate/session', function (res) {
						var token = res.toString();

						$.post('/c/donate', {
							to_id: data.id,
							to_type: data.type,
							amount: amount,
							password: pwd,
							session_token: token
						}, function (res) {
							done(amount, res);
						});
					});

					return false;
				});

			$dialog.find('.pwd')
				.on('keyup', function (e) {
					if (e.keyCode == 13) {
						$dialog.find('.btn-confirm').trigger('click');
					}
				});

			$dialog.find('.btn-recharge')
				.on('click', function () {
					$('.bd-wrap').hide();
					$('#recharge-wrap').show();
				});

			$dialog.find('.btn-done')
				.on('click', function (e) {
					e.preventDefault();

					$('#recharge-wrap').hide();
					$('#donate-wrap').show();

					var $on = $('#donate-wrap .on');

					if ($on.length) {
						if ($on.is('.item-custom')) {
							$on.find('.coin-amount').trigger('keyup');
						} else {
							$on.trigger('click');
						}
					}

					return false;
				});

			$dialog.find('.btn-share')
				.on('click', function (e) {
          e.preventDefault();

					data.amount = $dialog.find('.btn-donate').data('amount');

          var text = '';

          $dialog.dialog('close');

          if (data.type == 'comment') {
            var title = '分享';
            text = shareTpl(data);

            Share(title, text);
          } else {
            text = '我刚赞助了这篇帖子 ' + data.amount + ' 雪球币，也推荐给你。';

            Retweet(data.status, '', text);
          }

          return false;
				});

			$dialog.find('.pwd')
				.on('focus', function () {
					var $this = $(this);
					var $wrap = $this.parents('.bd-wrap');
					var $warn = $wrap.find('.warn');

					$warn.hide();
					$dialog
						.find('.btn-confirm')
							.removeClass('disabled');
				});

			return $dialog;
		}
	};

  module.exports = exports = function (data, callback) {
    return new Dialog(data, callback);
  };

});
