import {IConversationNode, IConversationReply, IPerson} from 'storyScript';

export interface IConversationService {
    talk(person: IPerson): Promise<void>;

    answer(node: IConversationNode, reply: IConversationReply): Promise<void>;
}