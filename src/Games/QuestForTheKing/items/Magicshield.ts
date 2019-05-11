module QuestForTheKing.Items {
    export function Magicshield() {
        return BuildItem({
            name: 'Magic Shield Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            dayAvailable: 2,
            arcane: true,
            value: 15,
            itemClass: Class.Wizard
        });
    }
}