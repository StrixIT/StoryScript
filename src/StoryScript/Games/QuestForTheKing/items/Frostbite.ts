module QuestForTheKing.Items {
    export function Frostbite(): IItem {
        return {
            name: 'Frostbite Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You cast your frostbite',
            class: Class.Wizard 
        }
    }
}