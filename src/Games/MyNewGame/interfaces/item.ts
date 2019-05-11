namespace MyNewGame {
    export function Item<T extends IItem>(entity: T): T {
        return StoryScript.Item(entity);
    }

    export interface IItem extends StoryScript.IItem {
        damage?: string;
        defense?: number;
    }
}