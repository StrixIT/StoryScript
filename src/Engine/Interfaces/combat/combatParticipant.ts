import {Sprite} from "storyScript";

export interface ICombatParticipant {
    type: string;
    name: string;
    hitpoints: number;
    currentHitpoints?: number;
    picture?: string;
    displayAnimation?: Sprite;
}