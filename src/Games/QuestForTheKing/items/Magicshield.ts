module QuestForTheKing.Items {
    export function Magicshield(): IItem {
        return {
            name: 'Magic Shield Spell',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            dayAvailable: 2,
            arcane: true,
            value: 15,
            itemClass: Class.Wizard
        }
    }
}