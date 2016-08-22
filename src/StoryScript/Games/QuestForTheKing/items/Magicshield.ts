module QuestForTheKing.Items {
    export function Magicshield(): StoryScript.IItem {
        return {
            name: 'Magic Shield Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}