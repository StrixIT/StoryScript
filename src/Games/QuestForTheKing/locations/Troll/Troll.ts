module QuestForTheKing.Locations {
    export function Troll(): StoryScript.ILocation {
        return {
            name: 'The Troll',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                }
            ],
            enemies: [
                Enemies.Troll             
            ],
            actions: [
                {
                    text: 'Open the cage',
                    execute: (game: IGame) => {
                        game.currentLocation.text += game.currentLocation.descriptions['opencage'];
                        game.worldProperties.freedFaeries = true;
                    }
                }
            ]
        }
    }
}    
