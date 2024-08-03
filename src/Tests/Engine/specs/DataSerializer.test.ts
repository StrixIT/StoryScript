import {beforeAll, describe, expect, test} from 'vitest';
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {RunGame} from "../../../Games/MyRolePlayingGame/run";
import {Garden} from "../../../Games/MyRolePlayingGame/locations/Garden.ts";
import {IGame} from "../../../Games/MyRolePlayingGame/interfaces/game.ts";
import {HelperService} from "storyScript/Services/helperService.ts";
import {IParty} from "../../../Games/MyRolePlayingGame/interfaces/party.ts";
import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer.ts";
import {ICompiledLocation} from "../../../Games/MyAdventureGame/interfaces/location.ts";
import {LocationService} from "storyScript/Services/LocationService.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";
import {Character} from "../../../Games/MyRolePlayingGame/types.ts";
import {Sword} from "../../../Games/MyRolePlayingGame/items/sword.ts";
import {StateProperties} from "storyScript/stateProperties.ts";
import {BasementKey} from "../../../Games/MyRolePlayingGame/items/basementKey.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {DirtRoad} from "../../../Games/MyRolePlayingGame/locations/DirtRoad.ts";
import {Basement} from "../../../Games/MyRolePlayingGame/locations/Basement.ts";
import {Library} from "../../../Games/MyRolePlayingGame/locations/Library.ts";
import {Start} from "../../../Games/MyRolePlayingGame/locations/start.ts";

const worldData = [{
    "destinations": [{"target": "garden"}],
    "items": [{"type": "item", "id": "journal"}],
    "type": "location",
    "id": "basement"
}, {
    "destinations": [{"target": "start"}],
    "enemies": [{
        "items": [{"type": "item", "id": "sword"}, {"type": "item", "id": "basementkey"}],
        "type": "enemy",
        "id": "bandit"
    }],
    "combatActions": [["RunInside"]],
    "type": "location",
    "id": "dirtroad"
}, {
    "destinations": [{"target": "start"}],
    "enterEvents": [["Squirrel"]],
    "actions": [["SearchShed"], ["LookInPond"]],
    "type": "location",
    "id": "garden"
}, {
    "destinations": [{"target": "start"}],
    "trade": [{"type": "trade", "id": "yourpersonalcloset"}],
    "type": "location",
    "id": "library"
}, {
    "destinations": [{"target": "library"}, {"target": "garden"}, {"target": "dirtroad"}],
    "persons": [{
        "items": [{"type": "item", "id": "sword"}],
        "conversation": {"actions": [["addHedgehog"]]},
        "quests": [{"type": "quest", "id": "journal"}],
        "type": "person",
        "id": "friend"
    }],
    "type": "location",
    "id": "start"
}];

const locationWithAddedDestination = {
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
    "actions": [["SearchShed"], ["LookInPond"]],
    "type": "location",
    "id": "garden"
};

const partyData = {
    "name": "Test Party",
    "currency": 10,
    "characters": [
        {
            "name": "Test",
            "level": 1,
            "hitpoints": 10,
            "strength": 1,
            "agility": 1,
            "intelligence": 1,
            "items": [
                {
                    "type": "item",
                    "id": "sword"
                }
            ],
            "equipment": {
                "head": null,
                "body": null,
                "leftHand": null,
                "rightHand": null,
                "feet": null
            }
        }
    ]
};

const partyDataEmptyArrays = {
    "name": "Test Party",
    "currency": 10,
    "quests": [],
    "characters": [
        {
            "name": "Test",
            "level": 1,
            "hitpoints": 10,
            "strength": 1,
            "agility": 1,
            "intelligence": 1,
            "items": [
            ],
            "equipment": {
                "head": null,
                "body": null,
                "leftHand": null,
                "rightHand": null,
                "feet": null
            }
        }
    ]
};

const gardenWithDeletedAction = {
    "destinations": [{"target": "start"}],
    "enterEvents": [["Squirrel"]],
    "actions": [["SearchShed"], {
        "0": "LookInPond",
        "ss_deleted": true,
    }],
    "type": "location",
    "id": "garden"
};

const gardenWithDeletedEvent = {
    "destinations": [{"target": "start"}],
    "enterEvents": [{ "0": "Squirrel", "ss_deleted" : true }],
    "actions": [["SearchShed"], ["LookInPond"]],
    "type": "location",
    "id": "garden"
};

