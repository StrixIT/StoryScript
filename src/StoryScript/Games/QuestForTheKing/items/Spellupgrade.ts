module QuestForTheKing.Items {
    export function Spellupgrade(): StoryScript.IItem {
        return {
            name: 'Spell Upgrade',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        }
    }
}