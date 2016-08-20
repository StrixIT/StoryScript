module QuestForTheKing.Items {
    export function Battleaxe(): StoryScript.IItem {
        return {
            name: 'Battle Axe',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}