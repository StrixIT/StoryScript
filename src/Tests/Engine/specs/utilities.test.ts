import { describe, test, expect } from 'vitest';
import { IGame } from 'storyScript/Interfaces/storyScript';
import { getPlural, getSingular, isEmpty, addHtmlSpaces, equals, parseGameProperties } from 'storyScript/utilities';

describe("Utilities", function() {

    test("should get the correct plural of enemy", function() {
        var result = getPlural('enemy');
        expect(result).toEqual('enemies');
    });

    test("should get the correct plural of item", function() {
        var result = getPlural('item');
        expect(result).toEqual('items');
    });

    test("should get the correct singular of items", function() {
        var result = getSingular('items');
        expect(result).toEqual('item');
    });

    test("should get the correct singular of items", function() {
        var result = getSingular('enemies');
        expect(result).toEqual('enemy');
    });

    test("should return true when null", function() {
        var result = isEmpty(null);
        expect(result).toEqual(true);
    });

    test("should return true when an object has no properties", function() {
        var result = isEmpty({});
        expect(result).toEqual(true);
    });

    test("should return true when a property is not present", function() {
        var result = isEmpty({}, 'test');
        expect(result).toEqual(true);
    });

    test("should return true when an array is empty", function() {
        var result = isEmpty([]);
        expect(result).toEqual(true);
    });

    test("should return true when a property array is empty", function() {
        var result = isEmpty({ test: []}, 'test');
        expect(result).toEqual(true);
    });

    test("should return false when an object is not undefined, null or empty", function() {
        var result = isEmpty({ test: null });
        expect(result).toEqual(false);
    });

    test("should add spaces when needed", function() {
        var result = addHtmlSpaces('test');
        expect(result).toEqual('&nbsp;test&nbsp;');
    });

    test("equals should return true when id matches function name", function() {
        const Test = () => {
            return { 
                id: ''
            };
        };
        
        const result = equals({ id: 'test' }, Test);

        expect(result).toBeTruthy();
    });

    test("game property should be parsed in string", function () {
        const value = "Hi there, {game.activeCharacter.name}!";
        const expected = "Hi there, John!";
        const actual = parseGameProperties(value, <IGame>{ activeCharacter: { name: 'John'}});
             
        expect(expected).toEqual(actual);
    });

    test("game property should be parsed in string when game part is not included", function () {
        const value = "Hi there, {activeCharacter.name}!";
        const expected = "Hi there, John!";
        const actual = parseGameProperties(value, <IGame>{ activeCharacter: { name: 'John'}});
             
        expect(expected).toEqual(actual);
    });

    test("game property with index should be parsed in string", function () {
        const value = "Hi there. That's a nice {game.activeCharacter.items[0].name}!";
        const expected = "Hi there. That's a nice Sword!";
        const actual = parseGameProperties(value, <IGame>{ activeCharacter: { items: [ { name: 'Sword' }]}});
             
        expect(expected).toEqual(actual);
    });

    test("unknown property should not be parsed in string", function () {
        const value = "Hi there {game.activeCharacter.dummy}!";
        const expected = value;
        const actual = parseGameProperties(value, <IGame>{ activeCharacter: { items: [ { name: 'Sword' }]}});
             
        expect(expected).toEqual(actual);
    });

});