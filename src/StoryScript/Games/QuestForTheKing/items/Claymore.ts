module QuestForTheKing.Items {
    export function Claymore(): IItem {
        return {
            name: 'Claymore',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Hands,
            dayAvailable: 3,
            arcane: false,
            value: 30,
            attackText: 'You swing your claymore'
        }
    }
}