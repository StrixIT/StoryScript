module QuestForTheKing.Items {
    export function Weaponupgrade(): IItem {
        return {
            name: 'Weapon Upgrade',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            dayAvailable: 2,
            arcane: false,
            value: 15
        }
    }
}