module StoryScript {
    export interface IConversation {
        title?: string;
        nodes?: ICollection<IConversationNode>;
        setStartNode?: (person: IPerson, nodeName: string) => void;
        selectActiveNode?: (game: IGame, person: IPerson) => IConversationNode;
        showUnavailableReplies?: boolean;
        actions?: { [name: string]: (game: IGame, person: IPerson) => void }
        conversationLog?: IConversationLogEntry[];
        activeNode?: IConversationNode;
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
    }

    export interface IConversationLogEntry {
        lines: string;
        reply: string;
    }
}