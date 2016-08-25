module QuestForTheKing.Items {
    export function Battleaxe(): IItem {
        return {
            name: 'Battle Axe',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}