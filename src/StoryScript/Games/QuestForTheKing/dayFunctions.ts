module QuestForTheKing {
    export function changeDay(game: IGame) {
        game.currentDay = game.currentDay || 0;
        game.currentDay++;
        updateDestination(game, game.locations.get(Locations.WeaponSmith), game.currentDay);
        updateDestination(game, game.locations.get(Locations.HealersTent), game.currentDay);
    }

    function updateDestination(game: IGame, location: ICompiledLocation, day: number) {
        var dayLocation = <any>Locations['Day' + day];
        location.destinations = [];;

        location.destinations.push({
            text: game.locations.get(dayLocation).name,
            target: dayLocation
        });
    }
}