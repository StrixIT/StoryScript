module QuestForTheKing {
    export function playAudio(parent: any, key: string, location: ICompiledLocation, newOnly?: boolean) {
        var description = parent[key] as string;
        var descriptionEntry = parent;
        var descriptionKey = key;

        if (parent === location) {
            descriptionEntry = location.descriptions;

            for (let n in location.descriptions) {
                if (location.descriptions[n] === location.text) {
                    descriptionKey = n;
                    break;
                }
            }
        }

        if (descriptionEntry[descriptionKey]) {
            if (descriptionEntry[descriptionKey].indexOf('autoplay="autoplay"') > -1) {
                descriptionEntry[descriptionKey] = descriptionEntry[descriptionKey].replace('autoplay="autoplay"', '');
            }
        }

        if (description.indexOf('autoplay="autoplay"') > -1) {
            parent[key] = parent[key].replace('autoplay="autoplay"', '');

            setTimeout(function () {
                var audioElements = $(<any>'audio', <any>'body');

                for (var i = 0; i < audioElements.length; i++) {
                    var element = (<HTMLAudioElement>audioElements[i]);

                    if (element.play && (element.paused || element.currentTime) && (!newOnly || audioElements.length == i + 1)) {
                        element.play();
                    }
                }
            }, 0);
        }
    }

    export function changeDay(game: IGame) {
        var day = parseInt(game.currentLocation.name.toLowerCase().replace('day', ''));
        game.worldProperties.currentDay = isNaN(day) ? game.worldProperties.currentDay : day;
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
        var dayLocation = day === 2 ? Locations.NightInYourTent : <any>Locations['Day' + (day + 1)];

        if (dayLocation) {
            var dayDestinations = location.destinations.filter(d => (<any>d.target).indexOf('Day') > -1 || (<any>d.target).indexOf('NightInYourTent') > -1);

            dayDestinations.forEach(destination => {
                location.destinations.remove(destination);
            });

            location.destinations.push({
                name: game.locations.get(dayLocation).name,
                target: dayLocation
            });
        }
    }
}