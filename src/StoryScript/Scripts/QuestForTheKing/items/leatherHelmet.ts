module QuestForTheKing.Items {
    export function LeatherHelmet(): StoryScript.IItem {
        return {
            name: 'Helm van leer',
            defense: 1,
            equipmentType: StoryScript.EquipmentType.Head
        }
    }
}