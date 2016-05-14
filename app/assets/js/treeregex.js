var TreeRegex = {};

TreeRegex.prototype.eq = function(val1, val2) {
    return val1 == val2;
};

TreeRegex.Any = "$$$";
TreeRegex.Number = "###";
