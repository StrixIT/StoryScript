module QuestForTheKing.Locations {
    export function Oceanshrine(): StoryScript.ILocation {
        return {
            name: 'The Ocean Shrine',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                }        
            ],
            items: [
                // Todo: should this be inactive and only show for the wizard when touching the altar?
                Items.Magicring,            
            ],
            actions: [
                {
                    text: 'Touch the Altar',
                    execute: (game: IGame) => {
                        var key = game.worldProperties.isDay ? 'touchday' : 'touchnight';
                        game.currentLocation.text += game.currentLocation.descriptions[key];
                    }
                }
            ]
        }
    }
}    
