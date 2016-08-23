module QuestForTheKing.Locations {
    export function WeaponSmith3(): StoryScript.ILocation {
        return {
            name: 'Weapon Smith',
            destinations: [
                {
                    text: 'Day 4',
                    target: Locations.Day4
                },              
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent3
                },
            ],
            trade: {
                title: 'Trade Bjarni',
                description: 'Bjarni has several items for sale',
                buy: {
                    description: 'Sell to Bjarni',
                    emptyText: 'There is nothing for you to trade',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Buy from Bjarni',
                    emptyText: 'Bjarni has nothing to trade',
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