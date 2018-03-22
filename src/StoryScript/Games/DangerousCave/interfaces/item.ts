namespace DangerousCave {
    export interface IItem extends StoryScript.IItem {
        damage?: string;
        defense?: number;
        charges?: number;
    }
}