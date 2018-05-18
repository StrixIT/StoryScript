module QuestForTheKing.Items {
    export function Leatherarmor(): IItem {
        return {
            name: 'Leather Armor',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 1,
            arcane: false,
            value: 10,
            itemClass: [Class.Rogue, Class.Warrior]
        }
    }
}