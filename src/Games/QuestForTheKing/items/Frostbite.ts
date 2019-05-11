module QuestForTheKing.Items {
    export function Frostbite() {
        return BuildItem({
            name: 'Frostbite Spell',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You cast your frostbite',
            itemClass: Class.Wizard 
        });
    }
}