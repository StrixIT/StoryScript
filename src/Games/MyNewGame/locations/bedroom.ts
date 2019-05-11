namespace MyNewGame.Locations {
    export function Bedroom() {
        return Location({
            name: 'Bedroom',
            destinations: [
                {
                    name: 'Back to the living room',
                    target: Locations.Start
                }
            ],
            trade: {
                title: 'Your personal closet',
                description: 'Do you want to take something out of your closet or put it back in?',
                buy: {
                    description: 'Take out of closet',
                    emptyText: 'The closet is empty',
                    itemSelector: (game: IGame, item: IItem) => {
                        return item.value != undefined;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Put back in closet',
                    emptyText: 'You have nothing to put in the your closet',
                    itemSelector: (game: IGame, item: IItem) => {
                        return item.value != undefined;
                    },
                    maxItems: 5,
                    priceModifier: (game: IGame) => {
                        return 0;
                    }
                }
            }
        });
    }
}