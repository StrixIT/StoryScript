import { IFeature as StoryScriptIFeature, Feature as StoryScriptFeature } from 'storyScript/Interfaces/storyScript';

export function Feature(entity: IFeature): IFeature {
    return StoryScriptFeature(entity);
}

export interface IFeature extends StoryScriptIFeature {
    // Add game-specific item properties here
}