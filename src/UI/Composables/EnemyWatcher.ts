import {Ref, ref, watch} from "vue";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {ILocation} from "storyScript/Interfaces/location.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {Enemies, Items} from "../../../constants.ts";

export function useActiveEntityWatcher(gameRef: Ref<IGame>) {

    const enemiesPresent = ref(getActiveEntities(gameRef.value.currentLocation, Enemies).length > 0);
    const activeEnemies = ref(getActiveEntities(gameRef.value.currentLocation, Enemies));
    const activeItems = ref(getActiveEntities(gameRef.value.currentLocation, Items));

    watch(() => gameRef.value.currentLocation, (newValue, oldValue) => {
        enemiesPresent.value = getActiveEntities(newValue, Enemies).length > 0;
        activeEnemies.value = getActiveEntities(newValue, Enemies);
        activeItems.value = getActiveEntities(newValue, Items);
    }, { deep: true });

    return {
        enemiesPresent,
        activeEnemies,
        activeItems,
    };
}

const getActiveEntities = (location: ILocation, type: string) => location[type].filter(e => !e.inactive);