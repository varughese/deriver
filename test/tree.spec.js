describe("Tree::", function() {
    describe("Tree Creation:", function() {

        it("Simple", function() {
            var t = new Tree("A");
            t.l(3);
            t.r(4);
            expect(t.left.val).toBe(3);
            expect(t.right.val).toBe(4);
            expect(t.left.left).toBe(false);
        });

    });

    describe("Tree Equality:", function() {

        it("Simple", function() {
            var t = new Tree("A");
            t.l(3);
            t.r(4);

            var x = new Tree("A");
            x.l(3);
            x.r(4);

            expect(t.equals(x)).toBe(true);

            var tree = new Tree("^");
            tree.l("*");
            tree.left.l("x");tree.left.r("4");

            var tree2 = new Tree("^");
            tree2.l("*");
            tree2.left.l("x");tree2.left.r("4");

            expect(tree.equals(tree2)).toBe(true);

        });

        it("Simple Pattern", function() {
            var t = new Tree("^");
            t.l("x");
            t.r("2");
            var pattern = new Tree("^");
            pattern.l("x");
            pattern.r(TreeRegex.NUM);

            expect(t.equals(pattern)).toBe(true);
        });
    });

});
