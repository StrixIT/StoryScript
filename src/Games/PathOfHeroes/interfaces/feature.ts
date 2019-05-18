namespace PathOfHeroes {
    export function Feature<T extends IFeature>(entity: T): IFeature {
        return StoryScript.Feature(entity);
    }

    export interface IFeature extends StoryScript.IFeature {
        // Add game-specific item properties here
    }
}