import { describe, test, expect } from 'vitest';
import { ConversationService } from 'storyScript/Services/ConversationService';
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
describe("ConversationService", function() {

    test("should return the lines of a conversation node", function() {
        const node = {
            lines: 'My lines'
        }
        const service = getService();
        const result = service.getLines(node);
        expect(result).toBe(node.lines);
    });

});

function getService(dataService?: IDataService, game?: any) {
    return new ConversationService(dataService || <IDataService>{}, game || {});
}