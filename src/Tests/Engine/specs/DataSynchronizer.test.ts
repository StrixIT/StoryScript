import {beforeAll, describe, expect, test} from 'vitest';
import {DataSynchronizer} from "storyScript/Services/DataSynchronizer.ts";
import {StateProperties} from "storyScript/stateProperties.ts";
import {Bandit} from "../../../Games/MyRolePlayingGame/enemies/bandit";
import {LeatherBoots} from "../../../Games/MyRolePlayingGame/items/leatherBoots";
import {RunGame} from '../../../Games/MyRolePlayingGame/run';
import {IEnemy} from "../../../Games/MyRolePlayingGame/interfaces/enemy.ts";
import {IKey} from "../../../Games/MyRolePlayingGame/interfaces/key.ts";
import {Start} from "../../../Games/MyRolePlayingGame/locations/start.ts";
import {Garden} from "../../../Games/MyRolePlayingGame/locations/Garden.ts";
import {IDataSynchronizer} from "storyScript/Interfaces/services/dataSynchronizer.ts";
import {BasementKey} from "../../../Games/MyRolePlayingGame/items/basementKey.ts";
import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer.ts";
import {IParty} from "../../../Games/MyRolePlayingGame/interfaces/party.ts";
import {Basement} from "../../../Games/MyRolePlayingGame/locations/Basement.ts";
import {DirtRoad} from "../../../Games/MyRolePlayingGame/locations/DirtRoad.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {Sword} from "../../../Games/MyRolePlayingGame/items/sword.ts";
import {ISaveGame} from "storyScript/Interfaces/saveGame.ts";
import {Friend} from "../../../Games/MyRolePlayingGame/persons/Friend.ts";
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {Journal} from "../../../Games/MyRolePlayingGame/quests/journal.ts";

const startLocationSkeleton = {
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
};

