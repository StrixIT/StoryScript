import { addFunctionExtensions, createFunctionHash, addArrayExtensions, compareString, parseFunction, createHash } from 'storyScript/globals';
import { Journal } from '../../../Games/MyRolePlayingGame/items/journal';
import { Sword } from '../../../Games/MyRolePlayingGame/items/sword';
import { ILocation, ICollection, IDestination } from 'storyScript/Interfaces/storyScript';
import '../../../Games/MyRolePlayingGame/run';

describe("Utilities", function() {

    it("named functions should have a name property", function() {
        addFunctionExtensions();

        function MyFunction() {
        };

        var result = MyFunction.name;
        expect(result).toEqual('MyFunction');
    });

    it("should create a proxy that is called when calling the function and is identifiable as a proxy", function() {
        addFunctionExtensions();

        let MyFunction = function(x, y) {
            return x + y;
        };

        function AddOn(myScope, myFunction, x, y, z) {
            var myFunctionResult = myFunction(x, y);
            return myFunctionResult * z;
        }

        MyFunction = MyFunction.proxy(AddOn, 5);
        var result = MyFunction(2, 6);

        expect(result).toEqual(40);
        expect(MyFunction.proxy).toBeTruthy();
    });

    it("Parsing null as a function should return null", function() {
        addFunctionExtensions();
        var myFunction = parseFunction(null);
        expect(myFunction).toBeNull();
    });

    it("Deserializing function should get working function", function() {
        addFunctionExtensions();

        var functionString = 'function MyFunction(x, y) { return x + y; }';
        var myFunction = parseFunction(functionString);
        var result = myFunction(2, 3);
        
        expect(result).toEqual(5);
    });

    it("Deserializing a multiline function should get a working function", function() {
        addFunctionExtensions();

        var functionString = `function MyFunction(x, y) { 
                                return x + y; 
                            }`;
                            
        var myFunction = parseFunction(functionString);
        var result = myFunction(2, 3);
        
        expect(result).toEqual(5);
    });

    it("Creating a hash for null should return 0", function() {
        var result = createHash(null);
        expect(result).toBe(0);
    });

    it("Creating a function hash should get a unique hash for each function", function() {
        function FirstFunction(x, y) { return x + y; };
        function SecondFunction(x, y) { if (x === null && y === null) { return null; } else { return x > y; } };
        var firstFunctionHash = createFunctionHash(FirstFunction);
        var secondFunctionHash = createFunctionHash(SecondFunction);

        expect(firstFunctionHash).toEqual(-601740997);
        expect(secondFunctionHash).toEqual(-1465843121);
        expect(firstFunctionHash).not.toEqual(secondFunctionHash);
    });

    it("should get an entity using the function name", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        var result = testArray.get(Journal);

        expect(result).not.toBeNull();
        expect(compareId(result.id, Journal)).toBeTruthy();
    });

    it("should get an entity using an id string", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        var result = testArray.get(Journal.name);

        expect(result).not.toBeNull();
        expect(compareId(result.id, Journal)).toBeTruthy();
    });

    it("should not get an entity when passing in a new object", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        var result = testArray.get(Journal());

        expect(result).toBeUndefined();
    });

    it("should get the first entity in the array when no parameter is passed", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        var result = testArray.get();

        expect(result).not.toBeUndefined();
        expect(compareId(result.id, Sword)).toBeTruthy();
    });

    it("should get an entity using its object reference", function() {
        addArrayExtensions();
        var journal = Journal();

        var testArray = [
            Sword(),
            journal
        ];
        var result = testArray.get(journal);

        expect(result).not.toBeUndefined();
        expect(result).toBe(journal);
    });

    it("should get a destination matching a string id to the destination target", function() {
        addArrayExtensions();
        var gardenDestination = {
            name: 'To the garden',
            target: 'Garden'
        };

        var testArray = [
            {
                name: 'To the bedroom',
                target: 'Bedroom'
            },
            gardenDestination
        ];
        var result = testArray.get(gardenDestination.target);

        expect(result).not.toBeUndefined();
        expect(result).toBe(gardenDestination);
    });

    it("should get a destination matching a function to the destination target", function() {
        addArrayExtensions();
        const Garden = () => <ILocation>{};           

        var testArray = [
            {
                name: 'To the bedroom',
                target: 'Bedroom'
            },
            {
                name: 'To the garden',
                target: 'Garden'
            }
        ];
        var result = testArray.get(<any>Garden);

        expect(result).not.toBeUndefined();
        expect(compareId(result.target, Garden.name)).toBeTruthy();
    });

    it("should get all entities in the array matching the id", function() {
        addArrayExtensions();
        var testArray = [
            Sword(),
            Sword()
        ];;
        var result = testArray.all(Sword);

        expect(result).not.toBeUndefined();
        expect(result.length).toBe(2);
        expect(compareId(result[0].id, Sword)).toBeTruthy();
        expect(compareId(result[1].id, Sword)).toBeTruthy();
    });

    it("should not change anything when removing a non-existing item", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        testArray.remove('');

        expect(testArray.length).toBe(2);
    });

    it("should remove an entity using the function name", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        testArray.remove(Journal);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    it("should remove an entity using an id string", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        testArray.remove(Journal.name);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    it("should not remove an entity when passing in a new object", function() {
        addArrayExtensions();
        var testArray = getTestArray();
        testArray.remove(Journal());

        expect(testArray.length).toBe(2);
        expect(compareId(testArray[1].id, Journal)).toBeTruthy();
    });

    it("should remove an entity using its object reference", function() {
        addArrayExtensions();
        var journal = Journal();
        var testArray = [
            Sword(),
            journal
        ];
        testArray.remove(journal);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    it("should remove a destination using the string id of the destination", function() {
        addArrayExtensions();
        var gardenDestination = {
            name: 'To the garden',
            target: 'Garden'
        };

        var testArray = [
            {
                name: 'To the bedroom',
                target: 'Bedroom'
            },
            gardenDestination
        ];
        testArray.remove(gardenDestination.target);

        expect(testArray.length).toBe(1);
        expect(testArray[0].target).toBe('Bedroom');
    });

    it("should remove a destination using the function of the destination", function() {
        addArrayExtensions();
        const Garden = () => <ILocation>{};  

        var testArray = <ICollection<IDestination>>[
            {
                name: 'To the bedroom',
                target: 'Bedroom'
            },
            {
                name: 'To the garden',
                target: 'Garden'
            }
        ];

        testArray.remove(<any>Garden);

        expect(testArray.length).toBe(1);
        expect(testArray[0].target).toBe('Bedroom');
    });

    it("should return correct results when comparing strings", function() {
        expect(compareString(undefined, undefined)).toBeTruthy();
        expect(compareString(null, null)).toBeTruthy();
        expect(compareString(null, undefined)).toBeFalsy();
        expect(compareString(undefined, null)).toBeFalsy();
        expect(compareString('', null)).toBeFalsy();
        expect(compareString(null, '')).toBeFalsy();
        expect(compareString('', '')).toBeTruthy();
        expect(compareString('Test', 'test')).toBeTruthy();
        expect(compareString('Test', 'TEST')).toBeTruthy();
    });

    function getTestArray() {
        return [
            Sword(),
            Journal()
        ];
    }

    function compareId(id, func) {
        var name = func.name || func;
        return id.toLowerCase() === name.toLowerCase();
    }
});