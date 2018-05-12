﻿module QuestForTheKing.Items {
    export function LongSword(): IItem {
        return {
            name: 'Long Sword',
            description: StoryScript.Constants.HTML,
            damage: '1D6',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You swing your longsword',
            itemClass: Class.Warrior
        }
    }
}