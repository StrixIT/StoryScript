import {Ref} from "vue";
import {useStateStore} from "ui/StateStore";
import {storeToRefs} from "pinia";
import {PlayState} from 'storyScript';

const saveStates = [PlayState.Combat, PlayState.Conversation, PlayState.Trade];

export function usePlayStateWatch(uiRoot: Ref<HTMLElement>) {
    const rootElement = uiRoot;
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
        if (!rootElement.value) {
            return;
        }
        
        const mediaElements = rootElement.value.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
        mediaElements.forEach((m: Element) => (m as HTMLMediaElement).pause());
    }
}