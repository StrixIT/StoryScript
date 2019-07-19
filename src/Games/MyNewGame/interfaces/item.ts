namespace MyNewGame {
    export function Item(entity: IItem): IItem {
        return StoryScript.Item(entity);
    }

    export interface IItem extends IFeature, StoryScript.IItem {
        damage?: string;
        defense?: number;
    }
}