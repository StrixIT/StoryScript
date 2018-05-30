module QuestForTheKing.Items {
    export function Frostbite(): IItem {
        return {
            name: 'Frostbite Spell',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You cast your frostbite',
            itemClass: Class.Wizard 
        }
    }
}