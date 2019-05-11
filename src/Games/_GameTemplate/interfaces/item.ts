namespace GameTemplate {
    export function Item<T extends IItem>(entity: T): T {
        return StoryScript.Item(entity);
    }

    export interface IItem extends StoryScript.IItem {
        // Add game-specific item properties here
    }
}