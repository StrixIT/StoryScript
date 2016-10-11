module QuestForTheKing {
    export function changeDay(game: IGame) {
        game.worldProperties.currentDay = game.worldProperties.currentDay || 0;
        game.worldProperties.currentDay++;
        updateDestination(game, game.locations.get(Locations.WeaponSmith), game.worldProperties.currentDay);
        updateDestination(game, game.locations.get(Locations.HealersTent), game.worldProperties.currentDay);
    }

    function updateDestination(game: IGame, location: ICompiledLocation, day: number) {
        var dayLocation = <any>Locations['Day' + (day + 1)];

        var dayDestinations = location.destinations.filter(d => (<any>d.target).indexOf('Day') > -1);

        dayDestinations.forEach(destination => {
            location.destinations.remove(destination);
        });

        location.destinations.push({
            text: game.locations.get(dayLocation).name,
            target: dayLocation
        });
    }
}