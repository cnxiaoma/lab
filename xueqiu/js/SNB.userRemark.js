define('SNB.userRemark.js', [], function (require, exports, module) {  if(typeof SNB.Remark === "undefined") SNB.Remark = {};

  SNB.Remark.Validate = function(remark){
    if(SNB.Util.getWordsCount(remark) > 8) return false
    return true
  }

  SNB.Remark.Request = function(options,before_send,callback,error_callback){
    before_send && before_send()

    SNB.post("/remarks/setting.json",options,function(){
      callback && callback()
    },function(ret){
      error_callback && error_callback(ret)
    })
  }


  SNB.Remark.Action = function(options,before_send,callback,error_callback){
    if(!SNB.Remark.Validate(options.remark)){
      SNB.Util.failDialog("备注最多不超过8个汉字")
      return
    }

    SNB.Remark.Request(options,before_send,callback,error_callback)
  }

  ;(function(){
    $("body").on("click","a.setRemark,a.user_remark",function(e){
      e.preventDefault()

      var $this = $(this);
      var pending = false;
      var user_name = $(this).attr("data-user-name");
      var user_id = $(this).attr("data-user-id");
      var user_remark = $(this).attr("data-user-remark");
      var user_remark_action = user_remark ? "modify" : "create"
      var $remarkDialog = $("#remarkDialog");
      var html = ""
        + "<div id='remarkDialog'>"
          + "<div class='bd vertical-margin-30' style=''>"
            + "<label for='remark' class=''>备注：</label>"
            + "<input type='text' id='remark' placeholder='长度8个汉字以内' class='dialog_form_text'/>"
          + "</div>"
          + "<div style='text-align:center'>"
            + '<input type="submit" class="submit" value="确定">'
            + '<input type="button" class="cancel button" value="取消">'
          + "</div>"
        + "</div>"

      if($("#remarkDialog").length){
        $remarkDialog.replaceWith(html);
        $remarkDialog = $(html)
      }else{
        $remarkDialog = $(html).appendTo($("body"));
      }

      $remarkDialog.dialog({
        width: 300,
        title: "设置备注"
      })

      if(user_remark) $remarkDialog.find("input#remark").val(user_remark)

      $remarkDialog.find(".submit").click(function(){
        var $remark = $remarkDialog.find("#remark")
        var remark_val = $.trim($remark.val())

        if(!remark_val && user_remark_action === "create") return $remarkDialog.dialog("close")

        SNB.Remark.Action({user_id:user_id,remark:remark_val},function(){
          if(pending) return
          pending = true
        },function(){
          if(remark_val){
            if(user_remark_action === "modify"){
              SNB.Util.stateDialog("修改备注成功！")
            }else{
              SNB.Util.stateDialog("设置备注成功！")
            }

            if($this.hasClass("setRemark")) $this.removeClass("setRemark").addClass("user_remark")
             $this.attr("data-user-remark",remark_val)
             $this.text("(" + remark_val + ")")
          }else if(user_remark_action === "modify"){
             SNB.Util.stateDialog("取消备注成功！")
             $this.removeClass("user_remark").addClass("setRemark")
             $this.attr("data-user-remark","")
             $this.text("(备注)")
          }

          //update user model cache
          if(SNB.data.profiles[user_name]) SNB.data.profiles[user_name].remark = remark_val;

          //update view
          $("span.user_remark[data-name='"+user_name+"'],a.user_remark[data-user-name='"+user_name+"']").each(function(){
            var that = this;
            if(remark_val){
              $(that).text("(" + remark_val + ")").show()
            }else{
              $(that).hide()
            }
          })

          $remarkDialog.dialog("close")
          pending = false
        },function(ret){
          pending = false
          SNB.Util.failDialog(ret && ret.error_description)
        })

      })

      $remarkDialog.find(".cancel").click(function(){
        $remarkDialog.dialog("close")
      })
    })
  })();
})