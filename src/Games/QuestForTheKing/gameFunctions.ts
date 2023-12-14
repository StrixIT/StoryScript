import { IGame, ICompiledLocation } from './types';
import { NightInYourTent } from './locations/tournament/NightInYourTent';
import { GetDefinitions } from '../../Engine/ObjectConstructors';
import { WeaponSmith } from './locations/tournament/WeaponSmith';
import { HealersTent } from './locations/tournament/HealersTent';

export function changeDay(game: IGame) {
    var day = parseInt(game.currentLocation.name.toLowerCase().replace('day', ''));
    game.worldProperties.currentDay = isNaN(day) ? game.worldProperties.currentDay : day;
    updateDestination(game, game.locations.get(WeaponSmith), game.worldProperties.currentDay);
    updateDestination(game, game.locations.get(HealersTent), game.worldProperties.currentDay);
}

export function locationComplete(game: IGame, location: ICompiledLocation, completeDay: (() => boolean), completeNight: (() => boolean)) {
    if (game.worldProperties.isDay) {
        if (!location.completedDay) {
            location.completedDay = completeDay();
        }

        return location.completedDay;
    }
    else {
        if (!location.completedNight) {
            location.completedNight = completeNight();
        }

        return location.completedNight;
    }
}

function updateDestination(game: IGame, location: ICompiledLocation, day: number) {
    var dayLocation = day === 2 ? NightInYourTent : GetDefinitions().locations.find(l => l.name === ('Day' + (day + 1)));

    if (dayLocation) {
        var dayDestinations = location.destinations.filter(d => (<any>d.target).indexOf('day') > -1 || (<any>d.target).indexOf('nightinyourtent') > -1);

        dayDestinations.forEach(destination => {
            location.destinations.remove(destination);
        });

        location.destinations.push({
            name: game.locations.get(dayLocation).name,
            target: dayLocation
        });
    }
}