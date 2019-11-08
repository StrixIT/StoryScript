import { IPerson } from '../../Interfaces/person';
import { IConversationNode, IConversationReply } from '../../Interfaces/conversations/conversations';

export interface IConversationService {
    talk(person: IPerson): void;
    answer(node: IConversationNode, reply: IConversationReply): void;
    getLines(nodeOrReply: IConversationNode | IConversationReply): string;
}