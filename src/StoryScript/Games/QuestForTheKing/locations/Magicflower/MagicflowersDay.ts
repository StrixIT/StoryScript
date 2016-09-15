module QuestForTheKing.Locations {
    export function MagicflowersDay(): StoryScript.ILocation {
        return {
            name: 'The Magic Flowers',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],            
            enemies: [
                Enemies.Brownbear

            ],
            items: [
                Items.Magicflower,                
            ]
        }
    }
}
   
