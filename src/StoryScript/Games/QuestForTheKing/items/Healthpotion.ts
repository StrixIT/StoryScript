module QuestForTheKing.Items {
    export function Healthpotion(): IItem {
        return {
            name: 'Health Potion',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            dayAvailable: 1,
            arcane: true
        }
    }
}