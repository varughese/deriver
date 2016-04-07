
$(document).ready(function(){
  $("#submit").click(function(){
    var val = $("#input").val().replace(/-/g,"~");
    console.log(val);
    $(".history").append("<div class='history-item'>"+val+"</div>");
  });
});
