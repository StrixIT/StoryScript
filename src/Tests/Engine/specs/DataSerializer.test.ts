import {beforeAll, describe, expect, test} from 'vitest';
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {RunGame} from "../../../Games/MyRolePlayingGame/run";
import {Garden} from "../../../Games/MyRolePlayingGame/locations/Garden.ts";
import {IGame} from "../../../Games/MyRolePlayingGame/interfaces/game.ts";
import {HelperService} from "storyScript/Services/HelperService.ts";
import {IParty} from "../../../Games/MyRolePlayingGame/interfaces/party.ts";
import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer.ts";
import {ICompiledLocation} from "../../../Games/MyAdventureGame/interfaces/location.ts";
import {LocationService} from "storyScript/Services/LocationService.ts";
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
import {IDestination} from "storyScript/Interfaces/destination.ts";
import {Friend} from "../../../Games/MyRolePlayingGame/persons/Friend.ts";
import {ConversationService} from "storyScript/Services/ConversationService.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

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
        "barriers": [["TrapDoor", {
            "key": "basementkey",
            "name": "Wooden trap door",
            "actions": [["Inspect", {
                "text": "Inspect",
                "execute": "function(game2){\n                      game2.logToLocationLog(\"The trap door looks old but still strong due to steel reinforcements. It is locked.\");\n                    }"
            }]]
        }]],
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
            "items": [],
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
    "enterEvents": [{"0": "Squirrel", "ss_deleted": true}],
    "actions": [["SearchShed"], ["LookInPond"]],
    "type": "location",
    "id": "garden"
};

const gardenWithAddedEvent = {
    "destinations": [{"target": "start"}],
    "enterEvents": [["Squirrel"], ["Test", {
        "function": `function(game){
          return true;
    }`, "ss_added": true
    }]],
    "actions": [["SearchShed"], ["LookInPond"]],
    "type": "location",
    "id": "garden"
};

const locationWithNullDestinationTarget = {
    "id": "test",
    "type": "location",
    "destinations": [
        {"target": "test"}
    ]
};

const arrayDataWithAdditionalProperty = {
    "testArray": [1, 2, 3],
    "testArray_arrProps":
        {"mapPath": "test"}
};

const partyWithCharacter = {
    "characters": [
        {
            "name": "",
            "hitpoints": 10,
            "currentHitpoints": 10,
            "items": []
        }
    ],
    "quests": [],
    "score": 0,
    "currentLocationId": "start"
};

describe("DataSerializer", () => {

    let serviceFactory: ServiceFactory;
    let serializer: IDataSerializer;

    beforeAll(() => {
        RunGame();
        serviceFactory = ServiceFactory.GetInstance();
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
        const result = JSON.parse(JSON.stringify(serializer.createSerializableClone(objectToCopy)));
        expect(result).toEqual(arrayDataWithAdditionalProperty);
    });

    test("should restore additional array properties when present", function () {
        const result = serializer.restoreObjects(arrayDataWithAdditionalProperty);
        const expectedValues = [1, 2, 3];
        const actualValues = [...result.testArray]
        expect(actualValues).toEqual(expectedValues);
        expect(result.testArray.mapPath).toBe("test");
    });

    test("should create and save a JSON clone with items added at runtime", function () {
        const game = <IGame>{};
        const definitions = <IDefinitions><unknown>{items: [BasementKey]};
        game.helpers = new HelperService(<IGame>{}, definitions);
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

        // Remove whitespaces in the function strings to make the compare work.
        const expectedBarrierAction = (<any>locationWithAddedDestination).destinations[1].barriers[0][1].actions[0][1];
        (<any>expectedBarrierAction).execute = expectedBarrierAction.execute.toString().replace(/\s{2,}/g, ' ');
        const actualBarrierAction = (<any>result).destinations[1].barriers[0][1].actions[0][1];
        (<any>actualBarrierAction).execute = actualBarrierAction.execute.toString().replace(/\s{2,}/g, ' ');

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
        character.items = [];

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
        garden.enterEvents.add(['Test', (game) => {
            return true;
        }]);
        const serialized = serializer.createSerializableClone(garden);
        const expectedFunction = <any>gardenWithAddedEvent.enterEvents[1][1];
        expectedFunction.function = expectedFunction.function.replace(/\s{2,}/g, ' ');
        const actualFunction = <any>serialized.enterEvents[1][1];
        actualFunction.function = actualFunction.function.replace(/\s{2,}/g, ' ');
        expect(serialized).toEqual(gardenWithAddedEvent);
    });

    test("should not serialize an array with only empty objects", function () {
        const locationWithEmptyDestinationTarget = {
            name: 'Test',
            id: 'test',
            type: 'location',
            destinations: <IDestination[]>[{
                name: 'No destination',
                target: null
            }, {
                name: 'With destination',
                target: 'test'
            }]
        };

        const locationToSerialize = {...locationWithEmptyDestinationTarget};

        const dataSerializer = new DataSerializer({
            'locations': {
                'test': locationWithEmptyDestinationTarget
            }
        });

        const serialized = dataSerializer.createSerializableClone({
            'locations': {
                'test': locationToSerialize
            }
        });

        expect(serialized.locations.test).toEqual(locationWithNullDestinationTarget);
    });

    test("should serialize party with character correctly", function () {
        const party = <IParty>{
            characters: [{
                name: "",
                hitpoints: 10,
                currentHitpoints: 10,
                items: [],
                equipment: {}
            }],
            quests: [],
            score: 0,
            currentLocationId: "start"
        };

        const result = serializer.createSerializableClone(party);
        expect(result).toEqual(partyWithCharacter);
    });

    test("should deserialize party with character correctly", function () {
        const result = <IParty>serializer.restoreObjects(partyWithCharacter);
        const items = result.characters[0].items;
        expect(items).not.toBeNull();
        items.add(Sword);
        const addedSword = items[0];
        delete addedSword[StateProperties.Id];
        delete addedSword[StateProperties.Added];
        expect(addedSword).toEqual(Sword());
    });

    test("should not serialize conversation nodes", function () {
        const person = Friend();
        const game = serviceFactory.GetGame();
        game.sounds = <any>{
            playedAudio: []
        };
        game.activeCharacter = <ICharacter>{};
        const conversationService = new ConversationService(game);
        conversationService.talk(person);
        const result = serializer.createSerializableClone(person);
        const serializedConversationProperties = Object.keys(result.conversation);
        expect(serializedConversationProperties).toHaveLength(1)
        expect(serializedConversationProperties[0]).toBe("actions");
    });

});