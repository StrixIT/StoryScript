module MyNewGame.Items {
    export function BasementKey(): StoryScript.IKey {
        return {
            name: 'Basement key',
            open: {
                text: '',
                action: () => {
                }
            },
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        }
    }
}