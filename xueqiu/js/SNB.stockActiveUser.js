define('SNB.stockActiveUser.js', [], function (require, exports, module) {  var symbol=stockData.stockInfo.stockid,
      stockName=stockData.stockInfo.name,
      textValue="$"+stockName+"("+symbol+")$";

  function getStockFollows(start,count,callback){
    SNB.get("/recommend/user/stock_hot_user.json",{symbol:stockData.stockInfo.stockid,start:start,count:count},function(ret){
      callback(ret);
    })
  }
  SNB.Models.stockActiveUser=Backbone.Model.extend({
    initialize: function() {
      var imgUrls = this.get("profile_image_url");
      imgUrls = imgUrls ? imgUrls.split(',') : '';
      //var img = this.get('photo_domain') + (imgUrls.length > 3 ? imgUrls[2] : (imgUrls.length == 1 ? imgUrls[0] : 'community/default/avatar.png!50x50.png'));
      var img = this.get('photo_domain') + (imgUrls[0] ? imgUrls[0] + '!100x100.png' : 'community/default/avatar.png!100x100.png');

      var isSelf=this.get("id")==SNB.currentUser.id;
      var at=this.get("gender")=="f"?"她":"他";
      var screenName=this.get("screen_name");
      var defaultText="关于"+textValue+"，对@"+screenName+" 说： "
      var verified_type = this.get("verified_type") || 1
      this.set({
        img: img,
        isSelf:isSelf,
        verified_type : verified_type,
        at:at,
        defaultText:defaultText
      });
    }
  })
  SNB.Collections.stockActiveUser=Backbone.Collection.extend({
    model:SNB.Models.stockActiveUser,
    start:0,
    count:6
  })
  SNB.Templates.stockActiveUser=""
    + "<div class='headpic'><a href='{{profile}}' data-name='{{screen_name}}'><img width='50px' height='50px' src='{{img}}'/></a></div> " 
    + "<div class='content'>" 
      + "<span>"
        + "<a href='{{profile}}' target='_blank' data-name='{{screen_name}}'>"
          + "<span class='screen_name'>"
            + "{{screen_name}}"
          + "</span>"
          + '{{#verified}}<img title="{{verified_description}}" class="vipicon" src="' + SNB.domain['static'] + '/images/vipicon_{{verified_type}}.png">{{/verified}}'
        + "</a>" 
      + "</span>"  
      + "{{#isSelf}}<span class='itisme'>这就是我</span>{{/isSelf}}" 
      + "{{^isSelf}}<span class='at' data-toggle=\"at\" data-target='{{screen_name}}' data-defaultText='{{defaultText}}'>@&nbsp;{{at}}</span>{{/isSelf}}" 
      + "{{#stock_status_count}}<div class='userDes' data-userid='{{id}}' data-username='{{screen_name}}' title='查看讨论'>相关讨论{{stock_status_count}}条</div>{{/stock_status_count}}" 
    + "</div>";
  SNB.Views.stockActiveUser=Backbone.View.extend({
    tagName:"li",
    getUserid:function(){return this.model.get("id");},
    events:{
      "click .userDes":"showStatus"
    },
    render:function(){
      $(this.el).append(Mustache.to_html(SNB.Templates.stockActiveUser,this.model.toJSON()));
      return this;
    },
    showStatus: function () {
      var profileUrl = this.model.toJSON().profile,
        stockName = stockData && stockData.stockInfo.name;

      if (stockName) {
        var url = profileUrl + "#status_search=" + stockName;
        window.open(url);
      }
    }
  })  
  SNB.Views.stockActiveUsers=Backbone.View.extend({
    initialize:function(){
      var that=this;
      this.collection.bind("reset",function(){
        that.render();
      })
    },
    events:{
      "click .prev":"prev",
      "click .last":"last"
    },
    render:function(){
      var list=$("<ul class='rightSider-list'></ul>"),
        that=this;
      this.collection.each(function(follower,key){
        if(key<5){//一次取了6个
          list.append(new SNB.Views.stockActiveUser({
            model:follower,
            collection:that.collection
          }).render().el);
        }
      })
      if($(".stock-activeUser .loading").length){
        $(".stock-activeUser .loading").replaceWith(list);
      }else{
        this.el.append(list);
      }
      if(this.collection.length<6){//省的再去白白请求下次
        if(this.collection.start==0){
          this.$(".last").hide();
        }else{
          this.$(".last").addClass("unable");
        }
      }
    },
    prev:function(e){
      e.preventDefault();
      this.collection.start-=5;
      if ( this.collection.start < 0 ) {
        this.collection.start = 0;
        return false;
      }
      this.change();
    },
    last:function(e){
      e.preventDefault();
      if(this.$(".last").hasClass("unable")){
        return false;
      }
      this.collection.start+=5;
      this.change();
    },
    change:function(){
      var that=this,
          height=this.$(".rightSider-list").css("height");
      this.$(".rightSider-list").replaceWith($("<div class='rightSider-list loading'></div>").css("height",height).css("display","block"));
      getStockFollows(this.collection.start,this.collection.count,function(ret){
        that.collection.reset(ret);
        if(that.collection.start>=50||that.collection.length<5){
          that.$(".last").addClass("unable");
        }else{
          if(that.$(".last").hasClass("unable")){
            that.$(".last").removeClass("unable");
          }
        }

        if(that.collection.start==0){
          that.$(".prev").hide();
        }else{
          that.$(".prev").show();
        }
      })
    }
  })
})
