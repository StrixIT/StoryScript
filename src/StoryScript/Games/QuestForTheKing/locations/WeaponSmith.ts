module QuestForTheKing.Locations {
    export function WeaponSmith(): StoryScript.ILocation {
        return {
            name: 'Weapon Smith',
            destinations: [
                {
                    text: 'Day 2',
                    target: Locations.Day2
                },              
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent
                },
            ],
            trade: {
                title: 'Trade with Bjarni',
                description: 'Bjarni has several items for sale',
                buy: {
                    description: 'Buy from Bjarni',
                    emptyText: 'There is nothing for you to trade',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Sell to Bjarni',
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