import {IConversationNode, IGame} from 'storyScript';

export interface IEncounterRules {
    initReplies?: (game: IGame, node: IConversationNode) => void;
}