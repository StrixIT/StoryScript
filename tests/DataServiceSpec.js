describe("DataService", function() {

    beforeEach(() => {
        // Trigger object factory initialization.
        StoryScript.ObjectFactory.GetGame();
    });

    // Todo: activate when there is a solution for function hashes with code coverage.
    it("should create and save a JSON clone of the world", function() {
        var game = StoryScript.ObjectFactory.GetGame();

        // Initialize the world so it is available for saving.
        var locationService = StoryScript.ObjectFactory.GetGameService();
        locationService.reset();

        var service = getService();
        service.save('game', game.locations);
        var result = storageService.value;
        var worldWithoutHashes = worldData.replace(hashRegex, '');
        var resultWithoutHashes = result.replace(hashRegex, '');

        expect(result).not.toBe(null);
        expect(resultWithoutHashes).toBe(worldWithoutHashes);
    });

    it("should recreate locations from a JSON clone of the world", function() {
        var game = StoryScript.ObjectFactory.GetGame();

        // Initialize the world so it is available for comparing.
        var locationService = StoryScript.ObjectFactory.GetGameService();
        locationService.reset();

        var service = getService();
        var result = service.load('game');
        expect(result).not.toBe(null);
        
        // Right now, the LocationService loadWorld method needs to be called to
        // correctly initialize the destinations array adding the push proxy. Remove
        // the proxy to be able to compare.
        game.locations.forEach(l => delete l.destinations.push);

        expect(result).toEqual(game.locations);
    });

    // Todo: activate when there is a solution for function hashes with code coverage.
    it("should create a copy of a complex object", function() {
        var game = StoryScript.ObjectFactory.GetGame();

        // Initialize the world so it is available for comparing.
        var locationService = StoryScript.ObjectFactory.GetGameService();
        locationService.reset();

        var service = getService();
        var result = service.copy(game.locations, game.locations);
        var resultText = JSON.stringify({ data: result });

        var worldWithoutHashes = worldData.replace(hashRegex, '');
        var resultWithoutHashes = resultText.replace(hashRegex, '');

        // Compare the copy to the serialized world, as the clone does not have functions but only function pointers.
        expect(resultWithoutHashes).toBe(worldWithoutHashes);
    });

    it("should return the storage keys", function() {
        var service = getService();
        var expected = saveKeys.sort();
        var result = service.getSaveKeys().sort();
        expect(result).toBe(expected);
    });

    it("should return an item's description", function() {
        var service = getService();
        var expected = '<p>A regular sword</p>';
        var item =  { id: 'sword' };
        var result = service.loadDescription('items', item);      
        expect(result).toBe(expected);
        expect(item.description).toBe(expected);
        expect(item.hasHtmlDescription).toBeTruthy();;
    });

    it("should return true when checking that an enemy with a html file has a description", function() {
        var service = getService();
        var enemy =  { id: 'bandit' };
        var result = service.hasDescription('enemies', enemy);
        expect(result).toBeTruthy();
    });

    var hashRegex = /function#[[a-zA-Z0-9_]*#[-0-9]{6,11}/g;

    var worldData = JSON.stringify({"data":[{"name":"Basement","destinations":[{"name":"To the garden","target":"garden"}],"items":[{"name":"Joe's journal","equipmentType":10,"id":"journal","type":"item"}],"id":"basement","type":"location","actions":[],"combatActions":[],"features":[],"enemies":[],"persons":[]},{"name":"Dirt road","destinations":[{"name":"Enter your home","target":"start"}],"enemies":[{"name":"Bandit","hitpoints":10,"attack":"1d6","items":[{"name":"Sword","damage":"3","equipmentType":6,"value":5,"id":"sword","type":"item"},{"name":"Basement key","keepAfterUse":false,"open":{"text":"Open","execute":"function#item_basementkey_open_execute#754946649"},"equipmentType":10,"id":"basementkey","type":"item"}],"id":"bandit","type":"enemy"}],"combatActions":[{"text":"Run back inside","execute":"function#location_dirtroad_combatActions_0_execute#-1667032073"}],"id":"dirtroad","type":"location","actions":[],"features":[],"items":[],"persons":[]},{"name":"Garden","destinations":[{"name":"Enter your home","target":"start"}],"enterEvents":["function#location_garden_enterEvents_0#1001771730"],"actions":[{"text":"Search the Shed","execute":"function#location_garden_actions_0_execute#1148949034"},{"text":"Look in the pond","execute":"function#location_garden_actions_1_execute#-686344405"}],"id":"garden","type":"location","combatActions":[],"features":[],"items":[],"enemies":[],"persons":[]},{"name":"Bedroom","destinations":[{"name":"Back to the living room","target":"start"}],"trade":{"title":"Your personal closet","description":"Do you want to take something out of your closet or put it back in?","buy":{"description":"Take out of closet","emptyText":"The closet is empty","itemSelector":"function#location_bedroom_trade_buy_itemSelector#1299522646","maxItems":5,"priceModifier":0},"sell":{"description":"Put back in closet","emptyText":"You have nothing to put in the your closet","itemSelector":"function#location_bedroom_trade_sell_itemSelector#1094384438","maxItems":5,"priceModifier":"function#location_bedroom_trade_sell_priceModifier#61439201"}},"id":"bedroom","type":"location","actions":[],"combatActions":[],"features":[],"items":[],"enemies":[],"persons":[]},{"name":"Home","descriptionSelector":"function#location_start_descriptionSelector#1203948793","destinations":[{"name":"To the bedroom","target":"bedroom"},{"name":"To the garden","target":"garden"},{"name":"Out the front door","target":"dirtroad"}],"persons":[{"name":"Joe","hitpoints":10,"attack":"1d6","items":[{"name":"Sword","damage":"3","equipmentType":6,"value":5,"id":"sword","type":"item"}],"currency":10,"trade":{"ownItemsOnly":true,"buy":{"description":"I'm willing to part with these items...","emptyText":"I have nothing left to sell to you...","itemSelector":"function#person_friend_trade_buy_itemSelector#998156284","maxItems":5},"sell":{"description":"These items look good, I'd like to buy them from you","emptyText":"You have nothing left that I'm interested in","itemSelector":"function#person_friend_trade_sell_itemSelector#793018076","maxItems":5}},"conversation":{"actions":{"addHedgehog":"function#person_friend_conversation_actions_addHedgehog#1740029149"}},"quests":[{"name":"Find Joe's journal","status":"function#quest_journal_status#-1281085324","start":"function#quest_journal_start#-966668273","checkDone":"function#quest_journal_checkDone#1085837017","complete":"function#quest_journal_complete#1357817958","id":"journal","type":"quest"}],"id":"friend","type":"person"}],"id":"start","type":"location","actions":[],"combatActions":[],"features":[],"items":[],"enemies":[]}]});

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
            return worldData;
        },
        getKeys: function() {
            return saveKeys;
        }
    };

    function getService() {
        return new StoryScript.DataService(storageService, '_TestGame');
    }
});