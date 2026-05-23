import {onMounted, Ref} from "vue";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {isTouchDevice} from "../../../constants.ts";

export function useCustomCursor(uiRoot: Ref<HTMLElement>) {
    const cursorRegex = /resources\/[\w-]*\.[a-zA-Z]{3,4}/;

    const store = useStateStore();
    const {game, customCursor, combinationCursor} = storeToRefs(store);

    onMounted(() => {
        game.value.UIRootElement = uiRoot.value.closest('body');

        game.value.UIRootElement.addEventListener('mouseover', e => {
            if (isTouchDevice) {
                return;
            }

            setCursorStyle(e.target as HTMLElement);
        });
    });

    const setCursorStyle = (element: HTMLElement) => {
        let cursorStyle = null;

        if (element.classList.contains('feature-cursor')) {
            const combinationPicture = game.value.combinations.activeCombination?.selectedCombinationAction?.picture;

            if (combinationPicture) {
                cursorStyle = combinationCursor.value.style.replace(cursorRegex, `resources/${combinationPicture}`);
            }
        }

        if (!cursorStyle && customCursor.value) {
            cursorStyle = customCursor.value.style;
        }

        if (cursorStyle) {
            element.style.cursor = cursorStyle;
        }
    }
}