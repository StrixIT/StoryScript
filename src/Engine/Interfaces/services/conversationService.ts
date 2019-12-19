import { IPerson } from '../../Interfaces/person';
import { IConversationNode } from '../conversations/conversationNode';
import { IConversationReply } from '../conversations/conversationReply';

export interface IConversationService {
    talk(person: IPerson): void;
    answer(node: IConversationNode, reply: IConversationReply): void;
    getLines(nodeOrReply: IConversationNode | IConversationReply): string;
}