import {ILocation} from "storyScript/Interfaces/location.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";

export interface ICommandService {
    go: (location: (() => ILocation) | string, travel?: boolean) => void;
    talk: (person: () => IPerson) => void;
    answer: (node: string, reply?: string) => void;
}