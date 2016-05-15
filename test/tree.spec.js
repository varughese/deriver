describe("Tree::", function() {
    describe("Creation:", function() {

        it("Simple", function() {
            var t = new Tree("A");
            t.l(3);
            t.r(4);
            expect(t.left.val).toBe(3);
            expect(t.right.val).toBe(4);
            expect(t.left.left).toBe(false);
        });

    });

    describe("Cloning", function() {
        it("1 Layer Deep Clone", function() {
            var tree = new Tree("^");
            tree.l("x");
            tree.r(4);

            var clone = tree.clone();
            clone.left.val = "y";

            expect(tree.left.val).toBe("x");
        });
    });

    describe("Equality:", function() {

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
            pattern.r(TreePattern.NUM);

            expect(t.equals(pattern)).toBe(true);
        });

        it("Different Length Trees", function() {
            var t = new Tree("^");
            var subTree = new Tree("*");
            subTree.l("2");
            subTree.r("x");
            t.l(subTree);
            t.r("2");

            var pattern = new Tree("^");
            pattern.l(TreePattern.ANY);
            pattern.r("2");

            expect(t.equals(pattern)).toBe(true);
            expect(pattern.equals(t)).toBe(true);
        });
    });

});
