define('SNB.typeahead.js', [], function (require, exports, module) {  if (typeof $.fn.typeahead !== "undefined") {
    var $typeahead = $(".typeahead");
    var eventInited = false;
		$typeahead.typeahead({
      top: 4,
      items: 15,
      match: false,
      sort: false,
      source: function (typeahead, query) {
        var searchText = $.trim($(".typeahead").val()).replace(/&/g, '&amp').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g,"");

        if (!searchText) {
          return false;
        }

        var data = {
          code: searchText,
          size: 5
        };
        var getStockData= SNB.get("/stock/search.json", data, function (stockData) {});

        var getUserData = SNB.get("/users/search/suggest.json",{q: searchText, count: 3}, function (userData) {});

        var getGroupData = SNB.get("/imgroups/search.json",{q: searchText, count:3, sg:1}, function(groupData){});

        return $.when(getStockData,getUserData,getGroupData).then(function(stockData, userData, groupData){
          stockData = typeof stockData[0] !== "object" ? $.parseJSON(stockData[0]) : stockData[0];
          userData = typeof userData[0] !== "object" ? $.parseJSON(userData[0]) : userData[0];
          groupData = typeof groupData[0] !== "object" ? $.parseJSON(groupData[0]) : groupData[0];
          var stocks = stockData.stocks;
          var names = _.pluck(stocks,"name"),
            codes = _.pluck(stocks,"code"),
            arrays = [];

          for(var i = 0;i < names.length; i++){
            arrays.push(names[i] + "(" + codes[i] + ")" )
          }

          _.each(userData.users, function (user) {
            arrays.push({isUser: true, user: user})
          })
          _.each(groupData.list, function (group){
            arrays.push({isGroup:true, group:group});
          })

          return query(arrays);
        });
      },
      _render: function(items,that){
        var $elm = $(".typeahead");
        var $user = $("<ul>");
        var $group = $("<ul>");
        if($elm.val() === $elm.attr("placeholder") || $.trim($elm.val()) === "") return that.hide();

        var groupObj = _.filter(items,function(item){return typeof item === "object" && !!item.isGroup});
        var userObj = _.filter(items,function(item){return typeof item === "object" && !!item.isUser});
        items = _.filter(items,function(item){return typeof item === "string"});

        //用户备注搜索
        _.forEach(userObj,function(searchUser){
          var user = searchUser.user;
          user.profile_image_url = SNB.Image.getProfileImage(user.profile_image_url,30);
          var $li = $("<li class='user' data-value='"+user.remark+"'><a href='"+user.profile+"' target='_blank'><img src='"+user.profile_image_url+"' width=30 height=30/><span style='margin-left:6px'>"+user.screen_name+ (user.remark ? "("+user.remark+")" : "") + "</span></a></li>")
          $user.append($li)
        });

        _.forEach(groupObj,function(searchGroup){
          var group = searchGroup.group;
          var $li = $("<li class='group' ><a href='/g/"+group.id+"' target='_blank'><img src='"+group.profile_image_url_60+"' width=30 height=30/><span style='margin-left:6px'>"+group.name + "</span></a></li>")
          $group.append($li)
        })

        items = $(items).map(function (i, item) {
          i = $(that.options.item).attr('data-value', item);
          var data_value = i.attr("data-value"),
              code = data_value.match(/\(([^(]*)\)$/g);
          code = code && code[0].substr(1,code[0].length - 2);
          i.find('a').html(that.highlighter(item)).attr("href","http://xueqiu.com/S/"+code);
          return i[0]
        })
        var $temp = $("<ul>");
        if(items.length){
          $temp.append('<li class="no_menu"><h3 class="stock">股票</h3></li>')
               .append(items)
        }

        //群组搜索

        var query = that.query.replace(/&/g, '&amp').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        $temp.append(
              '<li class="no_menu"><h3 class="content">讨论</h3></li>'
              + "<li data-value='"+query+"'><a href='http://xueqiu.com/k?q="+encodeURIComponent(query)+"'target='_blank'>搜索<strong>&nbsp;"+query+"&nbsp;</strong>相关讨论</a></li>"
              + '<li class="no_menu"><h3 class="content">用户</h3></li>'
              + $user.html()
              + "<li data-value='"+query+"'><a href='http://xueqiu.com/u?q="+encodeURIComponent(query)+"'target='_blank'>搜索<strong>&nbsp;"+query+"&nbsp;</strong>相关用户</a></li>"
              + '<li class="no_menu"><h3 class="content">组合</h3></li>'
              + "<li data-value='" + query + "'><a href='http://xueqiu.com/k?type=cube&q=" + encodeURIComponent(query) + "'target='_blank'>搜索<strong>&nbsp;" + query + "&nbsp;</strong>相关组合</a></li>"
              + '<li class="no_menu"><h3 class="content">群组</h3></li>'
              + $group.html()
              + "<li data-value='"+query+"'><a href='http://xueqiu.com/g?q="+encodeURIComponent(query)+"'target='_blank'>搜索<strong>&nbsp;"+query+"&nbsp;</strong>相关群组</a></li>"
            );
        $temp.find("li:not(.no_menu)").first().addClass('active');
        that.$menu.html($temp.html());
        //只初始化一次,出现bug是因为浏览器重新获取焦点以后会自动让之前的焦点继续成为焦点.
        if(eventInited === false){
          eventInited = true;
          that.$menu.delegate('a','click',function(e){
            that.$menu.hide();
          });
          $(window).on('focus',function(){
            that.$element.blur();
            that.$menu.hide();
          });
        }
        return that;
      },
      _select: function(that){
        var val = that.$menu.find('.active').attr('data-value'),
            url = that.$menu.find('.active a').attr("href")
        if(!url) return that.show()
        window.open(url,"_blank")
      }
    });
  }
});
