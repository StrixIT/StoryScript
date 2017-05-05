module StoryScript {
    export interface IConversation {
        title?: string;
        selectActiveNode?: (game: IGame, person: IPerson) => IConversationNode;
        showUnavailableReplies?: boolean;
        prepareReplies?(game: IGame, person: IPerson, node: IConversationNode): void;
        handleReply?(game: IGame, person: IPerson, node: IConversationNode, reply: IConversationReply): void;
        nodes?: ICollection<IConversationNode>;
        activeNode?: IConversationNode;
        conversationLog?: IConversationLogEntry[];
    }

    export interface IConversationNode {
        active?: boolean;
        node: string;
        lines: string;
        replies?: ICollection<IConversationReply>;
    }

    export interface IConversationReply {
        requires?: string;
        quest?: string;
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