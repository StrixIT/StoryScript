module StoryScript {
    export interface IEnemy {
        id?: string;
        pictureFileName?: string;
        name: string;
        description?: string;
        hitpoints: number;
        currency?: number;
        inactive?: boolean;
        items?: ICollection<IItem | (() => IItem)>;
        onDefeat?: (game: IGame) => void;
    }
}