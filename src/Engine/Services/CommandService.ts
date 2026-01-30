import {IGame} from "storyScript/Interfaces/game.ts";
import {ICommandService} from "storyScript/Interfaces/services/commandService.ts";
import {ILocationService} from "storyScript/Interfaces/services/locationService.ts";
import {IConversationService} from "storyScript/Interfaces/services/conversationService.ts";
import {ILocation} from "storyScript/Interfaces/location.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";

export class CommandService implements ICommandService {

    constructor(private _locationService: ILocationService, private _conversationService: IConversationService, private _dataService: IDataService, private _game: IGame) {
    }

    go(location: (() => ILocation) | string, travel?: boolean): void {
        this._locationService.changeLocation(location, travel, this._game);

        if (travel) {
            this._dataService.saveGame(this._game);
        }
    }

    talk(person: () => IPerson): void {
        const partner = this._game.currentLocation.persons.get(person);

        if (!partner) {
            throw new Error(`No person ${person.name} present at location ${this._game.currentLocation.name}!`);
        }

        this._conversationService.talk(partner);
    }

    answer(node: string, reply?: string): void {
        node ??= 'default';
        const selectedNode = this._game.person.conversation.nodes.find(n => n.node?.toLowerCase() === node);

        if (!selectedNode) {
            throw new Error(`No node ${node} exists on the conversation with person ${this._game.person.name}!`);
        }

        reply = reply?.toLowerCase();
        const selectedReply = selectedNode.replies.find(r => r.linkToNode?.toLowerCase() == reply || (r.defaultReply && !reply));

        if (!selectedReply) {
            throw new Error(`No reply ${reply} exists on conversation node ${node} of person ${this._game.person.name}!`);
        }

        this._conversationService.answer(selectedNode, selectedReply);
    }
}