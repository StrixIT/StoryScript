module StoryScript.Items {
    export function LeatherHelmet(): Interfaces.IItem {
        return {
            name: 'Helm van leer',
            defense: 1,
            equipmentType: EquipmentType.Head
        }
    }
}