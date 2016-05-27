function simplify(t) {
    var tree = t.clone();
    var res = tree;

    while(true) {
        var clean = true;
        for(var f in schemaFns) {
            if(res.equals(parseInput(f))) {
                res = simplify(schemaFns[f](res));
                clean = false;
            } else if(res.val === '+' || res.val === '*') {
                if(res.equals(parseInput(f).switch())) {
                    res.switch();
                    res = simplify(schemaFns[f](res));
                    clean = false;
                }
            }
        }
        if(clean) break;
    }

    return res;
}


var schemaFns = {
    "###*(###/$$$)": function (tree) {
        var res = new Tree("/");
        res.l(tree.left.val * tree.right.left.val);
        res.r(simplify(tree.right.right));
        return res;
    },
    "###*(###*$$$)": function (tree) {
        var res = new Tree("*");
        res.l(tree.left.val * tree.right.left.val);
        res.r(simplify(tree.right.right));
        return res;
    },
    "x^1": function(tree) {
        return new Tree("x");
    },
    "x^0": function (tree) {
        return new Tree("1");
    },
    "$$$*1": function(tree) {
        return tree.left;
    },
    "($$$*(x^###))/(x^###)": function(tree) {
        var numDegree = tree.left.right.right.val,
            denomDegree = tree.right.right.val;

        if(numDegree>denomDegree) {
            tree.left.right.right.val -= denomDegree;
            return tree.left;
        } else {
            tree.right.right.val -= numDegree;
            var res = new Tree("/");
            res.r(tree.right);
            res.l(tree.left.left);
            return res;
        }
        //TODO this cant return x^1 or x^0
    }
};
