module DangerousCave.Items {
    export function HealingPotion(): IItem {
        return {
            name: 'Toverdrank',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            use: Actions.Heal('1d8'),
            useInCombat: true
        }
    }
}