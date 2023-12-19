import { IFunctionIdParts } from '../Interfaces/services/functionIdParts';
import { DataKeys } from '../DataKeys';
import { getId, getPlural, getSingular, isEmpty } from '../utilities';
import { initCollection, setReadOnlyProperties, GetFunctions, GetDescriptions, GetRegisteredEntities } from '../ObjectConstructors';
import { parseFunction } from '../globals';
import { IDataService } from '../Interfaces/services/dataService';
import { ILocalStorageService } from '../Interfaces/services/localStorageService';
import { IUpdatable } from 'storyScript/updatable';
import { RuntimeProperties } from 'storyScript/runtimeProperties';

export class DataService implements IDataService {
    private _functionArgumentRegex = /\([a-z-A-Z0-9:, ]{1,}\)/;
    private _runtimeProperties = [
        <string>RuntimeProperties.ActiveNode,
        <string>RuntimeProperties.Added,
        <string>RuntimeProperties.ConversationLog,
        <string>RuntimeProperties.Description,
        <string>RuntimeProperties.Descriptions,
        <string>RuntimeProperties.HasVisited,
        <string>RuntimeProperties.Log,
        <string>RuntimeProperties.Nodes,
        <string>RuntimeProperties.Picture,
        <string>RuntimeProperties.StartNode,
        <string>RuntimeProperties.IsPreviousLocation
    ];

    constructor(private _localStorageService: ILocalStorageService, private _gameNameSpace: string) {
    }
    
    save = <T>(key: string, value: T, pristineValues?: T): void => {
        var clone = this.buildClone(null, value, pristineValues);
        this._localStorageService.set(this._gameNameSpace + '_' + key, JSON.stringify({ data: clone }));
    }

    load = <T>(key: string): T => {
        try {
            var jsonData = this._localStorageService.get(this._gameNameSpace + '_' + key);

            if (jsonData) {
                var data = JSON.parse(jsonData).data;

                if (isEmpty(data)) {
                    return null;
                }

                var functionList = GetFunctions();
                var pristineEntities = GetRegisteredEntities();

                if (Array.isArray(data) && data[0]?.type && data[0]?.id) {
                    this.restoreObjects(functionList, null, data);

                    // Add pristine entities that aren't present on the current collection. These are added to the new definition
                    // or were removed programmatically. Todo: can we use a deleted flag to improve this?
                    const pristineCollection = pristineEntities[getPlural(data[0]?.type)];
                    this.updateModifiedEntities(data, pristineEntities, Object.keys(pristineCollection).map(k => pristineCollection[k]));
                }
                else {
                    const result = this.restoreObjects(functionList, null, data);

                    // Todo: update e.g. game which is not an entity
                    if (result.type && result.id) {
                        this.updateModifiedEntity(result, pristineEntities[result.type][result.id], pristineEntities);
                    }
                }
                setReadOnlyProperties(key, data);
                return data;
            }

            return null;
        }
        catch (exception: any) {
            console.log('No data loaded for key ' + key + '. Error: ' + exception.message);
        }

        return null;
    }

    remove = (key: string): void => {
        this._localStorageService.remove(this._gameNameSpace + '_' + key);
    }

    copy = <T>(value: T, pristineValue: T): T => {
        return this.buildClone(null, value, pristineValue);
    }

    getSaveKeys = (): string[] => this._localStorageService.getKeys(this._gameNameSpace + '_' + DataKeys.GAME + '_');

    private buildClone = (parentKey: string, values, pristineValues, clone?): any => {
        if (!clone) {
            clone = Array.isArray(values) ? [] : typeof values === 'object' ? {} : values;
            if (clone == values) {
                return clone;
            }
        }

        for (var key in values) {
            if (!values.hasOwnProperty(key)) {
                continue;
            }

            var value = values[key];

            if (value === undefined) {
                continue;
            }
            else if (value === null) {
                clone[key] = null;
                continue;
            }
            else if (value.isProxy) {
                continue;
            }
            // Todo: why do I see these in the save data??
            // Exclude descriptions and conversation nodes from the save data so they
            // are refreshed on every browser refresh.
            else if (values.id && (key === RuntimeProperties.Description || key === RuntimeProperties.Descriptions)) {
                clone[key] = null;
                continue;
            }
            else if (parentKey === 'conversation' && key === RuntimeProperties.Nodes) {
                clone[key] = null;
                continue;
            }

            this.getClonedValue(clone, value, key, pristineValues);
        }

        return clone;
    }

