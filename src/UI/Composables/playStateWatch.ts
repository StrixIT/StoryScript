import {Ref} from "vue";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

const saveStates = [PlayState.Combat, PlayState.Conversation, PlayState.Trade];

export function usePlayStateWatch(uiRoot: Ref<HTMLElement>) {
    const store = useStateStore();
    const {game} = storeToRefs(store);
    const {gameService, dataService} = store.services;

    gameService.watchPlayState((_, newState, oldState) => {
        stopAutoplay();

        if (newState === null && saveStates.includes(oldState)) {
            // Save the game after finishing conversations, trade and combat.
            dataService.saveGame(game.value);
        }
    });

    const stopAutoplay = () => {
        const mediaElements = uiRoot.value.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
        mediaElements.forEach((m: Element) => (m as HTMLMediaElement).pause());
    }
}