import { ICollection } from './collection';
import { IFeature } from './feature';

/**
 * A collection of features of a location.
 */
export interface IFeatureCollection extends ICollection<IFeature> {
    collectionPicture?: string;
}