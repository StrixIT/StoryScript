namespace MyAdventureGame {
    export function Person<T extends IPerson>(entity: T): T {
        return StoryScript.Person(entity);
    }

    export interface IPerson extends StoryScript.IPerson {
        // Add game-specific person properties here
    }
}