define('SNB.stockFollowers.js', [], function (require, exports, module) {  $.get("/recommend/pofriends.json", {type: 1, code: stockData.stockInfo.stockid, start: 0, count: 14}, function (ret) {
    if (ret) {
      $("#followsCount").html(ret.totalcount);
      if (ret.totalcount > 0) {
        $(".stock-follows").show();
      }
      var friends = ret.friends,
        html = "";

      if (!friends) {
        return false;
      }

      for (var i = 0, len = friends.length; i < len; i++) {
        var friend = friends[i],
          imgUrls = friend.profile_image_url,
          imgUrl;

        if (imgUrls) {
          var tempArray = imgUrls.split(",");
          imgUrl = friend.photo_domain + _.first(tempArray) + '!60x60.png';
        } else {
          imgUrl = friend.photo_domain + 'community/default/avatar.png!60x60.png';
        }

        html += '<div class="imgContainer"><a href="' + friend.profile + '" target="_blank" title="' + friend.screen_name + '" data-name="' + friend.screen_name + '"><img src="' + imgUrl + '"/></a></div>';
      }
      $(".follows-list").html(html);
    }
  });
});
