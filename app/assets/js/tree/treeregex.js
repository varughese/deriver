function TreeRegex() {
    this.Any = "$$$";
    this.Number = "###";
}

TreeRegex.prototype.eq = function(val1, val2) {
    return val1 == val2;
};
