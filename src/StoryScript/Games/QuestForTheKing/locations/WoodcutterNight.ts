module QuestForTheKing.Locations {
    export function WoodcutterNight(): StoryScript.ILocation {
        return {
            name: 'The Woodcutters Cottage',
            destinations: [
                {
                    text: 'Read the Parchment',
                    target: Locations.ReadParchment
                },
                {

                    text: 'Back to the Map',
                    target: Locations.Quest1map1                       
                }
            ],
            enemies: [
                Enemies.Ghost

            ]
        }
    }
}    
