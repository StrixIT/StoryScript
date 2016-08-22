module QuestForTheKing.Items {
    export function Healthpotion(): StoryScript.IItem {
        return {
            name: 'Health Potion',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        }
    }
}