import { IFeature as StoryScriptIFeature } from 'storyScript/Interfaces/feature';
import { Feature as StoryScriptFeature } from 'storyScript/ObjectConstructors';

export function Feature(entity: IFeature): IFeature {
    return StoryScriptFeature(entity);
}

export interface IFeature extends StoryScriptIFeature {
    // Add game-specific item properties here
    linkToLocation?: string;
}