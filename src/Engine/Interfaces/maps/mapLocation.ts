import { ILocation } from "../location";

export interface IMapLocation {
    /**
     * The pointer to the location. This will be replaced with the location id during runtime.
     */
    location: (() => ILocation) | string;

    /**
     * The coordinates of this location on the map. use the format '{left},{top}'.
     */
    coords?: string;

    /**
     * The specific image to show for this location, if any.
     */
    markerImage?: string;

    /**
     * The specific text to show on this location label, if any.
     */
    textLabel?: string
}