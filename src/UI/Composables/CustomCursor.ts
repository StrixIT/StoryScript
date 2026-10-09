import {onMounted, Ref, watch} from "vue";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {isTouchDevice} from 'src/constants.ts';
import {ICustomCursor} from "storyScript/Interfaces/customCursor.ts";
import {IActiveCombination} from "storyScript/Interfaces/combinations/activeCombination.ts";

export function useCustomCursor(uiRoot: Ref<HTMLElement>) {
    const cursorRegex = /resources\/[\w-]*\.[a-zA-Z]{3,4}/;
    const rootElement = uiRoot;

    const store = useStateStore();
    const {game, customCursor, combinationCursor} = storeToRefs(store);

    watch(() => customCursor.value, (newVal?: ICustomCursor) => {
        if (newVal?.style) {
            game.value.UIRootElement.style.cursor = customCursor.value.style;
        }
    });

    watch(() => game.value.combinations.activeCombination, (newVal?: IActiveCombination) => {
        if (!newVal) {
            Array.from<HTMLElement>(game.value.UIRootElement.querySelectorAll('.feature-cursor')).forEach(e => {
                e.style.cursor = customCursor.value?.style || null;
            });
        }
    });

    onMounted(() => {
        game.value.UIRootElement = rootElement.value.closest('body');

        game.value.UIRootElement.addEventListener('mouseover', e => {
            setCursorStyle(e.target as HTMLElement);
        });
    });

    const setCursorStyle = (element: HTMLElement) => {
        if (isTouchDevice) {
            return;
        }

        let isDefaultPointer = getComputedStyle(element)?.cursor === 'pointer';
        let cursorStyle = null;

        if (element.classList.contains('feature-cursor')) {
            const combinationPicture = game.value.combinations.activeCombination?.selectedCombinationAction?.picture;

            if (combinationPicture) {
                cursorStyle = combinationCursor.value.style.replace(cursorRegex, `resources/${combinationPicture}`);
            } else {
                cursorStyle = customCursor.value?.style || null;
            }
        } else if (isDefaultPointer && customCursor.value) {
            cursorStyle = customCursor.value.style;
        }

        if (cursorStyle) {
            element.style.cursor = cursorStyle;
        }
    }
}