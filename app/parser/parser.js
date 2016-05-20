function replaceNegatives(val){
    for(var i=0; i<val.length; i++){
        if(val.charAt(i)==='-' && (i===0 || "+*^/-(".indexOf(val.charAt(i-1))>-1)){
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
    //TODO add multiply after and before trig
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

    var logs = val.findChar('log');
    for(var l=logs.length-1; l>=0; l--) {
        var logPos = logs[l],
            comma = val.indexOf(',', logPos),
            base = val.substring(logPos+4, comma);

        val = val.cut(logPos+4,comma+1).splice(logPos, base);
    }

    return val;
}

var OPS = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
    'arcsin': 4,
    'arccos': 4,
    'arctan': 4,
    'arccsc': 4,
    'arcsec': 4,
    'arccot': 4,
    'sin': 5,
    'cos': 5,
    'tan': 5,
    'csc': 5,
    'sec': 5,
    'cot': 5,
    'ln': 6,
    'log': 6,
    'abs': 7
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
