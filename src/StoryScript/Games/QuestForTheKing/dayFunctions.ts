module QuestForTheKing {
    export function changeDay(game: IGame) {
        game.worldProperties.currentDay = parseInt(game.currentLocation.name.toLowerCase().replace('day', ''));
        updateDestination(game, game.locations.get(Locations.WeaponSmith), game.worldProperties.currentDay);
        updateDestination(game, game.locations.get(Locations.HealersTent), game.worldProperties.currentDay);
    }

    export function locationComplete(game: StoryScript.IGame, location: StoryScript.ICompiledLocation, completeDay: (() => boolean), completeNight: (() => boolean)) {
        var theLocation = location as ICompiledLocation;

        if (game.worldProperties.isDay) {
            if (!theLocation.completedDay) {
                theLocation.completedDay = completeDay();
            }

            return theLocation.completedDay;
        }
        else {
            if (!theLocation.completedNight) {
                theLocation.completedNight = completeNight();
            }

            return theLocation.completedNight;
        }
    }

    function updateDestination(game: IGame, location: ICompiledLocation, day: number) {
        var dayLocation = <any>Locations['Day' + (day + 1)];

        if (dayLocation) {
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
}