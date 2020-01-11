import '../../../Games/MyRolePlayingGame/run';
import { DefaultTexts } from 'storyScript/defaultTexts';
import { GetObjectFactory } from 'storyScript/run';

describe("Default texts", function() {

    it("Object factory should return texts", function() {
        var factory = GetObjectFactory();
        var texts = factory.GetTexts();
        expect(texts).not.toBeNull();
    });

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