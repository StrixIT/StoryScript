import { describe, test, expect, beforeAll } from 'vitest';
import { DataSynchronizer } from "storyScript/Services/DataSynchronizer.ts";
import { RuntimeProperties } from "storyScript/runtimeProperties.ts";
import { Bandit } from "../../../Games/MyRolePlayingGame/enemies/bandit";
import { BasementKey } from "../../../Games/MyRolePlayingGame/items/basementKey";
import { Journal } from "../../../Games/MyRolePlayingGame/items/journal";
import { LeatherBoots } from "../../../Games/MyRolePlayingGame/items/leatherBoots";
import { Sword } from "../../../Games/MyRolePlayingGame/items/sword";
import { compareId } from "../helpers";
import { RunGame } from '../../../Games/MyRolePlayingGame/run';

describe("DataSynchronizer", () => {

    beforeAll(() => {
        RunGame();
    });

    test("should update, add and remove plain properties on entity", function() {
        const synchronizer = new DataSynchronizer();
        
        const newName = 'Fierce Bandit';
        const newHitpoints = 20;
        const bandit = <any>{ ...Bandit() };
        const updated = <any>{ ...Bandit(), name: newName, hitpoints: newHitpoints, speed: 5 };
        delete updated.attack;
        const pristineEntities = { enemies: { bandit: updated } };
        const items = pristineEntities['items'] = {};

        bandit.items.forEach(i => {
            items[i.id] = i;
        });
        
        synchronizer.updateModifiedEntity(bandit, updated, pristineEntities);

        expect(bandit.name).toBe(newName);
        expect(bandit.hitpoints).toBe(newHitpoints);
        expect(bandit.attack).toBeUndefined();
    });

    test("should add entities to and remove them from a collection", function() {
        const synchronizer = new DataSynchronizer();

        const bandit = <any>{ ...Bandit() };
        const updated = <any>{ ...Bandit() };
        updated.items.delete(BasementKey);
        updated.items.add(LeatherBoots);

        const pristineEntities = { enemies: { bandit: updated } };
        const items = pristineEntities['items'] = {};

        [Sword(), Journal(), LeatherBoots(), BasementKey()].forEach(i => {
            items[i.id] = i;
        });

        synchronizer.updateModifiedEntity(bandit, updated, pristineEntities);

        expect(bandit.items.length).toBe(2);
        expect(compareId(bandit.items[0].id, Sword)).toBeTruthy();
        expect(compareId(bandit.items[1].id, LeatherBoots)).toBeTruthy();
        expect(bandit.items[1][RuntimeProperties.Added]).toBeTruthy();
    });

    test("should update properties on nested entities", function() {
        const synchronizer = new DataSynchronizer();

        const bandit = <any>{ ...Bandit() };
        const updated = <any>{ ...Bandit() };

        const pristineEntities = { enemies: { bandit: updated }, items: {} };
        const items = pristineEntities.items;

        [Sword(), BasementKey()].forEach(i => {
            items[i.id] = i;
        });

        const newItemName = 'Long Sword';
        items['sword'].name = newItemName;

        synchronizer.updateModifiedEntity(bandit, updated, pristineEntities);

        expect(bandit.items[0].name).toBe(newItemName);
    });
});