module QuestForTheKing.Items {
    export function Weaponupgrade(): StoryScript.IItem {
        return {
            name: 'Weapon Upgrade',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        }
    }
}