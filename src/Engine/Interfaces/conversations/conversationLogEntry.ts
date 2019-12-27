/**
 * An entry in the conversation log.
 */
export interface IConversationLogEntry {
    /**
     * The conversation node logged.
     */
    lines: string;

    /**
     * The reply the player chose to the logged node.
     */
    reply: string;
}