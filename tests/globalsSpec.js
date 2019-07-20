describe("Utilities", function() {

    it("named functions should have a name property", function() {
        StoryScript.addFunctionExtensions();

        function MyFunction() {
        };

        var result = MyFunction.name;
        expect(result).toEqual('MyFunction');
    });

    it("Deserializing function should get working function", function() {
        StoryScript.addFunctionExtensions();

        var functionString = 'function MyFunction(x, y) { return x + y; }';
        var myFunction = functionString.parseFunction();
        var result = myFunction(2, 3);
        
        expect(result).toEqual(5);
    });

    it("Creating a function hash should get a unique hash for each function", function() {
        function FirstFunction(x, y) { return x + y; };
        function SecondFunction(x, y) { if (x === null && y === null) { return null; } else { return x > y; } };
        var firstFunctionHash = StoryScript.createFunctionHash(FirstFunction);
        var secondFunctionHash = StoryScript.createFunctionHash(SecondFunction);

        expect(firstFunctionHash).toEqual(-601740997);
        expect(secondFunctionHash).toEqual(-2091158808);
        expect(firstFunctionHash).not.toEqual(secondFunctionHash);
    });
});