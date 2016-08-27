module QuestForTheKing.Items {
    export function Magicshield(): IItem {
        return {
            name: 'Magic Shield Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            dayAvailable: 2,
            arcane: true
        }
    }
}