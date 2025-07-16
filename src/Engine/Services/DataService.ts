import {isEmpty} from '../utilityFunctions';
import {IDataService} from '../Interfaces/services/dataService';
import {ILocalStorageService} from '../Interfaces/services/localStorageService';
import {IDataSerializer} from 'storyScript/Interfaces/services/dataSerializer';
import {IDataSynchronizer} from 'storyScript/Interfaces/services/dataSynchronizer';
import {GameStateSave, SaveGamePrefix} from "../../../constants.ts";
import {ISaveGame} from "storyScript/Interfaces/saveGame.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {IGame} from "storyScript/Interfaces/game.ts";

export class DataService implements IDataService {

    constructor(
        private _localStorageService: ILocalStorageService,
        private serializer: IDataSerializer,
        private synchronizer: IDataSynchronizer,
        private _rules: IRules,
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

    saveGame = (game: IGame, name?: string): void => {
        name = name ? SaveGamePrefix + name : GameStateSave;
        this._rules.general?.beforeSave?.(game);

        const saveGame = <ISaveGame>{
            party: game.party,
            world: game.locations,
            maps: game.maps,
            worldProperties: game.worldProperties,
            statistics: game.statistics,
            playedAudio: game.sounds.playedAudio
        };

        this.save(name, saveGame);

        if (game.playState === PlayState.Menu) {
            game.playState = null;
        }

        this._rules.general.afterSave?.(game);
    }

    getSaveKeys = (): string[] => this._localStorageService.getKeys(this.getKey(SaveGamePrefix));

    private getKey = (key?: string): string => {
        return key ? `${this._gameNameSpace}_${key}` : this._gameNameSpace;
    }
}