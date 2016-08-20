module QuestForTheKing.Items {
    export function Shortsword(): StoryScript.IItem {
        return {
            name: 'Shortsword',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}