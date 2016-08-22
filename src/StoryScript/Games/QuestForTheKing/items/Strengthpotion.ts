module QuestForTheKing.Items {
    export function Strengthpotion(): StoryScript.IItem {
        return {
            name: 'Strength Potion',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        }
    }
}