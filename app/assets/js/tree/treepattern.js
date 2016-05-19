var TreePattern = {};


function treePatternRule(rule) {
    this.rule = rule;
}

treePatternRule.prototype.toString = function() {
    // for compatability when Tree is stringified
    return this.rule;
};

var rules = {
    ANY: "$$$",
    NUM: "###",
    OP: "&&&",
    TRIG: ">>>",
    MARKER: '@@@',
    LOG: ',,,'
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

TreePattern.fns = {
    "###": function(val) { return !isNaN(val); },
    "&&&": function(val) { return val && "+-/*^".indexOf(val) > -1; },
    ">>>": function(val) { return val && "sin|cos|tan|csc|sec|cot".indexOf(val) > -1 ; },
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

    return val == pattern;
};


TreePattern.contains = function(val) {
    var args = [].slice.call(arguments);
    args.shift();
    for(var a in args) {
        if(args[a] instanceof treePatternRule) {
            if(this.eq(val, args[a])) return true;
        } else if(args[a].indexOf(val) > -1) {
            return true;
        }
    }
    return false;
};
