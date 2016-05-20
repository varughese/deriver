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

        it("Logarithm Change of Base", function() {
            expect(cleanInput('log(4,6)')).toBe("ln(6)/ln(4)");
            expect(cleanInput('log(4,(x+3)+x)')).toBe("ln((x+3)+x)/ln(4)");
            expect(cleanInput('log(x+2,x+2x-3(4x))-log(4,(x+3)+x+sinx)')).toBe("ln(x+2*x-3*(4*x))/ln(x+2)-ln((x+3)+x+sinx)/ln(4)");
            expect(cleanInput('log(x+2(x-sinx), x+5)')).toBe("ln(x+5)/ln(x+2*(x-sinx))");
        });

    });
});
