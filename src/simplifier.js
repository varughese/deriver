function simplify(tree) {
    var __schemas = [parseInput('###*(###/$$$)'), parseInput('###*(###*$$$)')];
    for(var s in __schemas) {
        if(tree.equals(__schemas[s])) {
            return fns[s](tree);
        }
    }
}

var fns = [
    function(tree) {
        var res = new Tree("/");

        res.l(tree.left.val * tree.right.left.val);
        res.r(tree.right.right);

        return res;
    },
    function(tree) {
        var res = new Tree("*");
        res.l(tree.left.val * tree.right.left.val);
        res.r(tree.right.right);

        return res;
    }
];
