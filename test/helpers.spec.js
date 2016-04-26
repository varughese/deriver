describe("Helpers::", function() {
    describe("Parentheses Parser:", function() {

        it("Simple", function() {
            expect(parseParens("(3+4)+(4+4)")).toEqual([[0,4],[6,10]]);
        });

        it("Nested", function() {
            expect(parseParens("(3+4+(3+x)+(3+4))+4")).toEqual([[0,16],[5,9],[11,15]]);
        });

    });

    describe("Clean Input", function() {

        it("Handle coefficents", function() {
            expect(cleanInput("3x")).toBe("3*x");
            expect(cleanInput("3x+4x")).toBe("3*x+4*x");
        });

        it("Number then Parentheses", function() {
            expect(cleanInput("3(4)")).toBe("3*(4)");
            expect(cleanInput("3(4+x)")).toBe("3*(4+x)");
            expect(cleanInput("x(9+x)")).toBe("x*(9+x)");
        });

        it("Parentheses then Parentheses", function() {
            expect(cleanInput("(3+x)(3+x)")).toBe("(3+x)*(3+x)");
            expect(cleanInput("(3+x)(3+x)(6+x)")).toBe("(3+x)*(3+x)*(6+x)");
        });
    });
});
