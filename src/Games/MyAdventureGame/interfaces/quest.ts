namespace MyAdventureGame {
    export function BuildQuest<T extends IQuest>(entity: T): T {
        return StoryScript.BuildQuest(entity);
    }

    export interface IQuest extends StoryScript.IQuest {
        // Add game-specific item properties here
    }
}