namespace DangerousCave.Items {
    export function HealingPotion() {
        return Item({
            name: 'Toverdrank',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            use: Actions.Heal('1d8'),
            useInCombat: true
        });
    }
}