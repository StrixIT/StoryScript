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
                {

                    text: 'Fasold the Storyteller',
                    target: Locations.Fasold1
                },
               
            ],
            trade: {
                title: 'Trade with Siri',
                description: 'Siri has several items for sale',
                buy: {
                    description: 'Sell to Siri',
                    emptyText: 'There is nothing for you to trade',
                    itemSelector: (game: IGame, item: IItem) => {
                        return item.arcane;
                    },
                    maxItems: 5,
                    priceModifier: 0
                },
                sell: {
                    description: 'Buy from Siri',
                    emptyText: 'Siri has nothing to trade',
                    itemSelector: (game: IGame, item: IItem) => {
                        return game.currentDay == item.dayAvailable && item.arcane;
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