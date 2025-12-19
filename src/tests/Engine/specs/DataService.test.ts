import {describe, expect, test} from 'vitest';
import {DataService} from 'storyScript/Services/DataService';
import {IDataService} from 'storyScript/Interfaces/services/dataService';
import {ILocalStorageService} from 'storyScript/Interfaces/services/localStorageService';
import {DataSerializer} from 'storyScript/Services/DataSerializer';
import {IDataSynchronizer} from 'storyScript/Interfaces/services/dataSynchronizer';
import {getStorageServiceMock} from '../helpers';
import {IRules} from "storyScript/Interfaces/rules/rules.ts";

const TESTGAMEPREFIX = '_TestGame';

describe("DataService", function () {

    test("should return the storage keys", function () {
        const {dataService} = getService();
        const expected = saveKeys.sort();
        const result = dataService.getSaveKeys().sort();
        expect(result).toEqual(expected);
    });

});

const saveKeys = [
    'game',
    'character'
];

function getService(): { dataService: IDataService, storageService: ILocalStorageService } {
    const storageService = getStorageServiceMock();
    const pristineEntities = {};
    storageService.set(saveKeys[0], '');
    storageService.set(saveKeys[1], '');
    const serializer = new DataSerializer(pristineEntities);
    const synchronizerMock = <IDataSynchronizer>{
        synchronizeEntityData: () => {
        }
    }
    return {
        dataService: new DataService(storageService, serializer, synchronizerMock, <IRules>{}, TESTGAMEPREFIX),
        storageService
    };
}