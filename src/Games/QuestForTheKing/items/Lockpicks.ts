module QuestForTheKing.Items {
    export function Lockpicks() {
        return Item({
            name: 'Lockpicks',            
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You use the lockpicks',
            itemClass: Class.Rogue
        });
    }
}