import { describe, test, expect } from 'vitest';
import { DataService } from 'storyScript/Services/DataService';
import { IDataService } from 'storyScript/Interfaces/services/dataService';
import { ILocalStorageService } from 'storyScript/Interfaces/services/localStorageService';
import { DataSerializer } from 'storyScript/Services/DataSerializer';
import { IDataSynchronizer } from 'storyScript/Interfaces/services/dataSynchronizer';
import { getStorageServiceMock } from '../helpers';

const TESTGAMEPREFIX = '_TestGame';

describe("DataService", function() {

    test("should return the storage keys", function() {
        var { dataService } = getService();
        var expected = saveKeys.sort();
        var result = dataService.getSaveKeys().sort();
        expect(result).toEqual(expected);
    });

});

var saveKeys = [
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
        synchronizeEntityData: () => {}
    }
    return { dataService: new DataService(storageService, serializer, synchronizerMock, pristineEntities, TESTGAMEPREFIX), storageService };
}