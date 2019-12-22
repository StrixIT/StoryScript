import { ConversationService } from 'storyScript/Services/ConversationService';

describe("ConversationService", function() {

    it("should return the lines of a conversation node", function() {
        var node = {
            lines: 'My lines'
        }
        var service = getService();
        var result = service.getLines(node);

        expect(result).toBe(node.lines);
    });

    function getService(game?: any) {
        return new ConversationService(game || {});
    }
});