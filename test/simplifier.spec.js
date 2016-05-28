var DEBUGGIN = true;
var GOBACK = 5;

fdescribe("Simplifier::", function() {
    var data = DEBUGGIN ? __simplifytestdata.slice(-GOBACK) : __simplifytestdata;

    it("Should Simplify", function() {
        for(var arr in data) {
            if(DEBUGGIN) console.log(parseInput(data[arr][0])+'');
            expect( simplify(parseInput(data[arr][0])).toString() )
            .toEqual( parseInput(data[arr][1]).toString() );
        }
    });
});
