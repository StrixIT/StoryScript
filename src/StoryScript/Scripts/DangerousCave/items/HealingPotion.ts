module StoryScript.Items {
    export function HealingPotion(): IItem {
        return {
            name: 'Toverdrank',
            equipmentType: EquipmentType.Miscellaneous,
            use: Actions.Heal('1d8')
        }
    }
}