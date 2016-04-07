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
        if(val.charAt(i)==='-' && (i===0 || isNaN(val.charAt(i-1)))){
            val = val.replaceIndex(i,'~');
        }
    }
}


$(document).ready(function(){
  $("#submit").click(function(){
    val = $("#input").val();
    replaceNegative(val);
    console.log(val);
    console.log(parseTerm(val));
    $(".history").append("<div class='history-item'>"+val+"</div>");
  });
});

String.prototype.splice = function(start, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start);
};

String.prototype.replaceIndex=function(index, char){
    return this.substring(0,index) + char + this.substring(index+char.length);
};
