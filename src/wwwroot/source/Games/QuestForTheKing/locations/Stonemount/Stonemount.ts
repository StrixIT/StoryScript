module QuestForTheKing.Locations {
    export function Stonemount(): StoryScript.ILocation {
        return {
            name: 'The Stone Mount',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                },  
                {
                    name: 'Search the stone mount',
                    target: Locations.Searchmount
                }                   
            ],
                enemies: [
                    Enemies.Wolf,
                    Enemies.Wolf
                ]
        }
    }
}    
