namespace MyAdventureGame.Items {
    export function HealingPotion() {
        return Item({
            name: 'Healing potion',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        });
    }
}