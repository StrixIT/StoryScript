module QuestForTheKing.Items {
    export function Platemail() {
        return Item({
            name: 'Platemail',
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 1,
            arcane: false,
            value: 45,
            itemClass: [Class.Warrior]
        });
    }
}