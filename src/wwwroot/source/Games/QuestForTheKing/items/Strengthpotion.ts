module QuestForTheKing.Items {
    export function Strengthpotion(): IItem {
        return {
            name: 'Strength Potion',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            dayAvailable: 2,
            arcane: true,
            value: 5
        }
    }
}