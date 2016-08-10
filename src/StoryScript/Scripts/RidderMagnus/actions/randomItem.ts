module RidderMagnus.Actions {
    export function RandomItem(game: IGame) {
        var items = game.definitions.items;
        var itemCount = 0;
        var randomItem = null;

        for (var n in items) {
            itemCount++;
        }

        var itemToGet = game.rollDice('1d' + itemCount) - 1;
        var index = 0;

        for (var n in items) {
            if (index == itemToGet) {
                randomItem = items[n]();
                break;
            }
            index++;
        }

        
        game.currentLocation.items.push(randomItem);

    }
}