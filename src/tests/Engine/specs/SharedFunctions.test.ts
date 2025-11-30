import {describe, expect, test} from 'vitest';
import {parseFunction, parseGamePropertiesInTemplate} from "storyScript/Services/sharedFunctions.ts";
import {IGame} from "storyScript/Interfaces/game.ts";

describe("SharedFunctions", function () {

    test("Parsing null as a function should return null", function () {
        const myFunction = parseFunction(null);
        expect(myFunction).toBeNull();
    });

    test("Deserializing function should get working function", function () {
        const functionString = 'function MyFunction(x, y) { return x + y; }';
        const myFunction = parseFunction(functionString);
        const result = myFunction(2, 3);

        expect(result).toEqual(5);
    });

    test("Deserializing a multiline function should get a working function", function () {
        const functionString = `function MyFunction(x, y) { 
                                return x + y; 
                            }`;

        const myFunction = parseFunction(functionString);
        const result = myFunction(2, 3);

        expect(result).toEqual(5);
    });

    test("game property should be parsed in string", function () {
        const value = "Hi there, {game.activeCharacter.name}!";
        const expected = "Hi there, John!";
        const actual = parseGamePropertiesInTemplate(value, <IGame>{activeCharacter: {name: 'John'}});

        expect(expected).toEqual(actual);
    });

    test("game property should be parsed in string when game part is not included", function () {
        const value = "Hi there, {activeCharacter.name}!";
        const expected = "Hi there, John!";
        const actual = parseGamePropertiesInTemplate(value, <IGame>{activeCharacter: {name: 'John'}});

        expect(expected).toEqual(actual);
    });

    test("game property with index should be parsed in string", function () {
        const value = "Hi there. That's a nice {game.activeCharacter.items[0].name}!";
        const expected = "Hi there. That's a nice Sword!";
        const actual = parseGamePropertiesInTemplate(value, <IGame>{activeCharacter: {items: [{name: 'Sword'}]}});

        expect(expected).toEqual(actual);
    });

    test("unknown property should not be parsed in string", function () {
        const value = "Hi there {game.activeCharacter.dummy}!";
        const expected = value;
        const actual = parseGamePropertiesInTemplate(value, <IGame>{activeCharacter: {items: [{name: 'Sword'}]}});

        expect(expected).toEqual(actual);
    });

});