module QuestForTheKing.Locations {
    export function Octopus() {
        return Location({
            name: 'The Giant Octopus',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],
            enemies: [
                Enemies.Octopus()                 
            ],
            actions: [
                {
                    text: 'Attack the Shadow',
                    status: StoryScript.ActionStatus.Available,
                    actionType: StoryScript.ActionType.Check,
                    execute: (game: IGame) => {
                        game.logToLocationLog(game.currentLocation.descriptions['attacknight']);
                        game.currentLocation.enemies.map(e => e.inactive = false);
                    }
                },
                {
                    text: 'Leave the Shadow alone',
                    status: StoryScript.ActionStatus.Available,
                    actionType: StoryScript.ActionType.Check,
                    execute: (game: IGame) => {
                        // Remove the octopus and the attack action when chosing to sail past.
                        game.currentLocation.enemies.length = 0;
                        game.currentLocation.actions.length = 0;
                        game.logToLocationLog(game.currentLocation.descriptions['floatby']);
                    }
                }
            ]           
        });
    }
}    
