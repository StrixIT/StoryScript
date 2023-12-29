import { DataSynchronizer } from "../../../Engine/Services/DataSynchronizer";
import { RuntimeProperties } from "../../../Engine/runtimeProperties";
import { Bandit } from "../../../Games/MyRolePlayingGame/enemies/bandit";
import { BasementKey } from "../../../Games/MyRolePlayingGame/items/basementKey";
import { Journal } from "../../../Games/MyRolePlayingGame/items/journal";
import { LeatherBoots } from "../../../Games/MyRolePlayingGame/items/leatherBoots";
import { Sword } from "../../../Games/MyRolePlayingGame/items/sword";
import { compareId } from "../helpers";

describe("DataSynchronizer", () => {

    it("should update, add and remove plain properties on entity", function() {
        const synchronizer = new DataSynchronizer();
        
        const newName = 'Fierce Bandit';
        const newHitpoints = 20;
        const bandit = <any>{ ...Bandit(), [RuntimeProperties.BuildTimeStamp]: 1 };
        const updated = <any>{ ...Bandit(), name: newName, hitpoints: newHitpoints, [RuntimeProperties.BuildTimeStamp]: 2, speed: 5 };
        delete updated.attack;
        const pristineEntities = { enemies: { bandit: updated } };
        const items = pristineEntities['items'] = {};

        bandit.items.forEach(i => {
            items[i.id] = i;
        });
        
        synchronizer.updateModifiedEntity(bandit, updated, pristineEntities, true);

        expect(bandit.name).toBe(newName);
        expect(bandit.hitpoints).toBe(newHitpoints);
    });

    it("should update, add entities to and remove them from a collection", function() {
        const synchronizer = new DataSynchronizer();

        const bandit = <any>{ ...Bandit(), [RuntimeProperties.BuildTimeStamp]: 1 };
        const updated = <any>{ ...Bandit(), [RuntimeProperties.BuildTimeStamp]: 2 };
        updated.items.delete(BasementKey);
        updated.items.add(LeatherBoots);

        const pristineEntities = { enemies: { bandit: updated } };
        const items = pristineEntities['items'] = {};

        [Sword(), Journal(), LeatherBoots(), BasementKey()].forEach(i => {
            items[i.id] = i;
        });

        synchronizer.updateModifiedEntity(bandit, updated, pristineEntities);

        expect(bandit.items.length).toBe(2);
        expect(compareId(bandit.items[0].id, Sword)).toBeTrue();
        expect(compareId(bandit.items[1].id, LeatherBoots)).toBeTrue();
        expect(bandit.items[1][RuntimeProperties.Added]).toBeTrue();
    });
});