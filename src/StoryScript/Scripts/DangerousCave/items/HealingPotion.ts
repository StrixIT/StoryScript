module DangerousCave.Items {
    export function HealingPotion(): StoryScript.IItem {
        return {
            name: 'Toverdrank',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            use: Actions.Heal('1d8')
        }
    }
}