import {ICombinable} from './combinations/combinable';
import {Sprite} from "./sprite.ts";

/**
 * A feature of a location, which can be anything the player can interact with using combinations.
 */
export interface IFeature extends ICombinable {
    /**
     * The description of the feature. Used when features are added to locations
     * at run-time.
     */
    description?: string;

    /**
     * The coordinates of this feature when using image maps for visual features.
     */
    coords?: string;

    /**
     * The shape of this feature when using image maps for visual features.
     */
    shape?: string;

    /**
     * The file path for the picture to show. When using image maps for visual features, the picture will
     * be shown on top of the image map for this feature. The path should be relative to the resources folder.
     * Use either a picture OR an animation.
     */
    picture?: string;

    /**
     * The animation settings for this feature. When using image maps for visual features, the animation will
     * be shown on top of the image map for this feature. Use either a picture OR an animation.
     */
    animation?: Sprite;
}