// Source: src/_intro.js
var Deriver = (function() {

// Source: src/deriver.js
function derive(t) {
    if(!(t instanceof Tree)) t = parseInput(t);

    if(t.val === 'x') return new Tree(1);

    if(!t.left && !t.right || TreePattern.eq(t.val, TreePattern.NUM)) return new Tree(0);

    // Sum and Difference Rule
    if(t.val === '+' || t.val === '-') {
        var res = new Tree(t.val);
        res.l(derive(t.left));
        res.r(derive(t.right));
        if(res.right.val === 0) return res.left;
        if(res.left.val === 0) return res.right;
        return res;
    }

    // Product Rule and Constant Rule
    if(t.val === '*') {
        if(TreePattern.eq(t.left.val, TreePattern.NUM) ||
           TreePattern.eq(t.right.val, TreePattern.NUM)) {
            return constantRule(t);
       } else {
           return productRule(t);
       }
    }

    // Power Rule and Exponential Rule
    if(t.val === '^' || t.val === 'sqrt') {
        if(t.val === 'sqrt') {
            t.left = t.right.clone();
            var half = new Tree('/');
            half.l(1); half.r(2);
            t.right = half;
            t.val = "^";
        }
        if(TreePattern.eq(t.right, TreePattern.NUM)) {
            if(!TreePattern.eq(t.left, TreePattern.NUM)) {
                return powerRule(t);
            }
        } else {
            return exponentialRule(t);
        }
    }

    // Quotient Rule
    if(t.val === '/') {
        return quotientRule(t);
        //TODO make this check better and deal with fractions
    }

    // Log Rules
    if(TreePattern.eq(t.val, TreePattern.LOG)) {
        return logRule(t);
    }

    // Trig Rules
    if(TreePattern.eq(t.val, TreePattern.TRIG)) {
        return trigRules(t);
    }

}

function constantRule(t) {
    var res = new Tree('*'), d, c;

    if(TreePattern.eq(t.right.val, TreePattern.NUM)) {
        c = t.right.val;
        d = derive(t.left);
    } else if(TreePattern.eq(t.left.val, TreePattern.NUM)) {
        c = t.left.val;
        d = derive(t.right);
    }

    if(d.val === 1) return new Tree(c);
    if(TreePattern.eq(d.val, TreePattern.NUM)) return new Tree(c * d.val);

    if(d.left && TreePattern.eq(d.left.val, TreePattern.NUM)) {
        d.left.val *= c;
        return d;
    }

    res.l(c);
    res.r(d);

    return res;
}

function powerRule(t) {
    var tree = t.clone(),
        res = new Tree("*"),
        innerFx = t.left.clone();

    if(TreePattern.eq(tree.right.val, TreePattern.NUM)) {
        var c = tree.right.val--;
        res.l(c);
        if(tree.right.val === 1) {
            tree = tree.left;
        }
        res.r(tree);
    } else {
        res.l(tree.right.clone());
        tree.right.left.val -= tree.right.right.val;
        res.r(tree);
    }

    return chainRule(res, innerFx);
}

function productRule(t) {
    var res = new Tree("+"),
        left = new Tree("*"),
        right = new Tree("*");

    left.l(t.left);
    left.r(derive(t.right));

    right.l(t.right);
    right.r(derive(t.left));

    res.l(left);
    res.r(right);

    return res;
}

function quotientRule(t) {
    var res = new Tree('/'),
        num = new Tree('-'),
        denom = new Tree('^'),
        hi = t.left,
        lo = t.right,
        dHi = derive(hi),
        dLo = derive(lo),
        loDHi = new Tree("*"),
        hiDLo = new Tree("*");

    if(dHi.val !== 1) {
        loDHi.l(lo);
        loDHi.r(dHi);
    } else {
        loDHi = lo;
    }

    if(dLo.val !== 1) {
        hiDLo.l(hi);
        hiDLo.r(dLo);
    } else {
        hiDLo = hi;
    }

    num.l(loDHi);
    num.r(hiDLo);

    if(TreePattern.eq(loDHi, TreePattern.NUM) && TreePattern.eq(hiDLo, TreePattern.NUM)) {
        num = loDHi.val - hiDLo.val;
    }

    var zeroPattern = new Tree('*');
    zeroPattern.l(TreePattern.ANY);
    zeroPattern.r(0);

    if(num.left.equals(zeroPattern) || num.left.equals(zeroPattern.switch())) {
        var r = new Tree("*");
        r.l(-1);
        r.r(num.right);
        if(num.right.val === 1) {
            num = new Tree(-1);
        } else {
            num = r;
        }
    }
    if(num.right && (num.right.equals(zeroPattern) || num.right.equals(zeroPattern.switch()))) {
        num = num.left;
    }

    denom.l(lo);
    denom.r(2);

    res.l(num);
    res.r(denom);

    return res;
}

function chainRule(org, innerFx) {
    if(innerFx.right) {
        var res = new Tree("*");
        var d = derive(innerFx);
        if(d.val != '1') {
            res.l(org);
            res.r(d);

            return res;
        }
    }

    return org;
}

function trigRules(t) {
    var tree = t.clone(),
        tRules = {
            'sin': parseInput('cos@@@'),
            'cos': parseInput('-1*sin@@@'),
            'tan': parseInput('(sec@@@)^2'),
            'csc': parseInput('-1*csc@@@*cot@@@'),
            'sec': parseInput('sec@@@*tan@@@'),
            'cot': parseInput('-1*(csc@@@)^2'),
            'arcsin': parseInput('1/(sqrt(1-@@@^2))'),
            'arccos': parseInput('-1/(sqrt(1-@@@^2))'),
            'arctan': parseInput('1/(1+(@@@^2))'),
            'arccsc': parseInput('-1/(abs(@@@)*sqrt(@@@^2-1))'),
            'arcsec': parseInput('1/(abs(@@@)*sqrt(@@@^2-1))'),
            'arccot': parseInput('-1/(1+@@@^2)')
        };

    if(tRules[t.val]) {
        var res = tRules[t.val].clone();

        res.replace(TreePattern.MARKER, t.right);

        return chainRule(res, t.right);
    }
}


function logRule(t) {
    var res = new Tree('/');

    if(TreePattern.eq(t.right, TreePattern.NUM)) return new Tree(0);

    res.l(derive(t.right));
    res.r(t.right);
    return res;
}

function exponentialRule(t) {
    var res = new Tree("*"),
        ln = new Tree("ln");

    res.l(t.clone());
    ln.r(t.left);
    res.r(ln);

    if(t.left.val === 'e') {
        res = t.clone();
    }

    return chainRule(res, t.right);
}

// Source: src/parser.js
function replaceNegatives(val){
    for(var i=0; i<val.length; i++){
        if(val.charAt(i)==='-' && (i===0 || "+*^/-(".indexOf(val.charAt(i-1))>-1)){
            val = __strings.replaceAt.call(val, i,'~');
        }
    }
    return val;
}

function parseParens(val) {
    var lefts = __strings.findChar.call(val,'('),
        rights = __strings.findChar.call(val,')'),
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
    val = replaceNegatives(__strings.removeSpaces.call(val)).toLowerCase();
    function sorter(a, b) {return a - b;}

    var missingMultiply = [],
        missingParens = [];

    Object.keys(TreePattern.__FUNCTIONS).map(function(fx) {
        missingParens = missingParens.concat(__strings.findChar.call(val,fx).map(function(pos) {
            return pos + fx.length;
        }));
    });

    missingParens.sort(sorter);

    function findOp(pos, str) {
        return Math.min.apply(Math, TreePattern.checkParens.map(function(op) {
            return pos + __strings.findChar.call(str, op)[0] || str.length + pos;
        }));
    }

    for(var f=missingParens.length-1; f>=0; f--) {
        var pos = missingParens[f],
            end = findOp(pos, val.substring(missingParens[f]));

        if(val[pos] !== '(') {
            val = __strings.splice.call(val,pos, '(');
            val = __strings.splice.call(val,end+1, ')');
        }
    }

    TreePattern.checkMultiply.map(function(n) {
        missingMultiply = missingMultiply.concat(__strings.findChar.call(val,n));
    });

    missingMultiply.sort(sorter);

    for(var p=missingMultiply.length-1; p>=0; p--) {
        var position = missingMultiply[p],
            token = val[position-1];
        if(!isNaN(token) || ')x'.indexOf(token) > -1) {
            val = __strings.splice.call(val,position, '*');
        }
    }

    var logs = __strings.findChar.call(val,'log');
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
        val = __strings.splice.call(__strings.cut.call(val, logPos, endParen), logPos, replace);
    }

    return val;
}

function parseInput(val) {
    if(val === "") return false;
    val = cleanInput(val);

    var parens = parseParens(val),
        org = val;

    while(parens[0] && parens[0][0]===0 && parens[0][1]===val.length-1) {
        org = val = val.substring(1, val.length-1);
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
        if(val.length === 3 && rules[val]) return new Tree(TreePattern[rules[val]]);
        return new Tree(val.replace(/~/, '-'));
    }
    var tree = new Tree(token);
    tree.left = parseInput(org.substring(0, pos));
    tree.right = parseInput(org.substring(pos+token.length));
    return tree;
}

// Source: src/simplifier.js
function simplifyHelper(t) {
    var tree = t.clone();
    var res = tree;

    if (t.left && t.left.equals(t.right)) {
        res = simplifyEquivalent(t);
    }

    if (res.equals(parseInput("$$$+###")) || res.equals(parseInput("$$$*###"))) {
        //TODO perhaps factor this out into own simplifer function
        res.switch();
    }

    for (var f in schemaFns[res.val]) {
        var parsed = parseInput(f);
        if (res.val === parsed.val) {
            if (res.equals(parsed)) {
                res = schemaFns[res.val][f](res);
            }
            //TODO maybe make schemaFns ggroup by right value as well
            //TODO above todo prolly wont work .. .try figuring out how to make an actual converter between regular tree and a pattern tree


            // else if (res.val === '+' || res.val === '*') {
            //     //TODO instead of switching make eerything conform to certain rule with formalizer function or something
            //     if (res.equals(parsed.switch())) {
            //         res.switch();
            //         res = schemaFns[f](res);
            //         break;
            //     } else if (res.equals(parseInput("$$$*###") || res.equals(parseInput("$$$*###")))) {
            //         //TODO perhaps factor this out into own simplifer function
            //         res.switch();
            //         break;
            //     }
            // }
        }

    }

    return res;
}

function simplify(t) {
    if(!(t instanceof Tree)) t = parseInput(t);
    if (!t.left && !t.right) return t;
    var s = simplifyHelper(t);
    if (s.equals(t)) {
        if (t.left) {
            t.left = simplify(t.left);
        }
        if (t.right) {
            t.right = simplify(t.right);
        }

        return simplifyHelper(t);
    } else {
        if (simplify(s.clone()).equals(s)) return s;
        else return simplify(simplify(s));
    }
}

var schemaFns = {
    "*": {
        "###*(###/$$$)": function(tree) {
            var res = new Tree('/');
            res.l(tree.left.val * tree.right.left.val);
            res.r(simplifyHelper(tree.right.right));
            return res;
        },
        "(1/$$$)*($$$)": function(tree) {
            tree.left.left = tree.right;
            return tree.left;
        },
        "###*(###*$$$)": function(tree) {
            var res = new Tree('*');
            res.l(tree.left.val * tree.right.left.val);
            res.r(simplifyHelper(tree.right.right));
            return res;
        },
        "###*($$$*###)": function(tree) {
            var res = new Tree('*');
            res.l(tree.left.val * tree.right.right.val);
            res.r(simplifyHelper(tree.right.left));
            return res;
        },
        "$$$*(-1*$$$)": function(tree) {
            tree.right.left = tree.left.clone();
            tree.left = new Tree(-1);
            return tree;
        },
        "###*###": function(tree) {
            return new Tree(tree.left.val * tree.right.val);
        },
        "0*$$$": function(tree) {
            return new Tree(0);
        },
        "1*$$$": function(tree) {
            return tree.right;
        }
    },
    "+": {
        "###+###": function(tree) {
            return new Tree(tree.left.val + tree.right.val);
        },
        "(###*$$$)+(###*$$$)": function(tree) {
            if (tree.left.right.equals(tree.right.right)) {
                var res = new Tree('*');
                res.l(tree.left.left.val + tree.right.left.val);
                res.r(tree.left.right);
                return res;
            } else {
                return tree;
            }
        },
        "(cosx)^2+(sinx)^2": function(tree) {
            return new Tree(1);
        },
        "(sinx)^2+(cosx)^2": function(tree) {
            return new Tree(1);
        }
    },
    "-": {
        "###-###": function(tree) {
            return new Tree(tree.left.val - tree.right.val);
        },
        "$$$-(-1*$$$)": function(tree) {
            tree.val = '+';
            tree.right = tree.right.right;
            return tree;
        }
    },
    "/": {
        "$$$/1": function(tree) {
            return tree.left;
        },
        "($$$*(x^###))/(x^###)": function(tree) {
            //TODO try moving this to the below function ... and then
            var numDegree = tree.left.right.right.val,
                denomDegree = tree.right.right.val;

            if (numDegree > denomDegree) {
                tree.left.right.right.val -= denomDegree;
                return tree.left;
            } else {
                tree.right.right.val -= numDegree;
                var res = new Tree('/');
                res.r(tree.right);
                res.l(tree.left.left);
                return res;
            }
        },
        "(x^###)/(x^###)": function(tree) {
            var res = new Tree('/'),
                st = new Tree('*');

            st.l(1);
            st.r(tree.left);
            res.l(st);
            res.r(tree.right);
            return this['($$$*(x^###))/(x^###)'](res);
        },
        "###/>>>": function(tree) {
            var r = trigIdentities.reciprocals[tree.right.val];
            var res = new Tree('*');
            res.l(tree.left);
            res.r(r);
            res.right.right = tree.right.right;
            return res;
        },
        "###/(>>>^###)": function(tree) {
            var degree = tree.right.right;
            var res = new Tree('*');
            res.l(tree.left);
            res.r('^');
            res.right.left = tree.right.left;
            res.right.left.val = trigIdentities.reciprocals[tree.right.left.val];
            res.right.right = degree;
            return res;
        }
    },
    "^": {
        "x^1": function(tree) {
            return new Tree('x');
        },
        "x^0": function(tree) {
            return new Tree('1');
        },
        "($$$)^(1/2)": function(tree) {
            var res = new Tree('sqrt');
            res.right = tree.left;
            return res;
        },
        "(sqrt($$$))^2": function(tree) {
            return tree.left.right;
        },
        "(###*x)^(###)": function(tree) {
            tree.left.left.val = Math.pow(tree.left.left.val, tree.right.val);
            return tree.left;
        }
    }
};



var trigIdentities = {
    reciprocals: {
        'sin': 'csc',
        'cos': 'sec',
        'tan': 'cot',
        'csc': 'sin',
        'sec': 'cos',
        'cot': 'tan'
    }
};

function simplifyEquivalent(tree) {
    for (var f in equivalenceFns) {
        if (parseInput(f).equals(tree)) {
            return equivalenceFns[f](tree);
        }
    }
    return tree;
}

var equivalenceFns = {
    "$$$+$$$": function(tree) {
        var res = new Tree("*");
        res.l(2);
        res.r(tree.right);
        return res;
    },
    "$$$*$$$": function(tree) {
        var res = new Tree("^");
        res.l(tree.left);
        res.r(2);
        return res;
    }
};

// Source: src/strings.js
__strings = {
    splice: function(start, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start);
    },

    cut: function (start, end) {
        return this.substring(0, start) + this.substring(end+1);
    },

    replaceAt: function(index, char){
        return this.substring(0,index) + char + this.substring(index+char.length);
    },

    findChar: function(token) {
        var indices = [];
        for(var i=0; i<this.length; i++)
         if(this.substring(i, i+token.length) === token) indices.push(i);

        return indices;
    },

    removeSpaces: function() {
        return this.trim().replace(/\s+/g, '');
    }
};

