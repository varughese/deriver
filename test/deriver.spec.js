describe("Deriver::", function() {
    describe("Constant Rule:", function() {

        it("Number", function() {
            var n = new Tree("1"),
                e = new Tree("0");
            expect(constantRule(n)).toEqual(e);

        });

        it("Coefficent", function() {
            var c = parseInput("3*x"),
                e = new Tree("3");
            expect(constantRule(c)).toEqual(e);
        });

    });

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

    describe("Split up +-", function() {

        it("Split +", function() {
            expect(derive(parseInput("3x^5+6x^5"))).toEqual(parseInput("15x^4+30x^4"));
        });

        it("Split + - +", function() {
            expect(derive(parseInput("3x^5+6x^5-9x^5"))).toEqual(parseInput("15x^4+30x^4-45x^4"));
        });

    });

});
