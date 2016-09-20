module QuestForTheKing {
    export interface IItem extends StoryScript.IItem {
        damage?: string;
        defense?: number;
        dayAvailable?: number;
        arcane?: boolean;
        itemClass?: Class | Class[];
        attackText?: string;
    }
}