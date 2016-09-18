module QuestForTheKing {
    export interface IItem extends StoryScript.IItem {
        damage?: string;
        defense?: number;
        dayAvailable?: number;
        arcane?: boolean;
        class?: Class;
        attackText?: string;
    }
}