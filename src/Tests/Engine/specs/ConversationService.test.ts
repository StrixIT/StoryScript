import {describe, expect, test} from 'vitest';
import {ConversationService} from 'storyScript/Services/ConversationService';
import {IPerson} from "storyScript/Interfaces/person.ts";
import {IGame} from "storyScript/Interfaces/game.ts";

describe("ConversationService", function () {

    test("should return the lines of a conversation node", function () {
        const person = <IPerson>{
            conversation: {
                nodes: [{
                    node: 'start',
                    lines: 'This is the start of the conversation',
                    replies: {
                        defaultReply: true,
                        options: [{
                            lines: 'Default reply'
                        }]
                    }
                }]
            }
        }
        
        const service = getService();
        service.talk(person);
        expect(person.conversation).not.toBeNull();
    });

});

function getService(game?: any) {
    game ??= <IGame>{
        sounds: {
            playedAudio: []
        }
    }
    
    return new ConversationService(game || {});
}