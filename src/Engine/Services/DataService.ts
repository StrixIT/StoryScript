import { DataKeys } from '../DataKeys';
import { getPlural, isEmpty } from '../utilities';
import { setReadOnlyProperties, GetFunctions, GetRegisteredEntities } from '../ObjectConstructors';
import { IDataService } from '../Interfaces/services/dataService';
import { ILocalStorageService } from '../Interfaces/services/localStorageService';
import { IDataSerializer } from 'storyScript/Interfaces/services/dataSerializer';
import { IDataSynchronizer } from 'storyScript/Interfaces/services/dataSynchronizer';

export class DataService implements IDataService {

    constructor(private _localStorageService: ILocalStorageService, private serializer: IDataSerializer, private synchronizer: IDataSynchronizer, private _gameNameSpace: string) {
    }
    
    save = <T>(key: string, value: T, pristineValues?: T): void => {
        const clone = this.serializer.buildClone(value, pristineValues);
        this._localStorageService.set(this._gameNameSpace + '_' + key, JSON.stringify({ data: clone }));
    }

    load = <T>(key: string): T => {
        try {
            const jsonData = this._localStorageService.get(this._gameNameSpace + '_' + key);

            if (jsonData) {
                const data = JSON.parse(jsonData).data;

                if (isEmpty(data)) {
                    return null;
                }

                const functionList = GetFunctions();
                const pristineEntities = GetRegisteredEntities();

                if (Array.isArray(data) && data[0]?.type && data[0]?.id) {
                    this.serializer.restoreObjects(functionList, null, data);
                    this.synchronizer.updateModifiedEntities(data, pristineEntities);
                }
                else {
                    const result = this.serializer.restoreObjects(functionList, null, data);
                    this.synchronizer.updateModifiedEntity(result, result, pristineEntities);
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
        return this.serializer.buildClone(null, value, pristineValue);
    }

    getSaveKeys = (): string[] => this._localStorageService.getKeys(this._gameNameSpace + '_' + DataKeys.GAME + '_');
}