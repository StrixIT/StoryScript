module QuestForTheKing.Locations {
    export function WoodcutterDay(): StoryScript.ILocation {
        return {
            name: 'The Woodcutters Cottage',
            destinations: [
                {
                    name: 'Read the Parchment',
                    target: Locations.ReadParchment
                },
                {

                    name: 'Back to the Map',
                    target: Locations.Quest1map1                       
                }
            ],
            enemies: [
                Enemies.Ghost

            ],
            items: [
                Items.Parchment,
                Items.Bow,
            ]
        }
    }
}