// String.prototype.splice = function(start, newSubStr) {
//     return this.slice(0, start) + newSubStr + this.slice(start);
// };
//
// String.prototype.cut = function (start, end) {
//     return this.substring(0, start) + this.substring(end+1);
// };
//
// String.prototype.replaceAt=function(index, char){
//     return this.substring(0,index) + char + this.substring(index+char.length);
// };
//
// String.prototype.findChar = function(token) {
//     var indices = [];
//     for(var i=0; i<this.length; i++)
//      if(this.substring(i, i+token.length) === token) indices.push(i);
//
//     return indices;
// };
//
// String.prototype.removeSpaces = function() {
//     return this.trim().replace(/\s+/g, '');
// };
//TODO: dont change the string prototype

// Source: src/tree.js
function Tree(val) {
    this.val = !isNaN(val) ? Number(val) : val;
    this.left = false;
    this.right = false;
}

Tree.prototype.getDir = function(dir) {
    dir = "" + dir;
    if (parseInt(dir) >= 1 || dir.toLowerCase() === 'r' || dir.toLowerCase() === 'right') dir = 'right';
    else dir = 'left';

    return dir;
};

Tree.prototype.add = function(dir, val) {
    if(val !== 0 && !val) return;

    dir = this.getDir(dir);

    var current = this;

    while(current[dir]) {
        current = current[dir];
    }

    if(val instanceof Tree) {
        current[dir] = val;
    } else {
        current[dir] = new Tree(val);
    }
};

