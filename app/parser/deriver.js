function derive(t) {

    if(TreePattern.contains(t.val, '+-')) {
        var res = new Tree(t.val);
        res.l(derive(t.left));
        res.r(derive(t.right));
        return res;
    }

    if(t.contains("^")) {
        return powerRule(t);
    } else {
        return constantRule(t);
    }

}

var _schemas = {
    powerRule: {
        basic: '',
        coefficent: ''
    }
};

(function defineSchemas(){
    _schemas.powerRule.basic = new Tree("^");
    _schemas.powerRule.basic.l(TreePattern.ANY);
    _schemas.powerRule.basic.r(TreePattern.NUM);

    _schemas.powerRule.coefficent = new Tree("*");
    _schemas.powerRule.coefficent.l(TreePattern.NUM);
    _schemas.powerRule.coefficent.r(_schemas.powerRule.basic);
})();

function constantRule(t) {
    var schema, res;

    var fns = [
        function() {
            schema = new Tree(TreePattern.NUM);
            res = 0;
        },
        function() {
            schema = new Tree("*");
            schema.l(TreePattern.NUM);
            schema.r("x");
            res = t.left.val;
        },
        function() {
            schema = new Tree("*");
            schema.l("x");
            schema.r(TreePattern.NUM);
            res = t.right.val;
        },
        function() {
            schema = new Tree("x");
            res = 1;
        },
        function() {
            throw t.toFlatString() + " not a constant rule";
        }
    ];

    var i = 0;
    while(!t.equals(schema)) {
        fns[i]();
        i++;
    }

    return new Tree(res);
}

/*
    basic: x^5
    coefficent: 3*x^5
    complex: 3*(10*x)^5
*/
function powerRule(t) {
    var tree = t.clone();

    var fns = {
        basic: function() {
            var _tree = new Tree("*");
            _tree.l(1);
            _tree.r(tree);
            tree = _tree;
            return this.coefficent();
        },
        coefficent: function() {
            var c = tree.right.right.val--;
            tree.left.val *= c;
            return tree;
        }
    };

    if(tree.equals(_schemas.powerRule.basic)) return fns.basic();
    else if(tree.equals(_schemas.powerRule.coefficent)) return fns.coefficent();
    else throw "[" + tree.toFlatString() + "]" + " Is not a power rule";

}
