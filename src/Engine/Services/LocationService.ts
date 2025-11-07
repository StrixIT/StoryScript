import {ILocation} from '../Interfaces/location';
import {ICompiledLocation} from '../Interfaces/compiledLocation';
import {IRules} from '../Interfaces/rules/rules';
import {IGame} from '../Interfaces/game';
import {IDestination} from '../Interfaces/destination';
import {IKey} from '../Interfaces/key';
import {addHtmlSpaces, getId, parseHtmlDocumentFromString} from '../utilityFunctions';
import {ILocationService} from '../Interfaces/services/locationService';
import {ActionType} from '../Interfaces/enumerations/actionType';
import {checkAutoplay, parseGamePropertiesInTemplate} from './sharedFunctions';
import {
    getBasicFeatureData,
    setDestination,
    setReadOnlyLocationProperties
} from "storyScript/EntityCreatorFunctions.ts";
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";
import {IGameEvents} from "storyScript/Interfaces/gameEvents.ts";
import {gameEvents} from "storyScript/gameEvents.ts";
import {GameEventNames} from "storyScript/GameEventNames.ts";

export class LocationService implements ILocationService {
    constructor(
        private readonly _definitions: IDefinitions,
        private readonly _rules: IRules,
        private readonly _game: IGame,
        private readonly _gameEvents: IGameEvents,
    ) {
    }

    init = (): void => {
        this._game.currentLocation = null;
        this._game.previousLocation = null;

        if (!this._game.locations) {
            // When we don't have any locations yet, we're starting a new game. Use the definitions to build
            // all the locations and set their readonly properties. Also build the maps, if present.
            this._game.locations = {};
            this._definitions.locations.forEach(l => this._game.locations[getId(l)] = <ICompiledLocation>l());
            Object.values(this._game.locations).forEach(l => setReadOnlyLocationProperties(<ICompiledLocation>l));
        }
        
        if (!this._game.maps && this._definitions.maps) {
            this._game.maps = {};
            // When we have no maps, it could be that maps were added later and that they are not in the saved
            // data yet. Add the maps available now.
            this._definitions.maps?.forEach(m => this._game.maps[getId(m)] = m());
        }

        this.setupLocations();
        
        this._gameEvents.subscribe(['add-character-items', 'delete-character-items', 'add-location-items'], (game: IGame, _) => {
            game.currentLocation?.destinations.forEach(d => {
                this.addKeyAction(game, d);
            })
        }, false);
    }

    changeLocation = (location: string | (() => ILocation), travel: boolean, game: IGame): void => {
        // Clear the play state on travel.
        game.playState = null;
        this._rules.exploration?.leaveLocation?.(game, game.currentLocation, getId(location));
        this.playEvents(game, 'leaveEvents');

        // If there is no location, we are starting a new game. We're done here.
        if (!this.switchLocation(game, location)) {
            return;
        }

        this.processDestinations(game);
        this._game.party.currentLocationId = game.currentLocation.id;
        this._game.party.previousLocationId = game.previousLocation?.id;
        this._rules.exploration?.enterLocation?.(game, game.currentLocation, travel);
        this.loadLocationDescriptions(game);
        this.initTrade(game);
        this.playEvents(game, 'enterEvents');
        this.markCurrentLocationAsVisited(game);
    }

    loadLocationDescriptions = (game: IGame): void => {
        if (this.selectLocationDescription(game, true)) {
            parseGamePropertiesInTemplate(game.currentLocation.description, this._game);
            this.processTextFeatures(game.currentLocation);
        }
    }

    initDestinations = (location: ICompiledLocation): void => {
        // Add a proxy to the destination collection add and delete functions, to replace the target function pointers
        // with the target id when adding or deleting destinations at runtime.
        location.destinations.add = location.destinations.add.proxy(this.addDestination, this._game);

        Object.defineProperty(location, 'activeDestinations', {
            get: function () {
                return location.destinations.filter(e => {
                    return !e.inactive;
                });
            }
        });
    }

    processDestinations = (game: IGame) => {
        if (game.previousLocation?.destinations) {
            // Remove the isPreviousLocation and visited markers from the previous location's destinations.
            game.previousLocation.destinations.forEach((d: any) => {
                delete d.isPreviousLocation;
                delete d.visited;
            });
        }

        if (game.currentLocation.destinations) {
            // 1. Mark the previous location in the current location's destinations to allow
            // the player to more easily backtrack his last step.
            // 2. Mark the destination as visited when the player has already visited the location it leads to.
            // 3. Check if the user has the key for one or more barriers at this location, and add the key actions
            // if that is the case.
            game.currentLocation.destinations.forEach((d: any) => {
                if (d.target == game.previousLocation?.id) {
                    d.isPreviousLocation = true;
                }

                const targetLocation = game.locations[d.target];
                const visitedRule = this._rules.exploration?.hasVisitedLocation;

                if (targetLocation && visitedRule) {
                    d.visited = visitedRule(game, targetLocation);
                }
                else {
                    d.visited = targetLocation?.hasVisited;
                }

                this.addKeyAction(game, d);
            });
        }
    }

    private readonly setupLocations = () => {
        Object.values(this._game.locations).forEach(l => {
            const compiledLocation = <ICompiledLocation>l;
            this.initDestinations(compiledLocation);
            let selector = compiledLocation.descriptionSelector;

            Object.defineProperty(compiledLocation, 'descriptionSelector', {
                enumerable: true,
                get: () => selector,
                set: (value) => {
                    selector = value;
                    this.selectLocationDescription(this._game, Boolean(value));
                }
            });
        });

        this.addLocationGet(this._game.locations);
    }

