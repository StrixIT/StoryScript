import { IMapLocation } from "./mapLocation";

export interface IMap {
    name: string;
    mapImage: string;
    locations: IMapLocation[];
    avatarImage?: string;
    locationNamesAsTextLabels: boolean;
    locationMarkerImage?: string;
    transitionTime?: number;
    clickable?: boolean;
}