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

function parseParens(val) {
    var lefts = val.findChar('('),
        rights = val.findChar(')'),
        list = [];
    if(lefts.length !== rights.length) throw "Mismatched Parentheses!";

    // dope algorithm
    for(var i=lefts.length-1; i>=0; i--) {
        var k = i;
        while(k>=0 && lefts[i] < rights[k]) {
            k--;
        }
        list.push([lefts.pop(), rights.splice(k+1,1)[0]]);
    }

    return list.reverse();
}

function cleanInput(val) {
    var missingMultiply = val.findChar('(').concat(val.findChar('x')).sort(function(a, b) {
        return a - b;
    });
    for(var p=missingMultiply.length-1; p>=0; p--) {
        var pos = missingMultiply[p],
            token = val[pos-1];
        if(!isNaN(token) || token === ')') {
            val = val.splice(pos, '*');
        }
    }
    return val;
}

var OPS = {
    '+': 1,
    '-': 2,
    '*': 3,
    '/': 4,
    '^': 5
};

function parseInput(val) {
    if(val[0] === '(' && val[val.length-1] === ')') val = val.substring(1, val.length-1);

    var parens = parseParens(val),
        org = val;

    for(var j in parens) {
        var l = parens[j][0],
            r = parens[j][1];

        val = val.substring(0, l) + Array(r-l+2).join('_') + val.substring(r+1);
    }
    var foundOps = {};
    for(var c=val.length; c>=0; c--) {
        for(var op in OPS) {
            if(val[c] === op) {
                foundOps[op] = c;
            }
        }
    }

    var pos;
    for(var o in OPS) {
        if(foundOps[o]) {
            pos = foundOps[o];
            token = val[pos];
            break;
        }
    }
    if(!pos) { return new Tree(val); }
    var tree = new Tree(token);
    tree.left = parseInput(org.substring(0, pos));
    tree.right = parseInput(org.substring(pos+1));
    return tree;
}

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

String.prototype.splice = function(start, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start);
};

String.prototype.replaceAt=function(index, char){
    return this.substring(0,index) + char + this.substring(index+char.length);
};

String.prototype.findChar = function(token) {
    var indices = [];
    for(var i=0; i<this.length; i++)
     if(this[i] === token) indices.push(i);

    return indices;
};

Number.prototype.isBetween = function(a, b) {
    return this<=b && this>=a;
};
