namespace StoryScript {
    export interface IFeature {
        name: string;
        combinations: ICombinations<() => IItem | IFeature>;
    }
}