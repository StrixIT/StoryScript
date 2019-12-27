/**
 * Options for a reply to a node.
 */
export interface IConversationReply {
    /**
     * specifies an item or a character attribute with a minimum number required for this reply to be available.
     */
    requires?: string;

    /**
     * The text of this reply as shown to the player.
     */
    lines?: string;

    /**
     * The node that will continue the conversation if this reply is chosen.
     */
    linkToNode?: string;

    /**
     * True if the player can select the reply, false otherwise.
     */
    available?: boolean;

    /**
     * True if the player can see the reply even though it is not available to him, false otherwise.
     */        
    showWhenUnavailable?: boolean;

    /**
     * The action triggered by chosing this response. The trigger string must equal an action in the conversation options.
     */
    trigger?: string;

    /**
     * The name of the quest to start when this reply is chosen.
     */
    questStart?: string;

    /**
     * The name of the quest to complete when this reply is chosen.
     */
    questComplete?: string;

    /**
     * The name of the node to set as the start node when this reply is chosen.
     */
    setStart?: string;
}