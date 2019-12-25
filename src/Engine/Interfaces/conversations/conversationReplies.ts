import { IConversationReply } from './conversationReply';

/**
 * A reply to a conversation node.
 */
export interface IConversationReplies {
    /**
     * True if this reply is the default reply, available to all nodes. False otherwise.
     */
    defaultReply?: boolean;

    /**
     * The settings for this reply.
     */
    options?: IConversationReply[];
}