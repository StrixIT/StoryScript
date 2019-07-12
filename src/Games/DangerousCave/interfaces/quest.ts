namespace DangerousCave {
    export function Ques(entity: IQuest): IQuest {
        return StoryScript.Quest(entity);
    }

    export interface IQuest extends StoryScript.IQuest {
        // Add game-specific item properties here
    }
}