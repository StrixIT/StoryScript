module StoryScript {
    export interface IEnemy {
        id?: string;
        pictureFileName?: string;
        name: string;
        hitpoints: number;
        items?: [IItem | (() => IItem)];
        onDefeat?: (game: IGame) => void;
    }
}