import {addHtmlSpaces} from "storyScript/utilityFunctions.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {useStateStore} from "ui/StateStore.ts";
import {Ref, watch} from "vue";
import {storeToRefs} from "pinia";

export function useTextFeatures(descriptionRef: Ref<HTMLDivElement>) {
    const touchDevice = navigator.maxTouchPoints > 0;
    const activeTriggerClass = 'trigger-active';
    
    const store = useStateStore();
    const {game} = storeToRefs(store);
    const {combinationService} = store.services;

    const description = descriptionRef;

    watch(() => game.value.combinations.activeCombination?.selectedTool, () => {
        refreshFeatures();
    });

    const refreshFeatures = () => {
        // Show the text of added features.
        const featureArray = Array.from(description.value?.getElementsByTagName('feature'));

        if (featureArray.length === 0) {
            return;
        }

        featureArray.filter(e => e.innerHTML.trim() === '')
            .forEach((e) => {
                const feature = game.value.currentLocation.features.get(e.getAttribute('name'));

                if (feature) {
                    game.value.currentLocation.description = game.value.currentLocation.description.replace(new RegExp('<feature name="' + feature.id + '">\s*<\/feature>'), '<feature name="' + feature.id + '">' + addHtmlSpaces(feature.description) + '<\/feature>');
                }
            });

        // Remove the text of deleted features.
        featureArray.filter(e => e.innerHTML.trim() !== '')
            .forEach((e) => {
                if (game.value.combinations.combinationResult.featuresToRemove.indexOf(e.getAttribute('name')) > -1) {
                    e.innerHTML = '';
                }
            });

        featureArray.forEach((e) => {
            const feature = game.value.currentLocation.features.get(e.getAttribute('name'));
            
            if (feature && game.value.combinations.activeCombination?.selectedTool?.id === feature.id) {
                return;
            }

            e.classList.remove('combine-active-selected', 'combine-selectable');
            
            if (game.value.combinations.activeCombination) {
                e.classList.add('combine-selectable');
            }
        });
    };

    const click = (ev: PointerEvent) => {
        const triggerElement = getTriggerElement(ev.target as HTMLElement);
        
        if (triggerElement && touchDevice) {
            const activate = !triggerElement.classList.contains(activeTriggerClass);
            
            Array.from(descriptionRef.value.querySelectorAll('[data-trigger]')).forEach((el) => {
                toggleTrigger(el as any, false);
            });
            
            toggleTrigger(triggerElement, activate);
        }

        const feature = getFeature(ev);
        
        if (feature) {
            const result = game.value.combinations.tryCombine(feature);
            const className = combinationService.getCombineClass(feature);

            if (className) {
                const featureElement = getFeatureElement(ev);
                featureElement.classList.add(className);
            }

            if (result.success) {
                refreshFeatures();
            }
        }
    }

    const mouseOver = (ev: MouseEvent) => {
        if (touchDevice) {
            return;
        }
        
        toggleTrigger(getTriggerElement(ev?.target as HTMLElement), true);
    };

    const mouseOut = (ev: MouseEvent) => {
        if (touchDevice) {
            return;
        }
        
        toggleTrigger(getTriggerElement(ev?.target as HTMLElement), false);
    };

    const toggleTrigger = (element: HTMLElement, active: boolean) => {
        if (!element) {
            return;
        }
        
        const data = element.dataset
        const event = game.value.currentLocation.triggeredEvents?.find(([k, _]) => k === data.trigger)?.[1];

        if (active) {
            element.classList.add(activeTriggerClass);
            event?.(game.value, active, data);
        } else {
            element.classList.remove(activeTriggerClass);
            event?.(game.value, active, data);
        }
    }

    const getTriggerElement = (element: HTMLElement): HTMLElement => {
        return element?.closest('[data-trigger]') as HTMLElement;
    }

    const getFeatureElement = (ev: MouseEvent) => {
        return (ev.target as HTMLElement).closest('feature');
    }
    
    const getFeature = (ev: MouseEvent): IFeature => {
        const featureElement = getFeatureElement(ev);
        const featureName = featureElement?.getAttribute('name');
        return featureName ? game.value.currentLocation.features.get(featureName) : null;
    }

    return {
        description,
        refreshFeatures,
        click,
        mouseOver,
        mouseOut
    }
}