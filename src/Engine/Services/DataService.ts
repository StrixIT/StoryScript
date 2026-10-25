import {isEmpty} from '../utilityFunctions';
import {
    IDataSerializer,
    IDataService,
    IDataSynchronizer,
    IGame,
    ILocalStorageService,
    IRules,
    ISaveGame,
    PlayState
}from 'storyScript';
import {GameStateSave, SaveGamePrefix} from "src/constants";

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
        if (!game.started) {
            return;
        }

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

    hasGameState = (): boolean => {
        const state = this._localStorageService.get(this.getKey(GameStateSave));
        return state !== null;
    }

    private getKey = (key?: string): string => {
        return key ? `${this._gameNameSpace}_${key}` : this._gameNameSpace;
    }
}