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
    ',,,': "LOG"
};
for(var p in rules) {
    TreePattern[p] = new treePatternRule(rules[p]);
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
    ",,,": function(val) { return val && "ln|log".indexOf(val) > -1; }
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
