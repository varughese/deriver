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

    var basicSchema = new Tree("^");
    basicSchema.l(TreePattern.ANY);
    basicSchema.r(TreePattern.NUM);

    var coefficentSchema = new Tree("*");
    coefficentSchema.l(TreePattern.NUM);
    coefficentSchema.r(basicSchema);

    if(tree.equals(basicSchema)) return fns.basic();
    else if(tree.equals(coefficentSchema)) return fns.coefficent();
    else throw "Jawn isnt a power rule";

}
