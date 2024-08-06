import {isEmpty} from '../utilityFunctions';
import {IDataService} from '../Interfaces/services/dataService';
import {ILocalStorageService} from '../Interfaces/services/localStorageService';
import {IDataSerializer} from 'storyScript/Interfaces/services/dataSerializer';
import {IDataSynchronizer} from 'storyScript/Interfaces/services/dataSynchronizer';
import {DefaultSaveGame} from "../../../constants.ts";

export class DataService implements IDataService {

    constructor(
        private _localStorageService: ILocalStorageService,
        private serializer: IDataSerializer,
        private synchronizer: IDataSynchronizer,
        private _gameNameSpace: string) {
    }

    save = <T>(key: string, value: T): void => {
        const clone = this.serializer.createSerializableClone(value);
        this._localStorageService.set(this.getKey(key), JSON.stringify({data: clone}));
    }

    load = <T>(key: string): T => {
        try {
            const jsonData = this._localStorageService.get(this.getKey(key));

            if (jsonData) {
                const data = JSON.parse(jsonData).data;

                if (isEmpty(data)) {
                    return null;
                }

                const result = this.serializer.restoreObjects(data);
                this.synchronizer.synchronizeEntityData(result);
                return result;
            }

            return null;
        } catch (exception: any) {
            console.log('No data loaded for key ' + key + '. Error: ' + exception.message);
        }

        return null;
    }

    remove = (key: string): void => {
        this._localStorageService.remove(this.getKey(key));
    }

    getSaveKeys = (): string[] => this._localStorageService.getKeys(this.getKey()).filter(k => k !== DefaultSaveGame);

    private getKey = (key?: string): string => {
        return key ? `${this._gameNameSpace}_${key}` : this._gameNameSpace;
    }
}