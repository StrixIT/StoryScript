module StoryScript {
    export interface ICompiledEnemy {
        id: string;
        pictureFileName?: string;
        name: string;
        description?: string;
        hitpoints: number;
        currency?: number;
        inactive?: boolean;
        items?: ICollection<IItem>;
        combinations?: ICombinations<IItem | IFeature>;
        onDefeat?: (game: IGame) => void;
    }
}