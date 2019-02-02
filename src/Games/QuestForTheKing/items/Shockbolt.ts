module QuestForTheKing.Items {
    export function Shockbolt(): IItem {
        return {
            name: 'Shockbolt',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            dayAvailable: 2,
            arcane: true,
            value: 15,
            attackText: 'You cast your shockbolt',
            itemClass: Class.Wizard
        }
    }
}