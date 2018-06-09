﻿module QuestForTheKing.Items {
    export function Lockpicks(): IItem {
        return {
            name: 'Lockpicks',            
            description: StoryScript.Constants.HTML,
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You use the lockpicks',
            itemClass: Class.Rogue
        }
    }
}