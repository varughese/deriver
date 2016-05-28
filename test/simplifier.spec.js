var DEBUGGIN = false;
var GOBACK = 5;

xdescribe("Simplifier::", function() {
    var data = DEBUGGIN ? __simplifytestdata.slice(-GOBACK) : __simplifytestdata;

    it("Should Simplify", function() {
        for(var arr in data) {
            expect( simplify(parseInput(data[arr][0])).toString() )
            .toEqual( parseInput(data[arr][1]).toString() );
        }
    });
});
