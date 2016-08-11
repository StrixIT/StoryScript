module RidderMagnus.Enemies {
    export function Trader(): IEnemy {
        return {
            name: 'Trader',
            hitpoints: 7,
            attack: '1d6',
            reward: 1,
            trade: {
                buy: {
                    itemSelector: (item: IItem) => {
                        return item.damage != undefined;
                    },
                    maxItems: 3
                },
                sell: {
                    itemSelector: (item: IItem) => {
                        return item.damage != undefined && item.price <= 10;
                    },
                    maxItems: 5
                }
            }
        }
    }
}