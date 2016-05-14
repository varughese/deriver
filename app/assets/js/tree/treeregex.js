var TreeRegex = {};

var rules = {
    ANY: "$$$",
    NUM: "###",
    OP: "&&&"
};

function treeRegexRule(rule) {
    this.rule = rule;
}

treeRegexRule.prototype.toString = function() {
    // for compatability when Tree is stringified
    return this.rule;
};

for(var p in rules) {
    TreeRegex[p] = new treeRegexRule(rules[p]);
}

TreeRegex.eq = function(val, pattern) {
    if(val instanceof treeRegexRule) {
        // ensure pattern has the treeRegexRule and val is a simple value
        var temp = pattern;
        pattern = val;
        val = temp;
    }

    if(pattern == TreeRegex.ANY) return true;

    if(val instanceof treeRegexRule) {
        // if they are both treeRegexRule, then convert val to simple value
        if(val == TreeRegex.NUM) val = 1;
        if(val == TreeRegex.OP) val = "+";
    }

    if(pattern == TreeRegex.NUM) {
        return !isNaN(val);
    }

    return val == pattern;
};
