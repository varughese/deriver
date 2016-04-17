describe('Parser Creates Correct Trees', function() {
    it("Addition", function() {
        var parsed = parseInput("2+4");
        var tree = new Tree("+");
        tree.l("2");
        tree.r("4");
        expect(parsed).toEqual(tree);
    });
});
