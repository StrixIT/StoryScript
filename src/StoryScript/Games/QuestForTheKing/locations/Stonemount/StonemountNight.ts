module QuestForTheKing.Locations {
    export function StonemountNight(): StoryScript.ILocation {
        return {
            name: 'The Stone Mount',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                },  
                {
                    text: 'Search the stone mount',
                    target: Locations.Searchmount
                }                   
            ],
                enemies: [
                    Enemies.Ghost                
                    
                ]
        }
    }
}    
