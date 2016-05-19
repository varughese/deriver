describe("Deriver::", function() {
    var data = __derivertestdata;

    it("Constant Rule", function() {
        for(var arr in data.constant) {
            expect(derive(parseInput(data.constant[arr][0]))).toEqual(parseInput(data.constant[arr][1]));
        }
    });

    xit("Power Rule", function() {
        for(var arr in data.power) {
            expect(derive(parseInput(data.power[arr][0]))).toEqual(parseInput(data.power[arr][1]));
        }
    });

    it("Trig Rules", function() {
        for(var arr in data.trig) {
            expect(derive(parseInput(data.trig[arr][0]))).toEqual(parseInput(data.trig[arr][1]));
        }
    });

    it("Sum diff Rule", function() {
        for(var arr in data.sumdiff) {
            expect(derive(parseInput(data.sumdiff[arr][0]))).toEqual(parseInput(data.sumdiff[arr][1]));
        }
    });

    it("Product Rule", function() {
        for(var arr in data.product) {
            expect(derive(parseInput(data.product[arr][0]))).toEqual(parseInput(data.product[arr][1]));
        }
    });

    it("Quotient Rule", function() {
        for(var arr in data.quotient) {
            expect(derive(parseInput(data.quotient[arr][0]))).toEqual(parseInput(data.quotient[arr][1]));
        }
    });
});
