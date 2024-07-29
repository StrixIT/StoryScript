import {beforeAll, describe, expect, test} from 'vitest';
import {DataSynchronizer} from "storyScript/Services/DataSynchronizer.ts";
import {StateProperties} from "storyScript/stateProperties.ts";
import {Bandit} from "../../../Games/MyRolePlayingGame/enemies/bandit";
import {LeatherBoots} from "../../../Games/MyRolePlayingGame/items/leatherBoots";
import {RunGame} from '../../../Games/MyRolePlayingGame/run';
import {IEnemy} from "../../../Games/MyRolePlayingGame/interfaces/enemy.ts";
import {GetRegisteredEntities} from "storyScript/ObjectConstructors.ts";
import {IKey} from "../../../Games/MyRolePlayingGame/interfaces/key.ts";
import {Start} from "../../../Games/MyRolePlayingGame/locations/start.ts";
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {Garden} from "../../../Games/MyRolePlayingGame/locations/Garden.ts";
import {IDataSynchronizer} from "storyScript/Interfaces/services/dataSynchronizer.ts";
import {BasementKey} from "../../../Games/MyRolePlayingGame/items/basementKey.ts";
import {Journal} from "../../../Games/MyRolePlayingGame/items/journal.ts";
import {Basement} from "../../../Games/MyRolePlayingGame/locations/Basement.ts";
import {getId} from "storyScript/utilities.ts";
import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer.ts";
import {IParty} from "../../../Games/MyRolePlayingGame/interfaces/party.ts";

describe("DataSynchronizer", () => {

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

    const gardenLocationSkeleton = JSON.parse(JSON.stringify({
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
    }));

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
        }], "quests": [], "score": 0
    }

    let dataSerializer: IDataSerializer;
    let dataSynchronizer: IDataSynchronizer;

    beforeAll(() => {
        RunGame();
        const pristineEntities = GetRegisteredEntities();
        dataSerializer = new DataSerializer(pristineEntities);
        dataSynchronizer = new DataSynchronizer(pristineEntities);
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

    test("should remove removed relations (design-time) and deleted relations (run-time) from a collection", function () {
        const removedItem = {id: 'leatherboots'}
        const deletedItem = {id: 'sword'};
        removedItem['type'] = 'item';
        deletedItem['type'] = 'item';
        deletedItem[StateProperties.Deleted] = true;
        const skeleton = <IEnemy>{id: 'bandit', items: [removedItem, deletedItem]};
        skeleton['type'] = 'enemy';
        const bandit = {...Bandit()};
        const key = BasementKey();

        dataSynchronizer.synchronizeEntityData(skeleton, bandit);

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
        expect(startLocationSkeleton.destinations).toEqual(start.destinations);
        expect(start.items).toHaveLength(0);
        expect(start.persons[0].trade).not.toBeNull();
        expect(startLocationSkeleton.persons[0].items).toEqual(start.persons[0].items);
        expect((<any>startLocationSkeleton).descriptionSelector).toEqual(start.descriptionSelector);
    });

    test("should populate a location from a location skeleton and keep the additions", function () {
        const garden = Garden();
        const skeleton = dataSerializer.restoreObjects(gardenLocationSkeleton);
        dataSynchronizer.synchronizeEntityData(skeleton, garden);
        expect(skeleton.destinations).toHaveLength(2);
        expect(skeleton.destinations[0].name).toBe("Enter the basement");
        expect(skeleton.destinations[0].barrier).not.toBeNull();
    });

    test("should populate locations", function () {
        const skeleton = dataSerializer.restoreObjects(multipleLocations);
        dataSynchronizer.synchronizeEntityData(skeleton);
        const journal = Journal();
        expect(skeleton).toHaveLength(2);
        expect(skeleton.find(l => l.id === getId(Basement)).items[0]).toEqual(journal);
    });

    test("should restore Party data", function () {
        const skeleton = <IParty>dataSerializer.restoreObjects(partyData);
        dataSynchronizer.synchronizeEntityData(skeleton);
        expect(skeleton.characters[0].name).toBe('Test');
        expect(skeleton.characters[0].items.length).toBe(0);
        expect(skeleton.quests.length).toBe(0);
    });
});