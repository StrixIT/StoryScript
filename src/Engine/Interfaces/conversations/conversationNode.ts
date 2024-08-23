import {IConversationReply} from "./conversationReply.ts";

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
    replies: IConversationReply[];

    /**
    * The action triggered when this node is activated. The trigger string must equal an action in the conversation options.
    */
    trigger?: string;
}