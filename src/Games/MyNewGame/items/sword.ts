namespace MyNewGame.Items {
    export function Sword() {
        return BuildItem({
            name: 'Sword',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand,
            value: 5
        });
    }
}