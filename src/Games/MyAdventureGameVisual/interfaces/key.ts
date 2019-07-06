namespace MyAdventureGameVisual {
    export function Key(entity: IKey): IKey {
        return StoryScript.Key(entity);
    }

    export interface IKey extends StoryScript.IKey {
        // Add game-specific item properties here
    }
}