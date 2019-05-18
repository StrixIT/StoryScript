namespace MyAdventureGameVisual {
    export function Key<T extends IKey>(entity: T): T {
        return StoryScript.Key(entity);
    }

    export interface IKey extends StoryScript.IKey {
        // Add game-specific item properties here
    }
}