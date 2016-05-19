var val, powerruled;

function appendHistory(v) {
    // you gonna have to change this function so you can pass in ID that identifies it, and add that ID as an attribute to this element
    $(".history").append("<div class='history-item'><span class='glyphicon glyphicon-remove'></span>\\("+v+"\\)</div>");
}


$(document).ready(function(){
    Storage.get().reverse().map(function(n) {
        appendHistory(n);
    });

    $("#input").bind("keyup change", function(){
        $("#real-time-input").css("visibility", "hidden");
        $("#real-time-input").html("<div id='buffer'>\\("+$(this).val()+"\\)"+"<div>");
        MathJax.Hub.Queue(
            ["Typeset",MathJax.Hub],
            MathJax.Callback.Delay(250, [function() {
                $("#real-time-input").css("visibility", "visible");
            }])
        );
    });

  $("#submit").click(function(){
    val = $("#input").val();
    appendHistory(val);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    Storage.add(val);

    val = parseInput(cleanInput(val));
    console.log("Converted to Tree\n" +val);
    derived = derive(val);
    console.log("Derived\n" + derived);
    // storage.add returns a timestamp, which is like the 'ID' of that particular item
  });

  $(".history").on("click", ".history-item>.glyphicon-remove", function(event) {
      var historyItem = $(event.target).parent();
      console.log(historyItem);
      console.log("find out a way to find the specific timestamp this uses, and then call Storage.remove");
  });

});
