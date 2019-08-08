module QuestForTheKing.Items {
    export function Strengthpotion() {
        return Item({
            name: 'Strength Potion',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            dayAvailable: 2,
            arcane: true,
            value: 5
        });
    }
}