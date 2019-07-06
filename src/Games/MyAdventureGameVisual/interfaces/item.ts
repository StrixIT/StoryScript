namespace MyAdventureGameVisual {
    export function Item(entity: IItem): IItem {
        return StoryScript.Item(entity);
    }

    export interface IItem extends StoryScript.IItem {
        // Add game-specific item properties here
    }
}