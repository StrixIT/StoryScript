import {beforeAll, describe, expect, test} from 'vitest';
import {GetDefinitions, GetRegisteredEntities} from "storyScript/ObjectConstructors.ts";
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
    "combatActions": [["RunInside", {"id": "RunInside"}]],
    "type": "location",
    "id": "dirtroad"
}, {
    "destinations": [{"target": "start"}],
    "enterEvents": [["Squirrel"]],
    "actions": [["SearchShed", {"id": "SearchShed"}], ["LookInPond", {"id": "LookInPond"}]],
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
    "actions": [["SearchShed", {"id": "SearchShed"}], ["LookInPond", {"id": "LookInPond"}]],
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

describe("DataSerializer", () => {
    let definitions: IDefinitions;
    let locations: ICompiledLocation[];
    let serializer: IDataSerializer;

    beforeAll(() => {
        RunGame();
        definitions = GetDefinitions();
        const registeredEntities = GetRegisteredEntities();
        serializer = new DataSerializer(registeredEntities);
        locations = Object.values(registeredEntities['locations']);
    });

    test("should create and save a JSON clone of the world", function () {
        const result = serializer.createSerializableClone(locations);
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
        game.definitions = definitions;
        game.helpers = new HelperService(game);
        game.party = <IParty>{};
        game.party.characters = [];
        const locationService = new LocationService(<IDataService>{}, <IRules>{}, game, definitions, new Map<string, string>());
        const garden = <ICompiledLocation>Garden();
        locationService.setDestinations(garden);
        locationService.initDestinations(garden);
        const searchShedAction = garden.actions.find(a => a[0] === 'SearchShed')[1];
        game.currentLocation = garden;
        (<(game: IGame) => boolean>searchShedAction.execute)(game);

        const result = serializer.createSerializableClone(game.currentLocation);
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

});