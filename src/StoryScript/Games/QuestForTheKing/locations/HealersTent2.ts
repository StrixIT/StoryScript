module QuestForTheKing.Locations {
    export function HealersTent2(): StoryScript.ILocation {
        return {
            name: 'Healers Tent',
            destinations: [
                {
                    text: 'Night in your Tent',
                    target: Locations.NightInYourTent
                },
                {

                    text: 'Weapon Smith',
                    target: Locations.WeaponSmith2
                },               
            ],
            trade: {
                title: 'Trade with Siri',
                description: 'Siri has several items for sale',
                buy: {
                    description: 'Sell to Siri',
                    emptyText: 'There is nothing for you to trade',
                    itemSelector: (game: IGame, item: IItem) => {
                        return true;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Buy from Siri',
                    emptyText: 'Siri has nothing to trade',
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