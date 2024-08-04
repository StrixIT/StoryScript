import {Feature as StoryScriptFeature, IFeature as StoryScriptIFeature} from 'storyScript/Interfaces/storyScript';

export function Feature(entity: IFeature): IFeature {
    return StoryScriptFeature(entity);
}

export interface IFeature extends StoryScriptIFeature {
    // Add game-specific item properties here
}