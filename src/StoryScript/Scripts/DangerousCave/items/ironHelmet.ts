module DangerousCave.Items {
    export function IronHelmet(): StoryScript.IItem {
        return {
            name: 'Helm van ijzer',
            defense: 2,
            equipmentType: StoryScript.EquipmentType.Head
        }
    }
}