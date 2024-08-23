import { IFeature } from './feature';

/**
 * A collection of features of a location.
 */
export interface IFeatureCollection extends Array<IFeature> {
    collectionPicture?: string;
}