const gardenLocationSkeleton = {
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

const multipleLocations = [
    {
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
    }
];

const partyData = {
    "characters": [{
        "name": "Test",
        "level": 1,
        "hitpoints": 10,
        "currentHitpoints": 10,
        "strength": 3,
        "agility": 1,
        "intelligence": 1,
        "items": [],
        "equipment": {"head": null}
    }], "quests": [{
        "id": "journal",
        "type": "quest",
    }], "score": 0
}

const libraryWithTrader = {
    "destinations": [
        {
            "target": "start",
            "isPreviousLocation": true
        }
    ],
    "trade": [
        {
            "type": "trade",
            "id": "yourpersonalcloset",
            "ownItemsOnly": false,
            "ss_triggered": true,
            "currency": 0,
            "buy": {
                "items": [
                    {
                        "type": "item",
                        "id": "sword",
                        "ss_uniqueId": "13846303-0dbd-46b4-b3bb-9d6f42fd2d2f",
                        "ss_added": true
                    }
                ]
            },
            "sell": {
                "items": [
                    {
                        "type": "item",
                        "id": "leatherboots",
                        "ss_uniqueId": "9e57b587-2052-4341-9c6c-e7d2ed8a91f7",
                        "ss_added": true
                    }
                ]
            }
        }
    ],
    "type": "location",
    "id": "library",
    "actions": [
        [
            "yourpersonalcloset",
            {
                "text": "Your personal closet",
                "actionType": 3,
                "execute": "trade",
                "ss_added": true
            }
        ]
    ],
    "hasVisited": true
};

const gardenWithDeletedAction = {
    "destinations": [{"target": "start"}],
    "enterEvents": [["Squirrel"]],
    "actions": [["SearchShed"], {
        "0": "LookInPond",
        "ss_deleted": true,
    }, ["Test"]],
    "type": "location",
    "id": "garden"
};

const gardenWithDeletedEvent = {
    "destinations": [{"target": "start"}],
    "enterEvents": [{"0": "Squirrel", "ss_deleted": true}, ["Test"]],
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

describe("DataSynchronizer", () => {

    let dataSerializer: IDataSerializer;
    let dataSynchronizer: IDataSynchronizer;

    beforeAll(() => {
        RunGame();
        const serviceFactory = ServiceFactory.GetInstance();
        dataSerializer = serviceFactory.GetDataSerializer();
        dataSynchronizer = serviceFactory.GetDataSynchronizer();
    });

    test("should add plain properties and new relations to a skeleton entity", function () {
        const skeleton = <IEnemy>{id: 'bandit'};
        skeleton['type'] = 'enemy';
        const bandit = {...Bandit()};
        dataSynchronizer.synchronizeEntityData(skeleton, bandit);
        expect(skeleton).toEqual(bandit);
    });

    test("should keep updated property values on the skeleton", function () {
        const newName = 'Fierce Bandit';
        const newAttack = '1d8';
        const skeleton = <IEnemy>{id: 'bandit', name: newName, attack: newAttack};
        skeleton['type'] = 'enemy';
        const bandit = {...Bandit()};

        dataSynchronizer.synchronizeEntityData(skeleton, bandit);

        expect(skeleton.name).toEqual(newName);
        expect(skeleton.attack).toEqual(newAttack);

        // Reset the updated properties so we can compare the rest of the properties.
        skeleton.name = bandit.name;
        skeleton.attack = bandit.attack;
        expect(skeleton).toEqual(bandit);
    });

    test("should remove removed relations (design-time) and deleted relations (run-time) from a collection, and add newly added ones", function () {
        // We'll pretend the leather boots were deleted during editing.
        const removedItem = {id: 'leatherboots'}

        // In contrast, we'll simulate that the sword was removed from the bandit during runtime.
        const deletedItem = {id: 'sword'};
        removedItem['type'] = 'item';
        deletedItem['type'] = 'item';
        deletedItem[StateProperties.Deleted] = true;
        const skeleton = <IEnemy>{id: 'bandit', items: [removedItem, deletedItem]};
        skeleton['type'] = 'enemy';
        const bandit = {...Bandit()};
        const key = BasementKey();

        // We need to call restoreObjects first to move the deleted entity to the _deleted shadow array.
        // This will happen at runtime too.
        dataSerializer.restoreObjects(skeleton);
        dataSynchronizer.synchronizeEntityData(skeleton, bandit);

        // The Basement key is on the original and should have been restored as it wasn't on the serialized entity and
        // there wasn't a delete record for it either.
        expect(skeleton.items).toHaveLength(1);
        expect(skeleton.items[0].id).toBe('basementkey');
        expect((<IKey>skeleton.items[0]).open.text).toBe(key.open.text);
    });

    test("should update entities added during runtime", function () {
        const addedItem = {id: 'leatherboots'};
        addedItem['type'] = 'item';
        addedItem[StateProperties.Added] = true;
        const skeleton = <IEnemy>{id: 'bandit', items: [addedItem]};
        skeleton['type'] = 'enemy';
        const bandit = {...Bandit()};

        dataSynchronizer.synchronizeEntityData(skeleton, bandit);

        expect(skeleton.items).toHaveLength(3);
        const boots = skeleton.items.find(i => i.id === 'leatherboots');
        expect(boots).toEqual({...LeatherBoots(), [StateProperties.Added]: true});
    });

    test("should populate a location from a location skeleton", function () {
        const start = Start();
        const skeleton = dataSerializer.restoreObjects(startLocationSkeleton);
        dataSynchronizer.synchronizeEntityData(skeleton, start);
        expect(startLocationSkeleton).toEqual(start);
    });

    test("should populate a location from a location skeleton and keep the additions", function () {
        const garden = Garden();
        const skeleton = dataSerializer.restoreObjects(gardenLocationSkeleton);
        dataSynchronizer.synchronizeEntityData(skeleton, garden);

        expect(skeleton.destinations).toHaveLength(2);
        const newDestination = skeleton.destinations[1];
        skeleton.destinations.splice(1, 1);
        expect(skeleton).toEqual(garden);
        expect(newDestination.name).toBe("Enter the basement");
        expect(newDestination.barrier).not.toBeNull();
    });

    test("should populate locations", function () {
        const expected = [Basement(), DirtRoad()];
        const skeleton = dataSerializer.restoreObjects(multipleLocations);
        dataSynchronizer.synchronizeEntityData(skeleton, expected);
        expect(skeleton).toEqual(expected);
    });

    test("should add new locations when synchronizing an existing world", function () {
        const pristineEntities = {
            'locations': {
                'start': Start(),
                'dirtroad': DirtRoad()
            },
            'persons': {
                'friend': Friend()
            },
            'enemies': {
                'bandit': Bandit()
            },
            'items': {
                'sword': Sword(),
                'basementkey': BasementKey()
            },
            'quests': {
                'journal': Journal()
            }
        };

        const savedData = <ISaveGame>{
            party: <IParty>{},
            playedAudio: [],
            statistics: {},
            world: {'start': <any>{ ...startLocationSkeleton } },
            worldProperties: {}
        };

        const serializer = new DataSerializer(pristineEntities);
        const restoredData = serializer.restoreObjects(savedData);
        const synchronizer = new DataSynchronizer(pristineEntities);

        synchronizer.synchronizeEntityData(restoredData);
        expect(restoredData.world.start).not.toBeNull();
        expect(restoredData.world.dirtroad).not.toBeNull();
        expect(restoredData.world.dirtroad).toEqual(pristineEntities.locations.dirtroad);
    });

    test("should restore Party data", function () {
        const skeleton = <IParty>dataSerializer.restoreObjects(partyData);
        dataSynchronizer.synchronizeEntityData(skeleton);
        expect(skeleton.characters[0].name).toBe('Test');
        expect(skeleton.characters[0].items.length).toBe(0);
        expect(skeleton.quests.length).toBe(1);
        expect(skeleton.quests[0].name).toBe(Journal().name);
    });

    test("should restore added actions", function () {
        const skeleton = <ICompiledLocation>dataSerializer.restoreObjects(libraryWithTrader);
        dataSynchronizer.synchronizeEntityData(skeleton);
        expect(skeleton.actions.length).toBe(1);
        expect(skeleton.actions[0][1][StateProperties.Added]).toBeTruthy;

        const sword = skeleton.trade[0].buy.items[0];
        expect(sword).not.toBeUndefined();
        delete sword[StateProperties.Id];
        delete sword[StateProperties.Added];
        expect(sword).toEqual(Sword());
    });

    test("should restore location without deleted and no longer present action", function () {
        const skeleton = <ICompiledLocation>dataSerializer.restoreObjects(gardenWithDeletedAction);
        dataSynchronizer.synchronizeEntityData(skeleton);
        expect(skeleton.actions.length).toBe(1);
    });

    test("should restore location without deleted and no longer present events", function () {
        const skeleton = <ICompiledLocation>dataSerializer.restoreObjects(gardenWithDeletedEvent);
        dataSynchronizer.synchronizeEntityData(skeleton);
        expect(skeleton.enterEvents.length).toBe(0);
    });

    test("should restore location with added events, without making data records read-only", function () {
        const skeleton = <ICompiledLocation>dataSerializer.restoreObjects(gardenWithAddedEvent);
        dataSynchronizer.synchronizeEntityData(skeleton);
        expect(skeleton.enterEvents.length).toBe(2);
        expect(skeleton.enterEvents[1][1]).toBeTypeOf('function');
    });
    
    test("should restore tuples with arrays as second elements correctly", function() {
        const expected = {
            attackPriority: [
                ["Warrior", [1,2,3,4]],
                ["Wizard", [5,6]]
            ]
        }
        
        const input = {
            attackPriority: [["Warrior"], ["Wizard"]]
        }
        
        dataSynchronizer.synchronizeEntityData(input, expected);
        expect(Array.isArray(input.attackPriority[1][1])).toBeTruthy();
    });

});