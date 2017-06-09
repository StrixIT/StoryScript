module StoryScript {
    export interface IItem {
        id?: string;
        name: string;
        pictureFileName?: string;
        equipmentType: EquipmentType | EquipmentType[];
        description?: string;
        damage?: string;
        defense?: number;
        charges?: number;
        bonuses?: any;
        actions?: ICollection<IAction>;
        useInCombat?: boolean;
        value?: number;
        inactive?: boolean;

        equip?: (item: IItem, game: IGame) => boolean;
        unequip?: (item: IItem, game: IGame) => boolean;
        use?: (game: IGame, item: IItem) => void
    }
}