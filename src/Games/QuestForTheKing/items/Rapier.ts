module QuestForTheKing.Items {
    export function Rapier() {
        return BuildItem({
            name: 'Rapier',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You thrust your rapier',
            itemClass: Class.Rogue
        });
    }
}