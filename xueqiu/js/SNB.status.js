define('SNB.status.js', ["widget/donate","widget/profile_pin","widget/global_pin","reward/index","pages/askstatement"], function (require, exports, module) {	var $ = jQuery;
	var Donate = require('widget/donate');
  var ProfilePin = require('widget/profile_pin');
  var GlobalPin = require('widget/global_pin');
	var Reward = require('reward/index.js');
	require('pages/askstatement.js');

	function parseStatusWithComment(comment) {
		var commentUser = comment.user;
		var profileImageUrls = commentUser.profile_image_url ? commentUser.profile_image_url.split(',') : '';

		commentUser.img = SNB.domain.photo + "/" + (profileImageUrls.length > 3 ? profileImageUrls[3] : (profileImageUrls.length == 1 ? profileImageUrls[0] : 'community/default/avatar.png!30x30.png'))
		comment.createdAt = comment.timeBefore
		comment.count = comment.reply_count
		return comment;
	}

	function parseModelData(model, options) {
		if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
			this.app = "desktop";
		} else this.app = options.app
		if (typeof model.get("notLazy") !== "undefined") return
		switch (this.app) {
			case "desktop":
				if (!model.id && options.el) {
					var $el = $(options.el)
					var user = {
						id: $el.find(".headpic a").data("id"),
						profile: $el.find(".headpic a").attr("href"),
						img: $el.find(".headpic a img").attr("src"),
						screen_name: $el.find(".headpic a").data("name")
					}
					var verified = $el.find(".headpic a").data("verified")
					if (verified && verified != 'null') {
						user.verified = true
						user.verified_description = verified;
					}
					var retweet
					var $retweet = $el.find(".status > .retweet")
					if ($retweet.length) {
						var $rusertitle = $retweet.find("p.title a")
						var ruser = {
							id: $rusertitle.data("id"),
							profile: $rusertitle.attr("href"),
							screen_name: $rusertitle.data("name")
						}
						retweet = {
							title: $retweet.find(".title").next("h4").text(),
							id: $retweet.find(".meta .time").attr("href").split("/").pop(),
							pdf: $retweet.find("img.show-retweet").data("pdf"),
							'target': $retweet.find(".meta .time").attr("href"),
							user: ruser
						}
					}
					var text = ""
					var description = ""
					var textNode = $el.find(".status div.detail").clone()
					textNode.find(".fold-all, .show-all").remove()
					text = textNode.html()
					var description = ""
					var summary = $el.find(".status > div.summary")
					if (summary.length) {
						var summaryNode = summary.clone()
						summaryNode.find(".fold-all, .show-all").remove()
						description = summaryNode.html()
					} else {
						description = text
					}

					model.set({
						'user': user,
						'retweeted_status': retweet,
						'retweet_status_id': retweet && retweet.id,
						'id': parseInt($el.attr("id").split("_")[1], 10),
						'text': text,
						'canEdit': user.id == SNB.currentUser.id,
						'source': $el.find(".infos span").text().replace("来自", ""),
						'title': $el.find('.status > h4 a').text(),
						'target': $el.find(".infos .time").attr("href"),
						'favorited': $el.find('.ops > .addFav').text() != '收藏',
						'pdf': $el.find("img.show-all").data('pdf'),
						'notLazy': false,
						'description': description
					})

					return model;
				}
				if (!$.browser.isPad && !$.browser.isMobile) {
					this.set(SNB.Util.statusPdf({ text: model.get("text"), description: model.get("description"), retweeted_status: model.get("retweeted_status") }))
				}
				var user = this.get("user");
				var profileImageUrls = user.profile_image_url ? user.profile_image_url.split(',') : '';
				//var cleanUser = SNB.Status.cleanUser(user, {img_size: "50"})
				var cleanUser = SNB.Status.cleanUser(user, {img_size: "100"})
				var createdAt = SNB.Util.parseTime(this.get("created_at"));

				var retweet;
				if ((retweet = this.get("retweeted_status"))) {
					if (!$.browser.isPad && !$.browser.isMobile) SNB.Util.statusPdf(retweet)
					retweet.re_description = SNB.helpers.parseLongUrl(retweet.description);
					retweet.re_reply_count = retweet.reply_count;
					retweet.re_title = retweet.title;
					retweet.re_createdAt = SNB.Util.parseTime(retweet.created_at);
					retweet.text = SNB.Image.lazyload(SNB.Util.parseContent(retweet.pdf ? retweet.pdfRemovedContent : retweet.text))
					retweet.text = SNB.helpers.parseLongUrl(retweet.text);
					if (!retweet.user) {
						retweet.re_reply_count = 0
					}
				}
				var text = SNB.Image.lazyload(this.get('pdf') && !this.get('retweeted_status') ? this.get('pdfRemovedContent') : this.get("text"));
				var favorited = this.get("favorited");
				if (!favorited || (favorited && SNB.currentUser.id !== SNB.profileUser.id)) {
					this.unset('favorited');
					this.unset('favorited_created_at');
				}
				var status_with_comment = this.get("comment")
				if (status_with_comment) {
					status_with_comment = parseStatusWithComment(status_with_comment);
					this.set({'comment': status_with_comment});
				}
				this.unset('user_id');
				this.set({'retweeted_status': retweet});
				this.set({
					user: cleanUser,
					createdAt: createdAt,
					text: SNB.helpers.parseLongUrl(SNB.Util.parseContent(text)),
					description: SNB.helpers.parseLongUrl(this.get("description")),
					notLazy: true,
					retweeted_status: retweet
				});
				break;
			case "tablet":
				var user = this.get("user");
				var profileImageUrls = user.profile_image_url ? user.profile_image_url.split(',') : '';

				//var cleanUser = SNB.Status.cleanUser(user, {img_size: "50"})
				var cleanUser = SNB.Status.cleanUser(user, {img_size: "100"})
				var createdAt = SNB.Util.parseTime(this.get("created_at"));
				var firstImg = this.get("firstImg");
				firstImg = firstImg && firstImg.replace("!thumb.jpg", "!iphone2.jpg") || ""
				var retweet;
				if ((retweet = this.get("retweeted_status"))) {
					retweet.re_description = retweet.description;
					retweet.re_reply_count = retweet.reply_count;
					retweet.re_title = retweet.title;
					retweet.firstImg = retweet.firstImg && retweet.firstImg.replace("!thumb.jpg", "!iphone2.jpg") || ""
					retweet.re_createdAt = SNB.Util.parseTime(retweet.created_at);
					retweet.text = SNB.Image.lazyload(SNB.Util.parseContent(retweet.pdf ? retweet.pdfRemovedContent : retweet.text), false, true)
					if (!retweet.user) {
						retweet.re_reply_count = 0
					}
				}
				var text = SNB.Image.lazyload(this.get('pdf') && !this.get('retweeted_status') ? this.get('pdfRemovedContent') : this.get("text"));
				var favorited = this.get("favorited");
				if (!favorited || (favorited && SNB.currentUser.id !== SNB.profileUser.id)) {
					this.unset('favorited');
					this.unset('favorited_created_at');
				}
				var status_with_comment = this.get("comment")
				if (status_with_comment) {
					status_with_comment = parseStatusWithComment(status_with_comment);
					this.set({'comment': status_with_comment});
				}
				this.unset('user_id');
				this.set({'retweeted_status': retweet});
				this.set({
					user: cleanUser,
					firstImg: firstImg,
					createdAt: createdAt,
					text: SNB.Util.parseContent(text, false, true),
					description: this.get("description"),
					notLazy: true,
					retweeted_status: retweet
				});
				break;
		}
		return this;
	}

	// status model
	SNB.Models.Status = Backbone.Model.extend({
		initialize: function (model, options) {
			if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
				this.app = "desktop"
			} else this.app = options.app
		},
		fav: function (callback) {
			var that = this;
			if (this.get("favorited")) {
				//Unfav
				SNB.get("/favorites/destroy/" + this.id + ".json", function (ret) {
					that.set({"favorited": false}, {silent: true});
					if (callback) {
						callback();
					}
				});
			} else {
				//Fav
				SNB.get("/favorites/create.json", {id: this.id}, function (ret) {
					that.set({"favorited": true}, {silent: true});
					if (callback) {
						callback()
					}
				});
			}
		}
	});

	SNB.Collections.Statuses = Backbone.Collection.extend({
		initialize: function (collection, options) {
			if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
				this.app = "desktop"
			} else this.app = options.app
		},
		model: SNB.Models.Status,
		sync: function (method, collection, options) {
			//options.url = options.url.indexOf("http") !== -1 ? options.url : SNB.domain.base + options.url;
			//options.dataType = "jsonp"
			options.data = options.data || {}
			options.data.access_token = SNB.Util.getAccessToken()
			return $.ajax(options);
		},
		fetch: function (options) {
			switch (this.app) {
				case "desktop":
					options || (options = {});
					var collection = this;
					var success = options.success;
					options.success = function (resp, status, xhr) {
						if (options.show) {
							collection.more(collection.parse(resp, xhr), options);
						}
						if (success) success(collection, resp);
					};
					return (this.sync).call(this, 'read', this, options);
					break;
				case "tablet":
					options || (options = {});
					var collection = this;
					var success = options.success;
					var key = options.params && options.params.key;
					var addStorage = options.params && options.params.addStorage;
					var older = options.params && options.params.older;
					var $storage = localStorage;
					options.success = function (resp, status, xhr) {
						//clone the response
						resp = typeof resp === "object" && (resp.hasOwnProperty("statuses") || resp.hasOwnProperty("list")) ? resp.statuses || resp.list : resp
						var newData = JSON.parse(JSON.stringify(resp));
						//append values
						var prevData = JSON.parse($storage.getItem(key)),
							len = resp && resp.length,
							preLen = prevData && prevData.length,
						// count 目前是10条
							count = options.count;

						if (addStorage) {
							if (len >= count) {
								$storage.setItem(key, JSON.stringify(resp))
							} else {
								// 新获取和原数据之和小于需要存储的数量
								if (len + preLen <= count) {
									prevData = resp.concat(prevData);
									$storage.setItem(key, JSON.stringify(prevData));
								} else {
									// 大于的话  截取掉原数据  插入新数据
									// 保证localstorage里面有count条数据
									prevData = prevData.slice(0, count - len);
									prevData = resp.concat(prevData);
									$storage.setItem(key, JSON.stringify(prevData));
								}
							}
							var now = new Date().getTime();
							$storage.setItem(key + ":timestamp", now);
						}
						if (resp.length >= options.count && !older) {
							var originHeight = $(options.el).height();
							//$(options.el).css("min-height",originHeight+"px");
							$(options.el).html("")
							var homeTimeline_col = new SNB.Collections.Statuses(resp, {app: "tablet"})
							var homeTimeline_view = new SNB.Views.StatusList({
								el: options.el,
								app: "tablet",
								drag_support: true,
								timeLine_type: "home",
								url: "/statuses/home_timeline.json",
								collection: homeTimeline_col,
								key: key
							});
							homeTimeline_view.render()
							return
						}
						if (options.show) {
							collection.more(collection.parse(resp, xhr), options);
						}
						if (success) success(collection, resp);
					};
					return (this.sync).call(this, 'read', this, options);
					break;
			}
			// options.error = wrapError(options.error, collection, options);
		},
		more: function (models, options) {
			var collection = this;
			var oldIds = _.pluck(collection.models, 'id');
			collection.add(models);
			var ids = _.pluck(models, 'id');
			var newModels = [];
			_.each(ids, function (id) {
				if (_.indexOf(oldIds, id) === -1) {
					newModels.push(collection.get(id));
				}
			});
			collection.trigger("addStatuses", newModels);
		},
		parse: function (ret) {
			if (typeof ret !== 'object') {
				ret = $.parseJSON(ret)
			}
			return ret
		}
	});

	SNB.Templates.Remark = '<span class="user_remark" data-name="{{=it.user.screen_name}}" style="{{=it.user.remark ? "display:inline" : "display:none" }}">({{=it.user.remark}})</span>';

	SNB.Templates.UserTitle = ""
		+ "{{ if (!it.hideUser){ }}"
		+ "<p class='userTitle'>"
		+ "<a target='_blank' href='{{=it.user.profile}}' data-name='{{=it.user.screen_name}}'><span>{{=it.user.screen_name}}</span>"
		+ "{{#def.Remark}}"
		+ "{{#def.verified}}</a>"
		+ "{{ if(it.app_type === 'tablet'){ }}"
		+ "<span class='createdAtTime' date='{{=it.created_at}}' data-target='{{=it.target}}'>{{=it.createdAt}}</span>"
		+ "{{ } }}"
		+ ":"
		+ "</p>"
		+ "{{ } }}";

	SNB.Templates.Verified = ""
		+ "{{ if (it.user.verified){ }}"
		+ "<img width='16px' height='16px' class='vipicon' title='{{=it.user.verified_description}}' src='" + SNB.domain['static'] + "/images/vipicon_{{=it.user.verified_type||1}}{{= it.app_type === 'tablet' ? '@2x' : ''}}.png'/>"
		+ "{{ } }}";

	SNB.Templates.RTVerified = ""
		+ "{{ if (it.retweeted_status.user.verified){ }}"
		+ "<img width='16px' height='16px' class='vipicon'  title='{{=it.retweeted_status.user.verified_description}}' src='" + SNB.domain['static'] + "/images/vipicon_{{=it.retweeted_status.user.verified_type || 1}}{{= it.app_type === 'tablet' ? '@2x' : ''}}.png'/>"
		+ "{{ } }}";

	SNB.Templates.RTRemark = '<span class="user_remark" data-name="{{=it.retweeted_status.user.screen_name}}" style="{{=it.retweeted_status.user.remark ? "display:inline" : "display:none" }}">({{=it.retweeted_status.user.remark}})</span>';

	SNB.Templates.RTUserTitle = ""
		+ "{{ if (it.retweeted_status.user){ }}"
		+ "<p class='userTitle'>"
		+ "<a target='_blank' href='{{=it.retweeted_status.user.profile}}' data-id='{{=it.retweeted_status.user.id}}' data-name='{{=it.retweeted_status.user.screen_name}}'><span>{{=it.retweeted_status.user.screen_name}}</span>"
		+ "{{#def.RTRemark}}"
		+ "{{#def.RTVerified}}: "
		+ "</a>"
		+ "</p>"
		+ "{{ } else{ }}"
		+ "<p><a>用户已被删除</a>: </p>"
		+ "{{ } }}";

	SNB.Templates.StatusContentDot = ""
		+ "<div class='status{{= (it.app_type!=='tablet') && (it.expend || it.pdf)?' expandable':''}}'>"
		+ "{{ if(it.status_type !== 'topic') { }}"
		+ "{{#def.userTitle}}"
		+ "{{ if (it.title){ }}"
		+ "<h4><a href='{{=it.target}}' target='_blank'>{{=it.title}}</a></h4>"
		+ "{{ } }}"
		+ "{{ }else{ }}"
		+ "{{ if (it.topic_title){ }}"
		+ "<span class='createdAtTime' date='{{=it.created_at}}' data-target='{{=it.target}}'>{{=it.timeBefore}}</span>"
		+ "<h3><a href='{{=it.target}}' target='_blank'>{{=it.topic_title}}</a></h3>"
		+ "{{ } }}"
		+ "<p class='info_block'>"
      + "{{ if(!it.authorIsStock){ }}"
        + "<span class='author'>"
          + "作者："
          + "<a href='{{=it.user.profile}}' data-name='{{=it.user.screen_name}}' data-id='{{=it.user.id}}' data-verified='{{=it.user.verified_description}}' class='screen_name'><span>{{=it.user.screen_name}}</span>"
          + "{{ if(it.user.verified){ }}"
            + "<img width='16px'  class='vipicon' height='16px' title='{{=it.user.verified_description}}' src='" + SNB.domain['static'] + "/images/vipicon_{{=it.user.verified_type || 1}}{{= it.app_type === 'tablet' ? '@2x' : ''}}.png'/>"
          + "{{ } }}"
          + "</a>"
        + "</span>"
      + "{{ } }}"
      + "{{ if(it.topic_symbol){ }}"
        + "<span class='stocks'>"
          + "股票："
          + "{{=it.topic_symbol}}"
        + "</span>"
      + "{{ } }}"
		+ "</p>"
		+ "{{ } }}"
		+ "{{ if(it.app_type!=='tablet') { }}"
      + "{{ if (it.expend || it.pdf){ }}"
        + '{{ if (it.blocking) { }}'
          + '<div class="summary block-tip">'
            + '{{= it.topic_desc || it.description ? (it.topic_desc || it.description) : "" }}'
          + '</div>'
        + '{{ } else { }}'
          + "<div class='summary'>"
            + "{{=it.topic_desc||it.description?(it.topic_desc||it.description+\"<span class='show-all'><i></i>展开</span>\"):''}}"
          + "</div>"
        + '{{ } }}'
      + "{{ } }}"
		+ "{{ } else { }}"
      + "<div class='summary'>"
        + "{{=it.topic_desc||it.description?(it.topic_desc||it.description):''}}"
      + "</div>"
		+ "{{ } }}"
		+ "{{ if(it.app_type!=='tablet') { }}"
      + "<div class='detail'>"
        + '{{ if (it.blocking) { }}'
          + '<span class="block-tip">{{= it.text }}</span>'
        + '{{ } else { }}'
          + "{{=(it.pdf && !it.retweeted_status ? it.pdfRemovedContent : it.text)}}"
        + '{{ } }}'
        + "{{ if (it.expend || it.pdf){ }}"
          + "<span class='fold-all'><i></i>收起</span>"
        + "{{ } }}"
      + "</div>"
		+ "{{ } }}"

		+ "{{ if (it.retweeted_status){ }}"
      + "<div class='retweet{{= (it.app_type!=='tablet') && (it.retweeted_status.expend || it.retweeted_status.pdf)?' expandable':''}}'>"
        + "{{#def.RTUserTitle}}"
        + "{{= (it.retweeted_status.re_title)?'<h4><a href=\"' + it.retweeted_status.target + '\" target=\"_blank\">' + it.retweeted_status.re_title + '</a></h4>':''}}"
        + "{{ if (it.app_type!=='tablet') { }}"
          + '{{ if (it.retweeted_status.blocking) { }}'
            + '<div class="block-tip">{{= (it.retweeted_status.expend || it.retweeted_status.pdf) ? ("<div class=re-summary>" + (it.retweeted_status.re_description || "") + "</div>") : "" }}</div>'
          + '{{ } else { }}'
            + "{{= (it.retweeted_status.expend || it.retweeted_status.pdf)?'<div class=\"re-summary\">' + (it.retweeted_status.re_description?(it.retweeted_status.re_description + '<span class=\"show-retweet\"><i></i>展开</span>'):'')+'</div>':''}}"
          + '{{ } }}'
        + "{{ } else { }}"
          + "{{= '<div class=\"re-summary\">' + (it.retweeted_status.re_description?(it.retweeted_status.re_description ):'')+'</div>'}}"
        + "{{ } }}"

        + "{{ if(it.app_type!=='tablet') { }}"
          + "<div class='re-detail'>"
            + "{{=it.retweeted_status.text}}"
            + "{{ if (it.retweeted_status.expend || it.retweeted_status.pdf){ }}"
              + "<span class='fold-retweet'><i></i>收起</span>"
            + "{{ } }}"
          + "</div>"
        + "{{ } }}"

        + "{{ if (it.retweeted_status.pdf){ }}"
          + "<img src='//assets.imedao.com/images/pdf.png' class='show-retweet re-summary'/>"
        + "{{ } else if (it.retweeted_status.firstImg){ }}"
          + "{{ if (it.app_type!=='tablet'){ }}"
            + "<img src='{{=it.retweeted_status.firstImg}}' class='show-retweet re-summary'/>"
          + "{{ } else { }}"
            + "<img src='{{=it.retweeted_status.firstImg}}' style='width:80px;height:80px' class='show-retweet re-summary'/>"
          + "{{ } }}"
        + "{{ } }}"

        + "<div class='meta'>"
          + "{{ if(it.app_type!=='tablet') { }}"
            + "<a target='_blank' class='time' date='{{=it.retweeted_status.created_at}}' href='{{=it.retweeted_status.target}}'>{{=it.retweeted_status.re_createdAt}}</a>"
            + "{{ if (it.retweeted_status.re_reply_count){ }}"
              + "<a target='_blank' class='target' href='{{=it.retweeted_status.target}}'>相关讨论({{=it.retweeted_status.re_reply_count}})</a>"
            + "{{ } }}"
          + "{{ } else { }}"
            + "<span class='infos'>"
              + "<span>"
                + "相关讨论"
                + "({{=it.retweeted_status.re_reply_count}})"
              + "</span>"
          + "</span>"
          + "{{ } }}"
        + "</div>"
		  + "</div>"
		+ "{{ } }}"

		+ "{{ if (it.pdf){ }}"
		+ "<img src='//assets.imedao.com/images/pdf.png' class='show-all summary'/>"
		+ "{{ } else if (it.firstImg){ }}"
		+ "{{ if (it.app_type!=='tablet'){ }}"
		+ "<img src='{{=it.firstImg}}' class='show-all summary'/>"
		+ "{{ } else { }}"
		+ "<img src='{{=it.firstImg}}' style='width:80px;height:80px' class='show-all summary'/>"
		+ "{{ } }}"
		+ "{{ } }}"
		+ "</div>";

	SNB.Templates.StatusDot = ""
    + '{{ if (it.user.id == {{#def.uid}}) { }}'
      + '<div class="btn-operation">'
        + '<a class="btn-sub-menu" href="#">管理</a>'
        + '<ul class="set-sub-menu">'
          + '<li><a href="#" class="global-pin" data-id="{{= it.id }}">粉丝头条</a>'
          + '{{ if (it.mark == 1) { }}'
            + '<li><a href="#" class="btn-cancel-profile-pin" data-id="{{= it.id }}">取消置顶</a>'
          + '{{ } else { }}'
            + '<li><a href="#" class="profile-pin" data-id="{{= it.id }}">主页置顶</a>'
          + '{{ } }}'
          + '{{ if (it.canEdit) { }}'
            + '<li><a href="#" class="edit" data-id="{{= it.id }}">修改</a>'
          + '{{ } }}'
          + '<li><a href="#" class="delete" data-id="{{= it.id }}">删除</a>'
        + '</ul>'
      + '</div>'
    + '{{ } }}'
		+ "{{# def.head}}"
		+ "<div class='content'>"
			+ "{{#def.status}}"
			+ "<div class='meta'>"
				+ "<div class='infos'>"
					+ "{{ if(it.app_type!=='tablet') { }}"
						+ "<a class='time' date='{{=it.created_at}}' href='{{=it.target}}'>{{=it.createdAt}}</a>"
						+ "<span>"
							+ "来自"
						+ "{{ if (it.source_link) {}}"
							+ "<a class='source' href='{{=it.source_link}}' target='_blank'>{{=it.source}}</a>"
						+ "{{ } else { }}"
							+ "{{=it.source}}"
						+ "{{ } }}"
						+ "</span>"
					+ "{{ }else{ }}"
							+ "<span>"
								+ "{{ if(it.tablet_profile_status){ }}"
									+ "<a class='time' date='{{=it.created_at}}' href='{{=it.target}}'>{{=it.createdAt}}</a>"
								+ "{{ } }}"
								+ "来自"
								+ "{{=it.source}}"
							+ "</span>"
					+ "{{ } }}"
          + '{{ if (it.mark == 1) { }}'
            + '<span class="status-marker status-pin">置顶</span>'
          + '{{ } else if (it.mark == 2) { }}'
            + '<span class="status-marker status-promo">推广</span>'
          + '{{ } else if (it.mark == 3) { }}'
            + '<span class="status-marker status-hot">热门</span>'
          + '{{ } }}'
					+ "{{ if(it.app_type !== 'tablet') { }}"
						+ "{{ if (it.user.id !== {{#def.uid}}) { }}"
							+ "<a href='#' class='reportSpam' data-id='{{=it.id}}'>举报</a>"
						+ "{{ } }}"
					+ "{{ } }}"
					+ "</div>"
					+ "<div class='ops'>"
						+ "{{ if(it.app_type!=='tablet') { }}"
              + '{{ if (it.user.id == SNB.currentUser.id && it.view_count) { }}'
                + '<span class="view-count">阅读({{= it.view_count}})</span>'
              + '{{ } }}'
							+ "<a href='#' class='repost {{=it.user.id !== {{#def.uid}}? 'second':'' }}' data-id='{{=it.id}}'>转发{{=it.retweet_count? ('(' + it.retweet_count + ')'): ''}}</a>"
							+ "<a href='#' class='addFav' data-id='{{=it.id}}'>收藏</a>"

							+ '{{ if (it.user.id != SNB.currentUser.id) { }}'
								+ '<a class="reward" href="#" data-id="{{=it.id}}">'
              + '{{ } else { }}'
                + '<a class="reward self" href="#" data-id="{{=it.id}}" data-uid="{{#def.uid}}">'
              + "{{ } }}"
									+ '打赏'
									+ '{{ if (it.reward_count) { }}'
										+ '<span class="number">(<em class="snow-coin" data-count="{{= it.reward_count }}">{{= it.reward_count }}</em>)</span>'
									+ '{{ } else { }}'
										+ '<span class="number" style="display:none;">(<em class="snow-coin" data-count="0">0</em>)</span>'
									+ '{{ } }}'
								+ '</a>'

							+ "<a href='#' class='statusComment last'  data-id='{{=it.id}}'>评论{{=it.reply_count? ('(' + it.reply_count + ')'):''}}</a>"
						+ "{{ } else { }}"
							+ "<span>转发{{=it.retweet_count? ('(' + it.retweet_count + ')'): '(0)'}}</span>"
							+ "<span>评论{{=it.reply_count? ('(' + it.reply_count + ')'): '(0)'}}</span>"
						+ "{{ } }}"
					+ "</div>"
				+ "</div>"
			+ "</div>"
			+ "{{ if(it.app_type!=='tablet') { }}"
				+ "<div class='commentContainer'>"
				+ "</div>"
			+ "{{ } }}"
	+ "</div>";

	SNB.Templates.StatusHeadDot = ""
		+ "{{ if (!it.hideUser){ }}"
		+ "<div class='headpic'>"
		+ '{{ if(it.status_type === "topic"){ }}'
		+ "<a target='_blank' class='noToolTip' href='{{=it.target}}' data-name='{{=it.user.screen_name}}' data-id='{{=it.user.id}}' data-verified='{{=it.user.verified_description}}'>"
		+ "{{ if(it.app_type!=='tablet') { }}"
		+ '<img width="200px" class="lazy" height="150px" src="//assets.imedao.com/images/image_default.png" data-original="{{=it.topic_pic}}"/>'
		+ "{{ }else{ }}"
		+ '<img width="200px" class="lazy" height="150px" src="//assets.imedao.com/images/image_default@2x.png" data-original="{{=it.topic_pic}}"/>'
		+ "{{ } }}"
		+ '</a>'
		+ '{{ }else{ }}'
		+ "{{ if(it.app_type!=='tablet') { }}"
		+ "<a target='_blank' href='{{=it.user.profile}}' data-name='{{=it.user.screen_name}}' data-id='{{=it.user.id}}' data-verified='{{=it.user.verified_description}}'>"
		+ "<img width='50px' height='50px' src='{{=it.user.img_100}}'/>"
		+ "</a>"
		+ "{{ }else{ }}"
		+ "<a target='_blank' href='{{=it.user.profile}}' data-name='{{=it.user.screen_name}}' data-id='{{=it.user.id}}' data-verified='{{=it.user.verified_description}}'>"
		+ "<img width='50px' height='50px' src='{{=it.user.img_100}}'/>"
		+ "</a>"
		+ "{{ } }}"
		+ '{{ } }}'
		+ "</div>"
		+ "{{ } }}";

	SNB.Templates.statusFunc = doT.template(SNB.Templates.StatusDot, undefined, {
		userTitle: SNB.Templates.UserTitle,
		verified: SNB.Templates.Verified,
		Remark: SNB.Templates.Remark,
		RTRemark: SNB.Templates.RTRemark,
		RTVerified: SNB.Templates.RTVerified,
		uid: SNB.currentUser && SNB.currentUser.id || 0,
		RTUserTitle: SNB.Templates.RTUserTitle,
		status: SNB.Templates.StatusContentDot,
		head: SNB.Templates.StatusHeadDot
	});

	SNB.Views.Status = Backbone.View.extend({
		model: SNB.Models.Status,
		tagName: "li",
		events: {
			// "click .repost": "retweet",
			// "click .addFav": "fav",
			// "click .statusComment": "comment"
		},
		initialize: function (options) {
			if (typeof options === "object" && typeof options.app === "undefined") {
				this.app = "desktop"
			} else this.app = options.app;
			var _model = this.model
			var cb = $.proxy(parseModelData, _model);
			_model = cb(_model, options)
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		render: function () {
			switch (this.app) {
				case "desktop":
					if (this.model.toJSON().blocked) return {};
					if (this.model.toJSON().id) {
						var coin = this.model.toJSON().donate_snowcoin;
						var reward_count= this.model.toJSON().reward_count;

						if (coin > 9999) {
							if (coin % 10000 > 99) {
								coin = (coin / 10000).toFixed(2) + '万';
							} else {
								coin = Math.floor(coin / 10000) + '万';
							}
						}

						SNB.Templates.statusFunc = doT.template(SNB.Templates.StatusDot, undefined, {
							userTitle: SNB.Templates.UserTitle,
							verified: SNB.Templates.Verified,
							Remark: SNB.Templates.Remark,
							RTRemark: SNB.Templates.RTRemark,
							RTVerified: SNB.Templates.RTVerified,
							uid: SNB.currentUser && SNB.currentUser.id || 0,
							RTUserTitle: SNB.Templates.RTUserTitle,
							status: SNB.Templates.StatusContentDot,
							head: SNB.Templates.StatusHeadDot,
							coin: coin,
							reward_count:reward_count
						});
						var this_model=this.model.toJSON();
						if (this_model.is_answer&&SNB.askstatement) {
							var showAskstatementDom = '<span class="askstatement"">'+(this_model.is_refused?SNB.askstatement.refuse:SNB.askstatement.statement)+'</span>';
							this_model.text = this_model.text.indexOf('//<') > 0 ? this_model.text.replace('//<', showAskstatementDom + '//<') : this_model.text + showAskstatementDom;
						}
						var statusHtml = SNB.Templates.statusFunc(this_model);

						$(this.el).html(statusHtml);
						var that = this;
						SNB.Status.expandStatus(this.el, this.model);
						if (SNB.data.type === "favs" && that.model.get("favorited_created_at")) {
							var favAt = SNB.Util.parseTime(that.model.get("favorited_created_at"))
							$(that.el).find(".headpic").before("<p class='favAt'>收藏于：" + favAt + "</p>");
							if (!SNB.profileUser.isGuest && SNB.currentUser.id === SNB.profileUser.id) {
								$(that.el).find(".addFav").text("取消收藏").attr("canRemove", 1);
							}
						}
						//问答,打赏的分成tip
						var is_answer = that.model.get("is_answer");
						var is_refused = that.model.get("is_refused");
						var retweeted_status = that.model.get("retweeted_status");
						var quiz_uid = is_answer && retweeted_status? retweeted_status.user_id: ""; //提问者id
						var quiz_refused = is_answer && retweeted_status? is_refused: "true"; //问答的回复是拒绝了还是回复了
						if(is_answer){
							$(that.el).data('quiz-uid',quiz_uid);
							$(that.el).data('quiz-refused',quiz_refused);
						}
					}
					return this;
					break;
				case "tablet":
					var that = this
					if (this.model.toJSON().blocked) return {};
					if (this.model.toJSON().id) {
						this.model.set({app_type: "tablet", expend: true});

						if (coin > 9999) {
							if (coin % 10000 > 99) {
								coin = (coin / 10000).toFixed(2) + '万';
							} else {
								coin = Math.floor(coin / 10000) + '万';
							}
						}

						SNB.Templates.statusFunc = doT.template(SNB.Templates.StatusDot, undefined, {
							userTitle: SNB.Templates.UserTitle,
							verified: SNB.Templates.Verified,
							Remark: SNB.Templates.Remark,
							RTRemark: SNB.Templates.RTRemark,
							RTVerified: SNB.Templates.RTVerified,
							uid: SNB.currentUser && SNB.currentUser.id || 0,
							RTUserTitle: SNB.Templates.RTUserTitle,
							status: SNB.Templates.StatusContentDot,
							head: SNB.Templates.StatusHeadDot,
							coin: coin
						});

						var statusHtml = SNB.Templates.statusFunc(this.model.toJSON());
						$(this.el).html(statusHtml);
						//SNB.Status.expandStatus(this.el, this.model);
					}
					return this;
					break;
			}
		},
		remove: function () {
			switch (this.app) {
				case "desktop":
					$(this.el).remove();
					break;
				case "tablet":
					break;
			}
		}
	});

	SNB.Views.StatusList = Backbone.View.extend({
		initialize: function (options) {
			var that = this;
			if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
				options.app = "desktop";
				that.app = "desktop";
			} else {
				that.app = options.app;
			}

			switch (options.app) {
				case "desktop":
					if (options.bootstrap) {
						// initialize from rendered html
						SNB.log("initialize from rendered html")
						$(options.el).find(".status-list >li").each(function (index, $li) {
							var status = new SNB.Models.Status(null, {el: $li})
							var cb = $.proxy(parseModelData, status);
							options.el = $li;
							status = cb(status, options);
              //把留在 html 里的 mark 标记取回来。
              status.mark = $($li).data('mark');
							that.collection.add(status);
							SNB.Status.expandStatus($li, status);

							// 添加举报，编辑，删除按钮
							if (!SNB.currentUser.isGuest && SNB.currentUser.id == status.get("user").id) {
//								$($li).find(".ops").prepend("<a href='#' class='delete' data-id='" + status.id + "'>删除</a>")
//								if ($($li).find('.content').data('canedit') && !status.get('pdf')) {
//									$($li).find(".ops").prepend("<a href='#' class='edit' data-id='" + status.id + "'>修改</a>")
//								}
								var statusView = new SNB.Views.Status({
									model: status,
									el: $li
								})
							} else {
								$($li).find(".infos").append("<a href='#' class='reportSpam' data-id='" + status.id + "'>举报</a>");
							}
						});

						setInterval(function () {
							that.refreshTime();
						}, 30000);
					}
					break;
				case "tablet":
					this.drag_support = options.drag_support;
					this.key = options.key;
					this.el = options.el;
					this.timeLine_type = options.timeLine_type;
					this.status_type = options.status_type || {};
					this.url = options.url;
					this.data = options.data;
					this.data_extend = options.data_extend;
					SNB.Status.attachEvent({$el: $(this.el), app_type: "tablet", collection: this.collection})
					break;
			}
			this.collection.bind("addStatuses", this.addStatuses, this);
			this.collection.bind("remove", this.remove, this);
		},
		events: {
			"click .statusComment": "comment",
			"click .reportSpam": "reportSpam",
			"click .repost": "retweet",
			"click .addFav": "fav",
			"click .delete": "delete",
			"click .share": "share",
			"click .edit": "edit",
			// 临时用这种方法来更新外部数据
			"update .ops": "updateStatus",
			'click .donate': 'donate',
			'click .reward': 'reward',
      'click .source': 'statistic',
      'click .btn-sub-menu': 'showSubMenu',
      'click .global-pin': 'globalPin',
      'click .profile-pin': 'profilePin',
      'click .btn-cancel-profile-pin': 'cancelProfilePin'
		},
    statistic: function(e) {
      var name = $(e.target).text();
      if (name === "中信证券") {
        if (window._hmt) {
          _hmt.push(['_trackEvent', 'zxzq', 'click', name]);
        }
      }

      if (name === "长城证券") {
        if (window._hmt) {
          _hmt.push(['_trackEvent', 'cczq', 'click', name]);
        }
      }

			// 统计乐视手机链接点击
			if (name.indexOf("乐视超级手机") > -1) {
				if (window._hmt) {
					_hmt.push(['_trackEvent', name, 'click', name]);
				}
			}
    },
		donate: function (e) {
			e.preventDefault();

			var $this = $(e.target).is('.donate')? $(e.target): $(e.target).parents('.donate');

      clearTimeout($this.data('timeout'));

      if ($this.is('.self')) {
        return false;
      }

			var id = $this.attr('data-id');

			var statusModel = this.collection.get(id),
				status = statusModel.toJSON() || {};

			function callback(amount) {
				var $number = $this.find('.number');
				var $coin = $this.find('.snow-coin');
				var coin = $coin.data('count') - 0;

				$number.show();

				coin = coin + (amount - 0);

				$coin.data('count', coin);

				if (coin > 9999) {
					if (coin % 10000 > 99) {
						coin = (coin / 10000).toFixed(2) + '万';
					} else {
						coin = Math.floor(coin / 10000) + '万';
					}
				}

				$coin.text(coin);
			}

			var data = {
					id: id,
					type: 'status',
					user: status.user,
					uri: SNB.domain.host + status.target.replace(SNB.domain.host, ''),
          status: status
				};

			SNB.Util.checkLogin(function () {
				Donate(data, function (amount) {
					callback(amount);
				});
			});
		},
		reward: function (e) {
			e.preventDefault();

			var $this = $(e.target).is('.reward')? $(e.target): $(e.target).parents('.reward');

			clearTimeout($this.data('timeout'));

			if ($this.is('.self')) {
				SNB.Util.failDialog('不能打赏自己的帖子');
				return false;
			}

			var id = $this.attr('data-id');
			var statusModel = this.collection.get(id),
				status = statusModel.toJSON() || {};

			var data = {
				id: id,
				type: 'status'
			};

			SNB.Util.checkLogin(function () {
				Reward.payModal({
					pay: {
						id: data.id,
						type: data.type
					},
					complete: function (pay) {
						console.log('完成',pay);
						var count=$this.find('em').html();
						$this.find('.number').show().find('em').html(Number(count)+1);
					}
				});
				$('#payAmountModal').trigger('modal:show');
			});
		},
    showSubMenu: function (e) {
      e.preventDefault();

      var $this = $(e.target),
        $menu = $this.siblings('.set-sub-menu');

      $menu.show();

      return false;
    },
    globalPin: function (e) {
      e.preventDefault();

      $('.set-sub-menu').hide();

      var $this = $(e.target),
        data = {id: $this.attr('data-id')};

      SNB.Util.checkLogin(function () {
        GlobalPin(data);
      });

      return false;
    },
    profilePin: function (e) {
      e.preventDefault();

      $('.set-sub-menu').hide();

      var $this = $(e.target),
        id = $this.attr('data-id'),
        data = {
          id: id,
          status: this.collection.get(id).toJSON()
        };

      SNB.Util.checkLogin(function () {
        ProfilePin(data);
      });

      return false;
    },
    cancelProfilePin: function (e) {
      e.preventDefault();

      $('.set-sub-menu').hide();

      var $this = $(e.target),
        data = {id: $this.attr('data-id')};

      SNB.Util.checkLogin(function () {
        SNB.Util.confirmDialog('确定取消主页置顶吗？', function () {
          $.get('/c/pin/session', function (tokenRes) {
            var token = tokenRes[1].toString();

            $.post('/valueadded/top/cancel.json', {
              top_type: 1,
              session_token: token
            }, function (res) {
              if (res && res.success) {
                SNB.Util.stateDialog('已经取消主页置顶');

                // remove marker
                $('#status_' + data.id)
                  .find('.status-marker')
                    .remove();

                $this
                  .removeClass('btn-cancel-profile-pin')
                  .addClass('profile-pin')
                  .text('主页置顶');
              }
            });
          });
        }).dialog({
          modal: true,
          width: 300,
          minHeight: 50
        });
      });

      return false;
    },
		updateStatus: function (e, cb) {
			var that = this;
			that.update(
				{
					url: "/statuses/home_timeline.json",
					older: false,
					count: 10,
					el: $(that.el),
					params: {addStorage: true, key: that.key},
					success: function () {
						that.collection.more(SNB.data.newStatuses)
						if (cb) {
							cb(SNB.data.newStatuses.length);
						}
						SNB.data.newStatuses = []
						SNB.Util.callBrick({homeTimelineUpdated: 1})
					},
					fail: function () {
					}
				})
		},
		comment: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this,
						elm = e.target,
						status_model = this.collection.get($(elm).attr("data-id")),
						status = status_model.toJSON() || {},
						status_user = status.user,
						retweeted_status = status.retweeted_status,
						commentsView = $(elm).data("commentsView")
					if (commentsView) {
						commentsView.toggle();
					} else {
						var text = $(elm).text(),
							$status = $(elm).closest("li#status_" + status.id),
							$commentContainer = $status.find(".commentContainer");
						if (/\d+/ig.test(text)) {
							$commentContainer.addClass("display_textarea");
						}
						$commentContainer.siblings(".searchComment").hide();
						$commentContainer.show();
						var renderCommentContView = function () {
							SNB.data.status_user_id = status_user.id;
							SNB.data.retweeted_status_user_id = retweeted_status && retweeted_status.user.id;
							var comments = new SNB.Collections.Comments([], {statusId: status.id, commentLink: e.target, commentContainer: $commentContainer});
							var cV = new SNB.Views.Comments({
								el: $commentContainer,
								collection: comments,
								statusId: $(elm).attr("data-id"),
								commentLink: e.target
							});
							cV.render();
              //刚刚渲染好评论外壳
              $commentContainer.find('.loading').hide();
							$(elm).data("commentsView", cV);

						};
						renderCommentContView();
						if (SNB.currentUser.isGuest) {
							SNB.Comment.showLoginTip($commentContainer)
						}

						//问答,打赏tip分成

					}
					break;
				case "tablet":
					break;
			}
		},
		reportSpam: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var $elm = $(e.target),
						status_id = $elm.attr("data-id"),
						status = this.collection.get(status_id).toJSON() || {},
						$status = $elm.closest("li#status_" + status.id),
						title = status.title || "",
						description = status.description || "",
						options = {
							id: status_id,
							type: 0,
							user_name: status.user.screen_name,
							img: status.user && status.user.img,
							title: title,
							content: description
						},
						callback = $.noop();
					if ($body.attr("id") === "jade-singleStock") {
						callback = function () {
							$status.hide()
						}
					}
					if ($body.attr("id") === "jade-singleStock" || !status.user.id) {
						options.isStockStatus = true
					}
					SNB.Util.reportSpam(options, callback);
					break;
				case "tablet":
					break;
			}
		},
		retweet: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var id = $(e.target).attr("data-id")
						, that = this
					SNB.Util.checkLogin(function () {
						seajs.use('SNB.repostDialog.js', function (repost) {
							repost(that.collection.get(id).toJSON(), function (ret) {
								if (typeof ret !== 'object') {
									ret = $.parseJSON(ret);
								}
								if (ret.id) {
									e.target.innerHTML = SNB.Util.updateCount(e.target.innerHTML);
									if ($("body").attr("id") == 'my-home') {
										SNB.data.tempStatus.push(ret.id);
										SNB.data.stCollection.add(ret);
										SNB.data.stCollection.trigger("addStatuses", [SNB.data.stCollection.get(ret.id)]);
										SNB.data.stView.refreshTime();
									}
								}
							});
						});
					})
					break;
				case "tablet":
					break;
			}
		},
		share: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var id = $(e.target).attr("data-id"),
						that = this,
						status = that.collection.get(id).toJSON();
					SNB.Util.shareDialog(status, function () {
					});
					break;
				case "tablet":
					break;
			}
		},
		fav: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this;
					SNB.Util.checkLogin(function () {
						var id = $(e.target).attr("data-id");
						var status = that.collection.get(id);
						if (status.get("favorited")) {
							//unfav
							SNB.Util.confirmDialog("确定取消收藏吗？", function () {
								status.fav(function () {
									$(e.target).html("收藏");
									if ($(e.target).attr("canRemove") === "1") {
										var parentLi = $(e.target).closest("li");
										parentLi.fadeOut(300, function () {
											parentLi.remove()
										});
									}
								});
							}).dialog({
								modal: true,
								width: 200,
								minHeight: 50,
								position: [e.clientX - 95, e.clientY - 110]
							}).siblings('.ui-dialog-titlebar').remove();
						} else {
							status.fav(function () {
								$(e.target).html("取消收藏");
							});
							SNB.Util.stateDialog("收藏成功", 2000, function () {
							}, false, 150, [e.clientX - 95, e.clientY - 90]);
						}
					});
					break;
				case "tablet":
					break;
			}
		},
		'delete': function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var id = $(e.target).attr("data-id");
					var status = this.collection.get(id);
					var that = this;
					var alertAsk = false;
					if(status.attributes&&status.attributes.paid_mention&&status.attributes.paid_mention[0].state=="UNANSWERED"){
						alertAsk = true;
					}
					SNB.Util.checkLogin(function () {
							SNB.Status.destroy(e, status.id, function () {
								that.collection.remove(status);
								return false;
							},alertAsk);
						},
						e);
					break;
				case "tablet":
					break;
			}
		},
		'edit': function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var id = $(e.target).attr("data-id");
					var status = this.collection.get(id);
					var that = this;
					SNB.Util.checkLogin(function () {
							seajs.use('SNB.status-edit.js', function (edit) {
								edit(status.toJSON(), function (ret) {
									var user = ret.user;
									var profileImageUrls = user.profile_image_url ? user.profile_image_url.split(',') : '';
									ret.user = {
										img: SNB.domain.photo + "/" + (profileImageUrls.length > 3 ? profileImageUrls[2] : (profileImageUrls.length == 1 ? profileImageUrls[0] : 'community/default/avatar.png!100x100.png')),
										id: user.id,
										profile: user.profile,
										screen_name: user.screen_name,
										verified: user.verified,
										verified_type: user.verified_type,
										verified_description: user.verified_description
									}
									ret.text = SNB.helpers.parseLongUrl(ret.text)
									ret.description = SNB.helpers.parseLongUrl(ret.description)
									ret.createdAt = SNB.Util.parseTime(ret.created_at);

									var retweet;

									ret.retweeted_status = retweet;
									ret.notLazy = true;
									if (!$.browser.isPad && !$.browser.isMobile) SNB.Util.statusPdf(ret)
									status.set(ret);
								});
							});
						},
						e);
					break;
				case "tablet":
					break;
			}
		},
		addStatuses: function (statuses) {
			switch (this.app) {
				case "desktop":
					var temp = $("<div>"),
						$el = $(this.el),
						that = this,
						loadOldStatus = $el.data("loadOldStatus");
					$.each(statuses, $.proxy(function (index, status) {
						var statusView = new SNB.Views.Status({model: status, app: that.app, id: 'status_' + status.id});
						temp.append(statusView.render().el);
					}, this));
					var ids = _.pluck(this.collection.models, 'id');
					var new_ids = _.pluck(statuses, 'id');
					if (_.min(new_ids) === _.min(ids) || loadOldStatus) {
						$el.find("li.last").addClass("laster");
						$el.find(".status-list").append(temp.children());
						$el.find("li").filter(":last").addClass("last");
					} else {
						$el.find(".status-list").prepend(temp.children());
					}
					break;
				case "tablet":
					var temp = $("<div>"),
						$el = $(this.el),
						that = this,
						$listView = $el.data("$listView"),
						loadOldStatus = $el.data("loadOldStatus");

					$.each(statuses, $.proxy(function (index, status) {
						if (!_.isEmpty(that.status_type)) status.set(that.status_type)
						var statusView = new SNB.Views.Status({model: status, app: that.app, id: 'status_' + status.id});
						temp.append(statusView.render().el);
					}, this));
					var ids = _.pluck(this.collection.models, 'id');
					var new_ids = _.pluck(statuses, 'id');
					if (_.min(new_ids) === _.min(ids) || loadOldStatus) {
						$el.find("li.last").addClass("laster");
						$listView.find(".status-list")[0].$el.append(temp.children());
						$listView.$el.css("height", "auto")
						$el.find("li").filter(":last").addClass("last");
					} else {
						$listView.find(".status-list")[0].$el.prepend(temp.children());
						$listView.$el.css("height", "auto")

						/*
						 *var firstLi=$listView.find(".status-list")[0].$el.find("li:first"),
						 *    height=temp.height();
						 *firstLi.animate({
						 *  "margin-top":height+"px"
						 *},"fast","linear",function(){
						 *  $(this).css({"margin-top":"0px"});
						 *  $listView.find(".status-list")[0].$el.prepend(temp);
						 *  temp.fadeIn();
						 *  $listView.$el.css("height","auto")
						 *})
						 */
					}
					break;
			}
		},
		refreshTime: function () {
			switch (this.app) {
				case "desktop":
					$(this.el).find("a.time").each(function () {
						var $this = $(this);
						$this.text(SNB.Util.parseTime($this.attr("date")));
					});
					break;
				case "tablet":
					break;
			}
		},
		update: function (options) {
			switch (this.app) {
				case "tablet":
				case "desktop":
					var $el = $(this.el), that = this;
					options || (options = {});
					if (this.updating) {
						return;
					}
					this.updating = true;
					var data = {};
					if (SNB.data.source) {
						data.source = SNB.data.source;
					}
					if (options.older) {
						$el.data("loadOldStatus", true);
            var models = this.collection.models;
            var marks = (function () {
              var ret = [];
              _.each(models, function (model) {
                console.log(model.mark, 'model.mark', typeof model.mark);
                if (typeof model.mark === 'undefined' || model.mark == 0) {
                  ret.push({
                    id: model.id,
                    mark: model.mark
                  });
                }
              });
              //返回做好排序的数据
              return ret.sort(function (a, b) {
                return a.id - b.id;
              });
            })();
            //对比
						data.max_id = marks.length > 0 ? marks[0].id : -1;
						if (data.max_id == 'Infinity') {
							data.max_id = -1;
						}
					} else {
						$el.data("loadOldStatus", false)
						data.since_id = _.max(_.difference(_.pluck(this.collection.models, 'id'), SNB.data.tempStatus));
						if (SNB.data.newStatuses && SNB.data.newStatuses.length > 0) {
							var new_since_id = _.max(_.pluck(SNB.data.newStatuses, "id"));
							if (new_since_id > data.since_id) {
								data.since_id = new_since_id;
							}
						}
						if (data.since_id == '-Infinity') {
							data.since_id = 0;
						}
					}
					data.count = options.count || 10;
					if (typeof options.data !== "undefined") {
						if (typeof options.data_extend !== "undefined") {
							data = _.extend(data, options.data)
						} else {
							data = options.data;
						}
					}
					if (options.data && options.data.no_maxId) {
						delete data.max_id;
						delete data.no_maxId
					}
					var params = options.params || {}
					params.older = options.older
					if (options.older) {
						$el.addClass("processing");
						var oldLength = this.collection.length;
						this.collection.fetch({
							url: options.url,
							data: data,
							show: true,
							el: that.el,
							params: params,
							count: data.count,
							success: $.proxy(function (ret) {
								if (options.success) {
									options.success(ret)
								}
								;
								$el.removeClass("processing");
								this.updating = false;
							}, this),
							error: $.proxy(function () {
								this.updating = false;
								if (window.console) {
									console.log(arguments);
									console.log("服务器错误");
								}
							}, this)
						});
					} else {
						this.collection.fetch({
							url: options.url,
							data: data,
							show: false,
							count: data.count,
							params: params,
							el: that.el,
							success: $.proxy(function (collection, res) {
								this.updating = false;
								if (typeof res !== 'object') {
									res = $.parseJSON(res);
								}
								if (options.type === "talk") {
									res.statuses = _.filter(res.statuses, function (newStatus) {
										return typeof newStatus === "object" && !newStatus.blocked
									})
								} else {
									res = _.filter(res, function (newStatus) {
										return typeof newStatus === "object" && !newStatus.blocked
									})
								}
								if (res) {
									if (options.type === "talk") {
										SNB.data.newStatuses = _.union(res.statuses || [], SNB.data.newStatuses || []);
									} else {
										SNB.data.newStatuses = _.union(res || [], SNB.data.newStatuses || []);
									}
									if (options.success) {
										options.success()
									}
									;
									if (SNB.data.newStatuses.length) {
										if (SNB.data.tempStatus.length == SNB.data.newStatuses.length) {
											SNB.data.tempStatus = [];
											delete SNB.data.newStatuses;
										} else if (options.type === "talk" && SNB.data.newStatuses.length) {
											$(".showNewStatuses").show().find(".num").text(SNB.data.newStatuses.length);
										} else if (SNB.data.newStatuses.length > SNB.data.tempStatus.length) {
											$(".showNewStatuses").show().find(".num").text(SNB.data.newStatuses.length - SNB.data.tempStatus.length);
										}
									}
								}
							}, this),
							error: $.proxy(function () {
								this.updating = false;
								if (window.console) {
									console.log(arguments);
									console.log("服务器错误");
								}
							}, this)
						});
					}
					break;
			}
		},
		render: function () {
			switch (this.app) {
				case "desktop":
					var list = $("<ul class='status-list'>");
					_.each(_.first(this.collection.models, 8), function (status) {
						if (status.get("blocked")) return
						var statusView = new SNB.Views.Status({model: status, id: 'status_' + status.id});
						list.append(statusView.render().el);
					});
					$(this.el).html(list)
					var otherList = $("<div>");
					_.each(_.rest(this.collection.models, 8), function (status) {
						if (status.get("blocked")) return
						var statusView = new SNB.Views.Status({model: status, id: 'status_' + status.id});
						otherList.append(statusView.render().el);
					});
					list.append(otherList.children())
					list.find("li").filter(":last").addClass("last");
					var self = this;
					setInterval(function () {
						self.refreshTime();
					}, 30000);
					break;
				case "tablet":
					var $listView = new infinity.ListView($(this.el));
					var list = $("<ul class='status-list'>");
					var that = this;
					if (typeof that.$el === "undefined") that.$el = $(this.el)
					_.each(this.collection.models, function (status) {
						if (status.get("blocked")) return
						if (!_.isEmpty(that.status_type)) status.set(that.status_type)
						var statusView = new SNB.Views.Status({model: status, app: "tablet", id: 'status_' + status.id});
						list.append($(statusView.render().el));
					});
					$listView.append(list)
					if (that.timeLine_type === "home") {
						var $scrollable = $('<div class="scrollable">'),
							$wrap = $('<div class="wrap"></div>');
						$scrollable = $scrollable.append($wrap)
						$(that.el).wrapInner($scrollable)
						$(that.el).find(".scrollable").height($(window).height()).pullToRefresh({
							callback: function (cb) {
								var def = $.Deferred();
								that.update(
									{
										url: "/statuses/home_timeline.json",
										older: false,
										count: 10,
										el: $(that.el),
										params: {addStorage: true, key: that.key},
										success: function () {
											that.collection.more(SNB.data.newStatuses)
											if (cb) {
												cb(SNB.data.newStatuses.length);
											}
											SNB.data.newStatuses = []
											SNB.Util.callBrick({homeTimelineUpdated: 1})
										},
										fail: function () {
										}
									})
								setTimeout(function () {
									def.resolve()
								}, 3000);
								return def.promise();
							}
						});
						if (!$(".scrollable").find(".loading.up").length) {
							$(".scrollable").append("<p class='up loading'><p>")
						}
						if (that.timeLine_type === "home") {
							$(".scrollable").find(".loading.up").height(40).show().text("加载更多...")
						}
					}
					$listView.$el.css("height", "auto")
					this.$el.data("$listView", $listView)
					if (that.drag_support) {
						var dragstart = "", dragend = "", drag_way = "", drag_way_first = "", updating_old = false, tempObj = {};
						if ($doc.height() > $win.height()) {
							$(that.el).findOrAppend(".loading.up.tablet", "<p class='loading up tablet' style='height:40px;'>加载更多...</p>")
						}
						$(this.el).find(".status-list")
							.on("touchend", function (e) {
								var _this = this,
									isLoadingOld = false,
									$parent = $(that.el);
								if (that.timeLine_type === "home") {
									$parent = $(".scrollable");
									isLoadingOld = $(".scrollable").scrollTop() && $(".scrollable").scrollTop() + $win.height() > $(_this).height() - 10;
								} else {
									isLoadingOld = $win.scrollTop() && $win.scrollTop() + $win.height() > $doc.height() - 20;
								}
								if (isLoadingOld) {
									if (updating_old) return;
									updating_old = true;
									var $loading = $(that.el).find(".loading.up.tablet")
									$loading.show()
									that.update(
										{
											url: that.url,
											older: true,
											count: 10,
											el: $(that.el),
											data: that.data,
											data_extend: that.data_extend || false,
											params: {addStorage: false, key: that.key},
											success: function (ret) {
												if (ret.length === tempObj.length) {
													$loading.hide();
													return
												} else {
													tempObj.length = ret && ret.length
												}
												that.data && that.data.page && that.data.page++;
												updating_old = false;
											},
											fail: function () {
												updating_old = false;
											}
										}
									)
								}
							})
					}
					break;
			}
		},
		remove: function (model, collection) {
			switch (this.app) {
				case "desktop":
					$(this.el).find('#status_' + model.id).remove();
					break;
				case "tablet":
					break;
			}
		}
	});

	SNB.Status = {
		attachEvent: function (options) {
			var $el = options && options.$el,
				$el = $el.closest("#main").length ? $el.closest("#main") : $el,
				app_type = options && options.app_type;
			if (app_type === "tablet") {
				var getStatus = function (target) {
					var target_arr = target.split("/")
					var model = options.collection.get(target_arr[target_arr.length - 1])
					var newStatus = model && model.attributes
					newStatus = _.isObject(newStatus) && newStatus.status || newStatus
					return newStatus
				}
				var bindEvent = function () {
					$el.hammer().off("holdend", ".status-list li").on("holdend", ".status-list li", function (e) {
						if (SNB.isScrolling) return false;
						if ($(this).data("holding")) {
							$(this).css({"background-color": "#f0f0f0"});
							var target = $(this).find(".createdAtTime").attr("data-target")
							var href = "http://xueqiu.com" + target;
							var newStatus = getStatus(target)
							var options_obj = {link: href};
							if (!_.isEmpty(newStatus)) options_obj.status = newStatus
							SNB.Util.callBrick(options_obj);
						}
						$(this).data("holding", false);
					}).off("hold", ".status-list li").on("hold", ".status-list li", function (e) {
						// 滑动的时候不要触发hold holdend 事件
						if (SNB.isScrolling) return false;
						$(this).data("holding", true);
						$(this).css({"background-color": "#e8e8e8"});
					}).off("tap", ".status-list li").on("tap", ".status-list li", function (e) {
						if (SNB.isScrolling) return false;
						$(this).css({"background-color": "#e8e8e8"});
						var that = this;
						var href = "";
						setTimeout(function () {
							$(that).css({"background-color": "#f0f0f0"});
						}, 500);
						var elmParent = $(e.target).parent()[0]
						var target = $(that).find(".createdAtTime").attr("data-target")
						var data_id = $(that).find(".createdAtTime").attr("data-id")
						if (e.target.tagName === "A" || (elmParent.tagName === "A")) {
							return;
						} else {
							href = "http://xueqiu.com" + target
						}
						href = href.search("#") === "-1" ? href.substr(0, href.search("#")) : href
						var newStatus = getStatus(data_id || target)
						var options_obj = {link: href};
						if (!_.isEmpty(newStatus)) options_obj.status = newStatus
						SNB.Util.callBrick(options_obj);
					}).off("click", ".status-list li a").on("click", ".status-list li a", function (e) {
						e.preventDefault();
						var a_link = this.href;
						if (a_link && a_link != "#") {
							var $li = $(this).closest("li")
							var target = $li.find(".createdAtTime").attr("data-target")
							var href = "http://xueqiu.com" + target;
							var newStatus = getStatus(target)
							if (a_link.match(/\/n\//) || a_link.match(/\k\?q=/)) {
								a_link = decodeURIComponent(a_link);
							}
							var options_obj = {link: a_link};
							if (!_.isEmpty(newStatus)) options_obj.status = newStatus
							SNB.Util.callBrick(options_obj);
						}
					}).off("drag", ".status-list li").on("drag", ".status-list li", function (e) {
						$(this).data("holding", false);
						$(this).css({background: "#f0f0f0"});
					});
				}
				var fileLoaded = typeof $.hammer !== "undefined";
				if (!fileLoaded) {
					$.getScript("//assets.imedao.com/js/jquery.hammer.js").done(function () {
						bindEvent()
						fileLoaded = true;
					}).fail(function () {
						fileLoaded = false;
					})
				} else {
					bindEvent()
				}
			}
		},
		expandStatus: function (el, model) {
			var $status = $(el);
			var $detail = $status.find(".detail");
			var $summary = $status.find(".summary");

			function fp ($detail, pdf, retweet) {
				var $fv = $detail.find('.flexpaper_viewer')
					, id = 'flexpaper_viewer_' + Math.random().toString().substring(2)
				if (!$fv.length) {
					$fv = $('<div class="flexpaper_viewer"><div class="fp_wrapper" id="' + id + '"></div><div class="flexpaper_mask"><div class="flexpaper_p"><div class="flexpaper_hint"><img src="//assets.imedao.com/images/ajax-loader.gif" />&nbsp;正在加载&nbsp;<span class="fp_loaded">0%</span></div></div></div></div>')
					$fv.data('pdf', pdf)
					var $fold = $detail.find('span.fold-all,span.fold-retweet')
					if ($fold.is('.fold-retweet')) $fold.before('<br>')
					$fold.before($fv)
					$fv.before('<br>')
					SNB.Util.pdfLink($fv, retweet ? model.get('retweeted_status').target : model.get('target'), retweet ? model.get('retweeted_status').title : model.get('title'))
					var id = id
					SNB.Util.pdfViewer(id, pdf)
				} else {
					var $fp = $fv.find('.fp_wrapper')
						, $m = $fp.data('mask')
					$fp.data('mask_removed', false)
					if (!$m || !$m.length) return
					$fv.append($m)
					$m.show()
					$m.find('.flexpaper_hint').show()
					setTimeout($fp.data('show'), 2000)
				}
			}

			$status.find(".show-all").click(function () {
				$detail.find("img.ke_img").each(function () {
					var that = this,
						image_href = $(that).attr("data-image");
					if (image_href) {
						$(that).attr("src", image_href);
						$(that).removeAttr("data-image");
					}
				})
				$detail.show();
				$summary.hide();
				if (!$detail.find(".zoom").length) {
					var imageElm = $detail.find("img");
					imageElm.each(function () {
						SNB.Image.zoomIn($(this))
					});
				}
				var pdf = model.get('pdf')
				if (pdf && !model.get('retweeted_status')) fp($detail, pdf, false)
			});
			$status.find(".fold-all, .detail .ke_img").click(function () {
				$detail.hide();
				$summary.show();
				if ($(this).hasClass("noshow")) {
					$status.find("img.show-all,img.show-retweet").hide()
				}
				var sot
				if ($win.scrollTop() > (sot = $status.offset().top)) {
					$win.scrollTop(sot - 40)
				}
			});
			if ($status.find(".retweet").length > 0) {
				var $re_detail = $status.find(".retweet .re-detail");
				var $re_summary = $status.find(".retweet .re-summary");
				var retweet = model.get('retweeted_status')
				$status.find(".show-retweet").click(function () {
					$re_detail.find("img.ke_img").each(function () {
						var that = this,
							image_href = $(that).attr("data-image");
						if (image_href) {
							$(that).attr("src", image_href);
							$(that).removeAttr("data-image");
						}
					})
					$re_detail.show();
					$re_summary.hide();
					if (!$re_detail.find(".zoom").length) {
						var imageElm = $re_detail.find(".ke_img");
						imageElm.each(function () {
							SNB.Image.zoomIn($(this))
						});
					}
					var pdf = retweet.pdf
					if (pdf) fp($re_detail, pdf, true)
				});
				$status.find(".fold-retweet, .re-detail .ke_img").click(function () {
					$re_detail.hide();
					$re_summary.show();
					var sot
					if ($win.scrollTop() > (sot = $status.offset().top)) {
						$win.scrollTop(sot - 40)
					}
				});
			}
		},
		destroy: function (e, id, callback,alertAsk) {
			var delDiag = $("#dialog-delete-status");
			var showText = "确定删除吗？";
			if(alertAsk){
				showText = "删除后钱不退还,将转给被提问者";
			}
			if (delDiag.length < 1) {
				var html = '<div id="dialog-delete-status" class="dialog-wrapper"><div class="tipsdivcontent" style="text-align:center;"><p class="message" style="text-align:center;">'+showText+'</p><div><input type="button" class="submit okButton" value="确定"/><input type="button" class="button cancelButton" value="取消"/></div></div></div>';
				$("body").append(html);
				delDiag = $("#dialog-delete-status");

				delDiag.find(".cancelButton").click(function () {
					delDiag.dialog("close");
				})
			}else{
				delDiag.find(".message").html(showText);
			}

			delDiag.find(".okButton").unbind("click").bind("click", function (event) {
				delDiag.dialog("close");
				SNB.post("/statuses/destroy/" + id + ".json", function (res) {
					if(res && res.error_code){
						SNB.Util.failDialog(res.error_description)
						return;
					}
					if (callback) {
						callback();
					}
				}, function () {
					alert("删除失败！");
				})
			});
			var that = $(e.target)
			delDiag.dialog({
				modal: 'true',
				minHeight: 50,
				width: 200,
				position: [that.offset().left - 110, (that.offset().top - $(document).scrollTop() - 110)]
			}).prev().hide();
		}
	};

	function parseComment (comment) {
		comment = typeof comment === "string" ? $.parseJSON(comment) : comment;
		if (!comment.user) return;
		//comment.user = SNB.Status.cleanUser(comment.user, {img_size: "30"});
		comment.user = SNB.Status.cleanUser(comment.user, {img_size: "60"});
		;
		comment.createdAt = SNB.Util.parseTime(comment.created_at);
		comment.text = SNB.Util.cleanContent(comment.text);
		return comment
	}

	SNB.Status.cleanUser = function (user, options) {
		return {
			img: SNB.Image.getProfileImage(user.profile_image_url, options && options.img_size),
			img_100: SNB.Image.getProfileImage(user.profile_image_url, 100),
			id: user.id,
			profile_image_url: user.profile_image_url,
			profile: user.profile,
			truncated: user.truncated,
			screen_name: user.screen_name,
			following: user.following,
			remark: user.remark || "",
			verified: user.verified,
			verified_type: user.verified_type,
			verified_description: user.verified_description
		}
	};

	SNB.Models.Comment = Backbone.Model.extend({
		sync: function (method, model, options) {
			switch (method) {
				case "create":
					var _data = {
						id: model.get("statusId"),
						comment: model.get("comment"),
						_: new Date().getTime(),
						forward: model.get("forward")
					};
					if (typeof SNB.data.comment_module_id !== "undefined") {
						_data.module_id = SNB.data.comment_module_id
					}
					options.url = "/service/poster"
					options.type = "post";
					options.data = {
						url: "/statuses/reply.json",
						data: _data
					};
					if (model.get("in_reply_to_comment_id")) {
						options.data.data.cid = model.get("in_reply_to_comment_id");
						options.data.data.split = true;
					}
					break;
				case "delete":
					options.url = '/service/poster'
					options.data = {
						url: "/comments/destroy/" + model.get("id") + ".json?_=" + new Date().getTime()
					}
					options.type = 'post'
					break;
				case "update":
					options.url = "/service/poster"
					options.type = 'post'
					options.data = {
						url: "/comments/edit.json",
						data: {
							text: model.get("text"),
							id: model.get("id"),
							_: new Date().getTime(),
							split: true
						}
					};
					options.success = function (self, status, xhr) {
						var ret_data = $.parseJSON(self);
						model.set({"text": ret_data.text})
						options.callback && options.callback()
					}
					options.error = function (self, status, xhr) {
						var error_data = self && self.responseText;
						error_data = $.parseJSON(error_data)
						SNB.Util.failDialog(error_data && error_data.error_description || "保存出错，请稍后重试")
					}
					break
			}
			return $.ajax(options);
		},
		parse: parseComment
	});

	SNB.Collections.Comments = Backbone.Collection.extend({
		model: SNB.Models.Comment,
		initialize: function (models, options) {
			if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
				this.app = "desktop"
			} else this.app = options.app
			this.statusId = options.statusId;
			this.commentLink = options.commentLink;
			this.commentContainer = options.commentContainer;
			this.in_reply_to_comment_id = options.in_reply_to_comment_id;
			this.page = this.page ? this.page : (options.page ? options.page : 1);
			this.maxPage = this.maxPage ? this.maxPage : (options.maxPage ? options.maxPage : 1);
			this.url = typeof options.url === "undefined" || !options.url ? "/statuses/comments.json?split=true&id=" + options.statusId : options.url;
		},
		updateCount: function (option) {
			switch (this.app) {
				case "desktop":
					if (this.commentContainer) {
						var counts = this.commentContainer.find(".counts");
						this.commentLink.innerHTML = SNB.Util.updateCount(this.commentLink.innerHTML, option);
						counts.text(SNB.Util.updateCount(counts.text(), option));
					}
					break;
				case "tablet":
					break;
			}
		},
		parse: function (ret) {
			var obj = (typeof ret === "string" ? $.parseJSON(ret) : ret);
			this.maxPage = obj.maxPage;
			this.page = obj.page;
			return _.map(obj.comments, parseComment)
		}
	});

	SNB.Templates.Comment = ''
		+ '<div class="headpic">'
		+ '<a target="_blank" href="' + SNB.domain.host + '{{=it.user.profile}}" target="_blank" data-name="{{=it.user.screen_name}}"><img width="30px" height="30px" src="{{=it.user.img}}"></a>'
		+ '</div>'
		+ '<div class="content">'
		+ "<div class='comment'>"
		+ '<a href="' + SNB.domain['host'] + '{{=it.user.profile}}" target="_blank" data-name="{{=it.user.screen_name}}">{{=it.user.screen_name}}'
		+ '<span class="user_remark" data-name="{{=it.user.screen_name}}" style="{{=it.user.remark ? "display:inline" : "display:none" }}">{{ if(it.reply_remark){ }}({{=it.reply_remark}}){{ } }}</span>'
		+ "{{ if (it.user.verified){ }}"
		+ "<img width='16px' height='16px'  class='vipicon' title='{{=it.user.verified_description}}' src='" + SNB.domain['static'] + "/images/vipicon_{{=it.user.verified_type || 1}}.png'/>"
		+ "{{ } }}"
		+ "</a>"
		+ "{{ if(it.reply_screenName) { }} 回复 "
		+ "<a href='" + SNB.domain['host'] + "/n/{{=it.reply_screenName}}' target='_blank'>"
		+ "{{=it.reply_screenName}}"
		+ '<span class="user_remark" data-name="{{=it.reply_screenName}}" style="{{=it.reply_remark ? "display:inline" : "display:none" }}">{{ if(it.reply_remark){ }}({{=it.reply_remark}}){{ } }}</span>'
		+ "{{ if (it.reply_verified){ }}"
		+ "<img width='16px' height='16px'  class='vipicon'  title='{{=it.reply_verified_description||''}}' src='" + SNB.domain['static'] + "/images/vipicon_{{=it.reply_verified_type||1}}{{= it.app_type === 'tablet' ? '@2x' : ''}}.png'/>"
		+ "{{ } }}"
		+ "</a>："
		+ "{{ } }}"
		+ "{{ else{ }}"
		+ "："
		+ "{{ } }}"
		+ "</div>"
		+ "<div class='cmt_con'>"
      + '<span>'
        + '{{ if(!it.truncated && !it.blocking) { }}{{=it.text}}{{ }else { }}<i>{{=it.text}}</i>{{ } }}'
				+ "{{ if(it.is_answer) { }}"
					+ "<span class='askstatement'></span>"
				+ "{{ } }}"
      + '</span>'
		+ "</div>"
		+ '<div class="ops">'
		+ "<div class='infos'>"
		+ '<span class="createAt" createdat="{{=it.created_at}}">{{=it.createdAt}}</span>'
		+ "{{ if ((it.user.id !== {{#def.uid}})) { }}"
		+ '<a href="#" class="reportSpam_comment last">举报</a>'
		+ "{{ } }}"
		+ '</div>'
		+ '{{ if(!it.truncated) { }}'
		+ "{{ if ((it.user.id == {{#def.uid}}) && it.canEdit) { }}"
		+ '<a href="#" class="editComment">修改</a>'
		+ "{{ } }}"
		+ "{{ if({{#def.uid}}){ }}"
		+ "{{ if (it.user.id == {{#def.uid}} || {{#def.uid}} == {{#def.status_user_id}} || {{#def.uid}} == {{#def.retweeted_status_user_id}}) { }}"
		+ '{{ if(it.user.id !== {{#def.uid}}) { }}'
		+ '<a href="#" class="deleteComment" canBlock="true" blockUserId="{{=it.user.id}}">删除</a> '
		+ '{{ }else { }}'
		+ '<a href="#" class="deleteComment">删除</a> '
		+ '{{ } }}'
		+ "{{ } }}"
		+ "{{ } }}"
		+ '{{ if(it.reply_screenName) { }}'
		+ '<a href="#" class="talk">查看对话</a>'
		+ '{{ } }}'


		+ '{{ if(it.user.id != {{#def.uid}}) { }}'
			+ '<a href="#" class="btn-reward" data-id="{{= it.id }}" data-statusid="{{= it.statusId}}">'
    + '{{ } else { }}'
      + '<a href="#" class="btn-reward self" data-id="{{= it.id }}" data-statusid="{{= it.statusId}}" data-uid="{{=it.user.id}}">'
    + '{{ } }}'
					+ '打赏'
					+ '{{ if (it.reward_count) { }}'
						+ '<span class="number">(<em class="snow-coin" data-count="{{= it.reward_count}}">{{= it.reward_count}}</em>)</span>'
					+ '{{ } else { }}'
						+ '<span class="number" style="display:none;">(<em class="snow-coin" data-count="0">0</em>)</span>'
					+ '{{ } }}'
			+ '</a>'

		+ '<a href="#" class="reply last">回复</a>'
		+ '{{ } }}'
		+ '</div>'

		+ '</div>'
		+ "{{ if ((it.user.id == {{#def.uid}}) && it.canEdit) { }}"
		+ '<div style="display:none" class="editarea">'
		+ '<textarea class="comment_edit"></textarea>'
		+ '<div class="ops">'
		+ '<span class="showFaceButton">&nbsp;</span>'
		+ '<span class="addStock">&nbsp;</span>'
		+ '<a href="#" class="comment_cancel">取消</a>'
		+ '<input type="button" class="button comment_save" value="保存"/>'
		+ '</div>'
		+ '</div>'
		+ "{{ } }}";

	SNB.Views.Comment = Backbone.View.extend({
		initialize: function (options) {
			if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
				this.app = "desktop"
			} else this.app = options.app
			this.model.statusId = options && options.statusId;
			_.bindAll(this, "render");
			this.model.bind('destroy', this.remove, this);
		},
		tagName: "li",
		events: {
			'click .editComment': 'edit',
			'click .talk': 'talk',
			'click .reply': 'reply',
			'click .like': 'like',
			'click .unlike': 'unlike',
			'click .reportSpam_comment': 'reportSpam',
			'click .deleteComment': 'destroy',
			'click .submit_reply': 'submit_comment',
			'click .comment_cancel': 'cancel',
			'click .comment_save': 'save',
			'click .btn-donate': 'donate',
			'click .btn-reward': 'reward'
		},
		render: function () {
			switch (this.app) {
				case "desktop":
					var commentJSON = this.model.toJSON();
				

					if (commentJSON.blocked || (commentJSON.user && commentJSON.user.truncated)) {
						return {};
					}

					var coin = commentJSON.donate_snowcoin;

					if (coin > 9999) {
						if (coin % 10000 > 99) {
							coin = (coin / 10000).toFixed(2) + '万';
						} else {
							coin = Math.floor(coin / 10000) + '万';
						}
					}

					SNB.Templates.commentFunc = doT.template(SNB.Templates.Comment, undefined, {
						uid: SNB.currentUser.id || 0,
						uname: SNB.currentUser.screen_name,
						status_user_id: SNB.data.status_user_id,
						retweeted_status_user_id: SNB.data.retweeted_status_user_id || 0,
						coin: coin
					});

					$(this.el).html(SNB.Templates.commentFunc(this.model.toJSON()));
					this.$(".content").show();
					this.$(".editarea").hide();
					return this;
					break;
				case "tablet":
					break;
			}
		},
		like: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this,
						comment_id = this.model.id,
						$elm = $(e.target),
						like_count = $elm.attr("like_count"),
						current_like_count = parseInt(like_count) + 1;
					SNB.Util.checkLogin(function () {
						if (!$elm.data("processing")) {
							$elm.data("processing", 1)
						} else return;
						SNB.post("/comments/like.json", {id: comment_id}, function (ret) {
							$elm.data("processing", 0)
							$elm.text("已赞(" + current_like_count + ")").removeClass("like").addClass("unlike").attr("like_count", current_like_count)
						}, function (ret) {
							$elm.data("processing", 0)
							SNB.Util.failDialog(ret.error_description)
						})
					})
					break;
				case "tablet":
					break;
			}
		},
		unlike: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this,
						comment_id = this.model.id,
						$elm = $(e.target),
						like_count = $elm.attr("like_count"),
						current_like_count = parseInt(like_count) - 1;
					SNB.Util.checkLogin(function () {
						if (!$elm.data("processing")) {
							$elm.data("processing", 1)
						} else return;
						SNB.post("/comments/unlike.json", {id: comment_id}, function (ret) {
							$elm.data("processing", 0)
							var text_count = like_count > 1 ? "(" + current_like_count + ")" : "";
							$elm.text("赞" + text_count).removeClass("unlike").addClass("like").attr("like_count", current_like_count)
						}, function (ret) {
							$elm.data("processing", 0)
							SNB.Util.failDialog(ret.error_description)
						})
					})
					break;
				case "tablet":
					break;
			}
		},
		edit: function (e) {
			switch (this.app) {
				case "desktop":
					var that = this
					e.preventDefault();
					e.stopPropagation();
					this.$(".content").hide();
					var content = SNB.Util.reparseContent(this.model.get("text").replace(/<br\/?>/gi, "\n").replace(/&nbsp;/gi, " "));
					var that = this
					require.async('SNB.editor.js', function (editor) {
						var ta = that.ta = editor.init(that.$(".editarea"), {
							autoResize: 50, content: content, $emotion: that.$('.showFaceButton'), $stock: that.$('.addStock'), focus: true, ctrlReturn: true, submitFunc: function () {
								that.$('.comment_save').trigger('click')
							}
						})
						$.browser.isMobile || ta.upgrade()
					})
					break;
				case "tablet":
					break;
			}
		},
		talk: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this ,
						options = {
							id: that.model.get("retweet_status_id") || that.model.get("root_in_reply_to_status_id"),
							comment_id: that.model.get("id"),
							count: 20,
							asc: "false"
						}
					var $dialog_talk = $(""
						+ "<div id='dialog_talk' class='dialog_talk'>"
						+ "<div class='talkContainer commentContainer'>"
						+ "<div style='display:none' class='loading_talk loading'>正在加载对话...</div>"
						+ "<div class='talk_bd'></div>"
						+ "</div>"
						+ "</div>");
					if ($("#dialog_talk").length) {
						$dialog_talk = $("#dialog_talk")
						$dialog_talk.find(".talk_bd").empty().end()
							.find(".talkContainer").removeClass("showScrollBar").end()
							.dialog()
					} else {
						$dialog_talk.dialog({
							title: "查看对话",
							modal: true,
							minHeight: 50,
							height: "auto",
							width: 558
						});
					}
					$dialog_talk.closest(".ui-dialog").css({"position": "fixed", "top": document.documentElement.clientHeight - 650 < 0 ? "75px" : "150px"})
					var fetchTalks = function (data) {
						$dialog_talk.find(".loading_talk").show().end()
							.find(".talk_bd").empty().end()
							.find(".talkContainer").removeClass("showScrollBar")
						SNB.get("/statuses/talks.json", data, function (ret) {
							$dialog_talk.find(".loading_talk").hide()
							var $talkContainer = $(".dialog_talk .talkContainer"),
								$talk_bd = $talkContainer.find(".talk_bd")
							if (ret.comments.length === 0) {
								$talk_bd.html("<p class='notalks'>对话原文已被删除</p>");
								return;
							}
							_.chain(ret.comments)
								.reverse()
								.map(function (comment) {
									parseComment(comment)
								})
							var talk_col = new SNB.Collections.Comments(ret.comments, {
								statusId: data.id,
								page: ret.page,
								maxPage: ret.maxPage,
								commentLink: $(".statusComment")[0],
								commentContainer: $talk_bd
							});
							var $talkList = $("<ul class='commentList talkList'> </ul>")
							talk_col.each(function (talk_obj) {
								$talkList.append(
									(new SNB.Views.Comment({model: talk_obj, id: "comment_" + talk_obj.id, statusId: that.model.statusId})).render().el
								);
							});
							$talk_bd.append($talkList)
							$talkList = $talk_bd.find(".commentList");
							$talkList.on("click", ".reply", function (e) {
								var reply_offset_top = $(e.target).offset().top,
									talkBd_offset_top = $talk_bd.offset().top,
									talkCont_scroll_top = $dialog_talk.find(".talkContainer").scrollTop(),
									offset_top = reply_offset_top - talkBd_offset_top - talkCont_scroll_top;
								temp = 158 - (400 - offset_top)
								if (temp > 0) {
									$talkContainer.scrollTop(talkCont_scroll_top + temp)
								}
							})
							$talkContainer.on("mousewheel", function (e) {
								e.stopPropagation()
								e.preventDefault()
								var nScrollTop = $(this)[0].scrollTop;
								$(this).scrollTop(nScrollTop - e.originalEvent.wheelDelta / 5)
								return false;
							})
							if (talk_col.maxPage > 1) {
								$talkList.append($(SNB.Pager(talk_col.page, talk_col.maxPage)).find("a").on("click", function (e) {
									e.preventDefault()
									var $pager = $(e.target),
										data_page = $pager.attr("data-page");
									options.page = data_page;
									fetchTalks(options);
								}).end())
							} else {
								var $lastComments = $talkList.find("#comment_" + talk_col.last().id);
								$lastComments.addClass("last");
								setTimeout(function () {
									$lastComments.css("background-color", "#fff");
								}, 200)
							}
							if ($talkList.height() > 400) {
								$talkContainer.addClass("showScrollBar").scrollTop($talkList.height());
							}
						})
					}
					fetchTalks(options)
					break;
				case "tablet":
					break;
			}
		},
		reportSpam: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this;
					var options = {
						id: that.model.get("id"),
						type: 1,
						user_name: that.model.get("user") ? that.model.get("user").screen_name : "",
						img: that.model.get("user") ? that.model.get("user").img : "//xavatar.imedao.com/community/default/avatar.png!100x100.png",
						title: "",
						content: that.model.get("description")
					};
					SNB.Util.reportSpam(options, function () {
					});
					break;
				case "tablet":
					break;
			}
		},
		reply: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this;
					SNB.Util.checkLogin(function () {
						var that_el = that.el;
						if ($(that_el).hasClass("display_textarea")) {
							$(that_el).find(".commentPostArea").toggle();
							ta && ta.reset('', true)
							return;
						}
						$(that_el).append(SNB.Templates.commentPostArea).addClass("display_textarea");
						that.$('.commentSubmit').removeClass("commentSubmit").addClass('submit_reply');
						that.statusId = that.model.statusId;
						that.in_reply_to_comment_id = that.model.get("id");
						require.async('SNB.editor.js', function (editor) {
							ta = that.ta = editor.init(that.$('.inputArea'), {
								$emotion: that.$('.showFaceButton'), $stock: that.$('.addStock'), ctrlReturn: true, submitFunc: _.bind(function () {
									that.$(".submit_reply").click()
								}, that, {}), autoResize: 50
							})
							var $body = $(that.el).closest('body');
							if ($body.is('#widget-comment') && $.browser.msie) $body.addClass('ie')
							$.browser.isMobile || ta.upgrade(function () {
								ta.reset('', true)
							})
						})
					})
					break;
				case "tablet":
					break;
			}
		},
		submit_comment: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this;
					that.submitBtn = that.$("input[type='submit']")
					SNB.Comment.submit_comment(that, e);
					break;
				case "tablet":
					break;
			}
		},
		destroy: function (e) {
			switch (this.app) {
				case "desktop":
					var self = this,
						$target = $(e.target),
						canBlock = $target.attr("canBlock"),
						_top = canBlock ? 20 : 0;
					console.log(self);
					if(self.model.attributes&&self.model.attributes.paid_mention&&self.model.attributes.paid_mention[0].state=="UNANSWERED"&&self.model.attributes.user_id==SNB.currentUser.id){
						e.target.setAttribute("alertask","true");
					}
					SNB.Util.deleteDialog(e.target, function () {
						self.model.collection.updateCount(-1);
						self.model.destroy();
						self.remove();
					}).dialog({
						modal: 'true',
						minHeight: 50,
						width: 200,
						position: ([$target.offset().left - 100, $target.offset().top - $(document).scrollTop() - 105 - _top])
					}).prev().hide();
					return false;
					break;
				case "tablet":
					break;
			}
		},
		cancel: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					this.$(".content").show();
					this.$(".editarea").hide();
					break;
				case "tablet":
					break;
			}
		},
		save: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var that = this;
					var content = SNB.Util.cleanContent(that.ta.getContent(), false, that.ta.editor)
					that.model.save({text: content }, {
						callback: function () {
							that.render()
						}
					});
					break;
				case "tablet":
					break;
			}
		},
		donate: function (e) {
			e.preventDefault();

      var $this = $(e.target).is('.btn-donate')? $(e.target): $(e.target).parents('.btn-donate');

      clearTimeout($this.data('timeout'));

      if ($this.is('.self')) {
        return false;
      }

			var comment = this.model.toJSON();
			var that = this;

			function User (user) {
				var avatars = user.profile_image_url.split(','),
					url = SNB.domain.host + user.profile,
					avatar = avatars[0].replace('!50x50.png', '');

				return {
					id: user.id,
					name: user.screen_name,
					avatar: SNB.domain.photo + '/' + avatar + '!100x100.png',
					url: url
				};
			}

      var user = User(SNB.currentUser),
        data = {
          id: comment.id,
          type: 'comment',
          user: comment.user,
          uri: SNB.data.status ? SNB.domain.host + SNB.data.status.target + '#' + comment.id : $this.parents('li').find('.status_content .time').attr('href') + '#' + comment.id,
          status: SNB.data.status
        };

			function callback (amount) {
				var $user = '<li class="donator-item donator-' + user.id + '"><a href="' + user.url + '" data-name="' + user.name + '"><img src="' + user.avatar + '" width="30"></a></li>';
				var $list = $(that.el).find('.comment-donator-list');
				var $comment = $(that.el);
				var $tip = $comment.find('.donators-tip');
				var $number = $comment.find('.ops .number');
				var $donatorsCount = $comment.find('.donators-count');
				var $coin = $comment.find('.snow-coin:first');

				$tip.show();
				$number.show();

				var coin = $coin.data('count') || 0;
				coin = (coin - 0) + (amount - 0);

				$comment.find('.snow-coin').data('count', coin);

				if (coin > 9999) {
					if (coin % 10000 > 99) {
						coin = (coin / 10000).toFixed(2) + '万';
					} else {
						coin = Math.floor(coin / 10000) + '万';
					}
				}

				$comment.find('.snow-coin').text(coin);

				if (!$list.find('.donator-' + user.id).length) {
					$list.append($user);

					var _count = ($donatorsCount.text() - 0) + 1;
					$donatorsCount.text(_count);
				}
			}

			SNB.Util.checkLogin(function () {
				Donate(data, function (amount) {
					callback(amount);
				});
			});
		},
		reward: function (e) {
			e.preventDefault();

			var $this = $(e.target).is('.btn-reward')? $(e.target): $(e.target).parents('.btn-reward');

			clearTimeout($this.data('timeout'));

			if ($this.is('.self')) {
				SNB.Util.failDialog("不能打赏自己的评论");
				return false;
			}

			var comment = this.model.toJSON();

			SNB.Util.checkLogin(function () {
				Reward.payModal({
					pay: {
						cid: comment.id,
						type: 'comment',
						id:comment.root_in_reply_to_status_id
					},
					complete: function (pay) {
						console.log('完成',pay);
						//更新评论
						$this.closest('.commentInfo').find('.sort a[class="active"]').click();
					}
				});
				$('#payAmountModal').trigger('modal:show');
			});
		}
	});

	var lastContent,
		lastStatusId;

	SNB.Templates.commentPostArea = '' +
		'<div class="commentPostArea">'
		+ '<div class="arrow-top">'
		+ '<span class="arrow-top-out"></span>'
		+ '<span class="arrow-top-in"></span>'
		+ '</div>'
		+ '<div class="inputArea"><textarea class="commentEditor" ></textarea></div>'
		+ '<p class="forbidden" style="display:none">由于用户的设置，你不能对主贴进行评论</p>'
		+ '<span class="showFaceButton">&nbsp;</span>'
		+ '<span class="addStock">&nbsp;</span>'
		+ '<label><input type="checkbox" name="forward"/>同时转发到我的首页 </label>'
		+ '<form class="replyForm" action="" method="get" >'
		+ '<input type="submit" class="commentSubmit button"  value="发布"/>'
		+ '</form>'
		+ '<div class="fixit"></div>'
		+ '</div>';

	SNB.Templates.Comments = SNB.Templates.commentPostArea
		+ "<div class='loading' style='display:none'></div>"
		+ "<div class='goodCommentInfo' data_limit=1 style='display:none'>"
		+ "<h4 class='hd'>精彩评论</h4>"
		+ '<ul class="commentList"></ul>'
		+ "</div>"
		+ "<div class='commentInfo' style='display:none'>"
		+ "<div class='hd'>"
		+ "<span class='sort'>"
		+ "<span>排序：</span>"
		+ "<a href='javascript:;' sort='false' class='active' title='最近'>最近</a>"
		+ "<a href='javascript:;' sort='true' title='最早'>最早</a>"
		+ "<a href='javascript:;' sort='like' title='赞' class='last'>赞助</a>"
		+ "</span>"
		+ "<span class='commentNum'>全部评论<span class='counts'></span></span>"
		+ "</div>"
		+ "<div class='loading' style='display:none'></div>"
		+ '<ul class="commentList"></ul>'
		+ "</div>";

	SNB.Views.CommentInfo = Backbone.View.extend({
		initialize: function (options) {
			if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
				this.app = "desktop"
			} else  this.app = options.app
			this.statusId = options && options.statusId;
			this.collection.view = this;
			this.collection.bind("reset", this.render, this);
			this.collection.bind("add", SNB.Comment.addComment, this);
			this.collection.commentTo = options.commentTo;
		},
		events: {
			'click .sort a': 'sortComments'
		},
		render: function () {
			switch (this.app) {
				case "desktop":
					var that = this,
						$el = $(that.el),
						$commentContainer = $el.closest(".commentContainer"),
					  col_length = that.collection.length,
						elm = that.collection.commentLink;

					var $comments = $("<ul class='commentList'></ul>");
					that.collection.each(function (comment) {
						if (!comment.get("user")) return
						$comments.append(
							(new SNB.Views.Comment({model: comment, id: "comment_" + comment.id, statusId: that.statusId, parentView: that})).render().el
						);
						if(SNB.askstatement&&comment.attributes.is_answer){
							$comments.find('.askstatement').html(comment.attributes.is_refused?SNB.askstatement.refuse:SNB.askstatement.statement);
						}
						//问答,tip
						if(comment.attributes.is_answer&&!comment.attributes.is_refused){
							var $item = $comments.find('#comment_'+comment.attributes.id);
							if(comment.attributes.in_reply_to_comment_id&&comment.attributes.in_reply_to_comment_id>0&&comment.attributes.reply_comment){
								$item.data('quiz-uid',comment.attributes.reply_comment.user_id);
							}else{
								var $status=$('#status_'+comment.attributes.rqid);
								$item.data('quiz-uid',$status.find('.headpic a').data('id'));
							}
						}
					});
					if ($el.attr("data_limit") === "1") {
						that.collection.maxPage = 1;
					}
					if (that.collection.maxPage > 1) {
						$comments.append($(SNB.Pager(this.collection.page, this.collection.maxPage, {jump: true})).find("a").click(function (e) {
							e.preventDefault();
							var page = $(this).attr("data-page");
							SNB.Comment.emptyCommentList(that.$(".commentList"))
							$body = $.browser.webkit ? $body : $("html")
							$body.animate({
								scrollTop: $el.offset().top - 30
							}, 200);
							$el.find('.loading').show();
							that.collection.fetch({data: {page: page, asc: SNB.data.sort || "false"}});
						}).end()).delegate('.jump_input input', 'keydown', function (evt) {
							if (evt.keyCode != 13) return;
							var val = $(this).val(),
								self = this;
							val = typeof val === "string" ? parseInt(val) : val;
							if (isNaN(val) || val > that.collection.maxPage) {
								SNB.Util.failDialog('请输入正确的页码', null, function () {
									$(self).select();
								});
								return
							}
							$el.find('.loading').show();
							that.collection.fetch({data: {page: val, asc: SNB.data.sort || "false"}});
							SNB.Util.scrollTop($el, {top: 45});
						});
					} else {
						$comments.find("li:last").addClass("last")
					}
					setTimeout(function(){
            $commentContainer.find('.loading').hide();
          },1);
					if (col_length) {
						$el.find(".commentList").replaceWith($comments).end().show();
						SNB.Comment.renderNoComment(that.collection, $el)
					}
					break;
				case "tablet":
					break;
			}
		},
		sortComments: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault();
					var elm = e.target,
						that = this,
						options = {},
						parent = $(elm).parent(".sort"),
						sort = $(elm).attr("sort");
					$(elm).addClass("active").siblings().removeClass("active");
					SNB.Comment.emptyCommentList(that.$(".commentList"))
					that.$(".loading").show()
					SNB.data.sort = sort;
					if (sort === "like") {
//						that.collection.url = SNB.domain.base + "/statuses/comments_by_donate.json?id=" + that.collection.statusId;
						that.collection.url = "/service/comments_by_donate?id=" + that.collection.statusId;
					} else {
//						that.collection.url = SNB.domain.base + "/statuses/comments.json?split=true&asc=" + sort + "&id=" + +that.collection.statusId
						that.collection.url = "/service/comments?split=true&asc=" + sort + "&id=" + +that.collection.statusId;
					}
					that.collection.fetch();
					break;
				case "tablet":
					break;
			}
		}
	});

	SNB.Views.Comments = Backbone.View.extend({
		initialize: function (options) {
			if (typeof options === "undefined" || (typeof options === "object" && typeof options.app === "undefined")) {
				this.app = "desktop"
			} else this.app = options.app
			this.collection.view = this;
			this.collection.bind("reset", this.render, this);
			this.collection.bind("add", SNB.Comment.addComment, this);
			this.collection.commentTo = options.commentTo;
			this.statusId = options.statusId || 0;
			this.commentLink = options.commentLink;
		},
		events: {
			'click .commentSubmit': 'submitComment'
		},
		template: SNB.Templates.Comments,
		render: function (nofetch) {
			switch (this.app) {
				case "desktop":
					var that = this, $commentContainer = $(that.el)
					$commentContainer.findOrAppend(".commentInfo", SNB.Templates.Comments).show();
					$commentContainer.find('.loading').show();
					var col_text = $(that.commentLink).text().match(/\d+/ig),
						comments_count = col_text && parseInt(col_text) || 0;
					if (comments_count) {
						$commentContainer.find(".counts").text("（" + comments_count + "）");
					}
					that.collection.rootStatusId = that.collection.statusId;
					if (!SNB.currentUser.isGuest) {
						SNB.get("/statuses/allow_reply.json", {status_id: that.collection.statusId}, function (ret) {
							if (!ret.success) {
								$commentContainer.find("textarea").prop("disabled", "disabled");
								$commentContainer.find(".forbidden").show();
							}
						});
					}

					var  renderComment = function (data_comments, $commentInfo, url, callback) {
						var comments = data_comments && data_comments.comments || [],
							page = data_comments && data_comments.page || 1,
							maxPage = data_comments && data_comments.maxPage || 1;

						var commentsInfoCol = new SNB.Collections.Comments(comments, {
							url: url,
							page: page,
							maxPage: maxPage,
							statusId: that.statusId,
							commentLink: that.commentLink,
							commentContainer: $commentInfo
						});

						var commentsInfoView = new SNB.Views.CommentInfo({
							el: $commentInfo,
							collection: commentsInfoCol,
							statusId: that.statusId
						});


						commentsInfoView.render();


						if (typeof callback === 'function') {
							callback();
						}

						if (nofetch !== 1 && typeof data_comments === "undefined") {
							$commentContainer.find('.commentInfo .loading').show();
							commentsInfoCol.fetch();
						}
					};

					var $goodComment = $commentContainer.find(".goodCommentInfo"),
						$allComment = $commentContainer.find(".commentInfo");

					if (comments_count > 5) {
						renderComment(SNB.data.goodComments, $goodComment, "/statuses/comments_by_donate.json?count=5&filtered=true&id=" + that.statusId, $.noop());
					}

					renderComment(SNB.data.comments_loaded && SNB.data.comments, $allComment, '/service/comments?reply=true&filtered=true&id=' + that.statusId, $.noop());
//					renderComment(SNB.data.comments_loaded && SNB.data.comments, $allComment, '', $.noop());

					var $textarea = $commentContainer.find("textarea")
						, ta;
					require.async('SNB.editor.js', function (editor) {
						ta = that.ta = editor.init($commentContainer.find('.inputArea'), {
							$emotion: $commentContainer.find('.showFaceButton'), $stock: $commentContainer.find('.addStock'), ctrlReturn: true, submitFunc: _.bind(function () {
								$commentContainer.find("input.commentSubmit").click();
							}, that, {}), autoResize: 50
						})
						var $body = $(that.el).closest('body')
						if ($body.is('#widget-comment') && $.browser.msie) $body.addClass('ie')
						if (!$body.is('#jade-single') && !$body.is('#widget-comment')) {
							$.browser.isMobile || ta.upgrade()
						}
					})
					if (SNB.data.comment_forward) {
						$commentContainer.find(".commentPostArea input[type=checkbox]").prop("checked", true);
					}
					break;
				case "tablet":
					break;
			}
		},
		toggle: function () {
			switch (this.app) {
				case "desktop":
					var that = this, $commentContainer = $(that.el)
					$commentContainer.toggle()
					break;
				case "tablet":
					break;
			}
		},
		submitComment: function (e) {
			switch (this.app) {
				case "desktop":
					e.preventDefault()
					var that = this;
					that.submitBtn = $(e.target)
					that.statusId = that.collection.statusId;
					that.in_reply_to_comment_id = that.collection.in_reply_to_comment_id;
					SNB.Comment.submit_comment(that, e)
					break;
				case "tablet":
					break;
			}
		}
	});

	SNB.Comment = {
		blockUser: function (id) {
			SNB.post("/blocks/create.json", {user_id: id}, function () {
			})
		},
		emptyCommentList: function ($commentList) {
			var commentList_height = $commentList.height() < 2000 ? 2000 : $commentList.height()
			$commentList.height(commentList_height).empty()
		},
		renderNoComment: function (col_comments, $el) {
			var col_length = col_comments.length,
				temp = 0
			col_comments.each(function (comment) {
				if (comment.get("blocked")) ++temp
			})
			if (temp === col_length) {
				$el.find(".commentList").html("<li class='noComment'>评论中有用户已被加入黑名单列表，其评论内容不显示。</li>")
			}
		},
		addComment: function (comment) {
			var $commentContainer = comment.collection.commentContainer;
			$commentContainer = $commentContainer.closest(".commentContainer")
			var $commentInfo = $commentContainer.find(".commentInfo");
			$commentInfo.find(".commentList").prepend((new SNB.Views.Comment({model: comment, statusId: this.statusId})).render().el);
			$commentInfo.show().find(".noComment").hide()
		},
		createComment: function (that, collection, model, callback) {
			var ta = that.ta;
			model.statusId = that.statusId;
			collection.create(model, {
				success: function (self) {
					self.collection.updateCount(+1);
					if (!that.$(".commentSubmit").attr("hideCommentInfo")) {
						that.$(".commentInfo").show();
					}
					that.submitBtn.prop("disabled", false);
					SNB.Util.stateDialog("回复成功", 1000, function () {
					}, false, 110, [that.elmTarget.offset().left - 45, that.elmTarget.offset().top - $(window).scrollTop() - 60], 110);
					callback && callback();
					ta.reset("", false)
				},
				error: function (self, status, xhr) {
					var error_data = status && status.responseText;
					if (typeof error_data !== "object") {
						error_data = $.parseJSON(error_data)
					}
					that.submitBtn.prop("disabled", false);
					if (error_data.error_code) {
						SNB.Util.failDialog(error_data.error_description);
					} else {
						SNB.Util.failDialog("服务器出错，请重试。");
					}
				}
			});
		},
		submit_comment: function (that, e) {
			e.preventDefault();
			var elm = e.target
				, ta = that.ta
				, statusId = that.statusId || $(that.el).data('statusId')
				, content = SNB.Util.cleanContent(ta.getContent(), false, ta.editor)
			if (content == lastContent && statusId == lastStatusId) {
				SNB.Util.failDialog("重复发布评论", 100);
				return
			}
			that.statusId = statusId;
			lastContent = content;
			lastStatusId = statusId;
			that.submitBtn.prop("disabled", true);
			SNB.Util.checkLogin(function () {
				SNB.get("/statuses/allow_reply.json", {status_id: statusId}, function (ret) {
					if (ret.success) {
						var commentTo = $.trim($(elm).data('commentTo')) || ''
						if (!content) {
							SNB.Util.failDialog("评论不能为空！");
							that.submitBtn.prop("disabled", false);
							return false;
						}
						var repost = that.$('input[name=forward]:checked').length > 0 ? 1 : 0,
							model = {
								statusId: statusId,
								comment: content,
								in_reply_to_comment_id: that.in_reply_to_comment_id,
								forward: repost
							};
						if (commentTo && SNB.Util.isContentSame(content, commentTo)) {
							SNB.Util.failDialog("请输入内容再发布");
							that.submitBtn.prop("disabled", false);
							return false;
						}
						if (commentTo && !~content.replace(/\u00a0|\u0020|&nbsp;/g, '').indexOf(commentTo)) delete model.in_reply_to_comment_id
						if ($(elm).is(".submit_reply")) {
							that.elmTarget = that.$(".reply");
							SNB.Comment.createComment(that, that.model.collection, model, function () {
								that.$(".commentPostArea").hide();
							});
						} else {
							that.elmTarget = $(elm);
							SNB.Comment.createComment(that, that.collection, model);
						}

					} else {
						that.submitBtn.prop("disabled", false);
						SNB.Util.failDialog("对方不允许评论");
					}
				});
			}, e);
		},
		showLoginTip: function ($commentContainer) {
			var loginDialog = "<div class='loginDialog'><p>参与讨论，请先 <a href='/' id='openLoginDialog'>登录</a> | <a href='/account/reg'>注册</a></p></div>"
			$commentContainer.find(".commentEditor").prop('disabled', 'disabled')
			$commentContainer.find(".inputArea").append(loginDialog).addClass("notlogined");
			var $loginDialog = $commentContainer.find(".loginDialog")
			$commentContainer.find(".loginDialog").css("left", $commentContainer.width() / 2 - $loginDialog.width() / 2)
		}
	};

});
