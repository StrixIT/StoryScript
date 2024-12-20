import {describe, expect, test} from 'vitest';
import {addArrayExtensions, addFunctionExtensions} from 'storyScript/arrayAndFunctionExtensions';
import {Journal} from '../../../Games/MyRolePlayingGame/items/journal';
import {Sword} from '../../../Games/MyRolePlayingGame/items/sword';
import {IDestination, ILocation} from 'storyScript/Interfaces/storyScript';
import {getId} from 'storyScript/utilityFunctions';
import {compareId} from '../helpers';
import {StateProperties} from "storyScript/stateProperties.ts";

describe("arrayAndFunctionExtensions", function () {

    test("named functions should have a name property", function () {
        addFunctionExtensions();

        function MyFunction() {
        }

        const result = MyFunction.name;
        expect(result).toEqual('MyFunction');
    });

    test("should create a proxy that is called when calling the function and is identifiable as a proxy", function () {
        let MyFunction = function (x, y) {
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

    test("should get an entity using the function name", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get(Journal);

        expect(result).not.toBeNull();
        expect(compareId(result.id, Journal)).toBeTruthy();
    });

    test("should get an entity using an id string", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get(Journal.name);

        expect(result).not.toBeNull();
        expect(compareId(result.id, Journal)).toBeTruthy();
    });

    test("should NOT get an entity by type and id when passing in a new object", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get(Journal());
        expect(result).toBeUndefined();
    });

    test("should get the first entity in the array when no parameter is passed", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        const result = testArray.get();

        expect(result).not.toBeUndefined();
        expect(compareId(result.id, Sword)).toBeTruthy();
    });

    test("should get an entity using its object reference", function () {
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

    test("should get a destination matching a string id to the destination target", function () {
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

    test("should get a destination matching a function to the destination target", function () {
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

    test("should get all entities in the array matching the id", function () {
        addArrayExtensions();

        const itemOne = Sword();
        itemOne.id = getId(Sword);
        const itemTwo = Sword();
        itemTwo.id = getId(Sword);

        const testArray = [
            itemOne,
            itemTwo
        ];
        const result = testArray.all(Sword);

        expect(result).not.toBeUndefined();
        expect(result.length).toBe(2);
        expect(compareId(result[0].id, Sword)).toBeTruthy();
        expect(compareId(result[1].id, Sword)).toBeTruthy();
    });

    test("should not change anything when removing a non-existing item", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.delete('');
        expect(testArray.length).toBe(2);
    });

    test("should remove an entity using the function name", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.delete(Journal);
        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    test("should remove an entity using an id string", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.delete(Journal.name);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
        const deleted = testArray.getDeleted();
        expect(deleted[0].id).toBe(getId(Journal.name));
    });

    test("should NOT remove an entity when passing it in as a new object", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        testArray.delete(Journal());

        expect(testArray.length).toBe(2);
        expect(compareId(testArray[1].id, Journal)).toBeTruthy();
    });

    test("should remove an entity using its object reference", function () {
        addArrayExtensions();
        const testArray = getTestArray();
        const journal = testArray[1];
        expect(journal.id).toBe(Journal.name.toLowerCase());
        testArray.delete(journal);

        expect(testArray.length).toBe(1);
        expect(compareId(testArray[0].id, Sword)).toBeTruthy();
    });

    test("should remove a destination using the string id of the destination", function () {
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
        testArray.delete(gardenDestination.target);

        expect(testArray.length).toBe(1);
        expect(testArray[0].target).toBe('Bedroom');
    });

    test("should remove a destination using the function of the destination", function () {
        addArrayExtensions();
        const Garden = () => <ILocation>{};

        const testArray = <IDestination[]>[
            {
                name: 'To the bedroom',
                target: 'Bedroom'
            },
            {
                name: 'To the garden',
                target: 'Garden'
            }
        ];

        testArray.delete(<any>Garden);

        expect(testArray.length).toBe(1);
        expect(testArray[0].target).toBe('Bedroom');
    });

    test("should add the added flag to the value of an added datarecord", function () {
        addArrayExtensions();
        const actionRecords = [['First', { name: 'first' }]];
        actionRecords.add(['Second', { name: 'second' }]);
        expect(actionRecords[1][1][StateProperties.Added]).toBeTruthy();

        const eventRecords = [['First', () => true]];
        eventRecords.add(['Second', () => false]);
        expect(eventRecords[1][1][StateProperties.Added]).toBeTruthy();
    });

    test("should get and remove an action or event function using its id string", function () {
        addArrayExtensions();
        const openKey = 'open';
        const closeKey = 'close';
        const openText = 'open function';
        const testArray =[[openKey, () => openText], [closeKey, () => 'close function']];
        
        const result = testArray.get(openKey);
        expect(result).not.toBeNull();
        const resultFunction = <Function>result[1];
        expect(resultFunction()).toBe(openText);
        
        testArray.delete(closeKey);
        const deleted = testArray.getDeleted();
        expect(testArray).toHaveLength(1);
        expect(deleted).toHaveLength(1);
        expect(testArray[0][0]).toBe(openKey);
        expect(deleted[0][0]).toBe(closeKey);
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