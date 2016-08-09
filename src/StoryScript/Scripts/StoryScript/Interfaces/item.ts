module StoryScript {
    export interface IItem {
        name: string;
        pictureFileName?: string;
        equipmentType: EquipmentType;
        description?: string;
        bonuses?: any;
        use?: (...params) => void;
    }
}