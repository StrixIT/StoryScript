namespace MyAdventureGame {
    export function BuildLocation<T extends ILocation>(entity: T): T {
        return StoryScript.BuildLocation(entity);
    }

    export interface ILocation extends StoryScript.ILocation {
        // Add game-specific location properties here
    }
}