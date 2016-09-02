define('SNB.stockRecommend.js', [], function (require, exports, module) {    var symbol=stockData.stockInfo.stockid,
        stockName=stockData.stockInfo.name,
        textValue="$"+stockName+"("+symbol+")$";

   SNB.Models.stockRecommend= Backbone.Model.extend({
    initialize: function() {
      var imgUrls = this.get("profile_image_url");
      imgUrls = imgUrls ? imgUrls.split(',') : '';
      //var img = this.get('photo_domain') + (imgUrls.length > 3 ? imgUrls[2] : (imgUrls.length == 1 ? imgUrls[0] : 'community/default/avatar.png!50x50.png'));
      var img = this.get('photo_domain') + (imgUrls[0] ? imgUrls[0] + '!100x100.png' : 'community/default/avatar.png!100x100.png');

      var isSelf=this.get("id")==SNB.currentUser.id;
      var isImeigu=false;//imeigu iframe页面里引用的时候不要at功能。
      if(window.location.href&&window.location.href.indexOf("widgets")>-1){
        isImeigu=true;
      }
      var at=this.get("gender")=="f"?"她":"他";
      var description=this.get("verified_description")||this.get("description");
      if(description&&SNB.Util.getWordsCount(description)>35){
        description=SNB.Util.splitWord(description,33)+"…";
      }

      var screenName=this.get("screen_name");
      var defaultText="关于"+textValue+"，对@"+screenName+" 说： "
      var verified_type = this.get("verified_type") || 1
      this.set({
        img: img,
        isSelf:isSelf,
        isImeigu:isImeigu,
        at:at,
        verified_type:verified_type,
        defaultText:defaultText,
        description:description
      });
      //this.set({parsedTime:SNB.Util.parseTime(this.get("stats").created_at)});
      if(this.get("stats")){
        this.get("stats").created_at=SNB.Util.parseTime(this.get("stats").created_at);
        this.get("stats").target="/"+this.get("stats").user_id+"/"+this.get("stats").id;
      }  
    }
  });
  SNB.Collections.stockRecommend=Backbone.Collection.extend({
    model:SNB.Models.stockRecommend
  })
  SNB.Templates.stockRecommend=""
    + "<div style='overflow:hidden;zoom:1' class=''>"
      + "<div class='headpic'><a href='{{profile}}' data-name='{{screen_name}}'><img width='50px' height='50px' src='{{img}}'/></a></div> " 
      + "<div class='content'>" 
        + "<a href='{{profile}}' target='_blank' data-name='{{screen_name}}'>"
          + "<span class='screen_name'>"
            + "{{screen_name}}"
          + "</span>"
          + '{{#verified}}<img title="{{verified_description}}"  class="vipicon" src="' + SNB.domain['static'] + '/images/vipicon_{{verified_type}}.png">{{/verified}}'
        + "</a>" 
        + '{{^isImeigu}}'
          + "{{#isSelf}}<span class='itisme'>这就是我</span>{{/isSelf}}" 
          + "{{^isSelf}}<span class='at' data-toggle=\"at\" data-defaultText='{{defaultText}}' data-target='{{screen_name}}'>向{{at}}提问</span>{{/isSelf}}" 
        + '{{/isImeigu}}'  
        + "<div class='userDes'>{{description}}</div>" 
      + "</div>"
    + "</div>";

  SNB.Views.stockRecommend=Backbone.View.extend({
    getUserid:function(){return this.model.get("id");},
    tagName:"li",
    render:function(){
      $(this.el).append(Mustache.to_html(SNB.Templates.stockRecommend,this.model.toJSON()));
      return this;
    }
  });
  SNB.Views.stockRecommends=Backbone.View.extend({
    render:function(){
      var list=$("<ul class='rightSider-list'></ul>"),
          that=this;
      this.collection.each(function(user){
        list.append(new SNB.Views.stockRecommend({
          model:user,
          collection:that.collection
        }).render().el);
      });
      $(this.el).append(list);
    }
  });
})
