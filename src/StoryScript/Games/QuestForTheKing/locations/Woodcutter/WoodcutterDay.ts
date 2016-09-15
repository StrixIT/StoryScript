module QuestForTheKing.Locations {
    export function WoodcutterDay(): StoryScript.ILocation {
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
            items: [
                Items.Parchment,
                Items.Bow,                   
            ]
        }
    }
}