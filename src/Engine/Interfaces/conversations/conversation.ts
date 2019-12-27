import { IGame } from '../game';
import { IPerson } from '../person';
import { IConversationNode } from './conversationNode';
import { IConversationLogEntry } from './conversationLogEntry';

/**
 * A conversation between the player and a person. The nodes are loaded at run-time from the HTML file of the person.
 */
export interface IConversation {
    /**
     * The title of the conversation as shown to the player.
     */
    title?: string;

    /**
     * When specified, this function will be used to determine what conversation node to set as the active node.
     * @param game The game object
     * @param person The person the player is having the conversation with
     */
    selectActiveNode?(game: IGame, person: IPerson): IConversationNode;

    /**
     * True if reply options that the player cannot choose are to be displayed but unselectable, false to just hide them.
     */
    showUnavailableReplies?: boolean;

    /**
     * The actions that can be triggered from the conversation.
     */
    actions?: { [name: string]: (game: IGame, person: IPerson) => void }

    /**
     * The nodes that make up this conversation. Loaded from the person HTML at runtime.
     */
    nodes?: IConversationNode[];

    /**
     * The name of the node to start the conversation with. Set at runtime.
     */
    startNode?: string;

    /**
     * The node currently active in the conversation.
     */
    activeNode?: IConversationNode;

    /**
     * A log of the conversation so far.
     */
    conversationLog?: IConversationLogEntry[];
}