module StoryScript {
    export interface IEnemy {
        id?: string;
        pictureFileName?: string;
        name: string;
        hitpoints: number;
        currency?: number;
        items?: [IItem | (() => IItem)];
        onDefeat?: (game: IGame) => void;
    }
}