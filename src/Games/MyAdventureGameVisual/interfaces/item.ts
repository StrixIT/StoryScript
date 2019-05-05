namespace MyAdventureGameVisual {
    export function BuildItem<T extends IItem>(entity: T): T {
        return StoryScript.BuildItem(entity);
    }

    export interface IItem extends StoryScript.IItem {
        // Add game-specific item properties here
    }
}