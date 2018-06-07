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
        selectActiveNode?(game: IGame, person: ICompiledPerson): IConversationNode;

        /**
         * True if reply options that the player cannot choose are to be displayed but unselectable, false to just hide them.
         */
        showUnavailableReplies?: boolean;

        /**
         * The actions that can be triggered from the conversation.
         */
        actions?: { [name: string]: (game: IGame, person: ICompiledPerson) => void }
    }

    export interface IConversation extends IConversationOptions {
        nodes?: ICollection<IConversationNode>;
        activeNode?: IConversationNode;
        conversationLog?: IConversationLogEntry[];
    }

    export interface IConversationNode {
        start?: boolean,
        active?: boolean;
        node: string;
        lines: string;
        replies: IConversationReplies;
    }

    export interface IConversationReplies {
        defaultReply?: boolean;
        options?: ICollection<IConversationReply>;
    }

    export interface IConversationReply {
        requires?: string;
        lines?: string;
        linkToNode?: string;
        available?: boolean;
        showWhenUnavailable?: boolean;
        trigger?: string;
        questStart?: string;
        questComplete?: string;
        setStart?: string;
    }

    export interface IConversationLogEntry {
        lines: string;
        reply: string;
    }
}