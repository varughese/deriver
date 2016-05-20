function derive(t) {
    if(!(t instanceof Tree)) t = parseInput(t);

    if(t.val === 'x') return new Tree(1);

    if(!t.left && !t.right || TreePattern.eq(t.val, TreePattern.NUM)) return new Tree(0);

    // Sum and Difference Rule
    if(t.val === '+' || t.val === '-') {
        var res = new Tree(t.val);
        res.l(derive(t.left));
        res.r(derive(t.right));
        if(res.right.val === 0) return res.left;
        if(res.left.val === 0) return res.right;
        return res;
    }

    // Product Rule and Constant Rule
    if(t.val === '*') {
        if(TreePattern.eq(t.left.val, TreePattern.NUM) ||
           TreePattern.eq(t.right.val, TreePattern.NUM)) {
            return constantRule(t);
       } else {
           return productRule(t);
       }
    }

    // Power Rule and Exponential Rule
    if(t.val === '^' || t.val === 'sqrt') {
        if(t.val === 'sqrt') {
            t.left = t.right.clone();
            var half = new Tree('/');
            half.l(1); half.r(2);
            t.right = half;
            t.val = "^";
        }
        if(TreePattern.eq(t.right, TreePattern.NUM)) {
            if(!TreePattern.eq(t.left, TreePattern.NUM)) {
                return powerRule(t);
            }
        } else {
            return exponentialRule(t);
        }
    }

    // Quotient Rule
    if(t.val === '/') {
        return quotientRule(t);
        //TODO make this check better and deal with fractions
    }

    // Log Rules
    if(TreePattern.eq(t.val, TreePattern.LOG)) {
        return logRule(t);
    }

    // Trig Rules
    if(TreePattern.eq(t.val, TreePattern.TRIG)) {
        return trigRules(t);
    }

}

function constantRule(t) {
    var res = new Tree('*'), d, c;

    if(TreePattern.eq(t.right.val, TreePattern.NUM)) {
        c = t.right.val;
        d = derive(t.left);
    } else if(TreePattern.eq(t.left.val, TreePattern.NUM)) {
        c = t.left.val;
        d = derive(t.right);
    }

    if(d.val === 1) return new Tree(c);
    if(TreePattern.eq(d.val, TreePattern.NUM)) return new Tree(c * d.val);

    if(d.left && TreePattern.eq(d.left.val, TreePattern.NUM)) {
        d.left.val *= c;
        return d;
    }

    res.l(c);
    res.r(d);

    return res;
}

function powerRule(t) {
    var tree = t.clone(),
        res = new Tree("*");

    if(TreePattern.eq(tree.right.val, TreePattern.NUM)) {
        var c = tree.right.val--;
        res.l(c);
        if(tree.right.val === 1) {
            tree = tree.left;
        }
        res.r(tree);
    } else {
        res.l(tree.right.clone());
        tree.right.left.val -= tree.right.right.val;
        res.r(tree);
    }

    return chainRule(res, tree.left);
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
        hi = t.left,
        lo = t.right,
        dHi = derive(hi),
        dLo = derive(lo),
        loDHi = new Tree("*"),
        hiDLo = new Tree("*");

    if(dHi.val !== 1) {
        loDHi.l(lo);
        loDHi.r(dHi);
    } else {
        loDHi = lo;
    }

    if(dLo.val !== 1) {
        hiDLo.l(hi);
        hiDLo.r(dLo);
    } else {
        hiDLo = hi;
    }

    num.l(loDHi);
    num.r(hiDLo);

    if(TreePattern.eq(loDHi, TreePattern.NUM) && TreePattern.eq(hiDLo, TreePattern.NUM)) {
        num = loDHi.val - hiDLo.val;
    }

    var zeroPattern = new Tree('*');
    zeroPattern.l(TreePattern.ANY);
    zeroPattern.r(0);

    if(num.left.equals(zeroPattern) || num.left.equals(zeroPattern.switch())) {
        var r = new Tree("*");
        r.l(-1);
        r.r(num.right);
        if(num.right.val === 1) {
            num = new Tree(-1);
        } else {
            num = r;
        }
    }
    if(num.right && (num.right.equals(zeroPattern) || num.right.equals(zeroPattern.switch()))) {
        num = num.left;
    }

    denom.l(lo);
    denom.r(2);

    res.l(num);
    res.r(denom);

    return res;
}

function chainRule(org, innerFx) {
    if(innerFx.right) {
        var res = new Tree("*");
        var d = derive(innerFx);
        if(d.val != '1') {
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
            'cot': parseInput('-1*(csc@@@)^2'),
            'arcsin': parseInput('1/((1-@@@^2)^(1/2))'),
            'arccos': parseInput('-1/((1-@@@^2)^(1/2))'),
            'arctan': parseInput('1/(1+(@@@^2))'),
            'arccsc': parseInput('-1/(abs(@@@)*(@@@^2-1))'),
            'arcsec': parseInput('1/(abs(@@@)*(@@@^2-1))'),
            'arccot': parseInput('-1/(1+@@@^2)')
        };

    if(tRules[t.val]) {
        var res = tRules[t.val].clone();

        res.replace(TreePattern.MARKER, t.right);

        return chainRule(res, t.right);
    }
}


function logRule(t) {
    var res = new Tree('/');

    if(TreePattern.eq(t.right, TreePattern.NUM)) return new Tree(0);

    res.l(derive(t.right));
    res.r(t.right);
    return res;
}

function exponentialRule(t) {
    var res = new Tree("*"),
        ln = new Tree("ln");

    res.l(t.clone());
    ln.r(t.left);
    res.r(ln);

    if(t.left.val === 'e') {
        res = t.clone();
    }

    return chainRule(res, t.right);
}
