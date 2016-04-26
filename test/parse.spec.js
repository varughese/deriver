describe("Parser::", function() {
    describe("Basic:", function() {

        it("Basic Addition", function() {
            var parsed = parseInput("2+4");
            var tree = new Tree("+");
            tree.l("2");
            tree.r("4");
            expect(parsed).toEqual(tree);
        });

        it("Basic Multiplication", function() {
            var parsed = parseInput("2*4");
            var tree = new Tree("*");
            tree.l("2");
            tree.r("4");
            expect(parsed).toEqual(tree);
        });

        describe("EMDAS:", function() {

            it("Add/Multiply", function() {
                var parsed = parseInput("2+4*x");
                var tree = new Tree("+");
                var subTree = new Tree("*");
                subTree.l("4");
                subTree.r("x");
                tree.l("2");
                tree.r(subTree);
                expect(parsed).toEqual(tree);
            });

            it("Exponents", function() {
                var parsed = parseInput("4+4^x");
                var tree = new Tree("+");
                tree.l("4");
                var subTree = new Tree("^");
                subTree.l("4");
                subTree.r("x");
                tree.r(subTree);
                expect(parsed).toEqual(tree);
            });

            it("Complicated Exponents", function() {
                var parsed = parseInput("4^x^x^x");
                var tree = new Tree("^");
                tree.l("4");
                var subTree = new Tree("^");
                subTree.l("x");
                var subSubTree = new Tree("^");
                subSubTree.l("x");
                subSubTree.r("x");
                subTree.r(subSubTree);
                tree.r(subTree);
                expect(parsed).toEqual(tree);
            });
        });
    });

    describe("Parentheses:", function() {

        it("Basic Parentheses", function() {
            var parsed = parseInput("(2-4)*(9+3)");
            var tree = new Tree("*");
            var lSubTree = new Tree("-");
            lSubTree.l("2"); lSubTree.r("4");
            tree.l(lSubTree);
            var rSubTree = new Tree("+");
            rSubTree.l("9");
            rSubTree.r("3");
            tree.r(rSubTree);
        });

        it("Nested Parentheses", function() {
            var parsed = parseInput("(3/(4-x)+3)/(3/4)");
            var left = parseInput("3/(4-x)+3");
            var right = parseInput("3/4");
            var tree = new Tree("/");
            tree.l(left); tree.r(right);
            expect(parsed).toEqual(tree);
        });

    });
});
