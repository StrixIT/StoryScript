module QuestForTheKing.Items {
    export function DetectMagic(): IItem {
        return {
            name: 'Detect Magic',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Hands,
            dayAvailable: 1,
            arcane: true,
            value: 7
        }
    }
}