    private getClonedValue = (clone: any, value: any, key: string, pristineValues: any): void => {
        var pristineValue = pristineValues && pristineValues.hasOwnProperty(key) ? pristineValues[key] : undefined;

        if (Array.isArray(value)) {
            clone[key] = [];
            this.buildClone(key, value, pristineValue, clone[key]);

            var additionalArrayProperties = Object.keys(value).filter(v => {
                var isAdditionalProperty = isNaN(parseInt(v));

                if (isAdditionalProperty) {
                    if (v === 'push' || (value[v].name === 'push') && value[v].isProxy) {
                        isAdditionalProperty = false;
                    }
                }

                return isAdditionalProperty;
            });

            additionalArrayProperties.forEach(p => {
                var arrayPropertyKey = `${key}_arrProps`;
                clone[arrayPropertyKey] = clone[arrayPropertyKey] || {};
                this.getClonedValue(clone[arrayPropertyKey], value[p], p, pristineValue);
            });
        }
        else if (typeof value === 'object') {
            if (Array.isArray(clone)) {
                clone.push({});
            }
            else {
                clone[key] = {};
            }

            this.buildClone(key, value, pristineValue, clone[key]);
        }
        else if (typeof value === 'function') {
            this.getClonedFunction(clone, value, key);
        }
        else {
            clone[key] = value;
        }
    }

    private getClonedFunction = (clone: any, value: any, key: string): void => {
        if (!value.isProxy) {
            if (value.functionId) {
                clone[key] = value.functionId;
            }
            else {
                // Functions added during runtime must be serialized using the function() notation in order to be deserialized back
                // to a function. Convert values that have an arrow notation.
                let functionString = value.toString();

                if (functionString.indexOf('function') == -1) {
                    var arrowIndex = functionString.indexOf('=>');

                    // The arguments regex will fail when no arguments are used in production mode. Use empty brackets in that case.
                    var args = functionString.match(this._functionArgumentRegex)?.[0] || '()';

                    functionString = 'function' + args + functionString.substring(arrowIndex + 2).trim();
                }

                clone[key] = functionString;
            }
        }
    }

    private restoreObjects = (
            functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, 
            descriptions: Map<string, string>,
            loaded: any
        ): any => {
        descriptions = descriptions || GetDescriptions();

        for (const key in loaded) {
            if (!loaded.hasOwnProperty(key)) {
                continue;
            }

            if (key === RuntimeProperties.Description && loaded.id) {
                var descriptionKey = `${loaded.type}_${loaded.id}`;
                loaded[key] = descriptions.get(descriptionKey);
                this.loadPictureFromDescription(loaded, key);
                continue;
            }

            var value = loaded[key];

            if (value === undefined) {
                continue;
            }
            else if (Array.isArray(value)) {
                initCollection(loaded, key);
                 this.restoreObjects(functionList, descriptions, value);
        
                var arrayPropertyKey = `${key}_arrProps`;
                var additionalArrayProperties = loaded[arrayPropertyKey];
        
                if (additionalArrayProperties) {
                    Object.keys(additionalArrayProperties).forEach(k => {
                        loaded[k] = additionalArrayProperties[k];
                    });
        
                    delete loaded[arrayPropertyKey];
                }
            }
            else if (typeof value === 'object') {
                this.restoreObjects(functionList, descriptions, value);
            }
            else if (typeof value === 'string') {
                this.restoreFunction(functionList, loaded, value, key);
            }
        }

        return loaded;
    }

