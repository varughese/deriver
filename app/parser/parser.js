function replaceNegatives(val){
    for(var i=0; i<val.length; i++){
        if(val.charAt(i)==='-' && (i===0 || "+*^/-".indexOf(val.charAt(i-1))>-1)){
            val = val.replaceAt(i,'~');
        }
    }
    return val;
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
    val = replaceNegatives(val.removeSpaces());
    var missingMultiply = val.findChar('(').concat(val.findChar('x')).sort(function(a, b) {
        return a - b;
    });
    for(var p=missingMultiply.length-1; p>=0; p--) {
        var pos = missingMultiply[p],
            token = val[pos-1];
        if(!isNaN(token) || ')x'.indexOf(token) > -1) {
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
    '^': 5,
    'sin': 6,
    'cos': 7,
    'tan': 8,
    'csc': 9,
    'sec': 10,
    'cot': 11
};

function parseInput(val) {
    if(val === "") return false;
    val = cleanInput(val);

    var parens = parseParens(val),
        org = val;

    if(parens[0] && parens[0][0]===0 && parens[0][1]===val.length-1) {
        org = val = val.substring(1, val.length-1);
        parens.shift();
        parens = parseParens(val);
    }

    for(var j in parens) {
        var l = parens[j][0],
            r = parens[j][1];

        val = val.substring(0, l) + Array(r-l+2).join('_') + val.substring(r+1);
    }

    var foundOps = {};
    for(var c=val.length-1; c>=0; c--) {
        for(var op in OPS) {
            if(val.substring(c, c+op.length) === op) {
                foundOps[op] = c;
            }
        }
    }
    //TODO: Make it understand negatives
    var pos, token;
    for(var o in OPS) {
        if(foundOps[o]>=0) {
            pos = foundOps[o];
            token = val.substring(pos, pos+o.length);
            break;
        }
    }
    if(pos === undefined) {
        if(val === '@@@') return new Tree(TreePattern.MARKER); 
        return new Tree(val.replace(/~/, '-'));
    }
    var tree = new Tree(token);
    tree.left = parseInput(org.substring(0, pos));
    tree.right = parseInput(org.substring(pos+token.length));
    return tree;
}
