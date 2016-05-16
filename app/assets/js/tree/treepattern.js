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
    TRIG: ">>>"
};
for(var p in rules) {
    TreePattern[p] = new treePatternRule(rules[p]);
}

var _defaults = {
    "###": 1,
    "&&&": '+',
    ">>>": 'sin'
};

TreePattern.fns = {
    "###": function(val) { return !isNaN(val); },
    "&&&": function(val) { return val && "+-/*^".indexOf(val) > -1; },
    ">>>": function(val) { return val && "sin|cos|tan|csc|sec|cot".indexOf(val) > -1 ; }
};


TreePattern.eq = function(val, pattern) {
    if(val instanceof treePatternRule) {
        // ensure pattern has the treePatternRule and val is a simple value
        var temp = pattern;
        pattern = val;
        val = temp;
    }

    if(pattern == TreePattern.ANY) return true;

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
