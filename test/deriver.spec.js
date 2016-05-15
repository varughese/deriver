describe("Deriver::", function() {
    describe("Power Rule:", function() {

        it("Basic", function() {
            var t = parseInput("x^5"),
                expected = new Tree("*"),
                subTree = new Tree("^");

            expected.l(5);
            subTree.l("x");
            subTree.r(4);
            expected.r(subTree);

            expect(powerRule(t)).toEqual(expected);
        });

        it("Coefficent", function() {
            var t = parseInput("3*x^5"),
                expected = new Tree("*"),
                subTree = new Tree("^");

            expected.l(15);
            subTree.l("x");
            subTree.r(4);
            expected.r(subTree);

            expect(powerRule(t)).toEqual(expected);
        });


    });

});
