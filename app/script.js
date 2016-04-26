var val;

function appendHistory(v) {
    // you gonna have to change this function so you can pass in ID that identifies it, and add that ID as an attribute to this element
    $(".history").append("<div class='history-item'><span class='glyphicon glyphicon-remove'></span>"+v+"</div>");
}

$(document).ready(function(){
    Storage.get().reverse().map(function(n) {
        appendHistory(n);
    });

  $("#submit").click(function(){
    val = $("#input").val();
    console.log(parseInput(val)+"");
    appendHistory(val);
    // storage.add returns a timestamp, which is like the 'ID' of that particular item
    Storage.add(val);
  });

  $(".history").on("click", ".history-item>.glyphicon-remove", function(event) {
      var historyItem = $(event.target).parent();
      console.log(historyItem);
      console.log("find out a way to find the specific timestamp this uses, and then call Storage.remove");
  });

});
