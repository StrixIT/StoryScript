import {IConversationNode, IConversationReply, IPerson} from 'storyScript';

export interface IConversationService {
    talk(person: IPerson): void;

    answer(node: IConversationNode, reply: IConversationReply): void;
}