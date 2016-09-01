﻿module QuestForTheKing.Items {
    export function Paralysis(): IItem {
        return {
            name: 'Paralysis',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Hands,
            dayAvailable: 3,
            arcane: true
        }
    }
}