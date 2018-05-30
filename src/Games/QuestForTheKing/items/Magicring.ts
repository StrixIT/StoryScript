module QuestForTheKing.Items {
    export function Magicring(): IItem {
        return {
            name: 'Magic Ring',
            description: StoryScript.Constants.HTML,
            damage: '0',
            equipmentType: StoryScript.EquipmentType.LeftRing,
            value: 5,            
            itemClass: Class.Wizard
        }
    }
}