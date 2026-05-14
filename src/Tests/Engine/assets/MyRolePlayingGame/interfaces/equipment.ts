import {IEquipment as StoryScriptIEquipment} from 'storyScript/Interfaces/storyScript';

export interface IEquipment extends Omit<
    StoryScriptIEquipment,
    'amulet'
    | 'hands'
    | 'leftRing'
    | 'rightRing'
    | 'Legs'
> {
    // Add game-specific equipment slots here
}