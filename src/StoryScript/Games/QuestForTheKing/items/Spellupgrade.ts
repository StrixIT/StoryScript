module QuestForTheKing.Items {
    export function Spellupgrade(): IItem {
        return {
            name: 'Spell Upgrade',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            dayAvailable: 2,
            arcane: true,
            value: 15,
            class: Class.Wizard
        }
    }
}