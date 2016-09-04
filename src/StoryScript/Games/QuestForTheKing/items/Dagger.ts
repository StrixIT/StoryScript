module QuestForTheKing.Items {
    export function Dagger(): IItem {
        return {
            name: 'Dagger',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,           
            value: 5           
        }
    }
}