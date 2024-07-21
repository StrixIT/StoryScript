import { describe, beforeAll, beforeEach, afterEach, test, expect } from 'vitest';
import { ICollection, ICompiledLocation } from "../../../Engine/Interfaces/storyScript";
import { GetFunctions } from "storyScript/ObjectConstructors.ts";
import { ObjectFactory } from "storyScript/ObjectFactory.ts";
import { DataSerializer } from "storyScript/Services/DataSerializer.ts";
import { RunGame } from "../../../Games/MyRolePlayingGame/run";

const worldData = JSON.stringify({"data":[{"destinations":[{}],"items":[{"type":"item","id":"journal"}],"type":"location","id":"basement","actions":[],"combatActions":[],"features":[],"trade":[],"enemies":[],"persons":[]},{"destinations":[{}],"enemies":[{"items":[{"type":"item","id":"sword"},{"open":{},"type":"item","id":"basementkey"}],"type":"enemy","id":"bandit"}],"combatActions":[{}],"type":"location","id":"dirtroad","actions":[],"features":[],"trade":[],"items":[],"persons":[]},{"destinations":[{}],"enterEvents":[{}],"actions":[{},{}],"type":"location","id":"garden","combatActions":[],"features":[],"trade":[],"items":[],"enemies":[],"persons":[]},{"destinations":[{}],"trade":[{"buy":{},"sell":{},"type":"trade","id":"yourpersonalcloset"}],"type":"location","id":"library","actions":[],"combatActions":[],"features":[],"items":[],"enemies":[],"persons":[]},{"destinations":[{},{},{}],"persons":[{"items":[{"type":"item","id":"sword"}],"trade":{"buy":{},"sell":{}},"conversation":{"actions":{}},"quests":[{"type":"quest","id":"journal"}],"type":"person","id":"friend"}],"type":"location","id":"start","actions":[],"combatActions":[],"features":[],"trade":[],"items":[],"enemies":[]}]});

describe("DataSerializer", () => {

    let locations: ICollection<ICompiledLocation> = [];
    const originalWarn: any = console.warn;

    const consoleOutput = [];
    const consoleMock: any = (output: any[]) => consoleOutput.push(output);

    beforeAll(() => {
        RunGame();
        const objectFactory = ObjectFactory.GetInstance();
        const game = objectFactory.GetGame();
    
        // Initialize the world so it is available for saving.
        const gameService = objectFactory.GetGameService();
        gameService.reset();
    
        locations = [...game.locations];
    });

    beforeEach(() => (console.warn = consoleMock));
    afterEach(() => (console.warn = originalWarn));

    test("should recreate locations from a JSON clone of the world and warn when the order of functions in an array changed", function() {
        const serializer = new DataSerializer();
        const result = serializer.restoreObjects(GetFunctions(), null, JSON.parse(worldData).data);
        const resultText = JSON.stringify({ data: serializer.buildClone(null, result, null) });
        const worldWithoutHashes = replaceHashes(worldData);
        const resultWithoutHashes = replaceHashes(resultText);

        expect(worldWithoutHashes).toBe(resultWithoutHashes);
        expect(consoleOutput.length).toBe(0);

        const functionList = <any>GetFunctions();
        const gardenFunction0 = functionList.locations['garden|actions|0|execute'];
        const gardenFunction1 = functionList.locations['garden|actions|1|execute'];
        const old0Hash = gardenFunction0.hash;
        const old1Hash = gardenFunction1.hash;
        gardenFunction0.hash = old1Hash;
        gardenFunction1.hash = old0Hash;
        
        const saveResult = serializer.restoreObjects(GetFunctions(), null, JSON.parse(worldData).data);
        const saveResultText = JSON.stringify({ data: serializer.buildClone(null, saveResult, null) });
        const saveResultWithoutHashes = replaceHashes(saveResultText);

        expect(consoleOutput).toEqual([
            `Function with key: garden|actions|0|execute was found but the hash does not match the stored hash (old hash: 630024115, new hash: 1867314870)! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`,
            `Function with key: garden|actions|1|execute was found but the hash does not match the stored hash (old hash: 1867314870, new hash: 630024115)! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`
        ]);

        gardenFunction0.hash = old0Hash;
        gardenFunction1.hash = old1Hash;
        
        expect(worldWithoutHashes).toBe(saveResultWithoutHashes);
    });

    test("should create and save a JSON clone of the world", function() {
        const serializer = new DataSerializer();
        const result = serializer.buildClone(null, locations, null);
        const resultText = JSON.stringify({ data: result });
        const worldWithoutHashes = replaceHashes(worldData);
        const resultWithoutHashes = replaceHashes(resultText);

        expect(result).not.toBe(null);
        expect(resultWithoutHashes).toBe(worldWithoutHashes);
    });

    test("should create a copy of a complex object", function() {
        const serializer = new DataSerializer();
        const result = serializer.buildClone(null, locations, locations);
        const resultText = JSON.stringify({ data: result });
        const worldWithoutHashes = replaceHashes(worldData);
        const resultWithoutHashes = replaceHashes(resultText);

        // Compare the copy to the serialized world, as the clone does not have functions but only function pointers.
        expect(resultWithoutHashes).toEqual(worldWithoutHashes);
    });

    test("should create a clone with additional array properties when present", function() {
        const serializer = new DataSerializer();

        const objectToCopy = {
            testArray: [
                1,
                2,
                3
            ]
        };

        (<any>objectToCopy.testArray).mapPath = 'test';

        const result = serializer.buildClone(null, objectToCopy, objectToCopy);
        const resultText = JSON.stringify({ data: result });

        expect(resultText).toContain('"testArray_arrProps":{"mapPath":"test"}');
    });

});

const hashRegex = /function#[[a-zA-Z0-9|]*#[-0-9]{6,11}/g;

function replaceHashes(text: string) {
    const hashMatches = text.match(hashRegex);

    hashMatches?.forEach(m => {
        text = text.replace(m, m.substring(0, m.lastIndexOf('#') + 1));
    });

    return text;
}