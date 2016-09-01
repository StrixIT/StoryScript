module QuestForTheKing.Items {
    export function Fireball(): IItem {
        return {
            name: 'Fireball Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5
        }
    }
}