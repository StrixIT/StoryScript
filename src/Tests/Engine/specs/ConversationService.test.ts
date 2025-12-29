import {beforeAll, describe, expect, test} from 'vitest';
import {ConversationService} from 'storyScript/Services/ConversationService';
import {IPerson} from "storyScript/Interfaces/person.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {IParty} from "storyScript/Interfaces/party.ts";
import {addArrayExtensions} from "storyScript/arrayAndFunctionExtensions.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";

describe("ConversationService", function () {

    beforeAll(() => addArrayExtensions());

    test("should return the lines of a conversation node", function () {
        const startLine = '        <p>\n' +
            '            This is the start of the conversation\n' +
            '        </p>\n';

        const description = '<description>\n' +
            '</description>\n' +
            '<conversation>\n' +
            '    <default-reply>\n' +
            '        Never mind. See you later.\n' +
            '    </default-reply>\n' +
            '    <node name="start">\n' +
            startLine +
            '        <replies>\n' +
            '            <reply node="fine" set-start="return">\n' +
            '                Fine, thanks.\n' +
            '            </reply>\n' +
            '            <reply node="workout" requires="strength=3" set-start="return">\n' +
            '                Great. I have just completed my workout.\n' +
            '            </reply>\n' +
            '        </replies>' +
            '    </node>'

        const person = <IPerson>{
            description: description,
            conversation: {}
        }

        const game = <IGame>{
            activeCharacter: {},
            currentLocation: {
                persons: [
                    person
                ]
            }
        };

        const service = getService(game);
        service.talk(person);
        expect(person.conversation.activeNode.lines.trim()).toBe(startLine.trim());
    });

    test("should show only replies for which the requirements are met", function () {
        const game = <IGame>{
            party: <IParty>{
                characters: [{
                    items: [],
                    equipment: {}
                }]
            }
        };

        const person = <IPerson>{
            conversation: {
                nodes: [{
                    node: 'start',
                    lines: 'This is the start of the conversation',
                    replies: [
                        {
                            defaultReply: true,
                            lines: 'Default reply'
                        },
                        {
                            lines: 'Only available with key',
                            requires: 'item=key'
                        }
                    ]
                }]
            }
        }

        const service = getService(game);
        service.talk(person);
        expect(person.conversation.activeNode.replies.filter(r => r.available).length).toBe(1);
    });

});

function getService(game?: any) {
    game ??= <IGame>{};

    game.sounds = {
        playedAudio: []
    };

    return new ConversationService(game, <IRules>{});
}