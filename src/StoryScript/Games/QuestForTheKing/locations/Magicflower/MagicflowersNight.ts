module QuestForTheKing.Locations {
    export function MagicflowersNight(): StoryScript.ILocation {
        return {
            name: 'The Magic Flowers',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],  
            items: [
                Items.Magicflower,
            ]
        }
    }
}
