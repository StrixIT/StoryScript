module StoryScript {
    export interface IConversation {
        title?: string;
        nodes: ICollection<IConversationNode>;
        activeNode?: IConversationNode;
        conversationLog?: IConversationLogEntry[];
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
        lines?: string;
        linkToNode?: string;
    }

    export interface IConversationLogEntry {
        lines: string;
        reply: string;
    }
}