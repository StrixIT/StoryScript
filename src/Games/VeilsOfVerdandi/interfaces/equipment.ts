import { IEquipment as StoryScriptIEquipment } from 'storyScript/Interfaces/storyScript';
import { IItem } from './item';

export interface IEquipment extends Omit<
   StoryScriptIEquipment,
   | 'head'
| 'hands'
| 'leftHand'
| 'rightHand'
| 'leftRing'
| 'legs'
| 'feet'
> {
    // Add game-specific equipment slots here
    primaryWeapon?: IItem,
    secondaryWeapon?: IItem
    bow?: IItem;
}