    private updateModifiedEntities = (
        entities: IUpdatable[],
        pristineEntities: Record<string, Record<string, any>>, 
        pristineProperty: any,       
        parentEntity?: IUpdatable,
        pristineParentEntity?: IUpdatable
    ): void => {
        const removedEntities = [];

        // Loop over the current entities to update the values on entities that changed.
        entities.forEach(entity => {
            // Find the pristine entity to update from in case of a change.
            const pristinceCollection = pristineEntities[getPlural(entity.type)];
            const p = pristinceCollection ? pristinceCollection[entity.id] : pristineProperty.get(entity.id);
    
            // If a pristine entity is not found, it is no longer part of the definitions. This happens when the 
            // entity function was renamed or the function was deleted. Delete it.
            if (!p) {
                removedEntities.push(entity);
                return;
            }

            this.updateModifiedEntity(entity, p, pristineEntities, parentEntity, pristineParentEntity, entity.type);      
        });
    
        removedEntities.forEach(e => {
            console.log(this.getUpdateLogMessage(e, parentEntity, 'Removing', 'from'));
            entities.remove(e)
        });

        // Remove entities that are no longer on the pristine collection, but only when they were not added programmatically.
        entities.filter(c => !pristineProperty.find(p => p.id === c.id)).map(e => {
            if (e[RuntimeProperties.Added]) {
                return;
            }
                    
            console.log(this.getUpdateLogMessage(e, parentEntity, 'Removing', 'from'));
            entities.remove(e);
        });

        // Add entities that are on the pristine entity but not on the current entity.
        // These have been added during editing.
        pristineProperty.filter(p => !entities.find(c => c.id === p.id)).map(p => {
            console.log(this.getUpdateLogMessage(p, parentEntity, 'Adding', 'to'));
            entities.push(p);
            // Remove the 'added' flag. The entity is added design time, not run time.
            if (p[RuntimeProperties.Added]) {
                delete p[RuntimeProperties.Added];
            }
        });
    }

    private getUpdateLogMessage = (entity: IUpdatable, parent: IUpdatable, prefix: string, join: string): string => {
        const baseMessage = `${prefix} ${entity.type} ${entity.id}`;
        return parent ? `${baseMessage} ${join} ${parent.type} ${parent.id}.` : `${baseMessage}.`
    }

    private updateModifiedEntity = (
        entity: IUpdatable, 
        pristineEntity: IUpdatable, 
        pristineEntities: Record<string, Record<string, any>>, 
        parentEntity?: IUpdatable,
        pristineParentEntity?: IUpdatable,
        parentProperty?: string
    ): void => {
        var propertyNames = Object.keys(entity);
    
        propertyNames.forEach(p => {
            if (p === 'buildTimeStamp') {
                return;
            }

            var currentProperty = entity[p];
            var pristineProperty = pristineEntity[p];

            // If the properly currently exists on the entity but isn't part of the new definition, delete it now.
            if (typeof pristineProperty === 'undefined') {
                if (this._runtimeProperties.indexOf(p) > -1) {
                    return;
                }

                if (!this.isEntityUpdated(entity, pristineEntity, parentEntity, pristineParentEntity)) {
                    return;
                }

                console.log(`Removing ${p} (value ${entity[p]}) from ${entity.type} ${entity.id}.`);
                delete entity[p];
                return;
            }

            if (entity.buildTimeStamp) {
                parentEntity = entity;
                pristineParentEntity = pristineEntity;
            }

            // Update the current property using the pristine property value. When dealing with an object, update
            // its property values recursively. When dealing with a collection of entity objects, update these recursively.
            if (this.isEntityArray(currentProperty, pristineProperty)) {
                this.updateModifiedEntities(currentProperty, pristineEntities, pristineProperty, parentEntity, pristineParentEntity);
                return;
            }
            else if (this.isEntity(currentProperty)) {
                this.updateModifiedEntity(currentProperty, pristineProperty, pristineEntities, parentEntity, pristineParentEntity, p);
                return;
            }
            
            if (!this.isEntityUpdated(entity, pristineEntity, parentEntity, pristineParentEntity)) {
                return;
            }

            if (Array.isArray(entity[p] && entity[p].length > 0)) {
                console.log(`Replacing collection ${p} on ${entity.type} ${entity.id}.`);
                entity[p].length = 0;
                pristineProperty.forEach(e => {
                    entity[p].push(e);
                    delete e[RuntimeProperties.Added];
                });
            } else if (typeof currentProperty === 'object') {
                this.updateModifiedEntity(currentProperty, pristineProperty, pristineEntities, parentEntity, pristineParentEntity, p.match(/^[0-9]$/) ? parentProperty : p);
            } 
            else {
                if (this._runtimeProperties.indexOf(p) > -1) {
                    return;
                }

                if (entity[p] === pristineProperty) {
                    return;
                }

                // Todo: think whether there is a case in which a function should be updated. Probably not, as all
                // design-time functions are already attached when re-building the stored state.
                if (typeof entity[p] === 'function') {
                    return;
                }

                const parentMessage = entity.type ? '' : `${parentProperty} `;
                const messageValue = pristineProperty.name ?? pristineProperty; 
                const baseMessage = `Updating ${parentMessage}${p} (value ${messageValue}) on `;
                const messageExtension = entity.type ? `${entity.type} ${entity.id}` : `${parentEntity?.type} ${parentEntity?.id}`

                console.log(baseMessage + messageExtension);
                entity[p] = pristineProperty;
            }
        });
    
        // Add properties previously not on the entity to it.
        const newPropertyNames = Object.keys(pristineEntity).filter(p => !propertyNames.find(e => e === p));
    
        if (this.isEntityUpdated(entity, pristineEntity, parentEntity, pristineParentEntity)) {
            newPropertyNames.forEach(p => {
                if (Array.isArray(entity)) {
                    const pristineValue = pristineEntity[p];
                    const logValue = pristineValue.id ?? pristineValue.name ?? pristineValue; 
                    console.log(`Adding ${getSingular(parentProperty)} (value ${logValue}) to ${parentEntity.type} ${parentEntity.id}.`);
                    entity.push(pristineValue);
                    delete entity[p][RuntimeProperties.Added];
                }
                else {
                    console.log(`Adding ${p} (value ${pristineEntity[p]}) to ${entity.type} ${entity.id}.`);
                    entity[p] = pristineEntity[p];
                }
            });
        }

        // Update the entity build stamp now, to indicate the entity is back in sync with the most recent version.
        if (entity.buildTimeStamp) {
            entity.buildTimeStamp = pristineEntity.buildTimeStamp;
        }
    }

