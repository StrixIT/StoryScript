import { IMapLocation } from "./mapLocation";

export interface IMap {
    /**
     * The name of this map.
     */
    name: string;

    /**
     * The image to use for this map.
     */
    mapImage: string;

    /**
     * The locations that are part of this map.
     */
    locations: IMapLocation[];

    /**
     * The image to use for the player location on the map, if any.
     */
    avatarImage?: string;

    /**
     * True if text markers with the location names should be shown on the map, false otherwise.
     */
    locationNamesAsTextMarkers: boolean;

    /**
     * The default image to use as a marker for locations on the map.
     */
    locationMarkerImage?: string;

    /**
     * The time it takes for transitions on the map to complete. This is used to display elements like the avatar
     * only after all transitions are finished. Defaults to 1000 ms.
     */
    transitionTime?: number;

    /**
     * True if location markers on the map can be clicked to navigate to that location, falsy otherwise.
     */
    clickable?: boolean;

    /**
     * The JavaScript KeyboardEvent.key value to listen for before showing the location markers. If not set, the markers
     * will be shown all the time. If set, they will show only when the specified key is pressed.
     */
    showMarkersOnKeyPress?: string;

    /**
     * True if you want to show a toggle behind the map name to show the map full screen in a dialog, falsy otherwise.
     */
    toggleFullScreen?: boolean;
}