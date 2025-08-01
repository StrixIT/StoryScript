import {describe, expect, test} from 'vitest';
import {addHtmlSpaces, compareString, equals, getId, getPlural, getSingular, isEmpty} from 'storyScript/utilityFunctions';

describe("UtilityFunctions", function () {

    test("should get the correct plural of enemy", function () {
        const result = getPlural('enemy');
        expect(result).toEqual('enemies');
    });

    test("should get the correct plural of item", function () {
        const result = getPlural('item');
        expect(result).toEqual('items');
    });

    test("should get the correct singular of items", function () {
        const result = getSingular('items');
        expect(result).toEqual('item');
    });

    test("should get the correct singular of items", function () {
        const result = getSingular('enemies');
        expect(result).toEqual('enemy');
    });

    test("should return true when null", function () {
        const result = isEmpty(null);
        expect(result).toEqual(true);
    });

    test("should return true when an object has no properties", function () {
        const result = isEmpty({});
        expect(result).toEqual(true);
    });

    test("should return true when a property is not present", function () {
        const result = isEmpty({}, 'test');
        expect(result).toEqual(true);
    });

    test("should return true when an array is empty", function () {
        const result = isEmpty([]);
        expect(result).toEqual(true);
    });

    test("should return true when a property array is empty", function () {
        const result = isEmpty({test: []}, 'test');
        expect(result).toEqual(true);
    });

    test("should return false when an object is not undefined, null or empty", function () {
        const result = isEmpty({test: null});
        expect(result).toEqual(false);
    });

    test("should add spaces when needed", function () {
        const result = addHtmlSpaces('test');
        expect(result).toEqual('&nbsp;test&nbsp;');
    });

    test("equals should return true when id matches function name", function () {
        const Test = () => {
            return {
                id: ''
            };
        };

        const result = equals({id: 'test'}, Test);

        expect(result).toBeTruthy();
    });

    test("should return correct results when comparing strings", function () {
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

    test("should return function name as id", function () {
        function Test() { return; }
        const result = getId(Test);
        expect(result).toEqual('test');
    });

    test("should return function name as id when it contains _", function () {
        function TestFunction_TestFunction() { return; }
        const result = getId(TestFunction_TestFunction);
        expect(result).toEqual('testfunction');
    });

    test("should return function name as id when it contains $", function () {
        function TestFunction$2() { return; }
        const result = getId(TestFunction$2);
        expect(result).toEqual('testfunction');
    });
});