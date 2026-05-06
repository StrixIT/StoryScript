import { IItem, IEquipment as StoryScriptIEquipment } from 'storyScript/Interfaces/storyScript';

export interface IEquipment extends StoryScriptIEquipment {
    // Add game-specific equipment slots here
}

export interface IEquipment extends Omit<
    StoryScriptIEquipment,
    'head' | 'hands' | 'body' | 'feet'
> {
    // Add game-specific equipment slots here
}