import { DefaultTexts } from 'storyScript/defaultTexts';

describe("Default texts", function() {

    it("should replace the tokens in a template and remove duplicate spaces", function() {
        var texts = new DefaultTexts();
        var template = 'You {1} {2} the {0}. Nothing happens.';
        var tokens = [ 'ball', 'take', '' ];
        var result = texts.format(template, tokens);
        expect(result).toBe('You take the ball. Nothing happens.')
    });

    it("should uppercase the first letter of the text when titlecasing", function() {
        var texts = new DefaultTexts();
        var test = 'test';
        var result = texts.titleCase(test);
        expect(result).toBe('Test');
    });

});