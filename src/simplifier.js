function simplifyHelper(t) {
    var tree = t.clone();
    var res = tree;

    while(true) {
        var clean = true;
        for(var f in schemaFns) {
            if(res.equals(parseInput(f))) {
                res = simplifyHelper(schemaFns[f](res));
                clean = false;
            } else if(res.val === '+' || res.val === '*') {
                if(res.equals(parseInput(f).switch())) {
                    res.switch();
                    res = simplifyHelper(schemaFns[f](res));
                    clean = false;
                }
            }
        }
        if(clean) break;
    }

    return res;
}

function simplify(t) {
    if(!t.left && !t.right) return t;
    var s = simplifyHelper(t);
    if(s.equals(t)) {
        if(t.left) {
            t.left = simplify(t.left);
        }
        if(t.right) {
            t.right = simplify(t.right);
        }
        return simplifyHelper(t);
    } else {
        if(simplify(s).equals(s)) return s;
        else return simplify(s);
    }
}


var schemaFns = {
    "###*(###/$$$)": function (tree) {
        var res = new Tree("/");
        res.l(tree.left.val * tree.right.left.val);
        res.r(simplifyHelper(tree.right.right));
        return res;
    },
    "###*(###*$$$)": function (tree) {
        var res = new Tree("*");
        res.l(tree.left.val * tree.right.left.val);
        res.r(simplifyHelper(tree.right.right));
        return res;
    },
    "###*($$$*###)": function (tree) {
        var res = new Tree("*");
        res.l(tree.left.val * tree.right.right.val);
        res.r(simplifyHelper(tree.right.left));
        return res;
    },
    "###*###": function(tree) {
        return new Tree(tree.left.val * tree.right.val);
    },
    "###+###": function(tree) {
        return new Tree(tree.left.val + tree.right.val);
    },
    "###-###": function(tree) {
        return new Tree(tree.left.val - tree.right.val);
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
    },
    "(x^###)/(x^###)": function(tree) {
        var res = new Tree("/"),
            st = new Tree("*");

        st.l(1); st.r(tree.left);
        res.l(st);
        res.r(tree.right);
        return this["($$$*(x^###))/(x^###)"](res);
    }
};
