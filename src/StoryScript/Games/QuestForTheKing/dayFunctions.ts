module QuestForTheKing {
    export function changeDay(game: IGame) {
        game.currentDay = game.currentDay || 0;
        game.currentDay++;
        updateDestination(game, game.locations.get(Locations.WeaponSmith), game.currentDay);
        updateDestination(game, game.locations.get(Locations.HealersTent), game.currentDay);
    }

    function updateDestination(game: IGame, location: ICompiledLocation, day: number) {
        var dayLocation = <any>Locations['Day' + day];

        var dayDestination = location.destinations.filter(d => d.target == dayLocation.name)[0];

        if (dayDestination) {
            location.destinations.remove(dayDestination);
        }

        location.destinations.push({
            text: game.locations.get(dayLocation).name,
            target: dayLocation
        });
    }
}