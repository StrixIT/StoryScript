﻿module QuestForTheKing.Items {
    export function Beesting(): IItem {
        return {
            name: 'Beesting',
            description: StoryScript.Constants.HTML,
            damage: '1D10',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 20,       
            itemClass: Class.Warrior     
        }
    }
}