const gardenWithAddedEvent = {
    "destinations": [{"target": "start"}],
    "enterEvents": [["Squirrel"], [ "Test", { "function": `function(game){
          return true;
    }`, "ss_added": true }]],
    "actions": [["SearchShed"], ["LookInPond"]],
    "type": "location",
    "id": "garden"
};

describe("DataSerializer", () => {

    let serializer: IDataSerializer;
    
    beforeAll(() => {
        RunGame();
        const serviceFactory = ServiceFactory.GetInstance();
        serializer = serviceFactory.GetDataSerializer();
    });

    test("should create and save a JSON clone of the world", function () {
        const result = serializer.createSerializableClone([
            Basement(),
            DirtRoad(),
            Garden(),
            Library(),
            Start()
        ]);
        expect(result).toEqual(worldData);
    });

    test("should restore a world skeleton from a serialized file", function () {
        const result = serializer.createSerializableClone(serializer.restoreObjects(worldData));
        expect(result).toEqual(worldData);
    });

    test("should create a clone with additional array properties when present", function () {
        const objectToCopy = {
            testArray: [
                1,
                2,
                3
            ]
        };

        (<any>objectToCopy.testArray).mapPath = 'test';
        const result = serializer.createSerializableClone(objectToCopy, null);
        const resultText = JSON.stringify({data: result});
        expect(resultText).toContain('"testArray_arrProps":{"mapPath":"test"}');
    });

    test("should create and save a JSON clone with items added at runtime", function () {
        const game = <IGame>{};
        const definitions = <IDefinitions><unknown>{ items: [ BasementKey ] };
        game.helpers = new HelperService(definitions);
        game.party = <IParty>{};
        game.party.characters = [];
        const locationService = new LocationService(definitions, <IRules>{}, game);
        const garden = <ICompiledLocation>Garden();
        locationService.initDestinations(garden);
        const searchShedAction = garden.actions.find(a => a[0] === 'SearchShed')[1];
        game.currentLocation = garden;
        (<(game: IGame) => boolean>searchShedAction.execute)(game);

        const result = serializer.createSerializableClone(game.currentLocation);
        // Remove the unique id to be able to compare the rest of the properties.
        delete result.destinations[1][StateProperties.Id];
        expect(result).toEqual(locationWithAddedDestination);
    });

    test("should serialize character data with only skeleton data", function () {
        const character = new Character();
        character.name = "Test";
        character.items = [
            Sword()
        ];

        const characterData = <IParty>{
            name: "Test Party",
            currency: 10,
            characters: [
                character
            ]
        };
        const result = serializer.createSerializableClone(characterData);
        expect(result).toEqual(partyData);
    });

    test("should serialize character data with empty arrays present", function () {
        const character = new Character();
        character.name = "Test";
        character.items = [
        ];

        const characterData = <IParty>{
            name: "Test Party",
            currency: 10,
            characters: [
                character
            ],
            quests: []
        };
        const result = serializer.createSerializableClone(characterData);
        expect(result).toEqual(partyDataEmptyArrays);
    });

    test("should serialize deleted actions with deleted flag", function () {
        const garden = Garden();
        garden.actions.delete(garden.actions[1]);
        const serialized = serializer.createSerializableClone(garden);
        expect(serialized).toEqual(gardenWithDeletedAction);
    });

    test("should serialize deleted events with deleted flag", function () {
        const garden = Garden();
        garden.enterEvents.delete(garden.enterEvents[0]);
        const serialized = serializer.createSerializableClone(garden);
        expect(serialized).toEqual(gardenWithDeletedEvent);
    });

    test("should serialize added events with added flag", function () {
        const garden = Garden();
        garden.enterEvents.add(['Test', (game) => { return true; }]);
        const serialized = serializer.createSerializableClone(garden);
        const expectedFunction = <any>gardenWithAddedEvent.enterEvents[1][1];
        expectedFunction.function = expectedFunction.function.replace(/\s{2,}/g,' ');
        const actualFunction = <any>serialized.enterEvents[1][1];
        actualFunction.function = actualFunction.function.replace(/\s{2,}/g,' ');
        expect(serialized).toEqual(gardenWithAddedEvent);
    });
    
});