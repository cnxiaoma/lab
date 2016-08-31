var showTotalNum = function(t, e) {
    var n = void 0 == t.toString().split(".")[1] ? 0 : t.toString().split(".")[1].length + 1
      , o = new Array;
    o = t.toString().split("");
    var a = "";
    for (i = 0; i < o.length; i++)
        if ("," != o[i])
            switch (a += o[i],
            o.length - i) {
            case 9 + n:
                a += "<span>亿</span>";
                break;
            case 5 + n:
                a += "<span>万</span>";
                break;
            case 1:
                a += '<span class="normal">' + e + "</span>"
            }
    return a
};

(function($){
	$.fn.rollingNun = function(options){
		var defaults = {
			times: 1000,
			point: 0,
			interval: 50,
			callback: function(num){return num;}
		};
		var options = $.extend(defaults, options);
		var _ = this;
		if (!Number(options.num)) {
            return _.html(options.num);
        }
        var num = Number(options.num) ? options.num : parseFloat(options.num);// || parseFloat(_.text());
        if (num == 0) {
            return _.html(num);
        }
        options.point = num.toString().split('.')[1] == undefined ? 0 : num.toString().split('.')[1].length;
        var times = options.times / options.interval;//滚动次数
        var index = num / times;//自增
        var number = 0;//
        (function show() {
            var nums = (number += index).toFixed(options.point);
            _.html(options.callback(nums, options.unit));
            if (number > (num - index)) {
                _.html(options.callback(parseFloat(num).toFixed(options.point), options.unit));
                return;
            }
            setTimeout(show, options.interval);
        })();
	};
})(jQuery)
