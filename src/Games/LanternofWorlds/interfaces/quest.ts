namespace LanternofWorlds {
    export function Quest(entity: IQuest): IQuest {
        return StoryScript.Quest(entity);
    }

    export interface IQuest extends StoryScript.IQuest {
        // Add game-specific item properties here
    }
}