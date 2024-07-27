import { describe, test, expect, beforeAll } from 'vitest';
import { DataSynchronizer } from "storyScript/Services/DataSynchronizer.ts";
import { RuntimeProperties } from "storyScript/runtimeProperties.ts";
import { Bandit } from "../../../Games/MyRolePlayingGame/enemies/bandit";
import { LeatherBoots } from "../../../Games/MyRolePlayingGame/items/leatherBoots";
import { RunGame } from '../../../Games/MyRolePlayingGame/run';
import {IEnemy} from "../../../Games/MyRolePlayingGame/interfaces/enemy.ts";
import {IEntity} from "storyScript/Interfaces/entity.ts";
import {GetRegisteredEntities} from "storyScript/ObjectConstructors.ts";
import {IKey} from "../../../Games/MyRolePlayingGame/interfaces/key.ts";
import {Start} from "../../../Games/MyRolePlayingGame/locations/start.ts";
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {Garden} from "../../../Games/MyRolePlayingGame/locations/Garden.ts";

describe("DataSynchronizer", () => {
    
    const startLocationSkeleton = {
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
        "actions": [["SearchShed", {}], ["LookInPond", {}]],
        "type": "location",
        "id": "garden",
        "combatActions": [],
        "features": [],
        "trade": [],
        "items": [],
        "enemies": [],
        "persons": []
    }));
    
    let pristineEntities: Record<string, Record<string, IEntity>>;
    
    beforeAll(() => {
        RunGame();
        pristineEntities = GetRegisteredEntities();
    });

    test("should add plain properties and new relations to a skeleton entity", function() {
        const synchronizer = new DataSynchronizer();
        
        const skeleton = <IEnemy>{ id: 'bandit' };
        skeleton['type'] = 'enemy';
        const bandit = { ...Bandit() };
        
        synchronizer.updateModifiedEntity(skeleton, bandit, pristineEntities);

        expect(skeleton).toEqual(bandit);
    });

    test("should remove deleted relations from a collection", function() {
        const synchronizer = new DataSynchronizer();

        const removedItem = { id: 'sword' };
        removedItem['type'] = 'item';
        removedItem[RuntimeProperties.Deleted] = true;
        const skeleton = <IEnemy>{ id: 'bandit', items: [ removedItem ] };
        skeleton['type'] = 'enemy';
        const bandit = { ...Bandit() };

        synchronizer.updateModifiedEntity(skeleton, bandit, pristineEntities);
        
        expect(skeleton.items).toHaveLength(1);
        expect(skeleton.items[0].id).toBe('basementkey');
        expect((<IKey>skeleton.items[0]).open.text).toBe((<IKey><unknown>pristineEntities['items']['basementkey']).open.text);
    });

    test("should update entities added during runtime", function() {
        const synchronizer = new DataSynchronizer();

        const addedItem = { id: 'leatherboots' };
        addedItem['type'] = 'item';
        addedItem[RuntimeProperties.Added] = true;
        const skeleton = <IEnemy>{ id: 'bandit', items: [ addedItem ] };
        skeleton['type'] = 'enemy';
        const bandit = { ...Bandit() };

        synchronizer.updateModifiedEntity(skeleton, bandit, pristineEntities);

        expect(skeleton.items).toHaveLength(3);
        const boots = skeleton.items.find(i => i.id === 'leatherboots');
        expect(boots).toEqual({ ...LeatherBoots(), [RuntimeProperties.Added]: true });
    });

    test("should populate a location from a location skeleton", function() {
        const serializer = new DataSerializer();
        const synchronizer = new DataSynchronizer();
        const start = Start();
        const skeleton = serializer.restoreObjects(startLocationSkeleton);
        
        synchronizer.updateModifiedEntity(skeleton, start, pristineEntities);

        expect(startLocationSkeleton.destinations).toEqual(start.destinations);
        expect(startLocationSkeleton.items).toEqual(start.items);
        expect(startLocationSkeleton.persons[0].items).toEqual(start.persons[0].items);
        expect((<any>startLocationSkeleton).descriptionSelector).toEqual(start.descriptionSelector);
    });

    test("should populate a location from a location skeleton and keep the additions", function() {
        const serializer = new DataSerializer();
        const synchronizer = new DataSynchronizer();
        const garden = Garden();
        const skeleton = serializer.restoreObjects(gardenLocationSkeleton);

        synchronizer.updateModifiedEntity(skeleton, garden, pristineEntities);

        expect(skeleton.destinations).toHaveLength(2);
    });
});