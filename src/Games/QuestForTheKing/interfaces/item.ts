module QuestForTheKing {
    export function Item(entity: IItem): IItem {
        return StoryScript.Item(entity);
    }

    export interface IItem extends IFeature, StoryScript.IItem {
        damage?: string;
        defense?: number;
        dayAvailable?: number;
        arcane?: boolean;
        itemClass?: Class | Class[];
        attackText?: string;
        activeNight?: boolean;
        activeDay?: boolean;
    }
}