Tree.prototype.r = function (v) {
    this.add(1, v);
};

Tree.prototype.l = function(v) {
    this.add(-1, v);
};

Tree.prototype.equals = function(tree) {
    if(!tree || !TreePattern.eq(this.val, tree.val)) return false;
    var left, right; left = right = true;
    if(this.left && tree.left) {
        left = tree.left.equals(this.left);
    }
    if(this.right && tree.right) {
        right = tree.right.equals(this.right);
    }
    return left && right;
};

Tree.prototype.clone = function() {
    var clone = new Tree(this.val),
        left = this.left,
        right = this.right;

    if(left) {
        clone.left = left.clone();
    }
    if(right) {
        clone.right = right.clone();
    }

    return clone;
};

Tree.prototype.switch = function() {
    var temp = this.right;
    this.right = this.left;
    this.left = temp;
    return this;
};

Tree.prototype.contains = function(target) {

    var left, right; left = right = false;
    if(target instanceof Tree && this.equals(target) ||
       TreePattern.eq(this.val, target)) return true;
    if(this.left) left = this.left.contains(target);
    if(this.right) right = this.right.contains(target);

    return left || right;
};

Tree.prototype.replace = function(target, replace) {
    if(TreePattern.eq(this.val, target)) {
        if(replace instanceof Tree) {
            this.val = replace.val;
            this.l(replace.left);
            this.r(replace.right);
            return;
        } else {
            this.val = replace;
        }
    }
    if(this.left) this.left.replace(target, replace);
    if(this.right) this.right.replace(target, replace);
    return this;
};

