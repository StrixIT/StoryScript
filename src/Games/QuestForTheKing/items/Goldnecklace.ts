module QuestForTheKing.Items {
    export function Goldnecklace(): IItem {
        return {
            name: 'Necklace',
            description: StoryScript.Constants.HTML,
            damage: '1',
            equipmentType: StoryScript.EquipmentType.Amulet,
            arcane: true,
            value: 5,
            activeNight: true           
        }
    }
}