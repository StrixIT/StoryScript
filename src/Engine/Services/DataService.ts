import {DataKeys} from '../DataKeys';
import {isEmpty} from '../utilities';
import {setReadOnlyProperties} from '../ObjectConstructors';
import {IDataService} from '../Interfaces/services/dataService';
import {ILocalStorageService} from '../Interfaces/services/localStorageService';
import {IDataSerializer} from 'storyScript/Interfaces/services/dataSerializer';
import {IDataSynchronizer} from 'storyScript/Interfaces/services/dataSynchronizer';

export class DataService implements IDataService {

    constructor(
        private _localStorageService: ILocalStorageService,
        private serializer: IDataSerializer,
        private synchronizer: IDataSynchronizer,
        private _pristineEntities: Record<string, Record<string, any>>,
        private _gameNameSpace: string) {
    }

    save = <T>(key: string, value: T): void => {
        const clone = this.serializer.createSerializableClone(value);
        this._localStorageService.set(this._gameNameSpace + '_' + key, JSON.stringify({data: clone}));
    }

    load = <T>(key: string): T => {
        try {
            const jsonData = this._localStorageService.get(this._gameNameSpace + '_' + key);

            if (jsonData) {
                const data = JSON.parse(jsonData).data;

                if (isEmpty(data)) {
                    return null;
                }

                const result = this.serializer.restoreObjects(data);

                // When loading the game world, pass in the pristine locations as an array. We need this to
                // loop over all locations as we don't use a container entity.
                const pristineEntity = key === DataKeys.WORLD ? this._pristineEntities['locations'] : undefined;
                this.synchronizer.synchronizeEntityData(result, pristineEntity);
                setReadOnlyProperties(key, result);
                return data;
            }

            return null;
        } catch (exception: any) {
            console.log('No data loaded for key ' + key + '. Error: ' + exception.message);
        }

        return null;
    }

    remove = (key: string): void => {
        this._localStorageService.remove(this._gameNameSpace + '_' + key);
    }

    getSaveKeys = (): string[] => this._localStorageService.getKeys(this._gameNameSpace + '_' + DataKeys.GAME + '_');
}