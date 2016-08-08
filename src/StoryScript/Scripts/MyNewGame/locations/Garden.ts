module MyNewGame.Locations {
    export function Garden(): StoryScript.ILocation {
        return {
            name: 'Garden',
            destinations: [
                {
                    text: 'Enter your home',
                    target: Locations.Start,
                }
            ],
            events: [
                (game: IGame) => {
                    game.logToActionLog('You see a squirrel running off.');
                }
            ]
        }
    }
}