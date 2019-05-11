namespace MyAdventureGame {
    export function Quest<T extends IQuest>(entity: T): T {
        return StoryScript.Quest(entity);
    }

    export interface IQuest extends StoryScript.IQuest {
        // Add game-specific item properties here
    }
}