import {IEquipment as StoryScriptIEquipment} from 'storyScript/Interfaces/storyScript';
import {IItem} from '../types';

export interface IEquipment extends StoryScriptIEquipment {
    head?: IItem;
    amulet?: IItem;
    body?: IItem;
    hands?: IItem;
    leftHand?: IItem;
    leftRing?: IItem;
    rightHand?: IItem;
    rightRing?: IItem;
    legs?: IItem;
    feet?: IItem;
    spell?: IItem;
}