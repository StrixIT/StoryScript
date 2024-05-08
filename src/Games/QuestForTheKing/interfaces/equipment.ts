import { IEquipment as StoryScriptIEquipment } from 'storyScript/Interfaces/storyScript';
import { IItem } from './item';

export interface IEquipment extends StoryScriptIEquipment {
    // Add game-specific equipment slots here
    bow?: IItem;
}