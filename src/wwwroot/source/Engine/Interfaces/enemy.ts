namespace StoryScript {
    export interface IEnemy {
        pictureFileName?: string;
        name: string;
        description?: string;
        hitpoints: number;
        currency?: number;
        inactive?: boolean;
        items?: ICollection<() => IItem>;
        combinations?: ICombinations<() => IItem | IFeature>;
        onAttack?: (game: IGame) => void;
        onDefeat?: (game: IGame) => void;
    }
}