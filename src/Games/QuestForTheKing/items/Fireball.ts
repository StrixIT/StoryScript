module QuestForTheKing.Items {
    export function Fireball() {
        return BuildItem({
            name: 'Fireball Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You cast your fireball',
            itemClass: Class.Wizard,
            arcane: true
        });
    }
}