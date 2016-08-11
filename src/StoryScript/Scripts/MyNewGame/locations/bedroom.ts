module MyNewGame.Locations {
    export function Bedroom(): StoryScript.ILocation {
        return {
            name: 'Bedroom',
            destinations: [
                {
                    text: 'Back to the living room',
                    target: Locations.Start
                }
            ],
            trade: {
                description: 'Do you want to take something out of your closet or put it back in?',
                currency: 10,
                buy: {
                    description: 'Put back in closet',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 1,
                    priceModifier: 0
                },
                sell: {
                    description: 'Take out of closet',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 5,
                    priceModifier: (game: IGame) => {
                        return 0;
                    }
                }
            }
        }
    }
}