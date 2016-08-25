module QuestForTheKing.Locations {
    export function HealersTent3(): StoryScript.ILocation {
        return {
            name: 'Healers Tent',
            destinations: [
                {
                    text: 'Day 4',
                    target: Locations.Day4
                },
                {

                    text: 'Weapon Smith',
                    target: Locations.WeaponSmith3
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