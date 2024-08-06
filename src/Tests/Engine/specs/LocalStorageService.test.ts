import {describe, expect, test} from 'vitest';
import {LocalStorageService} from 'storyScript/Services/LocalStorageService';

describe("LocalStorage", function () {

    test("should store a value and retrieve it", function () {
        const service = new LocalStorageService();

        const key = 'storage';
        const value = JSON.stringify({
            name: 'test',
            values: [1, 2]
        });

        service.set(key, value);

        const loadedValue = JSON.parse(service.get(key));

        expect(loadedValue.name).toBe('test');

        // Use toEqual here because the parsed object isn't really an array.
        expect(loadedValue.values).toEqual([1, 2]);

        // Clean up
        localStorage.removeItem(key);
    });

    test("should get all the keys of saved values for the game", function () {
        const service = new LocalStorageService();
        const prefix = 'prefix';
        const keys = ['storage', 'new', 'test'].sort();
        const values = [1, 2, 3];

        for (let i = 0; i < keys.length; i++) {
            service.set(`${prefix}_${keys[i]}`, values[i]);
        }

        const storageKeys = service.getKeys(prefix).sort();
        expect(storageKeys).toEqual(keys);

        // Clean up
        for (let i = 0; i < keys.length; i++) {
            localStorage.removeItem(keys[i]);
        }
    });
});