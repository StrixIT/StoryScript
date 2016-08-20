module QuestForTheKing.Items {
    export function Fireball(): StoryScript.IItem {
        return {
            name: 'Fireball Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}