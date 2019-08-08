module QuestForTheKing.Locations {
    export function HealersTent() {
        return Location({
            name: 'Healers Tent',
            descriptionSelector: (game: IGame) => {
                return 'day' + game.worldProperties.currentDay;
            },
            destinations: [
                {

                    name: 'Weapon Smith',
                    target: Locations.WeaponSmith
                }
            ],
            trade: {
                title: 'Trade with Siri',
                description: 'Siri has several items for sale',
                currency: 10,
                initCollection: (game: IGame, trade: ITrade) => {
                    var reset = false;
                    trade.currentDay = trade.currentDay || 0;

                    if (game.worldProperties.currentDay != trade.currentDay) {
                        trade.currentDay = game.worldProperties.currentDay;
                        reset = true;
                    }

                    return reset;
                },
                buy: {
                    description: 'Buy from Siri',
                    emptyText: 'Siri has nothing to trade',
                    itemSelector: (game: IGame, item: IItem) => {
                        return game.worldProperties.currentDay == item.dayAvailable && item.arcane && (item.itemClass == game.character.class || (Array.isArray(item.itemClass) && (<Class[]>item.itemClass).indexOf(game.character.class) > -1));
                    },
                    maxItems: 5
                },
                sell: {
                    description: 'Sell to Siri',
                    emptyText: 'There is nothing for you to trade',
                    itemSelector: (game: IGame, item: IItem) => {
                        return item.arcane;
                    },
                    maxItems: 5
                }
            }
        });
    }
}