    private isEntityArray = (entities: IUpdatable[], pristineEntities: IUpdatable[]): boolean => {
        return this.isEntity(entities[0]) || this.isEntity(pristineEntities[0]);
    }

    private isEntity = (entity: IUpdatable): boolean => {
        return typeof entity?.type !== 'undefined' && typeof entity?.id !== 'undefined';
    }

    private restoreFunction = (functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, loaded: any, value: any, key: string): void => {
        if (value.indexOf('function#') > -1) {
            var parts = this.GetFunctionIdParts(value);
            var type = getPlural(parts.type);
            var typeList = functionList[type];

            if (!typeList[parts.functionId]) {
                console.log('Function with key: ' + parts.functionId + ' could not be found!');
            }
            else if (typeList[parts.functionId].hash != parts.hash) {
                console.warn(`Function with key: ${parts.functionId} was found but the hash does not match the stored hash (old hash: ${parts.hash}, new hash: ${typeList[parts.functionId].hash})! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`);
            }

            loaded[key] = typeList[parts.functionId].function;
        }
        else if (typeof value === 'string' && value.indexOf('function') > -1) {
            loaded[key] = parseFunction(value);
        }
    }

    private GetFunctionIdParts = (value: string): IFunctionIdParts => {
        var parts = value.split('#');
        var functionPart = parts[1];
        var functionParts = functionPart.split('|');
        var type = functionParts[0];
        functionParts.splice(0, 1);
        var functionId = functionParts.join('|');
        var hash = parseInt(parts[2]);

        return {
            type: type,
            functionId: functionId,
            hash: hash
        }
    }

    private loadPictureFromDescription(loaded: any, key: string) {
        if (!loaded[key]) {
            return;
        }

        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(loaded[key], 'text/html');
        var pictureElement = htmlDoc.getElementsByClassName(RuntimeProperties.Picture)[0];
        var pictureSrc = pictureElement && pictureElement.getAttribute('src');

        if (pictureSrc) {
            loaded[RuntimeProperties.Picture] = pictureSrc;
        }
    }

    private isEntityUpdated = (entity: IUpdatable, pristineEntity: IUpdatable, parentEntity: IUpdatable, pristineParentEntity: IUpdatable): boolean => {
        var entityHasBuildStamp = typeof entity.buildTimeStamp !== 'undefined' && typeof pristineEntity.buildTimeStamp !== 'undefined';

        if (entityHasBuildStamp) {
            return entity.buildTimeStamp < pristineEntity.buildTimeStamp;
        }

        var parentEntityHasBuildStamp = typeof parentEntity?.buildTimeStamp !== 'undefined' && typeof pristineParentEntity?.buildTimeStamp !== 'undefined';
        return parentEntityHasBuildStamp && parentEntity.buildTimeStamp < pristineParentEntity.buildTimeStamp;
    }
}