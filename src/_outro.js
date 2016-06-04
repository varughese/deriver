
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
