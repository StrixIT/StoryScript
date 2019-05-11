module QuestForTheKing.Items {
    export function Chainmail() {
        return Item({
            name: 'Chain Mail',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 2,
            arcane: false,
            value: 20,
            itemClass: Class.Warrior
        });
    }
}