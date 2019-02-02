module QuestForTheKing.Items {
    export function Shortsword(): IItem {
        return {
            name: 'Shortsword',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            arcane: false,
            value: 15,
            attackText: 'You swing your shortsword',
            itemClass: [ Class.Rogue, Class.Warrior ]
        }
    }
}