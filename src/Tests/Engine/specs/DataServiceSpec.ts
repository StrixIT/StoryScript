await import('../../../Games/MyRolePlayingGame/run');
import { DataService } from 'storyScript/Services/DataService';
import { IDataService } from 'storyScript/Interfaces/services/dataService';
import { ICollection, ICompiledLocation, IGame } from 'storyScript/Interfaces/storyScript';
import { GetFunctions } from 'storyScript/ObjectConstructors';
import { ObjectFactory } from "storyScript/ObjectFactory";
import { ILocalStorageService } from 'storyScript/Interfaces/services/localStorageService';
import { DataKeys } from 'storyScript/DataKeys';

const TESTGAMEPREFIX = '_TestGame';

describe("DataService", function() {
    let locations: ICollection<ICompiledLocation> = [];
    const originalWarn = console.warn

    let consoleOutput = []
    const consoleMock = output => consoleOutput.push(output);

    beforeAll(() => {
        var objectFactory = ObjectFactory.GetInstance();
        var game = objectFactory.GetGame();
    
        // Initialize the world so it is available for saving.
        var gameService = objectFactory.GetGameService();
        gameService.reset();
    
        locations = [...game.locations];

        // Right now, the LocationService loadWorld method needs to be called to
        // correctly initialize the destinations array adding the push proxy. Remove
        // the proxy to be able to compare.
        locations.forEach(l => delete l.destinations.push);
    });

    beforeEach(() => (console.warn = consoleMock));
    afterEach(() => (console.warn = originalWarn));

    it("should create and save a JSON clone of the world", function() {
        var { dataService, storageService } = getService();
        dataService.save('game', locations);
        var result = storageService.get(`${TESTGAMEPREFIX}_${'game'}`);
        var worldWithoutHashes = replaceHashes(worldData);
        var resultWithoutHashes = replaceHashes(result);

        expect(result).not.toBe(null);
        expect(resultWithoutHashes).toBe(worldWithoutHashes);
    });

    it("should recreate locations from a JSON clone of the world and warn when the order of functions in an array changed", function() {
        var { dataService } = getService();

        const loadResult = dataService.load(DataKeys.WORLD);
        expect(loadResult).not.toBe(null);
        expect(loadResult).toEqual(locations);
        expect(consoleOutput.length).toBe(0);

        var functionList = <any>GetFunctions();
        var gardenFunction0 = functionList.locations['garden|actions|0|execute'];
        var gardenFunction1 = functionList.locations['garden|actions|1|execute'];
        var old0Hash = gardenFunction0.hash;
        var old1Hash = gardenFunction1.hash;
        gardenFunction0.hash = old1Hash;
        gardenFunction1.hash = old0Hash;
        
        const saveResult = dataService.load(DataKeys.WORLD);

        expect(consoleOutput).toEqual([
            `Function with key: garden|actions|0|execute was found but the hash does not match the stored hash (old hash: 492355190, new hash: 1867314870)! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`,
            `Function with key: garden|actions|1|execute was found but the hash does not match the stored hash (old hash: 1867314870, new hash: 492355190)! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`
        ]);

        gardenFunction0.hash = old0Hash;
        gardenFunction1.hash = old1Hash;

        expect(saveResult).toEqual(locations);
    });

    it("should create a copy of a complex object", function() {
        var { dataService } = getService();
        var result = dataService.copy(locations, locations);
        var resultText = JSON.stringify({ data: result });

        var worldWithoutHashes = worldData.replace(hashRegex, '');
        var resultWithoutHashes = resultText.replace(hashRegex, '');

        // Compare the copy to the serialized world, as the clone does not have functions but only function pointers.
        expect(resultWithoutHashes).toBe(worldWithoutHashes);
    });

    it("should create a clone with additional array properties when present", function() {
        var { dataService } = getService();

        var objectToCopy = {
            testArray: [
                1,
                2,
                3
            ]
        };

        (<any>objectToCopy.testArray).mapPath = 'test';

        var result = dataService.copy(objectToCopy, objectToCopy);
        var resultText = JSON.stringify({ data: result });

        expect(resultText).toContain('"testArray_arrProps":{"mapPath":"test"}');
    });

    it("should return the storage keys", function() {
        var { dataService } = getService();
        var expected = saveKeys.sort();
        var result = dataService.getSaveKeys().sort();
        expect(result).toBe(expected);
    });

});

var hashRegex = /function#[[a-zA-Z0-9|]*#[-0-9]{6,11}/g;

