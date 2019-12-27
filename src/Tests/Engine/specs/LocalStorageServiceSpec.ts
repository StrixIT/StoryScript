import { LocalStorageService } from 'storyScript/Services/LocalStorageService';
import { DataKeys } from 'storyScript/DataKeys';

describe("LocalStorage", function() {

    it("should store a value and retrieve it", function() {
        var service = new LocalStorageService();

        var key = 'storage';
        var value = JSON.stringify({
            name: 'test',
            values: [ 1, 2 ]
        });

        service.set(key, value);

        var loadedValue = JSON.parse(service.get(key));

        expect(loadedValue.name).toBe('test');

        // Use toEqual here because the parsed object isn't really an array.
        expect(loadedValue.values).toEqual([ 1, 2 ]);

        // Clean up
        localStorage.removeItem('StoryScript_' + key);
    });

    it("should get all the keys of saved values for the game", function() {
        var service = new LocalStorageService();
        var gameKey = 'MyRolePlayingGame' + '_' + DataKeys.GAME + '_';

        var keys = [ 'storage', 'new', 'test' ].sort();
        var values = [ 1, 2, 3];

        for (var i = 0; i < keys.length; i++)
        {
            service.set(gameKey + keys[i], values[i]);
        }

        var storageKeys = service.getKeys(gameKey).sort();
        expect(storageKeys).toEqual(keys);

        // Clean up
        for (var i = 0; i < keys.length; i++)
        {
            localStorage.removeItem('StoryScript_' + gameKey + keys[i]);
        }
    });
});