Tree.prototype.toString = function(num) {
    if(!num) num = 2;
    var left = Array(num+1).join(".") + this.left.toString(num+2),
        right = Array(num+1).join(".") + this.right.toString(num+2);
    if(!this.left) left = '';
    if(!this.right) right = '';
    return  '[' + this.val  + ']' + '\n' + left + right;
};

Tree.prototype.toFlatString = function() {
    var left = this.left ? this.left.toFlatString() : '';
    var right = this.right ? this.right.toFlatString() : '';
    return  left + "" + this.val + "" + right;
};

// Source: src/treepattern.js
var TreePattern = {};


function treePatternRule(rule) {
    this.rule = rule;
}

treePatternRule.prototype.toString = function() {
    // for compatability when Tree is stringified
    return this.rule;
};

var rules = {
    "$$$": "ANY",
    "###": "NUM",
    "&&&": "OP",
    ">>>": "TRIG",
    '@@@': "MARKER",
    ',,,': "LOG",
    "|||": "FRAC"
};
for(var p in rules) {
    TreePattern[rules[p]] = new treePatternRule(p);
}

var _defaults = {
    "###": 1,
    "&&&": '+',
    ">>>": 'sin',
    "@@@": '@@@',
    ",,,": 'ln'
};

TreePattern.__OPS = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
};

