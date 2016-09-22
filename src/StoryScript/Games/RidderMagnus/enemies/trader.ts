module RidderMagnus.Enemies {
    export function Trader(): IPerson {
        return {
            name: 'Trader',
            hitpoints: 7,
            attack: '1d6',
            reward: 1,
            currency: 10,
            trade: {
                buy: {
                    itemSelector: (game: IGame, item: IItem) => {
                        return item.damage != undefined && item.value <= 10;
                    },
                    maxItems: 3
                },
                sell: {
                    itemSelector: (game: IGame, item: IItem) => {
                        return item.damage != undefined;
                    },
                    maxItems: 5
                }
            }
        }
    }
}