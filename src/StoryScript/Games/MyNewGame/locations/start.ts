module MyNewGame.Locations {
    export function Start(): ILocation {
        return {
            name: 'Home',
            descriptionSelector: (game: IGame) => {
                var date = new Date();
                var hour = date.getHours();

                if (hour <= 6 || hour >= 18) {
                    return 'night';
                }

                return 'day';
            },
            destinations: [
                {
                    text: 'To the bedroom',
                    target: Locations.Bedroom
                },
                {
                    text: 'To the garden',
                    target: Locations.Garden
                },
                {
                    text: 'Out the front door',
                    target: Locations.DirtRoad
                }
            ],
            persons: [
                Persons.Friend
            ]
        }
    }
}