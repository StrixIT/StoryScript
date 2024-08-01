import { ICollection } from '../Interfaces/collection';
import { ILocation } from '../Interfaces/location';
import { ICompiledLocation } from '../Interfaces/compiledLocation';
import { IRules } from '../Interfaces/rules/rules';
import { IGame } from '../Interfaces/game';
import { DataKeys } from '../DataKeys';
import { IFeature } from '../Interfaces/feature';
import { IDestination } from '../Interfaces/destination';
import { IKey } from '../Interfaces/key';
import { addHtmlSpaces, getId, isEmpty, parseGameProperties } from '../utilities';
import { ILocationService } from '../Interfaces/services/locationService';
import { IDataService } from '../Interfaces/services//dataService';
import { ActionType } from '../Interfaces/enumerations/actionType';
import { getParsedDocument, checkAutoplay } from './sharedFunctions';
import {setDestination} from "storyScript/ObjectConstructors.ts";

export class LocationService implements ILocationService {
    constructor(
        private _dataService: IDataService, 
        private _rules: IRules, 
        private _game: IGame,
        private _pristineEntities: Record<string, Record<string, any>>
    ) {}

    init = (game: IGame, buildWorld?: boolean): void => {
        game.currentLocation = null;
        game.previousLocation = null;
        let locations: Record<string, ICompiledLocation>;

        if (buildWorld === undefined || buildWorld) {
            locations = this._dataService.load(DataKeys.WORLD);

            if (isEmpty(locations)) {
                this._dataService.save(DataKeys.WORLD, this._pristineEntities.locations);
                locations = this._dataService.load(DataKeys.WORLD);
            }
        }
        else {
            locations = this._game.locations;
        }

        Object.values(locations).forEach(l => this.initDestinations(l));
        game.locations = locations;
        game.locations.get = (id) => {
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
    }

    saveWorld = (locations: Record<string, ICompiledLocation>): void => this._dataService.save(DataKeys.WORLD, locations);

    changeLocation = (location: string | (() => ILocation), travel: boolean, game: IGame): void => {
        // Clear the play state on travel.
        game.playState = null;

        this.playEvents(game, 'leaveEvents');

        // If there is no location, we are starting a new game and we're done here.
        if (!this.switchLocation(game, location)) {
            return;
        }

        this.processDestinations(game);
        this._game.party.currentLocationId = game.currentLocation.id;

        if (game.previousLocation) {
            this._game.party.previousLocationId = game.previousLocation.id;
        }

        if (this._rules.exploration?.enterLocation) {
            this._rules.exploration.enterLocation(game, game.currentLocation, travel);
        }

        this.loadLocationDescriptions(game);
        this.initTrade(game);

        this.playEvents(game, 'enterEvents');

        this.markCurrentLocationAsVisited(game);
    }

    loadLocationDescriptions = (game: IGame): void => {
        if (!game.currentLocation.descriptions && game.currentLocation.description) {
            this.processVisualFeatures(getParsedDocument('visual-features', game.currentLocation.description)[0], game);
            this.processDescriptions(getParsedDocument('description', game.currentLocation.description), game);
        }

        if (this.selectLocationDescription(game)) {
            this.processTextFeatures(game);
        }
    }

    initDestinations = (location: ICompiledLocation): void => {
        // Add a proxy to the destination collection add and delete functions, to replace the target function pointers
        // with the target id when adding or deleting destinations at runtime.
        location.destinations.add = location.destinations.add.proxy(this.addDestination, this._game);
        location.destinations.delete = location.destinations.delete.proxy(this.addDestination, this._game);

        Object.defineProperty(location, 'activeDestinations', {
            get: function () {
                return location.destinations.filter(e => { return !e.inactive; });
            }
        });

        let selector = location.descriptionSelector;

        Object.defineProperty(location, 'descriptionSelector', {
            enumerable: true,
            get: () => selector,
            set: (value) => {
                selector = value;
                this.selectLocationDescription(this._game);
            }
        });
    }

    private switchLocation = (game: IGame, location: string | (() => ILocation)): boolean => {
        var presentLocation: ICompiledLocation;

        // If no location is specified, go to the previous location.
        if (!location) {
            var tempLocation = game.currentLocation;
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

    private processDestinations = (game: IGame) => {
        if (game.currentLocation.destinations) {

            // remove the return message from the current location destinations.
            game.currentLocation.destinations.forEach(destination => {
                if ((<any>destination).isPreviousLocation) {
                    (<any>destination).isPreviousLocation = false;
                }
            });

            // Mark the previous location in the current location's destinations to allow
            // the player to more easily backtrack his last step. Also, check if the user
            // has the key for one or more barriers at this location, and add the key actions
            // if that is the case.
            game.currentLocation.destinations.forEach(destination => {
                if (game.previousLocation && destination.target && (<any>destination.target) == game.previousLocation.id) {
                    (<any>destination).isPreviousLocation = true;
                }

                this.addKeyAction(game, destination);
            });
        }
    }

    private markCurrentLocationAsVisited = (game: IGame): void => {
        if (!game.currentLocation.hasVisited) {
            game.currentLocation.hasVisited = true;
            game.statistics.LocationsVisited = game.statistics.LocationsVisited || 0;
            game.statistics.LocationsVisited += 1;
        }
    }

    private initTrade = (game: IGame): void => {
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

    private addDestination = (originalScope, originalFunction, destination, game): void => {
        setDestination(destination);
        this.addKeyAction(game, destination);
        originalFunction.call(originalScope, destination);
    }

    private playEvents = (game: IGame, eventProperty: string): void => {
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

    private processDescriptions = (descriptionNodes: HTMLCollectionOf<Element>, game: IGame): void => {
        if (!descriptionNodes?.length) {
            return;
        }

        game.currentLocation.descriptions = {};

        for (var i = 0; i < descriptionNodes.length; i++) {
            var node = descriptionNodes[i];
            var nameAttribute = node.attributes['name']?.nodeValue;
            var name = nameAttribute ? nameAttribute : 'default';

            if (game.currentLocation.descriptions[name]) {
                throw new Error('There is already a description with name ' + name + ' for location ' + game.currentLocation.id + '.');
            }

            game.currentLocation.descriptions[name] = parseGameProperties(node.innerHTML, this._game);
        }      
    }

    private processTextFeatures = (game: IGame): void => {
        if (!game.currentLocation.description) {
            return;
        }

        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(game.currentLocation.description, 'text/html');
        var featureNodes = <HTMLCollectionOf<HTMLElement>>htmlDoc.getElementsByTagName('feature');

        for (var i = 0; i < featureNodes.length; i++) {
            const node = featureNodes[i];
            const feature = this.getBasicFeatureData(game, node);

            // If the feature is not present in code, clean the node html as the feature is either
            // not yet added (the feature tag is a placeholder for a feature added at runtime) or it
            // was deleted. Clean the node html to not show the feature text in case it was deleted.
            if (!feature) {
                node.innerHTML = '';
            }
            else {
                feature.description = node.innerHTML || feature.description;
                node.innerHTML = addHtmlSpaces(feature.description);
            }
        }
        
        game.currentLocation.description = htmlDoc.body.innerHTML;
    }

    private processVisualFeatures = (visualFeatureNode: Element, game: IGame): void => {
        if (visualFeatureNode) {
            game.currentLocation.features.collectionPicture = visualFeatureNode.attributes['img'] && visualFeatureNode.attributes['img'].nodeValue;

            if (game.currentLocation.features && game.currentLocation.features.length > 0 && visualFeatureNode) {
                var areaNodes = <HTMLCollectionOf<HTMLAreaElement>>visualFeatureNode.getElementsByTagName('area');

                for (var i = 0; i < areaNodes.length; i++) {
                    const node = areaNodes[i];
                    const feature = this.getBasicFeatureData(game, node);

                    if (feature) {
                        feature.coords ??= node.attributes['coords']?.nodeValue;
                        feature.shape ??= node.attributes['shape']?.nodeValue;
                        feature.picture ??= node.attributes['img']?.nodeValue;
                    }
                }
            }

            visualFeatureNode.parentNode.removeChild(visualFeatureNode);
        }
    }

    private getBasicFeatureData = (game: IGame, node: HTMLElement): IFeature => {
        var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;

        if (!nameAttribute) {
            throw new Error('There is no name attribute for a feature node for location ' + game.currentLocation.id + '.');
        }

        const feature = game.currentLocation.features.get(nameAttribute);

        // This is a workaround to restore the description for features that originally have only a placeholder in the 
        // location description and are added later to the location's feature collection. As descriptions are not saved,
        // the description is lost when the browser refreshes.
        if (feature && !feature.description) {
            const pristineFeature = Object.values(this._pristineEntities.features).get(feature.id);

            if (pristineFeature?.description) {
                feature.description = pristineFeature.description;

            }
        }

        return feature;
    }

    private selectLocationDescription = (game: IGame): boolean => {
        var selector = null;

        if (!game.currentLocation.descriptions) {
            game.currentLocation.description = null;
            return false;
        }

        // A location can specify how to select the proper selection using a descriptor selection function. If it is not specified,
        // use the default description selector function.
        if (game.currentLocation.descriptionSelector) {
            // Use this casting to allow the description selector to be a function or a string.
            selector = typeof game.currentLocation.descriptionSelector == 'function' ? (<any>game.currentLocation.descriptionSelector)(game) : game.currentLocation.descriptionSelector;
            game.currentLocation.description = game.currentLocation.descriptions[selector];
        }
        else if (this._rules.exploration && this._rules.exploration.descriptionSelector && (selector = this._rules.exploration.descriptionSelector(game))) {
            game.currentLocation.description = game.currentLocation.descriptions[selector] || game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[0];
        }
        else {
            game.currentLocation.description = game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[Object.keys(game.currentLocation.descriptions)[0]];
        }

        game.currentLocation.description = checkAutoplay(this._dataService, game.currentLocation.description);

        return true;
    }

    private addKeyAction = (game: IGame, destination: IDestination) => {
        if (destination.barrier?.key) {
            const key = typeof destination.barrier.key === 'function' ? destination.barrier.key() : <IKey>Object.values(this._pristineEntities.items).get(destination.barrier.key);
            let existingAction = null;

            if (destination.barrier.actions) {
                destination.barrier.actions.forEach(([k, v]) => {
                    if (k === key.id) {
                        existingAction = v;
                    }
                });
            }
            else {
                destination.barrier.actions = [];
            }

            if (existingAction) {
                destination.barrier.actions.splice(destination.barrier.actions.indexOf(existingAction), 1);
            }

            let partyKey = null;

            game.party.characters.forEach(c => {
                partyKey = partyKey ?? c.items.get(key.id);
            });

            const barrierKey = <IKey>(partyKey || game.currentLocation.items.get(key.id));

            if (barrierKey) {
                destination.barrier.actions.push([barrierKey.id, barrierKey.open]);
            }
        }
    }
}