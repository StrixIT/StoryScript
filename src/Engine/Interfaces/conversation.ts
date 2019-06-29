namespace StoryScript {
    /**
     * The conversation options to configure a conversation between the player and a person.
     */
    export interface IConversationOptions {
        /**
         * The title of the conversation as shown to the player.
         */
        // Todo: is this used?
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
    }

    /**
     * A conversation between the player and a person. The nodes are loaded at run-time from the HTML file of the person.
     */
    export interface IConversation extends IConversationOptions {
        /**
         * The nodes that make up this conversation.
         */
        nodes?: IConversationNode[];

        /**
         * The node currently active in the conversation.
         */
        activeNode?: IConversationNode;

        /**
         * A log of the conversation so far.
         */
        conversationLog?: IConversationLogEntry[];
    }

    /**
     * A node of a conversation.
     */
    export interface IConversationNode {
        /**
         * True if this node is the starting node for the conversation, false otherwise.
         */
        start?: boolean,

        /**
         * True if this node is the active node of the conversation, false otherwise.
         */
        active?: boolean;

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
}