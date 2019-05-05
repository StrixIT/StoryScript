namespace MyNewGame {
    export function BuildItem<T extends IItem>(entity: T): T {
        return StoryScript.BuildItem(entity);
    }

    export interface IItem extends StoryScript.IItem {
        damage?: string;
        defense?: number;
    }
}