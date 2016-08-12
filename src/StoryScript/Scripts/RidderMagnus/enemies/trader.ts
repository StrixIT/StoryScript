module RidderMagnus.Enemies {
    export function Trader(): IPerson {
        return {
            name: 'Trader',
            hitpoints: 7,
            attack: '1d6',
            reward: 1,
            disposition: StoryScript.Disposition.Neutral,
            currency: 10,
            trade: {
                buy: {
                    itemSelector: (item: IItem) => {
                        return item.damage != undefined;
                    },
                    maxItems: 3
                },
                sell: {
                    itemSelector: (item: IItem) => {
                        return item.damage != undefined && item.value <= 10;
                    },
                    maxItems: 5
                }
            }
        }
    }
}