import {describe, expect, test} from 'vitest';
import {DataSerializer, DataService} from 'src/Engine/Services';
import {IDataService, IDataSynchronizer, ILocalStorageService, IRules} from 'storyScript';
import {getStorageServiceMock} from '../../helpers';

const TestGamePrefix = '_TestGame';

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
        dataService: new DataService(storageService, serializer, synchronizerMock, <IRules>{}, TestGamePrefix),
        storageService
    };
}