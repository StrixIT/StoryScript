import { describe, test, expect } from 'vitest';
import { addFunctionExtensions, createFunctionHash, addArrayExtensions, compareString, parseFunction, createHash } from 'storyScript/globals';
import { Journal } from '../../../Games/MyRolePlayingGame/items/journal';
import { Sword } from '../../../Games/MyRolePlayingGame/items/sword';
import { ILocation, ICollection, IDestination } from 'storyScript/Interfaces/storyScript';
import { getId } from 'storyScript/utilities';
import { compareId } from '../helpers';

describe("Utilities", function() {

    test("named functions should have a name property", function() {
        addFunctionExtensions();

        function MyFunction() {
        };

        const result = MyFunction.name;
        expect(result).toEqual('MyFunction');
    });

    test("should create a proxy that is called when calling the function and is identifiable as a proxy", function() {
        addFunctionExtensions();

        let MyFunction = function(x, y) {
            return x + y;
        };

        function AddOn(myScope, myFunction, x, y, z) {
            const myFunctionResult = myFunction(x, y);
            return myFunctionResult * z;
        }

        MyFunction = MyFunction.proxy(AddOn, 5);
        const result = MyFunction(2, 6);

        expect(result).toEqual(40);
        expect(MyFunction.proxy).toBeTruthy();
    });

    test("Parsing null as a function should return null", function() {
        addFunctionExtensions();
        const myFunction = parseFunction(null);
        expect(myFunction).toBeNull();
    });

    test("Deserializing function should get working function", function() {
        addFunctionExtensions();

        const functionString = 'function MyFunction(x, y) { return x + y; }';
        const myFunction = parseFunction(functionString);
        const result = myFunction(2, 3);
        
        expect(result).toEqual(5);
    });

    test("Deserializing a multiline function should get a working function", function() {
        addFunctionExtensions();

        const functionString = `function MyFunction(x, y) { 
                                return x + y; 
                            }`;
                            
        const myFunction = parseFunction(functionString);
        const result = myFunction(2, 3);
        
        expect(result).toEqual(5);
    });

    test("Creating a hash for null should return 0", function() {
        const result = createHash(null);
        expect(result).toBe(0);
    });

    test("Creating a function hash should get a unique hash for each function", function() {
        function FirstFunction(x, y) { return x + y; };
        function SecondFunction(x, y) { if (x === null && y === null) { return null; } else { return x > y; } };
        const firstFunctionHash = createFunctionHash(FirstFunction);
        const secondFunctionHash = createFunctionHash(SecondFunction);

        expect(firstFunctionHash).toEqual(-582951769);
        expect(secondFunctionHash).toEqual(389068928);
        expect(firstFunctionHash).not.toEqual(secondFunctionHash);
    });

    test("should get an entity using the function name", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get(Journal);

        expect(result).not.toBeNull();
        expect(compareId(result.id, Journal)).toBeTruthy();
    });

    test("should get an entity using an id string", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get(Journal.name);

        expect(result).not.toBeNull();
        expect(compareId(result.id, Journal)).toBeTruthy();
    });

    test("should NOT get an entity by type and id when passing in a new object", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get(Journal());
        expect(result).toBeUndefined();
    });

    test("should get the first entity in the array when no parameter is passed", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get();

        expect(result).not.toBeUndefined();
        expect(compareId(result.id, Sword)).toBeTruthy();
    });

    test("should get an entity using its object reference", function() {
        addArrayExtensions();
        const journal = Journal();

        const testArray = [
            Sword(),
            journal
        ];
        const result = testArray.get(journal);

        expect(result).not.toBeUndefined();
        expect(result).toBe(journal);
    });

    test("should get a destination matching a string id to the destination target", function() {
        addArrayExtensions();
        const gardenDestination = {
            name: 'To the garden',
            target: 'Garden'
        };

        const testArray = [
            {
                name: 'To the bedroom',
                target: 'Bedroom'
            },
            gardenDestination
        ];
        const result = testArray.get(gardenDestination.target);

        expect(result).not.toBeUndefined();
        expect(result).toBe(gardenDestination);
    });

    test("should get a destination matching a function to the destination target", function() {
        addArrayExtensions();
        const Garden = () => <ILocation>{};           

        const testArray = [
            {
                name: 'To the bedroom',
                target: 'Bedroom'
            },
            {
                name: 'To the garden',
                target: 'Garden'
            }
        ];
        const result = testArray.get(<any>Garden);

        expect(result).not.toBeUndefined();
        expect(compareId(result.target, Garden.name)).toBeTruthy();
    });

    test("should get all entities in the array matching the id", function() {
        addArrayExtensions();

        const itemOne = Sword();
        itemOne.id = getId(Sword);
        const itemTwo = Sword();
        itemTwo.id = getId(Sword);

        const testArray = [
            itemOne,
            itemTwo
        ];;
        const result = testArray.all(Sword);

        expect(result).not.toBeUndefined();
        expect(result.length).toBe(2);
        expect(compareId(result[0].id, Sword)).toBeTruthy();
        expect(compareId(result[1].id, Sword)).toBeTruthy();
    });

    test("should not change anything when removing a non-existing item", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.remove('');

        expect(testArray.length).toBe(2);
    });

    test("should remove an entity using the function name", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.remove(Journal);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    test("should remove an entity using an id string", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.remove(Journal.name);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    test("should NOT remove an entity when passing it in as a new object", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.remove(Journal());

        expect(testArray.length).toBe(2);
        expect(compareId(testArray[1].id, Journal)).toBeTruthy();
    });

    test("should remove an entity using its object reference", function() {
        addArrayExtensions();
        const testArray = getTestArray();
        const journal = testArray[1];
        expect(journal.id).toBe(Journal.name.toLowerCase());
        testArray.remove(journal);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    test("should remove a destination using the string id of the destination", function() {
        addArrayExtensions();
        const gardenDestination = {
            name: 'To the garden',
            target: 'Garden'
        };

        const testArray = [
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

    test("should remove a destination using the function of the destination", function() {
        addArrayExtensions();
        const Garden = () => <ILocation>{};  

        const testArray = <ICollection<IDestination>>[
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

    test("should return correct results when comparing strings", function() {
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

});

function getTestArray() {
    const sword = Sword();
    const journal = Journal();
    sword.id = getId(Sword);
    journal.id = getId(Journal);

    return [
        sword,
        journal
    ];
}