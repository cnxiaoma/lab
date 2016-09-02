/**
 * Created by orange on 16/7/28.
 */
$(function () {
  //问答回复帖子声明
  var statement = "（声明：本回复仅代表该作者观点，不构成任何投资建议）";
  var refuseText = "（已拒绝回复）";
  $.ajax({
    url:'/share/get_content.json?type=8',
    type:'GET',
    success:function(data){
      console.log("update statement");
      if(data.share_content.content){
        statement=data.share_content.content.split("|")[0];
        refuseText=data.share_content.content.split("|")[1];
      }
      SNB.askstatement={statement:statement,refuse:refuseText};
    },
    error:function(){
      SNB.askstatement={statement:statement,refuse:refuseText};
    }
  });

});