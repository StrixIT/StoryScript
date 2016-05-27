module StoryScript.Items {
    export function HealingPotion(): Interfaces.IItem {
        return {
            name: 'Toverdrank',
            equipmentType: EquipmentType.Miscellaneous,
            use: Actions.Heal('1d8')
        }
    }
}