module StoryScript {
    export interface IEnemy {
        id?: string;
        pictureFileName?: string;
        name: string;
        hitpoints: number;
        currency?: number;
        inactive?: boolean;
        items?: [IItem | (() => IItem)];
        onDefeat?: (game: IGame) => void;
    }
}