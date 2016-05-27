module StoryScript.Interfaces {
    export interface IEnemy {
        id?: string;
        name: string;
        hitpoints: number;
        items?: [() => IItem];
        reward: number;
        onDefeat?: (game: Game) => void;
        attack: any;
    }
}