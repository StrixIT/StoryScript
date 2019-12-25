import { GetObjectFactory } from 'storyScript/run';
import { DataService } from 'storyScript/Services/DataService';
import { IDataService } from 'storyScript/Interfaces/services/dataService';
import { IGame } from 'storyScript/Interfaces/storyScript';
import { ILocationCollection } from 'storyScript/Interfaces/locationCollection';
import { GetFunctions } from 'storyScript/ObjectConstructors';
import '../../../Games/MyRolePlayingGame/run';

describe("DataService", function() {
    const originalWarn = console.warn

    let consoleOutput = []
    const consoleMock = output => consoleOutput.push(output);

    beforeEach(() => (console.warn = consoleMock));
    afterEach(() => (console.warn = originalWarn));

    it("should create and save a JSON clone of the world", function() {
        var game = initWorld();
        var service = getService();
        service.save('game', game.locations);
        var result = storageService.value;
        var worldWithoutHashes = replaceHashes(worldData);
        var resultWithoutHashes = replaceHashes(result);

        expect(result).not.toBe(null);
        expect(resultWithoutHashes).toBe(worldWithoutHashes);
    });

    it("should recreate locations from a JSON clone of the world", function() {
        var game = initWorld();
        var service = getService();
        var result = service.load('game');
        expect(result).not.toBe(null);
        
        // Right now, the LocationService loadWorld method needs to be called to
        // correctly initialize the destinations array adding the push proxy. Remove
        // the proxy to be able to compare.
        game.locations.forEach(l => delete l.destinations.push);

        expect(result).toEqual(game.locations);
    });

    it("should warn when the order of functions in an array changed", function() {
        var game = initWorld();
        var service = getService();

        service.save('world', game.locations);

        var functionList = <any>GetFunctions();
        var gardenFunction0 = functionList.locations['garden|actions|0|execute'];
        var gardenFunction1 = functionList.locations['garden|actions|1|execute'];
        var old0Hash = gardenFunction0.hash;
        gardenFunction0.hash = gardenFunction1.hash;
        gardenFunction1.hash = old0Hash;
        
        <ILocationCollection>service.load('game');

        expect(consoleOutput).toEqual([
            `Function with key: garden|actions|0|execute was found but the hash does not match the stored hash! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`,
            `Function with key: garden|actions|1|execute was found but the hash does not match the stored hash! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`
        ]);
    });

    it("should create a copy of a complex object", function() {
        var game = initWorld();
        var service = getService();
        var result = service.copy(game.locations, game.locations);
        var resultText = JSON.stringify({ data: result });

        var worldWithoutHashes = worldData.replace(hashRegex, '');
        var resultWithoutHashes = resultText.replace(hashRegex, '');

        // Compare the copy to the serialized world, as the clone does not have functions but only function pointers.
        expect(resultWithoutHashes).toBe(worldWithoutHashes);
    });

    it("should create a clone with additional array properties when present", function() {
        var service = getService();

        var objectToCopy = {
            testArray: [
                1,
                2,
                3
            ]
        };

        (<any>objectToCopy.testArray).mapPath = 'test';

        var result = service.copy(objectToCopy, objectToCopy);
        var resultText = JSON.stringify({ data: result });

        expect(resultText).toContain('"testArray_arrProps":{"mapPath":"test"}');
    });

    it("should return the storage keys", function() {
        var service = getService();
        var expected = saveKeys.sort();
        var result = service.getSaveKeys().sort();
        expect(result).toBe(expected);
    });

    var hashRegex = /function#[[a-zA-Z0-9|]*#[-0-9]{6,11}/g;

    var worldData = JSON.stringify({"data":[{"name":"Basement","description":null,"destinations":[{"name":"To the garden","target":"garden"}],"items":[{"name":"Joe's journal","equipmentType":10,"type":"item","id":"journal"}],"type":"location","id":"basement","actions":[],"combatActions":[],"features":[],"enemies":[],"persons":[]},{"name":"Dirt road","description":null,"destinations":[{"name":"Enter your home","target":"start"}],"enemies":[{"name":"Bandit","description":null,"hitpoints":10,"attack":"1d6","items":[{"name":"Sword","description":null,"damage":"3","equipmentType":6,"value":5,"type":"item","id":"sword"},{"name":"Basement key","keepAfterUse":false,"open":{"text":"Open","execute":"function#item|basementkey|open|execute#312961663"},"equipmentType":10,"type":"item","id":"basementkey"}],"type":"enemy","id":"bandit","picture":"resources/bandit.jpg"}],"combatActions":[{"text":"Run back inside","execute":"function#location|dirtroad|combatActions|0|execute#1245674738"}],"type":"location","id":"dirtroad","actions":[],"features":[],"items":[],"persons":[]},{"name":"Garden","description":null,"destinations":[{"name":"Enter your home","target":"start"}],"enterEvents":["function#location|garden|enterEvents|0#-1677062687"],"actions":[{"text":"Search the Shed","execute":"function#location|garden|actions|0|execute#-452619560"},{"text":"Look in the pond","execute":"function#location|garden|actions|1|execute#131026483"}],"type":"location","id":"garden","combatActions":[],"features":[],"items":[],"enemies":[],"persons":[]},{"name":"Bedroom","description":null,"destinations":[{"name":"Back to the living room","target":"start"}],"trade":[{"title":"Your personal closet","description":"Do you want to take something out of your closet or put it back in?","buy":{"description":"Take out of closet","emptyText":"The closet is empty","itemSelector":"function#location|bedroom|trade|0|buy|itemSelector#-589556356","maxItems":5,"priceModifier":0},"sell":{"description":"Put back in closet","emptyText":"You have nothing to put in the your closet","itemSelector":"function#location|bedroom|trade|0|sell|itemSelector#-589556356","maxItems":5,"priceModifier":"function#location|bedroom|trade|0|sell|priceModifier#700782575"}}],"type":"location","id":"bedroom","actions":[],"combatActions":[],"features":[],"items":[],"enemies":[],"persons":[]},{"name":"Home","description":null,"descriptionSelector":"function#location|start|descriptionSelector#283150339","destinations":[{"name":"To the bedroom","target":"bedroom"},{"name":"To the garden","target":"garden"},{"name":"Out the front door","target":"dirtroad"}],"persons":[{"description":null,"name":"Joe","hitpoints":10,"attack":"1d6","items":[{"name":"Sword","description":null,"damage":"3","equipmentType":6,"value":5,"type":"item","id":"sword"}],"currency":10,"trade":{"ownItemsOnly":true,"buy":{"description":"I'm willing to part with these items...","emptyText":"I have nothing left to sell to you...","itemSelector":"function#person|friend|trade|buy|itemSelector#460299644","maxItems":5},"sell":{"description":"These items look good, I'd like to buy them from you","emptyText":"You have nothing left that I'm interested in","itemSelector":"function#person|friend|trade|sell|itemSelector#460299644","maxItems":5}},"conversation":{"actions":{"addHedgehog":"function#person|friend|conversation|actions|addHedgehog#1178137932"}},"quests":[{"name":"Find Joe's journal","status":"function#quest|journal|status#-2014688882","start":"function#quest|journal|start#-2016710256","checkDone":"function#quest|journal|checkDone#-1717823906","complete":"function#quest|journal|complete#435540082","type":"quest","id":"journal"}],"type":"person","id":"friend","picture":"resources/bandit.jpg"}],"type":"location","id":"start","actions":[],"combatActions":[],"features":[],"items":[],"enemies":[]}]});

    var saveKeys = [
        'game',
        'character'
    ];

    var storageService = {
        value: null,
        set: function(key, data) {
            this.value = data;
        },
        get: function(key) {
            return this.value ?? worldData;
        },
        getKeys: function() {
            return saveKeys;
        }
    };

    function initWorld(): IGame {
        var objectFactory = GetObjectFactory();
        var game = objectFactory.GetGame();

        // Initialize the world so it is available for saving.
        var locationService = objectFactory.GetGameService();
        locationService.reset();

        return game;
    }

    function getService(): IDataService {
        return new DataService(storageService, '_TestGame');
    }

    function replaceHashes(text) {
        var matches = text.match(hashRegex);

        matches.forEach(m => {
            text = text.replace(m, m.substring(0, m.lastIndexOf('#') + 1));
        });

        return text;
    }
});