module StoryScript {
    export interface IEnemy {
        id?: string;
        name: string;
        hitpoints: number;
        items?: [() => IItem];
        reward: number;
        onDefeat?: (game: IGame) => void;
        attack: any;
    }
}