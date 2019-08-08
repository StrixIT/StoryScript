module QuestForTheKing.Items {
    export function Wizardcloak() {
        return Item({
            name: 'Wizard Cloak',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 2,
            arcane: true,
            value: 15,
            itemClass: Class.Wizard
        });
    }
}