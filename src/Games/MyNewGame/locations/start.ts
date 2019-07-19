namespace MyNewGame.Locations {
    export function Start() {
        return Location({
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
                    name: 'To the bedroom',
                    target: Locations.Bedroom
                },
                {
                    name: 'To the garden',
                    target: Locations.Garden
                },
                {
                    name: 'Out the front door',
                    target: Locations.DirtRoad
                }
            ],
            persons: [
                Persons.Friend()
            ]
        });
    }
}