import {addHtmlSpaces, compareString} from "storyScript/utilityFunctions.ts";
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

    watch(() => game.value.combinations.activeCombination?.selectedTool, (newValue) => {
        refreshFeatures();
    });

    const refreshFeatures = () => {
        // Show the text of added features.
        const featureArray = getFeatureArray();

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
            e.classList.remove('combine-active-selected', 'combine-selectable');
            
            if (game.value.combinations.activeCombination) {
                e.classList.add('combine-selectable');
            }
        });
    };

    const isFeatureNode = (ev: MouseEvent): boolean => {
        const nodeType = ev.target && (<any>ev.target).nodeName;
        return compareString(nodeType, 'feature');
    }

    const isTrigger = (element: HTMLElement): string => {
        return element?.dataset?.trigger;
    }
    
    const addCombineClass = (ev: MouseEvent, feature: IFeature) => {
        const className = combinationService.getCombineClass(feature);

        if (className) {
            (<any>ev.target).classList.add(className);
        }
    }

    const toggleTrigger = (element: HTMLElement, active: boolean) => {
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

    const click = (ev: PointerEvent) => {
        const element = ev?.target as HTMLElement;
        const trigger = isTrigger(element);
        
        if (trigger) {
            if (!touchDevice) {
                return;
            }
            
            const activate = !element.classList.contains(activeTriggerClass);
            
            Array.from(descriptionRef.value.querySelectorAll('[data-trigger]')).forEach((el) => {
                toggleTrigger(el as any, false);
            });
            
            toggleTrigger(element, activate);
            return;
        }
        
        if (isFeatureNode(ev)) {
            const feature = getFeature(ev);

            if (feature) {
                const result = game.value.combinations.tryCombine(feature);
                addCombineClass(ev, feature);

                if (result.success) {
                    refreshFeatures();
                }
            }
        }
    }

    const mouseOver = (ev: MouseEvent) => {
        if (touchDevice) {
            return;
        }
        
        const element = ev?.target as HTMLElement;
        const trigger = isTrigger(element);
        
        if (trigger) {
            toggleTrigger(element, true);
        }
        
        if (isFeatureNode(ev)) {
            const feature = getFeature(ev);
            
            // Todo: is this needed?
            addCombineClass(ev, feature);
        }
    };

    const mouseOut = (ev: MouseEvent) => {
        if (touchDevice) {
            return;
        }
        
        const element = ev?.target as HTMLElement;
        const trigger = isTrigger(element);

        if (trigger) {
            toggleTrigger(element, false);
        }
    };

    const getFeature = (ev: MouseEvent): IFeature => {
        const featureName = (<any>ev.target).getAttribute('name');
        return game.value.currentLocation.features.get(featureName);
    }

    const getFeatureArray = (): HTMLElement[] => {
        const features = description.value?.getElementsByTagName('feature');

        if (!features) {
            return [];
        }

        return Array.prototype.slice.call(features) as HTMLElement[];
    }

    return {
        description,
        refreshFeatures,
        click,
        mouseOver,
        mouseOut
    }
}