module QuestForTheKing.Locations {
    export function WeaponSmith2(): StoryScript.ILocation {
        return {
            name: 'Weapon Smith',
            destinations: [
                {
                    text: 'Night in your Tent',
                    target: Locations.NightInYourTent
                },               
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent2
                },
            ],
            trade: {
                title: 'Trade Bjarni',
                description: 'Bjarni has several items for sale',
                buy: {
                    description: 'Sell to Bjarni',
                    emptyText: 'There is nothing for you to trade',
                    itemSelector: (game: IGame, item: IItem) => {
                        return true;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Buy from Bjarni',
                    emptyText: 'Bjarni has nothing to trade',
                    itemSelector: (game: IGame, item: IItem) => {
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