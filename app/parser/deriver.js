function derive(t) {

    if(TreePattern.contains(t.val, '+-')) {
        var res = new Tree(t.val);
        res.l(derive(t.left));
        res.r(derive(t.right));
        return res;
    }

    if(t.val === '*') {
        if(t.left && !TreePattern.eq(t.left.val, TreePattern.NUM)) {
            if(t.right) {
                if(!TreePattern.eq(t.right.val, TreePattern.NUM)) {
                    return productRule(t);
                }
                if(TreePattern.eq(t.right.val, 'x')) {
                    return constantRule(t);
                }
            }
        }
    }

    if(t.val === '/') {
        return quotientRule(t);
        //TODO make this check better and deal with fractions 
    }

    if(t.contains(TreePattern.LOG)) {
        return logRule(t);
    }
    if(t.contains(TreePattern.TRIG)) {
        return trigRules(t);
    }


    if(t.contains(_schemas.powerRule.basic)) {
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
//TODO Simplify x^1 to just x
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
            return chainRule(tree, tree.right.left);
        }
    };

    if(tree.equals(_schemas.powerRule.basic)) return fns.basic();
    else if(tree.equals(_schemas.powerRule.coefficent)) return fns.coefficent();
    else throw "[" + tree.toFlatString() + "]" + " Is not a power rule";

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
        lo = t.left,
        hi = t.right,
        loDHi = new Tree("*"),
        hiDlo = new Tree("*");

    loDHi.l(lo);
    loDHi.r(derive(hi));

    hiDlo.l(hi);
    hiDlo.r(derive(lo));

    num.l(loDHi);
    num.r(hiDlo);

    denom.l(hi);
    denom.r(2);

    res.l(num);
    res.r(denom);

    return res;
}

function chainRule(org, innerFx) {
    if(innerFx.right) {
        var res = new Tree("*");
        var d = derive(innerFx);
        if(d.val != '1' &&
          ((d.val == '*' && d.right.val != '1') || d.val != '*')) {
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
            'cot': parseInput('-1*(csc@@@)^2')
        };

    if(tRules[t.val]) {
        var res = tRules[t.val].clone();

        res.replace(TreePattern.MARKER, t.right);

        return chainRule(res, t.right);
    } else {
        throw 'not a trig rule';
    }
}


function logRule(t) {
    if(t.val == 'ln') {
        var res = new Tree('/');
        res.l('1');
        res.r(t.right);
        return chainRule(res, t.right);
    }
}
