describe("Tree Pattern::", function() {

    it("Contains 1 Arg", function() {
        expect(TreePattern.contains('+', '+-')).toBeTruthy();
    });

    it("Contains Multi Args", function() {
        expect(TreePattern.contains('+', '-', '+')).toBeTruthy();
    });

    it("Contains treePatternRule", function() {
        expect(TreePattern.contains('8', TreePattern.NUM)).toBeTruthy();
        expect(TreePattern.contains('9', TreePattern.OP)).toBeFalsy();
        expect(TreePattern.contains('sin', TreePattern.OP, TreePattern.TRIG)).toBeTruthy();
    });

});

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
        var tree = new Tree("^");
        tree.l("x");
        tree.r(4);

        it("1 Layer Deep Clone", function() {
            var clone = tree.clone();
            clone.left.val = "y";

            expect(tree.left.val).toBe("x");
        });

        it("2 Layer Deep Clone", function() {
            var newTree = new Tree("*");
            newTree.l(3);
            newTree.r(tree);

            var clone = newTree.clone();
            expect(newTree.toString()).toEqual(clone.toString());
        });

        it("3 Layer Deep Clone", function() {
            var newTree = new Tree("+"),
                subTree = new Tree("*");

            subTree.l(4); subTree.r("x");
            newTree.r(tree);

            var clone = newTree.clone();

            expect(clone.toString()).toEqual(newTree.toString());
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

    describe("Searching:", function() {
        var tree = new Tree("^"),
            subTree = new Tree("*"),
            subsubTree = new Tree("+");

        subsubTree.l("x"); subsubTree.r(5);
        subTree.l(4); subTree.r(subsubTree);
        tree.l(3);
        tree.r(subTree);
        /*
        [^]
        ..[3]
        ..[*]
        ....[4]
        ....[+]
        ......[x]
        ......[5]
        */

    });

});
