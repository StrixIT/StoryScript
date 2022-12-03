import { IEquipment as StoryScriptIEquipment } from 'storyScript/Interfaces/storyScript';
import { IItem } from '../types';

export interface IEquipment extends StoryScriptIEquipment {
    spell?: IItem;
}