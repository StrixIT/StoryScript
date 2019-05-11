module QuestForTheKing {
    export function Item<T extends IItem>(entity: T): T {
        return StoryScript.Item(entity);
    }

    export interface IItem extends StoryScript.IItem {
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