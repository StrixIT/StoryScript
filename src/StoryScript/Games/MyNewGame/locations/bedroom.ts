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
                title: 'Your personal closet',
                description: 'Do you want to take something out of your closet or put it back in?',
                buy: {
                    description: 'Put back in closet',
                    emptyText: 'You have nothing to put in the your closet',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Take out of closet',
                    emptyText: 'The closet is empty',
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