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
    OP: "&&&"
};
for(var p in rules) {
    TreePattern[p] = new treePatternRule(rules[p]);
}

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
        if(val == TreePattern.NUM) val = 1;
        if(val == TreePattern.OP) val = "+";
    }

    if(pattern == TreePattern.NUM) {
        return !isNaN(val);
    }

    return val == pattern;
};
