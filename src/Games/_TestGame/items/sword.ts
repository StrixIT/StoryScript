namespace _TestGame.Items {
    export function Sword() {
        return Item({
            name: 'Sword',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand,
            value: 5
        });
    }
}