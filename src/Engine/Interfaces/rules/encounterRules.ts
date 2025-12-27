import {IGame} from "storyScript/Interfaces/game.ts";
import {IConversationNode} from "storyScript/Interfaces/conversations/conversationNode.ts";

export interface IEncounterRules {
    initReplies?: (game: IGame, node: IConversationNode) => void;
}