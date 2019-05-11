module QuestForTheKing.Items {
    export function Paralysis() {
        return Item({
            name: 'Paralysis',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Hands,
            dayAvailable: 3,
            arcane: true,
            value: 30,
            attackText: 'You cast your Paralysis spell',
            itemClass: Class.Wizard
        });
    }
}