var worldData = JSON.stringify({"data":[{"name":"Basement","description":null,"destinations":[{"name":"To the garden","target":"garden"}],"items":[{"name":"Joe's journal","equipmentType":10,"type":"item","id":"journal"}],"type":"location","id":"basement","actions":[],"combatActions":[],"features":[],"trade":[],"enemies":[],"persons":[]},{"name":"Dirt road","description":null,"destinations":[{"name":"Enter your home","target":"start"}],"enemies":[{"name":"Bandit","description":null,"hitpoints":10,"attack":"1d6","items":[{"name":"Sword","description":null,"damage":3,"equipmentType":6,"value":5,"type":"item","id":"sword"},{"name":"Basement key","keepAfterUse":false,"open":{"text":"Open","execute":"function#item|basementkey|open|execute#1301723351"},"equipmentType":10,"type":"item","id":"basementkey"}],"type":"enemy","id":"bandit","picture":"resources/bandit.jpg"}],"combatActions":[{"text":"Run back inside","execute":"function#location|dirtroad|combatActions|0|execute#-34161269"}],"type":"location","id":"dirtroad","actions":[],"features":[],"trade":[],"items":[],"persons":[]},{"name":"Garden","description":null,"destinations":[{"name":"Enter your home","target":"start"}],"enterEvents":["function#location|garden|enterEvents|0#-521820139"],"actions":[{"text":"Search the Shed","execute":"function#location|garden|actions|0|execute#492355190"},{"text":"Look in the pond","execute":"function#location|garden|actions|1|execute#1867314870"}],"type":"location","id":"garden","combatActions":[],"features":[],"trade":[],"items":[],"enemies":[],"persons":[]},{"name":"Bedroom","description":null,"destinations":[{"name":"Back to the living room","target":"start"}],"trade":[{"name":"Your personal closet","description":null,"buy":{"description":"Take out of closet","emptyText":"The closet is empty","itemSelector":"function#trade|yourpersonalcloset|buy|itemSelector#-757288170","maxItems":5,"priceModifier":0},"sell":{"description":"Put back in closet","emptyText":"You have nothing to put in the your closet","itemSelector":"function#trade|yourpersonalcloset|sell|itemSelector#-757288170","maxItems":5,"priceModifier":"function#trade|yourpersonalcloset|sell|priceModifier#-1683809711"},"type":"trade","id":"yourpersonalcloset"}],"type":"location","id":"bedroom","actions":[],"combatActions":[],"features":[],"items":[],"enemies":[],"persons":[]},{"name":"Home","description":null,"descriptionSelector":"function#location|start|descriptionSelector#1949117004","destinations":[{"name":"To the bedroom","target":"bedroom"},{"name":"To the garden","target":"garden"},{"name":"Out the front door","target":"dirtroad"}],"persons":[{"description":null,"name":"Joe","hitpoints":10,"attack":"1d6","items":[{"name":"Sword","description":null,"damage":3,"equipmentType":6,"value":5,"type":"item","id":"sword"}],"currency":10,"trade":{"ownItemsOnly":true,"buy":{"description":"I'm willing to part with these items...","emptyText":"I have nothing left to sell to you...","itemSelector":"function#person|friend|trade|buy|itemSelector#-757288170","maxItems":5},"sell":{"description":"These items look good, I'd like to buy them from you","emptyText":"You have nothing left that I'm interested in","itemSelector":"function#person|friend|trade|sell|itemSelector#-757288170","maxItems":5}},"conversation":{"actions":{"addHedgehog":"function#person|friend|conversation|actions|addHedgehog#629933660"}},"quests":[{"name":"Find Joe's journal","status":"function#quest|journal|status#-2037195664","start":"function#quest|journal|start#-1813683549","checkDone":"function#quest|journal|checkDone#1205948002","complete":"function#quest|journal|complete#-8548664","type":"quest","id":"journal"}],"type":"person","id":"friend","picture":"resources/bandit.jpg"}],"type":"location","id":"start","actions":[],"combatActions":[],"features":[],"trade":[],"items":[],"enemies":[]}]});

var saveKeys = [
    'game',
    'character'
];

var getStorageService = () => {
    return {
        value: {},
        set: function(key, data) {
            this.value[key] = data;
        },
        get: function(key) {
            if (key.indexOf(DataKeys.WORLD) > -1) {
                return worldData;
            }

            return this.value[key];
        },
        remove: function(key) {
        },
        getKeys: function() {
            return saveKeys;
        }
    }
};

function getService(): { dataService: IDataService, storageService: ILocalStorageService } {
    const storageService = getStorageService();
    return { dataService: new DataService(storageService, TESTGAMEPREFIX), storageService };
}

function replaceHashes(text) {
    var matches = text.match(hashRegex);

    matches.forEach(m => {
        text = text.replace(m, m.substring(0, m.lastIndexOf('#') + 1));
    });

    return text;
}