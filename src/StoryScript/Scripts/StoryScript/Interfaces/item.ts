module StoryScript {
    export interface IItem {
        name: string;
        pictureFileName?: string;
        equipmentType: EquipmentType;
        description?: string;
        damage?: string;
        defense?: number;
        charges?: number;
        bonuses?: any;
        actions?: ICollection<IAction>;
        use?: (...params) => void
    }
}