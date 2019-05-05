namespace DangerousCave.Items {
    export function IronHelmet() {
        return BuildItem({
            name: 'Helm van ijzer',
            defense: 2,
            equipmentType: StoryScript.EquipmentType.Head
        });
    }
}