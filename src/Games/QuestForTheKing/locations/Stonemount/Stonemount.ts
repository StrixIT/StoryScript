module QuestForTheKing.Locations {
    export function Stonemount(): StoryScript.ILocation {
        return {
            name: 'The Stone Mount',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                },             
            ],
            enemies: [
                Enemies.Wolf,
                Enemies.Wolf
            ],
            actions: [
                {
                    text: 'Search the stone mount',
                    execute: (game: IGame) => {
                        game.character.currency += 35;
                        game.currentLocation.text += game.currentLocation.descriptions['search'];
                    }
                }
            ]
        }
    }
}    
