import { describe, beforeAll, beforeEach, afterEach, test, expect } from 'vitest';
import { ICollection, ICompiledLocation } from "../../../Engine/Interfaces/storyScript";
import { GetFunctions } from "../../../Engine/ObjectConstructors";
import { ObjectFactory } from "../../../Engine/ObjectFactory";
import { DataSerializer } from "../../../Engine/Services/DataSerializer";
import { RunGame } from "../../../Games/MyRolePlayingGame/run";

const worldData = JSON.stringify({"data":[{"name":"Basement","description":null,"destinations":[{"name":"To the garden","target":"garden"}],"items":[{"name":"Joe's journal","equipmentType":10,"type":"item","id":"journal"}],"type":"location","id":"basement","actions":[],"combatActions":[],"features":[],"trade":[],"enemies":[],"persons":[]},{"name":"Dirt road","description":null,"destinations":[{"name":"Enter your home","target":"start"}],"enemies":[{"name":"Bandit","description":null,"hitpoints":10,"attack":"1d6","items":[{"name":"Sword","description":null,"damage":3,"equipmentType":6,"value":5,"type":"item","id":"sword"},{"name":"Basement key","keepAfterUse":false,"open":{"text":"Open","execute":"function#item|basementkey|open|execute#1317658591"},"equipmentType":10,"type":"item","id":"basementkey"}],"type":"enemy","id":"bandit","picture":"resources/bandit.jpg"}],"combatActions":[{"text":"Run back inside","execute":"function#location|dirtroad|combatActions|0|execute#-34161269"}],"type":"location","id":"dirtroad","actions":[],"features":[],"trade":[],"items":[],"persons":[]},{"name":"Garden","description":null,"destinations":[{"name":"Enter your home","target":"start"}],"enterEvents":[{"Squirrel":"function#location|garden|enterEvents|0|Squirrel#-1552061099"}],"actions":[{"text":"Search the Shed","execute":"function#location|garden|actions|0|execute#630024115"},{"text":"Look in the pond","execute":"function#location|garden|actions|1|execute#1867314870"}],"type":"location","id":"garden","combatActions":[],"features":[],"trade":[],"items":[],"enemies":[],"persons":[]},{"name":"Library","description":null,"destinations":[{"name":"Back to the living room","target":"start"}],"trade":[{"name":"Your personal closet","text":"Do you want to take something out of your closet or put it back in?","buy":{"text":"Take out of closet","emptyText":"The closet is empty","itemSelector":"function#trade|yourpersonalcloset|buy|itemSelector#-757288170","maxItems":5,"priceModifier":0},"sell":{"text":"Put back in closet","emptyText":"You have nothing to put in the your closet","itemSelector":"function#trade|yourpersonalcloset|sell|itemSelector#-757288170","maxItems":5,"priceModifier":"function#trade|yourpersonalcloset|sell|priceModifier#-1683809711"},"type":"trade","id":"yourpersonalcloset"}],"type":"location","id":"library","actions":[],"combatActions":[],"features":[],"items":[],"enemies":[],"persons":[]},{"name":"Home","description":null,"descriptionSelector":"function#location|start|descriptionSelector#1949117004","destinations":[{"name":"To the library","target":"library"},{"name":"To the garden","target":"garden"},{"name":"Out the front door","target":"dirtroad"}],"persons":[{"description":null,"name":"Joe","hitpoints":10,"attack":"1d6","items":[{"name":"Sword","description":null,"damage":3,"equipmentType":6,"value":5,"type":"item","id":"sword"}],"currency":10,"trade":{"ownItemsOnly":true,"buy":{"text":"I'm willing to part with these items...","emptyText":"I have nothing left to sell to you...","itemSelector":"function#person|friend|trade|buy|itemSelector#-757288170","maxItems":5},"sell":{"text":"These items look good, I'd like to buy them from you","emptyText":"You have nothing left that I'm interested in","itemSelector":"function#person|friend|trade|sell|itemSelector#-757288170","maxItems":5}},"conversation":{"actions":{"addHedgehog":"function#person|friend|conversation|actions|addHedgehog#-1850455813"}},"quests":[{"name":"Find Joe's journal","status":"function#quest|journal|status#-2037195664","start":"function#quest|journal|start#-1813683549","checkDone":"function#quest|journal|checkDone#-1526051501","complete":"function#quest|journal|complete#1879925505","type":"quest","id":"journal"}],"type":"person","id":"friend","picture":"resources/bandit.jpg"}],"type":"location","id":"start","actions":[],"combatActions":[],"features":[],"trade":[],"items":[],"enemies":[]}]});

describe("DataSerializer", () => {

    let locations: ICollection<ICompiledLocation> = [];
    const originalWarn = console.warn

    const consoleOutput = [];
    const consoleMock = output => consoleOutput.push(output);

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
const timeStampRegex = /\"ss_buildTimeStamp\"\:[ 0-9]{2,}\,/g;

function replaceHashes(text: string) {
    const hashMatches = text.match(hashRegex);

    hashMatches?.forEach(m => {
        text = text.replace(m, m.substring(0, m.lastIndexOf('#') + 1));
    });

    const timeStampMatches = text.match(timeStampRegex);

    timeStampMatches?.forEach(m => {
        text = text.replace(m, '');
    });

    return text;
}