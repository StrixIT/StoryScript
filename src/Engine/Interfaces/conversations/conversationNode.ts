import { IConversationReplies } from './conversationReplies';

/**
 * A node of a conversation.
 */
export interface IConversationNode {
    /**
     * The internal name of the node, used to reference it from code.
     */
    node: string;

    /**
     * The node text as shown to the player.
     */
    lines: string;

    /**
     * The possible replies of the player for this node.
     */
    replies: IConversationReplies;
}