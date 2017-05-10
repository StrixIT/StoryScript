module StoryScript {
    export interface IConversation {
        title?: string;
        setStartNode?: (person: IPerson, nodeName: string) => void;
        selectActiveNode?: (game: IGame, person: IPerson) => IConversationNode;
        showUnavailableReplies?: boolean;
        prepareReplies?(game: IGame, person: IPerson, node: IConversationNode): void;
        handleReply?(game: IGame, person: IPerson, node: IConversationNode, reply: IConversationReply): void;
        nodes?: ICollection<IConversationNode>;
        defaultReply?: string;
        activeNode?: IConversationNode;
        conversationLog?: IConversationLogEntry[];
    }

    export interface IConversationNode {
        start?: boolean,
        active?: boolean;
        node: string;
        lines: string;
        replies?: ICollection<IConversationReply>;
        defaultReply?: boolean;
    }

    export interface IConversationReply {
        requires?: string;
        lines?: string;
        linkToNode?: string;
        available?: boolean;
        showWhenUnavailable?: boolean;
        questStart?: string;
        questComplete?: string;
    }

    export interface IConversationLogEntry {
        lines: string;
        reply: string;
    }
}