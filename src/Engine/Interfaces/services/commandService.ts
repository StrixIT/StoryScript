import {ILocation} from "storyScript/Interfaces/location.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";

export interface ICommandService {
    go: (location: (() => ILocation) | string, travel?: boolean) => void;
    
    talk: (person: () => IPerson) => void;
    
    answer: (node: string, reply?: string) => void;
    
    selectCombination: (combination: string) => void;

    setTool: (feature: (() => IFeature) | string) => void;

    combine: (combination: string, target: (() => IFeature) | string, tool?: (() => IFeature) | string) => void;
}