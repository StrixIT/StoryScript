module QuestForTheKing.Locations {
    export function HealersTent(): StoryScript.ILocation {
        return {
            name: 'Healers Tent',
            destinations: [
                {
                    text: 'Day 2',
                    target: Locations.Day2
                },
                {

                    text: 'Weapon Smith',
                    target: Locations.WeaponSmith
                },
               
            ],
            trade: {
                title: 'Trade with Siri',
                description: 'Siri has several items for sale',
                buy: {
                    description: 'Buy from Siri',
                    emptyText: 'There is nothing for you to trade',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Sell to Siri',
                    emptyText: 'There is nothing for you to sell',
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