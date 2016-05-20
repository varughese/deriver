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

    // Dope algorithm
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
    function sorter(a, b) {return a - b;}

    var missingMultiply = [],
        missingParens = [];

    Object.keys(TreePattern.__FUNCTIONS).map(function(fx) {
        missingParens = missingParens.concat(val.findChar(fx).map(function(pos) {
            return pos + fx.length;
        }));
    });

    missingParens.sort(sorter);

    function findOp(pos, str) {
        return Math.min.apply(Math, TreePattern.checkParens.map(function(op) {
            return pos + str.findChar(op)[0] || str.length + pos;
        }));
    }

    for(var f=missingParens.length-1; f>=0; f--) {
        var pos = missingParens[f],
            end = findOp(pos, val.substring(missingParens[f]));

        if(val[pos] !== '(') {
            val = val.splice(pos, '(');
            val = val.splice(end+1, ')');
        }
    }

    TreePattern.checkMultiply.map(function(n) {
        missingMultiply = missingMultiply.concat(val.findChar(n));
    });

    missingMultiply.sort(sorter);

    for(var p=missingMultiply.length-1; p>=0; p--) {
        var position = missingMultiply[p],
            token = val[position-1];
        if(!isNaN(token) || ')x'.indexOf(token) > -1) {
            val = val.splice(position, '*');
        }
    }

    var logs = val.findChar('log');
    for(var l=logs.length-1; l>=0; l--) {
        var logPos = logs[l],
            parens = parseParens(val),
            comma = val.indexOf(',', logPos),
            base = val.substring(logPos+4, comma),
            arg = val.substring(comma+1, val.indexOf(')', comma)),
            endParen;

        for(var arr in parens) {
            if(parens[arr][0] === logPos+3) {
                endParen = parens[arr][1];
                break;
            }
        }

        arg = val.substring(comma+1, endParen);
        var replace = "ln(" + arg + ")/ln(" + base + ")";
        val = val.cut(logPos, endParen).splice(logPos, replace);
    }

    return val;
}

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
        for(var op in TreePattern.OPS) {
            if(val.substring(c, c+op.length) === op) {
                foundOps[op] = c;
            }
        }
    }

    var pos, token;
    for(var o in TreePattern.OPS) {
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
