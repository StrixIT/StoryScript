import {describe, beforeAll, test, expect} from 'vitest';
import {GetRegisteredEntities} from "storyScript/ObjectConstructors.ts";
import {ObjectFactory} from "storyScript/ObjectFactory.ts";
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {RunGame} from "../../../Games/MyRolePlayingGame/run";
import {IEntity} from "storyScript/Interfaces/entity.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";

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

describe("DataSerializer", () => {

    let pristineEntities: Record<string, Record<string, IEntity>>;
    let locations: ICompiledLocation[];

    beforeAll(() => {
        RunGame();
        const objectFactory = ObjectFactory.GetInstance();

        // Initialize the world so it is available for saving.
        const gameService = objectFactory.GetGameService();
        gameService.reset();
        locations = objectFactory.GetGame().locations;
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
        const result = serializer.createSerializableClone(locations, pristineEntities);
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

});