namespace TheMiner {
    export function Feature(entity: IFeature): IFeature {
        return StoryScript.Feature(entity);
    }

    export interface IFeature extends StoryScript.IFeature {
        // Add game-specific item properties here
    }
}