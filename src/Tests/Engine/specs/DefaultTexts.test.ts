import {describe, expect, test} from 'vitest';
import {DefaultTexts} from 'storyScript/defaultTexts';

describe("Default texts", function () {

    test("should replace the tokens in a template and remove duplicate spaces", function () {
        const texts = new DefaultTexts();
        const template = 'You {1} {2} the {0}. Nothing happens.';
        const tokens = ['ball', 'take', ''];
        const result = texts.format(template, tokens);
        expect(result).toBe('You take the ball. Nothing happens.')
    });

    test("should uppercase the first letter of the text when titlecasing", function () {
        const texts = new DefaultTexts();
        const test = 'test';
        const result = texts.titleCase(test);
        expect(result).toBe('Test');
    });

});