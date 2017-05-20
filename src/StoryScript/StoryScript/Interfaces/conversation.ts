module StoryScript {
    export interface IConversationOptions {
        title?: string;
        selectActiveNode?: (game: IGame, person: ICompiledPerson) => IConversationNode;
        showUnavailableReplies?: boolean;
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