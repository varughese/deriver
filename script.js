var val;

function parseTerm(term) {
    var caret_pos = term.lastIndexOf("^");
    var degree = term.substring(caret_pos+1);
    term = term.substring(0, caret_pos);
    var x_pos = term.indexOf("x");
    if(term[term.length-1] !== ')') {
        term = term.splice(term.indexOf("x"), '(');
        term += ')';
    }
    var leftPar_pos = term.indexOf("(");
    var rightPar_pos = term.lastIndexOf(")");
    var value = term.substring(leftPar_pos+1, rightPar_pos);
    var coefficent = Number(term.substring(0, leftPar_pos) || 1);
    return {
        coeff: coefficent,
        value: value,
        deg: degree
    };
}

function replaceNegative(){
    for(var i=0; i<val.length; i++){
        if(val.charAt(i)==='-' && (i===0 || "+*^/-".indexOf(val.charAt(i-1))>-1)){
            val = val.replaceIndex(i,'~');
        }
    }
}

function RefreshHoverEventListener(){
    $(".history > .history-item").off();
    $(".history-item > span.glyphicon-remove").off();

    $(".history > .history-item").on("mouseover", function(){

        $(this).find("span.glyphicon-remove").stop().fadeIn();
    });

    $(".history > .history-item").on("mouseleave", function(){

        $(this).find("span.glyphicon-remove").stop().fadeOut();
    });

    $(".history-item > span.glyphicon-remove").on("click", function(){
        $(this).closest('.history-item').remove();
    });
}

function appendHistory(v) {
    $(".history").append("<div class='history-item'>"+v+"<span class='glyphicon glyphicon-remove'></span></div>");
    RefreshHoverEventListener();
}

$(document).ready(function(){
    Storage.getFromStorage().reverse().map(function(n) {
        appendHistory(n);
    });

  $("#submit").click(function(){
    val = $("#input").val();
    console.log(parseTerm(val));
    appendHistory(val);
    Storage.addToStorage(val);
  });

});

String.prototype.splice = function(start, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start);
};

String.prototype.replaceAt=function(index, char){
    return this.substring(0,index) + char + this.substring(index+char.length);
};
