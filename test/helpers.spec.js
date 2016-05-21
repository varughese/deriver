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

        it("Handles trig/logs/other functions", function() {
            var io = [
                ['sinxcosx', 'sin(x)*cos(x)'],
                ['(sinx)(cosx)', '(sin(x))*(cos(x))'],
                ['3sinx+5sinx', '3*sin(x)+5*sin(x)'],
                ['10arcsinx-8(4sinx)', '10*arcsin(x)-8*(4*sin(x))'],
                ['8cosx', '8*cos(x)'],
                ['8cos2x+ln5x', '8*cos(2*x)+ln(5*x)']
            ];

            for(var arr in io) {
                expect(cleanInput(io[arr][0])).toBe(io[arr][1]);
            }
        });

        it("Logarithm Change of Base", function() {
            expect(cleanInput('log(4,6)')).toBe("ln(6)/ln(4)");
            expect(cleanInput('log(4,(x+3)+x)')).toBe("ln((x+3)+x)/ln(4)");
            expect(cleanInput('log(x+2,x+2x-3(4x))-log(4,(x+3)+x+sinx)')).toBe("ln(x+2*x-3*(4*x))/ln(x+2)-ln((x+3)+x+sin(x))/ln(4)");
            expect(cleanInput('log(x+2(x-sinx), x+5)')).toBe("ln(x+5)/ln(x+2*(x-sin(x)))");
        });

    });

    describe("Unparser", function() {
        var io = [
            ['2+3*5','2+3*5'],
            ['(2+3)*5','(2+3)*5'],
            ['5sinx','5sinx'],
            ['9x+4(5x)','9x+4*5x']
        ];

        it("Correctly places Parentheses and *", function() {
            for(var a in io) {
                var input = io[a][0], output = io[a][1];
                expect(unparse(parseInput(input))).toBe(output);
            }
        });

    });
});