TreePattern.__FUNCTIONS = {
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
    'abs': 7,
    'sqrt': 7
};

TreePattern.OPS = {};

for(var o in TreePattern.__OPS)
    TreePattern.OPS[o] = TreePattern.__OPS[o];

for(var o in TreePattern.__FUNCTIONS)
    TreePattern.OPS[o] = TreePattern.__FUNCTIONS[o];

TreePattern.checkMultiply = ['(', 'x'].concat(Object.keys(TreePattern.__FUNCTIONS));
TreePattern.checkParens = [')'].concat(Object.keys(TreePattern.__FUNCTIONS)).concat(Object.keys(TreePattern.__OPS));


TreePattern.fns = {
    "###": function(val) { return (val instanceof Tree) ? !isNaN(val.val) || !isNaN(val.left.val) && !isNaN(val.right.val) : !isNaN(val); },
    "&&&": function(val) { return val && "+-/*^".indexOf(val) > -1; },
    ">>>": function(val) { return val && "sin|cos|tan|csc|sec|cot|arcsin|arccos|arctan|arccsc|arcsec|arccot".indexOf(val) > -1 ; },
    "@@@": function(val) { return val === '@@@'; },
    ",,,": function(val) { return val && "ln|log".indexOf(val) > -1; },
    "|||": function(val) { return val instanceof Tree && val.val === '/' && isNaN(val.left) && isNaN(val.right); }
};


