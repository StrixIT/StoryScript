module QuestForTheKing.Items {
    export function Magicflower(): IItem {
        return {
            name: 'Magic Flower',
            description: StoryScript.Constants.HTML,
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 0
        }
    }
}