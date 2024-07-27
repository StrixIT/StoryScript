import {describe, beforeAll, test, expect} from 'vitest';
import {GetRegisteredEntities} from "storyScript/ObjectConstructors.ts";
import {ObjectFactory} from "storyScript/ObjectFactory.ts";
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {RunGame} from "../../../Games/MyRolePlayingGame/run";
import {IEntity} from "storyScript/Interfaces/entity.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {Garden} from "../../../Games/MyRolePlayingGame/locations/Garden.ts";
import {IGame} from "../../../Games/MyRolePlayingGame/interfaces/game.ts";
import {HelperService} from "storyScript/Services/helperService.ts";
import {IParty} from "../../../Games/MyRolePlayingGame/interfaces/party.ts";

const worldData = JSON.stringify({
    "data": [{
        "destinations": [{"target": "garden"}],
        "items": [{"type": "item", "id": "journal"}],
        "type": "location",
        "id": "basement",
        "actions": [],
        "combatActions": [],
        "features": [],
        "trade": [],
        "enemies": [],
        "persons": []
    }, {
        "destinations": [{"target": "start"}],
        "enemies": [{
            "items": [{"type": "item", "id": "sword"}, {"open": {}, "type": "item", "id": "basementkey"}],
            "type": "enemy",
            "id": "bandit"
        }],
        "combatActions": [["RunInside", {}]],
        "type": "location",
        "id": "dirtroad",
        "actions": [],
        "features": [],
        "trade": [],
        "items": [],
        "persons": []
    }, {
        "destinations": [{"target": "start"}],
        "enterEvents": [["Squirrel"]],
        "actions": [["SearchShed", {}], ["LookInPond", {}]],
        "type": "location",
        "id": "garden",
        "combatActions": [],
        "features": [],
        "trade": [],
        "items": [],
        "enemies": [],
        "persons": []
    }, {
        "destinations": [{"target": "start"}],
        "trade": [{"buy": {}, "sell": {}, "type": "trade", "id": "yourpersonalcloset"}],
        "type": "location",
        "id": "library",
        "actions": [],
        "combatActions": [],
        "features": [],
        "items": [],
        "enemies": [],
        "persons": []
    }, {
        "destinations": [{"target": "library"}, {"target": "garden"}, {"target": "dirtroad"}],
        "persons": [{
            "items": [{"type": "item", "id": "sword"}],
            "trade": {"buy": {}, "sell": {}},
            "conversation": {"actions": [["addHedgehog"]]},
            "quests": [{"type": "quest", "id": "journal"}],
            "type": "person",
            "id": "friend"
        }],
        "type": "location",
        "id": "start",
        "actions": [],
        "combatActions": [],
        "features": [],
        "trade": [],
        "items": [],
        "enemies": []
    }]
});

const locationWithAddedDestination = {
    "data": {
        "destinations": [{"target": "start"}, {
            "name": "Enter the basement",
            "target": "basement",
            "barrier": {
                "key": "basementkey",
                "name": "Wooden trap door",
                "actions": [["Inspect", {
                    "text": "Inspect",
                    "execute": "function(game2){\n                      game2.logToLocationLog(\"The trap door looks old but still strong due to steel reinforcements. It is locked.\");\n                    }"
                }]]
            },
            "ss_added": true
        }],
        "enterEvents": [["Squirrel"]],
        "actions": [["SearchShed", {}], ["LookInPond", {}]],
        "type": "location",
        "id": "garden",
        "combatActions": [],
        "features": [],
        "trade": [],
        "items": [],
        "enemies": [],
        "persons": []
    }
};

describe("DataSerializer", () => {

    let pristineEntities: Record<string, Record<string, IEntity>>;
    let game: IGame;

    beforeAll(() => {
        RunGame();
        const objectFactory = ObjectFactory.GetInstance();

        // Initialize the world so it is available for saving.
        const gameService = objectFactory.GetGameService();
        gameService.reset();
        game = objectFactory.GetGame();
        pristineEntities = GetRegisteredEntities();
    });

    test("should restore a world skeleton from a serialized file", function () {
        const serializer = new DataSerializer();
        const result = serializer.restoreObjects(JSON.parse(worldData).data);
        const resultText = JSON.stringify({data: serializer.createSerializableClone(result, pristineEntities)});
        expect(resultText).toBe(worldData);
    });

    test("should create and save a JSON clone of the world", function () {
        const serializer = new DataSerializer();
        const result = serializer.createSerializableClone(game.locations, pristineEntities);
        const resultText = JSON.stringify({data: result});
        expect(result).not.toBe(null);
        expect(worldData).toBe(resultText);
    });

    test("should create a clone with additional array properties when present", function () {
        const serializer = new DataSerializer();

        const objectToCopy = {
            testArray: [
                1,
                2,
                3
            ]
        };

        (<any>objectToCopy.testArray).mapPath = 'test';

        const result = serializer.createSerializableClone(objectToCopy, pristineEntities, null);
        const resultText = JSON.stringify({data: result});

        expect(resultText).toContain('"testArray_arrProps":{"mapPath":"test"}');
    });

    test("should create and save a JSON clone with items added at runtime", function () {
        const serializer = new DataSerializer();
        const garden = game.locations.get(Garden);
        const searchShedAction = garden.actions.find(a => a[0] === 'SearchShed')[1];
        game.currentLocation = garden;
        game.helpers = new HelperService(game);
        game.party = <IParty>{};
        game.party.characters = [];
        (<(game: IGame) => boolean>searchShedAction.execute)(game);

        const result = serializer.createSerializableClone(game.currentLocation, pristineEntities);
        const resultText = JSON.stringify({data: result});
        expect(resultText).toBe(JSON.stringify(locationWithAddedDestination));
    });

});