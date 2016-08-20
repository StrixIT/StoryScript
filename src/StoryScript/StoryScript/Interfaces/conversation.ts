module StoryScript {
    export interface IConversation {
        title?: string;
        nodes?: ICollection<IConversationNode>;
        activeNode?: IConversationNode;
        conversationLog?: IConversationLogEntry[];
        showUnavailableReplies?: boolean;
        prepareReplies?(game: IGame, person: IPerson, node: IConversationNode): void;
        handleReply?(game: IGame, person: IPerson, node: IConversationNode, reply: IConversationReply): void;
    }

    export interface IConversationNode {
        active?: boolean;
        node: string;
        lines: string;
        replies?: ICollection<IConversationReply>;
    }

    export interface IConversationReply {
        requires?: string;
        lines?: string;
        linkToNode?: string;
        available?: boolean;
        showWhenUnavailable?: boolean;
    }

    export interface IConversationLogEntry {
        lines: string;
        reply: string;
    }
}