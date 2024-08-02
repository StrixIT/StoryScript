import {describe, expect, test} from 'vitest';
import {ConversationService} from 'storyScript/Services/ConversationService';

describe("ConversationService", function () {

    test("should return the lines of a conversation node", function () {
        const node = {
            lines: 'My lines'
        }
        const service = getService();
        const result = service.getLines(node);
        expect(result).toBe(node.lines);
    });

});

function getService(game?: any) {
    return new ConversationService(game || {});
}