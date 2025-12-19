import {Ref, ref, watch} from "vue";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {ILocation} from "storyScript/Interfaces/location.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {Enemies, Items, Persons} from "../../../constants.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";

export function useActiveEntityWatcher(gameRef: Ref<IGame>) {

    const enemiesPresent = ref(getActiveEntities(gameRef.value.currentLocation, Enemies).length > 0);
    const activePersons = ref(getActiveEntities(gameRef.value.currentLocation, Persons));
    const activeEnemies = ref(getActiveEntities(gameRef.value.currentLocation, Enemies));
    const activeItems = ref(getActiveEntities(gameRef.value.currentLocation, Items));
    const activeActions = ref(getActiveActions(gameRef.value.currentLocation));
    const activeDestinations = ref(getActiveEntities(gameRef.value.currentLocation, 'destinations'));

    watch(() => gameRef.value.currentLocation, (newValue, oldValue) => {
        enemiesPresent.value = getActiveEntities(newValue, Enemies).length > 0;
        activePersons.value = getActiveEntities(gameRef.value.currentLocation, Persons);
        activeEnemies.value = getActiveEntities(newValue, Enemies);
        activeItems.value = getActiveEntities(newValue, Items);
        activeActions.value = getActiveActions(newValue);
        activeDestinations.value = getActiveEntities(newValue, 'destinations');
    }, { deep: true });

    return {
        enemiesPresent,
        activePersons,
        activeEnemies,
        activeItems,
        activeActions,
        activeDestinations
    };
}

const getActiveEntities = (location: ILocation, type: string) => location[type].filter(e => !e.inactive);

const getActiveActions = (location: ILocation) => location.actions.filter(i => !i[1].inactive);