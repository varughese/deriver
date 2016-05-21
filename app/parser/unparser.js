function unparse(tree) {
    if(!tree.left && !tree.right) return tree.val;

    var right = unparse(tree.right),
        left = unparse(tree.left),
        middle = tree.val;

    if(TreePattern.OPS[tree.val] > TreePattern.OPS[tree.right.val]) {
        right = '(' + unparse(tree.right) + ')';
    }

    if(TreePattern.OPS[tree.val] > TreePattern.OPS[tree.left.val]) {
        left = '(' + unparse(tree.left) + ')';
    }

    if(tree.val === '*' &&
       typeof right === 'string' &&
       ((right+"")[0] === 'x' || Object.keys(TreePattern.__FUNCTIONS).join('|').indexOf(right.substring(0,3)) > -1)) middle = '';

    return (left || '') + middle + right;
}