    private readonly addLocationGet = (locations: Record<string, ICompiledLocation>) => {
        Object.defineProperty(locations, 'get', {
            enumerable: false,
            value: function (id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation {
                if (!id) {
                    return undefined;
                }

                if (typeof id === 'string') {
                    return locations[id.toLowerCase()];
                } else if (typeof id === 'function') {
                    return locations[id.name.toLowerCase()];
                } else {
                    return locations[id.id]
                }
            }
        });
    }

    private readonly switchLocation = (game: IGame, location: string | (() => ILocation)): boolean => {
        let presentLocation: ICompiledLocation;

        // If no location is specified, go to the previous location.
        if (!location) {
            const tempLocation = game.currentLocation;
            game.currentLocation = game.previousLocation;
            game.previousLocation = tempLocation;
            presentLocation = game.currentLocation;
        }
        // If currently at a location, make this the previous location.
        else if (game.currentLocation) {
            game.previousLocation = game.currentLocation;
        }

        if (!location && !presentLocation) {
            return false;
        }

        const key = getId(location) ?? presentLocation.id;
        game.currentLocation = game.locations.get(key);
        return true;
    }

    private readonly markCurrentLocationAsVisited = (game: IGame): void => {
        if (!game.currentLocation.hasVisited) {
            game.currentLocation.hasVisited = true;
            game.statistics.LocationsVisited = game.statistics.LocationsVisited || 0;
            game.statistics.LocationsVisited += 1;
        }
    }

    private readonly initTrade = (game: IGame): void => {
        if (game.currentLocation.trade?.length > 0) {
            game.currentLocation.trade.forEach(t => {
                if (!game.currentLocation.actions.find(([k, v]) => v.actionType === ActionType.Trade && k === t.id)) {
                    game.currentLocation.actions.add([t.id, {
                        text: t.name,
                        actionType: ActionType.Trade,
                        execute: 'trade'
                    }]);
                }
            });
        }
    }

    private readonly addDestination = (originalScope: any, originalFunction: Function, destination: IDestination, game: IGame): void => {
        setDestination(destination);
        this.addKeyAction(game, destination);
        originalFunction.call(originalScope, destination);
    }

    private readonly playEvents = (game: IGame, eventProperty: string): void => {
        if (!game.currentLocation?.[eventProperty]) {
            return;
        }

        // Keep a reference to the location being processed. When the location is changed in the
        // event, we want to still update the events in the originating location.
        const location = game.currentLocation;
        const events = [...location[eventProperty]];

        events.forEach(e => {
            const result = e[1]?.(game);

            if (!result) {
                location[eventProperty].delete(e);
            }
        });
    }

    private readonly processTextFeatures = (location: ICompiledLocation): void => {
        if (!location.description) {
            return;
        }

        const htmlDoc = parseHtmlDocumentFromString(location.description);
        const featureNodes = <HTMLCollectionOf<HTMLElement>>htmlDoc.getElementsByTagName('feature');

        for (const element of featureNodes) {
            const feature = getBasicFeatureData(location, element);

            // If the feature is not present in code, clean the node html as the feature is either
            // not yet added (the feature tag is a placeholder for a feature added at runtime) or it
            // was deleted. Clean the node html to not show the feature text in case it was deleted.
            if (!feature) {
                element.innerHTML = '';
            } else {
                feature.description = element.innerHTML || feature.description;
                element.innerHTML = addHtmlSpaces(feature.description);
            }
        }

        location.description = htmlDoc.body.innerHTML;
    }


    private readonly selectLocationDescription = (game: IGame, autoPlayCheck: boolean): boolean => {
        let selector = null;
        const previousDescription = game.currentLocation.description;

        if (!game.currentLocation.descriptions) {
            game.currentLocation.description = null;
            return false;
        }

        let description: string;
        const defaultDescription = game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[Object.keys(game.currentLocation.descriptions)[0]];

        // A location can specify how to select the proper selection using a descriptor selection function. If it is not specified,
        // use the default description selector function.
        if (game.currentLocation.descriptionSelector) {
            selector = typeof game.currentLocation.descriptionSelector == 'function' ? game.currentLocation.descriptionSelector(game) : game.currentLocation.descriptionSelector;
            description = game.currentLocation.descriptions[selector];
        }

        if (!description && this._rules.exploration?.descriptionSelector && (selector = this._rules.exploration.descriptionSelector(game))) {
            description = game.currentLocation.descriptions[selector];
        }

        description ??= defaultDescription;
        game.currentLocation.description = checkAutoplay(game, description, autoPlayCheck && previousDescription !== description);
        return true;
    }

    private readonly addKeyAction = (game: IGame, destination: IDestination) => {
        destination.barriers?.forEach(([_, b]) => {
            if (b.key) {
                const key = typeof b.key === 'function' ?
                    b.key()
                    : <IKey>this._definitions.items.get(b.key)();

                let existingAction = null;

                if (b.actions) {
                    b.actions.forEach(([k, v]) => {
                        if (k === key.id) {
                            existingAction = v;
                        }
                    });
                } else {
                    b.actions = [];
                }

                if (existingAction) {
                    b.actions.splice(b.actions.indexOf(existingAction), 1);
                }

                let partyKey = null;

                game.party.characters.forEach(c => {
                    partyKey = partyKey ?? c.items.get(key.id);
                });

                const barrierKey = <IKey>(partyKey || game.currentLocation.items.get(key.id));

                if (barrierKey) {
                    b.actions.push([barrierKey.id, barrierKey.open]);
                }
            }
        });
    }
}