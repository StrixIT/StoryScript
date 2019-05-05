namespace DangerousCave.Items {
    export function LeatherHelmet() {
        return BuildItem({
            name: 'Helm van leer',
            defense: 1,
            equipmentType: StoryScript.EquipmentType.Head
        });
    }
}