await import('../../../Games/MyRolePlayingGame/run');
import { ConversationService } from 'storyScript/Services/ConversationService';
import { IDataService } from '../../../Engine/Interfaces/services/dataService';
import {ObjectFactory} from "storyScript/ObjectFactory";

describe("ConversationService", function() {

    it("Object factory should return conversation service", function() {
        var factory = ObjectFactory.GetInstance();
        var service = factory.GetConversationService();
        expect(service).not.toBeNull();
    });

    it("should return the lines of a conversation node", function() {
        var node = {
            lines: 'My lines'
        }
        var service = getService();
        var result = service.getLines(node);

        expect(result).toBe(node.lines);
    });

});

function getService(dataService?, game?: any) {
    return new ConversationService(dataService || {}, game || {});
}