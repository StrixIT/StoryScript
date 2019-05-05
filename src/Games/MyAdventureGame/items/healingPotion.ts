namespace MyAdventureGame.Items {
    export function HealingPotion() {
        return BuildItem({
            name: 'Healing potion',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        });
    }
}