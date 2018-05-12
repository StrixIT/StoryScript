module QuestForTheKing.Locations {
    export function Touchingaltar(): StoryScript.ILocation {
        return {
            name: 'The Ocean Shrine',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                }
            ],
            items: [
                Items.Magicring,            
            ]
        }
    }
}