TreePattern.eq = function(val, pattern) {
    if(pattern == TreePattern.ANY || val == TreePattern.ANY) return true;

    if(val instanceof treePatternRule) {
        // ensure pattern has the treePatternRule and val is a simple value
        var temp = pattern;
        pattern = val;
        val = temp;
    }


    if(val instanceof treePatternRule) {
        // if they are both treePatternRule, then convert val to simple value
        if(_defaults[val])
            val = _defaults[val];
        else
            console.log("No " + val);
    }


    if(this.fns[pattern.rule]) {
        return this.fns[pattern.rule](val);
    }

    if(val instanceof Tree) val = val.val;

    return val == pattern;
};

// Source: src/unparser.js
function unparse(tree) {
    if(!tree.left && !tree.right) return tree.val;

    var right = unparse(tree.right),
        left = unparse(tree.left),
        middle = tree.val;

    if(TreePattern.OPS[tree.val] > TreePattern.OPS[tree.right.val]) {
        right = '(' + unparse(tree.right) + ')';
    }

    if(TreePattern.OPS[tree.val] > TreePattern.OPS[tree.left.val]) {
        left = '(' + unparse(tree.left) + ')';
    }

    if(
        tree.val === '*' &&
        typeof right === 'string' &&
        TreePattern.checkMultiply.join('|').indexOf(right[0]) > -1 //&&
        // ((left+"").split("").reverse()[0] !== 'x' || (right+"")[0] === '(')
    ) middle = '';

    if(tree.val === 'abs') {
        middle = '|';
        right = right + '|';
    }

    return (left || '') + middle + right;
}

// Source: src/_outro.js

    return {
        derive: function(val) {
            return this.simplify(derive(val));
        },
        parse: parseInput,
        simplify: function(val) {
            return unparse(simplify(val));
        },
        _derive: derive,
        _equals: TreePattern.eq
    };

})();

//# sourceMappingURL=deriver.js.map