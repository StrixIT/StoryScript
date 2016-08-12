module StoryScript {
    export interface IConversation {
        nodes: ICollection<IConversationNode>;
    }

    export interface IConversationNode {
        node: string;
        lines: string;
        Replies?: ICollection<IReply>;
    }

    export interface IReply {
        lines?: string;
        linkToNode: IConversationNode;
    }
}