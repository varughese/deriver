function powerRule(tree) {
    var res = new Tree("*");
    res.l(tree.right.right.val);
    tree.right.right.val = Number(tree.right.right.val) - 1;
    res.r(tree);
    return res;
}
