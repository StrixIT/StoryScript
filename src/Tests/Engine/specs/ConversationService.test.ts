import { describe, test, expect } from 'vitest';
import { ConversationService } from 'storyScript/Services/ConversationService';
import { IDataService } from '../../../Engine/Interfaces/services/dataService';

describe("ConversationService", function() {

    test("should return the lines of a conversation node", function() {
        var node = {
            lines: 'My lines'
        }
        var service = getService();
        var result = service.getLines(node);

        expect(result).toBe(node.lines);
    });

});

function getService(dataService?, game?: any) {
    return new ConversationService(dataService || {}, game || {}, new Map<string, string>());
}