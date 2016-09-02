define('SNB.dialog.js', [], function (require, exports, module) {  /*
   * SNB.stock.js
   *
   * depend on jquery ui dialog
   */

  if (typeof SNB == "undefined") {
    SNB = {};
  }

  var dialog = {
    dialogMessage: function (message) {
      if ($("#dialog-message").length == 0) {
        var messageWrapper = ' <div id="dialog-message"> <p class="message"> </p> <div class="dialog-center"> <input type="submit" class="submit" value="确定"/> </div> </div> ';
        $("body").append(messageWrapper);
        $("#dialog-message").find(".submit").click(function () {
          $("#dialog-message").dialog("close");
        });
      }
      var $dm = $("#dialog-message");
      $dm.find(".message").html(message);
      return $dm;
    },
    deleteStockTransDialog: function(stock, callback){
      if ( $("#dialog-delete-stock-trans").length == 0 ) {
        var deleteStockTransHtml = '<div id="dialog-delete-stock-trans" class="dialog-wrapper"> <form id="delete-stock-trans" action=""> <div class="dialog-center vertical-margin-20"> <span class="alert"> 确认删除 <em name="name"></em> 的所有持仓记录？ </span> </div> <div class="dialog-center"> <input type="submit" class="submit" value="确定" /> <input type="hidden" name="code"/> <input type="button" class="cancel button" value="取消" /> </div> <input type="hidden" name="stock" /> </form> </div>';
        $("body").append(deleteStockTransHtml);
        $("#delete-stock-trans .cancel").click(function () {
          $("#dialog-delete-stock-trans").dialog("close");
        });
      }

      $("#delete-stock-trans").unbind("submit").submit(function () {
        var symbol = $(this).find("input[name=stock]").val(),
            stockInfo = SNB.Util.getStockInfo(symbol),
            delUrl = stockInfo.type == '货币基金' ? '/stock/transfund/remove.json' : '/stock/portfolio/deltrans.json';

        SNB.post(delUrl, { symbol: symbol, group_id: SNB.data.currentPerformanceGroupId }, function (ret) {
          $("#dialog-delete-stock-trans").dialog("close");
          if (callback) {
            callback();
          }
        });
        return false;
      });

      var dialogStockTrans = $("#dialog-delete-stock-trans");
      dialogStockTrans.find("em[name=name]").html(stock);
      dialogStockTrans.find("input[name=stock]").val(stock);
      return dialogStockTrans;
    },
    deleteGroupDialog:function(options){
      var isUserGroup = options.isUserGroup,
        isPerformanceGroup = options.isPerformanceGroup, 
        title = "你确定删除该分组吗？",
        description = isUserGroup ? "删除分组不会影响对用户的关注状态" : "删除分组不会影响对股票的关注状态",
        id = options.id,
        url = isUserGroup ? "/friendships/groups/destroy.json" : "/stock/portfolio/remove.json",
        callback = options.callback,
        isStock = options.isStock;

      if ( isStock ) {
        url = "/stock/portfolio/delstock.json";
        title = "你确定取消关注该自选股吗？";
        description = "该自选股相关的公告、新闻将不再推送给你";
      }

      if ( isPerformanceGroup ) {
        url = "stock/transgroup/remove.json"; 
        title = "你确定删除该组合吗？";
        description = "该组合下的持仓都将会被删除";
      }

      if ( !$("#dialog-delete-port").length ) {
        var deletePortfolioHtml =' '
        + '<div id="dialog-delete-port" class="dialog-wrapper">'
          + ' <form id="delete-port" action="">'
            + '<p class="dialog-deleteGroup-title"><stong>'+title+'</strong></p>'
            + '<p class="dialog-deleteGroup-description">'+description+'</p>'
            + ' <div class="dialog-center">'
              + ' <input type="submit" class="submit" value="确定" />'
              + ' <input type="button" class="cancel button" value="取消" />'
            + ' </div>'
          + ' </form>'
        +' </div>';

        $("body").append(deletePortfolioHtml);

        $("#delete-port .cancel").click(function () {
          $("#dialog-delete-port").dialog("close");
        });

        $("#delete-port").submit(function () {
          var id = $("#dialog-delete-port").data("gid"),
            params = (isUserGroup || isPerformanceGroup) ? { id: id } : (isStock ? { code: id } : { pid: id }),
            submitData = function(){
              var cb = function(ret){
                $("#dialog-delete-port").dialog("close");
                if(callback){
                  callback(ret, id);
                }
              };
              var errorCb = function(ret){
                if ( ret.error_description ) {
                  alert(ret.error_description);
                }
              };
              SNB.post(url, params, cb, errorCb);
            };

          submitData();
          return false;
        });
      }
      var dialogDeletePort = $("#dialog-delete-port").data("gid", id);
      return dialogDeletePort;
    },

    deletePortfolioDialog: function (pid, pname, options) {
      if ($("#dialog-delete-port").length == 0) {
        var deletePortfolioHtml = '<div id="dialog-delete-port" class="dialog-wrapper"> <form id="delete-port" action=""> <div class="dialog-center vertical-margin-20"> <span class="alert"> 确认删除 <em name="pname"></em> 分组？ </span> </div> <div class="dialog-center"> <input type="submit" class="submit" value="确定" /> <input type="hidden" name="pid"/> <input type="button" class="cancel button" value="取消" /> </div> </form> </div>';
        $("body").append(deletePortfolioHtml);
        $("#delete-port .cancel").click(function () {
          $("#dialog-delete-port").dialog("close");
        });
        $("#delete-port").submit(function () {
          SNB.get("/stock/portfolio/remove.json", { pid: $(this).find("input[name=pid]").val() }, function (ret) {
            $("#dialog-delete-port").dialog("close");
            var curPid=$("#delete-port").find("input[name=pid]").val();
            options.ulWrapper.find("li[portfolio-id='"+curPid+"']").remove();

            options.portfolios=_.reject(options.portfolios,function(portfolio){
              return portfolio.id==curPid;
            })

            options.activeTab = options.pid = -1;
            options.ulWrapper.find("li[portfolio-id='-1']").trigger("click");
          });
          return false;
        });
      }
      var dialogDeletePort = $("#dialog-delete-port");
      dialogDeletePort.find("input[name=pid]").val(pid);
      dialogDeletePort.find("em[name=pname]").html(pname);
      return dialogDeletePort;
    },
    sortDialog: function(options){
      var groups = options.groups,
        isUserGroup = options.isUserGroup,
        isPerformanceGroup = options.isPerformanceGroup,
        submitCb = options.submitCallback,
        deleteCb = options.deleteCallback,
        editCb = options.editCallback,
        submitUrl = isUserGroup ? "/friendships/groups/order.json" : "/stock/portfolio/modifyorder.json",
        deleteUrl = isUserGroup ? "/friendships/groups/destroy.json" : "/stock/portfolio/remove.json",
        sort = $("#dialog-sort");

      if ( isPerformanceGroup ) {
        submitUrl = "/stock/transgroup/order.json";
        deleteUrl = "stock/transgroup/remove.json";
      }

      if ( !sort.length ) {
        var sortHtml = ' '
          + '<div id="dialog-sort" class="dialog-wrapper">'
            + '<form id="sort" action="">'
              + '<div class="sort-widget">' 
                + '<select name="ports" multiple="multiple" class="sortable"> </select> '
                + '<div class="buttons"> '
                  + '<input type="button" class="sort_up button" value="上移" /> '
                  + '<input type="button" class="sort_down button" value="下移" />'
                  + '<input type="button" class="edit-name button" value="改名" />'
                  + '<input type="button" class="delete-group button" value="删除" /> '
                + '</div> '
                + '<div class="clear"></div> '
              + '</div> '
              + '<div class="dialog-center"> '
                + '<input type="submit" class="submit" value="确定" /> '
                + '<input type="button" class="cancel button" value="取消" /> '
              + '</div> '
              + '<input type="hidden" name="pid"/> '
            + '</form> '
          + '</div>';

        $("body").append(sortHtml);
        sort = $("#dialog-sort");

        sort.on("click", ".sort_up", function(e){
          var $selected_options = sort.find("select option:selected");
          $($selected_options[0]).prev().before($selected_options);
        });

        sort.on("click", ".sort_down", function(e){
          var $selected_options = sort.find("select option:selected");
          $($selected_options[$selected_options.length - 1]).next().after($selected_options);
        });

        sort.on("change", ".sortable", function() {
          var groupId = sort.find("select option:selected").val(),
            group = _.find(groups, function (group) {
              return group.id == groupId;
            });

          if (group && group.default_id) {
            sort.find(".edit-name,.delete-group").css("visibility", "hidden");
          } else {
            sort.find(".edit-name,.delete-group").css("visibility", "visible");
          } 
        });

        sort.on("click", ".edit-name", function(e){
          if ( $(this).hasClass("disabled") ) {
            return false;
          }
          var $selected_options = sort.find("select option:selected"),
              groups = $("select option").map(function(){
                return { id: $(this).val(), name: $(this).text() };
              }),
              isUserGroup = sort.data("options").isUserGroup,
              options = {
                isEdit: true,
                userGroup: isUserGroup,
                isPerformanceGroup: isPerformanceGroup,
                groups: groups,
                callback: function(ret){
                  $selected_options.text(ret);
                  editCb();
                },
                group: {
                  id: $selected_options.val(),
                  name: $selected_options.text()
                }
              },
              dialog = SNB.dialog.addGroupDialog(options);

          dialog.dialog({
            modal: true,
            title: "修改分组名称"
          });
          return false;
        });

        sort.submit(function(e){
          var new_order = [],
              oldGroups = sort.data("groups"),
              orderid = [];

          $(this).find("option").each(function(){
            var id = $(this).val();
            //orderid.push($(this).attr("order"));
            new_order.push(id);
          });
          oldGroups = _.filter(oldGroups, function(g){
            return ~_.indexOf(new_order, (g.id + ""));
          });
          orderid=_.pluck(oldGroups, "order_id");

          var pids = new_order + "",
            params = {
              pids: pids
            };

          if ( isUserGroup || isPerformanceGroup ) {
            params.ids = pids;
            params.orders = orderid + "";
            delete params.pids;
          }

          var submitData = function(){
            var cb = function(ret){
              $("#dialog-sort").dialog("close");
              if(submitCb){
                submitCb(ret);
              }
            };
            SNB.post(submitUrl, params, cb);
          };
          submitData();
          return false;
        });

        sort.find(".delete-group").click(function(){
          if ( $(this).hasClass("disabled") ) {
            return false;
          }
          var $selected_options = sort.find("select option:selected"),
            val = $selected_options.val();

          if ( $selected_options.length ) {
            var opt = {
                  isUserGroup: isUserGroup,
                  isPerformanceGroup: isPerformanceGroup,
                  callback: function(ret){
                    sort.find("select option:selected").remove();
                    if ( deleteCb ) {
                      deleteCb(ret, val);
                    }
                  },
                  id: val
                },
                dialog = SNB.dialog.deleteGroupDialog(opt);

            dialog.dialog({
              modal: true,
              title: "删除用户分组"
            });
          } else {
            alert("请先选择要删除的分组！");
          }
          return false;
        });

        sort.find(".cancel").click(function () {
          $("#dialog-sort").dialog("close");
        });
      }

      sort.data("options", options);

      var groupsHtml = "";
      _.each(groups, function(value){
        if ( isUserGroup ) {
          if ( value.id != 0 && value.id != 1) {
            groupsHtml+= "<option value='" + value.id + "' order='"+(value.order_id||0)+"'>" + value.name + "</option>";
          }
        } else {
          if (value.id != -1) {
            groupsHtml+= "<option value='" + value.id + "' order='"+(value.order_id||0)+"'>" + value.name + "</option>";
          }
        }
      });

      sort.find("select").html(groupsHtml);
      sort.find(".edit-name,.delete-group").css("visibility", "visible");
      sort.data("groups", groups);
      return $("#dialog-sort");
    },
    addGroupDialog: function(options){
      var isEdit = options.isEdit,
          isUserGroup = options.userGroup,
          isPerformanceGroup = options.isPerformanceGroup,
          groups = options.groups,
          maxWordsCount = isUserGroup ? 8 : 7,
          callback = options.callback,
          originGroup = options.group;

      if (isPerformanceGroup) {
        maxWordsCount = 10;
      }    

      if ( !$("#dialog-new-portfolio").length ) {
        var newGroupDialgHtml = ' '
            + '<div id="dialog-new-portfolio" class="dialog-wrapper">'
              + ' <form id="add-port" action="">'
                + ' <div class="vertical-margin-30" style="padding-left:20px;">'
                  + ' <label for="new-port">分组：</label> <input type="text" style="width:175px;" name="new-port" id="new-port"/>'
                + ' </div>'
                + ' <div class="dialog-center">'
                  + ' <input type="submit" class="submit" value="确定" />'
                  + ' <input type="button" class="cancel button" value="取消" />'
                + ' </div>'
              + ' </form>'
            + ' </div>';

        $("body").append(newGroupDialgHtml);

        var $newPort = $("#add-port");
        $newPort.find("#new-port").blur(function () {
          $newPort.find(".alert").remove();
          var wordsCount = SNB.Util.getWordsCount($.trim($(this).val()));
          if ( wordsCount > maxWordsCount ) {
            $(this).after("<p class='alert' style='padding-left:43px;'>分组名最多不超过" + maxWordsCount + "个汉字</p>");
          }
        }).focus(function(e){
          $newPort.find(".alert").remove();
        });

        $("#add-port .cancel").click(function () {
          $("#dialog-new-portfolio").dialog("close");
        });

        $("#add-port").submit(function () {
          $newPort.find(".alert").remove();
          var $input = $newPort.find("#new-port"),
              val = $.trim($input.val()),
              wordsCount = SNB.Util.getWordsCount(val),
              options = $("#dialog-new-portfolio").data("options"),
              isEdit = options.isEdit,
              originGroup = options.group,
              callback = options.callback,
              isUserGroup = options.userGroup,
              isPerformanceGroup = options.isPerformanceGroup,
              groups = options.groups,
              error = "";

          if ( !wordsCount ) {
            error="请输入组名";
          } else {
            if ( wordsCount > maxWordsCount ) {
              error = "分组名最多不超过" + maxWordsCount + "个汉字";
            } else {
              if ( groups ) {
                var group = _.find(groups, function(g){
                  return g.name === val;
                });

                if(group){
                  error = "分组名称重复";
                  // 修改时 不提示错误
                  if ( isEdit && group.id == originGroup.id ){
                    error = "";
                  }
                }
              }
            }
          }
          if ( error ) {
            $input.after("<p class='alert' style='padding-left:43px;'>" + error + "</p>");
            return false;
          }

          var url, params;

          if ( isEdit ) {
            url = isUserGroup ? "/friendships/groups/update.json" : "/stock/portfolio/modify.json";
            params = { pname: val, pid: originGroup.id };

            if ( isPerformanceGroup ) {
              url = "/stock/transgroup/update.json";
            }
            if ( isUserGroup || isPerformanceGroup ) {
              params = {
                name: val,
                id: originGroup.id
              };
            }
          } else {
            url = isUserGroup ? "/friendships/groups/create.json" : "/stock/portfolio/create.json";
            if ( isPerformanceGroup ) {
              url = "/stock/transgroup/create.json";
            }
            params = { pname: val };
            if ( isUserGroup || isPerformanceGroup ) {
              params = {
                name: val
              };
            }
          }

          function submitData(url, params){
            var cb = function(ret){
              if ( ret ) {
                $("#dialog-new-portfolio").dialog("close");
                if ( callback ) {
                  callback(ret.success ? val : ret);
                }
              }else{
                $("#dialog-new-portfolio").dialog("close");
                SNB.dialog.showFailedDialog("最多创建12个分组");
              }
            };
            var errorCb = function(ret){
              SNB.Util.failDialog(ret.error_description);
            };

            SNB.post(url, params, cb, errorCb);
          }
          submitData(url, params);
          return false;
        });

      }
      var dialogAddPort = $("#dialog-new-portfolio");
      dialogAddPort.data("options",options);
      dialogAddPort.find("#new-port").val(originGroup ? originGroup.name : "");
      return dialogAddPort;
    },
    addStockDialog: function (options) {
      var stock = options.stock,
        groups = options.groups,
        isEdit = options.isEdit,
        maxGroupCount = 11,
        dialog = $("#dialog-add-stock");

      function generateStatus() {
        var $this = $("#add-stock"),
          name = $this.find("span.name").html(),
          code = $this.find("span.code").html(),
          current = $this.find("span.current").html(),
          sprice = $.trim($this.find("#sell-price").val()),
          bprice = $.trim($this.find("#buy-price").val()),
          comment = $.trim($this.find("#stock-comment").val()),
          stockInfo = SNB.Util.getStockInfo(code),
          moneySymbol = stockInfo.money,
          stock = "$" + name + "(" + code + ")$",
          status = "";

        if (isEdit) {
          var $sprice = $this.find("#sell-price"),
            $bprice = $this.find("#buy-price"),
            $comment = $this.find("#stock-comment"),
            spriceOrig = $sprice.data("orig"),
            bpriceOrig = $bprice.data("orig"),
            commentOrig = $comment.data("orig");

          if (sprice && sprice != spriceOrig) {
            if (spriceOrig && parseInt(spriceOrig, 10) != 0) {
              status += "将" + stock + "卖出目标价从" + moneySymbol + spriceOrig + "调整为" + moneySymbol + sprice + "。";
            } else {
              status += "将" + stock + "卖出目标价调整为" + moneySymbol + sprice + "。";
            }
          }
          if (bprice && bprice != bpriceOrig) {
            if (!status) {
              status = "将" + stock + "";
            }
            if (bpriceOrig && parseInt(bpriceOrig, 10) != 0) {
              status += "买入目标价从" + moneySymbol + bpriceOrig + "调整为" + moneySymbol + bprice + "。";
            } else {
              status += "买入目标价调整为" + moneySymbol + bprice + "。";
            }
          }

          if (comment && comment != commentOrig) {
            if (status) {
              status += " " + comment;
            } else {
              status = stock + comment;
            }
          }
        } else {
          if (stockInfo.bigType === "理财产品") {
            moneySymbol = "";
          }
          if (current && current != 0) {
            status += "在" + moneySymbol + current + "时";
          }
          var type = stockInfo.type;
          status += "关注" + type + stock;
          if (bprice && parseInt(bprice, 10) != 0) {
            status += "，买入目标价" + moneySymbol + bprice;
          }
          if (sprice && parseInt(sprice, 10) != 0) {
            status += "，卖出目标价" + moneySymbol + sprice;
          }
          status += "。";
          if (comment) {
            status += comment;
          }
        }
        return status;
      }

      var submitData = function (data) {
        var d = $("#dialog-add-stock"),
          options = d.data("options"),
          stock = options.stock,
          groups = options.groups,
          callback = options.callback,
          isEdit = options.isEdit;

        function successCb(data) {
          d.find(".submit").removeAttr("disabled");
          d.dialog("close");
          SNB.data.share.shareStatus(generateStatus());
          if (callback) {
            callback(data);
          }
        }

        function errorCb() {
          d.find(".submit").removeAttr("disabled");
        }

        if (isEdit) {
          SNB.post("/stock/portfolio/updstock.json", data, successCb, errorCb);
        } else {
          SNB.Util.portfolio_addstock(data, successCb, errorCb);
        }
      };

      var symbol = stock.symbol || stock.code,
        stockInfo = SNB.Util.getStockInfo(symbol);

      if ( stockInfo.type === "理财产品" ) {
        if ( stock.current && stock.current !== "undefined" ) {
          stock.current *= 100;
          stock.current = stock.current.toFixed(2) + "%";
        }
      }  

      if(!dialog.length){

        var infoHtml = ' '
          +' <p>'
            + '<span class="code"></span> <span class="name"></span>&nbsp;&nbsp; '
            + ((_.isUndefined(stock.current) || stock.current == "undefined") ? '' : '<label for="current">当前价:</label> <span class="current" id="current"></span>')
          + '</p>';

        if (stockInfo.type === "理财产品") {
          infoHtml = ' '
            +' <p>'
              + '<span class="code" style="display: none;"></span> <span class="name"></span>&nbsp;&nbsp; '
              + '<br/>'
              + '<label for="current">预期收益:</label> <span class="current" id="current"></span>'
            + '</p>';
        
        }  
          
        var addStockHtml= ' '
            + '<div id="dialog-add-stock" class="dialog-wrapper"> '
              +'<form id="add-stock" action="">'
                + infoHtml
                +' <p class="input"> <label for="buy-price">买入目标价:</label> <input type="textfield" name="buy-price" id="buy-price" size="6"/>  </p>'
                +' <p class="input"> <label for="sell-price">卖出目标价:</label> <input type="textfield" name="sell-price" id="sell-price" size="6"/>  </p>'
                +' <p class="input"> <label for="target-percent">涨跌幅提醒:</label> <input type="textfield" name="target-percent" id="target-percent" size="6"/>% </p>'
                +' <p class="input"> <label for="stock-notice">开启提醒:</label> <input type="checkbox" id="stock-notice"/><span class="notice-declare">（包含涨停/跌停提醒）</span> </p>'
                +' <p> 分组</p>'
                +' <p class="dialog-userGroup-groups"> </p>'
                + '<p style="height:25px;"><a href="#" class="dialog-userGroup-addGroup">新建分组</a></p>'
                + '<p style="display:none;" class="dialog-userGroup-addGroupContainer">'
                  + '<input type="text"  placeholder="分组名最多不超过8个字"/><input type="button" class="button" value="保存"/><a href="#">取消</a>'
                + '</p>'
                +' <p><label for="stock-comment">备注</label><span class="description">（可在个人页自选股列表中查看）</span> <textarea id="stock-comment" name="comment" rows="4" cols="30"></textarea> </p>'
                +' <p id="shareStatus"></p>'
                +' <div class="dialog-center" style="overflow:hidden;margin-top:10px;"> <input type="submit" class="submit" value="确定" /> <input type="button" class="cancel button" value="取消" /> </div>'
              +' </form>'
            +' </div> ';
        $("body").append(addStockHtml);
        dialog = $("#dialog-add-stock");

        //add share modle
        SNB.Util.shareModule({container:dialog.find("#shareStatus"),type:"portfolio"});


        dialog.on("click", "#add-stock .cancel", function (e) {
          dialog.dialog("close");
        }).on("click", ".dialog-userGroup-addGroup", function (e) {
          var p = $(this).parent(),
            addGroupContainer = dialog.find(".dialog-userGroup-addGroupContainer");

          p.hide();
          addGroupContainer.show();
          return false;
        }).on("click", ".dialog-userGroup-addGroupContainer .button", function (e) {
          if ($(".dialog-userGroup-groups label").length == 12) {
            alert("最多创建12个分组");
            return false;
          }
          var text = dialog.find(".dialog-userGroup-addGroupContainer input:text"),
            val = text.val();

          if (val) {
            var html = '<label for="' + val + '">&nbsp;&nbsp;<input type="checkbox" class="tempcb" checked=checked data-name="' + val + '" id="' + val + '">' + val + '</label>';
            dialog.find(".dialog-userGroup-groups").append(html);
            text.val("");
          }
          return false;
        }).on("click", ".dialog-userGroup-groups input:checkbox", function (e) {
          if (!$(this).is(":checked") && $(this).hasClass("tempcb")) {
            $(this).parent().remove();
          }
        }).on("click", ".dialog-userGroup-addGroupContainer a", function (e) {
          dialog.find(".dialog-userGroup-addGroupContainer").hide();
          dialog.find(".dialog-userGroup-addGroup").parent().show();
          return false;
        }).on("click", "#shareStatus input", function (e) {
          if ($(this).is(":checked")) {
            SNB.Util.saveConfig({"sharestatus": 1});
          } else {
            if (!$("#dialog-add-stock").find("#shareStatus label:visible input:checked").length) {
              SNB.Util.saveConfig({"sharestatus": 0});
            }
          }
        }).on("submit", "#add-stock", function (e) {
          dialog.find(".submit").attr("disabled", "disabled");
          var $this = $(this),
            sprice = $this.find("#sell-price").val(),
            bprice = $this.find("#buy-price").val(),
            percent = $this.find("#target-percent").val(),
            isnotice = $this.find("#stock-notice").is(":checked") ? "1" : "0";

          $("#sell-price,#buy-price").each(function (key, value) {
            var price = $(this).val();

            if (price && !/\d+(\.\d+)?/ig.test(price)) {
              $(this).addClass("error").bind("focus", function (e) {
                $(this).removeClass("error");
                $(this).next("span").remove();
              }).after("<span style='margin-left:10px;color:red;'>请输入大于0的数字</span>");
              return false;
            }
          });


          var current = $this.find("span.current").html(),
            name = $this.find("span.name").html(),
            pnames = [],
            pids = [];

          dialog.find(".dialog-userGroup-groups input:checked").each(function () {
            pnames.push($(this).data("name"));
            pids.push($(this).hasClass("tempcb") ? -100 : this.id);
          });

          var data = {
            pids: pids.join(","),
            pnames: pnames.join(","),
            code: $this.find("span.code").html(),
            comment: $this.find("#stock-comment").val(),
            sprice: sprice,
            bprice: bprice,
            targetpercent: percent || "0",
            isnotice: isnotice
          };

          submitData(data);

          if (SNB.currentUser.id == 8290096439) {
            SNB.Util.saveConfig({"pnames": data.pnames});
          }
          return false;
        });
      }

      if (stockInfo.type === "投资组合") {
        dialog.find("label[for='current']").text("当前净值：");
        dialog.find("p.input").hide();
      } else {
        dialog.find("label[for='current']").text("当前价：");
        dialog.find("p.input").show();
      }

      dialog.find(".notice-declare").toggle(stockInfo.bigType === "沪深");

      dialog.data("options", options);
      dialog.find(".submit").removeAttr("disabled");
      dialog.find(".code").html(stock.symbol || stock.code);
      dialog.find(".name").html(stock.name);

      var buyPrice = "",
        sellPrice = "",
        percent,
        checked;

      if (isEdit) {
        buyPrice = stock.buyPrice == -1 ? "" : stock.buyPrice;
        sellPrice = stock.sellPrice == -1 ? "" : stock.sellPrice;

        if (_.isNull(stock.targetPercent)) {
          percent = 7;
        } else if (stock.targetPercent == -1 || stock.targetPercent === 0) {
          percent = "";
        } else {
          percent = stock.targetPercent;
        }

        if (_.isNull(stock.isNotice) || stock.isNotice == 1) {
          checked = "checked";
        } else {
          checked = "";
        }
      } else {
        percent = 7;
        checked = "checked";
      }
      dialog.find("#buy-price").val(buyPrice).data("orig", buyPrice);
      dialog.find("#sell-price").val(sellPrice).data("orig", sellPrice);
      dialog.find("#target-percent").val(percent).data("orig", percent);
      dialog.find("#stock-comment").val(stock.comment).data("orig", stock.comment);
      if (checked) {
        dialog.find("#stock-notice").attr("checked", "checked");
      }

      // 分组
      var groupsCb = function (portfolios) {
        var groupName = "",
          my_ports = "";

        if (!isEdit) {
          if (groups.current == "全部") {
            groups.current = "";
          }
          groupName = groups.current;//自选股页面要取当前的tab
          var bigType = SNB.Util.getStockInfo(dialog.find(".code").html()).bigType;
          if (!groupName) {
            // 把基金放到沪深分组里面
            if (bigType == "基金") {
              bigType = "沪深";
            }
            groupName = bigType;
          }

          if (bigType == "货币基金") {
            bigType = "沪深";
          }
          if (bigType == "国债期货") {
            bigType = "";
          }
          if (bigType === "理财产品") {
            bigType = "";
          }

          // pre开头的 默认不分组
          if (/pre\d+/i.test(symbol)) {
            bigType = "";
          }
          groupName = bigType;
        }
        var existingGroups = groupName ? [groupName] : groups.current,
          html = ""

        $.each(portfolios, function (index, p) {
          if (p.id != -1) {
            var checked = "";
            if (~_.indexOf(existingGroups, p.name)) {
              checked = "checked=checked";
            }
            html += '<label for="' + p.id + '">&nbsp;&nbsp;<input type="checkbox"' + checked + ' data-name="' + p.name + '" id="' + p.id + '">' + p.name + '</label>';
          }
        });
        dialog.find(".dialog-userGroup-groups").html(html);

        // 分组达到上限的话  隐藏新建
        if (portfolios.length > maxGroupCount + 1) {
          dialog.find(".dialog-userGroup-addGroup").parent().hide();
        }
      };
      if(groups.all){
        groupsCb(groups.all);
      }else{
        SNB.get("/stock/portfolio/list.json", {uid:SNB.currentUser.id}, function(res) {
          groupsCb(res.portfolios);
        });
      }

      // stock.current没有的情况下
      // 从6m的行情数据中取当前价  针对停牌股票
      function getCurrentFrom6m(dialog, symbol) {
        SNB.get("/stock/forchart/stocklist.json", {symbol: symbol, period: "6m"}, function (ret) {
          var list = ret.chartlist,
            i = 0,
            len = list.length;

          list = list.reverse();
          var current;
          for (; i < len; i++) {
            var quote = list[i];
            if (quote.current != 0) {
              dialog.find("#current").html(quote.current)
              current = quote.current;
            }
            break;
          }
          if (_.isUndefined(current)) {
            dialog.find("#current").html("0.00")
          }
        });
      }

      var stockSymbol = stock.symbol || stock.code;

      // 如果没有当前价 先从quote中取
      if (_.isUndefined(stock.current)) {
        SNB.get("/stock/quote.json", {code: stockSymbol}, function (res) {
          if (res && res.quotes && res.quotes.length) {
            var current = res.quotes[0].current;
            // 如果取到的是0  继续从6m里面取
            if (current == 0) {
              getCurrentFrom6m(dialogAddStock, stockSymbol)
            } else {
              dialog.find('#current').html(current);
            }
          }
        });
      } else {
        if (stock.current == 0) {
          getCurrentFrom6m(dialog, stockSymbol);
        } else {
          dialog.find('#current').html(stock.current);
        }
      }
      return dialog;
    },
    deleteStockDialog: function (stock, callback,curGroup,newGroups) {
      stock.code=stock.symbol||stock.code||stock.stockid;
      if ($("#dialog-delete-stock").length == 0) {
        var deleteStockHtml = ''
            + '<div id="dialog-delete-stock" class="dialog-wrapper">'
              +'<form action="" id="delete-stock">'
                +'<div class="vertical-margin-20 portfolio">'
                  +'<span id="remove-from-portfolio"><em name="code" style="display:none;"></em><em>你确定从当前分组删除该自选股吗？</em></span> </br> <span style="color:#999">(仍可在“全部”分组中找到它)</span>'
                +'</div>'
                +'<div class="vertical-margin-10 truncate" style="margin-top:10px;">'
                  +'<input type="checkbox" id="truncate-stock" name="truncate-stock" checked/> <label for="truncate-stock">彻底删除</label>'
                  +'<span style="display;none;color:#999;">&nbsp;&nbsp不再接收新闻、公告。</span>'
                +'</div>'
                +'<div class="dialog-center submit-area" style="margin-top:20px;"> <input class="submit" type="submit" value="确定" /> <input type="button" class="cancel button" value="取消" /> </div>'
              +'</form>'
            +'</div>';
        $("body").append(deleteStockHtml);
        $("#dialog-delete-stock .cancel").click(function () {
          $("#dialog-delete-stock").dialog("close");
        });
        $("#dialog-delete-stock form").submit(function () {
          var code = $(this).find("em[name=code]").html();
          var truncate = $(this).find("#truncate-stock").is(":checked");
          var url, data;
          if (truncate) {
            url = "/stock/portfolio/delstock.json";
            data = { code: code };
          } else {
            url = "/stock/portfolio/updstock.json";
            data = { pnames:newGroups, code: code }
          }
          SNB.post(url, data, function (ret) {
            dialogDeleteStock.dialog("close");
            if (callback) { callback(code); }
          });
          return false;
        });
      }
      var dialogDeleteStock = $("#dialog-delete-stock");
      dialogDeleteStock.find("em[name=code]").html(stock.code||stock.stockid);
      dialogDeleteStock.find("em[name=name]").html(stock.name);
      dialogDeleteStock.find("em[name=pname]").html(curGroup);
      if(curGroup=="全部"){
        dialogDeleteStock.find("#truncate-stock").hide();
        dialogDeleteStock.find(".portfolio").hide();
        dialogDeleteStock.find(".alert").show();
      }else{
        dialogDeleteStock.find("#truncate-stock").change(function () {
          if ($(this).is(":checked")) {
            dialogDeleteStock.find(".alert").show();
          } else {
            dialogDeleteStock.find(".alert").hide();
          }
        });
      }
      return dialogDeleteStock;
    },
    processingDialog:function(msg){
      var processingDialog= $("#processing-dialog");
      if (processingDialog.length < 1) {
        var html = '<div id="processing-dialog" class="dialog-wrapper"><span class="processingTip"></span></div>';
        $("body").append(html);
        processingDialog= $("#processing-dialog");
      }
      processingDialog.find(".processingTip").html(msg);
      processingDialog.dialog({ modal: true, width: (msg.length<10?200:230), minHeight: 50 }).prev().hide();
      return processingDialog;
    },
    savedDialog: function (msg, last) {
      var savedDialog = $("#dialog-saved-success");
      if (savedDialog.length < 1) {
        var html = '<div id="dialog-saved-success" class="dialog-wrapper"><span class="savedsuccesstip"></span></div>';
        $("body").append(html);
        savedDialog = $("#dialog-saved-success");
      }
      savedDialog.find(".savedsuccesstip").html(msg);
      savedDialog.dialog({ modal: true, width: (msg.length<10?200:230), minHeight: 50 }).prev().hide();
      setTimeout(function () { savedDialog.dialog("close") }, last || 2000);
      return savedDialog;
    },
    showStateDialog: function (message, callback) {
      var stateDialog = $("#dialog-show-state");
      if (stateDialog.length < 1) {
        var html = '<div id="dialog-show-state" class="dialog-wrapper"><p style="margin:10px;text-align:center;">' + message + '</p><p style="width:100%;text-align:center;"><input type="button" class="submit" value="确定"/></div>';
        $("body").append(html);
        stateDialog = $("#dialog-show-state");
        stateDialog.find(".submit").unbind("click").click(function () {
          stateDialog.dialog("close");
          if (callback) {
            callback();
          }
        })
      }
      return stateDialog;
    },
    showFailedDialog: function (message, last) {
      var failDialog = $("#dialog-failed");
      if (failDialog.length < 1) {
        var html = '<div id="dialog-failed" class="dialog-wrapper"><span class="savedfailtip"></span></div>';
        $("body").append(html);
        failDialog = $("#dialog-failed");
      }
      failDialog.find(".savedfailtip").text(message);
      failDialog.dialog({ modal: true, width: 200, minHeight: 50 }).prev().hide();
      setTimeout(function () { failDialog.dialog("close") }, last || 3000);
      return failDialog;
    },
    getTemplate: function(type, symbol){
      var template = "";
      var getStatus;
      var validate;
      var fill;
      var postfix = '<select class="postfix"><option value="0">‰</option>';
      var moneyTable = {"$": "美元", "HK$": "港元", "￥": "人民币", "€": "欧元", "AU$": "澳元", "J￥": "日元", "£": "英镑"};
      var stockInfo = SNB.Util.getStockInfo(symbol);
      var isMF = stockInfo.type == "货币基金";
      var money = moneyTable[stockInfo.money];
      var opType = ["", "买入", "卖出", "补回", "卖空", "现金股息", "红股入账", "合股", "拆股"];

      postfix += '<option value="1">' + money + '</option></select>';
      // helper
      var dateValidator = function($elem) {
        var title = "请输入有效日期";
        try {
          var date = SNB.Util.parseDate($elem.val());
          var now = new Date();
          if (date == "Invalid Date" || date == '' || date > now) {
            $elem.addClass("error").val(title).attr("title", title);
            return false;
          }
        } catch(e) {
          $elem.addClass("error").val(title).attr("title", title);
          return false;
        }
        return true;
      };
      var numValidator = function($elem,canZero, canEmpty) {
        var title = "无效数字";
        var val = $elem.val();
        if (isNaN(val)) {
          $elem.addClass("error").val(title).attr("title", title);
          return false;
        }
        title = "不能为空";
        if (val == '' && !canEmpty) {
          $elem.addClass("error").val(title).attr("title", title);
          return false;
        }
        title = "不能为负数";
        if (val < 0) {
          $elem.addClass("error").val(title).attr("title", title);
          return false;
        }
        if ( !canZero ){
          title = "不能为0";
          if (val == 0) {
            $elem.addClass("error").val(title).attr("title", title);
            return false;
          }
        }
        return true;
      };

      switch ( type ) {
        // 买卖股票
        case 1:
        case 2:
        case 3:
        case 4:
          template = ' '
            +'<p> '
              +'<label for="performance-date"><span class="required">*</span>日期:</label> '
              +'<input type="text" class="datepicker" id="performance-date" name="performance-date" style="width:90px;"/> '
            +'</p>';

          if (!isMF) {
            template += ' '
              + '<p> '
                + '<label for="performance-price"><span class="required">*</span>价格:</label> '
                + '<input type="text" name="performance-price" id="performance-price" size="6"/> '
              + '</p>';
          
          }  

          template += ' '
            +'<p>'
              +' <label for="performance-shares"><span class="required">*</span>数量:</label>'
              +' <input type="text" name="performance-shares" id="performance-shares" size="6"/>'
              +' <span>(不分享数量)</span>'
            +'</p>';

          if ( !isMF ) {
            template += ' '
              + '<p>'
                + ' <label for="performance-commission">佣金:</label>'
                + ' <input type="text" name="performance-commission" id="performance-commission" size="6"/>'
                + '&nbsp;&nbsp;'
                + postfix
                + '<label for="performance-saveCommission" style="float:right;">'
                  + '<input type="checkbox" id="performance-saveCommission" checked>保存为常用佣金'
                + '</label>'
              + '</p>'
              + '<p>'
                + ' <label for="performance-price">税率:</label>'
                + ' <input type="text" name="performance-taxRate" id="performance-taxRate" size="6"/>'
                + '&nbsp;&nbsp;'
                + postfix
                + '<label for="performance-saveTaxRate" style="float:right;">'
                  + '<input type="checkbox" id="performance-saveTaxRate" checked>保存为常用税率'
                + '</label>'
              + '</p>';
          } else {
            template += ' '
              + '<p>'
                + '<label>收益计算：</label>'
                + '<label>'
                  + '<input type="radio" name="performance-mf-calculate" value="1" checked/>'
                + '赎回日计息，申购日不计息</label>'  
                + '<br>'
                + '<label style="visibility:hidden;">收益计算：</label>'
                + '<label>'
                  + '<input type="radio" name="performance-mf-calculate" value="2">'
                + '申购日计息，赎回日不计息</label>'
              + '</p>';

            if ( type == 1 ) {
              template += ' '
                + '<p>'
                  + '<label> 红利再分配日期：'
                    + '每月&nbsp;<input type="text" id="performance-mf-day" style="width:30px;"/>&nbsp;号'
                  + '</label>'  
                + '</p>';  
            }  
          }


          getStatus = function(type){
            var container = $("#dialog-performance"),
                status = "",
                stockName = container.find(".name").text(),
                moneySymbol = SNB.Util.getStockInfo(symbol).money,
                dt = container.find("#performance-date").val(),
                price = container.find("#performance-price").val(),
                type = opType[type],
                comment = container.find("#performance-comment").val();
            
            status += dt;
            if ( price ) {
              status += "以" + moneySymbol + price;
            }
            if ( type ) {
              status += type;
            }
            status += "$" + stockName + "(" + symbol + ")$。";
            if ( comment ) {
              status += comment;
            }
            return status; 
          }

          validate = function(){
            var container = $("#dialog-performance"),
                $date = container.find("#performance-date"),
                $shares = container.find("#performance-shares"),
                $price = container.find("#performance-price"),
                $mfday = container.find("#performance-mf-day"),
                $taxRate = container.find("#performance-taxRate"),
                $commission = container.find("#performance-commission");

            if ( isMF ) {
              if ( type == 1 ) {
                return dateValidator($date) && numValidator($shares) && numValidator($mfday);
              } else {
                return dateValidator($date) && numValidator($shares);
              }
            } else {
              return dateValidator($date) && numValidator($shares) && numValidator($price) && numValidator($taxRate, true, true) && numValidator($commission, true, true);
            }
          }

          break;
        // 现金股息
        case 5:
          template=''
            +'<p> '
              +'<label for="performance-date"><span class="required">*</span>除息日:</label> '
              +'<input type="text" class="datepicker" id="performance-date" name="performance-date" style="width:90px;"/> '
              +'<span id="beforeShares" ></span>'
            +'</p>'
            +'<p>'
              +' <label for="performance-unitDividend"><span class="required">*</span>派息方案:</label>'
              +' 每股派息<input type="text" name="performance-unitDividend" id="performance-unitDividend" size="6"/><span class="unit">&nbsp;&nbsp;'+money+'</span>'
            +'</p>'
            +'<p> '
              +'<label for="dividend-taxRate">税率:</label> '
              +'<input type="text" name="performance-taxRate" id="performance-taxRate" size="6"/>'
              +'&nbsp;&nbsp;'
              +postfix
            +'</p>'
          getStatus=function(type){
            var container=$("#dialog-performance"),
                status="",
                stockName=container.find(".name").text(),
                moneySymbol=SNB.Util.getStockInfo(symbol).money,
                dt=container.find("#performance-date").val(),
                price=container.find("#performance-unitDividend").val(),
                taxRate=container.find("#performance-taxRate"),
                type=opType[type],
                comment=container.find("#performance-comment").val();
            
            status+="$"+stockName+"("+symbol+")$";
            status+=dt;
            status+="发放股息,每股"+moneySymbol+price+"。"
            if(comment){
              status+=comment;
            }
            return status; 
          }
          validate=function(){
            var container=$("#dialog-performance"),
                $date=container.find("#performance-date"),
                $unitDividend=container.find("#performance-unitDividend");

            return dateValidator($date)&&numValidator($unitDividend);
          }
          break;
        case 7:
          template=''
            +'<p> '
              +'<label for="performance-date"><span class="required">*</span>除权日:</label> '
              +'<input type="text" class="datepicker" id="performance-date" name="performance-date" style="width:90px;"/> '
              +'<span id="beforeShares" ></span>'
            +'</p>'
            +'<p>'
              +' <label for="performance-unitShares"><span class="required">*</span>合股方案:</label>'
              +' <input type="text" name="performance-unitShares" id="performance-unitShares" size="6"/>'
              +'<span>&nbsp;&nbsp;股合成1股</span>'
            +'</p>'
            +'<p> '
              +'<label for="afterShares">合股后数量:</label> '
              +'<span id="afterShares"></span>股'
            +'</p>'
          getStatus=function(type){
            var container=$("#dialog-performance"),
                status="",
                stockName=container.find(".name").text(),
                moneySymbol=SNB.Util.getStockInfo(symbol).money,
                dt=container.find("#performance-date").val(),
                value=container.find("#performance-unitShares").val(),
                type=opType[type],
                comment=container.find("#performance-comment").val();
            
            status+="$"+stockName+"("+symbol+")$";
            status+=dt;
            status+="合股,"+value+"合1。"
            if(comment){
              status+=comment;
            }
            return status; 
          }
          validate=function(){
            var container=$("#dialog-performance"),
                $date=container.find("#performance-date"),
                $unitShares=container.find("#performance-unitShares");

            return dateValidator($date)&&numValidator($unitShares);
          }
          break;
        case 8:
          template=''
            +'<p> '
              +'<label for="performance-date"><span class="required">*</span>除权日:</label> '
              +'<input type="text" class="datepicker" id="performance-date" name="performance-date" style="width:90px;"/> '
              +'<span id="beforeShares" ></span>'
            +'</p>'
            +'<p>'
              +' <label for="performance-unitShares"><span class="required">*</span>拆股方案:</label>'
              +'<span>1股拆成</span>'
              +' <input type="text" name="performance-unitShares" id="performance-unitShares" size="6"/>'
              +'<span>&nbsp;&nbsp;股</span>'
            +'</p>'
            +'<p> '
              +'<label for="afterShares">拆股后数量:</label> '
              +'<span id="afterShares"></span>股'
            +'</p>'
          getStatus=function(type){
            var container=$("#dialog-performance"),
                status="",
                stockName=container.find(".name").text(),
                moneySymbol=SNB.Util.getStockInfo(symbol).money,
                dt=container.find("#performance-date").val(),
                value=container.find("#performance-unitShares").val(),
                type=opType[type],
                comment=container.find("#performance-comment").val();
            
            status+="$"+stockName+"("+symbol+")$";
            status+=dt;
            status+="拆股，1拆"+value+"。"
            if(comment){
              status+=comment;
            }
            return status; 
          }
          validate=function(){
            var container=$("#dialog-performance"),
                $date=container.find("#performance-date"),
                $unitShares=container.find("#performance-unitShares");

            return dateValidator($date)&&numValidator($unitShares);
          }
          break;
        case 9:
          template=''
            +'<p> '
              +'<label for="performance-date"><span class="required">*</span>除权除息日:</label> '
              +'<input type="text" class="datepicker" id="performance-date" name="performance-date" style="width:90px;"/> '
              +'<span id="beforeShares" ></span>'
            +'</p>'
            +'<p>10股</p>'
            +'<p> '
              +'<label for="performance-unitIncreaseShares">转增:</label> '
              +'<input type="text" name="performance-unitIncreaseShares" id="performance-unitIncreaseShares" size="6"/>股 '
            +'</p>'
            +'<p> '
              +'<label for="performance-unitShares">送&nbsp;&nbsp;&nbsp;:</label> '
              +'<input type="text" name="performance-unitShares" id="performance-unitShares" size="6"/>股 '
            +'</p>'
            +'<p> '
              +'<label for="performance-unitDividend">红利:</label> '
              +'<input type="text" name="performance-unitDividend" id="performance-unitDividend" size="6"/> '
              +money
            +'</p>'
            +'<p> '
              +'<label for="performance-taxRate">税率:</label> '
              +'<input type="text" name="performance-taxRate" id="performance-taxRate" size="6"/> '
              +'&nbsp;&nbsp;'
              +postfix
              + '<label for="performance-saveTaxRate" style="float:right;">'
                + '<input type="checkbox" id="performance-saveTaxRate" checked>保存为常用税率'
              + '</label>'
            +'</p>'
          getStatus=function(type){
            var container=$("#dialog-performance"),
                status="",
                stockName=container.find(".name").text(),
                moneySymbol=SNB.Util.getStockInfo(symbol).money,
                dt=container.find("#performance-date").val(),
                increaseShares=container.find("#performance-unitIncreaseShares").val(),//转增
                shares=container.find("#performance-unitShares").val(),
                dividend=container.find("#performance-unitDividend").val(),
                type=opType[type],
                comment=container.find("#performance-comment").val();
            
            status+="$"+stockName+"("+symbol+")$";
            status+=dt+ " 除权除息,每10股";
            var originStatus=status;
            if(shares!=0){
              status+="送红股"+shares+"股";
            }
            if(dividend!=0){
              if(status!=originStatus){
                status+="，";
              }
              status+="派"+dividend+money+"现金（含税）"
            }
            if(increaseShares!=0){
              if(status!=originStatus){
                status+="，";
              }
              status+="转赠"+increaseShares+"股"
            }
            status+="。";
            if(comment){
              status+=comment;
            }
            return status; 
          }
          validate=function(){
            var container=$("#dialog-performance"),
                $date=container.find("#performance-date"),
                $unitShares=container.find("#performance-unitShares"),
                $increaseShares=container.find("#performance-unitIncreaseShares"),
                $unitDividend=container.find("#performance-unitDividend"),
                result=true;

            if($unitShares.val()){
              result=numValidator($unitShares,true);
            }
            if($increaseShares.val()){
              result=numValidator($increaseShares,true);
            }
            if($unitDividend.val()){
              result=numValidator($unitDividend,true);
            }
            return dateValidator($date)&&result;
          }
          break;
        case 6:
          template=''
            +'<p> '
              +'<label for="performance-date"><span class="required">*</span>除权日:</label> '
              +'<input type="text" class="datepicker" id="performance-date" name="performance-date" style="width:90px;"/> '
              +'<span id="beforeShares" ></span>'
            +'</p>'
            +'<p>'
              +' <label for="performance-unitShares"><span class="required">*</span>每1股送/增:</label>'
              +' <input type="text" name="performance-unitShares" id="performance-unitShares" size="6"/>'
              +'<span>&nbsp;&nbsp;股</span>'
            +'</p>'
            +'<p> '
              +'<label for="afterShares">红股数量:</label> '
              +'<span id="afterShares"></span>股'
            +'</p>'
          getStatus=function(type){
            var container=$("#dialog-performance"),
                status="",
                stockName=container.find(".name").text(),
                moneySymbol=SNB.Util.getStockInfo(symbol).money,
                dt=container.find("#performance-date").val(),
                value=container.find("#performance-unitShares").val(),
                type=opType[type],
                comment=container.find("#performance-comment").val();
            
            status+="$"+stockName+"("+symbol+")$";
            status+=dt;
            status+="送/增股，每股分得"+value+"股。"
            if(comment){
              status+=comment;
            }
            return status; 
          }
          validate=function(){
            var container=$("#dialog-performance"),
                $date=container.find("#performance-date"),
                $unitShares=container.find("#performance-unitShares");

            return dateValidator($date)&&numValidator($unitShares);
          }
          break;
      }
      return {html:template,status:getStatus,validate:validate}
    },
    addStock:function(stock,groups,callback){//stock对象里面应该包含isEdit属性
      var isEdit=!!stock.isEdit;

      if(!callback&&typeof groups==="function"){
        callback=groups;
        groups={};
      }

      if(isEdit&&_.isEmpty(groups)){
        var portfoliosReq=SNB.get("/stock/portfolio/list.json",{uid:SNB.currentUser.id}),
            stockInfoReq=SNB.get("/stock/portfolio/stock.json",{symbol:stock.symbol});

        $.when(portfoliosReq,stockInfoReq).then(function(p,s){
          var portfolios=p[0]?p[0].portfolios:[],
              stockInfo=s[0],
              ids=stockInfo.portfolioIds.split(","),current=[];

          stock=_.extend(stock,stockInfo);
          _.each(ids,function(id){
            if(id!=-1){
              var portfolio=_.find(portfolios,function(portfolio){
                return portfolio.id==id;
              })
              if(portfolio){
                current.push(portfolio.name);
              }
            }
          })

          groups.current=current;
          groups.all=portfolios;
          showDialog(isEdit,groups,stock,callback);
        })    
      }else{
        showDialog(isEdit,groups,stock,callback);
      }

      
      function showDialog(isEdit,groups,stock,callback){
        var $dialog=SNB.dialog.addStockDialog({
              isEdit:isEdit,
              groups:groups,
              stock:stock,
              callback:callback
            });

        $dialog.dialog({
          modal: 'true',
          width: '360px',
          close: function(event, ui) {
            $("#search-stock").val("");
          },
          title: (isEdit?"修改":"添加")+"自选股"
        });
      }
    },
    performanceDialog: function(options){
      // 获取常用佣金税率的参数
      function getSaveParams(symbol, type){
        var stockTypes = {
            "沪股": 1,
            "深股": 2,
            "美股": 3,
            "港股": 4,
            "比特币": 5
          },
          stockType = SNB.Util.getStockInfo(symbol).bigType,
          saveParams = {},
          op_type;

        if ( stockType == "沪深" ) {
          if ( ~symbol.indexOf("SH") ) {
            stockType = "沪股";
          } else {
            stockType = "深股";
          }
        }  

        saveParams.stock_type = stockTypes[stockType];

        if ( type == 1 || type == 2 ) {
          op_type = 1;
        }
        if ( type == 3 || type == 4 ) {
          op_type = 2;
        }
        if (type == 9 ) {
          op_type = 3;
        }
        saveParams.op_type = op_type;

        return saveParams;
      }

      // 获取常用佣金税率 
      function getCommissionTax(symbol, type, isEdit){
        if ( isEdit ) {
          return false;
        } 

        var saveParams = getSaveParams(symbol, type),
          stockInfo = SNB.Util.getStockInfo(symbol);

        SNB.get("/stock/commissiontax/show.json", saveParams, function(obj){
          var $commission = $("#performance-commission"),
              $taxRate = $("#performance-taxRate");

          if ( $commission.length ) {
            $commission.val(obj.commission || obj.commission_rate);
            
            if ( obj.commission != 0 ) {
              $commission.next().val(1);
            } else {
              $commission.next().val(0);
            }
          }

          if ( $taxRate.length ) {
            $taxRate.val(obj.tax || obj.tax_rate);
            if ( obj.tax ) {
              $taxRate.next().val(1);
            } else {
              $taxRate.next().val(0);
            }
          }

          // 默认税率
          if ( _.isUndefined(obj.commissionRate) && _.isUndefined(obj.commission) ) {
            if ( stockInfo.bigType === "沪深" ) {
              $commission.next().val(0);
              $commission.val(1.5);
            } else if ( stockInfo.bigType === "港股" ) {
              $commission.next().val(0);
              $commission.val(2.5);
            }
          }

          if ( _.isUndefined(obj.taxRate) && _.isUndefined(obj.tax) ) {
            if ( stockInfo.bigType === "港股" ) {
              $taxRate.next().val(0);
              $taxRate.val(1.21);
            }
          }
        });
      }

      var performanceDialog = $("#dialog-performance"),
        isEdit = options.isEdit,
        callback = options.callback,
        stock = options.stock,
        type = options.type,
        obj = options.tranObj,
        that = this,
        shares = options.shares,
        template = that.getTemplate(type, stock.symbol),
        stockType = SNB.Util.getStockInfo(stock.symbol),
        isMF = stockType.type === '货币基金',
        typeHtml = '<p><span class="required">*</span><label for="performance-type">类型:</label><select id="performance-type">',
        opType = ["", "买入", "卖出", "补回", "卖空", "现金股息", "红股入账", "合股", "拆股", "除权除息"],
        typeInterface = [
          "",
          { add: "/stock/portfolio/addtrans.json", edit: "/stock/portfolio/updtrans.json" },
          { add: "/stock/portfolio/addtrans.json", edit: "/stock/portfolio/updtrans.json" },
          { add: "/stock/portfolio/addtrans.json", edit: "/stock/portfolio/updtrans.json" },
          { add: "/stock/portfolio/addtrans.json", edit: "/stock/portfolio/updtrans.json" },
          { add: "/stock/dividend/addtrans.json", edit: "/stock/dividend/updtrans.json" },
          { add: "/stock/joinsplit/addtrans.json", edit: "/stock/joinsplit/updtrans.json" },
          { add: "/stock/joinsplit/addtrans.json", edit: "/stock/joinsplit/updtrans.json" },
          { add: "/stock/joinsplit/addtrans.json", edit: "/stock/joinsplit/updtrans.json" },
          { add: "/stock/bonus/addtrans.json", edit: "/stock/bonus/updtrans.json" },
        ];

      // 货币基金换用不同的接口
      if ( isMF ) {
        typeInterface[1] = {
          add: '/stock/transfund/create.json',
          edit: '/stock/transfund/update.json'
        };

        typeInterface[2] = {
          add: '/stock/transfund/create.json',
          edit: '/stock/transfund/update.json'
        }
      }    

      _.each(opType, function(op, index){
        if ( ( stockType.type == "比特币" || stockType.type == "货币基金" ) && index > 2 ) {
          return;
        }
        // 去掉现金股息，红股入账 合并成分红派息
        if ( index && index != 5 && index != 6 ) {
          typeHtml += '<option value="' + index + '">' + op + '</option>';
        }
      });

      typeHtml += '</select>'

      if ( performanceDialog.length < 1 ) {
        var html=' '
            + '<div id="dialog-performance" class="dialog-wrapper">'
              + '<form id="add-performance" action="">'
                + '<p>'
                  + '<span class="code"></span>'
                  + '<span class="name"></span>&nbsp; '
                  + '<label for="current" id="performance-current-label">当前价:</label> '
                  + '<span id="moneySymbol"></span>' 
                  + '<span class="current" id="current"></span>' 
                + '</p> '
                + '<p>'
                  + '<span>持仓组合：</span>'
                  + '<select id="performance-groups">'
                  + '</select>'
                + '<p>'
                + typeHtml
                + '<div id="performance-container">'
                + '</div>'
                + '<p>' 
                  + '<label for="performance-comment" style="display: block;">备注</label>' 
                  + '<textarea id="performance-comment" name="comment" rows="4" cols="44"></textarea> '
                + '</p>' 
                + '<p class="selectShareType">'
                  + '<label for="only-self">'
                    + '<input type="radio" id="only-self" name="share"/>'
                  + ' 仅自己可见</label>'
                + '</p>' 
                + '<p id="shareStatus" data-type="performance"></p>'
                + '<p class="submit" style="overflow:hidden;">'
                    + ' <input type="button" class="cancel button" value="取消" /> '
                    + '<input type="submit" class="submit" value="确定" /> '
                + '</p>' 
              + '</form>'
            + '</div> ';

        $("body").append(html);
        performanceDialog = $("#dialog-performance");
        SNB.Util.shareModule({ container: $("#dialog-performance").find("#shareStatus"), type: "performance" });
      }

      performanceDialog.find("#performance-container").html(template.html);
      performanceDialog.find("#moneySymbol").html(SNB.Util.getStockInfo(stock.symbol).money);
      performanceDialog.find(".code").html(stock.symbol);
      performanceDialog.find(".name").html(stock.name);
      performanceDialog.find(".current").html(stock.current);

      if ( stockType.type == "货币基金" ) {
        performanceDialog.find("#performance-current-label").text("万份收益");
      }

      var maxDate ;

      if (stockType.bigType == "美股" && stock.time) {
        maxDate = SNB.Util.formatTime(stock.time);
        if (!performanceDialog.find("#performance-tip").length) {
          var tipHtml = '<span id="performance-tip">&nbsp;(最后交易日：' + maxDate + ')</span>';
          performanceDialog.find("#performance-date").after(tipHtml);
        }
      } else {
        maxDate = new Date();
      }

      performanceDialog.find("#performance-date").datepicker({
        maxDate: maxDate 
      });

      performanceDialog.find("#performance-type").val(type);

      if ( !isMF ) {
        getCommissionTax(stock.symbol, type, isEdit);
      }

      // 持仓分组
      SNB.get("/stock/transgroup/list.json", {}, function(ret){
        var html = '';
        if ( ret && ret.length ) {
          _.each(ret, function(group){
            html += '<option value="' + group.id + '">' + group.name + '</option>';
          }); 
        }
        $("#performance-groups").html(html).val(SNB.data.currentPerformanceGroupId);
      });

      var $date = $("#performance-date"),
        $type = $("#performance-type"),
        // 持仓分组
        $groups = $("performance-groups"),
        $shares = $("#performance-shares"),
        $sharesAll = $("#performance-sharesAll"),
        $price = $("#performance-price"),
        $comment = $("#performance-comment"),
        $commission = $("#performance-commission"),
        $taxRate = $("#performance-taxRate"),
        $unitShares = $("#performance-unitShares"),
        $unitDividend = $("#performance-unitDividend"),
        $unitIncreaseShares = $("#performance-unitIncreaseShares"),
        $mfEarningtype = $('input[name="performance-mf-calculate"]'),
        $mfDay = $("#performance-mf-day");

      // 编辑的话  填充
      if ( isEdit ) {
        performanceDialog.data("tid", obj.tid);
        performanceDialog.find("#performance-groups").attr("disabled", "disabled");
        $("#only-self").attr("checked", "checked");
        performanceDialog.find("#shareStatus").hide();
        $type.val(type).attr("disabled", "disabled");
        $date.val(SNB.Util.formatTime(obj.date)).attr("disabled", "disabled");
        $comment.val(obj.comment);
        // 持仓分组
        $groups.val(obj.groupId);

        if ( $shares.length ) {
          $shares.val(obj.shares);
        }

        if ( $sharesAll.length ) {
          $sharesAll.val(obj.sharesAll);
        }

        if ( $price.length ) {
          $price.val(obj.price)
        }

        if ( $commission.length ) {
          $commission.val(obj.commission || obj.commissionRate);
          
          if ( obj.commission != 0 ) {
            $commission.next().val(1);
          } else {
            $commission.next().val(0);
          }
        }

        if ( $taxRate.length ) {
          $taxRate.val(obj.tax || obj.taxRate);
          if ( obj.tax ) {
            $taxRate.next().val(1);
          } else {
            $taxRate.next().val(0);
          }
        }

        if ( $unitShares.length ) {
          $unitShares.val(obj.unitShares);
        }

        if ( $unitDividend.length ) {
          $unitDividend.val(obj.unitDividend);
        }
        if ( $unitIncreaseShares.length ) {
          $unitIncreaseShares.val(obj.unitIncreaseShares);
        }

        if ( $mfEarningtype.length ) {
          $mfEarningtype.eq(obj.earning_type - 1).attr("checked", "checked");
        }

        if ( $mfDay.length ) {
          $mfDay.val(obj.day);
        }
      } else {
        $type.removeAttr("disabled");
        performanceDialog.find("#performance-groups").removeAttr("disabled");
        performanceDialog.find("input:text").val("");
        performanceDialog.find("textarea").val("");
        //$("#share-performance").attr("checked","checked");
        performanceDialog.find("#shareStatus").show();

        // 如果没有分享的话  
        var isShare = false;
        $("#shareStatus input").each(function(){
          if ( $(this).is(":checked") ) {
            isShare=true;
          }
        });

        if ( isShare ) {
          performanceDialog.find("#only-self").removeAttr("checked");
        }
      }
      if ( stockType.market == "美股" && !isEdit ) {
        performanceDialog.find("#performance-commission").next().val(1);
      }
      //  事件
      performanceDialog.delegate("input:text", "focus", function(e){
        if ( $(this).hasClass("error") ) {
          $(this).removeClass("error").val("");
        }
      });

      performanceDialog.find("#statusPreview").hover(function(e){
        var type = parseInt($("#performance-type").val(),10),
            symbol = performanceDialog.find(".code").text(),
            template = that.getTemplate(type,symbol);

        this.title = template.status($("#performance-type").val());
      },$.noop);
      
      performanceDialog.find("#performance-type").change(function(e){
        var val = parseInt($(this).val(), 10),
            html = that.getTemplate(val,stock.symbol).html;

        $("#performance-container").html(html)

        var maxDate ;

        if (stockType.bigType == "美股" && stock.time && val != 9) {
          maxDate = SNB.Util.formatTime(stock.time);
          if (!performanceDialog.find("#performance-tip").length) {
            var tipHtml = '<span id="performance-tip">&nbsp;(最后交易日：' + maxDate + ')</span>';
            performanceDialog.find("#performance-date").after(tipHtml);
          }
        } else {
          maxDate = new Date();
        }

        performanceDialog.find("#performance-date").datepicker({
          maxDate: maxDate 
        });

        getCommissionTax(stock.symbol, val);
      });

      performanceDialog.delegate("#performance-unitShares", "keyup", function(e){
        if ( typeof shares !== "undefined" && $("#performance-unitShares").val() ) {
          if ( _.isNumber(parseFloat($("#performance-unitShares").val())) ) {
            var type = $("#performance-type").val();
            if(type == "7"){
              performanceDialog.find("#afterShares").html(shares / $("#performance-unitShares").val());
            }else{
              performanceDialog.find("#afterShares").html(shares * $("#performance-unitShares").val());
            }
          }
        }
      });

      performanceDialog.delegate("#performance-date", "change", function(e){
        if ( $("#beforeShares").length ) {
          var date = $("#performance-date").val();

          if ( /\d{4}-\d{2}-\d{2}/.test(date) ) {
            SNB.get("/stock/portfolio/currentshares.json", { symbol: stock.symbol, date: date, group_id: SNB.data.currentPerformanceGroupId }, function(ret){
              if ( ret ) {
                shares = ret.currentShares || 0;
                performanceDialog.find("#beforeShares").html("前持有" + shares + "股");
              }
            });
          }
        }
      });

      performanceDialog.delegate("#shareStatus input", "click", function(e){
        if ( $(this).is(":checked") ) {
          $("#only-self").removeAttr("checked");
          SNB.Util.saveConfig({ "sharestatus": 1 });
        } else {
          if ( !performanceDialog.find("#shareStatus label:visible input:checked").length ) {
            $("#only-self").attr("checked", "checked");
            SNB.Util.saveConfig({ "sharestatus": 0 });
          }
        }
      });

      performanceDialog.delegate("#only-self", "click", function(e){
        if ( $(this).is(":checked") ) {
          performanceDialog.find("#shareStatus input").removeAttr("checked");
          SNB.Util.saveConfig({ "sharestatus": 0 });
        }
      });

      $("#add-performance").unbind("submit").submit(function(e){
        e.preventDefault();
        var type = parseInt($("#performance-type").val(),10),
          symbol = performanceDialog.find(".code").text(),
          template = that.getTemplate(type,symbol),
          $groups = $("#performance-groups"),
          $date = $("#performance-date"),
          $type = $("#performance-type"),
          $shares = $("#performance-shares"),
          $sharesAll = $("#performance-sharesAll"),
          $price = $("#performance-price"),
          $comment = $("#performance-comment"),
          $commission = $("#performance-commission"),
          $taxRate = $("#performance-taxRate"),
          $unitShares = $("#performance-unitShares"),
          $unitDividend = $("#performance-unitDividend"),
          $unitIncreaseShares = $("#performance-unitIncreaseShares"),
          $mfEarningtype = $('input[name="performance-mf-calculate"]'),
          $mfDay = $("#performance-mf-day");

        if ( template.validate() ) {
          function addPerformance(){
            // 赋值参数
            var params = {};
            params.type = $type.val();
            params.date = $date.val();
            params.comment = $comment.val();
            params.symbol = stock.symbol;
            // 持仓分组
            if ( isMF ) {
              params.group_id = $groups.val();
            } else {
              params.groupId= $groups.val();
            }
            
            if ( $price.length ) {
              params.price = $price.val();
            }

            if ( $shares.length ) {
              params.shares = $shares.val();
            }

            if ( $commission.length ) {
              var postfix = $commission.next().val();
              if ( postfix == 0 ) {
                params.commissionRate = $commission.val();
              } else {
                params.commission = $commission.val();
              }
            }
            
            if ( $taxRate.length ) {
              var postfix = $taxRate.next().val();
              if ( postfix == 0 ) {
                params.taxRate = $taxRate.val();
              } else {
                params.tax = $taxRate.val();
              }
            }

            if ( $unitShares.length ) {
              params.unitShares = $unitShares.val();
            }

            if ( $unitDividend.length ) {
              params.unitDividend = $unitDividend.val();
            }

            if ( $unitIncreaseShares.length ) {
              params.unitIncreaseShares = $unitIncreaseShares.val();
            }

            if ( isEdit ) {
              params.tid = performanceDialog.data("tid");
            }

            if ( $mfEarningtype.length ) {
              params.earning_type = $mfEarningtype.filter(":checked").val();
            }

            if ( $mfDay.length ) {
              params.day = $.trim($mfDay.val());
            }

            var urlObj = typeInterface[$type.val()],
                url = isEdit ? urlObj.edit : urlObj.add;

            SNB.post(url, params, function(ret){
              if ( ret.error_code ) {
                alert(ret.error_description);
                return false;
              }

              performanceDialog.dialog("close");

              if ( !isEdit ) {
                var status = template.status(type);
                var opts = {
                  card_type: "stock",
                  card_param: stock.symbol
                };

                SNB.data.share.shareStatus(status, opts);
                //post
              }

              if ( options.callback ) {
                options.callback(params);
              }
            }, function(e){
              alert(e.error_description);
            });

            // 保存常用的佣金和税率
            var saveCommission = $("#performance-saveCommission").length && $("#performance-saveCommission").is(":checked"),
                saveTaxRate = $("#performance-saveTaxRate").length && $("#performance-saveTaxRate").is(":checked");

            if ( saveCommission || saveTaxRate ) {
              var saveParams = getSaveParams(symbol, type);
              var obj={
                "commission": "commission",
                "commissionRate": "commission_rate",
                "tax": "tax",
                "taxRate": "tax_rate"
              };

              for ( var key in obj ) {
                if ( !_.isUndefined(params[key]) ) {
                  saveParams[obj[key]] = params[key] || 0;
                }
              }

              SNB.post("/stock/commissiontax/add.json", saveParams, $.noop());
            }
          }

          // 判断是否关注该股票  没关注的话 先关注
          SNB.get("/stock/portfolio/hasexist.json", { code: stock.symbol, uid: SNB.currentUser.id }, function(ret){
            if ( ret && ret.hasExist ) {
              addPerformance();
            } else {
              SNB.get("/stock/portfolio/stocks.json", { pid: -1, tuid: SNB.currentUser.id }, function(res) {
                var my_ports = "",
                    groupName = SNB.Util.getStockInfo(stock.symbol).bigType,
                    groups = _.pluck(res.portfolios, "name");
                      
                if ( $.inArray(groupName, groups) > -1 ) {
                  my_ports = groupName;
                } else {
                  my_ports = "全部";
                }

                var data = { pnames: my_ports, code: stock.symbol };

                SNB.Util.portfolio_addstock(data, function(ret){
                  addPerformance();
                },function(ret){
                });
              });
            }
          });
        } else {
          return false;
        }
      });

      performanceDialog.find(".cancel").click(function(e){
        performanceDialog.dialog("close");
      });
      
      return performanceDialog;
    },
    userGroup: function (user, isNewUser, remark) {
      var userGroupDialog = $("#dialog-userGroup"),
        maxGroupCount = 13,
        _remark = remark || '';

      var cb = function (groups) {
        if (!userGroupDialog.length) {
          var html=''
              +'<div id="dialog-userGroup" class="dialog-wrapper">'
                + '<form>'
                  +  '<p class="remark-wrapper" style=""><label for="remark" class="label_remark" >为<span style="vertical-align: baseline;" class="dialog-userGroup-userName"></span>设置备注：</label><input type="text" id="remark" placeholder="长度8个汉字以内" class="dialog_form_text" value="' + _remark + '"></p>'
                  + '<p class="dialog-userGroup-title">为<span class="dialog-userGroup-userName"></span>设置分组：</p>'
                  + '<p class="dialog-userGroup-groups"></p>'
                  + (groups.length>=maxGroupCount?'':'<p style="height:25px;"><a href="#" class="dialog-userGroup-addGroup">新建分组</a></p>')
                  + '<p style="display:none;" class="dialog-userGroup-addGroupContainer">'
                    + '<input type="text" class="dialog_form_text" style="width:165px;" placeholder="分组名最多不超过8个字"/><input type="button" class="submit" value="保存"/><a href="#">取消</a>'
                  + '</p>'
                  +'<p class="submit" style="overflow:hidden;"> <input type="submit" class="submit" value="确定" /><input type="button" class="cancel button" value="取消" />  </p>'
                + '</form>'
              +'</div> ';

          $('body').append(html);

          userGroupDialog = $("#dialog-userGroup");

          userGroupDialog
            .delegate(".dialog-userGroup-addGroup", "click", function (e){
              var p = $(this).parent(),
                addGroupContainer = $(".dialog-userGroup-addGroupContainer");

              p.hide();

              addGroupContainer
                .show()
                .find("input:text")
                  .focus();

              return false;
            })
            .delegate("input:submit", "click", function (e) {
              var deleteGroup = [],
                addGroup = [],
                uid = $(".dialog-userGroup-userName").data("uid"),
                user = userGroupDialog.data("user"),
                $dialog_userGroup = $("#dialog-userGroup"),
                $remark = $dialog_userGroup.find("input#remark"),
                remark_val = $.trim($remark.val()),
                $addGroupContainer = $dialog_userGroup.find(".dialog-userGroup-addGroupContainer")

              //创建新分组时，输入分组信息但未点击创建，须提示用户
              if ($addGroupContainer.is(":visible")) {
                SNB.Util.failDialog("请先保存新建分组");

                return false;
              }

              if (!SNB.Remark.Validate(remark_val)) {
                SNB.Util.failDialog("备注最多不超过8个汉字")
                return false;
              } else {
                SNB.Remark.Action({user_id:uid,remark:remark_val},$.noop(),function(){
                  var $container = $("div[data-uid='" + uid + "']").next().find(".name");
                  if ( remark_val && $container.length ) {

                    var remarkHtml = '<a href="#" data-user-name="' + user.name + '" data-user-id="' + uid + '" data-user-remark="' + remark_val + '" class="user_remark" >(' + remark_val + ')</a>';

                    if ( $container.find(".user_remark").length ) {
                      $container.find(".user_remark").replaceWith(remarkHtml);
                    } else {
                      $container.append(remarkHtml).css("display", "inline");
                    }
                  } 
                });
              }

              $(".dialog-userGroup-groups").find("input:checkbox").each(function(){
                if($(this).is(":checked")){
                  // 新加的
                  if(!$(this).data("exist")){
                    addGroup.push(this.id);
                  }
                }else{
                  // 已存在的未选中说明是取消分组
                  if($(this).data("exist")){
                    deleteGroup.push(this.id);
                  }
                }
              });

              if(deleteGroup.length){
                SNB.post("/friendships/groups/members/destroy.json",{uid:uid,gid:deleteGroup+""},function(ret){ })
              }

              if(addGroup.length){
                var errorCb=function(error){
                  if(error&&error.error_description){
                    alert(error.error_description);
                  }
                }
                if(user.industry_id){
                  SNB.post("/friendships/groups/members/add_industry.json",{gid:addGroup+"",industry_id:user.industry_id,count:user.count,verified:user.verified},$.noop,errorCb)
                }else if(user.isGroup){
                  // 把别人分组下的好友添加到自己分组
                  SNB.post("/friendships/groups/members/add_group.json",{gid:uid,tgid:addGroup+""},$.noop,errorCb)
                }else{
                  SNB.post("/friendships/groups/members/add.json",{uid:uid,gid:addGroup+""},$.noop,errorCb)
                }
              }

              userGroupDialog.dialog("close");

              return false;
            })
            .delegate("input.cancel","click",function(e){
              userGroupDialog.dialog("close");
            })
            .find(".dialog-userGroup-addGroupContainer")
                .delegate("input:button","click",function(e){
                  var text=$(".dialog-userGroup-addGroupContainer input:text"),
                    val=$.trim(text.val()),
                    that=this;

                  if(val){
                    SNB.post("/friendships/groups/create.json",{name:val},function(ret){
                      var html='<label for="'+ret.id+'">&nbsp;&nbsp;<input type="checkbox" id="'+ret.id+'" checked="checked">'+ret.name+'</label>';
                      $(".dialog-userGroup-groups").append(html).show();
                      text.val("");
                      if(SNB.data.userGroups){
                        SNB.data.userGroups.push(ret);
                      }
                      $(that).next().trigger("click");
                    },function(ret){
                      alert(ret.error_description);
                    });
                  }

                  return false;
                  // add user group;
                })
                .delegate("a","click",function(e){
                  $(".dialog-userGroup-addGroupContainer").hide();
                  $(".dialog-userGroup-addGroup").parent().show();

                  return false;
                });
        } else {
          userGroupDialog
            .find('#remark')
              .val(_remark);
        }

        userGroupDialog.data("user", user);
        $(".dialog-userGroup-userName").html(user.isGroup?user.name:("“"+user.name+"”")).data("uid",user.id);

        var groupsContainer = userGroupDialog.find(".dialog-userGroup-groups"),
          groupsHtml = '';

        _.each(groups, function (group) {
          if (group.id != 0 && group.id != 1) {
            groupsHtml += '<label for="' + group.id + '">&nbsp;&nbsp;<input type="checkbox" id="' + group.id + '">' + group.name + '</label>';
          }
        });

        //控制备注信息是否需要显示
        var $dialog_remark = userGroupDialog.find(".remark-wrapper");

        if (isNewUser) {
          $dialog_remark.show()
        } else {
          $dialog_remark.hide()
        }

        if (groupsHtml) {
          groupsContainer.html(groupsHtml);
        } else {
          groupsContainer.hide();
        }

        // 如果不是新关注的用户  去请求当前用户的分组信息
        if (!isNewUser) {
          SNB.get("/friendships/groups/list.json",{uid:user.id},function(ret){
            if(ret&&ret.length){
              $(".dialog-userGroup-groups").find("input:checkbox").each(function(){
                if(~_.indexOf(ret,+this.id)){
                  $(this).attr("checked","checked").data("exist",true);
                }
              });
            }
          });
        }

        return userGroupDialog;
      }

      // 不存在分组  请求分组信息
      if (SNB.data.userGroups) {
        return cb(SNB.data.userGroups);
      } else {
        SNB.get('/friendships/groups.json', function (ret) {
          SNB.data.userGroups = ret;

          var d = cb(SNB.data.userGroups);

          d.dialog({
            title: isNewUser ? '关注成功' : '用户分组',
            width: 'auto',
            modal: true
          });
        });
      }
    }
  }

  if(!SNB.dialog){
    SNB.dialog={};
  }
  _.extend(SNB.dialog,dialog);
});
